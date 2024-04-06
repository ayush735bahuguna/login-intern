"use client"
import React, { useEffect, useState } from 'react'
import img1 from '@/asset/onboarding/1.png'
import img2 from '@/asset/onboarding/2.png'
import img3 from '@/asset/onboarding/3.png'
import { Button } from '@/components/ui/button'
import CheckBoxComponent from '@/components/auth/On Boarding/CheckBoxComponent'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Emailconfirmation from '../EmailConfirmation'
import axios from 'axios'
import { useRouter } from 'next/navigation'


type Data = { image: any, text: string, description: string, role: string }
type props = { setwelcomeScreen: Function, ImageFile: File | undefined, location: string }
type User = { _id: string, email: string }
const Data: Array<Data> = [
    {
        image: img1,
        text: `I'm a desginer looking to share my work`,
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam placeat asperiores facilis repudiandae ab pariatur? Voluptate ',
        role: 'designer'
    },
    {
        image: img2,
        text: `I'm looking to hire a desginer`,
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam placeat asperiores facilis repudiandae ab pariatur? Voluptate ',
        role: 'hiring manager'
    },
    {
        image: img3,
        text: `I'm looking for desgin inspiration`,
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam placeat asperiores facilis repudiandae ab pariatur? Voluptate ',
        role: 'user'
    },
];



export default function RoleInfo({ setwelcomeScreen, ImageFile, location }: props) {
    const router = useRouter();
    const [selectedRoles, setselectedRoles] = useState<Array<string>>([])
    const [isloading, setloading] = useState<boolean>(false);
    const [emailConfermationPage, setemailConfermationPage] = useState<boolean>(false);


    const [user, setuser] = useState<User | undefined>();
    useEffect(() => {
        if (window) {
            const data = localStorage.getItem('userData');
            if (data) {
                const userData = JSON.parse(data)
                setuser(userData);
            }
        }
    }, [])


    async function SubmitHandler() {
        try {
            setloading(true)
            if (user) {
                var url = ImageFile ? 'https://login-intern.onrender.com/api/user/updatePic' : "https://login-intern.onrender.com/api/user/updateDetails"

                const { data } = await axios.put(url, { image: ImageFile || 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg', userId: user?._id, location: location, role: selectedRoles }, ImageFile && { headers: { "Content-Type": "multipart/form-data" } })

                localStorage.setItem('userData', JSON.stringify(data.data));
                await axios.post('https://login-intern.onrender.com/api/sendEmail', { userEmail: user?.email });

                setemailConfermationPage(true);
                setloading(false)
            } else {
                router.push('/auth');
            }
        } catch (error) {
            console.log(error);
            setloading(false)
        }
    }
    return (
        <>
            {emailConfermationPage ? <Emailconfirmation /> :
                <div className='flex flex-col items-center justify-center min-h-dvh max-md:mx-5'>

                    <div onClick={() => { setwelcomeScreen(false) }} className='w-[40px] h-[40px] rounded-md bg-muted flex hover:bg-slate-300 cursor-pointer justify-center items-center absolute top-3 left-3 '><ArrowLeft /></div>

                    <div className='text-4xl mb-1 mt-10 text-center max-md:mt-16'>What brings you to <span className='text-sky-600'>gitInit</span></div>
                    <div className='md:mb-[100px] text-muted-foreground text-center max-md:mb-5'>Select the option that describe you, Don`&apos;t worry, you can explore other options later</div>

                    <div className="flex gap-6 flex-wrap items-center justify-center">
                        {Data?.map((e, i) => {
                            return <CheckBoxComponent key={i} text={e.text} image={e.image} description={e.description} role={e.role} selectedRoles={selectedRoles} setselectedRoles={setselectedRoles} />
                        })}
                    </div>
                    <p className={`${!(selectedRoles.length > 0) && 'invisible'} text-sm mt-10 mb-2`}>Anything else? You can select multiple</p>
                    <Button disabled={!(selectedRoles.length > 0) || isloading} className={`px-24 mb-10`}
                        onClick={SubmitHandler}
                    >
                        {isloading && <Loader2 className='animate-spin me-2' />}Finish</Button>
                </div>
            }
        </>
    )
}
