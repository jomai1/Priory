<template>
    <label class="input-label" for="title">{{buildingBlock.title}}
        <div class="traffic-light-wrapper">
            
            <div class="traffic-light-color-picker">
                <div class="traffic-light-color-input">
                    <div class="task-name">{{taskNamesPriority.highPrioTask}}</div>
                    <div class="task-name">{{taskNamesPriority.midPrioTask}}</div>
                    <div class="task-name">{{taskNamesPriority.lowPrioTask}}</div>
                </div>
            </div>

            <div class="traffic-light-color-picker">
                <div
                    class="traffic-light-color-slider"
                    @mousedown="() => {isDragging = true}"
                    @mousemove="trafficLightSliderDrag"
                    @mouseup="() => {isDragging = false}"
                    @click="trafficLightSliderClick"
                    @mouseleave="() => {isDragging = false}"

                    ref="slider"
                >   
                    <div class="traffic-light-slider-thumb" :style="{ top: Math.min(Math.max(thumbPosition - (20 / 2), 0), maxSlider - 20)   + 'px'}"></div>
                </div>
                <div class="traffic-light-color-input">
                    <div class="traffic-light-color-block traffic-light-color-block-red"
                        @click="setPrioInput('red')"
                    >High</div>
                    <div class="traffic-light-color-block traffic-light-color-block-yellow"
                        @click="setPrioInput('yellow')"
                    >Mid</div>
                    <div class="traffic-light-color-block traffic-light-color-block-blue"
                        @click="setPrioInput('blue')"
                    >Low</div>    
                </div>
            </div>
        </div>
    </label>
</template>

<script setup>    
import { useTaskStore } from "../../stores/store.js";
import { useUiStore } from "../../stores/uiStore";
import { ref, onMounted, watch } from "vue";

const store = useTaskStore();
const uiStore = useUiStore();

const props = defineProps({
    buildingBlock: {}
});

// Thumb position is set to middle of slider (200px)
const maxSlider = 200;
const midSilder = maxSlider/2;
const lowSlider = maxSlider * 4/5;

const thumbPosition = ref(maxSlider/2);
const slider = ref(null);
const selectedColor = ref("");
const taskNamesPriority = ref({
    lowPrioTask: '',
    midPrioTask: '',
    highPrioTask: '',
});

let isDragging = false;



function setPrioInput(prioType){
    if(prioType == 'red'){
        thumbPosition.value = 0;
    }else if(prioType == 'yellow'){
        thumbPosition.value = midSilder;
    }else if(prioType == 'blue'){
        thumbPosition.value = lowSlider;
    }
}

function trafficLightSliderDrag(e){
    if(!isDragging || !slider.value) return;

    const rect = slider.value.getBoundingClientRect();
    const y = event.clientY - (rect.top); 
    const max = rect.height;

    thumbPosition.value = Math.min(max, Math.max(0, y));        
    
}

function trafficLightSliderClick(e){
    if(!slider.value) return;

    const rect = slider.value.getBoundingClientRect();
    const y = event.clientY - rect.top; 
    const max = rect.height;

    thumbPosition.value = Math.min(max, Math.max(0, y));        
    
}

function interpolateIndexFromPosition(pos){
    const index = Math.round(0 + ((pos - 0) * (store.allTasksLength(uiStore.getUiState.category) - 1 - 0)) / (maxSlider - 0));
    return index;
}

watch(thumbPosition, async (newPosition, oldPosition) => {

    if(Math.round(newPosition) != Math.round(oldPosition)){
        if(uiStore.getUiState.currentTask._id){
            uiStore.setEdit(uiStore.getUiState.currentTask._id)
            
            // Get priority score of index
            const priorityScoreAtIndex = store.getTaskPriorityByIndex(interpolateIndexFromPosition(newPosition))

            if(priorityScoreAtIndex != -1){
                if(store.setTaskPriority(uiStore.getUiState.currentTask._id, uiStore.getUiState.category, priorityScoreAtIndex + 1, interpolateIndexFromPosition(newPosition))){
                    
                    uiStore.setEdit(uiStore.getUiState.currentTask._id)
                }
            }

            // 
            
        }
    }
})



onMounted(() => {
    const ticketTitleLength = 30;

    taskNamesPriority.value.highPrioTask = store.getTaskByIndex(uiStore.getUiState.category, interpolateIndexFromPosition(0)).title.substring(0,ticketTitleLength);
    taskNamesPriority.value.midPrioTask = store.getTaskByIndex(uiStore.getUiState.category, interpolateIndexFromPosition(midSilder)).title.substring(0,ticketTitleLength);
    taskNamesPriority.value.lowPrioTask = store.getTaskByIndex(uiStore.getUiState.category, interpolateIndexFromPosition(lowSlider)).title.substring(0,ticketTitleLength);
})

</script>



<style>

.traffic-light-wrapper{
    display: flex;
    justify-content: center;
}

.traffic-light-color-picker {
    height: 200px;
    margin: 0px 10px 0px 10px;
    text-align: center;
    display: flex
}

.traffic-light-color-input{
    display: flex; 
    flex-direction: column;
    justify-content: space-between;
    margin: 5px;
}

.traffic-light-color-block-red{
    background: red;
}
.traffic-light-color-block-yellow{
    background: yellow;
}
.traffic-light-color-block-blue{
    background: blue;
}

.task-name{
    background-color: #f0f0f0;
    border: 1px solid #d3d3d3; 
    border-radius: 3px;
    padding: 0px 5px 0px 5px;
}

.task-name:hover {
    background-color: #f5f5f5;
    transition: filter 0.2s;
}   


.traffic-light-color-block{
    height: 25px;
    width: 50px;
    border-radius: 15px;
    cursor: pointer;
    border: 1px solid #ccc;
    font-family: din-round,sans-serif;
    font-size: 15px;
    font-weight: 700;
    border-radius: 16px;
    border-width: 0 0 4px;

}

.traffic-light-color-slider {
    position: relative;
    width: 15px;
    background: linear-gradient(to bottom, red, yellow, blue);
    border-radius: 15px;
    cursor: pointer;
    border: 1px solid #ccc;
    margin-right: 15px;
    padding: 5px 0px 5px 0px;
}

.traffic-light-slider-thumb {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 22px;
    height: 22px;
    background-color: #fff;
    border: 2px solid #ccc;
    border-radius: 20px;
    cursor: grab;
    pointer-events: all;
}


</style>