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

