export function openLocalDb() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('banking-db', 1)
        request.onupgradeneeded = (event) => {
            const db = event.target.result
            db.createObjectStore('requests', { keyPath: 'timestamp' })
            db.createObjectStore('cache', { keyPath: 'endpoint' })
            db.createObjectStore('transactions', { keyPath: 'id', autoIncrement: true })
            db.createObjectStore('categories', { keyPath: 'id', autoIncrement: true })
            db.createObjectStore('payments', { keyPath: 'id', autoIncrement: true })
        }
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
    })
}