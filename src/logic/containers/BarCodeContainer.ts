import { GenerateBarCode } from '../repositories/GenerateBarCode.ts';
import { IBarCodeGenerator, BarCodeType, Product, BarCodeResult } from '../interfaces/IBarCodeGenerator.ts';
import BarCodeService from '../services/BarCodeService.ts';

const generateBarCodePDF: IBarCodeGenerator = new GenerateBarCode();

export const businessBarCode = new BarCodeService(generateBarCodePDF);

// Métodos de conveniencia para el negocio
export const barCodeBusiness = {
    // Generar un código de barras individual
    async generateSingleBarCode(data: string, type: BarCodeType): Promise<BarCodeResult> {
        return await businessBarCode.generateBarCode(data, type);
    },

    // Generar un código de barras individual en PDF
    async generateSingleBarCodePDF(data: string, type: BarCodeType): Promise<BarCodeResult> {
        return await (generateBarCodePDF as any).generateSingleBarCodePDF(data, type);
    },

    // Generar catálogo de productos con códigos de barras
    async generateProductCatalog(products: Product[]): Promise<BarCodeResult[]> {
        return await businessBarCode.generateMultipleBarCodes(products);
    },

    // Generar catálogo de muestra para demostración
    generateSampleCatalog(): void {
        (generateBarCodePDF as any).generateSampleCatalog();
    },

    // Validar datos de código de barras
    validateBarCodeData(data: string, type: BarCodeType): boolean {
        return businessBarCode.validateBarCodeData(data, type);
    },

    // Obtener tipos de códigos de barras disponibles
    getAvailableBarCodeTypes(): { value: BarCodeType; label: string; description: string }[] {
        return [
            { 
                value: BarCodeType.EAN_13, 
                label: 'EAN-13', 
                description: 'Estándar internacional para productos comerciales (13 dígitos)' 
            },
            { 
                value: BarCodeType.EAN_8, 
                label: 'EAN-8', 
                description: 'Para productos pequeños con espacio limitado (8 dígitos)' 
            },
            { 
                value: BarCodeType.UPC_A, 
                label: 'UPC-A', 
                description: 'Estándar norteamericano para productos (12 dígitos)' 
            },
            { 
                value: BarCodeType.CODE_128, 
                label: 'CODE-128', 
                description: 'Código alfanumérico versátil para logística' 
            },
            { 
                value: BarCodeType.CODE_39, 
                label: 'CODE-39', 
                description: 'Código industrial para identificación de productos' 
            },
            { 
                value: BarCodeType.ITF_14, 
                label: 'ITF-14', 
                description: 'Para cajas y pallets (14 dígitos)' 
            }
        ];
    }
};
