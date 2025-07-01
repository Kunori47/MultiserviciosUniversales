# Sistema de Protección de Rutas

Este sistema protege las rutas de la aplicación basándose en los roles de usuario y la franquicia asignada.

## 🔐 Características

- **Protección automática**: Se aplica automáticamente en el layout principal
- **Protección granular**: Se puede aplicar a páginas específicas
- **Redirección inteligente**: Redirige usuarios no autorizados a páginas apropiadas
- **Mensajes de error personalizados**: Muestra mensajes claros cuando se deniega el acceso

## 🛠️ Componentes

### 1. Hook `useRouteProtection`

Protección automática que se ejecuta en cada cambio de ruta.

```tsx
import { useRouteProtection } from "../_hooks/useRouteProtection";

// En el layout principal
useRouteProtection();
```

### 2. Componente `RouteProtection`

Protección granular para páginas específicas.

```tsx
import RouteProtection from "../_components/RouteProtection";

// Proteger página solo para administradores
<RouteProtection requiredRole="Administrador">
  <TuComponente />
</RouteProtection>

// Proteger página solo para encargados
<RouteProtection requiredRole="Encargado">
  <TuComponente />
</RouteProtection>

// Proteger página para ambos roles
<RouteProtection requiredRole="both">
  <TuComponente />
</RouteProtection>

// Proteger página específica de franquicia
<RouteProtection requiredRole="both" requireFranchiseMatch={true}>
  <TuComponente />
</RouteProtection>
```

## 📋 Rutas Protegidas

### Rutas Solo para Administradores
- `/dashboard/franchise` - Lista de franquicias
- `/dashboard/products` - Productos
- `/dashboard/brands` - Marcas
- `/dashboard/specialty` - Especialidades
- `/dashboard/supplier-line` - Líneas de suministro
- `/dashboard/vendor` - Proveedores
- `/dashboard/customer` - Clientes
- `/dashboard/vehicle` - Vehículos
- `/dashboard/service-orders/create` - Crear órdenes de servicio
- `/dashboard/ui` - Componentes UI
- `/dashboard/tables` - Tablas
- `/dashboard/profile` - Perfil

### Rutas Específicas de Franquicia
- `/dashboard/franchise/[rif]` - Detalle de franquicia
- `/dashboard/franchise/[rif]/employee` - Empleados
- `/dashboard/franchise/[rif]/inventory` - Inventario
- `/dashboard/franchise/[rif]/orders` - Órdenes
- `/dashboard/franchise/[rif]/purchase` - Compras
- `/dashboard/franchise/[rif]/services` - Servicios
- `/dashboard/franchise/[rif]/profitability` - Rentabilidad
- `/dashboard/franchise/[rif]/revenue` - Ingresos

## 🔄 Comportamiento

### Para Encargados
- **Acceso denegado** a rutas de administrador → Redirige a su franquicia
- **Acceso denegado** a franquicias diferentes → Redirige a su franquicia
- **Dashboard principal** → Redirige automáticamente a su franquicia

### Para Administradores
- **Acceso completo** a todas las rutas
- **Sin restricciones** de franquicia

## 📝 Ejemplos de Uso

### Proteger página de administración
```tsx
export default function AdminPage() {
  return (
    <RouteProtection requiredRole="Administrador">
      <SectionMain>
        <h1>Página de Administración</h1>
        {/* Contenido solo para administradores */}
      </SectionMain>
    </RouteProtection>
  );
}
```

### Proteger página específica de franquicia
```tsx
export default function FranchisePage() {
  return (
    <RouteProtection requiredRole="both" requireFranchiseMatch={true}>
      <SectionMain>
        <h1>Mi Franquicia</h1>
        {/* Contenido para usuarios de esta franquicia */}
      </SectionMain>
    </RouteProtection>
  );
}
```

### Componente personalizado de error
```tsx
<RouteProtection 
  requiredRole="Administrador"
  fallbackComponent={
    <div className="text-center py-8">
      <h2>Acceso Restringido</h2>
      <p>Esta página es solo para administradores.</p>
    </div>
  }
>
  <TuComponente />
</RouteProtection>
```

## ⚠️ Consideraciones

1. **El hook `useRouteProtection` se ejecuta automáticamente** en el layout principal
2. **Los componentes `RouteProtection` son opcionales** para protección adicional
3. **Las redirecciones son automáticas** y no requieren intervención manual
4. **Los mensajes de error son configurables** usando `fallbackComponent` 