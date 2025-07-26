// Design tokens and theme configuration
export const tokens = {
  borderRadius: {
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    "2xl": "1.5rem",
    "3xl": "2rem",
    full: "9999px",
  },

  spacing: {
    px: "1px",
    0: "0",
    0.5: "0.125rem",
    1: "0.25rem",
    1.5: "0.375rem",
    2: "0.5rem",
    2.5: "0.625rem",
    3: "0.75rem",
    3.5: "0.875rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    7: "1.75rem",
    8: "2rem",
    9: "2.25rem",
    10: "2.5rem",
    11: "2.75rem",
    12: "3rem",
    14: "3.5rem",
    16: "4rem",
    20: "5rem",
    24: "6rem",
    28: "7rem",
    32: "8rem",
    36: "9rem",
    40: "10rem",
    44: "11rem",
    48: "12rem",
    52: "13rem",
    56: "14rem",
    60: "15rem",
    64: "16rem",
    72: "18rem",
    80: "20rem",
    96: "24rem",
  },

  fontSizes: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
    "6xl": "3.75rem",
    "7xl": "4.5rem",
    "8xl": "6rem",
    "9xl": "8rem",
  },

  fontWeights: {
    thin: "100",
    extralight: "200",
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
    black: "900",
  },

  lineHeights: {
    none: "1",
    tight: "1.25",
    snug: "1.375",
    normal: "1.5",
    relaxed: "1.625",
    loose: "2",
  },

  letterSpacings: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0em",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em",
  },

  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    DEFAULT: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
    none: "none",
    "colored-lg": "0 10px 25px -3px rgba(59, 130, 246, 0.5)",
    "colored-xl": "0 25px 50px -12px rgba(59, 130, 246, 0.25)",
    "soft-sm": "0 2px 10px rgba(0, 0, 0, 0.05)",
    "soft-md": "0 5px 20px rgba(0, 0, 0, 0.08)",
    "soft-lg": "0 10px 30px rgba(0, 0, 0, 0.12)",
    "glow-sm": "0 0 10px rgba(59, 130, 246, 0.3)",
    "glow-md": "0 0 20px rgba(59, 130, 246, 0.4)",
    "glow-lg": "0 0 30px rgba(59, 130, 246, 0.5)",
  },

  // Advanced effects
  glassmorphism: {
    light: "backdrop-filter: blur(10px); background-color: rgba(255, 255, 255, 0.7);",
    dark: "backdrop-filter: blur(10px); background-color: rgba(17, 24, 39, 0.7);",
  },

  gradients: {
    primary: "linear-gradient(to right, #3b82f6, #2563eb)",
    secondary: "linear-gradient(to right, #4f46e5, #4338ca)",
    accent: "linear-gradient(to right, #8b5cf6, #6d28d9)",
    success: "linear-gradient(to right, #10b981, #059669)",
    warning: "linear-gradient(to right, #f59e0b, #d97706)",
    danger: "linear-gradient(to right, #ef4444, #dc2626)",
    "blue-purple": "linear-gradient(to right, #3b82f6, #8b5cf6)",
    "green-blue": "linear-gradient(to right, #10b981, #3b82f6)",
    "orange-red": "linear-gradient(to right, #f59e0b, #ef4444)",
    "pink-purple": "linear-gradient(to right, #ec4899, #8b5cf6)",
    "blue-teal": "linear-gradient(to right, #3b82f6, #14b8a6)",
  },

  animations: {
    "fade-in": "fadeIn 0.5s ease-out forwards",
    "slide-up": "slideUp 0.5s ease-out forwards",
    "slide-down": "slideDown 0.5s ease-out forwards",
    "slide-left": "slideLeft 0.5s ease-out forwards",
    "slide-right": "slideRight 0.5s ease-out forwards",
    "scale-in": "scaleIn 0.5s ease-out forwards",
    "scale-out": "scaleOut 0.5s ease-out forwards",
    "bounce-in": "bounceIn 0.8s cubic-bezier(0.215, 0.610, 0.355, 1.000) forwards",
    "spin-slow": "spin 3s linear infinite",
    "pulse-slow": "pulse 3s infinite",
    float: "float 6s ease-in-out infinite",
    shimmer: "shimmer 2s infinite linear",
    ping: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
  },

  transitions: {
    DEFAULT: "all 0.3s ease",
    fast: "all 0.15s ease",
    slow: "all 0.5s ease",
    "in-expo": "all 0.3s cubic-bezier(0.95, 0.05, 0.795, 0.035)",
    "out-expo": "all 0.3s cubic-bezier(0.19, 1, 0.22, 1)",
    bounce: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  },
}

