import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import Link from '@material-ui/core/Link'
import ListItem from '@material-ui/core/ListItem'
import Collapse from '@material-ui/core/Collapse'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import { Route, Link as RouterLink } from 'react-router-dom'
import { getLabel } from '../functions'

const useStyles = makeStyles((theme) => ({
    root: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '30%'
    },
    breadcrumbs: {
        margin: '2%'
    },
    lists: {
        backgroundColor: theme?.palette?.background?.default,
        marginTop: theme.spacing(1),
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
}))

const LinkRouter = (props) => <Link {...props} component={RouterLink} />;

export default function NavigationSidebar({ routes = [], children }) {
    let classes = useStyles()

    function ListItemLink(props) {
        let { item, to, depth, ...other } = props
        let { label } = item
        let [open, setOpen] = React.useState(depth < 2 ?? true)

        return <>
            <li>
                <ListItem to={to} {...other} button
                    component={RouterLink}
                    onClick={e => {
                        if (!item?.children) { window.scrollTo({ top: 0 }) }
                        setOpen((prevOpen) => !prevOpen)
                    }}
                >
                    <ListItemText primary={label} />
                    {item?.children && open != null ? open ? <ExpandLess /> : <ExpandMore /> : null}
                </ListItem>
            </li>
            {
                item?.children ?
                    <Collapse component="li" in={open} timeout="auto" unmountOnExit>
                        <List disablePadding>
                            {item?.children.map((e, i) => {
                                return (
                                    <ListItemLink
                                        key={i}
                                        item={e}
                                        to={e.route}
                                        depth={depth + 1}
                                        style={{ paddingLeft: 16 + (16 * (depth + 1)) }}
                                    />
                                )
                            }
                            )}
                        </List>
                    </Collapse> : null
            }
        </>
    }

    return (
        <>
            <Route>
                {({ location }) => {
                    const pathnames = location.pathname.split('/').filter((x) => x)
                    return (
                        <Breadcrumbs className={classes.breadcrumbs} aria-label="breadcrumb">
                            <LinkRouter color="inherit" to="/">Home</LinkRouter>
                            {pathnames.map((e, i) => {
                                const to = `/${pathnames.slice(0, i + 1).join('/')}`;

                                return i === pathnames.length - 1 ?
                                    <Typography color="textPrimary" key={to}>{getLabel(routes, to)}</Typography> :
                                    <LinkRouter color="inherit" to={to} key={to}>{getLabel(routes, to)}</LinkRouter>
                            })}
                        </Breadcrumbs>
                    )
                }}
            </Route>

            <div className='container mb-10' >
                <nav className={`navigation flex-1 ${classes.lists}`} aria-label="mailbox folders">
                    <List>{routes.map((e, i) => {
                        return (
                            <ListItemLink
                                key={i}
                                item={e}
                                to={e.route}
                                depth={0}
                            />
                        )
                    })
                    }</List>
                </nav>
                {children}
            </div>
        </>
    )
}