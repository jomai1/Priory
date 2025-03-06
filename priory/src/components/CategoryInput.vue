<template>
	<div class="category-input-container">
		<div class="categories" ref="categoryContainer">
			<span
				v-for="(category, index) in allCategories"
				:key="index"
				class="category"
				@click="
					() => {
						if (edit) toggleCategory(category);
					}
				"
				:class="{
					categoryInactive: !categories.includes(category),
					categoryAdded: categories.includes(category),
					categoryAddedHover: edit && categories.includes(category),
				}"
			>
				{{ category }}
			</span>

			<input
				v-if="edit"
				ref="customInput"
				v-model="newCategory"
				:class="'category-input-field input'"
				:placeholder="'Enter a new category ...'"
				@blur="addCategory"
				@keyup.enter="addCategory(newCategory)"
			/>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick, isRef } from "vue";
import { useTaskStore } from "../stores/store.js";

const store = useTaskStore();

const emit = defineEmits(["removeCategory", "addCategory"]);
const props = defineProps({
	categories: Array,
	edit: false,
});

const newCategory = ref("");
const categoryContainer = ref(null);
const allCategories = ref([]);

function toggleCategory(category) {
	if (props.categories.includes(category)) {
		emit("removeCategory", category);
	} else {
		emit("addCategory", category);
	}
}

async function addCategory(newCategoryTitle) {
	const trimmedCategory = newCategory.value.trim();

	if (trimmedCategory && !props.categories.includes(trimmedCategory)) {
		emit("addCategory", trimmedCategory);
		newCategory.value = "";

		await nextTick(() => {
			if (!categoryContainer.value) {
				return;
			}

			const container = categoryContainer.value;
			container.scrollLeft = 0;
		});
	}
}

function prioritizeSubset(parentArray, subsetArray) {
	const subsetSet = new Set(subsetArray);

	if(parentArray.length == 0){
		return subsetArray;
	}

	// what if parent and subsetArray are the same?

	return parentArray.sort((a, b) => {
		const aInSubset = subsetSet.has(a);
		const bInSubset = subsetSet.has(b);

		if (aInSubset && bInSubset) return 0;
		if (!aInSubset && !bInSubset) return 0;

		return aInSubset ? -1 : 1;
	});

}

function onlyUnique(value, index, array) {
	return array.indexOf(value) === index;
}

watch(
	() => props.edit,
	() => {
		if (props.edit) {
			allCategories.value = prioritizeSubset(store.allCategories, props.categories);
		} else {
			allCategories.value = props.categories;
		}
	},
);

watch(
	() => props.categories,
	() => {
		if (props.edit) {
			allCategories.value = prioritizeSubset(allCategories.value, props.categories);
		} else {
			allCategories.value = props.categories;
		}
	},
	{ deep: true },
);

function beforeUnloadHandler(event) {
	localStorage.setItem("categories", JSON.stringify(allCategories.value));
}

onMounted(async () => {

	// If the user refreshed the store data is lost. This will recover the data which was saved.
	if(props.edit && localStorage.getItem("categories") !== null){
		console.log(JSON.parse(localStorage.getItem("categories")).length)
		console.log(allCategories.value.length)
		if(JSON.parse(localStorage.getItem("categories")).length > allCategories.value.length){
			allCategories.value = JSON.parse(localStorage.getItem("categories"));
		}	
	}else if (props.edit) {
		allCategories.value = prioritizeSubset(store.allCategories, props.categories);
	}else{
		allCategories.value = props.categories;
	}


	

	window.addEventListener("beforeunload", beforeUnloadHandler);
});

onBeforeUnmount(() => {
	// Cleanup for the stored data.
	window.removeEventListener("beforeunload", beforeUnloadHandler);
	localStorage.clear();
});
</script>

<style>
.category-input-field {
	background-color: white;
	align-items: center;
	margin: 0px 25px 10px 0px;
	font-size: 14px;
}

.category-input-field:focus {
	outline: none;
}

.category {
	color: var(--vt-c-text-grey-1);
	cursor: pointer;
}

.category-input {
	margin-right: 10px;
	flex-wrap: wrap;
	gap: 8px;
}

.categories {
	margin: 3px 0px 3px 0px;
	display: flex;
	gap: 8px;
	overflow-x: auto;
	white-space: nowrap;
	:hover {
	}
}

.category {
	font-family: "Arial", "Helvetica", sans-serif;
	align-items: center;
	margin: 0px 10px 10px 0px;
	padding: 5px 10px;
	border-radius: 3px;
	font-size: 14px;
	text-align: right;
}

.categoryAdded {
	background-color: #c3e5cf;
}

.categoryAddedHover:hover {
	background-color: #e5c6c3;
}

.categoryInactive {
	background-color: #f2f2f2;
}

.categoryInactive:hover {
	background-color: #c3e5cf;
}

.input {
	border: 1px solid #ccc;
	border-radius: 16px;
	padding: 8px 12px;
	width: auto;
}
</style>
