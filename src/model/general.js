import { action } from 'easy-peasy'; // 👈 import

const General = {
  render: {
    world:{
      bodies:[]
    },
  },
  menuLeft: true,
  menuRight: true,
  width: 0,
  height: 0,
  restart: 0,
  staticBlocks: false,

  updateStaticBlocks: action((state, payload) => {
    state.staticBlocks = payload
  }),
  runRestart: action((state, payload) => {
    state.restart += 1
  }),
  chaneSize: action((state, payload) => {
    state.width = payload.width;
    state.height = payload.height;
  }),
  turnMenuLeft: action((state, payload) => {
    state.menuLeft = payload;
    /*return {
      //...state,
      menuLeft: payload
    }*/
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
