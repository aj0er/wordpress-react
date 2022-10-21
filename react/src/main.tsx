import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

const wpUserData = document.getElementById('wp_user') as HTMLInputElement;
let wpUser: any = null;

if(wpUserData != null){
  wpUser = JSON.parse(wpUserData.value);
} else {
  wpUser = {
    id: 1,
    nonce: "93d64342b7", // Måste uppdateras var 12:e timme i dev-läget, kan endast genereras från backend på en lokal WP-sida.
    roles: ["administrator"]
  };
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App user={wpUser} />
  </React.StrictMode>
)