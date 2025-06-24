from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse
from controller.controller import *
from db.database import database
from models import *

router = APIRouter()

@router.get("/")
async def read_root():
    return RedirectResponse(url="/docs")

" Franquicia Endpoints "

@router.get("/franchise", tags=["Franquicia"], response_model=list[Franchise])
async def read_franchise():
    return GetController().get_all(table_name="Franquicia")

@router.get("/franchise/{RIF}", tags=["Franquicia"], response_model=Franchise)
async def read_franchise_by_rif(RIF: str):
    franchise = GetController().get_by_id(table_name="Franquicia", RIF=RIF)
    if not franchise:
        raise HTTPException(status_code=404, detail="Franquicia not found")
    return franchise

@router.post("/franchise/create", tags=["Franquicia"], response_model=dict)
async def create_franchise(RIF: str, Nombre: str, Ciudad: str, CI_Encargado: str, FechaInicioEncargado: str, Estatus: str):
    return PostController().post_data(table_name="Franquicia", data={
        "RIF": RIF,
        "Nombre": Nombre,
        "Ciudad": Ciudad,
        "CI_Encargado": CI_Encargado,
        "FechaInicioEncargado": FechaInicioEncargado,
        "Estatus": Estatus
    })

@router.put("/franchise/update", tags=["Franquicia"], response_model=dict)
async def update_franchise(RIF: str, Nombre: str, Ciudad: str, CI_Encargado: str, FechaInicioEncargado: str, Estatus: str):
    return UpdateController().put_data(table_name="Franquicia", RIF=RIF, data={
        "Nombre": Nombre,
        "Ciudad": Ciudad,
        "CI_Encargado": CI_Encargado,
        "FechaInicioEncargado": FechaInicioEncargado,
        "Estatus": Estatus
    })

" Empleados Endpoints "

@router.get("/employee", tags=["Empleado"], response_model=list[Employee])
async def read_employee():
    return GetController().get_all(table_name="Empleado")

@router.get("/employee/{CI}", tags=["Empleado"], response_model=Employee)
async def read_employee_by_ci(CI: str):
    employee = GetController().get_by_id(table_name="Empleado", CI=CI)
    if not employee:
        raise HTTPException(status_code=404, detail="Empleado not found")
    return employee

@router.post("/employee/create", tags=["Empleado"], response_model=dict)
async def create_employee(CI: str, NombreCompleto: str, Direccion: str, Telefono: str, Salario: float, FranquiciaRIF: str):
    return PostController().post_data(table_name="Empleado", data={
        "CI": CI,
        "NombreCompleto": NombreCompleto,
        "Direccion": Direccion,
        "Telefono": Telefono,
        "Salario": Salario,
        "FranquiciaRIF": FranquiciaRIF
    })

@router.delete("/employee/delete", tags=["Empleado"], response_model=dict)
async def delete_employee(CI: str):
    return DeleteController().delete_data(table_name="Empleado", CI=CI) 

@router.put("/employee/update", tags=["Empleado"], response_model=dict)
async def update_employee(CI: str, Direccion: str, Telefono: str, Salario: float, FranquiciaRIF: str):
    return UpdateController().put_data(table_name="Empleado", CI=CI, data={
        "Direccion": Direccion,
        "Telefono": Telefono,
        "Salario": Salario,
        "FranquiciaRIF": FranquiciaRIF
    })

" Marcas Endpoints "

@router.get("/brand", tags=["Marca"], response_model=list[Brand])
async def read_brands():
    return GetController().get_all(table_name="Marca")

@router.get("/brand/{CodigoMarca}", tags=["Marca"], response_model=Brand)
async def read_brand_by_code(CodigoMarca: int):
    brand = GetController().get_by_id(table_name="Marca", CodigoMarca=CodigoMarca)
    if not brand:
        raise HTTPException(status_code=404, detail="Marca not found")
    return brand

@router.post("/brand/create", tags=["Marca"], response_model=dict)
async def create_brand(Nombre: str):
    return PostController().post_data(table_name="Marca", data={"Nombre": Nombre})

@router.delete("/brand/delete", tags=["Marca"], response_model=dict)
async def delete_brand(CodigoMarca: int):
    return DeleteController().delete_data(table_name="Marca", CodigoMarca=CodigoMarca)

@router.put("/brand/update", tags=["Marca"], response_model=dict)
async def update_brand(CodigoMarca: int, Nombre: str):
    return UpdateController().put_data(table_name="Marca", CodigoMarca=CodigoMarca, data={"Nombre": Nombre})

" Modelos Endpoints "

@router.get("/model", tags=["Modelo"], response_model=list[Model])
async def read_models():
    return GetController().get_all(table_name="Modelo")

@router.get("/model/{CodigoMarca}/{NumeroCorrelativoModelo}", tags=["Modelo"], response_model=Model)
async def read_model_by_code(CodigoMarca: int, NumeroCorrelativoModelo: int):
    model = GetController().get_by_id(table_name="Modelo", CodigoMarca=CodigoMarca, NumeroCorrelativoModelo=NumeroCorrelativoModelo)
    if not model:
        raise HTTPException(status_code=404, detail="Modelo not found")
    return model

@router.post("/model/create", tags=["Modelo"], response_model=dict)
async def create_model(CodigoMarca: int, NumeroCorrelativoModelo: int, DescripcionModelo: str, CantidadPuestos: int, TipoRefrigerante: str, TipoGasolina: str, TipoAceite: str, Peso: float):
    return PostController().post_data(table_name="Modelo", data={
        "CodigoMarca": CodigoMarca,
        "NumeroCorrelativoModelo": NumeroCorrelativoModelo,
        "DescripcionModelo": DescripcionModelo,
        "CantidadPuestos": CantidadPuestos,
        "TipoRefrigerante": TipoRefrigerante,
        "TipoGasolina": TipoGasolina,
        "TipoAceite": TipoAceite,
        "Peso": Peso
    })

