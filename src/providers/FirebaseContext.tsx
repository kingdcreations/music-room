import { createContext } from 'react';
import Firebase from '../components/Firebase';

const firebase = new Firebase()
const FirebaseContext = createContext(firebase)

export { FirebaseContext }

export default function FirebaseProvider({ children }: { children: JSX.Element }) {

    return (
        <FirebaseContext.Provider value={firebase}>
            {children}
        </FirebaseContext.Provider>
    );
}