'use client'

import React, { useState, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Error from '@/components/Error'
import Loading from '@/components/Loading'

export default function Login() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const errorMessages = {
    UserCheckFailed: 'An error occurred while checking user information. Please refresh the page or click the retry button to try again later.',
    UserCreationFailed: 'We encountered an error while creating your account. Please try again.',
  }

  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam) {
      setError(errorParam)
      const mappedMessage = errorMessages[errorParam] || 'An unknown error occurred. Please try again.'
      setMessage(mappedMessage)
      router.replace('/', { shallow: true })
    }
  }, [searchParams, router])

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/landing')
    }
  }, [status, router])

  const handleSignIn = async () => {
    const callbackUrl = process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/landing'
      : 'https://placeholderwebsite.com';
  
    await signIn('google', { callbackUrl });
  }

  const resetError = () => {
    setError('')
    setMessage('')
  }

  if (error) {
    return <Error error={error} message={message} doNotRefresh={true} onRetry={resetError} />
  }

  if (status === 'loading') {
    return (
      <Loading loadingDescription="Logging you into SpeakUp...If this takes longer than expected, please refresh the webpage on the top left corner!" />
    )
  }

  if (status === 'authenticated') {
    return null
  }

  return (
    <div className="w-screen h-screen flex flex-col lg:flex-row">
      {/* Left Section */}
      <div className="w-full lg:w-1/2 h-full flex flex-col justify-center items-center bg-gradient-to-b from-pink-300 to-pink-100 p-10">
        <p className="text-3xl font-extrabold text-black-300 mb-6 text-center">
        "Empowering individuals to confidently share their truths and express their unique voices”
        </p>
      </div>

      {/* Right Section */}
      <div className="relative w-full lg:w-1/2 py-12 lg:py-0 bg-white flex flex-col justify-center items-center">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-12 text-left text-green-500 w-3/4">
          Express confidently, speak authentically!
        </h1>
        <div className="bg-white rounded-lg border-2 border-mint-300 shadow-lg w-3/4 md:w-1/2 text-center z-10">
          <div className="px-8 py-6">
            <h1 className="text-2xl md:text-3xl font-semibold text-black-500 mb-2">
              Log in to SpeakUp
            </h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button
              onClick={handleSignIn}
              className="bg-green-400 text-black w-full py-2 px-4 rounded-md mt-4 hover:bg-black-600 transition duration-300"
            >
              Log In/Sign Up with Google
            </button>
          </div>
        </div>

        {/* Microphone Image */}
        <img 
          src="https://palace-images.s3.us-east-2.amazonaws.com/microphone.png" 
          alt="Microphone" 
          className="absolute top-0 right-0 lg:w-1/3 md:w-1/2 w-2/3 lg:top-10 lg:right-10 opacity-90" 
        />
      </div>
    </div>
  )
}
