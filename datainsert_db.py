from database import database, conn

def seed_tables():
    # Franquicia
    database.execute("INSERT INTO Franquicia (RIF, Nombre, Ciudad, CI_Encargado, FechaInicioEncargado, Estatus) VALUES (?, ?, ?, ?, ?, ?)",
                   ("J-2495029432", "Franquicia Central", "Caracas", "343897", "2024-01-01", "Activo"))

    # Marca y Modelo
    database.execute("INSERT INTO Marca (Nombre) VALUES (?)", ("Toyota",))
    database.execute("INSERT INTO Modelo (CodigoMarca, NumeroCorrelativoModelo, DescripcionModelo, CantidadPuestos, TipoRefrigerante, TipoGasolina, TipoAceite, Peso) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                   (1, 1, "Corolla 2020", 5, "R134a", "91", "10W-30", 1200.0))

    # Cliente
    database.execute("INSERT INTO Cliente (CI, NombreCompleto, Email) VALUES (?, ?, ?)",
                   ("V12345678", "Juan Pérez", "juan@mail.com"))

    # Empleado
    database.execute("INSERT INTO Empleado (CI, NombreCompleto, Direccion, Telefono, Salario, FranquiciaRIF) VALUES (?, ?, ?, ?, ?, ?)",
                   ("E12345678", "Ana López", "Av. Principal", "04141234567", 500.0, "J123456789"))

    # Vehiculo
    database.execute("INSERT INTO Vehiculo (CodigoMarca, NumeroCorrelativoModelo, Placa, FechaAdquisicion, TipoAceite, CedulaCliente) VALUES (?, ?, ?, ?, ?, ?)",
                   (1, 1, "AA123AA", "2023-05-10", "10W-30", "V12345678"))

    # Proveedor
    database.execute("INSERT INTO Proveedor (RIF, RazonSocial, Direccion, TelefonoLocal, TelefonoCelular, PersonaContacto) VALUES (?, ?, ?, ?, ?, ?)",
                   ("J987654321", "Suministros C.A.", "Calle 1", "02121234567", "04141234567", "Carlos Ruiz"))

    # LineaSuministro
    database.execute("INSERT INTO LineaSuministro (DescripcionLinea) VALUES (?)", ("Lubricantes",))

    # Producto
    database.execute("INSERT INTO Producto (NombreProducto, DescripcionProducto, LineaSuministro, Tipo, NivelContaminante, Tratamiento) VALUES (?, ?, ?, ?, ?, ?)",
                   ("Aceite Motor", "Aceite sintético", 1, "Aceite", 1, "Reciclable"))

    # Servicio
    database.execute("INSERT INTO Servicio (NombreServicio) VALUES (?)", ("Cambio de Aceite",))

    # Especialidad
    database.execute("INSERT INTO Especialidad (DescripcionEspecialidad) VALUES (?)", ("Mecánica General",))

    # TelefonosCliente
    database.execute("INSERT INTO TelefonosCliente (Cliente, Telefono) VALUES (?, ?)", ("V12345678", "04141234567"))

    # Pago
    database.execute("INSERT INTO Pago (NumeroFactura, NumeroCorrelativoPago, Tipo, FechaTarjeta, MontoTarjeta, BancoTarjeta, ModalidadTarjeta, NumeroTarjeta, MontoEfectivo, MonedaEfectivo, FechaPagoMovil, TelefonoPagoMovil, ReferenciaPagoMovil, MontoPagoMovil) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                   (1, 1, "Tarjeta", "2024-06-01", 100.0, "Banco1", "Débito", "1234567890123456", None, None, None, None, None, None))

    # Factura
    database.execute("INSERT INTO Factura (FechaEmision, MontoTotal, IVA, Descuento, OrdenServicioID, FranquiciaRIF) VALUES (?, ?, ?, ?, ?, ?)",
                   ("2024-06-01", 100.0, 16.0, 0.0, 1, "J123456789"))

    # Compra
    database.execute("INSERT INTO Compra (Fecha, ProveedorRIF) VALUES (?, ?)",
                   ("2024-06-01", "J987654321"))

    # OrdenServicio
    database.execute("INSERT INTO OrdenServicio (FechaEntrada, HoraEntrada, FechaSalidaEstimada, HoraSalidaEstimada, CodigoVehiculo) VALUES (?, ?, ?, ?, ?)",
                   ("2024-06-01", "08:00", "2024-06-02", "17:00", 1))

    # MantenimientoVehiculos
    database.execute("INSERT INTO MantenimientoVehiculos (Vehiculo, FechaMantenimiento, DescripcionMantenimiento) VALUES (?, ?, ?)",
                   (1, "2024-06-01", "Cambio de aceite"))

    # ProductoFranquicia
    database.execute("INSERT INTO ProductoFranquicia (FranquiciaRIF, CodigoProducto, Precio, Cantidad, CantidadMinima, CantidadMaxima) VALUES (?, ?, ?, ?, ?, ?)",
                   ("J123456789", 1, 10.0, 100, 10, 200))

    # ServiciosFranquicia
    database.execute("INSERT INTO ServiciosFranquicia (FranquiciaRIF, CodigoServicio) VALUES (?, ?)",
                   ("J123456789", 1))

    # ResponsabilidadEmpleado
    database.execute("INSERT INTO ResponsabilidadEmpleado (EmpleadoCI, CodigoServicio) VALUES (?, ?)",
                   ("E12345678", 1))

    # EspecialidadEmpleado
    database.execute("INSERT INTO EspecialidadEmpleado (EmpleadoCI, CodigoEspecialidad) VALUES (?, ?)",
                   ("E12345678", 1))

    # EmpleadosOrden
    database.execute("INSERT INTO EmpleadosOrden (EmpleadoCI, OrdenServicioID) VALUES (?, ?)",
                   ("E12345678", 1))

    # OrdenxActividad
    database.execute("INSERT INTO OrdenxActividad (IDorden, CodigoServicio, NumeroCorrelativoActividad, Costo_Act) VALUES (?, ?, ?, ?)",
                   (1, 1, 1, 50.0))

    conn.commit()
    print("¡Datos de prueba insertados!")

if __name__ == "__main__":
    seed_tables()