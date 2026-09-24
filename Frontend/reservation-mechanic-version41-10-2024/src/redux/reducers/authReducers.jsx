const initialState = {
  loading: false,
  isAuthenticated: false,
  user: null,
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
    case 'REGISTER_REQUEST':
      return { ...state, loading: true, error: null };

    case 'LOGIN_SUCCESS':
      return { ...state, loading: false, error: null, isAuthenticated: true, user: action.payload };

    case 'REGISTER_SUCCESS':
      return { ...state, loading: false, error: null, isAuthenticated: true, user: action.payload };

    case 'LOGIN_FAILURE':
      return { ...state, loading: false, error: action.error };
    case 'REGISTER_FAILURE':
      return { ...state, loading: false, error: action.error };

    case 'LOGOUT':
      return { ...state, isAuthenticated: false, user: null, error: null };

    default:
      return state;
  }
};

export default authReducer;