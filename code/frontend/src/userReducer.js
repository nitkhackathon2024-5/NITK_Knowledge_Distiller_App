// userReducer.js

const initialState = null; // Initial state for the user

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USER":
      return action.payload; // Set the user data in the state
    case "CLEAR_USER":
      return null; // Clear the user data from the state
    default:
      return state;
  }
};

export default userReducer;
