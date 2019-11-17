import { reducer } from 'easy-peasy';
import { reducer as formReducer } from 'redux-form'
import matterOptions from './matterOptions';
import General from './general';

const storeModel = {
  matterOptions: matterOptions,
  general: General,
  form: reducer(formReducer),
};

export default storeModel;
