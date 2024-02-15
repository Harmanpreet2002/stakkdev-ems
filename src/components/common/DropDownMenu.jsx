import styled from "styled-components";
import theme from "../../themes/theme";
import PropTypes from "prop-types";

const DropDownContainer = styled.div`
  position: absolute;
  top: ${(props) => props.top};
  right: ${(props) => props.right};
  background-color: ${theme.colors.primary};
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1;
  display: ${(props) => (props.isopen ? "block" : "none")};
  width: 150px;
  padding: 5px;
`;

const DropDownItem = styled.div`
  padding: 8px 16px;
  text-align: center;
  border-radius: 4px;
  font-family: "Baloo Bhai 2";
  cursor: pointer;
  background-color: ${(props) =>
    props.active ? theme.colors.accent : "transparent"};
  &: hover {
    background-color: ${(props) => (props.active ? "" : "#ccc")};
  }
`;

const DropDownMenu = ({
  isopen,
  items,
  top,
  right,
  onItemClick,
  activeItem,
  onLogout,
}) => {
  return (
    <DropDownContainer isopen={isopen} top={top} right={right}>
      {items.map((item, index) => (
        <DropDownItem
          key={index}
          onClick={() => {
            if (item === "Logout") {
              onLogout(); 
            } else {
              onItemClick(item);
            }
          }}
          active={item === activeItem}
        >
          {item}
        </DropDownItem>
      ))}
    </DropDownContainer>
  );
};

DropDownMenu.propTypes = {
  isopen: PropTypes.bool.isRequired,
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  top: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  right: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onItemClick: PropTypes.func.isRequired,
  activeItem: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default DropDownMenu;
