"use client"
import RoleInfo from '@/components/auth/On Boarding/RoleInfo';
import Welcome from '@/components/auth/On Boarding/Welcome'
import { useRouter } from 'next/navigation';
import React, { ReactElement, useEffect, useState } from 'react'

export default function Page() {

    const router = useRouter();
    const [welcomeScreen, setwelcomeScreen] = useState<boolean>(false);
    const [ImageFile, setImageFile] = useState<File | undefined>(undefined);
    const [location, setlocation] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (window) {
            const data = localStorage.getItem('userData');
            if (data !== null) {
                const parsedData = JSON.parse(data);
                parsedData.onBoarding ? router.push('/') : router.push('/auth/onboarding')
            } else {
                router.push('/')
            }
        }
    }, [])

    return (
        <>
            {welcomeScreen ? <RoleInfo
                setwelcomeScreen={setwelcomeScreen}
                ImageFile={ImageFile}
                location={location || ''}
            /> :
                <Welcome setImageFile={setImageFile}
                    setwelcomeScreen={setwelcomeScreen}
                    location={location || ""}
                    setlocation={setlocation}
                />
            }
        </>
    )
}
