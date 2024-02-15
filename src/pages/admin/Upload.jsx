import styled from "styled-components";
import Button from "../../components/common/Button";
import theme from "../../themes/theme";
import { useRef } from "react";
import { useState, useEffect } from "react";
import { fetchAllHolidays } from "../../services/apiService";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  padding: 50px 0px;
  margin: 0px 50px;
  @media (max-width: 992px) {
    flex-direction: column;
    padding: 20px 10px;
    margin: 0 20px;
  }
`;

const HolidayTable = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  font-family: "Baloo bhai 2";
  padding: 20px;
  margin-left: 50px;
  border-radius: 5px;
  width: 60%;
  background-color: ${theme.colors.secondary};
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  overflow-y: auto;
  max-height: 400px;
`;
const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  background-color: ${theme.colors.accent};
  @media (max-width: 768px) {
    grid-template-columns: 2fr 1fr 1fr;
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
  overflow: auto;
`;
const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  &:nth-child(even) {
    background-color: #f2f2f2;
  }
  @media (max-width: 768px) {
    grid-template-columns: 2fr 1fr 1fr;
    padding: 5px;
    font-size: 14px;
  }
`;
const RowItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6px;
  @media (max-width: 768px) {
    padding: 10px;
  }
`;
const EditButton = styled.button`
  background: none;
  color: ${theme.colors.accent};
  border: none;
  border: 2px solid ${theme.colors.accent};
  border-radius: 15px;
  cursor: pointer;
  padding: 6px 18px;
  &:hover {
    opacity: 0.6;
  }
`;

const SaveButton = styled.button`
  background: none;
  color: ${theme.colors.accent};
  border: none;
  border: 2px solid ${theme.colors.accent};
  border-radius: 15px;
  cursor: pointer;
  padding: 6px 18px;
  &:hover {
    opacity: 0.6;
  }
`;

const CancelButton = styled.button`
  background: none;
  color: ${theme.colors.accent};
  border: none;
  border: 2px solid ${theme.colors.accent};
  border-radius: 15px;
  cursor: pointer;
  padding: 6px 18px;
  &:hover {
    opacity: 0.6;
  }
`;

const SecondSection = styled.div`
  display: flex;
  flex: 0.5;
  flex-direction: column;
  justify-content: space-between;
  align-items: start;
  margin: 0px 99px;
  font-family: "Poppins", sans-serif;
  @media (max-width: 993px) {
    margin-top: 20px;
    flex-direction: column;
    gap: 20px;
  }
`;
const UploadSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  width: 150%;
  height: 25%;
  background-color: ${theme.colors.secondary};
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  @media (max-width: 993px) {
    width: 100%;
  }
`;

const HolidaySection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 150%;
  height: 65%;
  border-radius: 5px;
  background-color: ${theme.colors.secondary};
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  justify-content: center;
  align-items: center;
  @media (max-width: 993px) {
    width: 100%;
  }
`;

const getCurrentDate = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const filterHolidaysForCurrentDate = (holidays, currentDate) => {
  return holidays.filter((holiday) => {
    const holidayDate = holiday.date.split("T")[0];
    return holidayDate === currentDate;
  });
};

const Upload = () => {
  const [holidays, setHolidays] = useState([]);
  const [currentHoliday, setCurrentHoliday] = useState(null);
  const [holidayDay, setHolidayDay] = useState(null);

  const [upcomingHoliday, setUpcomingHoliday] = useState(null);
  const [upcomingHolidayDay, setUpcomingHolidayDay] = useState(null);

  const [editingHolidayId, setEditingHolidayId] = useState(null);
  const [editedHoliday, setEditedHoliday] = useState({});

  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    const formData = new FormData();
    formData.append("holidays", file);

    try {
      const response = await fetch(
        "http://localhost:3000/v1/admin-emp/employee/holidays",
        {
          method: "POST",
          body: formData,
        }
      );
      if (response.ok) {
        alert("Holidays uploaded successfully");
      }
    } catch (error) {
      console.error("Error uploading holidays:", error);
    }
  };

  const handleCurrentHoliday = (holidays, currentDate) => {
    const holidayForCurrentDate = filterHolidaysForCurrentDate(
      holidays,
      currentDate
    );
    if (holidayForCurrentDate.length > 0) {
      const currentHolidayDate = new Date(holidayForCurrentDate[0].date);
      const day = currentHolidayDate.getDate();
      setHolidayDay(day);
      setCurrentHoliday(holidayForCurrentDate[0]);
    }
  };

  const handleUpcomingHoliday = (holidays, currentDate) => {
    const sortedHolidays = [...holidays].sort((a, b) =>
      a.date.localeCompare(b.date)
    );
    const upcomingHoliday = sortedHolidays.find((holiday) => {
      const holidayDate = holiday.date.split("T")[0];
      return holidayDate > currentDate;
    });

    if (upcomingHoliday) {
      const upcomingHolidayDate = new Date(upcomingHoliday.date);
      const day = upcomingHolidayDate.getDate();
      setUpcomingHolidayDay(day);
      setUpcomingHoliday(upcomingHoliday);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAllHolidays();
        setHolidays(data);
        const currentDate = getCurrentDate();

        handleCurrentHoliday(data, currentDate);
        handleUpcomingHoliday(data, currentDate);
      } catch (error) {
        console.error("Error fetching holidays:", error);
      }
    };
    fetchData();
  }, []);

  const handleEdit = (holidayId) => {
    setEditingHolidayId(holidayId);
    const holidayToEdit = holidays.find((holiday) => holiday._id === holidayId);
    if (holidayToEdit) {
      setEditedHoliday(holidayToEdit);
    }
  };

  const handleEditChange = (field, value) => {
    setEditedHoliday((prevEditedHoliday) => ({
      ...prevEditedHoliday,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (editingHolidayId) {
      try {
        const response = await fetch(
          `http://localhost:3000/v1/admin-emp/update_holiday/${editingHolidayId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(editedHoliday),
          }
        );

        if (response.ok) {
          const updatedHoliday = await response.json();
          setHolidays((prevHolidays) =>
            prevHolidays.map((holiday) =>
              holiday._id === updatedHoliday._id ? updatedHoliday : holiday
            )
          );

          setEditingHolidayId(null);
          setEditedHoliday({});
        } else {
          console.error("Failed to update holiday");
        }
      } catch (error) {
        console.error("Error updating holiday:", error);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingHolidayId(null);
    setEditedHoliday({});
  };

  return (
    <Container>
      <HolidayTable>
        <TableHeader>
          <HeaderItem>Holiday name</HeaderItem>
          <HeaderItem>date</HeaderItem>
          <HeaderItem>details</HeaderItem>
        </TableHeader>
        <TableBody>
          {holidays.map((holiday) => (
            <TableRow key={holiday._id}>
              {editingHolidayId === holiday._id ? (
                <>
                  <RowItem>
                    <input
                      type="text"
                      value={editedHoliday.holidayName || holiday.holidayName}
                      onChange={(e) =>
                        handleEditChange("holidayName", e.target.value)
                      }
                    />
                  </RowItem>
                  <RowItem>
                    <input
                      type="text"
                      value={editedHoliday.date || holiday.date}
                      onChange={(e) => handleEditChange("date", e.target.value)}
                    />
                  </RowItem>
                  <RowItem>
                    <SaveButton onClick={handleSave}>Save</SaveButton>
                    <CancelButton onClick={handleCancelEdit}>
                      Cancel
                    </CancelButton>
                  </RowItem>
                </>
              ) : (
                <>
                  <RowItem>{holiday.holidayName}</RowItem>
                  <RowItem>{holiday.date}</RowItem>
                  <RowItem>
                    <EditButton onClick={() => handleEdit(holiday._id)}>
                      Edit
                    </EditButton>
                  </RowItem>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </HolidayTable>
      <SecondSection>
        <UploadSection>
          <div>
            <input
              type="file"
              accept=".csv, .xlsx"
              style={{ display: "none" }}
              onChange={handleFileChange}
              id="fileInput"
              ref={fileInputRef}
            />
            <label htmlFor="fileInput">
              <Button
                text="Upload Holidays"
                backgroundcolor={theme.colors.accent}
                textcolor="white"
                padding="8px 20px"
                borderradius="5px"
                onClick={handleUploadClick}
                as="span"
              />
            </label>
          </div>
        </UploadSection>
        <HolidaySection>
          {" "}
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src="/arrow-up-right-circle.svg"
              style={{ marginRight: "10px" }}
            />{" "}
            {currentHoliday ? (
              <p style={{ fontSize: "20px", fontWeight: "600" }}>Holiday</p>
            ) : (
              <p style={{ fontSize: "20px", fontWeight: "600" }}>
                Upcoming Holiday
              </p>
            )}
          </div>
          {currentHoliday ? (
            <p
              style={{
                fontSize: "20px",
                fontWeight: "600",
                marginTop: "1px",
              }}
            >
              {holidayDay} {currentHoliday.holidayName}
            </p>
          ) : (
            <p
              style={{
                fontSize: "20px",
                fontWeight: "600",
                marginTop: "1px",
              }}
            >
              {upcomingHolidayDay} {upcomingHoliday?.holidayName}
            </p>
          )}
          {currentHoliday ? (
            <p
              style={{
                fontSize: "20px",
                fontWeight: "600",
                marginTop: "0px",
              }}
            >
              {currentHoliday.day}
            </p>
          ) : (
            <p
              style={{
                fontSize: "20px",
                fontWeight: "600",
                marginTop: "0px",
              }}
            >
              {upcomingHoliday?.day}
            </p>
          )}
        </HolidaySection>
      </SecondSection>
    </Container>
  );
};

export default Upload;
