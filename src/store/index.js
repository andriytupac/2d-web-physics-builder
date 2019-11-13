import { createStore } from 'easy-peasy';  // 👈 import
import storeModel from '../model';

const store = createStore(storeModel,{disableImmer: true}); // 👈 create our store

export default store;
