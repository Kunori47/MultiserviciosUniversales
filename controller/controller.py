from fastapi import UploadFile, HTTPException, Header
from services.services import *


class FranchiseController:
    def __init__(self):
        self.franchise_service = FranchiseService()

    def get_franchise(self):
        return self.franchise_service.getFranchise()
    
    def create_franchise(self, RIF: str, Nombre: str, Ciudad: str, CI_Encargado: Optional[str] = None, FechaInicioEncargado: Optional[str] = None, Estatus: str = "Activo"):
        try:
            if not (len(RIF) == 12):
                raise HTTPException(status_code=400, detail="RIF must be 12 characters")
            if not(0 <= len(Nombre) <= 50):
                raise HTTPException(status_code=400, detail="Name must be between 0 and 50 characters")
            if not(0 <= len(Ciudad) <= 50):
                raise HTTPException(status_code=400, detail="City must be between 0 and 50 characters")
            # if not(0 <= len(CI_Encargado) <= 10):
            #     raise HTTPException(status_code=400, detail="CI_Encargado must be between 0 and 10 characters or None")
            return self.franchise_service.createFranchise(RIF, Nombre, Ciudad, CI_Encargado, FechaInicioEncargado, Estatus)
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)
        
    def update_franchise(self, RIF: str, Nombre: str, Ciudad: str, CI_Encargado: Optional[str] = None, FechaInicioEncargado: Optional[str] = None, Estatus: str = "Activo"):
        try:
            if not (len(RIF) == 12):
                raise HTTPException(status_code=400, detail="RIF must be 12 characters")
            if not(0 <= len(Nombre) <= 50):
                raise HTTPException(status_code=400, detail="Name must be between 0 and 50 characters")
            if not(0 <= len(Ciudad) <= 50):
                raise HTTPException(status_code=400, detail="City must be between 0 and 50 characters")
            if not(0 <= len(CI_Encargado) <= 10):
                raise HTTPException(status_code=400, detail="CI_Encargado must be between 0 and 10 characters or None")
            return self.franchise_service.updateFranchise(RIF, Nombre, Ciudad, CI_Encargado, FechaInicioEncargado, Estatus)
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)

class EmployeeController:
    def __init__(self):
        self.employee_service = EmployeeService()

    def get_employees(self):
        return self.employee_service.getEmployees()
    
    def create_employee(self, CI: str, NombreCompleto: str, Direccion: str, Telefono: str, Salario: float, FranquiciaRIF: Optional[str]):
        try:
            if not (0 <= len(CI) <= 10):
                raise HTTPException(status_code=400, detail="CI must be between 0 and 10 characters")
            if not(0 <= len(NombreCompleto) <= 100):
                raise HTTPException(status_code=400, detail="Name must be between 0 and 50 characters")
            if not(0 <= len(Direccion) <= 100):
                raise HTTPException(status_code=400, detail="Address must be between 0 and 100 characters")
            if not(0 <= len(Telefono) <= 12):
                raise HTTPException(status_code=400, detail="Phone number must be between 0 and 15 characters")
            if not (0 <= Salario00):
                raise HTTPException(status_code=400, detail="Salary must be between 0 and 1,000,000")
            if FranquiciaRIF is not None:
                if not (len(FranquiciaRIF) == 12):
                    raise HTTPException(status_code=400, detail="Franchise RIF must be 12 characters")
            return self.employee_service.createEmployee(CI, NombreCompleto, Direccion, Telefono, Salario, FranquiciaRIF)
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)
        
    def delete_employee(self, CI: str):
        try:
            if not (0 <= len(CI) <= 10):
                raise HTTPException(status_code=400, detail="CI must be between 0 and 10 characters")
            return self.employee_service.deleteEmployee(CI)
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)
        
    def update_employee(self, CI: str, NombreCompleto: str, Direccion: str, Telefono: str, Salario: float, FranquiciaRIF: str):
        try:
            if not (0 <= len(CI) <= 10):
                raise HTTPException(status_code=400, detail="CI must be between 0 and 10 characters")
            if not(0 <= len(NombreCompleto) <= 100):
                raise HTTPException(status_code=400, detail="Name must be between 0 and 50 characters")
            if not(0 <= len(Direccion) <= 100):
                raise HTTPException(status_code=400, detail="Address must be between 0 and 100 characters")
            if not(0 <= len(Telefono) <= 12):
                raise HTTPException(status_code=400, detail="Phone number must be between 0 and 15 characters")
            if not (0 <= Salario00):
                raise HTTPException(status_code=400, detail="Salary must be between 0 and 1,000,000")
            if not (len(FranquiciaRIF) == 12):
                raise HTTPException(status_code=400, detail="Franchise RIF must be 12 characters")
            return self.employee_service.updateEmployee(CI, NombreCompleto, Direccion, Telefono, Salario, FranquiciaRIF)
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)
        
