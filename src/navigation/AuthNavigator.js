import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';

// Placeholder signup screen - replace with actual signup screen
const SignupScreen = () => null;

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Merchant App' }}
      />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{ title: 'Sign Up' }}
      />
    </Stack.Navigator>
  );
}