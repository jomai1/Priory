<template>
    <div class="container">
        <div class="header">
            <h2>Create ToDo</h2>
            <button class="close-btn" @click="closeCreateTask()">✖</button>
        </div>
        <div class="action-block">
            <input
                type="text"
                v-model="title"
                :class="'text-input'"
                :placeholder="'Enter title ...'"
            />    
        </div>

        <div class="action-block">
            <CategoryInput
                :edit="true"
                :categories="categories"
                @remove-category="removeCategory"
                @add-category="addCategory"
            />
        </div>

        <!-- {{ ticketBlocks }} -->

        <SelectableBlockContainer :selectables="ticketBlocks" />
        <div class="add-btn-container">
            <button
                class="btn add-btn"
                @click="
                    () => {
                        togglePopup = true;
                    }
                "
            >
                ➕
            </button>
        </div>
        <div class="footer">
            <button class="btn" @click="submitTask()">submit</button>
        </div>
    </div>

    <SelectablePopup
        :visible="togglePopup"
        @close-popup="closeSelectablePopup"
    />
</template>
<script setup>
import SelectablePopup from "../components/SelectablePopup.vue";
import SelectableBlockContainer from "../components/SelectableBlockContainer.vue";
import CategoryInput from "../components/CategoryInput.vue";
import CustomInput from "../components/buildingBlocks/CustomInput.vue";

import { useRouter, useRoute } from "vue-router";
import { useTaskStore } from "../stores/store.js";
import { useUiStore } from "../stores/uiStore";
import { ref, onMounted, onBeforeUnmount } from "vue";

const router = useRouter();
const route = useRoute();
const store = useTaskStore();
const uiStore = useUiStore();

var togglePopup = ref(false);
var title;
var categories = ref(
    route?.query?.category != undefined ? [route.query.category] : [],
);
var ticketBlocks = ref([]);

// prio score the system assigned
var prioScoreSystem = ref(0);

// prio score the user assigned
var prioScore = ref(0);


function removeStringFromArray(arr, str) {
    // Todo add error handling
    if (!arr.includes(str)) {
        return arr;
    }

    const index = arr.indexOf(str);
    if (index > -1) {
        arr.splice(index, 1);
    }

    return arr;
}

function addCategory(category) {
    categories.value.push(category);
}

function removeCategory(category) {
    categories.value = removeStringFromArray(categories.value, category);
}

function closeCreateTask() {
    router.push({ path: "/", query: { category: categories.value[0] } });
}

function closeSelectablePopup(selectable) {
    ticketBlocks.value.push(selectable);
    togglePopup.value = false;
}

async function submitTask() {
    const newTask = {
        title: title,
        ticketBlocks: JSON.parse(JSON.stringify(ticketBlocks.value)),

        // Sentiment analysis
        prioScoreSystem: prioScoreSystem.value,
        prioScore: prioScore.value,
        categories: JSON.parse(JSON.stringify(categories.value)),
    };

    const answer = await store.createTask(newTask);

    console.log("Created");
    console.log(newTask);

    if (answer) {
        router.push({ path: "/", query: { category: categories.value[0] } });
    } else {
        console.log(`${newTask}`);
    }
}

onMounted(async () => {
    uiStore.setCreateMode(true);
});

onBeforeUnmount(() => {
    uiStore.setCreateMode(false);
});
</script>
<style>
.add-btn-container {
    margin: 25px 0 0 0;
    text-align: center;
}
</style>
