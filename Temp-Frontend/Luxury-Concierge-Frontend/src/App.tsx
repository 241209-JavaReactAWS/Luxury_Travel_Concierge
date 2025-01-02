import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import HotelList from './HoltelFilter/HotelListings.tsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>  <HotelList /></p>
        <p>Apple</p>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
    </>
  )
}

export default App
