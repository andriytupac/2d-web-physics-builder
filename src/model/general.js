import { action } from 'easy-peasy'; // 👈 import

const General = {
  render: {
    world:{
      bodies:[]
    },
  },
  tupac:{},
  //globalRender: {},
  menuLeft: true,

  turnMenuLeft: action((state, payload) => {
    //state.menuLeft = payload;
    return {
      ...state,
      menuLeft: payload
    }
  }),

  addRender: action((state, payload) => {
    return {
      ...state,
      render: {
        ...payload
      }
    }
  }),
  addGlobalRender: action((state, payload) => {
    return {
      ...state,
      tupac: {
        ...payload
      }
    }
  }),
};

export default General;
