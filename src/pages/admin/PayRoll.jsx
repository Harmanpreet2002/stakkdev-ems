import styled from "styled-components";
import theme from "../../themes/theme";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  padding: 20px;
  gap: 15px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const AttendanceTable = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  font-family: "Baloo bhai 2";
  width: 100%;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  background-color: ${theme.colors.accent};
  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr;
    padding: 5px;
    font-size: 14px;
  }
`;

const HeaderItem = styled.div`
  padding: 10px;
  font-weight: bold;
  text-align: center;
  color: #fff;
`;

const TableBody = styled.div`
  display: grid;
  grid-template-columns: 1fr;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  &:nth-child(even) {
    background-color: #f2f2f2;
  }
  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr;
    padding: 5px;
    font-size: 14px;
  }
`;

const RowItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const EmployeeImage = styled.img`
  height: 32px;
  aspect-ratio: 1;
  border-radius: 50%;
  margin-right: 8px;
  object-fit: cover;
`;

const ViewButton = styled.button`
  background: none;
  color: ${theme.colors.accent};
  border: none;
  border: 2px solid ${theme.colors.accent};
  border-radius: 15px;
  cursor: pointer;
  padding: 6px 18px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PaginationButton = styled.button`
  background: none;
  border: 2px solid ${theme.colors.accent};
  border-radius: 15px;
  color: ${theme.colors.accent};
  cursor: pointer;
  margin: 0 10px;
  padding: 6px 18px;
`;

const HeaderLeft = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  & p {
    margin: 0;
    font-family: "Poppins", sans-serif;
  }
`;

const sampleTableData = [
  {
    id: 1,
    employeeImage: "https://picsum.photos/200/300?grayscale",
    employeeName: "John Doe",
    earnings: "XXXX",
  },
  {
    id: 1,
    employeeImage: "https://picsum.photos/200/300?grayscale",
    employeeName: "John Doe",
    earnings: "XXXX",
  },
  {
    id: 1,
    employeeImage: "https://picsum.photos/200/300?grayscale",
    employeeName: "John Doe",
    earnings: "XXXX",
  },
  {
    id: 1,
    employeeImage: "https://picsum.photos/200/300?grayscale",
    employeeName: "John Doe",
    earnings: "XXXX",
  },
  {
    id: 1,
    employeeImage: "https://picsum.photos/200/300?grayscale",
    employeeName: "John Doe",
    earnings: "XXXX",
  },
  {
    id: 1,
    employeeImage: "https://picsum.photos/200/300?grayscale",
    employeeName: "John Doe",
    earnings: "XXXX",
  },
  {
    id: 1,
    employeeImage: "https://picsum.photos/200/300?grayscale",
    employeeName: "John Doe",
    earnings: "XXXX",
  },
  {
    id: 1,
    employeeImage: "https://picsum.photos/200/300?grayscale",
    employeeName: "John Doe",
    earnings: "XXXX",
  },
  {
    id: 1,
    employeeImage: "https://picsum.photos/200/300?grayscale",
    employeeName: "John Doe",
    earnings: "XXXX",
  },
  {
    id: 1,
    employeeImage: "https://picsum.photos/200/300?grayscale",
    employeeName: "John Doe",
    earnings: "XXXX",
  },
  {
    id: 1,
    employeeImage: "https://picsum.photos/200/300?grayscale",
    employeeName: "John Doe",
    earnings: "XXXX",
  },
];

const PayRoll = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const navigate = useNavigate();

  const nextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, sampleTableData.length);
  const tableData = sampleTableData.slice(startIndex, endIndex);

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <p>
            <b>Attendance</b> Month- August
          </p>
        </HeaderLeft>
      </Header>
      <AttendanceTable>
        <TableHeader>
          <HeaderItem>Employee</HeaderItem>
          <HeaderItem>Total Earnings</HeaderItem>
          <HeaderItem>Details</HeaderItem>
        </TableHeader>
        <TableBody>
          {tableData.map((item, index) => (
            <TableRow key={index}>
              <RowItem>
                <EmployeeImage src={item.employeeImage} alt="Employee" />
                <p>{item.employeeName}</p>
              </RowItem>
              <RowItem>{item.earnings}</RowItem>
              <RowItem>
                <ViewButton
                  onClick={() => {
                    navigate("/earning");
                  }}
                >
                  View
                </ViewButton>
              </RowItem>
            </TableRow>
          ))}
        </TableBody>
      </AttendanceTable>
      <PaginationContainer>
        {currentPage > 1 && (
          <PaginationButton onClick={prevPage}>Previous</PaginationButton>
        )}
        {endIndex < sampleTableData.length && (
          <PaginationButton onClick={nextPage}>Next</PaginationButton>
        )}
      </PaginationContainer>
    </Container>
  );
};

export { PayRoll };