@router.delete("/model/delete", tags=["Modelo"], response_model=dict)
async def delete_model(CodigoMarca: int, NumeroCorrelativoModelo: int):
    return DeleteController().delete_data(table_name="Modelo", CodigoMarca=CodigoMarca, NumeroCorrelativoModelo=NumeroCorrelativoModelo)

@router.put("/model/update", tags=["Modelo"], response_model=dict)
async def update_model(CodigoMarca: int, NumeroCorrelativoModelo: int, DescripcionModelo: str, CantidadPuestos: int, TipoRefrigerante: str, TipoGasolina: str, TipoAceite: str, Peso: float):
    return UpdateController().put_data(table_name="Modelo", CodigoMarca=CodigoMarca, NumeroCorrelativoModelo=NumeroCorrelativoModelo, data={
        "DescripcionModelo": DescripcionModelo,
        "CantidadPuestos": CantidadPuestos,
        "TipoRefrigerante": TipoRefrigerante,
        "TipoGasolina": TipoGasolina,
        "TipoAceite": TipoAceite,
        "Peso": Peso
    })

" Vehiculo Endpoints "

@router.get("/vehicle", tags=["Vehiculo"], response_model=list[Vehicle])
async def read_vehicles():
    return GetController().get_all(table_name="Vehiculo")

@router.get("/vehicle/{CodigoVehiculo}", tags=["Vehiculo"], response_model=Vehicle)
async def read_vehicle_by_code(CodigoVehiculo: int):
    vehicle = GetController().get_by_id(table_name="Vehiculo", CodigoVehiculo=CodigoVehiculo)
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehiculo not found")
    return vehicle

@router.post("/vehicle/create", tags=["Vehiculo"], response_model=dict)
async def create_vehicle(CodigoMarca: int, NumeroCorrelativoModelo: int, Placa: str, FechaAdquisicion: str, TipoAceite: str, CI_Propietario: str):
    return PostController().post_data(table_name="Vehiculo", data={
        "CodigoMarca": CodigoMarca,
        "NumeroCorrelativoModelo": NumeroCorrelativoModelo,
        "Placa": Placa,
        "FechaAdquisicion": FechaAdquisicion,
        "TipoAceite": TipoAceite,
        "CI_Propietario": CI_Propietario
    })

@router.delete("/vehicle/delete", tags=["Vehiculo"], response_model=dict)
async def delete_vehicle(CodigoVehiculo: int):
    return DeleteController().delete_data(table_name="Vehiculo", CodigoVehiculo=CodigoVehiculo)

@router.put("/vehicle/update", tags=["Vehiculo"], response_model=dict)
async def update_vehicle(CodigoVehiculo: int, Placa: str, TipoAceite: str, CI_Propietario: str):
    return UpdateController().put_data(table_name="Vehiculo", CodigoVehiculo=CodigoVehiculo, data={
        "Placa": Placa,
        "TipoAceite": TipoAceite,
        "CI_Propietario": CI_Propietario
    })

" Cliente Endpoints "

@router.get("/customer", tags=["Cliente"], response_model=list[Customer])
async def read_customers():
    return GetController().get_all(table_name="Cliente")

@router.get("/customer/{CI}", tags=["Cliente"], response_model=Customer)
async def read_customer_by_ci(CI: str):
    customer = GetController().get_by_id(table_name="Cliente", CI=CI)
    if not customer:
        raise HTTPException(status_code=404, detail="Cliente not found")
    return customer

@router.post("/customer/create", tags=["Cliente"], response_model=dict)
async def create_customer(CI: str, NombreCompleto: str, Email: str):
    return PostController().post_data(table_name="Cliente", data={
        "CI": CI,
        "NombreCompleto": NombreCompleto,
        "Email": Email
    })

@router.delete("/customer/delete", tags=["Cliente"], response_model=dict)
async def delete_customer(CI: str):
    return DeleteController().delete_data(table_name="Cliente", CI=CI)

@router.put("/customer/update", tags=["Cliente"], response_model=dict)
async def update_customer(CI: str, NombreCompleto: str, Email: str):
    return UpdateController().put_data(table_name="Cliente", CI=CI, data={
        "NombreCompleto": NombreCompleto,
        "Email": Email
    })

# --- MaintenancePlan endpoints ---
@router.get("/maintenanceplan", tags=["Plan de Mantenimiento"], response_model=list[MaintenancePlan])
async def read_maintenanceplan():
    return GetController().get_all(table_name="PlanMantenimiento")

@router.get("/maintenanceplan/{CodigoMantenimiento}", tags=["Plan de Mantenimiento"], response_model=MaintenancePlan)
async def read_maintenanceplan_by_code(CodigoMantenimiento: int):
    maintenance_plan = GetController().get_by_id(table_name="PlanMantenimiento", CodigoMantenimiento=CodigoMantenimiento)
    if not maintenance_plan:
        raise HTTPException(status_code=404, detail="Plan de Mantenimiento not found")
    return maintenance_plan

@router.post("/maintenanceplan/create", tags=["Plan de Mantenimiento"], response_model=dict)
async def create_maintenanceplan(TiempoUso: int, Kilometraje: int, DescripcionMantenimiento: str, CodigoMarca: int, NumeroCorrelativoModelo: int):
    return PostController().post_data(table_name="PlanMantenimiento", data={
        "TiempoUso": TiempoUso,
        "Kilometraje": Kilometraje,
        "DescripcionMantenimiento": DescripcionMantenimiento,
        "CodigoMarca": CodigoMarca,
        "NumeroCorrelativoModelo": NumeroCorrelativoModelo
    })

@router.delete("/maintenanceplan/delete", tags=["Plan de Mantenimiento"], response_model=dict)
async def delete_maintenanceplan(CodigoMantenimiento: int):
    return DeleteController().delete_data(table_name="PlanMantenimiento", CodigoMantenimiento=CodigoMantenimiento)

