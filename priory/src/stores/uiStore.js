import { defineStore } from "pinia";

export const useUiStore = defineStore("uiStore", {
    state: () => ({
        ui: {
            category: '',
            categoryIndex: 0,
            currentTask: {},
            hoverID: 0,
            editID: 0,
        },
    }),
    getters: {
        getUiState: (state) => {
            console.log(state.ui)
            return state.ui;
        },

    },
    actions: {
        hoverOver(id) {
            this.ui.hoverID = id;
        },
        setEdit(id) {
            this.ui.editID = id;
        },
        changeTask(task) {
            this.ui.currentTask = task;
        },
        changeCategory(categories, category) {
            this.ui.currentTask = {};
            this.ui.category = category;
            this.ui.categoryIndex = categories.findIndex(
                (el) => el == category,
            );
        },
        iterateCategoryIndex(categories){
            this.ui.categoryIndex = (this.ui.categoryIndex + 1) % categories.length;
            this.ui.category = categories[this.ui.categoryIndex]
        },
        initCategory(categories){
            this.ui.categoryIndex = 0
            this.ui.category = categories[this.ui.categoryIndex]
        }
    },
});
