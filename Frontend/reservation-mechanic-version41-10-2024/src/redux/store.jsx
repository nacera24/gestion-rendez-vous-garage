import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk'; 
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './reducers/authReducers';
import userReducer from './reducers/userReducer';
import vehicleReducer from './reducers/vehicleReducer';
import appointmentReducer from './reducers/appointmentReducer'; 
import paymentReducer from './reducers/paymentReducers';
import billingReducer from './reducers/billingReducer';
// Configuration de la persistance
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user','vehicles', 'appointments', 'payments', 'bills'],
};

// Combiner les reducers
const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  vehicles: vehicleReducer,
  appointments: appointmentReducer,
  payments: paymentReducer,
 bills: billingReducer,
});

// Créer le reducer persistant
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Créer le store avec le reducer persistant
const store = createStore(persistedReducer, applyMiddleware(thunk));

// Créer le persistor
const persistor = persistStore(store);

export { store, persistor };
