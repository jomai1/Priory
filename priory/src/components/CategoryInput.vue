<template>
	<label class="input-label" for="category"
		>{{ edit ? "Enter Categories:" : "Categories:" }}
		<div class="category-input">
			<div class="categories">
				<span
					v-for="(category, index) in allCategories"
					:key="index"
					class="category"
					@click="() => {if(edit) toggleCategory(category)}"
					:class="{categoryInactive: !categories.includes(category), categoryAdded: categories.includes(category), categoryAddedHover: (edit && categories.includes(category))}"
				>	
					{{ category }}
				</span>
				<span
					v-if="edit && !isAddingCategory"
					class="category-input-field btn add-btn"
					@click="startAddingCategory"
				>
					➕
				</span>
				<input
				v-if="edit && isAddingCategory"
				v-model="newCategory"
	      class="category-input-field input"
	      @blur="addCategory"
	      @keyup.enter="addCategory(newCategory)"
	      placeholder="New category..."
	      ref="categoryInput"
			/>
			</div>

			

		</div>
	</label>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from "vue";

import { useTaskStore } from "../stores/store.js";
const store = useTaskStore();

const emit = defineEmits(["removeCategory", "addCategory"]);
const props = defineProps({
	categories: Array,
	edit: false,
});

const newCategory = ref("");
const categoryInput = ref("");
const allCategories = ref([]);
const isAddingCategory = ref(false);




function toggleCategory(category){
	console.log(category)

	if(props.categories.includes(category)){
		emit("removeCategory", category);
	}else{
		emit("addCategory", category);
	}
}

async function startAddingCategory(){
	isAddingCategory.value = true;
	
	await nextTick(() => {
		if (categoryInput.value) categoryInput.value.focus();
		const container = categoryInput.value.closest('.categories');
    container.scrollLeft = container.scrollWidth; 
	});
};	

async function addCategory(newCategory){
	const trimmedCategory = newCategory.trim();

	if (trimmedCategory && !props.categories.includes(trimmedCategory)) {
		emit("addCategory", trimmedCategory);
		categoryInput.value = '';


		await nextTick(() => {
			const container = categoryInput.value.closest('.categories');
		  container.scrollLeft = 0;
		});
	}

	isAddingCategory.value = false;
}

function prioritizeSubset(parentArray, subsetArray) {
  const subsetSet = new Set(subsetArray);

  return parentArray.sort((a, b) => {
    const aInSubset = subsetSet.has(a);
    const bInSubset = subsetSet.has(b);

    if (aInSubset && bInSubset) return 0;
    if (!aInSubset && !bInSubset) return 0;

    return aInSubset ? -1 : 1;
  });
}


watch(() => props.edit, () => {
	if(props.edit){
		allCategories.value = store.allCategories
		
		prioritizeSubset(allCategories.value, props.categories)
	}else{
		allCategories.value = props.categories
	}
});

watch(() => props.categories, () => {
	if(props.edit){
		allCategories.value = store.allCategories
		
		prioritizeSubset(allCategories.value, props.categories)
	}else{
		allCategories.value = props.categories
	}
},
	{ deep: true }
);


onMounted(async () => {
	console.log("On mount")
	if(props.edit){
		allCategories.value = store.allCategories

		prioritizeSubset(allCategories.value, props.categories)
	}else{
		allCategories.value = props.categories
	}
});
</script>

<style>
.hidden {
	visibility: hidden;
}

.category-input {
	margin-left: 10px;
	flex-wrap: wrap;
	gap: 8px;
}

.categories {
	margin: 3px 0px 3px 0px;
	display: flex;
	gap: 8px;
	overflow-x: auto;
	white-space: nowrap;
	:hover{

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

.category-input-field{
	font-family: "Arial", "Helvetica", sans-serif;
	color: #676767;
	align-items: center;
	margin: 0px 10px 10px 0px;
	padding: 5px 10px;
	font-size: 14px;	
}

.category-input-field:focus {
	outline: none;
}

.input {
  border: 1px solid #ccc;
  border-radius: 16px;
  padding: 8px 12px;
  width: auto;
}
</style>
