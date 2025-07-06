# Documentación de Consultas SQL - services.py

Este documento contiene todas las consultas SQL utilizadas en el archivo `services.py`, organizadas por clase de servicio y método.

## Índice

1. [GetService](#getservice)
2. [PostService](#postservice)
3. [DeleteService](#deleteservice)
4. [UpdateService](#updateservice)

---

## GetService

### Métodos de Consulta General

#### `getAll(table_name: str)`
**Descripción:** Obtiene todos los registros de una tabla específica.

```sql
SELECT * FROM {table_name}
```

#### `getDataById(table_name: str, **filters)`
**Descripción:** Obtiene un registro específico por filtros (generalmente ID).

```sql
SELECT * FROM {table_name} WHERE {where_clause}
```

#### `getDataByFilter(table_name: str, **filters)`
**Descripción:** Obtiene registros que coincidan con los filtros especificados.

```sql
SELECT * FROM {table_name} WHERE {where_clause}
```

#### `getDataByView(table_name: str, **filters)`
**Descripción:** Obtiene datos de una vista con filtros específicos.

```sql
SELECT * FROM {table_name} WHERE {where_clause}
```

### Métodos de Búsqueda

#### `searchDataEmployee(table_name: str, query: str)`
**Descripción:** Busca empleados por CI o nombre completo.

```sql
SELECT TOP 10 CI, NombreCompleto 
FROM {table_name} 
WHERE CI LIKE ?
```

#### `searchDataFranchise(table_name: str, query: str)`
**Descripción:** Busca franquicias por RIF.

```sql
SELECT TOP 10 * 
FROM {table_name} 
WHERE RIF LIKE ?
```

#### `searchDataBrand(table_name: str, query: str)`
**Descripción:** Busca marcas por nombre.

```sql
SELECT TOP 10 * 
FROM {table_name} 
WHERE Nombre LIKE ?
```

#### `searchDataFilters(table_name: str, q: str, **filters)`
**Descripción:** Busca datos con filtros adicionales y búsqueda por CI.

```sql
SELECT * FROM {table_name} 
WHERE {where_clause} AND CI LIKE ?
```

#### `searchDataSupplierLines(table_name: str, query: str)`
**Descripción:** Busca líneas de suministro por descripción.

```sql
SELECT TOP 10 * 
FROM {table_name} 
WHERE DescripcionLinea LIKE ?
```

#### `searchDataVendors(table_name: str, query: str)`
**Descripción:** Busca proveedores por razón social.

```sql
SELECT TOP 10 * 
FROM {table_name} 
WHERE RazonSocial LIKE ?
```

#### `searchDataMaintenancePlans(table_name: str, query: str)`
**Descripción:** Busca planes de mantenimiento por descripción.

```sql
SELECT TOP 10 * 
FROM {table_name} 
WHERE DescripcionMantenimiento LIKE ?
```

#### `searchDataBrands(table_name: str, query: str)`
**Descripción:** Busca marcas por nombre.

```sql
SELECT TOP 10 * 
FROM {table_name} 
WHERE Nombre LIKE ?
```

#### `searchDataModels(table_name: str, query: str)`
**Descripción:** Busca modelos por descripción.

```sql
SELECT TOP 10 * 
FROM {table_name} 
WHERE DescripcionModelo LIKE ?
```

#### `searchDataSpecialties(table_name: str, query: str)`
**Descripción:** Busca especialidades por descripción.

```sql
SELECT TOP 10 * 
FROM {table_name} 
WHERE DescripcionEspecialidad LIKE ?
```

#### `searchDataServices(table_name: str, query: str)`
**Descripción:** Busca servicios por nombre.

```sql
SELECT TOP 10 * 
FROM {table_name} 
WHERE NombreServicio LIKE ?
```

### Métodos de Conteo

#### `countData(table_name: str)`
**Descripción:** Cuenta el total de registros en una tabla.

```sql
SELECT COUNT(*) FROM {table_name}
```

#### `countDistinctData(table_name: str, column_name: str)`
**Descripción:** Cuenta valores distintos de una columna específica.

```sql
SELECT COUNT(DISTINCT {table_name}.{column_name}) FROM {table_name}
```

#### `countDistinctDataByFranchise(table_name: str, column_name: str, **filters)`
**Descripción:** Cuenta valores distintos de una columna con filtros por franquicia.

```sql
SELECT COUNT(DISTINCT {table_name}.{column_name}) 
FROM {table_name} 
WHERE {where_clause}
```

#### `countDataByFranchise(table_name: str, **filters)`
**Descripción:** Cuenta registros con filtros por franquicia.

```sql
SELECT COUNT(*) FROM {table_name} WHERE {where_clause}
```

### Consultas de Inventario

#### `getInventoryByFranchise(franquicia_rif: str)`
**Descripción:** Obtiene el inventario completo de una franquicia.

```sql
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
```

#### `searchInventoryByFranchise(franquicia_rif: str, query: str)`
**Descripción:** Busca productos en el inventario de una franquicia.

```sql
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
```

#### `getScarceProductsByFranchise(franquicia_rif: str)`
**Descripción:** Obtiene productos con stock bajo en una franquicia.

```sql
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
```

#### `getExcessProductsByFranchise(franquicia_rif: str)`
**Descripción:** Obtiene productos con stock excesivo en una franquicia.

```sql
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
```

#### `getProductByFranchiseAndCode(franquicia_rif: str, codigo_producto: int)`
**Descripción:** Obtiene un producto específico del inventario de una franquicia.

```sql
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
```

### Consultas de Órdenes de Servicio

#### `getOrdersByFranchise(franquicia_rif: str, mes: Optional[int] = None, anio: Optional[int] = None, estado: Optional[str] = None)`
**Descripción:** Obtiene órdenes de servicio de una franquicia con filtros opcionales.

```sql
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
-- Filtros adicionales según parámetros
ORDER BY os.FechaEntrada DESC
```

#### `getOrdersStatsByFranchise(franquicia_rif: str, mes: Optional[int] = None, anio: Optional[int] = None)`
**Descripción:** Obtiene estadísticas de órdenes de servicio de una franquicia.

```sql
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
-- Filtros adicionales según parámetros
```

#### `getOrderDetails(franquicia_rif: str, numero_orden: int)`
**Descripción:** Obtiene detalles completos de una orden de servicio.

**Consulta 1 - Información de la orden:**
```sql
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
```

**Consulta 2 - Empleados asignados:**
```sql
SELECT DISTINCT
    e.CI,
    e.NombreCompleto,
    e.Rol,
    e.Telefono
FROM EmpleadosOrdenes eo
INNER JOIN Empleados e ON eo.EmpleadoCI = e.CI
WHERE eo.OrdenServicioID = ? AND e.FranquiciaRIF = ?
ORDER BY e.NombreCompleto
```

**Consulta 3 - Productos utilizados:**
```sql
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
```

### Consultas de Facturas

#### `getInvoicesByFranchise(franquicia_rif: str, mes: Optional[int] = None, anio: Optional[int] = None)`
**Descripción:** Obtiene facturas de una franquicia con filtros opcionales.

```sql
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
-- Filtros adicionales según parámetros
ORDER BY f.FechaEmision DESC
```

#### `getInvoiceDetails(franquicia_rif: str, numero_factura: int)`
**Descripción:** Obtiene detalles completos de una factura.

```sql
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
```

### Consultas de Compras

#### `getPurchasesByFranchise(franquicia_rif: str, mes: Optional[int] = None, anio: Optional[int] = None)`
**Descripción:** Obtiene compras de una franquicia con filtros opcionales.

```sql
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
-- Filtros adicionales según parámetros
ORDER BY c.Fecha DESC
```

#### `getPurchaseDetails(franquicia_rif: str, numero_compra: int)`
**Descripción:** Obtiene detalles completos de una compra.

```sql
SELECT c.Numero, c.Fecha, c.ProveedorRIF, p.RazonSocial, p.Direccion, p.TelefonoLocal, p.PersonaContacto,
       ai.CodigoProducto, prod.NombreProducto, ai.CantidadPedida, ai.CantidadDisponible, ai.Monto
FROM Compras c
JOIN Proveedores p ON c.ProveedorRIF = p.RIF
JOIN AumentosInventario ai ON c.Numero = ai.NumeroCompra
JOIN Productos prod ON ai.CodigoProducto = prod.CodigoProducto
WHERE ai.FranquiciaRIF = ? AND c.Numero = ?
ORDER BY ai.CodigoProducto
```

### Consultas de Servicios y Actividades

#### `getServicesByFranchise(franquicia_rif: str)`
**Descripción:** Obtiene todos los servicios que ofrece una franquicia específica.

```sql
SELECT s.CodigoServicio, s.NombreServicio
FROM Servicios s
JOIN ServiciosFranquicias sf ON s.CodigoServicio = sf.CodigoServicio
WHERE sf.FranquiciaRIF = ?
ORDER BY s.CodigoServicio
```

#### `getActivitiesByService(codigo_servicio: int)`
**Descripción:** Obtiene todas las actividades de un servicio específico.

```sql
SELECT CodigoServicio, NumeroCorrelativoActividad, DescripcionActividad
FROM Actividades
WHERE CodigoServicio = ?
ORDER BY NumeroCorrelativoActividad
```

### Consultas de Correcciones

#### `checkCorrectionExists(franquicia_rif: str, codigo_producto: int)`
**Descripción:** Verifica si un producto ya ha sido corregido en el mes y año actual.

```sql
SELECT COUNT(*) FROM Correcciones 
WHERE FranquiciaRIF = ? 
AND CodigoProducto = ? 
AND MONTH(FechaCorreccion) = ? 
AND YEAR(FechaCorreccion) = ?
```

#### `getCorrectionHistory(franquicia_rif: str, mes: Optional[int] = None, anio: Optional[int] = None)`
**Descripción:** Obtiene el historial de correcciones de una franquicia.

```sql
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
-- Filtros adicionales según parámetros
ORDER BY c.FechaCorreccion DESC
```

### Consultas de Marcas y Modelos

#### `getModelsByBrand(codigo_marca: int)`
**Descripción:** Obtiene todos los modelos de una marca específica.

```sql
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
```

#### `checkBrandHasModels(codigo_marca: int)`
**Descripción:** Verifica si una marca tiene modelos asociados.

```sql
SELECT COUNT(*) as model_count
FROM Modelos
WHERE CodigoMarca = ?
```

#### `getNextModelCorrelativeNumber(codigo_marca: int)`
**Descripción:** Obtiene el siguiente número correlativo para modelos de una marca específica.

```sql
SELECT COALESCE(MAX(NumeroCorrelativoModelo), 0) + 1 as next_number
FROM Modelos
WHERE CodigoMarca = ?
```

#### `getMaintenancePlansByModel(codigo_marca: int, numero_correlativo_modelo: int)`
**Descripción:** Obtiene todos los planes de mantenimiento para un modelo específico.

```sql
SELECT 
    pm.CodigoMantenimiento,
    pm.TiempoUso,
    pm.Kilometraje,
    pm.DescripcionMantenimiento,
    pm.CodigoMarca,
    pm.NumeroCorrelativoModelo
FROM PlanesMantenimiento pm
WHERE pm.CodigoMarca = ? AND pm.NumeroCorrelativoModelo = ?
```

### Consultas de Empleados y Especialidades

#### `getEmployeeSpecialties(empleado_ci: str)`
**Descripción:** Obtiene las especialidades de un empleado específico.

```sql
SELECT 
    e.CodigoEspecialidad,
    e.DescripcionEspecialidad
FROM EspecialidadesEmpleados ee
INNER JOIN Especialidades e ON ee.CodigoEspecialidad = e.CodigoEspecialidad
WHERE ee.EmpleadoCI = ?
```

#### `getActiveEmployeesByFranchise(franquicia_rif: str)`
**Descripción:** Obtiene empleados activos de una franquicia.

```sql
SELECT CI, NombreCompleto, Rol
FROM Empleados 
WHERE FranquiciaRIF = ? AND Estado = 'Activo'
ORDER BY NombreCompleto
```

### Consultas de Proveedores y Productos

#### `getProductsByVendor(proveedor_rif: str)`
**Descripción:** Obtiene productos suministrados por un proveedor específico.

```sql
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
```

#### `getPurchaseNumber(fecha: str, proveedor_rif: str)`
**Descripción:** Obtiene el número de compra para una fecha y proveedor específicos.

```sql
SELECT COUNT(*) + 1
FROM Compras
WHERE CONVERT(DATE, Fecha) = ? AND ProveedorRIF = ?
```

### Consultas de Clientes y Vehículos

#### `getCustomerFrequency(mes, anio)`
**Descripción:** Obtiene la frecuencia de visitas de clientes por mes y año.

```sql
SELECT c.CI, c.NombreCompleto, c.Email, COUNT(os.ID) AS FrecuenciaMensual
FROM Clientes c
LEFT JOIN Vehiculos v ON c.CI = v.CedulaCliente
LEFT JOIN OrdenesServicio os ON v.CodigoVehiculo = os.CodigoVehiculo
    AND MONTH(os.FechaEntrada) = ? AND YEAR(os.FechaEntrada) = ?
GROUP BY c.CI, c.NombreCompleto, c.Email
ORDER BY FrecuenciaMensual DESC
```

#### `getCustomerTotalFrequency()`
**Descripción:** Obtiene la frecuencia total de visitas de todos los clientes.

```sql
SELECT c.CI, c.NombreCompleto, c.Email, COUNT(os.ID) AS FrecuenciaTotal
FROM Clientes c
LEFT JOIN Vehiculos v ON c.CI = v.CedulaCliente
LEFT JOIN OrdenesServicio os ON v.CodigoVehiculo = os.CodigoVehiculo
GROUP BY c.CI, c.NombreCompleto, c.Email
ORDER BY FrecuenciaTotal DESC
```

#### `getCustomerFrequencyLast3Months(customer_ci: str)`
**Descripción:** Obtiene la frecuencia de visitas de un cliente en los últimos 3 meses.

```sql
SELECT COUNT(os.ID) AS FrecuenciaUltimos3Meses
FROM Clientes c
LEFT JOIN Vehiculos v ON c.CI = v.CedulaCliente
LEFT JOIN OrdenesServicio os ON v.CodigoVehiculo = os.CodigoVehiculo
WHERE c.CI = ? 
  AND os.FechaEntrada >= DATEADD(MONTH, -3, GETDATE())
  AND os.FechaEntrada <= GETDATE()
```

#### `getOrdersByVehicle(codigo_vehiculo: int)`
**Descripción:** Obtiene todas las órdenes de servicio de un vehículo específico.

```sql
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
```

### Consultas de Órdenes de Servicio Globales

#### `getAllServiceOrders()`
**Descripción:** Obtiene todas las órdenes de servicio del sistema.

```sql
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
```

#### `get_pending_service_orders_by_employee(CI: str)`
**Descripción:** Obtiene órdenes de servicio pendientes de un empleado específico.

```sql
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
```

#### `getActivitiesByOrder(id_orden: int)`
**Descripción:** Obtiene las actividades de una orden de servicio específica.

```sql
SELECT oa.CodigoServicio, s.NombreServicio, oa.NumeroCorrelativoActividad, a.DescripcionActividad, oa.Costo_Act
FROM OrdenesActividades oa
INNER JOIN Servicios s ON oa.CodigoServicio = s.CodigoServicio
INNER JOIN Actividades a ON oa.CodigoServicio = a.CodigoServicio AND oa.NumeroCorrelativoActividad = a.NumeroCorrelativoActividad
WHERE oa.IDorden = ?
ORDER BY s.NombreServicio, oa.NumeroCorrelativoActividad
```

#### `getServicesByOrder(numero_orden: int)`
**Descripción:** Obtiene los servicios de una orden específica.

```sql
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
```

### Métodos de Inventario (Deprecados)

#### `getProductQuantity(franquicia_rif: str, codigo_producto: int)`
**Descripción:** Obtiene la cantidad actual de un producto en el inventario de una franquicia (DEPRECADO - Usar triggers).

```sql
SELECT Cantidad FROM ProductosFranquicia WHERE FranquiciaRIF = ? AND CodigoProducto = ?
```

#### `updateProductQuantity(franquicia_rif: str, codigo_producto: int, new_quantity: int)`
**Descripción:** Actualiza la cantidad de un producto en el inventario (DEPRECADO - Usar triggers).

```sql
UPDATE ProductosFranquicia SET Cantidad = ? WHERE FranquiciaRIF = ? AND CodigoProducto = ?
```

#### `insertNewProductToFranchise(franquicia_rif: str, codigo_producto: int, cantidad: int)`
**Descripción:** Inserta un nuevo producto al inventario de una franquicia (DEPRECADO - Usar triggers).

```sql
INSERT INTO ProductosFranquicia (FranquiciaRIF, CodigoProducto, Cantidad, Precio, CantidadMinima, CantidadMaxima) 
VALUES (?, ?, ?, ?, ?, ?)
```

---

## PostService

### Métodos de Inserción

#### `postData(table_name: str, data: dict)`
**Descripción:** Inserta datos en una tabla específica.

```sql
INSERT INTO {table_name} ({columns}) VALUES ({placeholders})
```

#### `postModelData(data: dict)`
**Descripción:** Crea un modelo con auto-incremento del NumeroCorrelativoModelo.

**Consulta 1 - Obtener siguiente número:**
```sql
SELECT MAX(NumeroCorrelativoModelo) FROM Modelos WHERE CodigoMarca = ?
```

**Consulta 2 - Insertar modelo:**
```sql
INSERT INTO Modelos ({columns}) VALUES ({placeholders})
```

#### `createPurchaseWithInventory(purchase_data: dict)`
**Descripción:** Crea una compra y actualiza el inventario en una sola transacción.

**Consulta 1 - Crear compra:**
```sql
INSERT INTO Compras (Fecha, ProveedorRIF) VALUES (?, ?)
```

**Consulta 2 - Crear aumentos de inventario:**
```sql
INSERT INTO AumentosInventario (NumeroCompra, FranquiciaRIF, CodigoProducto, CantidadPedida, CantidadDisponible, Monto) 
VALUES (?, ?, ?, ?, ?, ?)
```

#### `createCorrectionWithInventory(correction_data: dict)`
**Descripción:** Crea una corrección de inventario.

```sql
INSERT INTO Correcciones (FranquiciaRIF, CodigoProducto, FechaCorreccion, Cantidad, TipoAjuste, Comentario)
VALUES (?, ?, ?, ?, ?, ?)
```

#### `createServiceOrderWithEmployees(service_order_data: dict)`
**Descripción:** Crea una orden de servicio y asigna empleados.

**Consulta 1 - Obtener ID máximo antes de insertar:**
```sql
SELECT MAX(ID) FROM OrdenesServicio
```

**Consulta 2 - Crear orden de servicio:**
```sql
INSERT INTO OrdenesServicio (FechaEntrada, HoraEntrada, FechaSalidaEstimada, HoraSalidaEstimada, CodigoVehiculo, Comentario)
VALUES (?, ?, ?, ?, ?, ?)
```

**Consulta 3 - Obtener ID de la orden creada:**
```sql
SELECT MAX(ID) FROM OrdenesServicio
```

**Consulta 4 - Asignar empleados:**
```sql
INSERT INTO EmpleadosOrdenes (EmpleadoCI, OrdenServicioID) VALUES (?, ?)
```

#### `createInvoiceWithPayments(invoice_data: dict)`
**Descripción:** Crea una factura con métodos de pago.

**Consulta 1 - Insertar factura:**
```sql
INSERT INTO Facturas (FechaEmision, MontoTotal, IVA, Descuento, OrdenServicioID, FranquiciaRIF)
VALUES (?, ?, ?, ?, ?, ?)
```

**Consulta 2 - Obtener número de factura:**
```sql
SELECT @@IDENTITY
```

**Consulta 3 - Insertar pagos (Efectivo):**
```sql
INSERT INTO Pagos (NumeroFactura, NumeroCorrelativoPago, Tipo, MontoEfectivo, MonedaEfectivo)
VALUES (?, ?, ?, ?, ?)
```

**Consulta 4 - Insertar pagos (Tarjeta):**
```sql
INSERT INTO Pagos (NumeroFactura, NumeroCorrelativoPago, Tipo, FechaTarjeta, MontoTarjeta, BancoTarjeta, ModalidadTarjeta, NumeroTarjeta)
VALUES (?, ?, ?, ?, ?, ?, ?, ?)
```

**Consulta 5 - Insertar pagos (Pago Móvil):**
```sql
INSERT INTO Pagos (NumeroFactura, NumeroCorrelativoPago, Tipo, FechaPagoMovil, TelefonoPagoMovil, ReferenciaPagoMovil, MontoPagoMovil)
VALUES (?, ?, ?, ?, ?, ?, ?)
```

---

## DeleteService

### Métodos de Eliminación

#### `deleteData(table_name: str, **filters)`
**Descripción:** Elimina datos de una tabla específica según filtros.

```sql
DELETE FROM {table_name} WHERE {where_clause}
```

---

## UpdateService

### Métodos de Actualización

#### `updateData(table_name: str, data: dict, **filters)`
**Descripción:** Actualiza datos en una tabla específica según filtros.

```sql
UPDATE {table_name} SET {set_clause} WHERE {where_clause}
```

---

## Notas Importantes

### Triggers de Base de Datos
- El sistema utiliza triggers para actualizar automáticamente el inventario cuando se crean compras o correcciones
- Los métodos `getProductQuantity`, `updateProductQuantity`, e `insertNewProductToFranchise` están marcados como deprecados debido al uso de triggers

### Transacciones
- Los métodos que involucran múltiples operaciones utilizan transacciones para garantizar la integridad de los datos
- En caso de error, se ejecuta rollback automáticamente

### Parámetros Opcionales
- Muchos métodos aceptan parámetros opcionales como `mes`, `anio`, y `estado`
- Estos parámetros se agregan dinámicamente a las consultas SQL cuando están presentes

### Ordenamiento
- La mayoría de las consultas incluyen cláusulas ORDER BY para garantizar un orden consistente
- Las fechas generalmente se ordenan de forma descendente (más recientes primero)

### Joins
- Se utilizan INNER JOIN para relaciones obligatorias
- Se utilizan LEFT JOIN para relaciones opcionales (como facturas que pueden no existir)

### Estados de Órdenes
- El sistema calcula dinámicamente el estado de las órdenes basándose en:
  - `FechaSalidaReal`: Si está presente, la orden está completada
  - `NumeroFactura`: Si está presente, la factura fue generada
  - Estados posibles: 'En Proceso', 'A Facturar', 'Completado' 