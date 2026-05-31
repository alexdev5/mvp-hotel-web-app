<template>
    <div class="container">
        <div class="page-header">
            <h1>Головне меню</h1>
            <p class="page-subtitle">Оберіть необхідний розділ для роботи</p>
        </div>

        <div class="menu-grid">
            <RouterLink :to="{ name: RouteName.Rooms }" class="menu-card">
                <h3>Управління номерами</h3>
                <p>Додавання, редагування та перегляд номерів готелю</p>
            </RouterLink>

            <RouterLink :to="{ name: RouteName.Guests }" class="menu-card">
                <h3>Реєстрація відвідувачів</h3>
                <p>Введення даних про клієнтів готелю</p>
            </RouterLink>

            <RouterLink :to="{ name: RouteName.Bookings }" class="menu-card">
                <h3>Бронювання номерів</h3>
                <p>Створення та перегляд бронювань</p>
            </RouterLink>

            <RouterLink :to="{ name: RouteName.Services }" class="menu-card">
                <h3>Додаткові послуги</h3>
                <p>Харчування, прибирання, трансфер</p>
            </RouterLink>

            <RouterLink :to="{ name: RouteName.Calculation }" class="menu-card">
                <h3>Розрахунок вартості</h3>
                <p>Підрахунок вартості зі знижками</p>
            </RouterLink>

            <RouterLink :to="{ name: RouteName.DataView }" class="menu-card">
                <h3>Перегляд даних</h3>
                <p>Звіти та статистика готелю</p>
            </RouterLink>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { RouteName } from '@/router'
</script>

<style lang="scss"></style>
