import Holidays from 'date-holidays';

export interface Holiday {
  name: string;
  date: string;
  emoji: string;
  category: string;
  type?: string;
}

export interface HolidayCategory {
  id: string;
  name: string;
  holidays: Holiday[];
}

export interface CountryOption {
  code: string;
  name: string;
}

export interface StateOption {
  code: string;
  name: string;
}

export interface RegionOption {
  code: string;
  name: string;
}

// Create a global holidays instance
let holidaysInstance: Holidays;

// Initialize the holidays library
const initHolidays = (): Holidays => {
  if (!holidaysInstance) {
    holidaysInstance = new Holidays();
  }
  return holidaysInstance;
};

// Get all available countries from the library
export const getAvailableCountries = (): CountryOption[] => {
  const hd = initHolidays();
  const countries = hd.getCountries();
  return Object.entries(countries).map(([code, name]) => ({
    code,
    name: name as string,
  }));
};

// Get states for a specific country
export const getAvailableStates = (countryCode: string): StateOption[] => {
  const hd = initHolidays();
  try {
    const states = hd.getStates(countryCode);
    if (!states) return [];
    return Object.entries(states).map(([code, name]) => ({
      code,
      name: name as string,
    }));
  } catch (error) {
    console.warn(`No states available for country: ${countryCode}`);
    return [];
  }
};

// Get regions for a specific country and state
export const getAvailableRegions = (
  countryCode: string,
  stateCode: string
): RegionOption[] => {
  const hd = initHolidays();
  try {
    const regions = hd.getRegions(countryCode, stateCode);
    if (!regions) return [];
    return Object.entries(regions).map(([code, name]) => ({
      code,
      name: name as string,
    }));
  } catch (error) {
    console.warn(
      `No regions available for country: ${countryCode}, state: ${stateCode}`
    );
    return [];
  }
};

// Default emoji mapping for holiday types and names
const getHolidayEmoji = (name: string, type: string): string => {
  const lowerName = name.toLowerCase();

  // Specific holiday name mappings
  if (lowerName.includes('new year')) return '🎊';
  if (lowerName.includes('christmas')) return '🎄';
  if (lowerName.includes('easter')) return '🐰';
  if (lowerName.includes('valentine')) return '💕';
  if (lowerName.includes('thanksgiving')) return '🦃';
  if (lowerName.includes('halloween')) return '🎃';
  if (lowerName.includes('independence') || lowerName.includes('national day'))
    return '🎆';
  if (lowerName.includes('labor') || lowerName.includes('labour')) return '👷';
  if (lowerName.includes('mother')) return '🌸';
  if (lowerName.includes('father')) return '👨';
  if (lowerName.includes('memorial') || lowerName.includes('remembrance'))
    return '🌺';
  if (lowerName.includes('martin luther king')) return '✊';
  if (lowerName.includes('president')) return '🇺🇸';
  if (lowerName.includes('good friday') || lowerName.includes('religious'))
    return '✝️';
  if (lowerName.includes('boxing')) return '🎁';
  if (lowerName.includes('mardi gras')) return '🎭';
  if (lowerName.includes('st. patrick') || lowerName.includes('saint patrick'))
    return '☘️';

  // Type-based mappings
  switch (type) {
    case 'public':
      return '🏛️';
    case 'bank':
      return '🏦';
    case 'school':
      return '🏫';
    case 'optional':
      return '📅';
    case 'observance':
      return '👀';
    default:
      return '📅';
  }
};

// Get holidays for a specific location and year
export const getHolidaysForLocation = (
  countryCode: string,
  stateCode?: string,
  regionCode?: string,
  year: number = new Date().getFullYear()
): Holiday[] => {
  try {
    let hd: any;
    if (regionCode && stateCode) {
      hd = new Holidays(countryCode, stateCode, regionCode);
    } else if (stateCode) {
      hd = new Holidays(countryCode, stateCode);
    } else {
      hd = new Holidays(countryCode);
    }

    const holidays = hd.getHolidays(year);

    const categoryId = [countryCode, stateCode, regionCode]
      .filter(Boolean)
      .join('-');

    return holidays.map((holiday: any) => ({
      name: holiday.name,
      date: holiday.date.substring(5, 10), // Extract MM-DD from YYYY-MM-DD
      emoji: getHolidayEmoji(holiday.name, holiday.type),
      category: categoryId,
      type: holiday.type,
    }));
  } catch (error) {
    console.error('Error fetching holidays:', error);
    return [];
  }
};

// Create holiday categories dynamically based on user selection
export const createDynamicHolidayCategory = (
  countryCode: string,
  stateCode?: string,
  regionCode?: string,
  year: number = new Date().getFullYear()
): HolidayCategory => {
  const holidays = getHolidaysForLocation(
    countryCode,
    stateCode,
    regionCode,
    year
  );
  const categoryId = [countryCode, stateCode, regionCode]
    .filter(Boolean)
    .join('-');

  // Get display names
  const countries = initHolidays().getCountries();
  let categoryName = countries[countryCode] || countryCode;

  if (stateCode) {
    try {
      const states = initHolidays().getStates(countryCode);
      if (states && states[stateCode]) {
        categoryName += ` - ${states[stateCode]}`;
      }
    } catch (e) {
      // Ignore error
    }
  }
  if (regionCode && stateCode) {
    try {
      const regions = initHolidays().getRegions(countryCode, stateCode);
      if (regions && regions[regionCode]) {
        categoryName += ` - ${regions[regionCode]}`;
      }
    } catch (e) {
      // Ignore error
    }
  }

  return {
    id: categoryId,
    name: categoryName,
    holidays,
  };
};

