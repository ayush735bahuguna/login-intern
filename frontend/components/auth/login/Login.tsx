"use client"
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

export default function Login() {
    const [error, seterror] = useState<string | undefined>(undefined);
    const [Email, setEmail] = useState<string>('');
    const [Password, setPassword] = useState<string>('');
    const [checkbox, setcheckbox] = useState<boolean>(false);
    const [isloading, setisloading] = useState<boolean>(false);
    const router = useRouter();

    const formSubmithandler = async (e: React.FormEvent) => {
        e.preventDefault()

        if (Password.length > 5) {
            setisloading(true);
            try {
                const { data } = await axios.post('https://login-intern.onrender.com/api/user/login', { email: Email, password: Password })
                data && localStorage.setItem("userData", JSON.stringify(data));
                data?.onBoarding ? router.push('/') : router.push('/auth/onboarding');
            } catch (error) {
                seterror(error?.response?.data?.message);
                setTimeout(() => {
                    seterror(undefined);
                }, 5000)
            }
            setisloading(false);
        } else {
            seterror('Password length must greater than 6 or equal');
            setTimeout(() => {
                seterror(undefined);
            }, 5000)
            setisloading(false);
        }
    }

    return (
        <form onSubmit={(e) => {
            formSubmithandler(e)
        }} className='flex flex-col md:px-10 py-3 gap-3 mt-10'>

            <div className='text-4xl mb-6'>log in to <span className='text-sky-600'>gitInit</span> </div>
            {error && <li className='text-red-600 '>{error}</li>}

            <span className='flex gap-3 flex-col items-start'>
                <label htmlFor='EmailInput'>Email</label>
                <Input required={true} id='EmailInput' type='email' placeholder='example@gmail.com' value={Email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEmail(e.target.value) }}
                />
            </span>

            <span className='flex gap-3 flex-col items-start'>
                <label htmlFor='PasswordInput'>Password</label>
                <Input required={true} id='PasswordInput' type='password' placeholder='6+ character' value={Password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setPassword(e.target.value) }}
                />
            </span>

            <span className='flex gap-3 items-center max-md:py-5 md:pt-3'>
                <Checkbox id='checkboxInput' defaultChecked={checkbox} onCheckedChange={(e: boolean) => { setcheckbox(e) }} />
                <label htmlFor='checkboxInput' className='text-sm'>by logging in means you are OK with our terms of service, private policy, and our default notification settings.</label>
            </span>

            <Button variant={'default'} disabled={!checkbox || isloading} type='submit' className='md:w-1/2  max-md:w-full disabled:cursor-not-allowed'>  {isloading && <Loader2 className='animate-spin me-2' />} log in</Button>
        </form>
    )
}
