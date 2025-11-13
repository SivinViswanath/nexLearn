import axiosInstance from './axiosInstance';

export const authApi = {
  // Send OTP to mobile number
  sendOTP: async (mobile) => {
    const formData = new FormData();
    formData.append('mobile', mobile);

    const response = await axiosInstance.post('/auth/send-otp', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Verify OTP
  verifyOTP: async (mobile, otp) => {
    const formData = new FormData();
    formData.append('mobile', mobile);
    formData.append('otp', otp);

    const response = await axiosInstance.post('/auth/verify-otp', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Create user profile
  createProfile: async (profileData) => {
    const formData = new FormData();
    formData.append('mobile', profileData.mobile);
    formData.append('name', profileData.name);
    formData.append('email', profileData.email);
    formData.append('qualification', profileData.qualification);
    formData.append('profile_image', profileData.profile_image);

    const response = await axiosInstance.post(
      '/auth/create-profile',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
  },
};
