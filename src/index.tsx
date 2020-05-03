import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import { Provider, connect } from 'react-redux'
import { State, store } from './store'

const mapStateToProps = (state: State) => state;

const mapDispatchToProps = {};

const connectToStore = connect(
  mapStateToProps,
  mapDispatchToProps
)

const ConnectedComponent = connectToStore(App);

const rootElement = document.getElementById('root')

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <ConnectedComponent />
    </React.StrictMode>,
    document.getElementById('root')
  </Provider>
  , rootElement);
