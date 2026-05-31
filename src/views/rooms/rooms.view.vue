<template>
    <div class="container">
        <div class="page-header">
            <h1>Управління номерами</h1>
            <p class="page-subtitle">Додавання та редагування номерів готелю</p>
        </div>

        <div class="content-wrapper">
            <div class="form-section">
                <h2>Додати новий номер</h2>
                <form @submit.prevent>
                    <div class="form-group">
                        <label for="roomNumber">Номер кімнати *</label>
                        <input
                            type="text"
                            id="roomNumber"
                            required
                            placeholder="Наприклад: 101"
                        />
                    </div>

                    <div class="form-group">
                        <label for="roomType">Тип номера *</label>
                        <select id="roomType" required>
                            <option value="">Оберіть тип</option>
                            <option value="standard">Стандарт</option>
                            <option value="comfort">Комфорт</option>
                            <option value="lux">Люкс</option>
                            <option value="president">Президентський</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="price">Вартість за добу (грн) *</label>
                        <input
                            type="number"
                            id="price"
                            required
                            min="0"
                            placeholder="1000"
                        />
                    </div>

                    <div class="form-group">
                        <label for="discount">Знижка (%) *</label>
                        <input
                            type="number"
                            id="discount"
                            required
                            min="0"
                            max="100"
                            value="0"
                            placeholder="0"
                        />
                    </div>

                    <div class="form-group">
                        <label for="status">Статус *</label>
                        <select id="status" required>
                            <option value="available">Вільний</option>
                            <option value="occupied">Зайнятий</option>
                            <option value="cleaning">На прибиранні</option>
                        </select>
                    </div>

                    <button type="submit" class="btn-primary">Додати номер</button>
                </form>
            </div>

            <div class="list-section">
                <h2>Список номерів</h2>
                <div class="rooms-list"></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup></script>

<style lang="scss"></style>
