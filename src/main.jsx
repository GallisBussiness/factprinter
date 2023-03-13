import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import "primereact/resources/themes/tailwind-light/theme.css";  //theme
import "primereact/resources/primereact.min.css"; 
import "primeicons/primeicons.css"; 
import './index.css'      

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
