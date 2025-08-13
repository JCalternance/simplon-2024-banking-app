import { useEffect } from 'react'
import { openLocalDb } from './localDb.js'
import { apiFetch } from './api.js'

function syncStore(storeName, endpoint) {

    // Lire le cache
    return new Promise(async (resolve) => {
        const db = await openLocalDb()
        const tx = db.transaction(storeName, 'readonly')
        const store = tx.objectStore(storeName)
        const request = store.getAll()

        // Pour chaque élément non synchronisé, envoyer une requête POST et le marquer comme synchronisé (synced)
        request.onsuccess = async () => {
            for (const item of request.result) {
                if (!item.synced) {
                    try {
                        await apiFetch(endpoint, {
                            method: 'POST',
                            body: JSON.stringify(item),
                        })
                        const updateTx = db.transaction(storeName, 'readwrite')
                        item.synced = true
                        updateTx.objectStore(storeName).put(item)
                    } catch (err) {
                        console.warn(`Sync échouée pour ${storeName}`, item)
                    }
                }
            }
            resolve()
        }

        request.onerror = () => {
            console.error(`Erreur lors de la lecture de ${storeName}`)
            resolve()
        }
    })
}

function flushQueuedRequests() {

    // Lire la file de requêtes d'attente (rappel, c'est les posts faits offline)
    return new Promise(async (resolve) => {
        const db = await openLocalDb()
        const tx = db.transaction('requests', 'readonly')
        const store = tx.objectStore('requests')
        const request = store.getAll()

        // Pour chaque requête, on l'envoie et la supprime de la file si succès
        request.onsuccess = async () => {
            for (const item of request.result) {
                try {
                    await fetch(`http://localhost:8080/api${item.endpoint}`, item.options)
                    const deleteTx = db.transaction('requests', 'readwrite')
                    deleteTx.objectStore('requests').delete(item.timestamp)
                } catch (err) {
                    console.warn('Échec de la requête en file', item)
                }
            }
            resolve()
        }

        request.onerror = () => {
            console.error('Erreur lors de la lecture de la file de requêtes')
            resolve()
        }
    })
}
// hook pour synchroniser les données locales avec le serveur lorsque l'utilisateur est en ligne
// avec feedback dans la console et une fenêtre pour informer le user
export default function useOfflineSync() {
    useEffect(() => {
        const syncAll = async () => {
            console.log('🔄 Synchronisation en cours...')
            await flushQueuedRequests()
            await syncStore('transactions', '/transactions')
            await syncStore('categories', '/categories')
            await syncStore('payments', '/payment-methods')
            console.log('✅ Synchronisation terminée')
        }

        window.addEventListener('online', syncAll)
        return () => {
            window.removeEventListener('online', syncAll)
        }
    }, [])
}