import { IBarCodeGenerator, BarCodeType, Product, BarCodeResult } from '../interfaces/IBarCodeGenerator.ts';

class BarCodeService {
    private bar_code_generator: IBarCodeGenerator; 

    public constructor(bar_code_generator: IBarCodeGenerator){
        this.bar_code_generator = bar_code_generator;
    }

    public async generateBarCode(data: string, type: BarCodeType): Promise<BarCodeResult> {
        return await this.bar_code_generator.generateBarCode(data, type);
    }

    public async generateMultipleBarCodes(products: Product[]): Promise<BarCodeResult[]> {
        return await this.bar_code_generator.generateMultipleBarCodes(products);
    }

    public validateBarCodeData(data: string, type: BarCodeType): boolean {
        return this.bar_code_generator.validateBarCodeData(data, type);
    }

    // Método legacy para compatibilidad
    public GenerateBarCode(): string {
        console.warn('Método GenerateBarCode() está deprecado. Usa generateBarCode() en su lugar.');
        this.bar_code_generator.generateBarCode('1234567890123', BarCodeType.EAN_13);
        return 'codigo generado';
    }
}

export default BarCodeService;