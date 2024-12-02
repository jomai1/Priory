<template>
	<div>
		<label paceholder="Description" class="input-label" for="title">Write a description:
        <textarea 
          class="input-field" 
          type="text" 
          id="description" 
          v-model="description">
        </textarea>
      </label>

      {{description}}
	</div>

</template>

<script setup>

	var description = ''

</script>

<style>

</style>