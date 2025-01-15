import express from 'express';
import {MongoClient} from 'mongodb';

const router = express.Router();

// import mongoose model
import Task from '../../../models/task.model.js';

router.get('/tasks', async (req, res) => {
	let answer = {
	  success: false,
	  data: null,
	  message: "An unexpected error occurred"
	}

	try{
		// Todo: Change endpoint to account for pagination (Pagination & Filtering)
		const tasks = await Task.find({ status: "active" }).sort({ createdAt: -1, prioScore: -1});
		
		console.log(tasks)

		answer.success = true;
		// Probably unnecessary, but not sure if Task.find is an empty array if the collection is empty.
		answer.data = tasks.length === 0 ? []: tasks
		answer.message = tasks.length === 0 ? "No tasks available": "Task retrieved successfully"

		res.status(200).json(answer)
	}catch(error){
		console.log("Error in readTasks");
		console.error(error);
  		res.status(500).json(answer);
	}
})


export default router;