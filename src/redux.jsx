import { createContext, useEffect, useState  } from 'react'

function createRedux() {
  let state = null
  let reducer = null
  const listeners = []

  const store = {
    getState() {
      return state
    },
    dispatch(action) {
      setState(reducer(state, action))
    },
    subscribe(fn) {
      listeners.push(fn)
      return () => {
        const index = listeners.indexOf(fn)
        listeners.splice(index, 1)
      }
    },
    replaceReducer(newReducer) {
      reducer = newReducer
    }
  }

  function setState(newState) {
    state = newState
    listeners.map(fn => fn(state))
  }

  function createStore(initReducer, initState) {
    state = initState
    reducer = initReducer
    return store
  }

  function thunkDispatch(action) {
    if (action instanceof Function) {
      return action(dispatch)
    }

    return store.dispatch(action) // 对象 type payload
  }

  function dispatch(action) {
    if (isPromise(action.payload)) {
      return action.payload.then(data => {
        thunkDispatch({ ...action, payload: data })
      })
    }

    return thunkDispatch(action)
  }

  function connect(selector, dispatchSelector) {
    return (Component) => {
      return (props) => {
        const [, update] = useState({})
        const data = selector ? selector(state) : { state }
        const dispatchers = dispatchSelector ? dispatchSelector(store.dispatch) : { dispatch: store.dispatch }
  
        useEffect(() => {
          const unsubscribe = store.subscribe(() => {
            const newData = selector ? selector(state) : { state }
            if (changed(data, newData)) {
              update({})
            }
          })
  
          return unsubscribe
        }, [selector])
  
        return <Component {...props} {...data} {...dispatchers}/>
      }
    }
  }

  return { store, createStore, connect }
}

const AppContext = createContext(null)

function Provider({ store, children }) {
  return (
    <AppContext.Provider value={store}>
      {children}
    </AppContext.Provider>
  )
}

function changed(oldState, newState) {
  const keys = Object.keys(oldState)
  let result = false
  for (const key of keys) {
    if (oldState[key] !== newState[key]) {
      result = true
    }  
  }

  return result
}

function isPromise(value) {
  return value instanceof Promise
}

const { store, createStore, connect } = createRedux()

export { store, createStore, connect, Provider }