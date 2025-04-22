import IBarCodeGenerator   from '../interfaces/IBarCodeGenerator.ts';

class BarCodeService {
    private bar_code_generator: IBarCodeGenerator; 

    public constructor(bar_code_generator: IBarCodeGenerator){
        this.bar_code_generator = bar_code_generator;
    }

    public GenerateBarCode(): string {
        this.bar_code_generator.GenerateBarCode();
        return 'codigo generado';
    }
}

export default BarCodeService