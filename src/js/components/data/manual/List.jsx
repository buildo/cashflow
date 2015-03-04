/** @jsx React.DOM */

'use strict';

const React = require('react');
const _ = require('lodash');

let editData;

const List = React.createClass({

  propTypes: {
    view: React.PropTypes.any.isRequired,
    edit: React.PropTypes.any.isRequired,
    onChange: React.PropTypes.func.isRequired,
    initialData: React.PropTypes.array.isRequired,
    addLabel: React.PropTypes.string.isRequired,
    createLabel: React.PropTypes.string.isRequired
  },

  isEditing: function () {
    return typeof this.state.editIndex !== 'undefined' || this.state.isAdding;
  },

  notifyChangeState: function () {
    this.props.onChange(this.state.data);
  },

  onEdit: function (index) {
    if (this.refs.editForm.validateForm()) {
      this.state.data[index] = editData;
      this.setState({
        data: this.state.data,
        editIndex: undefined,
        isAdding: false
      });
      editData = undefined;
      this.notifyChangeState();
    }
  },

  onCancel: function () {
    this.setState({
      editIndex: undefined,
      isAdding: false
    });
    editData = undefined;
  },

  onItemChange: function (_data) {
    editData = _data;
  },

  onAdd: function () {
    if (this.refs.editForm.validateForm()) {
      this.state.data.push(editData);
      this.setState({
        data: this.state.data,
        editIndex: undefined,
        isAdding: false
      });
      editData = undefined;
      this.notifyChangeState();
    }
  },

  remove: function (index, event) {
    this.state.data.splice(index, 1);
    this.setState({
      data: this.state.data,
      editIndex: undefined,
      isAdding: false
    });
    editData = undefined;
    this.notifyChangeState();
  },

  edit: function (index, event) {
    this.setState({
      editIndex: index,
      isAdding: false
    });
    editData = this.state.data[index];
  },

  add: function () {
    this.setState({
      editIndex: undefined,
      isAdding: true
    });
    editData = undefined;
  },

  getInitialState: function() {
    return {
      data: this.props.initialData
    };
  },

  render: function () {
    const View = this.props.view;
    const Edit = this.props.edit;
    const data = this.state.data;

    const elements = this.state.data.map((obj, index) => {
      const isEdit = this.state.editIndex === index;
      const view = (
        <div>
          <div className='ui right floated buttons'>
            <div className='ui icon button' data-content='Modifica'>
              <i className='large edit icon' onClick={_.partial(this.edit, index)}></i>
            </div>
            <div className='ui icon button' data-content='Elimina'>
              <i className='large trash icon' onClick={_.partial(this.remove, index)}></i>
            </div>
          </div>
          <View data={obj} key={index}/>
        </div>
      );

      const edit = (
        <div>
          <Edit initialData={obj} onChange={this.onItemChange} ref='editForm' key={index}/>
          <br/>
          <div style={{float: 'right'}}>
            <div className='ui button' onClick={this.onCancel}>Annulla</div>
            <div className='ui positive button' onClick={_.partial(this.onEdit, index)}>{this.props.addLabel}</div>
          </div>
        </div>
      );

      return (
        <div className='ui segment' key={index}>
          {isEdit ? edit : view}
        </div>
      );
    });

    const addElement = this.state.isAdding ?
    <div className='ui segment'>
      <Edit initialData={{}} onChange={_.partial(this.onItemChange)} ref='editForm'/>
      <br/>
      <div style={{float: 'right'}}>
        <div className='ui button' onClick={this.onCancel}>Annulla</div>
        <div className='ui positive button' onClick={this.onAdd}>{this.props.addLabel}</div>
      </div>
    </div>
    :
    <div className='ui blue button' onClick={this.add}>{this.props.createLabel}</div>;

    return (
      <div>
        {elements}
        {addElement}
        <br/>
      </div>
    );
  },

});

module.exports = List;