@router.put("/maintenanceplan/update", tags=["Plan de Mantenimiento"], response_model=dict)
async def update_maintenanceplan(CodigoMantenimiento: int, TiempoUso: int, Kilometraje: int, DescripcionMantenimiento: str, CodigoMarca: int, NumeroCorrelativoModelo: int):
    return UpdateController().put_data(table_name="PlanMantenimiento", CodigoMantenimiento=CodigoMantenimiento, data={
        "TiempoUso": TiempoUso,
        "Kilometraje": Kilometraje,
        "DescripcionMantenimiento": DescripcionMantenimiento,
        "CodigoMarca": CodigoMarca,
        "NumeroCorrelativoModelo": NumeroCorrelativoModelo
    })


# --- Specialty endpoints ---
@router.get("/specialty", tags=["Especialidad"], response_model=list[Specialty])
async def read_specialties():
    return GetController().get_all(table_name="Especialidad")

@router.get("/specialty/{CodigoEspecialidad}", tags=["Especialidad"], response_model=Specialty)
async def read_specialty_by_code(CodigoEspecialidad: int):
    specialty = GetController().get_by_id(table_name="Especialidad", CodigoEspecialidad=CodigoEspecialidad)
    if not specialty:
        raise HTTPException(status_code=404, detail="Especialidad not found")
    return specialty

@router.post("/specialty/create", tags=["Especialidad"], response_model=dict)
async def create_specialty(DescripcionEspecialidad: str):
    return PostController().post_data(table_name="Especialidad", data={"DescripcionEspecialidad": DescripcionEspecialidad})

@router.delete("/specialty/delete", tags=["Especialidad"], response_model=dict)
async def delete_specialty(CodigoEspecialidad: int):
    return DeleteController().delete_data(table_name="Especialidad", CodigoEspecialidad=CodigoEspecialidad)

@router.put("/specialty/update", tags=["Especialidad"], response_model=dict)
async def update_specialty(CodigoEspecialidad: int, DescripcionEspecialidad: str):
    return UpdateController().put_data(table_name="Especialidad", CodigoEspecialidad=CodigoEspecialidad, data={"DescripcionEspecialidad": DescripcionEspecialidad})


" Servicio Endpoints "

@router.get("/service", tags=["Servicio"], response_model=list[Service])
async def read_services():
    return GetController().get_all(table_name="Servicio")

@router.get("/service/{CodigoServicio}", tags=["Servicio"], response_model=Service)
async def read_service_by_code(CodigoServicio: int):
    service = GetController().get_by_id(table_name="Servicio", CodigoServicio=CodigoServicio)
    if not service:
        raise HTTPException(status_code=404, detail="Servicio not found")
    return service

@router.post("/service/create", tags=["Servicio"], response_model=dict)
async def create_service(NombreServicio: str):
    return PostController().post_data(table_name="Servicio", data={"NombreServicio": NombreServicio})

@router.delete("/service/delete", tags=["Servicio"], response_model=dict)
async def delete_service(CodigoServicio: int):
    return DeleteController().delete_data(table_name="Servicio", CodigoServicio=CodigoServicio)

@router.put("/service/update", tags=["Servicio"], response_model=dict)
async def update_service(CodigoServicio: int, NombreServicio: str):
    return UpdateController().put_data(table_name="Servicio", CodigoServicio=CodigoServicio, data={"NombreServicio": NombreServicio})

" Linea de Suministros Endpoints "

@router.get("/supplier_line", tags=["Linea de Suministro"], response_model=list[SupplierLine])
async def read_supplier_lines():
    return GetController().get_all(table_name="LineaSuministro")

@router.get("/supplier_line/{CodigoLinea}", tags=["Linea de Suministro"], response_model=SupplierLine)
async def read_supplier_line_by_code(CodigoLinea: int):
    supplier_line = GetController().get_by_id(table_name="LineaSuministro", CodigoLinea=CodigoLinea)
    if not supplier_line:
        raise HTTPException(status_code=404, detail="Linea de Suministro not found")
    return supplier_line

@router.post("/supplier_line/create", tags=["Linea de Suministro"], response_model=dict)
async def create_supplier_line(DescripcionLinea: str):
    return PostController().post_data(table_name="LineaSuministro", data={"DescripcionLinea": DescripcionLinea})

@router.delete("/supplier_line/delete", tags=["Linea de Suministro"], response_model=dict)
async def delete_supplier_line(CodigoLinea: int):
    return DeleteController().delete_data(table_name="LineaSuministro", CodigoLinea=CodigoLinea)

@router.put("/supplier_line/update", tags=["Linea de Suministro"], response_model=dict)
async def update_supplier_line(CodigoLinea: int, DescripcionLinea: str):
    return UpdateController().put_data(table_name="LineaSuministro", CodigoLinea=CodigoLinea, data={"DescripcionLinea": DescripcionLinea})


" Producto Endpoints "

@router.get("/product", tags=["Producto"], response_model=list[Product])
async def read_products():
    return GetController().get_all(table_name="Producto")

@router.get("/product/{CodigoProducto}", tags=["Producto"], response_model=Product)
async def read_product_by_code(CodigoProducto: int):
    product = GetController().get_by_id(table_name="Producto", CodigoProducto=CodigoProducto)
    if not product:
        raise HTTPException(status_code=404, detail="Producto not found")
    return product

@router.post("/product/create", tags=["Producto"], response_model=dict)
async def create_product(NombreProducto: str, DescripcionProducto: str, LineaSuministro: int, Tipo: str, NivelContaminante: Optional[int] = None, Tratamiento: Optional[str] = None):
    return PostController().post_data(table_name="Producto", data={
        "NombreProducto": NombreProducto,
        "DescripcionProducto": DescripcionProducto,
        "LineaSuministro": LineaSuministro,
        "Tipo": Tipo,
        "NivelContaminante": NivelContaminante,
        "Tratamiento": Tratamiento
    })

@router.delete("/product/delete", tags=["Producto"], response_model=dict)
async def delete_product(CodigoProducto: int):
    return DeleteController().delete_data(table_name="Producto", CodigoProducto=CodigoProducto)

