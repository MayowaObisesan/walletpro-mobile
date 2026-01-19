import React, { useMemo } from 'react';
import { View } from 'react-native';
import { cn } from '@/src/lib/utils';
import type { FlexProps } from './types';
import { 
  getDirectionClass,
  getWrapClass,
  getJustifyClass,
  getAlignClass,
  getGapClass,
  getFlexClass,
  getAlignSelfClass,
  combineClasses,
  filterPlatformProps,
  generateTestID
} from './utils';
import { Box } from './box';

/**
 * Flex - A flexible layout component for flexbox layouts
 * 
 * Extends Box with flexbox-specific props that map to Tailwind classes.
 * Provides intuitive shorthand props for common flexbox patterns.
 * 
 * @example
 * <Flex direction="row" justify="between" align="center" gap={4}>
 *   <Text>Left</Text>
 *   <Text>Right</Text>
 * </Flex>
 * 
 * @example
 * <Flex direction="col" justify="center" align="center" grow>
 *   <Text>Centered content</Text>
 * </Flex>
 */
export const Flex = React.forwardRef<React.ElementRef<typeof View>, FlexProps>(
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
    // Flexbox specific props
    direction,
    wrap,
    justify,
    align,
    gap,
    gapX,
    gapY,
    grow,
    shrink,
    basis,
    alignSelf,
    ...props
  }, ref) => {
    
    // Generate flexbox-specific classes
    const flexClasses = useMemo(() => {
      const classes = [];
      
      // Flex direction
      if (direction) classes.push(getDirectionClass(direction));
      
      // Flex wrap
      if (wrap) classes.push(getWrapClass(wrap));
      
      // Justify content (main axis)
      if (justify) classes.push(getJustifyClass(justify));
      
      // Align items (cross axis)
      if (align) classes.push(getAlignClass(align));
      
      // Gap spacing
      const gapClass = getGapClass(gap, gapX, gapY);
      if (gapClass) classes.push(gapClass);
      
      // Flex properties
      const flexClass = getFlexClass(grow, shrink, basis);
      if (flexClass) classes.push(flexClass);
      
      // Align self
      if (alignSelf) classes.push(getAlignSelfClass(alignSelf));
      
      // Ensure flex display if any flex props are used
      if (direction || wrap || justify || align || grow || shrink || basis) {
        classes.push('flex');
      }
      
      return classes.join(' ');
    }, [direction, wrap, justify, align, gap, gapX, gapY, grow, shrink, basis, alignSelf]);
    
    // Combine all classes
    const computedClassName = useMemo(() => {
      return combineClasses(flexClasses, className);
    }, [flexClasses, className]);
    
    // Filter platform-specific props
    const filteredProps = useMemo(() => {
      return filterPlatformProps({
        testID: generateTestID('Flex', { testID }),
        accessibilityLabel,
        accessibilityHint,
        accessibilityRole,
        webOnly,
        nativeOnly,
        ...props
      });
    }, [testID, accessibilityLabel, accessibilityHint, accessibilityRole, webOnly, nativeOnly, props]);
    
    return (
      <Box
        ref={ref}
        className={cn(computedClassName)}
        style={style}
        bg={bg}
        color={color}
        rounded={rounded}
        border={border}
        shadow={shadow}
        opacity={opacity}
        zIndex={zIndex}
        overflow={overflow}
        position={position}
        display={display}
        {...filteredProps}
      >
        {children}
      </Box>
    );
  }
);

Flex.displayName = 'Flex';
