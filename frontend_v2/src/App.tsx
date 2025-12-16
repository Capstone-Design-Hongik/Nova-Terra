import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Onboarding from './pages/Onboarding'
import Marketplace from './pages/Marketplace'
import MarketTrade from './pages/MarketTrade'
import Portfolio from './pages/Portfolio'
import Governance from './pages/Governance'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/trade/:id" element={<MarketTrade />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/governance" element={<Governance />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App