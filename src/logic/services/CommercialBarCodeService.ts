import { BarCodeType, CommercialBarCodeInfo, BarCodeSource } from '../interfaces/IBarCodeGenerator.ts';
import { BarCodeValidationService } from './BarCodeValidationService.ts';

export class CommercialBarCodeService {
    
    // Prefijos GS1 de ejemplo (en la realidad, estos se obtienen registrándose en GS1)
    private static readonly GS1_PREFIXES = {
        '400781': { company: 'TechStorePlus', country: 'Alemania' },
        '049000': { company: 'Coca-Cola', country: 'Estados Unidos' },
        '750100': { company: 'Bimbo', country: 'México' },
        '789123': { company: 'Empresa Ejemplo', country: 'Brasil' }
    };

    /**
     * Verifica si un código comercial está registrado
     */
    static isCommercialCodeRegistered(fullCode: string, type: BarCodeType): boolean {
        const validation = BarCodeValidationService.validateBarCodeData(fullCode, type);
        if (!validation.isValid) return false;

        // Extraer el prefijo GS1
        const prefix = this.extractGS1Prefix(fullCode, type);
        return prefix in this.GS1_PREFIXES;
    }

    /**
     * Extrae el prefijo GS1 de un código completo
     */
    static extractGS1Prefix(fullCode: string, type: BarCodeType): string {
        switch (type) {
            case BarCodeType.EAN_13:
                return fullCode.substring(0, 6); // Primeros 6 dígitos
            case BarCodeType.EAN_8:
                return fullCode.substring(0, 4); // Primeros 4 dígitos
            case BarCodeType.UPC_A:
                return fullCode.substring(0, 6); // Primeros 6 dígitos
            case BarCodeType.ITF_14:
                return fullCode.substring(0, 6); // Primeros 6 dígitos
            default:
                return '';
        }
    }

    /**
     * Obtiene información del código comercial
     */
    static getCommercialBarCodeInfo(fullCode: string, type: BarCodeType): CommercialBarCodeInfo | null {
        const validation = BarCodeValidationService.validateBarCodeData(fullCode, type);
        if (!validation.isValid) return null;

        const prefix = this.extractGS1Prefix(fullCode, type);
        const companyInfo = this.GS1_PREFIXES[prefix as keyof typeof this.GS1_PREFIXES];

        if (!companyInfo) return null;

        return {
            gs1Prefix: prefix,
            productCode: this.extractProductCode(fullCode, type),
            checkDigit: fullCode.slice(-1),
            fullCode: fullCode,
            isRegistered: true,
            registrationDate: new Date() // En la realidad, esto vendría de la base de datos
        };
    }

    /**
     * Extrae el código del producto del código completo
     */
    private static extractProductCode(fullCode: string, type: BarCodeType): string {
        switch (type) {
            case BarCodeType.EAN_13:
                return fullCode.substring(6, 12); // Dígitos 7-12
            case BarCodeType.EAN_8:
                return fullCode.substring(4, 7); // Dígitos 5-7
            case BarCodeType.UPC_A:
                return fullCode.substring(6, 11); // Dígitos 7-11
            case BarCodeType.ITF_14:
                return fullCode.substring(6, 13); // Dígitos 7-13
            default:
                return '';
        }
    }

    /**
     * Genera un código comercial de muestra (para demostración)
     */
    static generateSampleCommercialCode(type: BarCodeType): CommercialBarCodeInfo {
        const samplePrefixes = Object.keys(this.GS1_PREFIXES);
        const randomPrefix = samplePrefixes[Math.floor(Math.random() * samplePrefixes.length)];
        
        let productCode: string;
        let fullCode: string;

        switch (type) {
            case BarCodeType.EAN_13:
                productCode = Math.random().toString().substring(2, 8); // 6 dígitos
                fullCode = randomPrefix + productCode + '0'; // + dígito temporal
                break;
            case BarCodeType.EAN_8:
                productCode = Math.random().toString().substring(2, 5); // 3 dígitos
                fullCode = randomPrefix.substring(0, 4) + productCode + '0'; // + dígito temporal
                break;
            case BarCodeType.UPC_A:
                productCode = Math.random().toString().substring(2, 7); // 5 dígitos
                fullCode = randomPrefix + productCode + '0'; // + dígito temporal
                break;
            case BarCodeType.ITF_14:
                productCode = Math.random().toString().substring(2, 9); // 7 dígitos
                fullCode = randomPrefix + productCode + '0'; // + dígito temporal
                break;
            default:
                throw new Error('Tipo de código comercial no soportado');
        }

        // Calcular dígito de control correcto
        const checkDigit = BarCodeValidationService.calculateEANCheckDigit(
            fullCode.slice(0, -1).split('').map(Number)
        );
        fullCode = fullCode.slice(0, -1) + checkDigit;

        return {
            gs1Prefix: randomPrefix,
            productCode: productCode,
            checkDigit: checkDigit.toString(),
            fullCode: fullCode,
            isRegistered: true,
            registrationDate: new Date()
        };
    }

    /**
     * Valida si un código comercial puede ser usado
     */
    static validateCommercialCode(fullCode: string, type: BarCodeType): { 
        isValid: boolean; 
        errorMessage?: string; 
        info?: CommercialBarCodeInfo 
    } {
        // Validar formato
        const validation = BarCodeValidationService.validateBarCodeData(fullCode, type);
        if (!validation.isValid) {
            return { isValid: false, errorMessage: validation.errorMessage };
        }

        // Verificar si está registrado
        const info = this.getCommercialBarCodeInfo(fullCode, type);
        if (!info) {
            return { 
                isValid: false, 
                errorMessage: 'Código comercial no registrado. Debes obtener un prefijo GS1 válido.' 
            };
        }

        return { isValid: true, info };
    }

    /**
     * Obtiene información de la empresa por prefijo
     */
    static getCompanyInfo(prefix: string): { company: string; country: string } | null {
        return this.GS1_PREFIXES[prefix as keyof typeof this.GS1_PREFIXES] || null;
    }

    /**
     * Lista de prefijos disponibles (para demostración)
     */
    static getAvailablePrefixes(): Array<{ prefix: string; company: string; country: string }> {
        return Object.entries(this.GS1_PREFIXES).map(([prefix, info]) => ({
            prefix,
            company: info.company,
            country: info.country
        }));
    }
} 