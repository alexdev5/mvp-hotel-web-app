<template>
    <div class="list-section">
        <h2>{{ title }}</h2>
        <div class="list-section-items">
            <div v-if="loadingTitle" class="in-progress-block">
                <p>{{ loadingTitle }}</p>
            </div>

            <p v-else-if="!records.length" class="empty-message">
                Нічого не додано
            </p>

            <slot></slot>
        </div>
    </div>
</template>
<script setup lang="ts">
const props = defineProps<{
    records: any[]
    loadingTitle: string
    title: string
}>()
</script>
<style scoped lang="scss">

</style>