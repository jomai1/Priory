<template>
    <div
        class="container task-preview"
        @mousedown="uiStore.onMouseDown"
        @mouseup="uiStore.onMouseUp"
        @click="
            uiStore.getUiState.currentTask?._id != task._id
                ? uiStore.changeTask(task)
                : uiStore.changeTask({});
            uiStore.setEdit(0);
        "
    >
        <div class="header">
            <CustomInput
                :text="task.title"
                :class="'title'"
                :placeholder="'Enter title'"
                @update-custom-input="changeTitle"
            />
            <button
                :class="{
                    visible:
                        uiStore.getUiState.currentTask._id == task._id &&
                        uiStore.getUiState.hoverID == task._id &&
                        uiStore.getUiState.editID != task._id,
                    hidden: !(
                        uiStore.getUiState.currentTask._id == task._id &&
                        uiStore.getUiState.hoverID == task._id &&
                        uiStore.getUiState.editID != task._id
                    ),
                }"
                class="btn edit-btn button-space"
                @click.prevent.stop="
                    () => {
                        uiStore.getUiState.editID != task._id
                            ? uiStore.setEdit(task._id)
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
        <div
            class="footer"
            :class="{
                visible: uiStore.getUiState.hoverID == task._id,
                hidden: !(uiStore.getUiState.hoverID == task._id),
            }"
        >
            <div @click.prevent.stop>
                <button
                    v-show="uiStore.getUiState.editID == task._id"
                    class="btn edit-btn button-space"
                    @click.prevent.stop="
                        () => {
                            saveTask();
                            uiStore.getUiState.editID != task._id
                                ? uiStore.setEdit(task._id)
                                : uiStore.setEdit(0);
                        }
                    "
                >
                    save
                </button>
                <button
                    v-show="uiStore.getUiState.editID != task._id"
                    class="delete-btn btn button-space"
                    :class="{ actionPending: flaggedForDeletion }"
                    @click.prevent.stop="
                        () => {
                            deleteTask(task);
                        }
                    "
                >
                    delete
                </button>

                <button
                    v-show="uiStore.getUiState.editID != task._id"
                    class="complete-btn btn button-space"
                    :class="{ actionPending: flaggedForCompletion }"
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
// Vue
import { ref, watch } from "vue";

// Components
import SelectableBlockContainer from "../components/SelectableBlockContainer.vue";
import SelectablePopup from "../components/SelectablePopup.vue";
import CategoryInput from "../components/CategoryInput.vue";
import CustomInput from "../components/buildingBlocks/CustomInput.vue";

// Store
import { useTaskStore } from "../stores/store.js";
import { useUiStore } from "../stores/uiStore";

const store = useTaskStore();
const uiStore = useUiStore();

const emit = defineEmits(["addToScore"]);

const props = defineProps({
    taskProp: {},
});

const task = ref({...props.taskProp});

var togglePopup = ref(false);

var flaggedForDeletion = ref(false);
var flaggedForCompletion = ref(false);

async function changeTitle(title) {
    if(title != ''){
        const answer = await store.updateTask(task.value._id, {
            title: JSON.parse(JSON.stringify(title))
        });    
    }else{
        return;
    }
    
}

function addCategory(category) {
    // Todo: Cannot input Today into category. Probably is because of the store but dont know.
    console.log(category)

    task.value.categories.push(category);
}

function removeCategory(category) {
    const index = task.value.categories.findIndex((cat) => cat == category);

    var tmpTask = task.value.categories;
    tmpTask.splice(index, 1);
}

async function closeSelectablePopup(selectable) {
    togglePopup.value = false;

    if (Object.keys(selectable).length !== 0) {
        const payload = task.value;
        payload.ticketBlocks.push(selectable);

        const answer = await store.updateTask(task.value._id, {
            ticketBlocks: payload.ticketBlocks,
        });

        uiStore.changeTask(task.value.value);

        if (answer) emit("addToScore", 1);
    }
}

async function saveTask() {
    // TODO update all tasks of this category.

    // TODO: only works for categories! It is nesessary to build a payload!
    // if only one task was modified, only modify this one!

    const answer = await store.updateTask(task.value._id, {
        categories: JSON.parse(JSON.stringify(task.value.categories)),
    });

    if (answer) emit("addToScore", 1);

    uiStore.changeTask(task.value);
}

async function deleteTask(task) {
    flaggedForDeletion.value = !flaggedForDeletion.value;

    if (flaggedForDeletion.value) {
        setTimeout(async () => {
            if (flaggedForDeletion.value) {
                const answer = await store.deleteTask(task._id);
                if (answer) emit("addToScore", 5);
            }
        }, 1100);
    }
}

async function completeTask(task) {
    flaggedForCompletion.value = !flaggedForCompletion.value;

    if (flaggedForCompletion.value) {
        setTimeout(async () => {
            if (flaggedForCompletion.value) {
                const answer = await store.completeTask(task._id);
                if (answer) emit("addToScore", 20);
            }
        }, 700);
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

.actionPending {
    transition: 0.6s;
    filter: brightness(0.9);
    -webkit-filter: brightness(0.9);
}

.actionPending:after {
    transition: 0.6s;
    filter: brightness(0.9);
    -webkit-filter: brightness(0.9);
}

.actionPending:hover:not(:disabled) {
    transition: 0.6s;
    filter: brightness(0.8);
    -webkit-filter: brightness(0.8);
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
</style>
