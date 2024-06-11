
import { checkCurrentUser, fetchDocument, updateDocumentCollection } from '@/constants/Utils'
import { onAuthStateChanged } from 'firebase/auth'
import { useEffect, useState } from 'react'


function useAUTHListener(add = false, set, protectedPage) {
    const [user, setUser] = useState({})
    const auth = checkCurrentUser()

    // const GID = useGuest()

    /*     useEffect(() => {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    if (set) set(user)
                    // if (add) addUIDToList(user.uid)
                    // if (add) addEmailToList(user.email)
                    setUser(user)
                    fetchDocument('User', user.uid).then((userDATA) => {
                        setTimeout(async () => {
                            if (!userDATA.ACCOUNTSTATUS)
                                await updateDocumentCollection('User', user.uid, 'ACCOUNTSTATUS', 'USER')
                        }, 5000);
    
    
    
                    }).catch((e) => {
                        console.log(e.message)
    
                    })
    
    
                } else {
                    // User is signed out
                    if (set) set()
                    //if (protectedPage) //push('/')
                    //initNoUser()
                    fetchDocument('User', GID).then((userDATA) => {
                        if (userDATA?.ShippingInfo?.email) {
                            setUser({ gid: GID, email: userDATA?.ShippingInfo?.email })
                        } else {
                            setUser({ gid: GID })
                        }
    
    
    
    
                    }).catch((e) => {
                        setUser({ gid: GID })
    
                    }) 
  
  
  }
          });
      }, [])  */
    return user

}

export default useAUTHListener
