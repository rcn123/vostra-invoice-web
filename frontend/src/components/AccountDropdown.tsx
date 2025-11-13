import { AISuggestion } from '../data/mockInvoices';

interface AccountDropdownProps {
  suggestions: AISuggestion[];
  selectedAccount: string;
  onChange: (account: string) => void;
}

export default function AccountDropdown({ suggestions, selectedAccount, onChange }: AccountDropdownProps) {
  const selectedSuggestion = suggestions.find(s => s.account_number === selectedAccount) || suggestions[0];

  return (
    <select
      value={selectedAccount}
      onChange={(e) => onChange(e.target.value)}
      className="w-full min-w-[280px] text-sm border border-gray-300 rounded-md px-3 py-2 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
    >
      {suggestions.map((suggestion) => (
        <option key={suggestion.account_number} value={suggestion.account_number}>
          {suggestion.account_number} – {suggestion.account_name} ({Math.round(suggestion.confidence * 100)} %)
        </option>
      ))}
    </select>
  );
}
