import { useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import bcrypt from "bcryptjs";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { setAuthenticated } = useAuth();

    const handleSubmit = async (e:React.FormEvent) => {
      e.preventDefault();

      try{

        const q = query(collection(db, "users"), where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty){
          alert("Usuario no encontrado")
          return;
        }

        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        
        const passwordMatch = bcrypt.compareSync(password, userData.password)
        
        if (passwordMatch) {
          setAuthenticated(true); 
          navigate("/home");

        } else {

          alert("Contraseña incorrecta");

        }


      }catch(error){
        alert("Error al authenticar")
        console.error(error)
      }
      


    };
    


  return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white space-y-6">
        <h1 className="text-3xl font-bold text-blue-500 animate-pulse">
          ¡Bienvenido a TechStorePlus!
        </h1>
  
        <form 
          className="bg-gray-800 p-8 rounded-2xl shadow-md w-full max-w-sm fade-in-up"
          onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
  
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Correo</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-1">Contraseña</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 cursor-pointer"
          >
            Iniciar sesión
          </button>
        </form>
      </div>
  );
}
  
  export default Login;
  