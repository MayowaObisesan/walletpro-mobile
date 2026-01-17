# Layout Components Library

A comprehensive set of layout components for React Native applications, inspired by Radix UI primitives but optimized for mobile development.

## 🚀 Features

- **Universal**: Works in any React Native project
- **Accessible**: Proper ARIA attributes and screen reader support
- **Performant**: Optimized re-renders and minimal prop drilling
- **Type-safe**: Full TypeScript support with comprehensive interfaces
- **Flexible**: Support both Tailwind classes and inline styles
- **Platform-aware**: Web and native optimizations

## 📦 Installation

These components are designed to work with minimal dependencies:

```json
{
  "dependencies": {
    "react-native": "*",
    "nativewind": "^4.x",
    "tailwindcss": "^3.x",
    "class-variance-authority": "^0.7.x",
    "clsx": "^2.x",
    "tailwind-merge": "^3.x"
  }
}
```

## 🎯 Quick Start

```tsx
import { Box, Flex, VStack, Container, Heading } from '@/components/ui/layout';

export function MyComponent() {
  return (
    <Container>
      <VStack space={4}>
        <Heading level={1}>Welcome</Heading>
        <Flex justify="between" align="center">
          <Text>Left content</Text>
          <Text>Right content</Text>
        </Flex>
      </VStack>
    </Container>
  );
}
```

## 📚 Component Documentation

### Core Components

#### Box
The fundamental building block for all layout components.

```tsx
<Box bg="bg-primary" p={4} rounded="lg">
  <Text>Hello World</Text>
</Box>
```

**Props**: `bg`, `color`, `rounded`, `border`, `shadow`, `opacity`, `zIndex`, `overflow`, `position`, `display`

---

### Layout Components

#### Flex
Flexible layout component with flexbox props.

```tsx
<Flex direction="row" justify="between" align="center" gap={4}>
  <Text>Left</Text>
  <Text>Right</Text>
</Flex>
```

**Props**: `direction`, `wrap`, `justify`, `align`, `gap`, `gapX`, `gapY`, `grow`, `shrink`, `basis`, `alignSelf`

#### Stack
Easy stacking with consistent spacing.

```tsx
<Stack direction="vertical" space={4}>
  <Text>Item 1</Text>
  <Text>Item 2</Text>
  <Text>Item 3</Text>
</Stack>
```

**Props**: `direction`, `align`, `justify`, `space`, `wrap`

**Convenience Components**:
- `VStack` - Vertical stack (default)
- `HStack` - Horizontal stack

#### Grid
Grid layout (simulated with flexbox).

```tsx
<Grid columns={2} gap={4}>
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
  <Card>Item 4</Card>
</Grid>
```

**Props**: `columns`, `rows`, `gap`, `gapX`, `gapY`, `autoFlow`, `autoColumns`, `autoRows`

---

### Semantic Components

#### Section
Semantic section with proper accessibility.

```tsx
<Section ariaLabel="User Profile">
  <Heading level={2}>Profile</Heading>
  <Text>User information</Text>
</Section>
```

**Props**: `as`, `ariaLabel`, `ariaLabelledby`

**Convenience Components**:
- `Header` - `<header>` semantic
- `Footer` - `<footer>` semantic
- `Main` - `<main>` semantic
- `Article` - `<article>` semantic
- `Aside` - `<aside>` semantic
- `Nav` - `<nav>` semantic

#### Heading
Semantic heading with proper hierarchy.

```tsx
<Heading level={1} align="center" weight="bold">
  Page Title
</Heading>
```

**Props**: `level`, `variant`, `as`, `align`, `weight`, `truncate`, `numberOfLines`

**Convenience Components**:
- `H1` - Level 1 heading
- `H2` - Level 2 heading
- `H3` - Level 3 heading
- `H4` - Level 4 heading
- `H5` - Level 5 heading
- `H6` - Level 6 heading

---

### Utility Components

#### Spacer
Flexible spacing utility.

```tsx
<VStack>
  <Text>Item 1</Text>
  <Spacer size={4} />
  <Text>Item 2</Text>
</VStack>

<HStack>
  <Text>Left</Text>
  <Spacer flex />
  <Text>Right</Text>
</HStack>
```

**Props**: `size`, `direction`, `flex`

**Convenience Components**:
- `VSpacer` - Vertical spacer
- `HSpacer` - Horizontal spacer
- `FlexSpacer` - Flexible spacer

#### Divider
Visual separator component.

```tsx
<Divider />
<Divider direction="vertical" thickness={2} />
<Divider color="border-primary" />
```

**Props**: `direction`, `thickness`, `color`, `decorative`

**Convenience Components**:
- `HDivider` - Horizontal divider
- `VDivider` - Vertical divider

#### Center
Content centering utility.

```tsx
<Center className="h-32 w-32 bg-primary">
  <Text>Centered content</Text>
</Center>

<Center absolute axis="both" className="bg-black/50">
  <Text>Modal content</Text>
</Center>
```

**Props**: `absolute`, `axis`

**Convenience Components**:
- `AbsoluteCenter` - Absolutely positioned center
- `RelativeCenter` - Relatively positioned center
- `HorizontalCenter` - Horizontal center only
- `VerticalCenter` - Vertical center only

---

### Container Components

#### Container
Responsive container with max-width.

```tsx
<Container maxWidth="lg" px={8}>
  <Text>Responsive container</Text>
</Container>
```

**Props**: `maxWidth`, `center`, `px`

**Convenience Components**:
- `MaxContainer` - Max-width without centering
- `CenterContainer` - Always centered
- `FluidContainer` - Full width

---

### Aspect Ratio Components

#### AspectRatio
Maintain consistent aspect ratios.

