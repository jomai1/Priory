<template>
    <div class="container" @mouseover="hoverOverTask(false)">
        <div class="header">
            <div style="visibility: hidden" class="btn add-btn">➕</div>
            <div
                class="category-container"
            >
                <button
                    class="btn switch-category-btn"
                    @click="uiStore.decreaseCategoryIndex(store.allCategories)"
                ><</button>
                <h2
                    @click="uiStore.increaseCategoryIndex(store.allCategories)"
                >{{ uiStore.getUiState.category }}</h2>
                <button
                    class="btn switch-category-btn"
                    @click="uiStore.increaseCategoryIndex(store.allCategories)"
                >></button>
            </div>

            <button
                class="btn add-btn"
                @click="
                    router.push({
                        path: '/create',
                        query: {
                            category: uiStore.getUiState.category,
                        },
                    })
                "
            >
                ➕
            </button>
        </div>
        <!--       <div class="score-container">
                <p class="score">{{ tweened.score.toFixed(0) }}</p>
            </div> -->
        <div v-if="allTasks.length == 0" class="delete-category-container">
            <button
                class="btn delete-btn"
                @click="
                    () => {
                        console.log(`Delete '${uiStore.getUiState.category}'`);
                    }
                "
            >
                Delete this category
            </button>
        </div>

        <div
            v-for="(task, index) in allTasks"
            :key="task._id + index"
            @mouseover.stop.prevent="hoverOverTask(task)"
            :ref="setTaskRef"
        >
            <TaskPreview :task="task" @add-to-score="addToScore" />
        </div>
    </div>
</template>
<script setup>
// Vue
import { ref, reactive, watch, computed, onMounted, onBeforeMount } from "vue";
import { useRouter, useRoute } from "vue-router";

// Components
import TaskPreview from "../components/TaskPreview.vue";

// Store
import { useTaskStore } from "../stores/store.js";
import { useUiStore } from "../stores/uiStore";

// external Dependencies
// watcher animation/ score animation
import gsap from "gsap";

const router = useRouter();
const route = useRoute();
const store = useTaskStore();
const uiStore = useUiStore();

// Score animation (Would like to understand better)
const score = ref(0);
const tweened = reactive({
    score: 0,
});

const taskRefs = ref([]);

function setTaskRef(el, index) {
    if (el) {
        taskRefs.value[index] = el;
    }
}

function addToScore(score) {
    console.log(`Add ${score} to score`);

    score.value += score;
}

function changeCategory() {
    uiStore.iterateCategoryIndex(uiStore.getUiState.category);
}

function hoverOverTask(task) {
    if (!task) {
        uiStore.hoverOver(0);
    } else {
        uiStore.hoverOver(task._id);
    }
}

function onKeyUp(e) {
    if (e.key == "p" && event.ctrlKey) {
        router.push({
            path: "/create",
            query: { category: uiStore.getUiState.category },
        });
    }
}

// Filtered tasks by category and paging.
const allTasks = computed(() => {
    if (!uiStore.ui.category) {
        return [];
    } else {
        router.replace({ path: "/", query: { category: uiStore.ui.category } });
        return store.allTasks(uiStore.ui.category, 50);
    }
});

// Populate store with tasks
onMounted(async () => {
    await store.getTasks();

    // Change category to category defined in query category
    if (route?.query?.category) {
        uiStore.changeCategory(store.allCategories, route.query.category);
    } else {
        uiStore.initCategory(store.allCategories);
    }

    // Add event listener to create new task with 'p' + ctrlKey press
    document.addEventListener("keyup", onKeyUp);
});

onBeforeMount(() => {
    // Remove event listener to create new task with 'p' + ctrlKey press
    document.removeEventListener("keyup", onKeyUp);
});

watch(score, (n) => {
    gsap.to(tweened, { duration: 0.5, score: Number(n) || 0 });
});
</script>
<style>
.category-container {
    cursor: pointer;
    flex: 1;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px
}

.category-container h2 {
    width: 150px;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
}


.delete-category-container {
    text-align: center;
}

.score-container {
    display: flex;
    justify-content: center;
    align-items: center;
}

.score {
    font-family: "Poppins", sans-serif;
    font-size: 2rem;
    font-weight: 400;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    /* Add a cool shadow effect */
    animation: pulse 2s infinite ease-in-out;
    /* A subtle animation to make it pop */
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
