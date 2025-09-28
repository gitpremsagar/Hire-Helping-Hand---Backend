/**
 * Available Lucide React icons for service categories
 * These are the exact icon names that can be stored in the database
 */

export const SERVICE_CATEGORY_ICONS = {
  // Technology & Development
  CODE: 'Code',
  TERMINAL: 'Terminal',
  MONITOR: 'Monitor',
  SMARTPHONE: 'Smartphone',
  DATABASE: 'Database',
  CLOUD: 'Cloud',
  SERVER: 'Server',
  NETWORK: 'Network',
  CPU: 'Cpu',
  HARD_DRIVE: 'HardDrive',
  
  // Design & Creative
  PALETTE: 'Palette',
  PEN_TOOL: 'PenTool',
  BRUSH: 'Brush',
  IMAGE: 'Image',
  LAYERS: 'Layers',
  COMPASS: 'Compass',
  EYE: 'Eye',
  CROP: 'Crop',
  FILTER: 'Filter',
  
  // Writing & Content
  FILE_TEXT: 'FileText',
  TYPE: 'Type',
  BOOK_OPEN: 'BookOpen',
  EDIT: 'Edit',
  QUOTE: 'Quote',
  ALIGN_LEFT: 'AlignLeft',
  BOLD: 'Bold',
  ITALIC: 'Italic',
  
  // Marketing & Business
  MEGAPHONE: 'Megaphone',
  TRENDING_UP: 'TrendingUp',
  BAR_CHART: 'BarChart',
  PIE_CHART: 'PieChart',
  TARGET: 'Target',
  USERS: 'Users',
  BRIEFCASE: 'Briefcase',
  BUILDING: 'Building',
  
  // Education & Learning
  GRADUATION_CAP: 'GraduationCap',
  BOOK: 'Book',
  LIGHTBULB: 'Lightbulb',
  CALCULATOR: 'Calculator',
  GLOBE: 'Globe',
  LANGUAGES: 'Languages',
  MICROSCOPE: 'Microscope',
  
  // Health & Wellness
  HEART: 'Heart',
  ACTIVITY: 'Activity',
  ZAP: 'Zap',
  SHIELD: 'Shield',
  STETHOSCOPE: 'Stethoscope',
  PILL: 'Pill',
  
  // Photography & Media
  CAMERA: 'Camera',
  VIDEO: 'Video',
  MICROPHONE: 'Microphone',
  HEADPHONES: 'Headphones',
  MUSIC: 'Music',
  PLAY: 'Play',
  PAUSE: 'Pause',
  
  // Finance & Legal
  DOLLAR_SIGN: 'DollarSign',
  CREDIT_CARD: 'CreditCard',
  SCALE: 'Scale',
  FILE_CHECK: 'FileCheck',
  LOCK: 'Lock',
  
  // Travel & Lifestyle
  MAP_PIN: 'MapPin',
  PLANE: 'Plane',
  CAR: 'Car',
  HOME: 'Home',
  UMBRELLA: 'Umbrella',
  SUN: 'Sun',
  MOON: 'Moon',
  
  // Food & Hospitality
  UTENSILS: 'Utensils',
  COFFEE: 'Coffee',
  WINE: 'Wine',
  CAKE: 'Cake',
  CHEF_HAT: 'ChefHat',
  
  // Sports & Fitness
  DUMBBELL: 'Dumbbell',
  TROPHY: 'Trophy',
  FOOTBALL: 'Football',
  BASKETBALL: 'Basketball',
  RUN: 'Run',
  SWIMMING: 'Swimming',
  
  // Other Services
  WRENCH: 'Wrench',
  HAMMER: 'Hammer',
  SCISSORS: 'Scissors',
  CLOCK: 'Clock',
  CALENDAR: 'Calendar',
  MAIL: 'Mail',
  PHONE: 'Phone',
  MESSAGE_CIRCLE: 'MessageCircle',
} as const;

// Type for icon names
export type ServiceCategoryIcon = typeof SERVICE_CATEGORY_ICONS[keyof typeof SERVICE_CATEGORY_ICONS];

// Helper function to validate icon names
export const isValidIcon = (iconName: string): iconName is ServiceCategoryIcon => {
  return Object.values(SERVICE_CATEGORY_ICONS).includes(iconName as ServiceCategoryIcon);
};

// Get all available icons
export const getAllIcons = (): ServiceCategoryIcon[] => {
  return Object.values(SERVICE_CATEGORY_ICONS);
};

// Icon categories for better organization
export const ICON_CATEGORIES = {
  TECHNOLOGY: [
    SERVICE_CATEGORY_ICONS.CODE,
    SERVICE_CATEGORY_ICONS.TERMINAL,
    SERVICE_CATEGORY_ICONS.MONITOR,
    SERVICE_CATEGORY_ICONS.SMARTPHONE,
    SERVICE_CATEGORY_ICONS.DATABASE,
    SERVICE_CATEGORY_ICONS.CLOUD,
    SERVICE_CATEGORY_ICONS.SERVER,
    SERVICE_CATEGORY_ICONS.NETWORK,
    SERVICE_CATEGORY_ICONS.CPU,
    SERVICE_CATEGORY_ICONS.HARD_DRIVE,
  ],
  DESIGN: [
    SERVICE_CATEGORY_ICONS.PALETTE,
    SERVICE_CATEGORY_ICONS.PEN_TOOL,
    SERVICE_CATEGORY_ICONS.BRUSH,
    SERVICE_CATEGORY_ICONS.IMAGE,
    SERVICE_CATEGORY_ICONS.LAYERS,
    SERVICE_CATEGORY_ICONS.COMPASS,
    SERVICE_CATEGORY_ICONS.EYE,
    SERVICE_CATEGORY_ICONS.CROP,
    SERVICE_CATEGORY_ICONS.FILTER,
  ],
  WRITING: [
    SERVICE_CATEGORY_ICONS.FILE_TEXT,
    SERVICE_CATEGORY_ICONS.TYPE,
    SERVICE_CATEGORY_ICONS.BOOK_OPEN,
    SERVICE_CATEGORY_ICONS.EDIT,
    SERVICE_CATEGORY_ICONS.QUOTE,
    SERVICE_CATEGORY_ICONS.ALIGN_LEFT,
    SERVICE_CATEGORY_ICONS.BOLD,
    SERVICE_CATEGORY_ICONS.ITALIC,
  ],
  BUSINESS: [
    SERVICE_CATEGORY_ICONS.MEGAPHONE,
    SERVICE_CATEGORY_ICONS.TRENDING_UP,
    SERVICE_CATEGORY_ICONS.BAR_CHART,
    SERVICE_CATEGORY_ICONS.PIE_CHART,
    SERVICE_CATEGORY_ICONS.TARGET,
    SERVICE_CATEGORY_ICONS.USERS,
    SERVICE_CATEGORY_ICONS.BRIEFCASE,
    SERVICE_CATEGORY_ICONS.BUILDING,
  ],
} as const;