```tsx
<AspectRatio ratio={16/9}>
  <Image source={{ uri: 'https://example.com/image.jpg' }} className="w-full h-full" />
</AspectRatio>

<AspectRatio ratio="1/1" className="bg-muted">
  <Center>
    <Text>Square content</Text>
  </Center>
</AspectRatio>
```

**Props**: `ratio`, `maintain`

**Convenience Components**:
- `Square` - 1:1 ratio
- `VideoRatio` - 16:9 ratio
- `PhotoRatio` - 4:3 ratio
- `WidescreenRatio` - 21:9 ratio

---

## 🎨 Styling

All components support both Tailwind classes and inline styles:

```tsx
// Tailwind classes
<Box className="bg-primary p-4 rounded-lg">
  <Text>Styled with Tailwind</Text>
</Box>

// Inline styles
<Box style={{ backgroundColor: '#3b82f6', padding: 16 }}>
  <Text>Styled with inline styles</Text>
</Box>

// Mixed
<Box className="bg-primary" style={{ borderRadius: 8 }}>
  <Text>Mixed styling</Text>
</Box>

// Shorthand props
<Box bg="bg-primary" p={4} rounded="lg">
  <Text>Shorthand props</Text>
</Box>
```

## 📱 Platform Support

Components automatically adapt to the current platform:

```tsx
<Box
  webOnly={{ role: 'button' }}
  nativeOnly={{ accessible: true }}
>
  <Text>Cross-platform content</Text>
</Box>
```

## ♿ Accessibility

All components include proper accessibility support:

```tsx
<Section ariaLabel="Navigation menu">
  <Heading level={2}>Menu</Heading>
  <Text>Navigation items</Text>
</Section>

<Divider decorative={false} accessibilityLabel="Section separator" />

<Heading level={1} accessibilityLabel="Page title">
  Title
</Heading>
```

## 🔧 Advanced Usage

### Custom Component Groups

```tsx
import { Core, Layout, Semantic, Utilities } from '@/components/ui/layout';

<Core.Box>
  <Layout.VStack space={4}>
    <Semantic.Heading level={2}>Title</Semantic.Heading>
    <Utilities.Divider />
  </Layout.VStack>
</Core.Box>
```

### Utility Functions

```tsx
import { 
  getDirectionClass, 
  getSpacingClass, 
  combineClasses 
} from '@/components/ui/layout';

const className = combineClasses(
  getDirectionClass('row'),
  getSpacingClass(4, 'gap'),
  'custom-class'
);
```

### TypeScript Support

Full TypeScript support with comprehensive interfaces:

```tsx
import type { BoxProps, FlexProps } from '@/components/ui/layout';

interface CustomComponentProps extends BoxProps {
  customProp: string;
}

const CustomComponent: React.FC<CustomComponentProps> = ({ 
  customProp, 
  ...boxProps 
}) => {
  return <Box {...boxProps}>{customProp}</Box>;
};
```

## 🚀 Best Practices

### 1. Use Semantic Components
```tsx
// ✅ Good
<Section>
  <Heading level={2}>Section Title</Heading>
</Section>

// ❌ Avoid
<Box>
  <Text className="text-xl font-bold">Section Title</Text>
</Box>
```

### 2. Leverage Stack Components
```tsx
// ✅ Good
<VStack space={4}>
  <Text>Item 1</Text>
  <Text>Item 2</Text>
</VStack>

// ❌ Avoid
<Box>
  <Text>Item 1</Text>
  <Box className="h-4" />
  <Text>Item 2</Text>
</Box>
```

### 3. Use Convenience Components
```tsx
// ✅ Good
<HStack space={4} align="center">
  <Button>Cancel</Button>
  <Button>Submit</Button>
</HStack>

// ❌ Verbose
<Flex direction="row" gap={4} align="center">
  <Button>Cancel</Button>
  <Button>Submit</Button>
</Flex>
```

### 4. Container Usage
```tsx
// ✅ Good
<Container maxWidth="lg">
  <Text>Responsive content</Text>
</Container>

// ❌ Avoid
<Box className="max-w-4xl mx-auto px-4">
  <Text>Responsive content</Text>
</Box>
```

## 🔄 Migration from Existing Code

### From StyleSheet
```tsx
// Before
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f3f4f6'
  }
});

<Box style={styles.container}>
  <Text>Content</Text>
</Box>

// After
<Box className="flex-1 p-4 bg-gray-100">
  <Text>Content</Text>
</Box>
```

### From Flexbox Direct Usage
```tsx
// Before
<View style={{ 
  flexDirection: 'row', 
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 16
}}>
  <Text>Left</Text>
  <Text>Right</Text>
</View>

// After
<Flex direction="row" justify="between" align="center" gap={4}>
  <Text>Left</Text>
  <Text>Right</Text>
</Flex>
```

## 🐛 Troubleshooting

### Common Issues

1. **Styles not applying**: Ensure NativeWind is properly configured
2. **TypeScript errors**: Check that you're importing types correctly
3. **Performance issues**: Use appropriate components (Stack vs Flex)
4. **Platform differences**: Use `webOnly` and `nativeOnly` props

### Debug Tips

```tsx
// Enable debug mode to see generated classes
<Box debug className="p-4">
  <Text>Debug content</Text>
</Box>

// Use testID for testing
<Box testID="my-component" className="p-4">
  <Text>Testable content</Text>
</Box>
```

## 📄 License

These components are designed to be used in any React Native project. Feel free to use them in your applications!

## 🤝 Contributing

These components follow the established patterns in your project. When modifying:

1. Maintain TypeScript interfaces
2. Follow the existing prop patterns
3. Add comprehensive JSDoc comments
4. Include accessibility considerations
5. Test on both platforms

---

**Enjoy building beautiful, accessible layouts! 🎉**
