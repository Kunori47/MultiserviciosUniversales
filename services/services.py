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

    def createEmployee(self, CI: str, NombreCompleto: str, Direccion: str, Telefono: str, Salario: float, FranquiciaRIF: Optional[str]):
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
        return [Brand(CodigoMarca=row[0], Nombre=row[1]) for row in brands]
    
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
        
class MaintenancePlanService:
    def getMaintenancePlan(self):
        database.execute("SELECT * FROM PlanMantenimiento")
        maintenancePlan = database.fetchall()
        return [MaintenancePlan(
                CodigoMantenimiento=row[0], 
                TiempoUso=row[1], 
                Kilometraje=row[2],
                DescripcionMantenimiento=row[3],
                CodigoMarca=row[4],
                NumeroCorrelativoModelo=row[5],              
            ) for row in maintenancePlan]
    
    def createMaintenancePlan(
                self,
                TiempoUso: int, 
                Kilometraje: int,
                DescripcionMantenimiento: str,
                CodigoMarca: int,
                NumeroCorrelativoModelo: int ):
        try:
            database.execute("INSERT INTO PlanMantenimiento (TiempoUso ,Kilometraje, DescripcionMantenimiento, CodigoMarca, NumeroCorrelativoModelo) VALUES (?, ?, ?, ?, ?)",
                            (TiempoUso, Kilometraje, DescripcionMantenimiento, CodigoMarca, NumeroCorrelativoModelo))
            conn.commit()
            return {"message": "Maintenance plan created successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error creating Maintenance plan: {str(e)}")
    
    def deleteMaintenancePlan(self, CodigoMantenimiento: int):
        try:
            database.execute("SELECT 1 FROM PlanMantenimiento WHERE CodigoMantenimiento = ?", (CodigoMantenimiento,))
            exists = database.fetchone()
            if not exists:
                raise HTTPException(status_code=404, detail="Maintenance Plan not found")
            database.execute("DELETE FROM PlanMantenimiento WHERE CodigoMantenimiento = ?", (CodigoMantenimiento,))
            conn.commit()
            return {"message": "Maintenance Plan deleted successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error deleting Maintenance Plan: {str(e)}") 
        
    def updateMaintenancePlan(self, 
                CodigoMantenimiento: int, 
                TiempoUso: int, 
                Kilometraje: int,
                DescripcionMantenimiento: str,
                CodigoMarca: int,
                NumeroCorrelativoModelo: int ):
        try:
            database.execute("SELECT 1 FROM PlanMantenimiento WHERE CodigoMantenimiento = ?", (CodigoMantenimiento,))
            exists = database.fetchone()
            if not exists:
                raise HTTPException(status_code=404, detail="Maintenance Plan not found")
            database.execute(
                "UPDATE PlanMantenimiento SET TiempoUso = ?, Kilometraje = ?, DescripcionMantenimiento = ?, CodigoMarca = ?, NumeroCorrelativoModelo = ? WHERE CodigoMantenimiento = ?",
                (TiempoUso, Kilometraje, DescripcionMantenimiento, CodigoMarca, NumeroCorrelativoModelo, CodigoMantenimiento)
            )
            conn.commit()
            return {"message": "Maintenance Plan updated successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error updating Maintenance Plan: {str(e)}")
            
