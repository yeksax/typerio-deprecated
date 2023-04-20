import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useUser } from '@auth0/nextjs-auth0/client'
import Link from 'next/link'
import { useEffect } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  
  const { user, error, isLoading } = useUser()

  return (
    <div className='flex gap-4'>
      {user ? <button className='px-8 py-2 bg-blue-500 rounded mt-4'>
        <Link href="/api/auth/logout">Logout</Link>
      </button> :

        <button className='px-8 py-2 bg-blue-500 rounded mt-4'>
          <Link href="/api/auth/login">Login</Link>
        </button>}
    </div>
  )
}
