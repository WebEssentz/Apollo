"use client"
import { auth } from '@/configs/firebaseConfig';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import React, { useState } from 'react'
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

function Authentication({ children }: any) {
    const [isLoading, setIsLoading] = useState(false);
    const provider = new GoogleAuthProvider();

    const onButtonPress = async () => {
        try {
            setIsLoading(true);
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            toast.success('Successfully signed in!');
        } catch (error: any) {
            console.error('Auth error:', error);
            toast.error(error.message || 'Failed to sign in');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            <div 
                onClick={onButtonPress}
                className={`relative ${isLoading ? 'cursor-wait' : 'cursor-pointer'}`}
            >
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-lg">
                        <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                )}
                {children}
            </div>
        </div>
    )
}

export default Authentication