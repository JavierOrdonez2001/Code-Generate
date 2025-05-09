

interface ISaveCodeWithProduct {
    SaveCodeWithProduct(
        nombreProducto:string,
        imagenProductoUrl:string,
        recursoParaQR:string
    ):Promise<string>;
}

export default ISaveCodeWithProduct