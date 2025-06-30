'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface EmojiPickerProps {
  value: string;
  onChange: (emoji: string) => void;
  className?: string;
}

const RELEVANT_EMOJIS = [
  '🎉',
  '🎂',
  '🎈',
  '🎁',
  '💕',
  '❤️',
  '💖',
  '💝',
  '🌹',
  '💐',
  '🎊',
  '🥳',
  '🎯',
  '🏆',
  '⭐',
  '🌟',
  '✨',
  '💫',
  '🌈',
  '🦄',
  '🎵',
  '🎶',
  '🎭',
  '🎨',
  '🖼️',
  '📚',
  '✏️',
  '📝',
  '📖',
  '🔖',
  '🏠',
  '🏡',
  '🏰',
  '🏛️',
  '⛪',
  '🌳',
  '🌲',
  '🌺',
  '🌻',
  '🌷',
  '☀️',
  '🌙',
  '⭐',
  '🌟',
  '❄️',
  '🌊',
  '🏖️',
  '🏔️',
  '🗻',
  '🌋',
  '🚗',
  '✈️',
  '🚢',
  '🎢',
  '🎡',
  '🎠',
  '🎪',
  '🎫',
  '🎬',
  '📺',
  '📱',
  '💻',
  '🎮',
  '🕹️',
  '🎲',
  '🧩',
  '🃏',
  '🎯',
  '🏀',
  '⚽',
  '🏈',
  '⚾',
  '🎾',
  '🏐',
  '🏓',
  '🏸',
  '🥊',
  '🏊',
  '🚴',
  '🏃',
  '👶',
  '👧',
  '👦',
  '👨',
  '👩',
  '👴',
  '👵',
  '👪',
  '👨‍👩‍👧‍👦',
  '👨‍👩‍👧',
  '🍎',
  '🍕',
  '🎂',
  '🧁',
  '🍪',
  '🍫',
  '🍬',
  '🍭',
  '🍯',
  '🎃',
];

export default function EmojiPicker({
  value,
  onChange,
  className = '',
}: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleEmojiSelect = (emoji: string) => {
    onChange(emoji);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent flex items-center justify-between bg-white"
      >
        <span className="text-lg">{value || '🎉'}</span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />{' '}
          {/* Dropdown */}
          <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto min-w-80">
            <div className="grid grid-cols-8 gap-2 p-3">
              {RELEVANT_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleEmojiSelect(emoji)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded text-xl transition-colors"
                  title={emoji}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
