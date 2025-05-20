import ISaveCodeWithProduct from "../interfaces/ISaveCodeWithProduct"


class SaveCodeWithProductService{
    private saveCodeWithProduct:ISaveCodeWithProduct;

    constructor(saveCodeWithProduct:ISaveCodeWithProduct){
        this.saveCodeWithProduct = saveCodeWithProduct;
    }

    public async SaveCodeWithProduct(
        nombreProducto: string,
        imagenProductoUrl: string,
        recursoParaQR: string
    ): Promise<{
        id: string;
        barcodeBase64: string;
        qrBase64: string;
    }> {
        return await this.saveCodeWithProduct.SaveCodeWithProduct(nombreProducto, imagenProductoUrl, recursoParaQR);
    }
}


export default SaveCodeWithProductService