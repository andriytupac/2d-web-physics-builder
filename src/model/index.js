import { reducer } from 'easy-peasy';
import { reducer as formReducer } from 'redux-form';
import matterOptions from './matterOptions';
import General from './general';
import leftMenu from './leftMenu';

const storeModel = {
	matterOptions,
	general: General,
	leftMenu,
	form: reducer(formReducer),
};

export default storeModel;
