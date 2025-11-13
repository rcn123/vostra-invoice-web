import { AISuggestion } from '../data/mockInvoices';

interface AccountDropdownProps {
  suggestions: AISuggestion[];
  selectedAccount: string;
  onChange: (account: string) => void;
}

export default function AccountDropdown({ suggestions, selectedAccount, onChange }: AccountDropdownProps) {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'bg-green-50 hover:bg-green-100';
    if (confidence >= 0.7) return 'bg-yellow-50 hover:bg-yellow-100';
    return 'bg-gray-50 hover:bg-gray-100';
  };

  const getConfidenceBarColor = (confidence: number) => {
    if (confidence >= 0.9) return 'bg-green-500';
    if (confidence >= 0.7) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  return (
    <select
      value={selectedAccount}
      onChange={(e) => onChange(e.target.value)}
      className="text-sm border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer min-w-[280px]"
      style={{
        background: 'white',
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
        backgroundPosition: 'right 0.5rem center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '1.5em 1.5em',
        paddingRight: '2.5rem'
      }}
    >
      {suggestions.map((suggestion) => (
        <option
          key={suggestion.account_number}
          value={suggestion.account_number}
          className={getConfidenceColor(suggestion.confidence)}
        >
          {suggestion.account_number} - {suggestion.account_name} ({Math.round(suggestion.confidence * 100)}%)
        </option>
      ))}
    </select>
  );
}
