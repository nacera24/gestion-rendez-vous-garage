import {
  ADD_APPOINTMENT_REQUEST,
  ADD_APPOINTMENT_SUCCESS,
  ADD_APPOINTMENT_FAILURE,
  LOAD_APPOINTMENTS,
  LOAD_RDVS_SUCCESS,
  LOAD_RDVS_FAILURE,
  DELETE_RDV_REQUEST,
  DELETE_RDV_SUCCESS,
  DELETE_RDV_FAILURE,
  MODIFY_RDV_REQUEST,
  MODIFY_RDV_SUCCESS,
  MODIFY_RDV_FAILURE,
  UPDATE_RDV_SUCCESS,
  UPDATE_RDV_FAILURE,
  APPROVE_MODIFICATION_REQUEST,
  APPROVE_MODIFICATION_SUCCESS,
  APPROVE_MODIFICATION_FAILURE,
  REJECT_MODIFICATION_REQUEST,
  REJECT_MODIFICATION_SUCCESS,
  REJECT_MODIFICATION_FAILURE,
  ADD_PAYMENT_TO_RDV_REQUEST,
  ADD_PAYMENT_TO_RDV_SUCCESS,
  ADD_PAYMENT_TO_RDV_FAILURE,
} from '../actions/appointmentActions';

// État initial
const initialState = {
  appointments: [],
  userRdvs: [],
  loading: false,
  error: null,
};

// Reducer
const appointmentReducer = (state = initialState, action) => {
  switch (action.type) {
    // Gestion des requêtes
    case ADD_APPOINTMENT_REQUEST:
    case DELETE_RDV_REQUEST:
    case MODIFY_RDV_REQUEST:
    case APPROVE_MODIFICATION_REQUEST:
    case REJECT_MODIFICATION_REQUEST:
    case ADD_PAYMENT_TO_RDV_REQUEST:
      return { ...state, loading: true, error: null };

    // Gestion des succès
    case ADD_APPOINTMENT_SUCCESS: {
      const updatedAppointments = [...state.appointments, action.payload];
      localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
      return { ...state, loading: false, appointments: updatedAppointments, error: null };
    }

    case DELETE_RDV_SUCCESS: {
      const updatedAppointments = state.appointments.filter((rdv) => rdv.id !== action.payload);
      const updatedUserRdvs = state.userRdvs.filter((rdv) => rdv.id !== action.payload);
      localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
      return { ...state, loading: false, appointments: updatedAppointments, userRdvs: updatedUserRdvs, error: null };
    }

    case MODIFY_RDV_SUCCESS:
    case APPROVE_MODIFICATION_SUCCESS:
    case REJECT_MODIFICATION_SUCCESS:
    case ADD_PAYMENT_TO_RDV_SUCCESS: {
      const updatedAppointments = state.appointments.map((rdv) =>
        rdv.id === action.payload.id ? action.payload : rdv
      );
      const updatedUserRdvs = state.userRdvs.map((rdv) =>
        rdv.id === action.payload.id ? action.payload : rdv
      );
      localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
      return { ...state, loading: false, appointments: updatedAppointments, userRdvs: updatedUserRdvs, error: null };
    }

    // Gestion des échecs
    case ADD_APPOINTMENT_FAILURE:
    case DELETE_RDV_FAILURE:
    case MODIFY_RDV_FAILURE:
    case APPROVE_MODIFICATION_FAILURE:
    case REJECT_MODIFICATION_FAILURE:
    case ADD_PAYMENT_TO_RDV_FAILURE:
      return { ...state, loading: false, error: action.error };

    // Charger les rendez-vous
    case LOAD_APPOINTMENTS:
      return { ...state, appointments: action.payload, loading: false };

    // Charger les rendez-vous de l'utilisateur
    case LOAD_RDVS_SUCCESS:
      return { ...state, userRdvs: action.payload, loading: false, error: null };

    case LOAD_RDVS_FAILURE:
      return { ...state, loading: false, error: action.error };

    // Mettre à jour le statut d'un rendez-vous
    case UPDATE_RDV_SUCCESS: {
      const updatedAppointments = state.appointments.map((rdv) =>
        rdv.id === action.payload.id ? { ...rdv, ...action.payload } : rdv
      );
      const updatedUserRdvs = state.userRdvs.map((rdv) =>
        rdv.id === action.payload.id ? { ...rdv, ...action.payload } : rdv
      );
      return { ...state, appointments: updatedAppointments, userRdvs: updatedUserRdvs };
    }

    case UPDATE_RDV_FAILURE:
      return { ...state, error: action.error };

    case  "UPDATE_RDV_STATUS_SUCCESS": 
      return { ...state, 
        userRdvs: state.userRdvs.map(rdv =>
        rdv.id === action.payload.id ? action.payload : rdv), 
        loading: false, error: null };
      
    case  "UPDATE_RDV_STATUS_FAILURE": 
      return { ...state, loading: false, error: action.error };
    // Cas par défaut
    default:
      return state;
  }
};

export default appointmentReducer;