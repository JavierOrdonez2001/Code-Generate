import { useEffect, useState } from "react";
import { businessSaveCodeWithProduct } from "../logic/containers/SaveCodeWithProduct";
import { getDocs, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import BarNavegation from "../components/BarNavegation";
import { AnimatePresence, motion } from "framer-motion";
import jsPDF from "jspdf";
import Modal from "../components/Modal";

interface Producto {
  id: string;
  nombre: string;
  imagenProducto: string;
  barcodeBase64: string;
  qrBase64: string;
}

function ProductManagment() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [idProducto, setIdProducto] = useState("");
  const [nombre, setNombre] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");
  const [recursoQR, setRecursoQR] = useState("");
  const [eliminados, setEliminados] = useState<Set<string>>(new Set());
  const [desapareciendo, setDesapareciendo] = useState<Set<string>>(new Set());
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [nombreUpdate, setNombreUpdate] = useState("");
  const [imagenUrlUpdate, setImagenUrlUpdate] = useState("");
  const [recursoQRUpdate, setRecursoQRUpdate] = useState("");

  const fetchProductos = async () => {
    const querySnapshot = await getDocs(collection(db, "products"));
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Producto[];
    setProductos(data);
  };

  const handleSave = async () => {
    if (!nombre || !imagenUrl || !recursoQR) return alert("Por favor completa todos los campos");
    const data = await businessSaveCodeWithProduct.SaveCodeWithProduct(nombre, imagenUrl, recursoQR);

    if (data?.barcodeBase64 && data?.qrBase64) {
      await generarPDF(nombre, imagenUrl, data.barcodeBase64, data.qrBase64);
    } 
    setNombre("");
    setImagenUrl("");
    setRecursoQR("");
    await fetchProductos();
  };

  const handleEnterProduct = async (id: string) => {
    setDesapareciendo(prev => new Set(prev).add(id));
    alert('Producto ingresado de manera exitosa')

    setTimeout(async () => {
      await deleteDoc(doc(db, "products", id));
      setEliminados(prev => new Set(prev).add(id));
      setProductos(prev => prev.filter(p => p.id !== id));
      setDesapareciendo(prev => {
        const nuevo = new Set(prev);
        nuevo.delete(id);
        return nuevo;
      });
    }, 300); // Esperamos a que se ejecute exit
  };

  useEffect(() => {
    fetchProductos();
  }, []);


  async function generarPDF(
    nombre: string,
    imagenProductoUrl: string,
    barcodeBase64: string,
    qrBase64: string
  ) {
    const doc = new jsPDF();

    const productoImg = await getImageBase64FromUrlCrossOriginSafe(imagenProductoUrl);

    // Título
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(`Ficha Técnica: ${nombre}`, 105, 20, { align: "center" });

    // Imagen del producto con fondo
    doc.setFillColor(245, 245, 245); 
    doc.rect(20, 30, 170, 60, "F");
    doc.addImage(productoImg, "JPEG", 60, 35, 90, 50); 

    // Código de barras
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("Código de Barras:", 20, 105);
    doc.setFillColor(245, 245, 245);
    doc.rect(20, 110, 170, 30, "F");
    doc.addImage(barcodeBase64, "PNG", 25, 112, 160, 25);

    // Código QR
    doc.setFontSize(14);
    doc.text("Código QR:", 20, 155);
    doc.setFillColor(245, 245, 245);
    doc.rect(20, 160, 60, 60, "F");
    doc.addImage(qrBase64, "PNG", 25, 165, 50, 50);

    // Guardar PDF
    const nombreSanitizado = nombre.replace(/\s+/g, "_");
    doc.save(`${nombreSanitizado}_producto.pdf`);
  }


  async function getImageBase64FromUrlCrossOriginSafe(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = url;
      img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("No se pudo obtener el contexto del canvas");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/jpeg"));
      };
        img.onerror = () => reject("No se pudo cargar la imagen");
    });
  }

  async function handleUpdateProduct(id:string): Promise<void>{
 try {
    if (!nombreUpdate || !imagenUrlUpdate || !recursoQRUpdate) {
      alert("Por favor completa todos los campos");
      return;
    }

    const docRef = doc(db, "products", id);

    await updateDoc(docRef, {
      nombre: nombreUpdate,
      imagenProducto: imagenUrlUpdate,
      qrBase64: recursoQRUpdate,
    });

    alert("✅ Producto actualizado correctamente");

    setNombreUpdate("");
    setImagenUrlUpdate("");
    setRecursoQRUpdate("");
    setIdProducto("");
    setIsOpenModal(false);

    await fetchProductos();

  } catch (error) {
    console.error("❌ Error al actualizar el producto:", error);
    alert("Ocurrió un error al actualizar el producto");
  }

  }



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
            <AnimatePresence>
              {productos
                .filter(producto => !desapareciendo.has(producto.id)) // 🔥 Esto activa la animación
                .map(producto => (
                  <motion.div
                    key={producto.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    layout
                    className="bg-gray-800 p-4 rounded-lg shadow-lg text-white flex flex-col items-center"
                  >
                    <img src={producto.imagenProducto} alt={producto.nombre} className="h-40 w-40 object-cover rounded mb-3" />
                    <h3 className="text-xl font-semibold mb-2">{producto.nombre}</h3>
                    <img src={producto.barcodeBase64} alt="Código de barras" className="mb-2 w-full" />
                    <img src={producto.qrBase64} alt="Código QR" className="mb-4 w-1/2" />
                    <button
                      onClick={() => handleEnterProduct(producto.id)}
                      disabled={eliminados.has(producto.id)}
                      className={`px-4 py-2 rounded-lg text-white font-bold shadow-md transition-all duration-300 cursor-pointer ${
                        eliminados.has(producto.id)
                          ? "bg-red-600 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {eliminados.has(producto.id) ? "Ingresado" : "Ingresar"}
                    </button>
                    <br />
                    <button
                    className="px-4 py-2 rounded-lg text-white font-bold shadow-md transition-all duration-300 cursor-pointer bg-blue-500 hover:bg-blue-600"
                    onClick={() => {
                      setIdProducto(producto.id);
                      setNombreUpdate(producto.nombre);
                      setImagenUrlUpdate(producto.imagenProducto);
                      setRecursoQRUpdate(producto.qrBase64)
                      setIsOpenModal(true);
                    }}
                    >
                      Actualizar Producto
                    </button>
                    <br />
                    <button
                      className="px-4 py-2 mt-2 rounded-lg text-white font-bold shadow-md transition-all duration-300 cursor-pointer bg-yellow-500 hover:bg-yellow-600"
                      onClick={() => generarPDF(
                        producto.nombre,
                        producto.imagenProducto,
                        producto.barcodeBase64,
                        producto.qrBase64
                      )}
                    >
                      Imprimir PDF
                    </button>
                    <Modal isOpen={isOpenModal} onClose={() => setIsOpenModal(false)}>
                      <h1>Actulizar producto</h1>
                      <br />
                      <input
                        type="text"
                        placeholder="Nombre del producto"
                        className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
                        value={nombreUpdate}
                        onChange={e => setNombreUpdate(e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="URL de imagen del producto"
                        className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
                        value={imagenUrlUpdate}
                        onChange={e => setImagenUrlUpdate(e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Recurso para el código QR (URL)"
                        className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
                        value={recursoQRUpdate}
                        onChange={e => setRecursoQRUpdate(e.target.value)}
                      />
                      <br />
                      <button
                        className="px-4 py-2 rounded-lg text-white font-bold shadow-md transition-all duration-300 cursor-pointer bg-blue-500 hover:bg-blue-600"
                        onClick={() => handleUpdateProduct(idProducto)}
                        >
                        Actualizar Producto
                      </button>
                    </Modal>
                  </motion.div>
                ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </>
  );
}

export default ProductManagment;
