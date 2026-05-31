<template>
    <div class="container">
        <div class="page-header">
            <h1>Перегляд даних</h1>
            <p class="page-subtitle">Звіти та статистика готелю</p>
        </div>

        <!-- ---------- Tabs ---------- -->
        <div class="hotel-tabs">
            <button
                v-for="tab in tabs"
                :key="tab.value"
                type="button"
                class="hotel-tab-btn"
                :class="{ active: activeTab === tab.value }"
                @click="activeTab = tab.value"
            >
                {{ tab.label }}
            </button>
        </div>

        <p v-if="loading" class="empty-message">Завантаження…</p>
        <p v-else-if="error" class="field-error">{{ error }}</p>

        <template v-else>
            <!-- ---------- Rooms ---------- -->
            <div v-if="activeTab === 'rooms'" class="tab-content active">
                <div class="table-wrapper">
                    <h2>Номери готелю</h2>
                    <table v-if="rooms.length" class="data-table">
                        <thead>
                            <tr>
                                <th>№ Номера</th>
                                <th>Тип</th>
                                <th>Ціна за добу</th>
                                <th>Знижка</th>
                                <th>Статус</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="room in rooms" :key="room.id">
                                <td>{{ room.number }}</td>
                                <td>{{ roomTypeLabel(room.type) }}</td>
                                <td>{{ room.price }} грн</td>
                                <td>{{ room.discount }}%</td>
                                <td>
                                    <span :class="`status-${room.status}`">
                                        {{ roomStatusLabel(room.status) }}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <p v-else class="empty-message">Номерів ще не додано</p>
                </div>
            </div>

            <!-- ---------- Guests ---------- -->
            <div v-if="activeTab === 'guests'" class="tab-content active">
                <div class="table-wrapper">
                    <h2>Зареєстровані відвідувачі</h2>
                    <table v-if="guests.length" class="data-table">
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
                        <tbody>
                            <tr v-for="guest in guests" :key="guest.id">
                                <td>{{ guest.fullName }}</td>
                                <td>{{ guest.passport }}</td>
                                <td>{{ guest.phone }}</td>
                                <td>{{ guest.email || '—' }}</td>
                                <td>{{ guest.room }}</td>
                                <td>{{ formatDate(guest.checkIn) }}</td>
                                <td>{{ formatDate(guest.checkOut) }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <p v-else class="empty-message">Відвідувачів ще не зареєстровано</p>
                </div>
            </div>

            <!-- ---------- Bookings ---------- -->
            <div v-if="activeTab === 'bookings'" class="tab-content active">
                <div class="table-wrapper">
                    <h2>Бронювання номерів</h2>
                    <table v-if="bookings.length" class="data-table">
                        <thead>
                            <tr>
                                <th>Клієнт</th>
                                <th>Телефон</th>
                                <th>Тип номера</th>
                                <th>Заїзд</th>
                                <th>Виїзд</th>
                                <th>Гостей</th>
                                <th>Статус</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="booking in bookings" :key="booking.id">
                                <td>{{ booking.guestName }}</td>
                                <td>{{ booking.guestPhone }}</td>
                                <td>{{ roomTypeLabel(booking.roomType) }}</td>
                                <td>{{ formatDate(booking.checkIn) }}</td>
                                <td>{{ formatDate(booking.checkOut) }}</td>
                                <td>{{ booking.guests }}</td>
                                <td>{{ booking.status }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <p v-else class="empty-message">Бронювань ще немає</p>
                </div>
            </div>

            <!-- ---------- Services ---------- -->
            <div v-if="activeTab === 'services'" class="tab-content active">
                <div class="table-wrapper">
                    <h2>Надані послуги</h2>
                    <table v-if="services.length" class="data-table">
                        <thead>
                            <tr>
                                <th>Клієнт</th>
                                <th>Номер</th>
                                <th>Послуга</th>
                                <th>Кількість</th>
                                <th>Ціна</th>
                                <th>Дата</th>
                                <th>Сума</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="service in services" :key="service.id">
                                <td>{{ service.guestName }}</td>
                                <td>{{ service.guestRoom }}</td>
                                <td>
                                    {{
                                        service.serviceName ||
                                        serviceLabel(service.serviceType)
                                    }}
                                </td>
                                <td>{{ service.quantity }}</td>
                                <td>{{ service.price }} грн</td>
                                <td>{{ formatDate(service.date) }}</td>
                                <td>{{ service.totalPrice }} грн</td>
                            </tr>
                        </tbody>
                    </table>
                    <p v-else class="empty-message">Послуг ще не надано</p>
                </div>
            </div>
        </template>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import {
    ApiError,
    bookingsApi,
    guestsApi,
    roomsApi,
    servicesApi,
    type Booking,
    type Guest,
    type Room,
    type RoomStatus,
    type RoomType,
    type Service,
    type ServiceType,
} from '@/api'

// ---------- Tabs ----------
type TabValue = 'rooms' | 'guests' | 'bookings' | 'services'

const tabs: { value: TabValue; label: string }[] = [
    { value: 'rooms', label: 'Номери' },
    { value: 'guests', label: 'Відвідувачі' },
    { value: 'bookings', label: 'Бронювання' },
    { value: 'services', label: 'Послуги' },
]

const activeTab = ref<TabValue>('rooms')

// ---------- Labels ----------
const roomTypeLabels: Record<RoomType, string> = {
    standard: 'Стандарт',
    comfort: 'Комфорт',
    lux: 'Люкс',
    president: 'Президентський',
}

const roomStatusLabels: Record<RoomStatus, string> = {
    available: 'Вільний',
    occupied: 'Зайнятий',
    cleaning: 'На прибиранні',
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
const roomStatusLabel = (s: RoomStatus) => roomStatusLabels[s] ?? s
const serviceLabel = (s: ServiceType) => serviceLabels[s] ?? s

function formatDate(value: string): string {
    return value ? value.slice(0, 10) : ''
}

// ---------- State ----------
const rooms = ref<Room[]>([])
const guests = ref<Guest[]>([])
const bookings = ref<Booking[]>([])
const services = ref<Service[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

// ---------- Data fetching ----------
async function loadAll() {
    loading.value = true
    error.value = null
    try {
        const [roomsRes, guestsRes, bookingsRes, servicesRes] = await Promise.all([
            roomsApi.list(),
            guestsApi.list(),
            bookingsApi.list(),
            servicesApi.list(),
        ])
        rooms.value = roomsRes
        guests.value = guestsRes
        bookings.value = bookingsRes
        services.value = servicesRes
    } catch (e) {
        error.value = e instanceof ApiError ? e.message : 'Не вдалось завантажити дані'
    } finally {
        loading.value = false
    }
}

onMounted(loadAll)
</script>

<style lang="scss"></style>
