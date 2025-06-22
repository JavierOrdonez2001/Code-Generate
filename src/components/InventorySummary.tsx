import { useEffect, useState } from 'react';
import { productBusiness } from '../logic/containers/ProductContainer';

interface InventorySummaryData {
  totalProducts: number;
  totalValue: number;
  totalCost: number;
  lowStockProducts: number;
  outOfStockProducts: number;
}

interface InventorySummaryProps {
  refreshTrigger?: number;
}

function InventorySummary({ refreshTrigger = 0 }: InventorySummaryProps) {
  const [summary, setSummary] = useState<InventorySummaryData>({
    totalProducts: 0,
    totalValue: 0,
    totalCost: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSummary();
  }, [refreshTrigger]);

  const loadSummary = async () => {
    try {
      setLoading(true);
      const summaryData = await productBusiness.getInventorySummary();
      setSummary(summaryData);
    } catch (error) {
      console.error('Error loading inventory summary:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calcular margen de ganancia
  const calculateMargin = () => {
    if (summary.totalCost === 0) return 0;
    return ((summary.totalValue - summary.totalCost) / summary.totalCost) * 100;
  };

  const margin = calculateMargin();

  if (loading) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-6">
        <div className="text-white text-center">Cargando resumen...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-6">
      <h3 className="text-lg font-semibold text-white mb-4">Resumen del Inventario</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">{summary.totalProducts}</div>
          <div className="text-sm text-gray-400">Total Productos</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">${summary.totalValue.toFixed(2)}</div>
          <div className="text-sm text-gray-400">Valor Total</div>
          <div className="text-xs text-gray-500">(Precio × Stock)</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-400">${summary.totalCost.toFixed(2)}</div>
          <div className="text-sm text-gray-400">Costo Total</div>
          <div className="text-xs text-gray-500">(Costo × Stock)</div>
        </div>
        <div className="text-center">
          <div className={`text-2xl font-bold ${margin >= 0 ? 'text-purple-400' : 'text-red-400'}`}>
            {margin.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-400">Margen</div>
          <div className="text-xs text-gray-500">((Valor-Costo)/Costo)</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-400">{summary.lowStockProducts}</div>
          <div className="text-sm text-gray-400">Stock Bajo</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-400">{summary.outOfStockProducts}</div>
          <div className="text-sm text-gray-400">Sin Stock</div>
        </div>
      </div>
    </div>
  );
}

export default InventorySummary; 