@router.put("/product/update", tags=["Producto"], response_model=dict)
async def update_product(CodigoProducto: int, NombreProducto: str, DescripcionProducto: str, LineaSuministro: int, Tipo: str, NivelContaminante: Optional[int] = None, Tratamiento: Optional[str] = None):
    return UpdateController().put_data(table_name="Producto", CodigoProducto=CodigoProducto, data={
        "NombreProducto": NombreProducto,
        "DescripcionProducto": DescripcionProducto,
        "LineaSuministro": LineaSuministro,
        "Tipo": Tipo,
        "NivelContaminante": NivelContaminante,
        "Tratamiento": Tratamiento
    })

" Proveedor Endpoints "

@router.get("/vendor", tags=["Proveedor"], response_model=list[Vendor])
async def read_vendors():
    return GetController().get_all(table_name="Proveedor")

@router.get("/vendor/{RIF}", tags=["Proveedor"], response_model=Vendor)
async def read_vendor_by_rif(RIF: str):
    vendor = GetController().get_by_id(table_name="Proveedor", RIF=RIF)
    if not vendor:
        raise HTTPException(status_code=404, detail="Proveedor not found")
    return vendor

@router.post("/vendor/create", tags=["Proveedor"], response_model=dict)
async def create_vendor(RIF: str, RazonSocial: str, Direccion: str, TelefonoLocal: str, TelefonoCelular: str, PersonaContacto: str):
    return PostController().post_data(table_name="Proveedor", data={
        "RIF": RIF,
        "RazonSocial": RazonSocial,
        "Direccion": Direccion,
        "TelefonoLocal": TelefonoLocal,
        "TelefonoCelular": TelefonoCelular,
        "PersonaContacto": PersonaContacto
    })

@router.delete("/vendor/delete", tags=["Proveedor"], response_model=dict)
async def delete_vendor(RIF: str):
    return DeleteController().delete_data(table_name="Proveedor", RIF=RIF)

@router.put("/vendor/update", tags=["Proveedor"], response_model=dict)
async def update_vendor(RIF: str, RazonSocial: str, Direccion: str, TelefonoLocal: str, TelefonoCelular: str, PersonaContacto: str):
    return UpdateController().put_data(table_name="Proveedor", RIF=RIF, data={
        "RazonSocial": RazonSocial,
        "Direccion": Direccion,
        "TelefonoLocal": TelefonoLocal,
        "TelefonoCelular": TelefonoCelular,
        "PersonaContacto": PersonaContacto
    })

" Orden de Servicio Endpoints "

@router.get("/service_order", tags=["Orden de Servicio"], response_model=list[ServiceOrder])
async def read_service_orders():
    return GetController().get_all(table_name="OrdenServicio")  

@router.get("/service_order/{ID}", tags=["Orden de Servicio"], response_model=ServiceOrder)
async def read_service_order_by_id(ID: int):
    service_order = GetController().get_by_id(table_name="OrdenServicio", ID=ID)
    if not service_order:
        raise HTTPException(status_code=404, detail="Orden de Servicio not found")
    return service_order

@router.post("/service_order/create", tags=["Orden de Servicio"], response_model=dict)
async def create_service_order(FechaEntrada: str, HoraEntrada: str, FechaSalidaEstimada: str, HoraSalidaEstimada: str, CodigoVehiculo: int):
    return PostController().post_data(table_name="OrdenServicio", data={
        "FechaEntrada": FechaEntrada,
        "HoraEntrada": HoraEntrada,
        "FechaSalidaEstimada": FechaSalidaEstimada,
        "HoraSalidaEstimada": HoraSalidaEstimada,
        "CodigoVehiculo": CodigoVehiculo
    })

@router.put("/service_order/update", tags=["Orden de Servicio"], response_model=dict)
async def update_service_order(ID: int, FechaSalidaReal: Optional[str] = None, HoraSalidaReal: Optional[str] = None, Comentario: Optional[str] = None):
    data = {}
    if FechaSalidaReal is not None:
        data["FechaSalidaReal"] = FechaSalidaReal
    if HoraSalidaReal is not None:
        data["HoraSalidaReal"] = HoraSalidaReal
    if Comentario is not None:
        data["Comentario"] = Comentario
    return UpdateController().put_data(table_name="OrdenServicio", ID=ID, data=data)


" Factura Endpoints "

@router.get("/invoice", tags=["Factura"], response_model=list[Invoice])
async def read_invoices():
    return GetController().get_all(table_name="Factura")

@router.get("/invoice/{NumeroFactura}", tags=["Factura"], response_model=Invoice)
async def read_invoice_by_number(NumeroFactura: int):
    invoice = GetController().get_by_id(table_name="Factura", NumeroFactura=NumeroFactura)
    if not invoice:
        raise HTTPException(status_code=404, detail="Factura not found")
    return invoice

@router.post("/invoice/create", tags=["Factura"], response_model=dict)
async def create_invoice(FechaEmision: str, MontoTotal: float, IVA: float, Descuento: float, OrdenServicioID: int, FranquiciaRIF: str):
    return PostController().post_data(table_name="Factura", data={
        "FechaEmision": FechaEmision,
        "MontoTotal": MontoTotal,
        "IVA": IVA,
        "Descuento": Descuento,
        "OrdenServicioID": OrdenServicioID,
        "FranquiciaRIF": FranquiciaRIF
    })


" Compra Endpoints "

@router.get("/purchase", tags=["Compra"], response_model=list[Purchase])
async def read_purchases():
    return GetController().get_all(table_name="Compra")

@router.get("/purchase/{NumeroCompra}", tags=["Compra"], response_model=Purchase)
async def read_purchase_by_number(NumeroCompra: int):
    purchase = GetController().get_by_id(table_name="Compra", NumeroCompra=NumeroCompra)
    if not purchase:
        raise HTTPException(status_code=404, detail="Compra not found")
    return purchase

@router.post("/purchase/create", tags=["Compra"], response_model=dict)
async def create_purchase(Fecha: str, ProveedorRIF: str):
    return PostController().post_data(table_name="Compra", data={
        "Fecha": Fecha,
        "ProveedorRIF": ProveedorRIF
    })


" Producto Franquicia Endpoints "

