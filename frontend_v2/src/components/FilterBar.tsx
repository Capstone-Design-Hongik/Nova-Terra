import { useState, useRef, useEffect } from 'react'
import FilterButton from './FilterButton'
import RangeFilterButton from './RangeFilterButton'
import sortingIcon from '../assets/sorting.svg'

export default function FilterBar() {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [selectedYield, setSelectedYield] = useState<number | null>(null)
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null)
  const [selectedSort, setSelectedSort] = useState('연 수익률 (높은 순)')
  const [isSortChanged, setIsSortChanged] = useState(false)
  const [isSortOpen, setIsSortOpen] = useState(false)
  const sortRef = useRef<HTMLDivElement>(null)

  const locationOptions = ['서울', '부산', '인천', '대전', '광주']
  const assetOptions = ['상업용', '주거용', '산업용', '상가', '숙박시설']
  const sortOptions = [
    '연 수익률 (높은 순)',
    '연 수익률 (낮은 순)',
    '총 가치 (높은 순)',
    '총 가치 (낮은 순)',
    'STO 가격 (높은 순)',
    'STO 가격 (낮은 순)',
  ]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <section className="w-full px-4 py-4 lg:px-10">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-gray-400 mr-2">필터:</span>

          {selectedLocation ? (
            <button
              onClick={() => setSelectedLocation(null)}
              className="group flex h-9 items-center gap-2 rounded-full border border-[#1ABCF7] bg-[#1ABCF7] pl-4 pr-3 transition-colors"
            >
              <span className="text-sm font-medium text-black font-bold">위치: {selectedLocation}</span>
              <span className="text-black text-lg font-bold cursor-pointer">×</span>
            </button>
          ) : (
            <FilterButton
              label="위치"
              options={locationOptions}
              onSelect={(option) => setSelectedLocation(option)}
            />
          )}

          {selectedYield !== null ? (
            <button
              onClick={() => setSelectedYield(null)}
              className="group flex h-9 items-center gap-2 rounded-full border border-[#1ABCF7] bg-[#1ABCF7] pl-4 pr-3 transition-colors"
            >
              <span className="text-sm font-medium text-black font-bold">수익률 &gt; {selectedYield}%</span>
              <span className="text-black text-lg font-bold cursor-pointer">×</span>
            </button>
          ) : (
            <RangeFilterButton
              label="수익률"
              min={0}
              max={100}
              onSelect={(value) => setSelectedYield(value)}
            />
          )}

          {selectedAsset ? (
            <button
              onClick={() => setSelectedAsset(null)}
              className="group flex h-9 items-center gap-2 rounded-full border border-[#1ABCF7] bg-[#1ABCF7] pl-4 pr-3 transition-colors"
            >
              <span className="text-sm font-medium text-black font-bold">{selectedAsset}</span>
              <span className="text-black text-lg font-bold cursor-pointer">×</span>
            </button>
          ) : (
            <FilterButton
              label="자산 유형"
              options={assetOptions}
              onSelect={(option) => setSelectedAsset(option)}
            />
          )}
        </div>

        <div ref={sortRef} className="relative flex items-center gap-2 ml-auto">
          <span className="text-sm text-gray-400">정렬:</span>
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className={`cursor-pointer flex items-center gap-1 text-sm font-medium ${
              isSortChanged ? 'text-[#1ABCF7]' : 'text-white'
            }`}
          >
            {selectedSort}
            <img src={sortingIcon} alt="sort" className="w-4 h-4" />
          </button>

          {isSortOpen && (
            <div className="absolute top-full right-0 mt-2 w-56 rounded-lg border border-gray-600 bg-gray-800 shadow-lg z-50">
              <div className="py-2">
                {sortOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedSort(option)
                      setIsSortChanged(true)
                      setIsSortOpen(false)
                    }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 transition-colors ${
                      selectedSort === option ? 'text-[#1ABCF7] font-bold' : 'text-white'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
