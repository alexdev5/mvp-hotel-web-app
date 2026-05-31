<template>
    <div class="container">
        <div class="page-header">
            <h1>Розрахунок вартості</h1>
            <p class="page-subtitle">
                Підрахунок загальної вартості проживання зі знижками
            </p>
        </div>

        <div class="calculation-wrapper">
            <!-- ---------- Form ---------- -->
            <div class="form-section">
                <h2>Розрахувати вартість</h2>

                <p v-if="loading" class="empty-message">Завантаження…</p>
                <p v-else-if="loadError" class="field-error">{{ loadError }}</p>

                <form v-else @submit.prevent>
                    <div class="form-group">
                        <label for="calcGuestSelect">Клієнт *</label>
                        <select
                            v-model="selectedGuestId"
                            id="calcGuestSelect"
                            required
                        >
                            <option value="">Оберіть клієнта</option>
                            <option
                                v-for="guest in guests"
                                :key="guest.id"
                                :value="guest.id"
                            >
                                {{ guest.fullName }} (Номер {{ guest.room }})
                            </option>
                        </select>
                    </div>

                    <p v-if="guests.length === 0" class="field-error">
                        Спочатку зареєструйте хоча б одного відвідувача.
                    </p>

                    <p
                        v-else-if="selectedGuest && !calculation"
                        class="field-error"
                    >
                        Номер «{{ selectedGuest.room }}» не знайдено серед кімнат
                        готелю. Додайте його на сторінці «Управління номерами».
                    </p>
                </form>
            </div>

            <!-- ---------- Result ---------- -->
            <div
                v-if="calculation"
                class="result-section"
                style="margin-top: 30px"
            >
                <h2>Результат розрахунку</h2>

                <div class="calculation-result">
                    <div class="result-item">
                        <span class="result-label">Клієнт:</span>
                        <span class="result-value">{{ calculation.guestName }}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Номер:</span>
                        <span class="result-value">
                            {{ calculation.roomNumber }}
                            ({{ roomTypeLabel(calculation.roomType) }})
                        </span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Період проживання:</span>
                        <span class="result-value">
                            {{ calculation.checkIn }} — {{ calculation.checkOut }}
                        </span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Кількість діб:</span>
                        <span class="result-value">{{ calculation.days }}</span>
                    </div>

                    <div class="result-divider"></div>

                    <div class="result-item">
                        <span class="result-label">Вартість номера:</span>
                        <span class="result-value">
                            {{ formatMoney(calculation.roomTotal) }} грн
                        </span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Знижка на номер:</span>
                        <span class="result-value">
                            {{ calculation.discountPercent }}%
                            (−{{ formatMoney(calculation.discountAmount) }} грн)
                        </span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Додаткові послуги:</span>
                        <span class="result-value">
                            {{ formatMoney(calculation.servicesCost) }} грн
                        </span>
                    </div>

                    <div class="result-divider"></div>

                    <div class="result-item total">
                        <span class="result-label">ЗАГАЛЬНА ВАРТІСТЬ:</span>
                        <span class="result-value">
                            {{ formatMoney(calculation.total) }} грн
                        </span>
                    </div>
                </div>

                <div class="services-details">
                    <template v-if="calculation.services.length">
                        <h3>Деталі додаткових послуг:</h3>
                        <div
                            v-for="(service, idx) in calculation.services"
                            :key="service.id ?? idx"
                            class="service-item"
                        >
                            <strong>
                                {{
                                    service.serviceName ||
                                    serviceLabel(service.serviceType)
                                }}
                            </strong>
                            x{{ service.quantity }} =
                            {{ formatMoney(service.totalPrice) }} грн
                            <br />
                            <small>Дата: {{ formatDate(service.date) }}</small>
                        </div>
                    </template>
                    <p v-else class="empty-message">
                        Додаткові послуги не надавалися
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import {
    ApiError,
    guestsApi,
    roomsApi,
    servicesApi,
    type Guest,
    type Room,
    type RoomType,
    type Service,
    type ServiceType,
} from '@/api'

