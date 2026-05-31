import { http } from './http'
import type { ApiItem, ApiList, BaseEntity } from './types'

export interface Guest extends BaseEntity {
    fullName: string
    passport: string
    phone: string
    email?: string | null
    room: string
    checkIn: string
    checkOut: string
}

export interface GuestPayload {
    fullName: string
    passport: string
    phone: string
    email?: string | null
    room: string
    checkIn: string
    checkOut: string
}

const RESOURCE = '/guests'

export const guestsApi = {
    async list(): Promise<Guest[]> {
        const { data } = await http.get<ApiList<Guest>>(RESOURCE)
        return data.data
    },

    async get(id: string): Promise<Guest> {
        const { data } = await http.get<ApiItem<Guest>>(`${RESOURCE}/${id}`)
        return data.data
    },

    async create(payload: GuestPayload): Promise<Guest> {
        const { data } = await http.post<ApiItem<Guest>>(RESOURCE, payload)
        return data.data
    },

    async update(id: string, payload: Partial<GuestPayload>): Promise<Guest> {
        const { data } = await http.put<ApiItem<Guest>>(`${RESOURCE}/${id}`, payload)
        return data.data
    },

    async remove(id: string): Promise<void> {
        await http.delete(`${RESOURCE}/${id}`)
    },
}
