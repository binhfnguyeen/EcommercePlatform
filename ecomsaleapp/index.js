import { registerRootComponent } from 'expo';
import Register from './components/User/Register';

import App from './App';
import Login from './components/User/Login';
import Profile from './components/User/Profile';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
