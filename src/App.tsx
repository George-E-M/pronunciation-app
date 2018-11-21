import * as React from 'react';
import './App.css';
import DatabaseSearch from './components/DatabaseSearch';
import RecordingDisplay from './components/RecordingDisplay';

interface IState {
  databaseList: any[],
  databaseRecording: any,
  personalRecording: any,
  recentlySearchedList: any[],
}

class App extends React.Component<{}, IState> {
  constructor(props: any) {
    super(props)
    this.state = {
      databaseList: [],
      //Rating is false to indicate a bad recording.
      databaseRecording: {"ID":0, "Word":"None Selected", "Syllables":"", "Url":"", "Tag":"", "Uploaded":"", Rating:true},
      personalRecording: null,
      recentlySearchedList: []
    }
  }

  public render() {
    return (
      <div>
        <div className="header-wrapper">
				  <div className="container header">
            &nbsp;Pronunciation App - MSA Phase 2&nbsp;
            <div className="btn header-btn" onClick={this.switchTheme}>Switch Theme</div>
				  </div>
			  </div>
        <div className="container app-body">
          <div className="search-body">
            <DatabaseSearch databaseList={this.state.databaseList} recentlySearchedList={this.state.recentlySearchedList} />
          </div>
          <div className="display-body">
            <RecordingDisplay databaseRecording={this.state.databaseRecording} personalRecording={this.state.personalRecording} />
          </div>
        </div>
      </div>
    );
  }

  private switchTheme() {
  
  }
}

export default App;
