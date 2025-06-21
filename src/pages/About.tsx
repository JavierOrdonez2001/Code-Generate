import BarNavegation from "../components/BarNavegation";
import { BarCodeType } from '../logic/interfaces/IBarCodeGenerator.ts';

function About() {
    const barcodeTypes = [
        {
            type: BarCodeType.EAN_13,
            name: "EAN-13",
            description: "Estándar internacional para productos comerciales",
            digits: "13 dígitos",
            useCase: "Productos en tiendas, supermercados, farmacias",
            example: "1234567890123",
            advantages: ["Reconocido mundialmente", "Incluye dígito de control", "Ideal para retail"],
            limitations: ["Solo números", "Longitud fija"]
        },
        {
            type: BarCodeType.EAN_8,
            name: "EAN-8",
            description: "Versión compacta para productos pequeños",
            digits: "8 dígitos",
            useCase: "Productos con espacio limitado, dulces, cosméticos",
            example: "12345670",
            advantages: ["Más compacto", "Fácil de imprimir", "Ideal para productos pequeños"],
            limitations: ["Menos capacidad de datos", "Solo números"]
        },
        {
            type: BarCodeType.UPC_A,
            name: "UPC-A",
            description: "Estándar norteamericano para productos",
            digits: "12 dígitos",
            useCase: "Productos en Estados Unidos y Canadá",
            example: "123456789012",
            advantages: ["Estándar en Norteamérica", "Compatible con EAN-13", "Ampliamente soportado"],
            limitations: ["Limitado a Norteamérica", "Solo números"]
        },
        {
            type: BarCodeType.CODE_128,
            name: "CODE-128",
            description: "Código alfanumérico versátil",
            digits: "1-48 caracteres",
            useCase: "Logística, inventarios, identificación interna",
            example: "ABC123-DEF456",
            advantages: ["Alfanumérico", "Alta densidad", "Múltiples conjuntos de caracteres"],
            limitations: ["No es estándar comercial", "Requiere software especializado"]
        },
        {
            type: BarCodeType.CODE_39,
            name: "CODE-39",
            description: "Código industrial para identificación",
            digits: "1-43 caracteres",
            useCase: "Industria, logística, identificación de equipos",
            example: "ABC-123",
            advantages: ["Alfanumérico", "Robusto", "Fácil de implementar"],
            limitations: ["Baja densidad", "No incluye dígito de control"]
        },
        {
            type: BarCodeType.ITF_14,
            name: "ITF-14",
            description: "Para cajas y pallets",
            digits: "14 dígitos",
            useCase: "Embalajes, cajas, pallets, logística",
            example: "12345678901234",
            advantages: ["Ideal para embalajes", "Resistente a daños", "Fácil de escanear"],
            limitations: ["Solo números", "Requiere espacio suficiente"]
        }
    ];

    return (
        <>
            <BarNavegation />
            
            <div className="container mx-auto px-6 py-8">
                <div className="bg-gray-800 text-white rounded-lg shadow-lg p-8 mb-8">
                    <h1 className="text-3xl font-bold mb-6">Guía de Códigos de Barras</h1>
                    <p className="text-lg mb-4">
                        Los códigos de barras son sistemas de identificación que permiten almacenar información 
                        de manera legible por máquinas. Cada tipo tiene sus propias características y casos de uso específicos.
                    </p>
                    <p className="text-lg">
                        Esta guía te ayudará a entender cuándo y cómo usar cada tipo de código de barras en tu negocio.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {barcodeTypes.map((barcode) => (
                        <div key={barcode.type} className="bg-gray-800 text-white rounded-lg shadow-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-blue-400">{barcode.name}</h2>
                                <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm">
                                    {barcode.digits}
                                </span>
                            </div>
                            
                            <p className="text-gray-300 mb-4">{barcode.description}</p>
                            
                            <div className="mb-4">
                                <h3 className="font-semibold text-green-400 mb-2">Casos de Uso:</h3>
                                <p className="text-sm text-gray-300">{barcode.useCase}</p>
                            </div>
                            
                            <div className="mb-4">
                                <h3 className="font-semibold text-yellow-400 mb-2">Ejemplo:</h3>
                                <code className="bg-gray-700 px-2 py-1 rounded text-sm font-mono">
                                    {barcode.example}
                                </code>
                            </div>
                            
                            <div className="mb-4">
                                <h3 className="font-semibold text-green-400 mb-2">Ventajas:</h3>
                                <ul className="text-sm text-gray-300 list-disc list-inside">
                                    {barcode.advantages.map((advantage, index) => (
                                        <li key={index}>{advantage}</li>
                                    ))}
                                </ul>
                            </div>
                            
                            <div className="mb-4">
                                <h3 className="font-semibold text-red-400 mb-2">Limitaciones:</h3>
                                <ul className="text-sm text-gray-300 list-disc list-inside">
                                    {barcode.limitations.map((limitation, index) => (
                                        <li key={index}>{limitation}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-gray-800 text-white rounded-lg shadow-lg p-8 mt-8">
                    <h2 className="text-2xl font-bold mb-6">Consejos para Elegir el Código Correcto</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-xl font-semibold text-blue-400 mb-4">Para Productos Comerciales:</h3>
                            <ul className="space-y-2 text-gray-300">
                                <li>• <strong>EAN-13:</strong> Para la mayoría de productos en tiendas</li>
                                <li>• <strong>EAN-8:</strong> Para productos pequeños como dulces o cosméticos</li>
                                <li>• <strong>UPC-A:</strong> Si vendes principalmente en Estados Unidos/Canadá</li>
                            </ul>
                        </div>
                        
                        <div>
                            <h3 className="text-xl font-semibold text-green-400 mb-4">Para Logística Interna:</h3>
                            <ul className="space-y-2 text-gray-300">
                                <li>• <strong>CODE-128:</strong> Para inventarios y tracking interno</li>
                                <li>• <strong>CODE-39:</strong> Para identificación de equipos y herramientas</li>
                                <li>• <strong>ITF-14:</strong> Para cajas y embalajes</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-blue-900 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">💡 Consejo Importante:</h3>
                        <p className="text-gray-300">
                            Siempre valida que tus datos cumplan con las especificaciones del tipo de código elegido. 
                            Nuestra aplicación te ayudará a verificar que los datos sean correctos antes de generar el código.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default About;
