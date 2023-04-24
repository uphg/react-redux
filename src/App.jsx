import { useState } from 'react'
import { useContext, createContext } from 'react'

const AppContext = createContext(null)

function App() {
  const [appState, setAppState] = useState({
    user: {name: 'frank', age: 18}
  })
  const contextValue = { appState, setAppState }

  return (
    <AppContext.Provider value={contextValue}>
      <Child1/>
      <Child2/>
      <Child3/>
    </AppContext.Provider>
  )
}

const Child1 = () => (
  <div className="child">
    <div>老大</div>
    <User/>
  </div>
)

const Child2 = () => (
  <div className="child">
    <div>老二</div>
    <UserModifier />
  </div>
)

const Child3 = () => <div className="child">老三</div>

const User = () => {
  const contextValue = useContext(AppContext)
  return <div>User: {contextValue.appState.user.name}</div>
}

const UserModifier = () => {
  const contextValue = useContext(AppContext)
  const onChange = (e) => {
    contextValue.appState.user.name = e.target.value
    contextValue.setAppState({ ...contextValue.appState })
  }

  return (
    <div>
      <input type="text" value={contextValue.appState.user.name} onChange={onChange}/>
    </div>
  )
}

export default App