class BrandController:
    def __init__(self):
        self.brand_service = BrandService()

    def get_brands(self):
        return self.brand_service.getBrands()
    
    def create_brand(self, Nombre: str):
        try:
            if not(0 <= len(Nombre) <= 50):
                raise HTTPException(status_code=400, detail="Name must be between 0 and 50 characters")
            return self.brand_service.createBrand(Nombre)
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)
        
    def delete_brand(self, CodigoMarca: int):
        try:
            if not (0 <= CodigoMarca):
                raise HTTPException(status_code=400, detail="Brand code must be a positive integer")
            return self.brand_service.deleteBrand(CodigoMarca)
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)
        
    def update_brand(self, CodigoMarca: int, Nombre: str):
        try:
            if not (0 <= CodigoMarca):
                raise HTTPException(status_code=400, detail="Brand code must be a positive integer")
            if not(0 <= len(Nombre) <= 50):
                raise HTTPException(status_code=400, detail="Name must be between 0 and 50 characters")
            return self.brand_service.updateBrand(CodigoMarca, Nombre)
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)
        
class ModelController:  
    def __init__(self):
        self.model_service = ModelService()

    def get_models(self):
        return self.model_service.getModels()
    
    def create_model(self, CodigoMarca: int, NumeroCorrelativoModelo: int, DescripcionModelo: str, CantidadPuestos: int, TipoRefrigerante: str, TipoGasolina: str, TipoAceite: str, Peso: float):
        try:
            if not (0 <= CodigoMarca):
                raise HTTPException(status_code=400, detail="Brand code must be a positive integer")
            if not (0 <= NumeroCorrelativoModelo):
                raise HTTPException(status_code=400, detail="Model serial number must be a positive integer")
            if not(0 <= len(DescripcionModelo) <= 100):
                raise HTTPException(status_code=400, detail="Description must be between 0 and 100 characters")
            if not (1 <= CantidadPuestos <= 50):
                raise HTTPException(status_code=400, detail="Number of seats must be between 1 and 50")
            if not(0 <= len(TipoRefrigerante) <= 50):
                raise HTTPException(status_code=400, detail="Refrigerant type must be between 0 and 50 characters")
            if not(0 <= len(TipoGasolina) <= 50):
                raise HTTPException(status_code=400, detail="Gasoline type must be between 0 and 50 characters")
            if not(0 <= len(TipoAceite) <= 50):
                raise HTTPException(status_code=400, detail="Oil type must be between 0 and 50 characters")
            if not (0.1 <= Peso <= 5000.0):
                raise HTTPException(status_code=400, detail="Weight must be between 0.1 and 5000 kg")
            return self.model_service.createModel(CodigoMarca, NumeroCorrelativoModelo, DescripcionModelo, CantidadPuestos, TipoRefrigerante, TipoGasolina, TipoAceite, Peso)
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)
        
    def delete_model(self, CodigoMarca: int, NumeroCorrelativoModelo: int):
        try:
            if not (0 <= CodigoMarca):
                raise HTTPException(status_code=400, detail="Model code must be a positive integer")
            if not (0 <= NumeroCorrelativoModelo):
                raise HTTPException(status_code=400, detail="Model serial number must be a positive integer")
            return self.model_service.deleteModel(CodigoMarca, NumeroCorrelativoModelo)
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)

    def update_model(self, CodigoMarca: int, NumeroCorrelativoModelo: int, DescripcionModelo: str, CantidadPuestos: int, TipoRefrigerante: str, TipoGasolina: str, TipoAceite: str, Peso: float):
        try:
            if not (0 <= CodigoMarca):
                raise HTTPException(status_code=400, detail="Model code must be a positive integer")
            if not (0 <= NumeroCorrelativoModelo):
                raise HTTPException(status_code=400, detail="Model serial number must be a positive integer")
            if not(0 <= len(DescripcionModelo) <= 100):
                raise HTTPException(status_code=400, detail="Description must be between 0 and 100 characters")
            if not (1 <= CantidadPuestos <= 50):
                raise HTTPException(status_code=400, detail="Number of seats must be between 1 and 50")
            if not(0 <= len(TipoRefrigerante) <= 50):
                raise HTTPException(status_code=400, detail="Refrigerant type must be between 0 and 50 characters")
            if not(0 <= len(TipoGasolina) <= 50):
                raise HTTPException(status_code=400, detail="Gasoline type must be between 0 and 50 characters")
            if not(0 <= len(TipoAceite) <= 50):
                raise HTTPException(status_code=400, detail="Oil type must be between 0 and 50 characters")
            if not (0.1 <= Peso <= 5000.0):
                raise HTTPException(status_code=400, detail="Weight must be between 0.1 and 5000 kg")
            return self.model_service.updateModel(CodigoMarca, NumeroCorrelativoModelo, DescripcionModelo, CantidadPuestos, TipoRefrigerante, TipoGasolina, TipoAceite, Peso)
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)
        
