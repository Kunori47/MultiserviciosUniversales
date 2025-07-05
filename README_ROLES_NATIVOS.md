# Sistema de Roles Nativos - SQL Server

## Descripción

Este documento describe el sistema de roles nativos implementado en SQL Server para la base de datos Multiservicios Universal. El sistema utiliza roles nativos de SQL Server (`CREATE ROLE`) en lugar de tablas personalizadas para gestionar permisos de acceso.

## Roles Creados

### 1. Administrador
- **Descripción**: Rol con acceso completo a todas las funcionalidades del sistema
- **Permisos**: SELECT, INSERT, UPDATE, DELETE en todas las tablas y vistas
- **Usuario de prueba**: `admin_user` / `Password123!`

### 2. Encargado
- **Descripción**: Rol para gestión de empleados y operaciones diarias
- **Permisos**: 
  - SELECT, INSERT, UPDATE en: Empleados, ProductosFranquicia, OrdenesServicio, Facturas, Compras, AumentosInventario, Correcciones, EmpleadosOrdenes, Clientes, Vehiculos, Servicios, Actividades, Pagos
  - SELECT en todas las vistas
- **Usuario de prueba**: `juan_enc` / `Password123!`

### 3. Empleado
- **Descripción**: Rol con acceso básico para realizar tareas asignadas
- **Permisos**:
  - SELECT en: Empleados, ProductosFranquicia, OrdenesServicio, Facturas, Clientes, Vehiculos, Servicios, Actividades, Pagos
  - INSERT, UPDATE en: OrdenesServicio, Facturas, Pagos
  - SELECT en todas las vistas
- **Usuario de prueba**: `maria_emp` / `Password123!`

## Tablas con Permisos Asignados

### Tablas Principales
- **Franquicias** - Gestión de franquicias
- **Empleados** - Gestión de empleados
- **Clientes** - Gestión de clientes
- **Vehiculos** - Gestión de vehículos
- **ProductosFranquicia** - Inventario de productos
- **OrdenesServicio** - Órdenes de servicio
- **Facturas** - Facturación
- **Compras** - Gestión de compras
- **Pagos** - Gestión de pagos

### Tablas de Configuración
- **Servicios** - Servicios disponibles
- **Actividades** - Actividades de servicios
- **Marcas** - Marcas de vehículos
- **Modelos** - Modelos de vehículos
- **Proveedores** - Proveedores
- **Productos** - Catálogo de productos

### Tablas de Relación
- **EmpleadosOrdenes** - Asignación de empleados a órdenes
- **ServiciosFranquicias** - Servicios por franquicia
- **ProductosOrdenesServicio** - Productos usados en órdenes
- **EspecialidadesEmpleados** - Especialidades de empleados

## Vistas con Permisos

- **Vista_GastoMensualPorFranquicia** - Gastos mensuales por franquicia
- **Vista_MontoGeneradoPorFranquiciaMesAnio** - Montos generados por franquicia
- **Vista_CantidadOrdenesPorFranquiciaMesAnio** - Cantidad de órdenes por franquicia
- **Vista_ResumenMensualFranquiciaSimple** - Resumen mensual completo

## Comandos SQL para Gestión de Roles

### Crear un nuevo rol
```sql
CREATE ROLE [NombreRol]
```

### Asignar permisos a un rol
```sql
GRANT SELECT, INSERT, UPDATE, DELETE ON [Tabla] TO [Rol]
GRANT SELECT ON [Vista] TO [Rol]
```

### Asignar un usuario a un rol
```sql
ALTER ROLE [NombreRol] ADD MEMBER [NombreUsuario]
```

### Remover un usuario de un rol
```sql
ALTER ROLE [NombreRol] DROP MEMBER [NombreUsuario]
```

### Ver roles existentes
```sql
SELECT name, type_desc 
FROM sys.database_principals 
WHERE type = 'R' AND name NOT LIKE 'db_%'
ORDER BY name
```

### Ver permisos de un rol
```sql
SELECT 
    p.name AS PermissionName,
    p.type_desc AS PermissionType,
    o.name AS ObjectName,
    o.type_desc AS ObjectType
FROM sys.database_permissions dp
JOIN sys.database_principals p ON dp.grantee_principal_id = p.principal_id
JOIN sys.objects o ON dp.major_id = o.object_id
WHERE p.name = 'NombreRol'
ORDER BY o.name, p.name
```

## Usuarios de Prueba Creados

| Usuario | Contraseña | Rol | Descripción |
|---------|------------|-----|-------------|
| `admin_user` | `Password123!` | Administrador | Acceso completo |
| `juan_enc` | `Password123!` | Encargado | Gestión operativa |
| `maria_emp` | `Password123!` | Empleado | Acceso básico |

## Ventajas del Sistema de Roles Nativos

### 1. Seguridad Integrada
- Los roles son parte del sistema de seguridad nativo de SQL Server
- Integración automática con el sistema de autenticación de Windows
- Auditoría automática de accesos

### 2. Gestión Simplificada
- No requiere tablas adicionales para gestión de roles
- Comandos SQL estándar para gestión
- Herramientas gráficas de SQL Server Management Studio

### 3. Rendimiento
- Sin joins adicionales para verificar permisos
- Verificación de permisos a nivel de base de datos
- Caché automático de permisos

### 4. Escalabilidad
- Fácil agregar nuevos roles
- Permisos granulares por tabla y operación
- Herencia de permisos automática

## Implementación en la Aplicación

### Conexión con Roles Específicos
```python
# Ejemplo de conexión con usuario específico
connection_string = (
    "Driver={SQL Server};"
    "Server=KUNORI\\SQLEXPRESS;"
    "Database=MultiserviciosUniversal;"
    "UID=admin_user;"
    "PWD=Password123!;"
)
```

### Verificación de Permisos
```python
# Verificar si el usuario actual tiene permisos
def check_user_permission(user_role, table_name, operation):
    role_permissions = {
        'Administrador': ['SELECT', 'INSERT', 'UPDATE', 'DELETE'],
        'Encargado': ['SELECT', 'INSERT', 'UPDATE'],
        'Empleado': ['SELECT', 'INSERT', 'UPDATE']
    }
    
    return operation in role_permissions.get(user_role, [])
```

## Mantenimiento

### Agregar Nuevo Rol
1. Ejecutar `CREATE ROLE [NuevoRol]`
2. Asignar permisos con `GRANT`
3. Crear usuarios y asignarlos al rol

### Modificar Permisos
1. Usar `GRANT` para agregar permisos
2. Usar `REVOKE` para remover permisos
3. Usar `DENY` para denegar permisos explícitamente

### Backup y Restore
- Los roles se incluyen automáticamente en el backup de la base de datos
- Se restauran con la base de datos
- Mantener documentación de roles y permisos

## Seguridad Recomendada

### 1. Contraseñas Fuertes
- Cambiar contraseñas de usuarios de prueba en producción
- Implementar políticas de contraseñas
- Rotación regular de contraseñas

### 2. Principio de Mínimo Privilegio
- Asignar solo los permisos necesarios
- Revisar regularmente los permisos
- Remover permisos no utilizados

### 3. Auditoría
- Habilitar auditoría de SQL Server
- Revisar logs de acceso regularmente
- Monitorear intentos de acceso fallidos

### 4. Actualizaciones
- Mantener SQL Server actualizado
- Aplicar parches de seguridad
- Revisar configuraciones de seguridad 