// Advanced component variants
export const componentVariants = {
  buttons: {
    primary:
      "bg-primary hover:bg-primary-600 text-white rounded-full px-6 py-2.5 font-medium shadow-sm transition-all duration-200 hover:shadow-colored focus:ring-2 focus:ring-primary-300 focus:ring-offset-2",
    secondary:
      "bg-white hover:bg-gray-50 text-gray-900 rounded-full px-6 py-2.5 font-medium shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-md focus:ring-2 focus:ring-gray-200 focus:ring-offset-2",
    outline:
      "bg-transparent hover:bg-primary-50 text-primary border border-primary rounded-full px-6 py-2.5 font-medium transition-all duration-200 hover:shadow-sm focus:ring-2 focus:ring-primary-200 focus:ring-offset-2",
    ghost:
      "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full px-6 py-2.5 font-medium transition-all duration-200",
    gradient:
      "bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 text-white rounded-full px-6 py-2.5 font-medium shadow-sm transition-all duration-200 hover:shadow-colored focus:ring-2 focus:ring-primary-300 focus:ring-offset-2",
    glass:
      "backdrop-filter backdrop-blur-lg bg-white/30 dark:bg-black/30 hover:bg-white/40 dark:hover:bg-black/40 text-gray-900 dark:text-white rounded-full px-6 py-2.5 font-medium border border-white/20 dark:border-white/10 transition-all duration-200",
    "3d": "bg-primary hover:bg-primary-600 text-white rounded-full px-6 py-2.5 font-medium shadow-[0_4px_0_0_#1d4ed8] hover:shadow-[0_2px_0_0_#1d4ed8] hover:translate-y-0.5 active:translate-y-1 active:shadow-[0_0px_0_0_#1d4ed8] transition-all duration-200",
  },

  cards: {
    default: "bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm",
    glass:
      "backdrop-filter backdrop-blur-lg bg-white/70 dark:bg-gray-900/70 rounded-xl border border-white/20 dark:border-white/10 shadow-sm",
    gradient: "bg-gradient-to-br from-primary-500/90 to-primary-700 text-white rounded-xl shadow-md",
    elevated:
      "bg-white dark:bg-gray-800 rounded-xl border-0 shadow-soft hover:shadow-soft-lg transition-shadow duration-300",
    "soft-shadow":
      "bg-white dark:bg-gray-800 rounded-xl border-0 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_-15px_rgba(0,0,0,0.3)]",
    "border-accent":
      "bg-white dark:bg-gray-800 rounded-xl border-l-4 border-primary border-t border-r border-b border-gray-200 dark:border-gray-700 shadow-sm",
    "hover-lift":
      "bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md",
  },

  inputs: {
    default:
      "rounded-lg border border-gray-300 focus:border-primary focus:ring focus:ring-primary-200 focus:ring-opacity-50 bg-white dark:bg-gray-900 dark:border-gray-700 px-4 py-2.5 w-full transition-all duration-200",
    underlined:
      "border-0 border-b-2 border-gray-300 focus:border-primary focus:ring-0 bg-transparent px-0 py-2.5 w-full transition-all duration-200",
    filled:
      "rounded-lg border-0 bg-gray-100 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-primary-200 px-4 py-2.5 w-full transition-all duration-200",
    glass:
      "rounded-lg backdrop-filter backdrop-blur-lg bg-white/30 dark:bg-black/30 border border-white/20 dark:border-white/10 focus:border-primary focus:ring focus:ring-primary-200 focus:ring-opacity-50 px-4 py-2.5 w-full transition-all duration-200",
  },
}

// Advanced UI patterns
export const uiPatterns = {
  // Glassmorphism card with gradient border
  glassmorphismCard: `
    position: relative;
    backdrop-filter: blur(16px);
    background-color: rgba(255, 255, 255, 0.7);
    border-radius: 16px;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      padding: 1px;
      border-radius: 16px;
      background: linear-gradient(to right, #3b82f6, #8b5cf6);
      -webkit-mask: 
        linear-gradient(#fff 0 0) content-box, 
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      pointer-events: none;
    }
  `,

  // Neumorphism effect
  neumorphism: `
    background: #e0e5ec;
    box-shadow: 
      8px 8px 15px rgba(163, 177, 198, 0.6),
      -8px -8px 15px rgba(255, 255, 255, 0.5);
    border-radius: 16px;
  `,

  // Frosted glass effect
  frostedGlass: `
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    border-radius: 16px;
  `,

  // Gradient text
  gradientText: `
    background: linear-gradient(to right, #3b82f6, #8b5cf6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
  `,

  // Animated border
  animatedBorder: `
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      padding: 2px;
      border-radius: inherit;
      background: linear-gradient(
        45deg,
        #3b82f6, #8b5cf6, #ec4899, #ef4444, #f59e0b, #10b981, #3b82f6
      );
      background-size: 300% 300%;
      animation: moveGradient 4s alternate infinite;
      -webkit-mask: 
        linear-gradient(#fff 0 0) content-box, 
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
    }
    
    @keyframes moveGradient {
      0% { background-position: 0% 50%; }
      100% { background-position: 100% 50%; }
    }
  `,
}
