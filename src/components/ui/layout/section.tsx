import React, { useMemo } from 'react';
import { Platform } from 'react-native';
import { cn } from '@/src/lib/utils';
import type { SectionProps } from './types';
import { 
  getWebAccessibilityProps,
  combineClasses,
  filterPlatformProps,
  generateTestID
} from './utils';
import { Box } from './box';

/**
 * Section - A semantic section component
 * 
 * Provides semantic meaning to content sections with proper accessibility
 * and ARIA attributes. Extends Box with semantic props.
 * 
 * @example
 * <Section ariaLabel="User Profile">
 *   <Heading level={2}>Profile</Heading>
 *   <Text>User information goes here</Text>
 * </Section>
 * 
 * @example
 * <Section as="article">
 *   <Heading level={3}>Article Title</Heading>
 *   <Text>Article content...</Text>
 * </Section>
 */
export const Section = React.forwardRef<React.ElementRef<typeof Box>, SectionProps>(
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
    // Section specific props
    as = 'section',
    ariaLabel,
    ariaLabelledby,
    ...props
  }, ref) => {
    
    // Generate accessibility props for web
    const webAccessibilityProps = useMemo(() => {
      return getWebAccessibilityProps(as, ariaLabel, ariaLabelledby);
    }, [as, ariaLabel, ariaLabelledby]);
    
    // Combine accessibility props
    const accessibilityProps = useMemo(() => {
      const props: any = {
        accessibilityLabel: accessibilityLabel || ariaLabel,
        accessibilityHint,
      };
      
      // Set accessibility role based on semantic type
      if (Platform.OS !== 'web' && as !== 'section') {
        props.accessibilityRole = as;
      }
      
      return props;
    }, [accessibilityLabel, accessibilityHint, as, ariaLabel]);
    
    // Combine all classes
    const computedClassName = useMemo(() => {
      const classes = [];
      
      // Add semantic classes if needed
      if (as === 'main') classes.push('flex-1');
      if (as === 'header' || as === 'footer') classes.push('border-b border-border');
      
      return combineClasses(...classes, className);
    }, [as, className]);
    
    // Filter platform-specific props
    const filteredProps = useMemo(() => {
      return filterPlatformProps({
        testID: generateTestID('Section', { testID }),
        ...accessibilityProps,
        webOnly,
        nativeOnly,
        ...webAccessibilityProps,
        ...props
      });
    }, [testID, accessibilityProps, webOnly, nativeOnly, webAccessibilityProps, props]);
    
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
        accessibilityRole={accessibilityRole}
        {...filteredProps}
      >
        {children}
      </Box>
    );
  }
);

Section.displayName = 'Section';

/**
 * Header - A semantic header component
 * 
 * Specialized Section component for header content.
 * 
 * @example
 * <Header>
 *   <Heading level={1}>App Title</Heading>
 *   <Navigation />
 * </Header>
 */
export const Header = React.forwardRef<React.ElementRef<typeof Box>, Omit<SectionProps, 'as'>>(
  (props, ref) => {
    return <Section ref={ref} as="header" {...props} />;
  }
);

Header.displayName = 'Header';

/**
 * Footer - A semantic footer component
 * 
 * Specialized Section component for footer content.
 * 
 * @example
 * <Footer>
 *   <Text>&copy; 2024 My App</Text>
 *   <HStack space={4}>
 *     <Link>Privacy</Link>
 *     <Link>Terms</Link>
 *   </HStack>
 * </Footer>
 */
export const Footer = React.forwardRef<React.ElementRef<typeof Box>, Omit<SectionProps, 'as'>>(
  (props, ref) => {
    return <Section ref={ref} as="footer" {...props} />;
  }
);

Footer.displayName = 'Footer';

/**
 * Main - A semantic main component
 * 
 * Specialized Section component for main content area.
 * 
 * @example
 * <Main>
 *   <Heading level={2}>Main Content</Heading>
 *   <Text>Primary content goes here</Text>
 * </Main>
 */
export const Main = React.forwardRef<React.ElementRef<typeof Box>, Omit<SectionProps, 'as'>>(
  (props, ref) => {
    return <Section ref={ref} as="main" {...props} />;
  }
);

Main.displayName = 'Main';

/**
 * Article - A semantic article component
 * 
 * Specialized Section component for article content.
 * 
 * @example
 * <Article>
 *   <Heading level={3}>Article Title</Heading>
 *   <Text>Article content goes here...</Text>
 * </Article>
 */
export const Article = React.forwardRef<React.ElementRef<typeof Box>, Omit<SectionProps, 'as'>>(
  (props, ref) => {
    return <Section ref={ref} as="article" {...props} />;
  }
);

Article.displayName = 'Article';

/**
 * Aside - A semantic aside component
 * 
 * Specialized Section component for sidebar or ancillary content.
 * 
 * @example
 * <Aside>
 *   <Heading level={4}>Related Links</Heading>
 *   <VStack space={2}>
 *     <Link>Link 1</Link>
 *     <Link>Link 2</Link>
 *   </VStack>
 * </Aside>
 */
export const Aside = React.forwardRef<React.ElementRef<typeof Box>, Omit<SectionProps, 'as'>>(
  (props, ref) => {
    return <Section ref={ref} as="aside" {...props} />;
  }
);

Aside.displayName = 'Aside';

/**
 * Nav - A semantic navigation component
 * 
 * Specialized Section component for navigation content.
 * 
 * @example
 * <Nav ariaLabel="Main navigation">
 *   <HStack space={4}>
 *     <Link>Home</Link>
 *     <Link>About</Link>
 *     <Link>Contact</Link>
 *   </HStack>
 * </Nav>
 */
export const Nav = React.forwardRef<React.ElementRef<typeof Box>, Omit<SectionProps, 'as'>>(
  (props, ref) => {
    return <Section ref={ref} as="nav" {...props} />;
  }
);

Nav.displayName = 'Nav';
