import express from 'express';
import {MongoClient} from 'mongodb';
import mongoose from 'mongoose';

const router = express.Router();

// import mongoose model
import Task from '../../../models/task.model.js';

router.post('/updateTask', async (req, res) => {
	let answer = {
	  success: false,
	  data: null,
	  message: "An unexpected error occurred"
	}


	if(!req.body._id  || !mongoose.isValidObjectId(req.body._id)){
		answer.message = "Valid _id required"
		return res.status(400).json(answer)
	}
	if(!req.body.payload  || Object.keys(req.body.payload).length === 0){
		answer.message = "Non-empty payload required"
		return res.status(400).json(answer)
	}

	try{
		const task = await Task.findByIdAndUpdate(req.body._id, req.body.payload, { new: true, runValidators: true, strict: true });
		
		if (!task){
			answer.message = "Task not found"
			return res.status(404).json(answer);
		}

		answer.success = true;
		answer.data = task
		answer.message = "Task updated successfully"

		res.status(200).json(answer)
	}catch(error){
		console.log("Error in updateTask")
		console.error(error);
  		res.status(500).json(answer);
	}
})


export default router;