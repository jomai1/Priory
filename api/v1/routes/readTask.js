import express from 'express';
import {MongoClient} from 'mongodb';
import mongoose from 'mongoose';

const router = express.Router();

// import mongoose model
import Task from '../../../models/task.model.js';

router.get('/task', async (req, res) => {
	let answer = {
	  success: false,
	  data: null,
	  message: "An unexpected error occurred"
	}


	if(!req.query._id  || !mongoose.isValidObjectId(req.query._id)){
		answer.message = "Valid _id required"
		return res.status(400).json(answer)
	} 

	try{
		const task = await Task.findOne({ _id: req.query._id, status: "active" });

		if (!task){
			answer.message = "Task not found"
			return res.status(404).json(answer)
		}

		answer.success = true;
		answer.data = task
		answer.message = "Task retrieved successfully"

		res.status(200).json(answer)
	}catch(error){
		console.log("Error in readTask");
  		console.error(error);
  		res.status(500).json(answer);
	}
})


export default router;