import express from 'express';
import {MongoClient} from 'mongodb';
import mongoose from 'mongoose';

const router = express.Router();

// import mongoose model
import Task from '../../../models/task.model.js';

router.post('/deleteTask', async (req, res) => {
	let answer = {
	  success: false,
	  data: null,
	  message: "An unexpected error occurred"
	}

	if(!req.body._id  || !mongoose.isValidObjectId(req.body._id)){
		answer.message = "Valid _id required"
		return res.status(400).json(answer)
	}

	try{
		const task = await Task.deleteOne({_id: req.body._id})

		if(task.deletedCount === 0){
			answer.message = "Task not found"
			return res.status(404).json(answer)
		}
		
		answer.success = true;
		answer.data = {deletedCount: task.deletedCount}
		answer.message = "Permanently deleted task"

		res.status(200).json(answer)
	}catch(error){
		console.log("Error in deleteTask");
  		console.error(error);
  		res.status(500).json(answer);
	}
})


export default router;