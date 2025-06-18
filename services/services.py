from database import database, conn
from models import *
from fastapi import UploadFile, HTTPException


class FranchiseService:

    def getFranchise(self):
        database.execute("SELECT * FROM Franquicia")
        franchise = database.fetchall()
        return [Franchise(
                    RIF=row[0], 
                    Nombre=row[1], 
                    Ciudad=row[2], 
                    CI_Encargado=row[3] if row[3] is not None else None, 
                    FechaInicioEncargado=str(row[4]) if row[4] is not None else None,
                    Estatus=row[5]
                ) 
                for row in franchise]
    
    def createFranchise(self, RIF: str, Nombre: str, Ciudad: str, CI_Encargado: Optional[str] = None, FechaInicioEncargado: Optional[str] = None, Estatus: str = "Activo"):
        try:
            database.execute("INSERT INTO Franquicia (RIF, Nombre, Ciudad, CI_Encargado, FechaInicioEncargado, Estatus) VALUES (?, ?, ?, ?, ?, ?)",
                            (RIF, Nombre, Ciudad, CI_Encargado, FechaInicioEncargado, Estatus))
            conn.commit()
            return {"message": "Franchise created successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error creating franchise: {str(e)}")
        
    def updateFranchise(self, RIF: str, Nombre:str, Ciudad:str, CI_Encargado: Optional[str] = None, FechaInicioEncargado: Optional[str] = None, Estatus: str = "Activo"):
        try:
            database.execute("SELECT 1 FROM Franquicia WHERE RIF = ?", (RIF,))
            exists = database.fetchone()
            if not exists:
                raise HTTPException(status_code=404, detail="Franchise not found")
            database.execute(
                "UPDATE Franquicia SET Nombre = ?, Ciudad = ?, CI_Encargado = ?, FechaInicioEncargado = ?, Estatus = ? WHERE RIF = ?",
                (Nombre, Ciudad, CI_Encargado, FechaInicioEncargado, Estatus, RIF)
            )
            conn.commit()
            return {"message": "Franchise updated successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error updating franchise: {str(e)}")

class EmployeeService:
    
    def getEmployees(self):
        database.execute("SELECT * FROM Empleado")
        employee = database.fetchall()
        return [Employee(CI=row[0], NombreCompleto=row[1], Direccion=row[2], Telefono=str(row[3]), Salario=row[4], FranquiciaRIF=str(row[5])) for row in employee]

    def createEmployee(self, CI: str, NombreCompleto: str, Direccion: str, Telefono: str, Salario: float, FranquiciaRIF: str):
        try:
            database.execute("INSERT INTO Empleado (CI, NombreCompleto, Direccion, Telefono, Salario, FranquiciaRIF) VALUES (?, ?, ?, ?, ?, ?)",
                            (CI, NombreCompleto, Direccion, Telefono, Salario, FranquiciaRIF))
            conn.commit()
            return {"message": "Employee created successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error creating employee: {str(e)}")
        
    def deleteEmployee(self, CI: str):
        try:
            database.execute("SELECT 1 FROM Empleado WHERE CI = ?", (CI,))
            exists = database.fetchone()
            if not exists:
                raise HTTPException(status_code=404, detail="Employee not found")
            database.execute("DELETE FROM Empleado WHERE CI = ?", (CI,))
            conn.commit()
            return {"message": "Employee deleted successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error deleting employee: {str(e)}")
    
    def updateEmployee(self, CI: str, NombreCompleto: str, Direccion: str, Telefono: str, Salario: float, FranquiciaRIF: str):
        try:
            database.execute("SELECT 1 FROM Empleado WHERE CI = ?", (CI,))
            exists = database.fetchone()
            if not exists:
                raise HTTPException(status_code=404, detail="Employee not found")
            database.execute(
                "UPDATE Empleado SET NombreCompleto = ?, Direccion = ?, Telefono = ?, Salario = ?, FranquiciaRIF = ? WHERE CI = ?",
                (NombreCompleto, Direccion, Telefono, Salario, FranquiciaRIF, CI)
            )
            conn.commit()
            return {"message": "Employee updated successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error updating employee: {str(e)}")
        
