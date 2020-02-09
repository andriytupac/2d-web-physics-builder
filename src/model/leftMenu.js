import { action } from "easy-peasy";

const leftMenu = {
    editBodyId: 0,
    editConstraintId: 0,
    editCompositeId: 0,

    addEditBody: action((state, id) => {
        state.editBodyId = id;
    }),
    addEditConstraint: action((state, id) => {
        state.editConstraintId = id;
    }),
    addEditComposite: action((state, id) => {
        state.editCompositeId = id;
    }),
    updateAllForSearch: action((state, payload) => {
        state.editBodyId = 0;
        state.editConstraintId = 0;
        state.editCompositeId = 0;
    }),

};

export default leftMenu;