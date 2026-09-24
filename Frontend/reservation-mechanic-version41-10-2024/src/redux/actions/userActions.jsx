import axios from 'axios';

export const fetchUserProfile = (userId) => {
  return async (dispatch) => {
    dispatch({ type: 'FETCH_USER_REQUEST' });

    try {
      //eslint-disable-next-line
      let _ = await axios.get(`https://dummyjson.com/users/${userId}`);//Juste pour éviter l'erreur de variable inutilisée, la requête axios est simplement pour montrer le comportement normal
      let users = JSON.parse(localStorage.getItem('users')) || {};
      let userProfile = users.find((user) => parseInt(user.id) === parseInt(userId));
      dispatch({ type: 'FETCH_USER_SUCCESS', payload: userProfile });
    } catch (error) {
      dispatch({ type: 'FETCH_USER_FAILURE', error: error.message });
    }
  };
};

export const updateUserProfile = (updatedData, userId) => {
  return (dispatch) => {
    try {
      console.log('Données de mise à jour:', updatedData);
      // Mettre à jour les données dans le localStorage
      let users = JSON.parse(localStorage.getItem('users')) || {};
      let updatedProfile;
      // Fusionner les données existantes avec les nouvelles
      users = users.map((user) => {
        if (parseInt(user.id) === parseInt(userId)) {
          console.log('Profil trouvé:', user);
          let mdp = user.password || '';
          updatedProfile = {
            ...user,
            ...updatedData,
          };
          if (updatedData.password === '') {
            updatedProfile.password = mdp;
          }
          return updatedProfile;
        }
        return user;
      });

      // Enregistrer le profil mis à jour dans le localStorage
      localStorage.setItem('users', JSON.stringify(users));

      // Dispatcher l'action de succès
      dispatch({ type: 'UPDATE_USER_SUCCESS', payload: updatedProfile });
    } catch (error) {
      dispatch({ type: 'UPDATE_USER_FAILURE', error: error.message });
    }
  };
};