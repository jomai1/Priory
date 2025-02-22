<template>
    <div class="container">
        <div class="header">
            <h2>Create ToDo</h2>
            <button class="close-btn" @click="closeCreateTask()">✖</button>
        </div>
        <div class="action-block">
            <label class="input-label" for="title"
                >Chose a title:
                <input
                    class="input-field"
                    placeholder="Enter a title"
                    type="text"
                    id="title"
                    v-model="title"
                    ref="titleInputField"
                />
            </label>
        </div>

        <div class="action-block">
            <CategoryInput
                :edit="true"
                :categories="categories"
                @remove-category="removeCategory"
                @add-category="addCategory"
            />
        </div>

        {{ ticketBlocks }}

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

import { useRouter, useRoute } from "vue-router";
import { useTaskStore } from "../stores/store.js";
import { ref, onMounted } from "vue";

const router = useRouter();
const route = useRoute();
const store = useTaskStore();

const titleInputField = ref(null);
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

function addCategory(category) {
    categories.value.push(category);
}

function removeCategory(index) {
    categories.value.splice(index, 1);
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
    titleInputField.value.focus();
});
</script>
<style>
.input-label {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.add-btn-container {
    margin: 25px 0 0 0;
    text-align: center;
}
</style>
