import * as webpush from 'web-push'

interface Subscribe {
    type: 'subscribe'
    subscription: PushSubscription
    vapidKeys: webpush.VapidKeys
}

interface Unsubscribe {
    type: 'unsubscribe'
}

interface ChangeCommand {
    type: 'changeCommand'
    command: string
}

export type Actions = Subscribe | Unsubscribe | ChangeCommand

export interface State {
    subscribing: boolean
    subscription?: PushSubscription
    authorization?: string
    vapidKeys?: webpush.VapidKeys
    command?: string
}

export const initialState = { subscribing: false }

export default (state: State, action: Actions): State => {
    switch (action.type) {
        case 'subscribe':
            const headers = webpush.getVapidHeaders(
                new URL(action.subscription.endpoint).origin,
                window.location.origin,
                action.vapidKeys.publicKey,
                action.vapidKeys.privateKey,
                webpush.supportedContentEncodings.AES_128_GCM
            )

            return {
                ...state,
                subscribing: true,
                authorization: headers.Authorization,
                subscription: action.subscription
            }
        case 'unsubscribe':
            return initialState
        case 'changeCommand':
            return {
                ...state,
                command: action.command
            }
    }
}
