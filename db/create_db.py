from db.database import conn, cursor
from db.insert_db import seed_tables
import pyodbc

def crear_base_datos():
    """
    Crea la base de datos MultiserviciosUniversal con todas las tablas usando SQL Server
    """
    try:
        # Crear tabla Franquicias
        cursor.execute("""
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Franquicias' AND xtype='U')
        CREATE TABLE Franquicias(
            RIF CHAR(12) CHECK(LEN(RIF) = 12),
            Nombre VARCHAR(50) NOT NULL,
            Ciudad VARCHAR(50) NOT NULL,
            CI_Encargado VARCHAR(10),
            FechaInicioEncargado DATE NOT NULL,
            Estatus VARCHAR(10) NOT NULL CHECK(Estatus IN ('Activo', 'No activo')),
            PRIMARY KEY(RIF)
        )
        """)
        print("✓ Tabla 'Franquicias' creada")
        
        # Crear tabla Empleados
        cursor.execute("""
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Empleados' AND xtype='U')
        CREATE TABLE Empleados(
            CI VARCHAR(10),
            NombreCompleto VARCHAR(100) NOT NULL,
            Direccion VARCHAR(100) NOT NULL,
            Telefono CHAR(12) NOT NULL CHECK(LEN(Telefono) = 12),
            Salario DECIMAL(10,2) CHECK(Salario >= 0),
            FranquiciaRIF CHAR(12),
            PRIMARY KEY(CI),
            FOREIGN KEY (FranquiciaRIF) REFERENCES Franquicias(RIF)
                ON DELETE CASCADE
                ON UPDATE CASCADE
        )
        """)
        print("✓ Tabla 'Empleados' creada")
        
        # Agregar foreign key de CI_Encargado a Franquicias
        cursor.execute("""
        IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Franquicia_Encargado')
        ALTER TABLE Franquicias
        ADD CONSTRAINT FK_Franquicia_Encargado 
        FOREIGN KEY (CI_Encargado) REFERENCES Empleados(CI)
        """)
        print("✓ Relación Franquicias-Empleados configurada")
        
        # Crear tabla Especialidades
        cursor.execute("""
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Especialidades' AND xtype='U')
        CREATE TABLE Especialidades(
            CodigoEspecialidad INT IDENTITY(1,1),
            DescripcionEspecialidad VARCHAR(50) NOT NULL,
            PRIMARY KEY (CodigoEspecialidad)
        )
        """)
        print("✓ Tabla 'Especialidades' creada")
        
        # Crear tabla Servicios
        cursor.execute("""
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Servicios' AND xtype='U')
        CREATE TABLE Servicios(
            CodigoServicio INT IDENTITY(1,1),
            NombreServicio VARCHAR(50) NOT NULL,
            PRIMARY KEY (CodigoServicio)
        )
        """)
        print("✓ Tabla 'Servicios' creada")
        
        # Crear tabla LineasSuministro
        cursor.execute("""
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='LineasSuministro' AND xtype='U')
        CREATE TABLE LineasSuministro(
            CodigoLinea INT IDENTITY(1,1),
            DescripcionLinea VARCHAR(50),
            PRIMARY KEY (CodigoLinea)
        )
        """)
        print("✓ Tabla 'LineasSuministro' creada")
        
        # Crear tabla Productos
        cursor.execute("""
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Productos' AND xtype='U')
        CREATE TABLE Productos(
            CodigoProducto INT IDENTITY(1,1),
            NombreProducto VARCHAR(50) NOT NULL,
            DescripcionProducto VARCHAR(100) NOT NULL,
            LineaSuministro INT,
            Tipo VARCHAR(50) NOT NULL CHECK(Tipo IN ('Contaminante', 'No contaminante')),
            NivelContaminante INT CHECK (NivelContaminante BETWEEN 1 AND 5),
            Tratamiento VARCHAR(100),
            PRIMARY KEY(CodigoProducto),
            FOREIGN KEY (LineaSuministro) REFERENCES LineasSuministro(CodigoLinea)
                ON DELETE NO ACTION
                ON UPDATE CASCADE,
            CONSTRAINT CHK_Productos CHECK((Tipo = 'Contaminante' 
                    AND NivelContaminante IS NOT NULL 
                    AND Tratamiento IS NOT NULL) 
                OR 
                    (Tipo = 'No contaminante' 
                        AND NivelContaminante IS NULL 
                        AND Tratamiento IS NULL))
        )
        """)
        print("✓ Tabla 'Productos' creada")
        
        # Crear tabla Proveedores
        cursor.execute("""
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Proveedores' AND xtype='U')
        CREATE TABLE Proveedores(
            RIF CHAR(12) CHECK(LEN(RIF) = 12),
            RazonSocial VARCHAR(50) UNIQUE NOT NULL,
            Direccion VARCHAR(100) NOT NULL,
            TelefonoLocal CHAR(12) NOT NULL CHECK (LEN(TelefonoLocal) = 12),
            TelefonoCelular CHAR(12) NOT NULL CHECK (LEN(TelefonoCelular) = 12),
            PersonaContacto VARCHAR(50) NOT NULL,
            PRIMARY KEY(RIF)
        )
        """)
        print("✓ Tabla 'Proveedores' creada")
        
        # Crear tabla Clientes
        cursor.execute("""
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Clientes' AND xtype='U')
        CREATE TABLE Clientes(
            CI VARCHAR(10),
            NombreCompleto VARCHAR(100) NOT NULL,
            Email VARCHAR(50),
            PRIMARY KEY(CI)
        )
        """)
        print("✓ Tabla 'Clientes' creada")
        
        # Crear tabla Marcas
        cursor.execute("""
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Marcas' AND xtype='U')
        CREATE TABLE Marcas(
            CodigoMarca INT IDENTITY(1,1),
            Nombre VARCHAR(50) NOT NULL,
            PRIMARY KEY(CodigoMarca)
        )
        """)
        print("✓ Tabla 'Marcas' creada")
        
        # Crear tabla Modelos
        cursor.execute("""
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Modelos' AND xtype='U')
        CREATE TABLE Modelos(
            CodigoMarca INT,
            NumeroCorrelativoModelo INT,
            DescripcionModelo VARCHAR(50) NOT NULL,
            CantidadPuestos INT NOT NULL CHECK (CantidadPuestos >= 1),
            TipoRefrigerante VARCHAR(50) NOT NULL,
            TipoGasolina VARCHAR(50) NOT NULL CHECK (TipoGasolina IN ('Gasolina', 'Diésel', 'Eléctrico', 'Híbrido')),
            TipoAceite VARCHAR(50) NOT NULL CHECK (TipoAceite IN ('Sintético', 'Mineral', 'Semisintético')),
            Peso DECIMAL(10, 2) NOT NULL CHECK (Peso >= 0),
            PRIMARY KEY(CodigoMarca, NumeroCorrelativoModelo),
            FOREIGN KEY (CodigoMarca) REFERENCES Marcas(CodigoMarca)
                ON DELETE NO ACTION
                ON UPDATE CASCADE
        )
        """)
        print("✓ Tabla 'Modelos' creada")
        
        # Crear tabla Vehiculos
        cursor.execute("""
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Vehiculos' AND xtype='U')
        CREATE TABLE Vehiculos(
            CodigoVehiculo INT IDENTITY(1,1),
            Placa CHAR(7) NOT NULL CHECK (LEN(Placa) = 7),
            FechaAdquisicion DATE NOT NULL,
            TipoAceite VARCHAR(50) NOT NULL CHECK (TipoAceite IN ('Sintético', 'Mineral', 'Semisintético')),
            CedulaCliente VARCHAR(10),
            CodigoMarca INT,
            NumeroCorrelativoModelo INT,
            PRIMARY KEY(CodigoVehiculo),
            FOREIGN KEY(CedulaCliente) REFERENCES Clientes(CI)
                ON DELETE CASCADE
                ON UPDATE CASCADE,
            FOREIGN KEY(CodigoMarca, NumeroCorrelativoModelo) REFERENCES Modelos(CodigoMarca, NumeroCorrelativoModelo)
                ON DELETE CASCADE
                ON UPDATE CASCADE
        )
        """)
        print("✓ Tabla 'Vehiculos' creada")
        
        # Crear tabla PlanesMantenimiento
        cursor.execute("""
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='PlanesMantenimiento' AND xtype='U')
        CREATE TABLE PlanesMantenimiento(
            CodigoMantenimiento INT IDENTITY(1,1),
            TiempoUso INT NOT NULL CHECK (TiempoUso >= 0),
            Kilometraje INT NOT NULL CHECK (Kilometraje >= 0),
            DescripcionMantenimiento VARCHAR(100) NOT NULL,
            CodigoMarca INT,
            NumeroCorrelativoModelo INT,
            PRIMARY KEY(CodigoMantenimiento),
            FOREIGN KEY(CodigoMarca, NumeroCorrelativoModelo) REFERENCES Modelos(CodigoMarca, NumeroCorrelativoModelo)
        )
        """)
        print("✓ Tabla 'PlanesMantenimiento' creada")
        
        # Crear tabla OrdenesServicio
        cursor.execute("""
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='OrdenesServicio' AND xtype='U')
        CREATE TABLE OrdenesServicio(
            ID INT IDENTITY(1,1),
            FechaEntrada DATE NOT NULL,
            HoraEntrada TIME NOT NULL,
            FechaSalidaEstimada DATE NOT NULL,
            HoraSalidaEstimada TIME NOT NULL,
            FechaSalidaReal DATE NOT NULL,
            HoraSalidaReal TIME NOT NULL,
            Comentario VARCHAR(100),
            CodigoVehiculo INT,
            PRIMARY KEY(ID),
            FOREIGN KEY(CodigoVehiculo) REFERENCES Vehiculos(CodigoVehiculo)
                ON DELETE NO ACTION
                ON UPDATE CASCADE 
        )
        """)
        print("✓ Tabla 'OrdenesServicio' creada")
        
        # Crear tabla Facturas
        cursor.execute("""
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Facturas' AND xtype='U')
        CREATE TABLE Facturas(
            NumeroFactura INT IDENTITY(1,1),
            FechaEmision DATE NOT NULL,
            MontoTotal DECIMAL(10,2) NOT NULL CHECK (MontoTotal >= 0),
            IVA DECIMAL(10,2) NOT NULL CHECK (IVA >= 0),
            Descuento INT NOT NULL CHECK (Descuento >= 0),
            OrdenServicioID INT,
            FranquiciaRIF CHAR(12),
            PRIMARY KEY(NumeroFactura),
            FOREIGN KEY (OrdenServicioID) REFERENCES OrdenesServicio(ID)
                ON DELETE NO ACTION
                ON UPDATE CASCADE,
            FOREIGN KEY (FranquiciaRIF) REFERENCES Franquicias(RIF)
                ON DELETE CASCADE
                ON UPDATE CASCADE
        )
        """)
        print("✓ Tabla 'Facturas' creada")
        
        # Crear tabla Compras
        cursor.execute("""
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Compras' AND xtype='U')
        CREATE TABLE Compras(
            Numero INT IDENTITY(1,1),
            Fecha DATE NOT NULL,
            ProveedorRIF CHAR(12),
            PRIMARY KEY(Numero),
            FOREIGN KEY (ProveedorRIF) REFERENCES Proveedores(RIF)
                ON DELETE NO ACTION
                ON UPDATE CASCADE
        )
        """)
        print("✓ Tabla 'Compras' creada")
        
        # Crear tabla ProductosFranquicia
        cursor.execute("""
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ProductosFranquicia' AND xtype='U')
        CREATE TABLE ProductosFranquicia(
            FranquiciaRIF CHAR(12),
            CodigoProducto INT,
            Precio Decimal(10,2) NOT NULL CHECK(Precio >= 0),
            Cantidad INT NOT NULL CHECK (Cantidad >= 0),
            CantidadMinima INT NOT NULL CHECK(CantidadMinima >= 0),
            CantidadMaxima INT NOT NULL CHECK(CantidadMaxima >= 0),
            PRIMARY KEY(FranquiciaRIF, CodigoProducto),
            FOREIGN KEY (FranquiciaRIF) REFERENCES Franquicias(RIF),
            FOREIGN KEY (CodigoProducto) REFERENCES Productos(CodigoProducto)
        )
        """)
        print("✓ Tabla 'ProductosFranquicia' creada")
        
        # Crear tabla Correcciones
        cursor.execute("""
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Correcciones' AND xtype='U')
        CREATE TABLE Correcciones(
            FranquiciaRIF CHAR(12),
            CodigoProducto INT,
            FechaCorreccion DATE,
            Cantidad INT CHECK (Cantidad >= 0),
            TipoAjuste VARCHAR(50) NOT NULL CHECK (TipoAjuste IN ('Faltante', 'Sobrante')),
            Comentario VARCHAR(100),
            PRIMARY KEY(FranquiciaRIF, CodigoProducto, FechaCorreccion),
            FOREIGN KEY (FranquiciaRIF, CodigoProducto) REFERENCES ProductosFranquicia(FranquiciaRIF, CodigoProducto)
                ON DELETE CASCADE
                ON UPDATE CASCADE
        )
        """)
        print("✓ Tabla 'Correcciones' creada")
        
        # Crear tabla Actividades
        cursor.execute("""
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Actividades' AND xtype='U')
        CREATE TABLE Actividades(
            CodigoServicio INT,
            NumeroCorrelativoActividad INT,
            DescripcionActividad VARCHAR(50) NOT NULL,
            CostoManoDeObra DECIMAL(10, 2) NOT NULL CHECK (CostoManoDeObra >= 0),
            PRIMARY KEY(CodigoServicio, NumeroCorrelativoActividad),
            FOREIGN KEY(CodigoServicio) REFERENCES Servicios(CodigoServicio)
                ON DELETE CASCADE
                ON UPDATE CASCADE
        )
        """)
        print("✓ Tabla 'Actividades' creada")
        
        # Crear tabla OrdenesActividades
        cursor.execute("""
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='OrdenesActividades' AND xtype='U')
        CREATE TABLE OrdenesActividades(
            IDorden int,
            CodigoServicio INT,
            NumeroCorrelativoActividad INT,
            Costo_Act DECIMAL(10, 2) NOT NULL CHECK (Costo_Act >= 0),
            PRIMARY KEY (IDorden, CodigoServicio, NumeroCorrelativoActividad),
            FOREIGN KEY (IDorden) REFERENCES OrdenesServicio(ID),
            FOREIGN KEY (CodigoServicio, NumeroCorrelativoActividad) REFERENCES Actividades(CodigoServicio, NumeroCorrelativoActividad)
        )
        """)
        print("✓ Tabla 'OrdenesActividades' creada")
                
        # Crear tabla Pagos
        cursor.execute("""
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Pagos' AND xtype='U')
        CREATE TABLE Pagos(
            NumeroFactura INT,
            NumeroCorrelativoPago INT,
            Tipo VARCHAR(50) NOT NULL CHECK (Tipo IN ('Tarjeta', 'Efectivo', 'Pago Móvil')),
            FechaTarjeta DATE,
            MontoTarjeta DECIMAL(10, 2) CHECK (MontoTarjeta >= 0),
            ModalidadTarjeta VARCHAR(50) CHECK (ModalidadTarjeta IN ('Ahorro', 'Corriente')),
            NumeroTarjeta CHAR(16) CHECK (LEN(NumeroTarjeta) = 16),
            BancoTarjeta VARCHAR(50),
            MontoEfectivo DECIMAL(10, 2) CHECK (MontoEfectivo >= 0),
            MonedaEfectivo VARCHAR(50) CHECK (MonedaEfectivo IN ('Bolívar', 'Dólar', 'Euro')),
            FechaPagoMovil DATE,
            TelefonoPagoMovil CHAR(12) CHECK (LEN(TelefonoPagoMovil) = 12),
            ReferenciaPagoMovil VARCHAR(50),
            MontoPagoMovil DECIMAL(10, 2) CHECK (MontoPagoMovil >= 0),
            PRIMARY KEY(NumeroFactura, NumeroCorrelativoPago),
            FOREIGN KEY (NumeroFactura) REFERENCES Facturas(NumeroFactura)
                ON DELETE NO ACTION
                ON UPDATE CASCADE,
            CONSTRAINT CHK_Pagos CHECK ((Tipo = 'Tarjeta'
                    AND FechaTarjeta IS NOT NULL
                    AND MontoTarjeta IS NOT NULL
                    AND ModalidadTarjeta IS NOT NULL
                    AND NumeroTarjeta IS NOT NULL
                    AND BancoTarjeta IS NOT NULL
                    AND MontoEfectivo IS NULL
                    AND MonedaEfectivo IS NULL
                    AND FechaPagoMovil IS NULL
                    AND TelefonoPagoMovil IS NULL
                    AND ReferenciaPagoMovil IS NULL
                    AND MontoPagoMovil IS NULL)
                OR 
                    (Tipo = 'Efectivo'
                    AND FechaTarjeta IS NULL
                    AND MontoTarjeta IS NULL
                    AND ModalidadTarjeta IS NULL
                    AND NumeroTarjeta IS NULL
                    AND BancoTarjeta IS NULL
                    AND MontoEfectivo IS NOT NULL
                    AND MonedaEfectivo IS NOT NULL
                    AND FechaPagoMovil IS NULL
                    AND TelefonoPagoMovil IS NULL
                    AND ReferenciaPagoMovil IS NULL
                    AND MontoPagoMovil IS NULL)
                OR
                    (Tipo = 'Pago Móvil'
                    AND FechaTarjeta IS NULL
                    AND MontoTarjeta IS NULL
                    AND ModalidadTarjeta IS NULL
                    AND NumeroTarjeta IS NULL
                    AND BancoTarjeta IS NULL
                    AND MontoEfectivo IS NULL
                    AND MonedaEfectivo IS NULL
                    AND FechaPagoMovil IS NOT NULL
                    AND TelefonoPagoMovil IS NOT NULL
                    AND ReferenciaPagoMovil IS NOT NULL
                    AND MontoPagoMovil IS NOT NULL))
        )
        """)
        print("✓ Tabla 'Pagos' creada")
        
        # Crear tablas adicionales 
        tablas_adicionales = [
            ("Suministran", """
                CREATE TABLE Suministran(
                    ProveedorRIF CHAR(12),
                    CodigoProducto INT,
                    PRIMARY KEY(ProveedorRIF, CodigoProducto),
                    FOREIGN KEY(ProveedorRIF) REFERENCES Proveedores(RIF)
                        ON DELETE CASCADE ON UPDATE CASCADE,
                    FOREIGN KEY(CodigoProducto) REFERENCES Productos(CodigoProducto)
                        ON DELETE CASCADE ON UPDATE CASCADE
                )
            """),
            ("AumentosInventario", """
                CREATE TABLE AumentosInventario(
                    NumeroCompra INT,
                    FranquiciaRIF CHAR(12),
                    CodigoProducto INT,
                    CantidadPedida INT NOT NULL CHECK (CantidadPedida >= 0),
                    CantidadDisponible INT NOT NULL CHECK (CantidadDisponible >= 0),
                    Monto DECIMAL(10, 2) NOT NULL CHECK (Monto >= 0),
                    PRIMARY KEY(NumeroCompra, FranquiciaRIF, CodigoProducto),
                    FOREIGN KEY (NumeroCompra) REFERENCES Compras(Numero)
                        ON DELETE CASCADE ON UPDATE CASCADE,
                    FOREIGN KEY (FranquiciaRIF, CodigoProducto) REFERENCES ProductosFranquicia(FranquiciaRIF, CodigoProducto)
                        ON DELETE CASCADE ON UPDATE CASCADE
                )
            """),
            ("ServiciosFranquicias", """
                CREATE TABLE ServiciosFranquicias(
                    FranquiciaRIF CHAR(12),
                    CodigoServicio INT,
                    PRIMARY KEY(FranquiciaRIF, CodigoServicio),
                    FOREIGN KEY (FranquiciaRIF) REFERENCES Franquicias(RIF)
                        ON DELETE CASCADE ON UPDATE CASCADE,
                    FOREIGN KEY(CodigoServicio) REFERENCES Servicios(CodigoServicio)
                        ON DELETE CASCADE ON UPDATE CASCADE
                )
            """),
            ("ProductosOrdenesServicio", """
                CREATE TABLE ProductosOrdenesServicio(
                    CodigoOrdenServicio INT,
                    CodigoServicio INT,
                    NumeroCorrelativoActividad INT,
                    FranquiciaRIF CHAR(12),
                    CodigoProducto INT,
                    CantidadUtilizada INT NOT NULL CHECK (CantidadUtilizada >= 0),
                    PrecioProducto DECIMAL(10, 2) NOT NULL CHECK (PrecioProducto >= 0),
                    PRIMARY KEY(CodigoOrdenServicio, CodigoServicio, NumeroCorrelativoActividad, FranquiciaRIF, CodigoProducto),
                    FOREIGN KEY (CodigoOrdenServicio, CodigoServicio, NumeroCorrelativoActividad) REFERENCES OrdenesActividades(IDorden, CodigoServicio, NumeroCorrelativoActividad)
                        ON DELETE CASCADE ON UPDATE CASCADE,
                    FOREIGN KEY (FranquiciaRIF, CodigoProducto) REFERENCES ProductosFranquicia(FranquiciaRIF, CodigoProducto)
                        ON DELETE CASCADE ON UPDATE CASCADE
                )
            """),
            ("EspecialidadesEmpleados", """
                CREATE TABLE EspecialidadesEmpleados(
                    EmpleadoCI VARCHAR(10),
                    CodigoEspecialidad INT,
                    PRIMARY KEY (EmpleadoCI, CodigoEspecialidad),
                    FOREIGN KEY (EmpleadoCI) REFERENCES Empleados(CI),
                    FOREIGN KEY (CodigoEspecialidad) REFERENCES Especialidades(CodigoEspecialidad)
                )
            """),
            ("ResponsabilidadesEmpleados", """
                CREATE TABLE ResponsabilidadesEmpleados(
                    EmpleadoCI VARCHAR(10),
                    CodigoServicio INT,
                    PRIMARY KEY(EmpleadoCI, CodigoServicio),
                    FOREIGN KEY (EmpleadoCI) REFERENCES Empleados(CI),
                    FOREIGN KEY(CodigoServicio) REFERENCES Servicios(CodigoServicio)
                )
            """),
            ("EmpleadosOrdenes", """
                CREATE TABLE EmpleadosOrdenes(
                    EmpleadoCI VARCHAR(10),
                    OrdenServicioID INT,
                    PRIMARY KEY(EmpleadoCI, OrdenServicioID),
                    FOREIGN KEY (EmpleadoCI) REFERENCES Empleados(CI),
                    FOREIGN KEY (OrdenServicioID) REFERENCES OrdenesServicio(ID)
                )
            """),
            ("TelefonosClientes", """
                CREATE TABLE TelefonosClientes(
                    Cliente VARCHAR(10),
                    Telefono CHAR(12) CHECK (LEN(Telefono) = 12),
                    PRIMARY KEY(Cliente, Telefono),
                    FOREIGN KEY(Cliente) REFERENCES Clientes(CI)
                )
            """),
            ("MantenimientosVehiculos", """
                CREATE TABLE MantenimientosVehiculos(
                    Vehiculo INT,
                    FechaMantenimiento DATE,
                    DescripcionMantenimiento VARCHAR(100) NOT NULL,
                    PRIMARY KEY(Vehiculo, FechaMantenimiento),
                    FOREIGN KEY(Vehiculo) REFERENCES Vehiculos(CodigoVehiculo)
                )
            """)
        ]
        
        for nombre_tabla, sql_create in tablas_adicionales:
            cursor.execute(f"""
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='{nombre_tabla}' AND xtype='U')
            {sql_create}
            """)
            print(f"✓ Tabla '{nombre_tabla}' creada")
        
        # Confirmar transacción
        conn.commit()
        
        # Contar tablas creadas
        cursor.execute("SELECT COUNT(*) FROM sys.tables")
        total_tablas = cursor.fetchone()[0]
        
        print(f"\n Base de datos 'MultiserviciosUniversal' creada exitosamente con {total_tablas} tablas.")
        
        # Mostrar lista de tablas creadas
        cursor.execute("SELECT name FROM sys.tables ORDER BY name")
        tablas = cursor.fetchall()
        print("\n Tablas creadas:")
        for i, tabla in enumerate(tablas, 1):
            print(f"  {i:2d}. {tabla[0]}")
        
    except pyodbc.Error as e:
        print(f"❌ Error de SQL Server: {e}")
        if 'conn' in locals():
            conn.rollback()
        raise
    except Exception as e:
        print(f"❌ Error general: {e}")
        if 'conn' in locals():
            conn.rollback()
        raise
    finally:
        if 'conn' in locals():
            conn.close()

