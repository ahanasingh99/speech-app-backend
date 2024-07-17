const express = require('express')
const router = express.Router();
const User = require("../../models/User");
const Module = require("../../models/Module");
const Activity = require("../../models/Activity");
const handleError = require("../../utils/errorHandler");
const {decryptData, decryptObjectData, encrypt} = require("../../utils/authUtils")
const ObjectID = require("mongodb").ObjectId;

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
        const encodedEncryptedEmail = decodeURIComponent(encryptedEmail);
        const decryptedEmail = decryptData(encodedEncryptedEmail);

        console.log(decryptedEmail);
        const existingUser = await User.findOne({email : decryptedEmail});

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

        // how do i restrict something??
        const allowedFields = ["completedModuleId" , "completedQuizId"]
        console.log("allowdFields:" , allowedFields)
        const requestFields = Object.keys(req.body);
        console.log("request field: ", requestFields)
        const restrictedFields = requestFields.filter(field => !allowedFields.includes(field))
       console.log("restricted fields: ", restrictedFields)
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



router.get("/fetch/modules/:id", async (req,res) => {

    try {
        const moduleId = req.params.id;
        const decryptedModuleId = decryptData(decodeURIComponent(moduleId));
        const moduleObjectId = new ObjectID(decryptedModuleId)
        const module = await Module.findById(moduleObjectId)
    
    
        if (!module) {
            return res.status(404).json({message: "no such module exists"})
        }

        const activity = await Activity.findOne({moduleId: decryptedModuleId});

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

module.exports = router;