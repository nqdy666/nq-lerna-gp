import { Checkbox } from 'antd';

import layout from './fieldLayout';

const { Group: CheckboxGroup } = Checkbox;

const options = [
  {
    label: '美食线上活动',
    value: 0,
  },
  {
    label: '地推活动',
    value: 1,
  },
  {
    label: '线下主体活动',
    value: 2,
  },
  {
    label: '单纯品牌曝光',
    value: 3,
  },
];

export default function (params = {}) {
  const { uuid } = params;
  return {
    Component: CheckboxGroup,
    label: 'CheckboxGroup',
    import: 'Checkbox',
    extra: 'const { CheckboxGroup } = Checkbox;',
    stateCode: `options${uuid}: ${JSON.stringify(options)}`,
    renderCode: `const { options${uuid} } = this.state;`,
    // 表单用字段
    isField: true,
    fieldProps: {
      title: '活动名称',
      label: 'name',
      rules: [],
      initialValue: [2],
      ...layout,
    },
    props: {
      placeholder: '请输入活动名称',
      options,
    },
  };
};
