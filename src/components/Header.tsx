import React, { useState, useContext } from 'react'

import { AppContext } from '../App'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import ShareIcon from '@material-ui/icons/Share'
import OpenInNewIcon from '@material-ui/icons/OpenInNew'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

interface Props {
    title: string | undefined
    shareText?: string
}

const Header = ({ title }: Props) => {
    const { state } = useContext(AppContext)
    const [open, setOpen] = useState(false)

    return (
        <>
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={() => setOpen(true)}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        {title}
                    </Typography>

                    <IconButton
                        color="inherit"
                        onClick={async () => {
                            try {
                                await navigator.share({
                                    text: state.command
                                })
                            } catch (e) {
                                if (e.name === 'AbortError') return
                            }
                        }}
                        disabled={!state.subscribing}>
                        <ShareIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Toolbar />

            <Drawer open={open} onClose={() => setOpen(false)}>
                <List>
                    <ListItem
                        button
                        key={'github'}
                        onClick={() =>
                            window.open(
                                process.env.REACT_APP_GITHUB_URL,
                                '_blank'
                            )
                        }>
                        <ListItemIcon>
                            <OpenInNewIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Github'} />
                    </ListItem>
                </List>
                <Divider />
            </Drawer>
        </>
    )
}

export default Header
