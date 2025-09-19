import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
const firebaseConfig = {
    apiKey: "AIzaSyBAq-VpKLw4SMozXdnh37LKNPzmMgvlCq4",
    authDomain: "social-ccecb.firebaseapp.com",
    projectId: "social-ccecb",
    storageBucket: "social-ccecb.firebasestorage.app",
    messagingSenderId: "265226682952",
    appId: "1:265226682952:web:54f11a981f9c96328a8e7d"
}
const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider()

export default app
