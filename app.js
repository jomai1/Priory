import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import cors from 'cors';

dotenv.config()

// Routes
// Create
import createTask from "./api/v1/routes/createTasks.js";

// Read
import readTasks from "./api/v1/routes/readTasks.js";
import readTask from "./api/v1/routes/readTask.js";

// Update
import updateTask from "./api/v1/routes/updateTask.js";
import updateTasks from "./api/v1/routes/updateTasks.js";
import updateSelectableBlock from "./api/v1/routes/updateSelectableBlock.js";

// Delete (and flagging)
import deleteTask from "./api/v1/routes/deleteTask.js";
import softDeleteTask from "./api/v1/routes/softDeleteTask.js";
import archiveTask from "./api/v1/routes/archiveTask.js";
import restoreTask from "./api/v1/routes/restoreTask.js";
import completeTask from "./api/v1/routes/completeTask.js";
import deleteSelectableBlock from "./api/v1/routes/deleteSelectableBlock.js";




// Express server
const app = express();
const port = process.env.PORT || 3001;



// for dev allow cors for 5173
app.use(cors({
    origin: 'http://localhost:5173'
}));

app.use(express.json());

// CRUD routes
app.use('/api/v1/', createTask)
app.use('/api/v1/', readTask)
app.use('/api/v1/', readTasks)
app.use('/api/v1/', updateTask)
app.use('/api/v1/', updateTasks)
app.use('/api/v1/', updateSelectableBlock)
app.use('/api/v1/', deleteTask)
app.use('/api/v1/', softDeleteTask)
app.use('/api/v1/', archiveTask)
app.use('/api/v1/', restoreTask)
app.use('/api/v1/', completeTask)
app.use('/api/v1/', deleteSelectableBlock)





mongoose.connect(process.env.DB_CONNECTION)
.then(() => {
	console.log("Connected to DB")
	app.listen(port, () => {
		console.log(`Server running on http://localhost:${port}`)
	}) 	
}).catch(() => {
	console.log("Connecting failed")
})


