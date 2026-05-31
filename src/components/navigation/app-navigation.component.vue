<template>
    <nav class="nav-menu">
        <RouterLink
            v-for="route in routes"
            :to="{ name: route.name }"
            class="nav-menu-item"
        >
            {{ route.label }}
        </RouterLink>
    </nav>
</template>

<script lang="ts" setup>
import { RouteName } from '@/router'

const routes = [{ name: RouteName.Work_3, label: 'Практикум 3' }]
</script>

<style lang="scss">
@use '@/styles/utils/media' as *;

.nav-menu {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;

    a {
        text-decoration: none;
    }
}

.nav-menu-item {
    border: 1px solid var(--app-color-p-40);
    padding: 8px 16px;
    border-radius: 10px;
    transition: all 0.2s linear;
    background: var(--app-color-secondary);
    font-size: 0.8rem;
    width: 100%;

    &:hover,
    &.router-link-active {
        background-color: var(--app-color-p-40);
        color: var(--app-color-secondary);
    }

    @include mobile-s {
        width: auto;
    }

    @include mobile {
        font-size: 0.95rem;
    }
}
</style>
