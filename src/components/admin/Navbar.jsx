import styled from "styled-components";
import DropDownMenu from "../common/DropDownMenu";
import { useState } from "react";
import { formatWithLeadingZero } from "../../helpers";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutAdmin } from "../../redux/reducers/adminReducer";

const StyledNavbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 28px 28px;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
`;

const CompanyLogo = styled.img`
  width: 114px;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
`;

const DateTimeContainer = styled.div`
  display: flex;
  align-items: center;
  font-family: "Baloo Bhai 2";
  font-weight: 200;
  @media (max-width: 768px) {
    display: none;
  }
`;

const DateTimeText = styled.div`
  margin-left: 8px;
  margin-right: 20px;
`;

const ProfileSection = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const DownArrow = styled.img`
  padding: 4px;
  border-radius: 50%;
  cursor: pointer;
  &: hover {
    background-color: #ccc;
  }
`;

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");
  const location = useLocation();
  const { pathname } = location;
  const dispatch = useDispatch();
  const isLoginOrRegister =
    pathname === "/admin/login" || pathname === "/admin/register";
  // const { admin } = useSelector((state) => state.admin.admin) || {};
  // console.log(admin);

  const toggleDropDown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    console.log(isDropdownOpen);
  };

  const handleItemClick = (item) => {
    console.log(item);
    setActiveItem(item);
    setIsDropdownOpen(false);
  };

  const handleLogout = async () => {
    console.log("logout");
    dispatch(logoutAdmin());
  };

  const now = new Date();

  const formattedDate = `${formatWithLeadingZero(
    now.getDate()
  )}-${formatWithLeadingZero(now.getMonth() + 1)}-${now.getFullYear()}`;

  const formattedTime = `${
    now.getHours() > 12 ? now.getHours() - 12 : now.getHours()
  }:${formatWithLeadingZero(now.getMinutes())}`;

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayOfWeek = daysOfWeek[now.getDay()];

  const dropdownItems = [
    "Logout",
  ];

  return (
    <StyledNavbar>
      <LeftSection>
        <CompanyLogo src="/company_logo.svg" alt="company_logo" />
      </LeftSection>
      <RightSection>
        <DateTimeContainer>
          <img src="/sun.svg" alt="sun" />
          <DateTimeText>
            {formattedDate} | {formattedTime} {dayOfWeek}
          </DateTimeText>
        </DateTimeContainer>
        {!isLoginOrRegister && (
          <ProfileSection>
              <>
                <DownArrow
                  src="/down_arrow.svg"
                  alt="down_arrow"
                  onClick={toggleDropDown}
                />

                <DropDownMenu
                  isopen={isDropdownOpen}
                  items={dropdownItems}
                  top="40px"
                  right="-23px"
                  activeItem={activeItem}
                  onItemClick={handleItemClick}
                  onLogout={handleLogout}
                />
              </>
          </ProfileSection>
        )}
      </RightSection>
    </StyledNavbar>
  );
};

export default Navbar;
