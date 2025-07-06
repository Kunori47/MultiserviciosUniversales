// Tema Ecológico - Colores y estilos relacionados al medio ambiente
export const ecoTheme = {
  // Colores principales del tema ecológico
  colors: {
    // Verde principal - representa naturaleza y sostenibilidad
    primary: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e', // Verde principal
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    // Verde azulado - representa agua y limpieza
    secondary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9', // Azul principal
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    // Verde bosque - para elementos de fondo
    forest: {
      50: '#f6f7f6',
      100: '#e3e7e3',
      200: '#c7cfc7',
      300: '#a3b1a3',
      400: '#7a8f7a',
      500: '#5a735a', // Verde bosque
      600: '#475c47',
      700: '#3a4a3a',
      800: '#2f3c2f',
      900: '#283228',
    },
    // Verde lima - para acentos y alertas positivas
    lime: {
      50: '#f7fee7',
      100: '#ecfccb',
      200: '#d9f99d',
      300: '#bef264',
      400: '#a3e635',
      500: '#84cc16', // Verde lima
      600: '#65a30d',
      700: '#4d7c0f',
      800: '#3f6212',
      900: '#365314',
    },
    // Marrón tierra - para elementos naturales
    earth: {
      50: '#fdf8f6',
      100: '#f2e8e5',
      200: '#eaddd7',
      300: '#e0cec7',
      400: '#d2bab0',
      500: '#bfa094', // Marrón tierra
      600: '#a18072',
      700: '#977669',
      800: '#846358',
      900: '#43302b',
    },
    // Amarillo sol - para advertencias y energía
    sun: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b', // Amarillo sol
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    // Rojo coral - para alertas importantes
    coral: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444', // Rojo coral
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },
  },
  
  // Gradientes ecológicos
  gradients: {
    // Gradiente de bosque
    forest: 'linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #15803d 100%)',
    // Gradiente de océano
    ocean: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)',
    // Gradiente de amanecer
    sunrise: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #fde68a 100%)',
    // Gradiente de tierra
    earth: 'linear-gradient(135deg, #bfa094 0%, #a18072 50%, #977669 100%)',
    // Gradiente de hoja
    leaf: 'linear-gradient(135deg, #84cc16 0%, #65a30d 50%, #4d7c0f 100%)',
  },
  
  // Sombras ecológicas
  shadows: {
    soft: '0 2px 4px rgba(34, 197, 94, 0.1)',
    medium: '0 4px 6px rgba(34, 197, 94, 0.15)',
    large: '0 10px 15px rgba(34, 197, 94, 0.2)',
    glow: '0 0 20px rgba(34, 197, 94, 0.3)',
  },
  
  // Bordes redondeados naturales
  borderRadius: {
    small: '8px',
    medium: '12px',
    large: '16px',
    xl: '24px',
    full: '9999px',
  },
  
  // Espaciado natural
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
};

// Clases CSS para el tema ecológico
export const ecoClasses = {
  // Botones ecológicos
  button: {
    primary: 'bg-green-500 hover:bg-green-600 text-white border-green-500 hover:border-green-600',
    secondary: 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500 hover:border-blue-600',
    success: 'bg-lime-500 hover:bg-lime-600 text-white border-lime-500 hover:border-lime-600',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500 hover:border-yellow-600',
    danger: 'bg-red-500 hover:bg-red-600 text-white border-red-500 hover:border-red-600',
    info: 'bg-cyan-500 hover:bg-cyan-600 text-white border-cyan-500 hover:border-cyan-600',
    light: 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300 hover:border-gray-400',
    dark: 'bg-gray-800 hover:bg-gray-900 text-white border-gray-800 hover:border-gray-900',
  },
  
  // Tarjetas ecológicas
  card: {
    primary: 'bg-white border border-green-200 shadow-md hover:shadow-lg transition-shadow duration-300',
    secondary: 'bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 shadow-md',
    success: 'bg-gradient-to-br from-lime-50 to-green-50 border border-lime-200 shadow-md',
    warning: 'bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 shadow-md',
    danger: 'bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 shadow-md',
  },
  
  // Estados de inventario
  inventory: {
    scarce: 'bg-red-100 text-red-800 border-red-200',
    excess: 'bg-orange-100 text-orange-800 border-orange-200',
    low: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    available: 'bg-green-100 text-green-800 border-green-200',
  },
  
  // Fondos ecológicos
  background: {
    primary: 'bg-gradient-to-br from-green-50 via-blue-50 to-cyan-50',
    secondary: 'bg-gradient-to-br from-lime-50 to-green-50',
    nature: 'bg-gradient-to-br from-green-100 via-blue-100 to-cyan-100',
    earth: 'bg-gradient-to-br from-amber-50 via-orange-50 to-red-50',
  },
  
  // Textos ecológicos
  text: {
    primary: 'text-green-700',
    secondary: 'text-blue-700',
    success: 'text-lime-700',
    warning: 'text-yellow-700',
    danger: 'text-red-700',
    muted: 'text-gray-600',
  },
};

// Iconos ecológicos sugeridos
export const ecoIcons = {
  // Iconos de naturaleza
  nature: {
    leaf: 'mdiLeaf',
    tree: 'mdiTree',
    flower: 'mdiFlower',
    grass: 'mdiGrass',
    forest: 'mdiForest',
    mountain: 'mdiMountain',
    water: 'mdiWater',
    sun: 'mdiWeatherSunny',
    cloud: 'mdiWeatherCloudy',
    recycle: 'mdiRecycle',
    earth: 'mdiEarth',
    seed: 'mdiSeed',
  },
  
  // Iconos de sostenibilidad
  sustainability: {
    eco: 'mdiLeafMaple',
    green: 'mdiLeafCircle',
    organic: 'mdiSprout',
    renewable: 'mdiSolarPanel',
    energy: 'mdiLightningBolt',
    wind: 'mdiWeatherWindy',
    waterDrop: 'mdiWaterDrop',
    thermometer: 'mdiThermometer',
    gauge: 'mdiGauge',
    chart: 'mdiChartLine',
    trend: 'mdiTrendingUp',
  },
  
  // Iconos de gestión
  management: {
    inventory: 'mdiWarehouse',
    product: 'mdiPackageVariant',
    service: 'mdiWrench',
    order: 'mdiClipboardList',
    customer: 'mdiAccountGroup',
    employee: 'mdiAccountMultiple',
    vehicle: 'mdiCar',
    franchise: 'mdiStore',
    vendor: 'mdiTruckDelivery',
    brand: 'mdiTag',
    model: 'mdiCarMultiple',
  },
};

// Configuración de animaciones ecológicas
export const ecoAnimations = {
  // Animaciones suaves
  smooth: 'transition-all duration-300 ease-in-out',
  bounce: 'animate-bounce',
  pulse: 'animate-pulse',
  spin: 'animate-spin',
  
  // Animaciones personalizadas
  grow: 'transform scale-105 transition-transform duration-200',
  fade: 'opacity-0 animate-pulse',
  slide: 'transform translate-x-2 transition-transform duration-200',
  
  // Hover effects
  hover: {
    lift: 'hover:transform hover:scale-105 hover:shadow-lg transition-all duration-200',
    glow: 'hover:shadow-green-200 hover:shadow-lg transition-shadow duration-200',
    border: 'hover:border-green-400 transition-colors duration-200',
  },
}; 