class SpecialtyService:
    def getSpecialties(self):
        database.execute("SELECT * FROM Especialidad")
        specialties = database.fetchall()
        return [Specialty(
            CodigoEspecialidad=row[0],
            DescripcionEspecialidad=row[1],
        ) for row in specialties]

    def createSpecialty(self, DescripcionEspecialidad: str):
        try:
            database.execute(
                "INSERT INTO Especialidad (DescripcionEspecialidad) VALUES (?)",
                (DescripcionEspecialidad)
            )
            conn.commit()
            return {"message": "Especialidad creada exitosamente"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error al crear especialidad: {str(e)}")

    def deleteSpecialty(self, CodigoEspecialidad: int):
        try:
            database.execute("SELECT 1 FROM Especialidad WHERE CodigoEspecialidad = ?", (CodigoEspecialidad,))
            exists = database.fetchone()
            if not exists:
                raise HTTPException(status_code=404, detail="Especialidad no encontrada")
            database.execute("DELETE FROM Especialidad WHERE CodigoEspecialidad = ?", (CodigoEspecialidad,))
            conn.commit()
            return {"message": "Especialidad eliminada exitosamente"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error al eliminar especialidad: {str(e)}")

    def updateSpecialty(self, CodigoEspecialidad: int, DescripcionEspecialidad: str):
        try:
            database.execute("SELECT 1 FROM Especialidad WHERE CodigoEspecialidad = ?", (CodigoEspecialidad,))
            exists = database.fetchone()
            if not exists:
                raise HTTPException(status_code=404, detail="Especialidad no encontrada")
            database.execute(
                "UPDATE Especialidad SET DescripcionEspecialidad = ? WHERE CodigoEspecialidad = ?",
                (DescripcionEspecialidad, CodigoEspecialidad)
            )
            conn.commit()
            return {"message": "Especialidad actualizada exitosamente"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error al actualizar especialidad: {str(e)}")

         
class ServiceService:

    def getServices(self):
        database.execute("SELECT * FROM Servicio")
        services = database.fetchall()
        return [Service(CodigoServicio=row[0], NombreServicio=row[1]) for row in services]
    
    def createService(self, NombreServicio: str):
        try:
            database.execute("INSERT INTO Servicio (NombreServicio) VALUES (?)", (NombreServicio,))
            conn.commit()
            return {"message": "Service created successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error creating service: {str(e)}")
        
    def deleteService(self, CodigoServicio: int):
        try:
            database.execute("SELECT 1 FROM Servicio WHERE CodigoServicio = ?", (CodigoServicio,))
            exists = database.fetchone()
            if not exists:
                raise HTTPException(status_code=404, detail="Service not found")
            database.execute("DELETE FROM Servicio WHERE CodigoServicio = ?", (CodigoServicio,))
            conn.commit()
            return {"message": "Service deleted successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error deleting service: {str(e)}")
        
    def updateService(self, CodigoServicio: int, NombreServicio: str):
        try:
            database.execute("SELECT 1 FROM Servicio WHERE CodigoServicio = ?", (CodigoServicio,))
            exists = database.fetchone()
            if not exists:
                raise HTTPException(status_code=404, detail="Service not found")
            database.execute(
                "UPDATE Servicio SET NombreServicio = ? WHERE CodigoServicio = ?",
                (NombreServicio, CodigoServicio)
            )
            conn.commit()
            return {"message": "Service updated successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error updating service: {str(e)}")
        
class SupplierLineService:

    def getSupplierLines(self):
        database.execute("SELECT * FROM LineaSuministro")
        supplier_lines = database.fetchall()
        return [SupplierLine(CodigoLinea=row[0], DescripcionLinea=row[1]) for row in supplier_lines]
    
    def createSupplierLine(self, DescripcionLinea: str):
        try:
            database.execute("INSERT INTO LineaSuministro (DescripcionLinea) VALUES (?)", (DescripcionLinea,))
            conn.commit()
            return {"message": "Supplier line created successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error creating supplier line: {str(e)}")
        
    def deleteSupplierLine(self, CodigoLinea: int):
        try:
            database.execute("SELECT 1 FROM LineaSuministro WHERE CodigoLinea = ?", (CodigoLinea,))
            exists = database.fetchone()
            if not exists:
                raise HTTPException(status_code=404, detail="Supplier line not found")
            database.execute("DELETE FROM LineaSuministro WHERE CodigoLinea = ?", (CodigoLinea,))
            conn.commit()
            return {"message": "Supplier line deleted successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error deleting supplier line: {str(e)}")
        
    def updateSupplierLine(self, CodigoLinea: int, DescripcionLinea: str):
        try:
            database.execute("SELECT 1 FROM LineaSuministro WHERE CodigoLinea = ?", (CodigoLinea,))
            exists = database.fetchone()
            if not exists:
                raise HTTPException(status_code=404, detail="Supplier line not found")
            database.execute(
                "UPDATE LineaSuministro SET DescripcionLinea = ? WHERE CodigoLinea = ?",
                (DescripcionLinea, CodigoLinea)
            )
            conn.commit()
            return {"message": "Supplier line updated successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error updating supplier line: {str(e)}")
    
class ProductService:

    def getProducts(self):
        database.execute("SELECT * FROM Producto")
        products = database.fetchall()
        return [Product(
                    CodigoProducto=row[0], 
                    NombreProducto=row[1], 
                    DescripcionProducto=row[2], 
                    LineaSuministronistro=row[3],
                    Tipo=row[4],
                    NivelContaminante=row[5] if row[5] is not None else None,
                    Tratamiento=row[6] if row[6] is not None else None
                ) for row in products]
    
    def createProduct(self, NombreProducto: str, DescripcionProducto: str, LineaSuministro: int, Tipo: str, NivelContaminante: int, Tratamiento: str):
        try:
            database.execute("INSERT INTO Producto (NombreProducto, DescripcionProducto, LineaSuministro, Tipo, NivelContaminante, Tratamiento) VALUES (?, ?, ?, ?, ?, ?)",
                            (NombreProducto, DescripcionProducto, LineaSuministro, Tipo, NivelContaminante, Tratamiento))
            conn.commit()
            return {"message": "Product created successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error creating product: {str(e)}")
        
    def deleteProduct(self, CodigoProducto: int):
        try:
            database.execute("SELECT 1 FROM Producto WHERE CodigoProducto = ?", (CodigoProducto,))
            exists = database.fetchone()
            if not exists:
                raise HTTPException(status_code=404, detail="Product not found")
            database.execute("DELETE FROM Producto WHERE CodigoProducto = ?", (CodigoProducto,))
            conn.commit()
            return {"message": "Product deleted successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error deleting product: {str(e)}")
        
    def updateProduct(self, CodigoProducto: int, NombreProducto: str, DescripcionProducto: str, LineaSuministro: int, Tipo: str, NivelContaminante: Optional[int] = None, Tratamiento: Optional[str] = None):
        try:
            database.execute("SELECT 1 FROM Producto WHERE CodigoProducto = ?", (CodigoProducto,))
            exists = database.fetchone()
            if not exists:
                raise HTTPException(status_code=404, detail="Product not found")
            database.execute(
                "UPDATE Producto SET NombreProducto = ?, DescripcionProducto = ?, LineaSuministro = ?, Tipo = ?, NivelContaminante = ?, Tratamiento = ? WHERE CodigoProducto = ?",
                (NombreProducto, DescripcionProducto, LineaSuministro, Tipo, NivelContaminante, Tratamiento, CodigoProducto)
            )
            conn.commit()
            return {"message": "Product updated successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error updating product: {str(e)}")
        
class VendorService:

    def getVendors(self):
        database.execute("SELECT * FROM Proveedor")
        vendors = database.fetchall()
        return [Vendor(RIF=row[0], 
                       RazonSocial=row[1], 
                       Direccion=row[2], 
                       TelefonoLocal=row[3],
                       TelefonoCelular=row[4],
                       PersonaContacto=row[5]
                       ) for row in vendors]
    
    def createVendor(self, RIF: str, RazonSocial: str, Direccion: str, TelefonoLocal: str, TelefonoCelular: str, PersonaContacto: str):
        try:
            database.execute("INSERT INTO Proveedor (RIF, RazonSocial, Direccion, TelefonoLocal, TelefonoCelular, PersonaContacto) VALUES (?, ?, ?, ?, ?, ?)",
                            (RIF, RazonSocial, Direccion, TelefonoLocal, TelefonoCelular, PersonaContacto))
            conn.commit()
            return {"message": "Vendor created successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error creating vendor: {str(e)}")
        
    def deleteVendor(self, RIF: str):
        try:
            database.execute("SELECT 1 FROM Proveedor WHERE RIF = ?", (RIF,))
            exists = database.fetchone()
            if not exists:
                raise HTTPException(status_code=404, detail="Vendor not found")
            database.execute("DELETE FROM Proveedor WHERE RIF = ?", (RIF,))
            conn.commit()
            return {"message": "Vendor deleted successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error deleting vendor: {str(e)}")
        
    def updateVendor(self, RIF: str, RazonSocial: str, Direccion: str, TelefonoLocal: str, TelefonoCelular: str, PersonaContacto: str):
        try:
            database.execute("SELECT 1 FROM Proveedor WHERE RIF = ?", (RIF,))
            exists = database.fetchone()
            if not exists:
                raise HTTPException(status_code=404, detail="Vendor not found")
            database.execute(
                "UPDATE Proveedor SET RazonSocial = ?, Direccion = ?, TelefonoLocal = ?, TelefonoCelular = ?, PersonaContacto = ? WHERE RIF = ?",
                (RazonSocial, Direccion, TelefonoLocal, TelefonoCelular, PersonaContacto, RIF)
            )
            conn.commit()
            return {"message": "Vendor updated successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error updating vendor: {str(e)}")
        
class ServiceOrderService:

    def getServiceOrders(self):
        database.execute("SELECT * FROM OrdenServicio")
        service_orders = database.fetchall()
        return [ServiceOrder(
                    ID=row[0], 
                    FechaEntrada=str(row[1]), 
                    HoraEntrada=str(row[2]),
                    FechaSalidaEstimada=str(row[3]),
                    HoraSalidaEstimada=str(row[4]),
                    FechaSalidaReal=str(row[5]) if row[5] is not None else None,
                    HoraSalidaReal= str(row[6]) if row[6] is not None else None,
                    Comentario=row[7] if row[7] is not None else None,
                    CodigoVehiculo=row[8]
                    ) for row in service_orders]
    
    def createServiceOrder(self, FechaEntrada: str, HoraEntrada: str, FechaSalidaEstimada: str, HoraSalidaEstimada: str, CodigoVehiculo: int):
        try:
            database.execute("INSERT INTO OrdenServicio (FechaEntrada, HoraEntrada, FechaSalidaEstimada, HoraSalidaEstimada, CodigoVehiculo) VALUES (?, ?, ?, ?, ?)",
                            (FechaEntrada, HoraEntrada, FechaSalidaEstimada, HoraSalidaEstimada, CodigoVehiculo))
            conn.commit()
            return {"message": "Service order created successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error creating service order: {str(e)}")
    
    def updateServiceOrder(self, ID: int, FechaSalidaReal: Optional[str], HoraSalidaReal: Optional[str], Comentario: Optional[str]):
        try:
            database.execute("SELECT 1 FROM OrdenServicio WHERE ID = ?", (ID,))
            exists = database.fetchone()
            if not exists:
                raise HTTPException(status_code=404, detail="Service order not found")
            database.execute(
                "UPDATE OrdenServicio SET FechaSalidaReal = ?, HoraSalidaReal = ?, Comentario = ? WHERE ID = ?",
                (FechaSalidaReal, HoraSalidaReal, Comentario, ID)
            )
            conn.commit()
            return {"message": "Service order updated successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error updating service order: {str(e)}")
        
class InvoiceService:

    def getInvoices(self):
        database.execute("SELECT * FROM Factura")
        invoices = database.fetchall()
        return [Invoice(
                    NumeroFactura=row[0],
                    FechaEmision= str(row[1]),
                    MontoTotal=row[2],
                    IVA=row[3],
                    Descuento=row[4],
                    OrdenServicioID=row[5],
                    FranquiciaRIF=row[6]
                ) for row in invoices]
    
    def createInvoice(self, FechaEmision: str, MontoTotal: float, IVA: float, Descuento: float, OrdenServicioID: int, FranquiciaRIF: str):
        try:
            database.execute("INSERT INTO Factura (FechaEmision, MontoTotal, IVA, Descuento, OrdenServicioID, FranquiciaRIF) VALUES (?, ?, ?, ?, ?, ?)",
                            (FechaEmision, MontoTotal, IVA, Descuento, OrdenServicioID, FranquiciaRIF))
            conn.commit()
            return {"message": "Invoice created successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error creating invoice: {str(e)}")
        
class PurchaseService:

    def getPurchases(self):
        database.execute("SELECT * FROM Compra")
        purchases = database.fetchall()
        return [Purchase(
                    Numero=row[0],
                    Fecha=str(row[1]),
                    ProveedorRIF=row[2]
                ) for row in purchases]
    
    def createPurchase(self, Fecha: str, ProveedorRIF: str):
        try:
            database.execute("INSERT INTO Compra (Fecha, ProveedorRIF) VALUES (?, ?)",
                            (Fecha, ProveedorRIF))
            conn.commit()
            return {"message": "Purchase created successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error creating purchase: {str(e)}")
        
class ProductFranchiseService:

    def getProductFranchises(self):
        database.execute("SELECT * FROM ProductoFranquicia")
        product_franchises = database.fetchall()
        return [ProductFranchise(
                    FranquiciaRIF=row[0],
                    CodigoProducto=row[1],
                    Precio=row[2],
                    Cantidad=row[3],
                    CantidadMinima=row[4],
                    CantidadMaxima=row[5],
                ) for row in product_franchises]
    
    def createProductFranchise(self, FranquiciaRIF: str, CodigoProducto: int, Precio: float, Cantidad: int, CantidadMinima: int, CantidadMaxima: int):
        try:
            database.execute("INSERT INTO ProductoFranquicia (FranquiciaRIF, CodigoProducto, Precio, Cantidad, CantidadMinima, CantidadMaxima) VALUES (?, ?, ?, ?, ?, ?)",
                            (FranquiciaRIF, CodigoProducto, Precio, Cantidad, CantidadMinima, CantidadMaxima))
            conn.commit()
            return {"message": "Product franchise created successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error creating product franchise: {str(e)}")
        
    def deleteProductFranchise(self, FranquiciaRIF: str, CodigoProducto: int):
        try:
            database.execute("SELECT 1 FROM ProductoFranquicia WHERE FranquiciaRIF = ? AND CodigoProducto = ?", (FranquiciaRIF, CodigoProducto))
            exists = database.fetchone()
            if not exists:
                raise HTTPException(status_code=404, detail="Product franchise not found")
            database.execute("DELETE FROM ProductoFranquicia WHERE FranquiciaRIF = ? AND CodigoProducto = ?", (FranquiciaRIF, CodigoProducto))
            conn.commit()
            return {"message": "Product franchise deleted successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error deleting product franchise: {str(e)}")
        
    def updateProductFranchise(self, FranquiciaRIF: str, CodigoProducto: int, Precio: float, Cantidad: int, CantidadMinima: int, CantidadMaxima: int):
        try:
            database.execute("SELECT 1 FROM ProductoFranquicia WHERE FranquiciaRIF = ? AND CodigoProducto = ?", (FranquiciaRIF, CodigoProducto))
            exists = database.fetchone()
            if not exists:
                raise HTTPException(status_code=404, detail="Product franchise not found")
            database.execute(
                "UPDATE ProductoFranquicia SET Precio = ?, Cantidad = ?, CantidadMinima = ?, CantidadMaxima = ? WHERE FranquiciaRIF = ? AND CodigoProducto = ?",
                (Precio, Cantidad, CantidadMinima, CantidadMaxima, FranquiciaRIF, CodigoProducto)
            )
            conn.commit()
            return {"message": "Product franchise updated successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error updating product franchise: {str(e)}")
        
class ActivityService:

    def getActivities(self):
        database.execute("SELECT * FROM Actividad")
        activities = database.fetchall()
        return [Activity(
                    CodigoServicio=row[0],
                    NumeroCorrelativoActividad=row[1],
                    DescripcionActividad=row[2],
                    CostoManoDeObra= row[3]
                ) for row in activities]
    
    def createActivity(self, CodigoServicio: int, NumeroCorrelativoActividad: int, DescripcionActividad: str, CostoManoDeObra: float):
        try:
            database.execute("INSERT INTO Actividad (CodigoServicio, NumeroCorrelativoActividad, DescripcionActividad, CostoManoDeObra) VALUES (?, ?, ?, ?)",
                            (CodigoServicio, NumeroCorrelativoActividad, DescripcionActividad, CostoManoDeObra))
            conn.commit()
            return {"message": "Activity created successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error creating activity: {str(e)}")
        
    def deleteActivity(self, CodigoServicio: int, NumeroCorrelativoActividad: int):
        try:
            database.execute("SELECT 1 FROM Actividad WHERE CodigoServicio = ? AND NumeroCorrelativoActividad = ?", (CodigoServicio, NumeroCorrelativoActividad))
            exists = database.fetchone()
            if not exists:
                raise HTTPException(status_code=404, detail="Activity not found")
            database.execute("DELETE FROM Actividad WHERE CodigoServicio = ? AND NumeroCorrelativoActividad = ?", (CodigoServicio, NumeroCorrelativoActividad))
            conn.commit()
            return {"message": "Activity deleted successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error deleting activity: {str(e)}")

class OrderActivityService:

    def getOrderActivities(self):
        database.execute("SELECT * FROM OrdenxActividad")
        orderx_activities = database.fetchall()
        return [OrderxActivity(
                    IDorden=row[0],
                    CodigoServicio=row[1],
                    NumeroCorrelativoActividad=row[2],
                    Costo_Act=row[3]
                ) for row in orderx_activities]
    
    def createOrderActivity(self, IDorden: int, CodigoServicio: int, NumeroCorrelativoActividad: int, Costo_Act: float):
        try:
            database.execute("INSERT INTO OrdenxActividad (IDorden, CodigoServicio, NumeroCorrelativoActividad, Costo_Act) VALUES (?, ?, ?, ?)",
                            (IDorden, CodigoServicio, NumeroCorrelativoActividad, Costo_Act))
            conn.commit()
            return {"message": "OrderxActivity created successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error creating OrderxActivity: {str(e)}")
    
    

class PayService:

    def getPays(self):
        database.execute("SELECT * FROM Pago")
        pays = database.fetchall()
        return [Pay(
            NumeroFactura=row[0],
            NumeroCorrelativoPago=row[1],
            Tipo=row[2],
            # Convertir a date si no es None. Asumiendo que la DB devuelve un objeto date o un string que se puede convertir.
            # Si la DB devuelve un string, podrías necesitar date.fromisoformat(row[3])
            FechaTarjeta=row[3] if isinstance(row[3], date) else (date.fromisoformat(row[3]) if row[3] else None),
            MontoTarjeta=row[4],
            BancoTarjeta=row[5],
            ModalidadTarjeta=row[6],
            NumeroTarjeta=row[7],
            MontoEfectivo=row[8],
            MonedaEfectivo=row[9],
            FechaPagoMovil=row[10] if isinstance(row[10], date) else (date.fromisoformat(row[10]) if row[10] else None),
            TelefonoPagoMovil=row[11],
            ReferenciaPagoMovil=row[12],
            MontoPagoMovil=row[13],
        ) for row in pays]

    def createPay(self, pay: Pay):
        try:
            # Almacenar fechas como ISO format string (YYYY-MM-DD) si la DB no maneja directamente objetos date de Python
            # O directamente el objeto date si tu driver de DB (pyodbc) y DB lo soportan
            fecha_tarjeta_db = pay.FechaTarjeta.isoformat() if pay.FechaTarjeta else None
            fecha_pago_movil_db = pay.FechaPagoMovil.isoformat() if pay.FechaPagoMovil else None

            database.execute(
                """
                INSERT INTO Pago (
                    NumeroFactura, NumeroCorrelativoPago, Tipo, FechaTarjeta, MontoTarjeta,
                    BancoTarjeta, ModalidadTarjeta, NumeroTarjeta, MontoEfectivo, MonedaEfectivo,
                    FechaPagoMovil, TelefonoPagoMovil, ReferenciaPagoMovil, MontoPagoMovil
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    pay.NumeroFactura, pay.NumeroCorrelativoPago, pay.Tipo, fecha_tarjeta_db, pay.MontoTarjeta,
                    pay.BancoTarjeta, pay.ModalidadTarjeta, pay.NumeroTarjeta, pay.MontoEfectivo, pay.MonedaEfectivo,
                    fecha_pago_movil_db, pay.TelefonoPagoMovil, pay.ReferenciaPagoMovil, pay.MontoPagoMovil
                )
            )
            conn.commit()
            return {"message": "Payment created successfully"}
        except Exception as e:
            conn.rollback()
            if "duplicate key" in str(e).lower() or "primary key constraint" in str(e).lower():
                 raise HTTPException(status_code=409, detail=f"Payment with NumeroFactura {pay.NumeroFactura} and NumeroCorrelativoPago {pay.NumeroCorrelativoPago} already exists.")
            raise HTTPException(status_code=500, detail=f"Error creating payment: {str(e)}")

    def updatePay(self, NumeroFactura: int, NumeroCorrelativoPago: int, pay_data: Pay):
        try:
            database.execute(
                "SELECT 1 FROM Pago WHERE NumeroFactura = ? AND NumeroCorrelativoPago = ?",
                (NumeroFactura, NumeroCorrelativoPago)
            )
            exists = database.fetchone()
            if not exists:
                raise HTTPException(status_code=404, detail="Payment not found")

            # Convertir a ISO format string para la DB
            fecha_tarjeta_db = pay_data.FechaTarjeta.isoformat() if pay_data.FechaTarjeta else None
            fecha_pago_movil_db = pay_data.FechaPagoMovil.isoformat() if pay_data.FechaPagoMovil else None

            database.execute(
                """
                UPDATE Pago SET
                    Tipo = ?, FechaTarjeta = ?, MontoTarjeta = ?, BancoTarjeta = ?,
                    ModalidadTarjeta = ?, NumeroTarjeta = ?, MontoEfectivo = ?,
                    MonedaEfectivo = ?, FechaPagoMovil = ?, TelefonoPagoMovil = ?,
                    ReferenciaPagoMovil = ?, MontoPagoMovil = ?
                WHERE NumeroFactura = ? AND NumeroCorrelativoPago = ?
                """,
                (
                    pay_data.Tipo, fecha_tarjeta_db, pay_data.MontoTarjeta, pay_data.BancoTarjeta,
                    pay_data.ModalidadTarjeta, pay_data.NumeroTarjeta, pay_data.MontoEfectivo,
                    pay_data.MonedaEfectivo, fecha_pago_movil_db, pay_data.TelefonoPagoMovil,
                    pay_data.ReferenciaPagoMovil, pay_data.MontoPagoMovil,
                    NumeroFactura, NumeroCorrelativoPago
                )
            )
            conn.commit()
            return {"message": "Payment updated successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error updating payment: {str(e)}")

    def deletePay(self, NumeroFactura: int, NumeroCorrelativoPago: int):
        try:
            database.execute(
                "SELECT 1 FROM Pago WHERE NumeroFactura = ? AND NumeroCorrelativoPago = ?",
                (NumeroFactura, NumeroCorrelativoPago)
            )
            exists = database.fetchone()
            if not exists:
                raise HTTPException(status_code=404, detail="Payment not found")

            database.execute(
                "DELETE FROM Pago WHERE NumeroFactura = ? AND NumeroCorrelativoPago = ?",
                (NumeroFactura, NumeroCorrelativoPago)
            )
            conn.commit()
            return {"message": "Payment deleted successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error deleting payment: {str(e)}")


class CustomerPhoneService:
    def getCustomerPhones(self):
        database.execute("SELECT * FROM TelefonosCliente") 
        rows = database.fetchall()
        return [CustomerPhone(Cliente=row[0], Telefono=row[1]) for row in rows]

    def createCustomerPhone(self, customer_phone: CustomerPhone):
        try:
            database.execute("INSERT INTO TelefonosCliente (Cliente, Telefono) VALUES (?, ?)", (customer_phone.Cliente, customer_phone.Telefono))
            conn.commit()
            return {"message": "Customer phone created successfully."}
        except Exception as e:
            conn.rollback()
            if "duplicate key" in str(e).lower() or "primary key constraint" in str(e).lower():
                raise HTTPException(status_code=409, detail=f"Customer phone for Cliente '{customer_phone.Cliente}' and Telefono '{customer_phone.Telefono}' already exists.")
            raise HTTPException(status_code=500, detail=f"Error creating customer phone: {str(e)}")

    def updateCustomerPhone(self, Cliente: str, Telefono: str, new_telefono: str):
        try:
            database.execute("SELECT 1 FROM TelefonosCliente WHERE Cliente = ? AND Telefono = ?", (Cliente, Telefono))
            exists = database.fetchone()
            if not exists:
                raise HTTPException(status_code=404, detail="Customer phone not found.")
            database.execute("UPDATE TelefonosCliente SET Telefono = ? WHERE Cliente = ? AND Telefono = ?", (new_telefono, Cliente, Telefono))
            conn.commit()
            return {"message": "Customer phone updated successfully."}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error updating customer phone: {str(e)}")

    def deleteCustomerPhone(self, Cliente: str, Telefono: str):
        try:
            database.execute("SELECT 1 FROM TelefonosCliente WHERE Cliente = ? AND Telefono = ?", (Cliente, Telefono))
            exists = database.fetchone()
            if not exists:
                raise HTTPException(status_code=404, detail="Customer phone not found.")

            database.execute("DELETE FROM TelefonosCliente WHERE Cliente = ? AND Telefono = ?", (Cliente, Telefono))
            conn.commit()
            return {"message": "Customer phone deleted successfully."}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error deleting customer phone: {str(e)}")

class EmployeeOrderService:
    def getEmployeeOrders(self):
        database.execute("SELECT EmpleadoCI, OrdenServicioID FROM EmpleadosOrden")
        rows = database.fetchall()
        return [EmployeeOrder(EmpleadoCI=row[0], OrdenServicioID=row[1]) for row in rows]

    def createEmployeeOrder(self, employee_order: EmployeeOrder):
        try:
            database.execute("INSERT INTO EmpleadosOrden (EmpleadoCI, OrdenServicioID) VALUES (?, ?)", (employee_order.EmpleadoCI, employee_order.OrdenServicioID))
            conn.commit()
            return {"message": "Employee-Service Order association created successfully."}
        except Exception as e:
            conn.rollback()
            if "duplicate key" in str(e).lower() or "primary key constraint" in str(e).lower():
                raise HTTPException(status_code=409, detail=f"Employee-Service Order association for EmpleadoCI '{employee_order.EmpleadoCI}' and OrdenServicioID '{employee_order.OrdenServicioID}' already exists.")
            raise HTTPException(status_code=500, detail=f"Error creating Employee-Service Order association: {str(e)}")


class SpecialtyEmployeeService:
    def getSpecialtyEmployees(self):
        database.execute("SELECT EmpleadoCI, CodigoEspecialidad FROM EspecialidadEmpleado")
        rows = database.fetchall()
        return [SpecialtyEmployee(EmpleadoCI=row[0], CodigoEspecialidad=row[1]) for row in rows]

    def createSpecialtyEmployee(self, specialty_employee: SpecialtyEmployee):
        try:
            database.execute("INSERT INTO EspecialidadEmpleado (EmpleadoCI, CodigoEspecialidad) VALUES (?, ?)", (specialty_employee.EmpleadoCI, specialty_employee.CodigoEspecialidad))
            conn.commit()
            return {"message": "Employee-Specialty association created successfully."}
        except Exception as e:
            conn.rollback()
            if "duplicate key" in str(e).lower() or "primary key constraint" in str(e).lower():
                raise HTTPException(status_code=409, detail=f"Employee-Specialty association for EmpleadoCI '{specialty_employee.EmpleadoCI}' and CodigoEspecialidad '{specialty_employee.CodigoEspecialidad}' already exists.")
            raise HTTPException(status_code=500, detail=f"Error creating Employee-Specialty association: {str(e)}")

    def deleteSpecialtyEmployee(self, EmpleadoCI: str, CodigoEspecialidad: int):
        try:
            database.execute("SELECT 1 FROM EspecialidadEmpleado WHERE EmpleadoCI = ? AND CodigoEspecialidad = ?", (EmpleadoCI, CodigoEspecialidad))
            exists = database.fetchone()
            if not exists:
                raise HTTPException(status_code=404, detail="Employee-Specialty association not found.")

            database.execute("DELETE FROM EspecialidadEmpleado WHERE EmpleadoCI = ? AND CodigoEspecialidad = ?", (EmpleadoCI, CodigoEspecialidad))
            conn.commit()
            return {"message": "Employee-Specialty association deleted successfully."}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error deleting Employee-Specialty association: {str(e)}")

class VehicleMaintenanceService:
    def get_all(self):
        database.execute("SELECT Vehiculo, FechaMantenimiento, DescripcionMantenimiento FROM MantenimientoVehiculos")
        rows = database.fetchall()
        return [VehicleMaintenance(Vehiculo=row[0], FechaMantenimiento=row[1], DescripcionMantenimiento=row[2]) for row in rows]

    def create(self, maintenance: VehicleMaintenance):
        try:
            database.execute(
                "INSERT INTO MantenimientoVehiculos (Vehiculo, FechaMantenimiento, DescripcionMantenimiento) VALUES (?, ?, ?)",
                (maintenance.Vehiculo, maintenance.FechaMantenimiento, maintenance.DescripcionMantenimiento)
            )
            conn.commit()
            return {"message": "Vehicle maintenance record created successfully."}
        except Exception as e:
            conn.rollback()
            if "primary key constraint" in str(e).lower() or "duplicate key" in str(e).lower():
                raise HTTPException(status_code=409, detail="This vehicle maintenance record already exists.")
            if "foreign key constraint" in str(e).lower():
                raise HTTPException(status_code=400, detail="Invalid Vehicle code.")
            raise HTTPException(status_code=500, detail=f"Error creating vehicle maintenance record: {str(e)}")

    def delete(self, Vehiculo: int, FechaMantenimiento: date, DescripcionMantenimiento: str):
        try:
            database.execute(
                "SELECT 1 FROM MantenimientoVehiculos WHERE Vehiculo = ? AND FechaMantenimiento = ? AND DescripcionMantenimiento = ?",
                (Vehiculo, FechaMantenimiento, DescripcionMantenimiento)
            )
            exists = database.fetchone()
            if not exists:
                raise HTTPException(status_code=404, detail="Vehicle maintenance record not found.")

            database.execute(
                "DELETE FROM MantenimientoVehiculos WHERE Vehiculo = ? AND FechaMantenimiento = ? AND DescripcionMantenimiento = ?",
                (Vehiculo, FechaMantenimiento, DescripcionMantenimiento)
            )
            conn.commit()
            return {"message": "Vehicle maintenance record deleted successfully."}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error deleting vehicle maintenance record: {str(e)}")

class EmployeeResponsibilityService:
    def get_all(self):
        database.execute("SELECT EmpleadoCI, CodigoServicio FROM ResponsabilidadEmpleado")
        rows = database.fetchall()
        return [EmployeeResponsibility(EmpleadoCI=row[0], CodigoServicio=row[1]) for row in rows]

    def create(self, responsibility: EmployeeResponsibility):
        try:
            database.execute(
                "INSERT INTO ResponsabilidadEmpleado (EmpleadoCI, CodigoServicio) VALUES (?, ?)",
                (responsibility.EmpleadoCI, responsibility.CodigoServicio)
            )
            conn.commit()
            return {"message": "Employee responsibility created successfully."}
        except Exception as e:
            conn.rollback()
            if "primary key constraint" in str(e).lower() or "duplicate key" in str(e).lower():
                raise HTTPException(status_code=409, detail="This employee responsibility already exists.")
            if "foreign key constraint" in str(e).lower():
                raise HTTPException(status_code=400, detail="Invalid EmployeeCI or CodigoServicio.")
            raise HTTPException(status_code=500, detail=f"Error creating employee responsibility: {str(e)}")

    def delete(self, EmpleadoCI: str, CodigoServicio: int):
        try:
            database.execute(
                "SELECT 1 FROM ResponsabilidadEmpleado WHERE EmpleadoCI = ? AND CodigoEspecialidad = ?",
                (EmpleadoCI, CodigoServicio)
            )
            exists = database.fetchone()
            if not exists:
                raise HTTPException(status_code=404, detail="Employee responsibility not found.")

            database.execute(
                "DELETE FROM ResponsabilidadEmpleado WHERE EmpleadoCI = ? AND CodigoServicio = ?",
                (EmpleadoCI, CodigoServicio)
            )
            conn.commit()
            return {"message": "Employee responsibility deleted successfully."}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error deleting employee responsibility: {str(e)}")

class FranchiseServiceLinkService:
    def get_all(self):
        database.execute("SELECT FranquiciaRIF, CodigoServicio FROM ServiciosFranquicia")
        rows = database.fetchall()
        return [FranchiseServiceLink(FranquiciaRIF=row[0], CodigoServicio=row[1]) for row in rows]

    def create(self, link: FranchiseServiceLink):
        try:
            database.execute(
                "INSERT INTO ServiciosFranquicia (FranquiciaRIF, CodigoServicio) VALUES (?, ?)",
                (link.FranquiciaRIF, link.CodigoServicio)
            )
            conn.commit()
            return {"message": "Franchise service link created successfully."}
        except Exception as e:
            conn.rollback()
            if "primary key constraint" in str(e).lower() or "duplicate key" in str(e).lower():
                raise HTTPException(status_code=409, detail="This franchise service link already exists.")
            if "foreign key constraint" in str(e).lower():
                raise HTTPException(status_code=400, detail="Invalid FranquiciaRIF or CodigoServicio.")
            raise HTTPException(status_code=500, detail=f"Error creating franchise service link: {str(e)}")

    def delete(self, FranquiciaRIF: str, CodigoServicio: int):
        try:
            database.execute(
                "SELECT 1 FROM ServiciosFranquicia WHERE FranquiciaRIF = ? AND CodigoServicio = ?",
                (FranquiciaRIF, CodigoServicio)
            )
            exists = database.fetchone()
            if not exists:
                raise HTTPException(status_code=404, detail="Franchise service link not found.")

            database.execute(
                "DELETE FROM ServiciosFranquicia WHERE FranquiciaRIF = ? AND CodigoServicio = ?",
                (FranquiciaRIF, CodigoServicio)
            )
            conn.commit()
            return {"message": "Franchise service link deleted successfully."}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error deleting franchise service link: {str(e)}")


class CorrectionService:

    def getCorrections(self):
        database.execute("SELECT * FROM Correccion")
        corrections = database.fetchall()
        return [Correction(
                    FranquiciaRIF=row[0],
                    CodigoProducto=row[1],
                    FechaCorreccion=str(row[2]),
                    Cantidad=row[3],
                    TipoAjuste=row[4],
                    Comentario=row[5] if row[5] is not None else None
                ) for row in corrections]
    
    def createCorrection(self, FranquiciaRIF: str, CodigoProducto: int, FechaCorreccion: str, Cantidad: int, TipoAjuste: str, Comentario: Optional[str]):
        try:
            database.execute("INSERT INTO Correccion (FranquiciaRIF, CodigoProducto, FechaCorreccion, Cantidad, TipoAjuste, Comentario) VALUES (?, ?, ?, ?, ?, ?)",
                            (FranquiciaRIF, CodigoProducto, FechaCorreccion, Cantidad, TipoAjuste, Comentario))
            conn.commit()
            return {"message": "Correction created successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error creating correction: {str(e)}")
        
class SupplyService:

    def getSupplies(self):
        database.execute("SELECT * FROM Suministran")
        supplies = database.fetchall()
        return [Supply(
                    ProveedorRIF=row[0],
                    CodigoProducto=row[1]
                ) for row in supplies]
    
    def createSupply(self, ProveedorRIF: str, CodigoProducto: int):
        try:
            database.execute("INSERT INTO Suministran (ProveedorRIF, CodigoProducto) VALUES (?, ?)",
                            (ProveedorRIF, CodigoProducto))
            conn.commit()
            return {"message": "Supply created successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error creating supply: {str(e)}")
        
    def deleteSupply(self, ProveedorRIF: str, CodigoProducto: int):
        try:
            database.execute("SELECT 1 FROM Suministran WHERE ProveedorRIF = ? AND CodigoProducto = ?", (ProveedorRIF, CodigoProducto))
            exists = database.fetchone()
            if not exists:
                raise HTTPException(status_code=404, detail="Supply not found")
            database.execute("DELETE FROM Suministran WHERE ProveedorRIF = ? AND CodigoProducto = ?", (ProveedorRIF, CodigoProducto))
            conn.commit()
            return {"message": "Supply deleted successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error deleting supply: {str(e)}")
        
    def updateSupply(self, NuevoProveedorRIF: str, ProveedorRIF: str, CodigoProducto: int):
        try:
            database.execute("SELECT 1 FROM Suministran WHERE ProveedorRIF = ? AND CodigoProducto = ?", (ProveedorRIF, CodigoProducto))
            exists = database.fetchone()
            if not exists:
                raise HTTPException(status_code=404, detail="Supply not found")
            database.execute(
                "UPDATE Suministran SET ProveedorRIF = ? WHERE ProveedorRIF = ? AND CodigoProducto = ?",
                (NuevoProveedorRIF, ProveedorRIF, CodigoProducto)
            )
            conn.commit()
            return {"message": "Supply updated successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error updating supply: {str(e)}")
            

class InventoryIncreaseService:

    def getInventoryIncreases(self):
        database.execute("SELECT * FROM AumentoInventario")
        increase_inventory = database.fetchall()
        return [InventoryIncrease(
                    NumeroCompra=row[0],
                    FranquiciaRIF=row[1],
                    CodigoProducto=row[2],
                    CantidadPedida=row[3],
                    CantidadDisponible=row[4],
                    Monto= row[5]
                ) for row in increase_inventory]
    
    def createInventoryIncrease(self, NumeroCompra: int, FranquiciaRIF: str, CodigoProducto: int, CantidadPedida: int, CantidadDisponible: int, Monto: float):
        try:
            database.execute("INSERT INTO AumentoInventario (NumeroCompra, FranquiciaRIF, CodigoProducto, CantidadPedida, CantidadDisponible, Monto) VALUES (?, ?, ?, ?, ?, ?)",
                            (NumeroCompra, FranquiciaRIF, CodigoProducto, CantidadPedida, CantidadDisponible, Monto))
            conn.commit()
            return {"message": "Increase inventory created successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error creating increase inventory: {str(e)}")


class FranchiseServiceServices:

    def getFranchiseServices(self):
        database.execute("SELECT * FROM ServiciosFranquicia")
        franchise_services = database.fetchall()
        return [FranchiseServices(
                    FranquiciaRIF=row[0],
                    CodigoServicio=row[1]
                ) for row in franchise_services]
    
    def createFranchiseService(self, FranquiciaRIF: str, CodigoServicio: int):
        try:
            database.execute("INSERT INTO ServiciosFranquicia (FranquiciaRIF, CodigoServicio) VALUES (?, ?)",
                            (FranquiciaRIF, CodigoServicio))
            conn.commit()
            return {"message": "Franchise service created successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error creating franchise service: {str(e)}")
        
    def deleteFranchiseService(self, FranquiciaRIF: str, CodigoServicio: int):
        try:
            database.execute("SELECT 1 FROM ServiciosFranquicia WHERE FranquiciaRIF = ? AND CodigoServicio = ?", (FranquiciaRIF, CodigoServicio))
            exists = database.fetchone()
            if not exists:
                raise HTTPException(status_code=404, detail="Franchise service not found")
            database.execute("DELETE FROM ServiciosFranquicia WHERE FranquiciaRIF = ? AND CodigoServicio = ?", (FranquiciaRIF, CodigoServicio))
            conn.commit()
            return {"message": "Franchise service deleted successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error deleting franchise service: {str(e)}")
        
class ProductServiceOrderServices:

    def getProductServiceOrders(self):
        database.execute("SELECT * FROM ProductosOrdenServicio")
        product_orders = database.fetchall()
        return [ProductServiceOrder(
                    CodigoOrdenServicio=row[0],
                    CodigoServicio=row[1],
                    NumeroCorrelativoActividad=row[2],
                    FranquiciaRIF=row[3],
                    CodigoProducto=row[4],
                    CantidadUtilizada=row[5],
                    PrecioProducto=row[6]
                ) for row in product_orders]
    
    def createProductServiceOrder(self, CodigoOrdenServicio: int, CodigoServicio: int, NumeroCorrelativoActividad: int, FranquiciaRIF: str, CodigoProducto: int, CantidadUtilizada: int, PrecioProducto: float):
        try:
            database.execute("INSERT INTO ProductosOrdenServicio (CodigoOrdenServicio, CodigoServicio, NumeroCorrelativoActividad, FranquiciaRIF, CodigoProducto, CantidadUtilizada, PrecioProducto) VALUES (?, ?, ?, ?, ?, ?, ?)",
                            (CodigoOrdenServicio, CodigoServicio, NumeroCorrelativoActividad, FranquiciaRIF, CodigoProducto, CantidadUtilizada, PrecioProducto))
            conn.commit()
            return {"message": "Product order created successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error creating product order: {str(e)}")
        

    