import { useState, useRef, useEffect } from 'react'
import arrowdownIcon from '../../assets/arrowdown.svg'

interface RangeFilterButtonProps {
  label: string
  min: number
  max: number
  onSelect?: (value: number) => void
}

export default function RangeFilterButton({ label, min, max, onSelect }: RangeFilterButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [value, setValue] = useState(5)
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

  const handleApply = () => {
    if (onSelect) {
      onSelect(value)
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
        <div className="absolute top-full left-0 mt-2 w-64 rounded-lg border border-gray-600 bg-gray-800 shadow-lg z-50 p-4">
          <div className="mb-3">
            <label className="text-sm text-white font-medium mb-2 block">
              수익률: {value}%
            </label>
            <input
              type="range"
              min={min}
              max={max}
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#1ABCF7]"
              style={{
                background: `linear-gradient(to right, #1ABCF7 0%, #1ABCF7 ${value}%, #374151 ${value}%, #374151 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{min}%</span>
              <span>{max}%</span>
            </div>
          </div>
          <button
            onClick={handleApply}
            className="w-full py-2 bg-[#1ABCF7] text-black font-bold rounded-lg hover:bg-[#15a8dc] transition-colors"
          >
            적용
          </button>
        </div>
      )}
    </div>
  )
}
