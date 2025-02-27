// components/Header.tsx
"use client"
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function Header() {
  const { theme, setTheme } = useTheme()
  const { data: session } = useSession()
  const [mounted, setMounted] = useState(false)

  // Ensures theme is only rendered on the client
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <header >
      {/* <div className="flex items-center space-x-4">
        <Link href="/">
          <span className="text-xl font-bold cursor-pointer">MyApp</span>
        </Link>
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div> */}
      {/* <div>
        {session ? (
          <div className="flex items-center space-x-4">
            <span>Welcome, {session.user?.name}</span>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Sign out
            </button>
          </div>
        ) : (
          <button
            onClick={() => signIn('google')}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Sign in with Google
          </button>
        )}
      </div> */}
    </header>
  )
}
