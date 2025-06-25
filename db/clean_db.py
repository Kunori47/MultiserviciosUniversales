from db.database import conn, cursor

def clean_tables():
    """
    Limpia todas las tablas de la base de datos en el orden correcto
    para evitar conflictos de claves foráneas
    """
    try:
        print("Iniciando limpieza de la base de datos...")
        print("=" * 50)
        
        # Orden correcto para eliminar datos (desde tablas dependientes hacia tablas padre)
        tables_order = [
            # Tablas de relación muchos a muchos y dependientes
            "ProductosOrdenesServicio",
            "AumentosInventario", 
            "Correcciones",
            "ProductosFranquicia",
            "ServiciosFranquicias",
            "ResponsabilidadesEmpleados",
            "EspecialidadesEmpleados", 
            "EmpleadosOrdenes",
            "TelefonosClientes",
            "Suministran",
            "MantenimientosVehiculos",
            
            # Tablas con dependencias
            "OrdenesActividades",
            "Actividades", 
            "Pagos",
            "Facturas",
            "OrdenesServicio",
            "Compras",
            "Vehiculos",
            "PlanesMantenimiento",
            "Modelos",
            
            # Tablas principales
            "Marcas",
            "Clientes", 
            "Empleados",
            "Franquicias",
            "Productos",
            "LineasSuministro",
            "Proveedores",
            "Servicios",
            "Especialidades"
        ]
        
        # Limpiar cada tabla
        for table in tables_order:
            try:
                cursor.execute(f"DELETE FROM {table}")
                rows_affected = cursor.rowcount
                print(f"✓ Tabla '{table}' limpiada ({rows_affected} filas eliminadas)")
            except Exception as e:
                # Si la tabla no existe o no tiene datos, continuar
                if "Invalid object name" in str(e):
                    print(f"Tabla '{table}' no existe - omitiendo")
                else:
                    print(f"Error limpiando '{table}': {e}")
        
        # Confirmar cambios
        conn.commit()
        
        # Verificar que las tablas estén vacías
        print("\n" + "=" * 50)
        print("Verificando limpieza...")
        
        cursor.execute("""
        SELECT 
            t.name as tabla,
            p.rows as filas
        FROM sys.tables t
        INNER JOIN sys.partitions p ON t.object_id = p.object_id
        WHERE p.index_id IN (0,1)
        ORDER BY t.name
        """)
        
        results = cursor.fetchall()
        total_rows = 0
        
        for tabla, filas in results:
            if filas > 0:
                print(f" {tabla}: {filas} filas restantes")
                total_rows += filas
            else:
                print(f" {tabla}: vacía")
        
        if total_rows == 0:
            print(f"\n ¡Base de datos completamente limpia!")
            print(f"Total de tablas verificadas: {len(results)}")
        else:
            print(f"\n Quedan {total_rows} filas en total")
            
    except Exception as e:
        print(f"❌ Error durante la limpieza: {e}")
        conn.rollback()
        raise
    finally:
        print("=" * 50)

def reset_identity_columns():
    """
    Reinicia los contadores IDENTITY de las tablas
    """
    try:
        print("Reiniciando contadores IDENTITY...")
        
        # Tablas con IDENTITY que necesitan reinicio
        identity_tables = [
            "Franquicias",
            "Empleados", 
            "Especialidades",
            "Servicios",
            "LineasSuministro", 
            "Productos",
            "Proveedores",
            "Clientes",
            "Marcas",
            "Vehiculos",
            "PlanesMantenimiento",
            "OrdenesServicio", 
            "Facturas",
            "Compras"
        ]
        
        for table in identity_tables:
            try:
                cursor.execute(f"DBCC CHECKIDENT('{table}', RESEED, 0)")
                print(f"✓ Contador IDENTITY de '{table}' reiniciado")
            except Exception as e:
                if "does not have an identity property" in str(e):
                    continue  # La tabla no tiene IDENTITY
                else:
                    print(f"⚠ Error reiniciando IDENTITY de '{table}': {e}")
        
        conn.commit()
        print("✓ Contadores IDENTITY reiniciados")
        
    except Exception as e:
        print(f"❌ Error reiniciando IDENTITY: {e}")

if __name__ == "__main__":
    try:
        clean_tables()
        reset_identity_columns()
        print("\n✅ Proceso de limpieza completado exitosamente!")
        
    except Exception as e:
        print(f"\n❌ Error durante la ejecución: {e}")
    finally:
        if 'conn' in locals():
            conn.close()