from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse
from controller.controller import *
from database import database
from models import *

router = APIRouter()

@router.get("/")
async def read_root():
    return RedirectResponse(url="/docs")

" Franquicia Endpoints "

@router.get("/franchise", tags=["Franquicia"], response_model=list[Franchise])
async def read_franchise():
    return FranchiseController().get_franchise()

@router.post("/franchise/create", tags=["Franquicia"], response_model=dict)
async def create_franchise(RIF: str, Nombre: str, Ciudad: str, CI_Encargado: Optional[str] = None, FechaInicioEncargado: Optional[str] = None, Estatus: str = "Activo"):
    return FranchiseController().create_franchise(RIF, Nombre, Ciudad, CI_Encargado, FechaInicioEncargado, Estatus)

@router.put("/franchise/update", tags=["Franquicia"], response_model=dict)
async def update_franchise(RIF: str, Nombre: str, Ciudad: str, CI_Encargado: Optional[str] = None, FechaInicioEncargado: Optional[str] = None, Estatus: str = "Activo"):
    return FranchiseController().update_franchise(RIF, Nombre, Ciudad, CI_Encargado, FechaInicioEncargado, Estatus)


" Empleados Endpoints "

@router.get("/employee", tags=["Empleado"], response_model=list[Employee])
async def read_employee():
    return EmployeeController().get_employees()

@router.post("/employee/create", tags=["Empleado"], response_model=dict)
async def create_employee(CI: str, NombreCompleto: str, Direccion: str, Telefono: str, Salario: float, FranquiciaRIF: Optional[str] = None):
    return EmployeeController().create_employee(CI, NombreCompleto, Direccion, Telefono, Salario, FranquiciaRIF)

@router.delete("/employee/delete", tags=["Empleado"], response_model=dict)
async def delete_employee(CI: str):
    return EmployeeController().delete_employee(CI)

@router.put("/employee/update", tags=["Empleado"], response_model=dict)
async def update_employee(CI: str, NombreCompleto: str, Direccion: str, Telefono: str, Salario: float, FranquiciaRIF: str):
    return EmployeeController().update_employee(CI, NombreCompleto, Direccion, Telefono, Salario, FranquiciaRIF)


" Marcas Endpoints "

@router.get("/brand", tags=["Marca"], response_model=list[Brand])
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

" Modelos Endpoints "

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


" Vehiculo Endpoints "

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


" Cliente Endpoints "

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

# --- MaintenancePlan endpoints ---
@router.get("/maintenanceplan", tags=["Plan de Mantenimiento"], response_model=list[MaintenancePlan])
async def read_maintenanceplan():
    return MaintenancePlanController().get_MaintenancePlan()

@router.post("/maintenanceplan/create", tags=["Plan de Mantenimiento"], response_model=dict)
async def create_maintenanceplan(TiempoUso: int, Kilometraje: int, DescripcionMantenimiento: str, CodigoMarca: int, NumeroCorrelativoModelo: int):
    return MaintenancePlanController().create_MaintenancePlan(TiempoUso, Kilometraje, DescripcionMantenimiento, CodigoMarca, NumeroCorrelativoModelo)

@router.delete("/maintenanceplan/delete", tags=["Plan de Mantenimiento"], response_model=dict)
async def delete_maintenanceplan(CodigoMantenimiento: int):
    return MaintenancePlanController().delete_MaintenancePlan(CodigoMantenimiento)

@router.put("/maintenanceplan/update", tags=["Plan de Mantenimiento"], response_model=dict)
async def update_maintenanceplan(CodigoMantenimiento: int, TiempoUso: int, Kilometraje: int, DescripcionMantenimiento: str, CodigoMarca: int, NumeroCorrelativoModelo: int):
    return MaintenancePlanController().update_MaintenancePlan(CodigoMantenimiento, TiempoUso, Kilometraje, DescripcionMantenimiento, CodigoMarca, NumeroCorrelativoModelo)

# --- Specialty endpoints ---
@router.get("/specialty", tags=["Especialidad"], response_model=list[Specialty])
async def read_specialties():
    return SpecialtyController().get_specialties()

@router.post("/specialty/create", tags=["Especialidad"], response_model=dict)
async def create_specialty(DescripcionEspecialidad: str):
    return SpecialtyController().create_specialty(DescripcionEspecialidad)

