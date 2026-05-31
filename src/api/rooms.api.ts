import { http } from './http'
import type { ApiItem, ApiList, BaseEntity } from './types'

export type RoomType = 'standard' | 'comfort' | 'lux' | 'president'
export type RoomStatus = 'available' | 'occupied' | 'cleaning'

export interface Room extends BaseEntity {
    number: string
    type: RoomType
    price: number
    discount: number
    status: RoomStatus
}

export interface RoomPayload {
    number: string
    type: RoomType
    price: number
    discount?: number
    status: RoomStatus
}

const RESOURCE = '/rooms'

export const roomsApi = {
    async list(): Promise<Room[]> {
        const { data } = await http.get<ApiList<Room>>(RESOURCE)
        return data.data
    },

    async get(id: string): Promise<Room> {
        const { data } = await http.get<ApiItem<Room>>(`${RESOURCE}/${id}`)
        return data.data
    },

    async create(payload: RoomPayload): Promise<Room> {
        const { data } = await http.post<ApiItem<Room>>(RESOURCE, payload)
        return data.data
    },

    async update(id: string, payload: Partial<RoomPayload>): Promise<Room> {
        const { data } = await http.put<ApiItem<Room>>(`${RESOURCE}/${id}`, payload)
        return data.data
    },

    async remove(id: string): Promise<void> {
        await http.delete(`${RESOURCE}/${id}`)
    },
}
