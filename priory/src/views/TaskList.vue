<template>
  <div class="container" @mouseover="hoverOverTask(false)">
    <div class="header-container">
      <div class="header">
        <div></div>
        <div>
          <div @click="changeCategory" class="category-container">
            <h2>{{ store.allCategories[currentCategoryIndex] }}</h2>
          </div>
        </div>

        <div>
          <button
            class="btn add-btn"
            @click="
              router.push({
                path: '/create',
                query: { category: store.allCategories[currentCategoryIndex] },
              })
            "
          >
            ➕
          </button>
        </div>
      </div>

      <div class="score-container">
        <p class="score">{{ tweened.score.toFixed(0) }}</p>
      </div>
    </div>
    <div
      v-for="task in allTasks"
      :key="task._id"
      @mouseover.stop.prevent="hoverOverTask(task)"
    >
      <TaskPreview
        :task="task"
        :ctrlTaskObj="ctrlTaskObj"
        @add-to-score="addToScore"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { taskStore } from "../stores/store.js";
import { ref, reactive, watch, computed } from "vue";

// watcher animation/ score animation
import gsap from "gsap";

import TaskPreview from "../components/TaskPreview.vue";

const router = useRouter();
const store = taskStore();

var currentCategoryIndex = ref(0);
var ctrlTaskObj = ref({
  currentTask: {},
  hoverID: 0,
  editID: 0,
});

// Score animation (Would like to understand better)
const score = ref(0);
const tweened = reactive({
  score: 0,
});

function addToScore(score) {
  console.log(`Add ${score} to score`);

  score.value += score;
}

function changeCategory() {
  currentCategoryIndex.value =
    (currentCategoryIndex.value + 1) % store.allCategories.length;
}

function hoverOverTask(task) {
  if (!task) {
    ctrlTaskObj.value.hoverID = 0;
  } else {
    ctrlTaskObj.value.hoverID = task._id;
  }
}

// Filtered tasks by category and paging.
const currentCategory = computed(
  () => store.allCategories[currentCategoryIndex.value],
);
const allTasks = computed(() => store.allTasks(currentCategory.value, 50));

// Populate store with tasks
onMounted(async () => {
  await store.getTasks();
});

watch(score, (n) => {
  gsap.to(tweened, { duration: 0.5, score: Number(n) || 0 });
});
</script>

<style>
.category-container {
  cursor: pointer;
}

.score-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1px;
}

.score {
  font-family: "Poppins", sans-serif;
  font-size: 2rem;
  font-weight: 400;
  color: #d9f2d9;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Add a cool shadow effect */
  animation: pulse 2s infinite ease-in-out; /* A subtle animation to make it pop */
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}
</style>
