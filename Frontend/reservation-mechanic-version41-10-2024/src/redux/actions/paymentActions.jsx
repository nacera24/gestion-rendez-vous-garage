// Ajouter un paiement
export const addPayment = (paymentData) => {
  return (dispatch) => {
    dispatch({ type: 'ADD_PAYMENT_REQUEST' });

    try {
      const userId = localStorage.getItem('userId');
      paymentData.idClient = userId;

      // Ajouter l'ID du rendez-vous au paiement
      const rdvId = paymentData.rdvId || localStorage.getItem('rdvId');
      if (rdvId) {
        paymentData.rdvId = rdvId;
      }
       // Vérification du contenu de paymentData
       console.log('Détails du paiement avant l\'ajout :', paymentData);

      let payments = JSON.parse(localStorage.getItem('payments')) || [];

      // Générer un ID pour le nouveau paiement
      paymentData.id = payments.length > 0 ? payments[payments.length - 1].id + 1 : 1;

      payments.push(paymentData);
      localStorage.setItem('payments', JSON.stringify(payments));

      dispatch({ type: 'ADD_PAYMENT_SUCCESS', payload: paymentData });
    } catch (error) {
      dispatch({ type: 'ADD_PAYMENT_FAILURE', error: error.message });
    }
  };
};

// Modifier un paiement
export const modifyPayment = (paymentData) => {
  return (dispatch) => {
    dispatch({ type: 'MODIFY_PAYMENT_REQUEST' });

    try {
     
      const rdvId = paymentData.rdvId || localStorage.getItem('rdvId');
      if (rdvId) {
        paymentData.rdvId = rdvId;
      }

      // Mettre à jour le paiement dans le localStorage
      let payments = JSON.parse(localStorage.getItem('payments')) || [];
      payments = payments.map(payment =>
        payment.id === paymentData.id ? paymentData : payment
      );
      localStorage.setItem('payments', JSON.stringify(payments));

      dispatch({ type: 'MODIFY_PAYMENT_SUCCESS', payload: paymentData });
    } catch (error) {
      dispatch({ type: 'MODIFY_PAYMENT_FAILURE', error: error.message });
    }
  };
};

// Supprimer un paiement
export const deletePayment = (id) => {
  return (dispatch) => {
    dispatch({ type: 'DELETE_PAYMENT_REQUEST' });

    try {
      // Supprimer le paiement du localStorage
      let payments = JSON.parse(localStorage.getItem('payments')) || [];
      payments = payments.filter(payment => payment.id !== id);
      localStorage.setItem('payments', JSON.stringify(payments));

      dispatch({ type: 'DELETE_PAYMENT_SUCCESS', payload: id });
    } catch (error) {
      dispatch({ type: 'DELETE_PAYMENT_FAILURE', error: error.message });
    }
  };
};

// Charger les paiements spécifiques à l'utilisateur depuis le localStorage
export const loadPayments = () => {
  return (dispatch) => {
    try {
      const userId = localStorage.getItem('userId');
      const allPayments = JSON.parse(localStorage.getItem('payments')) || [];

      // Filtrer les paiements appartenant à l'utilisateur connecté
      const userPayments = allPayments.filter(payment => payment.idClient === userId);

      dispatch({ type: 'LOAD_PAYMENTS_SUCCESS', payload: userPayments });
    } catch (error) {
      dispatch({ type: 'LOAD_PAYMENTS_FAILURE', error: error.message });
    }
  };
};