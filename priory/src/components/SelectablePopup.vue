<template>
    <div v-if="visible" class="overlay" @click.self="close">
        <div class="popup">
            <div class="header">
                <h2>Select Icons</h2>
                <button class="close-btn" @click="$emit('closePopup', {})">
                    ✖
                </button>
            </div>
            <div class="selectables-categories">
                <div
                    v-for="(groupOfSelectable, category) in selectables"
                    class="selectables-category-container"
                >
                    <h3 class="selectables-category-title">{{ category }}</h3>
                    <div class="selectable-grid">
                        <div
                            v-for="selectable in groupOfSelectable"
                            :key="selectable.title"
                            class="selectable"
                            @click="submitSelectable(selectable)"
                        >
                            <img
                                :src="selectable.image"
                                alt="selectable preview"
                                class="selectable-image"
                            />
                            <div class="selectable-details">
                                <h5>{{ selectable.title }}</h5>
                                <p>{{ selectable.description }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { v4 as uuidv4 } from "uuid";

const emit = defineEmits(["closePopup"]);

const props = defineProps({
    visible: Boolean,
});

const selectables = {
    "Basic Blocks": [
        {
            title: "Description",
            image: "/text.png",
            description: "Add a Description Block",
            placeholder: "Enter a description",
            blockType: "text-block",
            value: "",
        },
        // { title: "Image", image: "/image.png", description: "Add a Image" },
        {
            title: "Todo List",
            image: "/todo_list.png",
            description: "Add a Todo List",
            placeholder: "Enter todo title, hit enter",
            blockType: "todo-list-block",
            value: [],
        },
        {
            title: "Table",
            image: "/table.png",
            description: "Add a Table",
            placeholder: "Enter Table columns and rows.",
            blockType: "table-block",
            value: [],
        },
        // { title: "Embedded URL", image: "/todo_list.png", description: "Add a Embedded URL" },
    ],
    "Classification System": [
        {
            title: "Traffic Light Priority",
            image: "/traffic_lights.png",
            description: "Prioritize using red, yellow, or green labels",
            placeholder: "Select low, mid, or high priority",
            blockType: "traffic-light-block",
            value: -1,
        },
        {
            title: "Eisenhower Matrix",
            image: "/matrix.png",
            description: "Prioritize using the Eisenhower Matrix",
        }
    ],
    "Execution System": [
        {
            title: "Pomodoro",
            image: "/pomodoro.png",
            description: "Add Pomodoro timer",
        },
        {
            title: "Time Tracking",
            image: "/time_tracking.png",
            description: "Track time of the exectution",
        },
    ],
    Scheduling: [
        {
            title: "Time Blocking",
            image: "/time_blocking.png",
            description: "Schedule Time Blocking",
        },
        {
            title: "Due Date",
            image: "/due_date.png",
            description: "Schedule using a single Due Date",
        },
        {
            title: "Daily Activity Schdule",
            image: "/time_blocking.png",
            description: "Schedule using a daily Activity Schdule",
        },
    ],
};

function submitSelectable(selected) {
        
    // add unique ID for later query.
    selected._id = uuidv4();

    // emit selectedComp
    emit("closePopup", selected);
}
</script>
<style>
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease-out;
}

.popup {
    position: relative;
    background: white;
    border-radius: 8px;
    max-width: 600px;
    width: 90%;
    max-height: 90vh;
    /* 90% of the viewport height */
    overflow-y: auto;
    /* Enable scrolling if content exceeds height */
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    padding: 20px;
    animation:
        fadeIn 0.3s ease-out,
        slideUp 0.3s ease-out;
}

.popup-content {
    max-height: calc(90vh - 50px);
    /* Ensure space for padding and close button */
    overflow-y: auto;
    /* Scroll content if necessary */
}

.selectables-category-container {
    margin: 15px 0 25px 5px;
}

.selectables-category-title {
    font-size: 18px;
    margin-bottom: 10px;
    color: gray;
}

.selectable-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 20px;
    margin-left: 10px;
}

.selectable {
    cursor: pointer;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 10px;
    text-align: center;
    background: #f9f9f9;
    transition:
        transform 0.2s,
        border 0.2s;
}

.selectable:hover {
    transform: scale(1.05);
    border-color: blue;
}

.selectable.selected {
    border: 2px solid blue;
    background-color: #e0f7ff;
}

.selectable-image {
    width: 50px;
    height: 50px;
    object-fit: contain;
    margin-bottom: 5px;
}

.selectable-details h5 {
    font-weight: bold;
    color: #555;
}

.selectable-details p {
    margin: 5px 0 0 0;
    font-size: 12px;
    color: #555;
}

.submit-btn-container-local {
    margin-top: 10px;
    text-align: center;
}
</style>
