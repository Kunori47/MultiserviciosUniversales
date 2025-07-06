# Funcionalidad de Eliminación de Empleados con SET DEFAULT

## Descripción

Esta funcionalidad permite que cuando se elimine un empleado de la base de datos, todas las órdenes de servicio asociadas a ese empleado mantengan su integridad referencial estableciendo automáticamente el valor por defecto `'Despedido'` en la tabla `EmpleadosOrdenes`.

## Implementación

### 1. Modificaciones en la Base de Datos

#### Tabla EmpleadosOrdenes
- Se agregó un valor por defecto `DEFAULT 'Despedido'` al campo `EmpleadoCI`
- Se configuró la restricción de clave foránea con `ON DELETE SET DEFAULT`

```sql
CREATE TABLE EmpleadosOrdenes(
    EmpleadoCI VARCHAR(10) DEFAULT 'Despedido',
    OrdenServicioID INT,
    PRIMARY KEY(EmpleadoCI, OrdenServicioID),
    FOREIGN KEY (EmpleadoCI) REFERENCES Empleados(CI)
        ON DELETE SET DEFAULT
        ON UPDATE CASCADE,
    FOREIGN KEY (OrdenServicioID) REFERENCES OrdenesServicio(ID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
)
```

#### Empleado "Despedido"
- Se creó un empleado especial con CI `'Despedido'` que sirve como valor por defecto
- Este empleado se inserta automáticamente en la tabla `Empleados` durante la inicialización

```sql
INSERT INTO Empleados (CI, NombreCompleto, Direccion, Telefono, Salario, FranquiciaRIF, Rol)
VALUES ('Despedido', 'Empleado Despedido', 'N/A', '0000-0000000', 0.00, NULL, 'Empleado')
```

### 2. Trigger de Eliminación

Se creó un trigger `handle_employee_deletion` que se ejecuta después de eliminar un empleado:

```sql
CREATE TRIGGER handle_employee_deletion
ON Empleados
AFTER DELETE
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Log the deletion for audit purposes
    INSERT INTO EmpleadosOrdenes (EmpleadoCI, OrdenServicioID)
    SELECT 
        N'Despedido', 
        eo.OrdenServicioID
    FROM deleted d
    INNER JOIN EmpleadosOrdenes eo ON d.CI = eo.EmpleadoCI;
    
    -- The ON DELETE SET DEFAULT will automatically set EmpleadoCI to 'Despedido'
    -- for all related records in EmpleadosOrdenes
END
```

## Flujo de Funcionamiento

1. **Estado Inicial**: Un empleado está asignado a una orden de servicio
   ```
   EmpleadosOrdenes: EmpleadoCI = 'V-12345678', OrdenServicioID = 1
   ```

2. **Eliminación del Empleado**: Se ejecuta `DELETE FROM Empleados WHERE CI = 'V-12345678'`

3. **Aplicación de SET DEFAULT**: SQL Server automáticamente cambia el valor de `EmpleadoCI` a `'Despedido'`

4. **Aplicación del Trigger**: El trigger `handle_employee_deletion` se ejecuta después para auditoría
   ```
   EmpleadosOrdenes: EmpleadoCI = 'Despedido', OrdenServicioID = 1
   ```

5. **Resultado Final**: La orden de servicio mantiene su integridad referencial con el empleado "Despedido"

## Ventajas

- **Integridad Referencial**: No se pierden datos de las órdenes de servicio
- **Auditoría**: Se mantiene un registro de que el empleado original fue eliminado
- **Consistencia**: Todas las órdenes mantienen una referencia válida
- **Automatización**: No requiere intervención manual

## Archivos Modificados

1. **`db/create_db.py`**
   - Agregado valor por defecto en la tabla `EmpleadosOrdenes`
   - Importación del nuevo trigger

2. **`db/insert_db.py`**
   - Inserción del empleado "Despedido"

3. **`db/create_trigger.py`**
   - Nuevo trigger `create_employee_deletion_trigger()`
   - Función de limpieza `drop_employee_deletion_trigger()`

4. **`test_employee_deletion.py`**
   - Script de prueba para verificar la funcionalidad

## Pruebas

Para probar la funcionalidad, ejecuta:

```bash
python test_employee_deletion.py
```

Este script:
1. Verifica que existe el empleado "Despedido"
2. Crea una orden de servicio de prueba
3. Asigna un empleado a la orden
4. Elimina el empleado
5. Verifica que el valor por defecto se aplicó correctamente
6. Limpia los datos de prueba

## Consideraciones

- El empleado "Despedido" debe existir siempre en la base de datos
- Las órdenes de servicio mantienen su historial completo
- Se puede identificar fácilmente qué órdenes tenían empleados eliminados
- La funcionalidad es transparente para el usuario final

## Uso en la Aplicación

Cuando se elimine un empleado desde la interfaz de usuario:

1. El sistema ejecutará `DELETE FROM Empleados WHERE CI = ?`
2. Automáticamente se aplicará `SET DEFAULT` a todas las órdenes relacionadas
3. Las órdenes mostrarán "Empleado Despedido" en lugar del empleado original
4. No se perderá información histórica de las órdenes de servicio 