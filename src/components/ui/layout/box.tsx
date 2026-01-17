import React, { useMemo } from 'react';
import { Platform, View, type ViewProps } from 'react-native';
import { cn } from '@/src/lib/utils';
import type { BoxProps } from './types';
import { 
  combineClasses, 
  filterPlatformProps, 
  generateTestID 
} from './utils';

/**
 * Box - The fundamental building block for all layout components
 * 
 * This is the most basic component that provides a foundation for all other
 * layout components. It's essentially a styled View with helpful props.
 * 
 * @example
 * <Box bg="bg-primary" p={4} rounded="lg">
 *   <Text>Hello World</Text>
 * </Box>
 */
export const Box = React.forwardRef<React.ElementRef<typeof View>, BoxProps>(
  ({ 
    className,
    style,
    children,
    testID,
    accessibilityLabel,
    accessibilityHint,
    accessibilityRole,
    bg,
    color,
    rounded,
    border,
    shadow,
    opacity,
    zIndex,
    overflow,
    position,
    display,
    webOnly,
    nativeOnly,
    ...props
  }, ref) => {
    
    // Generate comprehensive className using utility functions
    const computedClassName = useMemo(() => {
      const classes = [];
      
      // Background color
      if (bg) classes.push(bg);
      
      // Text color
      if (color) classes.push(color);
      
      // Border radius
      if (rounded) classes.push(rounded);
      
      // Border
      if (border) classes.push(border);
      
      // Shadow
      if (shadow) classes.push(shadow);
      
      // Opacity
      if (opacity !== undefined) classes.push(`opacity-${opacity}`);
      
      // Z-index
      if (zIndex !== undefined) classes.push(`z-${zIndex}`);
      
      // Overflow
      if (overflow) classes.push(`overflow-${overflow}`);
      
      // Position
      if (position) classes.push(position);
      
      // Display
      if (display) {
        if (display === 'flex') classes.push('flex');
        else if (display === 'none') classes.push('hidden');
        // 'block' is default for View in RN
      }
      
      // Combine with custom className
      return combineClasses(...classes, className);
    }, [bg, color, rounded, border, shadow, opacity, zIndex, overflow, position, display, className]);
    
    // Generate inline styles for props that can't be handled by Tailwind
    const computedStyle = useMemo(() => {
      const styleObject: any = {};
      
      // Handle numeric opacity values
      if (opacity !== undefined && typeof opacity === 'number' && opacity <= 1) {
        styleObject.opacity = opacity;
      }
      
      // Handle numeric z-index
      if (zIndex !== undefined && typeof zIndex === 'number') {
        styleObject.zIndex = zIndex;
      }
      
      return styleObject;
    }, [opacity, zIndex]);
    
    // Filter platform-specific props
    const filteredProps = useMemo(() => {
      return filterPlatformProps({
        testID: generateTestID('Box', { testID }),
        accessibilityLabel,
        accessibilityHint,
        accessibilityRole,
        webOnly,
        nativeOnly,
        ...props
      });
    }, [testID, accessibilityLabel, accessibilityHint, accessibilityRole, webOnly, nativeOnly, props]);
    
    // Merge computed styles with custom styles
    const mergedStyle = useMemo(() => {
      if (!computedStyle || Object.keys(computedStyle).length === 0) {
        return style;
      }
      return [style, computedStyle];
    }, [style, computedStyle]);
    
    return (
      <View
        ref={ref}
        className={cn(computedClassName)}
        style={mergedStyle}
        {...filteredProps}
      >
        {children}
      </View>
    );
  }
);

Box.displayName = 'Box';