class VehicleController:
    def __init__(self):
        self.vehicle_service = VehicleService()

    def get_vehicles(self):
        return self.vehicle_service.getVehicles()
    
    def create_vehicle(self, CodigoMarca: int, NumeroCorrelativoModelo: int, Placa: str, FechaAdquisicion: str, TipoAceite: str, CI_Propietario: str):
        try:
            if not (len(Placa) == 7):
                raise HTTPException(status_code=400, detail="Plate number must be between 0 and 10 characters")
            if not (0 <= len(TipoAceite) <= 50):
                raise HTTPException(status_code=400, detail="Oil type must be between 0 and 50 characters")
            if not (0 <= len(CI_Propietario) <= 10):
                raise HTTPException(status_code=400, detail="Owner CI must be between 0 and 10 characters")
            if not (0 <= CodigoMarca):
                raise HTTPException(status_code=400, detail="Brand code must be a positive integer")
            if not (0 <= NumeroCorrelativoModelo):
                raise HTTPException(status_code=400, detail="Model serial number must be a positive integer")
            return self.vehicle_service.createVehicle(CodigoMarca, NumeroCorrelativoModelo, Placa, FechaAdquisicion, TipoAceite, CI_Propietario)
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)
        
    def delete_vehicle(self, CodigoVehiculo: int):
        try:
            if not (0 <= CodigoVehiculo):
                raise HTTPException(status_code=400, detail="Vehicle code must be a positive integer")
            return self.vehicle_service.deleteVehicle(CodigoVehiculo)
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)
        
    def update_vehicle(self, CodigoVehiculo: int, CodigoMarca:int, NumeroCorrelativoModelo: int, Placa: str, FechaAdquisicion: str, TipoAceite: str, CI_Propietario: str):
        try:
            if not (0 <= CodigoVehiculo):
                raise HTTPException(status_code=400, detail="Vehicle code must be a positive integer")
            if not (len(Placa) == 7):
                raise HTTPException(status_code=400, detail="Plate number must be between 0 and 10 characters")
            if not (0 <= len(TipoAceite) <= 50):
                raise HTTPException(status_code=400, detail="Oil type must be between 0 and 50 characters")
            if not (0 <= len(CI_Propietario) <= 10):
                raise HTTPException(status_code=400, detail="Owner CI must be between 0 and 10 characters")
            if not (0 <= CodigoMarca):
                raise HTTPException(status_code=400, detail="Brand code must be a positive integer")
            if not (0 <= NumeroCorrelativoModelo):
                raise HTTPException(status_code=400, detail="Model serial number must be a positive integer")
            return self.vehicle_service.updateVehicle(CodigoVehiculo, CodigoMarca, NumeroCorrelativoModelo, Placa, FechaAdquisicion, TipoAceite, CI_Propietario)
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)

class CustomerController:
    def __init__(self):
        self.customer_service = CustomerService()

    def get_customers(self):
        return self.customer_service.getCustomer()
    
    def create_customer(self, CI: str, NombreCompleto: str, Email: str):
        try:
            if not (0 <= len(CI) <= 10):
                raise HTTPException(status_code=400, detail="CI must be between 0 and 10 characters")
            if not(0 <= len(NombreCompleto) <= 50):
                raise HTTPException(status_code=400, detail="Name must be between 0 and 50 characters")
            if not(0 <= len(Email) <= 50 and "@" in Email):
                raise HTTPException(status_code=400, detail="Email must be between 0 and 50 characters and contain '@'")
            return self.customer_service.createCustomer(CI, NombreCompleto, Email)
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)
        
    def delete_customer(self, CI: str):
        try:
            if not (0 <= len(CI) <= 10):
                raise HTTPException(status_code=400, detail="CI must be between 0 and 10 characters")
            return self.customer_service.deleteCustomer(CI)
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)
        
    def update_customer(self, CI: str, NombreCompleto: str, Email: str):
        try:
            if not (0 <= len(CI) <= 10):
                raise HTTPException(status_code=400, detail="CI must be between 0 and 10 characters")
            if not(0 <= len(NombreCompleto) <= 50):
                raise HTTPException(status_code=400, detail="Name must be between 0 and 50 characters")
            if not(0 <= len(Email) <= 50 and "@" in Email):
                raise HTTPException(status_code=400, detail="Email must be between 0 and 50 characters and contain '@'")
            return self.customer_service.updateCustomer(CI, NombreCompleto, Email)
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)
        
