/* eslint-disable no-unused-vars */
// src/OTPRequest.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Button } from 'react-bootstrap';
import * as Yup from 'yup';
import { Formik } from 'formik';
import api from 'services/axiosInstance';

const OTPRequest = () => {
  const [isTokenValid, setIsTokenValid] = useState(false);
  const navigate = useNavigate();

  // Check if accessToken and refreshToken are valid or can be refreshed
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (accessToken) {
      // Validate the accessToken
      api
        .get('/auth/validate-token')
        .then((response) => {
          // If token is valid, redirect to homepage
          navigate('/');
        })
        .catch(() => {
          // If token validation fails, try using the refresh token
          if (refreshToken) {
            api
              .post('/auth/refresh-token', { refreshToken })
              .then((response) => {
                const { accessToken, refreshToken: newRefreshToken } = response.data;
                // Store new tokens
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', newRefreshToken);

                // Now validate the new accessToken and redirect if valid
                api
                  .get('/auth/validate-token')
                  .then(() => {
                    navigate('/');
                  })
                  .catch(() => {
                    // If both tokens fail, load OTP request page
                    setIsTokenValid(false);
                  });
              })
              .catch(() => {
                // If refresh fails, load OTP request page
                setIsTokenValid(false);
              });
          } else {
            // If no refresh token, load OTP request page
            setIsTokenValid(false);
          }
        });
    } else if (refreshToken) {
      // If accessToken doesn't exist, but refreshToken does, try to refresh the accessToken
      api
        .post('/auth/refresh-token', { refreshToken })
        .then((response) => {
          const { accessToken, refreshToken: newRefreshToken } = response.data;
          // Store new tokens
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          // Validate the new accessToken and redirect if valid
          api
            .get('/auth/validate-token')
            .then(() => {
              navigate('/');
            })
            .catch(() => {
              setIsTokenValid(false);
            });
        })
        .catch(() => {
          setIsTokenValid(false);
        });
    } else {
      // If no valid tokens, show OTP request form
      setIsTokenValid(false);
    }
  }, [navigate]);

  // If tokens are valid or refreshed, we don't show the OTP request form
  if (isTokenValid) {
    return null;
  }

  const sendOtp = (phone) => {
    api
      .post('admin/send-otp', { mobile: phone.toString() })
      .then((response) => {
        navigate('/verify-otp', { state: { mobile: phone } }); // Proceed to OTP verification
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
