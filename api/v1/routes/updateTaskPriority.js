import express from 'express';
import {MongoClient} from 'mongodb';
import mongoose from 'mongoose';

const router = express.Router();

// import mongoose model
import Task from '../../../models/task.model.js';

router.post('/updateTaskPriority', async (req, res) => {
	let answer = {
	  success: false,
	  data: null,
	  message: "An unexpected error occurred"
	}


	if(!req.body._id  || !mongoose.isValidObjectId(req.body._id)){
		answer.message = "Valid _id required"
		return res.status(400).json(answer)
	}
	if(!req.body.prioScore){
		answer.message = "prioScore required"
		return res.status(400).json(answer)
	}

	try{
		const task = await Task.findOne({ _id: req.body._id }, { prioScore: 1 });

		if (!task){
			answer.message = "Task not found"
			return res.status(404).json(answer);
		}


		const oldPrioryScore = task.order;

		if (oldPrioryScore < req.body.prioScore) {
	        // Shift down: decrement prioScore for tasks between oldPrioryScore and req.body.prioScore
	        await Task.updateMany(
	            { prioScore: { $gt: oldPrioryScore, $lte: req.body.prioScore } },
	            { $inc: { prioScore: -1 } }
	        );
	    } else {
	    	
	        // Shift up: increment prioScore for tasks between req.body.prioScore and oldPrioryScore
	        await Task.updateMany(
	            { prioScore: { $gte: req.body.prioScore, $lt: oldPrioryScore } },
	            { $inc: { prioScore: 1 } }
	        );
	    }

	    await Task.updateOne({ _id: req.body._id }, { $set: { prioScore: req.body.prioScore } });


		answer.success = true;
		answer.data = task
		answer.message = "Task Priority updated successfully"

		res.status(200).json(answer)
	}catch(error){
		console.log("Error in updateTask")
		console.error(error);
  		res.status(500).json(answer);
	}
})


export default router;