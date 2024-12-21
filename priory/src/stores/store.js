import { defineStore } from 'pinia'
import axios from 'axios'

export const taskStore = defineStore('tasks', {
  state: () => ({ tasks: [] }),
  getters: {
    // returns the higher bound index of priority level
    prioIndexes: (state) => {

      console.log("Hel")
      if (state.tasks.length > 0 && state.tasks[0]) {
        state.tasks[4].prioScore = 11

      }
      console.log("lo")

      // sorting needed because endpoint does not save in right place!
      var tmpTasks = state.tasks?.slice().sort((a, b) =>  (b.prioScore || 0) - (a.prioScore || 0));

    
      // w = p·G100 
      // Math.round(2.5);
      var prioities = {
        high: Math.round(tmpTasks.length / 100 * 10),
        medium: Math.round(tmpTasks.length / 100 * 60),
        low: Math.round(tmpTasks.length / 100 * 80),
        archivable: Math.round(tmpTasks.length / 100 * 95)
      }

    
      console.log(tmpTasks)
      console.log(tmpTasks.length)
      console.log(prioities)

      return tmpTasks
    },
    allCategories: (state) => {
      var categories = ['Today', 'All']
      for (var i = 0; i < state.tasks.length; i++) {
        if(state.tasks[i]?.categories){
          for (var j = 0; j < state.tasks[i].categories.length; j++) {
            categories.push(state.tasks[i].categories[j])
          }
        }
      }

      const uniqueArray = [...new Set(categories)]

      return uniqueArray
    },
    allTasks: (state) => {
      return (category, limit = 3) => {
        console.log(category)

        if(category == 'All') return state.tasks.filter(task => task.status == 'active').slice(0, limit);
        return state.tasks
          .filter(task => task.categories.includes(category)) // Check if task includes the category
          .filter(task => task.status == 'active')
          .slice(0, limit);
      };
    },
  },
  actions: {
    async createTask(newTask) {
      var data = JSON.parse(JSON.stringify(newTask))

      try{
        await axios({
          method: 'post',
          url: `http://localhost:${3001}/api/v1/create`,
          data
        })

      }catch (error) {
        return false
      }

      return true
    },
    async getTasks(){
      try{
        const tasks_req = await axios({
          method: "get",
          url: `http://localhost:${3001}/api/v1/tasks`,
        }) 

        this.tasks = await tasks_req.data.data          
      }catch (error) {
        console.log(error.response);
      }
    },
    async updateTask(updatedTask) {
      var data = JSON.parse(JSON.stringify(updatedTask))

      try{
        const tasks_req = await axios({
          method: 'post',
          url: `http://localhost:${3001}/api/v1/updateTask`,
          data
        })

        return tasks_req.success

      }catch (error) {
        this.tasks = backup
        return false
      }
      
    },
    async deleteTask(taskID){
      // Optimistic update
      const backup = [...this.tasks];
      this.tasks = this.tasks.filter(t => t._id !== taskID);

      try{
        const tasks_req = await axios({
          method: 'post',
          url: `http://localhost:${3001}/api/v1/softDeleteTask`,
          data: {_id: taskID}
        })

        return tasks_req.success

      }catch (error) {
        this.tasks = backup
        return false
      }
    },
    async completeTask(taskID){
      // Optimistic update
      const backup = [...this.tasks];
      this.tasks = this.tasks.filter(t => t._id !== taskID);

      try{
        const tasks_req = await axios({
          method: 'post',
          url: `http://localhost:${3001}/api/v1/completeTask`,
          data: {_id: taskID}
        })

        return tasks_req.success

      }catch (error) {
        this.tasks = backup
        return false
      }
    }
  },

})