<template>
  <div class="input-container">
    <div class="selectable">
      <label class="input-label" for="title">Chose a title:
        <input 
          class="input-field" 
          paceholder="Title" 
          type="text" 
          id="title" 
          v-model="title">
      </label>
    </div>

    <div class="selectable">
      <label paceholder="Description" class="input-label" for="title">Write a description:
        <textarea 
          class="input-field" 
          type="text" 
          id="description" 
          v-model="description">
        </textarea>
      </label>
    </div>

    <div class="selectable">
      
    </div>

    <div class="add-btn-container">
      <button
        @click="openSelectablePopup()"
      >+</button>
    </div>
  </div>

  <div>
    <button
      class="submit-button"
      @click="submitTask()"
    >
      submit
    </button>  
  </div>
  
</template>

<script setup>
  import { useRouter, useRoute } from 'vue-router'
  import {taskStore} from "../store/store.js";

  const router = useRouter()
  const route = useRoute()
  const store = taskStore()

  var title, description

  function openSelectablePopup(){
    console.log("Open the popup!")
  }


  async function submitTask(){
    console.log(title)
    console.log(description)




    const newTask = {
      title: title,
      description: description,
      // Needs to be changed to current category
      categories: route?.query?.category != undefined ? [route.query.category]: ['All'] 
    }

    const answer = await store.createTask(newTask)

    console.log(newTask)

    if(answer){
      router.push('/')  
    }else{
      console.log(`${newTask}`)
    }
    
  }

</script>

<style>
  
.input-label {
  display: flex;
  flex-direction: column;
  width: 100%;
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

textarea {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.submit-button {
  appearance: button;
  background-color: #1899D6;
  border: solid transparent;
  border-radius: 16px;
  border-width: 0 0 4px;
  box-sizing: border-box;
  color: #FFFFFF;
  cursor: pointer;
  display: inline-block;
  font-family: din-round,sans-serif;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: .8px;
  line-height: 20px;
  margin: 0;
  margin-top: 20px;
  margin-bottom: 50px;
  outline: none;
  overflow: visible;
  padding: 13px 16px;
  text-align: center;
  text-transform: uppercase;
  touch-action: manipulation;
  transform: translateZ(0);
  transition: filter .2s;
  user-select: none;
  -webkit-user-select: none;
  vertical-align: middle;
  white-space: nowrap;
}

.submit-button:after {
  background-clip: padding-box;
  background-color: #1CB0F6;
  border: solid transparent;
  border-radius: 16px;
  border-width: 0 0 4px;
  bottom: -4px;
  content: "";
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  z-index: -1;
}

.submit-button:main,
.submit-button:focus {
  user-select: auto;
}

.submit-button:hover:not(:disabled) {
  filter: brightness(1.1);
  -webkit-filter: brightness(1.1);
}

.submit-button:disabled {
  cursor: auto;
}

.submit-button:active {
  border-width: 4px 0 0;
  background: none;
}

</style>