import axios, { AxiosError, type AxiosInstance } from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

export const http: AxiosInstance = axios.create({
    baseURL,
    timeout: 10_000,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
})

export interface ApiValidationError {
    message: string
    errors: Record<string, string[]>
}

export class ApiError extends Error {
    readonly status: number
    readonly validation?: Record<string, string[]>

    constructor(message: string, status: number, validation?: Record<string, string[]>) {
        super(message)
        this.name = 'ApiError'
        this.status = status
        this.validation = validation
    }
}

http.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiValidationError>) => {
        const status = error.response?.status ?? 0
        const data = error.response?.data
        const message = data?.message || error.message || 'Network error'
        return Promise.reject(new ApiError(message, status, data?.errors))
    },
)
