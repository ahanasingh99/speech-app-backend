'use client'

import React from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { getModulesWithActivities, withTimeout } from '../api/index' // Adjust the import path if necessary
import Loading from '@/components/Loading'
import withAuth from '@/components/HOC/withAuth'
import { useSession } from 'next-auth/react'
import Error from '@/components/Error'

function Landing() {
  const { data: session, status } = useSession()

  if (status === 'unauthenticated') {
    return null
  }

  // Fetch modules with activities using React Query and withTimeout
  const {
    data: modulesWithActivities,
    isLoading,
    error,
  } = useQuery(
    ['modulesWithActivities'],
    () => withTimeout(5000, getModulesWithActivities()), // 5-second timeout
    {
      retry: 2,
      retryDelay: 0,
      refetchOnWindowFocus: false,
    }
  )

  if (error) {
    return (
      <Error
        localerror="Server error"
        localmessage="Landing Page Error"
      />
    )
  }

  if (isLoading) {
    return (
      <Loading
        loadingDescription="Loading... If this takes longer than expected, please refresh the webpage!"
      />
    )
  }

  if (!modulesWithActivities) {
    return (
      <Error
        localerror="Missing data error"
        localmessage="Landing Page Error"
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <h1 className="text-4xl font-bold text-center mb-12 text-green-500">
        Elevate Your Speaking Skills with SpeakUp
      </h1>
      <div className="container mx-auto px-4">
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {modulesWithActivities.map((item, index) => {
            const module = item.module
            const moduleId = encodeURIComponent(module._id)
            const title = encodeURIComponent(module.title)

            return (
              <Link
                key={index}
                href={`/module?moduleId=${moduleId}&title=${title}`}
                className="md:w-[438px] flex flex-col items-center bg-white border border-gray-300 shadow-md rounded-lg p-4 sm:p-6 hover:bg-blue-50 transition-all duration-300 min-h-[250px] group relative cursor-pointer"
              >
                <div className="text-center">
                  <h2 className="text-lg sm:text-xl font-semibold bg-green-500 text-white mb-2 p-2 rounded">
                    {module.title}
                  </h2>
                  <p className="text-sm text-gray-700 mb-4">
                    {module.lessonSummary}
                  </p>
                </div>

                {/* Hover effect: Activity details */}
                <div className="absolute inset-0 bg-white p-6 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                  <h3 className="text-xl font-semibold bg-green-500 text-white mb-2 p-2 rounded">
                    {`Activity ${index + 1}: ${item.activity.title}`}
                  </h3>
                  <p className="text-sm text-gray-700">
                    {item.activity.prompt}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default withAuth(Landing)
