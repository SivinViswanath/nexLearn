'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks/useAuth';
import { setCredentials } from '@/store/slices/authSlice';
import {
  TextField,
  Button,
  Box,
  Typography,
  Avatar,
  IconButton,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import styles from './login.module.css';
import bgImage from '@/assets/images/bg_main.webp';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const [step, setStep] = useState('mobile'); // 'mobile', 'otp', 'profile'
  const [mobile, setMobile] = useState('');
  const [countryCode, setCountryCode] = useState('91');
  const [otp, setOtp] = useState('');
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    qualification: '',
    profile_image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/instructions');
    }
  }, [isAuthenticated, router]);

  const validateMobile = () => {
    if (!mobile) {
      setFormErrors({ mobile: 'Mobile number is required' });
      return false;
    }
    // Remove country code from validation
    const phoneNumber = mobile.replace(countryCode, '');
    if (phoneNumber.length < 10) {
      setFormErrors({ mobile: 'Please enter a valid mobile number' });
      return false;
    }
    setFormErrors({});
    return true;
  };

  const validateOTP = () => {
    if (!otp) {
      setFormErrors({ otp: 'OTP is required' });
      return false;
    }
    if (!/^[0-9]{4,6}$/.test(otp)) {
      setFormErrors({ otp: 'Please enter a valid OTP' });
      return false;
    }
    setFormErrors({});
    return true;
  };

  const validateProfile = () => {
    const errors = {};

    if (!profileData.name) errors.name = 'Name is required';
    if (!profileData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      errors.email = 'Email is invalid';
    }
    if (!profileData.qualification)
      errors.qualification = 'Qualification is required';
    if (!profileData.profile_image)
      errors.profile_image = 'Profile image is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();

    if (!validateMobile()) return;

    setLoading(true);
    setError('');

    try {
      const { authApi } = await import('@/lib/api/authApi');
      // Add + prefix if not present
      const formattedMobile = mobile.startsWith('+') ? mobile : `+${mobile}`;
      const response = await authApi.sendOTP(formattedMobile);

      if (response.success) {
        toast.success('OTP sent successfully!');
        setStep('otp');
      } else {
        const errorMsg = response.message || 'Failed to send OTP';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || 'Failed to send OTP. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!validateOTP()) return;

    setLoading(true);
    setError('');

    try {
      const { authApi } = await import('@/lib/api/authApi');

      // Add + prefix if not present
      const formattedMobile = mobile.startsWith('+') ? mobile : `+${mobile}`;
      const response = await authApi.verifyOTP(formattedMobile, otp);

      if (response.success) {
        if (response.login) {
          // User exists, store tokens and redirect
          Cookies.set('accessToken', response.access_token, { expires: 7 });
          if (response.refresh_token) {
            Cookies.set('refreshToken', response.refresh_token, {
              expires: 30,
            });
          }

          // Store in Redux
          dispatch(
            setCredentials({
              user: { mobile: formattedMobile },
              token: response.access_token,
              refreshToken: response.refresh_token,
            }),
          );

          toast.success('Login successful!');
          router.push('/instructions');
        } else {
          // New user, show profile form
          toast.info('Please complete your profile');
          setStep('profile');
        }
      } else {
        const errorMsg = response.message || 'Invalid OTP';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || 'Invalid OTP. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfile = async (e) => {
    e.preventDefault();

    if (!validateProfile()) return;

    setLoading(true);
    setError('');

    try {
      const { authApi } = await import('@/lib/api/authApi');

      // Add + prefix if not present
      const formattedMobile = mobile.startsWith('+') ? mobile : `+${mobile}`;
      const response = await authApi.createProfile({
        mobile: formattedMobile,
        ...profileData,
      });

      if (response.success) {
        // Store tokens
        Cookies.set('accessToken', response.access_token, { expires: 7 });
        if (response.refresh_token) {
          Cookies.set('refreshToken', response.refresh_token, { expires: 30 });
        }

        // Store in Redux
        dispatch(
          setCredentials({
            user: response.user,
            token: response.access_token,
            refreshToken: response.refresh_token,
          }),
        );

        toast.success('Profile created successfully!');
        router.push('/instructions');
      } else {
        const errorMsg = response.message || 'Failed to create profile';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        'Failed to create profile. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors({
          ...formErrors,
          profile_image: 'File size should be less than 5MB',
        });
        return;
      }
      setProfileData({ ...profileData, profile_image: file });
      setFormErrors({ ...formErrors, profile_image: '' });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
      >
        <Image
          src={bgImage}
          alt=""
          fill
          style={{
            objectFit: 'cover',
            zIndex: 0,
          }}
          priority
        />
      </div>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: '#00000099',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          maxWidth: '900px',
          width: '100%',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Left Side - Image and Logo */}
        <Box
          sx={{
            flex: 1,
            background:
              'linear-gradient(180deg, #1C3141 28.73%, #487EA7 233.43%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: { xs: 3, sm: 4, md: 5 },
            minHeight: { xs: '200px', md: '500px' },
          }}
        >
          <Box
            sx={{
              mb: 3,
              position: 'relative',
              width: '100%',
              maxWidth: '200px',
              height: '60px',
            }}
          >
            <Image
              src="/login_logo.svg"
              alt="NexLearn Logo"
              fill
              style={{ objectFit: 'contain' }}
              priority
              unoptimized
            />
          </Box>
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              maxWidth: '300px',
              height: '250px',
            }}
          >
            <Image
              src="/login_img.svg"
              alt="Login Illustration"
              fill
              style={{ objectFit: 'contain' }}
              unoptimized
            />
          </Box>
        </Box>

        {/* Right Side - Form */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: '#fff',
            padding: { xs: 3, sm: 4, md: 5 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: { xs: '400px', md: '500px' },
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mb: 1,
                color: '#1C3141',
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
              }}
            >
              {step === 'mobile' && 'Enter your phone number'}
              {step === 'otp' && 'Enter the code we texted you'}
              {step === 'profile' && 'Add Your Details'}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mb: 3,
                color: '#666',
                fontSize: { xs: '0.875rem', sm: '0.9375rem' },
              }}
            >
              {step === 'mobile' &&
                'We use your mobile number to identify your account'}
              {step === 'otp' && `We've sent an SMS to +91 ${mobile}`}
              {step === 'profile' && 'Please complete your profile to continue'}
            </Typography>

            {/* Mobile Number Step */}
            {step === 'mobile' && (
              <form
                onSubmit={handleSendOTP}
                style={{ display: 'flex', flexDirection: 'column', flex: 1 }}
              >
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ mb: 2 }}>
                    {mounted ? (
                      <PhoneInput
                        country={'in'}
                        value={mobile}
                        onChange={(phone, country) => {
                          setMobile(phone);
                          setCountryCode(country.dialCode);
                          setFormErrors({});
                        }}
                        inputStyle={{
                          width: '100%',
                          height: '56px',
                          fontSize: '16px',
                          borderColor: formErrors.mobile
                            ? '#d32f2f'
                            : 'rgba(0, 0, 0, 0.23)',
                        }}
                        containerStyle={{
                          width: '100%',
                        }}
                        buttonStyle={{
                          borderColor: formErrors.mobile
                            ? '#d32f2f'
                            : 'rgba(0, 0, 0, 0.23)',
                        }}
                        enableSearch
                        searchPlaceholder="Search country"
                      />
                    ) : (
                      <TextField
                        fullWidth
                        label="Phone Number"
                        variant="outlined"
                        disabled
                      />
                    )}
                    {formErrors.mobile && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ ml: 2, mt: 0.5, display: 'block' }}
                      >
                        {formErrors.mobile}
                      </Typography>
                    )}
                  </Box>

                  {error && (
                    <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                      {error}
                    </Typography>
                  )}

                  <Typography
                    variant="caption"
                    sx={{ display: 'block', color: '#666' }}
                  >
                    By tapping Get started, you agree to the Terms & Conditions
                  </Typography>
                </Box>

                <Box sx={{ mt: 'auto', pt: 2 }}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    sx={{
                      backgroundColor: '#1C3141',
                      color: '#fff',
                      padding: '12px',
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontWeight: 500,
                      '&:hover': {
                        backgroundColor: '#2a4a5e',
                      },
                    }}
                  >
                    {loading ? 'Sending...' : 'Get Started'}
                  </Button>
                </Box>
              </form>
            )}

            {/* OTP Verification Step */}
            {step === 'otp' && (
              <form
                onSubmit={handleVerifyOTP}
                style={{ display: 'flex', flexDirection: 'column', flex: 1 }}
              >
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    label="OTP Code"
                    variant="outlined"
                    type="text"
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value);
                      setFormErrors({});
                    }}
                    error={!!formErrors.otp}
                    helperText={formErrors.otp}
                    placeholder="123 456"
                    inputProps={{ maxLength: 6 }}
                    sx={{ mb: 2 }}
                  />

                  {error && (
                    <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                      {error}
                    </Typography>
                  )}

                  <Typography
                    variant="caption"
                    sx={{ display: 'block', color: '#666' }}
                  >
                    Your 6-digit code expires after 5 minutes. If the code
                    doesn&apos;t arrive, check your spam folder or{' '}
                    <Typography
                      component="span"
                      variant="caption"
                      sx={{
                        color: '#487EA7',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
                      onClick={!loading ? handleSendOTP : undefined}
                    >
                      Resend code
                    </Typography>
                  </Typography>
                </Box>

                <Box sx={{ mt: 'auto', pt: 2 }}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    sx={{
                      backgroundColor: '#1C3141',
                      color: '#fff',
                      padding: '12px',
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontWeight: 500,
                      '&:hover': {
                        backgroundColor: '#2a4a5e',
                      },
                    }}
                  >
                    {loading ? 'Verifying...' : 'Get Started'}
                  </Button>
                </Box>
              </form>
            )}

            {/* Profile Creation Step */}
            {step === 'profile' && (
              <form
                onSubmit={handleCreateProfile}
                style={{ display: 'flex', flexDirection: 'column', flex: 1 }}
              >
                <Box sx={{ flex: 1 }}>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}
                  >
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="profile-image-upload"
                      type="file"
                      onChange={handleFileChange}
                    />
                    <label
                      htmlFor="profile-image-upload"
                      style={{ cursor: 'pointer' }}
                    >
                      <Box
                        sx={{
                          width: '150px',
                          height: '150px',
                          border: '2px dashed #ccc',
                          borderRadius: '8px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: imagePreview
                            ? 'transparent'
                            : '#f9f9f9',
                          backgroundImage: imagePreview
                            ? `url(${imagePreview})`
                            : 'none',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            borderColor: '#1C3141',
                            backgroundColor: imagePreview
                              ? 'transparent'
                              : '#f0f0f0',
                          },
                        }}
                      >
                        {!imagePreview && (
                          <>
                            <PhotoCamera
                              sx={{ fontSize: 35, color: '#666', mb: 1 }}
                            />
                            <Typography
                              variant="body2"
                              color="#999"
                              sx={{
                                fontSize: '0.75rem',
                                textAlign: 'center',
                                px: 1,
                              }}
                            >
                              Add Your Profile picture
                            </Typography>
                          </>
                        )}
                      </Box>
                    </label>
                  </Box>
                  {formErrors.profile_image && (
                    <Typography
                      color="error"
                      variant="caption"
                      sx={{ display: 'block', textAlign: 'center', mb: 1 }}
                    >
                      {formErrors.profile_image}
                    </Typography>
                  )}

                  <TextField
                    fullWidth
                    label="Name*"
                    variant="outlined"
                    value={profileData.name}
                    onChange={(e) => {
                      setProfileData({ ...profileData, name: e.target.value });
                      setFormErrors({ ...formErrors, name: '' });
                    }}
                    error={!!formErrors.name}
                    helperText={formErrors.name}
                    placeholder="Enter your Full Name"
                    size="small"
                    sx={{ mb: 1.5 }}
                  />

                  <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => {
                      setProfileData({ ...profileData, email: e.target.value });
                      setFormErrors({ ...formErrors, email: '' });
                    }}
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                    placeholder="Enter your Email Address"
                    size="small"
                    sx={{ mb: 1.5 }}
                  />

                  <TextField
                    fullWidth
                    label="Your qualification*"
                    variant="outlined"
                    value={profileData.qualification}
                    onChange={(e) => {
                      setProfileData({
                        ...profileData,
                        qualification: e.target.value,
                      });
                      setFormErrors({ ...formErrors, qualification: '' });
                    }}
                    error={!!formErrors.qualification}
                    helperText={formErrors.qualification}
                    placeholder="Enter your qualification"
                    size="small"
                  />

                  {error && (
                    <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                      {error}
                    </Typography>
                  )}
                </Box>

                <Box sx={{ mt: 'auto', pt: 2 }}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    sx={{
                      backgroundColor: '#1C3141',
                      color: '#fff',
                      padding: '12px',
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontWeight: 500,
                      '&:hover': {
                        backgroundColor: '#2a4a5e',
                      },
                    }}
                  >
                    {loading ? 'Creating Profile...' : 'Get Started'}
                  </Button>
                </Box>
              </form>
            )}
          </Box>
        </Box>
      </Box>
    </div>
  );
}
