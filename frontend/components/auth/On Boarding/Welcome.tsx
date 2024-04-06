"use client"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import { Camera, Loader2, X } from 'lucide-react';
import React, { useEffect, useState } from 'react'

type Data = {
    setwelcomeScreen: Function, setImageFile: Function, setlocation: Function, location: string
}

export default function Welcome({ setwelcomeScreen, setImageFile, setlocation, location }: Data) {

    const [file, setfile] = useState();
    const [fileUrl, setfileUrl] = useState<string | undefined>(undefined);

    const ImageHandler = async (img: File) => {
        setfile(img);
        var reader: FileReader = new FileReader();
        reader.onload = function () {
            setfileUrl(reader.result);
        };
        reader.readAsDataURL(img);
    }

    const SubmitHandler = async () => {
        setImageFile(file);
        setwelcomeScreen(true)
    }

    return (
        <div className='px-5 pt-10 max-md:w-full mx-auto md:w-1/2'>

            <div className='text-4xl mb-2'>Welcome! Let's create your profile</div>
            <div className='text-muted-foreground pb-10'>Let others get to know you better! You can do these later</div>

            <div className='font-bold mb-5'>Add an avatar</div>

            <div className='flex gap-5 mb-10'>

                <div className="cursor-pointer w-[150px] m-4">

                    {!file ?
                        <label htmlFor='imageInput'>
                            <div className="w-[140px] h-[140px] rounded-full flex items-center justify-center bg-muted text-muted-foreground">
                                <Camera />
                            </div>
                        </label>
                        :
                        <div className="flex items-center justify-center" style={{ width: '100%', height: '100%', borderRadius: '10px', position: 'relative' }}>

                            <Button variant={'outline'} style={{ width: 'fit-content', position: 'absolute', top: '0px', right: '0px' }} className="bg-accent rounded-full p-2 shadow-3xl" onClick={() => { setfile(null) }}>
                                <X />
                            </Button>

                            <img
                                src={fileUrl}
                                alt=' '
                                className="w-[140px] h-[140px] rounded-full object-cover"
                            />
                        </div>
                    }
                </div>



                <Input type='file' id='imageInput' className='hidden' onChange={(e: React.ChangeEvent<HTMLInputElement>) => { ImageHandler(e?.target?.files[0]) }} />


                <div className="flex flex-col w-fit pb-6 items-start justify-center">
                    <label htmlFor='imageInput'>
                        <div className="border-solid border-2 border-muted cursor-pointer px-4 py-2 rounded-lg  text-center hover:bg-muted">
                            Choose Image
                        </div>
                    </label>
                    <p className='text-sm text-muted-foreground py-2'>  &gt; Or Choose one of our defaults</p>
                </div>
            </div>

            <label htmlFor='locationInput' className='font-bold'>Enter your location</label>

            <Input type='text' id='locationInput' placeholder='Enter a location' className='mt-6' value={location} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setlocation(e?.target?.value) }} />

            <Button variant={'default'} disabled={!location?.length > 0} onClick={SubmitHandler} className='px-6 my-7'>  Next</Button>

        </div>
    )
}
