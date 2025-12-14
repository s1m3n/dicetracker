import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { LoginPage } from './components/LoginPage'
import { BlockedPage } from './components/BlockedPage'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const { user, userData, loading, signIn, signOutUser } = useAuth()
  const [count, setCount] = useState(0)

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}>
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return <LoginPage onSignIn={signIn} />
  }

  if (userData?.blockedUser) {
    return <BlockedPage onSignOut={signOutUser} />
  }

  return (
    <>
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <span style={{ fontSize: '14px' }}>
          {userData?.displayName || user.email}
        </span>
        <button
          onClick={signOutUser}
          style={{
            padding: '8px 16px',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          Sign Out
        </button>
      </div>

      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Dice Tracker</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Welcome, {userData?.displayName}!
      </p>
    </>
  )
}

export default App
