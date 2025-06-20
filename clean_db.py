from database import database, conn

def clean_tables():
    # Desactivar restricciones de claves foráneas temporalmente
    # database.execute("EXEC sp_msforeachtable 'ALTER TABLE ? NOCHECK CONSTRAINT ALL'")
    # conn.commit()

    tables = [
        "ProductoFranquicia",
        "ServiciosFranquicia",
        "ResponsabilidadEmpleado",
        "EspecialidadEmpleado",
        "EmpleadosOrden",
        "OrdenxActividad",
        "TelefonosCliente",
        "Pago",
        "Factura",
        "Compra",
        "OrdenServicio",
        "MantenimientoVehiculos",
        "Vehiculo",
        "Cliente",
        "Empleado",
        "Proveedor",
        "Producto",
        "LineaSuministro",
        "Servicio",
        "Especialidad",
        "Marca",
        "Modelo",
        "Franquicia"
    ]
    for table in tables:
        try:
            database.execute(f"DELETE FROM {table}")
            print(f"Tabla {table} limpiada.")
        except Exception as e:
            print(f"Error limpiando {table}: {e}")

    conn.commit()
    # Reactivar restricciones de claves foráneas
    # database.execute("EXEC sp_msforeachtable 'ALTER TABLE ? WITH CHECK CHECK CONSTRAINT ALL'")
    # conn.commit()
    print("¡Base de datos completamente limpia!")

if __name__ == "__main__":
    clean_tables()