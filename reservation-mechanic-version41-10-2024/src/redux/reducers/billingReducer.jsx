const initialState = {
  loading: false,
  bills: [],
  error: null,
};

// Calculer les bénéfices pour une facture
const calculateProfit = (bill) => {
  const profit = parseFloat(bill.montant) * 0.15;
  return parseFloat(profit.toFixed(2)); // Arrondir à 2 décimales
};

const billingReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_BILL_REQUEST':
      return { ...state, loading: true, error: null };

    case 'ADD_BILL_SUCCESS':
      return {
        ...state,
        loading: false,
        bills: [...state.bills, action.payload], // Ajouter une facture à la liste
        error: null,
      };

    case 'ADD_BILL_FAILURE':
      return { ...state, loading: false, error: action.error };

    case 'FETCH_BILLS_REQUEST':
      return { ...state, loading: true };

    case 'FETCH_BILLS_SUCCESS':
      return { ...state, bills: action.payload, loading: false };

    case 'FETCH_MECHANIC_BILLS_SUCCESS': // Pour le mécanicien
      const updatedBills = action.payload.map((bill) => ({
        ...bill,
        profit: calculateProfit(bill),
      }));
      return {
        ...state,
        bills: updatedBills,
        loading: false,
      };

    case 'FETCH_BILLS_FAILURE':
      return { ...state, error: action.error, loading: false };

    default:
      return state;
  }
};

export default billingReducer;