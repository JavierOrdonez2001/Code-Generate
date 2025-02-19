import Home from './pages/Home.tsx'
import About from './pages/About.tsx'
import { Routes, Route, Link } from "react-router-dom";


function App() {


  return (
    <>
<div className="min-h-screen bg-gray-900 text-white p-8">
        <nav className="mb-6 flex justify-between items-center bg-gray-800 p-4 rounded-lg shadow-lg">
        
          <div className="flex gap-4">
            <Link to="/" className="text-blue-400 hover:text-blue-300 text-lg font-medium">
              Inicio
            </Link>
            <Link to="/about" className="text-blue-400 hover:text-blue-300 text-lg font-medium">
              Sobre mi
            </Link>
          </div>
          
          
          

          
          <div>
          <img src="/DebugPug.jpg" alt="Pug Logo" className="h-10 w-10 rounded-full shadow-md" />
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/about' element={<About />}/>
        </Routes>
      </div>
   </>
  )
}

export default App
