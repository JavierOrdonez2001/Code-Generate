import GenerateBarCodePDF from '../repositories/GenerateBarCode.ts';
import IBarCodeGenerator from '../interfaces/IBarCodeGenerator.ts';
import BarCodeService from '../services/BarCodeService.ts';



const generateBarCodePDF:IBarCodeGenerator = new GenerateBarCodePDF();

export const businessBarCode =  new BarCodeService(generateBarCodePDF);
