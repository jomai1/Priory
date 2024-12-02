<template>
  <div 
    class="container" 
    @mouseover="hoverOverTask(false)"
  >
    <div class="header">
      <div></div>
        <div>
          <div>
            <button
              v-if="store.allCategories.length - 1"
            ><</button>
            <h2>{{currentCategory}}</h2>
            <button
              v-if="store.allCategories.length - 1"
            >></button>
          </div>
        </div>
        

        <div>
          <button
            class="btn add-btn"
            @click="router.push({path: '/create', query: { category:  currentCategory} })"
          >
            ➕
          </button>
        </div>
    </div>

      <div  v-for="task in store.topThreeTasks" :key="task.id">
        <div 
          class="task-container"
          @click="openTask(task)"
          @mouseover.prevent.stop
          @mouseover="hoverOverTask(task)"
          >
            <div
              class="task-preview"
              >
              {{ task.title }}   
              <div 
                class="action-tasks"
                @click.prevent.stop
                >
                <button 
                  v-if="currentHoverOverTask?.id == task.id"
                  class="delete-btn btn task-delete" @click="deleteTask(task)"
                 >
                  ✖
                </button>
                <button 
                  v-if="currentHoverOverTask?.id == task.id"
                  class="add-btn btn" @click="completeTask(task)"
                 >
                  ✔
                </button>
              </div>
            </div>
              

            <div
              v-if="currentTask?.id == task.id"
            >
              (Categories {{ task.categories }})
              (Sentiment Score {{ task.sentimentScore }})
            </div>
        </div>
      </div>
    </div>

</template>

<script setup>
  import { onMounted } from 'vue';
  import { useRouter } from 'vue-router'
  import {taskStore} from "../store/store.js";
  import { ref } from "vue";


  const router = useRouter()

  const store = taskStore()
  let currentCategory = store.allCategories[0]

  var currentTask = ref({});
  var currentHoverOverTask = ref({});

  function hoverOverTask(task){
    if(!task){
      currentHoverOverTask.value = {}  
    }else{
      currentHoverOverTask.value = task  
    }
    
  }

  function openTask(task){
    if(currentTask.value?.id != task.id){
      currentTask.value = task
    }else{
      currentTask.value = {}
    }
  }

  async function deleteTask(task){
    console.log("Task to delete: ", task.id)

    const answer = await store.deleteTask(task.id)

    if(answer){
      console.log("Deleted task: ", task.id)
      await store.getTasks('all')

    }else{
      console.log("Could not delete task: ", task.id)
    }
  }

  async function completeTask(task){
    console.log("Completed task: ", task.id)

    const answer = await store.completeTask(task.id)

    if(answer){
      console.log("Deleted task: ", task.id)
      await store.getTasks('all')
      
    }else{
      console.log("Could not delete task: ", task.id)
    }
  }

  onMounted(async () => {
    await store.getTasks('all')
  });

</script>

<style>
  .task-container{
    border: 1px solid #E0E0E0;
    margin: 10px 0 10px 0;
    padding: 10px 10px 15px 10px;
    border-radius: 4px;
    background-color: #F5F5F5;
    cursor: pointer;
  }

  .task-container:hover{
        background-color: #FAF9F9;
    }


  .task-delete{
    margin-right: 5px;
  }
  .task-preview{
    padding-bottom: 15px;
    position: relative;
  }

  .action-tasks{
    display:inline;
    position: absolute;
    right: 0;
  }
</style>