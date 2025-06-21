import { BarCodeType } from '../interfaces/IBarCodeGenerator';

export class BarCodeValidationService {
    
    static validateBarCodeData(data: string, type: BarCodeType): { isValid: boolean; errorMessage?: string } {
        switch (type) {
            case BarCodeType.EAN_13:
                return this.validateEAN13(data);
            case BarCodeType.EAN_8:
                return this.validateEAN8(data);
            case BarCodeType.UPC_A:
                return this.validateUPCA(data);
            case BarCodeType.CODE_128:
                return this.validateCode128(data);
            case BarCodeType.CODE_39:
                return this.validateCode39(data);
            case BarCodeType.ITF_14:
                return this.validateITF14(data);
            default:
                return { isValid: false, errorMessage: 'Tipo de código de barras no soportado' };
        }
    }

    private static validateEAN13(data: string): { isValid: boolean; errorMessage?: string } {
        if (!/^\d{13}$/.test(data)) {
            return { isValid: false, errorMessage: 'EAN-13 debe tener exactamente 13 dígitos numéricos' };
        }
        
        // Validar dígito de control
        const digits = data.split('').map(Number);
        const checkDigit = digits[12];
        const calculatedCheckDigit = this.calculateEANCheckDigit(digits.slice(0, 12));
        
        if (checkDigit !== calculatedCheckDigit) {
            return { isValid: false, errorMessage: 'Dígito de control inválido para EAN-13' };
        }
        
        return { isValid: true };
    }

    private static validateEAN8(data: string): { isValid: boolean; errorMessage?: string } {
        if (!/^\d{8}$/.test(data)) {
            return { isValid: false, errorMessage: 'EAN-8 debe tener exactamente 8 dígitos numéricos' };
        }
        
        const digits = data.split('').map(Number);
        const checkDigit = digits[7];
        const calculatedCheckDigit = this.calculateEANCheckDigit(digits.slice(0, 7));
        
        if (checkDigit !== calculatedCheckDigit) {
            return { isValid: false, errorMessage: 'Dígito de control inválido para EAN-8' };
        }
        
        return { isValid: true };
    }

    private static validateUPCA(data: string): { isValid: boolean; errorMessage?: string } {
        if (!/^\d{12}$/.test(data)) {
            return { isValid: false, errorMessage: 'UPC-A debe tener exactamente 12 dígitos numéricos' };
        }
        
        const digits = data.split('').map(Number);
        const checkDigit = digits[11];
        const calculatedCheckDigit = this.calculateEANCheckDigit(digits.slice(0, 11));
        
        if (checkDigit !== calculatedCheckDigit) {
            return { isValid: false, errorMessage: 'Dígito de control inválido para UPC-A' };
        }
        
        return { isValid: true };
    }

    private static validateCode128(data: string): { isValid: boolean; errorMessage?: string } {
        if (data.length === 0 || data.length > 48) {
            return { isValid: false, errorMessage: 'CODE-128 debe tener entre 1 y 48 caracteres' };
        }
        
        // CODE-128 puede contener caracteres ASCII del 32 al 127
        if (!/^[\x20-\x7F]+$/.test(data)) {
            return { isValid: false, errorMessage: 'CODE-128 solo puede contener caracteres ASCII imprimibles' };
        }
        
        return { isValid: true };
    }

    private static validateCode39(data: string): { isValid: boolean; errorMessage?: string } {
        if (data.length === 0 || data.length > 43) {
            return { isValid: false, errorMessage: 'CODE-39 debe tener entre 1 y 43 caracteres' };
        }
        
        // CODE-39 puede contener: 0-9, A-Z, -, ., /, +, %, $, espacio
        if (!/^[0-9A-Z\-\.\/\+\%\$ ]+$/.test(data)) {
            return { isValid: false, errorMessage: 'CODE-39 solo puede contener dígitos, letras mayúsculas y símbolos específicos' };
        }
        
        return { isValid: true };
    }

    private static validateITF14(data: string): { isValid: boolean; errorMessage?: string } {
        if (!/^\d{14}$/.test(data)) {
            return { isValid: false, errorMessage: 'ITF-14 debe tener exactamente 14 dígitos numéricos' };
        }
        
        const digits = data.split('').map(Number);
        const checkDigit = digits[13];
        const calculatedCheckDigit = this.calculateEANCheckDigit(digits.slice(0, 13));
        
        if (checkDigit !== calculatedCheckDigit) {
            return { isValid: false, errorMessage: 'Dígito de control inválido para ITF-14' };
        }
        
        return { isValid: true };
    }

    static calculateEANCheckDigit(digits: number[]): number {
        let sum = 0;
        for (let i = 0; i < digits.length; i++) {
            sum += digits[i] * (i % 2 === 0 ? 1 : 3);
        }
        const remainder = sum % 10;
        return remainder === 0 ? 0 : 10 - remainder;
    }

    static generateSampleData(type: BarCodeType): string {
        switch (type) {
            case BarCodeType.EAN_13:
                return this.generateSampleEAN13();
            case BarCodeType.EAN_8:
                return this.generateSampleEAN8();
            case BarCodeType.UPC_A:
                return this.generateSampleUPCA();
            case BarCodeType.CODE_128:
                return 'SAMPLE123';
            case BarCodeType.CODE_39:
                return 'SAMPLE-123';
            case BarCodeType.ITF_14:
                return this.generateSampleITF14();
            default:
                return '';
        }
    }

    private static generateSampleEAN13(): string {
        // Generar 12 dígitos aleatorios
        const digits = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10));
        const checkDigit = this.calculateEANCheckDigit(digits);
        return digits.join('') + checkDigit;
    }

    private static generateSampleEAN8(): string {
        const digits = Array.from({ length: 7 }, () => Math.floor(Math.random() * 10));
        const checkDigit = this.calculateEANCheckDigit(digits);
        return digits.join('') + checkDigit;
    }

    private static generateSampleUPCA(): string {
        const digits = Array.from({ length: 11 }, () => Math.floor(Math.random() * 10));
        const checkDigit = this.calculateEANCheckDigit(digits);
        return digits.join('') + checkDigit;
    }

    private static generateSampleITF14(): string {
        const digits = Array.from({ length: 13 }, () => Math.floor(Math.random() * 10));
        const checkDigit = this.calculateEANCheckDigit(digits);
        return digits.join('') + checkDigit;
    }
} 