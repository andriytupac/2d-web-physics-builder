import { createStore } from 'easy-peasy';  // 👈 import
import storeModel from '../model';

/*
const rootReducer = combineReducers({
  // ...your other reducers here
  // you have to pass formReducer under 'form' key,
  // for custom keys look up the docs for 'getFormState'
  ...storeModel,
  form: formReducer
})*/
const store = createStore(storeModel,{disableImmer: false}); // 👈 create our store

export default store;