class BrandService:
    def getBrands(self):
        database.execute("SELECT * FROM Marca")
        brands = database.fetchall()
        return [Marca(CodigoMarca=row[0], Nombre=row[1]) for row in brands]
    
    def createBrand(self, Nombre: str):
        try:
            database.execute("INSERT INTO Marca (Nombre) VALUES (?)", (Nombre))
            conn.commit()
            return {"message": "Brand created successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error creating brand: {str(e)}")
        
    def deleteBrand(self, CodigoMarca: int):
        try:
            database.execute("SELECT 1 FROM Marca WHERE CodigoMarca = ?", (CodigoMarca,))
            exists = database.fetchone()
            if not exists:
                raise HTTPException(status_code=404, detail="Brand not found")
            database.execute("DELETE FROM Marca WHERE CodigoMarca = ?", (CodigoMarca,))
            conn.commit()
            return {"message": "Brand deleted successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error deleting brand: {str(e)}")
        
    def updateBrand(self, CodigoMarca: int, Nombre: str):
        try:
            database.execute("SELECT 1 FROM Marca WHERE CodigoMarca = ?", (CodigoMarca,))
            exists = database.fetchone()
            if not exists:
                raise HTTPException(status_code=404, detail="Brand not found")
            database.execute(
                "UPDATE Marca SET Nombre = ? WHERE CodigoMarca = ?",
                (Nombre, CodigoMarca)
            )
            conn.commit()
            return {"message": "Brand updated successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error updating brand: {str(e)}")
        
