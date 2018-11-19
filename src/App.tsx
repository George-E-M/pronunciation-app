import * as React from 'react';
import './App.css';

import logo from './logo.svg';

interface IState {
  databaseRecording: any,
  personalRecording: any,
  databaseList: any[],
  recentlySearchedList: any[],
}

class App extends React.Component<{}, IState> {
  constructor(props: any) {
    super(props)
    this.state = {
      databaseRecording: null,
      personalRecording: null,
      databaseList: null,
      recentlySearchedList: null
    }
  }

  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
