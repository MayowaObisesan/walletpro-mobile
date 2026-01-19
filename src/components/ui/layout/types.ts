import type { ViewStyle, TextStyle } from 'react-native';
import type {ComponentProps, ReactNode} from 'react';

/**
 * Base layout props that all layout components share
 */
export interface BaseLayoutProps {
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: ViewStyle;
  /** Test ID for testing */
  testID?: string;
  /** Children components */
  children?: ReactNode;
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Accessibility hint */
  accessibilityHint?: string;
  /** Accessibility role */
  accessibilityRole?: string;
}

/**
 * Platform-specific props for web and native
 */
export interface PlatformProps {
  /** Props only applied on web platform */
  webOnly?: Record<string, any>;
  /** Props only applied on native platforms */
  nativeOnly?: Record<string, any>;
}

/**
 * Flexbox direction values
 */
export type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';

/**
 * Flexbox wrap values
 */
export type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';

/**
 * Flexbox justify values (main axis)
 */
export type FlexJustify =
  | 'start'
  | 'end'
  | 'center'
  | 'between'
  | 'around'
  | 'evenly'
  | 'stretch';

/**
 * Flexbox align values (cross axis)
 */
export type FlexAlign =
  | 'start'
  | 'end'
  | 'center'
  | 'baseline'
  | 'stretch';

/**
 * Grid auto flow values
 */
export type GridAutoFlow =
  | 'row'
  | 'col'
  | 'dense'
  | 'row-dense'
  | 'col-dense';

/**
 * Heading levels
 */
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/**
 * Spacing values (number or Tailwind spacing string)
 */
export type SpacingValue = number | string;

/**
 * Grid column/row definitions
 */
export type GridTrack = number | string | (number | string)[];

/**
 * Aspect ratio values
 */
export type AspectRatioValue = number | string;

/**
 * Extended props for Box component
 */
export interface BoxProps extends BaseLayoutProps, PlatformProps {
  /** Background color class */
  bg?: string;
  /** Text color class */
  color?: string;
  /** Border radius class */
  rounded?: string;
  /** Border class */
  border?: string;
  /** Shadow class */
  shadow?: string;
  /** Opacity value (0-100) */
  opacity?: number;
  /** Z-index value */
  zIndex?: number;
  /** Overflow behavior */
  overflow?: 'visible' | 'hidden' | 'scroll';
  /** Position type */
  position?: 'relative' | 'absolute' | 'fixed' | 'static';
  /** Display type */
  display?: 'flex' | 'none' | 'block';
}

/**
 * Props for Flex component
 */
export interface FlexProps extends BoxProps {
  /** Flex direction */
  direction?: FlexDirection;
  /** Flex wrap behavior */
  wrap?: FlexWrap;
  /** Main axis alignment */
  justify?: FlexJustify;
  /** Cross axis alignment */
  align?: FlexAlign;
  /** Gap between items */
  gap?: SpacingValue;
  /** Gap between columns */
  gapX?: SpacingValue;
  /** Gap between rows */
  gapY?: SpacingValue;
  /** Flex grow value */
  grow?: number | boolean;
  /** Flex shrink value */
  shrink?: number | boolean;
  /** Flex basis value */
  basis?: SpacingValue;
  /** Align self */
  alignSelf?: 'auto' | 'start' | 'end' | 'center' | 'baseline' | 'stretch';
}

/**
 * Props for Grid component
 */
export interface GridProps extends BoxProps {
  /** Number of columns or column definition */
  columns?: GridTrack;
  /** Number of rows or row definition */
  rows?: GridTrack;
  /** Gap between grid items */
  gap?: SpacingValue;
  /** Gap between columns */
  gapX?: SpacingValue;
  /** Gap between rows */
  gapY?: SpacingValue;
  /** Auto flow behavior */
  autoFlow?: GridAutoFlow;
  /** Auto columns */
  autoColumns?: GridTrack;
  /** Auto rows */
  autoRows?: GridTrack;
  /** Template areas */
  templateAreas?: string[];
  /** Column start position */
  colStart?: number | string;
  /** Column end position */
  colEnd?: number | string;
  /** Row start position */
  rowStart?: number | string;
  /** Row end position */
  rowEnd?: number | string;
}

