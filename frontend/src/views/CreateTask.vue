<template>
  <div class="container">
    <div class="header">
        <h2>Create ToDo</h2>
        <button class="close-btn" @click="router.push('/')">✖</button>
    </div>

    <div class="action-block">
      <label class="input-label" for="title">Chose a title:
        <input 
          class="input-field" 
          paceholder="Title" 
          type="text" 
          id="title" 
          v-model="title">
      </label>
    </div>

    <div class="action-block">
      
    </div>

    <div 
     class="add-btn-container"
    >
      <button
        class="btn add-btn"
        @click="openSelectablePopup()"
      >➕</button>
    </div>

    <div
      class="submit-btn-container"
    >
      <button
        class="btn"
        @click="submitTask()"
      >
        submit
      </button>  
    </div>
  </div>

  

  <SelectablePopup
    :visible = "togglePopup"
    @close-popup="closeSelectablePopup()"
  />  
  
  
</template>

<script setup>
  import SelectablePopup from '../components/SelectablePopup.vue';

  import { useRouter, useRoute } from 'vue-router'
  import {taskStore} from "../store/store.js";
  import { ref } from "vue";


  const router = useRouter()
  const route = useRoute()
  const store = taskStore()


  // Sentiment analysis
  import Sentiment from "sentiment"

  function analyzeSentiment(title) {
    const sentiment = new Sentiment();
    const result = sentiment.analyze(title);

    console.log(result)
    return result.score;
  }


  var togglePopup = ref(false);

  function openSelectablePopup(){
    togglePopup.value = true
  }

  function closeSelectablePopup(){
    togglePopup.value = false
  }


  var title
  
  async function submitTask(){
    const newTask = {
      title: title,
      sentimentScore: analyzeSentiment(title),
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

</style>