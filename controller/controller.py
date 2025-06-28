from fastapi import UploadFile, HTTPException, Header
from services.services import *


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
    
class PostController:
    def __init__(self):
        self.post_service = PostService()

    def post_data(self, table_name: str, data: dict):
        if not data:
            raise HTTPException(status_code=400, detail="No data provided")
        return self.post_service.postData(table_name, data)
    
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

