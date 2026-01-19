import React, { useMemo } from 'react';
import { cn } from '@/src/lib/utils';
import type { CenterProps } from './types';
import { 
  combineClasses,
  filterPlatformProps,
  generateTestID
} from './utils';
import { Box } from './box';

/**
 * Center - A component for centering content
 * 
 * Provides an easy way to center content both horizontally and vertically.
 * Supports absolute positioning for overlay centering or relative for normal flow.
 * 
 * @example
 * <Center className="h-32 w-32 bg-primary">
 *   <Text className="text-primary-foreground">Centered</Text>
 * </Center>
 * 
 * @example
 * <Center absolute axis="both" className="bg-black/50">
 *   <Text>Modal content</Text>
 * </Center>
 * 
 * @example
 * <Center axis="horizontal" className="h-20 bg-muted">
 *   <Text>Horizontally centered</Text>
 * </Center>
 */
export const Center = React.forwardRef<React.ElementRef<typeof Box>, CenterProps>(
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
    display,
    webOnly,
    nativeOnly,
    // Center specific props
    absolute = false,
    axis = 'both',
    ...props
  }, ref) => {
    
    // Generate center-specific classes
    const centerClasses = useMemo(() => {
      const classes = [];
      
      // Position
      if (absolute) {
        classes.push('absolute');
        classes.push('inset-0');
      } else {
        classes.push('relative');
      }
      
      // Flexbox centering
      classes.push('flex');
      
      if (axis === 'both') {
        classes.push('items-center');
        classes.push('justify-center');
      } else if (axis === 'horizontal') {
        classes.push('justify-center');
      } else if (axis === 'vertical') {
        classes.push('items-center');
      }
      
      return classes.join(' ');
    }, [absolute, axis]);
    
    // Combine all classes
    const computedClassName = useMemo(() => {
      return combineClasses(centerClasses, className);
    }, [centerClasses, className]);
    
    // Filter platform-specific props
    const filteredProps = useMemo(() => {
      return filterPlatformProps({
        testID: generateTestID('Center', { testID }),
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
        display={display}
        {...filteredProps}
      >
        {children}
      </Box>
    );
  }
);

Center.displayName = 'Center';

/**
 * AbsoluteCenter - Absolutely positioned center component
 * 
 * Convenient wrapper around Center with absolute positioning.
 * Perfect for modals, overlays, or any content that needs to be
 * centered regardless of parent positioning.
 * 
 * @example
 * <AbsoluteCenter className="bg-black/50">
 *   <Card>
 *     <Text>Modal content</Text>
 *   </Card>
 * </AbsoluteCenter>
 */
export const AbsoluteCenter = React.forwardRef<React.ElementRef<typeof Box>, Omit<CenterProps, 'absolute'>>(
  ({ ...props }, ref) => {
    return <Center ref={ref} absolute {...props} />;
  }
);

AbsoluteCenter.displayName = 'AbsoluteCenter';

/**
 * RelativeCenter - Relatively positioned center component
 * 
 * Convenient wrapper around Center with relative positioning.
 * 
 * @example
 * <RelativeCenter className="h-32 bg-muted">
 *   <Text>Centered in container</Text>
 * </RelativeCenter>
 */
export const RelativeCenter = React.forwardRef<React.ElementRef<typeof Box>, Omit<CenterProps, 'absolute'>>(
  ({ ...props }, ref) => {
    return <Center ref={ref} absolute={false} {...props} />;
  }
);

RelativeCenter.displayName = 'RelativeCenter';

/**
 * HorizontalCenter - Horizontally centered content
 * 
 * Convenient wrapper around Center for horizontal centering only.
 * 
 * @example
 * <HorizontalCenter className="h-20 bg-muted">
 *   <Text>Horizontally centered</Text>
 * </HorizontalCenter>
 */
export const HorizontalCenter = React.forwardRef<React.ElementRef<typeof Box>, Omit<CenterProps, 'axis'>>(
  ({ ...props }, ref) => {
    return <Center ref={ref} axis="horizontal" {...props} />;
  }
);

HorizontalCenter.displayName = 'HorizontalCenter';

/**
 * VerticalCenter - Vertically centered content
 * 
 * Convenient wrapper around Center for vertical centering only.
 * 
 * @example
 * <VerticalCenter className="w-32 bg-muted">
 *   <Text>Vertically centered</Text>
 * </VerticalCenter>
 */
export const VerticalCenter = React.forwardRef<React.ElementRef<typeof Box>, Omit<CenterProps, 'axis'>>(
  ({ ...props }, ref) => {
    return <Center ref={ref} axis="vertical" {...props} />;
  }
);

VerticalCenter.displayName = 'VerticalCenter';
