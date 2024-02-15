import MainLayout from "../../layouts/MainLayout";
import styled from "styled-components";
import theme from "../../themes/theme";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AttendanceDetailsModal from "../../components/employee/AttendanceDetailsModal";
import {
  fetchEmployeeAttendance,
  fetchEmployeeImage,
  fetchStandupData,
  fetchWorkingHours,
} from "../../services/apiService";
import { formatDate, formatTime, fullMonthNames, shortMonthNames } from "../../helpers";

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
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  background-color: ${theme.colors.accent};
  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
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
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  &:nth-child(even) {
    background-color: #f2f2f2;
  }
  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
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

const SelectContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  font-family: "Poppins", sans-serif;
  @media (max-width: 767px) {
    flex-direction: column;
    gap: 14px;
    margin-top: 16px;
  }
`;

const Select = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledSelectText = styled.p`
  margin: 0 10px 0 0;
  font-weight: 300;
`;

const StyledSelect = styled.select`
  background-color: ${theme.colors.background};
  color: ${theme.colors.text};
  border: none;
  outline: none;
  border-radius: 17px;
  padding: 8px 20px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
`;

const NoRecordsMessage = styled.p`
  font-weight: bold;
  color: #999;
  // height: 369px;
  height: 353px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Attendance = () => {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [standupData, setStandupData] = useState([]);
  const [workingHours, setWorkingHours] = useState([]);

  const itemsPerPage = 6;

  const { employee } = useSelector((state) => state.employee);
  const token = employee.token.accessToken;
  let info = employee?.info;
  if (info && info.name) {
    info = {
      ...info,
      name: info.name.charAt(0).toUpperCase() + info.name.slice(1),
    };
  }

  const nextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, attendanceData.length);

  const currentMonthIndex = new Date().getMonth();
  const defaultSelectedMonth = shortMonthNames[currentMonthIndex];
  const [selectedMonth, setSelectedMonth] = useState(defaultSelectedMonth);

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const startYear = 2023;
  const endYear = currentYear + (currentYear - startYear);
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, index) => startYear + index
  );

  const fetchImage = async () => {
    try {
      const image = await fetchEmployeeImage(token);
      setSelectedImage(image);
    } catch (error) {
      console.error("Error while fetching image:", error);
    }
  };

  const fetchAttendance = async () => {
    try {
      const attendance = await fetchEmployeeAttendance(token);
      const { attendanceRecords } = attendance;
      if (Array.isArray(attendanceRecords)) {
        const formattedData = attendanceRecords.map((item) => {
          const formattedDate = formatDate(item.date);

          const formattedPunchInTimes = item.punchInTimes.map((time) => {
            const formattedPunchInTime = formatTime(time);
            return formattedPunchInTime;
          });

          const formattedPunchOutTimes = item.punchOutTimes.map((time) => {
            const formattedPunchOutTime = formatTime(time);
            return formattedPunchOutTime;
          });

          return {
            date: formattedDate,
            punchInTimes: formattedPunchInTimes,
            punchOutTimes: formattedPunchOutTimes,
          };
        });
        setAttendanceData(formattedData);
      }
    } catch (error) {
      console.error("Error while fetching attendance:", error);
    }
  };

  const fetchStandup = async () => {
    try {
      const standup = await fetchStandupData(token);
      setStandupData(standup);
    } catch (error) {
      console.error("Error while fetching standup data", error);
    }
  };

  const fetchHours = async () => {
    try {
      const workingHours = await fetchWorkingHours(token);
      setWorkingHours(workingHours);
    } catch (error) {
      console.log("Error while fetching working hours:", error);
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchImage(), fetchAttendance(), fetchStandup(), fetchHours()]);
      } catch (error) {
        console.error("Error while fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedMonth, selectedYear]);

  const filteredTableData = attendanceData.filter((item) => {
    const [, itemMonth, itemYear] = item.date
      .split("-")
      .map((part) => part.replace(/^0/, ""));
    const itemMonthName = shortMonthNames[parseInt(itemMonth) - 1];
    return itemMonthName === selectedMonth && Number(itemYear) === selectedYear;
  });

  const tableData = filteredTableData.slice(startIndex, endIndex);

  const handleViewDetails = (employee, punchInTimes, punchOutTimes) => {
    const matchingStandup = standupData.find((standup) => {
      const formattedStandupDate = formatDate(standup.date);
      return formattedStandupDate === employee.date;
    });
    const matchWorkingHours = workingHours.find((workingHour) => {
      const formattedWorkingHourDate = formatDate(workingHour?.date);
      return formattedWorkingHourDate === employee.date;
    })
    setSelectedEmployee({
      employee,
      punchInTimes,
      punchOutTimes,
      matchingStandup,
      matchWorkingHours
    });
    setShowDetails(true);
  };

  const totalPages = Math.ceil(filteredTableData.length / itemsPerPage);

  return (
    <MainLayout>
      <Container>
        <Header>
          <HeaderLeft>
            <p>
              <b>Attendance</b> Month- {fullMonthNames[currentMonthIndex]}
            </p>
          </HeaderLeft>
          <SelectContainer>
            <Select>
              <StyledSelectText htmlFor="month">Month</StyledSelectText>
              <StyledSelect
                id="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {shortMonthNames.map((month, index) => (
                  <option key={index}>{month}</option>
                ))}
              </StyledSelect>
            </Select>
            <Select>
              <StyledSelectText>Year</StyledSelectText>
              <StyledSelect
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {years.map((year, index) => (
                  <option key={index}>{year}</option>
                ))}
              </StyledSelect>
            </Select>
          </SelectContainer>
        </Header>
        <AttendanceTable>
          <TableHeader>
            <HeaderItem>Employee</HeaderItem>
            <HeaderItem>Designation</HeaderItem>
            <HeaderItem>Date</HeaderItem>
            <HeaderItem>Check-in Time</HeaderItem>
            <HeaderItem>Checkout Time</HeaderItem>
            <HeaderItem>Details</HeaderItem>
          </TableHeader>
          <TableBody>
            {loading ? (
              <NoRecordsMessage>Loading...</NoRecordsMessage>
            ) : tableData.length === 0 ? (
              <NoRecordsMessage>No records found.</NoRecordsMessage>
            ) : (
              tableData.map((item, index) => (
                <TableRow key={index}>
                  <RowItem>
                    <EmployeeImage
                      src={selectedImage || "/user.svg"}
                      alt="Employee"
                    />
                    <p>{info?.name}</p>
                  </RowItem>
                  <RowItem>{info?.designation}</RowItem>
                  <RowItem>{item.date}</RowItem>
                  <RowItem>{item.punchInTimes[0]}</RowItem>
                  <RowItem>
                    {item.punchOutTimes[item.punchOutTimes.length - 1]}
                  </RowItem>
                  <RowItem>
                    <ViewButton
                      onClick={() =>
                        handleViewDetails(
                          item,
                          item.punchInTimes,
                          item.punchOutTimes
                        )
                      }
                    >
                      View
                    </ViewButton>
                  </RowItem>
                </TableRow>
              ))
            )}
          </TableBody>
        </AttendanceTable>
        <PaginationContainer>
          {currentPage > 1 && (
            <PaginationButton onClick={prevPage}>Previous</PaginationButton>
          )}
          {currentPage < totalPages && (
            <PaginationButton onClick={nextPage}>Next</PaginationButton>
          )}
        </PaginationContainer>
      </Container>

      <AttendanceDetailsModal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        punchInTimes={selectedEmployee ? selectedEmployee.punchInTimes : []}
        punchOutTimes={selectedEmployee ? selectedEmployee.punchOutTimes : []}
        standup={selectedEmployee ? selectedEmployee.matchingStandup : {}}
        workingHours={selectedEmployee ? selectedEmployee.matchWorkingHours: {}}
      />
    </MainLayout>
  );
};

export default Attendance;
