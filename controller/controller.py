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
    
    def create_employee(self, CI: str, NombreCompleto: str, Direccion: str, Telefono: str, Salario: float, FranquiciaRIF: str):
        try:
            if not (0 <= len(CI) <= 10):
                raise HTTPException(status_code=400, detail="CI must be between 0 and 10 characters")
            if not(0 <= len(NombreCompleto) <= 100):
                raise HTTPException(status_code=400, detail="Name must be between 0 and 50 characters")
            if not(0 <= len(Direccion) <= 100):
                raise HTTPException(status_code=400, detail="Address must be between 0 and 100 characters")
            if not(0 <= len(Telefono) <= 12):
                raise HTTPException(status_code=400, detail="Phone number must be between 0 and 15 characters")
            if not (0 <= Salario <= 1000000):
                raise HTTPException(status_code=400, detail="Salary must be between 0 and 1,000,000")
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
            if not (0 <= Salario <= 1000000):
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
            if not (0 <= CodigoMarca <= 10000):
                raise HTTPException(status_code=400, detail="Brand code must be between 0 and 10,000")
            return self.brand_service.deleteBrand(CodigoMarca)
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)
        
    def update_brand(self, CodigoMarca: int, Nombre: str):
        try:
            if not (0 <= CodigoMarca <= 10000):
                raise HTTPException(status_code=400, detail="Brand code must be between 0 and 10,000")
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
            if not (0 <= CodigoMarca <= 10000):
                raise HTTPException(status_code=400, detail="Brand code must be between 0 and 10,000")
            if not (0 <= NumeroCorrelativoModelo <= 10000):
                raise HTTPException(status_code=400, detail="Model serial number must be between 0 and 10,000")
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
            if not (0 <= CodigoMarca <= 10000):
                raise HTTPException(status_code=400, detail="Model code must be between 0 and 10,000")
            if not (0 <= NumeroCorrelativoModelo <= 10000):
                raise HTTPException(status_code=400, detail="Model serial number must be between 0 and 10,000")
            return self.model_service.deleteModel(CodigoMarca, NumeroCorrelativoModelo)
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)

    def update_model(self, CodigoMarca: int, NumeroCorrelativoModelo: int, DescripcionModelo: str, CantidadPuestos: int, TipoRefrigerante: str, TipoGasolina: str, TipoAceite: str, Peso: float):
        try:
            if not (0 <= CodigoMarca <= 10000):
                raise HTTPException(status_code=400, detail="Model code must be between 0 and 10,000")
            if not (0 <= NumeroCorrelativoModelo <= 10000):
                raise HTTPException(status_code=400, detail="Model serial number must be between 0 and 10,000")
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
            if not (0 <= CodigoMarca <= 10000):
                raise HTTPException(status_code=400, detail="Brand code must be between 0 and 10,000")
            if not (0 <= NumeroCorrelativoModelo <= 10000):
                raise HTTPException(status_code=400, detail="Model serial number must be between 0 and 10,000")
            return self.vehicle_service.createVehicle(CodigoMarca, NumeroCorrelativoModelo, Placa, FechaAdquisicion, TipoAceite, CI_Propietario)
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)
        
    def delete_vehicle(self, CodigoVehiculo: int):
        try:
            if not (0 <= CodigoVehiculo <= 10000):
                raise HTTPException(status_code=400, detail="Vehicle code must be between 0 and 10,000")
            return self.vehicle_service.deleteVehicle(CodigoVehiculo)
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)
        
    def update_vehicle(self, CodigoVehiculo: int, CodigoMarca:int, NumeroCorrelativoModelo: int, Placa: str, FechaAdquisicion: str, TipoAceite: str, CI_Propietario: str):
        try:
            if not (0 <= CodigoVehiculo <= 10000):
                raise HTTPException(status_code=400, detail="Vehicle code must be between 0 and 10,000")
            if not (len(Placa) == 7):
                raise HTTPException(status_code=400, detail="Plate number must be between 0 and 10 characters")
            if not (0 <= len(TipoAceite) <= 50):
                raise HTTPException(status_code=400, detail="Oil type must be between 0 and 50 characters")
            if not (0 <= len(CI_Propietario) <= 10):
                raise HTTPException(status_code=400, detail="Owner CI must be between 0 and 10 characters")
            if not (0 <= CodigoMarca <= 10000):
                raise HTTPException(status_code=400, detail="Brand code must be between 0 and 10,000")
            if not (0 <= NumeroCorrelativoModelo <= 10000):
                raise HTTPException(status_code=400, detail="Model serial number must be between 0 and 10,000")
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
        
    