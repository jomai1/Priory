<template>
  <div>
    <div>
      <button
        v-if="store.allCategories.length - 1"
      ><</button>
      {{currentCategory}}
      <button
        v-if="store.allCategories.length - 1"
      >></button>
    </div>
    <button
      @click="router.push({path: '/create', query: { category:  currentCategory} })"
    >
      +
    </button>

  </div>
  
  <div>
    <h3>Tasks:</h3>  
  </div>
  <div >
    <ul v-for="task in store.allTasks">
      <li>
        {{ task.title }}
      </li>
    </ul>
  </div>
</template>

<script setup>
  import { onMounted } from 'vue';
  import { useRouter } from 'vue-router'
  import {taskStore} from "../store/store.js";
  

  const router = useRouter()

  const store = taskStore()
  let currentCategory = store.allCategories[0]

  onMounted(async () => {
    await store.getTasks()
  });

</script>