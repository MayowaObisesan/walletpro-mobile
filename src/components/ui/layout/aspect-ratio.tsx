import React, { useMemo, useState, useEffect } from 'react';
import { View, LayoutChangeEvent } from 'react-native';
import { cn } from '@/src/lib/utils';
import type { AspectRatioProps } from './types';
import { 
  getAspectRatioStyle,
  combineClasses,
  filterPlatformProps,
  generateTestID
} from './utils';
import { Box } from './box';

/**
 * AspectRatio - A component for maintaining aspect ratios
 * 
 * Maintains a consistent aspect ratio for its content regardless of
 * screen size or container dimensions. Perfect for images, videos,
 * or any content that needs to maintain proportions.
 * 
 * @example
 * <AspectRatio ratio={16/9}>
 *   <Image source={{ uri: 'https://example.com/image.jpg' }} className="w-full h-full" />
 * </AspectRatio>
 * 
 * @example
 * <AspectRatio ratio="1/1" className="bg-muted">
 *   <Center>
 *     <Text>Square content</Text>
 *   </Center>
 * </AspectRatio>
 * 
 * @example
 * <AspectRatio ratio={4/3}>
 *   <Text>4:3 aspect ratio content</Text>
 * </AspectRatio>
 */
export const AspectRatio = React.forwardRef<React.ElementRef<typeof View>, AspectRatioProps>(
  ({ 
    className,
    style,
    children,
    testID,
    accessibilityLabel,
    accessibilityHint,
    accessibilityRole,
    webOnly,
    nativeOnly,
    // AspectRatio specific props
    ratio = 1,
    maintain = true,
    ...props
  }, ref) => {
    
    // State to track container dimensions
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [containerLayout, setContainerLayout] = useState({ width: 0, height: 0 });
    
    // Calculate aspect ratio value
    const aspectRatioValue = useMemo(() => {
      if (typeof ratio === 'number') {
        return ratio;
      }
      
      if (typeof ratio === 'string') {
        // Parse string ratio like "16/9" or "4:3"
        const parts = ratio.split(/[\/:]/);
        if (parts.length === 2) {
          const numerator = parseFloat(parts[0]);
          const denominator = parseFloat(parts[1]);
          if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
            return numerator / denominator;
          }
        }
      }
      
      return 1; // Default to 1:1
    }, [ratio]);
    
    // Calculate dimensions based on aspect ratio
    useEffect(() => {
      if (maintain && containerLayout.width > 0) {
        const newHeight = containerLayout.width / aspectRatioValue;
        const newWidth = containerLayout.height * aspectRatioValue;
        
        // Use whichever dimension is constrained
        if (containerLayout.width > 0) {
          setDimensions({ 
            width: containerLayout.width, 
            height: newHeight 
          });
        } else if (containerLayout.height > 0) {
          setDimensions({ 
            width: newWidth, 
            height: containerLayout.height 
          });
        }
      }
    }, [containerLayout, aspectRatioValue, maintain]);
    
    // Handle container layout changes
    const handleLayout = (event: LayoutChangeEvent) => {
      const { width, height } = event.nativeEvent.layout;
      setContainerLayout({ width, height });
    };
    
    // Generate aspect ratio style for web
    const aspectRatioStyle = useMemo(() => {
      if (!maintain) return {};
      return getAspectRatioStyle(aspectRatioValue.toString());
    }, [aspectRatioValue, maintain]);
    
    // Generate container classes
    const containerClasses = useMemo(() => {
      const classes = [];
      
      if (maintain) {
        classes.push('relative');
        classes.push('w-full');
      } else {
        classes.push('flex');
      }
      
      return classes.join(' ');
    }, [maintain]);
    
    // Generate content wrapper classes
    const contentClasses = useMemo(() => {
      const classes = [];
      
      if (maintain) {
        classes.push('absolute');
        classes.push('inset-0');
        classes.push('overflow-hidden');
      } else {
        classes.push('flex-1');
      }
      
      return classes.join(' ');
    }, [maintain]);
    
    // Generate content styles
    const contentStyle = useMemo(() => {
      const styleObj: any = {};
      
      if (maintain && dimensions.width > 0 && dimensions.height > 0) {
        styleObj.width = dimensions.width;
        styleObj.height = dimensions.height;
      }
      
      return styleObj;
    }, [maintain, dimensions]);
    
    // Combine all classes
    const containerClassName = useMemo(() => {
      return combineClasses(containerClasses, className);
    }, [containerClasses, className]);
    
    // Filter platform-specific props
    const filteredProps = useMemo(() => {
      return filterPlatformProps({
        testID: generateTestID('AspectRatio', { testID }),
        accessibilityLabel,
        accessibilityHint,
        accessibilityRole,
        webOnly,
        nativeOnly,
        onLayout: maintain ? handleLayout : undefined,
        ...props
      });
    }, [testID, accessibilityLabel, accessibilityHint, accessibilityRole, webOnly, nativeOnly, maintain, handleLayout, props]);
    
    return (
      <Box
        ref={ref}
        className={cn(containerClassName)}
        style={[aspectRatioStyle, style]}
        {...filteredProps}
      >
        {maintain ? (
          <Box 
            className={contentClasses}
            style={contentStyle}
          >
            {children}
          </Box>
        ) : (
          children
        )}
      </Box>
    );
  }
);

