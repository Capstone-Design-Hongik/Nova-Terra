import { createPortal } from 'react-dom'

interface VoteConfirmModalProps {
  isOpen: boolean
  voteType: 'for' | 'against' | null
  proposalNumber: string
  proposalTitle: string
  onConfirm: () => void
  onCancel: () => void
}

export default function VoteConfirmModal({
  isOpen,
  voteType,
  proposalNumber,
  proposalTitle,
  onConfirm,
  onCancel,
}: VoteConfirmModalProps) {
  if (!isOpen || !voteType) return null

  return createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-9999" onClick={onCancel}>
      <div className="bg-gray-800 border border-gray-600 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${voteType === 'for' ? 'bg-[#1ABCF7]/20' : 'bg-red-500/20'}`}>
            <svg className={`w-6 h-6 ${voteType === 'for' ? 'text-[#1ABCF7]' : 'text-red-400'}`} fill="currentColor" viewBox="0 0 20 20">
              {voteType === 'for' ? (
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              ) : (
                <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
              )}
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">투표 확인</h3>
            <p className="text-sm text-gray-400">{proposalNumber}</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-300 mb-2">
            <span className="font-bold text-white">"{proposalTitle}"</span> 안건에
          </p>
          <p className={`text-lg font-bold ${voteType === 'for' ? 'text-[#1ABCF7]' : 'text-red-400'}`}>
            {voteType === 'for' ? '찬성' : '반대'} 투표하시겠습니까?
          </p>
        </div>

        <div className="bg-gray-900/50 border border-gray-600 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-400 mb-2">⚠️ 투표 후에는 변경할 수 없습니다.</p>
          <p className="text-xs text-gray-500">투표 내용을 신중히 확인해주세요.</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="cursor-pointer flex-1 px-4 py-2.5 rounded-lg text-sm font-bold transition-all bg-gray-700 hover:bg-gray-600 text-white border border-gray-600"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className={`cursor-pointer flex-1 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
              voteType === 'for'
                ? 'bg-[#1ABCF7] hover:bg-cyan-400 text-black shadow-[0_0_15px_rgba(26,188,247,0.3)]'
                : 'bg-red-500 hover:bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]'
            }`}
          >
            {voteType === 'for' ? '찬성' : '반대'} 투표하기
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
