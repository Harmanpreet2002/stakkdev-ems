import styled from "styled-components";
import PropTypes from "prop-types";

const StyledButton = styled.button`
  background-color: ${(props) => props.backgroundcolor};
  color: ${(props) => props.textcolor};
  padding: ${(props) => props.padding};
  border-radius: ${(props) => props.borderradius};
  border: none;
  cursor: pointer;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
  font-family: "Baloo bhai 2";  
`;

function Button({
  text,
  onClick,
  backgroundcolor,
  textcolor,
  padding,
  borderradius,
}) {
  return (
    <StyledButton
      onClick={onClick}
      backgroundcolor={backgroundcolor}
      textcolor={textcolor}
      padding={padding}
      borderradius={borderradius}
    >
      {text}
    </StyledButton>
  );
}

Button.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  backgroundcolor: PropTypes.string,
  textcolor: PropTypes.string,
  padding: PropTypes.string,
  borderradius: PropTypes.string,
};

export default Button;
