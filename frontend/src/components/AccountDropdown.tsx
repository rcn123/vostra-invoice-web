import { AISuggestion } from '../data/mockInvoices';
import { useState, useRef, useEffect } from 'react';

interface AccountDropdownProps {
  suggestions: AISuggestion[];
  selectedAccount: string;
  onChange: (account: string) => void;
}

export default function AccountDropdown({ suggestions, selectedAccount, onChange }: AccountDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getConfidenceBarColor = (confidence: number) => {
    if (confidence >= 0.9) return 'bg-green-200';
    if (confidence >= 0.7) return 'bg-yellow-200';
    return 'bg-gray-200';
  };

  const selectedSuggestion = suggestions.find(s => s.account_number === selectedAccount) || suggestions[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full min-w-[280px] text-left text-sm border border-gray-300 rounded-md px-3 py-2 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer flex items-center justify-between"
      >
        <span>{selectedSuggestion.account_number} – {selectedSuggestion.account_name}</span>
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 20 20">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 8l4 4 4-4" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.account_number}
              type="button"
              onClick={() => {
                onChange(suggestion.account_number);
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none relative"
            >
              {/* Subtle progress bar background */}
              <div
                className={`absolute left-0 top-0 bottom-0 ${getConfidenceBarColor(suggestion.confidence)} opacity-30`}
                style={{ width: `${suggestion.confidence * 100}%` }}
              />

              {/* Content */}
              <div className="relative flex items-center justify-between text-sm">
                <span className="font-medium">
                  {suggestion.account_number} – {suggestion.account_name}
                </span>
                <span className="text-gray-600 ml-4">
                  {Math.round(suggestion.confidence * 100)} %
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
