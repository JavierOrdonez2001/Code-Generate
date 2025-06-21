import { 
    IProductManagement, 
    IProduct, 
    ProductFilters
} from '../interfaces/IProductManagement';
import { BarCodeValidationService } from './BarCodeValidationService';
import { 
    collection, 
    doc, 
    getDocs, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    query, 
    where, 
    Timestamp,
    getDoc
} from 'firebase/firestore';
import { db } from '../../firebase/firebase';

export class ProductService implements IProductManagement {
    
    private collectionName = 'products';

    // CRUD Operations
    async addProduct(productData: Omit<IProduct, 'id' | 'createdAt' | 'updatedAt'>): Promise<IProduct> {
        try {
            const now = new Date();
            
            // Si no se proporciona código de barras, generar uno automáticamente
            let barcodeData = productData.barcodeData;
            if (!barcodeData) {
                const baseCode = productData.sku.replace(/\s+/g, '').toUpperCase();
                const timestamp = Date.now().toString().slice(-6);
                barcodeData = `${baseCode}-${timestamp}`;
            }

            // Validar que el código de barras sea único
            const isUnique = await this.validateBarcodeUniqueness(barcodeData);
            if (!isUnique) {
                throw new Error('El código de barras ya existe en la base de datos');
            }

            // Validar el código de barras según su tipo
            const validation = BarCodeValidationService.validateBarCodeData(
                barcodeData, 
                productData.barcodeType
            );
            if (!validation.isValid) {
                throw new Error(`Código de barras inválido: ${validation.errorMessage}`);
            }

            const productToSave = {
                ...productData,
                barcodeData,
                isActive: true,
                createdAt: Timestamp.fromDate(now),
                updatedAt: Timestamp.fromDate(now)
            };

            // Guardar en Firebase
            const docRef = await addDoc(collection(db, this.collectionName), productToSave);
            
            // Crear el producto con el ID de Firebase
            const product: IProduct = {
                ...productToSave,
                id: docRef.id,
                createdAt: now,
                updatedAt: now
            };

            return product;
        } catch (error) {
            console.error('Error adding product:', error);
            throw error;
        }
    }

    async updateProduct(id: string, productData: Partial<IProduct>): Promise<IProduct> {
        try {
            const docRef = doc(db, this.collectionName, id);
            
            // Si se está actualizando el código de barras, validar que sea único
            if (productData.barcodeData) {
                const isUnique = await this.validateBarcodeUniqueness(productData.barcodeData, id);
                if (!isUnique) {
                    throw new Error('El código de barras ya existe en la base de datos');
                }

                // Validar el código de barras según su tipo
                if (productData.barcodeType) {
                    const validation = BarCodeValidationService.validateBarCodeData(
                        productData.barcodeData, 
                        productData.barcodeType
                    );
                    if (!validation.isValid) {
                        throw new Error(`Código de barras inválido: ${validation.errorMessage}`);
                    }
                }
            }

            const updateData = {
                ...productData,
                updatedAt: Timestamp.fromDate(new Date())
            };

            await updateDoc(docRef, updateData);

            // Retornar el producto actualizado
            const updatedProduct = await this.getProduct(id);
            if (!updatedProduct) {
                throw new Error('Producto no encontrado después de la actualización');
            }

            return updatedProduct;
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    }

    async deleteProduct(id: string): Promise<boolean> {
        try {
            await deleteDoc(doc(db, this.collectionName, id));
            return true;
        } catch (error) {
            console.error('Error deleting product:', error);
            return false;
        }
    }

    async getProduct(id: string): Promise<IProduct | null> {
        try {
            const docRef = doc(db, this.collectionName, id);
            const docSnap = await getDoc(docRef);
            
            if (!docSnap.exists()) {
                return null;
            }

            const data = docSnap.data();
            
            return {
                id: docSnap.id,
                ...data,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date()
            } as IProduct;
        } catch (error) {
            console.error('Error getting product:', error);
            return null;
        }
    }

    async getAllProducts(): Promise<IProduct[]> {
        try {
            // Simplificar la consulta para evitar el índice compuesto
            const querySnapshot = await getDocs(
                query(
                    collection(db, this.collectionName),
                    where('isActive', '==', true)
                )
            );

            // Ordenar en memoria en lugar de en la consulta
            const products = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    createdAt: data.createdAt?.toDate() || new Date(),
                    updatedAt: data.updatedAt?.toDate() || new Date()
                } as IProduct;
            });

