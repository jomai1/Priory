<template>
    <div class="content-container">
        <router-view></router-view>
    </div>
</template>
<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>
<style scoped>
.content-container {
    max-width: 700px;
    margin: 0 auto;
    user-select: none;
}
</style>