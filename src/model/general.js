import { action } from 'easy-peasy'; // 👈 import
const createTreeMap = data => {
  const tree = [];
  tree.push(data.bodies.length ? {
    label: `bodies`,
    children: [],
    type: 'body',
  }:{label: `bodies`,type: 'body'});
  tree.push(data.constraints.length ? {
    label: `constraints`,
    children: [],
    type: 'constraint',
  }:{label: `constraints`,type: 'constraint'});
  tree.push(data.composites.length ? {
    label: `composites`,
    children: [],
    type: 'composite',
  }: { label: `composites`,type: 'composite' });

  data.bodies.forEach(obj => {
    tree[0].children.push({
      label: `${obj.id} ${obj.label}`,
      type: 'body',
      id: obj.id,
    })
  });
  data.constraints.forEach(obj => {
    tree[1].children.push({
      label: `${obj.id} ${obj.label}`,
      type: 'constraint',
      id: obj.id
    })
  });
  if(data.composites.length) {
    data.composites.forEach(obj => {
      tree[2].children.push({
        label: `${obj.id} ${obj.label}`,
        type: 'composite',
        id: obj.id,
        children: createTreeMap(obj),
      })
    });
  }
  return tree
};
const General = {
  render: {},
  treeElements: [],
  menuLeft: localStorage.getItem('leftMenu') === 'true',
  activeOpacity: localStorage.getItem('activeOpacity') === 'true',
  menuRight: true,
  width: 0,
  height: 0,
  restart: 0,
  staticBlocks: false,
  toastInfo:{
    show: false,
    title: '',
    message: ''
  },
  infoModal:{
    show: false,
    title: '',
    elements: []
  },
  updateInfoModal: action((state, info) => {
    Object.assign(state,{ infoModal: {...info}} )
  }),
  updateToast: action((state, info) => {
    Object.assign(state,{ toastInfo: {...info}} )
  }),
  updateStaticBlocks: action((state, payload) => {
    state.staticBlocks = payload
  }),
  changeActiveOpacity: action((state, payload) => {
    state.activeOpacity = payload
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
    const treeMap = createTreeMap(payload);

    Object.assign(state,{ treeElements: [ ...treeMap ] })

  }),
  /*addGlobalRender: action((state, payload) => {
    return {
      ...state,
      tupac: {
        ...payload
      }
    }
  }),*/
};

export default General;