/**
 * Props for Stack components
 */
export interface StackProps extends BoxProps {
  /** Direction of the stack */
  direction?: 'vertical' | 'horizontal';
  /** Alignment of items */
  align?: FlexAlign;
  /** Distribution of items */
  justify?: FlexJustify;
  /** Spacing between items */
  space?: SpacingValue;
  /** Whether to wrap items */
  wrap?: FlexWrap;
  /** Whether to gap items */
  gap?: SpacingValue;
}

/**
 * Props for Container component
 */
export interface ContainerProps extends BoxProps {
  /** Maximum width of container */
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full';
  /** Whether to center the container */
  center?: boolean;
  /** Horizontal padding */
  px?: SpacingValue;
}

/**
 * Props for Section component
 */
export interface SectionProps extends BoxProps {
  /** Section semantic role */
  as?: 'section' | 'article' | 'aside' | 'nav' | 'main' | 'header' | 'footer';
  /** ARIA label for accessibility */
  ariaLabel?: string;
  /** ARIA labelledby */
  ariaLabelledby?: string;
}

/**
 * Props for Heading component
 */
export interface HeadingProps extends BoxProps {
  /** Heading level (1-9) */
  level?: HeadingLevel;
  /** Heading variant for styling */
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  /** Custom heading element type */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'span';
  /** Text alignment */
  align?: 'left' | 'center' | 'right' | 'justify';
  /** Text weight */
  weight?: 'thin' | 'extralight' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  /** Whether to truncate text */
  truncate?: boolean;
  /** Number of lines to show */
  numberOfLines?: number;
}

/**
 * Props for Text component (non-semantic version of Heading)
 */
export interface TextProps extends Omit<BoxProps, 'as'> {
  /** Text level (1-9) for font sizing */
  level?: HeadingLevel;
  /** Text alignment */
  align?: 'left' | 'center' | 'right' | 'justify';
  /** Text weight */
  weight?: 'thin' | 'extralight' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  /** Whether to truncate text */
  truncate?: boolean;
  /** Number of lines to show */
  numberOfLines?: number;
}

/**
 * Props for Spacer component
 */
export interface SpacerProps extends BaseLayoutProps, PlatformProps {
  /** Size of the spacer */
  size?: SpacingValue;
  /** Direction of spacer (for flexible spacing) */
  direction?: 'vertical' | 'horizontal' | 'both';
  /** Whether spacer is flexible (takes available space) */
  flex?: boolean;
}

/**
 * Props for Divider component
 */
export interface DividerProps extends BaseLayoutProps, PlatformProps {
  /** Direction of divider */
  direction?: 'horizontal' | 'vertical';
  /** Thickness of divider */
  thickness?: number | string;
  /** Color of divider */
  color?: string;
  /** Whether divider is decorative */
  decorative?: boolean;
}

/**
 * Props for Center component
 */
export interface CenterProps extends BoxProps {
  /** Whether to center absolutely */
  absolute?: boolean;
  /** Axis to center on */
  axis?: 'both' | 'horizontal' | 'vertical';
}

/**
 * Props for AspectRatio component
 */
export interface AspectRatioProps extends BaseLayoutProps, PlatformProps {
  /** Aspect ratio (width/height) */
  ratio?: AspectRatioValue;
  /** Whether to maintain aspect ratio */
  maintain?: boolean;
}

/**
 * Props for VStack component (vertical stack)
 */
export interface VStackProps extends Omit<StackProps, 'direction'> {
  /** Override to ensure vertical direction */
  direction?: 'vertical';
}

/**
 * Props for HStack component (horizontal stack)
 */
export interface HStackProps extends Omit<StackProps, 'direction'> {
  /** Override to ensure horizontal direction */
  direction?: 'horizontal';
}

/**
 * Combined props type that can be any of the layout components
 */
export type LayoutComponentProps =
  | BoxProps
  | FlexProps
  | GridProps
  | StackProps
  | VStackProps
  | HStackProps
  | ContainerProps
  | SectionProps
  | HeadingProps
  | SpacerProps
  | DividerProps
  | CenterProps
  | AspectRatioProps;
