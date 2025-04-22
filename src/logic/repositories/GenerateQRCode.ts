import IQrCodeGenerator from '../interfaces/IQrCodeGenerator.ts';
import QRCode  from "qrcode";
import jsPDF from "jspdf";


class GenerateQRCode implements IQrCodeGenerator{

    private document_PDF:jsPDF;

    constructor(){
        this.document_PDF = new jsPDF;
    }

    public async GenerateQRCode(resource:string):Promise<void>{
        try{
            const QRDataResource = await QRCode.toDataURL(resource, { width: 200 });

            this.document_PDF.text("Escanea el código QR:", 10, 10);

            this.document_PDF.addImage(QRDataResource, "PNG", 10, 20, 50, 50);

            this.document_PDF.save("qr_code.pdf");

            console.log('codigo qr generado')
        }catch(error){
            console.error("❌ Error al generar el código QR:", error);
        }   
    };
}


export default GenerateQRCode