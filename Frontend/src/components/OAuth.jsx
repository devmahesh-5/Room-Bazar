// pages/OAuthCallback.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import authService from '../services/auth.services.js';
import { login as authLogin } from '../store/authslice.js';
import { Authloader } from './index.js'
import axios from 'axios';
const OAuthCallback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const token = new URLSearchParams(window.location.search).get('token');
        if (token) {
          localStorage.setItem('token', token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        const userData = await authService.getOauthCurrentUser();
        if (userData) {
          dispatch(authLogin({ userData }));
          navigate('/rooms');
        } else {
          throw new Error('Authentication failed');
        }
      } catch (error) {
        console.error('OAuth error:', error);
        navigate('/users/login',);
      }
    };

    handleOAuthCallback();
  }, []);

  return (
    <>
      <Authloader message='connecting to Room Bazar...' />
    </>
  );
};

export default OAuthCallback;