class MaintenancePlanController:
    def __init__(self):
        self.maintenance_plan_service = MaintenancePlanService()
        
    def get_MaintenancePlan(self):
        return self.maintenance_plan_service.getMaintenancePlan()
    
    def create_MaintenancePlan(self, 
                TiempoUso: int, 
                Kilometraje: int,
                DescripcionMantenimiento: str,
                CodigoMarca: int,
                NumeroCorrelativoModelo: int):
        try:
            if not (TiempoUso >= 0):
                raise HTTPException(status_code=400, detail="TiempoUso debe mayor a 0")
            if not(Kilometraje >= 0):
                raise HTTPException(status_code=400, detail="Kilometraje debe ser mayor a 0")
            if not(0 <= len(DescripcionMantenimiento) <= 100):
                raise HTTPException(status_code=400, detail="DescripcionMantenimiento must be between 0 and 100 characters ")
            return self.maintenance_plan_service.createMaintenancePlan(
                TiempoUso, 
                Kilometraje,
                DescripcionMantenimiento,
                CodigoMarca,
                NumeroCorrelativoModelo)
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)
        
    def delete_MaintenancePlan(self, CodigoMantenimiento: str):
        try:
            if not (0 <= CodigoMantenimiento):
                raise HTTPException(status_code=400, detail="CodigoMantenimiento debe ser mayor o igual a 0")
            return self.maintenance_plan_service.deleteMaintenancePlan(CodigoMantenimiento)
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)
        
    def update_MaintenancePlan(self, 
                CodigoMantenimiento: int,
                TiempoUso: int,
                Kilometraje: int,
                DescripcionMantenimiento: str,
                CodigoMarca: int,
                NumeroCorrelativoModelo: int):
        try:
            if not (0 <= CodigoMantenimiento):
                raise HTTPException(status_code=400, detail="CodigoMantenimiento debe ser mayor o igual a 0")
            if not (TiempoUso >= 0):
                raise HTTPException(status_code=400, detail="TiempoUso debe mayor a 0")
            if not(Kilometraje >= 0):
                raise HTTPException(status_code=400, detail="Kilometraje debe ser mayor a 0")
            if not(0 <= len(DescripcionMantenimiento) <= 100):
                raise HTTPException(status_code=400, detail="DescripcionMantenimiento must be between 0 and 100 characters ")
            return self.maintenance_plan_service.updateMaintenancePlan(
                CodigoMantenimiento,
                TiempoUso,
                Kilometraje,
                DescripcionMantenimiento,
                CodigoMarca,
                NumeroCorrelativoModelo)
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)
   
class SpecialtyController:
    def __init__(self):
        self.specialty_service = SpecialtyService()

    def get_specialties(self):
        return self.specialty_service.getSpecialties()

    def create_specialty(self, DescripcionEspecialidad: str):
        try:
            if not(0 < len(DescripcionEspecialidad) <= 50):
                raise HTTPException(status_code=400, detail="La descripción debe tener entre 1 y 50 caracteres")
            return self.specialty_service.createSpecialty(DescripcionEspecialidad)
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)

    def delete_specialty(self, CodigoEspecialidad: int):
        try:
            if not (0 <= CodigoEspecialidad):
                raise HTTPException(status_code=400, detail="El código debe ser mayor o igual a 0")
            return self.specialty_service.deleteSpecialty(CodigoEspecialidad)
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)

    def update_specialty(self, CodigoEspecialidad: int, DescripcionEspecialidad: str):
        try:
            if not (0 <= CodigoEspecialidad):
                raise HTTPException(status_code=400, detail="El código debe ser mayor o igual a 0")
            if not(0 < len(DescripcionEspecialidad) <= 50):
                raise HTTPException(status_code=400, detail="La descripción debe tener entre 1 y 50 caracteres")
            return self.specialty_service.updateSpecialty(CodigoEspecialidad, DescripcionEspecialidad)
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)
        
    
        

class ServiceController:

    def __init__(self):
        self.service_service = ServiceService()

    def get_services(self):
        return self.service_service.getServices()
    
    def create_service(self, NombreServicio: str):
        try:
            if not(0 <= len(NombreServicio) <= 50):
                raise HTTPException(status_code=400, detail="Service name must be between 0 and 50 characters")
            return self.service_service.createService(NombreServicio)
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)
        
    def delete_service(self, CodigoServicio: int):
        try:
            if not (0 <= CodigoServicio):
                raise HTTPException(status_code=400, detail="Service code must be a positive integer")
            return self.service_service.deleteService(CodigoServicio)
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)
        
    def update_service(self, CodigoServicio: int, NombreServicio: str):
        try:
            if not (0 <= CodigoServicio):
                raise HTTPException(status_code=400, detail="Service code must be a positive integer")
            if not(0 <= len(NombreServicio) <= 50):
                raise HTTPException(status_code=400, detail="Service name must be between 0 and 50 characters")
            return self.service_service.updateService(CodigoServicio, NombreServicio)
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)
        
