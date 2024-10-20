const AWS = require('aws-sdk')
const axios = require('axios')
const CryptoJS = require('crypto-js')
const API_URL = process.env.NEXT_PUBLIC_API_URL
let ASYMMETRIC_PUBLIC_KEY


export const decryptData = async (encryptedData) => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/controller/decrypt`,
      {
        encryptedData: encryptedData,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      },
    )

    if (response.status === 200) {
      return response.data.decryptedData
    }
  } catch (error) {
    console.error('Error:', error)
  }
}


export const getUser = async (authToken) => {
  console.log('getUser is called')
  // const productionMode = process.env.NODE_ENV === 'development'
  const productionMode = process.env.NODE_ENV === 'production';
  const userEmail = authToken?.user?.email;

  const BASE_URL = productionMode
    ? 'https://jn3719xgnf.execute-api.us-east-2.amazonaws.com/prod/fetchUser'
    : `${API_URL}/user/controller/fetch/user/email`;

  try {
    var response;
    if (productionMode) {
      response = await axios.post(
        `${BASE_URL}`,
        { authToken},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    } else {
      response = await axios.get(`${BASE_URL}/${userEmail}`, {
        withCredentials: true,
      });
    }

    if (response.status !== 200) {
      console.log('we hit an error case nothing will return');
      throw new Error('Failed to fetch user');
    }
    return productionMode ? response.data : decryptDocumentData(response.data);
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};


export const createUser = async (userData) => {
  // const proudctionMode = process.env.NODE_ENV === 'development'
  const proudctionMode = process.env.NODE_ENV === 'production';

  const BASE_URL = proudctionMode
    ? 'https://jn3719xgnf.execute-api.us-east-2.amazonaws.com/prod/createUser' // Production URL
    : `${API_URL}/user/controller/signup/user` // Development URL

  const payload = proudctionMode ? { userData: userData } : userData
  try {
    // Send a POST request to the signup API endpoint
    const response = await axios.post(
      `${BASE_URL}`,
      payload, // This is the user data that will be sent in the request body
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    // Return the status code from the response
    console.log(response.status);
    return response.status
  } catch (error) {
    // Log the error and re-throw it
    console.error('Error creating user:', error)
    throw error
  }
}

export const getModulesWithActivities = async () => {
  const productionMode = process.env.NODE_ENV === 'production';

  const BASE_URL = productionMode
    ? 'https://your-production-url.com/api/modules-with-activity'
    : `${API_URL}/user/modules-with-activity`;

  try {
    const response = await axios.get(BASE_URL, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 200) {
      throw new Error('Failed to fetch modules with activities');
    }

    // If data is encrypted in production, decrypt it
    return productionMode
      ? decryptDocumentData(response.data)
      : response.data;
  } catch (error) {
    console.error('Error fetching modules with activities:', error);
    throw error;
  }
};

export const getModuleWithActivity = async (title, moduleId) => {
  const productionMode = process.env.NODE_ENV === 'production';

  const BASE_URL = productionMode
    ? 'https://your-production-url.com/api/module-with-activity' // Replace with your production URL
    : `${API_URL}/user/module-with-activity`; // Development URL

  try {
    // Send a POST request with title and moduleId in the request body
    const response = await axios.post(
      BASE_URL,
      { title, moduleId },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // Handle non-200 response
    if (response.status !== 200) {
      throw new Error('Failed to fetch module and activity');
    }

    // If data is encrypted in production, decrypt it
    return productionMode
      ? decryptDocumentData(response.data)
      : response.data;
  } catch (error) {
    console.error('Error fetching module with activity:', error);
    throw error;
  }
};

export const createRecording = async ({ audio, mimeType, userEmail, moduleName, activityName }) => {
  const productionMode = process.env.NODE_ENV === 'production';

  const BASE_URL = productionMode
    ? 'https://your-production-url.com/user/controller/create/recording' // Replace with production URL
    : `${API_URL}/user/create/recording`; // Development URL

  try {
    const response = await axios.post(
      `${BASE_URL}`,
      { audio, mimeType, userEmail, moduleName, activityName },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, // Important for sending cookies and credentials
      }
    );

    if (response.status !== 200) {
      throw new Error('Failed to submit recording');
    }

    return response.data;
  } catch (error) {
    console.error('Error submitting recording:', error);
    throw error;
  }
};

// Fetch Recordings
export const fetchRecordings = async (email) => {
  const response = await axios.get(
    `${API_URL}/user/fetch/recordings/${encodeURIComponent(email)}`,
    {
      withCredentials: true,
    }
  );

  if (response.status !== 200) {
    throw new Error('Failed to fetch recordings');
  }

  return response.data;
};

// Generate Feedback
export const generateFeedback = async ({ id, module, activity }) => {
  const response = await axios.put(
    `${API_URL}/user/generate/recording/feedback`,
    { id, module, activity },
    {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    }
  );

  if (response.status !== 200) {
    throw response;
  }

  return response.data;
};





export function getGlobalAsymmetricPublicKey() {
  // If the key is null or undefined, reset it to the default value.
  if (!ASYMMETRIC_PUBLIC_KEY) {
    ASYMMETRIC_PUBLIC_KEY =
      '3e5b9a66a52c91b14a4e2a73613d7b14f7e1987c124e5f76a5c03e942b3c0118'
  }

  return ASYMMETRIC_PUBLIC_KEY
}

export const withTimeout = async (timeout, promise) => {
  return new Promise(async (resolve, reject) => {
    // Set up timeout
    const timer = setTimeout(() => {
      reject(new Error('API Timeout'))
    }, timeout)

    try {
      const response = await promise
      clearTimeout(timer)
      resolve(response)
    } catch (error) {
      clearTimeout(timer)
      reject(error)
    }
  })
}

export const decryptDocumentData = (data) => {
  try {
    const secretKey = getGlobalAsymmetricPublicKey()
    const decryptedData = CryptoJS.AES.decrypt(data, secretKey).toString(
      CryptoJS.enc.Utf8,
    )
    return JSON.parse(decryptedData)
  } catch (error) {
    console.log(error)
  }
}