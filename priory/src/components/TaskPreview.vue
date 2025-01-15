<template>
    <div
        class="container task-preview"
        @click="
            uiStore.getUiState.currentTask?._id != task._id
                ? (uiStore.getUiState.currentTask = task)
                : (uiStore.getUiState.currentTask = {});
            uiStore.setEdit(0);
        "
    >
        <div class="header">
            <h2>{{ task.title }}</h2>
            <button
                v-if="
                    uiStore.getUiState.currentTask._id == task._id &&
                    uiStore.getUiState.hoverID == task._id &&
                    uiStore.getUiState.editID != task._id
                "
                class="btn edit-btn button-space"
                @click.prevent.stop="
                    () => {
                        uiStore.getUiState.editID != task._id
                            ? (uiStore.getUiState.editID = task._id)
                            : uiStore.setEdit(0);
                    }
                "
            >
                edit
            </button>
            <button
                v-if="
                    uiStore.getUiState.hoverID == task._id &&
                    uiStore.getUiState.editID == task._id
                "
                class="close-btn"
                @click="console.log('Close edit mode')"
            >
                ✖
            </button>
        </div>

        <!-- This is where content will come! -->

        <div
            v-if="uiStore.getUiState.currentTask._id == task._id"
            @click.prevent.stop
        >
            <CategoryInput
                :edit="uiStore.getUiState.editID == task._id"
                :categories="task.categories"
                @remove-category="removeCategory"
                @add-category="addCategory"
            />

            {{ task }}

            <SelectableBlockContainer :selectables="task.ticketBlocks" />
            <div
                v-if="uiStore.getUiState.editID == task._id"
                class="add-btn-container"
            >
                <button
                    class="btn add-btn"
                    @click.prevent.stop="
                        () => {
                            togglePopup = true;
                        }
                    "
                >
                    ➕
                </button>
            </div>
        </div>
        <div class="footer">
            <div
                @click.prevent.stop
                v-if="uiStore.getUiState.hoverID == task._id"
            >
                <button
                    v-if="uiStore.getUiState.editID == task._id"
                    class="btn edit-btn button-space"
                    @click.prevent.stop="
                        () => {
                            saveTask();
                            uiStore.getUiState.editID != task._id
                                ? (uiStore.getUiState.editID = task._id)
                                : uiStore.setEdit(0);
                        }
                    "
                >
                    save
                </button>
                <button
                    v-if="uiStore.getUiState.editID != task._id"
                    class="delete-btn btn button-space"
                    @click.prevent.stop="
                        () => {
                            deleteTask(task);
                        }
                    "
                >
                    delete
                </button>

                <button
                    v-if="uiStore.getUiState.editID != task._id"
                    class="complete-btn btn button-space"
                    @click.prevent.stop="
                        () => {
                            completeTask(task);
                        }
                    "
                >
                    done
                </button>
            </div>
        </div>
    </div>
    <SelectablePopup
        :visible="togglePopup"
        @close-popup="closeSelectablePopup"
    />
</template>
<script setup>
import { ref } from "vue";
import { taskStore } from "../stores/store.js";
import { useUiStore } from "../stores/uiStore";
import SelectableBlockContainer from "../components/SelectableBlockContainer.vue";
import SelectablePopup from "../components/SelectablePopup.vue";
import CategoryInput from "../components/CategoryInput.vue";

const store = taskStore();
const uiStore = useUiStore();

const emit = defineEmits(["addToScore"]);

const props = defineProps({
    task: {},
    edit: false,
});

var togglePopup = ref(false);

async function saveTask() {
    console.log(`Save = ${store.taskModified}`)

    if(store.taskModified){
        const answer = await store.updateTask(props.task._id, {
            categories: JSON.parse(JSON.stringify(props.task.categories)),
        });

        if (answer) emit("addToScore", 1);   
    }

    uiStore.changeTask(props.task);
}

async function addCategory(category) {
    store.taskModified = true;
    
    var tmpTask = props.task.categories;
    tmpTask.push(category);
}

function removeCategory(index) {
    store.taskModified = true;

    console.log(`add ${index}`)

    var tmpTask = props.task.categories;
    tmpTask.splice(index, 1);
}

async function closeSelectablePopup(selectable) {
    togglePopup.value = false;

    if (Object.keys(selectable).length !== 0) {
        const payload = props.task;
        payload.ticketBlocks.push(selectable);

        const answer = await store.updateTask(props.task._id, {
            ticketBlocks: payload.ticketBlocks,
        });

        uiStore.changeTask(props.task);

        console.log(`Updated task`);
        console.log(props.task);

        if (answer) emit("addToScore", 1);
    }
}

async function deleteTask(task) {
    const answer = await store.deleteTask(task._id);

    console.log(answer);

    if (answer) emit("addToScore", 5);
}

async function completeTask(task) {
    const answer = await store.completeTask(task._id);

    if (answer) emit("addToScore", 20);
}
</script>
<style>
.input-label {
    display: flex;
    flex-direction: column;
    width: 100%;
    color: gray;
}

input[type="text"],
input[type="datetime-local"],
input[type="number"],
input[type="radio"] {
    width: 100%;
    padding: 12px 20px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
}

.add-btn-container {
    margin: 25px 0 0 0;
    text-align: center;
}

.submit-btn-container {
    text-align: right;
}

.button-space {
    margin-left: 5px;
}

.task-preview {
    background-color: #f0f0f0;
    margin-bottom: 10px;
}

.task-preview:hover {
    background-color: #f5f5f5;
    transition: filter 0.2s;
}

.header > h2 {
    font-family: "Arial", "Helvetica", sans-serif;
    font-size: 19px;
    font-weight: 500;
    color: #676767;
    text-align: left;
    overflow-wrap: break-word;
    word-break: break-word;
}
</style>
