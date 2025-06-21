import { barCodeBusiness } from '../logic/containers/BarCodeContainer.ts';
import { businessQRCode } from '../logic/containers/QRCodeContainer.ts';
import { useState } from 'react';
import Modal from '../components/Modal.tsx';
import BarNavegation from '../components/BarNavegation.tsx';
import { BarCodeType, Product, BarCodeSource } from '../logic/interfaces/IBarCodeGenerator.ts';
import { CommercialBarCodeService } from '../logic/services/CommercialBarCodeService.ts';

function Home(){
    const [resource, setResource] = useState("");
    const [isModalOpen, setModalOpen] = useState(false);
    const [barCodeData, setBarCodeData] = useState("");
    const [selectedBarCodeType, setSelectedBarCodeType] = useState<BarCodeType>(BarCodeType.EAN_13);
    const [isBarCodeModalOpen, setBarCodeModalOpen] = useState(false);
    const [validationMessage, setValidationMessage] = useState("");
    const [barCodeSource, setBarCodeSource] = useState<BarCodeSource>(BarCodeSource.INTERNAL);
    const [commercialInfo, setCommercialInfo] = useState<any>(null);

    const GenerateQRCode = async ():Promise<void> => {
        const data = await businessQRCode.generateQRCode(resource);
        console.log(data)
    }

    const GenerateBarCode = async (): Promise<void> => {
        try {
            const result = await barCodeBusiness.generateSingleBarCodePDF(barCodeData, selectedBarCodeType);
            if (result.isValid) {
                console.log('Código de barras generado exitosamente:', result);
                alert('Código de barras generado y guardado en PDF');
            } else {
                console.error('Error al generar código de barras:', result.errorMessage);
                alert(`Error: ${result.errorMessage}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al generar el código de barras');
        }
    }

    const GenerateSampleCatalog = (): void => {
        barCodeBusiness.generateSampleCatalog();
        alert('Catálogo de muestra generado y descargado como PDF');
    }

    const validateBarCodeInput = (): void => {
        if (!barCodeData.trim()) {
            setValidationMessage("Por favor ingresa datos para el código de barras");
            setCommercialInfo(null);
            return;
        }

        // Validación específica para códigos comerciales
        if (barCodeSource === BarCodeSource.COMMERCIAL) {
            const commercialValidation = CommercialBarCodeService.validateCommercialCode(barCodeData, selectedBarCodeType);
            if (commercialValidation.isValid && commercialValidation.info) {
                setValidationMessage("✓ Código comercial válido y registrado");
                setCommercialInfo(commercialValidation.info);
            } else {
                setValidationMessage(`✗ ${commercialValidation.errorMessage}`);
                setCommercialInfo(null);
            }
        } else {
            // Validación para códigos internos
            const isValid = barCodeBusiness.validateBarCodeData(barCodeData, selectedBarCodeType);
            if (isValid) {
                setValidationMessage("✓ Datos válidos para el tipo de código seleccionado");
                setCommercialInfo(null);
            } else {
                setValidationMessage("✗ Datos inválidos para el tipo de código seleccionado");
                setCommercialInfo(null);
            }
        }
    }

    const generateSampleCommercialCode = (): void => {
        const sampleCode = CommercialBarCodeService.generateSampleCommercialCode(selectedBarCodeType);
        setBarCodeData(sampleCode.fullCode);
        setCommercialInfo(sampleCode);
        setValidationMessage("✓ Código comercial de muestra generado");
    }

    const getPlaceholderText = (): string => {
        if (barCodeSource === BarCodeSource.COMMERCIAL) {
            switch (selectedBarCodeType) {
                case BarCodeType.EAN_13:
                    return "Ejemplo: 4007817327324 (código oficial registrado)";
                case BarCodeType.EAN_8:
                    return "Ejemplo: 40078173 (código oficial registrado)";
                case BarCodeType.UPC_A:
                    return "Ejemplo: 049000000000 (código oficial registrado)";
                case BarCodeType.ITF_14:
                    return "Ejemplo: 40078173273240 (código oficial registrado)";
                default:
                    return "Ingresa un código comercial registrado";
            }
        } else {
            switch (selectedBarCodeType) {
                case BarCodeType.CODE_128:
                    return "Ejemplo: LAPTOP-GAMING-001";
                case BarCodeType.CODE_39:
                    return "Ejemplo: EQUIP-001";
                default:
                    return "Ingresa datos para el código interno";
            }
        }
    }

    const getHelpText = (): string => {
        if (barCodeSource === BarCodeSource.COMMERCIAL) {
            return "Los códigos comerciales (EAN, UPC) deben estar previamente registrados en GS1. No puedes inventar estos códigos.";
        } else {
            return "Los códigos internos puedes crearlos libremente para tu uso interno.";
        }
    }

    const barCodeTypes = barCodeBusiness.getAvailableBarCodeTypes();
    const commercialTypes = [BarCodeType.EAN_13, BarCodeType.EAN_8, BarCodeType.UPC_A, BarCodeType.ITF_14];
    const internalTypes = [BarCodeType.CODE_128, BarCodeType.CODE_39];

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
        
            <div className="mt-6 flex gap-4 flex-wrap">
                <button onClick={() => setModalOpen(true)} className="bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold py-3 px-6 rounded-lg shadow-lg transition-all cursor-pointer">
                    Generar un Código QR
                </button>
                <button onClick={() => setBarCodeModalOpen(true)} className="bg-green-500 hover:bg-green-600 text-white text-lg font-semibold py-3 px-6 rounded-lg shadow-lg transition-all cursor-pointer">
                    Generar Código de Barras
                </button>
                <button onClick={GenerateSampleCatalog} className="bg-purple-500 hover:bg-purple-600 text-white text-lg font-semibold py-3 px-6 rounded-lg shadow-lg transition-all cursor-pointer">
                    Generar Catálogo de Muestra
                </button>
            </div>

        {/* Modal para Códigos QR */}
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

        {/* Modal para Códigos de Barras */}
        <Modal isOpen={isBarCodeModalOpen} onClose={() => setBarCodeModalOpen(false)}>
            <h2 className="text-lg font-semibold mb-3">Generar Código de Barras</h2>
            
            {/* Selector de tipo de código */}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Tipo de Código:</label>
                <div className="flex gap-4 mb-2">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            value={BarCodeSource.INTERNAL}
                            checked={barCodeSource === BarCodeSource.INTERNAL}
                            onChange={(e) => {
                                setBarCodeSource(e.target.value as BarCodeSource);
                                setSelectedBarCodeType(BarCodeType.CODE_128);
                                setBarCodeData("");
                                setValidationMessage("");
                                setCommercialInfo(null);
                            }}
                            className="mr-2"
                        />
                        <span className="text-sm">Código Interno (puedes inventarlo)</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            value={BarCodeSource.COMMERCIAL}
                            checked={barCodeSource === BarCodeSource.COMMERCIAL}
                            onChange={(e) => {
                                setBarCodeSource(e.target.value as BarCodeSource);
                                setSelectedBarCodeType(BarCodeType.EAN_13);
                                setBarCodeData("");
                                setValidationMessage("");
                                setCommercialInfo(null);
                            }}
                            className="mr-2"
                        />
                        <span className="text-sm">Código Comercial (debe estar registrado)</span>
                    </label>
                </div>
                <p className="text-xs text-gray-400">{getHelpText()}</p>
            </div>

            {/* Selector de tipo de código de barras */}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Tipo de Código de Barras:</label>
                <select
                    value={selectedBarCodeType}
                    onChange={(e) => {
                        setSelectedBarCodeType(e.target.value as BarCodeType);
                        setBarCodeData("");
                        setValidationMessage("");
                        setCommercialInfo(null);
                    }}
                    className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
                >
                    {barCodeSource === BarCodeSource.COMMERCIAL ? (
                        barCodeTypes.filter(type => commercialTypes.includes(type.value)).map((type) => (
                            <option key={type.value} value={type.value}>
                                {type.label} - {type.description}
                            </option>
                        ))
                    ) : (
                        barCodeTypes.filter(type => internalTypes.includes(type.value)).map((type) => (
                            <option key={type.value} value={type.value}>
                                {type.label} - {type.description}
                            </option>
                        ))
                    )}
                </select>
            </div>

            {/* Campo de datos */}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Datos del Código:</label>
                <input
                    type="text"
                    placeholder={getPlaceholderText()}
                    className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400"
                    value={barCodeData}
                    onChange={(e) => {
                        setBarCodeData(e.target.value);
                        setValidationMessage("");
                        setCommercialInfo(null);
                    }}
                    onBlur={validateBarCodeInput}
                />
                {validationMessage && (
                    <p className={`text-sm mt-1 ${validationMessage.startsWith('✓') ? 'text-green-400' : 'text-red-400'}`}>
                        {validationMessage}
                    </p>
                )}
            </div>

            {/* Información del código comercial */}
            {commercialInfo && (
                <div className="mb-4 p-3 bg-blue-900 rounded-lg">
                    <h4 className="font-semibold text-blue-300 mb-2">Información del Código Comercial:</h4>
                    <div className="text-sm text-gray-300 space-y-1">
                        <p><strong>Empresa:</strong> {CommercialBarCodeService.getCompanyInfo(commercialInfo.gs1Prefix)?.company}</p>
                        <p><strong>País:</strong> {CommercialBarCodeService.getCompanyInfo(commercialInfo.gs1Prefix)?.country}</p>
                        <p><strong>Prefijo GS1:</strong> {commercialInfo.gs1Prefix}</p>
                        <p><strong>Código Producto:</strong> {commercialInfo.productCode}</p>
                        <p><strong>Dígito Control:</strong> {commercialInfo.checkDigit}</p>
                    </div>
                </div>
            )}

            {/* Botón para generar código de muestra (solo para comerciales) */}
            {barCodeSource === BarCodeSource.COMMERCIAL && (
                <div className="mb-4">
                    <button
                        onClick={generateSampleCommercialCode}
                        className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition"
                    >
                        Generar Código de Muestra
                    </button>
                    <p className="text-xs text-gray-400 mt-1">
                        Genera un código comercial válido para pruebas (no usar en producción)
                    </p>
                </div>
            )}

            <div className="mt-4 flex justify-end gap-2">
                <button
                    onClick={() => {
                        setBarCodeData("");
                        setValidationMessage("");
                        setCommercialInfo(null);
                        setBarCodeModalOpen(false);
                    }}
                    className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition"
                >
                    Cancelar
                </button>
                <button
                    onClick={() => {
                        GenerateBarCode();
                        setBarCodeData("");
                        setValidationMessage("");
                        setCommercialInfo(null);
                        setBarCodeModalOpen(false);
                    }}
                    disabled={!barCodeData.trim() || validationMessage.startsWith('✗')}
                    className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition focus:ring-2 focus:ring-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Generar Código
                </button>
            </div>
        </Modal>
        </>
    )
}

export default Home