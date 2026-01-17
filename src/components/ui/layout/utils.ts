import { Platform } from 'react-native';
import type {
  FlexDirection,
  FlexWrap,
  FlexJustify,
  FlexAlign,
  GridTrack,
  SpacingValue
} from './types';

/**
 * Utility functions for layout components
 */

/**
 * Maps flex direction props to Tailwind classes
 */
export const getDirectionClass = (direction?: FlexDirection): string => {
  if (!direction) return '';

  const directionMap: Record<FlexDirection, string> = {
    'row': 'flex-row',
    'column': 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'column-reverse': 'flex-col-reverse'
  };

  return directionMap[direction];
};

/**
 * Maps flex wrap props to Tailwind classes
 */
export const getWrapClass = (wrap?: FlexWrap): string => {
  if (!wrap) return '';

  const wrapMap: Record<FlexWrap, string> = {
    'nowrap': 'flex-nowrap',
    'wrap': 'flex-wrap',
    'wrap-reverse': 'flex-wrap-reverse'
  };

  return wrapMap[wrap];
};

/**
 * Maps justify props to Tailwind classes
 */
export const getJustifyClass = (justify?: FlexJustify): string => {
  if (!justify) return '';

  const justifyMap: Record<FlexJustify, string> = {
    'start': 'justify-start',
    'end': 'justify-end',
    'center': 'justify-center',
    'between': 'justify-between',
    'around': 'justify-around',
    'evenly': 'justify-evenly',
    'stretch': 'justify-stretch'
  };

  return justifyMap[justify];
};

/**
 * Maps align props to Tailwind classes
 */
export const getAlignClass = (align?: FlexAlign): string => {
  if (!align) return '';

  const alignMap: Record<FlexAlign, string> = {
    'start': 'items-start',
    'end': 'items-end',
    'center': 'items-center',
    'baseline': 'items-baseline',
    'stretch': 'items-stretch'
  };

  return alignMap[align];
};

/**
 * Maps spacing values to Tailwind classes
 */
export const getSpacingClass = (value?: SpacingValue, prefix = ''): string => {
  if (!value && value !== 0) return '';

  if (typeof value === 'number') {
    // Convert number to Tailwind spacing unit
    return `${prefix}-${value}`;
  }

  return `${prefix}-${value}`;
};

/**
 * Maps gap props to Tailwind classes
 */
export const getGapClass = (gap?: SpacingValue, gapX?: SpacingValue, gapY?: SpacingValue): string => {
  const classes = [];

  if (gap) classes.push(getSpacingClass(gap, 'gap'));
  if (gapX) classes.push(getSpacingClass(gapX, 'gap-x'));
  if (gapY) classes.push(getSpacingClass(gapY, 'gap-y'));

  return classes.join(' ');
};

/**
 * Maps flex grow/shrink props to Tailwind classes
 */
export const getFlexClass = (grow?: number | boolean, shrink?: number | boolean, basis?: SpacingValue): string => {
  const classes = [];

  if (grow !== undefined) {
    if (typeof grow === 'boolean') {
      classes.push(grow ? 'flex-grow' : 'flex-grow-0');
    } else {
      classes.push(`flex-grow-${grow}`);
    }
  }

  if (shrink !== undefined) {
    if (typeof shrink === 'boolean') {
      classes.push(shrink ? 'flex-shrink' : 'flex-shrink-0');
    } else {
      classes.push(`flex-shrink-${shrink}`);
    }
  }

  if (basis) {
    classes.push(`flex-basis-${basis}`);
  }

  return classes.join(' ');
};

/**
 * Maps align-self props to Tailwind classes
 */
export const getAlignSelfClass = (alignSelf?: string): string => {
  if (!alignSelf) return '';

  const alignSelfMap: Record<string, string> = {
    'auto': 'self-auto',
    'start': 'self-start',
    'end': 'self-end',
    'center': 'self-center',
    'baseline': 'self-baseline',
    'stretch': 'self-stretch'
  };

  return alignSelfMap[alignSelf] || '';
};

/**
 * Maps grid column/row props to styles (since RN doesn't have native grid)
 */
export const getGridStyle = (
  columns?: GridTrack,
  rows?: GridTrack,
  columnsGap?: SpacingValue,
  rowsGap?: SpacingValue
) => {
  const style: any = {};

  // Since React Native doesn't have native grid, we simulate with flexbox
  if (columns) {
    if (typeof columns === 'number') {
      // For simple column count, we'll handle this in the component
      style.numColumns = columns;
    }
  }

  // Add gap styles if needed
  if (columnsGap || rowsGap) {
    // Tailwind will handle most gap cases, but we have fallbacks
  }

  return style;
};

