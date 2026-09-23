
const initialState = {
  loading: false,
  payments: [], 
  /* Exemple payment
  "id": 1,
  "idClient": 2,
  "cardType": "Debit",
  "cardNumber": "4111111111111111",
  "cardHolderName": "John Doe",
  "expirationDate": "12/25",
  "securityCode": "123"
  "RDVID:12345"
  */
  error: null,
};

// Définir le reducer pour gérer les actions de méthode de payment
const paymentReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_PAYMENT_REQUEST':
      return { ...state, loading: true, error: null };

    case 'ADD_PAYMENT_SUCCESS':
      return { 
        ...state, 
        loading: false, 
        payments: [...state.payments, action.payload], // Ajouter un payment à la liste
        error: null 
      };

    case 'ADD_PAYMENT_FAILURE':
      return { ...state, loading: false, error: action.error };

    case 'MODIFY_PAYMENT_REQUEST':
      return { ...state, loading: true, error: null };

    case 'MODIFY_PAYMENT_SUCCESS':
      return {
        ...state,
        loading: false,
        payments: state.payments.map((payment) =>
          payment.id === action.payload.id ? action.payload : payment
        ), // Mettre à jour le payment modifié
        error: null
      };

    case 'MODIFY_PAYMENT_FAILURE':
      return { ...state, loading: false, error: action.error };

    case 'DELETE_PAYMENT_REQUEST':
      return { ...state, loading: true, error: null };

    case 'DELETE_PAYMENT_SUCCESS':
      return {
        ...state,
        loading: false,
        payments: state.payments.filter((payment) => payment.id !== action.payload), // Retirer le payment
        error: null
      };

    case 'DELETE_PAYMENT_FAILURE':
      return { ...state, loading: false, error: action.error };

    default:
      return state;
  }
};

export default paymentReducer;
