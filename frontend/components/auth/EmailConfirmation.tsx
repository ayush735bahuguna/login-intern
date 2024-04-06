"use client"
import { MailCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';

export default function Emailconfirmation() {
    const router = useRouter();

    return (
        <div className="flex items-center justify-center flex-col w-3/5 text-center mx-auto min-h-dvh">
            <MailCheck size={'150px'} />
            <p className='font-bold text-xl my-4'>Thank You for Logging In!</p>

            <span className='mb-3'>we sent a email to your email </span>

            <p>Didn&apos;t receive the email? Check your Spam folder, it may have been caught by a filter. If you still don't see it, you can resend the confirmation email.</p>
            <p className='text-sm my-2 text-muted-foreground'>Wrong email address? Change it.</p>

            <Button variant={'secondary'} onClick={() => { router.replace('/') }} className='my-10'>Back to home</Button>
        </div>
    )
}
