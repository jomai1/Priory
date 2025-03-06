<template>
    <div 
        class="sub-todo-conatiner"
    >   
        <div
            v-for="(todo, todoIndex) in buildingBlock.value"
            :key="todo._id"
            class="sub-todo-entry"
            @click.prevent.stop="toggleTodoStatus(todo._id)"
            @mouseover.prevent.stop="
                () => {
                    mouseOverElement = todo._id;
                }
            "
            @mouseleave.prevent.stop="
                () => {
                    mouseOverElement = '';
                }
            "
            
        >
            <form @submit.prevent="changeTodoTitle(todo, todoIndex)">
                <input
                    class="todo-title"
                    type="text"
                    v-model="todo.title"
                    ref="todoInputsRef"
                    @click.stop="changeSizeOfInput(todoIndex)"
                    @input="
                        () => {
                            changeSizeOfInput(todoIndex);
                            addWarnMessage(todoIndex);
                        }
                    "
                />
            </form>

            <div class="action-buttons-container">
                <button
                    v-if="mouseOverElement == todo._id"
                    @click.prevent.stop="deleteTodo(todoIndex)"
                >
                    ✖
                </button>
                <input type="checkbox" :checked="todo.status" @click.stop />
            </div>
        </div>
    </div>
    <form @submit.prevent="addTodo()">
            <input
                class="todo-input"
                :placeholder="'Add todo ...'"
                type="text"
                v-model="todoTmp"
            />
        </form>
</template>

<script setup>
import { useTaskStore } from "../../stores/store.js";
import { useUiStore } from "../../stores/uiStore";
import { v4 as uuidv4 } from "uuid";
import { ref, onMounted, onUnmounted, nextTick, useTemplateRef } from "vue";

const emit = defineEmits(["updateTodo"]);

const store = useTaskStore();
const uiStore = useUiStore();

const props = defineProps({
    buildingBlock: {},
});

const todoInputsRefs = useTemplateRef("todoInputsRef");
const maxInputSize = 50;
const minInputSize = 10;

var todoTmp = ref("");
var mouseOverElement = ref("");
const warnMessageElements = ref([]);

function toggleTodoStatus(todoId) {
    var tmpTodos = props.buildingBlock.value;

    for (var i = 0; i < tmpTodos.length; i++) {
        if (tmpTodos[i]._id == todoId) {
            tmpTodos[i].status = !tmpTodos[i].status;
        }
    }

    emit("updateTodo", tmpTodos, props.buildingBlock._id);
}

function deleteTodo(todoIndex) {
    var tmpTodos = props.buildingBlock.value;

    tmpTodos.splice(todoIndex, 1);

    emit("updateTodo", tmpTodos, props.buildingBlock._id);
}

function changeTodoTitle(todo, index) {
    var tmpTodos = props.buildingBlock.value;

    for (var i = 0; i < tmpTodos.length; i++) {
        if (tmpTodos[i]._id == todo._id) {
            tmpTodos[i].title = todo.title;
        }
    }

    emit("updateTodo", tmpTodos, props.buildingBlock._id);
    resizeInputRef(index);
    removeWarnMessage(index);
}

async function addTodo() {
    var tmpTodos = props.buildingBlock.value;
    tmpTodos.push({
        title: todoTmp.value,
        status: false,
        _id: uuidv4(),
    });

    emit("updateTodo", tmpTodos, props.buildingBlock._id);

    todoTmp.value = "";

    await nextTick()
    resizeInputRef(props.buildingBlock.value.length - 1)
}

function changeSizeOfInput(index) {
    if (!todoInputsRefs.value[index] || !props.buildingBlock.value[index])
        return;

    if (props.buildingBlock.value[index].title.length <= maxInputSize) {
        todoInputsRefs.value[index].style.width =
            props.buildingBlock.value[index].title.length - 5 + "ch";
    } else if (props.buildingBlock.value[index].title.length <= minInputSize) {
        todoInputsRefs.value[index].style.width = minInputSize + "ch";
    } else {
        todoInputsRefs.value[index].style.width = maxInputSize + "ch";
    }
}

