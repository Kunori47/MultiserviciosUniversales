from db.database import conn, cursor

def seed_tables():
    """
    Inserta datos de prueba en todas las tablas de la base de datos
    """
    try:
        print("Iniciando inserción de datos de prueba...")
        print("=" * 50)

        # 1. Empleados
        empleados = [
            ('Despedido', 'Empleado Despedido', 'N/A', '0000-0000000', 0.00, None, 'Empleado'),
            ('V-12345670', 'Puta el Cat', 'Calle 2', '0412-0000000', 2500.00, None, 'Encargado'),
            ('V-12345678', 'Juan Pérez', 'Calle 1', '0412-0000000', 1500.00, None, 'Encargado'),
            ('V-87654321', 'María Gómez', 'Calle 2', '0412-0000001', 1200.00, None, 'Empleado'),
            ('V-23456789', 'Carlos López', 'Calle 3', '0412-0000002', 1000.00, None, 'Encargado'),
            ('V-23456780', 'Carlos mbappe', 'Calle 4', '0412-0000003', 1000.00, None, 'Encargado'),
            ('V-87654325', 'María mbappe', 'Calle 5', '0412-0000004', 1200.00, None, 'Empleado'),
            ('V-87654322', 'Petra Gómez', 'Calle 6', '0412-0000005', 1200.00, None, 'Empleado')
        ]
        cursor.executemany("""
            INSERT INTO Empleados (CI, NombreCompleto, Direccion, Telefono, Salario, FranquiciaRIF, Rol) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, empleados)
        print("✓ Empleado insertado")
        
        # 2. Franquicias (tabla padre)
        franquicias = [
            ('J-1234567890', 'Franquicia A', 'Ciudad A', 'V-12345678', '2023-01-01', 'Activo'),
            ('J-0987654321', 'Franquicia B', 'Ciudad B', 'V-23456780', '2023-02-01', 'Activo'),
            ('J-1122334455', 'Franquicia C', 'Ciudad C', 'V-23456789', '2023-03-01', 'No activo')
        ]
        cursor.executemany("""
            INSERT INTO Franquicias (RIF, Nombre, Ciudad, CI_Encargado, FechaInicioEncargado, Estatus) 
            VALUES (?, ?, ?, ?, ?, ?)
        """, franquicias)

        print("✓ Franquicia insertada")
        
        # 3. Especialidades
        cursor.execute("INSERT INTO Especialidades (DescripcionEspecialidad) VALUES (?)", ("Mecánica General",))
        cursor.execute("INSERT INTO Especialidades (DescripcionEspecialidad) VALUES (?)", ("Electricidad Automotriz",))
        cursor.execute("INSERT INTO Especialidades (DescripcionEspecialidad) VALUES (?)", ("Carrocería",))
        print("✓ Especialidades insertadas")
        
        # 4. Servicios
        cursor.execute("INSERT INTO Servicios (NombreServicio) VALUES (?)", ("Cambio de Aceite",))
        cursor.execute("INSERT INTO Servicios (NombreServicio) VALUES (?)", ("Revisión General",))
        cursor.execute("INSERT INTO Servicios (NombreServicio) VALUES (?)", ("Alineación de dirección",))
        print("✓ Servicios insertados")

        # 5. Asignar empleados y encargados a sus franquicias
        cursor.execute("""
            UPDATE Empleados SET FranquiciaRIF = ? WHERE CI = ?
        """, ('J-1234567890', 'V-12345678'))  # Encargado de Franquicia A
        cursor.execute("""
            UPDATE Empleados SET FranquiciaRIF = ? WHERE CI = ?
        """, ('J-1234567890', 'V-87654321'))  # Empleado de Franquicia A

        cursor.execute("""
            UPDATE Empleados SET FranquiciaRIF = ? WHERE CI = ?
        """, ('J-0987654321', 'V-23456780'))  # Encargado de Franquicia B

        cursor.execute("""
            UPDATE Empleados SET FranquiciaRIF = ? WHERE CI = ?
        """, ('J-1122334455', 'V-23456789'))  # Encargado de Franquicia C

        # Puedes agregar más updates si tienes más empleados/franquicias
        print("✓ Empleados y encargados asignados a franquicias")

        
        # 6. Clientes
        clientes = [
            ("V98765432", "Juan Pérez Rodríguez", "juan.perez@email.com"),
            ('V34567891', 'Anto Torres', 'aa.torres@example.com'),
            ('V34567892', 'Manuel Torres', 'a.torres@example.com'),
            ('V45678903', 'Luis Martínez', 'luis.martinez@example.com')
        ]
        cursor.executemany("""
            INSERT INTO Clientes (CI, NombreCompleto, Email) 
            VALUES (?, ?, ?)
        """, clientes)
        print("✓ Cliente insertado")
        
        # 7. Teléfonos de Clientes
        cursor.execute("""
        INSERT INTO TelefonosClientes (Cliente, Telefono) 
        VALUES (?, ?)
        """, ("V98765432", "041498765432"))
        cursor.execute("""
        INSERT INTO TelefonosClientes (Cliente, Telefono) 
        VALUES (?, ?)
        """, ("V45678903", "021212345678"))
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

        vehiculos = [
            ("AA123BB", "2023-05-15", "Sintético", "V98765432", 1, 1),
            ('ABC1235', '2023-01-11', 'Sintético', 'V34567891', 2, 1),
            ('ABC1234', '2023-01-11', 'Sintético', 'V34567892', 1, 1)
        ]
        cursor.executemany("""
        INSERT INTO Vehiculos (Placa, FechaAdquisicion, TipoAceite, CedulaCliente, CodigoMarca, NumeroCorrelativoModelo) 
        VALUES (?, ?, ?, ?, ?, ?)
        """, vehiculos)
        print("✓ Vehículo insertado")
        
        # 11. Planes de Mantenimiento
        mant = [
            (6, 5000, "Cambio de aceite y filtros", 1, 1),
            (12, 20000, 'Revisión de frenos y alineación', 2, 1)
        ]

        cursor.executemany("""
        INSERT INTO PlanesMantenimiento (TiempoUso, Kilometraje, DescripcionMantenimiento, CodigoMarca, NumeroCorrelativoModelo) 
        VALUES (?, ?, ?, ?, ?)
        """, mant)
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
        prov = [
            
            ("J-8765432109", "Suministros Automotrices C.A.", "Zona Industrial", "021298765432", "041487654321", "Carlos Martínez"),
            ('J-0987654321', 'Proveedor B', 'Calle Proveedor 2', '0412-0000005', '0412-0000006', 'Contacto B')

        ]
        cursor.executemany("""
        INSERT INTO Proveedores (RIF, RazonSocial, Direccion, TelefonoLocal, TelefonoCelular, PersonaContacto) 
        VALUES (?, ?, ?, ?, ?, ?)
        """, prov)
        print("✓ Proveedor insertado")
        
        # 15. Productos en Franquicia
        cursor.execute("""
        INSERT INTO ProductosFranquicia (FranquiciaRIF, CodigoProducto, Precio, Cantidad, CantidadMinima, CantidadMaxima) 
        VALUES (?, ?, ?, ?, ?, ?)
        """, ("J-1234567890", 1, 25.50, 50, 10, 100))
        
        cursor.execute("""
        INSERT INTO ProductosFranquicia (FranquiciaRIF, CodigoProducto, Precio, Cantidad, CantidadMinima, CantidadMaxima) 
        VALUES (?, ?, ?, ?, ?, ?)
        """, ("J-1234567890", 2, 15.75, 30, 5, 60))
        print("✓ Productos en franquicia insertados")
        
        # 16. Servicios de Franquicia
        cursor.execute("""
        INSERT INTO ServiciosFranquicias (FranquiciaRIF, CodigoServicio) 
        VALUES (?, ?)
        """, ("J-1234567890", 1))
        
        cursor.execute("""
        INSERT INTO ServiciosFranquicias (FranquiciaRIF, CodigoServicio) 
        VALUES (?, ?)
        """, ("J-1234567890", 2))
        print("✓ Servicios de franquicia insertados")
        
        # 17. Actividades
        cursor.execute("""
        INSERT INTO Actividades (CodigoServicio, NumeroCorrelativoActividad, DescripcionActividad) 
        VALUES (?, ?, ?)
        """, (1, 1, "Drenar aceite usado"))
        
        cursor.execute("""
        INSERT INTO Actividades (CodigoServicio, NumeroCorrelativoActividad, DescripcionActividad) 
        VALUES (?, ?, ?)
        """, (1, 2, "Cambiar filtro de aceite"))
        print("✓ Actividades insertadas")
        
        # 18. Especialidades de Empleados
        cursor.execute("""
        INSERT INTO EspecialidadesEmpleados (EmpleadoCI, CodigoEspecialidad) 
        VALUES (?, ?)
        """, ("V-12345678", 1))
        print("✓ Especialidad de empleado insertada")
        
        # 19. Responsabilidades de Empleados
        cursor.execute("""
        INSERT INTO ResponsabilidadesEmpleados (EmpleadoCI, CodigoServicio) 
        VALUES (?, ?)
        """, ("V-12345678", 1))
        print("✓ Responsabilidad de empleado insertada")
        
        # 20. Suministran (Proveedor-Producto)
        cursor.execute("""
        INSERT INTO Suministros (ProveedorRIF, CodigoProducto) 
        VALUES (?, ?)
        """, ("J-8765432109", 1))
        
        cursor.execute("""
        INSERT INTO Suministros (ProveedorRIF, CodigoProducto) 
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
        """, (1, "J-1234567890", 1, 20, 20, 510.00))
        print("✓ Aumento de inventario insertado")
        
        # 23. Órdenes de Servicio
        cursor.execute("""
        INSERT INTO OrdenesServicio (FechaEntrada, HoraEntrada, FechaSalidaEstimada, HoraSalidaEstimada, 
                                   FechaSalidaReal, HoraSalidaReal, Comentario, CodigoVehiculo) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, ("2024-06-15", "08:30", "2024-06-15", "12:00", "2024-06-15", "11:45", "Servicio completado satisfactoriamente", 1))
        print("✓ Orden de servicio insertada")
        
        # 24. Empleados en Órdenes
        empleadosordenes =  [
            ('V-12345678', 1),
            ('V-12345670', 1)
        ]

        cursor.executemany("""
        INSERT INTO EmpleadosOrdenes (EmpleadoCI, OrdenServicioID) 
        VALUES (?, ?)
        """, empleadosordenes)
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
        """, (1, 1, 1, "J-1234567890", 1, 1, 25.50))
        print("✓ Producto usado en orden insertado")
        
        # 27. Facturas
        cursor.execute("""
        INSERT INTO Facturas (FechaEmision, MontoTotal, IVA, Descuento, OrdenServicioID, FranquiciaRIF) 
        VALUES (?, ?, ?, ?, ?, ?)
        """, ("2024-06-15", 65.78, 10.28, 0, 1, "J-1234567890"))
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
            result = cursor.fetchone()
            count = result[0] if result else 0
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