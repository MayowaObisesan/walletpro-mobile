# Grid & GridItem - Mobile-First CSS Grid (Radix UI-Style)

A complete mobile-first CSS Grid implementation that brings Radix UI-style API to React Native, with sophisticated flexbox simulation for native platforms.

## Features

### 🚀 Mobile-First Design
- **Responsive Breakpoints**: `xs` (0px+), `sm` (380px+), `md` (768px+), `lg` (1024px+)
- **Automatic Adaptation**: Components respond to screen size changes
- **Touch-Optimized**: Designed for mobile interactions

### 🎯 Radix UI-Style API
- **Familiar Syntax**: Same patterns as Radix UI Grid
- **Responsive Objects**: `{ xs: 1, sm: 2, md: 3, lg: 4 }`
- **Backward Compatible**: Supports legacy props for migration

### 📱 Cross-Platform
- **Web**: Native CSS Grid with full functionality
- **Native**: Sophisticated flexbox simulation
- **Context Communication**: Smart Grid-GridItem coordination

## Quick Start

### Basic Grid

```typescript
import { Grid, GridItem } from '@/components/ui/layout';

<Grid columns={2} gap={4}>
  <GridItem>
    <Text>Item 1</Text>
  </GridItem>
  <GridItem>
    <Text>Item 2</Text>
  </GridItem>
</Grid>
```

### Responsive Grid

```typescript
<Grid columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} gap={4}>
  <GridItem colSpan={{ xs: 1, md: 2 }}>
    <Text>Responsive item</Text>
  </GridItem>
  <GridItem colSpan={{ xs: 1, sm: 1, md: 2 }}>
    <Text>Another item</Text>
  </GridItem>
</Grid>
```

### Advanced Layout

```typescript
<Grid 
  columns={3} 
  gap={4}
  templateAreas={['header header header', 'sidebar main main']}
>
  <GridItem area="header" justifySelf="center">
    <Text>Header</Text>
  </GridItem>
  <GridItem area="sidebar" alignSelf="start">
    <Text>Sidebar</Text>
  </GridItem>
  <GridItem area="main" justifySelf="stretch">
    <Text>Main Content</Text>
  </GridItem>
</Grid>
```

## API Reference

### Grid Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `number \| ResponsiveValue<number>` | `1` | Number of columns or responsive object |
| `rows` | `GridTrack` | - | Number of rows or row definition |
| `gap` | `SpacingValue` | - | Gap between all items |
| `gapX` | `SpacingValue` | - | Horizontal gap only |
| `gapY` | `SpacingValue` | - | Vertical gap only |
| `templateAreas` | `string[]` | - | Grid template areas |
| `autoFlow` | `GridAutoFlow` | `'row'` | Auto placement algorithm |
| `autoColumns` | `GridTrack` | - | Auto column sizing |
| `autoRows` | `GridTrack` | - | Auto row sizing |

### GridItem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `area` | `string` | - | Grid area name |
| `colSpan` | `GridSpan` | `1` | Column span (number or responsive) |
| `rowSpan` | `GridSpan` | `1` | Row span (number or responsive) |
| `justifySelf` | `GridItemJustify \| ResponsiveValue<GridItemJustify>` | - | Horizontal alignment |
| `alignSelf` | `GridItemAlign \| ResponsiveValue<GridItemAlign>` | - | Vertical alignment |
| `order` | `number \| ResponsiveValue<number>` | - | Visual order |

### Legacy Props (Backward Compatible)

| Prop | Type | Description |
|------|------|-------------|
| `colStart`, `colEnd` | `number \| string` | Column positioning |
| `rowStart`, `rowEnd` | `number \| string` | Row positioning |

## Type Definitions

### ResponsiveValue<T>

```typescript
type ResponsiveValue<T> = T | {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
};
```

### Breakpoint System

```typescript
type Breakpoint = 'xs' | 'sm' | 'md' | 'lg';

const breakpoints = {
  xs: 0,    // Small phones
  sm: 380,  // Large phones
  md: 768,  // Tablets
  lg: 1024  // Large tablets
};
```

## Mobile Optimization

### Performance Features
- **Memoized Calculations**: Efficient re-renders
- **Smart Context**: Minimal prop drilling
- **Native Styles**: Platform-optimized rendering
- **Responsive Caching**: Breakpoint value caching

### Touch Interactions
- **Proper Hit Boxes**: Minimum touch targets
- **Smooth Animations**: 60fps transitions
- **Orientation Support**: Auto-rotate layouts
- **Accessibility**: Screen reader friendly