class SupplierLineController:

    def __init__(self):
        self.supplier_line_service = SupplierLineService()

    def get_supplier_lines(self):
        return self.supplier_line_service.getSupplierLines()
    
    def create_supplier_line(self, DescripcionLinea: str):
        try:
            if not(0 <= len(DescripcionLinea) <= 100):
                raise HTTPException(status_code=400, detail="Supplier line description must be between 0 and 100 characters")
            return self.supplier_line_service.createSupplierLine(DescripcionLinea)
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)
        
    def delete_supplier_line(self, CodigoLinea: int):
        try:
            if not (0 <= CodigoLinea):
                raise HTTPException(status_code=400, detail="Supplier line code must be a positive integer")
            return self.supplier_line_service.deleteSupplierLine(CodigoLinea)
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)
        
    def update_supplier_line(self, CodigoLinea: int, DescripcionLinea: str):
        try:
            if not (0 <= CodigoLinea):
                raise HTTPException(status_code=400, detail="Supplier line code must be a positive integer")
            if not(0 <= len(DescripcionLinea) <= 100):
                raise HTTPException(status_code=400, detail="Supplier line description must be between 0 and 100 characters")
            return self.supplier_line_service.updateSupplierLine(CodigoLinea, DescripcionLinea)
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)
        
class ProductController:

    def __init__(self):
        self.product_service = ProductService()

    def get_products(self):
        return self.product_service.getProducts()
    
    def create_product(self, NombreProducto: str, DescripcionProducto: str, LineaSuministro: int, Tipo: str, NivelContaminante: Optional[int], Tratamiento: Optional[str]):
        try:
            if not(0 <= len(NombreProducto) <= 50):
                raise HTTPException(status_code=400, detail="Product name must be between 0 and 50 characters")
            if not(0 <= len(DescripcionProducto) <= 100):
                raise HTTPException(status_code=400, detail="Product description must be between 0 and 100 characters")
            if not (0 <= LineaSuministro):
                raise HTTPException(status_code=400, detail="Supplier line code must be a positive integer")
            if not(0 <= len(Tipo) <= 50):
                raise HTTPException(status_code=400, detail="Product type must be between 0 and 50 characters")
            if not (NivelContaminante is None):
                if not(1 <= NivelContaminante <= 5) and NivelContaminante is not None:
                    raise HTTPException(status_code=400, detail="Pollution level must be between 1 and 5 or null")
                if not(0 <= len(Tratamiento) <= 100) and Tratamiento is not None:
                    raise HTTPException(status_code=400, detail="Product treatment must be between 0 and 100 characters or null")
            return self.product_service.createProduct(NombreProducto, DescripcionProducto, LineaSuministro, Tipo, NivelContaminante, Tratamiento)
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)
        
    def delete_product(self, CodigoProducto: int):
        try:
            if not (0 <= CodigoProducto):
                raise HTTPException(status_code=400, detail="Product code must be a positive integer")
            return self.product_service.deleteProduct(CodigoProducto)
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)
        
    def update_product(self, CodigoProducto: int, NombreProducto: str, DescripcionProducto: str, LineaSuministro: int, Tipo: str, NivelContaminante: Optional[int], Tratamiento: Optional[str]):
        try:
            if not (0 <= CodigoProducto):
                raise HTTPException(status_code=400, detail="Product code must be a positive integer")
            if not(0 <= len(NombreProducto) <= 50):
                raise HTTPException(status_code=400, detail="Product name must be between 0 and 50 characters")
            if not(0 <= len(DescripcionProducto) <= 100):
                raise HTTPException(status_code=400, detail="Product description must be between 0 and 100 characters")
            if not (0 <= LineaSuministro):
                raise HTTPException(status_code=400, detail="Supplier line code must be a positive integer")
            if not(0 <= len(Tipo) <= 50):
                raise HTTPException(status_code=400, detail="Product type must be between 0 and 50 characters")
            if not (NivelContaminante is None):
                if not(1 <= NivelContaminante <= 5) and NivelContaminante is not None:
                    raise HTTPException(status_code=400, detail="Pollution level must be between 1 and 5 or null")
                if not(0 <= len(Tratamiento) <= 100) and Tratamiento is not None:
                    raise HTTPException(status_code=400, detail="Product treatment must be between 0 and 100 characters or null")
                return self.product_service.updateProduct(CodigoProducto, NombreProducto, DescripcionProducto, LineaSuministro, Tipo, NivelContaminante, Tratamiento)
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)
        