@router.delete("/specialty/delete", tags=["Especialidad"], response_model=dict)
async def delete_specialty(CodigoEspecialidad: int):
    return SpecialtyController().delete_specialty(CodigoEspecialidad)

@router.put("/specialty/update", tags=["Especialidad"], response_model=dict)
async def update_specialty(CodigoEspecialidad: int, DescripcionEspecialidad: str):
    return SpecialtyController().update_specialty(CodigoEspecialidad, DescripcionEspecialidad)




" Servicio Endpoints "

@router.get("/service", tags=["Servicio"], response_model=list[Service])
async def read_services():
    return ServiceController().get_services()

@router.post("/service/create", tags=["Servicio"], response_model=dict)
async def create_service(NombreServicio: str):
    return ServiceController().create_service(NombreServicio)

@router.delete("/service/delete", tags=["Servicio"], response_model=dict)
async def delete_service(CodigoServicio: int):
    return ServiceController().delete_service(CodigoServicio)

@router.put("/service/update", tags=["Servicio"], response_model=dict)
async def update_service(CodigoServicio: int, NombreServicio: str):
    return ServiceController().update_service(CodigoServicio, NombreServicio)


" Linea de Suministros Endpoints "

@router.get("/supplier_line", tags=["Linea de Suministro"], response_model=list[SupplierLine])
async def read_supplier_lines():
    return SupplierLineController().get_supplier_lines()

@router.post("/supplier_line/create", tags=["Linea de Suministro"], response_model=dict)
async def create_supplier_line(DescripcionLinea: str):
    return SupplierLineController().create_supplier_line(DescripcionLinea)

@router.delete("/supplier_line/delete", tags=["Linea de Suministro"], response_model=dict)
async def delete_supplier_line(CodigoLinea: int):
    return SupplierLineController().delete_supplier_line(CodigoLinea)

@router.put("/supplier_line/update", tags=["Linea de Suministro"], response_model=dict)
async def update_supplier_line(CodigoLinea: int, DescripcionLinea: str):
    return SupplierLineController().update_supplier_line(CodigoLinea, DescripcionLinea)


" Producto Endpoints "

@router.get("/product", tags=["Producto"], response_model=list[Product])
async def read_products():
    return ProductController().get_products()

@router.post("/product/create", tags=["Producto"], response_model=dict)
async def create_product(NombreProducto: str, DescripcionProducto: str, LineaSuministro: int, Tipo: str, NivelContaminante: Optional[int] = None, Tratamiento: Optional[str] = None):
    return ProductController().create_product(NombreProducto, DescripcionProducto, LineaSuministro, Tipo, NivelContaminante, Tratamiento)

@router.delete("/product/delete", tags=["Producto"], response_model=dict)
async def delete_product(CodigoProducto: int):
    return ProductController().delete_product(CodigoProducto)

@router.put("/product/update", tags=["Producto"], response_model=dict)
async def update_product(CodigoProducto: int, NombreProducto: str, DescripcionProducto: str, LineaSuministro: int, Tipo: str, NivelContaminante: Optional[int] = None, Tratamiento: Optional[str] = None):
    return ProductController().update_product(CodigoProducto, NombreProducto, DescripcionProducto, LineaSuministro, Tipo, NivelContaminante, Tratamiento)

" Proveedor Endpoints "

@router.get("/vendor", tags=["Proveedor"], response_model=list[Vendor])
async def read_vendors():
    return VendorController().get_vendors()

@router.post("/vendor/create", tags=["Proveedor"], response_model=dict)
async def create_vendor(RIF: str, RazonSocial: str, Direccion: str, TelefonoLocal: str, TelefonoCelular: str, Correo: str):
    return VendorController().create_vendor(RIF, RazonSocial, Direccion, TelefonoLocal, TelefonoCelular, Correo)

@router.delete("/vendor/delete", tags=["Proveedor"], response_model=dict)
async def delete_vendor(RIF: str):
    return VendorController().delete_vendor(RIF)

@router.put("/vendor/update", tags=["Proveedor"], response_model=dict)
async def update_vendor(RIF: str, RazonSocial: str, Direccion: str, TelefonoLocal: str, TelefonoCelular: str, PersonaContacto: str):
    return VendorController().update_vendor(RIF, RazonSocial, Direccion, TelefonoLocal, TelefonoCelular, PersonaContacto)

