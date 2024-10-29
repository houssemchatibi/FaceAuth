import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'


// First, create the thunk
export const fetchUserConnect= createAsyncThunk(
  'users/login user',
  async (updatedInputs,{ rejectWithValue }) => {
   try
   { 
    const res = await fetch("http://127.0.0.1:5000/api/login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedInputs),
    });

    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.error);
    }

    return data  

    }catch (error) {
      return rejectWithValue(error.message); 
    }
  },
)

const initialState = {
  User: JSON.parse(localStorage.getItem("user")) || [],
  loading: 'idle',
  error: null,
} 

// Then, handle actions in your reducers:
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.User = []
      localStorage.clear()
    }
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchUserConnect.fulfilled, (state, action) => {
      // Add user to the state array
      state.User.push(action.payload)
      state.error = null;
      localStorage.setItem('user', JSON.stringify(state.User));
    })
    .addCase(fetchUserConnect.rejected, (state, action) => {
      state.error = action.payload; // Store the error message from the backend
    });
  },
})

export const { logout } = userSlice.actions
export default userSlice.reducer;
