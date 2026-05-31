<template>
    <div class="container">
        <div class="page-header">
            <h1>Бронювання номерів</h1>
            <p class="page-subtitle">Створення та перегляд бронювань</p>
        </div>

        <div class="content-wrapper">
            <!-- ---------- Form ---------- -->
            <div class="form-section">
                <h2>{{ editingId ? 'Редагувати бронювання' : 'Створити бронювання' }}</h2>

                <form @submit.prevent="onSubmit">
                    <div class="form-group">
                        <label for="guestSelect">Клієнт *</label>
                        <select
                            v-model="form.guestId"
                            id="guestSelect"
                            required
                            :disabled="!guests.length"
                        >
                            <option value="">
                                {{
                                    guests.length
                                        ? 'Оберіть клієнта'
                                        : 'Немає зареєстрованих клієнтів'
                                }}
                            </option>
                            <option
                                v-for="guest in guests"
                                :key="guest.id"
                                :value="guest.id"
                            >
                                {{ guest.fullName }} ({{ guest.phone }})
                            </option>
                        </select>
                        <p v-if="fieldError('guestName')" class="field-error">
                            {{ fieldError('guestName') }}
                        </p>
                        <p v-if="fieldError('guestPhone')" class="field-error">
                            {{ fieldError('guestPhone') }}
                        </p>
                        <p
                            v-if="
                                editingId &&
                                form.guestId === '' &&
                                editingBooking
                            "
                            class="field-error"
                        >
                            Попередній клієнт ({{ editingBooking.guestName }})
                            відсутній у списку. Оберіть нового.
                        </p>
                    </div>

                    <div class="form-group">
                        <label for="roomTypeSelect">Тип номера *</label>
                        <select v-model="form.roomType" id="roomTypeSelect" required>
                            <option value="">Оберіть тип</option>
                            <option
                                v-for="type in roomTypes"
                                :key="type.value"
                                :value="type.value"
                            >
                                {{ type.label }}
                            </option>
                        </select>
                        <p v-if="fieldError('roomType')" class="field-error">
                            {{ fieldError('roomType') }}
                        </p>
                    </div>

                    <div class="form-group">
                        <label for="bookingCheckIn">Дата заїзду *</label>
                        <input
                            v-model="form.checkIn"
                            type="date"
                            id="bookingCheckIn"
                            required
                        />
                        <p v-if="fieldError('checkIn')" class="field-error">
                            {{ fieldError('checkIn') }}
                        </p>
                    </div>

                    <div class="form-group">
                        <label for="bookingCheckOut">Дата виїзду *</label>
                        <input
                            v-model="form.checkOut"
                            type="date"
                            id="bookingCheckOut"
                            required
                        />
                        <p v-if="fieldError('checkOut')" class="field-error">
                            {{ fieldError('checkOut') }}
                        </p>
                    </div>

                    <div class="form-group">
                        <label for="guestsCount">Кількість гостей *</label>
                        <input
                            v-model.number="form.guests"
                            type="number"
                            id="guestsCount"
                            required
                            min="1"
                        />
                        <p v-if="fieldError('guests')" class="field-error">
                            {{ fieldError('guests') }}
                        </p>
                    </div>

                    <p v-if="error" class="field-error">{{ error }}</p>

                    <button type="submit" class="btn-primary" :disabled="submitting">
                        {{
                            submitting
                                ? 'Зачекайте…'
                                : editingId
                                    ? 'Зберегти зміни'
                                    : 'Забронювати'
                        }}
                    </button>

                    <button
                        v-if="editingId"
                        type="button"
                        class="btn-cancel"
                        @click="cancelEdit"
                    >
                        Скасувати редагування
                    </button>
                </form>
            </div>

            <ListingBlock
                title="Активні бронювання"
                :loadingTitle="inProgressTitle"
                :records="bookings"
            >
                <div
                    v-for="booking in bookings"
                    :key="booking.id"
                    class="list-item"
                >
                    <h4>{{ booking.guestName }}</h4>
                    <p><strong>Телефон:</strong> {{ booking.guestPhone }}</p>
                    <p>
                        <strong>Тип номера:</strong>
                        {{ roomTypeLabel(booking.roomType) }}
                    </p>
                    <p><strong>Заїзд:</strong> {{ formatDate(booking.checkIn) }}</p>
                    <p><strong>Виїзд:</strong> {{ formatDate(booking.checkOut) }}</p>
                    <p><strong>Кількість гостей:</strong> {{ booking.guests }}</p>
                    <p><strong>Статус:</strong> {{ booking.status }}</p>
                    <div class="item-actions">
                        <button
                            type="button"
                            class="btn-edit"
                            @click="startEdit(booking)"
                        >
                            Редагувати
                        </button>
                        <button
                            type="button"
                            class="btn-delete"
                            @click="onDelete(booking)"
                        >
                            Скасувати
                        </button>
                    </div>
                </div>
            </ListingBlock>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import {
    ApiError,
    bookingsApi,
    guestsApi,
    type Booking,
    type BookingPayload,
    type Guest,
    type RoomType,
} from '@/api'
import ListingBlock from '@/components/layout/listing-block.vue'

