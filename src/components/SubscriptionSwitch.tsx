import React, { useState, useContext } from 'react'
import * as webpush from 'web-push'

import { AppContext } from '../App'

import Switch from '@material-ui/core/Switch'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'

export default () => {
    const { dispatch } = useContext(AppContext)
    const [checked, setChecked] = useState(false)

    const subscribe = async (applicationServerKey: string) => {
        const registration = await navigator.serviceWorker.getRegistration()
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey
        })

        return subscription
    }

    const unsubscribe = async () => {
        const registration = await navigator.serviceWorker.getRegistration()
        const subscription = await registration.pushManager.getSubscription()

        subscription.unsubscribe()
    }

    const handleChange = async (
        event: React.ChangeEvent<{}>,
        checked: boolean
    ) => {
        if (checked) {
            const vapidKeys = webpush.generateVAPIDKeys()
            const subscription = await subscribe(vapidKeys.publicKey)
            dispatch({ type: 'subscribe', vapidKeys, subscription })
        } else {
            await unsubscribe()
            dispatch({ type: 'unsubscribe' })
        }

        setChecked(checked)
    }

    return (
        <FormGroup>
            <FormControlLabel
                label="subscribe"
                control={
                    <Switch
                        color="primary"
                        checked={checked}
                        onChange={handleChange}
                    />
                }
                onChange={handleChange}
            />
        </FormGroup>
    )
}
