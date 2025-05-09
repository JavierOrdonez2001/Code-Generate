import ISaveCodeWithProduct from "../interfaces/ISaveCodeWithProduct";
import JsBarcode from "jsbarcode";
import QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

class SaveCodeWithProduct implements ISaveCodeWithProduct {
  async SaveCodeWithProduct(nombreProducto: string, imagenProductoUrl: string, recursoParaQR: string): Promise<string> {
    try {
      const uniqueCode = uuidv4();

      // Generar código de barras como base64
      const barcodeCanvas = document.createElement("canvas");
      JsBarcode(barcodeCanvas, uniqueCode, {
        format: "CODE128",
        width: 2,
        height: 50,
        displayValue: true,
      });
      const barcodeBase64 = barcodeCanvas.toDataURL("image/png");

      // Generar código QR como base64
      const qrBase64 = await QRCode.toDataURL(recursoParaQR, { width: 200 });

      // Guardar todo en Firestore
      const docRef = await addDoc(collection(db, "products"), {
        nombre: nombreProducto,
        imagenProducto: imagenProductoUrl,
        barcodeBase64,
        qrBase64,
        fecha: new Date(),
      });

      console.log("✅ Producto guardado con imágenes en base64 correctamente en Firestore.");
      return docRef.id;
    } catch (error) {
      console.error("❌ Error al guardar el producto con imágenes base64:", error);
      throw error;
    }
  }
}

export default SaveCodeWithProduct;
