import FirebaseProvider from './src/providers/FirebaseContext';
import Navigation from './src/navigation';

export default function App() {
  return (
    <FirebaseProvider>
        <Navigation />
    </FirebaseProvider>
  );
}