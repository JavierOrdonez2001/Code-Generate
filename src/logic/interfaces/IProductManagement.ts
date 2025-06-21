import { BarCodeType, BarCodeSource } from './IBarCodeGenerator';

export interface IProduct {
    id: string;
    name: string;
    sku: string;
    description?: string;
    price: number;
    cost: number;
    category: string;
    supplier?: string;
    barcodeType: BarCodeType;
    barcodeData: string;
    barcodeSource: BarCodeSource;
    stock: number;
    minStock: number;
    maxStock: number;
    location?: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
}

export interface IProductManagement {
    // CRUD Operations
    addProduct(product: Omit<IProduct, 'id' | 'createdAt' | 'updatedAt'>): Promise<IProduct>;
    updateProduct(id: string, product: Partial<IProduct>): Promise<IProduct>;
    deleteProduct(id: string): Promise<boolean>;
    getProduct(id: string): Promise<IProduct | null>;
    getAllProducts(): Promise<IProduct[]>;
    
    // Barcode Operations
    getProductByBarcode(barcodeData: string): Promise<IProduct | null>;
    generateBarcodeForProduct(productId: string): Promise<string>;
    validateBarcodeUniqueness(barcodeData: string): Promise<boolean>;
    
    // Inventory Operations
    updateStock(productId: string, quantity: number, operation: 'add' | 'subtract'): Promise<IProduct>;
    getLowStockProducts(): Promise<IProduct[]>;
    getProductsByCategory(category: string): Promise<IProduct[]>;
    
    // Search and Filter
    searchProducts(query: string): Promise<IProduct[]>;
    filterProducts(filters: ProductFilters): Promise<IProduct[]>;
}

export interface ProductFilters {
    category?: string;
    supplier?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    barcodeType?: BarCodeType;
}

export interface ProductImportResult {
    success: number;
    failed: number;
    errors: string[];
}

// Para importación masiva de productos
export interface IProductImporter {
    importFromCSV(csvData: string): Promise<ProductImportResult>;
    importFromExcel(excelData: any): Promise<ProductImportResult>;
    exportToCSV(products: IProduct[]): Promise<string>;
    exportToExcel(products: IProduct[]): Promise<any>;
} 