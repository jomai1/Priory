import express from 'express';
import {MongoClient} from 'mongodb';

const router = express.Router();

// import mongoose model
import Task from '../../../models/task.model.js';

router.post('/create', async (req, res) => {
	let answer = {
	  success: false,
	  data: null,
	  message: "An unexpected error occurred"
	}

	if(!req.body.title){
		answer.message = 'Title required';
		return res.status(400).json(answer);
	}

	try{
		const task = await Task.create(req.body);

		answer.success = true;
		answer.data = task;
		answer.message = "Created task"

		res.status(201).json(answer)
	}catch(error){
		console.log("Error in createTask");
		console.error(error);
  		res.status(500).json(answer);
	}
})


export default router;