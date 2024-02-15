import { Routes, Route, Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import Home from "../pages/employee/Home";
import Attendance from "../pages/employee/Attendance";
import Login from "../pages/employee/Login";
import { useDispatch, useSelector } from "react-redux";
import Earnings from "../pages/employee/Earnings";
import PayStub from "../pages/employee/PayStub";
import { useEffect } from "react";
import { logoutEmployee } from "../redux/reducers/employeeReducer";

const PrivateRoute = ({ element, isEmployeeLoggedIn }) => {
  if (isEmployeeLoggedIn) {
    return element;
  } else {
    return <Navigate to="/employee/login" />;
  }
};

PrivateRoute.propTypes = {
  element: PropTypes.element.isRequired,
  isEmployeeLoggedIn: PropTypes.bool.isRequired,
};

const EmployeeRoutes = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state) => state.employee.isAuthenticated
  );

  const token = useSelector((state) => state.employee.employee.token);

  const isJwtTokenExpired = (token) => {
    if (!token?.expires) {
      return true;
    }
    const expiresTime = new Date(token.expires).getTime();
    const currentTime = new Date().getTime();
    return expiresTime <= currentTime;
  };

  useEffect(() => {
    const checkTokenExpiry = () => {
      if (token && isJwtTokenExpired(token)) {
        dispatch(logoutEmployee());
      }
    };
    if (window.location.pathname !== "/employee/login") {
      const interval = setInterval(checkTokenExpiry, 60000);
      return () => clearInterval(interval);
    }
  }, [token, dispatch]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoute
            element={<Home />}
            isEmployeeLoggedIn={isAuthenticated}
          />
        }
      />
      <Route
        path="/attendance"
        element={
          <PrivateRoute
            element={<Attendance />}
            isEmployeeLoggedIn={isAuthenticated}
          />
        }
      />
      <Route
        path="/earnings"
        element={
          <PrivateRoute
            element={<Earnings />}
            isEmployeeLoggedIn={isAuthenticated}
          />
        }
      />
      <Route
        path="/paystub/:id"
        element={
          <PrivateRoute
            element={<PayStub />}
            isEmployeeLoggedIn={isAuthenticated}
          />
        }
      />
      <Route path="/login/*" element={<Navigate to="/employee/" />} />
      {!isAuthenticated && <Route path="/login" element={<Login />} />}
    </Routes>
  );
};

export default EmployeeRoutes;