class ModelService:
    
    def getModels(self):
        database.execute("SELECT * FROM Modelo")
        models = database.fetchall()
        return [Model(
                    CodigoModelo=row[0], 
                    NumeroCorrelativoModelo=row[1], 
                    DescripcionModelo=row[2], 
                    CantidadPuestos=row[3], 
                    TipoRefrigerante=row[4], 
                    TipoGasolina=row[5], 
                    TipoAceite=row[6], 
                    Peso=row[7]
                ) for row in models]
    
    def createModel(self, CodigoMarca: int ,NumeroCorrelativoModelo: int, DescripcionModelo: str, CantidadPuestos: int, TipoRefrigerante: str, TipoGasolina: str, TipoAceite: str, Peso: float):
        try:
            database.execute("INSERT INTO Modelo (CodigoMarca, NumeroCorrelativoModelo, DescripcionModelo, CantidadPuestos, TipoRefrigerante, TipoGasolina, TipoAceite, Peso) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                            (CodigoMarca, NumeroCorrelativoModelo, DescripcionModelo, CantidadPuestos, TipoRefrigerante, TipoGasolina, TipoAceite, Peso))
            conn.commit()
            return {"message": "Model created successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error creating model: {str(e)}")
        
    def deleteModel(self, CodigoMarca: int, NumeroCorrelativoModelo: int):
        try:
            database.execute("SELECT 1 FROM Modelo WHERE CodigoMarca = ? AND NumeroCorrelativoModelo = ?", (CodigoMarca, NumeroCorrelativoModelo,))
            exists = database.fetchone()
            if not exists:
                raise HTTPException(status_code=404, detail="Model not found")
            database.execute("DELETE FROM Modelo WHERE CodigoMarca = ? AND NumeroCorrelativoModelo = ?", (CodigoMarca, NumeroCorrelativoModelo,))
            conn.commit()
            return {"message": "Model deleted successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error deleting model: {str(e)}")
    
    def updateModel(self, CodigoMarca: int, NumeroCorrelativoModelo: int, DescripcionModelo: str, CantidadPuestos: int, TipoRefrigerante: str, TipoGasolina: str, TipoAceite: str, Peso: float):
        try:
            database.execute("SELECT 1 FROM Modelo WHERE CodigoMarca = ? AND NumeroCorrelativoModelo = ?", (CodigoMarca, NumeroCorrelativoModelo,))
            exists = database.fetchone()
            if not exists:
                raise HTTPException(status_code=404, detail="Model not found")
            database.execute(
                "UPDATE Modelo SET DescripcionModelo = ?, CantidadPuestos = ?, TipoRefrigerante = ?, TipoGasolina = ?, TipoAceite = ?, Peso = ? WHERE CodigoMarca = ? AND NumeroCorrelativoModelo = ?",
                (DescripcionModelo, CantidadPuestos, TipoRefrigerante, TipoGasolina, TipoAceite, Peso, CodigoMarca, NumeroCorrelativoModelo)
            )
            conn.commit()
            return {"message": "Model updated successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error updating model: {str(e)}")
        
class VehicleService:

    def getVehicles(self):
        database.execute("SELECT * FROM Vehiculo")
        vehicles = database.fetchall()
        return [Vehicle(
                    CodigoVehiculo=row[0], 
                    Placa=row[1], 
                    FechaAdquisicion=str(row[2]), 
                    TipoAceite=row[3], 
                    CI_Propietario=row[4], 
                    CodigoMarca=row[5], 
                    NumeroCorrelativoModelo=row[6]
                ) for row in vehicles]
    
    def createVehicle(self, CodigoMarca: int, NumeroCorrelativoModelo: int, Placa: str, FechaAdquisicion: str, TipoAceite: str, CI_Propietario: str):
        try:
            database.execute("INSERT INTO Vehiculo (CodigoMarca, NumeroCorrelativoModelo ,Placa, FechaAdquisicion, TipoAceite, CedulaCliente) VALUES (?, ?, ?, ?, ?, ?)",
                            (CodigoMarca, NumeroCorrelativoModelo, Placa, FechaAdquisicion, TipoAceite, CI_Propietario))
            conn.commit()
            return {"message": "Vehicle created successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error creating vehicle: {str(e)}")
        
    def deleteVehicle(self, CodigoVehiculo: int):
        try:
            database.execute("SELECT 1 FROM Vehiculo WHERE CodigoVehiculo = ?", (CodigoVehiculo,))
            exists = database.fetchone()
            if not exists:
                raise HTTPException(status_code=404, detail="Vehicle not found")
            database.execute("DELETE FROM Vehiculo WHERE CodigoVehiculo = ?", (CodigoVehiculo,))
            conn.commit()
            return {"message": "Vehicle deleted successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error deleting vehicle: {str(e)}")
        
    def updateVehicle(self, CodigoVehiculo: int ,CodigoMarca: int, NumeroCorrelativoModelo: int, Placa: str, FechaAdquisicion: str, TipoAceite: str, CI_Propietario: str):
        try:
            database.execute("SELECT 1 FROM Vehiculo WHERE CodigoVehiculo = ?", (CodigoVehiculo,))
            exists = database.fetchone()
            if not exists:
                raise HTTPException(status_code=404, detail="Vehicle not found")
            database.execute(
                "UPDATE Vehiculo SET CodigoMarca = ?, NumeroCorrelativoModelo = ?, Placa = ?, FechaAdquisicion = ?, TipoAceite = ?, CedulaCliente = ? WHERE CodigoVehiculo = ?",
                (CodigoMarca, NumeroCorrelativoModelo, Placa, FechaAdquisicion, TipoAceite, CI_Propietario, CodigoVehiculo)
            )
            conn.commit()
            return {"message": "Vehicle updated successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error updating vehicle: {str(e)}")

class CustomerService:

    def getCustomer(self):
        database.execute("SELECT * FROM Cliente")
        customer = database.fetchall()
        return [Customer(CI=row[0], NombreCompleto=row[1], Email=row[2]) for row in customer]
    
    def createCustomer(self, CI: str, NombreCompleto: str, Email: str):  
        try:
            database.execute("INSERT INTO Cliente (CI, NombreCompleto, Email) VALUES (?, ?, ?)",
                            (CI, NombreCompleto, Email))
            conn.commit()
            return {"message": "Customer created successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error creating customer: {str(e)}")
        
    def deleteCustomer(self, CI: str):
        try:
            database.execute("SELECT 1 FROM Cliente WHERE CI = ?", (CI,))
            exists = database.fetchone()
            if not exists:
                raise HTTPException(status_code=404, detail="Customer not found")
            database.execute("DELETE FROM Cliente WHERE CI = ?", (CI,))
            conn.commit()
            return {"message": "Customer deleted successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error deleting customer: {str(e)}")
        
    def updateCustomer(self, CI: str, NombreCompleto: str, Email: str):
        try:
            database.execute("SELECT 1 FROM Cliente WHERE CI = ?", (CI,))
            exists = database.fetchone()
            if not exists:
                raise HTTPException(status_code=404, detail="Customer not found")
            database.execute(
                "UPDATE Cliente SET NombreCompleto = ?, Email = ? WHERE CI = ?",
                (NombreCompleto, Email, CI)
            )
            conn.commit()
            return {"message": "Customer updated successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error updating customer: {str(e)}")