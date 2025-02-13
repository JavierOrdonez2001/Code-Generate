import IBarCodeGenerator from "../interfaces/IBarCodeGenerator.ts";
import { jsPDF } from "jspdf";
import JsBarcode from "jsbarcode";
import { v4 as uuidv4 } from "uuid"; 

class GenerateBarCodePDF implements IBarCodeGenerator {

    private doc: jsPDF;

    public constructor(){
        this.doc = new jsPDF
    }

    public GenerateBarCode():void {
        try {
            let x = 10;
            let y = 20;
            const width = 100;
            const height = 40;
            const verticalSpacing = 10;
            const pageHeight = 296;
            
            for(let i = 0; i <= 100; i++){  //tarea que se va a repetir 100 veces
                const canvas = document.createElement("canvas");
                const uniqueCode = uuidv4();
                
                JsBarcode(canvas, uniqueCode, {
                    format: "CODE128",
                    width: 2,
                    height: 50,
                    displayValue: true,
                });

                const barcodeImage = canvas.toDataURL("image/png");

                this.doc.addImage(barcodeImage, "PNG", x, y, width, height);
                
                y += height + verticalSpacing
                
                if (y + height > pageHeight - 10){
                    this.doc.addPage();
                    y = 20;
                }
                
                console.log(`${i} ) proceso completado`)
            }
            
            
            this.doc.save("barcode.pdf");
        } catch (error) {
            console.error("Error al generar el código de barras: ", error);
        }
    }
}

export default GenerateBarCodePDF;
