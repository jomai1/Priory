<template>
  <div 
    class="container" 
    @mouseover="hoverOverTask(false)"
  >
  <div class="header-container">
    <div class="header">
      <div></div>
        <div>
          <div 
            @click="changeCategory"
            class="category-container" 
            >
            <h2>{{store.allCategories[currentCategoryIndex]}}</h2>
          </div>
        </div>
        

        <div>
          <button
            class="btn add-btn"
            @click="router.push({path: '/create', query: { category:  store.allCategories[currentCategoryIndex]} })"
          >
            ➕
          </button>
        </div>
    </div>

    <div class="score-container">
      <p class="score">{{ tweened.score.toFixed(0) }}</p>
    </div>
  </div>
      <div  v-for="task in allTasks" :key="task._id">
        <div 
          class="task-container"
          @click="currentTask?._id != task._id? currentTask = task: currentTask = {}; currentEditedTask = 0"
          @mouseover.stop.prevent="hoverOverTask(task)"
          >
            <div
              class="task-preview"
              >
                {{ task.title }}  
            </div>
              

            <div
              v-if="currentTask?._id == task._id"
            >

              <div class="edit-tasks"
                v-if="currentTask?._id == task._id"
              >
                  <button 
                    class="btn edit-btn"
                    @click.prevent.stop="() => {currentEditedTask != task._id? currentEditedTask = task._id: currentEditedTask = 0}"
                  >edit</button>  
              </div>
              <div class="spacer"></div>
              
              <SelectableBlockContainer
                :selectables = "currentTask.ticketBlocks"
              />

              <div
                v-if="currentEditedTask == task._id"
              >
                {{task}}  
              </div>
              

              <div 
               v-if="currentEditedTask == task._id"
               class="add-btn-container"
               
              >
                <button
                  class="btn add-btn"
                  @click.prevent.stop="() => {togglePopup = true}"
                >➕</button>
              </div>
            

            <div class="spacer"></div>

          </div>
          <div 
              class="delete-complete-tasks"
              @click.prevent.stop
              >
              <button
                v-if="currentHoverOverTask?._id == task._id && currentEditedTask == task._id"
                class="delete-btn btn task-delete" @click="deleteTask(task)"
               >
                ✖
              </button>
              <button 
                class="complete-btn btn" @click="completeTask(task)"
                @mousedown="startComplete"
                @mouseleave="stopComplete"
               >
                ✔
              </button>
          </div>
        </div>
      </div>
    </div>



  <SelectablePopup
    :visible = "togglePopup"
    @close-popup="closeSelectablePopup"

  />  
 

</template>

<script setup>
  import { onMounted } from 'vue';
  import { useRouter } from 'vue-router'
  import {taskStore} from "../stores/store.js";
  import { ref, reactive, watch, computed } from 'vue'

  // watcher animation/ score animation
  import gsap from 'gsap'

  import SelectablePopup from '../components/SelectablePopup.vue';
  import SelectableBlockContainer from '../components/SelectableBlockContainer.vue';


  const router = useRouter()
  const store = taskStore()

  var currentCategoryIndex = ref(0);
  var togglePopup = ref(false);
  var currentTask = ref({});
  var currentHoverOverTask = ref({});
  var currentEditedTask = ref(0);


  // Score animation (Would like to understand better)
  const score = ref(0)
  const tweened = reactive({
    score: 0
  })



  // Confirm click (todo)
  var buttonClicked = false
  var time = 0

  function startComplete() {
    buttonClicked = true

    console.log("Start")
  }

  function stopComplete() {
    if (buttonClicked) {
      buttonClicked = false
      console.log("Stop")
    }
  }
  // Confirm click (todo)


  async function closeSelectablePopup(selectable ){
    togglePopup.value = false

    if(Object.keys(selectable).length !== 0){
      currentTask.value.ticketBlocks.push(selectable)
      const answer = await store.updateTask(currentTask.value)
      if(answer) score.value += 1
    }

  }

  function changeCategory(){
    currentCategoryIndex.value = (currentCategoryIndex.value + 1) % store.allCategories.length
  }


  function hoverOverTask(task){
    if(!task){
      currentHoverOverTask.value = {}  
    }else{
      currentHoverOverTask.value = task  
    }
  }

  async function deleteTask(task){
    const answer = await store.deleteTask(task._id)

    if(answer) score.value += 5
  }

  async function completeTask(task){
    const answer = await store.completeTask(task._id)

    if(answer) score.value += 20 
  }


  // Filtered tasks by category and paging.
  const currentCategory = computed(() => store.allCategories[currentCategoryIndex.value]);
  const allTasks = computed(() => store.allTasks(currentCategory.value, 50));

  // Populate store with tasks
  onMounted(async () => {
    await store.getTasks();
  });

  
  watch(
    score,
    (n) => {
      gsap.to(tweened, { duration: 0.5, score: Number(n) || 0 })
    }
  )


</script>

<style>

  .category-container{
    cursor: pointer;
  }

  .score-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1px;
  }

  .score {
    font-family: 'Poppins', sans-serif;
    font-size: 2rem;
    font-weight: 400;
    color: #d9f2d9;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Add a cool shadow effect */
    animation: pulse 2s infinite ease-in-out; /* A subtle animation to make it pop */
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }


  .task-container{
    border: 1px solid #E0E0E0;
    margin: 10px 0 10px 10px;
    padding: 20px 25px 20px 25px;
    border-radius: 4px;
    background-color: #F5F5F5;
    cursor: pointer;
    position: relative;
  }

  .task-container:hover{
        background-color: #FAF9F9;
  }

  .spacer {
    margin-right: 0px;
    width: 10px;
    height: 40px;
  }

  .task-delete{
    margin-right: 5px;
  }

  .task-preview {
    font-family: 'Arial', 'Helvetica', sans-serif;
    font-size: 17px;
    font-weight: 500;
    color: #333;
    line-height: 1.6;
    text-align: left;
    overflow-wrap: break-word;
    word-break: break-word;
    position: relative;
  }

  .edit-tasks{
    display: inline;
    position: absolute;
    right: 0;
    margin: 0px 10px 0px 0px;
  }

  .delete-complete-tasks {
    display: inline;
    position: absolute;
    bottom: 0;
    right: 0;
    margin: 10px;
  }
</style>