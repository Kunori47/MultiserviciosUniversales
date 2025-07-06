from db.database import conn, cursor
import pyodbc

def test_employee_deletion():
    """
    Prueba la funcionalidad de eliminación de empleados con SET DEFAULT
    """
    try:
        print("🧪 Iniciando prueba de eliminación de empleados...")
        print("=" * 50)
        
        # 1. Verificar que existe el empleado "Despedido"
        cursor.execute("SELECT CI, NombreCompleto FROM Empleados WHERE CI = 'Despedido'")
        empleado_despedido = cursor.fetchone()
        
        if empleado_despedido:
            print(f"✅ Empleado 'Despedido' encontrado: {empleado_despedido[1]}")
        else:
            print("❌ Empleado 'Despedido' no encontrado. Creando...")
            cursor.execute("""
                INSERT INTO Empleados (CI, NombreCompleto, Direccion, Telefono, Salario, FranquiciaRIF, Rol)
                VALUES ('Despedido', 'Empleado Despedido', 'N/A', '0000-0000000', 0.00, NULL, 'Empleado')
            """)
            conn.commit()
            print("✅ Empleado 'Despedido' creado")
        
        # 2. Crear una orden de servicio de prueba
        print("\n📋 Creando orden de servicio de prueba...")
        cursor.execute("""
            INSERT INTO OrdenesServicio (FechaEntrada, HoraEntrada, FechaSalidaEstimada, HoraSalidaEstimada, CodigoVehiculo)
            VALUES (GETDATE(), GETDATE(), DATEADD(day, 1, GETDATE()), GETDATE(), 1)
        """)
        conn.commit()
        
        # Obtener el ID de la orden creada
        cursor.execute("SELECT TOP 1 ID FROM OrdenesServicio ORDER BY ID DESC")
        orden_result = cursor.fetchone()
        if not orden_result:
            raise Exception("No se pudo crear la orden de servicio")
        orden_id = orden_result[0]
        print(f"✅ Orden de servicio creada con ID: {orden_id}")
        
        # 3. Asignar un empleado a la orden
        print(f"\n👤 Asignando empleado a la orden {orden_id}...")
        cursor.execute("""
            INSERT INTO EmpleadosOrdenes (EmpleadoCI, OrdenServicioID)
            VALUES ('V-12345678', ?)
        """, orden_id)
        conn.commit()
        print("✅ Empleado asignado a la orden")
        
        # 4. Verificar el estado antes de la eliminación
        print(f"\n🔍 Estado antes de eliminar empleado:")
        cursor.execute("""
            SELECT eo.EmpleadoCI, eo.OrdenServicioID, e.NombreCompleto
            FROM EmpleadosOrdenes eo
            LEFT JOIN Empleados e ON eo.EmpleadoCI = e.CI
            WHERE eo.OrdenServicioID = ?
        """, orden_id)
        antes = cursor.fetchone()
        if antes:
            print(f"   Empleado: {antes[0]} - {antes[2]}")
        else:
            print("   No se encontró asignación de empleado")
        
        # 5. Eliminar el empleado
        print(f"\n🗑️  Eliminando empleado V-12345678...")
        cursor.execute("DELETE FROM Empleados WHERE CI = 'V-12345678'")
        conn.commit()
        print("✅ Empleado eliminado")
        
        # 6. Verificar el estado después de la eliminación
        print(f"\n🔍 Estado después de eliminar empleado:")
        cursor.execute("""
            SELECT eo.EmpleadoCI, eo.OrdenServicioID, e.NombreCompleto
            FROM EmpleadosOrdenes eo
            LEFT JOIN Empleados e ON eo.EmpleadoCI = e.CI
            WHERE eo.OrdenServicioID = ?
        """, orden_id)
        despues = cursor.fetchone()
        if despues:
            print(f"   Empleado: {despues[0]} - {despues[2]}")
            
            # 7. Verificar que el valor por defecto se aplicó correctamente
            if despues[0] == 'Despedido':
                print("✅ SUCCESS: El valor por defecto 'Despedido' se aplicó correctamente")
                print("✅ La integridad referencial se mantiene")
            else:
                print("❌ ERROR: El valor por defecto no se aplicó correctamente")
                print(f"   Valor esperado: 'Despedido', Valor actual: {despues[0]}")
        else:
            print("   No se encontró asignación de empleado después de la eliminación")
        
        # 8. Limpiar datos de prueba
        print(f"\n🧹 Limpiando datos de prueba...")
        cursor.execute("DELETE FROM EmpleadosOrdenes WHERE OrdenServicioID = ?", orden_id)
        cursor.execute("DELETE FROM OrdenesServicio WHERE ID = ?", orden_id)
        conn.commit()
        print("✅ Datos de prueba eliminados")
        
        print("\n" + "=" * 50)
        print("✅ Prueba completada exitosamente!")
        
    except Exception as e:
        print(f"❌ Error durante la prueba: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    test_employee_deletion() 