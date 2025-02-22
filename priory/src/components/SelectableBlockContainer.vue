<template>
    <div v-for="(buildingBlock, index) in selectables" @click.prevent.stop>
        <!-- div block that check for the type using v-if and render the desired building block! -->

        <hr v-if="index != 0" class="solid-divider" />

        <div
            v-if="buildingBlock.blockType == 'text-block'"
            class="action-block"
        >
            <label class="input-label" for="title"
                >{{ buildingBlock.title }}:
                <RichTextEditor 
                    :buildingBlock="buildingBlock"
                    @update-rich-text="updateBuildingBlockValue"
                />
            </label>

        </div>

        <div
            v-if="buildingBlock.blockType == 'todo-list-block'"
            class="action-block"
        >
            <label class="input-label" for="title"
                >{{ buildingBlock.title }}:

                <TodoList
                    :buildingBlock="buildingBlock"
                    @update-todo="updateBuildingBlockValue"
                />

            </label>
        </div>

        <div
            v-if="buildingBlock.blockType == 'traffic-light-block'"
            class="action-block"
        >
            <TrafficLight :buildingBlock="buildingBlock"/>
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

async function updateBuildingBlockValue(value, id){
    const answer = await store.updateSelectableBlock(uiStore.ui.currentTask._id, id, value);
    // TODO: Handle error
}



</script>
<style>

</style>
