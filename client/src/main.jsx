import ReactDOM from 'react-dom/client'
import React from 'react'
import './index.css'

import App from './App'
import { UserProvider } from './providers/UserProvider';

ReactDOM.createRoot(document.getElementById('root')).render(
    <UserProvider>
        <App />
    </UserProvider>
)
