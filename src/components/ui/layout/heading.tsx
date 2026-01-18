import React, { useMemo } from 'react';
import { Platform, Text } from 'react-native';
import { cn } from '@/src/lib/utils';
import type { HeadingProps } from './types';
import type { TextStyle } from 'react-native';
import { 
  getHeadingClass,
  getWebAccessibilityProps,
  combineClasses,
  filterPlatformProps,
  generateTestID
} from './utils';
import { Box } from './box';

/**
 * Heading - A semantic heading component
 * 
 * Provides proper semantic heading levels with consistent styling.
 * Supports both level prop (number) and variant prop (h1-h6) for flexibility.
 * 
 * @example
 * <Heading level={1} className="text-center">
 *   Main Title
 * </Heading>
 * 
 * @example
 * <Heading variant="h3" weight="semibold" align="center">
 *   Section Title
 * </Heading>
 * 
 * @example
 * <Heading level={2} truncate numberOfLines={2}>
 *   Long heading text that might need truncation
 * </Heading>
 */
export const Heading = React.forwardRef<React.ElementRef<typeof Text>, HeadingProps>(
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
    // Heading specific props
    level = 3,
    variant,
    as,
    align,
    weight,
    truncate,
    numberOfLines,
    ...props
  }, ref) => {
    
    // Determine the heading element type and variant
    const headingConfig = useMemo(() => {
      // Use variant first, then fall back to level
      const finalVariant = variant || `h${level}`;
      const elementType = as || `h${level}`;
      
      return {
        variant: finalVariant,
        elementType,
        ariaLevel: level
      };
    }, [level, variant, as]);
    
    // Generate heading-specific classes
    const headingClasses = useMemo(() => {
      return getHeadingClass(
        level,
        headingConfig.variant,
        align,
        weight || 'bold', // Default to font-bold
        truncate
      );
    }, [level, headingConfig.variant, align, weight, truncate]);
    
    // Generate accessibility props for web
    const webAccessibilityProps = useMemo(() => {
      return getWebAccessibilityProps('heading', accessibilityLabel);
    }, [accessibilityLabel]);
    
    // Combine accessibility props
    const accessibilityProps = useMemo(() => {
      const props: any = {
        accessibilityLabel,
        accessibilityHint,
        accessibilityRole: accessibilityRole || 'header',
      };
      
      return props;
    }, [accessibilityLabel, accessibilityHint, accessibilityRole]);
    
    // Combine all classes
    const computedClassName = useMemo(() => {
      const classes = [];
      
      // Add heading classes
      classes.push(headingClasses);
      
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
    }, [headingClasses, bg, color, rounded, border, shadow, overflow, className]);
    
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
        return style as TextStyle;
      }
      return [style as TextStyle, computedStyle] as TextStyle[];
    }, [style, computedStyle]);
    
    // Filter platform-specific props
    const filteredProps = useMemo(() => {
      return filterPlatformProps({
        testID: generateTestID('Heading', { testID }),
        ...accessibilityProps,
        numberOfLines,
        webOnly,
        nativeOnly,
        ...webAccessibilityProps,
        ...props
      });
    }, [testID, accessibilityProps, numberOfLines, webOnly, nativeOnly, webAccessibilityProps, props]);
    
    return (
      <Text
        ref={ref}
        className={cn(computedClassName)}
        style={mergedStyle}
        {...filteredProps}
      >
        {children}
      </Text>
    );
  }
);

Heading.displayName = 'Heading';

/**
 * H1 - Level 1 heading component
 * 
 * @example
 * <H1>Page Title</H1>
 */
export const H1 = React.forwardRef<React.ElementRef<typeof Text>, Omit<HeadingProps, 'level' | 'variant'>>(
  (props, ref) => {
    return <Heading ref={ref} level={1} variant="h1" {...props} />;
  }
);

H1.displayName = 'H1';

/**
 * H2 - Level 2 heading component
 * 
 * @example
 * <H2>Section Title</H2>
 */
export const H2 = React.forwardRef<React.ElementRef<typeof Text>, Omit<HeadingProps, 'level' | 'variant'>>(
  (props, ref) => {
    return <Heading ref={ref} level={2} variant="h2" {...props} />;
  }
);

H2.displayName = 'H2';

/**
 * H3 - Level 3 heading component
 * 
 * @example
 * <H3>Subsection Title</H3>
 */
export const H3 = React.forwardRef<React.ElementRef<typeof Text>, Omit<HeadingProps, 'level' | 'variant'>>(
  (props, ref) => {
    return <Heading ref={ref} level={3} variant="h3" {...props} />;
  }
);

H3.displayName = 'H3';

/**
 * H4 - Level 4 heading component
 * 
 * @example
 * <H4>Minor Title</H4>
 */
export const H4 = React.forwardRef<React.ElementRef<typeof Text>, Omit<HeadingProps, 'level' | 'variant'>>(
  (props, ref) => {
    return <Heading ref={ref} level={4} variant="h4" {...props} />;
  }
);

H4.displayName = 'H4';

/**
 * H5 - Level 5 heading component
 * 
 * @example
 * <H5>Small Title</H5>
 */
export const H5 = React.forwardRef<React.ElementRef<typeof Text>, Omit<HeadingProps, 'level' | 'variant'>>(
  (props, ref) => {
    return <Heading ref={ref} level={5} variant="h5" {...props} />;
  }
);

H5.displayName = 'H5';

/**
 * H6 - Level 6 heading component
 * 
 * @example
 * <H6>Tiny Title</H6>
 */
export const H6 = React.forwardRef<React.ElementRef<typeof Text>, Omit<HeadingProps, 'level' | 'variant'>>(
  (props, ref) => {
    return <Heading ref={ref} level={6} variant="h6" {...props} />;
  }
);

H6.displayName = 'H6';
