// Api Service

const apiService = async (endpoint, { method, token, body }) => {
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const requestOptions = {
    method,
    headers,
    body: JSON.stringify(body),
  };

  try {
    const response = await fetch(
      `http://localhost:3000/v1/${endpoint}`,
      requestOptions
    );
    if (response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      } else if (contentType && contentType.includes("image")) {
        const blob = await response.blob();
        return URL.createObjectURL(blob);
      } else {
        return null;
      }
    }

    throw new Error(`${response.statusText}`);
  } catch (error) {
    console.error(`Error in ${method} ${endpoint}:`, error.message);
    throw new Error(`${error.message}`);
  }
};

// Employee Services functions

const fetchAllHolidays = async () => {
  return apiService("admin-emp/all_holidays", { method: "GET" });
};

const punchAction = async (token, action) => {
  return apiService("attendance/punch", {
    method: "POST",
    token,
    body: { action },
  });
};

const addStandup = async (token, standupData) => {
  return apiService("standup/add", {
    method: "POST",
    token,
    body: standupData,
  });
};

const getEarnings = async (token) => {
  return apiService("earning/get-earnings", { method: "GET", token });
};

const fetchEmployeeImage = async (token) => {
  return apiService("image/getImage", { method: "GET", token });
};

const fetchEmployeeAttendance = async (token) => {
  return apiService("attendance/record", { method: "GET", token });
};

const fetchStandupData = async (token) => {
  return apiService("standup/get", { method: "GET", token });
};

const fetchEmployeeData = async (employeeId, token) => {
  return apiService(`admin-emp/get_employee/${employeeId}`, {
    method: "GET",
    token,
  });
};

const getEarningById = async (id, token) => {
  return apiService(`earning/get-earning-by-id/${id}`, {
    method: "GET",
    token,
  });
};

const loginUser = async (employeeData) => {
  return apiService("employee/login", { method: "POST", body: employeeData });
};

const deleteEmployeeImage = async (token) => {
  return apiService("image/deleteImage", { method: "GET", token });
};

const uploadEmployeeImage = async (token, file) => {
  const formData = new FormData();
  formData.append("profileImage", file);

  return apiService("image/upload", {
    method: "POST",
    token,
    body: formData,
  });
};

const fetchWorkingHours = async (token) => {
  return apiService("attendance/working-hours-per-day", {
    method: "GET",
    token,
  });
};

// Admin Services functions

const adminLogin = async (adminData) => {
  return apiService("admin/login", { method: "POST", body: adminData });
};

const adminRegistration = async (adminData) => {
  return apiService("admin/register", { method: "POST", body: adminData });
};

const registerEmployee = async (token, employeeData) => {
  return apiService("admin/register-employee", {
    method: "POST",
    token,
    body: employeeData,
  });
};

const fetchEmployeesData = async (token) => {
  return apiService("admin-emp/get_employees", {method:"GET", token});
}

export {
  fetchAllHolidays,
  addStandup,
  punchAction,
  getEarnings,
  fetchEmployeeImage,
  fetchEmployeeAttendance,
  fetchStandupData,
  fetchEmployeeData,
  getEarningById,
  loginUser,
  deleteEmployeeImage,
  uploadEmployeeImage,
  fetchWorkingHours,
  adminLogin,
  adminRegistration,
  registerEmployee,
  fetchEmployeesData
};
