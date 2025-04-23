import { businessBarCode } from '../logic/containers/BarCodeContainer.ts';
import { businessQRCode } from '../logic/containers/QRCodeContainer.ts';
import { useState } from 'react';
import Modal from '../components/Modal.tsx';
import BarNavegation from '../components/BarNavegation.tsx';


function Home(){
    const [resource, setResource] = useState("");
    const [isModalOpen, setModalOpen] = useState(false);


    const GenerateQRCode = async ():Promise<void> => {
        const data = await businessQRCode.generateQRCode(resource);
        console.log(data)
    }
    const  GenerateBarCode =  ():void => {
        const data =  businessBarCode.GenerateBarCode();
        console.log(data)
    }


    return (
        <>
            <BarNavegation></BarNavegation>

          <div className="p-6 bg-gray-800 text-white rounded-lg shadow-lg flex justify-between items-center">

            
            
            <div className="text-left">
                <h1 className="text-2xl font-bold mb-4">Bienvenido a la TechStorePlus</h1>
                <p className="text-lg">
                    Esta aplicación es una herramienta intuitiva y funcional diseñada para generar códigos de barra y códigos QR.
                    Puedes ingresar datos personalizados que se convertirán en códigos únicos, los cuales se exportarán en formato
                    PDF de manera rápida y sencilla.
                </p>
                <p className="mt-4">
                    Ideal para negocios, inventarios, eventos y cualquier situación que requiera una representación gráfica de datos.
                </p>
                <p className="mt-4 font-semibold">
                    ¡Comienza a generar tus códigos hoy mismo!
                </p>
            </div>

            <div>
                <img
                    src="/pugCOD.jpg"
                    alt="Intuición"
                    className="h-60 w-60 object-contain rounded-lg shadow-md"
                />
            </div>
            </div>
            <br />
            <br />
            <br />
        
            <div className="mt-6 flex gap-4">
                <button onClick={() => setModalOpen(true)} className="bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold py-3 px-6 rounded-lg shadow-lg transition-all cursor-pointer">
                    Generar un Código QR
                </button>
                <button onClick={GenerateBarCode} className="bg-green-500 hover:bg-green-600 text-white text-lg font-semibold py-3 px-6 rounded-lg shadow-lg transition-all cursor-pointer">
                    Generar 100 Código de Barras
                </button>
            </div>
        <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                
            <h2 className="text-lg font-semibold mb-3">Introduce un recurso o un link</h2>
         
            <input
                type="text"
                placeholder="Ejemplo: https://ejemplo.com"
                className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400"
                value={resource}
                onChange={(e) => setResource(e.target.value)}
            />
             <div className="mt-4 flex justify-end">
                <button
                    onClick={() => {
                        GenerateQRCode();
                        setResource("");
                        setModalOpen(false);
                    }}
                    className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition focus:ring-2 focus:ring-green-400"
                >
                    Guardar Recurso
                </button>
            </div>
        </Modal>
        </>
    )
}

export default Home