" Orden de Servicio Endpoints "

@router.get("/service_order", tags=["Orden de Servicio"], response_model=list[ServiceOrder])
async def read_service_orders():
    return ServiceOrderController().get_service_orders()

@router.post("/service_order/create", tags=["Orden de Servicio"], response_model=dict)
async def create_service_order(FechaEntrada: str, HoraEntrada: str, FechaSalidaEstimada: str, HoraSalidaEstimada: str, CodigoVehiculo: int):
    return ServiceOrderController().create_service_order(FechaEntrada, HoraEntrada, FechaSalidaEstimada, HoraSalidaEstimada, CodigoVehiculo)

@router.put("/service_order/update", tags=["Orden de Servicio"], response_model=dict)
async def update_service_order(ID: int, FechaSalidaReal: Optional[str] = None, HoraSalidaReal: Optional[str] = None, Comentario: Optional[str] = None):
    return ServiceOrderController().update_service_order(ID, FechaSalidaReal, HoraSalidaReal, Comentario)

" Factura Endpoints "

@router.get("/invoice", tags=["Factura"], response_model=list[Invoice])
async def read_invoices():
    return InvoiceController().get_invoices()

@router.post("/invoice/create", tags=["Factura"], response_model=dict)
async def create_invoice(FechaEmision: str, MontoTotal: float, IVA: float, Descuento: float, OrdenServicioID: int, FranquiciaRIF: str):
    return InvoiceController().create_invoice(FechaEmision, MontoTotal, IVA, Descuento, OrdenServicioID, FranquiciaRIF)


" Compra Endpoints "

@router.get("/purchase", tags=["Compra"], response_model=list[Purchase])
async def read_purchases():
    return PurchaseController().get_purchases()

@router.post("/purchase/create", tags=["Compra"], response_model=dict)
async def create_purchase(Fecha: str, ProveedorRIF: str):
    return PurchaseController().create_purchase(Fecha, ProveedorRIF)


" Producto Franquicia Endpoints "

@router.get("/product_franchise", tags=["Producto Franquicia"], response_model=list[ProductFranchise])
async def read_product_franchises():
    return ProductFranchiseController().get_product_franchises()

@router.post("/product_franchise/create", tags=["Producto Franquicia"], response_model=dict)
async def create_product_franchise(FranquiciaRIF: str, CodigoProducto: int, Precio: float ,Cantidad: int, CantidadMinima: int, CantidadMaxima: int):
    return ProductFranchiseController().create_product_franchise(FranquiciaRIF, CodigoProducto, Precio, Cantidad, CantidadMinima, CantidadMaxima)

@router.delete("/product_franchise/delete", tags=["Producto Franquicia"], response_model=dict)
async def delete_product_franchise(FranquiciaRIF: str, CodigoProducto: int):
    return ProductFranchiseController().delete_product_franchise(FranquiciaRIF, CodigoProducto)

@router.put("/product_franchise/update", tags=["Producto Franquicia"], response_model=dict)
async def update_product_franchise(FranquiciaRIF: str, CodigoProducto: int, Precio: float, Cantidad: int, CantidadMinima: int, CantidadMaxima: int):
    return ProductFranchiseController().update_product_franchise(FranquiciaRIF, CodigoProducto, Precio, Cantidad, CantidadMinima, CantidadMaxima)

" Actividad Endpoints "

@router.get("/activity", tags=["Actividad"], response_model=list[Activity])
async def read_activities():
    return ActivityController().get_activities()

@router.post("/activity/create", tags=["Actividad"], response_model=dict)
async def create_activity(CodigoServicio: int, NumeroCorrelativoActividad: int, DescripcionActividad: str, CostoManoDeObra: float):
    return ActivityController().create_activity(CodigoServicio, NumeroCorrelativoActividad, DescripcionActividad, CostoManoDeObra)

@router.delete("/activity/delete", tags=["Actividad"], response_model=dict)
async def delete_activity(CodigoServicio: int, NumeroCorrelativoActividad: int):
    return ActivityController().delete_activity(CodigoServicio, NumeroCorrelativoActividad)


" OrderxActivity Endpoints "

