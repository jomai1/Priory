import express from 'express'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const port = process.env.PORT || 3001;


app.get('/', (req, res) => {
	res.send('Hello World')
})


app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`)
})  