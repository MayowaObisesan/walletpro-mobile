import React, { useMemo } from 'react';
import { Platform } from 'react-native';
import { cn } from '@/src/lib/utils';
import type { DividerProps } from './types';
import { 
  getSpacingClass,
  combineClasses,
  filterPlatformProps,
  generateTestID
} from './utils';
import { Box } from './box';

/**
 * Divider - A visual separator component
 * 
 * Creates a line to visually separate content sections. Supports both
 * horizontal and vertical orientations with customizable styling.
 * 
 * @example
 * <VStack>
 *   <Text>Section 1</Text>
 *   <Divider />
 *   <Text>Section 2</Text>
 * </VStack>
 * 
 * @example
 * <HStack>
 *   <Text>Item 1</Text>
 *   <Divider direction="vertical" thickness={2} />
 *   <Text>Item 2</Text>
 * </HStack>
 * 
 * @example
 * <Divider color="border-primary" thickness={4} />
 */
export const Divider = React.forwardRef<React.ElementRef<typeof Box>, DividerProps>(
  ({ 
    className,
    style,
    testID,
    accessibilityLabel,
    accessibilityHint,
    accessibilityRole,
    webOnly,
    nativeOnly,
    // Divider specific props
    direction = 'horizontal',
    thickness = 1,
    color,
    decorative = true,
    ...props
  }, ref) => {
    
    // Generate divider-specific classes
    const dividerClasses = useMemo(() => {
      const classes = [];
      
      // Base divider styling
      classes.push('bg-border');
      
      // Direction-specific classes
      if (direction === 'horizontal') {
        classes.push('w-full');
        classes.push(getSpacingClass(thickness, 'h'));
      } else {
        classes.push('h-full');
        classes.push(getSpacingClass(thickness, 'w'));
      }
      
      return classes.join(' ');
    }, [direction, thickness]);
    
    // Generate inline styles
    const dividerStyle = useMemo(() => {
      const styleObj: any = {};
      
      // Handle numeric thickness that might not map to Tailwind classes
      if (typeof thickness === 'number') {
        const sizeInPx = thickness;
        if (direction === 'horizontal') {
          styleObj.height = sizeInPx;
        } else {
          styleObj.width = sizeInPx;
        }
      }
      
      // Handle custom color
      if (color && !color.includes('bg-')) {
        // If color is a raw color value, apply it via style
        if (direction === 'horizontal') {
          styleObj.backgroundColor = color;
        } else {
          styleObj.backgroundColor = color;
        }
      }
      
      return styleObj;
    }, [direction, thickness, color]);
    
    // Combine all classes
    const computedClassName = useMemo(() => {
      const classes = [dividerClasses];
      
      // Add custom color class if provided
      if (color && color.includes('bg-')) {
        classes.push(color);
      }
      
      return combineClasses(...classes, className);
    }, [dividerClasses, color, className]);
    
    // Generate accessibility props
    const accessibilityProps = useMemo(() => {
      const props: any = {};
      
      if (!decorative) {
        // If not decorative, it should have a role and label
        props.accessibilityRole = 'separator';
        if (accessibilityLabel) {
          props.accessibilityLabel = accessibilityLabel;
        }
      } else {
        // If decorative, hide from screen readers
        props.accessibilityRole = 'none';
        props.importantForAccessibility = 'no-hide-descendants';
      }
      
      if (accessibilityHint) {
        props.accessibilityHint = accessibilityHint;
      }
      
      return props;
    }, [decorative, accessibilityLabel, accessibilityHint]);
    
    // Web-specific props
    const webProps = useMemo(() => {
      if (Platform.OS === 'web') {
        const props: any = {
          role: decorative ? 'none' : 'separator',
          'aria-orientation': direction,
        };
        
        if (!decorative && accessibilityLabel) {
          props['aria-label'] = accessibilityLabel;
        }
        
        return props;
      }
      return {};
    }, [decorative, direction, accessibilityLabel]);
    
    // Filter platform-specific props
    const filteredProps = useMemo(() => {
      return filterPlatformProps({
        testID: generateTestID('Divider', { testID }),
        ...accessibilityProps,
        webOnly,
        nativeOnly,
        ...webProps,
        ...props
      });
    }, [testID, accessibilityProps, webOnly, nativeOnly, webProps, props]);
    
    // Merge styles
    const mergedStyle = useMemo(() => {
      if (!dividerStyle || Object.keys(dividerStyle).length === 0) {
        return style;
      }
      return [style, dividerStyle];
    }, [style, dividerStyle]);
    
    return (
      <Box
        ref={ref}
        className={cn(computedClassName)}
        style={mergedStyle}
        accessibilityRole={accessibilityRole}
        {...filteredProps}
      />
    );
  }
);

Divider.displayName = 'Divider';

/**
 * HDivider - Horizontal divider component
 * 
 * Convenient wrapper around Divider with horizontal direction.
 * 
 * @example
 * <VStack>
 *   <Text>Section 1</Text>
 *   <HDivider />
 *   <Text>Section 2</Text>
 * </VStack>
 */
export const HDivider = React.forwardRef<React.ElementRef<typeof Box>, Omit<DividerProps, 'direction'>>(
  ({ ...props }, ref) => {
    return <Divider ref={ref} direction="horizontal" {...props} />;
  }
);

HDivider.displayName = 'HDivider';

/**
 * VDivider - Vertical divider component
 * 
 * Convenient wrapper around Divider with vertical direction.
 * 
 * @example
 * <HStack>
 *   <Text>Item 1</Text>
 *   <VDivider />
 *   <Text>Item 2</Text>
 * </HStack>
 */
export const VDivider = React.forwardRef<React.ElementRef<typeof Box>, Omit<DividerProps, 'direction'>>(
  ({ ...props }, ref) => {
    return <Divider ref={ref} direction="vertical" {...props} />;
  }
);

VDivider.displayName = 'VDivider';