@router.get("/product_franchise", tags=["Producto Franquicia"], response_model=list[ProductFranchise])
async def read_product_franchises():
    return GetController().get_all(table_name="ProductoFranquicia")

@router.get("/product_franchise/{FranquiciaRIF}/{CodigoProducto}", tags=["Producto Franquicia"], response_model=ProductFranchise)
async def read_product_franchise_by_code(FranquiciaRIF: str, CodigoProducto: int):
    product_franchise = GetController().get_by_id(table_name="ProductoFranquicia", FranquiciaRIF=FranquiciaRIF, CodigoProducto=CodigoProducto)
    if not product_franchise:
        raise HTTPException(status_code=404, detail="Producto Franquicia not found")
    return product_franchise

@router.post("/product_franchise/create", tags=["Producto Franquicia"], response_model=dict)
async def create_product_franchise(FranquiciaRIF: str, CodigoProducto: int, Precio: float, Cantidad: int, CantidadMinima: int, CantidadMaxima: int):
    return PostController().post_data(table_name="ProductoFranquicia", data={
        "FranquiciaRIF": FranquiciaRIF,
        "CodigoProducto": CodigoProducto,
        "Precio": Precio,
        "Cantidad": Cantidad,
        "CantidadMinima": CantidadMinima,
        "CantidadMaxima": CantidadMaxima
    })

@router.delete("/product_franchise/delete", tags=["Producto Franquicia"], response_model=dict)
async def delete_product_franchise(FranquiciaRIF: str, CodigoProducto: int):
    return DeleteController().delete_data(table_name="ProductoFranquicia", FranquiciaRIF=FranquiciaRIF, CodigoProducto=CodigoProducto)

@router.put("/product_franchise/update", tags=["Producto Franquicia"], response_model=dict)
async def update_product_franchise(FranquiciaRIF: str, CodigoProducto: int, Precio: float, Cantidad: int, CantidadMinima: int, CantidadMaxima: int):
    return UpdateController().put_data(table_name="ProductoFranquicia", FranquiciaRIF=FranquiciaRIF, CodigoProducto=CodigoProducto, data={
        "Precio": Precio,
        "Cantidad": Cantidad,
        "CantidadMinima": CantidadMinima,
        "CantidadMaxima": CantidadMaxima
    })

" Actividad Endpoints "

@router.get("/activity", tags=["Actividad"], response_model=list[Activity])
async def read_activities():
    return GetController().get_all(table_name="Actividad")

@router.get("/activity/{CodigoServicio}/{NumeroCorrelativoActividad}", tags=["Actividad"], response_model=Activity)
async def read_activity_by_code(CodigoServicio: int, NumeroCorrelativoActividad: int):
    activity = GetController().get_by_id(table_name="Actividad", CodigoServicio=CodigoServicio, NumeroCorrelativoActividad=NumeroCorrelativoActividad)
    if not activity:
        raise HTTPException(status_code=404, detail="Actividad not found")
    return activity

@router.post ("/activity/create", tags=["Actividad"], response_model=dict)
async def create_activity(CodigoServicio: int, NumeroCorrelativoActividad: int, DescripcionActividad: str, CostoManoDeObra: float):
    return PostController().post_data(table_name="Actividad", data={
        "CodigoServicio": CodigoServicio,
        "NumeroCorrelativoActividad": NumeroCorrelativoActividad,
        "DescripcionActividad": DescripcionActividad,
        "CostoManoDeObra": CostoManoDeObra
        })

@router.delete("/activity/delete", tags=["Actividad"], response_model=dict)
async def delete_activity(CodigoServicio: int, NumeroCorrelativoActividad: int):
    return DeleteController().delete_data(table_name="Actividad", CodigoServicio=CodigoServicio, NumeroCorrelativoActividad=NumeroCorrelativoActividad)


" OrderxActivity Endpoints "

@router.get("/orderxactivity", tags=["OrdenxActividad"], response_model=list[OrderxActivity])
async def read_orderxactivities():
    return GetController().get_all(table_name="OrdenxActividad")

@router.get("/orderxactivity/{IDorden}/{CodigoServicio}/{NumeroCorrelativoActividad}", tags=["OrdenxActividad"], response_model=OrderxActivity)
async def read_orderxactivity_by_code(IDorden: int, CodigoServicio: int, NumeroCorrelativoActividad: int):
    orderxactivity = GetController().get_by_id(table_name="OrdenxActividad", IDorden=IDorden, CodigoServicio=CodigoServicio, NumeroCorrelativoActividad=NumeroCorrelativoActividad)
    if not orderxactivity:
        raise HTTPException(status_code=404, detail="OrdenxActividad not found")
    return orderxactivity

@router.post("/orderxactivity/create", tags=["OrdenxActividad"], response_model=dict)
async def create_orderxactivity(IDorden: int, CodigoServicio: int, NumeroCorrelativoActividad: int, Costo_Act: float):
    return PostController().post_data(table_name="OrdenxActividad", data={
        "IDorden": IDorden,
        "CodigoServicio": CodigoServicio,
        "NumeroCorrelativoActividad": NumeroCorrelativoActividad,
        "Costo_Act": Costo_Act
        })

"Pagos Endpoints"

@router.get("/pays", tags=["Pagos"], response_model=list[Pay])
async def read_pays():
    return GetController().get_all(table_name="Pago")

@router.get("/pays/{numero_factura}/{numero_correlativo_pago}", tags=["Pagos"], response_model=Pay)
async def read_pay_by_code(numero_factura: int, numero_correlativo_pago: int):
    pay = GetController().get_by_id(table_name="Pago", NumeroFactura=numero_factura, NumeroCorrelativoPago=numero_correlativo_pago)
    if not pay:
        raise HTTPException(status_code=404, detail="Pago not found")
    return pay

