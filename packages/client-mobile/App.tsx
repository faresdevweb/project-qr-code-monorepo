import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';
import { AuthStore } from './store/auth';
import AppTabs from './src/components/AppTabs';
import AuthTabs from './src/components/AuthTabs';

export default function App() {
  const { isAuthenticated } = AuthStore();

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppTabs /> : <AuthTabs />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
