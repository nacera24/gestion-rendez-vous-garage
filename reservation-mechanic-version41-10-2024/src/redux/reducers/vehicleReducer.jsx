const initialState = {
  vehicles: [],
  vehicleDetails: null,
  loading: false,
  error: null,
};

const vehicleReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_VEHICLE_SUCCESS':
      return {
        ...state,
        vehicles: [...state.vehicles, action.payload],
        loading: false,
      };

    case 'EDIT_VEHICLE_SUCCESS':
      return {
        ...state,
        vehicles: state.vehicles.map(vehicle =>
          vehicle.id === action.payload.id ? action.payload : vehicle
        ),
        loading: false,
      };

    case 'DELETE_VEHICLE_SUCCESS':
      return {
        ...state,
        vehicles: state.vehicles.filter(vehicle => vehicle.id !== action.payload),
        loading: false,
      };

    case 'FETCH_VEHICLE_REQUEST':
      return {
        ...state,
        loading: true,
        error: null,
      };

    case 'FETCH_VEHICLE_SUCCESS':
      return {
        ...state,
        vehicleDetails: action.payload,
        loading: false,
      };

    case 'LOAD_VEHICLES_SUCCESS':
      return {
        ...state,
        vehicles: action.payload,
        loading: false,
      };

    case 'LOAD_VEHICLES_FAILURE':
      return {
        ...state,
        error: action.error,
        loading: false,
      };

      case 'ADD_REPAIR_TO_VEHICLE_SUCCESS':
        return {
          ...state,
          vehicles: state.vehicles.map(vehicle => {
            if (vehicle.id === action.payload.vehicleId) {
              vehicle.repair = vehicle.repair ? [...vehicle.repairs, action.payload.repair] : [action.payload.repair];
              return vehicle;
            }
            return vehicle;
          }),
        };

    case 'FETCH_VEHICLE_FAILURE':
    case 'ADD_VEHICLE_FAILURE':
    case 'EDIT_VEHICLE_FAILURE':
    case 'DELETE_VEHICLE_FAILURE':
      return {
        ...state,
        error: action.error,
        loading: false,
      };

    default:
      return state;
  }
};

export default vehicleReducer;