def verificar_base_datos():
    """
    Verifica que la base de datos se haya creado correctamente
    """
    try:
        conn = pyodbc.connect(
            "Driver={SQL Server};"
            "Server=DESKTOP-DJIAR9K\SQLEXPRESS;"
            "Database=MultiserviciosUniversal;"
            "Trusted_Connection=yes;"
        )
        cursor = conn.cursor()
        
        # Obtener información de las tablas
        cursor.execute("SELECT name FROM sys.tables")
        tablas = cursor.fetchall()
        
        # Obtener tamaño de la base de datos
        cursor.execute("""
        SELECT 
            SUM(size) * 8 / 1024 as SizeMB
        FROM sys.database_files
        """)
        size_mb = cursor.fetchone()[0]
        
        print(f"\n✅ Verificación exitosa:")
        print(f"Base de datos: MultiserviciosUniversal")
        print(f"Total de tablas: {len(tablas)}")
        print(f"Tamaño aproximado: {size_mb:.2f} MB")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error al verificar la base de datos: {e}")
        return False

if __name__ == "__main__":
    print(" Iniciando creación de la base de datos MultiserviciosUniversal en SQL Server...")
    print("=" * 70)
    
    try:
        crear_base_datos()
        verificar_base_datos()
        print("=" * 70)
        print("\n✅ Proceso de creacion completado exitosamente!")
        seed_tables()
        
        print("\n✅Proceso completado exitosamente!")

        
    except Exception as e:
        print(f"\n❌ Error durante la ejecución: {e}")
    print(" Iniciando creación de la base de datos MultiserviciosUniversal...")
    print("=" * 60)
    