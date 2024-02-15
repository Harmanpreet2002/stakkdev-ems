import styled from "styled-components";
import theme from "../../themes/theme";
import PropTypes from "prop-types";

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
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
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
  text-align: center;
  width: 80%;
  max-width: 500px;
  transition: transform 0.3s, opacity 0.3s;
  transform: ${(props) => (props.isOpen ? "scale(1)" : "scale(0.9)")};
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  transform-origin: center;
  margin: 0px 15px;
`;

const SuccessMessage = styled.p`
  font-size: 20px;
  margin: 20px 0;
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
`;

const Modal = ({ isOpen, onClose, message }) => {
  return (
    <ModalBackground isOpen={isOpen}>
      <ModalContent isOpen={isOpen}>
        <SuccessMessage>{message}</SuccessMessage>
        <HideButton onClick={onClose}>Hide</HideButton>
      </ModalContent>
    </ModalBackground>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
};

export default Modal;
