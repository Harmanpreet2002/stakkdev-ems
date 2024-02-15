import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import styled from "styled-components";
import theme from "../../themes/theme";
import EmployeeForm from "./EmployeeRegistration";
import EmployeeList from "./EmployeeList";
import PayRoll from "./Payroll";
import Upload from "./Upload";
import MenuIcon from "@mui/icons-material/Menu";

const Container = styled.div`
  display: grid;
  grid-template-columns: ${({ showMenu }) => (showMenu ? "auto 1fr" : "0 1fr")};
  padding: 0px 20px;
  gap: 15px;
  transition: grid-template-columns 0.3s;
  @media (max-width: 768px) {
    grid-template-columns: ${({ showMenu }) => (showMenu ? "0 1fr" : "0 1fr")};
  }
  @media (max-width: 992px) {
    grid-template-columns: ${({ showMenu }) => (showMenu ? "0 1fr" : "0 1fr")};
    padding: 20px;
  }
`;

const Sidebar = styled.div`
  width: 200px; /* Set a fixed width for the sidebar */
  transform: translateX(${({ showMenu }) => (showMenu ? "0" : "-1%")});
  opacity: ${({ showMenu }) => (showMenu ? 1 : 0)};
  transition: transform 0.3s, opacity 0.3s;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 30px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  background-color: #f1f1f1;
  font-family: "Baloo bhai 2";
  color: white;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    width: 150px;
    transform: translateX(${({ showMenu }) => (showMenu ? "0" : "-100%")});
    opacity: ${({ showMenu }) => (showMenu ? 1 : 0)};
    padding: 30px;
  }
  a {
    text-decoration: none;
    color: ${theme.colors.text};
    font-weight: bold;
    padding: 10px;
    border-radius: 5px;
    background-color: ${theme.colors.accent};
    transition: background-color 0.3s;
    cursor: pointer;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
    &:hover {
      opacity: 0.7;
    }
  }
`;

const MenuIconWrapper = styled.div`
  width: 30px;
  height: 30px;
  margin: 0px 20px;
  cursor: pointer;
  position: relative;
  z-index: 2;
`;

const RightContainer = styled.div`
  border: 2px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  background-color: #f1f1f1;
  position: relative;
  min-height: 539px;
`;

const Dashboard = () => {
  const [selectedOption, setSelectedOption] = useState(
    localStorage.getItem("selectedOption") || "register"
  );
  const [showMenu, setShowMenu] = useState(false);
  
  const renderContent = () => {
    switch (selectedOption) {
      case "register":
        return <EmployeeForm />;
      case "employeeList":
        return <EmployeeList />;
      case "payroll":
        return <PayRoll />;
      case "upload":
        return <Upload />;
      default:
        return null;
    }
  };

  const toggleSidebar = () => {
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    localStorage.setItem("selectedOption", selectedOption);
  }, [selectedOption]);

  return (
    <AdminLayout>
      <MenuIconWrapper>
        <MenuIcon onClick={toggleSidebar} />
      </MenuIconWrapper>
      <Container showMenu={showMenu}>
        <Sidebar showMenu={showMenu}>
          <a onClick={() => setSelectedOption("register")}>Register Employee</a>
          <a onClick={() => setSelectedOption("employeeList")}>Employee List</a>
          <a onClick={() => setSelectedOption("payroll")}>Payroll</a>
          <a onClick={() => setSelectedOption("upload")}>Upload</a>
        </Sidebar>
        <RightContainer>{renderContent()}</RightContainer>
      </Container>
    </AdminLayout>
  );
};

export default Dashboard;
