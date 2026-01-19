import React, { useMemo } from 'react';
import { View } from 'react-native';
import { cn } from '@/src/lib/utils';
import type { StackProps, VStackProps, HStackProps } from './types';
import {
  getDirectionClass,
  getWrapClass,
  getJustifyClass,
  getAlignClass,
  getGapClass,
  combineClasses,
  filterPlatformProps,
  generateTestID
} from './utils';
import { Box } from './box';

/**
 * Stack - A flexible stacking layout component
 *
 * Provides an easy way to stack elements vertically or horizontally
 * with consistent spacing. A simpler API than Flex for common stacking patterns.
 *
 * @example
 * <Stack direction="vertical" space={4}>
 *   <Text>Item 1</Text>
 *   <Text>Item 2</Text>
 *   <Text>Item 3</Text>
 * </Stack>
 */
export const Stack = React.forwardRef<React.ElementRef<typeof View>, StackProps>(
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
    // Stack specific props
    direction = 'vertical',
    align,
    justify,
    space,
    wrap,
    ...props
  }, ref) => {

    // Generate stack-specific classes
    const stackClasses = useMemo(() => {
      const classes = [];

      // Direction
      const directionClass = getDirectionClass(direction === 'vertical' ? 'column' : 'row');
      if (directionClass) classes.push(directionClass);

      // Wrap
      if (wrap) classes.push(getWrapClass(wrap));

      // Justify content
      if (justify) classes.push(getJustifyClass(justify));

      // Align items
      if (align) classes.push(getAlignClass(align));

      // Gap (spacing between items)
      if (space) {
        const gapClass = getGapClass(space);
        if (gapClass) classes.push(gapClass);
      }

      // Always use flex for stacks
      classes.push('flex');

      return classes.join(' ');
    }, [direction, wrap, justify, align, space]);

    // Combine all classes
    const computedClassName = useMemo(() => {
      return combineClasses(stackClasses, className);
    }, [stackClasses, className]);

    // Filter platform-specific props
    const filteredProps = useMemo(() => {
      return filterPlatformProps({
        testID: generateTestID('Stack', { testID }),
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

Stack.displayName = 'Stack';

/**
 * VStack - A vertical stack component (default direction: vertical)
 *
 * Convenient wrapper around Stack with vertical direction pre-configured.
 * Perfect for lists of items, form fields, or any vertical arrangement.
 *
 * @example
 * <VStack space={2} align="start">
 *   <Text>Username</Text>
 *   <Input placeholder="Enter username" />
 *   <Button>Submit</Button>
 * </VStack>
 */
export const VStack = React.forwardRef<React.ElementRef<typeof View>, VStackProps>(
  ({
    direction = 'vertical', // Force vertical direction
    ...props
  }, ref) => {
    return <Stack ref={ref} direction={direction} {...props} />;
  }
);

VStack.displayName = 'VStack';

/**
 * HStack - A horizontal stack component (default direction: horizontal)
 *
 * Convenient wrapper around Stack with horizontal direction pre-configured.
 * Perfect for button groups, navigation items, or any horizontal arrangement.
 *
 * @example
 * <HStack space={4} align="center">
 *   <Button variant="outline">Cancel</Button>
 *   <Button variant="primary">Submit</Button>
 * </HStack>
 */
export const HStack = React.forwardRef<React.ElementRef<typeof View>, HStackProps>(
  ({
    direction = 'horizontal', // Force horizontal direction
    ...props
  }, ref) => {
    return <Stack ref={ref} direction={direction} {...props} />;
  }
);

HStack.displayName = 'HStack';
