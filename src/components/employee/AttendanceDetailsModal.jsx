import styled from "styled-components";
import theme from "../../themes/theme";
import PropTypes from "prop-types";
import DOMPurify from "dompurify";
import he from "he";

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  font-family: "Baloo Bhai 2";
  transition: opacity 0.3s;
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  pointer-events: ${(props) => (props.isOpen ? "auto" : "none")};
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
  text-align: center;
  width: 80%;
  max-width: 500px;
  transition: transform 0.3s, opacity 0.3s;
  transform: ${(props) => (props.isOpen ? "scale(1)" : "scale(0.9)")};
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  transform-origin: center;
  margin: 0px 18px;
`;

const AttendanceList = styled.ul`
  list-style: none;
  padding: 0;
  text-align: center;
`;

const AttendanceListItem = styled.li`
  margin: 10px 0;
  font-size: 16px;
`;

const HideButton = styled.button`
  background: none;
  color: ${theme.colors.accent};
  border: none;
  border: 2px solid ${theme.colors.accent};
  border-radius: 20px;
  cursor: pointer;
  padding: 10px 20px;
  font-size: 18px;
  margin-top: 7px;
`;

const StandupQuestions = styled.div`
  text-align: left;
  margin-top: 20px;
  text-align: center;
`;

const StandupQuestion = styled.div`
  margin: 10px 0;
`;

const StandupQuestionTitle = styled.h3`
  font-weight: bold;
  font-size: 16px;
`;

const StandupQuestionContent = styled.div`
  font-size: 14px;
`;

const NoStandupMessage = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-top: 20px;
`;

const StandupContent = ({ question, title }) => (
  <StandupQuestion>
    <StandupQuestionTitle>{title}</StandupQuestionTitle>
    <StandupQuestionContent
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(he.decode(question ?? ""), {
          ALLOWED_TAGS: [],
          ALLOWED_ATTR: [],
        }),
      }}
    />
  </StandupQuestion>
);

const AttendanceDetailsModal = ({
  isOpen,
  onClose,
  punchInTimes,
  punchOutTimes,
  standup,
  workingHours,
}) => {
  return (
    <ModalBackground isOpen={isOpen}>
      <ModalContent isOpen={isOpen}>
        <h2>Attendance Details</h2>
        <div style={{ maxHeight: "200px", overflowY: "auto" }}>
          <h3>
            <u>Attendance timings</u>
          </h3>
          <AttendanceList>
            {punchInTimes.map((punchInTime, index) => (
              <AttendanceListItem key={index}>
                Punch In: {punchInTime} - Punch Out: {punchOutTimes[index]}
              </AttendanceListItem>
            ))}
          </AttendanceList>
          {standup ? (
            <StandupQuestions>
              <h3>
                <u>Standup Questions</u>
              </h3>
              {standup && (
                <div>
                  <StandupContent
                    question={standup.question1}
                    title="Question 1"
                  />
                  <StandupContent
                    question={standup.question2}
                    title="Question 2"
                  />
                  <StandupContent
                    question={standup.question3}
                    title="Question 3"
                  />
                </div>
              )}
            </StandupQuestions>
          ) : (
            <>
              <h3>
                <u>Standup Questions</u>
              </h3>
              <NoStandupMessage>No standup available.</NoStandupMessage>
            </>
          )}
          <div>
            <h3>
              <u>Working Hours</u>
            </h3>
            <div>Total Working Hours - {workingHours?.workTimes?.totalWorkingHours ?? 'N/A'} hrs</div>
            <div>Overtime Hours - {workingHours?.workTimes?.overtimeHours ?? 'N/A'} hrs</div>
          </div>
        </div>
        <HideButton onClick={onClose}>Hide</HideButton>
      </ModalContent>
    </ModalBackground>
  );
};

AttendanceDetailsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  punchInTimes: PropTypes.arrayOf(PropTypes.string).isRequired,
  punchOutTimes: PropTypes.arrayOf(PropTypes.string).isRequired,
  standup: PropTypes.shape({
    question1: PropTypes.string,
    question2: PropTypes.string,
    question3: PropTypes.string,
  }),
  workingHours: PropTypes.shape({
    workTimes: PropTypes.shape({
      totalWorkingHours: PropTypes.string,
      overtimeHours: PropTypes.string,
    })
  }),
};

export default AttendanceDetailsModal;
