import { http } from './http'
import type { ApiItem, ApiList, BaseEntity } from './types'

export type ServiceType =
    | 'breakfast'
    | 'lunch'
    | 'dinner'
    | 'cleaning'
    | 'laundry'
    | 'transfer'
    | 'spa'
    | 'parking'

export interface Service extends BaseEntity {
    guestName: string
    guestRoom: string
    serviceType: ServiceType
    serviceName: string
    quantity: number
    price: number
    totalPrice: number
    date: string
}

export interface ServicePayload {
    guestName: string
    guestRoom: string
    serviceType: ServiceType
    quantity: number
    date: string
}

const RESOURCE = '/services'

export const servicesApi = {
    async list(): Promise<Service[]> {
        const { data } = await http.get<ApiList<Service>>(RESOURCE)
        return data.data
    },

    async get(id: string): Promise<Service> {
        const { data } = await http.get<ApiItem<Service>>(`${RESOURCE}/${id}`)
        return data.data
    },

    async create(payload: ServicePayload): Promise<Service> {
        const { data } = await http.post<ApiItem<Service>>(RESOURCE, payload)
        return data.data
    },

    async update(id: string, payload: Partial<ServicePayload>): Promise<Service> {
        const { data } = await http.put<ApiItem<Service>>(`${RESOURCE}/${id}`, payload)
        return data.data
    },

    async remove(id: string): Promise<void> {
        await http.delete(`${RESOURCE}/${id}`)
    },
}
