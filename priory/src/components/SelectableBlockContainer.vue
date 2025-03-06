<template>
    <div v-for="(buildingBlock, index) in localSelectables" @click.prevent.stop>
        <!-- div block that check for the type using v-if and render the desired building block! -->

        <hr v-if="index != 0" class="solid-divider" />
        
        <div class="building-block">

            <div
            class="small-header">
                <p>{{buildingBlock.title}}</p>
                <button
                    v-if="
                        (uiStore.isEdit && uiStore.isHover) ||
                        (uiStore.isInCreateMode && localSelectables.length)
                    "
                    class="close-btn delete-selectable-btn"
                    @click="deleteSelectable(buildingBlock._id, index)"
                >
                    ✖
                </button>
            </div>    

            <div
                v-if="buildingBlock.blockType == 'text-block'"
                class="action-block"
            >
                    <RichTextEditor
                        :buildingBlock="buildingBlock"
                        @update-rich-text="updateBuildingBlockValue"
                        :class="'custom-rich-text-editor'"
                    />
            </div>

            <div
                v-if="buildingBlock.blockType == 'todo-list-block'"
                class="action-block"
            >


                    <TodoList
                        :buildingBlock="buildingBlock"
                        @update-todo="updateBuildingBlockValue"
                    />
            </div>

            <div
                v-if="buildingBlock.blockType == 'traffic-light-block'"
                class="action-block"
            >
                <TrafficLight :buildingBlock="buildingBlock" />
            </div>

        </div>
    </div>
</template>
<script setup>
import { ref } from "vue";

import TrafficLight from "../components/buildingBlocks/TrafficLight.vue";
import RichTextEditor from "../components/buildingBlocks/RichTextEditor.vue";
import TodoList from "../components/buildingBlocks/TodoList.vue";

// Store
import { useTaskStore } from "../stores/store.js";
import { useUiStore } from "../stores/uiStore";

const store = useTaskStore();
const uiStore = useUiStore();

const props = defineProps({
    selectables: Array,
});

var localSelectables = ref(props.selectables)

async function deleteSelectable(blockID, index) {


    if(uiStore.isInCreateMode){

        console.log("IN create mode")
        console.log(blockID)

        localSelectables.value.splice(index, 1)
        return;
    }


    const answer = await store.deleteSelectableBlock(
        uiStore.ui.currentTask._id,
        blockID,
    );
}

async function updateBuildingBlockValue(value, id) {
    // TODO: Handle creation of building block. Cannot be saved to db because no task entity is present.

    if(uiStore.ui.currentTask._id){
        const answer = await store.updateSelectableBlock(
            uiStore.ui.currentTask._id,
            id,
            value,
        );
    }
    
    
}
</script>
<style>

</style>
