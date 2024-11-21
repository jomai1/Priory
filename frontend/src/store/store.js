import { defineStore } from 'pinia'
import axios from 'axios'

export const taskStore = defineStore('tasks', {
	state: () => ({ tasks: [{}] }),
  getters: {
    allTasks: (state) => {
    	return state.tasks
    },
    allCategories: (state) => {
    	var categories = []
    	for (var i = 0; i < state.tasks.length; i++) {
    		if(state.tasks[i].categories){
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
    async getTasks(){
      try{
        const tasks_req = await axios({
          method: "get",
          url: `http://localhost:${3001}/tasks/v1/all-tasks`,
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

  },

})