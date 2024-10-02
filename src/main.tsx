import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import "./main.css"
import { UserContextProvider } from './context/userContext.jsx';
import {Provider} from 'react-redux'
import {store} from './app/store'
import GlobalStyles from './styledComponents/GlobalText.js';

const rootElement = document.getElementById('root')

if(rootElement){
ReactDOM.createRoot(rootElement).render(
  <Provider store={store}>
    <UserContextProvider>
      <BrowserRouter>
        <GlobalStyles />
        <App />
      </BrowserRouter>
    </UserContextProvider>  
  </Provider>
);
}