/**
 * Maps container max-width props to Tailwind classes
 */
export const getContainerClass = (maxWidth?: string, center?: boolean, px?: SpacingValue): string => {
  const classes = [];

  if (maxWidth && maxWidth !== 'full') {
    classes.push(`max-w-${maxWidth}`);
  } else if (maxWidth === 'full') {
    classes.push('max-w-full');
  }

  if (center) {
    classes.push('mx-auto');
  }

  if (px !== undefined) {
    classes.push(getSpacingClass(px, 'px'));
  } else {
    // Default horizontal padding for containers
    classes.push('px-4');
  }

  return classes.join(' ');
};

/**
 * Maps heading levels to Tailwind font size classes
 */
const headingSizeMap: Record<number, string> = {
  1: 'text-xs',    // Smallest
  2: 'text-sm',    
  3: 'text-base',  
  4: 'text-lg',    
  5: 'text-xl',    
  6: 'text-2xl',   
  7: 'text-3xl',   
  8: 'text-4xl',   
  9: 'text-5xl',   // Largest
};

/**
 * Maps heading props to Tailwind classes
 */
export const getHeadingClass = (
  level?: number,
  variant?: string,
  align?: string,
  weight?: string,
  truncate?: boolean
): string => {
  const classes = [];

  // Use variant first, then fall back to level mapping
  let textSize = variant || (level ? headingSizeMap[level] || headingSizeMap[3] : headingSizeMap[3]);
  
  // Handle legacy h1-h6 variants by mapping them to levels
  if (variant && variant.match(/^h[1-6]$/)) {
    const variantLevel = parseInt(variant.substring(1));
    textSize = headingSizeMap[variantLevel] || headingSizeMap[3];
  }
  
  classes.push(textSize);

  // Text alignment
  if (align && align !== 'left') {
    classes.push(`text-${align}`);
  }

  // Font weight
  if (weight && weight !== 'normal') {
    classes.push(`font-${weight}`);
  }

  // Text truncation
  if (truncate) {
    classes.push('truncate');
  }

  return classes.join(' ');
};

/**
 * Maps aspect ratio to styles
 */
export const getAspectRatioStyle = (ratio?: string | number) => {
  if (!ratio) return {};

  const aspectRatio = typeof ratio === 'number' ? ratio : parseFloat(ratio);

  if (isNaN(aspectRatio)) return {};

  return {
    aspectRatio
  };
};

/**
 * Maps platform-specific props
 */
export const getPlatformProps = (webOnly?: Record<string, any>, nativeOnly?: Record<string, any>) => {
  if (Platform.OS === 'web') {
    return webOnly || {};
  }
  return nativeOnly || {};
};

/**
 * Filters out platform-specific props for the current platform
 */
export const filterPlatformProps = (props: Record<string, any>) => {
  const { webOnly, nativeOnly, ...rest } = props;

  const platformProps = getPlatformProps(webOnly, nativeOnly);

  return {
    ...rest,
    ...platformProps
  };
};

/**
 * Combines multiple class names into a single string
 */
export const combineClasses = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Converts Tailwind spacing values to numbers for style calculations
 */
export const spacingToNumber = (value: SpacingValue): number => {
  if (typeof value === 'number') return value;

  // Extract number from Tailwind spacing strings like "p-4", "gap-2", etc.
  const match = value.match(/(\d+(?:\.\d+)?)/);
  if (match) {
    return parseFloat(match[1]);
  }

  return 0;
};

/**
 * Generates unique test IDs for components
 */
export const generateTestID = (componentName: string, props?: Record<string, any>): string => {
  const baseID = componentName;

  if (!props || !props.testID) return baseID;

  return `${baseID}-${props.testID}`;
};

/**
 * Web-only accessibility props
 */
export const getWebAccessibilityProps = (role?: string, ariaLabel?: string, ariaLabelledby?: string) => {
  if (Platform.OS !== 'web') return {};

  const props: any = {};

  if (role) props.role = role;
  if (ariaLabel) props['aria-label'] = ariaLabel;
  if (ariaLabelledby) props['aria-labelledby'] = ariaLabelledby;

  return props;
};
