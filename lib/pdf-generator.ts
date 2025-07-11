import jsPDF from 'jspdf';
import {
  format,
  startOfWeek,
  addDays,
  getWeek,
  addWeeks,
  startOfYear,
} from 'date-fns';
import { CHEWY_FONT_BASE64, FONT_CONFIG, hasFontsLoaded } from './font-data';

interface Holiday {
  name: string;
  date: string;
  year: number;
  category: string;
}

interface CustomEvent {
  name: string;
  date: string;
  isRecurring: boolean;
  year?: number;
}

interface CalendarOptions {
  year?: number;
  startDate?: Date;
  endDate?: Date;
  calendarHeader: string;
  holidays: Holiday[];
  customEvents: CustomEvent[];
}

// Function to ensure emoji compatibility in PDF
const processEmojiForPDF = (text: string): string => {
  // With Noto Emoji font, emojis should render properly
  // Keep the original text with emojis
  return text;
};

// Function to wrap text to fit within specified width
const wrapText = (
  text: string,
  maxWidth: number,
  fontSize: number
): string[] => {
  // Simple text wrapping - split on spaces and estimate character width
  const avgCharWidth = fontSize * 0.6; // Rough estimate for character width
  const maxCharsPerLine = Math.floor(maxWidth / avgCharWidth);

  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (testLine.length <= maxCharsPerLine) {
      currentLine = testLine;
    } else {
      if (currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        // Word is longer than line, just add it
        lines.push(word);
      }
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
};

export const generateCalendarPDF = async (
  options: CalendarOptions
): Promise<void> => {
  const { year, startDate, endDate, calendarHeader, holidays, customEvents } =
    options;
  // Create new PDF document (11x17 landscape)
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'in',
    format: [11, 17],
    putOnlyUsedFonts: true,
    compress: true,
  }); // Configure font for text (Chewy-style)
  const configureFonts = (pdf: jsPDF) => {
    try {
      if (hasFontsLoaded() && CHEWY_FONT_BASE64) {
        // Add and use Chewy font if available
        pdf.addFileToVFS('Chewy-Regular.ttf', CHEWY_FONT_BASE64);
        pdf.addFont(
          'Chewy-Regular.ttf',
          FONT_CONFIG.primary.name,
          FONT_CONFIG.primary.style
        );
        pdf.setFont(FONT_CONFIG.primary.name, FONT_CONFIG.primary.style);
      } else {
        // Use fallback font
        pdf.setFont(FONT_CONFIG.primary.fallback, 'normal');
      }
    } catch (error) {
      console.error('Failed to set text font:', error);
      pdf.setFont('helvetica', 'normal');
    }
  };

  // Calculate date range
  let calendarStartDate: Date;
  let calendarEndDate: Date;

  if (startDate && endDate) {
    calendarStartDate = startOfWeek(startDate, { weekStartsOn: 0 });
    calendarEndDate = endDate;
  } else if (year) {
    calendarStartDate = startOfWeek(startOfYear(new Date(year, 0, 1)), {
      weekStartsOn: 0,
    });
    calendarEndDate = new Date(year, 11, 31);
  } else {
    throw new Error('Either year or startDate/endDate must be provided');
  }

  // Calculate number of weeks
  const totalWeeks = Math.ceil(
    (calendarEndDate.getTime() - calendarStartDate.getTime()) /
      (7 * 24 * 60 * 60 * 1000)
  );

  // Generate weeks
  for (let weekIndex = 0; weekIndex < totalWeeks; weekIndex++) {
    if (weekIndex > 0) {
      pdf.addPage();
    }

    const weekStart = addWeeks(calendarStartDate, weekIndex);
    const weekEnd = addDays(weekStart, 6); // Skip if week is beyond our end date
    if (weekStart > calendarEndDate) break;

    const weekDates = Array.from({ length: 7 }, (_, i) =>
      addDays(weekStart, i)
    );

    // Add calendar header at the top in large Chewy font
    configureFonts(pdf);
    pdf.setFontSize(24);
    pdf.text(calendarHeader, 8.5, 0.8, { align: 'center' });

    // Header with abbreviated month names
    const weekStartFormatted = format(weekStart, 'MMM. d');
    const weekEndFormatted = format(weekEnd, 'MMM. d');
    const headerYear = year || weekStart.getFullYear();
    // Calculate week number from the start of the year
    const yearStart = startOfYear(new Date(headerYear, 0, 1));
    const yearStartWeek = startOfWeek(yearStart, { weekStartsOn: 0 });
    const weekNumber =
      Math.floor(
        (weekStart.getTime() - yearStartWeek.getTime()) /
          (7 * 24 * 60 * 60 * 1000)
      ) + 1;
    // Use Chewy font for the calendar subtitle
    configureFonts(pdf);
    pdf.setFontSize(16);
    pdf.text(
      `${headerYear} - Week ${weekNumber} (${weekStartFormatted} - ${weekEndFormatted})`,
      8.5,
      1.5,
      { align: 'center' }
    );

    // No quote section - removed as per requirements

    // Day columns
    const columnWidth = 2.2; // inches
    const startX = 0.5;
    const startY = 2.5;
    const columnHeight = 7.5;
    weekDates.forEach((date, dayIndex) => {
      const x = startX + dayIndex * columnWidth;

      // Day header - format with abbreviated month
      configureFonts(pdf);
      pdf.setFontSize(14);
      const dayName = format(date, 'EEEE');
      const dayWithMonth = format(date, 'MMM d');

      pdf.text(`${dayName} - ${dayWithMonth}`, x + columnWidth / 2, startY, {
        align: 'center',
      });

      // Check for special events
      const dateStr = format(date, 'MM-dd');
      const currentYear = date.getFullYear();
      const eventsForDay: string[] = [];

      // Check holidays first (they appear first in the list)
      const holidaysForDay = holidays.filter((h) => 
        h.date === dateStr && h.year === currentYear
      );
      holidaysForDay.forEach((holiday) => {
        eventsForDay.push(holiday.name + '!');
      });

      // Check custom events (they appear after holidays)
      const customEventsForDay = customEvents.filter((e) => {
        if (e.isRecurring) {
          // For recurring events, only match by date
          return e.date === dateStr;
        } else {
          // For non-recurring events, match by date and year
          return e.date === dateStr && e.year === currentYear;
        }
      });
      customEventsForDay.forEach((customEvent) => {
        eventsForDay.push(customEvent.name);
      });

      if (eventsForDay.length > 0) {
        pdf.setFontSize(14);
        const textX = x + 0.1; // Left-aligned within the column

        // Draw each event on a separate line
        configureFonts(pdf);
        eventsForDay.forEach((eventName, eventIndex) => {
          const eventY = startY + 0.8 + eventIndex * 0.3; // Stack events vertically
          pdf.text(eventName, textX, eventY, {
            align: 'left',
          });
        });
      }

      // Draw light gray vertical lines to separate columns (instead of borders)
      if (dayIndex > 0) {
        pdf.setDrawColor(220, 220, 220); // Light gray
        pdf.setLineWidth(0.01);
        pdf.line(x, startY - 0.2, x, startY + columnHeight - 0.2);
      }

      // Draw dark lines for writing
      pdf.setDrawColor(100, 100, 100); // Dark gray for writing lines
      pdf.setLineWidth(0.01);
      for (let line = 1; line <= 24; line++) {
        const lineY = startY + 0.5 + line * 0.3;
        if (lineY < startY + columnHeight - 0.2) {
          pdf.line(x + 0.1, lineY, x + columnWidth - 0.2, lineY);
        }
      }
    });

    // Add holes for binding (lower and light gray)
    pdf.setFillColor(240, 240, 240); // Light gray
    pdf.setDrawColor(200, 200, 200); // Light gray outline
    pdf.setLineWidth(0.01); // Three holes across the top, positioned lower
    const holeY = 0.4; // Moved down from 0.2
    const holePositions = [2, 8.5, 15];
    holePositions.forEach((x) => {
      pdf.circle(x, holeY, 0.1, 'FD'); // Fill and Draw
    });
  }

  // Download the PDF
  const filename =
    startDate && endDate
      ? `${calendarHeader.replace(/\s+/g, '-')}-Calendar-${format(
          startDate,
          'yyyy-MM-dd'
        )}-to-${format(endDate, 'yyyy-MM-dd')}.pdf`
      : `${calendarHeader.replace(/\s+/g, '-')}-Calendar-${
          year || new Date().getFullYear()
        }.pdf`;
  pdf.save(filename);
};

