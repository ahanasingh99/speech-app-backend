'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchRecordings, generateFeedback } from '../api/index'; // API functions
import Loading from '@/components/Loading';
import Error from '@/components/Error';
import { PlayIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

function FeedbackPage() {
  const searchParams = useSearchParams();
  const email = decodeURIComponent(searchParams.get('email') || '');

  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [updatingFeedbackId, setUpdatingFeedbackId] = useState(null);

  useEffect(() => {
    if (!email) return;

    const getRecordings = async () => {
      try {
        const data = await fetchRecordings(email);
        setRecordings(data);
      } catch (err) {
        console.error('Error fetching recordings:', err);
        setError('Failed to fetch recordings.');
      } finally {
        setLoading(false);
      }
    };

    getRecordings();
  }, [email]);

  // Sorting function
  const getModuleNumber = (moduleName) => {
    const match = moduleName.match(/Module (\d+)/);
    return match ? parseInt(match[1]) : Infinity;
  };

  const sortedRecordings = [...recordings].sort((a, b) => {
    const moduleA = getModuleNumber(a.moduleName);
    const moduleB = getModuleNumber(b.moduleName);
    if (moduleA !== moduleB) {
      return moduleA - moduleB;
    } else {
      // Sort by attemptedDate within the same module
      const dateA = new Date(a.attemptedDate);
      const dateB = new Date(b.attemptedDate);
      return dateA - dateB;
    }
  });

  const handleGetFeedback = async (recording) => {
    setUpdatingFeedbackId(recording._id);
    try {
      const response = await generateFeedback({
        id: recording._id,
        module: recording.moduleName,
        activity: recording.activityName,
      });
      // Update the recording with new feedback
      setRecordings((prevRecordings) =>
        prevRecordings.map((rec) =>
          String(rec._id) === String(recording._id) ? response : rec
        )
      );
    } catch (err) {
      if (err.response && err.response.status === 400) {
        alert('We are still processing your feedback. Please check back in 5-10 minutes.');
      } else {
        console.error('Error generating feedback:', err);
        alert('Error generating feedback. Please try again later.');
      }
    } finally {
      setUpdatingFeedbackId(null);
    }
  };

  if (loading) {
    return <Loading loadingDescription="Loading recordings..." />;
  }

  if (error) {
    return <Error localerror="Error" localmessage={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4 max-w-screen-lg">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8">
            Your Customized Feedback Powered by SpeakUp AI
        </h1>
        {sortedRecordings.length === 0 ? (
          <p className="text-lg text-gray-600">No recordings found.</p>
        ) : (
          <div className="space-y-6">
            {sortedRecordings.map((recording) => (
              <div
                key={recording._id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex flex-col md:flex-row md:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800">
                      {recording.moduleName}
                    </h2>
                    <h3 className="text-xl text-gray-700 mt-1">
                      Activity: {recording.activityName}
                    </h3>
                    <p className="text-gray-600 mt-2">
                      Attempted on: {recording.attemptedDate}
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <audio
                      controls
                      src={recording.recordingUrl}
                      className="w-full md:w-64"
                    ></audio>
                  </div>
                </div>
                {recording.feedback && recording.feedback.trim() !== '' ? (
                  <div className="mt-4">
                    <h4 className="text-lg font-semibold text-gray-800">
                      Feedback:
                    </h4>
                    <p className="text-gray-700 mt-2 whitespace-pre-line">
                      {recording.feedback}
                    </p>
                  </div>
                ) : (
                  <div className="mt-4">
                    <button
                      onClick={() => handleGetFeedback(recording)}
                      disabled={updatingFeedbackId === recording._id}
                      className={`bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 ${
                        updatingFeedbackId === recording._id
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                      }`}
                    >
                      {updatingFeedbackId === recording._id ? (
                        <span className="flex items-center">
                          <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
                          Generating Feedback...
                        </span>
                      ) : (
                        'Get Feedback'
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FeedbackPage;