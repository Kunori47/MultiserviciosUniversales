from db.database import database, conn
from models import *
from fastapi import UploadFile, HTTPException
from typing import Optional
from datetime import date

class GetService:

    def getAll(self, table_name: str):
        """
        Obtiene todos los registros de una tabla específica.
        Útil para listar todos los elementos de cualquier tabla del sistema.
        """
        try:
            database.execute(f"SELECT * FROM {table_name}")
            data = database.fetchall()
            return data
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching data from {table_name}: {str(e)}")
        
    def getDataById(self, table_name: str, **filters):
        """
        Obtiene un registro específico por filtros (generalmente ID).
        Permite buscar registros usando múltiples criterios como clave primaria.
        """
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
        """
        Obtiene registros que coincidan con los filtros especificados.
        Retorna múltiples registros que cumplan con los criterios de búsqueda.
        """
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
        """
        Obtiene datos de una vista con filtros específicos.
        Similar a getDataByFilter pero optimizado para consultar vistas de la base de datos.
        """
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
        """
        Busca empleados por CI o nombre completo.
        Retorna máximo 10 resultados para autocompletado en formularios.
        """
        try:
            database.execute(f"SELECT TOP 10 CI, NombreCompleto FROM {table_name} WHERE CI LIKE ?", f'%{query}%')
            columns = [column[0] for column in database.description]
            results = [dict(zip(columns, row)) for row in database.fetchall()]
            return results
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error searching data in {table_name}: {str(e)}")
        
    def searchDataFranchise(self, table_name: str, query: str):
        """
        Busca franquicias por RIF.
        Retorna máximo 10 resultados para autocompletado en formularios.
        """
        try:
            database.execute(f"SELECT TOP 10 * FROM {table_name} WHERE RIF LIKE ?", f'%{query}%')
            columns = [column[0] for column in database.description]
            results = [dict(zip(columns, row)) for row in database.fetchall()]
            return results
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error searching data in {table_name}: {str(e)}")
        
    def searchDataBrand(self, table_name: str, query: str):
        """
        Busca marcas por nombre.
        Retorna máximo 10 resultados para autocompletado en formularios.
        """
        try:
            database.execute(f"SELECT TOP 10 * FROM {table_name} WHERE Nombre LIKE ?", f'%{query}%')
            columns = [column[0] for column in database.description]
            results = [dict(zip(columns, row)) for row in database.fetchall()]
            return results
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error searching data in {table_name}: {str(e)}")
        
    def searchDataFilters(self, table_name: str, q: str, **filters):
        """
        Busca datos con filtros adicionales y búsqueda por CI.
        Combina filtros específicos con búsqueda por texto en el campo CI.
        """
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
        """
        Busca líneas de suministro por descripción.
        Retorna máximo 10 resultados para autocompletado en formularios.
        """
        try:
            database.execute(f"SELECT TOP 10 * FROM {table_name} WHERE DescripcionLinea LIKE ?", f'%{query}%')
            columns = [column[0] for column in database.description]
            results = [dict(zip(columns, row)) for row in database.fetchall()]
            return results
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error searching data in {table_name}: {str(e)}")

    def searchDataVendors(self, table_name: str, query: str):
        """
        Busca proveedores por razón social.
        Retorna máximo 10 resultados para autocompletado en formularios.
        """
        try:
            database.execute(f"SELECT TOP 10 * FROM {table_name} WHERE RazonSocial LIKE ?", f'%{query}%')
            columns = [column[0] for column in database.description]
            results = [dict(zip(columns, row)) for row in database.fetchall()]
            return results
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error searching data in {table_name}: {str(e)}")

    def searchDataMaintenancePlans(self, table_name: str, query: str):
        """
        Busca planes de mantenimiento por descripción.
        Retorna máximo 10 resultados para autocompletado en formularios.
        """
        try:
            database.execute(f"SELECT TOP 10 * FROM {table_name} WHERE DescripcionMantenimiento LIKE ?", f'%{query}%')
            columns = [column[0] for column in database.description]
            results = [dict(zip(columns, row)) for row in database.fetchall()]
            return results
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error searching data in {table_name}: {str(e)}")

    def searchDataBrands(self, table_name: str, query: str):
        """
        Busca marcas por nombre (alias de searchDataBrand).
        Retorna máximo 10 resultados para autocompletado en formularios.
        """
        try:
            database.execute(f"SELECT TOP 10 * FROM {table_name} WHERE Nombre LIKE ?", f'%{query}%')
            columns = [column[0] for column in database.description]
            results = [dict(zip(columns, row)) for row in database.fetchall()]
            return results
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error searching data in {table_name}: {str(e)}")

    def searchDataModels(self, table_name: str, query: str):
        """
        Busca modelos por descripción del modelo.
        Retorna máximo 10 resultados para autocompletado en formularios.
        """
        try:
            database.execute(f"SELECT TOP 10 * FROM {table_name} WHERE DescripcionModelo LIKE ?", f'%{query}%')
            columns = [column[0] for column in database.description]
            results = [dict(zip(columns, row)) for row in database.fetchall()]
            return results
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error searching data in {table_name}: {str(e)}")

    def searchDataSpecialties(self, table_name: str, query: str):
        """
        Busca especialidades por descripción.
        Retorna máximo 10 resultados para autocompletado en formularios.
        """
        try:
            database.execute(f"SELECT TOP 10 * FROM {table_name} WHERE DescripcionEspecialidad LIKE ?", f'%{query}%')
            columns = [column[0] for column in database.description]
            results = [dict(zip(columns, row)) for row in database.fetchall()]
            return results
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error searching data in {table_name}: {str(e)}")

    def searchDataServices(self, table_name: str, query: str):
        """
        Busca servicios por nombre del servicio.
        Retorna máximo 10 resultados para autocompletado en formularios.
        """
        try:
            database.execute(f"SELECT TOP 10 * FROM {table_name} WHERE NombreServicio LIKE ?", f'%{query}%')
            columns = [column[0] for column in database.description]
            results = [dict(zip(columns, row)) for row in database.fetchall()]
            return results
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error searching data in {table_name}: {str(e)}")
        
    def countData(self, table_name: str):
        """
        Cuenta el número total de registros en una tabla.
        Útil para estadísticas y paginación.
        """
        try:
            database.execute(f"SELECT COUNT(*) FROM {table_name}")
            data = database.fetchone()
            return data[0] if data else 0
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error counting data in {table_name}: {str(e)}")
        
    def countDistinctData(self, table_name: str, column_name: str):
        """
        Cuenta valores únicos en una columna específica.
        Útil para estadísticas de diversidad de datos.
        """
        try:
            database.execute(f"SELECT COUNT(DISTINCT {table_name}.{column_name}) FROM {table_name}")
            data = database.fetchone()
            return data[0] if data else 0
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error counting distinct data in {table_name}: {str(e)}")
        
    def countDistinctDataByFranchise(self, table_name: str, column_name: str, **filters):
        """
        Cuenta valores únicos en una columna específica filtrada por franquicia.
        Útil para estadísticas específicas por franquicia.
        """
        where_clause = " AND ".join([f"{key} = ?" for key in filters.keys()])
        values = tuple(filters.values())
        try:
            database.execute(f"SELECT COUNT(DISTINCT {table_name}.{column_name}) FROM {table_name} WHERE {where_clause}", values)
            data = database.fetchone()
            return data[0] if data else 0
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error counting distinct data in {table_name}: {str(e)}")
        

    def countDataByFranchise(self, table_name: str, **filters):
        """
        Cuenta registros filtrados por franquicia.
        Útil para estadísticas específicas por franquicia.
        """
        where_clause = " AND ".join([f"{key} = ?" for key in filters.keys()])
        values = tuple(filters.values())
        try:
            database.execute(f"SELECT COUNT(*) FROM {table_name} WHERE {where_clause}", values)
            data = database.fetchone()
            return data[0] if data else 0
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error counting data in {table_name}: {str(e)}")
        
    def getInventoryByFranchise(self, franquicia_rif: str):
        """
        Obtiene el inventario completo de una franquicia específica.
        Incluye información del producto, cantidades, precios y categoría.
        """
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
        """
        Busca productos en el inventario de una franquicia por nombre o código.
        Permite búsqueda por texto en nombre del producto o código numérico.
        """
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
    
    def getScarceProductsByFranchise(self, franquicia_rif: str):
        """
        Obtiene productos con stock bajo (cantidad <= cantidad mínima).
        Ordenados por cantidad ascendente para priorizar los más críticos.
        """
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
                WHERE pf.FranquiciaRIF = ? AND pf.Cantidad <= pf.CantidadMinima
                ORDER BY pf.Cantidad ASC
            """, (franquicia_rif,))
            
            columns = [column[0] for column in database.description]
            results = [dict(zip(columns, row)) for row in database.fetchall()]
            return results
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching scarce products: {str(e)}")
    
    def getExcessProductsByFranchise(self, franquicia_rif: str):
        """
        Obtiene productos con stock excesivo (cantidad >= cantidad máxima).
        Ordenados por cantidad descendente para mostrar los más excedidos.
        """
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
                WHERE pf.FranquiciaRIF = ? AND pf.Cantidad >= pf.CantidadMaxima
                ORDER BY pf.Cantidad DESC
            """, (franquicia_rif,))
            
            columns = [column[0] for column in database.description]
            results = [dict(zip(columns, row)) for row in database.fetchall()]
            return results
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching excess products: {str(e)}")
    
    def getProductByFranchiseAndCode(self, franquicia_rif: str, codigo_producto: int):
        """
        Obtiene un producto específico del inventario de una franquicia.
        Retorna información completa del producto incluyendo stock y precios.
        """
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
        """
        Obtiene órdenes de servicio de una franquicia con filtros opcionales.
        Permite filtrar por mes/año y estado (En Proceso, A Facturar, Completado).
        """
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
                        WHEN os.FechaSalidaReal IS NOT NULL AND f.NumeroFactura IS NULL THEN 'A Facturar'
                        WHEN os.FechaSalidaReal IS NOT NULL AND f.NumeroFactura IS NOT NULL THEN 'Completado'
                        ELSE 'En Proceso'
                    END as Estado
                FROM EmpleadosOrdenes eo
                INNER JOIN OrdenesServicio os ON eo.OrdenServicioID = os.ID
                INNER JOIN Empleados e ON eo.EmpleadoCI = e.CI
                INNER JOIN Vehiculos v ON os.CodigoVehiculo = v.CodigoVehiculo
                INNER JOIN Clientes c ON v.CedulaCliente = c.CI
                LEFT JOIN Facturas f ON os.ID = f.OrdenServicioID
                WHERE e.FranquiciaRIF = ?
            """
            params = [franquicia_rif]
            
            if mes is not None and anio is not None:
                query += " AND MONTH(os.FechaEntrada) = ? AND YEAR(os.FechaEntrada) = ?"
                params.extend([str(mes), str(anio)])
            
            if estado is not None:
                if estado == "Completado":
                    query += " AND os.FechaSalidaReal IS NOT NULL AND f.NumeroFactura IS NOT NULL"
                elif estado == "A Facturar":
                    query += " AND os.FechaSalidaReal IS NOT NULL AND f.NumeroFactura IS NULL"
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
        """
        Obtiene estadísticas de órdenes de servicio por franquicia.
        Cuenta total de órdenes, completadas, a facturar y en proceso.
        """
        try:
            query = """
                SELECT 
                    COUNT(DISTINCT os.ID) as TotalOrdenes,
                    COUNT(DISTINCT CASE WHEN os.FechaSalidaReal IS NOT NULL AND f.NumeroFactura IS NOT NULL THEN os.ID END) as OrdenesCompletadas,
                    COUNT(DISTINCT CASE WHEN os.FechaSalidaReal IS NOT NULL AND f.NumeroFactura IS NULL THEN os.ID END) as OrdenesAFacturar,
                    COUNT(DISTINCT CASE WHEN os.FechaSalidaReal IS NULL THEN os.ID END) as OrdenesEnProceso
                FROM EmpleadosOrdenes eo
                INNER JOIN OrdenesServicio os ON eo.OrdenServicioID = os.ID
                INNER JOIN Empleados e ON eo.EmpleadoCI = e.CI
                LEFT JOIN Facturas f ON os.ID = f.OrdenServicioID
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
                return {"TotalOrdenes": 0, "OrdenesCompletadas": 0, "OrdenesAFacturar": 0, "OrdenesEnProceso": 0}
            return dict(zip(columns, result))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching order stats: {str(e)}")

    def getOrderDetails(self, franquicia_rif: str, numero_orden: int):
        """
        Obtiene detalles completos de una orden de servicio específica.
        Incluye información de la orden, empleados asignados y productos utilizados.
        """
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
                        WHEN os.FechaSalidaReal IS NOT NULL AND f.NumeroFactura IS NULL THEN 'A Facturar'
                        WHEN os.FechaSalidaReal IS NOT NULL AND f.NumeroFactura IS NOT NULL THEN 'Completado'
                        ELSE 'En Proceso'
                    END as Estado
                FROM EmpleadosOrdenes eo
                INNER JOIN OrdenesServicio os ON eo.OrdenServicioID = os.ID
                INNER JOIN Empleados e ON eo.EmpleadoCI = e.CI
                INNER JOIN Vehiculos v ON os.CodigoVehiculo = v.CodigoVehiculo
                INNER JOIN Clientes c ON v.CedulaCliente = c.CI
                LEFT JOIN Facturas f ON os.ID = f.OrdenServicioID
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
                    a.DescripcionActividad,
                    oa.Costo_Act
                FROM ProductosOrdenesServicio pos
                INNER JOIN Productos prod ON pos.CodigoProducto = prod.CodigoProducto
                INNER JOIN LineasSuministro ls ON prod.LineaSuministro = ls.CodigoLinea
                INNER JOIN Servicios s ON pos.CodigoServicio = s.CodigoServicio
                INNER JOIN Actividades a ON pos.CodigoServicio = a.CodigoServicio AND pos.NumeroCorrelativoActividad = a.NumeroCorrelativoActividad
                INNER JOIN OrdenesActividades oa ON pos.CodigoOrdenServicio = oa.IDorden AND pos.CodigoServicio = oa.CodigoServicio AND pos.NumeroCorrelativoActividad = oa.NumeroCorrelativoActividad
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
        """
        Obtiene facturas de una franquicia con filtros opcionales por mes/año.
        Incluye información del cliente, vehículo y orden asociada.
        """
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
        """
        Obtiene detalles completos de una factura específica.
        Incluye información del cliente, vehículo, marca, modelo y orden asociada.
        """
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
                        WHEN os.FechaSalidaReal IS NOT NULL AND f2.NumeroFactura IS NULL THEN 'A Facturar'
                        WHEN os.FechaSalidaReal IS NOT NULL AND f2.NumeroFactura IS NOT NULL THEN 'Completado'
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
                LEFT JOIN Facturas f2 ON os.ID = f2.OrdenServicioID
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
        """
        Obtiene compras de una franquicia con filtros opcionales por mes/año.
        Incluye información del proveedor y productos comprados.
        """
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
        """
        Obtiene detalles completos de una compra específica.
        Incluye información del proveedor y todos los productos de la compra.
        """
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
        Obtiene todos los servicios que ofrece una franquicia específica.
        Útil para mostrar servicios disponibles en formularios de órdenes.
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
        Obtiene todas las actividades de un servicio específico.
        Útil para mostrar actividades disponibles al seleccionar un servicio.
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
        Verifica si un producto ya ha sido corregido en el mes y año actual.
        Previene correcciones duplicadas en el mismo período.
        """
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
        Obtiene el historial de correcciones de inventario de una franquicia.
        Permite filtrar por mes/año y muestra información del producto corregido.
        """
        try:
            query = """
                SELECT 
                    c.FranquiciaRIF,
                    c.CodigoProducto,
                    p.NombreProducto,
                    c.FechaCorreccion,
                    c.Cantidad,
                    c.TipoAjuste,
                    c.Comentario
                FROM Correcciones c
                INNER JOIN Productos p ON c.CodigoProducto = p.CodigoProducto
                WHERE c.FranquiciaRIF = ?
            """
            params = [franquicia_rif]
            
            if mes is not None and anio is not None:
                query += " AND MONTH(c.FechaCorreccion) = ? AND YEAR(c.FechaCorreccion) = ?"
                params.extend([str(mes), str(anio)])
            
            query += " ORDER BY c.FechaCorreccion DESC"
            
            database.execute(query, params)
            
            columns = [column[0] for column in database.description]
            results = [dict(zip(columns, row)) for row in database.fetchall()]
            return results
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching correction history: {str(e)}")

    def getModelsByBrand(self, codigo_marca: int):
        """
        Obtiene todos los modelos de una marca específica.
        Ordenados por número correlativo del modelo.
        """
        try:
            database.execute("""
                SELECT 
                    m.CodigoMarca,
                    m.NumeroCorrelativoModelo,
                    m.DescripcionModelo,
                    m.CantidadPuestos,
                    m.TipoRefrigerante,
                    m.TipoGasolina,
                    m.TipoAceite,
                    m.Peso
                FROM Modelos m
                WHERE m.CodigoMarca = ?
                ORDER BY m.NumeroCorrelativoModelo
            """, (codigo_marca,))
            
            columns = [column[0] for column in database.description]
            results = [dict(zip(columns, row)) for row in database.fetchall()]
            return results
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching models by brand: {str(e)}")

    def checkBrandHasModels(self, codigo_marca: int):
        """
        Verifica si una marca tiene modelos asociados.
        Útil para validar antes de eliminar una marca.
        """
        try:
            database.execute("""
                SELECT COUNT(*) as model_count
                FROM Modelos
                WHERE CodigoMarca = ?
            """, (codigo_marca,))
            
            result = database.fetchone()
            return result[0] > 0 if result else False
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error checking brand models: {str(e)}")

    def getNextModelCorrelativeNumber(self, codigo_marca: int):
        """
        Obtiene el siguiente número correlativo para modelos de una marca específica.
        Útil para auto-incrementar el número de modelo al crear uno nuevo.
        """
        try:
            database.execute("""
                SELECT COALESCE(MAX(NumeroCorrelativoModelo), 0) + 1 as next_number
                FROM Modelos
                WHERE CodigoMarca = ?
            """, (codigo_marca,))
            
            result = database.fetchone()
            return result[0] if result else 1
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error getting next model correlative number: {str(e)}")

    def getMaintenancePlansByModel(self, codigo_marca: int, numero_correlativo_modelo: int):
        """
        Obtiene todos los planes de mantenimiento de un modelo específico.
        Incluye información de tiempo de uso, kilometraje y descripción.
        """
        try:
            database.execute("""
                SELECT 
                    pm.CodigoMantenimiento,
                    pm.TiempoUso,
                    pm.Kilometraje,
                    pm.DescripcionMantenimiento,
                    pm.CodigoMarca,
                    pm.NumeroCorrelativoModelo
                FROM PlanesMantenimiento pm
                WHERE pm.CodigoMarca = ? AND pm.NumeroCorrelativoModelo = ?
            """, (codigo_marca, numero_correlativo_modelo))
            
            columns = [column[0] for column in database.description]
            results = [dict(zip(columns, row)) for row in database.fetchall()]
            return results
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching maintenance plans: {str(e)}")

    def getEmployeeSpecialties(self, empleado_ci: str):
        """
        Obtiene las especialidades de un empleado específico.
        Útil para mostrar las habilidades del empleado en formularios.
        """
        try:
            database.execute("""
                SELECT 
                    e.CodigoEspecialidad,
                    e.DescripcionEspecialidad
                FROM EspecialidadesEmpleados ee
                INNER JOIN Especialidades e ON ee.CodigoEspecialidad = e.CodigoEspecialidad
                WHERE ee.EmpleadoCI = ?
            """, (empleado_ci,))
            
            columns = [column[0] for column in database.description]
            results = [dict(zip(columns, row)) for row in database.fetchall()]
            return results
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching employee specialties: {str(e)}")

    def getProductsByVendor(self, proveedor_rif: str):
        """
        Obtiene todos los productos que suministra un proveedor específico.
        Incluye información detallada del producto y características técnicas.
        """
        try:
            database.execute("""
                SELECT 
                    p.CodigoProducto,
                    p.NombreProducto,
                    p.DescripcionProducto,
                    p.Tipo,
                    p.NivelContaminante,
                    p.Tratamiento
                FROM Suministros s
                INNER JOIN Productos p ON s.CodigoProducto = p.CodigoProducto
                WHERE s.ProveedorRIF = ?
                ORDER BY p.NombreProducto
            """, (proveedor_rif,))
            
            columns = [column[0] for column in database.description]
            results = [dict(zip(columns, row)) for row in database.fetchall()]
            return results
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching products by vendor: {str(e)}")

    def getPurchaseNumber(self, fecha: str, proveedor_rif: str):
        """
        Obtiene el siguiente número de compra para un proveedor en una fecha específica.
        Útil para auto-incrementar el número de compra al crear una nueva.
        """
        try:
            database.execute("""
                SELECT COUNT(*) + 1
                FROM Compras
                WHERE CONVERT(DATE, Fecha) = ? AND ProveedorRIF = ?
            """, (fecha, proveedor_rif))
            result = database.fetchone()
            return result[0] if result else 1
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error getting purchase number: {str(e)}")

    def getProductQuantity(self, franquicia_rif: str, codigo_producto: int):
        """
        Obtiene la cantidad actual de un producto en el inventario de una franquicia.
        NOTA: Este método ya no se usa en el proceso de compra debido al trigger de la base de datos.
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
        Actualiza la cantidad de un producto en el inventario de una franquicia.
        NOTA: Este método ya no se usa en el proceso de compra debido al trigger de la base de datos.
        """
        try:
            database.execute("UPDATE ProductosFranquicia SET Cantidad = ? WHERE FranquiciaRIF = ? AND CodigoProducto = ?", 
                           (new_quantity, franquicia_rif, codigo_producto))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error updating product quantity: {str(e)}")

    def insertNewProductToFranchise(self, franquicia_rif: str, codigo_producto: int, cantidad: int):
        """
        Inserta un nuevo producto al inventario de una franquicia.
        NOTA: Este método ya no se usa en el proceso de compra debido al trigger de la base de datos.
        """
        try:
            database.execute("INSERT INTO ProductosFranquicia (FranquiciaRIF, CodigoProducto, Cantidad, Precio, CantidadMinima, CantidadMaxima) VALUES (?, ?, ?, ?, ?, ?)", 
                           (franquicia_rif, codigo_producto, cantidad, 0, 0, 0))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error inserting new product to franchise: {str(e)}")

    def getCustomerFrequency(self, mes, anio):
        """
        Obtiene la frecuencia de visitas de clientes por mes y año.
        Útil para análisis de clientes frecuentes y marketing.
        """
        try:
            query = '''
                SELECT c.CI, c.NombreCompleto, c.Email, COUNT(os.ID) AS FrecuenciaMensual
                FROM Clientes c
                LEFT JOIN Vehiculos v ON c.CI = v.CedulaCliente
                LEFT JOIN OrdenesServicio os ON v.CodigoVehiculo = os.CodigoVehiculo
                    AND MONTH(os.FechaEntrada) = ? AND YEAR(os.FechaEntrada) = ?
                GROUP BY c.CI, c.NombreCompleto, c.Email
                ORDER BY FrecuenciaMensual DESC
            '''
            database.execute(query, (mes, anio))
            columns = [col[0] for col in database.description]
            results = [dict(zip(columns, row)) for row in database.fetchall()]
            return results
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching customer frequency: {str(e)}")

    def getCustomerTotalFrequency(self):
        """
        Obtiene la frecuencia total de visitas de todos los clientes.
        Útil para análisis histórico de clientes y lealtad.
        """
        try:
            query = '''
                SELECT c.CI, c.NombreCompleto, c.Email, COUNT(os.ID) AS FrecuenciaTotal
                FROM Clientes c
                LEFT JOIN Vehiculos v ON c.CI = v.CedulaCliente
                LEFT JOIN OrdenesServicio os ON v.CodigoVehiculo = os.CodigoVehiculo
                GROUP BY c.CI, c.NombreCompleto, c.Email
                ORDER BY FrecuenciaTotal DESC
            '''
            database.execute(query)
            columns = [col[0] for col in database.description]
            results = [dict(zip(columns, row)) for row in database.fetchall()]
            return results
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching customer total frequency: {str(e)}")

    def getCustomerFrequencyLast3Months(self, customer_ci: str):
        """
        Obtiene la frecuencia de visitas de un cliente en los últimos 3 meses.
        Retorna el número total de visitas en los últimos 3 meses.
        """
        try:
            query = '''
                SELECT COUNT(os.ID) AS FrecuenciaUltimos3Meses
                FROM Clientes c
                LEFT JOIN Vehiculos v ON c.CI = v.CedulaCliente
                LEFT JOIN OrdenesServicio os ON v.CodigoVehiculo = os.CodigoVehiculo
                WHERE c.CI = ? 
                  AND os.FechaEntrada >= DATEADD(MONTH, -3, GETDATE())
                  AND os.FechaEntrada <= GETDATE()
            '''
            database.execute(query, (customer_ci,))
            result = database.fetchone()
            return result[0] if result else 0
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching customer frequency for last 3 months: {str(e)}")

    def getOrdersByVehicle(self, codigo_vehiculo: int):
        """
        Obtiene todas las órdenes de servicio de un vehículo específico.
        Incluye información del cliente y estado de cada orden.
        """
        try:
            query = '''
                SELECT os.ID as NumeroOrden,
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
                           WHEN os.FechaSalidaReal IS NOT NULL AND f.NumeroFactura IS NULL THEN 'A Facturar'
                           WHEN os.FechaSalidaReal IS NOT NULL AND f.NumeroFactura IS NOT NULL THEN 'Completado'
                           ELSE 'En Proceso'
                       END as Estado
                FROM OrdenesServicio os
                INNER JOIN Vehiculos v ON os.CodigoVehiculo = v.CodigoVehiculo
                INNER JOIN Clientes c ON v.CedulaCliente = c.CI
                LEFT JOIN Facturas f ON os.ID = f.OrdenServicioID
                WHERE os.CodigoVehiculo = ?
                ORDER BY os.FechaEntrada DESC
            '''
            database.execute(query, (codigo_vehiculo,))
            columns = [column[0] for column in database.description]
            results = [dict(zip(columns, row)) for row in database.fetchall()]
            return results
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error getting orders by vehicle: {str(e)}")

    def getActiveEmployeesByFranchise(self, franquicia_rif: str):
        """
        Obtiene empleados activos de una franquicia específica.
        Útil para asignar empleados a órdenes de servicio.
        """
        try:
            database.execute("""
                SELECT CI, NombreCompleto, Rol
                FROM Empleados 
                WHERE FranquiciaRIF = ? AND Estado = 'Activo'
                ORDER BY NombreCompleto
            """, (franquicia_rif,))
            columns = [column[0] for column in database.description]
            results = [dict(zip(columns, row)) for row in database.fetchall()]
            return results
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching active employees: {str(e)}")

    def getAllServiceOrders(self):
        """
        Obtiene todas las órdenes de servicio del sistema.
        Incluye información del cliente, vehículo y actividades de cada orden.
        """
        try:
            database.execute("""
                SELECT 
                    os.ID as NumeroOrden,
                    os.FechaEntrada as FechaOrden,
                    os.HoraEntrada,
                    os.FechaSalidaEstimada,
                    os.HoraSalidaEstimada,
                    os.FechaSalidaReal,
                    os.HoraSalidaReal,
                    os.Comentario,
                    c.NombreCompleto as NombreCliente,
                    v.Placa,
                    v.CodigoVehiculo,
                    v.CodigoMarca,
                    v.NumeroCorrelativoModelo,
                    v.CedulaCliente
                FROM OrdenesServicio os
                LEFT JOIN Vehiculos v ON os.CodigoVehiculo = v.CodigoVehiculo
                LEFT JOIN Clientes c ON v.CedulaCliente = c.CI
                ORDER BY os.FechaEntrada DESC, os.HoraEntrada DESC
            """)
            columns = [column[0] for column in database.description]
            results = [dict(zip(columns, row)) for row in database.fetchall()]
            
            # Agregar información de actividades para cada orden
            for result in results:
                if result['NumeroOrden']:
                    try:
                        activities = self.getActivitiesByOrder(result['NumeroOrden'])
                        result['Actividades'] = activities
                    except:
                        result['Actividades'] = []
            
            return results
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching all service orders: {str(e)}")

    def get_pending_service_orders_by_employee(self, CI: str):
        """
        Obtiene órdenes de servicio pendientes asignadas a un empleado específico.
        Solo incluye órdenes que no han sido completadas (sin fecha de salida real).
        """
        try:
            query = '''
                SELECT DISTINCT
                    os.ID as NumeroOrden,
                    os.FechaEntrada as FechaOrden,
                    os.HoraEntrada,
                    os.FechaSalidaEstimada,
                    os.HoraSalidaEstimada,
                    os.Comentario,
                    CASE 
                        WHEN os.FechaSalidaReal IS NOT NULL AND f.NumeroFactura IS NULL THEN 'A Facturar'
                        WHEN os.FechaSalidaReal IS NOT NULL AND f.NumeroFactura IS NOT NULL THEN 'Completado'
                        ELSE 'En Proceso'
                    END as Estado
                FROM EmpleadosOrdenes eo
                INNER JOIN OrdenesServicio os ON eo.OrdenServicioID = os.ID
                LEFT JOIN Facturas f ON os.ID = f.OrdenServicioID
                WHERE eo.EmpleadoCI = ?
                  AND os.FechaSalidaReal IS NULL
                  AND os.HoraSalidaReal IS NULL
                ORDER BY os.FechaEntrada DESC
            '''
            database.execute(query, (CI,))
            columns = [column[0] for column in database.description]
            results = [dict(zip(columns, row)) for row in database.fetchall()]
            return results
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching pending service orders: {str(e)}")

    def getActivitiesByOrder(self, id_orden: int):
        """
        Obtiene todas las actividades de una orden de servicio específica.
        Incluye información del servicio y costo de cada actividad.
        """
        try:
            query = '''
                SELECT oa.CodigoServicio, s.NombreServicio, oa.NumeroCorrelativoActividad, a.DescripcionActividad, oa.Costo_Act
                FROM OrdenesActividades oa
                INNER JOIN Servicios s ON oa.CodigoServicio = s.CodigoServicio
                INNER JOIN Actividades a ON oa.CodigoServicio = a.CodigoServicio AND oa.NumeroCorrelativoActividad = a.NumeroCorrelativoActividad
                WHERE oa.IDorden = ?
                ORDER BY s.NombreServicio, oa.NumeroCorrelativoActividad
            '''
            database.execute(query, (id_orden,))
            columns = [column[0] for column in database.description]
            results = [dict(zip(columns, row)) for row in database.fetchall()]
            return results
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error obteniendo actividades de la orden: {str(e)}")

    def getServicesByOrder(self, numero_orden: int):
        """
        Obtiene servicios de una orden específica con información de precios.
        Formatea los datos para mostrar en facturas con precio unitario y subtotal.
        """
        try:
            query = '''
                SELECT 
                    oa.NumeroCorrelativoActividad,
                    oa.CodigoServicio,
                    s.NombreServicio,
                    oa.Costo_Act as PrecioUnitario,
                    1 as Cantidad,
                    oa.Costo_Act as Subtotal
                FROM OrdenesActividades oa
                INNER JOIN Servicios s ON oa.CodigoServicio = s.CodigoServicio
                WHERE oa.IDorden = ?
                ORDER BY s.NombreServicio, oa.NumeroCorrelativoActividad
            '''
            database.execute(query, (numero_orden,))
            columns = [column[0] for column in database.description]
            results = [dict(zip(columns, row)) for row in database.fetchall()]
            return results
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error obteniendo servicios de la orden: {str(e)}")

    def getAllModelsWithBrandName(self):
        """
        Obtiene todos los modelos con el nombre de su marca asociada.
        Ordenados por nombre de marca y número correlativo del modelo.
        """
        try:
            query = (
                "SELECT m.CodigoMarca, m.NumeroCorrelativoModelo, m.DescripcionModelo, m.CantidadPuestos, m.TipoRefrigerante, m.TipoGasolina, m.TipoAceite, m.Peso, b.Nombre as MarcaNombre "
                "FROM Modelos m "
                "JOIN Marcas b ON m.CodigoMarca = b.CodigoMarca "
                "ORDER BY b.Nombre, m.NumeroCorrelativoModelo"
            )
            database.execute(query)
            columns = [column[0] for column in database.description]
            results = [dict(zip(columns, row)) for row in database.fetchall()]
            return results
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error al obtener los modelos: {str(e)}")

