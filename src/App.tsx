import * as React from 'react';
import * as Webcam from "react-webcam";
import './App.css'; 
import ChatBot from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';
import Logo from './logo.png'
import Modal from 'react-responsive-modal';
import DatabaseSearch from './components/DatabaseSearch';
import RecordingDisplay from './components/RecordingDisplay';
import FacebookLogin from 'react-facebook-login';
import {FacebookShareButton} from 'react-share'

const chatBotTheme = {
	background: '#f5f8fb',
	fontFamily: "Helvetica",
	headerBgColor: '#7272FE',
	headerFontColor: '#fff',
	headerFontSize: '15px',
	botBubbleColor: '#7272FE',
	botFontColor: '#fff',
	userBubbleColor: '#fff',
	userFontColor: '#4a4a4a',
  };
const chatSteps=[
  {
      id: 'start',
      message: 'What do you need help with?',
      trigger: 'initial',
  },
  {
      id: 'initial',
      options: [
          { value: 'searching', label: 'Searching through the database', trigger: 'search' },
          { value: 'adding', label: 'Adding to the database', trigger: 'add' },
          { value: 'display', label: 'Understanding the recording display', trigger: 'display'},
          { value: 'editing', label: 'Editing recordings', trigger: 'edit' },
          { value: 'reporting', label: 'Reporting recordings', trigger: 'report'},
          { value: 'revert', label: 'How do I revert my search?', trigger: 'searchRevert'}
      ]
  },
  {
      id: 'search',
      message: 'To search through the database you can use the search bar. When using the search bar you simply type in the name of the word or tag you are looking for.',
      trigger: 'initial',
  },
  {
      id: 'add',
      message: 'To add a recording to the database simply press the Add To Database button, fill out the form and press upload, there may be a slight delay as it is uploaded',
      trigger: 'initial',
  },
  {
      id: 'display',
      message: 'The display shows the Word, Tag, syllable split and the time of upload at the top. The first media player allows you to play the database recording. The second media play allows you to record and listen to your own attempts.',
      trigger: 'initial',
  },
  {
      id: 'edit',
      message: 'To edit a recording simply press the edit button, enter the values you want to change, and press save changes. Any entries left empty will remain the same. You have to log in to edit Recordings.',
      trigger: 'initial',
  },
  {
      id: 'report',
      message: 'To report a recording simply press the report button then select yes, what this does is warns user the recording is of poor quality.',
      trigger: 'initial',
  },
  {
    id: 'searchRevert',
    message: 'To repopulate the list with everything in the database, simply search with no input in the text field',
    trigger: 'initial',
  }
]

interface IState {
  databaseList: any[],
  databaseRecording: any,
  open: boolean,
  authenticated: boolean,
  refCamera: any,
  predictionResult: any,
  verifiedUser: boolean,
}

class App extends React.Component<{}, IState> {
  constructor(props: any) {
    super(props)
    this.state = {
      databaseList: [],
      //Rating is false to indicate a bad recording.
      databaseRecording: {"ID":0, "Word":"None Selected", "Syllables":"", "Url":"", "Tag":"", "Uploaded":"", Rating:true},
      open: false,
      authenticated: false,
      refCamera: React.createRef(),
      predictionResult: null,
      verifiedUser: false,
    }

    this.fetchRecordings("")
    this.selectNewRecording = this.selectNewRecording.bind(this)
    this.fetchRecordings = this.fetchRecordings.bind(this)
    this.authenticate = this.authenticate.bind(this)
    this.skipLogin = this.skipLogin.bind(this)
  }