class VendorController:

    def __init__(self):
        self.vendor_service = VendorService()

    def get_vendors(self):
        return self.vendor_service.getVendors()
    
    def create_vendor(self, RIF: str, RazonSocial: str, Direccion: str, TelefonoLocal: str, TelefonoCelular: str, PersonaContacto: str):
        try:
            if not (len(RIF) == 12):
                raise HTTPException(status_code=400, detail="RIF must be 12 characters")
            if not(0 <= len(RazonSocial) <= 50):
                raise HTTPException(status_code=400, detail="Social reason must be between 0 and 100 characters")
            if not(0 <= len(Direccion) <= 100):
                raise HTTPException(status_code=400, detail="Address must be between 0 and 100 characters")
            if not(len(TelefonoLocal) == 12):
                raise HTTPException(status_code=400, detail="Local phone number must be 12 characters")
            if not(len(TelefonoCelular) == 12):
                raise HTTPException(status_code=400, detail="Cell phone number must be 12 characters")
            if not(0 <= len(PersonaContacto) <= 50 and "@" in PersonaContacto):
                raise HTTPException(status_code=400, detail="Email must be between 0 and 50 characters and contain '@'")
            return self.vendor_service.createVendor(RIF, RazonSocial, Direccion, TelefonoLocal, TelefonoCelular, PersonaContacto)
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)
        
    def delete_vendor(self, RIF: str):
        try:
            if not (len(RIF) == 12):
                raise HTTPException(status_code=400, detail="RIF must be 12 characters")
            return self.vendor_service.deleteVendor(RIF)
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)
    
    def update_vendor(self, RIF: str, RazonSocial: str, Direccion: str, TelefonoLocal: str, TelefonoCelular: str, PersonaContacto: str):
        try:
            if not (len(RIF) == 12):
                raise HTTPException(status_code=400, detail="RIF must be 12 characters")
            if not(0 <= len(RazonSocial) <= 50):
                raise HTTPException(status_code=400, detail="Social reason must be between 0 and 100 characters")
            if not(0 <= len(Direccion) <= 100):
                raise HTTPException(status_code=400, detail="Address must be between 0 and 100 characters")
            if not(len(TelefonoLocal) == 12):
                raise HTTPException(status_code=400, detail="Local phone number must be 12 characters")
            if not(len(TelefonoCelular) == 12):
                raise HTTPException(status_code=400, detail="Cell phone number must be 12 characters")
            if not(0 <= len(PersonaContacto) <= 50):
                raise HTTPException(status_code=400, detail="Email must be between 0 and 50 characters and contain '@'")
            return self.vendor_service.updateVendor(RIF, RazonSocial, Direccion, TelefonoLocal, TelefonoCelular, PersonaContacto)
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)
        
class ServiceOrderController:

    def __init__(self):
        self.service_order_service = ServiceOrderService()

    def get_service_orders(self):
        return self.service_order_service.getServiceOrders()
    
    def create_service_order(self, FechaEntrada: str, HoraEntrada: str, FechaSalidaEstimada: str, HoraSalidaEstimada: str, CodigoVehiculo: int):
        try:
            if not(0 <= len(FechaEntrada) <= 10):
                raise HTTPException(status_code=400, detail="Entry date must be in format YYYY-MM-DD")
            if not(0 <= len(HoraEntrada) <= 5):
                raise HTTPException(status_code=400, detail="Entry time must be in format HH:MM")
            if not(0 <= len(FechaSalidaEstimada) <= 10):
                raise HTTPException(status_code=400, detail="Estimated exit date must be in format YYYY-MM-DD")
            if not(0 <= len(HoraSalidaEstimada) <= 5):
                raise HTTPException(status_code=400, detail="Estimated exit time must be in format HH:MM")
            if not (0 <= CodigoVehiculo):
                raise HTTPException(status_code=400, detail="Vehicle code must be a positive integer")
            return self.service_order_service.createServiceOrder(FechaEntrada, HoraEntrada, FechaSalidaEstimada, HoraSalidaEstimada, CodigoVehiculo)
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)
        
    def update_service_order(self, ID: int, FechaSalidaReal: Optional[str], HoraSalidaReal: Optional[str], Comentario: Optional[str]):
        try:
            if not (0 <= ID):
                raise HTTPException(status_code=400, detail="Service order ID must be a positive integer")
            if FechaSalidaReal is not None and not(0 <= len(FechaSalidaReal) <= 10):
                raise HTTPException(status_code=400, detail="Exit date must be in format YYYY-MM-DD")
            if HoraSalidaReal is not None and not(0 <= len(HoraSalidaReal) <= 5):
                raise HTTPException(status_code=400, detail="Exit time must be in format HH:MM")
            if Comentario is not None and not(0 <= len(Comentario) <= 200):
                raise HTTPException(status_code=400, detail="Comment must be between 0 and 200 characters")
            return self.service_order_service.updateServiceOrder(ID, FechaSalidaReal, HoraSalidaReal, Comentario)
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)
        
class InvoiceController:

    def __init__(self):
        self.invoice_service = InvoiceService()

    def get_invoices(self):
        return self.invoice_service.getInvoices()

    def create_invoice(self, FechaEmision: str, MontoTotal: float, IVA: float, Descuento: float, OrdenServicioID: int, FranquiciaRIF: str):
        try:
            if not(0 <= len(FechaEmision) <= 10):
                raise HTTPException(status_code=400, detail="Issue date must be in format YYYY-MM-DD")
            if not (0 <= MontoTotal):
                raise HTTPException(status_code=400, detail="Total amount must be a positive number")
            if not (0 <= IVA):
                raise HTTPException(status_code=400, detail="VAT amount must be a positive number")
            if not (0 <= Descuento):
                raise HTTPException(status_code=400, detail="Discount amount must be a positive number")
            if not (0 <= OrdenServicioID):
                raise HTTPException(status_code=400, detail="Service order ID must be a positive integer")
            if not (len(FranquiciaRIF) == 12):
                raise HTTPException(status_code=400, detail="Franchise RIF must be 12 characters")
            return self.invoice_service.createInvoice(FechaEmision, MontoTotal, IVA, Descuento, OrdenServicioID, FranquiciaRIF)
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)
        
        
class PurchaseController:

    def __init__(self):
        self.purchase_service = PurchaseService()

    def get_purchases(self):
        return self.purchase_service.getPurchases()
    
    def create_purchase(self, Fecha: str, ProveedorRIF: str):
        try:
            if not(0 <= len(Fecha) <= 10):
                raise HTTPException(status_code=400, detail="Date must be in format YYYY-MM-DD")
            if not (len(ProveedorRIF) == 12):
                raise HTTPException(status_code=400, detail="Provider RIF must be 12 characters")
            return self.purchase_service.createPurchase(Fecha, ProveedorRIF)
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)
        