AspectRatio.displayName = 'AspectRatio';

/**
 * Square - A 1:1 aspect ratio component
 * 
 * Convenient wrapper around AspectRatio with 1:1 ratio.
 * Perfect for avatar containers, square images, etc.
 * 
 * @example
 * <Square className="bg-muted">
 *   <Center>
 *     <Text>Square content</Text>
 *   </Center>
 * </Square>
 */
export const Square = React.forwardRef<React.ElementRef<typeof View>, Omit<AspectRatioProps, 'ratio'>>(
  ({ ...props }, ref) => {
    return <AspectRatio ref={ref} ratio={1} {...props} />;
  }
);

Square.displayName = 'Square';

/**
 * VideoRatio - A 16:9 aspect ratio component
 * 
 * Convenient wrapper around AspectRatio with 16:9 ratio.
 * Perfect for video content.
 * 
 * @example
 * <VideoRatio>
 *   <Video source={{ uri: 'https://example.com/video.mp4' }} className="w-full h-full" />
 * </VideoRatio>
 */
export const VideoRatio = React.forwardRef<React.ElementRef<typeof View>, Omit<AspectRatioProps, 'ratio'>>(
  ({ ...props }, ref) => {
    return <AspectRatio ref={ref} ratio={16/9} {...props} />;
  }
);

VideoRatio.displayName = 'VideoRatio';

/**
 * PhotoRatio - A 4:3 aspect ratio component
 * 
 * Convenient wrapper around AspectRatio with 4:3 ratio.
 * Perfect for standard photos.
 * 
 * @example
 * <PhotoRatio>
 *   <Image source={{ uri: 'https://example.com/photo.jpg' }} className="w-full h-full" />
 * </PhotoRatio>
 */
export const PhotoRatio = React.forwardRef<React.ElementRef<typeof View>, Omit<AspectRatioProps, 'ratio'>>(
  ({ ...props }, ref) => {
    return <AspectRatio ref={ref} ratio={4/3} {...props} />;
  }
);

PhotoRatio.displayName = 'PhotoRatio';

/**
 * WidescreenRatio - A 21:9 aspect ratio component
 * 
 * Convenient wrapper around AspectRatio with 21:9 ratio.
 * Perfect for widescreen content.
 * 
 * @example
 * <WidescreenRatio>
 *   <Image source={{ uri: 'https://example.com/wide.jpg' }} className="w-full h-full" />
 * </WidescreenRatio>
 */
export const WidescreenRatio = React.forwardRef<React.ElementRef<typeof View>, Omit<AspectRatioProps, 'ratio'>>(
  ({ ...props }, ref) => {
    return <AspectRatio ref={ref} ratio={21/9} {...props} />;
  }
);

WidescreenRatio.displayName = 'WidescreenRatio';
