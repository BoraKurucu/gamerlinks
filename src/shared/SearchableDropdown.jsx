import { useState, useEffect, useRef } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

export default function SearchableDropdown({ 
  options, 
  value, 
  onChange, 
  placeholder = 'Select...',
  className = '',
  required = false,
  labelKey = 'label',
  valueKey = 'value'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef(null);

  // Filter options based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = options.filter(option => {
        const label = option[labelKey] || '';
        return label.toLowerCase().includes(searchTerm.toLowerCase());
      });
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options);
    }
  }, [searchTerm, options, labelKey]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const selectedOption = options.find(opt => {
    const key = valueKey || 'value';
    return opt[key] === value;
  });

  const handleSelect = (option) => {
    const key = valueKey || 'value';
    onChange(option[key]);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full rounded-md bg-black/30 border border-white/10 px-3 py-2 text-white min-h-[44px] text-sm sm:text-base flex items-center justify-between ${
          isOpen ? 'border-white/30' : ''
        }`}
        required={required}
      >
        <span className={selectedOption ? '' : 'text-white/50'}>
          {selectedOption ? selectedOption[labelKey] : placeholder}
        </span>
        {isOpen ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-bg-darker border border-white/10 rounded-md shadow-lg max-h-60 overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b border-white/10">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-md bg-black/30 border border-white/10 px-3 py-2 text-white text-sm focus:outline-none focus:border-theme-primary"
              autoFocus
            />
          </div>

          {/* Options list */}
          <div className="overflow-y-auto max-h-48">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const key = valueKey || 'value';
                const isSelected = option[key] === value;
                const Icon = option.icon;
                return (
                  <button
                    key={option[key]}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-white/10 transition-colors flex items-center gap-2 ${
                      isSelected ? 'bg-theme-primary/20 text-theme-primary' : 'text-white'
                    }`}
                  >
                    {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
                    <span>{option[labelKey]}</span>
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-2 text-white/50 text-sm text-center">
                No platforms found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

