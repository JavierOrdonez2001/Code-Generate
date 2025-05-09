import { useEffect, useState } from "react";
import { businessSaveCodeWithProduct } from "../logic/containers/SaveCodeWithProduct";
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import BarNavegation from "../components/BarNavegation";

interface Producto {
  id: string;
  nombre: string;
  imagenProducto: string;
  barcodeBase64: string;
  qrBase64: string;
}

function ProductManagment() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [nombre, setNombre] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");
  const [recursoQR, setRecursoQR] = useState("");
  const [eliminados, setEliminados] = useState<Set<string>>(new Set());

  const fetchProductos = async () => {
    const querySnapshot = await getDocs(collection(db, "products"));
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Producto[];
    setProductos(data);
  };

  const handleSave = async () => {
    if (!nombre || !imagenUrl || !recursoQR) return alert("Por favor completa todos los campos");
    await businessSaveCodeWithProduct.SaveCodeWithProduct(nombre, imagenUrl, recursoQR);
    setNombre("");
    setImagenUrl("");
    setRecursoQR("");
    await fetchProductos();
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "products", id));
    setEliminados(prev => new Set(prev).add(id));
    setProductos(prev => prev.filter(p => p.id !== id));
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  return (
    <>
      <BarNavegation />
      <div className="p-6">
        <h1 className="text-3xl font-bold text-white mb-6">Gestión de Productos para Envaseria</h1>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-10">
          <h2 className="text-white text-xl mb-4">Crear nuevo producto</h2>

          <input
            type="text"
            placeholder="Nombre del producto"
            className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
          />
          <input
            type="text"
            placeholder="URL de imagen del producto"
            className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
            value={imagenUrl}
            onChange={e => setImagenUrl(e.target.value)}
          />
          <input
            type="text"
            placeholder="Recurso para el código QR (URL)"
            className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
            value={recursoQR}
            onChange={e => setRecursoQR(e.target.value)}
          />
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
          >
            Guardar Producto
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productos.length === 0 ? (
            <p className="text-white col-span-full text-center text-lg font-medium">
              No hay productos registrados aún.
            </p>
          ) : (
            productos.map(producto => (
              <div
                key={producto.id}
                className="bg-gray-800 p-4 rounded-lg shadow-lg text-white flex flex-col items-center"
              >
                <img src={producto.imagenProducto} alt={producto.nombre} className="h-40 w-40 object-cover rounded mb-3" />
                <h3 className="text-xl font-semibold mb-2">{producto.nombre}</h3>
                <img src={producto.barcodeBase64} alt="Código de barras" className="mb-2 w-full" />
                <img src={producto.qrBase64} alt="Código QR" className="mb-4 w-1/2" />
                <button
                  onClick={() => handleDelete(producto.id)}
                  disabled={eliminados.has(producto.id)}
                  className={`px-4 py-2 rounded-lg text-white font-bold shadow-md transition-all duration-300 cursor-pointer ${
                    eliminados.has(producto.id) ? "bg-red-600 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {eliminados.has(producto.id) ? "Ingresado" : "Ingresar"}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default ProductManagment;