// ---------- Labels ----------
const roomTypeLabels: Record<RoomType, string> = {
    standard: 'Стандарт',
    comfort: 'Комфорт',
    lux: 'Люкс',
    president: 'Президентський',
}

const serviceLabels: Record<ServiceType, string> = {
    breakfast: 'Сніданок',
    lunch: 'Обід',
    dinner: 'Вечеря',
    cleaning: 'Додаткове прибирання',
    laundry: 'Пральня',
    transfer: 'Трансфер',
    spa: 'SPA-процедури',
    parking: 'Паркування',
}

const roomTypeLabel = (t: RoomType) => roomTypeLabels[t] ?? t
const serviceLabel = (s: ServiceType) => serviceLabels[s] ?? s

function formatDate(value: string): string {
    return value ? value.slice(0, 10) : ''
}

function formatMoney(value: number): string {
    return value.toFixed(2)
}

function daysBetween(checkIn: string, checkOut: string): number {
    const inDate = new Date(checkIn).getTime()
    const outDate = new Date(checkOut).getTime()
    if (Number.isNaN(inDate) || Number.isNaN(outDate)) return 0
    return Math.max(0, Math.ceil((outDate - inDate) / 86_400_000))
}

// ---------- State ----------
const rooms = ref<Room[]>([])
const guests = ref<Guest[]>([])
const services = ref<Service[]>([])
const loading = ref(false)
const loadError = ref<string | null>(null)
const selectedGuestId = ref<string>('')

// ---------- Lookups ----------
const selectedGuest = computed<Guest | null>(
    () => guests.value.find((g) => g.id === selectedGuestId.value) ?? null,
)

const selectedRoom = computed<Room | null>(() => {
    const guest = selectedGuest.value
    if (!guest) return null
    return rooms.value.find((r) => r.number === guest.room) ?? null
})

// ---------- Calculation ----------
interface CalculationResult {
    guestName: string
    roomNumber: string
    roomType: RoomType
    checkIn: string
    checkOut: string
    days: number
    roomCostPerDay: number
    roomTotal: number
    discountPercent: number
    discountAmount: number
    roomAfterDiscount: number
    services: Service[]
    servicesCost: number
    total: number
}

const calculation = computed<CalculationResult | null>(() => {
    const guest = selectedGuest.value
    const room = selectedRoom.value
    if (!guest || !room) return null

    const days = daysBetween(guest.checkIn, guest.checkOut)
    const roomCostPerDay = room.price
    const roomTotal = roomCostPerDay * days

    const discountPercent = room.discount ?? 0
    const discountAmount = (roomTotal * discountPercent) / 100
    const roomAfterDiscount = roomTotal - discountAmount

    const guestServices = services.value.filter(
        (s) => s.guestName === guest.fullName,
    )
    const servicesCost = guestServices.reduce(
        (sum, s) => sum + (s.totalPrice ?? 0),
        0,
    )

    return {
        guestName: guest.fullName,
        roomNumber: room.number,
        roomType: room.type,
        checkIn: formatDate(guest.checkIn),
        checkOut: formatDate(guest.checkOut),
        days,
        roomCostPerDay,
        roomTotal,
        discountPercent,
        discountAmount,
        roomAfterDiscount,
        services: guestServices,
        servicesCost,
        total: roomAfterDiscount + servicesCost,
    }
})

// ---------- Data fetching ----------
async function loadAll() {
    loading.value = true
    loadError.value = null
    try {
        const [roomsRes, guestsRes, servicesRes] = await Promise.all([
            roomsApi.list(),
            guestsApi.list(),
            servicesApi.list(),
        ])
        rooms.value = roomsRes
        guests.value = guestsRes
        services.value = servicesRes
    } catch (e) {
        loadError.value =
            e instanceof ApiError ? e.message : 'Не вдалось завантажити дані'
    } finally {
        loading.value = false
    }
}

onMounted(loadAll)
</script>

<style lang="scss">
.calculation-wrapper .result-section h3 {
    margin: 8px 0 12px;
    color: var(--hotel-neon-purple);
}
</style>
