import { defineStore } from 'pinia'
import axios from 'axios'

export const taskStore = defineStore('tasks', {
	state: () => ({ tasks: [], completeTask: [{}] }),
  getters: {
    allTasks: (state) => {
    	return state.tasks
    },
    topThreeTasks: (state) => {
      if (state.tasks.length >= 3) {
        return state.tasks.slice(0, 3);  
      }else{
        return state.tasks.slice(0, state.tasks.length);  
      }
      
    },
    allCategories: (state) => {
    	var categories = []
    	for (var i = 0; i < state.tasks.length; i++) {
    		if(state.tasks[i]?.categories){
    			for (var j = 0; j < state.tasks[i].categories.length; j++) {
    				categories.push(state.tasks[i].categories[j])
    			}	
    		}
    	}

    	const uniqueArray = [...new Set(categories)]

    	return uniqueArray.length == 0 ? ['All']:  uniqueArray
    },
  },
  actions: {
    async getTasks(typeTask){
      try{
        const tasks_req = await axios({
          method: "get",
          url: `http://localhost:${3001}/tasks/v1/all-tasks`,
          params: {type: typeTask}
        })  

        this.tasks = await tasks_req.data
      }catch (error) {
        console.log(error.response);
      }
    },
    async createTask(newTask) {
      var data = JSON.parse(JSON.stringify(newTask))

      try{
        await axios({
          method: 'post',
          url: `http://localhost:${3001}/tasks/v1/create`,
          data
        })

      }catch (error) {
        return false
      }

      return true
    },
    async deleteTask(taskID){
      try{
        const tasks_req = await axios({
          method: 'post',
          url: `http://localhost:${3001}/tasks/v1/delete`,
          data: {id: taskID}
        })

      }catch (error) {
        return false
      }

      return true
    },
    async completeTask(taskID){
      try{
        const tasks_req = await axios({
          method: 'post',
          url: `http://localhost:${3001}/tasks/v1/complete`,
          data: {id: taskID}
        })

      }catch (error) {
        return false
      }

      return true
    }

  },

})