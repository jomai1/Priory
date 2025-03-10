import { defineStore } from "pinia";

export const useUiStore = defineStore("uiStore", {
    state: () => ({
        ui: {
            category: '',
            categoryIndex: 0,
            currentTask: {},
            hoverID: 0,
            editID: 0,
            taskPreviewRef: '',
            createTask: false,
            mouseEvent: {
                isDragging: false,
                startX: 0,
                startY: 0,
            }
        },
    }),
    getters: {
        getUiState: (state) => {
            return state.ui;
        },
        isEdit: (state) => {
            if(state.ui.editID == state.ui.currentTask._id) return true;
            return false;
        },
        isHover: (state) => {
            if(state.ui.hoverID == state.ui.currentTask._id) return true;
            return false;
        },
        isInCreateMode: (state) => {
            return state.ui.createTask;
        }

    },
    actions: {
        hoverOver(id) {
            this.ui.hoverID = id;
        },
        setEdit(id) {
            if(this.ui.mouseEvent.isDragging) return

            this.ui.editID = id;
        },
        setCreateMode(boolToggleMode){
            this.ui.createTask = boolToggleMode;
        },
        changeTask(task) {
            if(this.ui.mouseEvent.isDragging) return

            this.ui.currentTask = task;
        },
        changeCategory(categories, category) {
            if(this.ui.mouseEvent.isDragging) return

            this.ui.currentTask = {};
            this.ui.category = category;
            this.ui.categoryIndex = categories.findIndex(
                (el) => el == category,
            );
        },
        decreaseCategoryIndex(categories){
            this.ui.categoryIndex = (this.ui.categoryIndex) % categories.length  - 1;

            if(this.ui.categoryIndex < 0){
                this.ui.categoryIndex = categories.length - 1;
            }

            this.ui.category = categories[this.ui.categoryIndex]
        },
        increaseCategoryIndex(categories){
            this.ui.categoryIndex = (this.ui.categoryIndex + 1) % categories.length;
            this.ui.category = categories[this.ui.categoryIndex]
        },
        initCategory(categories){
            this.ui.categoryIndex = 0
            this.ui.category = categories[this.ui.categoryIndex]
        },
        onMouseDown(event){
            this.ui.mouseEvent.isDragging = false;

            this.ui.mouseEvent.startX = event.clientX;
            this.ui.mouseEvent.startY = event.clientY;
        },
        async onMouseUp(event){
            if(!this.ui.mouseEvent.startX && !this.ui.mouseEvent.startY) this.ui.mouseEvent.isDragging = false;

            const deltaX = Math.abs(event.clientX - this.ui.mouseEvent.startX);
            const deltaY = Math.abs(event.clientY - this.ui.mouseEvent.startY);

            if (deltaX > 5 || deltaY > 5) {
                this.ui.mouseEvent.isDragging = true;
            }
        },
    },
});
