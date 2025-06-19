from fastapi import UploadFile, File
from pydantic import BaseModel, Field
from typing import Optional

class Franchise(BaseModel):
    RIF: str = Field(..., description="The unique identifier for the franchise")
    Nombre: str = Field(..., description="The name of the franchise")
    Ciudad: str = Field(..., description="The city where the franchise is located")
    CI_Encargado: str = Field(..., description="The CI of the person in charge of the franchise")
    FechaInicioEncargado: str = Field(..., description="The start date of the person in charge")
    Estatus: str = Field(..., description="The status of the franchise")

class Employee(BaseModel):
    CI: str = Field(..., description="The unique identifier of the employee")
    NombreCompleto: str = Field(..., description="The full name of the employee")
    Direccion: str = Field(..., description="The address of the customer")
    Telefono: str = Field(..., description="The phone number of the customer")
    Salario: float = Field(..., description="The salary of the customer, if applicable")
    FranquiciaRIF: Optional[str] = Field(..., description="The franchise associated with the customer")

class Brand(BaseModel):
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

class Service(BaseModel):
    CodigoServicio: int = Field(..., description="The unique identifier for the service")
    NombreServicio: str = Field(..., description="The name of the service")

class SupplierLine(BaseModel):
    CodigoLinea: int = Field(..., description="The unique identifier for the supplier line")
    DescripcionLinea: str = Field(..., description="The description of the supplier line")

class Product(BaseModel):
    CodigoProducto: int = Field(..., description="The unique identifier for the product")
    NombreProducto: str = Field(..., description="The name of the product")
    DescripcionProducto: str = Field(..., description="The description of the product")
    LineaSuministronistro: int = Field(..., description="The supplier line code of the product")
    Tipo: str = Field(..., description="The type of the product")
    NivelContaminante: Optional[int] = Field(..., description="The pollution level of the product")
    Tratamiento: Optional[str] = Field(..., description="The treatment of the product")

class Vendor(BaseModel):
    RIF: str = Field(..., description="The unique identifier of the vendor")
    RazonSocial: str = Field(..., description="The social reason of the vendor")
    Direccion: str = Field(..., description="The address of the vendor")
    TelefonoLocal: str = Field(..., description="The local phone number of the vendor")
    TelefonoCelular: str = Field(..., description="The mobile phone number of the vendor")
    PersonaContacto: str = Field(..., description="The contact person of the vendor")

class ServiceOrder(BaseModel):
    ID: int = Field(..., description="The unique identifier for the service order")
    FechaEntrada: str = Field(..., description="The entry date of the service order")
    HoraEntrada: str = Field(..., description="The entry time of the service order")
    FechaSalidaEstimada: str = Field(..., description="The exit date of the service order")
    HoraSalidaEstimada: str = Field(..., description="The exit time of the service order")
    FechaSalidaReal: Optional[str] = Field(..., description="The actual exit date of the service order")
    HoraSalidaReal: Optional[str] = Field(..., description="The actual exit time of the service order")
    Comentario: Optional[str] = Field(..., description="Comments on the service order")
    CodigoVehiculo: int = Field(..., description="The vehicle code associated with the service order")

class Invoice(BaseModel):
    NumeroFactura: int = Field(..., description="The unique identifier for the invoice")
    FechaEmision: str = Field(..., description="The issue date of the invoice")
    MontoTotal: float = Field(..., description="The total amount of the invoice")
    IVA: float = Field(..., description="The VAT amount of the invoice")
    Descuento: float = Field(..., description="The discount amount of the invoice")
    OrdenServicioID: int = Field(..., description="The service order ID associated with the invoice")
    FranquiciaRIF: str = Field(..., description="The franchise RIF associated with the invoice")

class Purchase(BaseModel):
    Numero: int = Field(..., description="The unique identifier for the purchase")
    Fecha: str = Field(..., description="The purchase date")
    ProveedorRIF: str = Field(..., description="The RIF of the supplier associated with the purchase")

class ProductFranchise(BaseModel):
    FranquiciaRIF: str = Field(..., description="The RIF of the franchise associated with the purchase")
    CodigoProducto: int = Field(..., description="The product code associated with the purchase")
    Precio: float = Field(..., description="The price of the product in the purchase")
    Cantidad: int = Field(..., description="The quantity of the product in the purchase")
    CantidadMinima: int = Field(..., description="The minimum quantity of the product in the purchase")
    CantidadMaxima: int = Field(..., description="The maximum quantity of the product in the purchase")

class Activity(BaseModel):
    CodigoServicio: int = Field(..., description="The service code associated with the order")
    NumeroCorrelativoActividad: int = Field(..., description="The serial number of the activity")
    DescripcionActividad: str = Field(..., description="The description of the activity")
    CostoManoDeObra: float = Field(..., description="The cost of the activity in the order")


class OrderxActivity(BaseModel):
    IDorden: int = Field(..., description="The unique identifier for the order")
    CodigoServicio: int = Field(..., description="The service code associated with the order")
    NumeroCorrelativoActividad: int = Field(..., description="The serial number of the activity")
    Costo_Act: float = Field(..., description="The cost of the activity in the order")