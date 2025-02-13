/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Alert, Button } from 'react-bootstrap';
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';
import process from 'process';
import api from 'services/axiosInstance';

const OTPRequest = () => {
  const apiURL = process.env.REACT_APP_API_URL;
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const sendOtp = (phone) => {
    api
      .post(`api/user/send-otp`, { mobile: phone.toString() })
      .then((response) => {
        console.log(response.data);
        setOtpSent(true);
        navigate('/verify-otp', { state: { mobile: phone } });
      })
      .catch((error) => {
        console.log(error);
        console.error('Error sending OTP:', error.response?.data || error.message);
      });
  };
  return (
    <Formik
      initialValues={{
        phone: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        phone: Yup.string()
          .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
          .required('Phone number is required')
      })}
      onSubmit={(values) => {
        sendOtp(values.phone);
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, touched, values, setFieldValue }) => (
        <form noValidate onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <input
              className="form-control"
              label="Phone Number"
              name="phone"
              onBlur={handleBlur}
              onChange={(e) => {
                const onlyNums = e.target.value.replace(/\D/g, '');
                setFieldValue('phone', onlyNums);
              }}
              type="text"
              maxLength="10"
              value={values.phone}
              placeholder="Enter Mobile No."
            />
            {touched.phone && errors.phone && <small className="text-danger form-text">{errors.phone}</small>}
          </div>

          <Row>
            <Col mt={2}>
              <Button className="btn-block mb-4" color="primary" size="large" type="submit" variant="primary">
                Request OTP
              </Button>
            </Col>
          </Row>
        </form>
      )}
    </Formik>
  );
};

export default OTPRequest;
