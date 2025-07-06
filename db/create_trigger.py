from db.database import cursor, conn
import pyodbc

def create_inventory_trigger():
    """
    Create trigger to automatically update inventory when a purchase is made
    """
    try:
        # Create the trigger for SQL Server
        trigger_sql = """
        IF NOT EXISTS (SELECT * FROM sys.triggers WHERE name = 'update_inventory_on_purchase')
        BEGIN
            EXEC('
                CREATE TRIGGER update_inventory_on_purchase
                ON AumentosInventario
                AFTER INSERT
                AS
                BEGIN
                    SET NOCOUNT ON;
                    
                    -- Update existing products
                    UPDATE ProductosFranquicia 
                    SET Cantidad = Cantidad + inserted.CantidadPedida
                    FROM ProductosFranquicia pf
                    INNER JOIN inserted ON pf.FranquiciaRIF = inserted.FranquiciaRIF 
                    AND pf.CodigoProducto = inserted.CodigoProducto;
                    
                    -- Insert new products if they don''t exist
                    INSERT INTO ProductosFranquicia 
                    (FranquiciaRIF, CodigoProducto, Cantidad, Precio, CantidadMinima, CantidadMaxima)
                    SELECT 
                        inserted.FranquiciaRIF, 
                        inserted.CodigoProducto, 
                        inserted.CantidadPedida, 
                        0, 0, 0
                    FROM inserted
                    WHERE NOT EXISTS (
                        SELECT 1 FROM ProductosFranquicia pf 
                        WHERE pf.FranquiciaRIF = inserted.FranquiciaRIF 
                        AND pf.CodigoProducto = inserted.CodigoProducto
                    );
                END
            ')
        END
        """
        
        cursor.execute(trigger_sql)
        conn.commit()
        print("✅ Trigger 'update_inventory_on_purchase' created successfully!")
        
    except Exception as e:
        print(f"❌ Error creating trigger: {str(e)}")
        conn.rollback()

def create_correction_trigger():
    """
    Create trigger to automatically update inventory when a correction is made
    """
    try:
        # Create the trigger for SQL Server
        trigger_sql = """
        IF NOT EXISTS (SELECT * FROM sys.triggers WHERE name = 'update_inventory_on_correction')
        BEGIN
            EXEC('
                CREATE TRIGGER update_inventory_on_correction
                ON Correcciones
                AFTER INSERT
                AS
                BEGIN
                    SET NOCOUNT ON;
                    
                    -- Update inventory based on correction type
                    UPDATE ProductosFranquicia 
                    SET Cantidad = CASE 
                        WHEN inserted.TipoAjuste = N''Faltante'' THEN pf.Cantidad + inserted.Cantidad
                        WHEN inserted.TipoAjuste = N''Sobrante'' THEN pf.Cantidad - inserted.Cantidad
                        ELSE pf.Cantidad
                    END
                    FROM ProductosFranquicia pf
                    INNER JOIN inserted ON pf.FranquiciaRIF = inserted.FranquiciaRIF 
                    AND pf.CodigoProducto = inserted.CodigoProducto;
                    
                    -- Insert new products if they don''t exist (only for Faltante)
                    INSERT INTO ProductosFranquicia 
                    (FranquiciaRIF, CodigoProducto, Cantidad, Precio, CantidadMinima, CantidadMaxima)
                    SELECT 
                        inserted.FranquiciaRIF, 
                        inserted.CodigoProducto, 
                        inserted.Cantidad, 
                        0, 0, 0
                    FROM inserted
                    WHERE inserted.TipoAjuste = N''Faltante''
                    AND NOT EXISTS (
                        SELECT 1 FROM ProductosFranquicia pf 
                        WHERE pf.FranquiciaRIF = inserted.FranquiciaRIF 
                        AND pf.CodigoProducto = inserted.CodigoProducto
                    );
                END
            ')
        END
        """
        
        cursor.execute(trigger_sql)
        conn.commit()
        print("✅ Trigger 'update_inventory_on_correction' created successfully!")
        
    except Exception as e:
        print(f"❌ Error creating correction trigger: {str(e)}")
        conn.rollback()

def create_service_order_trigger():
    """
    Create trigger to automatically decrease inventory when products are used in service orders
    """
    try:
        # Create the trigger for SQL Server
        trigger_sql = """
        IF NOT EXISTS (SELECT * FROM sys.triggers WHERE name = 'decrease_inventory_on_service_order')
        BEGIN
            EXEC('
                CREATE TRIGGER decrease_inventory_on_service_order
                ON ProductosOrdenesServicio
                AFTER INSERT
                AS
                BEGIN
                    SET NOCOUNT ON;
                    
                    -- Decrease inventory when products are used in service orders
                    UPDATE ProductosFranquicia 
                    SET Cantidad = Cantidad - inserted.CantidadUtilizada
                    FROM ProductosFranquicia pf
                    INNER JOIN inserted ON pf.FranquiciaRIF = inserted.FranquiciaRIF 
                    AND pf.CodigoProducto = inserted.CodigoProducto;
                    
                    -- Note: Inventory level warnings can be handled in application logic
                    -- or through a separate monitoring process
                END
            ')
        END
        """
        
        cursor.execute(trigger_sql)
        conn.commit()
        print("✅ Trigger 'decrease_inventory_on_service_order' created successfully!")
        
    except Exception as e:
        print(f"❌ Error creating service order trigger: {str(e)}")
        conn.rollback()

