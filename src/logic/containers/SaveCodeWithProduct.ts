import ISaveCodeWithProduct from "../interfaces/ISaveCodeWithProduct";
import SaveCodeWithProduct from "../repositories/SaveCodeWithProduct";
import SaveCodeWithProductService from "../services/SaveCodeWithProductService";


const saveCodeWithProduct:ISaveCodeWithProduct = new SaveCodeWithProduct();

export const businessSaveCodeWithProduct = new SaveCodeWithProductService(saveCodeWithProduct);