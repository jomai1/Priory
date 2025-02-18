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
});

const editor = useEditor({
    extensions: [StarterKit],
    content: props.buildingBlock.value,
    onUpdate: ({editor}) => {
        emit('updateRichText', editor.getHTML(), props.buildingBlock._id)
    }
})
</script>



<style>

    .tiptap {
        background-color: white;
        width: 100%;
        padding: 0px 10px;
        display: inline-block;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;

        p{
            margin: 5px 0px 5px 0px;
        }

        code {
            background-color: var(--purple-light);
            border-radius: 0.4rem;
            color: var(--black);
            font-size: 0.85rem;
            padding: 0.25em 0.3em;
        }
    }
</style>