import { ProductService } from '../services/ProductService';
import { IProduct, ProductFilters } from '../interfaces/IProductManagement';
import { BarCodeType, BarCodeSource } from '../interfaces/IBarCodeGenerator';

const productService = new ProductService();

export const productBusiness = {
    // CRUD Operations
    async addProduct(productData: Omit<IProduct, 'id' | 'createdAt' | 'updatedAt'>): Promise<IProduct> {
        return await productService.addProduct(productData);
    },

    async updateProduct(id: string, productData: Partial<IProduct>): Promise<IProduct> {
        return await productService.updateProduct(id, productData);
    },

    async deleteProduct(id: string): Promise<boolean> {
        return await productService.deleteProduct(id);
    },

    async getProduct(id: string): Promise<IProduct | null> {
        return await productService.getProduct(id);
    },

    async getAllProducts(): Promise<IProduct[]> {
        return await productService.getAllProducts();
    },

    // Barcode Operations
    async getProductByBarcode(barcodeData: string): Promise<IProduct | null> {
        return await productService.getProductByBarcode(barcodeData);
    },

    async generateBarcodeForProduct(productId: string): Promise<string> {
        return await productService.generateBarcodeForProduct(productId);
    },

    async validateBarcodeUniqueness(barcodeData: string, excludeId?: string): Promise<boolean> {
        return await productService.validateBarcodeUniqueness(barcodeData, excludeId);
    },

    // Inventory Operations
    async updateStock(productId: string, quantity: number, operation: 'add' | 'subtract'): Promise<IProduct> {
        return await productService.updateStock(productId, quantity, operation);
    },

    async getLowStockProducts(): Promise<IProduct[]> {
        return await productService.getLowStockProducts();
    },

    async getProductsByCategory(category: string): Promise<IProduct[]> {
        return await productService.getProductsByCategory(category);
    },

    // Search and Filter
    async searchProducts(query: string): Promise<IProduct[]> {
        return await productService.searchProducts(query);
    },

    async filterProducts(filters: ProductFilters): Promise<IProduct[]> {
        return await productService.filterProducts(filters);
    },

    // Utility methods
    async getCategories(): Promise<string[]> {
        return await productService.getCategories();
    },

    async getSuppliers(): Promise<string[]> {
        return await productService.getSuppliers();
    },

    // Business logic methods
    async createProductWithBarcode(productData: {
        name: string;
        sku: string;
        description?: string;
        price: number;
        cost: number;
        category: string;
        supplier?: string;
        barcodeType: BarCodeType;
        barcodeData?: string;
        barcodeSource: BarCodeSource;
        stock: number;
        minStock: number;
        maxStock: number;
        location?: string;
    }): Promise<IProduct> {
        // El servicio ahora maneja la generación automática del código de barras
        return await this.addProduct({
            ...productData,
            barcodeData: productData.barcodeData || "", // Proporcionar string vacío si no hay código
            isActive: true
        });
    },

    async updateProductStock(productId: string, quantity: number, operation: 'add' | 'subtract'): Promise<IProduct> {
        const product = await this.getProduct(productId);
        if (!product) {
            throw new Error('Producto no encontrado');
        }

        const newStock = operation === 'add' 
            ? product.stock + quantity 
            : Math.max(0, product.stock - quantity);

        // Verificar si el stock está por debajo del mínimo
        if (newStock <= product.minStock) {
            console.warn(`⚠️ Stock bajo para ${product.name}: ${newStock}/${product.minStock}`);
        }

        return await this.updateStock(productId, quantity, operation);
    },

    async getInventorySummary(): Promise<{
        totalProducts: number;
        totalValue: number;
        totalCost: number;
        lowStockProducts: number;
        outOfStockProducts: number;
    }> {
        const products = await this.getAllProducts();
        
        const totalProducts = products.length;
        const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
        const totalCost = products.reduce((sum, p) => sum + (p.cost * p.stock), 0);
        const lowStockProducts = products.filter(p => p.stock <= p.minStock && p.stock > 0).length;
        const outOfStockProducts = products.filter(p => p.stock === 0).length;

        return {
            totalProducts,
            totalValue,
            totalCost,
            lowStockProducts,
            outOfStockProducts
        };
    }
}; 