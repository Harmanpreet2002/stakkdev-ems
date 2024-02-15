import styled from "styled-components";
import DropDownMenu from "../common/DropDownMenu";
import { useEffect, useState } from "react";
import { daysOfWeek, formatWithLeadingZero } from "../../helpers";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutEmployee } from "../../redux/reducers/employeeReducer";
import theme from "../../themes/theme";
import {
  deleteEmployeeImage,
  fetchEmployeeImage,
} from "../../services/apiService";

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

const EmployeeImage = styled.img`
  height: 32px;
  aspect-ratio: 1;
  border-radius: 50%;
  margin-right: 8px;
  object-fit: cover;
`;

const DeleteImageButton = styled.button`
  position: absolute;
  top: 160%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 5px;
  cursor: pointer;
  width: 100px;
  line-height: 30px;
  border: none;
  background-color: ${theme.colors.accent};
  color: white;
  opacity: 1; /* Initially hidden */
  pointer-events: auto; /* Prevents interaction when hidden */
`;

const EmployeeImageContainer = styled.div`
  position: relative;

  &:hover ${DeleteImageButton} {
    opacity: 1; /* Show the button when the parent container is hovered */
    pointer-events: auto; /* Enable interaction when visible */
  }
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
  const [activeItem, setActiveItem] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const location = useLocation();
  const { pathname } = location;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoginOrRegister = pathname === "/employee/login";
  const { employee } = useSelector((state) => state.employee);
  const token = employee?.token?.accessToken;

  const now = new Date();
  const dayOfWeek = daysOfWeek[now.getDay()];

  const formattedDate = `${formatWithLeadingZero(
    now.getDate()
  )}-${formatWithLeadingZero(now.getMonth() + 1)}-${now.getFullYear()}`;

  const formattedTime = `${
    now.getHours() > 12 ? now.getHours() - 12 : now.getHours()
  }:${formatWithLeadingZero(now.getMinutes())}`;

  const toggleDropDown = () => {
    console.log(isDropdownOpen);
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleItemClick = (item) => {
    if (item === "Attendance") {
      setActiveItem(item);
      navigate("/employee/attendance");
      setIsDropdownOpen(false);
    } else if (item === "Earnings") {
      setActiveItem(item);
      navigate("/employee/earnings");
      setIsDropdownOpen(false);
    }
  };

  const handleDeleteImage = async () => {
    try {
      await deleteEmployeeImage(token);
      setSelectedImage(null);
    } catch (error) {
      console.error("Error while deleting image:", error);
    }
  };

  const fetchImage = async () => {
    try {
      const image = await fetchEmployeeImage(token);
      setSelectedImage(image);
    } catch (error) {
      console.error("Error while fetching image:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchImage();
    }
  }, [token]);

  const handleLogout = async () => {
    dispatch(logoutEmployee());
    return <Navigate to="/employee/login" />;
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profileImage", file);
      try {
        const response = await fetch("http://localhost:3000/v1/image/upload", {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          console.log("Image uploaded successfully");
          fetchImage();
        } else {
          console.error("Image upload failed");
        }
      } catch (error) {
        console.error("Error while uploading image:", error);
      }
    }
  };

  const dropdownItems = ["Attendance", "Earnings", "Logout"];

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
            <input
              type="file"
              name=""
              id="imageInput"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
            <EmployeeImageContainer>
              <EmployeeImage
                src={selectedImage || "/user.svg"}
                onClick={() => {
                  document.getElementById("imageInput").click();
                }}
              />
              <DeleteImageButton onClick={handleDeleteImage}>
                Delete Image
              </DeleteImageButton>
            </EmployeeImageContainer>

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
          </ProfileSection>
        )}
      </RightSection>
    </StyledNavbar>
  );
};

export default Navbar;
