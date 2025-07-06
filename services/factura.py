import serial
import time
import json
from datetime import datetime

def guardar_log(mensaje_enviado, respuesta):
    """
    Guarda el JSON enviado y la respuesta recibida en un archivo de log.

    Args:
        mensaje_enviado (str): El JSON (comando) que fue enviado a la impresora.
        respuesta (str): La respuesta recibida de la impresora.
    """
    with open("log_impresora.txt", "a", encoding="utf-8") as f:
        f.write(f"\n--- {datetime.now()} ---\n")
        f.write("JSON enviado:\n" + mensaje_enviado + "\n")
        f.write("Respuesta recibida:\n" + respuesta + "\n")
        f.write("------------------------------\n")

def generar_json_factura(invoice_data: dict, order_details: dict, activities: list, franquicia_rif: str):
    """
    Genera una lista de comandos JSON para crear una factura fiscal con los datos proporcionados.

    Args:
        invoice_data (dict): Datos de la factura (monto total, descuento, métodos de pago, etc.)
        order_details (dict): Detalles de la orden de servicio
        activities (list): Lista de actividades de la orden
        franquicia_rif (str): RIF de la franquicia

    Returns:
        str: Una cadena JSON que contiene la lista de comandos para la impresora fiscal.
    """
    comandos = [] # Lista para almacenar todos los comandos JSON de la factura.

    # --- Configuración del Encabezado de la Factura ---
    # Obtener información de la franquicia para el encabezado
    encabezado_lineas = [
        "Multiservicios Universal M&U ",
        f"RIF: {franquicia_rif}",
        "+ productos ecologico = - Contaminacion"
    ]
    comandos.append({
        "cmd": "encF",
        "data": encabezado_lineas
    })

    # --- Configuración del Cliente ---
    # Extraer información del cliente desde order_details
    cliente_ci = order_details.get('order', {}).get('CI_Cliente', '00000000')
    nombre_cliente = order_details.get('order', {}).get('NombreCliente', 'Cliente General')
    
    # Dividir el nombre del cliente en líneas si es muy largo
    razon_social_lineas = []
    if len(nombre_cliente) <= 49:
        razon_social_lineas = [nombre_cliente]
    else:
        # Dividir en dos líneas si es necesario
        razon_social_lineas = [nombre_cliente[:49], nombre_cliente[49:113]]  # 49 + 64 = 113 caracteres máximo
    
    # Líneas adicionales del cliente (vacías por defecto)
    lineas_adicionales_cliente = []

    comandos.append({
        "cmd": "cliF",
        "data": {
            "rifCI": cliente_ci,
            "razSoc": razon_social_lineas,
            "LineAd": lineas_adicionales_cliente
        }
    })

    # --- Configuración de Productos (Actividades + Productos Físicos) ---
    productos = []
    
    # 1. Agregar actividades como productos
    for actividad in activities:
        # Extraer datos de la actividad
        nombre_servicio = actividad.get('NombreServicio', 'Servicio')
        descripcion_actividad = actividad.get('DescripcionActividad', 'Actividad')
        costo_actividad = actividad.get('Costo_Act', 0)
        
        # Crear descripción del producto combinando servicio y actividad
        descripcion_producto = f"{nombre_servicio}: {descripcion_actividad}"
        if len(descripcion_producto) > 39:
            descripcion_producto = descripcion_producto[:39]
        
        # Convertir el costo a formato de la impresora (enteros con 2 decimales)
        precio_entero = int(costo_actividad * 100)  # Convertir a centavos
        
        producto_data = {
            "cant": "1000",  # Cantidad fija de 1.000 (1 unidad)
            "des01": descripcion_producto,
            "imp": 2,  # Tipo de impuesto: 16% IVA
            "pre": str(precio_entero)
        }

        # 'proF' (Producto de Factura): Comando para añadir un producto.
        productos.append({"cmd": "proF", "data": producto_data})
    
    # 2. Agregar productos físicos utilizados
    products_from_order = order_details.get('products', [])
    for product in products_from_order:
        # Extraer datos del producto
        nombre_producto = product.get('NombreProducto', 'Producto')
        cantidad_utilizada = product.get('CantidadUtilizada', 1)
        precio_producto = product.get('PrecioProducto', 0)
        
        # Crear descripción del producto
        descripcion_producto = nombre_producto
        if len(descripcion_producto) > 39:
            descripcion_producto = descripcion_producto[:39]
        
        # Convertir cantidad a formato de la impresora (enteros con 3 decimales)
        cantidad_entero = int(cantidad_utilizada * 1000)  # Convertir a milésimas
        
        # Convertir precio a formato de la impresora (enteros con 2 decimales)
        precio_entero = int(precio_producto * 100)  # Convertir a centavos
        
        producto_data = {
            "cant": str(cantidad_entero),
            "des01": descripcion_producto,
            "imp": 2,  # Tipo de impuesto: 16% IVA
            "pre": str(precio_entero)
        }

        # 'proF' (Producto de Factura): Comando para añadir un producto.
        productos.append({"cmd": "proF", "data": producto_data})

    # Si no hay actividades, no tiene sentido continuar
    if not productos:
        print("\n⚠️ No se encontraron actividades. No se generará una factura.")
        comandos.append({
            "cmd": "endFac",
            "data": 1
        })
        return json.dumps(comandos, indent=2, ensure_ascii=False)

    # Añadir los productos a la lista de comandos principal
    comandos.extend(productos)

    # --- Aplicación de Descuento por Porcentaje ---
    # Obtener el descuento desde invoice_data
    porcentaje_descuento = invoice_data.get('PorcentajeDescuento', 0)
    
    # Convertir el porcentaje a formato de la impresora (enteros con 2 decimales)
    descuento_subtotal_porcentaje = int(porcentaje_descuento * 100)  # Convertir a centavos
    
    # --- Subtotal de Productos con Descuento ---
    comandos.append({
        "cmd": "subToF",
        "data": 3,  # 3 para descuento total por porcentaje
        "valor": descuento_subtotal_porcentaje
    })

    # --- Configuración de Formas de Pago ---
    # Obtener métodos de pago desde invoice_data
    metodos_pago = invoice_data.get('MetodosPago', [])
    formas_pago = []
    
    # Calcular el total de la factura (suma de todos los productos)
    total_factura = 0
    for producto in productos:
        cantidad = int(producto['data']['cant']) / 1000  # Convertir de milésimas a unidades
        precio = int(producto['data']['pre']) / 100      # Convertir de centavos a unidades
        total_factura += cantidad * precio
    
    print(f"💰 Total calculado de la factura: ${total_factura:.2f}")
    
    # NUEVA LÓGICA: Usar -1 para indicar "pagar el restante"
    # La impresora fiscal entiende -1 como "pagar todo lo que falta"
    
    print(f"\n💡 USANDO FUNCIONALIDAD -1 DE LA IMPRESORA:")
    print(f"   - Total factura: ${total_factura:.2f}")
    
    # Distribuir los métodos de pago con lógica de -1
    formas_pago = []
    total_pagado_parcial = 0
    
    for i, metodo in enumerate(metodos_pago):
        tipo_pago = metodo.get('Metodo', 'Efectivo')
        cantidad = metodo.get('Cantidad', 0)
        
        # Mapear tipos de pago a códigos de la impresora
        tipo_codigo = mapear_tipo_pago(tipo_pago)
        
        # Determinar el monto a enviar
        if cantidad == -1:
            # -1 significa "pagar el restante"
            print(f"   💳 {tipo_pago}: -1 (pagar restante)")
            monto_entero = -1
        else:
            # Monto específico
            monto_entero = int(cantidad * 100)  # Convertir a centavos
            total_pagado_parcial += cantidad
            print(f"   💳 {tipo_pago}: ${cantidad:.2f}")
        
        formas_pago.append({
            "cmd": "fpaF",
            "data": {
                "monto": monto_entero,
                "tasaConv": 0,
                "tipo": tipo_codigo
            }
        })
    
    # Si no se ingresó ninguna forma de pago, usar -1 para pagar todo
    if not formas_pago:
        print("⚠️ No se ingresó ninguna forma de pago. Usando -1 para pagar todo.")
        formas_pago = [{
            "cmd": "fpaF",
            "data": {
                "monto": -1,  # Pagar todo
                "tasaConv": 0,
                "tipo": 1  # Tipo 1: EFECTIVO
            }
        }]
    
    # Verificar si hay al menos un -1 o si los montos suman correctamente
    hay_menos_uno = any(fp['data']['monto'] == -1 for fp in formas_pago)
    
    if hay_menos_uno:
        print(f"   ✅ Usando -1 para pagar restante")
    else:
        # Verificar que los montos sumen correctamente
        total_pagos = sum(fp['data']['monto'] / 100 for fp in formas_pago if fp['data']['monto'] != -1)
        print(f"   - Total pagos específicos: ${total_pagos:.2f}")
        
        if abs(total_pagos - total_factura) > 0.01:
            print(f"   ⚠️ ADVERTENCIA: Total pagos (${total_pagos:.2f}) ≠ Total factura (${total_factura:.2f})")
            print(f"   💡 SUGERENCIA: Usar -1 en algún método de pago para pagar el restante")
        else:
            print(f"   ✅ Total pagos coincide con total factura")
    
    comandos.extend(formas_pago)

    # --- Fin de la Factura ---
    comandos.append({
        "cmd": "endFac",
        "data": 1
    })

    return json.dumps(comandos, indent=2, ensure_ascii=False)