// Fallback to popular US holidays as default
const getDefaultHolidays = (): HolidayCategory => {
  return {
    id: 'us-popular',
    name: 'Popular U.S. Holidays',
    holidays: [
      {
        name: "New Year's Day",
        date: '01-01',
        emoji: '🎊',
        category: 'us-popular',
      },
      {
        name: "Valentine's Day",
        date: '02-14',
        emoji: '💕',
        category: 'us-popular',
      },
      {
        name: "St. Patrick's Day",
        date: '03-17',
        emoji: '☘️',
        category: 'us-popular',
      },
      {
        name: 'Easter Sunday',
        date: '04-21',
        emoji: '🐰',
        category: 'us-popular',
      },
      {
        name: "Mother's Day",
        date: '05-12',
        emoji: '🌸',
        category: 'us-popular',
      },
      {
        name: "Father's Day",
        date: '06-16',
        emoji: '👨',
        category: 'us-popular',
      },
      {
        name: 'Independence Day',
        date: '07-04',
        emoji: '🎆',
        category: 'us-popular',
      },
      { name: 'Halloween', date: '10-31', emoji: '🎃', category: 'us-popular' },
      {
        name: 'Thanksgiving',
        date: '11-28',
        emoji: '🦃',
        category: 'us-popular',
      },
      {
        name: 'Christmas Day',
        date: '12-25',
        emoji: '🎄',
        category: 'us-popular',
      },
    ],
  };
};

// Maintain backward compatibility with a default category
export const HOLIDAY_CATEGORIES = [getDefaultHolidays()];

export const getHolidaysByCategory = (categoryId: string): Holiday[] => {
  const category = HOLIDAY_CATEGORIES.find(
    (cat: HolidayCategory) => cat.id === categoryId
  );
  return category ? category.holidays : [];
};

export const getAllHolidays = (): Holiday[] => {
  return HOLIDAY_CATEGORIES.flatMap(
    (category: HolidayCategory) => category.holidays
  );
};

// Local storage keys
export const STORAGE_KEYS = {
  SELECTED_HOLIDAYS: 'weekly-calendar-selected-holidays',
  CUSTOM_EVENTS: 'weekly-calendar-custom-events',
  HOLIDAY_CATEGORIES: 'weekly-calendar-holiday-categories',
  SELECTED_CATEGORY: 'weekly-calendar-selected-category',
  SELECTED_COUNTRY: 'weekly-calendar-selected-country',
  SELECTED_STATE: 'weekly-calendar-selected-state',
  SELECTED_REGION: 'weekly-calendar-selected-region',
};

export interface LocationSelection {
  country?: string;
  state?: string;
  region?: string;
}

// Local storage functions
export const saveSelectedHolidays = (holidays: string[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(
      STORAGE_KEYS.SELECTED_HOLIDAYS,
      JSON.stringify(holidays)
    );
  }
};

export const loadSelectedHolidays = (): string[] => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEYS.SELECTED_HOLIDAYS);
    return saved ? JSON.parse(saved) : [];
  }
  return [];
};

export const saveCustomEvents = (events: any[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_EVENTS, JSON.stringify(events));
  }
};

export const loadCustomEvents = (): any[] => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_EVENTS);
    return saved ? JSON.parse(saved) : [];
  }
  return [];
};

export const saveSelectedCategory = (categoryId: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.SELECTED_CATEGORY, categoryId);
  }
};

export const loadSelectedCategory = (): string => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEYS.SELECTED_CATEGORY);
    return saved || 'us-popular'; // Default to us-popular if nothing saved
  }
  return 'us-popular';
};

export const saveLocationSelection = (location: LocationSelection) => {
  if (typeof window !== 'undefined') {
    if (location.country)
      localStorage.setItem(STORAGE_KEYS.SELECTED_COUNTRY, location.country);
    if (location.state)
      localStorage.setItem(STORAGE_KEYS.SELECTED_STATE, location.state);
    if (location.region)
      localStorage.setItem(STORAGE_KEYS.SELECTED_REGION, location.region);
  }
};

export const loadLocationSelection = (): LocationSelection => {
  if (typeof window !== 'undefined') {
    return {
      country: localStorage.getItem(STORAGE_KEYS.SELECTED_COUNTRY) || 'US',
      state: localStorage.getItem(STORAGE_KEYS.SELECTED_STATE) || '',
      region: localStorage.getItem(STORAGE_KEYS.SELECTED_REGION) || '',
    };
  }
  return { country: 'US', state: '', region: '' };
};