// ---------- Reference data ----------
const roomTypes: { value: RoomType; label: string }[] = [
    { value: 'standard', label: 'Стандарт' },
    { value: 'comfort', label: 'Комфорт' },
    { value: 'lux', label: 'Люкс' },
    { value: 'president', label: 'Президентський' },
]

const roomTypeLabels: Record<RoomType, string> = Object.fromEntries(
    roomTypes.map((t) => [t.value, t.label]),
) as Record<RoomType, string>

const roomTypeLabel = (t: RoomType) => roomTypeLabels[t] ?? t

// ---------- State ----------
interface BookingForm {
    guestId: string
    roomType: '' | RoomType
    checkIn: string
    checkOut: string
    guests: number | ''
}

function emptyForm(): BookingForm {
    return {
        guestId: '',
        roomType: '',
        checkIn: '',
        checkOut: '',
        guests: 1,
    }
}

const bookings = ref<Booking[]>([])
const guests = ref<Guest[]>([])
const loading = ref(false)
const removing = ref(false)
const submitting = ref(false)
const error = ref<string | null>(null)
const validation = ref<Record<string, string[]>>({})
const editingId = ref<string | null>(null)
const form = reactive<BookingForm>(emptyForm())

const editingBooking = computed<Booking | null>(
    () => bookings.value.find((b) => b.id === editingId.value) ?? null,
)

const fieldError = (name: string) => validation.value[name]?.[0]
const inProgressTitle = computed(() => {
    if (loading.value) {
        return 'Завантаження...'
    } else if (removing.value) {
        return 'Видалення...'
    }
    return ''
})

function formatDate(value: string): string {
    if (!value) return ''
    return value.slice(0, 10)
}

function toDateInput(value: string): string {
    return formatDate(value)
}

async function loadAll() {
    loading.value = true
    error.value = null
    try {
        const [bookingsRes, guestsRes] = await Promise.all([
            bookingsApi.list(),
            guestsApi.list(),
        ])
        bookings.value = bookingsRes
        guests.value = guestsRes
    } catch (e) {
        error.value =
            e instanceof ApiError ? e.message : 'Не вдалось завантажити дані'
    } finally {
        loading.value = false
    }
}

async function onSubmit() {
    if (form.roomType === '' || form.guests === '' || form.guestId === '') return

    const guest = guests.value.find((g) => g.id === form.guestId)
    if (!guest) {
        error.value = 'Оберіть клієнта зі списку'
        return
    }

    const payload: BookingPayload = {
        guestName: guest.fullName,
        guestPhone: guest.phone,
        roomType: form.roomType,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        guests: Number(form.guests),
    }

    submitting.value = true
    error.value = null
    validation.value = {}

    try {
        if (editingId.value) {
            const updated = await bookingsApi.update(editingId.value, payload)
            const idx = bookings.value.findIndex((b) => b.id === editingId.value)
            if (idx !== -1) bookings.value.splice(idx, 1, updated)
            cancelEdit()
        } else {
            const created = await bookingsApi.create(payload)
            bookings.value.push(created)
            resetForm()
        }
    } catch (e) {
        if (e instanceof ApiError) {
            error.value = e.message
            validation.value = e.validation ?? {}
        } else {
            error.value = 'Не вдалось зберегти бронювання'
        }
    } finally {
        submitting.value = false
    }
}

function startEdit(booking: Booking) {
    editingId.value = booking.id
    // Match the booking's stored name+phone against the existing guests list.
    // If the original guest was deleted, leave the select empty — UI will warn.
    const matched = guests.value.find(
        (g) =>
            g.fullName === booking.guestName && g.phone === booking.guestPhone,
    )
    form.guestId = matched?.id ?? ''
    form.roomType = booking.roomType
    form.checkIn = toDateInput(booking.checkIn)
    form.checkOut = toDateInput(booking.checkOut)
    form.guests = booking.guests
    error.value = null
    validation.value = {}
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

function cancelEdit() {
    editingId.value = null
    resetForm()
}

function resetForm() {
    Object.assign(form, emptyForm())
    validation.value = {}
}

async function onDelete(booking: Booking) {
    if (!confirm(`Скасувати бронювання "${booking.guestName}"?`)) return
    removing.value = true

    try {
        await bookingsApi.remove(booking.id)
        bookings.value = bookings.value.filter((b) => b.id !== booking.id)
        if (editingId.value === booking.id) cancelEdit()
    } catch (e) {
        error.value =
            e instanceof ApiError ? e.message : 'Не вдалось видалити бронювання'
    } finally {
        removing.value = false
    }
}

onMounted(loadAll)
</script>

<style lang="scss"></style>
