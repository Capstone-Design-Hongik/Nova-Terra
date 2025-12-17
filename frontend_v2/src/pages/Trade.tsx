import Topbar from "../layouts/Topbar"

export default function Trade(){
  return(
    <div className="min-h-screen bg-black">
      <Topbar isConnected={true} />
      <h1 className="text-white">거래페이지입니다</h1>
    </div>

  )
}