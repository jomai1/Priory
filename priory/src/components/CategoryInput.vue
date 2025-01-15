<template>
    <label class="input-label" for="category">{{edit ? 'Enter Categories': '' }}
		<div class="category-input">
			<div class="categories">
				<span
					v-for="(category, index) in categories"
					:key="index"
					class="category category-added"
					:class="{categoryAdded: edit}"
					@click="() => {
						if(edit) removeCategory(index)
					}"
				>
					{{ category }}
				</span>
			</div>

			<hr class="solid-divider" v-if="edit">
			<div class="categories" v-if="edit">

				<span
					v-for="(category, index) in furtherCategories"
					:key="index"
					class="category category-inactive"
					@click="addCategory(category)"
				>
					{{ category }}
				</span>
			</div>

			<input
				v-if="edit"
				type="text"
				class="category-input-field"
				v-model="newCategory"
				@keyup.enter="
					addCategory(newCategory);
					newCategory = '';
				"
				placeholder="Add a category ..."
			/>
		</div>
    </label>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

import { taskStore } from "../stores/store.js";
const store = taskStore();

const emit = defineEmits(["removeCategory", "addCategory"]);
const props = defineProps({
	categories: {},
	edit: true,
});

var newCategory = ref("");
var furtherCategories = ref([]);

function addCategory(newCategory) {
	const trimmedCategory = newCategory.trim();

	if (trimmedCategory && !props.categories.includes(trimmedCategory)) {
		emit("addCategory", trimmedCategory);
	}
}

function removeCategory(index) {
	emit("removeCategory", index);
}

watch(props.categories, () => {

	console.log("store.allCategories")
	console.log(store.allCategories)

	furtherCategories.value = store.allCategories.filter(
		(el) => !props.categories.includes(el),
	);
});

onMounted(async () => {
	await store.getTasks();
	furtherCategories.value = store.allCategories.filter(
		(el) => !props.categories.includes(el),
	);
});
</script>

<style>
.category-input {
	flex-wrap: wrap;
	gap: 8px;
}

.categories {
	margin: 3px 0px 3px 0px;
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
}

.category {
	font-family: "Arial", "Helvetica", sans-serif;
	color: #676767;
	align-items: center;
	margin: 0px 10px 0px 0px;
	padding: 5px 10px;
	border-radius: 3px;
	font-size: 14px;
	text-align: right;
}

.category-added {
	background-color: #c3e5cf;
}

.categoryAdded:hover {
	background-color: #e5c6c3;
}

.category-inactive {
	background-color: #f2f2f2;
}

.category-inactive:hover {
	background-color: #c3e5cf;
}

.category-input-field {
	border: none;
	outline: none;
	padding: 5px 8px;
	font-size: 14px;
}
</style>