class PostService:
    def postData(self, table_name: str, data: dict):
        """
        Inserta datos en cualquier tabla del sistema.
        Método genérico que construye dinámicamente la consulta INSERT.
        """
        try:
            columns = ", ".join(data.keys())
            placeholders = ", ".join(["?" for _ in data])
            values = tuple(data.values())
            
            database.execute(f"INSERT INTO {table_name} ({columns}) VALUES ({placeholders})", values)
            conn.commit()
            return {"message": f"Data inserted successfully into {table_name}"}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error inserting data into {table_name}: {str(e)}")
        

    def postModelData(self, data: dict):
        """
        Método especial para crear modelos con auto-incremento del NumeroCorrelativoModelo.
        Calcula automáticamente el siguiente número correlativo para la marca.
        """
        try:
            # Get the next NumeroCorrelativoModelo for the given CodigoMarca
            database.execute("SELECT MAX(NumeroCorrelativoModelo) FROM Modelos WHERE CodigoMarca = ?", (data["CodigoMarca"],))
            result = database.fetchone()
            next_number = 1 if result is None or result[0] is None else result[0] + 1
            
            # Add the NumeroCorrelativoModelo to the data
            data["NumeroCorrelativoModelo"] = next_number
            
            # Insert the model
            return self.postData("Modelos", data)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error creating model: {str(e)}")
        
    def createPurchaseWithInventory(self, purchase_data: dict):
        """
        Crea una compra y actualiza el inventario en una sola transacción.
        Los triggers de la base de datos se encargan automáticamente de actualizar el inventario.
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
            # The trigger will automatically update the inventory
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
                # El trigger se ejecutará automáticamente aquí y actualizará el inventario
            
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
        Crea una corrección de inventario.
        El trigger de la base de datos se encarga automáticamente de actualizar el inventario.
        """
        try:
            # Crear la corrección - el trigger se encargará de actualizar el inventario automáticamente
            current_date = date.today().isoformat()
            database.execute("""
                INSERT INTO Correcciones (FranquiciaRIF, CodigoProducto, FechaCorreccion, Cantidad, TipoAjuste, Comentario)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (
                correction_data['FranquiciaRIF'],
                correction_data['CodigoProducto'],
                current_date,
                correction_data['Cantidad'],
                correction_data['TipoAjuste'],
                correction_data.get('Comentario', '')
            ))
            
            # Confirmar transacción
            conn.commit()
            return {"message": "Corrección creada exitosamente"}
            
        except Exception as e:
            # Revertir transacción en caso de error
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error creating correction: {str(e)}")

    def createServiceOrderWithEmployees(self, service_order_data: dict):
        """
        Crea una orden de servicio y asigna empleados en una sola transacción.
        Obtiene automáticamente el ID de la orden creada para asignar empleados.
        """
        try:
            # Iniciar transacción
            database.execute("BEGIN TRANSACTION")
            
            # Obtener el ID máximo actual antes de insertar
            database.execute("SELECT MAX(ID) FROM OrdenesServicio")
            max_id_result = database.fetchone()
            max_id_before = max_id_result[0] if max_id_result and max_id_result[0] else 0
            
            # Crear la orden de servicio
            database.execute("""
                INSERT INTO OrdenesServicio (FechaEntrada, HoraEntrada, FechaSalidaEstimada, HoraSalidaEstimada, CodigoVehiculo, Comentario)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (
                service_order_data["FechaEntrada"],
                service_order_data["HoraEntrada"],
                service_order_data["FechaSalidaEstimada"],
                service_order_data["HoraSalidaEstimada"],
                service_order_data["CodigoVehiculo"],
                service_order_data["Comentario"] or ''
            ))
            
            # Obtener el nuevo ID máximo (que será el ID de la orden creada)
            database.execute("SELECT MAX(ID) FROM OrdenesServicio")
            result = database.fetchone()
            order_id = result[0] if result else None
            
            if not order_id or order_id <= max_id_before:
                raise HTTPException(status_code=500, detail="No se pudo obtener el ID de la orden creada")
            
            # Asignar empleados a la orden
            for empleado_ci in service_order_data["EmpleadosAsignados"]:
                database.execute("""
                    INSERT INTO EmpleadosOrdenes (EmpleadoCI, OrdenServicioID)
                    VALUES (?, ?)
                """, (empleado_ci, order_id))
            
            # Confirmar transacción
            database.execute("COMMIT")
            return {"message": "Orden de servicio creada exitosamente", "order_id": order_id}
            
        except Exception as e:
            # Revertir transacción en caso de error
            database.execute("ROLLBACK")
            raise HTTPException(status_code=500, detail=f"Error creating service order: {str(e)}")

    def createInvoiceWithPayments(self, invoice_data: dict):
        """
        Crea una factura con múltiples métodos de pago en una sola transacción.
        Incluye impresión fiscal automática y manejo de montos con valor -1 (restante).
        """
        try:
            # Extraer datos de la factura
            numero_orden = invoice_data.get('NumeroOrden')
            franquicia_rif = invoice_data.get('FranquiciaRIF')
            fecha_factura = invoice_data.get('FechaFactura')
            monto_total = invoice_data.get('MontoTotal')
            metodos_pago = invoice_data.get('MetodosPago', [])
            porcentaje_descuento = invoice_data.get('PorcentajeDescuento', 0)  # Porcentaje de descuento
            monto_iva = invoice_data.get('MontoIVA', 0)  # Monto del IVA calculado en el frontend

            # Usar el IVA calculado en el frontend o calcularlo si no se proporciona
            iva = monto_iva if monto_iva > 0 else (monto_total or 0) * 0.15
            descuento = porcentaje_descuento  # Guardar el porcentaje de descuento

            # Insertar la factura
            database.execute("""
                INSERT INTO Facturas (FechaEmision, MontoTotal, IVA, Descuento, OrdenServicioID, FranquiciaRIF)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (fecha_factura, monto_total, iva, descuento, numero_orden, franquicia_rif))
            
            # Obtener el número de factura recién creada
            database.execute("SELECT @@IDENTITY")
            result = database.fetchone()
            numero_factura = result[0] if result else None
            
            # Verificar que se obtuvo un número de factura válido
            if not numero_factura:
                raise HTTPException(status_code=500, detail="No se pudo obtener el número de factura")
            
            # Calcular montos reales para la base de datos cuando se usa -1
            print(f"\n💰 CALCULANDO MONTOS REALES PARA BASE DE DATOS:")
            print(f"   - Total factura: ${monto_total}")
            
            # Calcular el monto restante para los métodos con -1
            total_pagado_especifico = 0
            metodos_pago_procesados = []
            
            # Primera pasada: calcular total de montos específicos
            for metodo_pago in metodos_pago:
                cantidad = metodo_pago.get('Cantidad')
                if cantidad != -1:
                    total_pagado_especifico += cantidad
                    metodos_pago_procesados.append({
                        **metodo_pago,
                        'monto_real': cantidad
                    })
                else:
                    metodos_pago_procesados.append({
                        **metodo_pago,
                        'monto_real': None  # Se calculará después
                    })
            
            # Segunda pasada: calcular montos reales para -1
            monto_restante = (monto_total or 0) - total_pagado_especifico
            print(f"   - Total pagado específico: ${total_pagado_especifico}")
            print(f"   - Monto restante: ${monto_restante}")
            
            for i, metodo_procesado in enumerate(metodos_pago_procesados):
                if metodo_procesado['monto_real'] is None:
                    metodo_procesado['monto_real'] = monto_restante
                    print(f"   - Método {i+1} ({metodo_procesado['Metodo']}): -1 → ${monto_restante}")
                    # Solo el primer -1 toma el restante completo
                    monto_restante = 0
            
            # Insertar los métodos de pago con montos reales
            for i, metodo_procesado in enumerate(metodos_pago_procesados):
                numero_correlativo = i + 1
                tipo = metodo_procesado.get('Metodo')
                monto_real = metodo_procesado.get('monto_real', 0)
                descripcion = metodo_procesado.get('Descripcion', '')

                print(f"   📝 Insertando pago {numero_correlativo}: {tipo} - ${monto_real}")

                # Determinar qué campos llenar según el tipo de pago según el modelo Pay
                if tipo == 'Efectivo':
                    # Campos específicos para pago en efectivo
                    # IMPORTANTE: Usar monto_real en lugar del campo original que puede tener -1
                    monto_efectivo = monto_real  # Siempre usar el monto calculado
                    moneda_efectivo = metodo_procesado.get('MonedaEfectivo', 'Dolar')  # Sin acento según la constraint
                    
                    print(f"     💾 BD: Insertando efectivo con monto real: ${monto_efectivo}")
                    
                    database.execute("""
                        INSERT INTO Pagos (NumeroFactura, NumeroCorrelativoPago, Tipo, MontoEfectivo, MonedaEfectivo)
                        VALUES (?, ?, ?, ?, ?)
                    """, (numero_factura, numero_correlativo, tipo, monto_efectivo, moneda_efectivo))
                    
                elif tipo == 'Tarjeta':
                    # Campos específicos para pago con tarjeta
                    fecha_tarjeta = metodo_procesado.get('FechaTarjeta') or fecha_factura  # Usar fecha de factura si no hay fecha específica
                    # IMPORTANTE: Usar monto_real en lugar del campo original que puede tener -1
                    monto_tarjeta = monto_real  # Siempre usar el monto calculado
                    banco_tarjeta = metodo_procesado.get('BancoTarjeta') or 'Banco Nacional'  # Valor por defecto
                    modalidad_tarjeta = metodo_procesado.get('ModalidadTarjeta') or 'Ahorro'  # Valor por defecto
                    numero_tarjeta = metodo_procesado.get('NumeroTarjeta') or '1234567890123456'  # Valor por defecto
                    
                    print(f"     💾 BD: Insertando tarjeta con monto real: ${monto_tarjeta}")
                    
                    database.execute("""
                        INSERT INTO Pagos (NumeroFactura, NumeroCorrelativoPago, Tipo, FechaTarjeta, MontoTarjeta, BancoTarjeta, ModalidadTarjeta, NumeroTarjeta)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    """, (numero_factura, numero_correlativo, tipo, fecha_tarjeta, monto_tarjeta, banco_tarjeta, modalidad_tarjeta, numero_tarjeta))
                    
                elif tipo == 'Pago Móvil':
                    # Campos específicos para pago móvil
                    fecha_pago_movil = metodo_procesado.get('FechaPagoMovil') or fecha_factura  # Usar fecha de factura si no hay fecha específica
                    telefono_pago_movil = metodo_procesado.get('TelefonoPagoMovil') or '04121234567'  # Valor por defecto
                    referencia_pago_movil = metodo_procesado.get('ReferenciaPagoMovil') or 'REF001'  # Valor por defecto
                    # IMPORTANTE: Usar monto_real en lugar del campo original que puede tener -1
                    monto_pago_movil = monto_real  # Siempre usar el monto calculado
                    
                    print(f"     💾 BD: Insertando pago móvil con monto real: ${monto_pago_movil}")
                    
                    database.execute("""
                        INSERT INTO Pagos (NumeroFactura, NumeroCorrelativoPago, Tipo, FechaPagoMovil, TelefonoPagoMovil, ReferenciaPagoMovil, MontoPagoMovil)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                    """, (numero_factura, numero_correlativo, tipo, fecha_pago_movil, telefono_pago_movil, referencia_pago_movil, monto_pago_movil))
                    
                else:  # Método no reconocido, usar efectivo como fallback
                    print(f"     💾 BD: Insertando método no reconocido como efectivo con monto real: ${monto_real}")
                    
                    database.execute("""
                        INSERT INTO Pagos (NumeroFactura, NumeroCorrelativoPago, Tipo, MontoEfectivo, MonedaEfectivo)
                        VALUES (?, ?, ?, ?, ?)
                    """, (numero_factura, numero_correlativo, tipo, monto_real, 'Dolar'))
            
            # Confirmar transacción en la base de datos
            conn.commit()
            
            # --- IMPRESIÓN FISCAL AUTOMÁTICA ---
            try:
                print("\n" + "="*60)
                print("🚀 INICIANDO IMPRESIÓN FISCAL AUTOMÁTICA")
                print("="*60)
                
                # Importar el módulo de factura fiscal
                from . import factura
                
                # Validar que los datos necesarios no sean None
                if not franquicia_rif or not numero_orden:
                    raise ValueError("franquicia_rif y numero_orden son requeridos para la impresión fiscal")
                
                print(f"📋 Datos de factura recibidos:")
                print(f"   - Número de orden: {numero_orden}")
                print(f"   - RIF Franquicia: {franquicia_rif}")
                print(f"   - Monto total: {monto_total}")
                print(f"   - Descuento: {porcentaje_descuento}%")
                print(f"   - Métodos de pago: {len(metodos_pago)}")
                
                # Crear instancia de GetService para acceder a los métodos necesarios
                get_service = GetService()
                
                # Obtener detalles de la orden
                print(f"\n📋 Obteniendo detalles de la orden {numero_orden}...")
                order_details = get_service.getOrderDetails(franquicia_rif, numero_orden)
                print(f"✅ Detalles de orden obtenidos:")
                print(f"   - Cliente: {order_details.get('order', {}).get('NombreCliente', 'N/A')}")
                print(f"   - CI Cliente: {order_details.get('order', {}).get('CI_Cliente', 'N/A')}")
                
                # Obtener actividades de la orden
                print(f"\n📋 Obteniendo actividades de la orden {numero_orden}...")
                activities = get_service.getActivitiesByOrder(numero_orden)
                print(f"✅ Actividades obtenidas: {len(activities)} actividades")
                for i, activity in enumerate(activities):
                    print(f"   {i+1}. {activity.get('NombreServicio', 'N/A')}: {activity.get('DescripcionActividad', 'N/A')} - ${activity.get('Costo_Act', 0)}")
                
                # Mostrar productos de la orden
                products_from_order = order_details.get('products', [])
                print(f"\n📦 Productos utilizados en la orden: {len(products_from_order)} productos")
                for i, product in enumerate(products_from_order):
                    print(f"   {i+1}. {product.get('NombreProducto', 'N/A')} - Cantidad: {product.get('CantidadUtilizada', 0)} - Precio: ${product.get('PrecioProducto', 0)}")
                
                # Generar JSON para mostrar en consola
                print(f"\n📋 Generando JSON para impresora fiscal...")
                json_factura = factura.generar_json_factura(
                    invoice_data=invoice_data,
                    order_details=order_details,
                    activities=activities,
                    franquicia_rif=franquicia_rif
                )
                
                print(f"\n📄 JSON GENERADO PARA IMPRESORA FISCAL:")
                print("-" * 60)
                print(json_factura)
                print("-" * 60)
                
                # Imprimir factura fiscal
                print(f"\n🖨️ Enviando a impresora fiscal (COM8)...")
                resultado_impresion = factura.imprimir_factura_fiscal(
                    invoice_data=invoice_data,
                    order_details=order_details,
                    activities=activities,
                    franquicia_rif=franquicia_rif,
                    puerto_serial="COM8"  # Puerto por defecto
                )
                
                # Agregar información de impresión al resultado
                return {
                    "message": "Invoice created successfully", 
                    "numero_factura": numero_factura,
                    "impresion_fiscal": resultado_impresion
                }
                
            except Exception as e:
                # Si hay error en la impresión, no fallar la creación de la factura
                print(f"\n❌ ERROR EN IMPRESIÓN FISCAL:")
                print(f"   - Error: {e}")
                print(f"   - Tipo: {type(e).__name__}")
                print(f"   - La factura se creó exitosamente en la base de datos")
                print(f"   - Número de factura: {numero_factura}")
                print("="*60)
                return {
                    "message": "Invoice created successfully (error en impresión fiscal)", 
                    "numero_factura": numero_factura,
                    "impresion_fiscal": {
                        "success": False,
                        "message": f"Error en impresión fiscal: {str(e)}"
                    }
                }
                
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Error creating invoice: {str(e)}")

class DeleteService:
    def deleteData(self, table_name: str, **filters):
        """
        Elimina datos de cualquier tabla del sistema usando filtros específicos.
        Método genérico que construye dinámicamente la consulta DELETE.
        """
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
        """
        Actualiza datos en cualquier tabla del sistema usando filtros específicos.
        Método genérico que construye dinámicamente la consulta UPDATE.
        """
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


