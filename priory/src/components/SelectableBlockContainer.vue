<template>
  <div v-for="(buildingBlock, index) in selectables" @click.stop>
    <!-- div block that check for the type using v-if and render the desired building block! -->
    <div 
      v-if="buildingBlock.blockType == 'text-block'"
      class="action-block"
    >
      <label class="input-label" for="title">{{buildingBlock.title}}:
        <textarea 
          class="input-field" 
          :placeholder="buildingBlock.placeholder" 
          type="text" 
          id="title" 
          v-model="buildingBlock.value.text">
        </textarea>
      </label>
    </div>
    <div 
      v-if="buildingBlock.blockType == 'todo-list-block'"
      class="action-block"
    >   

      <label class="input-label" for="title">{{buildingBlock.title}}:
        <div
          v-for="(todo, todoIndex) in buildingBlock.value.todos"
          @click.prevent.stop="() => {todo.status = !todo.status}"
          @mouseover.prevent.stop="() => {mouseOverElement = todo.id}"
          @mouseleave.prevent.stop="() => {mouseOverElement = ''}"
          class="sub-todo-entry"
          >
          {{todo.title}}
          <div>
            <button v-if="mouseOverElement == todo.id" @click="() => {buildingBlock.value.todos.splice(todoIndex, 1)}">✖</button>
            <input type="checkbox" v-model="todo.status"/>  
          </div>
        </div>

        
        <form @submit.prevent="() => {buildingBlock.value.todos.push({title: todoTmp, status: false, id: uuidv4()}); todoTmp = ''}">
          <input 
            class="input-field" 
            :placeholder="buildingBlock.placeholder" 
            type="text" 
            id="title" 
            v-model="todoTmp">
          </form>
      </label>
    </div>
  </div>
</template>

<script setup>

  import { ref } from "vue";
  import { v4 as uuidv4 } from 'uuid';
  
  const props = defineProps({
    selectables: Array
  })

  var todoTmp = ref('');
  var mouseOverElement = ref('');

</script>

<style>

.sub-todo-entry {
  display: flex;
  justify-content: space-between;
  padding: 5px 10px 5px 10px;
  margin: 5px 10px 5px 10px;
  border-radius: 4px;
  background-color: #F5F5F5;
  cursor: pointer;
}

.sub-todo-entry button {
  background-color: transparent; /* Optional: Transparent background */
  border: none; /* Remove button border */
  cursor: pointer;
  color: #ff5c5c; /* Optional: Set a delete color */
}

.sub-todo-entry input[type="checkbox"] {
  cursor: pointer;
}



</style>