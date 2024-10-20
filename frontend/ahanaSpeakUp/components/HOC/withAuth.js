// hoc/withAuth.js
'use client'
import _ from 'lodash'
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation' // Corrected the import path
import Loading from '@/components/Loading'

const withAuth = (Component) => {
  const WithAuth = (props) => {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
      const handleRedirect = async () => {
        // Retrieve the session token (email) as a plain string
        const sessionEmail = typeof window !== 'undefined'
          ? localStorage.getItem('sessionToken')
          : null;

        if (status === 'loading') {
          // Optionally handle loading state
          console.log('Loading session...')
          return
        }

        if (status === 'authenticated' && session?.user?.name) {
          // Get the email from the session
          const currentUserEmail = session.user.name;

          // Update localStorage if session token (email) is different
          if (sessionEmail !== currentUserEmail) {
            console.log('Updating session token...')
            localStorage.setItem('sessionToken', currentUserEmail)
          }
          return
        }

        if (!session && status === 'unauthenticated') {
          console.log('Redirecting to login...')
          router.push('/')
        }

        // Redirect to login if session is unauthenticated and no session token (email) in localStorage
        if (status === 'unauthenticated' && !sessionEmail) {
          console.log('Redirecting to login...')
          router.push('/')
        }
      }

      handleRedirect()
    }, [session, status, router])

    if (status === 'loading') {
      return (
        <Loading loadingDescription="Loading....If this takes longer than expected, please refresh the webpage on the top left corner!" />
      )
    }

    return <Component {...props} />
  }

  // Set displayName for the WithAuth component
  WithAuth.displayName = `WithAuth(${Component.displayName || Component.name || 'Component'})`

  return WithAuth
}

export default withAuth;