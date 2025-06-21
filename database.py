import os
import pyodbc
from dotenv import load_dotenv


load_dotenv()

db_server = os.getenv('AZURE_SQL_SERVER')
db_name = os.getenv('AZURE_SQL_DB')
db_user = os.getenv('AZURE_SQL_USER')
db_password = os.getenv('AZURE_SQL_PASSWORD')
db_driver = os.getenv('AZURE_SQL_DRIVER', 'ODBC Driver 17 for SQL Server')

connect_string = f"DRIVER={db_driver};SERVER={db_server};DATABASE={db_name};UID={db_user};PWD={db_password};Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;"

conn = pyodbc.connect(
            "Driver={SQL Server};"
            "Server=KUNORI\SQLEXPRESS;"
            "Database=MultiserviciosUniversal;"
            "Trusted_Connection=yes;")
database = conn.cursor()