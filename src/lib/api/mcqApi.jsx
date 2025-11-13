import axiosInstance from './axiosInstance';

export const mcqApi = {
  // Get all questions with instructions
  getQuestions: async () => {
    const response = await axiosInstance.get('/question/list');
    return response.data;
  },

  // Submit answers
  submitAnswers: async (answers) => {
    const formData = new FormData();
    formData.append('answers', JSON.stringify(answers));

    const response = await axiosInstance.post('/answers/submit', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
