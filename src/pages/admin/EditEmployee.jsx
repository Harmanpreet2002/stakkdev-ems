import styled from "styled-components";
import theme from "../../themes/theme";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import Modal from "../../components/common/Modal";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import { useSelector } from "react-redux";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 30px;
  margin: 0px 90px;
  @media (max-width: 992px) {
    padding: 20px 10px;
    margin: 0 20px;
  }
`;

const FormContainer = styled(Form)`
  display: flex;
  padding: 20px 30px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: ${theme.colors.secondary};
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  font-family: "Baloo bhai 2";
  @media (max-width: 768px) {
    flex-direction: column;
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

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
`;

const Input = styled(Field)`
  width: 80%;
  padding: 4px;
  margin-bottom: 8px;
`;

const ErrorMessageText = styled(ErrorMessage)`
  color: red;
`;

const Button = styled.button`
  width: 100px;
  padding: 10px;
  background-color: ${theme.colors.accent};
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  font-family: "Poppins", sans-serif;
`;

const PostalCodeAndPhoneNumberContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 80%;
  // & div {
  //   display: flex;
  //   flex-direction: column;
  //   width: 100%;
  // }
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;

const PostalCodeInput = styled(Field)`
  width: 48%;
  padding: 4px;
  margin-bottom: 8px;
`;

const SelectPhoneContainer = styled.div`
  display: flex;
  flex-direction: row;
  select {
    width: 48%;
    padding: 4px;
    margin-bottom: 8px;
    margin-right: 2px;
  }
`;

const PhoneNumberInput = styled(Field)`
  width: 48%;
  padding: 4px;
  margin-bottom: 8px;
`;

const DesignationSelect = styled(Field)`
  width: 80%;
  padding: 4px;
  margin-bottom: 8px;
`;

const validationSchema = Yup.object().shape({
  generalInfo: Yup.object().shape({
    firstname: Yup.string().required("First Name is required"),
    lastname: Yup.string().required("Lastname is required"),
    dob: Yup.date().required("Date of Birth is required"),
    salary: Yup.number()
      .typeError("Salary must be a number")
      .required("Salary is required"),
  }),
  contactDetails: Yup.object().shape({
    address1: Yup.string().required("Address 1 is required"),
    address2: Yup.string().optional(),
    postalCode: Yup.string().required("Postal is required"),
    phoneNumber: Yup.string().required("Phone number is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  }),
});

const countryCodes = [
  { code: "+1", name: "United States" },
  { code: "+91", name: "India" },
  { code: "+52", name: "Canada" },
  { code: "+61", name: "Australia" },
  { code: "+33", name: "United Kingdom" },
];

const EditEmployee = () => {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [registrationError, setRegistrationError] = useState(null);
  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [employeeData, setEmployeeData] = useState(null);
  const { employeeId } = useParams();
  const token = useSelector((state) => state.admin.admin.accessToken);
  const [selectedDesignation, setSelectedDesignation] = useState("");

  const designationOptions = [
    "Frontend Developer",
    "Backend Developer",
    "MERN Stack Developer",
    "SEO",
    "HR",
    "PHP Developer",
    "React Developer",
    "Others",
  ];

  useEffect(() => {
    if (employeeId) {
      fetch(`http://localhost:3000/v1/admin-emp/get_employee/${employeeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Failed to fetch employee data");
          }
        })
        .then((data) => {
          const { designation, phoneNumber, dob } = data;
          const isoDate = new Date(dob);
          const formattedDate = isoDate.toISOString().substring(0, 10);
          let modifiedPhoneNumber = phoneNumber.substring(3);
          const modifiedData = {
            ...data,
            phoneNumber: modifiedPhoneNumber,
            dob: formattedDate,
          };
          setSelectedDesignation(designation);
          setEmployeeData(modifiedData);
          const plusIndex = phoneNumber.indexOf("+");
          if (plusIndex !== -1) {
            const countryCodeWithPlus = phoneNumber.substring(0, plusIndex + 3);
            setSelectedCountryCode(countryCodeWithPlus);
          }
        })
        .catch((error) => {
          console.error("Error fetching employee data:", error);
          setRegistrationError(error.message);
        });
    }
  }, [employeeId]);

  const handleUpdationSuccess = () => {
    setIsSuccessModalOpen(true);
  };

  const handleUpdationError = (error) => {
    setRegistrationError(error);
  };

  return (
    <AdminLayout>
      <Container>
        {employeeData ? (
          <Formik
            initialValues={{
              generalInfo: {
                firstname: employeeData.firstname,
                lastname: employeeData.lastname,
                dob: employeeData.dob,
                designation: selectedDesignation,
                salary: employeeData.salary,
              },
              contactDetails: {
                address1: employeeData.address1,
                address2: employeeData.address2,
                postalCode: employeeData.postalCode,
                phoneNumber: employeeData.phoneNumber,
                email: employeeData.email,
                password: "",
              },
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              const { generalInfo, contactDetails } = values;
              const { phoneNumber } = contactDetails;
              const fullPhoneNumber = `${selectedCountryCode}${phoneNumber}`;
              const updatedEmployee = {
                ...generalInfo,
                designation: selectedDesignation,
                ...contactDetails,
                phoneNumber: fullPhoneNumber,
              };
              fetch(
                `http://localhost:3000/v1/admin-emp/update_employee/${employeeId}`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify(updatedEmployee),
                }
              )
                .then((response) => {
                  if (response.ok) {
                    return response.json();
                  } else {
                    throw new Error("Failed to update employee data");
                  }
                })
                .then((data) => {
                  handleUpdationSuccess();
                })
                .catch((error) => {
                  console.error("Error updating employee data:", error);
                  handleUpdationError(error.message);
                })
                .finally(() => {
                  setSubmitting(false);
                });
            }}
          >
            <FormContainer>
              <LeftSection>
                <h2>General Information</h2>
                <Label>First Name</Label>
                <Input type="text" name="generalInfo.firstname" />
                <ErrorMessageText
                  name="generalInfo.firstname"
                  component="div"
                />
                <Label>Last Name</Label>
                <Input type="text" name="generalInfo.lastname" />
                <ErrorMessageText name="generalInfo.lastname" component="div" />
                <Label>Date of Birth</Label>
                <Input type="date" name="generalInfo.dob" />
                <ErrorMessageText name="generalInfo.dob" component="div" />
                <Label>Designation</Label>
                <DesignationSelect
                  as="select"
                  onChange={(e) => setSelectedDesignation(e.target.value)}
                  value={selectedDesignation}
                >
                  {designationOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </DesignationSelect>
                <Label>Salary</Label>
                <Input type="number" name="generalInfo.salary" />
                <ErrorMessageText name="generalInfo.salary" component="div" />
              </LeftSection>
              <RightSection>
                <h2>Contact Details</h2>
                <Label>Address 1</Label>
                <Input type="text" name="contactDetails.address1" />
                <ErrorMessageText
                  name="contactDetails.address1"
                  component="div"
                />
                <Label>Address 2 (optional)</Label>
                <Input type="text" name="contactDetails.address2" />
                <ErrorMessageText
                  name="contactDetails.address2"
                  component="div"
                />
                <PostalCodeAndPhoneNumberContainer>
                  <div>
                    <Label>Postal Code</Label>
                    <PostalCodeInput
                      type="text"
                      name="contactDetails.postalCode"
                    />
                    <ErrorMessageText
                      name="contactDetails.postalCode"
                      component="div"
                    />
                  </div>
                  <div>
                    <Label>Phone Number</Label>
                    <SelectPhoneContainer>
                      <select
                        onChange={(e) => setSelectedCountryCode(e.target.value)}
                        value={selectedCountryCode}
                      >
                        {countryCodes.map((codeData) => (
                          <option key={codeData.code} value={codeData.code}>
                            ({codeData.code}) {codeData.name}
                          </option>
                        ))}
                      </select>
                      <PhoneNumberInput
                        type="tel"
                        name="contactDetails.phoneNumber"
                      />
                    </SelectPhoneContainer>
                    <ErrorMessageText
                      name="contactDetails.phoneNumber"
                      component="div"
                    />
                  </div>
                </PostalCodeAndPhoneNumberContainer>
                <Label>Email</Label>
                <Input type="email" name="contactDetails.email" />
                <ErrorMessageText name="contactDetails.email" component="div" />
                <Label>Password</Label>
                <Input type="password" name="contactDetails.password" />
                <ErrorMessageText
                  name="contactDetails.password"
                  component="div"
                />

                <Button type="submit">Submit</Button>
              </RightSection>
            </FormContainer>
          </Formik>
        ) : (
          <p>Loading employee data...</p>
        )}

        {isSuccessModalOpen && (
          <Modal
            isOpen={isSuccessModalOpen}
            onClose={() => setIsSuccessModalOpen(false)}
            message="Updated successfully"
          ></Modal>
        )}
        {registrationError && (
          <Modal
            isOpen={registrationError !== null}
            onClose={() => setRegistrationError(null)}
            message={`Updation Failed: ${registrationError}`}
          ></Modal>
        )}
      </Container>
    </AdminLayout>
  );
};

export default EditEmployee;
