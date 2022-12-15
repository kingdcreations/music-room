import { createContext } from 'react';
import Firebase from '../components/Firebase';

const FirebaseContext = createContext<Firebase | null>(null)

export { FirebaseContext }

export default function FirebaseProvider({ children }: { children: JSX.Element }) {

    return (
        <FirebaseContext.Provider value={new Firebase()}>
            {children}
        </FirebaseContext.Provider>
    );
}