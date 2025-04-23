import { Link } from "react-router-dom";

function BarNavegation(){


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
                </div>
                <div>
                    <img src="/DebugPug.jpg" alt="Pug Logo" className="h-10 w-10 rounded-full shadow-md" />
                </div>
            </nav>

        </>
    )
}


export default BarNavegation