@router.post("/pays/create", tags=["Pagos"], response_model=dict)
async def create_pay(NumeroFactura: int, NumeroCorrelativoPago: int, Tipo: str, FechaTarjeta: Optional[date], MontoTarjeta: Optional[float], BancoTarjeta: Optional[str], ModalidadTarjeta: Optional[str], NumeroTarjeta: Optional[str], MontoEfectivo: Optional[float], FechaPagoMovil: Optional[date], TelefonoPagoMovil: Optional[str], ReferenciaPagoMovil: Optional[str], MontoPagoMovil: Optional[float]):
    return PostController().post_data(table_name="Pago", data={
        "NumeroFactura": NumeroFactura,
        "NumeroCorrelativoPago": NumeroCorrelativoPago,
        "Tipo": Tipo,
        "FechaTarjeta": FechaTarjeta,
        "MontoTarjeta": MontoTarjeta,
        "BancoTarjeta": BancoTarjeta,
        "ModalidadTarjeta": ModalidadTarjeta,
        "NumeroTarjeta": NumeroTarjeta,
        "MontoEfectivo": MontoEfectivo,
        "FechaPagoMovil": FechaPagoMovil,
        "TelefonoPagoMovil": TelefonoPagoMovil,
        "ReferenciaPagoMovil": ReferenciaPagoMovil,
        "MontoPagoMovil": MontoPagoMovil
        })


"Endpoints para TelefonosCliente"

@router.get("/customer_phone", tags=["TelefonosCliente"], response_model=list[CustomerPhone])
async def read_customer_phone():
    return GetController().get_all(table_name="TelefonosCliente")

@router.get("/customer_phone/{cliente}/{telefono}", tags=["TelefonosCliente"], response_model=CustomerPhone)
async def read_customer_phone_by_code(cliente: int):
    customer_phone = GetController().get_by_id(table_name="TelefonosCliente", Cliente=cliente)
    if not customer_phone:
        raise HTTPException(status_code=404, detail="TelefonoCliente not found")
    return customer_phone

@router.post("/customer_phone/create", tags=["TelefonosCliente"], response_model=dict)
async def create_customer_phone(Cliente: str, Telefono: str):
    return PostController().post_data(table_name="TelefonosCliente", data={
        "Cliente": Cliente,
        "Telefono": Telefono
        })

@router.delete("/customer_phone/delete")
async def delete_customer_phone(Cliente: str, Telefono: str):
    return DeleteController().delete_data(table_name="TelefonosCliente", data={
        "Cliente": Cliente,
        "Telefono": Telefono
    })

@router.put("/customer_phone/update", tags=["TelefonosCliente"], response_model=dict)
async def update_customer_phone(Cliente: str, Telefono: str, NuevoTelefono: str):
    return UpdateController().put_data(table_name="TelefonosCliente", Cliente=Cliente, Telefono=Telefono, data={
        "Telefono": Telefono,
    })


"Endpoints para EmpleadosOrden"

@router.get("/employee_order", tags=["EmpleadosOrden"], response_model=list[EmployeeOrder])
async def read_employee_order():
    return GetController().get_all(table_name="EmpleadosOrden")

@router.get("/employee_order/{empleado_ci}/{codigo_orden}", tags=["EmpleadosOrden"], response_model=EmployeeOrder)
async def read_employee_order_by_code(empleado_ci: str, codigo_orden: int):
    empleado_orden = GetController().get_by_id(table_name="EmpleadosOrden", EmpleadoCI=empleado_ci, CodigoOrden=codigo_orden)
    if not empleado_orden:
        raise HTTPException(status_code=404, detail="EmpleadoOrden not found")
    return empleado_orden

@router.post("/employee_order/create", tags=["EmpleadosOrden"], response_model=dict)
async def create_employee_order(EmpleadoCI: str, CodigoOrden: int):
    return PostController().post_data(table_name="EmpleadosOrden", data={
        "EmpleadoCI": EmpleadoCI,
        "CodigoOrden": CodigoOrden
    })


" Endpoints para EspecialidadEmpleado  "

@router.get("/specialty_employee", tags=["EspecialidadEmpleado"], response_model=list[SpecialtyEmployee])
async def read_specialty_employee():
    return GetController().get_all(table_name="EspecialidadEmpleado")

@router.get("/specialty_employee/{empleado_ci}/{codigo_especialidad}", tags=["EspecialidadEmpleado"], response_model=SpecialtyEmployee)
async def read_specialty_employee_by_code(empleado_ci: str, codigo_especialidad: int):
    specialty_employee = GetController().get_by_id(table_name="EspecialidadEmpleado", EmpleadoCI=empleado_ci, CodigoEspecialidad=codigo_especialidad)
    if not specialty_employee:
        raise HTTPException(status_code=404, detail="EspecialidadEmpleado not found")
    return specialty_employee

@router.post("/speciality_employee", tags=["EspecialidadEmpleado"], response_model=dict)
async def create_specialty_employee(EmpleadoCI: str, CodigoEspecialidad: int):
    return PostController().post_data(table_name="EspecialidadEmpleado", data={
        "EmpleadoCI": EmpleadoCI,
        "CodigoEspecialidad": CodigoEspecialidad
        })

@router.delete("speciality_employee/delete")
async def delete_specialty_employee(EmpleadoCI: str, CodigoEspecialidad: int):
    return DeleteController().delete_data(table_name="EspecialidadEmpleado", EmpleadoCI=EmpleadoCI, CodigoEspecialidad=CodigoEspecialidad)

"Endpoints para MantenimientoVehiculos"

@router.get("/vehicle_maintenances", tags=["Mantenimiento de Vehículos"], response_model=list[VehicleMaintenance])
async def get_vehicle_maintenances():
    return GetController().get_all(table_name="MantenimientoVehiculo")

@router.get("/vehicle_maintenances/{vehiculo}/{fecha_mantenimiento}", tags=["Mantenimiento de Vehículos"], response_model=VehicleMaintenance)
async def get_vehicle_maintenance_by_code(vehiculo: int, fecha_mantenimiento: date):
    vehicle_maintenance = GetController().get_by_id(table_name="MantenimientoVehiculo", Vehiculo=vehiculo, FechaMantenimiento=fecha_mantenimiento)
    if not vehicle_maintenance:
        raise HTTPException(status_code=404, detail="Mantenimiento de Vehículo not found")
    return vehicle_maintenance

