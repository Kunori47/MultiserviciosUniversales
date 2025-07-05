#!/usr/bin/env python3
"""
Script de prueba para verificar el funcionamiento de los roles nativos de SQL Server
"""

import pyodbc
import sys
from datetime import datetime

def test_connection(username, password, test_name):
    """Prueba la conexión con un usuario específico"""
    try:
        connection_string = (
            f"Driver={{SQL Server}};"
            f"Server=KUNORI\\SQLEXPRESS;"
            f"Database=MultiserviciosUniversal;"
            f"UID={username};"
            f"PWD={password};"
        )
        
        conn = pyodbc.connect(connection_string)
        cursor = conn.cursor()
        
        print(f"✅ {test_name}: Conexión exitosa con usuario '{username}'")
        
        # Probar consulta básica
        cursor.execute("SELECT COUNT(*) FROM Empleados")
        result = cursor.fetchone()
        print(f"   - Empleados en la base de datos: {result[0] if result else 0}")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ {test_name}: Error de conexión con usuario '{username}': {e}")
        return False

def test_permissions(username, password, test_name, operations):
    """Prueba permisos específicos para un usuario"""
    try:
        connection_string = (
            f"Driver={{SQL Server}};"
            f"Server=KUNORI\\SQLEXPRESS;"
            f"Database=MultiserviciosUniversal;"
            f"UID={username};"
            f"PWD={password};"
        )
        
        conn = pyodbc.connect(connection_string)
        cursor = conn.cursor()
        
        print(f"\n🔍 {test_name}: Probando permisos para '{username}'")
        
        for operation, table, sql in operations:
            try:
                if operation == "SELECT":
                    cursor.execute(sql)
                    result = cursor.fetchone()
                    print(f"   ✅ SELECT en {table}: {result[0] if result else 0} registros")
                elif operation == "INSERT":
                    # Para INSERT, usamos una tabla temporal o de prueba
                    if "test_table" in sql.lower():
                        cursor.execute(sql)
                        print(f"   ✅ INSERT en tabla de prueba: exitoso")
                elif operation == "UPDATE":
                    # Para UPDATE, verificamos si podemos ejecutar la consulta
                    cursor.execute(sql)
                    print(f"   ✅ UPDATE en {table}: exitoso")
                elif operation == "DELETE":
                    # Para DELETE, verificamos si podemos ejecutar la consulta
                    cursor.execute(sql)
                    print(f"   ✅ DELETE en {table}: exitoso")
                    
            except Exception as e:
                print(f"   ❌ {operation} en {table}: {str(e)[:100]}...")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ {test_name}: Error general: {e}")
        return False

def test_role_hierarchy():
    """Prueba la jerarquía de roles y permisos"""
    print("\n" + "="*60)
    print("PRUEBAS DE ROLES Y PERMISOS")
    print("="*60)
    
    # Definir operaciones de prueba para cada rol
    test_cases = [
        {
            "username": "admin_user",
            "password": "Password123!",
            "test_name": "Administrador",
            "operations": [
                ("SELECT", "Empleados", "SELECT COUNT(*) FROM Empleados"),
                ("SELECT", "Franquicias", "SELECT COUNT(*) FROM Franquicias"),
                ("SELECT", "Clientes", "SELECT COUNT(*) FROM Clientes"),
                ("SELECT", "Vista", "SELECT COUNT(*) FROM Vista_ResumenMensualFranquiciaSimple"),
            ]
        },
        {
            "username": "juan_enc",
            "password": "Password123!",
            "test_name": "Encargado",
            "operations": [
                ("SELECT", "Empleados", "SELECT COUNT(*) FROM Empleados"),
                ("SELECT", "ProductosFranquicia", "SELECT COUNT(*) FROM ProductosFranquicia"),
                ("SELECT", "Clientes", "SELECT COUNT(*) FROM Clientes"),
                ("SELECT", "Vista", "SELECT COUNT(*) FROM Vista_ResumenMensualFranquiciaSimple"),
            ]
        },
        {
            "username": "maria_emp",
            "password": "Password123!",
            "test_name": "Empleado",
            "operations": [
                ("SELECT", "Empleados", "SELECT COUNT(*) FROM Empleados"),
                ("SELECT", "Clientes", "SELECT COUNT(*) FROM Clientes"),
                ("SELECT", "Pagos", "SELECT COUNT(*) FROM Pagos"),
                ("SELECT", "Vista", "SELECT COUNT(*) FROM Vista_ResumenMensualFranquiciaSimple"),
            ]
        }
    ]
    
    # Ejecutar pruebas
    for test_case in test_cases:
        test_permissions(
            test_case["username"],
            test_case["password"],
            test_case["test_name"],
            test_case["operations"]
        )

def test_connection_all_users():
    """Prueba la conexión de todos los usuarios"""
    print("\n" + "="*60)
    print("PRUEBAS DE CONEXIÓN")
    print("="*60)
    
    users = [
        ("admin_user", "Password123!", "Administrador"),
        ("juan_enc", "Password123!", "Encargado"),
        ("maria_emp", "Password123!", "Empleado")
    ]
    
    successful_connections = 0
    for username, password, role in users:
        if test_connection(username, password, role):
            successful_connections += 1
    
    print(f"\n📊 Resumen de conexiones: {successful_connections}/{len(users)} exitosas")

def get_roles_info():
    """Obtiene información sobre los roles creados"""
    try:
        connection_string = (
            "Driver={SQL Server};"
            "Server=KUNORI\\SQLEXPRESS;"
            "Database=MultiserviciosUniversal;"
            "Trusted_Connection=yes;"
        )
        
        conn = pyodbc.connect(connection_string)
        cursor = conn.cursor()
        
        print("\n" + "="*60)
        print("INFORMACIÓN DE ROLES")
        print("="*60)
        
        # Obtener roles creados
        cursor.execute("""
        SELECT name, type_desc 
        FROM sys.database_principals 
        WHERE type = 'R' AND name NOT LIKE 'db_%'
        ORDER BY name
        """)
        roles = cursor.fetchall()
        
        print(f"Roles creados ({len(roles)}):")
        for role in roles:
            print(f"  - {role[0]} ({role[1]})")
        
        # Obtener usuarios y sus roles
        print(f"\nUsuarios y sus roles:")
        cursor.execute("""
        SELECT 
            u.name AS Usuario,
            r.name AS Rol
        FROM sys.database_role_members rm
        JOIN sys.database_principals u ON rm.member_principal_id = u.principal_id
        JOIN sys.database_principals r ON rm.role_principal_id = r.principal_id
        WHERE u.type = 'S' AND r.type = 'R'
        ORDER BY u.name
        """)
        user_roles = cursor.fetchall()
        
        for user_role in user_roles:
            print(f"  - {user_role[0]} → {user_role[1]}")
        
        conn.close()
        
    except Exception as e:
        print(f"❌ Error obteniendo información de roles: {e}")

def main():
    """Función principal"""
    print("🧪 SCRIPT DE PRUEBA - ROLES NATIVOS SQL SERVER")
    print(f"Fecha y hora: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    try:
        # Obtener información de roles
        get_roles_info()
        
        # Probar conexiones
        test_connection_all_users()
        
        # Probar permisos
        test_role_hierarchy()
        
        print("\n" + "="*60)
        print("✅ PRUEBAS COMPLETADAS")
        print("="*60)
        
    except Exception as e:
        print(f"\n❌ Error durante las pruebas: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 