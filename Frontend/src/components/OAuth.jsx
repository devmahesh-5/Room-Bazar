// pages/OAuthCallback.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import authService from '../services/auth.services.js';
import { login as authLogin } from '../store/authslice.js'
import { Authloader } from './index.js'
import { useParams } from 'react-router-dom';
const OAuthCallback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const { userId, googleId } = useParams();
  useEffect(() => {
    ;
    (async () => {
      setError(null);
      try {
        const response = await authService.afterGoogleLogin(userId, googleId);
        if (response) {
          const userData = await authService.getCurrentUser();

          if (userData) {
            dispatch(authLogin({ userData }))
          }
          navigate('/rooms');
        }
      } catch (error) {
        setError(error);
      }

    })();
  }, []);

  return !error ? (
    <>
      <Authloader message='connecting to Room Bazar...' />
    </>
  ) : (
    <p className='text-red-500'>{error}</p>
  );
};

export default OAuthCallback;