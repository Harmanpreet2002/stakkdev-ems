import { useState } from "react";
import styled from "styled-components";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Button from "./Button";
import theme from "../../themes/theme";

const PopupContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
  font-family: "Poppins", sans-serif;
  font-size: 10px;
  border-radius: 5px;
  z-index: 999;
`;

const StandupPopup = ({ onClose, onSubmit }) => {
  const [standupStatus1, setStandupStatus1] = useState("");
  const [standupStatus2, setStandupStatus2] = useState("");
  const [standupStatus3, setStandupStatus3] = useState("");

  const handleSubmit = () => {
    const standupData = {
      employee: "Harman", 
      question1: standupStatus1,
      question2: standupStatus2,
      question3: standupStatus3,
    };

    onSubmit(standupData);
  };

  return (
    <PopupContainer>
      <div>
        <h2>What did you focus on today?</h2>
        <ReactQuill
          value={standupStatus1}
          onChange={(value) => setStandupStatus1(value)}
          modules={modules}
          formats={formats}
          placeholder="Write answer..."
          style={{ maxWidth: "450px", overflow: "auto" }}
        />
      </div>

      <div>
        <h2>What are your plans and priorities for tommorow?</h2>
        <ReactQuill
          value={standupStatus2}
          onChange={(value) => setStandupStatus2(value)}
          modules={modules}
          formats={formats}
          placeholder="Write answer..."
          style={{ maxWidth: "450px", overflow: "auto" }}
        />
      </div>

      <div>
        <h2>What challanges or roadblocks do you need help with?</h2>
        <ReactQuill
          value={standupStatus3}
          onChange={(value) => setStandupStatus3(value)}
          modules={modules}
          formats={formats}
          placeholder="Write answer..."
          style={{ maxWidth: "450px", overflow: "auto" }}
        />
      </div>

      <Button
        text="Submit"
        onClick={handleSubmit}
        backgroundcolor={theme.colors.accent}
        textcolor="white"
        padding="8px 20px"
        borderradius="10px"
      />
      <Button
        text="Cancel"
        onClick={onClose}
        backgroundcolor={theme.colors.accent}
        textcolor="white"
        padding="8px 20px"
        borderradius="10px"
      />
    </PopupContainer>
  );
};

const modules = {
  toolbar: [
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "link"],
  ],
};

const formats = ["bold", "italic", "list", "link"];

export default StandupPopup;
