import React, { useContext } from 'react'

import { AppContext } from '../App'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'

export default () => {
    const { state } = useContext(AppContext)

    return (
        <Table>
            <TableBody>
                <TableRow key={'permission'}>
                    <TableCell component="th" scope="row">
                        Notification.permission
                    </TableCell>
                    <TableCell style={{ wordBreak: 'break-all' }}>
                        {Notification.permission}
                    </TableCell>
                </TableRow>

                <TableRow key={'subscription'}>
                    <TableCell component="th" scope="row">
                        PushSubscription
                    </TableCell>
                    <TableCell style={{ wordBreak: 'break-all' }}>
                        {JSON.stringify(state.subscription)}
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )
}
