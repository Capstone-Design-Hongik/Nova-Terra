import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import STOPurchase from '../markettrade/STOPurchase'
import STOConfirm from '../markettrade/STOConfirm'
import STOComplete from '../markettrade/STOComplete'

interface STOPurchasePanelProps {
  isOpen: boolean
  onClose: () => void
  property: {
    id: string
    name: string
    location?: string
    stoPrice: number
  } | null
}

export default function STOPurchasePanel({ isOpen, onClose, property }: STOPurchasePanelProps) {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [quantity, setQuantity] = useState(10)
  const [transactionId] = useState('0x7f3a...9c2b1e4')

  if (!property) return null

  const handleNext = (purchaseQuantity: number) => {
    setQuantity(purchaseQuantity)
    setStep(2)
  }

  const handleBack = () => {
    setStep(1)
  }

  const handleConfirm = () => {
    setStep(3)
  }

  const handleViewPortfolio = () => {
    onClose()
    setTimeout(() => {
      setStep(1)
      navigate('/portfolio')
    }, 300)
  }

  const handleExploreMore = () => {
    onClose()
    setTimeout(() => setStep(1), 300)
  }

  const handlePanelClose = () => {
    onClose()
    setTimeout(() => setStep(1), 300)
  }

  const stoPrice = `KRWT ${property.stoPrice.toFixed(0)}`
  const pricePerToken = property.stoPrice
  const subtotal = quantity * pricePerToken
  const gasFee = 1500
  const totalAmount = subtotal + gasFee

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={handlePanelClose}
        style={{ top: '80px', height: 'calc(100vh - 80px)' }}
      ></div>

      {/* Panel */}
      <div
        className={`fixed right-0 z-50 w-full md:w-1/2 overflow-y-auto bg-black border-l border-gray-600 shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ top: '80px', height: 'calc(100vh - 80px)' }}
      >
        {/* Close Button */}
        <button
          onClick={handlePanelClose}
          className="sticky top-4 left-4 z-10 float-left ml-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 border border-gray-600 text-white transition-all hover:bg-gray-700 hover:border-[#1ABCF7]"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="px-8 py-12">
          {/* STO Purchase Steps */}
          {step === 1 && (
            <STOPurchase stoPrice={stoPrice} propertyName={property.name} propertyLocation={property.location} onNext={handleNext} />
          )}
          {step === 2 && (
            <STOConfirm
              stoPrice={stoPrice}
              propertyName={property.name}
              quantity={quantity}
              onBack={handleBack}
              onConfirm={handleConfirm}
            />
          )}
          {step === 3 && (
            <STOComplete
              propertyName={property.name}
              quantity={quantity}
              totalAmount={totalAmount}
              transactionId={transactionId}
              onViewPortfolio={handleViewPortfolio}
              onExploreMore={handleExploreMore}
            />
          )}
        </div>
      </div>
    </>
  )
}
