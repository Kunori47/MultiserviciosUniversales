from db.database import database, conn
from models import *
from fastapi import UploadFile, HTTPException

class GetService:

    def getAll(self, table_name: str):
        try:
            database.execute(f"SELECT * FROM {table_name}")
            data = database.fetchall()
            return data
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching data from {table_name}: {str(e)}")
        
    def getDataById(self, table_name: str, **filters):
        
        where_clause = " AND ".join([f"{key} = ?" for key in filters.keys()])
        values = tuple(filters.values())
        try:
            database.execute(f"SELECT * FROM {table_name} WHERE {where_clause}", values)
            data = database.fetchone()
            if not data:
                raise HTTPException(status_code=404, detail=f"No data found in {table_name} with provided {filters}")
            return data
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching data from {table_name}: {str(e)}")
        
    def getDataByFilter(self, table_name: str, **filters):
        where_clause = " AND ".join([f"{key} = ?" for key in filters.keys()])
        values = tuple(filters.values())
        try:
            database.execute(f"SELECT * FROM {table_name} WHERE {where_clause}", values)
            data = database.fetchall()
            if not data:
                raise HTTPException(status_code=404, detail=f"No data found in {table_name} with provided {filters}")
            return data
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching data from {table_name}: {str(e)}")
        
    def getDataByView(self, table_name: str, **filters):
        where_clause = " AND ".join([f"{key} = ?" for key in filters.keys()])
        values = tuple(filters.values())
        try:
            database.execute(f"SELECT * FROM {table_name} WHERE {where_clause}", values)
            data = database.fetchall()
            if not data:
                raise HTTPException(status_code=404, detail=f"No data found in {table_name} with provided {filters}")
            return data
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching data from {table_name}: {str(e)}")
        

    def searchDataEmployee(self, table_name: str, query: str):
    
        try:
            database.execute(f"SELECT TOP 10 CI, NombreCompleto FROM {table_name} WHERE CI LIKE ?", f'%{query}%')
            columns = [column[0] for column in database.description]
            results = [dict(zip(columns, row)) for row in database.fetchall()]
            return results
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error searching data in {table_name}: {str(e)}")
        
    def searchDataFranchise(self, table_name: str, query: str):
        try:
            database.execute(f"SELECT TOP 10 * FROM {table_name} WHERE RIF LIKE ?", f'%{query}%')
            columns = [column[0] for column in database.description]
            results = [dict(zip(columns, row)) for row in database.fetchall()]
            return results
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error searching data in {table_name}: {str(e)}")
        
    def searchDataFilters(self, table_name: str, q: str, **filters):
        try:
            where_clause = " AND ".join([f"{key} = ?" for key in filters.keys()])
            values = tuple(filters.values())
            database.execute(f"SELECT * FROM {table_name} WHERE {where_clause} AND CI LIKE ?", values + (f'%{q}%',))
            columns = [column[0] for column in database.description]
            results = [dict(zip(columns, row)) for row in database.fetchall()]
            return results
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error searching data in {table_name}: {str(e)}")

    def searchDataSupplierLines(self, table_name: str, query: str):
        try:
            database.execute(f"SELECT TOP 10 * FROM {table_name} WHERE DescripcionLinea LIKE ?", f'%{query}%')
            columns = [column[0] for column in database.description]
            results = [dict(zip(columns, row)) for row in database.fetchall()]
            return results
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error searching data in {table_name}: {str(e)}")

    def searchDataVendors(self, table_name: str, query: str):
        try:
            database.execute(f"SELECT TOP 10 * FROM {table_name} WHERE RazonSocial LIKE ?", f'%{query}%')
            columns = [column[0] for column in database.description]
            results = [dict(zip(columns, row)) for row in database.fetchall()]
            return results
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error searching data in {table_name}: {str(e)}")

    def searchDataMaintenancePlans(self, table_name: str, query: str):
        try:
            database.execute(f"SELECT TOP 10 * FROM {table_name} WHERE DescripcionMantenimiento LIKE ?", f'%{query}%')
            columns = [column[0] for column in database.description]
            results = [dict(zip(columns, row)) for row in database.fetchall()]
            return results
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error searching data in {table_name}: {str(e)}")

    def searchDataBrands(self, table_name: str, query: str):
        try:
            database.execute(f"SELECT TOP 10 * FROM {table_name} WHERE Nombre LIKE ?", f'%{query}%')
            columns = [column[0] for column in database.description]
            results = [dict(zip(columns, row)) for row in database.fetchall()]
            return results
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error searching data in {table_name}: {str(e)}")

    def searchDataModels(self, table_name: str, query: str):
        try:
            database.execute(f"SELECT TOP 10 * FROM {table_name} WHERE DescripcionModelo LIKE ?", f'%{query}%')
            columns = [column[0] for column in database.description]
            results = [dict(zip(columns, row)) for row in database.fetchall()]
            return results
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error searching data in {table_name}: {str(e)}")

    def searchDataSpecialties(self, table_name: str, query: str):
        try:
            database.execute(f"SELECT TOP 10 * FROM {table_name} WHERE DescripcionEspecialidad LIKE ?", f'%{query}%')
            columns = [column[0] for column in database.description]
            results = [dict(zip(columns, row)) for row in database.fetchall()]
            return results
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error searching data in {table_name}: {str(e)}")

    def searchDataServices(self, table_name: str, query: str):
        try:
            database.execute(f"SELECT TOP 10 * FROM {table_name} WHERE NombreServicio LIKE ?", f'%{query}%')
            columns = [column[0] for column in database.description]
            results = [dict(zip(columns, row)) for row in database.fetchall()]
            return results
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error searching data in {table_name}: {str(e)}")

    def countData(self, table_name: str):
        try:
            database.execute(f"SELECT COUNT(*) FROM {table_name}")
            data = database.fetchone()
            return data[0]
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error counting data in {table_name}: {str(e)}")
        
    def countDistinctData(self, table_name: str, column_name: str):
        try:
            database.execute(f"SELECT COUNT(DISTINCT {table_name}.{column_name}) FROM {table_name}")
            data = database.fetchone()
            return data[0]
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error counting distinct data in {table_name}: {str(e)}")
        
    def countDistinctDataByFranchise(self, table_name: str, column_name: str, **filters):
        where_clause = " AND ".join([f"{key} = ?" for key in filters.keys()])
        values = tuple(filters.values())
        try:
            database.execute(f"SELECT COUNT(DISTINCT {table_name}.{column_name}) FROM {table_name} WHERE {where_clause}", values)
            data = database.fetchone()
            return data[0]
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error counting distinct data in {table_name}: {str(e)}")
        

    def countDataByFranchise(self, table_name: str, **filters):
        where_clause = " AND ".join([f"{key} = ?" for key in filters.keys()])
        values = tuple(filters.values())
        try:
            database.execute(f"SELECT COUNT(*) FROM {table_name} WHERE {where_clause}", values)
            data = database.fetchone()
            return data[0]
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error counting data in {table_name}: {str(e)}")
        

        

