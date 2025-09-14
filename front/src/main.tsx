// import { StrictMode } from 'react'

import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import App from "./modules/App/App"

import { store, persistor } from './redux/store.ts'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <BrowserRouter>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </BrowserRouter>

  // </StrictMode>,
)
