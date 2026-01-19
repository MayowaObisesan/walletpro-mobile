import React, { useMemo } from 'react';
import { View } from 'react-native';
import { cn } from '@/src/lib/utils';
import type { SpacerProps } from './types';
import { 
  getSpacingClass,
  combineClasses,
  filterPlatformProps,
  generateTestID
} from './utils';
import { Box } from './box';

/**
 * Spacer - A flexible spacing utility component
 * 
 * Creates consistent spacing between elements. Can be used as a fixed
 * spacer or a flexible spacer that takes available space.
 * 
 * @example
 * <VStack>
 *   <Text>Item 1</Text>
 *   <Spacer size={4} />
 *   <Text>Item 2</Text>
 * </VStack>
 * 
 * @example
 * <HStack>
 *   <Text>Left</Text>
 *   <Spacer flex />
 *   <Text>Right</Text>
 * </HStack>
 * 
 * @example
 * <Spacer size="8" direction="horizontal" />
 */
export const Spacer = React.forwardRef<React.ElementRef<typeof View>, SpacerProps>(
  ({ 
    className,
    style,
    testID,
    accessibilityLabel,
    accessibilityHint,
    accessibilityRole,
    webOnly,
    nativeOnly,
    // Spacer specific props
    size = 4,
    direction = 'vertical',
    flex = false,
    ...props
  }, ref) => {
    
    // Generate spacer-specific classes
    const spacerClasses = useMemo(() => {
      const classes = [];
      
      // If flex is true, make it expand to fill available space
      if (flex) {
        classes.push('flex-1');
      } else {
        // Otherwise, apply fixed spacing
        if (direction === 'vertical' || direction === 'both') {
          const heightClass = getSpacingClass(size, 'h');
          if (heightClass) classes.push(heightClass);
        }
        
        if (direction === 'horizontal' || direction === 'both') {
          const widthClass = getSpacingClass(size, 'w');
          if (widthClass) classes.push(widthClass);
        }
      }
      
      return classes.join(' ');
    }, [size, direction, flex]);
    
    // Generate inline styles for custom spacing
    const spacerStyle = useMemo(() => {
      const styleObj: any = {};
      
      if (!flex && typeof size === 'number') {
        // Handle numeric spacing that might not map to Tailwind classes
        const sizeInPx = size * 4; // Convert Tailwind units to pixels
        
        if (direction === 'vertical' || direction === 'both') {
          styleObj.height = sizeInPx;
        }
        
        if (direction === 'horizontal' || direction === 'both') {
          styleObj.width = sizeInPx;
        }
      }
      
      return styleObj;
    }, [size, direction, flex]);
    
    // Combine all classes
    const computedClassName = useMemo(() => {
      return combineClasses(spacerClasses, className);
    }, [spacerClasses, className]);
    
    // Filter platform-specific props
    const filteredProps = useMemo(() => {
      return filterPlatformProps({
        testID: generateTestID('Spacer', { testID }),
        accessibilityLabel: accessibilityLabel || 'Spacer',
        accessibilityRole: accessibilityRole || 'none',
        webOnly,
        nativeOnly,
        ...props
      });
    }, [testID, accessibilityLabel, accessibilityRole, webOnly, nativeOnly, props]);
    
    // Merge styles
    const mergedStyle = useMemo(() => {
      if (!spacerStyle || Object.keys(spacerStyle).length === 0) {
        return style;
      }
      return [style, spacerStyle];
    }, [style, spacerStyle]);
    
    return (
      <Box
        ref={ref}
        className={cn(computedClassName)}
        style={mergedStyle}
        accessibilityHint={accessibilityHint}
        {...filteredProps}
      />
    );
  }
);

Spacer.displayName = 'Spacer';

/**
 * VSpacer - Vertical spacer component
 * 
 * Convenient wrapper around Spacer with vertical direction.
 * 
 * @example
 * <VStack>
 *   <Text>Item 1</Text>
 *   <VSpacer size={4} />
 *   <Text>Item 2</Text>
 * </VStack>
 */
export const VSpacer = React.forwardRef<React.ElementRef<typeof View>, Omit<SpacerProps, 'direction'>>(
  ({ ...props }, ref) => {
    return <Spacer ref={ref} direction="vertical" {...props} />;
  }
);

VSpacer.displayName = 'VSpacer';

/**
 * HSpacer - Horizontal spacer component
 * 
 * Convenient wrapper around Spacer with horizontal direction.
 * 
 * @example
 * <HStack>
 *   <Text>Left</Text>
 *   <HSpacer size={4} />
 *   <Text>Right</Text>
 * </HStack>
 */
export const HSpacer = React.forwardRef<React.ElementRef<typeof View>, Omit<SpacerProps, 'direction'>>(
  ({ ...props }, ref) => {
    return <Spacer ref={ref} direction="horizontal" {...props} />;
  }
);

HSpacer.displayName = 'HSpacer';

/**
 * FlexSpacer - A flexible spacer that takes available space
 * 
 * Convenient wrapper around Spacer with flex enabled.
 * 
 * @example
 * <HStack>
 *   <Text>Left</Text>
 *   <FlexSpacer />
 *   <Text>Right</Text>
 * </HStack>
 */
export const FlexSpacer = React.forwardRef<React.ElementRef<typeof View>, Omit<SpacerProps, 'flex'>>(
  ({ ...props }, ref) => {
    return <Spacer ref={ref} flex {...props} />;
  }
);

FlexSpacer.displayName = 'FlexSpacer';
