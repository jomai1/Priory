import { mount, findComponent } from '@vue/test-utils';
import { beforeEach, describe, it, expect, vi } from "vitest"
import { useRoute } from 'vue-router'
import { createPinia, setActivePinia } from "pinia" 

import CreateTask from '../CreateTask.vue';


vi.mock('vue-router')

// Todo:
// 1. 

describe("CreateTask", () => {

	beforeEach(() => {
		setActivePinia(createPinia())
	})

	// Tests if component takes categories from url query string
	it("Set category from url query", () => {
		const category = "Some category"

		useRoute.mockReturnValue({
			query: {
				category,
			},
		})

		const wrapper = mount(CreateTask, {
			shallow: true,
		})

		expect(wrapper.vm.categories).toContain("Some category");
	})

	// Tests if all standard elements are present
	it("Text/Category input and buttons present", () => {
		const wrapper = mount(CreateTask);

        const inputWrapper = wrapper.find('input.text-input');
        const categoryInputWrapper = wrapper.find('input.category-input-field');
        const buttonWrappers = wrapper.findAll('button');

        expect(inputWrapper.exists()).toBe(true)
        expect(categoryInputWrapper.exists()).toBe(true)
        expect(buttonWrappers[0].exists()).toBe(true)
        expect(buttonWrappers[1].exists()).toBe(true)
	})

	// Tests title is set on submit
	it("Input text and submit", async () => {
		const inputText = 'This is a test New';

		const wrapper = mount(CreateTask);

		// Replace the original function with the mock
		const submitTaskMock = vi.fn();
		wrapper.vm.submitTask = submitTaskMock;

        const inputWrapper = wrapper.find('input.text-input');
        const categoryInputWrapper = wrapper.find('input.category-input-field');

        // Tests if task title input and category input are present
        expect(inputWrapper.exists()).toBe(true);

		await inputWrapper.setValue(inputText);

		// check if the value inside inputWrapper is equal to inputText
        expect(inputWrapper.element.value).toBe(inputText);

        const submitBtn = wrapper.findAll('button.btn')[1];
        await submitBtn.trigger('click');


		expect(wrapper.vm.title).toBe(inputText);
		expect(submitTaskMock).toHaveBeenCalledTimes(1);

		submitTaskMock.mockRestore();
	})
});	