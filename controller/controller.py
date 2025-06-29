from fastapi import UploadFile, HTTPException, Header
from services.services import *
from typing import Optional


class GetController:
    def __init__(self):
        self.get_service = GetService()

    def get_all(self, table_name: str):
        return self.get_service.getAll(table_name)
    
    def get_by_id(self, table_name: str, **filters):
        if not filters:
            raise HTTPException(status_code=400, detail="No filters provided")
        return self.get_service.getDataById(table_name, **filters)
    
    def get_by_filter(self, table_name: str, **filters):
        return self.get_service.getDataByFilter(table_name, **filters)
    
    def get_by_view(self, table_name: str, **filters):
        if not filters:
            raise HTTPException(status_code=400, detail="No filters provided")
        return self.get_service.getDataByView(table_name, **filters)
    
    def search(self, table_name: str, query: str):
        if not query:
            raise HTTPException(status_code=400, detail="No query provided")
        if(table_name == 'Empleados'):
            return self.get_service.searchDataEmployee(table_name, query)
        elif(table_name == 'Franquicias'):
            return self.get_service.searchDataFranchise(table_name, query)
        elif(table_name == 'LineasSuministro'):
            return self.get_service.searchDataSupplierLines(table_name, query)
        elif(table_name == 'Proveedores'):
            return self.get_service.searchDataVendors(table_name, query)
        elif(table_name == 'PlanesMantenimiento'):
            return self.get_service.searchDataMaintenancePlans(table_name, query)
        elif(table_name == 'Marcas'):
            return self.get_service.searchDataBrands(table_name, query)
        elif(table_name == 'Modelos'):
            return self.get_service.searchDataModels(table_name, query)
        elif(table_name == 'Especialidades'):
            return self.get_service.searchDataSpecialties(table_name, query)
        elif(table_name == 'Servicios'):
            return self.get_service.searchDataServices(table_name, query)
        
    def searchFilters(self, table_name: str, query: str, **filters):
        if not query:
            raise HTTPException(status_code=400, detail="No query provided")
        return self.get_service.searchDataFilters(table_name, query, **filters)
    
    def count(self, table_name: str):
        return self.get_service.countData(table_name)
    
    def count_distinct(self, table_name: str, column_name: str):
        return self.get_service.countDistinctData(table_name, column_name)
    
    def count_distinct_by_franchise(self, table_name: str, column_name: str, **filters):
        return self.get_service.countDistinctDataByFranchise(table_name, column_name, **filters)
    
    def count_by_franchise(self, table_name: str, **filters):
        return self.get_service.countDataByFranchise(table_name, **filters)
    
    def get_inventory_by_franchise(self, franquicia_rif: str):
        return self.get_service.getInventoryByFranchise(franquicia_rif)
    
    def search_inventory_by_franchise(self, franquicia_rif: str, query: str):
        return self.get_service.searchInventoryByFranchise(franquicia_rif, query)
    
    def get_product_by_franchise_and_code(self, franquicia_rif: str, codigo_producto: int):
        return self.get_service.getProductByFranchiseAndCode(franquicia_rif, codigo_producto)
    
    def get_orders_by_franchise(self, franquicia_rif: str, mes: Optional[int] = None, anio: Optional[int] = None, estado: Optional[str] = None):
        return self.get_service.getOrdersByFranchise(franquicia_rif, mes, anio, estado)
    
    def get_orders_stats_by_franchise(self, franquicia_rif: str, mes: Optional[int] = None, anio: Optional[int] = None):
        return self.get_service.getOrdersStatsByFranchise(franquicia_rif, mes, anio)
    
    def get_invoices_by_franchise(self, franquicia_rif: str, mes: Optional[int] = None, anio: Optional[int] = None):
        return self.get_service.getInvoicesByFranchise(franquicia_rif, mes, anio)
    
    def get_invoice_details(self, franquicia_rif: str, numero_factura: int):
        return self.get_service.getInvoiceDetails(franquicia_rif, numero_factura)
    
    def get_purchases_by_franchise(self, franquicia_rif: str, mes: Optional[int] = None, anio: Optional[int] = None):
        return self.get_service.getPurchasesByFranchise(franquicia_rif, mes, anio)
    
    def get_purchase_details(self, franquicia_rif: str, numero_compra: int):
        return self.get_service.getPurchaseDetails(franquicia_rif, numero_compra)
    
    def get_order_details(self, franquicia_rif: str, numero_orden: int):
        return self.get_service.getOrderDetails(franquicia_rif, numero_orden)

    def get_services_by_franchise(self, franquicia_rif: str):
        return self.get_service.getServicesByFranchise(franquicia_rif)

    def get_activities_by_service(self, codigo_servicio: int):
        return self.get_service.getActivitiesByService(codigo_servicio)

    def check_correction_exists(self, franquicia_rif: str, codigo_producto: int):
        return self.get_service.checkCorrectionExists(franquicia_rif, codigo_producto)

    def get_correction_history(self, franquicia_rif: str, mes: Optional[int] = None, anio: Optional[int] = None):
        return self.get_service.getCorrectionHistory(franquicia_rif, mes, anio)

    def get_models_by_brand(self, codigo_marca: int):
        return self.get_service.getModelsByBrand(codigo_marca)

    def check_brand_has_models(self, codigo_marca: int):
        return self.get_service.checkBrandHasModels(codigo_marca)

    def get_next_model_correlative_number(self, codigo_marca: int):
        return self.get_service.getNextModelCorrelativeNumber(codigo_marca)

    def get_maintenance_plans_by_model(self, codigo_marca: int, numero_correlativo_modelo: int):
        return self.get_service.getMaintenancePlansByModel(codigo_marca, numero_correlativo_modelo)

    def get_employee_specialties(self, empleado_ci: str):
        return self.get_service.getEmployeeSpecialties(empleado_ci)

    def get_products_by_vendor(self, proveedor_rif: str):
        return self.get_service.getProductsByVendor(proveedor_rif)

    def get_purchase_number(self, fecha: str, proveedor_rif: str):
        return self.get_service.getPurchaseNumber(fecha, proveedor_rif)

    def get_product_quantity(self, franquicia_rif: str, codigo_producto: int):
        return self.get_service.getProductQuantity(franquicia_rif, codigo_producto)

    def update_product_quantity(self, franquicia_rif: str, codigo_producto: int, new_quantity: int):
        return self.get_service.updateProductQuantity(franquicia_rif, codigo_producto, new_quantity)

    def insert_new_product_to_franchise(self, franquicia_rif: str, codigo_producto: int, cantidad: int):
        return self.get_service.insertNewProductToFranchise(franquicia_rif, codigo_producto, cantidad)
    
