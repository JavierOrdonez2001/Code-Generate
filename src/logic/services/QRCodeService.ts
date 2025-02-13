import QRCodeGenerator from "../business/QRCodeGenerator.ts";
import IQrCodeGenerator from "../interfaces/IQrCodeGenerator.ts";
import GenerateQRCode from "../repositories/GenerateQRCode.ts";


const generateQRCodePDF:IQrCodeGenerator = new GenerateQRCode();

export const businessQRCode = new QRCodeGenerator(generateQRCodePDF);