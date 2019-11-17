import {action} from "easy-peasy";

const matterOptions = {
  options: {},

  addOptions: action((state, payload) => {
    return {
      ...state,
      options: {
        ...payload
      }
    }
  }),

};

export default matterOptions;
