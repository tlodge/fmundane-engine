import { configureStore } from '@reduxjs/toolkit';
import experienceReducer from '../features/experience/experienceSlice';

export default configureStore({
  reducer: {
    experience: experienceReducer,
  },
});
