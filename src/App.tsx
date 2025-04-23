import Home from './pages/Home.tsx'
import About from './pages/About.tsx'
import Login from './pages/Login.tsx'
import { Routes, Route, } from "react-router-dom";


function App() {
  

  return (
    <>
    <div className="min-h-screen bg-gray-900 text-white p-8">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path='/about' element={<About />}/>
          <Route path='/' element={<Login />}/>
        </Routes>
      </div>
   </>
  )
}

export default App
