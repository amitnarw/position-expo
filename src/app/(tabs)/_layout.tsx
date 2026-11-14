import { TopTabs } from 'expo-router/js-top-tabs';

import { TabBar } from '@/components/nav/tab-bar';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * Home and Settings are pages of a swipeable pager, so a horizontal drag moves
 * between them. The bar sits at the bottom and is fed the pager's position.
 */
export default function TabsLayout() {
  const { colors } = useTheme();

  return (
    <TopTabs
      tabBarPosition="bottom"
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        swipeEnabled: true,
        animationEnabled: true,
        lazy: false,
        sceneStyle: { backgroundColor: colors.paper },
      }}>
      <TopTabs.Screen name="home" options={{ title: 'Home' }} />
      <TopTabs.Screen name="settings" options={{ title: 'Settings' }} />
    </TopTabs>
  );
}