@router.post("/vehicle_maintenances/create", tags=["Mantenimiento de Vehículos"], response_model=dict)
async def create_vehicle_maintenance(Vehiculo: int, FechaMantenimiento: date, Descripcion: str):
    return PostController().post_data(table_name="MantenimientoVehiculo", data={
        "Vehiculo": Vehiculo,
        "FechaMantenimiento": FechaMantenimiento,
        "Descripcion": Descripcion
        })

@router.delete("/vehicle_maintenances/delete", tags=["Mantenimiento de Vehículos"], response_model=dict)
async def delete_vehicle_maintenance(Vehiculo: int, FechaMantenimiento: date):
    return DeleteController().delete_data(table_name="MantenimientoVehiculo", Vehiculo=Vehiculo, FechaMantenimiento=FechaMantenimiento)


"Endpoints para ResponsabilidadEmpleado"

@router.get("/employee_responsibilities", tags=["Responsabilidad de Empleados"], response_model=list[EmployeeResponsibility])
async def get_employee_responsibilities():
    return GetController().get_all(table_name="ResponsabilidadEmpleado")

@router.get("/employee_responsibilities/{empleado_ci}/{codigo_servicio}", tags=["Responsabilidad de Empleados"], response_model=EmployeeResponsibility)
async def get_employee_responsibility_by_code(empleado_ci: str, codigo_servicio: int):
    employee_responsibility = GetController().get_by_id(table_name="ResponsabilidadEmpleado", EmpleadoCI=empleado_ci, CodigoServicio=codigo_servicio)
    if not employee_responsibility:
        raise HTTPException(status_code=404, detail="Responsabilidad de Empleado not found")
    return employee_responsibility

@router.post("/employee_responsibilities/create", tags=["Responsabilidad de Empleados"], response_model=dict)
async def create_employee_responsibility(EmpleadoCI: str, CodigoServicio: int):
    return PostController().post_data(table_name="ResponsabilidadEmpleado", data={
        "EmpleadoCI": EmpleadoCI,
        "CodigoServicio": CodigoServicio
        })

@router.delete("/employee_responsibilities/delete", tags=["Responsabilidad de Empleados"], response_model=dict)
async def delete_employee_responsibility(EmpleadoCI: str, CodigoServicio: int):
    return DeleteController().delete_data(table_name="ResponsabilidadEmpleado", EmpleadoCI=EmpleadoCI, CodigoServicio=CodigoServicio)

"Endpoints para ServiciosFranquicia"

@router.get("/franchise_services", tags=["Servicios de Franquicia"], response_model=list[FranchiseServiceLink])
async def get_franchise_services():
    return GetController().get_all(table_name="ServiciosFranquicia")

@router.get("/franchise_services/{franquicia_rif}/{codigo_servicio}", tags=["Servicios de Franquicia"], response_model=FranchiseServiceLink)
async def get_franchise_service_by_code(franquicia_rif: str, codigo_servicio: int):
    franchise_service = GetController().get_by_id(table_name="ServiciosFranquicia", FranquiciaRIF=franquicia_rif, CodigoServicio=codigo_servicio)
    if not franchise_service:
        raise HTTPException(status_code=404, detail="Servicio de Franquicia not found")
    return franchise_service

@router.post("/franchise_services/create", tags=["Servicios de Franquicia"], response_model=dict)
async def create_franchise_service(FranquiciaRIF: str, CodigoServicio: int):
    return PostController().post_data(table_name="ServiciosFranquicia", data={
        "FranquiciaRIF": FranquiciaRIF,
        "CodigoServicio": CodigoServicio
        })

@router.delete("/franchise_services/delete", tags=["Servicios de Franquicia"], response_model=dict)
async def delete_franchise_service(FranquiciaRIF: str, CodigoServicio: int):
    return DeleteController().delete_data(table_name="ServiciosFranquicia", FranquiciaRIF=FranquiciaRIF, CodigoServicio=CodigoServicio)

" Correction Endpoints "

@router.get("/correction", tags=["Correccion de Inventario"], response_model=list[Correction])
async def read_corrections():
    return GetController().get_all(table_name="CorreccionInventario")

@router.get("/correction/{FranquiciaRIF}/{CodigoProducto}/{FechaCorreccion}", tags=["Correccion de Inventario"], response_model=Correction)
async def read_correction_by_code(FranquiciaRIF: str, CodigoProducto: int, FechaCorreccion: str):
    correction = GetController().get_by_id(table_name="CorreccionInventario", FranquiciaRIF=FranquiciaRIF, CodigoProducto=CodigoProducto, FechaCorreccion=FechaCorreccion)
    if not correction:
        raise HTTPException(status_code=404, detail="Correccion not found")
    return correction

@router.post("/correction/create", tags=["Correccion de Inventario"], response_model=dict)
async def create_correction(FranquiciaRIF: str, CodigoProducto: int, FechaCorreccion: str, Cantidad: int, TipoAjuste: str, Comentario: Optional[str] = None):
    return PostController().post_data(table_name="CorreccionInventario", data={
        "FranquiciaRIF": FranquiciaRIF,
        "CodigoProducto": CodigoProducto,
        "FechaCorreccion": FechaCorreccion,
        "Cantidad": Cantidad,
        "TipoAjuste": TipoAjuste,
        "Comentario": Comentario
        })


" Suministro Endpoints "

@router.get("/supply", tags=["Suministro"], response_model=list[Supply])
async def read_supplies():
    return GetController().get_all(table_name="Suministro")

@router.get("/supply/{ProveedorRIF}/{CodigoProducto}", tags=["Suministro"], response_model=Supply)
async def read_supply_by_code(ProveedorRIF: str, CodigoProducto: int):
    supply = GetController().get_by_id(table_name="Suministro", ProveedorRIF=ProveedorRIF, CodigoProducto=CodigoProducto)
    if not supply:
        raise HTTPException(status_code=404, detail="Suministro not found")
    return supply

