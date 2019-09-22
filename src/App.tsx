import React, { useState, useReducer, useLayoutEffect } from 'react'

import Header from './components/Header'
import Footer from './components/Footer'
import SubscriptionSwitch from './components/SubscriptionSwitch'
import SubscriptionInfo from './components/SubscriptionInfo'
import SubscriptionTable from './components/SubscriptionTable'

import subscribeReducer, {
    initialState,
    State,
    Actions
} from './reducers/subscribe'

import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

interface ContextType {
    state: State
    dispatch: React.Dispatch<Actions>
}
export const AppContext = React.createContext<ContextType>({} as ContextType)

export default () => {
    const [tabIndex, setTabIndex] = useState(0)
    const [state, dispatch] = useReducer(subscribeReducer, initialState)

    useLayoutEffect(() => {
        const getSubscription = async () => {
            const registration = await navigator.serviceWorker.getRegistration()
            return await registration.pushManager.getSubscription()
        }

        getSubscription().then(subscription => {
            if (subscription) {
                subscription.unsubscribe()
            }
        })
    }, [])

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            <Header
                title={process.env.REACT_APP_WEBSITE_NAME}
                shareText={state.command}
            />

            <Paper style={{ margin: 10, padding: 5 }}>
                <Box display="flex" justifyContent="center" margin={2}>
                    <SubscriptionSwitch />
                </Box>

                <Paper style={{ margin: 10 }}>
                    {state.subscribing && <SubscriptionInfo />}
                </Paper>
            </Paper>

            {state.subscribing && (
                <Paper style={{ margin: 10 }}>
                    <Tabs
                        value={tabIndex}
                        onChange={(_, tabIndex) => {
                            setTabIndex(tabIndex)
                        }}>
                        <Tab label="curl" />
                        <Tab label="curl(メッセージ設定)" />
                    </Tabs>

                    {tabIndex === 0 && <SubscriptionTable encrypt={false} />}
                    {tabIndex === 1 && <SubscriptionTable encrypt={true} />}
                </Paper>
            )}

            <Footer />
        </AppContext.Provider>
    )
}
