'use client'
import { useRouter } from 'next/navigation'
import { Separator } from '@/components/ui/separator'

export default function Error({
  pathname,
  error,
  message,
  localerror, // for testing purposes only - in development mode
  localmessage, // for testing purposes only - in development mode
  onRetry,
  redirectPath,
  retryMessage = 'Please click the sign out button on the right upper corner and sign back in.',
  clickHereMessage = 'click here',
  redirectMessage = ' to get re-directed back to the login page',
  doNotRefresh,
  simpleError = false,
}) {
  const router = useRouter()

  const handleRetry = () => {
    if (onRetry) onRetry()
    router.push('/') // Redirect to home page and clear error query param
  }

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="p-8 bg-white rounded-lg shadow-lg w-[600px] flex flex-col items-center justify-between border-2">
        <div className="text-center">
          <h2 className="text-2xl font-medium mb-2">
            {error ? error : 'Oh no, there was an unexpected error'}
          </h2>
          <Separator
            orientation="horizontal"
            className="mt-4 bg-[#979797] border-1"
          />
          <div className="text-left text-sm mt-4">
            <p>What you can try:</p>
            <ul className="list-disc text-left ml-8 mt-2">
              {!simpleError && !doNotRefresh ? <li>Try refreshing the page</li> : null}
              {message && <li>{message}</li>}
              {!simpleError && <li>{retryMessage}</li>}
            </ul>
          </div>
          {onRetry && (
            <button onClick={handleRetry} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
