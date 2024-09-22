const express = require('express')
const router = express.Router();
const User = require("../../models/User");
const Module = require("../../models/Module");
const Activity = require("../../models/Activity");
const Recording = require("../../models/Recording");
const handleError = require("../../utils/errorHandler");
const {decryptData, decryptObjectData, encrypt} = require("../../utils/authUtils")
const ObjectID = require("mongodb").ObjectId;
const AWS = require('aws-sdk');
const {OpenAI} = require("openai");
const {PromptTemplate} = require("@langchain/core/prompts")

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION
  });

  const transcribeService = new AWS.TranscribeService({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION
  });


  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  })

router.post("/create/user", async (req,res) => {

    try {
        const {fullName, email} = req.body;

        if (!fullName || !email) {
            return res.status(400).json({message : "full name or email are required to create new user"});
        }
    
        const existingUser = await User.findOne({email : email});
    
        if (existingUser) {
            return res.status(400).json({message: "Email is already registered as an user. Please use a different email"})
        }
        const encryptedId = encrypt(email);
        const completedModules = [];
        const completedQuizes = [];

        const newUser = new User({
            fullName,
            email,
            completedModules,
            completedQuizes,
            encryptedId
        })

        await newUser.save();
        return res.status(200).json(newUser);
    } catch (error) {
        console.log(error);
        handleError(error, res);
    }
})

router.post("/fetch", async (req, res) => {
    try {
        const encryptedEmail = req.body.encryptedEmail;
        // const encodedEncryptedEmail = decodeURIComponent(encryptedEmail);
        // const decryptedEmail = decryptData(encodedEncryptedEmail);

        // console.log(decryptedEmail);
        const existingUser = await User.findOne({email : encryptedEmail});

        if (existingUser) {
            return res.status(200).json(existingUser);
        } else {
            return res.status(404).json({message : "user does not exist!"});
        }
    } catch (error) {
        console.log(error);
        handleError(error, res);
    }
})


router.put("/update/profile/:email", async (req, res) => {
    try {
        const {completedModuleId, completedQuizId} = req.body;
       
        const decryptedEmail = decryptData(decodeURIComponent(req.params.email));

       const existingUser = await User.findOne({ email : decryptedEmail });

       if (!existingUser) {
           return res.status(404).json({ message: "No such user with existing email exists to update" });
       }

        const allowedFields = ["completedModuleId" , "completedQuizId"]
        const requestFields = Object.keys(req.body);
        const restrictedFields = requestFields.filter(field => !allowedFields.includes(field))
        if (restrictedFields.length > 0) {
            return res.status(403).json({message : "you are passing a field you do not have access to update"})
        }

        const updateData = {$addToSet : {}};
        if (completedModuleId) {
            updateData.$addToSet.completedModules = completedModuleId;
        }
        if (completedQuizId) {
            updateData.$addToSet.completedQuizzes = completedQuizId;
        }

        const updatedUser = await User.findByIdAndUpdate(
            existingUser._id,
            updateData,
            {new : true}
        )

        return res.status(200).json(updatedUser);

    } catch (error) {
        console.log(error);
        handleError(error, res);
    }
})


router.post("/create/activity", async (req,res) => {

    try {
        const {title, prompt, encryptedModuleId} = req.body;

        if (!title || !prompt || !encryptedModuleId) {
            return res.status(400).json({message : "Necessary input are required to create module"});
        }

        const decryptedModuleId = decryptData(encryptedModuleId)
        const moduleObjectId = new ObjectID(decryptedModuleId)
        const existingModule = await Module.findById(moduleObjectId);
    
        if (!existingModule) {
            return res.status(404).json({message: "Cannot create activity since module does not exist"})
        }
    
        const newActivity = new Activity({
            title,
            prompt,
            moduleId: decryptedModuleId
        })

        const savedActivity = await newActivity.save();
        const encryptedActivityId = encrypt(savedActivity._id);

        const updatedActivity = await Activity.findByIdAndUpdate(
            savedActivity._id,
            {encryptedId : encryptedActivityId},
            {new : true}
        )

        const redactedActivity = {
            title: updatedActivity.title,
            prompt: updatedActivity.prompt,
            encryptedId: updatedActivity.encryptedId
        }

        return res.status(200).json(redactedActivity);
    } catch (error) {
        console.log(error);
        handleError(error, res);
    }
})


