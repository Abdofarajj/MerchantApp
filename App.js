import { AppRegistry } from 'react-native';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return <RootNavigator />;
}

AppRegistry.registerComponent('main', () => App);