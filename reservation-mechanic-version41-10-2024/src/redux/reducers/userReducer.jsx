const initialState = {
  userProfile: null,
  loading: false,
  error: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_USER_REQUEST':
      return { ...state, loading: true };

    case 'FETCH_USER_SUCCESS':
      return { ...state, userProfile: action.payload, loading: false };

    case 'FETCH_USER_FAILURE':
      return { ...state, error: action.error, loading: false };

    case 'UPDATE_USER_SUCCESS':
      return { ...state, userProfile: action.payload };

    case 'UPDATE_USER_FAILURE':
      return { ...state, error: action.error };

    default:
      return state;
  }
};

export default userReducer;