import styled from "styled-components";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import MainLayout from "../../layouts/MainLayout";
import StandupPopup from "../../components/common/StandupPopup";
import theme from "../../themes/theme";
import Button from "../../components/common/Button";
import { addStandup, fetchAllHolidays } from "../../services/apiService";
import { calculateTime, getCurrentDate } from "../../helpers";
import { useTimer } from "../../context/TimerContext";

const Container = styled.div`
  display: flex;
  padding: 20px 0px;
  height: calc(100vh - 185px);
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 0px 20px;
    height: calc(100vh - -550px);
  }
`;

const LeftSection = styled.div`
  flex: 1;
  border-right: 1px solid hsl(0deg 5.77% 72.06%);
  padding: 0px 15px;
  @media (max-width: 768px) {
    border-right: none;
    border-bottom: 1px solid hsl(0deg 5.77% 72.06%);
    padding: 15px 0px;
  }
`;

const RightSection = styled.div`
  flex: 1;
  flex-grow: 1;
  padding: 0px 15px;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    padding: 15px 0px;
  }
`;

const PunchInSection = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${theme.colors.secondary};
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
`;

const GreetingSection = styled.div`
  flex: 1;
  background-color: ${theme.colors.secondary};
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  padding: 30px;
  font-family: "Poppins", sans-serif;
  @media (max-width: 596px) {
    flex-direction: column-reverse;
    gap: 30px;
  }
`;

const GreetingText = styled.div`
  flex: 1;
  & h1,
  p {
    margin: 0px;
  }
  & p:first-child {
    font-size: 20px;
    font-weight: 600;
    color: black;
  }
  & p:not(:first-child) {
    font-size: 20px;
    font-weight: 200;
    color: hsl(0deg 9.2% 67.13%);
  }
  @media (max-width: 992px) {
    h1 {
      font-size: 1.563rem;
    }
  }
`;

const GreetingImage = styled.img`
  flex: 1;
  max-height: 100%;
  max-width: 60%;
  object-fit: cover;
  @media (max-width: 596px) {
    max-width: 100%;
  }
`;

const BottomDivContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  font-family: "Poppins", sans-serif;
  @media (max-width: 596px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const BottomDiv = styled.div`
  width: 49%;
  background-color: ${theme.colors.secondary};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  align-self: stretch;
  padding: 0px 30px;
  box-sizing: border-box;
  @media (max-width: 596px) {
    width: 100%;
  }
`;

const MainHeading = styled.h1`
  font-family: "Poppins", sans-serif;
  margin: 0;
  @media (max-width: 992px) {
    font-size: 1.563rem;
  }
`;

const ProgressBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: "Baloo Bhai 2";
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(closest-side, white 79%, transparent 80% 100%),
    conic-gradient(${theme.colors.accent} ${(props) => props.progress}, black 0);
`;

const ProgressContainerText = styled.p`
  color: hsl(0deg 0% 40.78%);
  margin: 0;
  padding: 0;
`;

const ProgressContainerHours = styled.p`
  font-weight: bold;
  font-size: 28px;
  margin: 0;
  padding: 0;
`;

const TimerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${theme.colors.timerColor};
  color: white;
  border: 1px solid #ccc;
  width: 200px;
  border-radius: 10px;
  font-family: "Baloo bhai 2";
`;

const Divider = styled.div`
  width: 1px;
  height: 100%;
  background-color: black;
`;

const TimerSection = styled.div`
  flex: 1;
  text-align: center;
  padding: 10px;
`;

const filterHolidaysForCurrentDate = (holidays, currentDate) => {
  return holidays.filter((holiday) => {
    const holidayDate = holiday.date.split("T")[0];
    return holidayDate === currentDate;
  });
};

const Home = () => {
  const {
    seconds,
    isActive,
    setShowStandupPopup,
    toggleTimer,
    startTime,
    stopTime,
    calculateProgress,
    showStandupPopup,
  } = useTimer();

  const [currentHoliday, setCurrentHoliday] = useState(null);
  const [holidayDay, setHolidayDay] = useState(null);

  const [upcomingHoliday, setUpcomingHoliday] = useState(null);
  const [upcomingHolidayDay, setUpcomingHolidayDay] = useState(null);

  const { employee } = useSelector((state) => state.employee);
  const token = employee?.token?.accessToken;
  let info = employee?.info;
  if (info && info.name) {
    info = {
      ...info,
      name: info.name.charAt(0).toUpperCase() + info.name.slice(1),
    };
  }

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

  const submitStandup = async (standupData) => {
    try {
      await addStandup(token, standupData);
      setShowStandupPopup(false);
    } catch (error) {
      console.error("Error submitting standup:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAllHolidays();
        const currentDate = getCurrentDate();

        handleCurrentHoliday(data, currentDate);
        handleUpcomingHoliday(data, currentDate);
      } catch (error) {
        console.error("Error fetching holidays:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <MainLayout>
      <Container>
        <LeftSection>
          <PunchInSection>
            <MainHeading>Attendance</MainHeading>
            <ProgressBarContainer progress={calculateProgress()}>
              <ProgressContainerHours>
                {calculateTime(seconds)}
              </ProgressContainerHours>
              <ProgressContainerText>Working hours</ProgressContainerText>
            </ProgressBarContainer>
            <TimerContainer>
              <TimerSection>
                Punch in <br />
                {startTime
                  ? new Date(startTime).toLocaleTimeString()
                  : "--:--:--"}
              </TimerSection>
              <Divider />
              <TimerSection>
                Punch out <br />
                {stopTime
                  ? new Date(stopTime).toLocaleTimeString()
                  : "--:--:--"}
              </TimerSection>
            </TimerContainer>
            <Button
              text={isActive ? "Punch Out" : "Punch In"}
              onClick={toggleTimer}
              backgroundcolor={theme.colors.accent}
              textcolor="white"
              padding="8px 64px"
              borderradius="10px"
            />
          </PunchInSection>
        </LeftSection>
        <RightSection>
          <GreetingSection>
            <GreetingText>
              <p>Hi, {info?.name}</p>
              <h1>Good Morning</h1>
              <p>Have a good day</p>
            </GreetingText>
            <GreetingImage src="/greeting.svg" alt="Image" />
          </GreetingSection>
          <BottomDivContainer>
            <BottomDiv>
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
            </BottomDiv>
            <BottomDiv>
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src="/arrow-up-right-circle.svg"
                  style={{ marginRight: "10px" }}
                />
                <p style={{ fontSize: "20px", fontWeight: "600" }}>Leave</p>
              </div>
              <p>Lorem ipsum dolor sit amet</p>
              <p>Denied</p>
            </BottomDiv>
          </BottomDivContainer>
        </RightSection>
      </Container>
      {showStandupPopup && (
        <StandupPopup
          onClose={() => setShowStandupPopup(false)}
          onSubmit={submitStandup}
        />
      )}
    </MainLayout>
  );
};

export default Home;
