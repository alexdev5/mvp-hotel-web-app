<template>
    <div class="container">
        <div class="page-header">
            <h1>Перегляд даних</h1>
            <p class="page-subtitle">Звіти та статистика готелю</p>
        </div>

        <div class="hotel-tabs">
            <button type="button" class="hotel-tab-btn active">Номери</button>
            <button type="button" class="hotel-tab-btn">Відвідувачі</button>
            <button type="button" class="hotel-tab-btn">Бронювання</button>
            <button type="button" class="hotel-tab-btn">Послуги</button>
        </div>

        <div class="tab-content active">
            <div class="table-wrapper">
                <h2>Номери готелю</h2>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>№ Номера</th>
                            <th>Тип</th>
                            <th>Ціна за добу</th>
                            <th>Знижка</th>
                            <th>Статус</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>

        <div class="tab-content">
            <div class="table-wrapper">
                <h2>Зареєстровані відвідувачі</h2>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>ПІБ</th>
                            <th>Паспорт</th>
                            <th>Телефон</th>
                            <th>Email</th>
                            <th>Номер</th>
                            <th>Заїзд</th>
                            <th>Виїзд</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>

        <div class="tab-content">
            <div class="table-wrapper">
                <h2>Бронювання номерів</h2>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Клієнт</th>
                            <th>Тип номера</th>
                            <th>Заїзд</th>
                            <th>Виїзд</th>
                            <th>Гостей</th>
                            <th>Статус</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>

        <div class="tab-content">
            <div class="table-wrapper">
                <h2>Надані послуги</h2>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Клієнт</th>
                            <th>Послуга</th>
                            <th>Кількість</th>
                            <th>Ціна</th>
                            <th>Дата</th>
                            <th>Сума</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup></script>

<style lang="scss"></style>
