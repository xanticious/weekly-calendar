# Family Weekly Calendar Generator

A beautiful, customizable weekly calendar generator perfect for families. Create printable 11"×17" calendars with holidays, birthdays, anniversaries, and special events.

## Features

✨ **Family-Friendly Design**

- Beautiful, clean layout with friendly fonts
- 7-column weekly format (Sunday-Saturday)
- Optimized for 11"×17" printing and wall hanging

📅 **Customizable Events**

- Pre-loaded holiday options (including Utah state holidays)
- Add custom birthdays, anniversaries, and special events
- Emoji support for visual appeal

🎨 **Professional Output**

- High-quality PDF generation
- Print-ready format with binding holes
- Black and white optimized (color support planned)

📝 **Writing Space**

- Plenty of blank lines for daily planning
- Clean, organized layout for easy writing
- Perfect for hanging on the wall with a pen nearby

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd family-weekly-calendar
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Enter Family Information**: Add your family name and select the calendar year
2. **Choose Holidays**: Select which holidays to include on your calendar
3. **Add Special Events**: Add birthdays, anniversaries, and other important dates
4. **Generate PDF**: Download your custom calendar as a print-ready PDF

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **PDF Generation**: jsPDF
- **Date Handling**: date-fns
- **Icons**: Lucide React

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   └── CalendarWizard.tsx # Main wizard component
├── lib/                   # Utility libraries
│   └── pdf-generator.ts   # PDF generation logic
├── requirements.md        # Project requirements
└── package.json          # Dependencies and scripts
```

## Customization

### Adding Holidays

Edit the `DEFAULT_HOLIDAYS` array in `components/CalendarWizard.tsx` to add or modify holidays.

### Modifying the PDF Layout

Update the `generateCalendarPDF` function in `lib/pdf-generator.ts` to customize:

- Page dimensions
- Font styles
- Layout spacing
- Line spacing for writing

### Styling Changes

Modify Tailwind classes in the components or update `app/globals.css` for global style changes.

## Building for Production

```bash
npm run build
npm start
```

## Future Enhancements

- [ ] Color printing option
- [ ] Multiple calendar layouts
- [ ] Cloud save/load functionality
- [ ] Calendar sharing features
- [ ] Mobile-responsive design improvements
- [ ] Custom quote management
- [ ] Weather integration
- [ ] Task management features

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by the need for beautiful, family-oriented planning tools
- Built with modern web technologies for ease of use and customization
- Designed with real families in mind