## Examples

### Dashboard Layout

```typescript
<Grid columns={{ xs: 1, md: 4 }} gap={4}>
  <GridItem colSpan={{ xs: 1, md: 4 }} area="header">
    <Header />
  </GridItem>
  <GridItem colSpan={{ xs: 1, md: 1 }} area="sidebar">
    <Sidebar />
  </GridItem>
  <GridItem colSpan={{ xs: 1, md: 3 }} area="main">
    <MainContent />
  </GridItem>
</Grid>
```

### Photo Gallery

```typescript
<Grid columns={{ xs: 2, sm: 3, md: 4 }} gap={2}>
  {photos.map((photo) => (
    <GridItem key={photo.id}>
      <Image source={photo.uri} style={{ width: '100%', aspectRatio: 1 }} />
    </GridItem>
  ))}
</Grid>
```

### Form Layout

```typescript
<Grid columns={1} gap={4}>
  <GridItem>
    <TextField label="Name" />
  </GridItem>
  <GridItem>
    <TextField label="Email" />
  </GridItem>
  <GridItem colSpan={2}>
    <Button onPress={handleSubmit}>Submit</Button>
  </GridItem>
</Grid>
```

## Best Practices

### Mobile First
1. **Start with `xs: 1`** for single column on phones
2. **Progressively enhance** for larger screens
3. **Test on real devices** for touch interactions
4. **Consider orientation** changes in layouts

### Performance
1. **Use GridItem** for complex positioning
2. **Avoid deeply nested** grid structures
3. **Memoize expensive** calculations
4. **Test with large** datasets

### Accessibility
1. **Use semantic areas** with descriptive names
2. **Provide proper labels** for grid regions
3. **Maintain logical order** with `order` prop
4. **Test with screen readers**

## Migration from Basic Grid

### Before
```typescript
<Grid columns={3} gap={4}>
  <View style={{ width: '66%' }}>
    <Text>Wide item</Text>
  </View>
  <View>
    <Text>Normal item</Text>
  </View>
  <View>
    <Text>Normal item</Text>
  </View>
</Grid>
```

### After
```typescript
<Grid columns={{ xs: 1, sm: 2, md: 3 }} gap={4}>
  <GridItem colSpan={{ xs: 1, md: 2 }}>
    <Text>Wide item</Text>
  </GridItem>
  <GridItem>
    <Text>Normal item</Text>
  </GridItem>
  <GridItem>
    <Text>Normal item</Text>
  </GridItem>
</Grid>
```

## Troubleshooting

### Common Issues

**Grid items not aligning properly**
- Check `gap` values match between Grid and GridItem
- Ensure responsive breakpoints are correctly set
- Verify area names match templateAreas

**Performance issues on mobile**
- Reduce complex nested layouts
- Use `colSpan` instead of manual width calculations
- Enable React DevTools profiler

**Responsive not working**
- Verify screen width breakpoints
- Check ResponsiveValue object structure
- Test with device rotation

### Debug Tools

```typescript
// Enable debug mode
import { useGridContext } from '@/components/ui/layout';

function DebugInfo() {
  const { currentBreakpoint, screenWidth, columns } = useGridContext();
  
  return (
    <View>
      <Text>Breakpoint: {currentBreakpoint}</Text>
      <Text>Screen: {screenWidth}px</Text>
      <Text>Columns: {columns}</Text>
    </View>
  );
}
```

## Advanced Usage

### Custom Breakpoints

```typescript
import { MOBILE_BREAKPOINTS } from '@/components/ui/layout/utils';

// Override for your design system
const customBreakpoints = {
  ...MOBILE_BREAKPOINTS,
  custom: 1200, // Custom breakpoint
};
```

### Dynamic Grids

```typescript
function DynamicGrid({ itemCount }: { itemCount: number }) {
  const columns = useMemo(() => ({
    xs: 1,
    sm: Math.min(2, itemCount),
    md: Math.min(3, itemCount),
    lg: Math.min(4, itemCount)
  }), [itemCount]);

  return (
    <Grid columns={columns} gap={4}>
      {Array.from({ length: itemCount }, (_, i) => (
        <GridItem key={i}>
          <Text>Item {i + 1}</Text>
        </GridItem>
      ))}
    </Grid>
  );
}
```

---

This Grid system provides a complete, mobile-first solution for complex layouts while maintaining the familiar Radix UI developer experience.
