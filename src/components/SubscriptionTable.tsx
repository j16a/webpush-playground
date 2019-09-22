import React, { useContext, useState, useEffect } from 'react'
import * as webpush from 'web-push'

import { AppContext } from '../App'

import TextField from '@material-ui/core/TextField'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import CloudDownloadIcon from '@material-ui/icons/CloudDownload'
import WarningIcon from '@material-ui/icons/Warning'

interface Props {
    encrypt: boolean
}

export default ({ encrypt }: Props) => {
    const { state, dispatch } = useContext(AppContext)
    const [ttl, setTtl] = useState(60)
    const [message, setMessage] = useState('Goodbye')
    const [contentLength, setContentLength] = useState(0)

    useEffect(() => {
        if (encrypt) {
            dispatch({
                type: 'changeCommand',
                command: `curl -i -X POST -H "Content-Encoding: aes128gcm" -H "Content-Length: ${contentLength}" -H "TTL: ${ttl}" -H "Authorization: ${
                    state.authorization
                }" --data-binary @webpush-aws128gcm.data ${state.subscription &&
                    state.subscription.endpoint}`
            })
        } else {
            dispatch({
                type: 'changeCommand',
                command: `curl -i -X POST -H "Content-Length: 0" -H "TTL: ${ttl}" -H "Authorization: ${
                    state.authorization
                }" ${state.subscription && state.subscription.endpoint}`
            })
        }
    }, [
        dispatch,
        contentLength,
        ttl,
        encrypt,
        state.authorization,
        state.subscription
    ])

    const handleDownload = () => {
        const subscription = JSON.parse(JSON.stringify(state.subscription))
        const encryptionResult = webpush.encrypt(
            subscription.keys.p256dh,
            subscription.keys.auth,
            message,
            webpush.supportedContentEncodings.AES_128_GCM
        )
        setContentLength(encryptionResult.cipherText.length)

        const url = window.URL.createObjectURL(
            new Blob([encryptionResult.cipherText])
        )

        //FIXME: Firefoxでは動作しない
        const e = document.createElement('a')
        e.href = url
        e.download = `webpush-aws128gcm.data`
        e.click()

        window.URL.revokeObjectURL(url)
    }

    return (
        <>
            {encrypt && (
                <>
                    <Paper elevation={1} style={{ margin: 10, padding: 5 }}>
                        <Typography>
                            <WarningIcon color={'error'} />
                            メッセージを暗号化したファイルのダウンロードが必要なため、PCでご確認ください。また、HTTPSが必須です。ダウンロードはテキストボックス右のボタンを押下すると始まります。
                        </Typography>
                    </Paper>

                    <Paper elevation={0} style={{ margin: 10, padding: 5 }}>
                        <TextField
                            label="メッセージ"
                            variant="outlined"
                            fullWidth
                            defaultValue={message}
                            onChange={event => {
                                // FIXME
                                setMessage((event.target
                                    .value as unknown) as string)
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            edge="end"
                                            onClick={handleDownload}>
                                            <CloudDownloadIcon />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Paper>
                </>
            )}

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ヘッダ名</TableCell>
                        <TableCell>値</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    <TableRow key={'host'}>
                        <TableCell component="th" scope="row">
                            Host
                        </TableCell>
                        <TableCell>
                            {state.subscription &&
                                new URL(state.subscription.endpoint).origin}
                        </TableCell>
                    </TableRow>

                    <TableRow key={'ttl'}>
                        <TableCell component="th" scope="row">
                            TTL
                        </TableCell>
                        <TableCell>
                            <TextField
                                variant="outlined"
                                fullWidth
                                type="number"
                                defaultValue={ttl}
                                onChange={event => {
                                    // FIXME
                                    setTtl((event.target
                                        .value as unknown) as number)
                                }}
                            />
                        </TableCell>
                    </TableRow>

                    <TableRow key={'content-length'}>
                        <TableCell component="th" scope="row">
                            Content-Length
                        </TableCell>
                        <TableCell>{contentLength}</TableCell>
                    </TableRow>

                    <TableRow key={'authorization'}>
                        <TableCell component="th" scope="row">
                            Authorization
                        </TableCell>
                        <TableCell style={{ wordBreak: 'break-all' }}>
                            {state.authorization}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>

            {state.command && (
                <Paper elevation={0} style={{ margin: 10, padding: 5 }}>
                    <TextField
                        label="コマンド"
                        variant="filled"
                        InputProps={{
                            readOnly: true
                        }}
                        multiline
                        fullWidth
                        value={state.command}
                    />
                </Paper>
            )}
        </>
    )
}
