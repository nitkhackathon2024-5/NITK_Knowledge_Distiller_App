import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { Provider } from "react-redux";
import { useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistedStore } from "./persistStore";

const clearPersistedStore = () => {
  persistedStore.purge(); // Clear the persisted store
};
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  // {const user = useSelector((state) => state.user)}
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistedStore}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
// window.addEventListener("load", (event) => {
//   if (!event.persisted) {
//     clearPersistedStore();
//   }
// });
