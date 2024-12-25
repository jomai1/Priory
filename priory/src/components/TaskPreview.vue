<template>
  <div 
    class="container task-preview"
    @click="ctrlTaskObj.currentTask?._id != task._id? ctrlTaskObj.currentTask = task: ctrlTaskObj.currentTask = {}; ctrlTaskObj.editID = 0"
  >
    <div class="header">
        <h2>{{task.title}}</h2>
        
        <button 
          v-if="ctrlTaskObj.currentTask._id == task._id && ctrlTaskObj.hoverID == task._id && ctrlTaskObj.editID != task._id"
          class="btn edit-btn button-space"
          @click.prevent.stop="() => {ctrlTaskObj.editID != task._id? ctrlTaskObj.editID = task._id: ctrlTaskObj.editID = 0}"
        >edit</button> 
        <button 
          v-if="ctrlTaskObj.hoverID == task._id && ctrlTaskObj.editID == task._id"
          class="close-btn" 
          @click="console.log('Close edit mode')"
        >✖</button>
    </div>

    <div
      v-if="ctrlTaskObj.currentTask._id == task._id"
    >
      
      <SelectableBlockContainer
        :selectables = "task.ticketBlocks"
      />


      <div 
       v-if="ctrlTaskObj.editID == task._id"
       class="add-btn-container"
      >

        <button
          class="btn add-btn"
          @click.prevent.stop="() => {togglePopup = true}"
        >➕</button>
      </div>

    </div>


    <div 
      class="footer"
    >
      <div 
        @click.prevent.stop
        v-if="ctrlTaskObj.hoverID == task._id"
        >
        <button 
          v-if="ctrlTaskObj.editID == task._id"
          class="btn edit-btn button-space"
          @click.prevent.stop="() => {ctrlTaskObj.editID != task._id? ctrlTaskObj.editID = task._id: ctrlTaskObj.editID = 0}"
        >save</button>  

        <button
          v-if="ctrlTaskObj.editID != task._id"
          class="delete-btn btn button-space" 
          @click.prevent.stop="() => {console.log('Delete button')}"
         >delete</button>

        <button 
          v-if="ctrlTaskObj.editID != task._id"
          class="complete-btn btn button-space" 
          @click.prevent.stop="() => {console.log('Complete button')}"
         >done</button>
      </div>
    </div>

  </div>

  <SelectablePopup
    :visible = "togglePopup"
    @close-popup="closeSelectablePopup"
  />  
 
</template>

<script setup>
  import { ref } from 'vue'
  import SelectableBlockContainer from '../components/SelectableBlockContainer.vue';
  import SelectablePopup from '../components/SelectablePopup.vue';

  const emit = defineEmits(['addToScore'])

  const props = defineProps({
    task: {},
    ctrlTaskObj: {}
  })

  var togglePopup = ref(false);

  async function closeSelectablePopup(selectable ){
    togglePopup.value = false

    if(Object.keys(selectable).length !== 0){
      task.ticketBlocks.push(selectable)
      const answer = await store.updateTask(task)

      if(answer) emit('addToScore', 1)
    }
  }

  async function deleteTask(task){
    const answer = await store.deleteTask(task._id)

    if(answer) emit('addToScore', 5)
  }

  async function completeTask(task){
    const answer = await store.completeTask(task._id)

    if(answer) emit('addToScore', 20)
  }

</script>

<style>

.input-label {
  display: flex;
  flex-direction: column;
  width: 100%;
  color: gray;
}

input[type=text], input[type=datetime-local], input[type=number], input[type=radio] {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.add-btn-container{
  margin: 25px 0 0 0;
  text-align: center;
}

.submit-btn-container{
  text-align: right;
}

.button-space{
  margin-left: 5px;
}

.task-preview{
  background-color: #F0F0F0;
  margin-bottom: 10px;
}

.task-preview:hover{
  background-color: #F5F5F5;
  transition: filter .2s;
}


.header > h2 {
  font-family: 'Arial', 'Helvetica', sans-serif;
  font-size: 17px;
  font-weight: 500;
  color: #676767;
  text-align: left;
  overflow-wrap: break-word;
  word-break: break-word;
}

</style>