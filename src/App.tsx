import * as React from 'react';
import './App.css';
import Modal from 'react-responsive-modal';
import DatabaseSearch from './components/DatabaseSearch';
import RecordingDisplay from './components/RecordingDisplay';

interface IState {
  databaseList: any[],
  databaseRecording: any,
  personalRecording: any,
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
      open: false
    }

    this.fetchRecordings("")
    this.selectNewRecording = this.selectNewRecording.bind(this)
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
            <DatabaseSearch selectNewRecording={this.selectNewRecording} databaseList={this.state.databaseList}/>
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

  private selectNewRecording(newRecording: any) {
    this.setState({
      databaseRecording: newRecording
    })
  }
  
  private fetchRecordings(tag: any) {
		let url = "https://gmce822msaphase2projectapi.azurewebsites.net/api/Recordings"
		if (tag !== "") {
			url += "/tag?=" + tag
		}
    fetch(url, {
       method: 'GET'
    })
    .then(response => response.json())
    .then(json => {
		let databaseRecording = json[0]
		if (databaseRecording === undefined) {
			databaseRecording = {"Id":0, "Word":"No Recordings","Syllables":"","Url":"","Tag":"","Uploaded":"","Rating":"true"}
		}
		this.setState({
			databaseRecording,
			databaseList: json
		})
    });
	}
}

export default App;
