import { http } from './http'
import type { ApiItem, ApiList, BaseEntity } from './types'
import type { RoomType } from './rooms.api'

export interface Booking extends BaseEntity {
    guestName: string
    guestPhone: string
    roomType: RoomType
    checkIn: string
    checkOut: string
    guests: number
    status: string
}

export interface BookingPayload {
    guestName: string
    guestPhone: string
    roomType: RoomType
    checkIn: string
    checkOut: string
    guests: number
    status?: string
}

const RESOURCE = '/bookings'

export const bookingsApi = {
    async list(): Promise<Booking[]> {
        const { data } = await http.get<ApiList<Booking>>(RESOURCE)
        return data.data
    },

    async get(id: string): Promise<Booking> {
        const { data } = await http.get<ApiItem<Booking>>(`${RESOURCE}/${id}`)
        return data.data
    },

    async create(payload: BookingPayload): Promise<Booking> {
        const { data } = await http.post<ApiItem<Booking>>(RESOURCE, payload)
        return data.data
    },

    async update(id: string, payload: Partial<BookingPayload>): Promise<Booking> {
        const { data } = await http.put<ApiItem<Booking>>(`${RESOURCE}/${id}`, payload)
        return data.data
    },

    async remove(id: string): Promise<void> {
        await http.delete(`${RESOURCE}/${id}`)
    },
}
