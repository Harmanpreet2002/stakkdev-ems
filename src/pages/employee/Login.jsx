import MainLayout from "../../layouts/MainLayout";
import styled from "styled-components";
import theme from "../../themes/theme";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginEmployee } from "../../redux/reducers/employeeReducer";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { loginUser } from "../../services/apiService";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 185px);
  padding: 0px 25px;
`;

const FormContainer = styled(Form)`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: ${theme.colors.secondary};
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  font-family: "Baloo bhai 2";
`;

const FormHeading = styled.h1`
  text-align: center;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 3px;
  font-size: 16px;
  font-family: "Baloo bhai 2";
`;

const ErrorContainer = styled.div`
  min-height: 22px;
`;

const ErrorMessageText = styled.div`
  color: ${theme.colors.accent};
  font-size: 15px;
  font-weight: bold;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: ${theme.colors.accent};
  color: #fff;
  border: none;
  border-radius: 3px;
  font-size: 16px;
  cursor: pointer;
  font-family: "Poppins", sans-serif;
`;

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .test(
      "contains-letter-and-number",
      "Password must contain at least one letter and one number",
      (value) => {
        return /[a-zA-Z]/.test(value) && /\d/.test(value);
      }
    ),
});

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <MainLayout>
      <Container>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const data = await loginUser({
                email: values.email,
                password: values.password,
              });
              dispatch(loginEmployee(data));
              navigate("/employee/");
            } catch (error) {
              console.error("Error while login:", error);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <FormContainer>
            <FormHeading>Login</FormHeading>
            <Field
              type="email"
              name="email"
              placeholder="Email"
              as={FormInput}
            />
            <ErrorContainer>
              <ErrorMessage name="email" component={ErrorMessageText} />
            </ErrorContainer>
            <Field
              type="password"
              name="password"
              placeholder="Password"
              as={FormInput}
            />
            <ErrorContainer>
              <ErrorMessage name="password" component={ErrorMessageText} />
            </ErrorContainer>
            <Button type="submit">Login</Button>
          </FormContainer>
        </Formik>
      </Container>
    </MainLayout>
  );
};

export default Login;
