<template>
    <div class="container">
        <div class="page-header">
            <h1>Розрахунок вартості</h1>
            <p class="page-subtitle">
                Підрахунок загальної вартості проживання зі знижками
            </p>
        </div>

        <div class="calculation-wrapper">
            <div class="form-section">
                <h2>Розрахувати вартість</h2>
                <form @submit.prevent>
                    <div class="form-group">
                        <label for="calcGuestSelect">Клієнт *</label>
                        <select id="calcGuestSelect" required>
                            <option value="">Оберіть клієнта</option>
                        </select>
                    </div>

                    <button type="button" class="btn-primary">
                        Розрахувати вартість
                    </button>
                </form>
            </div>

            <div class="result-section" style="margin-top: 30px">
                <h2>Результат розрахунку</h2>
                <div class="calculation-result">
                    <div class="result-item">
                        <span class="result-label">Клієнт:</span>
                        <span class="result-value"></span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Номер:</span>
                        <span class="result-value"></span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Період проживання:</span>
                        <span class="result-value"></span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Кількість діб:</span>
                        <span class="result-value"></span>
                    </div>
                    <div class="result-divider"></div>
                    <div class="result-item">
                        <span class="result-label">Вартість номера:</span>
                        <span class="result-value"></span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Знижка на номер:</span>
                        <span class="result-value"></span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Додаткові послуги:</span>
                        <span class="result-value"></span>
                    </div>
                    <div class="result-divider"></div>
                    <div class="result-item total">
                        <span class="result-label">ЗАГАЛЬНА ВАРТІСТЬ:</span>
                        <span class="result-value"></span>
                    </div>
                </div>

                <div class="services-details"></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup></script>

<style lang="scss"></style>
