import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FlashQRScreen from '../screen/Student/FlashQRScreen';
import EDTScreen from '../screen/Student/EDTScreen';
import Profile from '../screen/Student/Profile';

const Tabs = createBottomTabNavigator();

const AppTabs = () => {
  return (
    <Tabs.Navigator>
      <Tabs.Screen name="Flash QR Code" component={FlashQRScreen} />
      <Tabs.Screen name="EDT" component={EDTScreen} />
      <Tabs.Screen name="Profile" component={Profile} />
    </Tabs.Navigator>
  );
};

export default AppTabs;
