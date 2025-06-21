export interface IBarCodeGenerator {
    generateBarCode(data: string, type: BarCodeType): Promise<BarCodeResult>;
    generateMultipleBarCodes(products: Product[]): Promise<BarCodeResult[]>;
    validateBarCodeData(data: string, type: BarCodeType): boolean;
}

export enum BarCodeType {
    EAN_13 = 'EAN-13',           // Productos comerciales (13 dígitos)
    EAN_8 = 'EAN-8',             // Productos pequeños (8 dígitos)
    UPC_A = 'UPC-A',             // Productos norteamericanos (12 dígitos)
    CODE_128 = 'CODE-128',       // Texto alfanumérico
    CODE_39 = 'CODE-39',         // Industria y logística
    ITF_14 = 'ITF-14'            // Cajas y pallets (14 dígitos)
}

export enum BarCodeSource {
    COMMERCIAL = 'COMMERCIAL',   // Código oficial registrado (EAN, UPC)
    INTERNAL = 'INTERNAL',       // Código interno de la empresa
    SAMPLE = 'SAMPLE'            // Código de muestra/demostración
}

export interface Product {
    id: string;
    name: string;
    sku: string;
    price: number;
    category: string;
    barcodeType: BarCodeType;
    barcodeData?: string;
    barcodeSource: BarCodeSource;
    manufacturer?: string;
    description?: string;
}

export interface BarCodeResult {
    id: string;
    productId: string;
    barcodeType: BarCodeType;
    data: string;
    imageUrl?: string;
    generatedAt: Date;
    isValid: boolean;
    errorMessage?: string;
    source: BarCodeSource;
}

// Nueva interfaz para manejo de códigos comerciales
export interface CommercialBarCodeInfo {
    gs1Prefix: string;           // Prefijo de la empresa (ej: 400781)
    productCode: string;         // Código del producto
    checkDigit: string;          // Dígito de control
    fullCode: string;            // Código completo
    isRegistered: boolean;       // ¿Está registrado en GS1?
    registrationDate?: Date;     // Fecha de registro
}

// Nueva interfaz para códigos internos
export interface InternalBarCodeInfo {
    companyPrefix: string;       // Prefijo de la empresa (ej: MIEMPRESA)
    productCode: string;         // Código interno del producto
    category: string;            // Categoría del producto
    fullCode: string;            // Código completo interno
}

export default IBarCodeGenerator