def create_franchise_manager_trigger():
    """
    Create trigger to automatically handle role assignment and franchise-employee relationship
    when a franchise manager is assigned
    """
    try:
        # Create the trigger for SQL Server
        trigger_sql = """
        IF NOT EXISTS (SELECT * FROM sys.triggers WHERE name = 'manage_franchise_manager_assignment')
        BEGIN
            EXEC('
                CREATE TRIGGER manage_franchise_manager_assignment
                ON Franquicias
                AFTER UPDATE
                AS
                BEGIN
                    SET NOCOUNT ON;
                    
                    -- Handle the new manager assignment
                    IF EXISTS (SELECT 1 FROM inserted WHERE CI_Encargado IS NOT NULL)
                    BEGIN
                        -- Update the employee''s role to ''Encargado'' and assign FranquiciaRIF
                        UPDATE Empleados 
                        SET Rol = N''Encargado'', 
                            FranquiciaRIF = i.RIF
                        FROM Empleados e
                        INNER JOIN inserted i ON e.CI = i.CI_Encargado;
                        
                        -- If the employee doesn''t exist, this will not affect any rows
                        -- but the trigger will still complete successfully
                    END;
                    
                    -- Handle the previous manager (if any)
                    IF EXISTS (
                        SELECT 1 FROM deleted d 
                        INNER JOIN inserted i ON d.RIF = i.RIF
                        WHERE d.CI_Encargado IS NOT NULL 
                        AND (i.CI_Encargado IS NULL OR d.CI_Encargado != i.CI_Encargado)
                    )
                    BEGIN
                        -- Check if the previous manager is still assigned to any franchise
                        UPDATE Empleados 
                        SET Rol = N''Empleado''
                        WHERE CI IN (
                            SELECT d.CI_Encargado 
                            FROM deleted d 
                            INNER JOIN inserted i ON d.RIF = i.RIF
                            WHERE d.CI_Encargado IS NOT NULL 
                            AND (i.CI_Encargado IS NULL OR d.CI_Encargado != i.CI_Encargado)
                            AND NOT EXISTS (
                                SELECT 1 FROM Franquicias f 
                                WHERE f.CI_Encargado = d.CI_Encargado 
                                AND f.RIF != i.RIF
                            )
                        );
                    END;
                END
            ')
        END
        """
        
        cursor.execute(trigger_sql)
        conn.commit()
        print("✅ Trigger 'manage_franchise_manager_assignment' created successfully!")
        
    except Exception as e:
        print(f"❌ Error creating franchise manager trigger: {str(e)}")
        conn.rollback()

def create_assign_franquicia_to_manager_trigger():
    """
    Create trigger to assign FranquiciaRIF to the manager (encargado) after a franchise is created
    """
    try:
        # Create the trigger for SQL Server
        trigger_sql = """
        IF NOT EXISTS (SELECT * FROM sys.triggers WHERE name = 'assign_franquicia_to_manager')
        BEGIN
            EXEC('
                CREATE TRIGGER assign_franquicia_to_manager
                ON Franquicias
                AFTER INSERT
                AS
                BEGIN
                    SET NOCOUNT ON;
                    -- Asignar el RIF de la franquicia al encargado (empleado)
                    UPDATE Empleados
                    SET FranquiciaRIF = inserted.RIF
                    FROM Empleados e
                    INNER JOIN inserted ON e.CI = inserted.CI_Encargado;
                END
            ')
        END
        """
        cursor.execute(trigger_sql)
        conn.commit()
        print("✅ Trigger 'assign_franquicia_to_manager' created successfully!")
    except Exception as e:
        print(f"❌ Error creating assign_franquicia_to_manager trigger: {str(e)}")
        conn.rollback()

def drop_inventory_trigger():
    """
    Drop the inventory trigger if needed
    """
    try:
        cursor.execute("DROP TRIGGER IF EXISTS update_inventory_on_purchase")
        conn.commit()
        print("✅ Trigger 'update_inventory_on_purchase' dropped successfully!")
        
    except Exception as e:
        print(f"❌ Error dropping trigger: {str(e)}")
        conn.rollback()

def drop_correction_trigger():
    """
    Drop the correction trigger if needed
    """
    try:
        cursor.execute("DROP TRIGGER IF EXISTS update_inventory_on_correction")
        conn.commit()
        print("✅ Trigger 'update_inventory_on_correction' dropped successfully!")
        
    except Exception as e:
        print(f"❌ Error dropping correction trigger: {str(e)}")
        conn.rollback()

def drop_service_order_trigger():
    """
    Drop the service order trigger if needed
    """
    try:
        cursor.execute("DROP TRIGGER IF EXISTS decrease_inventory_on_service_order")
        conn.commit()
        print("✅ Trigger 'decrease_inventory_on_service_order' dropped successfully!")
        
    except Exception as e:
        print(f"❌ Error dropping service order trigger: {str(e)}")
        conn.rollback()

def drop_franchise_manager_trigger():
    """
    Drop the franchise manager trigger if needed
    """
    try:
        cursor.execute("DROP TRIGGER IF EXISTS manage_franchise_manager_assignment")
        conn.commit()
        print("✅ Trigger 'manage_franchise_manager_assignment' dropped successfully!")
        
    except Exception as e:
        print(f"❌ Error dropping franchise manager trigger: {str(e)}")
        conn.rollback()

if __name__ == "__main__":
    print("Creating inventory triggers...")
    create_inventory_trigger()
    create_correction_trigger()
    create_service_order_trigger()
    create_franchise_manager_trigger() 