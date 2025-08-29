// Responsive design utilities and breakpoint management
export const BREAKPOINTS = {
  xs: 475,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export const MOBILE_BREAKPOINT = BREAKPOINTS.md;

// Responsive class utilities
export const responsiveClasses = {
  // Container padding
  container: "px-4 sm:px-6 lg:px-8",
  containerTight: "px-2 sm:px-4 lg:px-6",
  
  // Grid layouts
  grid: {
    cols1: "grid-cols-1",
    cols2: "grid-cols-1 sm:grid-cols-2",
    cols3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    cols4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    cols6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
  },
  
  // Flex layouts
  flex: {
    col: "flex flex-col",
    row: "flex flex-row",
    colMobile: "flex flex-col sm:flex-row",
    rowMobile: "flex flex-row sm:flex-col",
  },
  
  // Spacing
  gap: {
    small: "gap-2 sm:gap-4",
    medium: "gap-4 sm:gap-6",
    large: "gap-6 sm:gap-8",
  },
  
  // Text sizes
  text: {
    h1: "text-2xl sm:text-3xl lg:text-4xl",
    h2: "text-xl sm:text-2xl lg:text-3xl",
    h3: "text-lg sm:text-xl lg:text-2xl",
    body: "text-sm sm:text-base",
    small: "text-xs sm:text-sm",
  },
  
  // Padding
  padding: {
    small: "p-2 sm:p-4",
    medium: "p-4 sm:p-6",
    large: "p-6 sm:p-8",
  },
  
  // Margins
  margin: {
    small: "m-2 sm:m-4",
    medium: "m-4 sm:m-6",
    large: "m-6 sm:m-8",
  },
  
  // Visibility
  hidden: {
    mobile: "hidden sm:block",
    desktop: "block sm:hidden",
    tablet: "hidden md:block",
    mobileTablet: "block md:hidden",
  },
  
  // Width
  width: {
    full: "w-full",
    auto: "w-auto",
    fit: "w-fit",
    max: "max-w-full",
  },
  
  // Height
  height: {
    screen: "h-screen",
    auto: "h-auto",
    fit: "h-fit",
  },
} as const;

import * as React from "react";

// Responsive hook for more granular control
export function useResponsive() {
  const [breakpoint, setBreakpoint] = React.useState<keyof typeof BREAKPOINTS>('md');
  const [isMobile, setIsMobile] = React.useState(false);
  const [isTablet, setIsTablet] = React.useState(false);
  const [isDesktop, setIsDesktop] = React.useState(false);

  React.useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      
      if (width < BREAKPOINTS.sm) {
        setBreakpoint('xs');
        setIsMobile(true);
        setIsTablet(false);
        setIsDesktop(false);
      } else if (width < BREAKPOINTS.md) {
        setBreakpoint('sm');
        setIsMobile(true);
        setIsTablet(false);
        setIsDesktop(false);
      } else if (width < BREAKPOINTS.lg) {
        setBreakpoint('md');
        setIsMobile(false);
        setIsTablet(true);
        setIsDesktop(false);
      } else if (width < BREAKPOINTS.xl) {
        setBreakpoint('lg');
        setIsMobile(false);
        setIsTablet(false);
        setIsDesktop(true);
      } else {
        setBreakpoint('xl');
        setIsMobile(false);
        setIsTablet(false);
        setIsDesktop(true);
      }
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return {
    breakpoint,
    isMobile,
    isTablet,
    isDesktop,
    isSmallScreen: isMobile || isTablet,
  };
}

// Safe area utilities for mobile devices
export const safeAreaClasses = {
  top: "safe-area-top",
  bottom: "safe-area-bottom",
  left: "safe-area-left",
  right: "safe-area-right",
  all: "safe-area-top safe-area-bottom safe-area-left safe-area-right",
} as const;

// Touch target utilities for mobile accessibility
export const touchTargetClasses = {
  small: "min-h-[44px] min-w-[44px]",
  medium: "min-h-[48px] min-w-[48px]",
  large: "min-h-[56px] min-w-[56px]",
} as const;

// Mobile-specific utilities
export const mobileClasses = {
  // Prevent zoom on input focus
  noZoom: "text-base sm:text-base",
  
  // Better touch targets
  touchTarget: "tap-target",
  
  // Mobile-friendly spacing
  spacing: "space-y-4 sm:space-y-6",
  
  // Mobile-friendly padding
  padding: "p-4 sm:p-6",
  
  // Mobile-friendly margins
  margin: "m-4 sm:m-6",
} as const; 