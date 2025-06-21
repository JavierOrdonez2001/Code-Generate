import { IBarCodeGenerator, BarCodeType, Product, BarCodeResult, BarCodeSource } from "../interfaces/IBarCodeGenerator.ts";
import { BarCodeValidationService } from "../services/BarCodeValidationService.ts";
import { jsPDF } from "jspdf";
import JsBarcode from "jsbarcode";
import { v4 as uuidv4 } from "uuid"; 

export class GenerateBarCode implements IBarCodeGenerator {

    constructor() {
        // this.doc = new jsPDF();
    }

    public async generateBarCode(data: string, type: BarCodeType): Promise<BarCodeResult> {
        try {
            // Validar los datos según el tipo de código de barras
            const validation = BarCodeValidationService.validateBarCodeData(data, type);
            
            if (!validation.isValid) {
                return {
                    id: uuidv4(),
                    productId: '',
                    barcodeType: type,
                    data: data,
                    generatedAt: new Date(),
                    isValid: false,
                    errorMessage: validation.errorMessage,
                    source: BarCodeSource.INTERNAL
                };
            }

            // Generar el código de barras
            const canvas = document.createElement("canvas");
            
            JsBarcode(canvas, data, {
                format: this.mapBarCodeTypeToJsBarcode(type),
                width: 2,
                height: 50,
                displayValue: true,
                fontSize: 12,
                margin: 10
            });

            const barcodeImage = canvas.toDataURL("image/png");

            return {
                id: uuidv4(),
                productId: '',
                barcodeType: type,
                data: data,
                imageUrl: barcodeImage,
                generatedAt: new Date(),
                isValid: true,
                source: BarCodeSource.INTERNAL
            };

        } catch (error) {
            console.error("Error al generar el código de barras: ", error);
            return {
                id: uuidv4(),
                productId: '',
                barcodeType: type,
                data: data,
                generatedAt: new Date(),
                isValid: false,
                errorMessage: `Error técnico: ${error instanceof Error ? error.message : 'Error desconocido'}`,
                source: BarCodeSource.INTERNAL
            };
        }
    }

    public async generateMultipleBarCodes(products: Product[]): Promise<BarCodeResult[]> {
        const results: BarCodeResult[] = [];
        let pageNumber = 1;
        
        // Crear un nuevo PDF para el catálogo
        const catalogDoc = new jsPDF();
        catalogDoc.setFontSize(16);
        catalogDoc.text("Catálogo de Códigos de Barras - TechStorePlus", 10, 20);
        catalogDoc.setFontSize(12);

        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            
            // Generar datos de código de barras si no existen
            if (!product.barcodeData) {
                product.barcodeData = BarCodeValidationService.generateSampleData(product.barcodeType);
            }

            // Generar el código de barras directamente (sin crear PDF individual)
            const canvas = document.createElement("canvas");
            
            JsBarcode(canvas, product.barcodeData, {
                format: this.mapBarCodeTypeToJsBarcode(product.barcodeType),
                width: 2,
                height: 50,
                displayValue: true,
                fontSize: 12,
                margin: 10
            });

            const barcodeImage = canvas.toDataURL("image/png");

            const result: BarCodeResult = {
                id: uuidv4(),
                productId: product.id,
                barcodeType: product.barcodeType,
                data: product.barcodeData,
                imageUrl: barcodeImage,
                generatedAt: new Date(),
                isValid: true,
                source: product.barcodeSource || BarCodeSource.SAMPLE
            };
            
            results.push(result);

            // Agregar información del producto al PDF del catálogo
            const yPosition = 30 + (i % 8) * 100; // 8 productos por página
            
            if (i > 0 && i % 8 === 0) {
                catalogDoc.addPage();
                pageNumber++;
                catalogDoc.setFontSize(16);
                catalogDoc.text(`Página ${pageNumber}`, 10, 20);
                catalogDoc.setFontSize(12);
            }

            // Agregar el código de barras al catálogo
            catalogDoc.addImage(barcodeImage, "PNG", 10, yPosition, 80, 32);
            
            catalogDoc.text(`Producto: ${product.name}`, 10, yPosition + 40);
            catalogDoc.text(`SKU: ${product.sku}`, 10, yPosition + 50);
            catalogDoc.text(`Precio: $${product.price}`, 10, yPosition + 60);
            catalogDoc.text(`Categoría: ${product.category}`, 10, yPosition + 70);
            catalogDoc.text(`Código: ${product.barcodeData}`, 10, yPosition + 80);
        }

