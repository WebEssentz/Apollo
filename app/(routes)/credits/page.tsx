"use client"
import { useAuthContext } from '@/app/provider'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'

function Credits() {
    const { user } = useAuthContext();
    const [userData, setUserData] = useState<any>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        user && GetUserCredits();
    }, [user])

    const GetUserCredits = async () => {
        try {
            setIsLoading(true);
            const result = await axios.get('/api/user?email=' + user?.email);
            setUserData(result.data);
        } catch (error) {
            console.error('Error fetching credits:', error);
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary/60" />
                <p className="mt-2 text-sm text-muted-foreground">Loading credits...</p>
            </div>
        );
    }

    return (
        <div>
            <h2 className='font-bold text-2xl'>Credits</h2>

            <div className='p-5 bg-slate-50 rounded-xl border flex justify-between items-center mt-6'>
                <div>
                    <h2 className='font-bold text-xl'>My Credits:</h2>
                    {userData?.credits && <p className='text-lg text-gray-500'>{userData?.credits} Credits left</p>}
                </div>
                <Button>Buy More Credits</Button>
            </div>
        </div>
    )
}

export default Credits