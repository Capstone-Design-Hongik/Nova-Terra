import { useState } from 'react'
import searchIcon from '../assets/search.svg'

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = () => {
    console.log('검색:', searchQuery)
  }

  return (
    <div className="w-full max-w-lg">
      <div className="flex h-14 w-full items-center rounded-full border border-gray-600 bg-gray-800 p-1 focus-within:border-[#1ABCF7] focus-within:ring-1 focus-within:ring-[#1ABCF7] transition-all shadow-lg">
        <div className="flex h-full w-12 items-center justify-center pl-2">
          <img src={searchIcon} alt="search" className="w-5 h-5" />
        </div>
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="h-full flex-1 bg-transparent px-2 text-base font-normal text-white placeholder:text-gray-400 focus:outline-none"
          placeholder="도시, 부동산 이름을 검색하세요"
        />
        <button
          onClick={handleSearch}
          className="cursor-pointer h-full rounded-full bg-[#1ABCF7] px-6 text-sm font-bold text-black hover:bg-[#15a8dc] transition-colors"
        >
          검색
        </button>
      </div>
    </div>
  )
}