class ProductFranchiseController:

    def __init__(self):
        self.product_franchise_service = ProductFranchiseService()

    def get_product_franchises(self):
        return self.product_franchise_service.getProductFranchises()

    def create_product_franchise(self, FranquiciaRIF: str, CodigoProducto: int, Precio: float, Cantidad: int, CantidadMinima: int, CantidadMaxima: int):
        try:
            if not (len(FranquiciaRIF) == 12):
                raise HTTPException(status_code=400, detail="Franchise RIF must be 12 characters")
            if not (0 <= CodigoProducto):
                raise HTTPException(status_code=400, detail="Product code must be a positive integer")
            if not (0 <= Precio):
                raise HTTPException(status_code=400, detail="Price must be a positive number")
            if not (0 <= Cantidad):
                raise HTTPException(status_code=400, detail="Quantity must be a positive integer")
            if not (0 <= CantidadMinima <= CantidadMaxima):
                raise HTTPException(status_code=400, detail="Minimum quantity must be less than or equal to maximum quantity")
            if not (0 <= CantidadMaxima):
                raise HTTPException(status_code=400, detail="Maximum quantity must be a positive integer")
            return self.product_franchise_service.createProductFranchise(FranquiciaRIF, CodigoProducto, Precio, Cantidad, CantidadMinima, CantidadMaxima)
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)
        
    def delete_product_franchise(self, FranquiciaRIF: str, CodigoProducto: int):
        try:
            if not (len(FranquiciaRIF) == 12):
                raise HTTPException(status_code=400, detail="Franchise RIF must be 12 characters")
            if not (0 <= CodigoProducto):
                raise HTTPException(status_code=400, detail="Product code must be a positive integer")
            return self.product_franchise_service.deleteProductFranchise(FranquiciaRIF, CodigoProducto)
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)
        
    def update_product_franchise(self, FranquiciaRIF: str, CodigoProducto: int, Precio: float, Cantidad: int, CantidadMinima: int, CantidadMaxima: int):
        try:
            if not (len(FranquiciaRIF) == 12):
                raise HTTPException(status_code=400, detail="Franchise RIF must be 12 characters")
            if not (0 <= CodigoProducto):
                raise HTTPException(status_code=400, detail="Product code must be a positive integer")
            if not (0 <= Precio):
                raise HTTPException(status_code=400, detail="Price must be a positive number")
            if not (0 <= Cantidad):
                raise HTTPException(status_code=400, detail="Quantity must be a positive integer")
            if not (0 <= CantidadMinima <= CantidadMaxima):
                raise HTTPException(status_code=400, detail="Minimum quantity must be less than or equal to maximum quantity")
            if not (0 <= CantidadMaxima):
                raise HTTPException(status_code=400, detail="Maximum quantity must be a positive integer")
            return self.product_franchise_service.updateProductFranchise(FranquiciaRIF, CodigoProducto, Precio, Cantidad, CantidadMinima, CantidadMaxima)
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)
        
class ActivityController:

    def __init__(self):
        self.activity_service = ActivityService()

    def get_activities(self):
        return self.activity_service.getActivities()
    
    def create_activity(self, CodigoServicio: int, NumeroCorrelativoActividad: int, DescripcionActividad: str, CostoManoDeObra: float):
        try:
            if not (0 <= CodigoServicio):
                raise HTTPException(status_code=400, detail="Service code must be a positive integer")
            if not (0 <= NumeroCorrelativoActividad):
                raise HTTPException(status_code=400, detail="Activity serial number must be a positive integer")
            if not(0 <= len(DescripcionActividad) <= 100):
                raise HTTPException(status_code=400, detail="Activity description must be between 0 and 100 characters")
            if not (0 <= CostoManoDeObra):
                raise HTTPException(status_code=400, detail="Labor cost must be a positive number")    
            return self.activity_service.createActivity(CodigoServicio, NumeroCorrelativoActividad, DescripcionActividad, CostoManoDeObra)
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)
        
    def delete_activity(self, CodigoServicio: int, NumeroCorrelativoActividad: int):
        try:
            if not (0 <= CodigoServicio):
                raise HTTPException(status_code=400, detail="Service code must be a positive integer")
            if not (0 <= NumeroCorrelativoActividad):
                raise HTTPException(status_code=400, detail="Activity serial number must be a positive integer")
            return self.activity_service.deleteActivity(CodigoServicio, NumeroCorrelativoActividad)
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)
        
