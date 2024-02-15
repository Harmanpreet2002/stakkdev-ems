import MainLayout from "../../layouts/MainLayout";
import styled from "styled-components";
import theme from "../../themes/theme";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchEmployeeData, getEarningById } from "../../services/apiService";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 600px;
  padding: 5px;
  margin: 0 auto;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: ${theme.colors.secondary};
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  font-family: "Baloo bhai 2";
`;

const Heading = styled.div`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
`;

const HeaderRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const HeaderColumn = styled.div`
  flex: 1;
  padding: 5px;
`;

const Table = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  font-family: "Baloo bhai 2";
  width: 100%;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  background-color: ${theme.colors.accent};
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 5px;
    font-size: 14px;
  }
`;

const HeaderItem = styled.div`
  padding: 10px;
  font-weight: bold;
  text-align: center;
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
    grid-template-columns: 1fr;
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

const SectionTitle = styled.div`
  font-weight: bold;
`;

const PayStub = () => {
  const { id } = useParams();
  const [employeeData, setEmployeeData] = useState(null);
  const [data, setData] = useState(null);
  const { employee } = useSelector((state) => state.employee);
  const token = employee.token.accessToken;

  const calculatePaymentPeriod = (month, year) => {
    const startDate = new Date(`${month} 1, ${year}`);
    const endDate = new Date(year, new Date(startDate).getMonth() + 1, 0);
    const startDateFormatted = `${
      startDate.getMonth() + 1
    }/${startDate.getDate()}/${year}`;
    const endDateFormatted = `${
      endDate.getMonth() + 1
    }/${endDate.getDate()}/${year}`;

    return {
      from: startDateFormatted,
      to: endDateFormatted,
    };
  };

  const paymentPeriod = calculatePaymentPeriod(data?.month, data?.year);

  const fetchEmployee = async () => {
    try {
      const employee = await fetchEmployeeData(data.employeeId, token);
      setEmployeeData(employee);
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  const fetchEarningById = async () => {
    try {
      const earning = await getEarningById(id, token);
      setData(earning);
    } catch (error) {
      console.error("Error fetching earning:", error);
    }
  };

  useEffect(() => {
    fetchEarningById();
  }, [id]);

  useEffect(() => {
    if (data && data?.employeeId) {
      fetchEmployee();
    }
  }, [data?.employeeId]);

  return (
    <MainLayout>
      <Container>
        <Heading>PAY STUB</Heading>
        <Header>
          <HeaderRow>
            <HeaderColumn>
              Employee Name:{" "}
              {employeeData?.firstname[0].toUpperCase() +
                employeeData?.firstname.slice(1)}
            </HeaderColumn>
            <HeaderColumn>
              Employee Address: {employeeData?.address1}
            </HeaderColumn>
          </HeaderRow>
          <HeaderRow>
            <HeaderColumn>
              Position/Title: {employeeData?.designation}
            </HeaderColumn>
            <HeaderColumn>PaymentMethod: Direct Deposit</HeaderColumn>
          </HeaderRow>
        </Header>
        <br />
        <Table>
          <TableHeader>
            <HeaderItem>Payment Period(from)</HeaderItem>
            <HeaderItem>Payment Period(to)</HeaderItem>
            <HeaderItem>Payment Date</HeaderItem>
          </TableHeader>
          <TableBody>
            <TableRow>
              <RowItem>{paymentPeriod.from}</RowItem>
              <RowItem>{paymentPeriod.to}</RowItem>
              <RowItem>10/12/2023</RowItem>
            </TableRow>
          </TableBody>
        </Table>
        <br />
        <SectionTitle>Earnings</SectionTitle>
        <Table>
          <TableHeader>
            <HeaderItem></HeaderItem>
            <HeaderItem>Current Total</HeaderItem>
            <HeaderItem>YTD(Year To Date)</HeaderItem>
          </TableHeader>
          <TableBody>
            <TableRow>
              <RowItem></RowItem>
              <RowItem>Rs. {data?.earnings}</RowItem>
              <RowItem>Rs. {data?.earnings}</RowItem>
            </TableRow>
            <SectionTitle>Gross Pay</SectionTitle>
            <TableRow>
              <RowItem>gross</RowItem>
              <RowItem>Rs. {data?.earnings}</RowItem>
              <RowItem>Rs. {data?.earnings}</RowItem>
            </TableRow>
          </TableBody>
        </Table>
        <Table>
          <br />
          <SectionTitle>Net Pay</SectionTitle>
          <TableHeader>
            <HeaderItem></HeaderItem>
            <HeaderItem>Current Total</HeaderItem>
            <HeaderItem>YTD(Year To Date)</HeaderItem>
          </TableHeader>
          <TableBody>
            <TableRow>
              <RowItem>net pay</RowItem>
              <RowItem>Rs. {data?.earnings}</RowItem>
              <RowItem>Rs. {data?.earnings}</RowItem>
            </TableRow>
          </TableBody>
        </Table>
      </Container>
    </MainLayout>
  );
};

export default PayStub;
