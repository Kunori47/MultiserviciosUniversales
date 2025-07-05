from fastapi import APIRouter, HTTPException, Body
from fastapi.responses import RedirectResponse
from controller.controller import *
from models import *
from typing import Optional
from datetime import date
from pydantic import BaseModel
from db.database import database

router = APIRouter()

class LoginRequest(BaseModel):
    cedula: str

@router.get("/")
async def read_root():
    return RedirectResponse(url="/docs")

@router.post("/auth/login", tags=["Autenticación"])
async def login_employee(login_data: LoginRequest):
    """
    Autenticar empleado por cédula y devolver información de la franquicia
    """
    try:
        employee = GetController().get_by_id(table_name="Empleados", CI=login_data.cedula)
        if not employee:
            raise HTTPException(status_code=401, detail="Cédula no encontrada")
        
        # Convertir employee a diccionario
        # employee es una tupla de fetchone(), necesitamos obtener las columnas
        
        # Obtener las columnas de la tabla Empleados
        database.execute("SELECT * FROM Empleados WHERE 1=0")  # Query vacío para obtener columnas
        columns = [column[0] for column in database.description]
        
        # Convertir la tupla employee a diccionario
        employee_dict = dict(zip(columns, employee))
        
        # Obtener información de la franquicia
        franchise_dict = None
        if employee_dict.get('FranquiciaRIF'):
            franchise = GetController().get_by_id(table_name="Franquicias", RIF=employee_dict['FranquiciaRIF'])
            
            if franchise:
                # Obtener las columnas de la tabla Franquicias
                database.execute("SELECT * FROM Franquicias WHERE 1=0")
                franchise_columns = [column[0] for column in database.description]
                
                # Convertir la tupla franchise a diccionario
                franchise_dict = dict(zip(franchise_columns, franchise))
        
        return {
            "success": True,
            "employee": {
                "CI": employee_dict.get('CI'),
                "NombreCompleto": employee_dict.get('NombreCompleto'),
                "Rol": employee_dict.get('Rol'),
                "FranquiciaRIF": employee_dict.get('FranquiciaRIF')
            },
            "franchise": {
                "RIF": franchise_dict.get('RIF'),
                "Nombre": franchise_dict.get('Nombre'),
                "Direccion": franchise_dict.get('Direccion')
            } if franchise_dict else None
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en autenticación: {str(e)}")

" Franquicia Endpoints "

@router.get("/franchise", tags=["Franquicias"], response_model=list[Franchise])
async def read_franchise():
    return GetController().get_all(table_name="Franquicias")

@router.get("/franchise/search", tags=["Franquicias"])
async def search_franchises(q: str):
    return GetController().search(table_name="Franquicias", query=q)

@router.get("/franchise/{RIF}", tags=["Franquicias"], response_model=Franchise)
async def read_franchise_by_rif(RIF: str):
    franchise = GetController().get_by_id(table_name="Franquicias", RIF=RIF)
    if not franchise:
        raise HTTPException(status_code=404, detail="Franquicia not found")
    return franchise

@router.post("/franchise/create", tags=["Franquicias"], response_model=dict)
async def create_new_franchise(Franchise: Franchise):
    return PostController().post_data(table_name="Franquicias", data=Franchise.model_dump())

@router.put("/franchise/update", tags=["Franquicias"], response_model=dict)
async def update_franchise(Franchise: Franchise):
    return UpdateController().put_data(table_name="Franquicias", data=Franchise.model_dump(), RIF=Franchise.RIF)

" Empleados Endpoints "

@router.get("/employee", tags=["Empleado"], response_model=list[Employee])
async def read_employee():
    return GetController().get_all(table_name="Empleados")

@router.get("/employee/count", tags=["Empleado"])
async def get_employee_count():
    return GetController().count(table_name="Empleados")

@router.get("/employee/search", tags=["Empleado"])
async def search_employees_by_name(q: str):
    return GetController().search(table_name="Empleados", query=q)

@router.get("/employee/franchise/{RIF}/search", tags=["Empleado"])
async def search_employees(RIF: str, q: str):
    return GetController().searchFilters(table_name="Empleados", FranquiciaRIF=RIF, query=q)

@router.get("/employee/franchise/{RIF}/count", tags=["Empleado"])
async def get_employee_count_by_franchise(RIF: str):
    return GetController().count_by_franchise(table_name="Empleados", FranquiciaRIF=RIF)

@router.get("/employee/franchise/{RIF}", tags=["Empleado"], response_model=list[Employee])
async def read_employee_by_rif(RIF: str):
    return GetController().get_by_filter(table_name="Empleados", FranquiciaRIF=RIF)

@router.get("/employee/{CI}", tags=["Empleado"], response_model=Employee)
async def read_employee_by_ci(CI: str):
    employee = GetController().get_by_id(table_name="Empleados", CI=CI)
    if not employee:
        raise HTTPException(status_code=404, detail="Empleado not found")
    return employee

@router.get("/employee_specialties", tags=["Empleado"])
async def get_employee_specialties(EmpleadoCI: str):
    """
    Get all specialties for a specific employee
    """
    return GetController().get_employee_specialties(EmpleadoCI)

@router.post("/employee/create", tags=["Empleado"], response_model=dict)
async def create_employee(Employee: Employee):
    return PostController().post_data(table_name="Empleados", data=Employee.model_dump())

@router.delete("/employee/delete", tags=["Empleado"], response_model=dict)
async def delete_employee(CI: str):
    return DeleteController().delete_data(table_name="Empleados", CI=CI)

@router.put("/employee/update", tags=["Empleado"], response_model=dict)
async def update_employee(employee: Employee):
    return UpdateController().put_data(table_name="Empleados", CI=employee.CI, data={
        "Direccion": employee.Direccion,
        "Telefono": employee.Telefono,
        "Salario": employee.Salario,
        "FranquiciaRIF": employee.FranquiciaRIF,
        "Rol": employee.Rol
    })

" Marcas Endpoints "

@router.get("/brand", tags=["Marca"], response_model=list[Brand])
async def read_brands():
    return GetController().get_all(table_name="Marcas")

@router.get("/brand/search", tags=["Marca"])
async def search_brands(q: str):
    return GetController().search(table_name="Marcas", query=q)

@router.get("/brand/{CodigoMarca}/models", tags=["Marca"])
async def get_models_by_brand(CodigoMarca: int):
    """
    Get all models for a specific brand
    """
    return GetController().get_models_by_brand(CodigoMarca)

@router.get("/brand/{CodigoMarca}/next-model-number", tags=["Marca"])
async def get_next_model_number(CodigoMarca: int):
    """
    Get the next correlative number for models of a specific brand
    """
    return {"next_number": GetController().get_next_model_correlative_number(CodigoMarca)}

@router.get("/brand/{CodigoMarca}", tags=["Marca"], response_model=Brand)
async def read_brand_by_code(CodigoMarca: int):
    brand = GetController().get_by_id(table_name="Marcas", CodigoMarca=CodigoMarca)
    if not brand:
        raise HTTPException(status_code=404, detail="Marca not found")
    return brand

@router.post("/brand/create", tags=["Marca"], response_model=dict)
async def create_brand(Marca: str):
    return PostController().post_data(table_name="Marcas", data={
        "Nombre": Marca
    })

@router.delete("/brand/delete", tags=["Marca"], response_model=dict)
async def delete_brand(CodigoMarca: int):
    # Verificar si la marca tiene modelos asociados
    has_models = GetController().check_brand_has_models(CodigoMarca)
    if has_models:
        raise HTTPException(
            status_code=400, 
            detail="No se puede eliminar la marca porque tiene modelos asociados. Elimine primero todos los modelos de esta marca."
        )
    return DeleteController().delete_data(table_name="Marcas", CodigoMarca=CodigoMarca)

@router.put("/brand/update", tags=["Marca"], response_model=dict)
async def update_brand(marca: Brand):
    return UpdateController().put_data(table_name="Marcas", CodigoMarca=marca.CodigoMarca, data={"Nombre": marca.Nombre})

" Modelos Endpoints "

@router.get("/model", tags=["Modelo"], response_model=list[Model])
async def read_models():
    return GetController().get_all(table_name="Modelos")

@router.get("/model/search", tags=["Modelo"])
async def search_models(q: str):
    return GetController().search(table_name="Modelos", query=q)

@router.get("/model/{CodigoMarca}/{NumeroCorrelativoModelo}", tags=["Modelo"], response_model=Model)
async def read_model_by_code(CodigoMarca: int, NumeroCorrelativoModelo: int):
    model = GetController().get_by_id(table_name="Modelos", CodigoMarca=CodigoMarca, NumeroCorrelativoModelo=NumeroCorrelativoModelo)
    if not model:
        raise HTTPException(status_code=404, detail="Modelo not found")
    return model

@router.post("/model/create", tags=["Modelo"], response_model=dict)
async def create_model(modelo: ModelCreate):
    return PostController().post_model_data({
        "CodigoMarca": modelo.CodigoMarca,
        "DescripcionModelo": modelo.DescripcionModelo,
        "CantidadPuestos": modelo.CantidadPuestos,
        "TipoRefrigerante": modelo.TipoRefrigerante,
        "TipoGasolina": modelo.TipoGasolina,
        "TipoAceite": modelo.TipoAceite,
        "Peso": modelo.Peso
    })

@router.delete("/model/delete", tags=["Modelo"], response_model=dict)
async def delete_model(CodigoMarca: int, NumeroCorrelativoModelo: int):
    return DeleteController().delete_data(table_name="Modelos", CodigoMarca=CodigoMarca, NumeroCorrelativoModelo=NumeroCorrelativoModelo)

@router.put("/model/update", tags=["Modelo"], response_model=dict)
async def update_model(modelo: Model):
    return UpdateController().put_data(table_name="Modelos", CodigoMarca=modelo.CodigoMarca, NumeroCorrelativoModelo=modelo.NumeroCorrelativoModelo, data={
        "DescripcionModelo": modelo.DescripcionModelo,
        "CantidadPuestos": modelo.CantidadPuestos,
        "TipoRefrigerante": modelo.TipoRefrigerante,
        "TipoGasolina": modelo.TipoGasolina,
        "TipoAceite": modelo.TipoAceite,
        "Peso": modelo.Peso
    })

@router.get("/model/{CodigoMarca}/{NumeroCorrelativoModelo}/maintenance-plans", tags=["Modelo"])
async def get_maintenance_plans_by_model(CodigoMarca: int, NumeroCorrelativoModelo: int):
    """
    Get all maintenance plans for a specific model
    """
    return GetController().get_maintenance_plans_by_model(CodigoMarca, NumeroCorrelativoModelo)

" Vehiculo Endpoints "

@router.get("/vehicle", tags=["Vehiculo"], response_model=list[Vehicle])
async def read_vehicles():
    return GetController().get_all(table_name="Vehiculos")

@router.get("/vehicle/{CodigoVehiculo}", tags=["Vehiculo"], response_model=Vehicle)
async def read_vehicle_by_code(CodigoVehiculo: int):
    vehicle = GetController().get_by_id(table_name="Vehiculos", CodigoVehiculo=CodigoVehiculo)
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehiculo not found")
    return vehicle

@router.post("/vehicle/create", tags=["Vehiculo"], response_model=dict)
async def create_vehicle(CodigoMarca: int, NumeroCorrelativoModelo: int, Placa: str, FechaAdquisicion: str, TipoAceite: str, CedulaCliente: str):
    return PostController().post_data(table_name="Vehiculos", data={
        "CodigoMarca": CodigoMarca,
        "NumeroCorrelativoModelo": NumeroCorrelativoModelo,
        "Placa": Placa,
        "FechaAdquisicion": FechaAdquisicion,
        "TipoAceite": TipoAceite,
        "CedulaCliente": CedulaCliente
    })

@router.delete("/vehicle/delete", tags=["Vehiculo"], response_model=dict)
async def delete_vehicle(CodigoVehiculo: int):
    return DeleteController().delete_data(table_name="Vehiculos", CodigoVehiculo=CodigoVehiculo)

@router.put("/vehicle/update", tags=["Vehiculo"], response_model=dict)
async def update_vehicle(vehiculo: Vehicle):
    return UpdateController().put_data(table_name="Vehiculos", CodigoVehiculo=vehiculo.CodigoVehiculo, data={
        "Placa": vehiculo.Placa,
        "TipoAceite": vehiculo.TipoAceite,
        "CedulaCliente": vehiculo.CedulaCliente
    })

" Cliente Endpoints "

@router.get("/customer", tags=["Cliente"], response_model=list[Customer])
async def read_customers():
    return GetController().get_all(table_name="Clientes")

@router.get("/customer/frequency", tags=["Cliente"])
async def customer_frequency(mes: Optional[int] = None, anio: Optional[int] = None):
    """
    Devuelve la frecuencia mensual de visitas de cada cliente (cantidad de órdenes de servicio en el mes y año dados, o actual si no se pasan)
    """
    from datetime import datetime
    now = datetime.now()
    mes = mes or now.month
    anio = anio or now.year
    return GetController().get_customer_frequency(mes, anio)

@router.get("/customer/frequency_total", tags=["Cliente"])
async def customer_total_frequency():
    return GetController().get_customer_total_frequency()

@router.get("/customer/{CI}/frequency_last_3_months", tags=["Cliente"])
async def customer_frequency_last_3_months(CI: str):
    """
    Get customer visit frequency for the last 3 months
    """
    return {"frequency": GetController().get_customer_frequency_last_3_months(CI)}

@router.get("/customer/{CI}", tags=["Cliente"], response_model=Customer)
async def read_customer_by_ci(CI: str):
    customer = GetController().get_by_id(table_name="Clientes", CI=CI)
    if not customer:
        raise HTTPException(status_code=404, detail="Cliente not found")
    return customer

@router.post("/customer/create", tags=["Cliente"], response_model=dict)
async def create_customer(cliente: Customer):
    return PostController().post_data(table_name="Clientes", data={
        "CI": cliente.CI,
        "NombreCompleto": cliente.NombreCompleto,
        "Email": cliente.Email
    })

@router.delete("/customer/delete", tags=["Cliente"], response_model=dict)
async def delete_customer(CI: str):
    return DeleteController().delete_data(table_name="Clientes", CI=CI)

@router.put("/customer/update", tags=["Cliente"], response_model=dict)
async def update_customer(cliente: Customer):
    return UpdateController().put_data(table_name="Clientes", CI=cliente.CI, data={
        "NombreCompleto": cliente.NombreCompleto,
        "Email": cliente.Email
    })

# --- MaintenancePlan endpoints ---
@router.get("/maintenanceplan", tags=["Plan de Mantenimiento"], response_model=list[MaintenancePlan])
async def read_maintenanceplan():
    return GetController().get_all(table_name="PlanesMantenimiento")

@router.get("/maintenanceplan/search", tags=["Plan de Mantenimiento"])
async def search_maintenance_plans(q: str):
    return GetController().search(table_name="PlanesMantenimiento", query=q)

@router.get("/maintenanceplan/{CodigoMantenimiento}", tags=["Plan de Mantenimiento"], response_model=MaintenancePlan)
async def read_maintenanceplan_by_code(CodigoMantenimiento: int):
    maintenance_plan = GetController().get_by_id(table_name="PlanesMantenimiento", CodigoMantenimiento=CodigoMantenimiento)
    if not maintenance_plan:
        raise HTTPException(status_code=404, detail="Plan de Mantenimiento not found")
    return maintenance_plan

@router.post("/maintenanceplan/create", tags=["Plan de Mantenimiento"], response_model=dict)
async def create_maintenanceplan(TiempoUso: int, Kilometraje: int, DescripcionMantenimiento: str, CodigoMarca: int, NumeroCorrelativoModelo: int):
    return PostController().post_data(table_name="PlanesMantenimiento", data={
        "TiempoUso": TiempoUso,
        "Kilometraje": Kilometraje,
        "DescripcionMantenimiento": DescripcionMantenimiento,
        "CodigoMarca": CodigoMarca,
        "NumeroCorrelativoModelo": NumeroCorrelativoModelo
    })

@router.delete("/maintenanceplan/delete", tags=["Plan de Mantenimiento"], response_model=dict)
async def delete_maintenanceplan(CodigoMantenimiento: int):
    return DeleteController().delete_data(table_name="PlanesMantenimiento", CodigoMantenimiento=CodigoMantenimiento)

@router.put("/maintenanceplan/update", tags=["Plan de Mantenimiento"], response_model=dict)
async def update_maintenanceplan(planmantenimiento: MaintenancePlan):
    return UpdateController().put_data(table_name="PlanesMantenimiento", CodigoMantenimiento=planmantenimiento.CodigoMantenimiento, data={
        "TiempoUso": planmantenimiento.TiempoUso,
        "Kilometraje": planmantenimiento.Kilometraje,
        "DescripcionMantenimiento": planmantenimiento.DescripcionMantenimiento,
        "CodigoMarca": planmantenimiento.CodigoMarca,
        "NumeroCorrelativoModelo": planmantenimiento.NumeroCorrelativoModelo
    })


" Specialty endpoints "

@router.get("/specialty", tags=["Especialidad"], response_model=list[Specialty])
async def read_specialties():
    return GetController().get_all(table_name="Especialidades")

@router.get("/specialty/search", tags=["Especialidad"])
async def search_specialties(q: str):
    return GetController().search(table_name="Especialidades", query=q)

@router.get("/specialty/{CodigoEspecialidad}", tags=["Especialidad"], response_model=Specialty)
async def read_specialty_by_code(CodigoEspecialidad: int):
    specialty = GetController().get_by_id(table_name="Especialidades", CodigoEspecialidad=CodigoEspecialidad)
    if not specialty:
        raise HTTPException(status_code=404, detail="Especialidad not found")
    return specialty

@router.post("/specialty/create", tags=["Especialidad"], response_model=dict)
async def create_specialty(Descripcion: str):
    return PostController().post_data(table_name="Especialidades", data={"DescripcionEspecialidad": Descripcion})

@router.delete("/specialty/delete", tags=["Especialidad"], response_model=dict)
async def delete_specialty(CodigoEspecialidad: int):
    return DeleteController().delete_data(table_name="Especialidades", CodigoEspecialidad=CodigoEspecialidad)

@router.put("/specialty/update", tags=["Especialidad"], response_model=dict)
async def update_specialty(especialidad: Specialty):
    return UpdateController().put_data(table_name="Especialidades", CodigoEspecialidad=especialidad.CodigoEspecialidad, data={"DescripcionEspecialidad": especialidad.DescripcionEspecialidad})


" Servicio Endpoints "

@router.get("/service", tags=["Servicio"], response_model=list[Service])
async def read_services():
    return GetController().get_all(table_name="Servicios")

@router.get("/service/franchise/{FranquiciaRIF}", tags=["Servicio"])
async def get_services_by_franchise(FranquiciaRIF: str):
    """
    Get all services that a specific franchise offers
    """
    return GetController().get_services_by_franchise(FranquiciaRIF)

@router.post("/service/create", tags=["Servicio"], response_model=dict)
async def create_service(Servicio: str):
    if not Servicio or not Servicio.strip():
        raise HTTPException(status_code=400, detail="Service name is required")
    
    try:
        return PostController().post_data(table_name="Servicios", data={"NombreServicio": Servicio.strip()})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating service: {str(e)}")

@router.get("/service/{CodigoServicio}", tags=["Servicio"], response_model=Service)
async def read_service_by_code(CodigoServicio: int):
    service = GetController().get_by_id(table_name="Servicios", CodigoServicio=CodigoServicio)
    if not service:
        raise HTTPException(status_code=404, detail="Servicio not found")
    return service

@router.delete("/service/delete", tags=["Servicio"], response_model=dict)
async def delete_service(CodigoServicio: int):
    return DeleteController().delete_data(table_name="Servicios", CodigoServicio=CodigoServicio)

@router.put("/service/update", tags=["Servicio"], response_model=dict)
async def update_service(servicio:  Service):
    return UpdateController().put_data(table_name="Servicios", CodigoServicio=servicio.CodigoServicio, data={"NombreServicio": servicio.NombreServicio})

" Linea de Suministros Endpoints "

@router.get("/supplier_line", tags=["Linea de Suministro"], response_model=list[SupplierLine])
async def read_supplier_lines():
    return GetController().get_all(table_name="LineasSuministro")

@router.get("/supplier_line/search", tags=["Linea de Suministro"])
async def search_supplier_lines(q: str):
    return GetController().search(table_name="LineasSuministro", query=q)

@router.get("/supplier_line/{CodigoLinea}", tags=["Linea de Suministro"], response_model=SupplierLine)
async def read_supplier_line_by_code(CodigoLinea: int):
    supplier_line = GetController().get_by_id(table_name="LineasSuministro", CodigoLinea=CodigoLinea)
    if not supplier_line:
        raise HTTPException(status_code=404, detail="Linea de Suministro not found")
    return supplier_line

@router.post("/supplier_line/create", tags=["Linea de Suministro"], response_model=dict)
async def create_supplier_line(DescripcionLinea: str):
    return PostController().post_data(table_name="LineasSuministro", data={"DescripcionLinea": DescripcionLinea})

@router.delete("/supplier_line/delete", tags=["Linea de Suministro"], response_model=dict)
async def delete_supplier_line(CodigoLinea: int):
    return DeleteController().delete_data(table_name="LineasSuministro", CodigoLinea=CodigoLinea)

@router.put("/supplier_line/update", tags=["Linea de Suministro"], response_model=dict)
async def update_supplier_line(lineasuministro: SupplierLine):
    return UpdateController().put_data(table_name="LineasSuministro", CodigoLinea=lineasuministro.CodigoLinea, data={"DescripcionLinea": lineasuministro.DescripcionLinea})


" Producto Endpoints "

@router.get("/product", tags=["Producto"], response_model=list[Product])
async def read_products():
    return GetController().get_all(table_name="Productos")

@router.get("/product/search", tags=["Producto"])
async def search_products(q: str):
    return GetController().search(table_name="Productos", query=q)


@router.post("/product/create", tags=["Producto"], response_model=dict)
async def create_product(NombreProducto: str, DescripcionProducto: str, LineaSuministro: int, Tipo: str, NivelContaminante: int, Tratamiento: str):
    return PostController().post_data(table_name="Productos", data={
        "NombreProducto": NombreProducto,
        "DescripcionProducto": DescripcionProducto,
        "LineaSuministro": LineaSuministro,
        "Tipo": Tipo,
        "NivelContaminante": NivelContaminante,
        "Tratamiento": Tratamiento
    })


@router.get("/product/{CodigoProducto}", tags=["Producto"], response_model=Product)
async def read_product_by_code(CodigoProducto: int):
    product = GetController().get_by_id(table_name="Productos", CodigoProducto=CodigoProducto)
    if not product:
        raise HTTPException(status_code=404, detail="Producto not found")
    return product


@router.delete("/product/delete", tags=["Producto"], response_model=dict)
async def delete_product(CodigoProducto: int):
    return DeleteController().delete_data(table_name="Productos", CodigoProducto=CodigoProducto)

@router.put("/product/update", tags=["Producto"], response_model=dict)
async def update_product(producto: Product):
    return UpdateController().put_data(table_name="Productos", CodigoProducto=producto.CodigoProducto, data={
        "NombreProducto": producto.NombreProducto,
        "DescripcionProducto": producto.DescripcionProducto,
        "LineaSuministro": producto.LineaSuministro,
        "Tipo": producto.Tipo,
        "NivelContaminante": producto.NivelContaminante,
        "Tratamiento": producto.Tratamiento
    })

" Proveedor Endpoints "

@router.get("/vendor", tags=["Proveedor"], response_model=list[Vendor])
async def read_vendors():
    return GetController().get_all(table_name="Proveedores")

@router.get("/vendor/search", tags=["Proveedor"])
async def search_vendors(q: str):
    return GetController().search(table_name="Proveedores", query=q)

@router.get("/vendor/{RIF}", tags=["Proveedor"], response_model=Vendor)
async def read_vendor_by_rif(RIF: str):
    vendor = GetController().get_by_id(table_name="Proveedores", RIF=RIF)
    if not vendor:
        raise HTTPException(status_code=404, detail="Proveedor not found")
    return vendor

@router.post("/vendor/create", tags=["Proveedor"], response_model=dict)
async def create_vendor(proveedor: Vendor):
    return PostController().post_data(table_name="Proveedores", data={
        "RIF": proveedor.RIF,
        "RazonSocial": proveedor.RazonSocial,
        "Direccion": proveedor.Direccion,
        "TelefonoLocal": proveedor.TelefonoLocal,
        "TelefonoCelular": proveedor.TelefonoCelular,
        "PersonaContacto": proveedor.PersonaContacto
    })

@router.delete("/vendor/delete", tags=["Proveedor"], response_model=dict)
async def delete_vendor(RIF: str):
    # Eliminar suministros asociados primero
    DeleteController().delete_data(table_name="Suministros", ProveedorRIF=RIF)
    # Luego eliminar el proveedor
    return DeleteController().delete_data(table_name="Proveedores", RIF=RIF)

@router.put("/vendor/update", tags=["Proveedor"], response_model=dict)
async def update_vendor(proveedor: Vendor):
    return UpdateController().put_data(table_name="Proveedores", RIF=proveedor.RIF, data={
        "RazonSocial": proveedor.RazonSocial,
        "Direccion": proveedor.Direccion,
        "TelefonoLocal": proveedor.TelefonoLocal,
        "TelefonoCelular": proveedor.TelefonoCelular,
        "PersonaContacto": proveedor.PersonaContacto
    })

" Orden de Servicio Endpoints "

@router.get("/service_order", tags=["Orden de Servicio"], response_model=list[ServiceOrder])
async def read_service_orders():
    return GetController().get_all(table_name="OrdenesServicio")  

@router.get("/service_order/all", tags=["Orden de Servicio"])
async def get_all_service_orders():
    """
    Get all service orders with customer and vehicle information
    """
    return GetController().get_all_service_orders()

@router.get("/service_order/franchise/{FranquiciaRIF}", tags=["Orden de Servicio"])
async def get_orders_by_franchise(FranquiciaRIF: str, mes: Optional[int] = None, anio: Optional[int] = None, estado: Optional[str] = None):
    return GetController().get_orders_by_franchise(FranquiciaRIF, mes, anio, estado)

@router.get("/service_order/franchise/{FranquiciaRIF}/stats", tags=["Orden de Servicio"])
async def get_orders_stats_by_franchise(FranquiciaRIF: str, mes: Optional[int] = None, anio: Optional[int] = None):
    return GetController().get_orders_stats_by_franchise(FranquiciaRIF, mes, anio)

@router.get("/service_order/franchise/{FranquiciaRIF}/{NumeroOrden}/details", tags=["Orden de Servicio"])
async def get_order_details(FranquiciaRIF: str, NumeroOrden: int):
    return GetController().get_order_details(FranquiciaRIF, NumeroOrden)

@router.get("/service_order/{ID}", tags=["Orden de Servicio"], response_model=ServiceOrder)
async def read_service_order_by_id(ID: int):
    service_order = GetController().get_by_id(table_name="OrdenesServicio", ID=ID)
    if not service_order:
        raise HTTPException(status_code=404, detail="Orden de Servicio not found")
    return service_order

@router.get("/service_order/vehicle/{CodigoVehiculo}", tags=["Orden de Servicio"])
async def get_orders_by_vehicle(CodigoVehiculo: int):
    """
    Get all service orders for a specific vehicle
    """
    return GetController().get_orders_by_vehicle(CodigoVehiculo)

@router.post("/service_order/create", tags=["Orden de Servicio"], response_model=dict)
async def create_service_order(service_order_data: ServiceOrderCreate):
    return PostController().create_service_order_with_employees(service_order_data.model_dump())

@router.put("/service_order/update", tags=["Orden de Servicio"], response_model=dict)
async def update_service_order(ID: int, FechaSalidaReal: str, HoraSalidaReal: str, Comentario: str):
    data = {}
    if FechaSalidaReal is not None:
        data["FechaSalidaReal"] = FechaSalidaReal
    if HoraSalidaReal is not None:
        data["HoraSalidaReal"] = HoraSalidaReal
    if Comentario is not None:
        data["Comentario"] = Comentario
    return UpdateController().put_data(table_name="OrdenesServicio", ID=ID, data=data)

@router.delete("/service_order/delete/{ID}", tags=["Orden de Servicio"], response_model=dict)
async def delete_service_order(ID: int):
    """
    Elimina una orden de servicio por su ID.
    """
    return DeleteController().delete_data(table_name="OrdenesServicio", ID=ID)

@router.get("/service_order/employee/{CI}/pending", tags=["Orden de Servicio"])
async def get_pending_service_orders_by_employee(CI: str):
    """
    Devuelve las órdenes de servicio asignadas a un empleado (por CI) que no tienen FechaSalidaReal ni HoraSalidaReal.
    """
    return GetController().get_pending_service_orders_by_employee(CI)

@router.get("/service_order/{NumeroOrden}/services", tags=["Orden de Servicio"])
async def get_services_by_order(NumeroOrden: int):
    """
    Devuelve todos los servicios y actividades de una orden específica con sus precios y subtotales.
    """
    return GetController().get_services_by_order(NumeroOrden)


" Factura Endpoints "

@router.get("/invoice", tags=["Factura"], response_model=list[Invoice])
async def read_invoices():
    return GetController().get_all(table_name="Facturas")

@router.get("/invoice/{NumeroFactura}", tags=["Factura"], response_model=Invoice)
async def read_invoice_by_number(NumeroFactura: int):
    invoice = GetController().get_by_id(table_name="Facturas", NumeroFactura=NumeroFactura)
    if not invoice:
        raise HTTPException(status_code=404, detail="Factura not found")
    return invoice

@router.post("/invoice/create", tags=["Factura"], response_model=dict)
async def create_invoice(factura: Invoice):
    return PostController().post_data(table_name="Facturas", data={
        "FechaEmision": factura.FechaEmision,
        "MontoTotal": factura.MontoTotal,
        "IVA": factura.IVA,
        "Descuento": factura.Descuento,
        "OrdenServicioID": factura.OrdenServicioID,
        "FranquiciaRIF": factura.FranquiciaRIF
    })

@router.post("/invoice/create_with_payments", tags=["Factura"], response_model=dict)
async def create_invoice_with_payments(invoice_data: dict):
    """
    Create an invoice with multiple payment methods
    invoice_data should contain:
    - NumeroOrden: int
    - FranquiciaRIF: string
    - FechaFactura: string
    - MontoTotal: float
    - MetodosPago: list of dict with Metodo, Cantidad, Descripcion
    """
    return PostController().create_invoice_with_payments(invoice_data)

@router.get("/invoice/franchise/{FranquiciaRIF}", tags=["Factura"])
async def get_invoices_by_franchise(FranquiciaRIF: str, mes: Optional[int] = None, anio: Optional[int] = None):
    return GetController().get_invoices_by_franchise(FranquiciaRIF, mes, anio)

@router.get("/invoice/franchise/{FranquiciaRIF}/{NumeroFactura}/details", tags=["Factura"])
async def get_invoice_details(FranquiciaRIF: str, NumeroFactura: int):
    return GetController().get_invoice_details(FranquiciaRIF, NumeroFactura)


" Compra Endpoints "

@router.get("/purchase", tags=["Compra"], response_model=list[Purchase])
async def read_purchases():
    return GetController().get_all(table_name="Compras")

@router.get("/purchase/franchise/{FranquiciaRIF}", tags=["Compra"])
async def get_purchases_by_franchise(FranquiciaRIF: str, mes: Optional[int] = None, anio: Optional[int] = None):
    return GetController().get_purchases_by_franchise(FranquiciaRIF, mes, anio)

@router.get("/purchase/{NumeroCompra}", tags=["Compra"], response_model=Purchase)
async def read_purchase_by_number(NumeroCompra: int):
    purchase = GetController().get_by_id(table_name="Compras", Numero=NumeroCompra)
    if not purchase:
        raise HTTPException(status_code=404, detail="Compra not found")
    return purchase

@router.post("/purchase/create", tags=["Compra"], response_model=dict)
async def create_purchase(compra: Purchase):
    return PostController().post_data(table_name="Compras", data={
        "Fecha": compra.Fecha,
        "ProveedorRIF": compra.ProveedorRIF
    })

@router.post("/purchase/create_with_inventory", tags=["Compra"], response_model=dict)
async def create_purchase_with_inventory(purchase_data: dict):
    """
    Create a purchase and update inventory in a single transaction
    purchase_data should contain:
    - Fecha: date
    - ProveedorRIF: string
    - items: list of dict with CodigoProducto, CantidadPedida, CantidadDisponible, Monto, FranquiciaRIF
    """
    return PostController().create_purchase_with_inventory(purchase_data)

@router.get("/purchase/franchise/{FranquiciaRIF}/{NumeroCompra}/details", tags=["Compra"])
async def get_purchase_details(FranquiciaRIF: str, NumeroCompra: int):
    return GetController().get_purchase_details(FranquiciaRIF, NumeroCompra)


" Producto Franquicia Endpoints "

@router.get("/product_franchise", tags=["Producto Franquicia"], response_model=list[ProductFranchise])
async def read_product_franchises():
    return GetController().get_all(table_name="ProductosFranquicia")

@router.get("/product_franchise/count_products", tags=["Producto Franquicia"])
async def count_products():
    return GetController().count_distinct(table_name="ProductosFranquicia", column_name="CodigoProducto")

@router.get("/product_franchise/count_products_by_franchise", tags=["Producto Franquicia"])
async def count_products_by_franchise(FranquiciaRIF: str):
    return GetController().count_distinct_by_franchise(table_name="ProductosFranquicia", FranquiciaRIF=FranquiciaRIF, column_name="CodigoProducto")

@router.get("/product_franchise/franchise/{FranquiciaRIF}", tags=["Producto Franquicia"])
async def get_inventory_by_franchise(FranquiciaRIF: str):
    return GetController().get_inventory_by_franchise(FranquiciaRIF)

@router.get("/product_franchise/franchise/{FranquiciaRIF}/search", tags=["Producto Franquicia"])
async def search_inventory_by_franchise(FranquiciaRIF: str, q: str):
    return GetController().search_inventory_by_franchise(FranquiciaRIF, q)

@router.get("/product_franchise/product", tags=["Producto Franquicia"])
async def get_product_by_franchise_and_code(FranquiciaRIF: str, CodigoProducto: int):
    return GetController().get_product_by_franchise_and_code(FranquiciaRIF, CodigoProducto)

@router.get("/product_franchise/{FranquiciaRIF}/{CodigoProducto}", tags=["Producto Franquicia"], response_model=ProductFranchise)
async def read_product_franchise_by_code(FranquiciaRIF: str, CodigoProducto: int):
    product_franchise = GetController().get_by_id(table_name="ProductosFranquicia", FranquiciaRIF=FranquiciaRIF, CodigoProducto=CodigoProducto)
    if not product_franchise:
        raise HTTPException(status_code=404, detail="Producto Franquicia not found")
    return product_franchise

@router.post("/product_franchise/create", tags=["Producto Franquicia"], response_model=dict)
async def create_product_franchise(productofraq: ProductFranchise):
    return PostController().post_data(table_name="ProductosFranquicia", data={
        "FranquiciaRIF": productofraq.FranquiciaRIF,
        "CodigoProducto": productofraq.CodigoProducto,
        "Precio": productofraq.Precio,
        "Cantidad": productofraq.Cantidad,
        "CantidadMinima": productofraq.CantidadMinima,
        "CantidadMaxima": productofraq.CantidadMaxima
    })


@router.delete("/product_franchise/delete", tags=["Producto Franquicia"], response_model=dict)
async def delete_product_franchise(FranquiciaRIF: str, CodigoProducto: int):
    return DeleteController().delete_data(table_name="ProductosFranquicia", FranquiciaRIF=FranquiciaRIF, CodigoProducto=CodigoProducto)

@router.put("/product_franchise/update", tags=["Producto Franquicia"], response_model=dict)
async def update_product_franchise(productofraq: ProductFranchise):
    return UpdateController().put_data(table_name="ProductosFranquicia", FranquiciaRIF=productofraq.FranquiciaRIF, CodigoProducto=productofraq.CodigoProducto, data={
        "Precio": productofraq.Precio,
        "Cantidad": productofraq.Cantidad,
        "CantidadMinima": productofraq.CantidadMinima,
        "CantidadMaxima": productofraq.CantidadMaxima
    })

" Actividad Endpoints "

@router.get("/activity", tags=["Actividad"], response_model=list[Activity])
async def read_activities():
    return GetController().get_all(table_name="Actividades")

@router.get("/activity/service/{CodigoServicio}", tags=["Actividad"])
async def get_activities_by_service(CodigoServicio: int):
    """
    Get all activities for a specific service
    """
    return GetController().get_activities_by_service(CodigoServicio)

@router.get("/activity/{CodigoServicio}/{NumeroCorrelativoActividad}", tags=["Actividad"], response_model=Activity)
async def read_activity_by_code(CodigoServicio: int, NumeroCorrelativoActividad: int):
    activity = GetController().get_by_id(table_name="Actividades", CodigoServicio=CodigoServicio, NumeroCorrelativoActividad=NumeroCorrelativoActividad)
    if not activity:
        raise HTTPException(status_code=404, detail="Actividad not found")
    return activity

@router.post ("/activity/create", tags=["Actividad"], response_model=dict)
async def create_activity(actividad: Activity):
    return PostController().post_data(table_name="Actividades", data={
        "CodigoServicio": actividad.CodigoServicio,
        "NumeroCorrelativoActividad": actividad.NumeroCorrelativoActividad,
        "DescripcionActividad": actividad.DescripcionActividad
        })

@router.delete("/activity/delete", tags=["Actividad"], response_model=dict)
async def delete_activity(CodigoServicio: int, NumeroCorrelativoActividad: int):
    return DeleteController().delete_data(table_name="Actividades", CodigoServicio=CodigoServicio, NumeroCorrelativoActividad=NumeroCorrelativoActividad)

@router.put("/activity/update", tags=["Actividad"], response_model=dict)
async def update_activity(actividad: Activity):
    return UpdateController().put_data(table_name="Actividades", CodigoServicio=actividad.CodigoServicio, NumeroCorrelativoActividad=actividad.NumeroCorrelativoActividad, data={
        "DescripcionActividad": actividad.DescripcionActividad
    })


" OrderxActivity Endpoints "

@router.get("/orderxactivity", tags=["OrdenxActividad"], response_model=list[OrderxActivity])
async def read_orderxactivities():
    return GetController().get_all(table_name="OrdenesActividades")

@router.get("/orderxactivity/{IDorden}/{CodigoServicio}/{NumeroCorrelativoActividad}", tags=["OrdenxActividad"], response_model=OrderxActivity)
async def read_orderxactivity_by_code(IDorden: int, CodigoServicio: int, NumeroCorrelativoActividad: int):
    orderxactivity = GetController().get_by_id(table_name="OrdenesActividades", IDorden=IDorden, CodigoServicio=CodigoServicio, NumeroCorrelativoActividad=NumeroCorrelativoActividad)
    if not orderxactivity:
        raise HTTPException(status_code=404, detail="OrdenxActividad not found")
    return orderxactivity

@router.post("/orderxactivity/create", tags=["OrdenxActividad"], response_model=dict)
async def create_orderxactivity(IDorden: int, CodigoServicio: int, NumeroCorrelativoActividad: int):
    return PostController().post_data(table_name="OrdenesActividades", data={
        "IDorden": IDorden,
        "CodigoServicio": CodigoServicio,
        "NumeroCorrelativoActividad": NumeroCorrelativoActividad,

        })

@router.get("/orderxactivity/order/{IDorden}", tags=["OrdenxActividad"])
async def get_activities_by_order(IDorden: int):
    """
    Devuelve todas las actividades (servicio y actividad) de una orden específica.
    """
    return GetController().get_activities_by_order(IDorden)

@router.put("/orderxactivity/{IDorden}/{CodigoServicio}/{NumeroCorrelativoActividad}", tags=["OrdenxActividad"])
async def update_orderxactivity(IDorden: int, CodigoServicio: int, NumeroCorrelativoActividad: int, data: dict = Body(...)):
    """
    Actualiza el costo de la mano de obra (Costo_Act) de una actividad de orden.
    """
    if "Costo_Act" not in data:
        raise HTTPException(status_code=400, detail="Costo_Act es requerido")
    return UpdateController().put_data(
        table_name="OrdenesActividades",
        IDorden=IDorden,
        CodigoServicio=CodigoServicio,
        NumeroCorrelativoActividad=NumeroCorrelativoActividad,
        data={"Costo_Act": data["Costo_Act"]}
    )

"Pagos Endpoints"

@router.get("/pays", tags=["Pagos"], response_model=list[Pay])
async def read_pays():
    return GetController().get_all(table_name="Pagos")

@router.get("/pays/{numero_factura}/{numero_correlativo_pago}", tags=["Pagos"], response_model=Pay)
async def read_pay_by_code(numero_factura: int, numero_correlativo_pago: int):
    pay = GetController().get_by_id(table_name="Pagos", NumeroFactura=numero_factura, NumeroCorrelativoPago=numero_correlativo_pago)
    if not pay:
        raise HTTPException(status_code=404, detail="Pago not found")
    return pay

@router.post("/pays/create", tags=["Pagos"], response_model=dict)
async def create_pay(pago: Pay):
    return PostController().post_data(table_name="Pagos", data={
        "NumeroFactura": pago.NumeroFactura,
        "NumeroCorrelativoPago": pago.NumeroCorrelativoPago,
        "Tipo": pago.Tipo,
        "FechaTarjeta": pago.FechaTarjeta,
        "MontoTarjeta": pago.MontoTarjeta,
        "BancoTarjeta": pago.BancoTarjeta,
        "ModalidadTarjeta": pago.ModalidadTarjeta,
        "NumeroTarjeta": pago.NumeroTarjeta,
        "MontoEfectivo": pago.MontoEfectivo,
        "FechaPagoMovil": pago.FechaPagoMovil,
        "TelefonoPagoMovil": pago.TelefonoPagoMovil,
        "ReferenciaPagoMovil": pago.ReferenciaPagoMovil,
        "MontoPagoMovil": pago.MontoPagoMovil
        })


"Endpoints para TelefonosCliente"

@router.get("/customer_phone", tags=["TelefonosCliente"], response_model=list[CustomerPhone])
async def read_customer_phone():
    return GetController().get_all(table_name="TelefonosClientes")

@router.get("/customer_phone/{cliente}/{telefono}", tags=["TelefonosCliente"], response_model=CustomerPhone)
async def read_customer_phone_by_code(cliente: int):
    customer_phone = GetController().get_by_id(table_name="TelefonosClientes", Cliente=cliente)
    if not customer_phone:
        raise HTTPException(status_code=404, detail="TelefonoCliente not found")
    return customer_phone

@router.post("/customer_phone/create", tags=["TelefonosCliente"], response_model=dict)
async def create_customer_phone(telefonoclient: CustomerPhone):
    return PostController().post_data(table_name="TelefonosClientes", data={
        "Cliente": telefonoclient.Cliente,
        "Telefono": telefonoclient.Telefono
        })

@router.delete("/customer_phone/delete")
async def delete_customer_phone(Cliente: str, Telefono: str):
    return DeleteController().delete_data(table_name="TelefonosClientes", data={
        "Cliente": Cliente,
        "Telefono": Telefono
    })

@router.put("/customer_phone/update", tags=["TelefonosCliente"], response_model=dict)
async def update_customer_phone(Cliente: str, Telefono: str, NuevoTelefono: str):
    return UpdateController().put_data(table_name="TelefonosClientes", Cliente=Cliente, Telefono=Telefono, data={
        "Telefono": NuevoTelefono,
    })


"Endpoints para EmpleadosOrden"

@router.get("/employee_order", tags=["EmpleadosOrden"], response_model=list[EmployeeOrder])
async def read_employee_order():
    return GetController().get_all(table_name="EmpleadosOrdenes")

@router.get("/employee_order/count_emp", tags=["EmpleadosOrden"])
async def read_employee_order_count_emp(EmpleadoCI: str):
    return GetController().count_by_franchise(table_name="EmpleadosOrdenes", EmpleadoCI=EmpleadoCI)

@router.get("/employee_order/{empleado_ci}/{codigo_orden}", tags=["EmpleadosOrden"], response_model=EmployeeOrder)
async def read_employee_order_by_code(empleado_ci: str, codigo_orden: int):
    empleado_orden = GetController().get_by_id(table_name="EmpleadosOrdenes", EmpleadoCI=empleado_ci, OrdenServicioID=codigo_orden)
    if not empleado_orden:
        raise HTTPException(status_code=404, detail="EmpleadoOrden not found")
    return empleado_orden

@router.post("/employee_order/create", tags=["EmpleadosOrden"], response_model=dict)
async def create_employee_order(empleadoorden: EmployeeOrder):
    return PostController().post_data(table_name="EmpleadosOrdenes", data={
        "EmpleadoCI": empleadoorden.EmpleadoCI,
        "OrdenServicioID": empleadoorden.OrdenServicioID
    })


" Endpoints para EspecialidadEmpleado  "

@router.get("/specialty_employee", tags=["EspecialidadEmpleado"], response_model=list[SpecialtyEmployee])
async def read_specialty_employee():
    return GetController().get_all(table_name="EspecialidadesEmpleados")

@router.get("/specialty_employee/{empleado_ci}/{codigo_especialidad}", tags=["EspecialidadEmpleado"], response_model=SpecialtyEmployee)
async def read_specialty_employee_by_code(empleado_ci: str, codigo_especialidad: int):
    specialty_employee = GetController().get_by_id(table_name="EspecialidadesEmpleados", EmpleadoCI=empleado_ci, CodigoEspecialidad=codigo_especialidad)
    if not specialty_employee:
        raise HTTPException(status_code=404, detail="EspecialidadEmpleado not found")
    return specialty_employee

@router.post("/speciality_employee", tags=["EspecialidadEmpleado"], response_model=dict)
async def create_specialty_employee(especialidademp: SpecialtyEmployee):
    return PostController().post_data(table_name="EspecialidadesEmpleados", data={
        "EmpleadoCI": especialidademp.EmpleadoCI,
        "CodigoEspecialidad": especialidademp.CodigoEspecialidad
        })

@router.delete("/speciality_employee/delete", tags=["EspecialidadEmpleado"])
async def delete_specialty_employee(EmpleadoCI: str, CodigoEspecialidad: int):
    return DeleteController().delete_data(table_name="EspecialidadesEmpleados", EmpleadoCI=EmpleadoCI, CodigoEspecialidad=CodigoEspecialidad)

"Endpoints para MantenimientoVehiculos"

@router.get("/vehicle_maintenances", tags=["Mantenimiento de Vehículos"], response_model=list[VehicleMaintenance])
async def get_vehicle_maintenances():
    return GetController().get_all(table_name="MantenimientosVehiculos")

@router.get("/vehicle_maintenances/{vehiculo}/{fecha_mantenimiento}", tags=["Mantenimiento de Vehículos"], response_model=VehicleMaintenance)
async def get_vehicle_maintenance_by_code(vehiculo: int, fecha_mantenimiento: str):
    vehicle_maintenance = GetController().get_by_id(table_name="MantenimientosVehiculos", Vehiculo=vehiculo, FechaMantenimiento=fecha_mantenimiento)
    if not vehicle_maintenance:
        raise HTTPException(status_code=404, detail="Mantenimiento de Vehículo not found")
    return vehicle_maintenance

@router.post("/vehicle_maintenances/create", tags=["Mantenimiento de Vehículos"], response_model=dict)
async def create_vehicle_maintenance(Vehiculo: int, FechaMantenimiento: str, DescripcionMantenimiento: str):
    return PostController().post_data(table_name="MantenimientosVehiculos", data={
        "Vehiculo": Vehiculo,
        "FechaMantenimiento": FechaMantenimiento,
        "DescripcionMantenimiento": DescripcionMantenimiento
        })

@router.delete("/vehicle_maintenances/delete", tags=["Mantenimiento de Vehículos"], response_model=dict)
async def delete_vehicle_maintenance(Vehiculo: int, FechaMantenimiento: str):
    return DeleteController().delete_data(table_name="MantenimientosVehiculos", Vehiculo=Vehiculo, FechaMantenimiento=FechaMantenimiento)


"Endpoints para ResponsabilidadEmpleado"

@router.get("/employee_responsibilities", tags=["Responsabilidad de Empleados"], response_model=list[EmployeeResponsibility])
async def get_employee_responsibilities():
    return GetController().get_all(table_name="ResponsabilidadesEmpleados")

@router.get("/employee_responsibilities/{empleado_ci}/{codigo_servicio}", tags=["Responsabilidad de Empleados"], response_model=EmployeeResponsibility)
async def get_employee_responsibility_by_code(empleado_ci: str, codigo_servicio: int):
    employee_responsibility = GetController().get_by_id(table_name="ResponsabilidadesEmpleados", EmpleadoCI=empleado_ci, CodigoServicio=codigo_servicio)
    if not employee_responsibility:
        raise HTTPException(status_code=404, detail="Responsabilidad de Empleado not found")
    return employee_responsibility

@router.post("/employee_responsibilities/create", tags=["Responsabilidad de Empleados"], response_model=dict)
async def create_employee_responsibility(empleadores: EmployeeResponsibility):
    return PostController().post_data(table_name="ResponsabilidadesEmpleados", data={
        "EmpleadoCI": empleadores.EmpleadoCI,
        "CodigoServicio": empleadores.CodigoServicio
        })

@router.delete("/employee_responsibilities/delete", tags=["Responsabilidad de Empleados"], response_model=dict)
async def delete_employee_responsibility(EmpleadoCI: str, CodigoServicio: int):
    return DeleteController().delete_data(table_name="ResponsabilidadesEmpleados", EmpleadoCI=EmpleadoCI, CodigoServicio=CodigoServicio)

"Endpoints para ServiciosFranquicia"

@router.get("/franchise_services", tags=["Servicios de Franquicia"], response_model=list[FranchiseServiceLink])
async def get_franchise_services():
    return GetController().get_all(table_name="ServiciosFranquicias")

@router.get("/franchise_services/{franquicia_rif}/{codigo_servicio}", tags=["Servicios de Franquicia"], response_model=FranchiseServiceLink)
async def get_franchise_service_by_code(franquicia_rif: str, codigo_servicio: int):
    franchise_service = GetController().get_by_id(table_name="ServiciosFranquicias", FranquiciaRIF=franquicia_rif, CodigoServicio=codigo_servicio)
    if not franchise_service:
        raise HTTPException(status_code=404, detail="Servicio de Franquicia not found")
    return franchise_service

@router.post("/franchise_services/create", tags=["Servicios de Franquicia"], response_model=dict)
async def create_new_franchise_service(franqservice: FranchiseServiceLink):
    return PostController().post_data(table_name="ServiciosFranquicias", data={
        "FranquiciaRIF": franqservice.FranquiciaRIF,
        "CodigoServicio": franqservice.CodigoServicio
    })

@router.delete("/franchise_services/delete", tags=["Servicios de Franquicia"], response_model=dict)
async def delete_franchise_service_by_id(FranquiciaRIF: str, CodigoServicio: int):
    return DeleteController().delete_data(table_name="ServiciosFranquicias", FranquiciaRIF=FranquiciaRIF, CodigoServicio=CodigoServicio)

" Correction Endpoints "

@router.get("/correction", tags=["Correccion de Inventario"], response_model=list[Correction])
async def read_corrections():
    return GetController().get_all(table_name="Correcciones")

@router.get("/correction/check/{FranquiciaRIF}/{CodigoProducto}", tags=["Correccion de Inventario"])
async def check_correction_exists(FranquiciaRIF: str, CodigoProducto: int):
    """
    Check if a product has already been corrected in the current month and year
    """
    return GetController().check_correction_exists(FranquiciaRIF, CodigoProducto)

@router.get("/correction/franchise/{FranquiciaRIF}/history", tags=["Correccion de Inventario"])
async def get_correction_history(FranquiciaRIF: str, mes: Optional[int] = None, anio: Optional[int] = None):
    """
    Get correction history for a franchise, optionally filtered by month and year
    """
    return GetController().get_correction_history(FranquiciaRIF, mes, anio)

@router.get("/correction/{FranquiciaRIF}/{CodigoProducto}/{FechaCorreccion}", tags=["Correccion de Inventario"], response_model=Correction)
async def read_correction_by_code(FranquiciaRIF: str, CodigoProducto: int, FechaCorreccion: str):
    correction = GetController().get_by_id(table_name="Correcciones", FranquiciaRIF=FranquiciaRIF, CodigoProducto=CodigoProducto, FechaCorreccion=FechaCorreccion)
    if not correction:
        raise HTTPException(status_code=404, detail="Correccion not found")
    return correction

@router.post("/correction/create", tags=["Correccion de Inventario"], response_model=dict)
async def create_correction(correccion: Correction):
    current_date = date.today().isoformat()
    return PostController().post_data(table_name="Correcciones", data={
        "FranquiciaRIF": correccion.FranquiciaRIF,
        "CodigoProducto": correccion.CodigoProducto,
        "FechaCorreccion": current_date,
        "Cantidad": correccion.Cantidad,
        "TipoAjuste": correccion.TipoAjuste,
        "Comentario": correccion.Comentario
        })

@router.post("/correction/create_with_inventory", tags=["Correccion de Inventario"], response_model=dict)
async def create_correction_with_inventory(correction_data: dict):
    """
    Create a correction and update inventory in a single transaction
    correction_data should contain:
    - FranquiciaRIF: string
    - CodigoProducto: int
    - Cantidad: int
    - TipoAjuste: string
    - Comentario: string
    """
    return PostController().create_correction_with_inventory(correction_data)


" Suministro Endpoints "

@router.get("/supply", tags=["Suministro"], response_model=list[Supply])
async def read_supplies():
    return GetController().get_all(table_name="Suministros")

@router.get("/supply/vendor/{ProveedorRIF}", tags=["Suministro"])
async def get_products_by_vendor(ProveedorRIF: str):
    """
    Get all products that a specific vendor supplies
    """
    return GetController().get_products_by_vendor(ProveedorRIF)

@router.get("/supply/{ProveedorRIF}/{CodigoProducto}", tags=["Suministro"], response_model=Supply)
async def read_supply_by_code(ProveedorRIF: str, CodigoProducto: int):
    supply = GetController().get_by_id(table_name="Suministros", ProveedorRIF=ProveedorRIF, CodigoProducto=CodigoProducto)
    if not supply:
        raise HTTPException(status_code=404, detail="Suministro not found")
    return supply

@router.post("/supply/create", tags=["Suministro"], response_model=dict)
async def create_supply(suministro: Supply):
    return PostController().post_data(table_name="Suministros", data={
        "ProveedorRIF": suministro.ProveedorRIF,
        "CodigoProducto": suministro.CodigoProducto
        })

@router.delete("/supply/delete", tags=["Suministro"], response_model=dict)
async def delete_supply(ProveedorRIF: str, CodigoProducto: int):
    return DeleteController().delete_data(table_name="Suministros", ProveedorRIF=ProveedorRIF, CodigoProducto=CodigoProducto)

@router.put("/supply/update", tags=["Suministro"], response_model=dict)
async def update_supply(ProveedorRIF: str, CodigoProducto: int, NuevoProveedorRIF: str):
    return UpdateController().put_data(table_name="Suministros", ProveedorRIF=ProveedorRIF, CodigoProducto=CodigoProducto, data={
        "ProveedorRIF": NuevoProveedorRIF,
    })

" AumentoInventario Endpoints "

@router.get("/inventory_increase", tags=["Aumento de Inventario"], response_model=list[InventoryIncrease])
async def read_inventory_increases():
    return GetController().get_all(table_name="AumentosInventario")

@router.get("/inventory_increase/{NumeroCompra}/{FranquiciaRIF}/{CodigoProducto}", tags=["Aumento de Inventario"], response_model=InventoryIncrease)
async def read_inventory_increase_by_code(NumeroCompra: int, FranquiciaRIF: str, CodigoProducto: int):
    inventory_increase = GetController().get_by_id(table_name="AumentosInventario", NumeroCompra=NumeroCompra, FranquiciaRIF=FranquiciaRIF, CodigoProducto=CodigoProducto)
    if not inventory_increase:
        raise HTTPException(status_code=404, detail="Aumento de Inventario not found")
    return inventory_increase

@router.post("/inventory_increase/create", tags=["Aumento de Inventario"], response_model=dict)
async def create_inventory_increase(aumentainv: InventoryIncrease):
    return PostController().post_data(table_name="AumentosInventario", data={
        "NumeroCompra": aumentainv.NumeroCompra,
        "FranquiciaRIF": aumentainv.FranquiciaRIF,
        "CodigoProducto": aumentainv.CodigoProducto,
        "CantidadPedida": aumentainv.CantidadPedida,
        "CantidadDisponible": aumentainv.CantidadDisponible,
        "Monto": aumentainv.Monto
        })


" Servicios Franquicia Endpoints "

@router.get("/franchise_service", tags=["Servicios Franquicia"], response_model=list[FranchiseServices])
async def read_franchise_services():
    return GetController().get_all(table_name="ServiciosFranquicias")

@router.get("/franchise_service/{FranquiciaRIF}/{CodigoServicio}", tags=["Servicios Franquicia"], response_model=FranchiseServices)
async def read_franchise_service_by_code(FranquiciaRIF: str, CodigoServicio: int):
    franchise_service = GetController().get_by_id(table_name="ServiciosFranquicias", FranquiciaRIF=FranquiciaRIF, CodigoServicio=CodigoServicio)
    if not franchise_service:
        raise HTTPException(status_code=404, detail="Servicio Franquicia not found")
    return franchise_service

@router.post("/franchise_servive/create", tags=["Servicios Franquicia"], response_model=dict)
async def create_franchise_service(franqservice: FranchiseServices):
    return PostController().post_data(table_name="ServiciosFranquicias", data={
        "FranquiciaRIF": franqservice.FranquiciaRIF,
        "CodigoServicio": franqservice.CodigoServicio
        })

@router.delete("/franchise_service/delete", tags=["Servicios Franquicia"], response_model=dict)
async def delete_franchise_service(FranquiciaRIF: str, CodigoServicio: int):
    return DeleteController().delete_data(table_name="ServiciosFranquicias", data={
        "FranquiciaRIF": FranquiciaRIF,
        "CodigoServicio": CodigoServicio
        })


" Producto Orden de Servicio Endpoints "

@router.get("/product_service_order", tags=["Productos Orden Servicio"], response_model=list[ProductServiceOrder])
async def read_product_service_orders():
    return GetController().get_all(table_name="ProductosOrdenesServicio")

@router.get("/product_service_order/{CodigoOrdenServicio}/{CodigoServicio}/{NumeroCorrelativoActividad}/{FranquiciaRIF}/{CodigoProducto}", tags=["Productos Orden Servicio"], response_model=ProductServiceOrder)
async def read_product_service_order_by_code(CodigoOrdenServicio: int, CodigoServicio: int, NumeroCorrelativoActividad: int, FranquiciaRIF: str, CodigoProducto: int):
    product_service_order = GetController().get_by_id(table_name="ProductosOrdenesServicio", CodigoOrdenServicio=CodigoOrdenServicio, CodigoServicio=CodigoServicio, NumeroCorrelativoActividad=NumeroCorrelativoActividad, FranquiciaRIF=FranquiciaRIF, CodigoProducto=CodigoProducto)
    if not product_service_order:
        raise HTTPException(status_code=404, detail="Producto Orden Servicio not found")
    return product_service_order

@router.post("/product_service_order/create", tags=["Productos Orden Servicio"], response_model=dict)
async def create_product_service_order(productords:  ProductServiceOrder):
    return PostController().post_data(table_name="ProductosOrdenesServicio", data={
        "CodigoOrdenServicio": productords.CodigoOrdenServicio,
        "CodigoServicio": productords.CodigoServicio,
        "NumeroCorrelativoActividad": productords.NumeroCorrelativoActividad,
        "FranquiciaRIF": productords.FranquiciaRIF,
        "CodigoProducto": productords.CodigoProducto,
        "CantidadUtilizada": productords.CantidadUtilizada,
        "PrecioProducto": productords.PrecioProducto
        })

" Vistas Endpoint "

@router.get("/views/remenfranq", tags=["Vistas"])
async def read_remenfranq(FranquiciaRIF: str, Anio: str, Mes: str):
    rows = GetController().get_by_view(table_name="Vista_ResumenMensualFranquiciaSimple", FranquiciaRIF=FranquiciaRIF, Anio=Anio, Mes=Mes)
    # Si rows es una lista de tuplas, conviértelo a lista de dicts
    columns = ["FranquiciaRIF", "Anio", "Mes", "CantidadOrdenes", "MontoGenerado", "GastoTotal"]
    result = [dict(zip(columns, row)) for row in rows]
    return result

