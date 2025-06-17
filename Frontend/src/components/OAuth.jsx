// pages/OAuthCallback.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import authService from '../services/auth.services.js';
import { login as authLogin } from '../store/authslice.js';
import {Authloader} from './index.js'
const OAuthCallback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const userData = await authService.getOauthCurrentUser();
        if (userData) {
          dispatch(authLogin({ userData }));
          navigate('/rooms');
        } else {
          throw new Error('Authentication failed');
        }
      } catch (error) {
        console.error('OAuth error:', error);
        navigate('/users/login', { state: { error: 'Google login failed' } });
      }
    };

    handleOAuthCallback();
  }, [dispatch, navigate]);

  return (
    <Authloader message='connecting to Room Bazar...'/>
  );
};

export default OAuthCallback;