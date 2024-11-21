import express from 'express'
import * as fs from "fs";
import { v4 as uuidv4 } from 'uuid';
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()



const app = express()
const port = process.env.PORT || 3001;

const tasks_db_path = process.env.TASKS_DB_PATH


function isISO8601Date(dateString) {
	const iso8601Regex = /^(\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2}))?)$/;
	return iso8601Regex.test(dateString);
}

app.use(cors({
    origin: 'http://localhost:5174' // Allow only this origin
}));

app.use(express.json());

app.get('/', (req, res) => {
	res.send('Hello World')
})

app.get('/tasks/v1/all-tasks', (req, res) => {
	let error = []

	try{
		const data = fs.readFileSync(tasks_db_path, { encoding: 'utf8', flag: 'r' });

		if(data.length){
		  res.status(200).send(data)
		}else{
		  res.status(200).send("Currently the database holds no tasks")
		}

	}catch(err){
		
		if (err.code === 'ENOENT') {
  			fs.appendFile(tasks_db_path, '', function (err) {
			  if (err) {
			  	res.status(500).send('Creating DB went wrong.')
			  	throw err;
			  }
			  
			  res.status(200).send("Created DB")
			});

		}else{
			res.status(500).send(`An error occured: ${err}`)
		}
	}
})

app.post('/tasks/v1/create', (req, res) => {
	let error = [];


	console.log("--------------------Start")
	console.log(req.body)
	console.log("--------------------End")
	

	if(!req.body.title){
		error.push("missing_title")
	}else if(typeof req.body.title != 'string'){
		error.push("title_not_a_string")
	}

	if(!req.body.categories){
		error.push("missing_categories")
	}else if(!Array.isArray(req.body.categories)){
		error.push("categories_not_a_array")
	}

	if (error.length > 0) {
		console.log(error)
		return res.status(400).json({ error });
	}



	const task = {
		id: uuidv4(),
	    title: req.body.title,
	    categories: req.body.categories,
	}

	try{
		fs.readFile(tasks_db_path, 'utf8', (err, data) => {
			if (err) {
				if (err.code === 'ENOENT') {
					// File doesn't exist, create a new one with an array
					const tasks = [task];
					fs.writeFile(tasks_db_path, JSON.stringify(tasks, null, 2), (err) => {
						if (err) {
						  return res.status(500).send(`Could not save task: ${err}`);
						}
						console.log("You have successfully written a task");
						res.status(200).send("Task created successfully");
					});
				} else {
					return res.status(500).send(`Could not read tasks: ${err} ${tasks_db_path}`);
				}
			} else {
				// File exists, append the task to the existing array
				 let tasks = [];
				  if (data) {
				    try {
				      tasks = JSON.parse(data);
				    } catch (e) {
				      return res.status(500).send(`Could not parse tasks: ${e}`);
				    }
				  }
				  
				tasks.push(task);
				fs.writeFile(tasks_db_path, JSON.stringify(tasks, null, 2), (err) => {
					if (err) return res.status(500).send(`Could not save task: ${err}`);

					console.log("You have successfully written a task");
					res.status(200).send("Task created successfully");
				});
			}
		});
	}catch(err){
		res.status(500).send(`Could not save task: ${err}`);
	}
})





app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`)
})  