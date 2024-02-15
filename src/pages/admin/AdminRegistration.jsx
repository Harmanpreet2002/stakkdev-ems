import styled from "styled-components";
import theme from "../../themes/theme";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import { adminRegistration } from "../../services/apiService";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 185px);
  padding: 0px 30px;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: ${theme.colors.secondary};
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  font-family: "Baloo bhai 2";
`;

const FormHeading = styled.h1`
  text-align: center;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 3px;
  font-size: 16px;
  font-family: "Baloo bhai 2";
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: ${theme.colors.accent};
  color: #fff;
  border: none;
  border-radius: 3px;
  font-size: 16px;
  cursor: pointer;
  font-family: "Poppins", sans-serif;
`;

const AdminRegister = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await adminRegistration({
        email,
        password,
      });
      navigate("/admin/login");
    } catch (error) {
      console.error("Error while register:", error);
    }
  };

  return (
    <AdminLayout>
      <Container>
        <FormContainer onSubmit={handleRegister}>
          <FormHeading>Admin Register</FormHeading>
          <FormInput
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
          />
          <FormInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
          />
          <Button type="submit">Register</Button>
        </FormContainer>
      </Container>
    </AdminLayout>
  );
};

export default AdminRegister;
