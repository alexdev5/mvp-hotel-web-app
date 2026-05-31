<template>
    <div class="container">
        <div class="page-header">
            <h1>Реєстрація відвідувачів</h1>
            <p class="page-subtitle">Введення даних про клієнтів готелю</p>
        </div>

        <div class="content-wrapper">
            <div class="form-section">
                <h2>Додати відвідувача</h2>
                <form @submit.prevent>
                    <div class="form-group">
                        <label for="fullName">ПІБ *</label>
                        <input
                            type="text"
                            id="fullName"
                            required
                            placeholder="Іванов Іван Іванович"
                        />
                    </div>

                    <div class="form-group">
                        <label for="passport">Паспорт *</label>
                        <input
                            type="text"
                            id="passport"
                            required
                            placeholder="АА123456"
                        />
                    </div>

                    <div class="form-group">
                        <label for="phone">Телефон *</label>
                        <input
                            type="tel"
                            id="phone"
                            required
                            placeholder="+380991234567"
                        />
                    </div>

                    <div class="form-group">
                        <label for="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="example@mail.com"
                        />
                    </div>

                    <div class="form-group">
                        <label for="roomSelect">Номер для поселення *</label>
                        <select id="roomSelect" required>
                            <option value="">Оберіть номер</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="checkIn">Дата заїзду *</label>
                        <input type="date" id="checkIn" required />
                    </div>

                    <div class="form-group">
                        <label for="checkOut">Дата виїзду *</label>
                        <input type="date" id="checkOut" required />
                    </div>

                    <button type="submit" class="btn-primary">Зареєструвати</button>
                </form>
            </div>

            <div class="list-section">
                <h2>Зареєстровані відвідувачі</h2>
                <div class="guests-list"></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup></script>

<style lang="scss"></style>
