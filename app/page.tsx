'use client';

import { useState, useEffect, useRef } from 'react';
import { Calendar, Download, Heart, Users } from 'lucide-react';
import CalendarWizard from '@/components/CalendarWizard';
import Logo from '@/components/Logo';
import PreviewDay from '@/components/PreviewDay';

export default function Home() {
  const [showWizard, setShowWizard] = useState(false);
  const previewScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Center the horizontal scroll position when component mounts
    if (previewScrollRef.current) {
      const container = previewScrollRef.current;
      const scrollLeft = (container.scrollWidth - container.clientWidth) / 2;
      container.scrollLeft = scrollLeft;
    }
  }, []);

  if (showWizard) {
    return (
      <div className="min-h-screen">
        {/* Header with Logo */}
        <div className="bg-white shadow-sm border-b border-purple-100 px-4 py-3">
          <div className="max-w-7xl mx-auto">
            <Logo onClick={() => setShowWizard(false)} />
          </div>
        </div>

        <CalendarWizard onBack={() => setShowWizard(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Calendar className="w-12 h-12 text-purple-600" />
            <h1 className="text-5xl font-chewy text-gray-800">
              Family Weekly Calendar
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create beautiful, printable weekly calendars perfect for your
            family. Customize with holidays, birthdays, and special occasions!
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 my-12">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100">
            <Users className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Family Friendly
            </h3>
            <p className="text-gray-600">
              Designed with families in mind. Add birthdays, anniversaries, and
              special events.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100">
            <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Easy to Use
            </h3>
            <p className="text-gray-600">
              Simple wizard guides you through creating your perfect calendar in
              minutes.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100">
            <Download className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Print Ready
            </h3>
            <p className="text-gray-600">
              High-quality PDF output optimized for 11"×17" printing and wall
              hanging.
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="space-y-4">
          <button
            onClick={() => setShowWizard(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Create Your Calendar
          </button>
          <p className="text-sm text-gray-500">
            Free to use • No signup required • Download instantly
          </p>
        </div>

        {/* Preview */}
        <div className="mt-12 p-8 bg-white rounded-xl shadow-xl border border-purple-100">
          {' '}
          <h3 className="text-2xl font-chewy text-gray-800 mb-4">
            Preview: What You'll Get (11" x 17" Ledger Size)
          </h3>
          <div className="bg-gray-100 p-4 rounded-lg border-2 border-dashed border-gray-300">
            {' '}
            {/* Scrollable container with fixed height */}
            <div
              ref={previewScrollRef}
              className="overflow-auto border border-gray-400 rounded"
              style={{ height: '500px', width: '100%' }}
            >
              {/* Actual 11" x 17" content (1056px x 1632px at 96 DPI) */}
              <div
                className="bg-white"
                style={{ width: '1632px', height: '1056px' }}
              >
                {/* Three-hole punch indicators */}
                <div className="flex justify-between items-center px-8 py-4">
                  <div className="w-8 h-8 bg-gray-200 rounded-full border-2 border-gray-400"></div>
                  <div className="w-8 h-8 bg-gray-200 rounded-full border-2 border-gray-400"></div>
                  <div className="w-8 h-8 bg-gray-200 rounded-full border-2 border-gray-400"></div>
                </div>
                {/* Calendar header */}
                <div className="text-center px-8 mb-6">
                  <div className="font-chewy text-3xl mb-2">
                    Your Family Calendar
                  </div>
                  <div className="font-chewy text-xl">
                    2025 - Week 24 (Jun. 15 - Jun. 21)
                  </div>
                </div>{' '}
                {/* Seven-column flex layout for days with vertical dividers */}
                <div
                  className="flex px-8 h-full pb-8"
                  style={{ height: 'calc(100% - 180px)' }}
                >
                  <div className="flex-1">
                    <PreviewDay
                      date={{ weekday: 'Sunday', month: 'Jun', day: '15' }}
                    />
                  </div>
                  <div className="w-px bg-gray-300 mx-1"></div>
                  <div className="flex-1">
                    <PreviewDay
                      date={{ weekday: 'Monday', month: 'Jun', day: '16' }}
                    />
                  </div>
                  <div className="w-px bg-gray-300 mx-1"></div>
                  <div className="flex-1">
                    <PreviewDay
                      date={{ weekday: 'Tuesday', month: 'Jun', day: '17' }}
                    />
                  </div>
                  <div className="w-px bg-gray-300 mx-1"></div>
                  <div className="flex-1">
                    <PreviewDay
                      date={{ weekday: 'Wednesday', month: 'Jun', day: '18' }}
                    />
                  </div>
                  <div className="w-px bg-gray-300 mx-1"></div>
                  <div className="flex-1">
                    <PreviewDay
                      date={{
                        weekday: 'Thursday',
                        month: 'Jun',
                        day: '19',
                      }}
                      text="Jim's Birthday!"
                    />
                  </div>
                  <div className="w-px bg-gray-300 mx-1"></div>
                  <div className="flex-1">
                    <PreviewDay
                      date={{ weekday: 'Friday', month: 'Jun', day: '20' }}
                      text="Summer Solstice"
                    />
                  </div>
                  <div className="w-px bg-gray-300 mx-1"></div>
                  <div className="flex-1">
                    <PreviewDay
                      date={{ weekday: 'Saturday', month: 'Jun', day: '21' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
