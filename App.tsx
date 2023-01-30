import FirebaseProvider from './src/providers/FirebaseProvider';
import Navigation from './src/navigation';
import { extendTheme, NativeBaseProvider } from 'native-base';
import AudioProvider from './src/providers/AudioProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
  },
});

export default function App() {
  return (
    <FirebaseProvider>
      <NativeBaseProvider theme={theme}>
        <AudioProvider>
          <SafeAreaProvider>
            <Navigation />
          </SafeAreaProvider>
        </AudioProvider>
      </NativeBaseProvider>
    </FirebaseProvider>
  );
}