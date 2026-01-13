import * as NavigationBar from 'expo-navigation-bar';
import { Platform } from 'react-native';
import {DARK_THEME, LIGHT_THEME} from "@src/lib/theme";

export async function setAndroidNavigationBar(theme: 'light' | 'dark') {
  if (Platform.OS !== 'android') return;
  await NavigationBar.setButtonStyleAsync(theme === 'dark' ? 'light' : 'dark');
  await NavigationBar.setBackgroundColorAsync(
    theme === 'dark' ? DARK_THEME.colors.background : LIGHT_THEME.colors.background
  );
}
