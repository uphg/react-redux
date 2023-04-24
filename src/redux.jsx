import { createContext, useContext, useEffect, useState  } from 'react'

export const AppContext = createContext(null)

export const store = {
  state: null,
  reducer: null,
  setState(newState) {
    store.state = newState
    store.listeners.map(fn => fn(store.state))
  },
  listeners: [],
  subscribe(fn) {
    store.listeners.push(fn)
    return () => {
      const index = store.listeners.indexOf(fn)
      store.listeners.splice(index, 1)
    }
  }
}

export const createStore = (reducer, initState) => {
  store.state = initState
  store.reducer = reducer
  return store
}

const changed = (oldState, newState) => {
  const keys = Object.keys(oldState)
  let result = false
  for (const key of keys) {
    if (oldState[key] !== newState[key]) {
      result = true
    }  
  }

  return result
}

export const connect = (selector, dispatchSelector) => (Component) => {
  return (props) => {
    const { setState, state } = useContext(AppContext)
    const [, update] = useState({})
    const dispatch = (action) => {
      setState(reducer(state, action))
    }

    const data = selector ? selector(state) : { state }
    const dispatchers = dispatchSelector ? dispatchSelector(dispatch) : {dispatch}

    useEffect(() => {
      const unsubscribe = store.subscribe(() => {
        const newData = selector ? selector(store.state) : { state: store.state }
        if (changed(data, newData)) {
          update({})
        }
      })

      return unsubscribe
    }, [selector])

    return <Component {...props} {...data} {...dispatchers}/>
  }
}

const reducer = (state, { type, payload }) => {
  if (type === 'updateUser') {
    return {
      ...state,
      user: {
        ...state.user,
        ...payload
      }
    }
  }

  return state
}


