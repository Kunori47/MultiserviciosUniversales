from db.database import database, conn
from models import *
from fastapi import UploadFile, HTTPException
from typing import Optional

class GetService:

    def getAll(self, table_name: str):
        try:
            database.execute(f"SELECT * FROM {table_name}")
            data = database.fetchall()
            return data
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching data from {table_name}: {str(e)}")
        
    def getDataById(self, table_name: str, **filters):
        
        where_clause = " AND ".join([f"{key} = ?" for key in filters.keys()])
        values = tuple(filters.values())
        try:
            database.execute(f"SELECT * FROM {table_name} WHERE {where_clause}", values)
            data = database.fetchone()
            if not data:
                raise HTTPException(status_code=404, detail=f"No data found in {table_name} with provided {filters}")
            return data
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching data from {table_name}: {str(e)}")
        
    def getDataByFilter(self, table_name: str, **filters):
        where_clause = " AND ".join([f"{key} = ?" for key in filters.keys()])
        values = tuple(filters.values())
        try:
            database.execute(f"SELECT * FROM {table_name} WHERE {where_clause}", values)
            data = database.fetchall()
            if not data:
                raise HTTPException(status_code=404, detail=f"No data found in {table_name} with provided {filters}")
            return data
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching data from {table_name}: {str(e)}")
        
    def getDataByView(self, table_name: str, **filters):
        where_clause = " AND ".join([f"{key} = ?" for key in filters.keys()])
        values = tuple(filters.values())
        try:
            database.execute(f"SELECT * FROM {table_name} WHERE {where_clause}", values)
            data = database.fetchall()
            if not data:
                raise HTTPException(status_code=404, detail=f"No data found in {table_name} with provided {filters}")
            return data
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching data from {table_name}: {str(e)}")
        

    def searchDataEmployee(self, table_name: str, query: str):
    
        try:
            database.execute(f"SELECT TOP 10 CI, NombreCompleto FROM {table_name} WHERE CI LIKE ?", f'%{query}%')
            columns = [column[0] for column in database.description]
            results = [dict(zip(columns, row)) for row in database.fetchall()]
            return results
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error searching data in {table_name}: {str(e)}")
        
    def searchDataFranchise(self, table_name: str, query: str):
        try:
            database.execute(f"SELECT TOP 10 * FROM {table_name} WHERE RIF LIKE ?", f'%{query}%')
            columns = [column[0] for column in database.description]
            results = [dict(zip(columns, row)) for row in database.fetchall()]
            return results
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error searching data in {table_name}: {str(e)}")
        
    def searchDataFilters(self, table_name: str, q: str, **filters):
        try:
            where_clause = " AND ".join([f"{key} = ?" for key in filters.keys()])
            values = tuple(filters.values())
            database.execute(f"SELECT * FROM {table_name} WHERE {where_clause} AND CI LIKE ?", values + (f'%{q}%',))
            columns = [column[0] for column in database.description]
            results = [dict(zip(columns, row)) for row in database.fetchall()]
            return results
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error searching data in {table_name}: {str(e)}")

    def searchDataSupplierLines(self, table_name: str, query: str):
        try:
            database.execute(f"SELECT TOP 10 * FROM {table_name} WHERE DescripcionLinea LIKE ?", f'%{query}%')
            columns = [column[0] for column in database.description]
            results = [dict(zip(columns, row)) for row in database.fetchall()]
            return results
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error searching data in {table_name}: {str(e)}")

    def searchDataVendors(self, table_name: str, query: str):
        try:
            database.execute(f"SELECT TOP 10 * FROM {table_name} WHERE RazonSocial LIKE ?", f'%{query}%')
            columns = [column[0] for column in database.description]
            results = [dict(zip(columns, row)) for row in database.fetchall()]
            return results
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error searching data in {table_name}: {str(e)}")

    def searchDataMaintenancePlans(self, table_name: str, query: str):
        try:
            database.execute(f"SELECT TOP 10 * FROM {table_name} WHERE DescripcionMantenimiento LIKE ?", f'%{query}%')
            columns = [column[0] for column in database.description]
            results = [dict(zip(columns, row)) for row in database.fetchall()]
            return results
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error searching data in {table_name}: {str(e)}")

    def searchDataBrands(self, table_name: str, query: str):
        try:
            database.execute(f"SELECT TOP 10 * FROM {table_name} WHERE Nombre LIKE ?", f'%{query}%')
            columns = [column[0] for column in database.description]
            results = [dict(zip(columns, row)) for row in database.fetchall()]
            return results
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error searching data in {table_name}: {str(e)}")

    def searchDataModels(self, table_name: str, query: str):
        try:
            database.execute(f"SELECT TOP 10 * FROM {table_name} WHERE DescripcionModelo LIKE ?", f'%{query}%')
            columns = [column[0] for column in database.description]
            results = [dict(zip(columns, row)) for row in database.fetchall()]
            return results
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error searching data in {table_name}: {str(e)}")

    def searchDataSpecialties(self, table_name: str, query: str):
        try:
            database.execute(f"SELECT TOP 10 * FROM {table_name} WHERE DescripcionEspecialidad LIKE ?", f'%{query}%')
            columns = [column[0] for column in database.description]
            results = [dict(zip(columns, row)) for row in database.fetchall()]
            return results
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error searching data in {table_name}: {str(e)}")

    def searchDataServices(self, table_name: str, query: str):
        try:
            database.execute(f"SELECT TOP 10 * FROM {table_name} WHERE NombreServicio LIKE ?", f'%{query}%')
            columns = [column[0] for column in database.description]
            results = [dict(zip(columns, row)) for row in database.fetchall()]
            return results
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error searching data in {table_name}: {str(e)}")

    def countData(self, table_name: str):
        try:
            database.execute(f"SELECT COUNT(*) FROM {table_name}")
            data = database.fetchone()
            return data[0] if data else 0
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error counting data in {table_name}: {str(e)}")
        
    def countDistinctData(self, table_name: str, column_name: str):
        try:
            database.execute(f"SELECT COUNT(DISTINCT {table_name}.{column_name}) FROM {table_name}")
            data = database.fetchone()
            return data[0] if data else 0
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error counting distinct data in {table_name}: {str(e)}")
        
    def countDistinctDataByFranchise(self, table_name: str, column_name: str, **filters):
        where_clause = " AND ".join([f"{key} = ?" for key in filters.keys()])
        values = tuple(filters.values())
        try:
            database.execute(f"SELECT COUNT(DISTINCT {table_name}.{column_name}) FROM {table_name} WHERE {where_clause}", values)
            data = database.fetchone()
            return data[0] if data else 0
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error counting distinct data in {table_name}: {str(e)}")
        

    def countDataByFranchise(self, table_name: str, **filters):
        where_clause = " AND ".join([f"{key} = ?" for key in filters.keys()])
        values = tuple(filters.values())
        try:
            database.execute(f"SELECT COUNT(*) FROM {table_name} WHERE {where_clause}", values)
            data = database.fetchone()
            return data[0] if data else 0
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error counting data in {table_name}: {str(e)}")
        
    def getInventoryByFranchise(self, franquicia_rif: str):
        try:
            database.execute("""
                SELECT 
                    pf.FranquiciaRIF,
                    pf.CodigoProducto,
                    p.NombreProducto,
                    pf.Cantidad,
                    pf.Precio,
                    pf.CantidadMinima,
                    pf.CantidadMaxima,
                    p.LineaSuministro,
                    ls.DescripcionLinea as Categoria
                FROM ProductosFranquicia pf
                INNER JOIN Productos p ON pf.CodigoProducto = p.CodigoProducto
                INNER JOIN LineasSuministro ls ON p.LineaSuministro = ls.CodigoLinea
                WHERE pf.FranquiciaRIF = ?
            """, (franquicia_rif,))
            
            columns = [column[0] for column in database.description]
            results = [dict(zip(columns, row)) for row in database.fetchall()]
            return results
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching inventory: {str(e)}")
    
    def searchInventoryByFranchise(self, franquicia_rif: str, query: str):
        try:
            database.execute("""
                SELECT 
                    pf.FranquiciaRIF,
                    pf.CodigoProducto,
                    p.NombreProducto,
                    pf.Cantidad,
                    pf.Precio,
                    pf.CantidadMinima,
                    pf.CantidadMaxima,
                    p.LineaSuministro,
                    ls.DescripcionLinea as Categoria
                FROM ProductosFranquicia pf
                INNER JOIN Productos p ON pf.CodigoProducto = p.CodigoProducto
                INNER JOIN LineasSuministro ls ON p.LineaSuministro = ls.CodigoLinea
                WHERE pf.FranquiciaRIF = ? 
                AND (p.NombreProducto LIKE ? OR CAST(pf.CodigoProducto AS VARCHAR) LIKE ?)
            """, (franquicia_rif, f'%{query}%', f'%{query}%'))
            
            columns = [column[0] for column in database.description]
            results = [dict(zip(columns, row)) for row in database.fetchall()]
            return results
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error searching inventory: {str(e)}")
    
    def getProductByFranchiseAndCode(self, franquicia_rif: str, codigo_producto: int):
        try:
            database.execute("""
                SELECT 
                    pf.FranquiciaRIF,
                    pf.CodigoProducto,
                    p.NombreProducto,
                    pf.Cantidad,
                    pf.Precio,
                    pf.CantidadMinima,
                    pf.CantidadMaxima,
                    p.LineaSuministro,
                    ls.DescripcionLinea as Categoria
                FROM ProductosFranquicia pf
                INNER JOIN Productos p ON pf.CodigoProducto = p.CodigoProducto
                INNER JOIN LineasSuministro ls ON p.LineaSuministro = ls.CodigoLinea
                WHERE pf.FranquiciaRIF = ? AND pf.CodigoProducto = ?
            """, (franquicia_rif, codigo_producto))
            
            columns = [column[0] for column in database.description]
            result = database.fetchone()
            if not result:
                raise HTTPException(status_code=404, detail="Product not found in franchise inventory")
            return dict(zip(columns, result))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching product: {str(e)}")
    
    def getOrdersByFranchise(self, franquicia_rif: str, mes: Optional[int] = None, anio: Optional[int] = None, estado: Optional[str] = None):
        try:
            query = """
                SELECT DISTINCT
                    os.ID as NumeroOrden,
                    os.FechaEntrada as FechaOrden,
                    os.HoraEntrada,
                    os.FechaSalidaEstimada,
                    os.HoraSalidaEstimada,
                    os.FechaSalidaReal,
                    os.HoraSalidaReal,
                    os.Comentario,
                    os.CodigoVehiculo,
                    c.CI as CI_Cliente,
                    c.NombreCompleto as NombreCliente,
                    CASE 
                        WHEN os.FechaSalidaReal IS NOT NULL THEN 'Completado'
                        ELSE 'En Proceso'
                    END as Estado
                FROM EmpleadosOrdenes eo
                INNER JOIN OrdenesServicio os ON eo.OrdenServicioID = os.ID
                INNER JOIN Empleados e ON eo.EmpleadoCI = e.CI
                INNER JOIN Vehiculos v ON os.CodigoVehiculo = v.CodigoVehiculo
                INNER JOIN Clientes c ON v.CedulaCliente = c.CI
                WHERE e.FranquiciaRIF = ?
            """
            params = [franquicia_rif]
            
            if mes is not None and anio is not None:
                query += " AND MONTH(os.FechaEntrada) = ? AND YEAR(os.FechaEntrada) = ?"
                params.extend([str(mes), str(anio)])
            
            if estado is not None:
                if estado == "Completado":
                    query += " AND os.FechaSalidaReal IS NOT NULL"
                elif estado == "En Proceso":
                    query += " AND os.FechaSalidaReal IS NULL"
            
            query += " ORDER BY os.FechaEntrada DESC"
            
            database.execute(query, params)
            
            columns = [column[0] for column in database.description]
            results = [dict(zip(columns, row)) for row in database.fetchall()]
            return results
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching orders: {str(e)}")

    def getOrdersStatsByFranchise(self, franquicia_rif: str, mes: Optional[int] = None, anio: Optional[int] = None):
        try:
            query = """
                SELECT 
                    COUNT(DISTINCT os.ID) as TotalOrdenes,
                    COUNT(DISTINCT CASE WHEN os.FechaSalidaReal IS NOT NULL THEN os.ID END) as OrdenesCompletadas,
                    COUNT(DISTINCT CASE WHEN os.FechaSalidaReal IS NULL THEN os.ID END) as OrdenesEnProceso
                FROM EmpleadosOrdenes eo
                INNER JOIN OrdenesServicio os ON eo.OrdenServicioID = os.ID
                INNER JOIN Empleados e ON eo.EmpleadoCI = e.CI
                WHERE e.FranquiciaRIF = ?
            """
            params = [franquicia_rif]
            
            if mes is not None and anio is not None:
                query += " AND MONTH(os.FechaEntrada) = ? AND YEAR(os.FechaEntrada) = ?"
                params.extend([str(mes), str(anio)])
            
            database.execute(query, params)
            
            columns = [column[0] for column in database.description]
            result = database.fetchone()
            if not result:
                return {"TotalOrdenes": 0, "OrdenesCompletadas": 0, "OrdenesEnProceso": 0}
            return dict(zip(columns, result))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching order stats: {str(e)}")

    def getOrderDetails(self, franquicia_rif: str, numero_orden: int):
        try:
            # Get order information
            order_query = """
                SELECT DISTINCT
                    os.ID as NumeroOrden,
                    os.FechaEntrada as FechaOrden,
                    os.HoraEntrada,
                    os.FechaSalidaEstimada,
                    os.HoraSalidaEstimada,
                    os.FechaSalidaReal,
                    os.HoraSalidaReal,
                    os.Comentario,
                    os.CodigoVehiculo,
                    c.CI as CI_Cliente,
                    c.NombreCompleto as NombreCliente,
                    v.Placa,
                    CASE 
                        WHEN os.FechaSalidaReal IS NOT NULL THEN 'Completado'
                        ELSE 'En Proceso'
                    END as Estado
                FROM EmpleadosOrdenes eo
                INNER JOIN OrdenesServicio os ON eo.OrdenServicioID = os.ID
                INNER JOIN Empleados e ON eo.EmpleadoCI = e.CI
                INNER JOIN Vehiculos v ON os.CodigoVehiculo = v.CodigoVehiculo
                INNER JOIN Clientes c ON v.CedulaCliente = c.CI
                WHERE e.FranquiciaRIF = ? AND os.ID = ?
            """
            
            database.execute(order_query, (franquicia_rif, numero_orden))
            order_result = database.fetchone()
            
            if not order_result:
                raise HTTPException(status_code=404, detail="Orden de servicio not found")
            
            order_columns = [column[0] for column in database.description]
            order_info = dict(zip(order_columns, order_result))
            
            # Get employees who worked on this order
            employees_query = """
                SELECT DISTINCT
                    e.CI,
                    e.NombreCompleto,
                    e.Rol,
                    e.Telefono
                FROM EmpleadosOrdenes eo
                INNER JOIN Empleados e ON eo.EmpleadoCI = e.CI
                WHERE eo.OrdenServicioID = ? AND e.FranquiciaRIF = ?
                ORDER BY e.NombreCompleto
            """
            
            database.execute(employees_query, (numero_orden, franquicia_rif))
            employees_columns = [column[0] for column in database.description]
            employees = [dict(zip(employees_columns, row)) for row in database.fetchall()]
            
            # Get products used in this order
            products_query = """
                SELECT 
                    pos.CodigoServicio,
                    pos.NumeroCorrelativoActividad,
                    pos.FranquiciaRIF,
                    pos.CodigoProducto,
                    pos.CantidadUtilizada,
                    pos.PrecioProducto,
                    prod.NombreProducto,
                    prod.DescripcionProducto,
                    ls.DescripcionLinea as Categoria,
                    s.NombreServicio,
                    a.DescripcionActividad
                FROM ProductosOrdenesServicio pos
                INNER JOIN Productos prod ON pos.CodigoProducto = prod.CodigoProducto
                INNER JOIN LineasSuministro ls ON prod.LineaSuministro = ls.CodigoLinea
                INNER JOIN Servicios s ON pos.CodigoServicio = s.CodigoServicio
                INNER JOIN Actividades a ON pos.CodigoServicio = a.CodigoServicio AND pos.NumeroCorrelativoActividad = a.NumeroCorrelativoActividad
                WHERE pos.CodigoOrdenServicio = ? AND pos.FranquiciaRIF = ?
                ORDER BY s.NombreServicio, a.NumeroCorrelativoActividad, prod.NombreProducto
            """
            
            database.execute(products_query, (numero_orden, franquicia_rif))
            products_columns = [column[0] for column in database.description]
            products = [dict(zip(products_columns, row)) for row in database.fetchall()]
            
            return {
                "order": order_info,
                "employees": employees,
                "products": products
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching order details: {str(e)}")

    def getInvoicesByFranchise(self, franquicia_rif: str, mes: Optional[int] = None, anio: Optional[int] = None):
        try:
            query = """
                SELECT DISTINCT
                    f.NumeroFactura,
                    f.FechaEmision,
                    f.MontoTotal,
                    f.IVA,
                    f.Descuento,
                    os.ID as NumeroOrden,
                    os.FechaEntrada,
                    c.CI as CI_Cliente,
                    c.NombreCompleto as NombreCliente,
                    v.CodigoVehiculo,
                    v.Placa
                FROM Facturas f
                INNER JOIN OrdenesServicio os ON f.OrdenServicioID = os.ID
                INNER JOIN EmpleadosOrdenes eo ON os.ID = eo.OrdenServicioID
                INNER JOIN Empleados e ON eo.EmpleadoCI = e.CI
                INNER JOIN Vehiculos v ON os.CodigoVehiculo = v.CodigoVehiculo
                INNER JOIN Clientes c ON v.CedulaCliente = c.CI
                WHERE f.FranquiciaRIF = ?
            """
            params = [franquicia_rif]
            
            if mes is not None and anio is not None:
                query += " AND MONTH(f.FechaEmision) = ? AND YEAR(f.FechaEmision) = ?"
                params.extend([str(mes), str(anio)])
            
            query += " ORDER BY f.FechaEmision DESC"
            
            database.execute(query, params)
            
            columns = [column[0] for column in database.description]
            results = [dict(zip(columns, row)) for row in database.fetchall()]
            return results
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching invoices: {str(e)}")

    def getInvoiceDetails(self, franquicia_rif: str, numero_factura: int):
        try:
            query = """
                SELECT DISTINCT
                    f.NumeroFactura,
                    f.FechaEmision,
                    f.MontoTotal,
                    f.IVA,
                    f.Descuento,
                    os.ID as NumeroOrden,
                    os.FechaEntrada,
                    os.HoraEntrada,
                    os.FechaSalidaEstimada,
                    os.HoraSalidaEstimada,
                    os.FechaSalidaReal,
                    os.HoraSalidaReal,
                    os.Comentario,
                    c.CI as CI_Cliente,
                    c.NombreCompleto as NombreCliente,
                    c.Email as EmailCliente,
                    v.CodigoVehiculo,
                    v.Placa,
                    v.FechaAdquisicion,
                    v.TipoAceite,
                    m.DescripcionModelo,
                    b.Nombre as NombreMarca,
                    CASE 
                        WHEN os.FechaSalidaReal IS NOT NULL THEN 'Completado'
                        ELSE 'En Proceso'
                    END as EstadoOrden
                FROM Facturas f
                INNER JOIN OrdenesServicio os ON f.OrdenServicioID = os.ID
                INNER JOIN EmpleadosOrdenes eo ON os.ID = eo.OrdenServicioID
                INNER JOIN Empleados e ON eo.EmpleadoCI = e.CI
                INNER JOIN Vehiculos v ON os.CodigoVehiculo = v.CodigoVehiculo
                INNER JOIN Modelos m ON v.CodigoMarca = m.CodigoMarca AND v.NumeroCorrelativoModelo = m.NumeroCorrelativoModelo
                INNER JOIN Marcas b ON m.CodigoMarca = b.CodigoMarca
                INNER JOIN Clientes c ON v.CedulaCliente = c.CI
                WHERE f.FranquiciaRIF = ? AND f.NumeroFactura = ?
            """
            
            database.execute(query, (franquicia_rif, numero_factura))
            
            columns = [column[0] for column in database.description]
            result = database.fetchone()
            if not result:
                raise HTTPException(status_code=404, detail="Factura not found")
            return dict(zip(columns, result))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching invoice details: {str(e)}")

    def getPurchasesByFranchise(self, franquicia_rif: str, mes: Optional[int] = None, anio: Optional[int] = None):
        try:
            query = """
                SELECT DISTINCT
                    c.Numero as NumeroCompra,
                    c.Fecha,
                    p.RazonSocial as NombreProveedor,
                    p.RIF as RIFProveedor,
                    p.TelefonoLocal,
                    p.PersonaContacto,
                    ai.CantidadPedida,
                    ai.CantidadDisponible,
                    ai.Monto,
                    prod.NombreProducto,
                    prod.DescripcionProducto,
                    ls.DescripcionLinea as Categoria
                FROM Compras c
                INNER JOIN AumentosInventario ai ON c.Numero = ai.NumeroCompra
                INNER JOIN Proveedores p ON c.ProveedorRIF = p.RIF
                INNER JOIN Productos prod ON ai.CodigoProducto = prod.CodigoProducto
                INNER JOIN LineasSuministro ls ON prod.LineaSuministro = ls.CodigoLinea
                WHERE ai.FranquiciaRIF = ?
            """
            params = [franquicia_rif]
            
            if mes is not None and anio is not None:
                query += " AND MONTH(c.Fecha) = ? AND YEAR(c.Fecha) = ?"
                params.extend([str(mes), str(anio)])
            
            query += " ORDER BY c.Fecha DESC"
            
            database.execute(query, params)
            
            columns = [column[0] for column in database.description]
            results = [dict(zip(columns, row)) for row in database.fetchall()]
            return results
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching purchases: {str(e)}")

    def getPurchaseDetails(self, franquicia_rif: str, numero_compra: int):
        try:
            database.execute("""
                SELECT c.Numero, c.Fecha, c.ProveedorRIF, p.RazonSocial, p.Direccion, p.TelefonoLocal, p.PersonaContacto,
                       ai.CodigoProducto, prod.NombreProducto, ai.CantidadPedida, ai.CantidadDisponible, ai.Monto
                FROM Compras c
                JOIN Proveedores p ON c.ProveedorRIF = p.RIF
                JOIN AumentosInventario ai ON c.Numero = ai.NumeroCompra
                JOIN Productos prod ON ai.CodigoProducto = prod.CodigoProducto
                WHERE ai.FranquiciaRIF = ? AND c.Numero = ?
                ORDER BY ai.CodigoProducto
            """, (franquicia_rif, numero_compra))
            
            rows = database.fetchall()
            columns = ["Numero", "Fecha", "ProveedorRIF", "RazonSocial", "Direccion", "TelefonoLocal", "PersonaContacto", 
                      "CodigoProducto", "NombreProducto", "CantidadPedida", "CantidadDisponible", "Monto"]
            result = [dict(zip(columns, row)) for row in rows]
            
            return result
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error getting purchase details: {str(e)}")

    def getServicesByFranchise(self, franquicia_rif: str):
        """
        Get all services that a specific franchise offers
        """
        try:
            database.execute("""
                SELECT s.CodigoServicio, s.NombreServicio
                FROM Servicios s
                JOIN ServiciosFranquicias sf ON s.CodigoServicio = sf.CodigoServicio
                WHERE sf.FranquiciaRIF = ?
                ORDER BY s.CodigoServicio
            """, (franquicia_rif,))
            
            rows = database.fetchall()
            columns = ["CodigoServicio", "NombreServicio"]
            result = [dict(zip(columns, row)) for row in rows]
            
            return result
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error getting services by franchise: {str(e)}")

    def getActivitiesByService(self, codigo_servicio: int):
        """
        Get all activities for a specific service
        """
        try:
            database.execute("""
                SELECT CodigoServicio, NumeroCorrelativoActividad, DescripcionActividad
                FROM Actividades
                WHERE CodigoServicio = ?
                ORDER BY NumeroCorrelativoActividad
            """, (codigo_servicio,))
            
            rows = database.fetchall()
            columns = ["CodigoServicio", "NumeroCorrelativoActividad", "DescripcionActividad"]
            result = [dict(zip(columns, row)) for row in rows]
            
            return result
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error getting activities by service: {str(e)}")

    def checkCorrectionExists(self, franquicia_rif: str, codigo_producto: int):
        """
        Check if a product has already been corrected in the current month and year
        """
        from datetime import date
        current_date = date.today()
        current_month = current_date.month
        current_year = current_date.year
        
        try:
            # Query to check if correction exists for this product in current month/year
            database.execute("""
                SELECT COUNT(*) FROM Correcciones 
                WHERE FranquiciaRIF = ? 
                AND CodigoProducto = ? 
                AND MONTH(FechaCorreccion) = ? 
                AND YEAR(FechaCorreccion) = ?
            """, (franquicia_rif, codigo_producto, current_month, current_year))
            
            result = database.fetchone()
            count = result[0] if result else 0
            
            return {
                "exists": count > 0,
                "count": count,
                "month": current_month,
                "year": current_year
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error checking correction: {str(e)}")

    def getCorrectionHistory(self, franquicia_rif: str, mes: Optional[int] = None, anio: Optional[int] = None):
        """
        Get correction history for a franchise, optionally filtered by month and year
        """
        try:
            if mes is not None and anio is not None:
                # Filter by specific month and year
                database.execute("""
                    SELECT c.FranquiciaRIF, c.CodigoProducto, c.FechaCorreccion, c.Cantidad, c.TipoAjuste, c.Comentario,
                           p.NombreProducto, ls.DescripcionLinea as Categoria
                    FROM Correcciones c
                    JOIN Productos p ON c.CodigoProducto = p.CodigoProducto
                    JOIN LineasSuministro ls ON p.LineaSuministro = ls.CodigoLinea
                    WHERE c.FranquiciaRIF = ? 
                    AND MONTH(c.FechaCorreccion) = ? 
                    AND YEAR(c.FechaCorreccion) = ?
                    ORDER BY c.FechaCorreccion DESC, c.CodigoProducto
                """, (franquicia_rif, mes, anio))
            else:
                # Get all corrections for the franchise
                database.execute("""
                    SELECT c.FranquiciaRIF, c.CodigoProducto, c.FechaCorreccion, c.Cantidad, c.TipoAjuste, c.Comentario,
                           p.NombreProducto, ls.DescripcionLinea as Categoria
                    FROM Correcciones c
                    JOIN Productos p ON c.CodigoProducto = p.CodigoProducto
                    JOIN LineasSuministro ls ON p.LineaSuministro = ls.CodigoLinea
                    WHERE c.FranquiciaRIF = ?
                    ORDER BY c.FechaCorreccion DESC, c.CodigoProducto
                """, (franquicia_rif,))
            
            rows = database.fetchall()
            columns = ["FranquiciaRIF", "CodigoProducto", "FechaCorreccion", "Cantidad", "TipoAjuste", "Comentario", "NombreProducto", "Categoria"]
            result = [dict(zip(columns, row)) for row in rows]
            
            return result
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error getting correction history: {str(e)}")

    def getPurchaseNumber(self, fecha: str, proveedor_rif: str):
        """
        Get the purchase number for a given date and supplier
        """
        try:
            database.execute("SELECT TOP 1 Numero FROM Compras WHERE Fecha = ? AND ProveedorRIF = ? ORDER BY Numero DESC", 
                           (fecha, proveedor_rif))
            purchase_record = database.fetchone()
            if not purchase_record:
                raise HTTPException(status_code=500, detail="Failed to retrieve purchase number")
            return purchase_record[0]
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error getting purchase number: {str(e)}")

    def getProductQuantity(self, franquicia_rif: str, codigo_producto: int):
        """
        Get the current quantity of a product in franchise inventory
        """
        try:
            database.execute("SELECT Cantidad FROM ProductosFranquicia WHERE FranquiciaRIF = ? AND CodigoProducto = ?", 
                           (franquicia_rif, codigo_producto))
            existing_product = database.fetchone()
            return existing_product[0] if existing_product else 0
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error getting product quantity: {str(e)}")

    def updateProductQuantity(self, franquicia_rif: str, codigo_producto: int, new_quantity: int):
        """
        Update the quantity of a product in franchise inventory
        """
        try:
            database.execute("UPDATE ProductosFranquicia SET Cantidad = ? WHERE FranquiciaRIF = ? AND CodigoProducto = ?", 
                           (new_quantity, franquicia_rif, codigo_producto))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error updating product quantity: {str(e)}")

    def insertNewProductToFranchise(self, franquicia_rif: str, codigo_producto: int, cantidad: int):
        """
        Insert a new product to franchise inventory
        """
        try:
            database.execute("INSERT INTO ProductosFranquicia (FranquiciaRIF, CodigoProducto, Cantidad, Precio, CantidadMinima, CantidadMaxima) VALUES (?, ?, ?, ?, ?, ?)", 
                           (franquicia_rif, codigo_producto, cantidad, 0, 0, 0))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error inserting new product to franchise: {str(e)}")

class PostService:
    def postData(self, table_name: str, data: dict):
        try:
            columns = ", ".join(data.keys())
            placeholders = ", ".join(["?" for _ in data])
            values = tuple(data.values())
            
            database.execute(f"INSERT INTO {table_name} ({columns}) VALUES ({placeholders})", values)
            conn.commit()
            return {"message": f"Data inserted successfully into {table_name}"}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error inserting data into {table_name}: {str(e)}")

    def createPurchaseWithInventory(self, purchase_data: dict):
        """
        Create a purchase and update inventory in a single transaction
        purchase_data should contain:
        - Fecha: date
        - ProveedorRIF: string
        - items: list of dict with CodigoProducto, CantidadPedida, CantidadDisponible, Monto, FranquiciaRIF
        """
        try:
            # Start transaction
            conn.autocommit = False
            
            # Create purchase
            purchase_result = self.postData(table_name="Compras", data={
                "Fecha": purchase_data["Fecha"],
                "ProveedorRIF": purchase_data["ProveedorRIF"]
            })
            
            # Get the purchase number
            get_service = GetService()
            numero_compra = get_service.getPurchaseNumber(purchase_data["Fecha"], purchase_data["ProveedorRIF"])
            
            # Create inventory increases for each item
            for item in purchase_data["items"]:
                inventory_data = {
                    "NumeroCompra": numero_compra,
                    "FranquiciaRIF": item["FranquiciaRIF"],
                    "CodigoProducto": item["CodigoProducto"],
                    "CantidadPedida": item["CantidadPedida"],
                    "CantidadDisponible": item["CantidadDisponible"],
                    "Monto": item["Monto"]
                }
                
                self.postData(table_name="AumentosInventario", data=inventory_data)
                
                # Update franchise inventory
                current_quantity = get_service.getProductQuantity(item["FranquiciaRIF"], item["CodigoProducto"])
                
                if current_quantity > 0:
                    # Update existing product quantity
                    new_quantity = current_quantity + item["CantidadDisponible"]
                    get_service.updateProductQuantity(item["FranquiciaRIF"], item["CodigoProducto"], new_quantity)
                else:
                    # Add new product to franchise inventory
                    get_service.insertNewProductToFranchise(item["FranquiciaRIF"], item["CodigoProducto"], item["CantidadDisponible"])
            
            # Commit transaction
            conn.commit()
            conn.autocommit = True
            
            return {
                "message": "Purchase created successfully",
                "numero_compra": numero_compra,
                "total_items": len(purchase_data["items"])
            }
            
        except Exception as e:
            # Rollback transaction on error
            conn.rollback()
            conn.autocommit = True
            raise HTTPException(status_code=500, detail=f"Error creating purchase: {str(e)}")

    def createCorrectionWithInventory(self, correction_data: dict):
        """
        Create a correction and update inventory in a single transaction
        correction_data should contain:
        - FranquiciaRIF: string
        - CodigoProducto: int
        - Cantidad: int
        - TipoAjuste: string
        - Comentario: string
        """
        try:
            from datetime import date
            current_date = date.today().isoformat()
            
            # Start transaction
            conn.autocommit = False
            
            # Create correction
            correction_result = self.postData(table_name="Correcciones", data={
                "FranquiciaRIF": correction_data["FranquiciaRIF"],
                "CodigoProducto": correction_data["CodigoProducto"],
                "FechaCorreccion": current_date,
                "Cantidad": correction_data["Cantidad"],
                "TipoAjuste": correction_data["TipoAjuste"],
                "Comentario": correction_data["Comentario"]
            })
            
            # Update franchise inventory
            get_service = GetService()
            current_quantity = get_service.getProductQuantity(correction_data["FranquiciaRIF"], correction_data["CodigoProducto"])
            
            if current_quantity > 0:
                # Calculate new quantity based on adjustment type
                adjustment_quantity = correction_data["Cantidad"]
                
                if correction_data["TipoAjuste"] == "Faltante":
                    # For "Faltante", we add the quantity (increment)
                    new_quantity = current_quantity + adjustment_quantity
                else:
                    # For "Sobrante", we subtract the quantity (decrement)
                    new_quantity = current_quantity - adjustment_quantity
                
                # Ensure quantity doesn't go below 0
                new_quantity = max(0, new_quantity)
                
                get_service.updateProductQuantity(correction_data["FranquiciaRIF"], correction_data["CodigoProducto"], new_quantity)
            
            # Commit transaction
            conn.commit()
            conn.autocommit = True
            
            return {
                "message": "Correction created successfully",
                "fecha_correccion": current_date,
                "tipo_ajuste": correction_data["TipoAjuste"]
            }
            
        except Exception as e:
            # Rollback transaction on error
            conn.rollback()
            conn.autocommit = True
            raise HTTPException(status_code=500, detail=f"Error creating correction: {str(e)}")

class DeleteService:
    def deleteData(self, table_name: str, **filters):
        where_clause = " AND ".join([f"{key} = ?" for key in filters.keys()])
        values = tuple(filters.values())
        try:
            database.execute(f"DELETE FROM {table_name} WHERE {where_clause}", values)
            conn.commit()
            return {"message": f"Data deleted from {table_name} successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error deleting data from {table_name}: {str(e)}")
        

class UpdateService:
    def updateData(self, table_name: str, data: dict, **filters):
        set_clause = ', '.join([f"{key} = ?" for key in data.keys()])
        where_clause = " AND ".join([f"{key} = ?" for key in filters.keys()])
        values = tuple(data.values()) + tuple(filters.values())
        try:
            database.execute(f"UPDATE {table_name} SET {set_clause} WHERE {where_clause}", values)
            conn.commit()
            return {"message": f"Data updated in {table_name} successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error updating data in {table_name}: {str(e)}")


