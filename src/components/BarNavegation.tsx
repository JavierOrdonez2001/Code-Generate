import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"

function BarNavegation(){
    const { setAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        setAuthenticated(false);
        navigate("/");
    };

    return(
        <>
            
            <nav className="mb-6 flex justify-between items-center bg-gray-800 p-4 rounded-lg shadow-lg">
        
             <div className="flex gap-4">
                <Link to="/home" className="text-blue-400 hover:text-blue-300 text-lg font-medium">
                Inicio
                </Link>
                <br />
                <Link to="/about" className="text-blue-400 hover:text-blue-300 text-lg font-medium">
                Sobre Nosotros
                </Link>
                <br />
                <Link to="/product_managment" className="text-blue-400 hover:text-blue-300 text-lg font-medium" >
                    Ingreso de Productos
                </Link>
                </div>
                <div className="flex items-center gap-4">
                    <img src="/DebugPug.jpg" alt="Pug Logo" className="h-10 w-10 rounded-full shadow-md" />
                    <button
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 cursor-pointer"
                        onClick={handleLogout}>
                        Cerrar sesión
                    </button>
                </div>
            </nav>

        </>
    )
}


export default BarNavegation