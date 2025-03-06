<template>
    <editor-content :editor="editor"/>
</template>

<script setup>    

import { ref } from "vue";

import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

const emit = defineEmits(['updateRichText'])

const props = defineProps({
    buildingBlock: {},
    class: '',
});

const editor = useEditor({
    extensions: [StarterKit],
    content: props.buildingBlock.value,
    onUpdate: ({editor}) => {
        emit('updateRichText', editor.getHTML(), props.buildingBlock._id)
    },
    editorProps: {
        attributes: {
          class: props.class,
        },
    },
})
</script>



<style>
</style>