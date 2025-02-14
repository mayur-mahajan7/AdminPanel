/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Row, Col, Alert, Button } from 'react-bootstrap';
import * as Yup from 'yup';
import { Formik } from 'formik';
import api from 'services/axiosInstance';
import { useAuth } from 'components/AuthContext';

const OTPVerification = () => {
  const [otpVerified, setOtpVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const mobileNumber = location.state?.mobile || '';
  const { setIsAuthenticated } = useAuth();

  const verifyOtp = (otp) => {
    api
      .post(
        'admin/verify-otp',
        {
          mobile: mobileNumber.toString(), // Pass the mobile number dynamically
          otp: otp.toString()
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      )
      .then((response) => {
        console.log(response.data.result);
        setOtpVerified(true);
        localStorage.setItem('accessToken', response?.data.data.accessToken);
        localStorage.setItem('refreshToken', response?.data.data.refreshToken);
        setIsAuthenticated(true); // Update auth state

        navigate('*'); // Redirect to the desired page after successful verification
      })
      .catch((error) => {
        console.error('Error verifying OTP:', error.response?.data || error.message);
        setErrorMessage('Invalid OTP. Please try again.');
      });
  };

  return (
    <Formik
      initialValues={{
        otp: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        otp: Yup.string()
          .matches(/^\d{4}$/, 'OTP must be exactly 4 digits')
          .required('OTP is required')
      })}
      onSubmit={(values) => {
        verifyOtp(values.otp);
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, touched, values, setFieldValue }) => (
        <form noValidate onSubmit={handleSubmit} className="d-flex flex-column align-items-center justify-content-center vh-100">
          <h3 className="mb-3">Enter OTP</h3>
          <p className="text-muted">We sent a 4-digit OTP to {mobileNumber}</p>

          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

          <div className="form-group mb-3" style={{ width: '250px' }}>
            <input
              className="form-control text-center"
              label="Enter OTP"
              name="otp"
              onBlur={handleBlur}
              onChange={(e) => {
                const onlyNums = e.target.value.replace(/\D/g, '').slice(0, 4);
                setFieldValue('otp', onlyNums);
              }}
              type="text"
              maxLength="4"
              value={values.otp}
            />
            {touched.otp && errors.otp && <small className="text-danger form-text text-center">{errors.otp}</small>}
          </div>

          <Row>
            <Col className="text-center">
              <Button className="btn-block mb-4" color="primary" size="large" type="submit" variant="primary">
                Verify OTP
              </Button>
            </Col>
          </Row>
        </form>
      )}
    </Formik>
  );
};

export default OTPVerification;
