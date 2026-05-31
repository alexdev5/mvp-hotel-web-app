<template>
    <div class="container">
        <div class="page-header">
            <h1>Реєстрація відвідувачів</h1>
            <p class="page-subtitle">Введення даних про клієнтів готелю</p>
        </div>

        <div class="content-wrapper">
            <!-- ---------- Form ---------- -->
            <div class="form-section">
                <h2>{{ editingId ? 'Редагувати відвідувача' : 'Додати відвідувача' }}</h2>

                <form @submit.prevent="onSubmit">
                    <div class="form-group">
                        <label for="fullName">ПІБ *</label>
                        <input
                            v-model="form.fullName"
                            type="text"
                            id="fullName"
                            required
                            placeholder="Іванов Іван Іванович"
                        />
                        <p v-if="fieldError('fullName')" class="field-error">
                            {{ fieldError('fullName') }}
                        </p>
                    </div>

                    <div class="form-group">
                        <label for="passport">Паспорт *</label>
                        <input
                            v-model="form.passport"
                            type="text"
                            id="passport"
                            required
                            placeholder="АА123456"
                        />
                        <p v-if="fieldError('passport')" class="field-error">
                            {{ fieldError('passport') }}
                        </p>
                    </div>

                    <div class="form-group">
                        <label for="phone">Телефон *</label>
                        <input
                            v-model="form.phone"
                            type="tel"
                            id="phone"
                            required
                            placeholder="+380991234567"
                        />
                        <p v-if="fieldError('phone')" class="field-error">
                            {{ fieldError('phone') }}
                        </p>
                    </div>

                    <div class="form-group">
                        <label for="email">Email</label>
                        <input
                            v-model="form.email"
                            type="email"
                            id="email"
                            placeholder="example@mail.com"
                        />
                        <p v-if="fieldError('email')" class="field-error">
                            {{ fieldError('email') }}
                        </p>
                    </div>

                    <div class="form-group">
                        <label for="roomSelect">Номер для поселення *</label>
                        <select
                            v-model="form.room"
                            id="roomSelect"
                            required
                            :disabled="!rooms.length"
                        >
                            <option value="">
                                {{
                                    rooms.length
                                        ? 'Оберіть номер'
                                        : 'Немає створених номерів'
                                }}
                            </option>
                            <option
                                v-for="room in rooms"
                                :key="room.id"
                                :value="room.number"
                            >
                                Номер {{ room.number }} — {{ roomTypeLabel(room.type) }},
                                {{ room.price }} грн/доба ({{ roomStatusLabel(room.status) }})
                            </option>
                        </select>
                        <p v-if="fieldError('room')" class="field-error">
                            {{ fieldError('room') }}
                        </p>
                        <p
                            v-if="
                                editingId &&
                                form.room === '' &&
                                editingGuest
                            "
                            class="field-error"
                        >
                            Попередній номер ({{ editingGuest.room }}) відсутній
                            у списку. Оберіть новий.
                        </p>
                    </div>

                    <div class="form-group">
                        <label for="checkIn">Дата заїзду *</label>
                        <input
                            v-model="form.checkIn"
                            type="date"
                            id="checkIn"
                            required
                        />
                        <p v-if="fieldError('checkIn')" class="field-error">
                            {{ fieldError('checkIn') }}
                        </p>
                    </div>

                    <div class="form-group">
                        <label for="checkOut">Дата виїзду *</label>
                        <input
                            v-model="form.checkOut"
                            type="date"
                            id="checkOut"
                            required
                        />
                        <p v-if="fieldError('checkOut')" class="field-error">
                            {{ fieldError('checkOut') }}
                        </p>
                    </div>

                    <p v-if="error" class="field-error">{{ error }}</p>

                    <button type="submit" class="btn-primary" :disabled="submitting">
                        {{
                            submitting
                                ? 'Зачекайте…'
                                : editingId
                                    ? 'Зберегти зміни'
                                    : 'Зареєструвати'
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
                title="Зареєстровані відвідувачі"
                :loadingTitle="inProgressTitle"
                :records="guests"
            >
                <div v-for="guest in guests" :key="guest.id" class="list-item">
                    <h4>{{ guest.fullName }}</h4>
                    <p><strong>Паспорт:</strong> {{ guest.passport }}</p>
                    <p><strong>Телефон:</strong> {{ guest.phone }}</p>
                    <p><strong>Email:</strong> {{ guest.email || 'Не вказано' }}</p>
                    <p><strong>Номер:</strong> {{ guest.room }}</p>
                    <p><strong>Заїзд:</strong> {{ formatDate(guest.checkIn) }}</p>
                    <p><strong>Виїзд:</strong> {{ formatDate(guest.checkOut) }}</p>
                    <div class="item-actions">
                        <button
                            type="button"
                            class="btn-edit"
                            @click="startEdit(guest)"
                        >
                            Редагувати
                        </button>
                        <button
                            type="button"
                            class="btn-delete"
                            @click="onDelete(guest)"
                        >
                            Видалити
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
    guestsApi,
    roomsApi,
    type Guest,
    type GuestPayload,
    type Room,
    type RoomStatus,
    type RoomType,
} from '@/api'
import ListingBlock from '@/components/layout/listing-block.vue'

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

const roomTypeLabel = (t: RoomType) => roomTypeLabels[t] ?? t
const roomStatusLabel = (s: RoomStatus) => roomStatusLabels[s] ?? s

// ---------- State ----------
interface GuestForm {
    fullName: string
    passport: string
    phone: string
    email: string
    room: string
    checkIn: string
    checkOut: string
}

function emptyForm(): GuestForm {
    return {
        fullName: '',
        passport: '',
        phone: '',
        email: '',
        room: '',
        checkIn: '',
        checkOut: '',
    }
}

const guests = ref<Guest[]>([])
const rooms = ref<Room[]>([])
const loading = ref(false)
const removing = ref(false)
const submitting = ref(false)
const error = ref<string | null>(null)
const validation = ref<Record<string, string[]>>({})
const editingId = ref<string | null>(null)
const form = reactive<GuestForm>(emptyForm())

const editingGuest = computed<Guest | null>(
    () => guests.value.find((g) => g.id === editingId.value) ?? null,
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
    // <input type="date"> wants exactly YYYY-MM-DD.
    return formatDate(value)
}

async function loadAll() {
    loading.value = true
    error.value = null
    try {
        const [guestsRes, roomsRes] = await Promise.all([
            guestsApi.list(),
            roomsApi.list(),
        ])
        guests.value = guestsRes
        rooms.value = roomsRes
    } catch (e) {
        error.value =
            e instanceof ApiError ? e.message : 'Не вдалось завантажити дані'
    } finally {
        loading.value = false
    }
}

async function onSubmit() {
    if (form.room === '') return

    const payload: GuestPayload = {
        fullName: form.fullName.trim(),
        passport: form.passport.trim(),
        phone: form.phone.trim(),
        room: form.room,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
    }
    const email = form.email.trim()
    if (email) payload.email = email

    submitting.value = true
    error.value = null
    validation.value = {}

    try {
        if (editingId.value) {
            const updated = await guestsApi.update(editingId.value, payload)
            const idx = guests.value.findIndex((g) => g.id === editingId.value)
            if (idx !== -1) guests.value.splice(idx, 1, updated)
            cancelEdit()
        } else {
            const created = await guestsApi.create(payload)
            guests.value.push(created)
            resetForm()
        }
    } catch (e) {
        if (e instanceof ApiError) {
            error.value = e.message
            validation.value = e.validation ?? {}
        } else {
            error.value = 'Не вдалось зберегти відвідувача'
        }
    } finally {
        submitting.value = false
    }
}

function startEdit(guest: Guest) {
    editingId.value = guest.id
    form.fullName = guest.fullName
    form.passport = guest.passport
    form.phone = guest.phone
    form.email = guest.email ?? ''
    // If the previously assigned room was deleted from the system, leave empty —
    // the UI will warn that the old room is missing and force re-selection.
    form.room = rooms.value.some((r) => r.number === guest.room) ? guest.room : ''
    form.checkIn = toDateInput(guest.checkIn)
    form.checkOut = toDateInput(guest.checkOut)
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

async function onDelete(guest: Guest) {
    if (!confirm(`Видалити відвідувача "${guest.fullName}"?`)) return
    removing.value = true

    try {
        await guestsApi.remove(guest.id)
        guests.value = guests.value.filter((g) => g.id !== guest.id)
        if (editingId.value === guest.id) cancelEdit()
    } catch (e) {
        error.value =
            e instanceof ApiError ? e.message : 'Не вдалось видалити відвідувача'
    } finally {
        removing.value = false
    }
}

onMounted(loadAll)
</script>

<style lang="scss"></style>
