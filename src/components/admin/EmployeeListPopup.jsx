import styled from "styled-components";
import theme from "../../themes/theme";

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  font-family: "Baloo Bhai 2";
  transition: opacity 0.3s;
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  pointer-events: ${(props) => (props.isOpen ? "auto" : "none")};
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 7px;
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
  text-align: center;
  width: 80%;
  max-width: 500px;
  transition: transform 0.3s, opacity 0.3s;
  transform: ${(props) => (props.isOpen ? "scale(1)" : "scale(0.9)")};
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  transform-origin: center;
`;

const EditButton = styled.button`
  background: none;
  color: ${theme.colors.accent};
  border: none;
  border: 2px solid ${theme.colors.accent};
  border-radius: 20px;
  cursor: pointer;
  padding: 10px 20px;
  font-size: 18px;
  &:hover {
    opacity: 0.6;
  }
`;

const HideButton = styled.button`
  background: none;
  color: ${theme.colors.accent};
  border: none;
  border: 2px solid ${theme.colors.accent};
  border-radius: 20px;
  cursor: pointer;
  padding: 10px 20px;
  font-size: 18px;
  &:hover {
    opacity: 0.6;
  }
`;


const EmployeeListPopup = ({ selectedEmployee, onClose, onEdit }) => {
  return (
    <ModalBackground isOpen={selectedEmployee !== null}>
      <ModalContent isOpen={selectedEmployee !== null}>
        <h1>Employee's Detail</h1>
        {selectedEmployee && (
          <div style={{textAlign: "left"}}>
            <p>
              Name: {selectedEmployee.firstname} {selectedEmployee.lastname}
            </p>
            <p>DOB: {selectedEmployee.dob}</p>
            <p>Designation: {selectedEmployee.designation}</p>
            <p>Joining Date: {selectedEmployee.joiningDate.split("T")[0]}</p>
            <p>Postal Code: {selectedEmployee.postalCode}</p>
            <p>Phone Number: {selectedEmployee.phoneNumber}</p>
            <p>Email: {selectedEmployee.email}</p>
          </div>)
        }
        <br /> <br />
        <EditButton style={{marginRight: "5px"}} onClick={onEdit}>Edit</EditButton>
        <HideButton onClick={onClose}>Close</HideButton>
      </ModalContent>
    </ModalBackground>
  );
};

export default EmployeeListPopup;