def mapear_tipo_pago(tipo_pago: str) -> int:
    """
    Mapea los tipos de pago del sistema a los códigos de la impresora fiscal.
    
    Args:
        tipo_pago (str): Tipo de pago del sistema
        
    Returns:
        int: Código correspondiente en la impresora fiscal
    """
    mapeo = {
        'Efectivo': 1,
        'Tarjeta': 3,  # T. CREDITO por defecto
        'Pago Móvil': 5,
        'Transferencia': 4,
        'T. DEBITO': 2,
        'BIOPAGO': 6
    }
    
    return mapeo.get(tipo_pago, 1)  # Por defecto Efectivo

def imprimir_factura_fiscal(invoice_data: dict, order_details: dict, activities: list, franquicia_rif: str, puerto_serial: str = "COM8"):
    """
    Función principal para generar e imprimir una factura fiscal.
    
    Args:
        invoice_data (dict): Datos de la factura
        order_details (dict): Detalles de la orden de servicio
        activities (list): Lista de actividades de la orden
        franquicia_rif (str): RIF de la franquicia
        puerto_serial (str): Puerto serial (por defecto COM8)
        
    Returns:
        dict: Resultado de la operación
    """
    try:
        print(f"\n🔧 CONFIGURACIÓN DE IMPRESIÓN:")
        print(f"   - Puerto: {puerto_serial}")
        print(f"   - Baud rate: 115200")
        print(f"   - Timeout: 2 segundos")
        
        # Generar el JSON de la factura
        json_data = generar_json_factura(invoice_data, order_details, activities, franquicia_rif)
        print(f"\n📄 JSON GENERADO (FINAL):")
        print("-" * 60)
        print(json_data)
        print("-" * 60)
        
        # Configuración de comunicación serial
        baud_rate = 115200
        
        print(f"\n🔌 INTENTANDO CONEXIÓN SERIAL...")
        
        # Abrir conexión serial con la impresora
        with serial.Serial(puerto_serial, baud_rate, timeout=5) as ser:  # Aumentado timeout a 5 segundos
            ser.flushOutput()
            print(f"✅ Conectado exitosamente a {puerto_serial}")
            
            # Enviar el JSON a la impresora
            print(f"📤 Enviando datos a la impresora...")
            ser.write(json_data.encode('utf-8'))
            print(f"✅ Datos enviados ({len(json_data)} bytes)")
            
            # Esperar más tiempo para que la impresora procese
            print(f"⏳ Esperando procesamiento de la impresora...")
            time.sleep(3)  # Aumentado a 3 segundos
            
            # Leer respuesta de la impresora con múltiples intentos
            print(f"📥 Leyendo respuesta de la impresora...")
            respuesta_completa = ""
            intentos = 0
            max_intentos = 5
            
            while intentos < max_intentos:
                if ser.in_waiting:
                    respuesta = ser.read(ser.in_waiting).decode('utf-8', errors='replace')
                    respuesta_completa += respuesta
                    print(f"📬 Respuesta parcial (intento {intentos + 1}): {respuesta}")
                    
                    # Si la respuesta contiene "OK" o "ERROR", terminamos
                    if "OK" in respuesta or "ERROR" in respuesta or "error" in respuesta.lower():
                        break
                else:
                    print(f"⏳ No hay datos disponibles (intento {intentos + 1})")
                
                time.sleep(1)
                intentos += 1
            
            if not respuesta_completa:
                respuesta_completa = "(sin respuesta después de 5 intentos)"
                print(f"⚠️ No se recibió respuesta después de {max_intentos} intentos")
            
            # Analizar la respuesta para detectar errores
            print(f"\n🔍 ANÁLISIS DE RESPUESTA:")
            print(f"   - Respuesta completa: {respuesta_completa}")
            
            if "error" in respuesta_completa.lower() or "err" in respuesta_completa.lower():
                print(f"   ❌ ERROR DETECTADO en respuesta de impresora")
                return {
                    "success": False,
                    "message": f"Error en impresora fiscal: {respuesta_completa}",
                    "puerto": puerto_serial,
                    "respuesta_impresora": respuesta_completa,
                    "error_type": "printer_error"
                }
            elif "ok" in respuesta_completa.lower():
                print(f"   ✅ ÉXITO - Impresora respondió OK")
            else:
                print(f"   ⚠️ RESPUESTA AMBIGUA - Revisar manualmente")
            
            # Guardar en log
            print(f"📝 Guardando en log...")
            guardar_log(json_data, respuesta_completa)
            print(f"✅ Log guardado en log_impresora.txt")
            
            return {
                "success": True,
                "message": "Factura enviada a la impresora fiscal",
                "puerto": puerto_serial,
                "respuesta_impresora": respuesta_completa
            }
            
    except serial.SerialException as e:
        error_msg = f"Error al abrir el puerto serial '{puerto_serial}': {e}"
        print(f"\n❌ ERROR DE CONEXIÓN SERIAL:")
        print(f"   - Puerto: {puerto_serial}")
        print(f"   - Error: {e}")
        print(f"   - Tipo: SerialException")
        print(f"   - Solución: Verificar que el puerto {puerto_serial} esté disponible")
        return {
            "success": False,
            "message": error_msg,
            "error": str(e)
        }
    except Exception as e:
        error_msg = f"Error en la comunicación: {e}"
        print(f"\n❌ ERROR GENERAL:")
        print(f"   - Error: {e}")
        print(f"   - Tipo: {type(e).__name__}")
        print(f"   - Detalles: {str(e)}")
        return {
            "success": False,
            "message": error_msg,
            "error": str(e)
        }

# --- Función de compatibilidad para uso directo (mantener para pruebas) ---
def generar_json_dinamico():
    """
    Función de compatibilidad que mantiene la funcionalidad original para pruebas.
    Esta función se mantiene por compatibilidad pero no se usa en la integración.
    """
    print("⚠️ Esta función está obsoleta. Use imprimir_factura_fiscal() en su lugar.")
    return "{}"

# --- Lógica principal de ejecución (solo para pruebas independientes) ---
if __name__ == "__main__":
    print("Este módulo está diseñado para ser importado desde createInvoiceWithPayments.")
    print("Para pruebas independientes, use la función imprimir_factura_fiscal() directamente.")

