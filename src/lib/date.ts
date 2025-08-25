export function pad(num: number): string {
    return num < 10 ? `0${num}` : String(num)
}

export function toISO(date: Date | string | number): string {
    const d = new Date(date)
    return d.toISOString()
}

export function formatDate(date: Date | string | number, pattern = 'dd/MM/yyyy HH:mm'): string {
    const d = new Date(date)
    const map: Record<string, string> = {
        dd: pad(d.getDate()),
        MM: pad(d.getMonth() + 1),
        yyyy: String(d.getFullYear()),
        HH: pad(d.getHours()),
        mm: pad(d.getMinutes()),
        ss: pad(d.getSeconds()),
    }
    return pattern.replace(/dd|MM|yyyy|HH|mm|ss/g, (m) => map[m])
}

export function fromNow(date: Date | string | number): string {
    const d = new Date(date).getTime()
    const now = Date.now()
    const diff = Math.max(0, now - d)

    const seconds = Math.floor(diff / 1000)
    if (seconds < 5) return 'vừa xong'
    if (seconds < 60) return `${seconds}s trước`

    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}p trước`

    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}g trước`

    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}n trước`

    const weeks = Math.floor(days / 7)
    if (weeks < 5) return `${weeks} tuần trước`

    const months = Math.floor(days / 30)
    if (months < 12) return `${months} tháng trước`

    const years = Math.floor(days / 365)
    return `${years} năm trước`
}

export function isSameDay(a: Date | string | number, b: Date | string | number): boolean {
    const d1 = new Date(a)
    const d2 = new Date(b)
    return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
    )
}
