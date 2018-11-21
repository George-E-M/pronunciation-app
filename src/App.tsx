import * as React from 'react';
import './App.css';
import Modal from 'react-responsive-modal';
import DatabaseSearch from './components/DatabaseSearch';
import RecordingDisplay from './components/RecordingDisplay';

interface IState {
  databaseList: any[],
  databaseRecording: any,
  personalRecording: any,
  recentlySearchedList: any[],
  open: boolean,
}

class App extends React.Component<{}, IState> {
  constructor(props: any) {
    super(props)
    this.state = {
      databaseList: [],
      //Rating is false to indicate a bad recording.
      databaseRecording: {"ID":0, "Word":"None Selected", "Syllables":"", "Url":"", "Tag":"", "Uploaded":"", Rating:true},
      personalRecording: null,
      recentlySearchedList: [],
      open: false
    }
  }

  public render() {
    const {open} = this.state;
    return (
      <div>
        <div className="header-wrapper">
				  <div className="container header">
            <div className="btn help-btn" onClick={this.openHelp}>Help</div>
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
        <Modal open={open} onClose={this.helpClosed}>
          <div>
            help text goes here
          </div>
        </Modal>
      </div>
    );
  }

  private switchTheme() {
  
  }

  // Modal open
	private openHelp = () => {
		this.setState({ open: true });
	  };
	
	// Modal close
	private helpClosed = () => {
		this.setState({ open: false });
	};
}

export default App;
