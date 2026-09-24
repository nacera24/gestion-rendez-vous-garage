import axios from 'axios';

// Action pour la connexion
export const loginUser = (username, password) => async (dispatch) => {
  dispatch({ type: 'LOGIN_REQUEST' }); // Déclenche l'état de chargement

  try {
    const response = await axios.post('https://dummyjson.com/auth/login', {
      username,
      password,
    });

    const token = response.data.token;
    const userId = response.data.id;
    const firstName = response.data.firstName;

    // Stocker le token et les informations utilisateur dans le localStorage
    localStorage.setItem('authToken', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('userName', firstName);

    // Déclencher le succès de la connexion avec l'utilisateur et le token
    dispatch({ type: 'LOGIN_SUCCESS', payload: { token, userId, firstName } });
  } catch (error) {
    // Gérer l'erreur en cas d'échec de connexion
    console.error('Erreur de connexion:', error);
    dispatch({ type: 'LOGIN_FAILURE', error: error.message });
  }
};

// Action pour l'inscription
export const registerUser = (userData) => (dispatch) => {
  dispatch({ type: 'REGISTER_REQUEST' });

  try {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.some(user => user.email === userData.email);

    if (userExists) {
      dispatch({ type: 'REGISTER_FAILURE', error: 'Cet utilisateur existe déjà.' });
      alert('Cet utilisateur existe déjà.');
      return;
    }

    // Ajouter le nouvel utilisateur
    users.push(userData);
    localStorage.setItem('users', JSON.stringify(users));

    dispatch({ type: 'REGISTER_SUCCESS', payload: userData });
    alert('Inscription réussie !');
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    dispatch({ type: 'REGISTER_FAILURE', error: error.message });
  }
};
// Action pour deconnexion
export const logoutUser = () => (dispatch) => {
  
  localStorage.removeItem('authToken');
  localStorage.removeItem('userId');
  localStorage.removeItem('userName');
  localStorage.removeItem('loggedInUser');

  // Dispatch la deconnexion
  dispatch({ type: 'LOGOUT' });
};