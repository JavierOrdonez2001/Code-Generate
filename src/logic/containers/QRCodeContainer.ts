import QRCodeService from "../services/QRCodeService.ts";
import IQrCodeGenerator from "../interfaces/IQrCodeGenerator.ts";
import GenerateQRCode from "../repositories/GenerateQRCode.ts";


const generateQRCodePDF:IQrCodeGenerator = new GenerateQRCode();

export const businessQRCode = new QRCodeService(generateQRCodePDF);