export interface AsideNavigationRecord {
    id: number
    label: string
    children?: {
        id: number
        label: string
    }[]
}
