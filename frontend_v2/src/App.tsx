import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Onboarding from './pages/Onboarding'
import Marketplace from './pages/Marketplace'
import MarketTrade from './pages/MarketTrade'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/trade/:id" element={<MarketTrade />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App