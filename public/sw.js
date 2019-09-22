self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', () => {
    self.clients.matchAll({ type: 'window' }).then(windowClients => {
        for (const windowClient of windowClients) {
            windowClient.navigate(windowClient.url)
        }
    })
})

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response ? response : fetch(event.request)
        })
    )
})

self.addEventListener('push', event => {
    // https://developer.mozilla.org/en-US/docs/Web/API/notification
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return
    }

    console.log(event.data)

    event.waitUntil(
        self.registration.showNotification('New Message', {
            body: (event.data && `${event.data.text()}`) || 'Hello',
            tag: 'default',
            renotify: true,
            requireInteraction: true,
            data: 'data',
            vibrate: [300, 100, 400],
            actions: [
                {
                    action: 'like-action',
                    title: 'Like'
                }
            ]
        })
    )
})

self.addEventListener('notificationclick', event => {
    console.log('notificationclick')

    event.notification.close()
    event.waitUntil(
        clients.openWindow('https://webpush-playground.firebaseapp.com')
    )
})

self.addEventListener('notificationclose', event => {
    console.log('notificationclose')
})
