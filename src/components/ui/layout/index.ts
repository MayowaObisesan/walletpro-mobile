/**
 * Layout Components Library
 *
 * A comprehensive set of layout components for React Native applications.
 * Inspired by Radix UI primitives but optimized for mobile development.
 *
 * Components are designed to be:
 * - Universal: Work in any React Native project
 * - Accessible: Proper ARIA attributes and screen reader support
 * - Performant: Optimized re-renders and minimal prop drilling
 * - Type-safe: Full TypeScript support with comprehensive interfaces
 * - Flexible: Support both Tailwind classes and inline styles
 * - Platform-aware: Web and native optimizations
 *
 * @example
 * import { Box, Flex, VStack, Container, Heading } from '@/components/ui/layout';
 *
 * export function MyComponent() {
 *   return (
 *     <Container>
 *       <VStack space={4}>
 *         <Heading level={1}>Title</Heading>
 *         <Flex justify="between" align="center">
 *           <Text>Left content</Text>
 *           <Text>Right content</Text>
         </Flex>
 *       </VStack>
 *     </Container>
 *   );
 * }
 */

import {AspectRatio, PhotoRatio, Square, VideoRatio, WidescreenRatio } from "./aspect-ratio";
import { Box } from "./box";
import {AbsoluteCenter, Center, HorizontalCenter, RelativeCenter, VerticalCenter } from "./center";
import {CenterContainer, Container, FluidContainer, MaxContainer } from "./container";
import { Divider, HDivider, VDivider } from "./divider";
import { Flex } from "./flex";
import { Grid, GridItem } from "./grid";
import {H1, H2, H3, H4, H5, H6, Heading } from "./heading";
import {Article, Aside, Footer, Header, Main, Nav, Section } from "./section";
import {FlexSpacer, Spacer, HSpacer, VSpacer } from "./spacer";
import {HStack, Stack, VStack } from "./stack";

// Re-export all components for external consumers
export {
  Box
} from './box';

export {
  Flex
} from './flex';

export {
  Stack,
  VStack,
  HStack
} from './stack';

export {
  Grid,
  GridItem
} from './grid';

export {
  Section,
  Header,
  Footer,
  Main,
  Article,
  Aside,
  Nav
} from './section';

export {
  Text
} from './text';

export {
  Heading,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6
} from './heading';

export {
  Spacer,
  VSpacer,
  HSpacer,
  FlexSpacer
} from './spacer';

export {
  Divider,
  HDivider,
  VDivider
} from './divider';

export {
  Center,
  AbsoluteCenter,
  RelativeCenter,
  HorizontalCenter,
  VerticalCenter
} from './center';

export {
  Container,
  MaxContainer,
  CenterContainer,
  FluidContainer
} from './container';

export {
  AspectRatio,
  Square,
  VideoRatio,
  PhotoRatio,
  WidescreenRatio
} from './aspect-ratio';

// Types and Utilities
export type {
  // Base types
  BaseLayoutProps,
  PlatformProps,

  // Component-specific types
  BoxProps,
  FlexProps,
  GridProps,
  StackProps,
  VStackProps,
  HStackProps,
  SectionProps,
  HeadingProps,
  SpacerProps,
  DividerProps,
  CenterProps,
  ContainerProps,
  AspectRatioProps,

  // Utility types
  FlexDirection,
  FlexWrap,
  FlexJustify,
  FlexAlign,
  GridAutoFlow,
  HeadingLevel,
  SpacingValue,
  GridTrack,
  AspectRatioValue,
  LayoutComponentProps
} from './types';

export {
  // Utility functions (for advanced usage)
  getDirectionClass,
  getWrapClass,
  getJustifyClass,
  getAlignClass,
  getSpacingClass,
  getGapClass,
  getFlexClass,
  getAlignSelfClass,
  getGridStyle,
  getContainerClass,
  getHeadingClass,
  getAspectRatioStyle,
  getPlatformProps,
  filterPlatformProps,
  combineClasses,
  spacingToNumber,
  generateTestID,
  getWebAccessibilityProps
} from './utils';

/**
 * Component Groups for organized imports
 *
 * These exports allow for more targeted imports if you don't need all components:
 *
 * @example
 * import { Core, Layout, Semantic, Utilities } from '@/components/ui/layout';
 *
 * <Core.Box>
 *   <Layout.VStack space={4}>
 *     <Semantic.Heading level={2}>Title</Semantic.Heading>
 *     <Utilities.Divider />
 *   </Layout.VStack>
 * </Core.Box>
 */
export const Core = {
  Box
} as const;

export const Layout = {
  Flex,
  Stack,
  VStack,
  HStack,
  Grid,
  GridItem,
  Container,
  MaxContainer,
  CenterContainer,
  FluidContainer,
  AspectRatio,
  Square,
  VideoRatio,
  PhotoRatio,
  WidescreenRatio
} as const;

export const Semantic = {
  Section,
  Header,
  Footer,
  Main,
  Article,
  Aside,
  Nav,
  Heading,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6
} as const;

export const Utilities = {
  Spacer,
  VSpacer,
  HSpacer,
  FlexSpacer,
  Divider,
  HDivider,
  VDivider,
  Center,
  AbsoluteCenter,
  RelativeCenter,
  HorizontalCenter,
  VerticalCenter
} as const;

/**
 * All components as a single object for destructuring
 *
 * @example
 * import { All } from '@/components/ui/layout';
 * const { Box, Flex, VStack, Heading } = All;
 */
export const All = {
  ...Core,
  ...Layout,
  ...Semantic,
  ...Utilities
} as const;

/**
 * Default export - most commonly used components
 */
export default {
  Box,
  Flex,
  VStack,
  HStack,
  Container,
  Heading,
  Spacer,
  Divider,
  Center
};
