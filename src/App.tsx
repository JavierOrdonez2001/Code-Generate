import Home from './pages/Home.tsx'
import About from './pages/About.tsx'
import Login from './pages/Login.tsx'
import ProductManagment from './pages/ProductManagment.tsx';
import { Routes, Route, } from "react-router-dom";
import PrivateRoute from './components/PrivateRoute.tsx';

function App() {
  

  return (
    <>
    <div className="min-h-screen bg-gray-900 text-white p-8">
        <Routes>
          <Route 
            path="/home" 
            element={<PrivateRoute><Home /></PrivateRoute>}/>
          <Route 
            path='/about' 
            element={<PrivateRoute><About /></PrivateRoute>}/>
          <Route 
            path='/' 
            element={<Login />}/>
          <Route
            path='/product_managment'
            element={<PrivateRoute><ProductManagment></ProductManagment></PrivateRoute>}/>
        </Routes>
      </div>
   </>
  )
}

export default App
