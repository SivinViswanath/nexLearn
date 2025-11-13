import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  questions: [],
  currentQuestionIndex: 0,
  answers: {},
  markedForReview: {},
  timeRemaining: null,
  testStartTime: null,
  testDuration: null,
  isSubmitted: false,
  result: null,
  loading: false,
  error: null,
};

const mcqSlice = createSlice({
  name: 'mcq',
  initialState,
  reducers: {
    setQuestions: (state, action) => {
      state.questions = action.payload;
      state.answers = {};
      state.currentQuestionIndex = 0;
      state.isSubmitted = false;
    },
    setCurrentQuestion: (state, action) => {
      state.currentQuestionIndex = action.payload;
    },
    setAnswer: (state, action) => {
      const { questionId, answer, optionId } = action.payload;
      state.answers[questionId] = { answer, optionId };
    },
    markForReview: (state, action) => {
      const questionId = action.payload;
      state.markedForReview[questionId] = !state.markedForReview[questionId];
    },
    setTimeRemaining: (state, action) => {
      state.timeRemaining = action.payload;
    },
    startTest: (state, action) => {
      state.testStartTime = Date.now();
      state.testDuration = action.payload;
      state.timeRemaining = action.payload;
    },
    submitTest: (state) => {
      state.isSubmitted = true;
    },
    setResult: (state, action) => {
      state.result = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    resetTest: (state) => {
      return initialState;
    },
  },
});

export const {
  setQuestions,
  setCurrentQuestion,
  setAnswer,
  markForReview,
  setTimeRemaining,
  startTest,
  submitTest,
  setResult,
  setLoading,
  setError,
  resetTest,
} = mcqSlice.actions;

export default mcqSlice.reducer;
