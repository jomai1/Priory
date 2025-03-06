import { mount } from '@vue/test-utils';
import { beforeEach, describe, it, expect, vi } from "vitest";
import { createTestingPinia } from '@pinia/testing'

import { nextTick } from 'vue';


import CategoryInput from '../CategoryInput.vue';
import { useTaskStore } from '../../stores/store.js'

const tmpTasks = [
	{
		"_id":"67c1b1ee1d0dace4bbc6f274",
		"title":"<p>Avoid duplicate ticket creation.</p>",
		"categories":["Category 1"],
		"status": "active",
	},
	{
		"_id":"67c1c1ee1d0dace4bbc6f274",
		"title":"<p>Some test.</p>",
		"categories":["Category 2"],
		"status": "active",
	},
	{
		"_id":"67c1c1ee1d0dace4bbc6f274",
		"title":"<p>Some test.</p>",
		"categories":["Category 1", "Category x"],
		"status": "active",
	}]


describe("CategoryInput", () => {

	// 
	it("Render with values in store", async () => {
		const categories = ["Test Category"];
		const edit = true;

		const wrapper = mount(CategoryInput, {
            props: { 
            	categories,
            	edit,
            },
            global: {
			    plugins: [
			    	createTestingPinia({
				    	initialState: {
				    		tasks: {
					          tasks: tmpTasks,
					        }
					    }
					}
			    )],
			},
        });

        const store = useTaskStore();

        await nextTick()
        
        console.log(wrapper.vm.categories)
        console.log(wrapper.vm.allCategories)
        console.log(wrapper.html())
	})
});