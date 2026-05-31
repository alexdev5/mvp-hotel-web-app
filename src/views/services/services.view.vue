<template>
    <div class="container">
        <div class="page-header">
            <h1>Додаткові послуги</h1>
            <p class="page-subtitle">Харчування, прибирання та інші послуги</p>
        </div>

        <div class="content-wrapper">
            <!-- ---------- Form ---------- -->
            <div class="form-section">
                <h2>{{ editingId ? 'Редагувати послугу' : 'Додати послугу клієнту' }}</h2>

                <form @submit.prevent="onSubmit">
                    <div class="form-group">
                        <label for="guestName">ПІБ клієнта *</label>
                        <input
                            v-model="form.guestName"
                            type="text"
                            id="guestName"
                            required
                            placeholder="Іванов Іван Іванович"
                        />
                        <p v-if="fieldError('guestName')" class="field-error">
                            {{ fieldError('guestName') }}
                        </p>
                    </div>

                    <div class="form-group">
                        <label for="guestRoom">Номер клієнта *</label>
                        <input
                            v-model="form.guestRoom"
                            type="text"
                            id="guestRoom"
                            required
                            placeholder="Наприклад: 101"
                        />
                        <p v-if="fieldError('guestRoom')" class="field-error">
                            {{ fieldError('guestRoom') }}
                        </p>
                    </div>

                    <div class="form-group">
                        <label for="serviceType">Тип послуги *</label>
                        <select v-model="form.serviceType" id="serviceType" required>
                            <option value="">Оберіть послугу</option>
                            <option
                                v-for="service in serviceTypes"
                                :key="service.value"
                                :value="service.value"
                            >
                                {{ service.label }} ({{ service.price }} грн)
                            </option>
                        </select>
                        <p v-if="fieldError('serviceType')" class="field-error">
                            {{ fieldError('serviceType') }}
                        </p>
                    </div>

                    <div class="form-group">
                        <label for="quantity">Кількість *</label>
                        <input
                            v-model.number="form.quantity"
                            type="number"
                            id="quantity"
                            required
                            min="1"
                        />
                        <p v-if="fieldError('quantity')" class="field-error">
                            {{ fieldError('quantity') }}
                        </p>
                    </div>

                    <div class="form-group">
                        <label for="serviceDate">Дата надання послуги *</label>
                        <input
                            v-model="form.date"
                            type="date"
                            id="serviceDate"
                            required
                        />
                        <p v-if="fieldError('date')" class="field-error">
                            {{ fieldError('date') }}
                        </p>
                    </div>

                    <p v-if="error" class="field-error">{{ error }}</p>

                    <button type="submit" class="btn-primary" :disabled="submitting">
                        {{
                            submitting
                                ? 'Зачекайте…'
                                : editingId
                                    ? 'Зберегти зміни'
                                    : 'Додати послугу'
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
                title="Надані послуги"
                :loadingTitle="inProgressTitle"
                :records="services"
            >
                <div
                    v-for="service in services"
                    :key="service.id"
                    class="list-item"
                >
                    <h4>{{ service.guestName }}</h4>
                    <p>
                        <strong>Послуга:</strong>
                        {{ service.serviceName || serviceLabel(service.serviceType) }}
                    </p>
                    <p><strong>Номер:</strong> {{ service.guestRoom }}</p>
                    <p><strong>Кількість:</strong> {{ service.quantity }}</p>
                    <p><strong>Ціна за одиницю:</strong> {{ service.price }} грн</p>
                    <p>
                        <strong>Загальна вартість:</strong>
                        {{ service.totalPrice }} грн
                    </p>
                    <p><strong>Дата:</strong> {{ formatDate(service.date) }}</p>
                    <div class="item-actions">
                        <button
                            type="button"
                            class="btn-edit"
                            @click="startEdit(service)"
                        >
                            Редагувати
                        </button>
                        <button
                            type="button"
                            class="btn-delete"
                            @click="onDelete(service)"
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
    servicesApi,
    type Service,
    type ServicePayload,
    type ServiceType,
} from '@/api'
import ListingBlock from '@/components/layout/listing-block.vue'

// ---------- Reference data ----------
const serviceTypes: { value: ServiceType; label: string; price: number }[] = [
    { value: 'breakfast', label: 'Сніданок', price: 200 },
    { value: 'lunch', label: 'Обід', price: 350 },
    { value: 'dinner', label: 'Вечеря', price: 400 },
    { value: 'cleaning', label: 'Додаткове прибирання', price: 300 },
    { value: 'laundry', label: 'Пральня', price: 250 },
    { value: 'transfer', label: 'Трансфер', price: 500 },
    { value: 'spa', label: 'SPA-процедури', price: 800 },
    { value: 'parking', label: 'Паркування', price: 150 },
]

const serviceLabels: Record<ServiceType, string> = Object.fromEntries(
    serviceTypes.map((s) => [s.value, s.label]),
) as Record<ServiceType, string>

const serviceLabel = (s: ServiceType) => serviceLabels[s] ?? s

// ---------- State ----------
interface ServiceForm {
    guestName: string
    guestRoom: string
    serviceType: '' | ServiceType
    quantity: number | ''
    date: string
}

function emptyForm(): ServiceForm {
    return {
        guestName: '',
        guestRoom: '',
        serviceType: '',
        quantity: 1,
        date: new Date().toISOString().slice(0, 10),
    }
}

const services = ref<Service[]>([])
const loading = ref(false)
const removing = ref(false)
const submitting = ref(false)
const error = ref<string | null>(null)
const validation = ref<Record<string, string[]>>({})
const editingId = ref<string | null>(null)
const form = reactive<ServiceForm>(emptyForm())

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

async function loadServices() {
    loading.value = true
    error.value = null
    try {
        services.value = await servicesApi.list()
    } catch (e) {
        error.value =
            e instanceof ApiError ? e.message : 'Не вдалось завантажити послуги'
    } finally {
        loading.value = false
    }
}

async function onSubmit() {
    if (form.serviceType === '' || form.quantity === '') return

    const payload: ServicePayload = {
        guestName: form.guestName.trim(),
        guestRoom: form.guestRoom.trim(),
        serviceType: form.serviceType,
        quantity: Number(form.quantity),
        date: form.date,
    }

    submitting.value = true
    error.value = null
    validation.value = {}

    try {
        if (editingId.value) {
            const updated = await servicesApi.update(editingId.value, payload)
            const idx = services.value.findIndex((s) => s.id === editingId.value)
            if (idx !== -1) services.value.splice(idx, 1, updated)
            cancelEdit()
        } else {
            const created = await servicesApi.create(payload)
            services.value.push(created)
            resetForm()
        }
    } catch (e) {
        if (e instanceof ApiError) {
            error.value = e.message
            validation.value = e.validation ?? {}
        } else {
            error.value = 'Не вдалось зберегти послугу'
        }
    } finally {
        submitting.value = false
    }
}

function startEdit(service: Service) {
    editingId.value = service.id
    form.guestName = service.guestName
    form.guestRoom = service.guestRoom
    form.serviceType = service.serviceType
    form.quantity = service.quantity
    form.date = toDateInput(service.date)
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

async function onDelete(service: Service) {
    const label = service.serviceName || serviceLabel(service.serviceType)
    if (!confirm(`Видалити послугу "${label}" для ${service.guestName}?`)) return
    removing.value = true

    try {
        await servicesApi.remove(service.id)
        services.value = services.value.filter((s) => s.id !== service.id)
        if (editingId.value === service.id) cancelEdit()
    } catch (e) {
        error.value =
            e instanceof ApiError ? e.message : 'Не вдалось видалити послугу'
    } finally {
        removing.value = false
    }
}

onMounted(loadServices)
</script>

<style lang="scss"></style>
