import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';

// Mock authentication state - replace with actual auth logic
let isAuthenticated = false;

export const setAuthenticated = (value) => {
  isAuthenticated = value;
};

export default function RootNavigator() {
  return (
    <NavigationContainer>
      {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}