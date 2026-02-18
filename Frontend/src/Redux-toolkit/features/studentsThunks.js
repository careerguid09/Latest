import { createAsyncThunk } from '@reduxjs/toolkit';
import authFetch from '../../utils/authFetch.js';
import { toast } from 'react-toastify';

// GET ALL STUDENTS - FIXED
export const getAllStudents = createAsyncThunk(
  'students/getAllStudents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authFetch.get('/clients');
      console.log('📥 API Response:', response.data);
      return response.data; // Return full response, slice will handle structure
    } catch (error) {
      console.error('❌ API Error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch students');
    }
  }
);

// GET DOMAIN STATS
export const getDomainStats = createAsyncThunk(
  'students/getDomainStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authFetch.get('/clients/stats');
      return response.data;
    } catch (error) {
      console.error('Stats error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
    }
  }
);

// DELETE STUDENT
export const deleteStudent = createAsyncThunk(
  'students/deleteStudent',
  async (id, { rejectWithValue }) => {
    try {
      const response = await authFetch.delete(`/clients/${id}`);
      
      if (response.data.success) {
  
        return { success: true, id };
      }
      return rejectWithValue('Delete failed');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
      return rejectWithValue(error.response?.data?.message || 'Delete failed');
    }
  }
);

// GET STUDENTS BY COURSE
export const getStudentsByCourse = createAsyncThunk(
  'students/getStudentsByCourse',
  async (course, { rejectWithValue }) => {
    try {
      const response = await authFetch.get(`/clients/course/${course}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch students');
    }
  }
);

// MARK STUDENT VIEWED
// MARK STUDENT VIEWED - FIXED VERSION
export const markStudentViewed = createAsyncThunk(
  'students/markStudentViewed',
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await authFetch.patch(`/clients/student/viewed/${id}`);
      
      if (response.data.success) {
        // ✅ IMPORTANT: Refresh stats and students after marking viewed
        await dispatch(getDomainStats());
        await dispatch(getAllStudents());
        toast.success('Student marked as viewed');
        return { success: true, id };
      }
      return rejectWithValue('Failed to mark viewed');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark viewed');
      return rejectWithValue(error.response?.data?.message || 'Failed to mark viewed');
    }
  }
);
// MARK COURSE VIEWED
export const markCourseViewed = createAsyncThunk(
  'students/markCourseViewed',
  async (course, { rejectWithValue }) => {
    try {
      const response = await authFetch.patch(`/clients/course/viewed/${course}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark course viewed');
    }
  }
);

// UPDATE STUDENT STATUS
export const updateStudentStatus = createAsyncThunk(
  'students/updateStudentStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await authFetch.patch(`/clients/${id}/status`, { status });
      
      if (response.data.success) {
        toast.success('Status updated successfully');
        return response.data;
      }
      return rejectWithValue('Update failed');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
      return rejectWithValue(error.response?.data?.message || 'Update failed');
    }
  }
);


export const createStudent = createAsyncThunk(
  'students/createStudent',
  async (studentData, { rejectWithValue }) => {
    try {
      const response = await authFetch.post('/clients', studentData);
      toast.success('Form submited successfully');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create student');
      return rejectWithValue(error.response?.data?.message || 'Failed to create student');
    }
  }
);