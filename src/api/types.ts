export interface ApiItem<T> {
    data: T
}

export interface ApiList<T> {
    data: T[]
}

/** Fields the Laravel/MongoDB Eloquent model returns on every record. */
export interface BaseEntity {
    id: string
    created_at?: string
    updated_at?: string
}
