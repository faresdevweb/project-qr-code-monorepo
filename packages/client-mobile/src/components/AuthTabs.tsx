import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from '../screen/Auth/LoginScreen';

const Tabs = createBottomTabNavigator();

const AuthTabs = () => {
  return (
    <Tabs.Navigator>
      <Tabs.Screen name="Log In" component={LoginScreen} />
    </Tabs.Navigator>
  );
};

export default AuthTabs;
