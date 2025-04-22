import IQrCodeGenerator from "../interfaces/IQrCodeGenerator.ts";


class QRCodeService {
    private qr_code_generator:IQrCodeGenerator;

    constructor(qr_code_generator: IQrCodeGenerator){
        this.qr_code_generator = qr_code_generator;
    }

    public generateQRCode(resource:string):string{
        this.qr_code_generator.GenerateQRCode(resource);
        return "Codigo QR generado"
    }
}


export default QRCodeService
