import express from 'express';
import {MongoClient} from 'mongodb';
import mongoose from 'mongoose';

const router = express.Router();

// import mongoose model
import Task from '../../../models/task.model.js';

router.post('/updateTasks', async (req, res) => {
	let answer = {
	  success: false,
	  data: null,
	  message: "An unexpected error occurred"
	}

	if (!Array.isArray(req.body._ids) || req.body._ids.length === 0) {
		answer.message = "A non-empty array of valid IDs is required";
		return res.status(400).json(answer);
	}

	req.body._ids = [...new Set(req.body._ids)];

	const invalidIds = req.body._ids.filter(id => !mongoose.isValidObjectId(id));

	if (invalidIds.length) {
		console.log("Invalid Ids for update:", invalidIds);
		answer.message = "All provided IDs must be valid MongoDB ObjectIds";
		return res.status(400).json(answer);
	}


	if(!req.body.payload  || Object.keys(req.body.payload).length === 0){
		answer.message = "Non-empty payload required"
		return res.status(400).json(answer)
	}

	// Optionally allow only whitelisted fields to be updated
	if(req.body.payload.hasOwnProperty('title')){
		answer.message = "Title cannot be modified"
		return res.status(400).json(answer)
	}


	try{
		const tasks = await Task.updateMany(
	      { _id: { $in: req.body._ids } }, 
	      { $set: req.body.payload }, 
	      { multi: true, runValidators: true }
	    );

		if (tasks.matchedCount === 0) {
			answer.success = true;
			answer.data = [];
			answer.message = "No tasks were updated";
			return res.status(200).json(answer);
	    }

	    console.log(tasks)
	
	    answer.success = true;
		answer.data = {modifiedCount: tasks.modifiedCount}
		answer.message = "Tasks updated successfully"

		res.status(200).json(answer);
	}catch(error){
		console.log("Error in updateTasks");
		console.error(error);
  		res.status(500).json(answer);
	}
})


export default router;