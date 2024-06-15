import { auth } from '@/firebaseConfig';
import { router } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';

const useCheckSignedIn = (protect) => {
    const [user, setUser] = useState()
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user)
            } else {
                if (protect) router.push('/signUp')
                setUser('No User Signed In')
            }
        });
    }, [])
    return user

}

export default useCheckSignedIn