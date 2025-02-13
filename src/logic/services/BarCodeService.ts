import GenerateBarCodePDF from '../repositories/GenerateBarCode.ts';
import IBarCodeGenerator from '../interfaces/IBarCodeGenerator.ts';
import BarCodeGenerator from '../business/BarCodeGenerator.ts';



const generateBarCodePDF:IBarCodeGenerator = new GenerateBarCodePDF();

export const businessBarCode =  new BarCodeGenerator(generateBarCodePDF);
