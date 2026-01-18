import React, { useMemo } from 'react';
import { Platform, Text as RNText } from 'react-native';
import { cn } from '@/src/lib/utils';
import type { TextProps } from './types';
import {
  getHeadingClass,
  combineClasses,
  filterPlatformProps,
  generateTestID, getWebAccessibilityProps
} from './utils';
import { Box } from './box';

/**
 * Text - A text component with font sizing capabilities
 *
 * Provides font sizing functionality similar to Heading component
 * but without semantic heading meaning. Perfect for when you need
 * text size control without the semantic implications of headings.
 *
 * @example
 * <Text level={1}>Smallest text</Text>
 *
 * @example
 * <Text level={5}>Medium text</Text>
 *
 * @example
 * <Text level={9}>Largest text</Text>
 *
 * @example
 * <Text level={3} weight="semibold">Semibold text</Text>
 *
 * @example
 * <Text level={6} truncate numberOfLines={2}>
 *   Long text that gets truncated
 * </Text>
 */
export const Text = React.forwardRef<React.ElementRef<typeof RNText>, TextProps>(
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
    // Text specific props
    level,
    align,
    weight,
    truncate,
    numberOfLines,
    ...props
  }, ref) => {

    // Generate text-specific classes using the same logic as Heading
    const textClasses = useMemo(() => {
      return getHeadingClass(
        level,
        undefined, // No variant for Text component
        align,
        weight,
        truncate
      );
    }, [level, align, weight, truncate]);

    // Generate accessibility props for web
    const webAccessibilityProps = useMemo(() => {
      return getWebAccessibilityProps('text', accessibilityLabel);
    }, [accessibilityLabel]);

    // Combine accessibility props
    const accessibilityProps = useMemo(() => {
      const props: any = {
        accessibilityLabel,
        accessibilityHint,
        accessibilityRole: accessibilityRole || 'text',
      };

      return props;
    }, [accessibilityLabel, accessibilityHint, accessibilityRole]);

    // Combine all classes
    const computedClassName = useMemo(() => {
      const classes = [];

      // Add text classes (font size, alignment, weight, truncate)
      classes.push(textClasses);

      // Add base text classes
      classes.push('text-foreground');

      // Add any additional background/styling from Box props
      if (bg) classes.push(bg);
      if (color && !color.includes('text-')) classes.push(`text-${color}`);
      if (rounded) classes.push(rounded);
      if (border) classes.push(border);
      if (shadow) classes.push(shadow);
      if (overflow) classes.push(`overflow-${overflow}`);

      return combineClasses(...classes, className);
    }, [textClasses, bg, color, rounded, border, shadow, overflow, className]);

    // Generate inline styles
    const computedStyle = useMemo(() => {
      const styleObj: any = {};

      // Handle numeric opacity
      if (opacity !== undefined && typeof opacity === 'number' && opacity <= 1) {
        styleObj.opacity = opacity;
      }

      // Handle numeric z-index
      if (zIndex !== undefined && typeof zIndex === 'number') {
        styleObj.zIndex = zIndex;
      }

      return styleObj;
    }, [opacity, zIndex]);

    // Merge styles
    const mergedStyle = useMemo(() => {
      if (!computedStyle || Object.keys(computedStyle).length === 0) {
        return style;
      }
      return [style, computedStyle];
    }, [style, computedStyle]);

    // Filter platform-specific props
    const filteredProps = useMemo(() => {
      return filterPlatformProps({
        testID: generateTestID('Text', { testID }),
        ...accessibilityProps,
        numberOfLines,
        webOnly,
        nativeOnly,
        ...webAccessibilityProps,
        ...props
      });
    }, [testID, accessibilityProps, numberOfLines, webOnly, nativeOnly, webAccessibilityProps, props]);

    return (
      <RNText
        ref={ref}
        className={cn(computedClassName)}
        style={mergedStyle}
        {...filteredProps}
      >
        {children}
      </RNText>
    );
  }
);

Text.displayName = 'Text';
