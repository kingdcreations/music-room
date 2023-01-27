import FirebaseProvider from './src/providers/FirebaseProvider';
import Navigation from './src/navigation';
import { extendTheme, NativeBaseProvider } from 'native-base';
import AudioProvider from './src/providers/AudioProvider';

const theme = extendTheme({
  useSystemColorMode: false,
  initialColorMode: 'dark',
})

export default function App() {
  return (
    <FirebaseProvider>
      <NativeBaseProvider theme={theme}>
        <AudioProvider>
          <Navigation />
        </AudioProvider>
      </NativeBaseProvider>
    </FirebaseProvider>
  );
}