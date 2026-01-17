import React, { useMemo, Children, isValidElement, cloneElement } from 'react';
import { View } from 'react-native';
import { cn } from '@/src/lib/utils';
import type { GridProps } from './types';
import {
  getGapClass,
  getGridStyle,
  combineClasses,
  filterPlatformProps,
  generateTestID,
  spacingToNumber
} from './utils';
import { Box } from './box';

/**
 * Grid - A grid layout component (simulated with flexbox)
 *
 * Since React Native doesn't have native CSS Grid support, this component
 * simulates grid behavior using flexbox. It's perfect for creating responsive
 * grid layouts with consistent spacing.
 *
 * @example
 * <Grid columns={2} gap={4}>
 *   <Card>Item 1</Card>
 *   <Card>Item 2</Card>
 *   <Card>Item 3</Card>
 *   <Card>Item 4</Card>
 * </Grid>
 *
 * @example
 * <Grid columns={[1, 2, 3]} gap={2}>
 *   <Box>Responsive grid</Box>
 *   <Box>Item 2</Box>
 *   <Box>Item 3</Box>
 * </Grid>
 */
export const Grid = React.forwardRef<React.ElementRef<typeof View>, GridProps>(
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
    // Grid specific props
    columns,
    rows,
    gap,
    gapX,
    gapY,
    autoFlow = 'row',
    autoColumns,
    autoRows,
    templateAreas,
    colStart,
    colEnd,
    rowStart,
    rowEnd,
    ...props
  }, ref) => {

    // Generate grid-specific classes
    const gridClasses = useMemo(() => {
      const classes = [];

      // Gap spacing
      const gapClass = getGapClass(gap, gapX, gapY);
      if (gapClass) classes.push(gapClass);

      // Use flex for grid simulation
      classes.push('flex');
      classes.push('flex-row');
      classes.push('flex-wrap');

      return classes.join(' ');
    }, [gap, gapX, gapY]);

    // Calculate grid layout style
    const gridStyle = useMemo(() => {
      const styleObj: any = {};

      // Handle column layout
      if (columns) {
        if (typeof columns === 'number') {
          // For simple column count, we'll handle children wrapping
          styleObj.width = `${100 / columns}%`;
        } else if (Array.isArray(columns)) {
          // Responsive columns - use first breakpoint for now
          // In a full implementation, you'd handle different screen sizes
          const firstColumns = columns[0];
          if (typeof firstColumns === 'number') {
            styleObj.width = `${100 / firstColumns}%`;
          }
        }
      }

      return styleObj;
    }, [columns]);

    // Combine all classes
    const computedClassName = useMemo(() => {
      return combineClasses(gridClasses, className);
    }, [gridClasses, className]);

    // Filter platform-specific props
    const filteredProps = useMemo(() => {
      return filterPlatformProps({
        testID: generateTestID('Grid', { testID }),
        accessibilityLabel,
        accessibilityHint,
        accessibilityRole,
        webOnly,
        nativeOnly,
        ...props
      });
    }, [testID, accessibilityLabel, accessibilityHint, accessibilityRole, webOnly, nativeOnly, props]);

    // Process children to apply grid item styles
    const processedChildren = useMemo(() => {
      if (!columns) return children;

      const columnCount = typeof columns === 'number' ? columns :
        Array.isArray(columns) ? columns[0] : 1;

      return Children.map(children, (child, index) => {
        if (!isValidElement(child)) return child;

        // Apply grid item styles to direct children
        const itemStyle = {
          width: `${100 / columnCount}%`,
          marginBottom: gapY ? spacingToNumber(gapY) * 4 : gap ? spacingToNumber(gap) * 4 : 0,
        };

        // Add right margin for all but last in row
        if ((index + 1) % columnCount !== 0) {
          itemStyle.marginRight = gapX ? spacingToNumber(gapX) * 4 : gap ? spacingToNumber(gap) * 4 : 0;
        }

        return cloneElement(child, {
          style: [child.props.style, itemStyle]
        });
      });
    }, [children, columns, gap, gapX, gapY]);

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
        {processedChildren || children}
      </Box>
    );
  }
);

Grid.displayName = 'Grid';

/**
 * GridItem - Individual grid item component
 *
 * Optional component for more explicit grid item control.
 * Useful when you need to apply grid-specific positioning.
 *
 * @example
 * <Grid columns={2} gap={4}>
 *   <GridItem colStart={1} colEnd={2}>
 *     <Text>Spanning item</Text>
 *   </GridItem>
 *   <GridItem>
 *     <Text>Normal item</Text>
 *   </GridItem>
 * </Grid>
 */
export const GridItem = React.forwardRef<React.ElementRef<typeof View>, GridProps>(
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
    // Grid positioning props
    colStart,
    colEnd,
    rowStart,
    rowEnd,
    ...props
  }, ref) => {

    // Generate grid item-specific styles
    const gridItemStyle = useMemo(() => {
      const itemStyle: any = {};

      // Grid positioning (simulated with flexbox)
      // Note: This is a simplified implementation
      // A full implementation would be more complex

      return itemStyle;
    }, [colStart, colEnd, rowStart, rowEnd]);

    // Filter platform-specific props
    const filteredProps = useMemo(() => {
      return filterPlatformProps({
        testID: generateTestID('GridItem', { testID }),
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
        className={cn(className)}
        style={[gridItemStyle, style]}
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

GridItem.displayName = 'GridItem';
