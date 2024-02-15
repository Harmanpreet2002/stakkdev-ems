import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import employeeAuthReducer from "./reducers/employeeReducer";
import adminAuthReducer from "./reducers/adminReducer";
import { combineReducers } from "redux";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  employee: employeeAuthReducer,
  admin: adminAuthReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

const persistor = persistStore(store);

export { store, persistor };
