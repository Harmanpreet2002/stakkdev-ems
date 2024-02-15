import { Routes, Route, Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import AdminLogin from "../pages/admin/AdminLogin";
import AdminRegistration from "../pages/admin/AdminRegistration";
import { useDispatch, useSelector } from "react-redux";
import Dashboard from "../pages/admin/Dashboard";
import EditEmployee from "../pages/admin/EditEmployee";
import { useEffect } from "react";
import { logoutAdmin } from "../redux/reducers/adminReducer";

const PrivateRoute = ({ element, isAdminLoggedIn }) => {
  if (isAdminLoggedIn) {
    return element;
  } else {
    return <Navigate to="/admin/login" />;
  }
};

PrivateRoute.propTypes = {
  element: PropTypes.element.isRequired,
  isAdminLoggedIn: PropTypes.bool.isRequired,
};

const AdminRoutes = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.admin.isAuthenticated);
  const admin = useSelector((state) => state.admin.admin);
  const { accessToken: token, expires } = admin;

  const isJwtTokenExpired = (expires) => {
    if (!expires) {
      return true;
    }
    const expiresTime = new Date(expires).getTime();
    const currentTime = new Date().getTime();
    return expiresTime <= currentTime;
  };

  useEffect(() => {
    const checkTokenExpiry = () => {
      if (token && isJwtTokenExpired(expires)) {
        dispatch(logoutAdmin());
      }
    };
    if (window.location.pathname !== "/admin/login") {
      const interval = setInterval(checkTokenExpiry, 60000);
      return () => clearInterval(interval);
    }
  }, [token, expires, dispatch]);

  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <PrivateRoute
            element={<Dashboard />}
            isAdminLoggedIn={isAuthenticated}
          />
        }
      />
      <Route
        path="/edit-employee/:employeeId"
        element={
          <PrivateRoute
            element={<EditEmployee />}
            isAdminLoggedIn={isAuthenticated}
          />
        }
      />
      <Route path="/register" element={<AdminRegistration />} />
      <Route path="/login/*" element={<Navigate to="/admin/dashboard" />} />
      {!isAuthenticated && <Route path="/login" element={<AdminLogin />} />}
    </Routes>
  );
};

export { AdminRoutes };
