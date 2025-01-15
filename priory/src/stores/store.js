import { defineStore } from 'pinia'
import axios from 'axios'

export const taskStore = defineStore('tasks', {
    state: () => ({ tasks: [], taskModified: false }),
    getters: {

        // TODO!
        // returns the higher bound index of priority level
        prioIndexes: (state) => {
            if (state.tasks.length > 0 && state.tasks[0]) {
                state.tasks[4].prioScore = 11

            }
            
            // sorting needed because endpoint does not save in right place!
            var tmpTasks = state.tasks?.slice().sort((a, b) => (b.prioScore || 0) - (a.prioScore || 0));


            // w = p·G100 
            // Math.round(2.5);
            var prioities = {
                high: Math.round(tmpTasks.length / 100 * 10),
                medium: Math.round(tmpTasks.length / 100 * 60),
                low: Math.round(tmpTasks.length / 100 * 80),
                archivable: Math.round(tmpTasks.length / 100 * 95)
            }

            return tmpTasks
        },
        allCategories: (state) => {
            var categories = []
            for (var i = 0; i < state.tasks.length; i++) {
                if (state.tasks[i]?.categories && state.tasks[i]?.status == 'active') {
                    for (var j = 0; j < state.tasks[i].categories.length; j++) {
                        categories.push(state.tasks[i].categories[j])
                    }
                }
            }

            const uniqueArray = [...new Set(categories)]

            return uniqueArray
        },
        getTaskByIndex: (state) => {
            return (category, index) => {
                return state.tasks
                    .filter(task => task.categories.includes(category))[index];
            }
        },
        allTasksLength: (state) => {
            return (category) => {
                return state.tasks
                    .filter(task => task.categories.includes(category)).length
            }
        },
        allTasks: (state) => {
            return (category) => {
                return state.tasks
                    .filter(task => task.categories.includes(category))
            };
        },
    },
    actions: {
        async createTask(newTask) {
            var data = JSON.parse(JSON.stringify(newTask))

            try {
                await axios({
                    method: 'post',
                    url: `http://localhost:${3001}/api/v1/create`,
                    data
                })

            } catch (error) {
                return false
            }

            return true
        },
        async getTasks() {
            try {
                const tasks_req = await axios({
                    method: "get",
                    url: `http://localhost:${3001}/api/v1/tasks`,
                })

                this.tasks = await tasks_req.data.data
            } catch (error) {
                console.log(error.response);
            }
        },

        async updateTask(taskID, payload) {
            const backup = [...this.tasks];

            try {
                const tasks_req = await axios({
                    method: 'post',
                    url: `http://localhost:${3001}/api/v1/updateTask`,
                    data: {
                        _id: taskID,
                        payload: JSON.parse(JSON.stringify(payload))
                    }
                })

                // if(tasks_req.success){
                //     this.tasks[taskID].ticketBlocks = JSON.parse(JSON.stringify(payload))
                // }

                this.taskModified = false

                return tasks_req.success

            } catch (error) {
                this.tasks = backup
                return false
            }

        },
        async deleteTask(taskID) {
            // Optimistic update
            const backup = [...this.tasks];
            this.tasks = this.tasks.filter(t => t._id !== taskID);

            try {
                const tasks_req = await axios({
                    method: 'post',
                    url: `http://localhost:${3001}/api/v1/softDeleteTask`,
                    data: { _id: taskID }
                })

                return tasks_req.success

            } catch (error) {
                this.tasks = backup
                return false
            }
        },
        async completeTask(taskID) {
            // Optimistic update
            const backup = [...this.tasks];
            this.tasks = this.tasks.filter(t => t._id !== taskID);

            try {
                const tasks_req = await axios({
                    method: 'post',
                    url: `http://localhost:${3001}/api/v1/completeTask`,
                    data: { _id: taskID }
                })

                return tasks_req.success

            } catch (error) {
                this.tasks = backup
                return false
            }
        }
    },

})