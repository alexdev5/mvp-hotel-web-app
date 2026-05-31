<template>
    <div class="container">
        <div class="page-header">
            <h1>Бронювання номерів</h1>
            <p class="page-subtitle">Створення та перегляд бронювань</p>
        </div>

        <div class="content-wrapper">
            <div class="form-section">
                <h2>Створити бронювання</h2>
                <form @submit.prevent>
                    <div class="form-group">
                        <label for="guestSelect">Клієнт *</label>
                        <select id="guestSelect" required>
                            <option value="">Оберіть клієнта</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="roomTypeSelect">Тип номера *</label>
                        <select id="roomTypeSelect" required>
                            <option value="">Оберіть тип</option>
                            <option value="standard">Стандарт</option>
                            <option value="comfort">Комфорт</option>
                            <option value="lux">Люкс</option>
                            <option value="president">Президентський</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="bookingCheckIn">Дата заїзду *</label>
                        <input type="date" id="bookingCheckIn" required />
                    </div>

                    <div class="form-group">
                        <label for="bookingCheckOut">Дата виїзду *</label>
                        <input type="date" id="bookingCheckOut" required />
                    </div>

                    <div class="form-group">
                        <label for="guests">Кількість гостей *</label>
                        <input
                            type="number"
                            id="guests"
                            required
                            min="1"
                            value="1"
                        />
                    </div>

                    <div class="availability-message"></div>

                    <button type="submit" class="btn-primary">Забронювати</button>
                </form>
            </div>

            <div class="list-section">
                <h2>Активні бронювання</h2>
                <div class="bookings-list"></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup></script>

<style lang="scss"></style>
