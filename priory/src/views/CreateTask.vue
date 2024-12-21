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
          placeholder="Enter a title" 
          type="text" 
          id="title" 
          v-model="title">
      </label>
    </div>

    <SelectableBlockContainer
      :selectables = "ticketBlocks"
    />

    <div 
     class="add-btn-container"
    >
      <button
        class="btn add-btn"
        @click="() => {togglePopup = true}"
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
    @close-popup="closeSelectablePopup"
  />  
  
  
</template>

<script setup>
  import SelectablePopup from '../components/SelectablePopup.vue';
  import SelectableBlockContainer from '../components/SelectableBlockContainer.vue';

  import { useRouter, useRoute } from 'vue-router'
  import {taskStore} from "../stores/store.js";
  import { ref } from "vue";

  const router = useRouter()
  const route = useRoute()
  const store = taskStore()

  var togglePopup = ref(false);
  var title
  var ticketBlocks = ref([]);

  // prio score the system assigned
  var prioScoreSystem = ref(0);

  // prio score the user assigned
  var prioScore = ref(0);



  function closeSelectablePopup(selectable){
    ticketBlocks.value.push(selectable)

    togglePopup.value = false
  }


  
  async function submitTask(){
    if(route?.query?.category != undefined){

    }

    const newTask = {
      title: title,
      ticketBlocks: ticketBlocks.value,

      // Sentiment analysis
      prioScoreSystem: prioScoreSystem.value,
      prioScore: prioScore.value,
      categories: route?.query?.category != undefined ? [route.query.category]: [] 
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