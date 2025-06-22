import { useEffect, useState } from "react";
import { productBusiness } from "../logic/containers/ProductContainer";
import { IProduct } from "../logic/interfaces/IProductManagement";
import { BarCodeType, BarCodeSource } from "../logic/interfaces/IBarCodeGenerator";
import { barCodeBusiness } from "../logic/containers/BarCodeContainer";
import BarNavegation from "../components/BarNavegation";
import Modal from "../components/Modal";
import InventorySummary from "../components/InventorySummary";
import { AnimatePresence, motion } from "framer-motion";

function ProductManagment() {
  // State for products
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // State for forms
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

  // Separate form data for creating and editing products
  const [createFormData, setCreateFormData] = useState({
    name: "",
    sku: "",
    description: "",
    price: 0,
    cost: 0,
    category: "",
    supplier: "",
    barcodeType: BarCodeType.CODE_128 as BarCodeType,
    barcodeData: "",
    barcodeSource: BarCodeSource.INTERNAL as BarCodeSource,
    stock: 0,
    minStock: 0,
    maxStock: 100,
    location: ""
  });

  const [editFormData, setEditFormData] = useState({
    name: "",
    sku: "",
    description: "",
    price: 0,
    cost: 0,
    category: "",
    supplier: "",
    barcodeType: BarCodeType.CODE_128 as BarCodeType,
    barcodeData: "",
    barcodeSource: BarCodeSource.INTERNAL as BarCodeSource,
    stock: 0,
    minStock: 0,
    maxStock: 100,
    location: ""
  });

  // Stock update form
  const [stockUpdate, setStockUpdate] = useState({
    quantity: 0,
    operation: "add" as "add" | "subtract"
  });

  // Load products and categories
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      console.log("🔄 Iniciando carga de productos...");
      const productsData = await productBusiness.getAllProducts();
      console.log("📦 Productos cargados:", productsData);
      console.log("📊 Cantidad de productos:", productsData.length);
      setProducts(productsData);
      setRefreshTrigger(prev => prev + 1); // Trigger summary refresh
      console.log("✅ Productos establecidos en el estado");
    } catch (error) {
      console.error("❌ Error loading products:", error);
      alert("Error al cargar los productos");
    } finally {
      setLoading(false);
      console.log("🏁 Carga de productos completada");
    }
  };

  const loadCategories = async () => {
    try {
      const categoriesData = await productBusiness.getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.barcodeData.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Handle form submission for creating product
  const handleCreateProduct = async () => {
    try {
      console.log("🚀 Iniciando creación de producto...");
      console.log("📝 Datos del formulario:", createFormData);
      
      if (!createFormData.name || !createFormData.sku || !createFormData.category) {
        alert("Por favor completa los campos obligatorios (Nombre, SKU, Categoría)");
        return;
      }

      console.log("✅ Validación de campos completada");
      const createdProduct = await productBusiness.createProductWithBarcode(createFormData);
      console.log("🎉 Producto creado:", createdProduct);
      
      alert("✅ Producto creado exitosamente");
      setIsCreateModalOpen(false);
      resetCreateForm();
      
      console.log("🔄 Recargando productos...");
      await loadProducts();
      console.log("✅ Recarga completada");
    } catch (error) {
      console.error("❌ Error creating product:", error);
      alert(`Error al crear el producto: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  // Handle form submission for updating product
  const handleUpdateProduct = async () => {
    try {
      if (!selectedProduct) return;

      if (!editFormData.name || !editFormData.sku || !editFormData.category) {
        alert("Por favor completa los campos obligatorios");
        return;
      }

      await productBusiness.updateProduct(selectedProduct.id, editFormData);
      alert("✅ Producto actualizado exitosamente");
      setIsEditModalOpen(false);
      resetEditForm();
      await loadProducts();
    } catch (error) {
      console.error("Error updating product:", error);
      alert(`Error al actualizar el producto: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  // Handle stock update
  const handleStockUpdate = async () => {
    try {
      if (!selectedProduct) return;

      await productBusiness.updateProductStock(
        selectedProduct.id, 
        stockUpdate.quantity, 
        stockUpdate.operation
      );
      alert("✅ Stock actualizado exitosamente");
      setIsStockModalOpen(false);
      setStockUpdate({ quantity: 0, operation: "add" });
      await loadProducts();
    } catch (error) {
      console.error("Error updating stock:", error);
      alert(`Error al actualizar el stock: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  // Handle product deletion
  const handleDeleteProduct = async (product: IProduct) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar el producto "${product.name}"?`)) {
      return;
    }

    try {
      await productBusiness.deleteProduct(product.id);
      alert("✅ Producto eliminado exitosamente");
      await loadProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error al eliminar el producto");
    }
  };

  // Generate barcode PDF for product
  const handleGenerateBarcodePDF = async (product: IProduct) => {
    try {
      await barCodeBusiness.generateSingleBarCodePDF(product.barcodeData, product.barcodeType);
      alert("✅ PDF del código de barras generado exitosamente");
    } catch (error) {
      console.error("Error generating barcode PDF:", error);
      alert("Error al generar el PDF del código de barras");
    }
  };

  // Reset create form data
  const resetCreateForm = () => {
    setCreateFormData({
      name: "",
      sku: "",
      description: "",
      price: 0,
      cost: 0,
      category: "",
      supplier: "",
      barcodeType: BarCodeType.CODE_128,
      barcodeData: "",
      barcodeSource: BarCodeSource.INTERNAL,
      stock: 0,
      minStock: 0,
      maxStock: 100,
      location: ""
    });
  };

  // Reset edit form data
  const resetEditForm = () => {
    setEditFormData({
      name: "",
      sku: "",
      description: "",
      price: 0,
      cost: 0,
      category: "",
      supplier: "",
      barcodeType: BarCodeType.CODE_128,
      barcodeData: "",
      barcodeSource: BarCodeSource.INTERNAL,
      stock: 0,
      minStock: 0,
      maxStock: 100,
      location: ""
    });
  };

  // Open create modal with clean form
  const openCreateModal = () => {
    resetCreateForm(); // Always start with a clean form
    setIsCreateModalOpen(true);
  };

  // Open edit modal with product data
  const openEditModal = (product: IProduct) => {
    setSelectedProduct(product);
    setEditFormData({
      name: product.name,
      sku: product.sku,
      description: product.description || "",
      price: product.price,
      cost: product.cost,
      category: product.category,
      supplier: product.supplier || "",
      barcodeType: product.barcodeType,
      barcodeData: product.barcodeData,
      barcodeSource: product.barcodeSource,
      stock: product.stock,
      minStock: product.minStock,
      maxStock: product.maxStock,
      location: product.location || ""
    });
    setIsEditModalOpen(true);
  };

  // Open stock update modal
  const openStockModal = (product: IProduct) => {
    setSelectedProduct(product);
    setIsStockModalOpen(true);
  };

  // Get stock status color
  const getStockStatusColor = (product: IProduct) => {
    if (product.stock === 0) return "text-red-500";
    if (product.stock <= product.minStock) return "text-yellow-500";
    return "text-green-500";
  };

  // Get stock status text
  const getStockStatusText = (product: IProduct) => {
    if (product.stock === 0) return "Sin stock";
    if (product.stock <= product.minStock) return "Stock bajo";
    return "En stock";
  };

  return (
    <>
      <BarNavegation />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Gestión de Productos</h1>
          <button
            onClick={openCreateModal}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors cursor-pointer"
          >
            + Nuevo Producto
          </button>
        </div>

        {/* Inventory Summary */}
        <InventorySummary refreshTrigger={refreshTrigger} />

        {/* Search and Filter Section */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Buscar</label>
              <input
                type="text"
                placeholder="Buscar por nombre, SKU o código..."
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Categoría</label>
              <select
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Todas las categorías</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => { setSearchQuery(""); setSelectedCategory(""); }}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer"
              >
                Limpiar Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {(() => {
          console.log("🎨 Renderizando productos...");
          console.log("📊 Estado de loading:", loading);
          console.log("📦 Productos en estado:", products);
          console.log("🔍 Productos filtrados:", filteredProducts);
          console.log("🔍 Búsqueda actual:", searchQuery);
          console.log("🏷️ Categoría seleccionada:", selectedCategory);
          
          if (loading) {
            return (
              <div className="text-center py-8">
                <div className="text-white text-lg">Cargando productos...</div>
              </div>
            );
          } else if (filteredProducts.length === 0) {
            return (
              <div className="text-center py-8">
                <div className="text-white text-lg">
                  {searchQuery || selectedCategory ? "No se encontraron productos con los filtros aplicados" : "No hay productos registrados"}
                </div>
              </div>
            );
          } else {
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence>
                  {filteredProducts.map(product => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                      className="bg-gray-800 p-4 rounded-lg shadow-lg text-white"
                    >
                      {/* Product Header */}
                      <div className="mb-3">
                        <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
                        <p className="text-sm text-gray-400">SKU: {product.sku}</p>
                        <p className="text-sm text-gray-400">Código: {product.barcodeData}</p>
                      </div>

                      {/* Product Details */}
                      <div className="mb-3 space-y-1">
                        <p className="text-sm"><span className="text-gray-400">Categoría:</span> {product.category}</p>
                        <p className="text-sm"><span className="text-gray-400">Precio:</span> ${product.price.toFixed(2)}</p>
                        <p className="text-sm"><span className="text-gray-400">Costo:</span> ${product.cost.toFixed(2)}</p>
                        <p className={`text-sm font-semibold ${getStockStatusColor(product)}`}>
                          Stock: {product.stock} ({getStockStatusText(product)})
                        </p>
                        {product.supplier && (
                          <p className="text-sm"><span className="text-gray-400">Proveedor:</span> {product.supplier}</p>
                        )}
                        {product.location && (
                          <p className="text-sm"><span className="text-gray-400">Ubicación:</span> {product.location}</p>
                        )}
                      </div>

                      {/* Product Actions */}
                      <div className="space-y-2">
                        <button
                          onClick={() => openStockModal(product)}
                          className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-2 px-3 rounded transition-colors cursor-pointer"
                        >
                          Gestionar Stock
                        </button>
                        <button
                          onClick={() => handleGenerateBarcodePDF(product)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 px-3 rounded transition-colors cursor-pointer"
                        >
                          Generar PDF
                        </button>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => openEditModal(product)}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-bold py-2 px-3 rounded transition-colors cursor-pointer"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product)}
                            className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-2 px-3 rounded transition-colors cursor-pointer"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            );
          }
        })()}

        {/* Create Product Modal */}
        <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
          <div className="p-6">
            <h2 className="text-xl font-bold text-white mb-4">Crear Nuevo Producto</h2>
            <CreateProductForm
              formData={createFormData}
              setFormData={setCreateFormData}
              categories={categories}
              onSubmit={handleCreateProduct}
              onCancel={() => setIsCreateModalOpen(false)}
            />
          </div>
        </Modal>

        {/* Edit Product Modal */}
        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
          <div className="p-6">
            <h2 className="text-xl font-bold text-white mb-4">Editar Producto</h2>
            <EditProductForm
              formData={editFormData}
              setFormData={setEditFormData}
              categories={categories}
              onSubmit={handleUpdateProduct}
              onCancel={() => setIsEditModalOpen(false)}
            />
          </div>
        </Modal>

        {/* Stock Update Modal */}
        <Modal isOpen={isStockModalOpen} onClose={() => setIsStockModalOpen(false)}>
          <div className="p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              Gestionar Stock - {selectedProduct?.name}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Stock Actual</label>
                <p className="text-white font-semibold">{selectedProduct?.stock || 0}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Operación</label>
                <select
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                  value={stockUpdate.operation}
                  onChange={(e) => setStockUpdate(prev => ({ ...prev, operation: e.target.value as "add" | "subtract" }))}
                >
                  <option value="add">Agregar Stock</option>
                  <option value="subtract">Restar Stock</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Cantidad</label>
                <input
                  type="number"
                  min="0"
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                  value={stockUpdate.quantity}
                  onChange={(e) => setStockUpdate(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleStockUpdate}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer"
                >
                  Actualizar Stock
                </button>
                <button
                  onClick={() => setIsStockModalOpen(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
}

// Create Product Form Component
interface CreateProductFormProps {
  formData: any;
  setFormData: (data: any) => void;
  categories: string[];
  onSubmit: () => void;
  onCancel: () => void;
}

function CreateProductForm({ formData, setFormData, categories, onSubmit, onCancel }: CreateProductFormProps) {
  const barcodeTypes = barCodeBusiness.getAvailableBarCodeTypes();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Nombre *</label>
          <input
            type="text"
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nombre del producto"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">SKU *</label>
          <input
            type="text"
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            placeholder="Código SKU"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Descripción</label>
        <textarea
          className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Descripción del producto"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Precio *</label>
          <input
            type="number"
            min="0"
            step="0.01"
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Costo *</label>
          <input
            type="number"
            min="0"
            step="0.01"
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            value={formData.cost}
            onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Categoría *</label>
          <input
            type="text"
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="Categoría"
            list="categories-create"
          />
          <datalist id="categories-create">
            {categories.map(category => (
              <option key={category} value={category} />
            ))}
          </datalist>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Proveedor</label>
          <input
            type="text"
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            value={formData.supplier}
            onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
            placeholder="Nombre del proveedor"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Ubicación</label>
          <input
            type="text"
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Ubicación en almacén"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Tipo de Código de Barras</label>
          <select
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            value={formData.barcodeType}
            onChange={(e) => setFormData({ ...formData, barcodeType: e.target.value as BarCodeType })}
          >
            {barcodeTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Código de Barras</label>
          <input
            type="text"
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            value={formData.barcodeData}
            onChange={(e) => setFormData({ ...formData, barcodeData: e.target.value })}
            placeholder="Dejar vacío para generar automáticamente"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Stock Inicial</label>
          <input
            type="number"
            min="0"
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Stock Mínimo</label>
          <input
            type="number"
            min="0"
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            value={formData.minStock}
            onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Stock Máximo</label>
          <input
            type="number"
            min="0"
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            value={formData.maxStock}
            onChange={(e) => setFormData({ ...formData, maxStock: parseInt(e.target.value) || 100 })}
          />
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <button
          onClick={onSubmit}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer"
        >
          Crear Producto
        </button>
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

// Edit Product Form Component
interface EditProductFormProps {
  formData: any;
  setFormData: (data: any) => void;
  categories: string[];
  onSubmit: () => void;
  onCancel: () => void;
}

function EditProductForm({ formData, setFormData, categories, onSubmit, onCancel }: EditProductFormProps) {
  const barcodeTypes = barCodeBusiness.getAvailableBarCodeTypes();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Nombre *</label>
          <input
            type="text"
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nombre del producto"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">SKU *</label>
          <input
            type="text"
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            placeholder="Código SKU"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Descripción</label>
        <textarea
          className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Descripción del producto"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Precio *</label>
          <input
            type="number"
            min="0"
            step="0.01"
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Costo *</label>
          <input
            type="number"
            min="0"
            step="0.01"
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            value={formData.cost}
            onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Categoría *</label>
          <input
            type="text"
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="Categoría"
            list="categories-edit"
          />
          <datalist id="categories-edit">
            {categories.map(category => (
              <option key={category} value={category} />
            ))}
          </datalist>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Proveedor</label>
          <input
            type="text"
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            value={formData.supplier}
            onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
            placeholder="Nombre del proveedor"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Ubicación</label>
          <input
            type="text"
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Ubicación en almacén"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Tipo de Código de Barras</label>
          <select
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            value={formData.barcodeType}
            onChange={(e) => setFormData({ ...formData, barcodeType: e.target.value as BarCodeType })}
          >
            {barcodeTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Código de Barras</label>
          <input
            type="text"
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            value={formData.barcodeData}
            onChange={(e) => setFormData({ ...formData, barcodeData: e.target.value })}
            placeholder="Código de barras actual"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Stock Actual</label>
          <input
            type="number"
            min="0"
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Stock Mínimo</label>
          <input
            type="number"
            min="0"
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            value={formData.minStock}
            onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Stock Máximo</label>
          <input
            type="number"
            min="0"
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            value={formData.maxStock}
            onChange={(e) => setFormData({ ...formData, maxStock: parseInt(e.target.value) || 100 })}
          />
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <button
          onClick={onSubmit}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer"
        >
          Actualizar Producto
        </button>
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default ProductManagment;
