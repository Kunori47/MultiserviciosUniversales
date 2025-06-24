from db.database import conn, cursor

def seed_tables():
    """
    Inserta datos de prueba en todas las tablas de la base de datos
    """
    try:
        print("Iniciando inserción de datos de prueba...")
        print("=" * 50)
        
        # 1. Franquicias (tabla padre)
        cursor.execute("""
        INSERT INTO Franquicias (RIF, Nombre, Ciudad, CI_Encargado, FechaInicioEncargado, Estatus) 
        VALUES (?, ?, ?, ?, ?, ?)
        """, ("J-2502943211", "Franquicia Central", "Caracas", None, "2024-01-01", "Activo"))
        print("✓ Franquicia insertada")
        
        # 2. Especialidades
        cursor.execute("INSERT INTO Especialidades (DescripcionEspecialidad) VALUES (?)", ("Mecánica General",))
        cursor.execute("INSERT INTO Especialidades (DescripcionEspecialidad) VALUES (?)", ("Electricidad Automotriz",))
        print("✓ Especialidades insertadas")
        
        # 3. Servicios
        cursor.execute("INSERT INTO Servicios (NombreServicio) VALUES (?)", ("Cambio de Aceite",))
        cursor.execute("INSERT INTO Servicios (NombreServicio) VALUES (?)", ("Revisión General",))
        print("✓ Servicios insertados")
        
        # 4. Empleados
        cursor.execute("""
        INSERT INTO Empleados (CI, NombreCompleto, Direccion, Telefono, Salario, FranquiciaRIF) 
        VALUES (?, ?, ?, ?, ?, ?)
        """, ("V12345678", "Ana López García", "Av. Principal #123", "041412345678", 800.00, "J-2502943211"))
        print("✓ Empleado insertado")
        
        # 5. Actualizar Franquicia con CI_Encargado
        cursor.execute("""
        UPDATE Franquicias SET CI_Encargado = ? WHERE RIF = ?
        """, ("V12345678", "J-2502943211"))
        print("✓ Encargado de franquicia asignado")
        
        # 6. Clientes
        cursor.execute("""
        INSERT INTO Clientes (CI, NombreCompleto, Email) 
        VALUES (?, ?, ?)
        """, ("V98765432", "Juan Pérez Rodríguez", "juan.perez@email.com"))
        print("✓ Cliente insertado")
        
        # 7. Teléfonos de Clientes
        cursor.execute("""
        INSERT INTO TelefonosClientes (Cliente, Telefono) 
        VALUES (?, ?)
        """, ("V98765432", "041498765432"))
        cursor.execute("""
        INSERT INTO TelefonosClientes (Cliente, Telefono) 
        VALUES (?, ?)
        """, ("V98765432", "021212345678"))
        print("✓ Teléfonos de cliente insertados")
        
        # 8. Marcas
        cursor.execute("INSERT INTO Marcas (Nombre) VALUES (?)", ("Toyota",))
        cursor.execute("INSERT INTO Marcas (Nombre) VALUES (?)", ("Ford",))
        print("✓ Marcas insertadas")
        
        # 9. Modelos
        cursor.execute("""
        INSERT INTO Modelos (CodigoMarca, NumeroCorrelativoModelo, DescripcionModelo, CantidadPuestos, 
                           TipoRefrigerante, TipoGasolina, TipoAceite, Peso) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (1, 1, "Corolla 2020", 5, "R134a", "Gasolina", "Sintético", 1350.50))
        
        cursor.execute("""
        INSERT INTO Modelos (CodigoMarca, NumeroCorrelativoModelo, DescripcionModelo, CantidadPuestos, 
                           TipoRefrigerante, TipoGasolina, TipoAceite, Peso) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (2, 1, "Focus 2019", 5, "R134a", "Gasolina", "Semisintético", 1280.75))
        print("✓ Modelos insertados")
        
        # 10. Vehículos
        cursor.execute("""
        INSERT INTO Vehiculos (Placa, FechaAdquisicion, TipoAceite, CedulaCliente, CodigoMarca, NumeroCorrelativoModelo) 
        VALUES (?, ?, ?, ?, ?, ?)
        """, ("AA123BB", "2023-05-15", "Sintético", "V98765432", 1, 1))
        print("✓ Vehículo insertado")
        
        # 11. Planes de Mantenimiento
        cursor.execute("""
        INSERT INTO PlanesMantenimiento (TiempoUso, Kilometraje, DescripcionMantenimiento, CodigoMarca, NumeroCorrelativoModelo) 
        VALUES (?, ?, ?, ?, ?)
        """, (6, 5000, "Cambio de aceite y filtros", 1, 1))
        print("✓ Plan de mantenimiento insertado")
        
        # 12. Líneas de Suministro
        cursor.execute("INSERT INTO LineasSuministro (DescripcionLinea) VALUES (?)", ("Lubricantes",))
        cursor.execute("INSERT INTO LineasSuministro (DescripcionLinea) VALUES (?)", ("Filtros",))
        print("✓ Líneas de suministro insertadas")
        
        # 13. Productos
        cursor.execute("""
        INSERT INTO Productos (NombreProducto, DescripcionProducto, LineaSuministro, Tipo, NivelContaminante, Tratamiento) 
        VALUES (?, ?, ?, ?, ?, ?)
        """, ("Aceite Motor 5W-30", "Aceite sintético para motor", 1, "Contaminante", 3, "Reciclaje especializado"))
        
        cursor.execute("""
        INSERT INTO Productos (NombreProducto, DescripcionProducto, LineaSuministro, Tipo, NivelContaminante, Tratamiento) 
        VALUES (?, ?, ?, ?, ?, ?)
        """, ("Filtro de Aire", "Filtro de aire para motor", 2, "No contaminante", None, None))
        print("✓ Productos insertados")
        
        # 14. Proveedores
        cursor.execute("""
        INSERT INTO Proveedores (RIF, RazonSocial, Direccion, TelefonoLocal, TelefonoCelular, PersonaContacto) 
        VALUES (?, ?, ?, ?, ?, ?)
        """, ("J-8765432109", "Suministros Automotrices C.A.", "Zona Industrial", "021298765432", "041487654321", "Carlos Martínez"))
        print("✓ Proveedor insertado")
        
        # 15. Productos en Franquicia
        cursor.execute("""
        INSERT INTO ProductosFranquicia (FranquiciaRIF, CodigoProducto, Precio, Cantidad, CantidadMinima, CantidadMaxima) 
        VALUES (?, ?, ?, ?, ?, ?)
        """, ("J-2502943211", 1, 25.50, 50, 10, 100))
        
        cursor.execute("""
        INSERT INTO ProductosFranquicia (FranquiciaRIF, CodigoProducto, Precio, Cantidad, CantidadMinima, CantidadMaxima) 
        VALUES (?, ?, ?, ?, ?, ?)
        """, ("J-2502943211", 2, 15.75, 30, 5, 60))
        print("✓ Productos en franquicia insertados")
        
        # 16. Servicios de Franquicia
        cursor.execute("""
        INSERT INTO ServiciosFranquicias (FranquiciaRIF, CodigoServicio) 
        VALUES (?, ?)
        """, ("J-2502943211", 1))
        
        cursor.execute("""
        INSERT INTO ServiciosFranquicias (FranquiciaRIF, CodigoServicio) 
        VALUES (?, ?)
        """, ("J-2502943211", 2))
        print("✓ Servicios de franquicia insertados")
        
        # 17. Actividades
        cursor.execute("""
        INSERT INTO Actividades (CodigoServicio, NumeroCorrelativoActividad, DescripcionActividad, CostoManoDeObra) 
        VALUES (?, ?, ?, ?)
        """, (1, 1, "Drenar aceite usado", 15.00))
        
        cursor.execute("""
        INSERT INTO Actividades (CodigoServicio, NumeroCorrelativoActividad, DescripcionActividad, CostoManoDeObra) 
        VALUES (?, ?, ?, ?)
        """, (1, 2, "Cambiar filtro de aceite", 10.00))
        print("✓ Actividades insertadas")
        
        # 18. Especialidades de Empleados
        cursor.execute("""
        INSERT INTO EspecialidadesEmpleados (EmpleadoCI, CodigoEspecialidad) 
        VALUES (?, ?)
        """, ("V12345678", 1))
        print("✓ Especialidad de empleado insertada")
        
        # 19. Responsabilidades de Empleados
        cursor.execute("""
        INSERT INTO ResponsabilidadesEmpleados (EmpleadoCI, CodigoServicio) 
        VALUES (?, ?)
        """, ("V12345678", 1))
        print("✓ Responsabilidad de empleado insertada")
        
        # 20. Suministran (Proveedor-Producto)
        cursor.execute("""
        INSERT INTO Suministran (ProveedorRIF, CodigoProducto) 
        VALUES (?, ?)
        """, ("J-8765432109", 1))
        
        cursor.execute("""
        INSERT INTO Suministran (ProveedorRIF, CodigoProducto) 
        VALUES (?, ?)
        """, ("J-8765432109", 2))
        print("✓ Relaciones proveedor-producto insertadas")
        
        # 21. Compras
        cursor.execute("""
        INSERT INTO Compras (Fecha, ProveedorRIF) 
        VALUES (?, ?)
        """, ("2024-06-01", "J-8765432109"))
        print("✓ Compra insertada")
        
        # 22. Aumentos de Inventario
        cursor.execute("""
        INSERT INTO AumentosInventario (NumeroCompra, FranquiciaRIF, CodigoProducto, CantidadPedida, CantidadDisponible, Monto) 
        VALUES (?, ?, ?, ?, ?, ?)
        """, (1, "J-2502943211", 1, 20, 20, 510.00))
        print("✓ Aumento de inventario insertado")
        
        # 23. Órdenes de Servicio
        cursor.execute("""
        INSERT INTO OrdenesServicio (FechaEntrada, HoraEntrada, FechaSalidaEstimada, HoraSalidaEstimada, 
                                   FechaSalidaReal, HoraSalidaReal, Comentario, CodigoVehiculo) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, ("2024-06-15", "08:30", "2024-06-15", "12:00", "2024-06-15", "11:45", "Servicio completado satisfactoriamente", 1))
        print("✓ Orden de servicio insertada")
        
        # 24. Empleados en Órdenes
        cursor.execute("""
        INSERT INTO EmpleadosOrdenes (EmpleadoCI, OrdenServicioID) 
        VALUES (?, ?)
        """, ("V12345678", 1))
        print("✓ Empleado asignado a orden")
        
        # 25. Ordenes-Actividades
        cursor.execute("""
        INSERT INTO OrdenesActividades (IDorden, CodigoServicio, NumeroCorrelativoActividad, Costo_Act) 
        VALUES (?, ?, ?, ?)
        """, (1, 1, 1, 15.00))
        
        cursor.execute("""
        INSERT INTO OrdenesActividades (IDorden, CodigoServicio, NumeroCorrelativoActividad, Costo_Act) 
        VALUES (?, ?, ?, ?)
        """, (1, 1, 2, 10.00))
        print("✓ Actividades de orden insertadas")
        
        # 26. Productos en Órdenes de Servicio
        cursor.execute("""
        INSERT INTO ProductosOrdenesServicio (CodigoOrdenServicio, CodigoServicio, NumeroCorrelativoActividad, 
                                            FranquiciaRIF, CodigoProducto, CantidadUtilizada, PrecioProducto) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (1, 1, 1, "J-2502943211", 1, 1, 25.50))
        print("✓ Producto usado en orden insertado")
        
        # 27. Facturas
        cursor.execute("""
        INSERT INTO Facturas (FechaEmision, MontoTotal, IVA, Descuento, OrdenServicioID, FranquiciaRIF) 
        VALUES (?, ?, ?, ?, ?, ?)
        """, ("2024-06-15", 65.78, 10.28, 0, 1, "J-2502943211"))
        print("✓ Factura insertada")
        
        # 28. Pagos
        cursor.execute("""
        INSERT INTO Pagos (NumeroFactura, NumeroCorrelativoPago, Tipo, FechaTarjeta, MontoTarjeta, 
                         ModalidadTarjeta, NumeroTarjeta, BancoTarjeta, MontoEfectivo, MonedaEfectivo, 
                         FechaPagoMovil, TelefonoPagoMovil, ReferenciaPagoMovil, MontoPagoMovil) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (1, 1, "Tarjeta", "2024-06-15", 65.78, "Ahorro", "1234567890123456", "Banco Nacional", 
              None, None, None, None, None, None))
        print("✓ Pago insertado")
        
        # 29. Mantenimientos de Vehículos
        cursor.execute("""
        INSERT INTO MantenimientosVehiculos (Vehiculo, FechaMantenimiento, DescripcionMantenimiento) 
        VALUES (?, ?, ?)
        """, (1, "2024-06-15", "Cambio de aceite y filtro realizado"))
        print("✓ Mantenimiento de vehículo registrado")
        
        # Confirmar todas las transacciones
        conn.commit()
        
        # Verificar datos insertados
        print("\n" + "=" * 50)
        print("Verificando datos insertados...")
        
        verification_queries = [
            ("Franquicias", "SELECT COUNT(*) FROM Franquicias"),
            ("Empleados", "SELECT COUNT(*) FROM Empleados"),
            ("Clientes", "SELECT COUNT(*) FROM Clientes"),
            ("Vehículos", "SELECT COUNT(*) FROM Vehiculos"),
            ("Productos", "SELECT COUNT(*) FROM Productos"),
            ("Órdenes", "SELECT COUNT(*) FROM OrdenesServicio"),
            ("Facturas", "SELECT COUNT(*) FROM Facturas")
        ]
        
        total_records = 0
        for table_name, query in verification_queries:
            cursor.execute(query)
            count = cursor.fetchone()[0]
            print(f"✓ {table_name}: {count} registros")
            total_records += count
        
        print(f"\n ¡Datos de prueba insertados exitosamente!")
        print(f"Total de registros principales: {total_records}")
        
    except Exception as e:
        print(f"❌ Error durante la inserción: {e}")
        conn.rollback()
        raise
    finally:
        print("=" * 50)

if __name__ == "__main__":
    try:
        seed_tables()
        print("\n✅ Proceso de inserción completado exitosamente!")
        
    except Exception as e:
        print(f"\n❌ Error durante la ejecución: {e}")
    finally:
        if 'conn' in locals():
            conn.close()