  public render() {
    const {open} = this.state;

    return (
      <div>
        {(!this.state.authenticated) ?
	        <Modal open={!this.state.authenticated} onClose={this.authenticate} closeOnOverlayClick={false} showCloseIcon={false} center={true}>
		        <Webcam
			        audio={false}
			        screenshotFormat="image/jpeg"
			        ref={this.state.refCamera}
		        />
		        <div className="row nav-row btn-container">
			        <div className="btn btn-primary bottom-button btn1" onClick={this.authenticate}>Login</div>
              <div className="btn btn-primary bottom-button btn2" onClick={this.skipLogin}>Skip Login</div>
              <FacebookLogin
                appId="717313765314287"
                autoLoad={false}
                fields="name,email,picture"
                onClick={this.handleFacebookLogin}
                callback={this.facebookResponse}
              />
		        </div>
          </Modal> : ""}
        {(this.state.authenticated) ?	
        <div>
        <div className="header-wrapper">
				  <div className="container header">
            <div className="btn help-btn" onClick={this.openHelp}>Help</div>
            &nbsp;Pronounce! - MSA Phase 2&nbsp;
            <img src={Logo} height='45'/>
            <FacebookShareButton 
              url="https://www.facebook.com/sharer/sharer.php?u=https%3A//msaphase2pronounce.azurewebsites.net/"
              quote="Pronunciation Application"
              className="header-btn">
              Share on Facebook
            </FacebookShareButton>
				  </div>
			  </div>
        <div className="container app-body">
          <div className="search-body">
            <DatabaseSearch selectNewRecording={this.selectNewRecording} databaseList={this.state.databaseList} search={this.fetchRecordings}/>
          </div>
          <div className="display-body">
            <RecordingDisplay databaseRecording={this.state.databaseRecording} verifiedUser={this.state.verifiedUser} fetchRecordings={this.fetchRecordings}/>
          </div>
        </div>
        <Modal open={open} onClose={this.helpClosed}>
        <div>
          <ThemeProvider theme = {chatBotTheme}>
            <ChatBot botDelay='400' steps={chatSteps}/>
          </ThemeProvider>
        </div>
        </Modal>
        </div>
        : ""}
      </div>
    );
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
  
  private fetchRecordings(searchInput: any) {
    let url = "https://gmce822msaphase2projectapi.azurewebsites.net/api/Recordings"
    searchInput === ":bad:"
		if (searchInput === ":bad:") {
			url += "/bad"
		} else if (searchInput !== "") {
      url += "/search?=" + searchInput
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
  
  private authenticate() {
    const screenshot = this.state.refCamera.current.getScreenshot();
	  this.getFaceRecognitionResult(screenshot);
  }

  // Call custom vision model
private getFaceRecognitionResult(image: string) {
	const url = "https://southcentralus.api.cognitive.microsoft.com/customvision/v2.0/Prediction/274f3dd3-c173-4e0b-a671-cb7fca5dc51e/image?iterationId=0becb8f9-925d-4732-a1d4-eba33cb7e235"
	if (image === null) {
		return;
	}
	const base64 = require('base64-js');
	const base64content = image.split(";")[1].split(",")[1]
	const byteArray = base64.toByteArray(base64content);
	fetch(url, {
		body: byteArray,
		headers: {
			'cache-control': 'no-cache', 'Prediction-Key': '2c84d93c297e4ffeb9dc29a2e6052968', 'Content-Type': 'application/octet-stream'
		},
		method: 'POST'
	})
		.then((response: any) => {
			if (!response.ok) {
				// Error State
				alert(response.statusText)
			} else {
				response.json().then((json: any) => {
          console.log(json.predictions[0])
          this.setState({predictionResult: json.predictions[0] })
          if (this.state.predictionResult.probability > 0.7) {
            this.setState({
              authenticated: true,
              verifiedUser: true
            })
          } else {
            this.setState({authenticated: false})
          }
				})
			}
		})
  }

  private facebookResponse = (response: any) => {
    console.log(response)
    if(response.status !== "unknown") {
      this.setState({
        authenticated: true,
        verifiedUser:true
      })
    }
  }
  
  private handleFacebookLogin = () => {

  }

  private skipLogin() {
    this.setState({
      authenticated:true,
      verifiedUser:false
    })
  }
}

export default App;
