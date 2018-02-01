import React from 'react';
import { findDOMNode } from 'react-dom';
import {
  // layout
  Layout,
  Row,
  Col,
  // basic
  Button,
  Icon,
  // navigation
  Breadcrumb,
  Dropdown,
  Menu,
  Pagination,
  Steps,
  // data entry
  AutoComplete,
  Cascader,
  Checkbox,
  DatePicker,
  Form,
  InputNumber,
  Input,
  Mention,
  Rate,
  Radio,
  Select,
  Slider,
  Switch,
  TreeSelect,
  TimePicker,
  Transfer,
  Upload,
  // date display
  Avatar,
  Badge,
  Calendar,
  // Card,
  Carousel,
  Collapse,
  List,
  Popover,
  Tooltip,
  Table,
  Tabs,
  Tag,
  Timeline,
  Tree,
  // feedback
  Alert,
  Modal,
  Message,
  notification,
  Progress,
  Popconfirm,
  Spin,
  // other
  Anchor,
  BackTop,
  Divider,
  LocaleProvider,
} from 'antd';
import styled, { injectGlobal } from 'styled-components';
import MonacoEditor from 'react-monaco-editor'
import CodeMirror from 'react-codemirror';

// DragDropContext 应该是 drop target
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import Sources from './components/Sources';
import ComponentEditor from './components/Editor';
import FormDemo from './demo/Form';

import logo from './logo.svg';
import './App.css';
import FormItem from 'antd/lib/form/FormItem';

const { Header, Content, Footer, Sider } = Layout;

const container = 
  <div className="app">
    <h3>通用</h3>
    <Button>Btn</Button>
    <h3>导航</h3>
    <Pagination />
    <h3>表单</h3>
    <AutoComplete />
    <Cascader />
    <Checkbox />
    <DatePicker />
    <InputNumber />
    <Input />
    <Radio />
    <Select />
    <Slider />
    <Switch />
    <TreeSelect />
    <TimePicker />
    <h3>数据展示</h3>
    <Table />
    <Tabs />
  </div>;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      editorModalVisible: false,
      codeVisible: false,
      components: [],
      edittingComponent: null,
    };
  }

  preview = (component) => {
    const { components } = this.state;
    components.push(component);
    this.setState({
        components: [...components],
    });
  }

  /**
   * 得到属性
   */
  writeProps = (Component) => {
    const { props, type } = Component;
    const { propTypes, defaultProps } = type;
    const propsText = [];
    const propsMap = {};
    for (let key in propTypes) {
      if (key === 'children') {
        continue;
      }
      const val = props[key];
      const defaultVal = defaultProps[key];
      if (val) {
        if (typeof val === 'string') {
          propsText.push(`${key}="${props[key]}"`);
          propsMap[key] = `"${val}"`;
        } else if (typeof val === 'boolean') {
          propsText.push(`${key}=${props[key]}`);
          propsMap[key] = val;
        }
      }
    }
    return {
      props: propsMap,
      text: propsText.join(' '),
    };
  }

  /**
   * 根据组件得到源码
   */
  createSourceCode = (components) => {
    let code = '';
    for (let i = 0, l = components.length; i < l; i += 1) {
      const Component = components[i];
      if (!Component) {
        continue;
      }
      if (typeof Component === 'string') {
        code += Component;
        continue;
      }
      const {
        type,
        props,
      } = Component;
      const { name: tag } = type;
      // props
      const { text: propsText } = this.writeProps(Component);
      code += `<${tag} ${propsText}>`;
      if (tag === 'FormItem') {
        code += `{getFieldDecorator("${props.label}")(`;
      }
      if (Component.props.children) {
        code += this.createSourceCode([Component.props.children]);
      }
      if (tag === 'FormItem') {
        code += ')}';
      }
      code += `</${tag}>`;
    }
    console.log(code);
    this.setState({
      code,
      // codeVisible: true,
    });
    return code;
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  hideModal = () => {
    this.setState({
      visible: false,
    });
  }
  showEditorModal = () => {
    this.setState({
      editorModalVisible: true,
    });
  }
  hideEditorModal = () => {
    this.setState({
      editorModalVisible: false,
    });
  }
  hideCodeModal = () => {
    this.setState({
      codeVisible: false,
    });
  }
  /**
   * 编辑属性
   * @param {ReactComponent} component - 要编辑的组件
   */
  handleEditProps = (component) => {
    console.log(component);
    this.showEditorModal();
    const { props } = this.writeProps(component.component);
    console.log(props);
  }

  /** 
   * 删除该组件
   */
  handleDeleteComponent = (component, index) => {
    const { components } = this.state;
    console.log(components, component, index);
    components.splice(index, 1);
    this.setState({
      components: [...components],
    });
  }

  render() {
    const { components, code } = this.state;

    const realComponents = components.map((item, i) => {
      return (
        <div className="edit__wrapper">
          <div>
            <div className="edit__btn" onClick={this.handleEditProps.bind(this, item)}>
              <Icon type="edit" />
            </div>
            <div className="edit__btn" onClick={this.handleDeleteComponent.bind(this, item, i)}>
              <Icon type="delete" />
            </div>
          </div>
          {item.component}
        </div>
      );
    });
    return (
      <Layout>
        <Sider>
          <Sources
            handleClick={this.preview}
            components={components}
          />
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', paddingLeft: 24 }}>
            <Button type="primary" onClick={this.createSourceCode.bind(this, components.map(item => item.component))}>查看源码</Button>
            <Button style={{ marginLeft: 20 }} type="primary" onClick={this.showModal}>查看示例</Button>
          </Header>
          <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
            <div style={{ padding: 24, background: '#fff' }}>
              <div style={{ height: 600 }}>
                {realComponents}
              </div>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Ant Design ©2016 Created by Ant UED
          </Footer>
        </Layout>
        <Modal
          title="demo"
          visible={this.state.visible}
          onOk={this.hideModal}
          onCancel={this.hideModal}
        >
          <FormDemo />
        </Modal>
        <Modal
          title="查看代码"
          visible={this.state.codeVisible}
          onOk={this.hideCodeModal}
          onCancel={this.hideCodeModal}
        >
          <CodeMirror value={code} />
        </Modal>
        <Modal
          title="编辑组件"
          visible={this.state.editorModalVisible}
          onOk={this.hideEditorModal}
          onCancel={this.hideEditorModal}
        >
          <ComponentEditor />
        </Modal>
      </Layout>
    );
  }
}

export default DragDropContext(HTML5Backend)(App);
