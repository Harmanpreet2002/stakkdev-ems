import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";
import { TimerProvider } from "./context/TimerContext";
import { AdminRoutes } from "./routes/AdminRoutes";
import { EmployeeRoutes } from "./routes/EmployeeRoutes";

function App() {
  return (
    <React.Fragment>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <TimerProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Navigate to="/employee" />} />
                <Route path="/admin/*" element={<AdminRoutes />} />
                <Route path="/employee/*" element={<EmployeeRoutes />} />
              </Routes>
            </Router>
          </TimerProvider>
        </PersistGate>
      </Provider>
    </React.Fragment>
  );
}

export default App;
