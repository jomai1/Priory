import mongoose from 'mongoose';

const taskSchema = mongoose.Schema({
	title: {
		type: String,
		required: [true, "Task name required"],
		default: '',
	},
	categories: {
		type: Array,
		required: [true, "Category is required"],
		default: [],
	},
	ticketBlocks: {
		type: Array,
		required: false,
		default: [],
	},
	prioScoreSystem: {
		type: Number,
		required: [true, "System Priority score is required"],
		default: 0,
	},
	prioScore: {
		type: Number,
		required: [true, "Priority score is required"],
		default: 0,
	},
	status: {
		type: String,
		default: "active",
	}
}, {timestamps: true}
);

export default mongoose.model('Task', taskSchema);