class OrderxActivityController:

    def __init__(self):
        self.order_activity_service = OrderActivityService()

    def get_order_activities(self):
        return self.order_activity_service.getOrderActivities()
    
    def create_order_activity(self, ID: int, CodigoServicio: int, NumeroCorrelativoActividad: int, Costo_Act: float):
        try:
            if not (0 <= ID):
                raise HTTPException(status_code=400, detail="Order ID must be a positive integer")
            if not (0 <= CodigoServicio):
                raise HTTPException(status_code=400, detail="Service code must be a positive integer")
            if not (0 <= NumeroCorrelativoActividad):
                raise HTTPException(status_code=400, detail="Activity serial number must be a positive integer")
            if not (0 <= Costo_Act):
                raise HTTPException(status_code=400, detail="Activity cost must be a positive number")
            return self.order_activity_service.createOrderActivity(ID, CodigoServicio, NumeroCorrelativoActividad, Costo_Act)
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)


class PayController:

    def __init__(self):
        self.pay_service = PayService()

    def get_pays(self):
        try:
            return self.pay_service.getPays()
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error retrieving payments: {str(e)}")

    def create_pay(self, pay: Pay):
        try:
            return self.pay_service.createPay(pay)
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error creating payment: {str(e)}")

    def update_pay(self, NumeroFactura: int, NumeroCorrelativoPago: int, pay_data: Pay):
        try:
            return self.pay_service.updatePay(NumeroFactura, NumeroCorrelativoPago, pay_data)
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error updating payment: {str(e)}")

    def delete_pay(self, NumeroFactura: int, NumeroCorrelativoPago: int):
        try:
            return self.pay_service.deletePay(NumeroFactura, NumeroCorrelativoPago)
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error deleting payment: {str(e)}")

class CustomerPhoneController:
    def __init__(self):
        self.service = CustomerPhoneService()
    def get_customer_phone(self):
        return self.service.getCustomerPhones()
    def create_customer_phone(self, telefono_cliente: CustomerPhoneService):
        return self.service.createCustomerPhone(telefono_cliente)
    def delete_customer_phone(self, Cliente: str, Telefono: str):
        return self.service.deleteCustomerPhone(Cliente, Telefono)
    def update_customer_phone(self, Cliente: str, Telefono: str, new_telefono: str):
        return self.service.updateCustomerPhone(Cliente, Telefono, new_telefono)

class EmployeeOrderController:
    def __init__(self):
        self.service = EmployeeOrder()
    def get_employee_order(self):
        return self.service.getEmployeeOrders()
    def create_employee_order(self, empleado_orden: EmployeeOrder):
        return self.service.createEmployeeOrder(empleado_orden)

class SpecialtyEmployeeController:
    def __init__(self):
        self.service = SpecialtyEmployee()
    def get_specialty_employee(self):
        return self.service.getSpecialtyEmployee()
    def create_specialty_employee(self, especialidad_empleado: SpecialtyEmployee):
        return self.service.createSpecialtyEmployee(especialidad_empleado)
    def delete_specialty_employee(self, EmpleadoCI: str, CodigoEspecialidad: int):
        return self.service.deleteSpecialtyEmployee(EmpleadoCI, CodigoEspecialidad)

class VehicleMaintenanceController:
    def __init__(self):
        self.service = VehicleMaintenanceService()

    def get_vehicle_maintenances(self):
        return self.service.get_all()

    def create_vehicle_maintenance(self, maintenance: VehicleMaintenance):
        return self.service.create(maintenance)

    def delete_vehicle_maintenance(self, Vehiculo: int, FechaMantenimiento: date, DescripcionMantenimiento: str):
        return self.service.delete(Vehiculo, FechaMantenimiento, DescripcionMantenimiento)

class EmployeeResponsibilityController:
    def __init__(self):
        self.service = EmployeeResponsibilityService()

    def get_employee_responsibilities(self):
        return self.service.get_all()

    def create_employee_responsibility(self, responsibility: EmployeeResponsibility):
        return self.service.create(responsibility)

    def delete_employee_responsibility(self, EmpleadoCI: str, CodigoServicio: int):
        return self.service.delete(EmpleadoCI, CodigoServicio)

class FranchiseServiceLinkController:
    def __init__(self):
        self.service = FranchiseServiceLinkService()

    def get_franchise_service_links(self):
        return self.service.get_all()

    def create_franchise_service_link(self, link: FranchiseServiceLink):
        return self.service.create(link)

    def delete_franchise_service_link(self, FranquiciaRIF: str, CodigoServicio: int):
        return self.service.delete(FranquiciaRIF, CodigoServicio)