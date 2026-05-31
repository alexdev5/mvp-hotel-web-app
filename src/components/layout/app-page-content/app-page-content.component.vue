<template>
    <div class="app-page-content-wrapper">
        <aside>
            <ul class="aside-navigation">
                <li
                    class="aside-navigation-item"
                    v-for="record in records"
                    :class="{
                        active:
                            navigationItemActive === record.id ||
                            parentNavigationActive(record),
                    }"
                >
                    <button @click="selectNavigation(record.id)">
                        {{ record.label }}
                    </button>

                    <template v-if="record.children?.length">
                        <ul class="aside-navigation-children">
                            <li
                                class="aside-navigation-item"
                                v-for="child in record.children"
                                :class="{
                                    active: navigationItemActive === child.id,
                                }"
                            >
                                <button @click="selectNavigation(child.id)">
                                    {{ child.label }}
                                </button>
                            </li>
                        </ul>
                    </template>
                </li>
            </ul>
        </aside>
        <div class="app-page-content">
            <slot />
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { AsideNavigationRecord } from '../types.ts'

const props = defineProps<{
    records: AsideNavigationRecord[]
    navigationItemActive: number
}>()
const emit = defineEmits(['navigation-selected'])

function parentNavigationActive(record: AsideNavigationRecord) {
    if (!record.children?.length) return false

    return Boolean(
        record.children.find((item) => item.id === props.navigationItemActive)
    )
}

function selectNavigation(navigationId: number) {
    emit('navigation-selected', navigationId)
}
</script>

<style lang="scss">
@use './app-page-content.style' as *;
</style>
