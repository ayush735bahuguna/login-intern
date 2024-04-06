"use client"
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


type User = {
  name: string,
  email: string,
  pic: string,
}

export default function page() {
  const router = useRouter();
  const [user, setuser] = useState<User | undefined>();


  useEffect(() => {
    if (window) {
      const data = localStorage.getItem('userData');
      if (data === null) { router.push('/auth') }
      if (data) {
        const userData = JSON.parse(data)
        setuser(userData);
        !userData.onBoarding && router.push('/auth/onboarding')
      }
    }
  }, [])


  const LogOutHandler = (): void => {
    localStorage.removeItem('userData');
    router.push('/auth');
  }

  return (
    <div className="flex items-center justify-center flex-col p-10">
      {user ? <div className="flex items-center justify-center flex-col gap-2">
        {user.pic && <Image src={user.pic} width={100} height={100} className="rounded-full" alt="" />}
        <p>Name : {user.name}</p>
        <p>User E-mail : {user.email}</p>
        <Button variant={'destructive'} className="m-10" onClick={LogOutHandler}>Log out</Button>
      </div> : <div className="text-4xl text-red-500">No user logged in</div>}
    </div>
  )
}
