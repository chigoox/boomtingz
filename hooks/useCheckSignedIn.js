import { auth } from '@/firebaseConfig';
import { router } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';

const useCheckSignedIn = () => {
    const [user, setUser] = useState()
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user)
            } else {
                router.push('/signUp')
                setUser('No User Signed In')
            }
        });
    }, [])
    return user

}

export default useCheckSignedIn