import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import styled from "styled-components";
import MainLayout from "../../layouts/MainLayout";
import theme from "../../themes/theme";
import Modal from "../../components/common/Modal";
import { getEarnings } from "../../services/apiService";
import { fullMonthNames } from "../../helpers";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 30px;
  margin: 0px 90px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  @media (max-width: 992px) {
    padding: 20px 10px;
    margin: 0 20px;
  }
`;

const EarningTable = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  font-family: "Baloo bhai 2";
  width: 100%;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
`;

const RowItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  @media (max-width: 768px) {
    padding: 10px;
  }
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

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
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

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 50%;
  padding: 8px;
  margin-bottom: 8px;
  margin-right: 10px;
`;

const Arrow = styled.div`
  cursor: pointer;
  margin-right: 10px;
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

const NoRecordsMessage = styled.p`
  font-weight: bold;
  color: #999;
  height: 369px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Earnings = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 13;
  const [data, setData] = useState([]);
  const [isPaystubModalOpen, setIsPaystubModalOpen] = useState(false);
  const paystubMessage = "Paystub can be accessed only after 8th";

  const { employee } = useSelector((state) => state.employee);
  const token = employee.token.accessToken;

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const earningsData = await getEarnings(token);
        setData(earningsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching earnings data:", error);
        setLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  const nextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, data.length);

  const sortedData = [...data].sort((a, b) => {
    const monthOrder =
      fullMonthNames.indexOf(b.month) - fullMonthNames.indexOf(a.month);
    return monthOrder || b.year - a.year;
  });

  const tableData = sortedData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <MainLayout>
      <Container>
        <Header>
          <HeaderLeft>
            <Label>From:</Label>
            <Input type="text" value={new Date().toLocaleDateString()} />
            <Label>To:</Label>
            <Input type="text" value={new Date().toLocaleDateString()} />
          </HeaderLeft>
        </Header>
        <EarningTable>
          <TableHeader>
            <HeaderItem>Earning Statement</HeaderItem>
            <HeaderItem>Pay Date</HeaderItem>
            <HeaderItem>Net Pay</HeaderItem>
          </TableHeader>
          <TableBody>
            {loading ? (
              <NoRecordsMessage>Loading...</NoRecordsMessage>
            ) : tableData.length === 0 ? (
              <NoRecordsMessage>No records found</NoRecordsMessage>
            ) : (
              tableData.map((data, index) => (
                <TableRow key={index}>
                  <RowItem>
                    <Arrow
                      onClick={() => {
                        const currentDate = new Date();
                        const currentDay = currentDate.getDate();
                        const currentMonth = currentDate.getMonth();
                        if (
                          currentDay >= 8 &&
                          data.year === currentDate.getFullYear() &&
                          data.month === fullMonthNames[currentMonth - 1]
                        ) {
                          navigate(`/employee/paystub/${data.id}`);
                        } else {
                          setIsPaystubModalOpen(true);
                        }
                      }}
                    >
                      →
                    </Arrow>
                    {data.month}, {data.year}
                  </RowItem>
                  <RowItem>10/12/2023</RowItem>
                  <RowItem>Rs. {data.earnings}</RowItem>
                </TableRow>
              ))
            )}
          </TableBody>
        </EarningTable>
        <PaginationContainer>
          {currentPage > 1 && (
            <PaginationButton onClick={prevPage}>Previous</PaginationButton>
          )}
          {currentPage < totalPages && (
            <PaginationButton onClick={nextPage}>Next</PaginationButton>
          )}
        </PaginationContainer>
      </Container>
      {isPaystubModalOpen && (
        <Modal
          isOpen={isPaystubModalOpen}
          onClose={() => setIsPaystubModalOpen(false)}
          message={paystubMessage}
        />
      )}
    </MainLayout>
  );
};

export default Earnings;
