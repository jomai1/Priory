import express from 'express';
import {MongoClient} from 'mongodb';
import mongoose from 'mongoose';

const router = express.Router();

// import mongoose model
import Task from '../../../models/task.model.js';

router.post('/deleteSelectableBlock', async (req, res) => {
	let answer = {
	  success: false,
	  data: null,
	  message: "An unexpected error occurred"
	}

	if(!req.body._id  || !mongoose.isValidObjectId(req.body._id)){
		answer.message = "Valid _id required"
		return res.status(400).json(answer)
	}

	// Need to be valid id
	if(!req.body.selectableID){
		answer.message = "Valid selectableID required"
		return res.status(400).json(answer)
	}


	try{
		const selectableBlock = await Task.updateOne(
			{"_id": req.body._id},
			{"$pull": {"ticketBlocks": {"_id": req.body.selectableID}}}
		)

		if (!selectableBlock){
			answer.message = "Selectable Block not found"
			return res.status(404).json(answer);
		}

		answer.success = true;
		answer.data = selectableBlock
		answer.message = "Selectable Block deleted successfully"

		res.status(200).json(answer)
	}catch(error){
		console.log("Error in deleteSelectableBlock")
		console.error(error);
  		res.status(500).json(answer);
	}
})


export default router;