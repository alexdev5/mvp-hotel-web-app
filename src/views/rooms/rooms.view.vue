<template>
    <div class="container">
        <div class="page-header">
            <h1>Управління номерами</h1>
            <p class="page-subtitle">Додавання та редагування номерів готелю</p>
        </div>

        <div class="content-wrapper">
            <!-- ---------- Form ---------- -->
            <div class="form-section">
                <h2>{{ editingId ? 'Редагувати номер' : 'Додати новий номер' }}</h2>

                <form @submit.prevent="onSubmit">
                    <div class="form-group">
                        <label for="roomNumber">Номер кімнати *</label>
                        <input
                            v-model="form.number"
                            type="text"
                            id="roomNumber"
                            required
                            placeholder="Наприклад: 101"
                        />
                        <p v-if="fieldError('number')" class="field-error">
                            {{ fieldError('number') }}
                        </p>
                    </div>

                    <div class="form-group">
                        <label for="roomType">Тип номера *</label>
                        <select v-model="form.type" id="roomType" required>
                            <option value="">Оберіть тип</option>
                            <option
                                v-for="type in roomTypes"
                                :key="type.value"
                                :value="type.value"
                            >
                                {{ type.label }}
                            </option>
                        </select>
                        <p v-if="fieldError('type')" class="field-error">
                            {{ fieldError('type') }}
                        </p>
                    </div>

                    <div class="form-group">
                        <label for="price">Вартість за добу (грн) *</label>
                        <input
                            v-model.number="form.price"
                            type="number"
                            id="price"
                            required
                            min="0"
                            placeholder="1000"
                        />
                        <p v-if="fieldError('price')" class="field-error">
                            {{ fieldError('price') }}
                        </p>
                    </div>

                    <div class="form-group">
                        <label for="discount">Знижка (%) *</label>
                        <input
                            v-model.number="form.discount"
                            type="number"
                            id="discount"
                            required
                            min="0"
                            max="100"
                            placeholder="0"
                        />
                        <p v-if="fieldError('discount')" class="field-error">
                            {{ fieldError('discount') }}
                        </p>
                    </div>

                    <div class="form-group">
                        <label for="status">Статус *</label>
                        <select v-model="form.status" id="status" required>
                            <option
                                v-for="status in roomStatuses"
                                :key="status.value"
                                :value="status.value"
                            >
                                {{ status.label }}
                            </option>
                        </select>
                        <p v-if="fieldError('status')" class="field-error">
                            {{ fieldError('status') }}
                        </p>
                    </div>

                    <p v-if="error" class="field-error">{{ error }}</p>

                    <button type="submit" class="btn-primary" :disabled="submitting">
                        {{
                            submitting
                                ? 'Зачекайте…'
                                : editingId
                                    ? 'Зберегти зміни'
                                    : 'Додати номер'
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
                title="Список номерів"
                :loadingTitle="inProgressTitle"
                :records="rooms"
            >
                <div v-for="room in rooms" :key="room.id" class="list-item">
                    <h4>Номер {{ room.number }}</h4>
                    <p><strong>Тип:</strong> {{ typeLabel(room.type) }}</p>
                    <p><strong>Ціна:</strong> {{ room.price }} грн/доба</p>
                    <p><strong>Знижка:</strong> {{ room.discount }}%</p>
                    <p>
                        <strong>Статус:</strong>
                        <span class="status" :class="`status-${room.status}`">
                                {{ statusLabel(room.status) }}
                            </span>
                    </p>
                    <div class="item-actions">
                        <button
                            type="button"
                            class="btn-edit"
                            @click="startEdit(room)"
                        >
                            Редагувати
                        </button>
                        <button
                            type="button"
                            class="btn-delete"
                            @click="onDelete(room)"
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
import { ApiError, type Room, type RoomPayload, roomsApi, type RoomStatus, type RoomType } from '@/api'
import ListingBlock from '@/components/layout/listing-block.vue'

const roomTypes: { value: RoomType; label: string }[] = [
    { value: 'standard', label: 'Стандарт' },
    { value: 'comfort', label: 'Комфорт' },
    { value: 'lux', label: 'Люкс' },
    { value: 'president', label: 'Президентський' },
]

const roomStatuses: { value: RoomStatus; label: string }[] = [
    { value: 'available', label: 'Вільний' },
    { value: 'occupied', label: 'Зайнятий' },
    { value: 'cleaning', label: 'На прибиранні' },
]

const typeLabels: Record<RoomType, string> = Object.fromEntries(
    roomTypes.map((t) => [t.value, t.label]),
) as Record<RoomType, string>

const statusLabels: Record<RoomStatus, string> = Object.fromEntries(
    roomStatuses.map((s) => [s.value, s.label]),
) as Record<RoomStatus, string>

const typeLabel = (t: RoomType) => typeLabels[t] ?? t
const statusLabel = (s: RoomStatus) => statusLabels[s] ?? s

// ---------- State ----------
interface RoomForm {
    number: string
    type: '' | RoomType
    price: number | ''
    discount: number | ''
    status: RoomStatus
}

function emptyForm(): RoomForm {
    return {
        number: '',
        type: '',
        price: '',
        discount: 0,
        status: 'available',
    }
}

const rooms = ref<Room[]>([])
const loading = ref(false)
const removing = ref(false)
const submitting = ref(false)
const error = ref<string | null>(null)
const validation = ref<Record<string, string[]>>({})
const editingId = ref<string | null>(null)
const form = reactive<RoomForm>(emptyForm())

const fieldError = (name: string) => validation.value[name]?.[0]
const inProgressTitle = computed(() => {
    if (loading.value) {
        return 'Завантаження...'
    } else if (removing.value) {
        return 'Видалення...'
    } else if (submitting.value) {
        return 'Збереження...'
    }
    return ''
})

async function loadRooms() {
    loading.value = true
    error.value = null
    try {
        rooms.value = await roomsApi.list()
    } catch (e) {
        error.value = e instanceof ApiError ? e.message : 'Не вдалось завантажити номери'
    } finally {
        loading.value = false
    }
}

async function onSubmit() {
    if (form.type === '' || form.price === '' || form.discount === '') return

    const payload: RoomPayload = {
        number: form.number.trim(),
        type: form.type,
        price: Number(form.price),
        discount: Number(form.discount),
        status: form.status,
    }

    submitting.value = true
    error.value = null
    validation.value = {}

    try {
        if (editingId.value) {
            const updated = await roomsApi.update(editingId.value, payload)
            const idx = rooms.value.findIndex((r) => r.id === editingId.value)
            if (idx !== -1) rooms.value.splice(idx, 1, updated)
            cancelEdit()
        } else {
            const created = await roomsApi.create(payload)
            rooms.value.push(created)
            resetForm()
        }
    } catch (e) {
        if (e instanceof ApiError) {
            error.value = e.message
            validation.value = e.validation ?? {}
        } else {
            error.value = 'Не вдалось зберегти номер'
        }
    } finally {
        submitting.value = false
    }
}

function startEdit(room: Room) {
    editingId.value = room.id
    form.number = room.number
    form.type = room.type
    form.price = room.price
    form.discount = room.discount
    form.status = room.status
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

async function onDelete(room: Room) {
    if (!confirm(`Видалити номер ${room.number}?`)) return
    removing.value = true

    try {
        await roomsApi.remove(room.id)
        rooms.value = rooms.value.filter((r) => r.id !== room.id)
        if (editingId.value === room.id) cancelEdit()
    } catch (e) {
        error.value = e instanceof ApiError ? e.message : 'Не вдалось видалити номер'
    } finally {
        removing.value = false
    }
}

onMounted(loadRooms)
</script>

<style lang="scss">
.field-error {
    color: #d32f2f;
    font-size: 13px;
    margin-top: 6px;
}

.empty-message {
    text-align: center;
    color: #666;
    padding: 20px;
}

.btn-cancel {
    width: 100%;
    margin-top: 12px;
    padding: 14px;
    background: var(--hotel-light-bg);
    color: var(--hotel-dark-text);
    border: 2px solid transparent;
    border-radius: 15px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-cancel:hover {
    background: var(--hotel-pastel-purple);
}

.btn-primary:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: 0 5px 20px rgba(255, 16, 240, 0.2);
}
</style>
