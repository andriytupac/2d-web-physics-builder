import { action } from 'easy-peasy';

const leftMenu = {
	editBodyId: 0,
	editConstraintId: 0,
	editCompositeId: 0,

	addEditBody: action((state, id) => {
		Object.assign(state, { editBodyId: id });
	}),
	addEditConstraint: action((state, id) => {
		Object.assign(state, { editConstraintId: id });
	}),
	addEditComposite: action((state, id) => {
		Object.assign(state, { editCompositeId: id });
	}),
	updateAllForSearch: action(state => {
		Object.assign(state, { editBodyId: 0, editConstraintId: 0, editCompositeId: 0 });
	}),
};

export default leftMenu;
