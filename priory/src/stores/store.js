import { defineStore } from 'pinia';
import axios from 'axios';

function removeStringFromArray(arr, str){
    const index = arr.indexOf(str);
    if (index > -1) {
        arr.splice(index, 1);
    }

    return arr;
}

export const useTaskStore = defineStore('tasks', {
    state: () => ({ tasks: []}),
    getters: {
        allCategories: (state) => {
            var categories = ['Today'];

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
                var tmpTasks = state.tasks.filter(task => task.categories.includes(category))

                for(var i = 0; i < tmpTasks.length; i++){
                    if(tmpTasks[i].categories.includes('Today')){
                        const tmpTime = new Date(tmpTasks[i].createdAt);
                        const timeNow = new Date();

                        const timeDiff = Math.round((timeNow - tmpTime) / 1000 / 60 / 60);

                        // if older than 16 hours than remove Today
                        if(timeDiff > 16){
                            tmpTasks[i].categories = removeStringFromArray(tmpTasks[i].categories, 'Today')
                        }
                    }
                }

                return state.tasks
                    .filter(task => task.categories.includes(category))
            };
        },
        getTaskPriorityByIndex: (state) => {
            return (index) => {
                if(index < 0  || index >= state.tasks.length) return -1;
                return state.tasks[index].prioScore;
            }
        }
    },
    actions: {
        setTaskPriority(taskID, category, newPriority, newIndex){

            // find task with taskID
            const index = this.tasks.findIndex(({ _id }) => _id === taskID);
            if(index == -1) return false;

            this.tasks[index].prioScore = newPriority;

            let tasks = this.tasks.filter(task => task.categories.includes(category))
            
            // this needs to be opimized!
            for(var i = newIndex; i >= 0; i--){
                const currentLocalTask = tasks[i];
                const indexInDataset = this.tasks.findIndex(item => item._id === currentLocalTask._id);

                if (indexInDataset !== -1 && taskID != currentLocalTask._id) {
                    this.tasks[indexInDataset].newPriority = currentLocalTask.prioScore + newPriority;
                }
            }

            return true;

        },
        async createTask(newTask) {
            var data = JSON.parse(JSON.stringify(newTask))

            try {
                await axios({
                    method: 'post',
                    url: `http://localhost:${3001}/api/v1/create`,
                    data
                })

            } catch (error) {
                console.log(error);
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
                console.log(error);
            }
        },
        async updateTasks() {
            // TODO: needs to get ids and key, values of changed elements for bulk update
            const backup = [...this.tasks];

            try {
                const tasks_req = await axios({
                    method: 'post',
                    url: `http://localhost:${3001}/api/v1/updateTasks`,
                    data: {
                        payload: JSON.parse(JSON.stringify(payload))
                    }
                })

                return tasks_req.success

            } catch (error) {
                console.log(error);
                this.tasks = backup
                return false
            }

        },
        async updateTask(taskID, payload, softUpdate = false) {
            const backup = [...this.tasks];


            // check if tasks modified flag was set!

            console.log(taskID)
            console.log(payload)

            try {
                var tasks_req;
                if(!softUpdate){
                    tasks_req = await axios({
                        method: 'post',
                        url: `http://localhost:${3001}/api/v1/updateTask`,
                        data: {
                            _id: taskID,
                            payload: JSON.parse(JSON.stringify(payload))
                        }
                    })
                }

                if(softUpdate || tasks_req.data.success){
                    for (var i = 0; i < this.tasks.length; i++) {
                        if(this.tasks._id == taskID){
                            this.tasks[i].ticketBlocks = JSON.parse(JSON.stringify(payload))
                        }
                    }
                }

                return true; 

            } catch (error) {
                console.log(error);
                this.tasks = backup
                return false
            }
        },
        async updateSelectableBlock(taskID, selectableID, payload){
            const backup = [...this.tasks];



            try {
                const tasks_req = await axios({
                    method: 'post',
                    url: `http://localhost:${3001}/api/v1/updateSelectableBlock`,
                    data: {
                        _id: taskID,
                        selectableID: selectableID,
                        payload: JSON.parse(JSON.stringify(payload))
                    }
                })
                

                // Update local block 
                if(tasks_req.data.success){
                    for (var i = 0; i < this.tasks.length; i++) {
                        if(this.tasks[i]._id == taskID){
                            for (var j = 0; j < this.tasks[i].ticketBlocks.length; j++) {
                                if(this.tasks[i].ticketBlocks[j]._id == selectableID){
                                    this.tasks[i].ticketBlocks[j].value = payload        
                                }
                            }  
                        }
                    }
                }

                return tasks_req.success

            } catch (error) {
                console.log(error);
                this.tasks = backup
                return false
            }
        },
        async deleteSelectableBlock(taskID, selectableID){
            // Optimistic update
            const backup = [...this.tasks];

            try {
                const tasks_req = await axios({
                    method: 'post',
                    url: `http://localhost:${3001}/api/v1/deleteSelectableBlock`,
                    data: {
                        _id: taskID,
                        selectableID: selectableID,
                    }
                })

                // Update local block 
                if(tasks_req.data.success){


                

                    for (var i = 0; i < this.tasks.length; i++) {
                        if(this.tasks[i]._id == taskID){
                            for (var j = 0; j < this.tasks[i].ticketBlocks.length; j++) {
                                if(this.tasks[i].ticketBlocks[j]._id == selectableID){
                                    this.tasks[i].ticketBlocks.splice(j, 1);
                                    break;
                                }
                            }  
                        }
                    }
                }

                return tasks_req.success

            } catch (error) {
                console.log(error);
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
                console.log(error);
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
                console.log(error);
                this.tasks = backup
                return false
            }
        }
    },

})