import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MD3LightTheme, PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import FilmsScreen from './src/screens/FilmsScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';

const Stack = createNativeStackNavigator();

const COLORS = {
  primary: '#1F5FBF',
  background: '#F4F6FA',
  surface: '#FFFFFF',
  text: '#1B1F24',
};

const paperTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: COLORS.primary,
    background: COLORS.background,
    surface: COLORS.surface,
    outline: '#C9CED6',
  },
};

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: COLORS.primary,
    background: COLORS.background,
    card: COLORS.surface,
    text: COLORS.text,
  },
};

export default function App() {
  return (
    <PaperProvider theme={paperTheme}>
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator
          initialRouteName="Films"
          screenOptions={{ headerTintColor: COLORS.primary, headerTitleStyle: { color: COLORS.text } }}
        >
          <Stack.Screen name="Films" component={FilmsScreen} options={{ title: 'Ghibli Explorer' }} />
          <Stack.Screen name="Details" component={DetailsScreen} options={{ title: 'Detalhes do filme' }} />
          <Stack.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'Favoritos' }} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="dark" />
    </PaperProvider>
  );
}
