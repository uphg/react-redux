import { connectToUser } from './connecters/ConnectToUser'
import { AppContext, connect, createStore } from './redux'

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

const initState = {
  user: { name: 'Jack', age: 18 },
  group: { name: 'Tom组' }
}


const store = createStore(reducer, initState)

function App() {
  return (
    <AppContext.Provider value={store}>
      <Child1/>
      <Child2/>
      <Child3/>
    </AppContext.Provider>
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

const User = connectToUser(({ user }) => {
  return <div>User: {user.name}</div>
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
