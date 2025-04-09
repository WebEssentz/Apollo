"use client"
import { auth } from '@/configs/firebaseConfig';
import { GoogleAuthProvider, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { useEffect } from 'react';
import { toast } from 'sonner';

function Authentication({ children }: any) {
    const provider = new GoogleAuthProvider();

    useEffect(() => {
        // Handle redirect result
        getRedirectResult(auth)
            .then((result) => {
                if (result) {
                    const user = result.user;
                    console.log('Signed in user:', user);
                    toast.success('Successfully signed in!');
                }
            })
            .catch((error) => {
                console.error('Auth Error:', error);
                toast.error('Sign in failed. Please try again.');
            });
    }, []);

    const onButtonPress = () => {
        signInWithRedirect(auth, provider)
            .catch((error) => {
                console.error('Auth Error:', error);
                toast.error('Sign in failed. Please try again.');
            });
    }

    return (
        <div>
            <div onClick={onButtonPress}>
                {children}
            </div>
        </div>
    )
}

export default Authentication