router.post("/create/module", async (req,res) => {

    try {
        const {title, lessonSummary, video} = req.body;
        
        if (!title || !lessonSummary || !video) {
            return res.status(400).json({message : "Necessary input are required to create module"});
        }

    
        const existingModule = await Module.findOne({title});
    
        if (existingModule) {
            return res.status(400).json({message: "Cannot create module as it already exists"})
        }
    
        const newModule = new Module({
            title,
            lessonSummary,
            video
        })

        const savedModule = await newModule.save();
        const encryptedModuleId = encrypt(savedModule._id);

        const updatedModule = await Module.findByIdAndUpdate(
            savedModule._id,
            {encryptedId : encryptedModuleId},
            {new : true}
        )

        const redactedModule = {
            title: updatedModule.title,
            lessonSummary: updatedModule.lessonSummary,
            video: updatedModule.video,
            encryptedId: updatedModule.encryptedId
        }

        return res.status(200).json(redactedModule);
    } catch (error) {
        console.log(error);
        handleError(error, res);
    }
})



router.get("/fetch/module/:name", async (req,res) => {

    try {
        const moduleName = req.params.name;
        // const decryptedModuleId = decryptData(decodeURIComponent(moduleId));
        // const moduleObjectId = new ObjectID(decryptedModuleId)
        const module = await Module.findOne({title: moduleName})
    
        if (!module) {
            return res.status(404).json({message: "no such module exists"})
        }
        const moduleStrId = String(module._id);

        const activity = await Activity.findOne({moduleId: moduleStrId});

        if (!activity) {
            return res.status(404).json({message: "no such activity exists"})
        }

        const redactedModule = {
            moduleTitle: module.title,
            moduleLessonSummary: module.lessonSummary,
            moduleVideo: module.video,
            encryptedModuleId: module.encryptedId,
            activityTitle: activity.title,
            activityPrompt: activity.prompt,
            activityEncryptedId: activity.encryptedId
        }

        return res.status(200).json(redactedModule);
        
    } catch (error) {
        console.log(error);
        handleError(error, res);
    }
})




router.get("/fetch/modules", async (req, res) => {
    try {
      
        const modules = await Module.find({});

        const redactedModules = modules.map(module => {
            const {_id, ...rest} = module.toObject();
            return rest;
        })

        return res.status(200).json(redactedModules);
       
    } catch (error) {
        console.log(error);
        handleError(error, res);
    }
})


function getObjectKeyFromS3Url(s3Url) {
    // The pattern to match an S3 URL
    const pattern = /https:\/\/[^\/]+\/(.+)/;
  
    // Extract the object key using the pattern
    const match = s3Url.match(pattern);
  
    if (match && match.length > 1) {
      return match[1];
    } else {
      throw new Error('Invalid S3 URL');
    }
  }


// Utility function to sanitize transcription job name
const sanitizeJobName = (jobName) => {
    return jobName.replace(/[^0-9a-zA-Z._-]/g, '_');
};


async function gradeSpeech(criteria, userSpeech) {
    const prompt = new PromptTemplate({
        inputVariables: ["criteria", "userSpeech"],
        template: `You are an expert speech evaluator. Please evaluate the following speech based on the given criteria:
    
        Criteria: {criteria}
        
        Speech: "{userSpeech}"
        
        Provide a structured evaluation including the following sections:
        1. **Overall Assessment**: A brief summary of the speech's overall effectiveness.
        2. **Strengths**: Highlight the strong points of the speech.
        3. **Areas for Improvement**: Point out specific areas where the speech could be improved.
        4. **Score**: Assign a score out of 10, with 10 being excellent and 1 being poor.`,
    })

    const formattedPrompt = await prompt.format({
        criteria, 
        userSpeech
    })

    const chatCompletion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{role: 'user', content: formattedPrompt}],
    })

    const evaluationText = chatCompletion.choices[0].message.content;
    return evaluationText;
}

function removeAsterisks(text) {
    console.log(text);
    return text.replace(/\*/g, '');
}