@router.get("/orderxactivity", tags=["OrdenxActividad"], response_model=list[OrderxActivity])
async def read_orderxactivities():
    return OrderxActivityController().get_order_activities()

@router.post("/orderxactivity/create", tags=["OrdenxActividad"], response_model=dict)
async def create_orderxactivity(IDorden: int, CodigoServicio: int, NumeroCorrelativoActividad: int, Costo_Act: float):
    return OrderxActivityController().create_order_activity(IDorden, CodigoServicio, NumeroCorrelativoActividad, Costo_Act)


" Correction Endpoints "

@router.get("/correction", tags=["Correccion de Inventario"], response_model=list[Correction])
async def read_corrections():
    return CorrectionController().get_corrections()

@router.post("/correction/create", tags=["Correccion de Inventario"], response_model=dict)
async def create_correction(FranquiciaRIF: str, CodigoProducto: int, FechaCorreccion: str, Cantidad: int, TipoAjuste: str, Comentario: Optional[str] = None):
    return CorrectionController().create_correction(FranquiciaRIF, CodigoProducto, FechaCorreccion, Cantidad, TipoAjuste, Comentario)

" Suministro Endpoints "

@router.get("/supply", tags=["Suministro"], response_model=list[Supply])
async def read_supplies():
    return SupplyController().get_supplies()

@router.post("/supply/create", tags=["Suministro"], response_model=dict)
async def create_supply(ProveedorRIF: str, CodigoProducto: int):
    return SupplyController().create_supply(ProveedorRIF, CodigoProducto)

@router.delete("/supply/delete", tags=["Suministro"], response_model=dict)
async def delete_supply(ProveedorRIF: str, CodigoProducto: int):
    return SupplyController().delete_supply(ProveedorRIF, CodigoProducto)

@router.put("/supply/update", tags=["Suministro"], response_model=dict)
async def update_supply(NuevoProveedorRIF: str, ProveedorRIF: str, CodigoProducto: int):
    return SupplyController().update_supply(NuevoProveedorRIF, ProveedorRIF, CodigoProducto)

" AumentoInventario Endpoints "

@router.get("/inventory_increase", tags=["Aumento de Inventario"], response_model=list[InventoryIncrease])
async def read_inventory_increases():
    return InventoryIncreaseController().get_inventory_increases()

@router.post("/inventory_increase/create", tags=["Aumento de Inventario"], response_model=dict)
async def create_inventory_increase(NumeroCompra: int, FranquiciaRIF: str, CodigoProducto: int, CantidadPedida: int, CantidadDisponible: int, Monto: float):
    return InventoryIncreaseController().create_inventory_increase(NumeroCompra, FranquiciaRIF, CodigoProducto, CantidadPedida, CantidadDisponible, Monto)

" Servicios Franquicia Endpoints "

@router.get("/franchise_service", tags=["Servicios Franquicia"], response_model=list[FranchiseServices])
async def read_franchise_services():
    return FranchiseServiceController().get_franchise_services()

@router.post("/franchise_service/create", tags=["Servicios Franquicia"], response_model=dict)
async def create_franchise_service(FranquiciaRIF: str, CodigoServicio: int):
    return FranchiseServiceController().create_franchise_services(FranquiciaRIF, CodigoServicio)

@router.delete("/franchise_service/delete", tags=["Servicios Franquicia"], response_model=dict)
async def delete_franchise_service(FranquiciaRIF: str, CodigoServicio: int):
    return FranchiseServiceController().delete_franchise_services(FranquiciaRIF, CodigoServicio)


" Producto Orden de Servicio Endpoints "

@router.get("/product_service_order", tags=["Productos Orden Servicio"], response_model=list[ProductServiceOrder])
async def read_product_service_orders():
    return ProductServiceOrderController().get_product_service_orders()

@router.post("/product_service_order/create", tags=["Productos Orden Servicio"], response_model=dict)
async def create_product_service_order(CodigoOrdenServicio: int, CodigoServicio: int, NumeroCorrelativoActividad: int, FranquiciaRIF: str, CodigoProducto: int, CantidadUtilizada: int, PrecioProducto: float):
    return ProductServiceOrderController().create_product_service_order(CodigoOrdenServicio, CodigoServicio, NumeroCorrelativoActividad, FranquiciaRIF, CodigoProducto, CantidadUtilizada, PrecioProducto)