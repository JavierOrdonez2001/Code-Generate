function Login() {

    


    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white space-y-6">
        <h1 className="text-3xl font-bold text-blue-500 animate-pulse">
          ¡Bienvenido a TechStorePlus!
        </h1>
  
        <form className="bg-gray-800 p-8 rounded-2xl shadow-md w-full max-w-sm fade-in-up">
          <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
  
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Correo</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-1">Contraseña</label>
            <input
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
  