function resizeInputRef(index) {
    if (!todoInputsRefs.value[index] || !props.buildingBlock.value[index]) return;

    if (props.buildingBlock.value[index].title.length <= maxInputSize) {
        todoInputsRefs.value[index].style.width =
            props.buildingBlock.value[index].title.length - 5 + "ch";
    } else if (props.buildingBlock.value[index].title.length <= minInputSize) {
        todoInputsRefs.value[index].style.width = minInputSize + "ch";
    } else {
        todoInputsRefs.value[index].style.width = maxInputSize + "ch";
    }
}

function removeWarnMessage(index) {

    if (todoInputsRefs.value[index] && warnMessageElements.value[index]) {

        if(!todoInputsRefs.value[index].parentElement.contains(warnMessageElements.value[index])) return;

        todoInputsRefs.value[index].parentElement.removeChild(
            warnMessageElements.value[index]
        );

        todoInputsRefs.value[index].classList.remove("warning");
        warnMessageElements.value.splice(index, 1);
    }
}

function addWarnMessage(index) {
    if (!todoInputsRefs.value[index] || !props.buildingBlock.value[index]) return;
        
    if (todoInputsRefs.value[index].parentElement.querySelector("p")) return;

    const p = document.createElement("p");
    p.textContent = "Hit enter to save the new value.";
    p.style.color = "red";
    p.classList.add("warning-message");

    todoInputsRefs.value[index].parentElement.appendChild(p);
    todoInputsRefs.value[index].classList.add("warning");

    warnMessageElements.value.push(p);
}

onMounted(() => {
    if(todoInputsRefs.value){
        for (var i = 0; i < todoInputsRefs.value.length; i++) {
            resizeInputRef(i);
        }    
    }
    
});

onUnmounted(() => {
    if(todoInputsRefs.value){
        for (var i = 0; i < todoInputsRefs.value.length; i++) {
            removeWarnMessage(i);
        }    
    }
    
});



</script>

<style>

.action-buttons-container{
    display: flex;
    justify-content: center;
    align-items: center;
}

.action-buttons-container button{
    background-color: transparent;
    border: none;
    color: #ff5c5c; 
    padding: 10px 8px;
    cursor: pointer;
    font-size: 12px;
}

.action-buttons-container button:hover {
    transform: scale(1.1);
    transition: 0.5s ease-in-out;
    filter: brightness(1.05);
    -webkit-filter: brightness(1.05);
}

.action-buttons-container input{
    padding: 10px 5px;
}

.todo-title {
    border: none;
    background: none;
    outline: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 250px;
    padding: 8px 12px;
    font-size: 14px;
    font-weight: 500;
    color: var(--vt-c-text-grey-1);
    transition:
        border-color 0.3s ease,
        box-shadow 0.3s ease,
        transform 0.1s ease;
}

.todo-title:hover {
    background-color: var(--color-light-background-2);
    border-radius: 4px;
}
.todo-title:focus {
    outline: none;
    box-shadow: 0 0 8px rgba(137, 196, 244, 0.6);
}

.warning:focus {
    box-shadow: 0 0 8px rgba(211, 47, 47, 0.3);
}

.sub-todo-entry {
    display: flex;
    justify-content: space-between;
    padding: 5px 15px 5px 10px;
    margin: 5px 10px 5px 10px;
    border-radius: 4px;
    background-color: var(--color-light-background-1);
    cursor: pointer;
}

.sub-todo-entry:hover {
    filter: brightness(1.05);
    -webkit-filter: brightness(1.05);
    transition: 0.1s ease-in-out;
}

.sub-todo-entry input[type="checkbox"] {
    cursor: pointer;
}
</style>
