from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse
from controller.controller import *
from database import database
from models import *

router = APIRouter()

@router.get("/")
async def read_root():
    return RedirectResponse(url="/docs")

@router.get("/franchise", tags=["Franquicia"], response_model=list[Franchise])
async def read_franchise():
    return FranchiseController().get_franchise()

@router.post("/franchise/create", tags=["Franquicia"], response_model=dict)
async def create_franchise(RIF: str, Nombre: str, Ciudad: str, CI_Encargado: Optional[str] = None, FechaInicioEncargado: Optional[str] = None, Estatus: str = "Activo"):
    return FranchiseController().create_franchise(RIF, Nombre, Ciudad, CI_Encargado, FechaInicioEncargado, Estatus)

@router.put("/franchise/update", tags=["Franquicia"], response_model=dict)
async def update_franchise(RIF: str, Nombre: str, Ciudad: str, CI_Encargado: Optional[str] = None, FechaInicioEncargado: Optional[str] = None, Estatus: str = "Activo"):
    return FranchiseController().update_franchise(RIF, Nombre, Ciudad, CI_Encargado, FechaInicioEncargado, Estatus)

@router.get("/employee", tags=["Empleado"], response_model=list[Employee])
async def read_employee():
    return EmployeeController().get_employees()

@router.post("/employee/create", tags=["Empleado"], response_model=dict)
async def create_employee(CI: str, NombreCompleto: str, Direccion: str, Telefono: str, Salario: float, FranquiciaRIF: str):
    return EmployeeController().create_employee(CI, NombreCompleto, Direccion, Telefono, Salario, FranquiciaRIF)

@router.delete("/employee/delete", tags=["Empleado"], response_model=dict)
async def delete_employee(CI: str):
    return EmployeeController().delete_employee(CI)

@router.put("/employee/update", tags=["Empleado"], response_model=dict)
async def update_employee(CI: str, NombreCompleto: str, Direccion: str, Telefono: str, Salario: float, FranquiciaRIF: str):
    return EmployeeController().update_employee(CI, NombreCompleto, Direccion, Telefono, Salario, FranquiciaRIF)

@router.get("/brand", tags=["Marca"], response_model=list[Marca])
async def read_brands():
    return BrandController().get_brands()

@router.post("/brand/create", tags=["Marca"], response_model=dict)
async def create_brand(Nombre: str):
    return BrandController().create_brand(Nombre)

@router.delete("/brand/delete", tags=["Marca"], response_model=dict)
async def delete_brand(CodigoMarca: int):
    return BrandController().delete_brand(CodigoMarca)

@router.put("/brand/update", tags=["Marca"], response_model=dict)
async def update_brand(CodigoMarca: int, Nombre: str):
    return BrandController().update_brand(CodigoMarca, Nombre)

@router.get("/model", tags=["Modelo"], response_model=list[Model])
async def read_models():
    return ModelController().get_models()

@router.post("/model/create", tags=["Modelo"], response_model=dict)
async def create_model(CodigoMarca: int, NumeroCorrelativoModelo: int, DescripcionModelo: str, CantidadPuestos: int, TipoRefrigerante: str, TipoGasolina: str, TipoAceite: str, Peso: float):
    return ModelController().create_model(CodigoMarca, NumeroCorrelativoModelo, DescripcionModelo, CantidadPuestos, TipoRefrigerante, TipoGasolina, TipoAceite, Peso)

@router.delete("/model/delete", tags=["Modelo"], response_model=dict)
async def delete_model(CodigoMarca: int, NumeroCorrelativoModelo: int):
    return ModelController().delete_model(CodigoMarca, NumeroCorrelativoModelo)

@router.put("/model/update", tags=["Modelo"], response_model=dict)
async def update_model(CodigoMarca: int, NumeroCorrelativoModelo: int, DescripcionModelo: str, CantidadPuestos: int, TipoRefrigerante: str, TipoGasolina: str, TipoAceite: str, Peso: float):
    return ModelController().update_model(CodigoMarca, NumeroCorrelativoModelo, DescripcionModelo, CantidadPuestos, TipoRefrigerante, TipoGasolina, TipoAceite, Peso)

@router.get("/vehicle", tags=["Vehiculo"], response_model=list[Vehicle])
async def read_vehicles():
    return VehicleController().get_vehicles()

@router.post("/vehicle/create", tags=["Vehiculo"], response_model=dict)
async def create_vehicle(CodigoMarca: int, NumeroCorrelativoModelo: int, Placa: str, FechaAdquisicion: str, TipoAceite: str, CI_Propietario: str):
    return VehicleController().create_vehicle(CodigoMarca, NumeroCorrelativoModelo, Placa, FechaAdquisicion, TipoAceite, CI_Propietario)

@router.delete("/vehicle/delete", tags=["Vehiculo"], response_model=dict)
async def delete_vehicle(CodigoVehiculo: int):
    return VehicleController().delete_vehicle(CodigoVehiculo)

@router.put("/vehicle/update", tags=["Vehiculo"], response_model=dict)
async def update_vehicle(CodigoVehiculo: int, CodigoMarca: int, NumeroCorrelativoModelo: int, Placa: str, FechaAdquisicion: str, TipoAceite: str, CI_Propietario: str):
    return VehicleController().update_vehicle(CodigoVehiculo, CodigoMarca, NumeroCorrelativoModelo, Placa, FechaAdquisicion, TipoAceite, CI_Propietario)

@router.get("/customer", tags=["Cliente"], response_model=list[Customer])
async def read_customers():
    return CustomerController().get_customers()

@router.post("/customer/create", tags=["Cliente"], response_model=dict)
async def create_customer(CI: str, NombreCompleto: str, Email: str):
    return CustomerController().create_customer(CI, NombreCompleto, Email)

@router.delete("/customer/delete", tags=["Cliente"], response_model=dict)
async def delete_customer(CI: str):
    return CustomerController().delete_customer(CI)

@router.put("/customer/update", tags=["Cliente"], response_model=dict)
async def update_customer(CI: str, NombreCompleto: str, Email: str):
    return CustomerController().update_customer(CI, NombreCompleto, Email)
