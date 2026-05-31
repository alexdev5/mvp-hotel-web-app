<template>
    <nav class="navbar">
        <RouterLink :to="{ name: RouteName.Home }" class="nav-brand">
            <span>Готель</span>
        </RouterLink>

        <div class="nav-links">
            <RouterLink
                v-if="$route.name !== RouteName.Home"
                :to="{ name: RouteName.Home }"
                class="btn-secondary"
            >
                Головна
            </RouterLink>
            <button type="button" class="btn-logout">Вихід</button>
        </div>
    </nav>
</template>

<script lang="ts" setup>
import { RouteName } from '@/router'
</script>

<style lang="scss">
.navbar {
    .nav-brand {
        text-decoration: none;
        cursor: pointer;
    }
}
</style>
