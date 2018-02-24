import { createStore } from 'redux';
import update from 'immutability-helper';

import * as t from '../common/actions';
import {
  updateProps,
  removeComponent,
  findInstance,
} from '../common/util';

const initialState = {
  instances: [],
};

function reducer(state = initialState, action) {
  const { instances } = state;
  switch (action.type) {
    case t.ADD_COMPONENT:
      const { payload: obj } = action;
      return {
        ...state,
        instances: update(instances, {$push: [obj]}),
      };
    case t.UPDATE_COMPONENT:
      const { item, values } = action.payload;
      let { uuid } = item;
      // 递归寻找 uuid 对应的那个实例对象并更新 fieldProps 和 props
      updateProps(uuid, [...instances], values);
      return {
        ...state,
        instances,
      };
    case t.REMOVE_COMPONENT:
      uuid = action.payload.uuid;
      let temp = [...instances];
      removeComponent(uuid, temp);
      return {
        ...state,
        instances: temp,
      };
    case t.SORT:
      const { dragIndex, hoverIndex } = action.payload;
      const dragCard = instances[dragIndex];
      const res = update(state, {
        instances: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
        },
      });
      return res;
    case t.APPEND_COMPONENT:
      const { parent } = action.payload;
      // 找到 parent
      temp = [...state.instances];
      const parentInstance = findInstance(parent, temp);
      console.log(parent, instances, parentInstance);
      if (parentInstance) {
        parentInstance.children = parentInstance.children || [];

        parentInstance.children.push(action.payload.item);
      }
      return {
        ...state,
        instances: temp,
      };
    default:
      return state;
  }
}

let store = createStore(reducer);

export default store;
