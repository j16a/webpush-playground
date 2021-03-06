const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
        window.location.hostname === '[::1]' ||
        window.location.hostname.match(
            /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
        )
)

type Config = {
    onSuccess?: (registration: ServiceWorkerRegistration) => void
    onUpdate?: (registration: ServiceWorkerRegistration) => void
}

export function register(config?: Config) {
    // if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    // The URL constructor is available in all browsers that support SW.
    // const publicUrl = new URL(
    //   (process as { env: { [key: string]: string } }).env.PUBLIC_URL,
    //   window.location.href
    // );
    // if (publicUrl.origin !== window.location.origin) {
    //   // Our service worker won't work if PUBLIC_URL is on a different origin
    //   // from what our page is served on. This might happen if a CDN is used to
    //   // serve assets; see https://github.com/facebook/create-react-app/issues/2374
    //   return;
    // }

    window.addEventListener('load', () => {
        // const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
        const swUrl = `${process.env.PUBLIC_URL}/sw.js`

        if (isLocalhost) {
            // This is running on localhost. Let's check if a service worker still exists or not.
            checkValidServiceWorker(swUrl, config)

            // Add some additional logging to localhost, pointing developers to the
            // service worker/PWA documentation.
            navigator.serviceWorker.ready.then(() => {
                console.log('navigator.serviceWorker.ready')
            })
        } else {
            // Is not localhost. Just register service worker
            registerValidSW(swUrl, config)
        }
    })

    window.addEventListener('beforeinstallprompt', e => {
        console.log('beforeinstallprompt')
        // Prevent Chrome 76 and later from showing the mini-infobar
        e.preventDefault()
        // Stash the event so it can be triggered later.
        // deferredPrompt = e;
        // showInstallPromotion();
    })

    window.addEventListener('appinstalled', evt => {
        console.log('appinstalled')
    })
    // }
}

function registerValidSW(swUrl: string, config?: Config) {
    navigator.serviceWorker
        .register(swUrl)
        .then(async registration => {
            // const subscribeOptions = {
            //   userVisibleOnly: true,
            //   applicationServerKey: urlBase64ToUint8Array(
            //     'BBwyxuUYdD07oG0QyxTjCv3JofmqtRgyVBAiGO91mvjWWn2Yknuot_QYVscbBV_ySt2pKm-C_1pBoXFH4e8A_-4'
            //   )
            // };

            // await registration.pushManager.subscribe(subscribeOptions).then((pushSubscription) => {
            //   console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
            //   return pushSubscription;
            // }).catch(error => console.error(error));

            registration.onupdatefound = () => {
                const installingWorker = registration.installing
                if (installingWorker == null) {
                    return
                }
                installingWorker.onstatechange = () => {
                    if (installingWorker.state === 'installed') {
                        if (navigator.serviceWorker.controller) {
                            // At this point, the updated precached content has been fetched,
                            // but the previous service worker will still serve the older
                            // content until all client tabs are closed.
                            console.log(
                                'New content is available and will be used when all ' +
                                    'tabs for this page are closed. See https://bit.ly/CRA-PWA.'
                            )

                            // Execute callback
                            if (config && config.onUpdate) {
                                config.onUpdate(registration)
                            }
                        } else {
                            // At this point, everything has been precached.
                            // It's the perfect time to display a
                            // "Content is cached for offline use." message.
                            console.log('Content is cached for offline use.')

                            // Execute callback
                            if (config && config.onSuccess) {
                                config.onSuccess(registration)
                            }
                        }
                    }
                }
            }
        })
        .catch(error => {
            console.error('Error during service worker registration:', error)
        })
}

function checkValidServiceWorker(swUrl: string, config?: Config) {
    // Check if the service worker can be found. If it can't reload the page.
    fetch(swUrl)
        .then(response => {
            // Ensure service worker exists, and that we really are getting a JS file.
            const contentType = response.headers.get('content-type')
            if (
                response.status === 404 ||
                (contentType != null &&
                    contentType.indexOf('javascript') === -1)
            ) {
                // No service worker found. Probably a different app. Reload the page.
                navigator.serviceWorker.ready.then(registration => {
                    registration.unregister().then(() => {
                        window.location.reload()
                    })
                })
            } else {
                // Service worker found. Proceed as normal.
                registerValidSW(swUrl, config)
            }
        })
        .catch(() => {
            console.log(
                'No internet connection found. App is running in offline mode.'
            )
        })
}

export function unregister() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
            registration.unregister()
        })
    }
}
