export { http, ApiError } from './http'
export type { ApiValidationError } from './http'
export type { ApiItem, ApiList, BaseEntity } from './types'

export { roomsApi } from './rooms.api'
export type { Room, RoomPayload, RoomType, RoomStatus } from './rooms.api'

export { guestsApi } from './guests.api'
export type { Guest, GuestPayload } from './guests.api'

export { bookingsApi } from './bookings.api'
export type { Booking, BookingPayload } from './bookings.api'

export { servicesApi } from './services.api'
export type { Service, ServicePayload, ServiceType } from './services.api'
