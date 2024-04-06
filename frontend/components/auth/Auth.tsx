"use client"
import React, { useEffect, useState } from 'react'
import SignUp from './signup/SignUp';
import Image from 'next/image';
import loginImage from '@/asset/login.png'
import Login from './login/Login';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';

export default function Auth() {
    const [signUp, setsignUp] = useState<boolean>();
    const router = useRouter();
    useEffect(() => {
        if (window) {
            const data = localStorage.getItem('userData');
            if (data !== null) {
                router.push('/')
            }
        }
    }, [])
    return (
        <div className='flex md:flex-row max-md:flex-col h-dvh'>

            <div className="max-md:hidden bg-[#f3d284]">
                <Image src={loginImage} alt='' className='max-w-[430px] min-h-[600px] h-full object-contain' />
            </div>

            <div className="max-md:w-full h-dvh flex flex-col justify-around overflow-x-hidden overflow-y-scroll">
                <div className="flex justify-end p-5">
                    <Button variant={'outline'} onClick={() => { setsignUp(!signUp) }}>{signUp ? 'Sign up' : 'log in'}</Button>
                </div>
                <div className="lg:w-2/3 max-md:px-5 mx-auto">
                    {!signUp ? <SignUp /> : <Login />}
                </div>
                <div />
            </div>
        </div>
    )
}
