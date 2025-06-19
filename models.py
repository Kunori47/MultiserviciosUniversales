from fastapi import UploadFile, File
from pydantic import BaseModel, Field
from typing import Optional

class Franchise(BaseModel):
    RIF: str = Field(..., description="The unique identifier for the franchise")
    Nombre: str = Field(..., description="The name of the franchise")
    Ciudad: str = Field(..., description="The city where the franchise is located")
    CI_Encargado: Optional[str] = Field(..., description="The CI of the person in charge of the franchise")
    FechaInicioEncargado: Optional[str] = Field(..., description="The start date of the person in charge")
    Estatus: str = Field(..., description="The status of the franchise")

class Employee(BaseModel):
    CI: str = Field(..., description="The unique identifier of the employee")
    NombreCompleto: str = Field(..., description="The full name of the employee")
    Direccion: str = Field(..., description="The address of the customer")
    Telefono: str = Field(..., description="The phone number of the customer")
    Salario: float = Field(..., description="The salary of the customer, if applicable")
    FranquiciaRIF: str = Field(..., description="The franchise associated with the customer")

class Marca(BaseModel):
    CodigoMarca: int = Field(..., description="The unique identifier for the brand")
    Nombre: str = Field(..., description="The name of the brand")

class Model(BaseModel):
    CodigoModelo: int = Field(..., description="The unique identifier for the model")
    NumeroCorrelativoModelo: int = Field(..., description="The serial number of the model")
    DescripcionModelo: str = Field(..., description="The description of the model")
    CantidadPuestos: int = Field(..., description="The number of seats in the model")
    TipoRefrigerante: str = Field(..., description="The type of refrigerant used in the model")
    TipoGasolina: str = Field(..., description="The type of gasoline used in the model")
    TipoAceite: str = Field(..., description="The type of oil used in the model")
    Peso: float = Field(..., description="The weight of the model")

class Vehicle(BaseModel):
    CodigoVehiculo: int = Field(..., description="The license plate of the vehicle")
    Placa: str = Field(..., description="The plate number of the vehicle")
    FechaAdquisicion: str = Field(..., description="The acquisition date of the vehicle")
    TipoAceite: str = Field(..., description="The type of oil used in the vehicle")
    CI_Propietario: str = Field(..., description="The CI of the vehicle owner")
    CodigoMarca: int = Field(..., description="The brand code of the vehicle")
    NumeroCorrelativoModelo: int = Field(..., description="The model serial number of the vehicle")

class Customer(BaseModel):
    CI: str = Field(..., description="The unique identifier of the customer")
    NombreCompleto: str = Field(..., description="The name of the customer")
    Email: str = Field(..., description="The email address of the customer")
    
class MaintenancePlan(BaseModel):
    CodigoMantenimiento: int = Field(..., description="The unique identifier of the maintenance plan")
    TiempoUso: int = Field(..., description="The vehicle usage time")
    Kilometraje: int = Field(..., description="The vehicle mileage" )
    DescripcionMantenimiento: str = Field(..., description="Maintenance description")
    CodigoMarca: int = Field(..., description="The brand code of the vehicle")
    NumeroCorrelativoModelo: int = Field(..., description="The model serial number of the vehicle")
    
class Specialty(BaseModel):
    CodigoEspecialidad: int = Field(..., description="The unique identifier of the specialty")
    DescripcionEspecialidad: str = Field(..., description="The description of the specialty") 