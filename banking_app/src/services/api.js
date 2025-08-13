const API_URL = 'http://localhost:8080/api'
import { openLocalDb } from './localDb.js'

export async function apiFetch(endpoint, options = {}) {
    /*
    * Les routes GET, je les veux dans le cache local
    * Les routes POST, je les veux dans la file d'attente locale
    * Si on est hors ligne, on ne peut que faire des GET
    * Si on est hors ligne et qu'on fait un POST, on le met dans la file d'attente
    * Si on est hors ligne et qu'on fait un GET, on cherche dans le cache local
    * Si on est en ligne, on fait la requête normalement
    * Si on est en ligne et qu'on fait un POST, on le fait normalement et on met à jour le cache local
    * Si on est en ligne et qu'on fait un GET, on le fait normalement et on met à jour le cache local
    * */

    const token = localStorage.getItem('accessToken')
    const method = options.method || 'GET'
    const headers = {
        ...(options.body && { 'Content-Type': 'application/json' }),
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    }

    const fullUrl = `${API_URL}${endpoint}`

    if (!navigator.onLine) {
        const db = await openLocalDb()


        // Get -> depuis le cache
        if (method === 'GET') {
            const tx = db.transaction('cache', 'readonly')
            const store = tx.objectStore('cache')
            const req = store.get(endpoint)

            return new Promise((resolve, reject) => {
                req.onsuccess = () => {
                    if (req.result && req.result.data) {
                        console.log(`[apiFetch] GET ${endpoint} → cache`)
                        resolve(req.result.data)
                    } else {
                        console.warn(`[apiFetch] Pas de cache pour ${endpoint}`)
                        resolve([])
                    }
                }
                req.onerror = () => {
                    console.error(`[apiFetch] Erreur cache pour ${endpoint}`)
                    resolve([])
                }
            })

        }

        // Post -> en file d'attente (timestamp pour la synchronisation !!!)
        if (method === 'POST') {
            const tx = db.transaction('requests', 'readwrite')
            tx.objectStore('requests').add({
                endpoint,
                options: { method, headers, body: options.body },
                timestamp: Date.now(),
            })

            return {
                offline: true,
                ...JSON.parse(options.body),
                synced: false,
                message: 'Requête mise en file d’attente pour synchronisation ultérieure',
            }
        }

        throw new Error('Action non disponible hors ligne')
    }

    const res = await fetch(fullUrl, { ...options, headers })
    const isJson = res.headers.get('content-type')?.includes('application/json')
    const data = isJson ? await res.json().catch(() => null) : null

    if (!res.ok) throw new Error(data?.message || `Erreur API (${res.status})`)

    // Get -> vers le cache
    if (method === 'GET') {
        const db = await openLocalDb()
        const tx = db.transaction('cache', 'readwrite')
        tx.objectStore('cache').put({ endpoint, data })
    }

    return data
}