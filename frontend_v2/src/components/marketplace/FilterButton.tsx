import { useState, useRef, useEffect } from 'react'
import arrowdownIcon from '../../assets/arrowdown.svg'

interface FilterButtonProps {
  label: string
  options: string[]
  onSelect?: (option: string) => void
}

export default function FilterButton({ label, options, onSelect }: FilterButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (option: string) => {
    if (onSelect) {
      onSelect(option)
    }
    setIsOpen(false)
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer group flex h-9 items-center gap-2 rounded-full border border-gray-600 bg-gray-800 pl-4 pr-3 transition-colors hover:border-[#1ABCF7]"
      >
        <span className="text-sm font-medium text-white">{label}</span>
        <img src={arrowdownIcon} alt="dropdown" className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 rounded-lg border border-gray-600 bg-gray-800 shadow-lg z-50">
          <div className="py-2">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelect(option)}
                className="w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-700 transition-colors"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