router.post("/create/recording", async (req, res) => {
    const { audio, mimeType, userId, moduleName, activityName } = req.body;
  
    if (!audio || !mimeType || !userId || !moduleName || !activityName) {
      return res.status(400).json({ error: 'Invalid request payload' });
    }
  
    // Decode base64 string to Buffer
    const audioBuffer = Buffer.from(audio, 'base64');
  
    // Define the S3 path
    const s3Key = `${userId}/${moduleName}/${activityName}/${Date.now()}.webm`;
  
    // Upload audio to S3
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: s3Key,
      Body: audioBuffer,
      ContentType: mimeType,
    };
  
    try {
      const s3Data = await s3.upload(params).promise();
      const audioUri = `s3://${params.Bucket}/${params.Key}`;

      const audioRecording = s3Data.Location;
      const objectKey = getObjectKeyFromS3Url(audioRecording);
      const baseUrl = process.env.AWS_S3_BUCKET_ENDPOINT;
      const s3ObjectUrl = baseUrl + objectKey;

      // Generate a sanitized transcription job name
      const rawJobName = `${userId}-${moduleName}-${activityName}`;
      const jobName = sanitizeJobName(rawJobName);
      const transcribeParams = {
        TranscriptionJobName: jobName,
        LanguageCode: 'en-US',
        Media: {
          MediaFileUri: audioUri
        },
        OutputBucketName: params.Bucket
      };
  
    await transcribeService.startTranscriptionJob(transcribeParams).promise();
    const date = new Date();

    // Format the date and time to "8/18/2024, 4:30:15 AM UTC time"
    const formattedDateTime = date.toLocaleString('en-US', {
        timeZone: 'UTC',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true
    });

    // Add "UTC time" to the formatted date
    const timestampWithTime = `${formattedDateTime} UTC time`;

    const recordingBody = {
        attemptedDate: timestampWithTime,
        userId: userId,
        recordingUrl: s3ObjectUrl,
        feedback: "",
        transcriptionName: jobName,
        moduleName: moduleName,
        activityName: activityName
    }
  
     const newRecording = new Recording(recordingBody)
     await newRecording.save();
     return res.status(200).json(newRecording);
      
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error processing the request' });
    }
  });

router.put("/generate/recording/feedback", async (req, res) => {
    try {
      const moduleName = req.body.module;
      const activityName = req.body.activity;

      const activity = await Activity.findOne({title: activityName})
      const prompt = activity.prompt;

      const recording = await Recording.findOne({moduleName: moduleName, activityName: activityName})
      const jobName = recording.transcriptionName
      
      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME
      };

       const data = await transcribeService.getTranscriptionJob({ TranscriptionJobName: jobName }).promise();
       const status = data.TranscriptionJob.TranscriptionJobStatus;
  
       let transcript = null;
        if (status === 'COMPLETED') {
          const resultUri = data.TranscriptionJob.Transcript.TranscriptFileUri;
  
          // Extract the key correctly
          const resultKey = resultUri.replace(`https://s3.us-east-1.amazonaws.com/${params.Bucket}/`, '');
          console.log('resultKey: ', resultKey);
  
          // Fetch the transcription result from S3
          const s3Result = await s3.getObject({
            Bucket: params.Bucket, // Ensure it matches the bucket where the result is stored
            Key: resultKey // Correctly formatted key
          }).promise();
  
          transcript = JSON.parse(s3Result.Body.toString('utf-8'));
        } else if (status === 'FAILED') {
          return res.status(400).json({ message: 'We are still processing your feedback. Please check back in 5-10 minutes' });
        } 
      
        console.log(transcript.results.transcripts);
        const transcribedText = transcript.results.transcripts.map(t => t.transcript).join(' ').replace(/,/g, ' ');
        
        const feedback = await gradeSpeech(prompt, transcribedText);
        const cleanedFeedback = removeAsterisks(feedback);

        const updatedRecording = await Recording.findOneAndUpdate(
            {_id: recording._id},
            {feedback: cleanedFeedback},
            {new: true}
        )

        return res.status(200).json(updatedRecording);
    } catch(error) {
        console.log("error getting feedback", error);
        handleError(error, res);
    }
})

module.exports = router;