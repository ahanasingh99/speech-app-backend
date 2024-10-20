'use client'
import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'
import React from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function NavBar({ zIndex }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  const handleSignOut = async () => {
    try {
      localStorage.clear();
      await signOut({ redirect: true });
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  return (
    <nav className="flex items-center justify-between bg-pink-300 h-14 text-slate-50 w-full shadow-md" style={{ zIndex }}>
      {/* Logo */}
      <Link href={session ? "/landing" : "/"} className="sm:text-sm md:text-2xl ml-4 text-white font-bold">
        Speak <span className="text-green-400 font-extrabold">Up</span> {/* Bolder Mint Green for Logo */}
      </Link>

      {/* Tabs */}
      <div className="flex justify-center items-center gap-3 mr-4">
        {session ? (
          <>
            <Link
              href={`/feedback?email=${encodeURIComponent(session.user.email)}`}
              className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-green-500 px-4 py-2 text-sm font-semibold text-white hover:bg-green-600 transition duration-300"  // Bolder mint green text
            >
              Speech Feedback
            </Link>

            <button
              onClick={handleSignOut}
              className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-green-500 px-4 py-2 text-sm font-semibold text-white hover:bg-green-600 transition duration-300"  // Bolder green buttons
            >
              Sign out
            </button>
          </>
        ) : (
          <Link
            href="/"
            className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-green-400 px-4 py-2 text-sm font-semibold text-white hover:bg-green-600 transition duration-300"
          >
            Sign in
          </Link>
        )}
      </div>
    </nav>
  )
}