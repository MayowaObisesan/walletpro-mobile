import React, { useMemo } from 'react';
import { cn } from '@/src/lib/utils';
import type { ContainerProps } from './types';
import {
  getContainerClass,
  combineClasses,
  filterPlatformProps,
  generateTestID
} from './utils';
import { Box } from './box';

/**
 * Container - A responsive container component
 *
 * Provides a centered container with configurable max-width and padding.
 * Perfect for creating responsive layouts that don't stretch to full width
 * on larger screens.
 *
 * @example
 * <Container>
 *   <Text>Content is centered with max-width</Text>
 * </Container>
 *
 * @example
 * <Container maxWidth="lg" px={8}>
 *   <Text>Large container with custom padding</Text>
 * </Container>
 *
 * @example
 * <Container center={false} className="bg-muted">
 *   <Text>Left-aligned container</Text>
 * </Container>
 */
export const Container = React.forwardRef<React.ElementRef<typeof Box>, ContainerProps>(
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
    // Container specific props
    maxWidth,
    center = true,
    px,
    ...props
  }, ref) => {

    // Generate container-specific classes
    const containerClasses = useMemo(() => {
      return getContainerClass(maxWidth, center, px);
    }, [maxWidth, center, px]);

    // Combine all classes
    const computedClassName = useMemo(() => {
      const classes = [containerClasses];

      // Add any additional styling from Box props
      if (bg) classes.push(bg);
      if (color && !color.includes('text-')) classes.push(`text-${color}`);
      if (rounded) classes.push(rounded);
      if (border) classes.push(border);
      if (shadow) classes.push(shadow);
      if (overflow) classes.push(`overflow-${overflow}`);
      if (position) classes.push(position);

      return combineClasses(...classes, className);
    }, [containerClasses, bg, color, rounded, border, shadow, overflow, position, className]);

    // Filter platform-specific props
    const filteredProps = useMemo(() => {
      return filterPlatformProps({
        testID: generateTestID('Container', { testID }),
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
        position={position}
        display={display}
        {...filteredProps}
      >
        {children}
      </Box>
    );
  }
);

Container.displayName = 'Container';

/**
 * MaxContainer - Container with max-width but no centering
 *
 * Convenient wrapper around Container with centering disabled.
 *
 * @example
 * <MaxContainer maxWidth="md">
 *   <Text>Max width but not centered</Text>
 * </MaxContainer>
 */
export const MaxContainer = React.forwardRef<React.ElementRef<typeof Box>, Omit<ContainerProps, 'center'>>(
  ({ ...props }, ref) => {
    return <Container ref={ref} center={false} {...props} />;
  }
);

MaxContainer.displayName = 'MaxContainer';

/**
 * CenterContainer - Container with centering enabled
 *
 * Convenient wrapper around Container with centering forced.
 *
 * @example
 * <CenterContainer maxWidth="lg">
 *   <Text>Always centered</Text>
 * </CenterContainer>
 */
export const CenterContainer = React.forwardRef<React.ElementRef<typeof Box>, Omit<ContainerProps, 'center'>>(
  ({ ...props }, ref) => {
    return <Container ref={ref} center={true} {...props} />;
  }
);

CenterContainer.displayName = 'CenterContainer';

/**
 * FluidContainer - Full-width container
 *
 * Container that takes full width with optional padding.
 *
 * @example
 * <FluidContainer px={4}>
 *   <Text>Full width with padding</Text>
 * </FluidContainer>
 */
export const FluidContainer = React.forwardRef<React.ElementRef<typeof Box>, Omit<ContainerProps, 'maxWidth' | 'center'>>(
  ({ ...props }, ref) => {
    return <Container ref={ref} maxWidth="full" center={false} {...props} />;
  }
);

FluidContainer.displayName = 'FluidContainer';
