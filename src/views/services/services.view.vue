<template>
    <div class="container">
        <div class="page-header">
            <h1>Додаткові послуги</h1>
            <p class="page-subtitle">Харчування, прибирання та інші послуги</p>
        </div>

        <div class="content-wrapper">
            <div class="form-section">
                <h2>Додати послугу клієнту</h2>
                <form @submit.prevent>
                    <div class="form-group">
                        <label for="serviceGuestSelect">Клієнт *</label>
                        <select id="serviceGuestSelect" required>
                            <option value="">Оберіть клієнта</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="serviceType">Тип послуги *</label>
                        <select id="serviceType" required>
                            <option value="">Оберіть послугу</option>
                            <option value="breakfast">Сніданок (200 грн)</option>
                            <option value="lunch">Обід (350 грн)</option>
                            <option value="dinner">Вечеря (400 грн)</option>
                            <option value="cleaning">
                                Додаткове прибирання (300 грн)
                            </option>
                            <option value="laundry">Пральня (250 грн)</option>
                            <option value="transfer">Трансфер (500 грн)</option>
                            <option value="spa">SPA-процедури (800 грн)</option>
                            <option value="parking">
                                Паркування (150 грн/доба)
                            </option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="quantity">Кількість *</label>
                        <input
                            type="number"
                            id="quantity"
                            required
                            min="1"
                            value="1"
                        />
                    </div>

                    <div class="form-group">
                        <label for="serviceDate">Дата надання послуги *</label>
                        <input type="date" id="serviceDate" required />
                    </div>

                    <button type="submit" class="btn-primary">Додати послугу</button>
                </form>
            </div>

            <div class="list-section">
                <h2>Надані послуги</h2>
                <div class="services-list"></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup></script>

<style lang="scss"></style>
