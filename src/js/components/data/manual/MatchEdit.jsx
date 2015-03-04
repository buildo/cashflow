/** @jsx React.DOM */

'use strict';

const React = require('react/addons');
const List = require('../List.jsx');

const MatchEdit = React.createClass({

  mixins: [React.addons.LinkedStateMixin],

  propTypes: {
    initialData: React.PropTypes.object.isRequired,
    onChange: React.PropTypes.func.isRequired,
  },

  getInitialState: function() {
    return this.props.initialData || {};
  },

  componentDidMount: function() {
    $(this.refs.roundDropdown.getDOMNode()).dropdown({onChange: (text, value) => this.setState({round: value})});
    const matchForm =  $(this.refs.matchForm.getDOMNode());

    const validationRules = {
      opponentName: {
        identifier: 'opponentName',
        rules: [
          {
            type: 'empty',
            prompt: 'Devi inserire il nome dell\'avversario'
          }
        ]
      },
      opponentRanking: {
        identifier: 'opponentRanking',
        rules: [
          {
            type: 'integer',
            prompt: 'Il ranking dell\'avversario deve essere un numero'
          }
        ]
      },
      firstSetMe: {
        identifier: 'firstSetMe',
        rules: [
          {
            type: 'integer',
            prompt: 'Il risultato deve essere un numero'
          }
        ]
      },
      firstSetOpponent: {
        identifier: 'firstSetOpponent',
        rules: [
          {
            type: 'integer',
            prompt: 'Il risultato deve essere un numero'
          }
        ]
      },
      secondSetMe: {
        identifier: 'secondSetMe',
        rules: [
          {
            type: 'integer',
            prompt: 'Il risultato deve essere un numero'
          }
        ]
      },
      secondSetOpponent: {
        identifier: 'secondSetOpponent',
        rules: [
          {
            type: 'integer',
            prompt: 'Il risultato deve essere un numero'
          }
        ]
      },
      thirdSetMe: {
        identifier: 'thirdSetMe',
        optional: true,
        rules: [
          {
            type: 'integer',
            prompt: 'Il risultato deve essere un numero'
          }
        ]
      },
      thirdSetOpponent: {
        identifier: 'thirdSetOpponent',
        optional: true,
        rules: [
          {
            type: 'integer',
            prompt: 'Il risultato deve essere un numero'
          }
        ]
      }
    };

    matchForm.form(validationRules,
      {
        inline: true,
        on: 'blur',
      }
    );
  },

  componentWillUpdate: function(nextProps, nextState) {
    this.props.onChange(nextState);
  },

  validateForm: function () {
    return $(this.refs.matchForm.getDOMNode()).form('validate form');
  },

  render: function () {
    return (
      <div>
        <div className="ui form" ref='matchForm'>
          <h4 className="ui dividing header">Dati avversario</h4>
          <div className="two fields">
            <div className="field">
              <label>Nome avversario</label>
              <input type="text" placeholder="" name='opponentName' valueLink={this.linkState('opponentName')}/>
            </div>
            <div className="field">
              <label>Ranking avversario</label>
              <input type="text" placeholder="" name='opponentRanking' valueLink={this.linkState('opponentRanking')}/>
            </div>
          </div>
          <h4 className="ui dividing header">Risultato</h4>
          <div className="field">
            <label>Turno</label>
            <div className='ui selection dropdown' ref='roundDropdown'>
              <div className="text">{this.state.round}</div>
              <i className='dropdown icon'></i>
              <div className='menu'>
                <div className='item' data-value='0' data-text='Finale'>Finale</div>
                <div className='item' data-value='1' data-text='Semifinali'>Semifinali</div>
                <div className='item' data-value='2' data-text='Quarti'>Quarti</div>
                <div className='item' data-value='3' data-text='Terzo turno'>Terzo turno</div>
                <div className='item' data-value='4' data-text='Secondo turno'>Secondo turno</div>
                <div className='item' data-value='5' data-text='Primo turno'>Primo turno</div>
              </div>
            </div>
          </div>
          <label>1º Set</label>
          <div className="two fields">
            <div className="field">
              <input type="text" placeholder="Io" name='firstSetMe' valueLink={this.linkState('firstSetMe')}/>
            </div>
            <div className="field">
              <input type="text" placeholder="Avversario" name='firstSetOpponent' valueLink={this.linkState('firstSetOpponent')}/>
            </div>
          </div>
          <label>2º Set</label>
          <div className="two fields">
            <div className="field">
              <input type="text" placeholder="Io" name='secondSetMe' valueLink={this.linkState('secondSetMe')}/>
            </div>
            <div className="field">
              <input type="text" placeholder="Avversario" name='secondSetOpponent' valueLink={this.linkState('secondSetOpponent')}/>
            </div>
          </div>
          <label>3º Set</label>
          <div className="two fields">
            <div className="field">
              <input type="text" placeholder="Io" name='thirdSetMe' valueLink={this.linkState('thirdSetMe')}/>
            </div>
            <div className="field">
              <input type="text" placeholder="Avversario" name='thirdSetOpponent' valueLink={this.linkState('thirdSetOpponent')}/>
            </div>
          </div>
        </div>
      </div>
    );
  },

});

module.exports = MatchEdit;