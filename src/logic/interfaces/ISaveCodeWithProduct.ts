

interface ISaveCodeWithProduct {
   SaveCodeWithProduct(
        nombreProducto: string,
        imagenProductoUrl: string,
        recursoParaQR: string
    ): Promise<{
        id: string;
        barcodeBase64: string;
        qrBase64: string;
    }>;
}

export default ISaveCodeWithProduct