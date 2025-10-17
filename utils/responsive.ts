import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;

export enum ScreenSize {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
  XLarge = 'xlarge',
}

export const getScreenSize = (): ScreenSize => {
  if (width < 640) return ScreenSize.Small;
  if (width < 1024) return ScreenSize.Medium;
  if (width < 1440) return ScreenSize.Large;
  return ScreenSize.XLarge;
};

export const isSmallScreen = () => width < 640;
export const isMediumScreen = () => width >= 640 && width < 1024;
export const isLargeScreen = () => width >= 1024 && width < 1440;
export const isXLargeScreen = () => width >= 1440;

export const isWeb = Platform.OS === 'web';
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

export const responsiveValue = <T,>(values: {
  small?: T;
  medium?: T;
  large?: T;
  xlarge?: T;
  default: T;
}): T => {
  const screenSize = getScreenSize();
  
  switch (screenSize) {
    case ScreenSize.Small:
      return values.small ?? values.default;
    case ScreenSize.Medium:
      return values.medium ?? values.default;
    case ScreenSize.Large:
      return values.large ?? values.default;
    case ScreenSize.XLarge:
      return values.xlarge ?? values.default;
    default:
      return values.default;
  }
};

export const scale = (size: number): number => {
  const baseWidth = 375;
  return (width / baseWidth) * size;
};

export const verticalScale = (size: number): number => {
  const baseHeight = 812;
  return (height / baseHeight) * size;
};

export const moderateScale = (size: number, factor: number = 0.5): number => {
  return size + (scale(size) - size) * factor;
};

export const responsiveFontSize = (size: number): number => {
  return responsiveValue({
    small: size,
    medium: size * 1.1,
    large: size * 1.2,
    xlarge: size * 1.3,
    default: size,
  });
};

export const responsivePadding = (padding: number): number => {
  return responsiveValue({
    small: padding,
    medium: padding * 1.2,
    large: padding * 1.5,
    xlarge: padding * 1.8,
    default: padding,
  });
};

export const getMaxContentWidth = (): number => {
  return responsiveValue({
    small: width - 32,
    medium: 600,
    large: 800,
    xlarge: 1000,
    default: width - 32,
  });
};

export const getColumns = (): number => {
  return responsiveValue({
    small: 1,
    medium: 2,
    large: 3,
    xlarge: 4,
    default: 1,
  });
};
