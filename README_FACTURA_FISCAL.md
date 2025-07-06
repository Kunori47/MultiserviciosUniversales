# Integración de Impresión Fiscal Automática

## Resumen de Cambios

Se ha modificado el sistema para integrar la impresión fiscal automática con la función `createInvoiceWithPayments`. Ahora, cuando se presiona el botón "Generar Factura" en el frontend, se imprime automáticamente una factura fiscal con los datos generados.

## Archivos Modificados

### 1. `services/factura.py`

**Cambios principales:**
- ✅ Eliminada la entrada manual por consola
- ✅ Convertido en módulo que recibe datos como parámetros
- ✅ Puerto COM8 configurado por defecto
- ✅ Las actividades se tratan como productos con cantidad fija de 1
- ✅ Nueva función `imprimir_factura_fiscal()` para integración automática

**Nuevas funciones:**
- `generar_json_factura()`: Genera JSON para la impresora fiscal
- `mapear_tipo_pago()`: Mapea tipos de pago del sistema a códigos de la impresora
- `imprimir_factura_fiscal()`: Función principal de integración

### 2. `services/services.py`

**Cambios en `createInvoiceWithPayments()`:**
- ✅ Integración automática con `factura.py`
- ✅ Obtención automática de detalles de orden y actividades
- ✅ Impresión fiscal automática después de crear la factura
- ✅ Manejo de errores sin afectar la creación de la factura

## Flujo de Integración

```
Frontend (Botón "Generar Factura")
    ↓
createInvoiceWithPayments()
    ↓
1. Crear factura en base de datos
2. Insertar métodos de pago
3. Obtener detalles de orden
4. Obtener actividades de la orden
5. Llamar a factura.imprimir_factura_fiscal()
    ↓
Impresora Fiscal (Puerto COM8)
```

## Estructura de Datos

### Datos de Entrada para `imprimir_factura_fiscal()`

```python
invoice_data = {
    'NumeroOrden': int,
    'FranquiciaRIF': str,
    'FechaFactura': str,
    'MontoTotal': float,
    'PorcentajeDescuento': float,
    'MontoIVA': float,
    'MetodosPago': [
        {
            'Metodo': str,  # 'Efectivo', 'Tarjeta', 'Pago Móvil', etc.
            'Cantidad': float,
            'Descripcion': str
        }
    ]
}

order_details = {
    'order': {
        'CI_Cliente': str,
        'NombreCliente': str,
        'FechaEntrada': str,
        'HoraEntrada': str
    },
    'employees': [...],
    'products': [...]
}

activities = [
    {
        'CodigoServicio': int,
        'NombreServicio': str,
        'NumeroCorrelativoActividad': int,
        'DescripcionActividad': str,
        'Costo_Act': float
    }
]
```

## Mapeo de Tipos de Pago

| Tipo de Pago Sistema | Código Impresora | Descripción |
|---------------------|------------------|-------------|
| Efectivo | 1 | EFECTIVO |
| Tarjeta | 3 | T. CREDITO |
| Pago Móvil | 5 | PAGO MOVIL |
| Transferencia | 4 | TRANSFERENCIA |
| T. DEBITO | 2 | T. DEBITO |
| BIOPAGO | 6 | BIOPAGO |

## Configuración de Impresora

- **Puerto por defecto:** COM8
- **Baud rate:** 115200
- **Timeout:** 2 segundos
- **Encoding:** UTF-8

## Manejo de Errores

1. **Error en impresión fiscal:** No afecta la creación de la factura en la base de datos
2. **Datos faltantes:** Validación previa antes de llamar a la impresión
3. **Conexión serial:** Manejo de errores de comunicación
4. **Logging:** Todas las transacciones se registran en `log_impresora.txt`

## Archivo de Log

Todas las transacciones se registran en `log_impresora.txt` con:
- Timestamp
- JSON enviado a la impresora
- Respuesta de la impresora
- Separadores para fácil lectura

## Pruebas

### Archivo de Prueba: `test_factura_integration.py`

```bash
python test_factura_integration.py
```

Este script prueba:
1. Generación de JSON de factura
2. Mapeo de tipos de pago
3. Función de impresión (sin conexión real)
4. Estructura de datos
5. Integración completa (opcional, requiere base de datos)

## Consideraciones Técnicas

### Formato de Datos para Impresora

- **Precios:** Enteros con 2 decimales (ej: 15000 = 150.00)
- **Cantidades:** Enteros con 3 decimales (ej: 1000 = 1.000)
- **Descuentos:** Porcentajes como enteros con 2 decimales (ej: 500 = 5.00%)

### Actividades como Productos

- Cada actividad se convierte en un producto individual
- Cantidad fija de 1.000 (1 unidad)
- Descripción: "NombreServicio: DescripcionActividad"
- Precio: Costo_Act de la actividad

### Límites de la Impresora

- **Descripción de producto:** Máximo 39 caracteres
- **Razón social:** Primera línea 49 caracteres, siguientes 64 caracteres
- **Encabezado:** Máximo 9 líneas, 64 caracteres por línea

## Compatibilidad

- ✅ Mantiene compatibilidad con el código existente
- ✅ Función `generar_json_dinamico()` mantenida para pruebas
- ✅ No afecta otras funcionalidades del sistema
- ✅ Manejo de errores robusto

## Requisitos

- Python 3.7+
- Librería `pyserial`
- Impresora fiscal AEG-R1 (o compatible)
- Puerto COM8 disponible

## Instalación de Dependencias

```bash
pip install pyserial
```

## Uso

La integración es automática. Al llamar `createInvoiceWithPayments()` desde el frontend:

1. Se crea la factura en la base de datos
2. Se insertan los métodos de pago
3. Se imprime automáticamente la factura fiscal
4. Se retorna el resultado incluyendo el estado de la impresión

### Ejemplo de Respuesta

```json
{
    "message": "Invoice created successfully",
    "numero_factura": 123,
    "impresion_fiscal": {
        "success": true,
        "message": "Factura enviada a la impresora fiscal",
        "puerto": "COM8",
        "respuesta_impresora": "OK"
    }
}
``` 