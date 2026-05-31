<template>
    <header>
        <div class="header-actions">
            <div class="flex gap-16 ai-center">
                <RouterLink :to="{ name: RouteName.Home }"> Головна</RouterLink>
            </div>
            <a href="https://github.com/alexdev5" target="_blank">github.com</a>
        </div>

        <AppNavigation />
    </header>
</template>

<script lang="ts" setup>
import AppNavigation from './app-navigation.component.vue'

import { RouteName } from '@/router'
</script>

<style lang="scss">
@use '@/styles/utils/media' as *;

header {
    display: grid;
    gap: 8px;
    background-color: var(--app-color-n-96);
    padding-block: 16px 24px;
    padding-inline: 24px;
    position: relative;
    z-index: 1;

    box-shadow:
        0px 1px 2px 0px rgba(0, 0, 0, 0.3),
        0px 2px 6px 2px rgba(0, 0, 0, 0.15);

    .header-title {
        font-size: 1rem;

        @include mobile {
            font-size: 1.4rem;
        }
    }

    .nav-menu {
        margin-block-start: 16px;
    }

    .header-actions {
        display: flex;
        justify-content: space-between;
    }

    .show-more {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 4px 10px;

        span {
            font-size: 1.3rem;
            font-weight: 400;
        }
    }
}
</style>
