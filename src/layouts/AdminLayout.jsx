import Navbar from "../components/admin/Navbar";
import PropTypes from "prop-types";
import styled from "styled-components";
import theme from "../themes/theme";

const StyledLayout = styled.div`
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 48px);
  border: 4px solid ${theme.colors.accent};
  border-radius: 14px;
  margin: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
`;

function AdminLayout({ children }) {
  return (
    <StyledLayout>
      <Navbar />
      <main>{children}</main>
    </StyledLayout>
  );
}

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminLayout;