@router.post("/supply/create", tags=["Suministro"], response_model=dict)
async def create_supply(ProveedorRIF: str, CodigoProducto: int):
    return PostController().post_data(table_name="Suministro", data={
        "ProveedorRIF": ProveedorRIF,
        "CodigoProducto": CodigoProducto
        })

@router.delete("/supply/delete", tags=["Suministro"], response_model=dict)
async def delete_supply(ProveedorRIF: str, CodigoProducto: int):
    return DeleteController().delete_data(table_name="Suministro", ProveedorRIF=ProveedorRIF, CodigoProducto=CodigoProducto)

@router.put("/supply/update", tags=["Suministro"], response_model=dict)
async def update_supply(ProveedorRIF: str, CodigoProducto: int, NuevoProveedorRIF: str):
    return UpdateController().put_data(table_name="Suministro", ProveedorRIF=ProveedorRIF, CodigoProducto=CodigoProducto, data={
        "ProveedorRIF": NuevoProveedorRIF,
    })

" AumentoInventario Endpoints "

@router.get("/inventory_increase", tags=["Aumento de Inventario"], response_model=list[InventoryIncrease])
async def read_inventory_increases():
    return GetController().get_all(table_name="AumentoInventario")

@router.get("/inventory_increase/{NumeroCompra}/{FranquiciaRIF}/{CodigoProducto}", tags=["Aumento de Inventario"], response_model=InventoryIncrease)
async def read_inventory_increase_by_code(NumeroCompra: int, FranquiciaRIF: str, CodigoProducto: int):
    inventory_increase = GetController().get_by_id(table_name="AumentoInventario", NumeroCompra=NumeroCompra, FranquiciaRIF=FranquiciaRIF, CodigoProducto=CodigoProducto)
    if not inventory_increase:
        raise HTTPException(status_code=404, detail="Aumento de Inventario not found")
    return inventory_increase

@router.post("/inventory_increase/create", tags=["Aumento de Inventario"], response_model=dict)
async def create_inventory_increase(NumeroCompra: int, FranquiciaRIF: str, CodigoProducto: int, CantidadPedida: int, CantidadDisponible: int, Monto: float):
    return PostController().post_data(table_name="AumentoInventario", data={
        "NumeroCompra": NumeroCompra,
        "FranquiciaRIF": FranquiciaRIF,
        "CodigoProducto": CodigoProducto,
        "CantidadPedida": CantidadPedida,
        "CantidadDisponible": CantidadDisponible,
        "Monto": Monto
        })


" Servicios Franquicia Endpoints "

@router.get("/franchise_service", tags=["Servicios Franquicia"], response_model=list[FranchiseServices])
async def read_franchise_services():
    return GetController().get_all(table_name="ServiciosFranquicia")

@router.get("/franchise_service/{FranquiciaRIF}/{CodigoServicio}", tags=["Servicios Franquicia"], response_model=FranchiseServices)
async def read_franchise_service_by_code(FranquiciaRIF: str, CodigoServicio: int):
    franchise_service = GetController().get_by_id(table_name="ServiciosFranquicia", FranquiciaRIF=FranquiciaRIF, CodigoServicio=CodigoServicio)
    if not franchise_service:
        raise HTTPException(status_code=404, detail="Servicio Franquicia not found")
    return franchise_service

@router.post("/franchise_servive/create", tags=["Servicios Franquicia"], response_model=dict)
async def create_franchise_service(FranquiciaRIF: str, CodigoServicio: int):
    return PostController().post_data(table_name="ServiciosFranquicia", data={
        "FranquiciaRIF": FranquiciaRIF,
        "CodigoServicio": CodigoServicio
        })

@router.delete("/franchise_service/delete", tags=["Servicios Franquicia"], response_model=dict)
async def delete_franchise_service(FranquiciaRIF: str, CodigoServicio: int):
    return DeleteController().delete_data(table_name="ServiciosFranquicia", data={
        "FranquiciaRIF": FranquiciaRIF,
        "CodigoServicio": CodigoServicio
        })


" Producto Orden de Servicio Endpoints "

@router.get("/product_service_order", tags=["Productos Orden Servicio"], response_model=list[ProductServiceOrder])
async def read_product_service_orders():
    return GetController().get_all(table_name="ProductoOrdenServicio")

@router.get("/product_service_order/{CodigoOrdenServicio}/{CodigoServicio}/{NumeroCorrelativoActividad}/{FranquiciaRIF}/{CodigoProducto}", tags=["Productos Orden Servicio"], response_model=ProductServiceOrder)
async def read_product_service_order_by_code(CodigoOrdenServicio: int, CodigoServicio: int, NumeroCorrelativoActividad: int, FranquiciaRIF: str, CodigoProducto: int):
    product_service_order = GetController().get_by_id(table_name="ProductoOrdenServicio", CodigoOrdenServicio=CodigoOrdenServicio, CodigoServicio=CodigoServicio, NumeroCorrelativoActividad=NumeroCorrelativoActividad, FranquiciaRIF=FranquiciaRIF, CodigoProducto=CodigoProducto)
    if not product_service_order:
        raise HTTPException(status_code=404, detail="Producto Orden Servicio not found")
    return product_service_order

@router.post("/product_service_order/create", tags=["Productos Orden Servicio"], response_model=dict)
async def create_product_service_order(CodigoOrdenServicio: int, CodigoServicio: int, NumeroCorrelativoActividad: int, FranquiciaRIF: str, CodigoProducto: int, CantidadUtilizada: int, PrecioProducto: float):
    return PostController().post_data(table_name="ProductoOrdenServicio", data={
        "CodigoOrdenServicio": CodigoOrdenServicio,
        "CodigoServicio": CodigoServicio,
        "NumeroCorrelativoActividad": NumeroCorrelativoActividad,
        "FranquiciaRIF": FranquiciaRIF,
        "CodigoProducto": CodigoProducto,
        "CantidadUtilizada": CantidadUtilizada,
        "PrecioProducto": PrecioProducto
        })