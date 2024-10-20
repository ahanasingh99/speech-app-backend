'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { getModuleWithActivity, withTimeout, createRecording } from '../api/index' // Adjust import path based on your structure
import Loading from '@/components/Loading'
import Error from '@/components/Error'
import withAuth from '@/components/HOC/withAuth'
import { useSession } from 'next-auth/react'
import { MicrophoneIcon, StopIcon, CloudArrowUpIcon } from '@heroicons/react/24/solid'
import Link from 'next/link';

function ModulePage() {
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  
  const moduleId = decodeURIComponent(searchParams.get('moduleId') || '')
  const title = decodeURIComponent(searchParams.get('title') || '')

  if (status === 'unauthenticated') {
    return null
  }

  // Fetch module and activity using React Query
  const {
    data: moduleData,
    isLoading,
    error,
  } = useQuery(
    ['moduleWithActivity', moduleId, title],
    () => withTimeout(5000, getModuleWithActivity(title, moduleId)), // 5-second timeout
    {
      enabled: !!moduleId && !!title, // Only run if moduleId and title are available
      retry: 2,
      retryDelay: 0,
      refetchOnWindowFocus: false,
    }
  )

  const [recording, setRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState(null)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const [message, setMessage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Clean up the media recorder when component unmounts
    return () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const handleStartRecording = async () => {
    try {
      if (!navigator.mediaDevices || !window.MediaRecorder) {
        alert('Your browser does not support audio recording.')
        return
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      chunksRef.current = [] // Reset chunks

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        // Create a valid Blob from chunks
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
      }

      mediaRecorder.start()
      mediaRecorderRef.current = mediaRecorder
      setRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Error accessing microphone. Please check your browser settings.')
    }
  }

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop()
      setRecording(false)
    }
  }

  const handleSubmitRecording = async () => {
    if (!audioBlob) return

    setIsSubmitting(true)
    const reader = new FileReader()
    reader.readAsDataURL(audioBlob)
    reader.onloadend = async () => {
      const result = reader.result
      const base64data = result.split(',')[1] // Get base64 data without prefix
      const mimeType = result.split(';')[0].split(':')[1] // Extract mimeType from data URL
      const userEmail = session.user.email
      const moduleName = moduleData.module.title
      const activityName = moduleData.activity.title

      try {
        const response = await createRecording({
          audio: base64data,
          mimeType,
          userEmail,
          moduleName,
          activityName,
        })

        if (response) {
          setMessage({ type: 'success', text: 'Recording submitted successfully!' })
        }
      } catch (error) {
        setMessage({ type: 'error', text: 'Error submitting recording. Please try again.' })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  if (error) {
    return (
      <Error
        localerror="Server error"
        localmessage="Module Page Error"
      />
    )
  }

  if (isLoading || !moduleData) {
    return (
      <Loading
        loadingDescription="Loading... If this takes longer than expected, please refresh the webpage!"
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4 max-w-screen-lg">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
          {moduleData.module.title}
        </h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          Activity: {moduleData.activity.title}
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          {moduleData.activity.prompt}
        </p>

        {message && (
          <div className={`mb-6 p-4 rounded-lg text-white ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
            {message.text}
          </div>
        )}

        {message && message.type === 'success' && (
          <Link
            href={`/feedback?email=${encodeURIComponent(session.user.email)}`}
            className="bg-purple-500 text-white px-6 py-3 rounded-lg mt-4 hover:bg-purple-600 transition-colors duration-300 inline-block text-center"
          >
            View Feedback by SpeakUp AI Analysis
          </Link>
        )}

        {/* Recorder */}
        <div className="bg-white rounded-lg shadow-md p-8 flex flex-col items-center mt-8">
          <div className="w-24 h-24 mb-6 flex items-center justify-center bg-indigo-100 rounded-full">
            <MicrophoneIcon className="w-12 h-12 text-indigo-600" />
          </div>
          {!recording ? (
            <button
              onClick={handleStartRecording}
              className="bg-green-500 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-green-600 transition-colors duration-300"
            >
              <MicrophoneIcon className="w-5 h-5" />
              <span>Start Recording</span>
            </button>
          ) : (
            <button
              onClick={handleStopRecording}
              className="bg-red-500 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-red-600 transition-colors duration-300"
            >
              <StopIcon className="w-5 h-5" />
              <span>Stop Recording</span>
            </button>
          )}

          {recording && (
            <div className="mt-4 flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
              <span className="text-red-600 font-semibold">Recording in progress...</span>
            </div>
          )}

          {audioBlob && (
            <div className="mt-6 flex flex-col items-center w-full">
              <audio controls src={URL.createObjectURL(audioBlob)} className="w-full"></audio>
              <button
                onClick={handleSubmitRecording}
                disabled={isSubmitting}
                className={`bg-blue-500 text-white px-6 py-3 rounded-lg flex items-center space-x-2 mt-4 hover:bg-blue-600 transition-colors duration-300 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <CloudArrowUpIcon className="w-5 h-5" />
                <span>{isSubmitting ? 'Submitting...' : 'Submit Recording'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default withAuth(ModulePage)