        // Guardar el catálogo
        catalogDoc.save("catalogo_codigos_barras.pdf");
        return results;
    }

    public validateBarCodeData(data: string, type: BarCodeType): boolean {
        const validation = BarCodeValidationService.validateBarCodeData(data, type);
        return validation.isValid;
    }

    private mapBarCodeTypeToJsBarcode(type: BarCodeType): string {
        switch (type) {
            case BarCodeType.EAN_13:
                return "EAN13";
            case BarCodeType.EAN_8:
                return "EAN8";
            case BarCodeType.UPC_A:
                return "UPC";
            case BarCodeType.CODE_128:
                return "CODE128";
            case BarCodeType.CODE_39:
                return "CODE39";
            case BarCodeType.ITF_14:
                return "ITF14";
            default:
                return "CODE128";
        }
    }

    // Método para generar códigos de barras de muestra (para demostración)
    public generateSampleCatalog(): void {
        const sampleProducts: Product[] = [
            {
                id: "1",
                name: "Laptop Gaming Pro",
                sku: "LAP-001",
                price: 1299.99,
                category: "Electrónicos",
                barcodeType: BarCodeType.EAN_13,
                barcodeSource: BarCodeSource.SAMPLE,
                barcodeData: BarCodeValidationService.generateSampleData(BarCodeType.EAN_13)
            },
            {
                id: "2",
                name: "Mouse Inalámbrico",
                sku: "MOU-002",
                price: 29.99,
                category: "Accesorios",
                barcodeType: BarCodeType.EAN_8,
                barcodeSource: BarCodeSource.SAMPLE,
                barcodeData: BarCodeValidationService.generateSampleData(BarCodeType.EAN_8)
            },
            {
                id: "3",
                name: "Teclado Mecánico",
                sku: "TEC-003",
                price: 89.99,
                category: "Accesorios",
                barcodeType: BarCodeType.CODE_128,
                barcodeSource: BarCodeSource.SAMPLE,
                barcodeData: "TEC-003-ABC"
            },
            {
                id: "4",
                name: "Monitor 4K",
                sku: "MON-004",
                price: 499.99,
                category: "Electrónicos",
                barcodeType: BarCodeType.UPC_A,
                barcodeSource: BarCodeSource.SAMPLE,
                barcodeData: BarCodeValidationService.generateSampleData(BarCodeType.UPC_A)
            },
            {
                id: "5",
                name: "Caja de Empaque",
                sku: "CAJ-005",
                price: 5.99,
                category: "Embalaje",
                barcodeType: BarCodeType.ITF_14,
                barcodeSource: BarCodeSource.SAMPLE,
                barcodeData: BarCodeValidationService.generateSampleData(BarCodeType.ITF_14)
            }
        ];

        this.generateMultipleBarCodes(sampleProducts);
    }

    // Método específico para generar un solo código de barras en PDF
    public async generateSingleBarCodePDF(data: string, type: BarCodeType): Promise<BarCodeResult> {
        try {
            // Validar los datos según el tipo de código de barras
            const validation = BarCodeValidationService.validateBarCodeData(data, type);
            
            if (!validation.isValid) {
                return {
                    id: uuidv4(),
                    productId: '',
                    barcodeType: type,
                    data: data,
                    generatedAt: new Date(),
                    isValid: false,
                    errorMessage: validation.errorMessage,
                    source: BarCodeSource.INTERNAL
                };
            }

            // Generar el código de barras
            const canvas = document.createElement("canvas");
            
            JsBarcode(canvas, data, {
                format: this.mapBarCodeTypeToJsBarcode(type),
                width: 2,
                height: 50,
                displayValue: true,
                fontSize: 12,
                margin: 10
            });

            const barcodeImage = canvas.toDataURL("image/png");

            // Crear un nuevo PDF para este código de barras
            const singleDoc = new jsPDF();
            
            // Agregar título
            singleDoc.setFontSize(16);
            singleDoc.text("Código de Barras - TechStorePlus", 10, 20);
            singleDoc.setFontSize(12);
            
            // Agregar el código de barras
            singleDoc.addImage(barcodeImage, "PNG", 10, 30, 100, 40);
            
            // Agregar información
            singleDoc.text(`Tipo: ${type}`, 10, 80);
            singleDoc.text(`Datos: ${data}`, 10, 90);
            singleDoc.text(`Generado: ${new Date().toLocaleString()}`, 10, 100);
            
            // Guardar el PDF
            singleDoc.save(`codigo_barras_${type}_${data}.pdf`);

            return {
                id: uuidv4(),
                productId: '',
                barcodeType: type,
                data: data,
                imageUrl: barcodeImage,
                generatedAt: new Date(),
                isValid: true,
                source: BarCodeSource.INTERNAL
            };

        } catch (error) {
            console.error("Error al generar el código de barras: ", error);
            return {
                id: uuidv4(),
                productId: '',
                barcodeType: type,
                data: data,
                generatedAt: new Date(),
                isValid: false,
                errorMessage: `Error técnico: ${error instanceof Error ? error.message : 'Error desconocido'}`,
                source: BarCodeSource.INTERNAL
            };
        }
    }
}