class PostService:
    def postData(self, table_name: str, data: dict):
        columns = ', '.join(data.keys())
        placeholders = ', '.join(['?' for _ in data])
        values = tuple(data.values())
        try:
            database.execute(f"INSERT INTO {table_name} ({columns}) VALUES ({placeholders})", values)
            conn.commit()
            return {"message": f"Data inserted into {table_name} successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error inserting data into {table_name}: {str(e)}")
    
    def postModelData(self, data: dict):
        try:
            # Obtener el siguiente num correlativo para la marca
            codigo_marca = data['CodigoMarca']
            database.execute(
                "SELECT ISNULL(MAX(NumeroCorrelativoModelo), 0) + 1 FROM Modelos WHERE CodigoMarca = ?", 
                (codigo_marca,)
            )
            next_correlative = database.fetchone()[0]
            
            # Agregar el numero correlativo a los datos
            data['NumeroCorrelativoModelo'] = next_correlative
            
            # Insertar el modelo
            columns = ', '.join(data.keys())
            placeholders = ', '.join(['?' for _ in data])
            values = tuple(data.values())
            
            database.execute(f"INSERT INTO Modelos ({columns}) VALUES ({placeholders})", values)
            conn.commit()
            return {"message": "Model inserted successfully", "NumeroCorrelativoModelo": next_correlative}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error inserting data into Modelos: {str(e)}")

class DeleteService:
    def deleteData(self, table_name: str, **filters):
        where_clause = " AND ".join([f"{key} = ?" for key in filters.keys()])
        values = tuple(filters.values())
        try:
            database.execute(f"DELETE FROM {table_name} WHERE {where_clause}", values)
            conn.commit()
            return {"message": f"Data deleted from {table_name} successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error deleting data from {table_name}: {str(e)}")
        

class UpdateService:
    def updateData(self, table_name: str, data: dict, **filters):
        set_clause = ', '.join([f"{key} = ?" for key in data.keys()])
        where_clause = " AND ".join([f"{key} = ?" for key in filters.keys()])
        values = tuple(data.values()) + tuple(filters.values())
        try:
            database.execute(f"UPDATE {table_name} SET {set_clause} WHERE {where_clause}", values)
            conn.commit()
            return {"message": f"Data updated in {table_name} successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error updating data in {table_name}: {str(e)}")


