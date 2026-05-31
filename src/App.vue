<template>
    <div class="app-wrapper">
        <AppHeader />

        <div class="app-body">
            <RouterView />
        </div>

        <AppFooter />
    </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/navigation/app-header.component.vue'
import AppFooter from '@/components/navigation/app-footer.component.vue'
</script>
