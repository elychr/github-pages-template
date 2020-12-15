import React from 'react'
import { Route } from "react-router-dom"
import Markdown from '../components/Markdown'

export function mapRoutes(r) {
    return r.map((e, i) => (
        <Route
            path={e.route}
            render={props => {
                return (
                    <div key={i} className='flex-1 flex-col' >
                        {props?.match?.isExact ? <h1 className='content'>{e?.label}</h1> : null}
                        <Markdown {...props} route={e} />
                        {e?.children ? mapRoutes(e.children) : null}
                    </div>
                )
            }}
        />
    )
    )
}

export function getChild(arr, to) {
    if (arr) {
        let obj = arr.map(e => {
            if (e?.route === to) {
                return e
            }
            else {
                let child = e?.children?.find(c => c?.route === to)
                return child && child.length > 0 ? child : getChild(e?.children, to)
            }
        }).filter(x => x)
        if (obj.length > 0) return obj
    }
}

export function dig(arr) {
    return Array.isArray(arr) ? dig(arr[0]) : arr
}

export function getLabel(routes, to) {
    let path = getChild(routes, to)
    return dig(path)?.label
}