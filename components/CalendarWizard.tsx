'use client';

import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Download,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import {
  format,
  startOfYear,
  endOfYear,
  addWeeks,
  startOfWeek,
} from 'date-fns';
import EmojiPicker from './EmojiPicker';
import {
  HOLIDAY_CATEGORIES,
  Holiday,
  HolidayCategory,
  CountryOption,
  StateOption,
  RegionOption,
  LocationSelection,
  getHolidaysForLocation,
  createDynamicHolidayCategory,
  getAvailableCountries,
  getAvailableStates,
  getAvailableRegions,
  saveSelectedHolidays,
  loadSelectedHolidays,
  saveCustomEvents,
  loadCustomEvents,
  saveLocationSelection,
  loadLocationSelection,
} from '@/lib/holiday-data';

interface CustomEvent {
  name: string;
  date: string;
  emoji: string;
}

interface CalendarWizardProps {
  onBack: () => void;
}

export default function CalendarWizard({ onBack }: CalendarWizardProps) {
  const [step, setStep] = useState(1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [useCustomRange, setUseCustomRange] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [calendarHeader, setCalendarHeader] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [selectedState, setSelectedState] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedHolidays, setSelectedHolidays] = useState<string[]>([]);
  const [customEvents, setCustomEvents] = useState<CustomEvent[]>([]);
  const [availableCountries, setAvailableCountries] = useState<CountryOption[]>(
    []
  );
  const [availableStates, setAvailableStates] = useState<StateOption[]>([]);
  const [availableRegions, setAvailableRegions] = useState<RegionOption[]>([]);
  const [currentHolidays, setCurrentHolidays] = useState<Holiday[]>([]); // Load data from localStorage on component mount
  useEffect(() => {
    const savedHolidays = loadSelectedHolidays();
    const savedEvents = loadCustomEvents();
    const savedLocation = loadLocationSelection();

    // Load available countries
    setAvailableCountries(getAvailableCountries());

    // Set the saved location
    setSelectedCountry(savedLocation.country || 'US');
    setSelectedState(savedLocation.state || '');
    setSelectedRegion(savedLocation.region || '');

    if (savedHolidays.length > 0) {
      setSelectedHolidays(savedHolidays);
    } else {
      // Set some default popular holidays
      setSelectedHolidays([
        "New Year's Day",
        "Valentine's Day",
        'Independence Day',
        'Halloween',
        'Thanksgiving',
        'Christmas Day',
      ]);
    }

    if (savedEvents.length > 0) {
      setCustomEvents(savedEvents);
    }
  }, []);
  // Save to localStorage when selectedHolidays change
  useEffect(() => {
    saveSelectedHolidays(selectedHolidays);
  }, [selectedHolidays]);

  // Save location selection and update available states when country changes
  useEffect(() => {
    if (selectedCountry) {
      const states = getAvailableStates(selectedCountry);
      setAvailableStates(states);

      // Reset state and region if country changes
      if (states.length === 0) {
        setSelectedState('');
        setSelectedRegion('');
      }

      saveLocationSelection({
        country: selectedCountry,
        state: selectedState,
        region: selectedRegion,
      });

      // Update holidays for the new location
      updateCurrentHolidays();
    }
  }, [selectedCountry]);

  // Update available regions when state changes
  useEffect(() => {
    if (selectedCountry && selectedState) {
      const regions = getAvailableRegions(selectedCountry, selectedState);
      setAvailableRegions(regions);

      // Reset region if state changes and no regions available
      if (regions.length === 0) {
        setSelectedRegion('');
      }

      saveLocationSelection({
        country: selectedCountry,
        state: selectedState,
        region: selectedRegion,
      });

      // Update holidays for the new location
      updateCurrentHolidays();
    } else if (selectedCountry) {
      setAvailableRegions([]);
      setSelectedRegion('');
      updateCurrentHolidays();
    }
  }, [selectedState]);

  // Update holidays when region changes
  useEffect(() => {
    if (selectedCountry) {
      saveLocationSelection({
        country: selectedCountry,
        state: selectedState,
        region: selectedRegion,
      });
      updateCurrentHolidays();
    }
  }, [selectedRegion]);

  // Save to localStorage when customEvents change
  useEffect(() => {
    saveCustomEvents(customEvents);
  }, [customEvents]);

  const updateCurrentHolidays = () => {
    const holidays = getHolidaysForLocation(
      selectedCountry,
      selectedState || undefined,
      selectedRegion || undefined,
      year
    );
    setCurrentHolidays(holidays);
  };

  const toggleHoliday = (holidayName: string) => {
    setSelectedHolidays((prev) =>
      prev.includes(holidayName)
        ? prev.filter((name) => name !== holidayName)
        : [...prev, holidayName]
    );
  };

  const removeSelectedHoliday = (holidayName: string) => {
    setSelectedHolidays((prev) => prev.filter((name) => name !== holidayName));
  };
  const getCurrentCategoryHolidays = (): Holiday[] => {
    return currentHolidays;
  };

  const getSelectedHolidayObjects = (): Holiday[] => {
    return selectedHolidays
      .map((name) => currentHolidays.find((h) => h.name === name))
      .filter(Boolean) as Holiday[];
  };

  const addCustomEvent = () => {
    setCustomEvents((prev) => [...prev, { name: '', date: '', emoji: '🎉' }]);
  };

  const updateCustomEvent = (
    index: number,
    field: keyof CustomEvent,
    value: string
  ) => {
    setCustomEvents((prev) =>
      prev.map((event, i) =>
        i === index ? { ...event, [field]: value } : event
      )
    );
  };

  const removeCustomEvent = (index: number) => {
    setCustomEvents((prev) => prev.filter((_, i) => i !== index));
  };
  const generateCalendar = async () => {
    try {
      // Import the PDF generator dynamically to avoid SSR issues
      const { generateCalendarPDF } = await import('@/lib/pdf-generator');
      const options: any = {
        calendarHeader: calendarHeader || 'Family',
        holidays: getSelectedHolidayObjects(),
        customEvents: customEvents.filter((e) => e.name && e.date),
      };

      if (useCustomRange && startDate && endDate) {
        options.startDate = new Date(startDate);
        options.endDate = new Date(endDate);
      } else {
        options.year = year;
      }

      await generateCalendarPDF(options);
    } catch (error) {
      console.error('Failed to generate calendar PDF:', error);
      alert('Failed to generate calendar. Please try again.');
    }
  };
  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-chewy text-gray-800">
          Let's Get Started!
        </h2>
        <p className="text-gray-600">First, tell us about your calendar</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Calendar Title (what do you want at the top of each page?)
          </label>{' '}
          <input
            type="text"
            value={calendarHeader}
            onChange={(e) => setCalendarHeader(e.target.value)}
            placeholder="Smith Family"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="dateRange"
                checked={!useCustomRange}
                onChange={() => setUseCustomRange(false)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Full Year
              </span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="dateRange"
                checked={useCustomRange}
                onChange={() => setUseCustomRange(true)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Custom Date Range
              </span>
            </label>
          </div>

          {!useCustomRange ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calendar Year
              </label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                min="2020"
                max="2030"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-chewy text-gray-800">
          Choose Your Holidays
        </h2>
        <p className="text-gray-600">
          Select which holidays to include on your calendar
        </p>
      </div>{' '}
      {/* Selected holidays pills */}
      {selectedHolidays.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">
            Selected Holidays:
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedHolidays.map((holidayName) => {
              const holiday = currentHolidays.find(
                (h) => h.name === holidayName
              );
              return holiday ? (
                <span
                  key={holidayName}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                >
                  {holiday.emoji} {holiday.name}
                  <button
                    onClick={() => removeSelectedHoliday(holidayName)}
                    className="ml-1 hover:bg-purple-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}
      {/* Location selectors */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Country selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country
          </label>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {availableCountries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        {/* State selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State/Province {availableStates.length === 0 && '(None available)'}
          </label>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            disabled={availableStates.length === 0}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Select a state/province</option>
            {availableStates.map((state) => (
              <option key={state.code} value={state.code}>
                {state.name}
              </option>
            ))}
          </select>
        </div>

        {/* Region selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Region {availableRegions.length === 0 && '(None available)'}
          </label>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            disabled={availableRegions.length === 0}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Select a region</option>
            {availableRegions.map((region) => (
              <option key={region.code} value={region.code}>
                {region.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Holiday list for selected category */}
      <div className="grid md:grid-cols-2 gap-4">
        {getCurrentCategoryHolidays().map((holiday, index) => {
          const isSelected = selectedHolidays.includes(holiday.name);
          return (
            <div
              key={index}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                isSelected
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-300 bg-gray-50 hover:border-purple-300'
              }`}
              onClick={() => toggleHoliday(holiday.name)}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{holiday.emoji}</span>
                <div>
                  <div className="font-medium text-gray-800">
                    {holiday.name}
                  </div>
                  <div className="text-sm text-gray-500">{holiday.date}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-chewy text-gray-800">
          Add Your Special Days
        </h2>
        <p className="text-gray-600">
          Birthdays, anniversaries, and other important dates
        </p>
      </div>

      <div className="space-y-4">
        {customEvents.map((event, index) => (
          <div
            key={index}
            className="p-4 border border-gray-300 rounded-lg bg-white"
          >
            {' '}
            <div className="grid grid-cols-12 gap-3 items-end">
              <div className="col-span-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Name
                </label>
                <input
                  type="text"
                  value={event.name}
                  onChange={(e) =>
                    updateCustomEvent(index, 'name', e.target.value)
                  }
                  placeholder="Mom's Birthday"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date (MM-DD)
                </label>
                <input
                  type="text"
                  value={event.date}
                  onChange={(e) =>
                    updateCustomEvent(index, 'date', e.target.value)
                  }
                  placeholder="03-15"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emoji
                </label>
                <EmojiPicker
                  value={event.emoji}
                  onChange={(emoji) => updateCustomEvent(index, 'emoji', emoji)}
                />
              </div>
              <div className="col-span-1">
                <button
                  onClick={() => removeCustomEvent(index)}
                  className="p-2 text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addCustomEvent}
          className="w-full p-4 border-2 border-dashed border-purple-300 rounded-lg text-purple-600 hover:border-purple-500 hover:text-purple-800 transition-colors flex items-center justify-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Special Day</span>
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-chewy text-gray-800">All Set!</h2>
        <p className="text-gray-600">
          Review your settings and generate your calendar
        </p>
      </div>{' '}
      <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
        <div>
          <h3 className="font-semibold text-gray-800">Calendar Details</h3>
          <p className="text-gray-600">
            <strong>Title:</strong> {calendarHeader || 'Family Weekly Calendar'}
            <br />
            {useCustomRange ? (
              <>
                <strong>Date Range:</strong> {startDate} to {endDate}
                <br />
                <strong>Pages:</strong>{' '}
                {Math.ceil(
                  (new Date(endDate).getTime() -
                    new Date(startDate).getTime()) /
                    (7 * 24 * 60 * 60 * 1000)
                )}{' '}
                weeks
              </>
            ) : (
              <>
                <strong>Year:</strong> {year}
                <br />
                <strong>Pages:</strong> 52 weeks
              </>
            )}
          </p>
        </div>{' '}
        <div>
          <h3 className="font-semibold text-gray-800">Holidays Included</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {getSelectedHolidayObjects().map((holiday, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
              >
                {holiday.emoji} {holiday.name}
              </span>
            ))}
          </div>
        </div>
        {customEvents.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-800">Special Days</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {customEvents
                .filter((e) => e.name && e.date)
                .map((event, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {event.emoji} {event.name}
                  </span>
                ))}
            </div>
          </div>
        )}
      </div>
      <button
        onClick={generateCalendar}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
      >
        <Download className="w-5 h-5" />
        <span>Generate & Download Calendar PDF</span>
      </button>
    </div>
  );
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl mx-auto w-full">
        {/* Progress Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={step === 1 ? onBack : () => setStep(step - 1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <div className="flex items-center space-x-2">
            <Calendar className="w-6 h-6 text-purple-600" />
            <span className="font-chewy text-xl text-gray-800">
              Calendar Wizard
            </span>
          </div>

          <div className="text-sm text-gray-500">Step {step} of 4</div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-purple-100">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()} {/* Navigation */}
          {step < 4 && (
            <div className="flex justify-end mt-8">
              <button
                onClick={() => setStep(step + 1)}
                disabled={
                  step === 1 && useCustomRange && (!startDate || !endDate)
                }
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center space-x-2"
              >
                <span>Next</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
