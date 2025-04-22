interface IQrCodeGenerator {
    GenerateQRCode(resource:string):Promise<void>;
}

export default IQrCodeGenerator