            // Ordenar por fecha de creación (más reciente primero)
            return products.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        } catch (error) {
            console.error('Error getting all products:', error);
            return [];
        }
    }

    // Barcode Operations
    async getProductByBarcode(barcodeData: string): Promise<IProduct | null> {
        try {
            const querySnapshot = await getDocs(
                query(
                    collection(db, this.collectionName),
                    where('barcodeData', '==', barcodeData),
                    where('isActive', '==', true)
                )
            );

            if (querySnapshot.empty) {
                return null;
            }

            const docSnapshot = querySnapshot.docs[0];
            const data = docSnapshot.data();
            
            return {
                id: docSnapshot.id,
                ...data,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date()
            } as IProduct;
        } catch (error) {
            console.error('Error getting product by barcode:', error);
            return null;
        }
    }

    async generateBarcodeForProduct(productId: string): Promise<string> {
        try {
            const product = await this.getProduct(productId);
            if (!product) {
                throw new Error('Producto no encontrado');
            }

            // Generar un código de barras único basado en el SKU
            const baseCode = product.sku.replace(/\s+/g, '').toUpperCase();
            const timestamp = Date.now().toString().slice(-6);
            const generatedCode = `${baseCode}-${timestamp}`;

            // Validar que sea único
            const isUnique = await this.validateBarcodeUniqueness(generatedCode);
            if (!isUnique) {
                // Si no es único, agregar más dígitos
                const randomDigits = Math.random().toString().slice(2, 6);
                return `${generatedCode}-${randomDigits}`;
            }

            return generatedCode;
        } catch (error) {
            console.error('Error generating barcode for product:', error);
            throw error;
        }
    }

    async validateBarcodeUniqueness(barcodeData: string, excludeId?: string): Promise<boolean> {
        try {
            const querySnapshot = await getDocs(
                query(
                    collection(db, this.collectionName),
                    where('barcodeData', '==', barcodeData),
                    where('isActive', '==', true)
                )
            );

            if (querySnapshot.empty) {
                return true;
            }

            // Si se está excluyendo un ID (para actualizaciones), verificar que no sea el mismo producto
            if (excludeId) {
                const existingProduct = querySnapshot.docs[0];
                return existingProduct.id === excludeId;
            }

            return false;
        } catch (error) {
            console.error('Error validating barcode uniqueness:', error);
            return false;
        }
    }

    // Inventory Operations
    async updateStock(productId: string, quantity: number, operation: 'add' | 'subtract'): Promise<IProduct> {
        try {
            const product = await this.getProduct(productId);
            if (!product) {
                throw new Error('Producto no encontrado');
            }

            const newStock = operation === 'add' 
                ? product.stock + quantity 
                : Math.max(0, product.stock - quantity);

            const updatedProduct = await this.updateProduct(productId, {
                stock: newStock,
                updatedAt: new Date()
            });

            return updatedProduct;
        } catch (error) {
            console.error('Error updating stock:', error);
            throw error;
        }
    }

    async getLowStockProducts(): Promise<IProduct[]> {
        try {
            const allProducts = await this.getAllProducts();
            return allProducts.filter(product => product.stock <= product.minStock);
        } catch (error) {
            console.error('Error getting low stock products:', error);
            return [];
        }
    }

    async getProductsByCategory(category: string): Promise<IProduct[]> {
        try {
            const querySnapshot = await getDocs(
                query(
                    collection(db, this.collectionName),
                    where('category', '==', category),
                    where('isActive', '==', true)
                )
            );

            const products = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    createdAt: data.createdAt?.toDate() || new Date(),
                    updatedAt: data.updatedAt?.toDate() || new Date()
                } as IProduct;
            });

            // Ordenar por fecha de creación (más reciente primero)
            return products.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        } catch (error) {
            console.error('Error getting products by category:', error);
            return [];
        }
    }

    // Search and Filter
    async searchProducts(query: string): Promise<IProduct[]> {
        try {
            const allProducts = await this.getAllProducts();
            const searchTerm = query.toLowerCase();

            return allProducts.filter(product => 
                product.name.toLowerCase().includes(searchTerm) ||
                product.sku.toLowerCase().includes(searchTerm) ||
                product.description?.toLowerCase().includes(searchTerm) ||
                product.barcodeData.toLowerCase().includes(searchTerm)
            );
        } catch (error) {
            console.error('Error searching products:', error);
            return [];
        }
    }

    async filterProducts(filters: ProductFilters): Promise<IProduct[]> {
        try {
            let allProducts = await this.getAllProducts();

            if (filters.category) {
                allProducts = allProducts.filter(p => p.category === filters.category);
            }

            if (filters.supplier) {
                allProducts = allProducts.filter(p => p.supplier === filters.supplier);
            }

            if (filters.minPrice !== undefined) {
                allProducts = allProducts.filter(p => p.price >= filters.minPrice!);
            }

            if (filters.maxPrice !== undefined) {
                allProducts = allProducts.filter(p => p.price <= filters.maxPrice!);
            }

            if (filters.inStock !== undefined) {
                if (filters.inStock) {
                    allProducts = allProducts.filter(p => p.stock > 0);
                } else {
                    allProducts = allProducts.filter(p => p.stock === 0);
                }
            }

            if (filters.barcodeType) {
                allProducts = allProducts.filter(p => p.barcodeType === filters.barcodeType);
            }

            return allProducts;
        } catch (error) {
            console.error('Error filtering products:', error);
            return [];
        }
    }

    // Utility methods
    async getCategories(): Promise<string[]> {
        try {
            const products = await this.getAllProducts();
            const categories = new Set(products.map(p => p.category));
            return Array.from(categories).sort();
        } catch (error) {
            console.error('Error getting categories:', error);
            return [];
        }
    }

    async getSuppliers(): Promise<string[]> {
        try {
            const products = await this.getAllProducts();
            const suppliers = new Set(products.map(p => p.supplier).filter((s): s is string => Boolean(s)));
            return Array.from(suppliers).sort();
        } catch (error) {
            console.error('Error getting suppliers:', error);
            return [];
        }
    }
} 