class PostController:
    def __init__(self):
        self.post_service = PostService()

    def post_data(self, table_name: str, data: dict):
        if not data:
            raise HTTPException(status_code=400, detail="No data provided")
        return self.post_service.postData(table_name, data)

    def post_model_data(self, data: dict):
        if not data:
            raise HTTPException(status_code=400, detail="No data provided")
        return self.post_service.postModelData(data)
    
    
    def create_purchase_with_inventory(self, purchase_data: dict):
        if not purchase_data:
            raise HTTPException(status_code=400, detail="No purchase data provided")
        return self.post_service.createPurchaseWithInventory(purchase_data)

    def create_correction_with_inventory(self, correction_data: dict):
        if not correction_data:
            raise HTTPException(status_code=400, detail="No correction data provided")
        return self.post_service.createCorrectionWithInventory(correction_data)
    
class UpdateController:
    def __init__(self):
        self.put_service = UpdateService()

    def put_data(self, table_name: str, data: dict, **filters):
        if not data:
            raise HTTPException(status_code=400, detail="No data provided")
        if not filters:
            raise HTTPException(status_code=400, detail="No filters provided")
        return self.put_service.updateData(table_name, data, **filters)
    
class DeleteController:
    def __init__(self):
        self.delete_service = DeleteService()

    def delete_data(self, table_name: str, **filters):
        if not filters:
            raise HTTPException(status_code=400, detail="No filters provided")
        return self.delete_service.deleteData(table_name, **filters)