// Font loading utilities - simplified approach
const loadGoogleFont = async (
  fontName: string,
  fontWeight: string = 'normal'
): Promise<string> => {
  try {
    // In a real implementation, you would:
    // 1. Pre-download font files and serve them from your domain
    // 2. Convert them to base64 strings and embed them here
    // 3. Use a font loading service

    // For now, we'll return empty string to use fallback fonts
    console.warn(`Custom font ${fontName} not available. Using fallback font.`);
    return '';
  } catch (error) {
    console.error(`Failed to load font ${fontName}:`, error);
    return '';
  }
};

// Load fonts asynchronously
const loadFonts = async (): Promise<void> => {
  try {
    // Font loading is now handled by the font-data module
    // Fonts will be embedded if available, otherwise fallback fonts are used
    console.log('Font system initialized');
  } catch (error) {
    console.error('Failed to initialize font system:', error);
  }
};

// Initialize fonts on module load
loadFonts();

// Sample data for testing
export const sampleCalendarData: CalendarOptions = {
  year: 2025,
  calendarHeader: 'Smith Family',
  holidays: [
    {
      name: "New Year's Day",
      date: '01-01',
      year: 2025,
      category: 'us-federal',
    },
    { name: '4th of July', date: '07-04', year: 2025, category: 'us-federal' },
    { name: 'Christmas', date: '12-25', year: 2025, category: 'us-federal' },
  ],
  customEvents: [
    { name: "Elvis' Birthday", date: '01-08', isRecurring: true },
    { name: 'Anniversary', date: '09-20', isRecurring: true },
  ],
};
