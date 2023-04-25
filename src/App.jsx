import { connectToUser } from './connecters/ConnectToUser'
import { Provider, connect, createStore } from './redux'

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

const store = createStore(reducer, {
  user: { name: 'Jack', age: 18 },
  group: { name: 'Tom组' }
})

function App() {
  return (
    <Provider store={store}>
      <Child1/>
      <Child2/>
      <Child3/>
    </Provider>
  )
}

const Child1 = () => {
  return (
    <div className="child">
      <div>老大</div>
      <User/>
    </div>
  )
}

const Child2 = () => {
  return (
    <div className="child">
      <div>老二</div>
      <UserModifier />
    </div>
  )
}

const Child3 = () => {
  return (
    <div className="child">
      <div>老三</div>
      <Group />
    </div>
  )
}

const ajax1 = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({data: {name: '获取 Promise 数据'}})
    }, 3000)
  })
}

const ajax2 = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({data: {name: '获取函数调用数据'}})
    }, 3000)
  })
}

const fetchUserPromise = () => {
  return ajax1('/user').then(response => response.data)
}
const fetchUser = (dispatch) => {
  ajax2('/user').then(response => dispatch({type: 'updateUser', payload: response.data}))
}

const User = connect(null, null)(({ state, dispatch }) => {
  const onClickAsyncFetch = () => {
    dispatch({type: 'updateUser', payload: fetchUserPromise()})
  }

  const onClickFnFetch = () => {
    dispatch(fetchUser)
  }

  return (
    <div>
      <div>User: {state.user.name}</div>
      <div>
        <button onClick={onClickAsyncFetch}>异步获取 User</button>
        <button onClick={onClickFnFetch}>函数请求 User</button>
      </div>
    </div>
  )
})

const UserModifier = connectToUser(({ updateUser, user }) => {
  const onChange = (e) => {
    updateUser({ name: e.target.value })
  }

  return (
    <div>
      <input type="text" value={user.name} onChange={onChange}/>
    </div>
  )
})

const Group = connect((state) => state.group)((group) => (
  <div>{group.name}</div>
))

export default App
