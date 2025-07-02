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

if __name__ == "__main__":
    print("Creating inventory trigger...")
    create_inventory_trigger() 