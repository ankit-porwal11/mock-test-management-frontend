import { HiMagnifyingGlass, HiXMark } from 'react-icons/hi2';
import { useState, useEffect } from 'react';

export default function SearchBar({
  placeholder = 'Search...',
  value = '',
  onChange,
  onClear,
  debounceMs = 400,
}) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localValue, debounceMs]);

  return (
    <div className="relative max-w-md w-full">
      <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-10 py-2.5 bg-white border-2 border-dark-200 rounded-xl text-sm text-dark-800 placeholder-dark-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all duration-200"
      />
      {localValue && (
        <button
          onClick={() => {
            setLocalValue('');
            onClear?.();
            onChange('');
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-dark-400 hover:text-dark-600 hover:bg-dark-100 transition-colors"
        >
          <HiXMark className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
