import FirebaseProvider from './src/providers/FirebaseContext';
import Navigation from './src/navigation';
import { NativeBaseProvider } from 'native-base';

export default function App() {
  return (
    <FirebaseProvider>
      <NativeBaseProvider>
        <Navigation />
      </NativeBaseProvider>
    </FirebaseProvider>
  );
}