import os
import pyodbc
from dotenv import load_dotenv

load_dotenv()

# Variables de entorno 
db_server = os.getenv('AZURE_SQL_SERVER')
db_name = os.getenv('AZURE_SQL_DB')
db_user = os.getenv('AZURE_SQL_USER')
db_password = os.getenv('AZURE_SQL_PASSWORD')
db_driver = os.getenv('AZURE_SQL_DRIVER', 'ODBC Driver 17 for SQL Server')

def get_connection():
    """Función para obtener conexión a la base de datos"""
    try:
        # Conectar a SQL Server local
        conn_master = pyodbc.connect(
            "Driver={SQL Server};"
            "Server=SANTIAGO\SQLEXPRESS;"
            "Database=master;"
            "Trusted_Connection=yes;"
        )
        conn_master.autocommit = True
        cursor_master = conn_master.cursor()
        
        print("Conectado a SQL Server")
        
        # Crear base de datos si no existe
        try:
            cursor_master.execute("CREATE DATABASE MultiserviciosUniversal")
            print("Base de datos 'MultiserviciosUniversal' creada")
        except pyodbc.Error as e:
            # Error code 1801 = database already exists
            if hasattr(e, 'args') and len(e.args) > 1 and '1801' in str(e.args[1]):
                print("Base de datos 'MultiserviciosUniversal' ya existe")
            else:
                raise e
        
        conn_master.close()
        
        # Conectar a la base de datos 
        conn = pyodbc.connect(
            "Driver={SQL Server};"
            "Server=SANTIAGO\SQLEXPRESS;"
            "Database=MultiserviciosUniversal;"
            "Trusted_Connection=yes;"
        )
        cursor = conn.cursor()
        database = conn.cursor()
        
        print("Conectado a MultiserviciosUniversal")
        print("=" * 60)
        
        return conn, cursor, database
        
    except pyodbc.Error as e:
        print(f"Error de conexión: {e}")
        print("\nPosibles soluciones:")
        raise

# Obtener conexión global
conn, cursor, database = get_connection()