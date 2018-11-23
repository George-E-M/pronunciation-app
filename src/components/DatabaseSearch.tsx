import * as React from "react";
import MediaStreamRecorder from 'msr';
import Modal from 'react-responsive-modal';

interface IProps {
    databaseList: any[],
    selectNewRecording: any,
    search: any
}

interface IState {
    open: boolean
    uploadFile: any
}

export default class DatabaseSearch extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props)
        this.state = {
            open: false,
            uploadFile: null
        }

        this.handleFileUpload = this.handleFileUpload.bind(this)
        this.uploadRecording = this.uploadRecording.bind(this)
        this.search = this.search.bind(this)
        this.handleKeyPress = this.handleKeyPress.bind(this)
        this.searchByVoice = this.searchByVoice.bind(this)
        this.postAudio = this.postAudio.bind(this)
    }

    public render() {
        const {open} = this.state 
        return(
            <div className="container search-wrapper">
                <div className="search-heading">
                    Search for the Word or Tag you want to practice
                </div>
                <div className="search-container">
                    <div className="btn" onClick={this.searchByVoice}><i className="fa fa-microphone" /></div>
                    <input type="text" id="search-textbox" className="search-bar" placeholder=" Search For a Word/Tag" onKeyPress={this.handleKeyPress}/>
                    <div className="search-container-divider">
                        <div className="btn search-btn" onClick = {this.search}>Search</div>
                    </div>
                </div>
                <div className="search-table">
                    <table className="table table-striped">
                        <tbody>
                            {this.createTable()}
                        </tbody>
                    </table>
                </div>
                <div className="btn-container">
                    <div className="btn app-btn" onClick={this.addToDatabase}> Add To Database </div>
                </div>
                <Modal open={open} onClose={this.onAddClose}>
				<form>
					<div className="form-group">
						<label>Word</label>
						<input type="text" className="form-control" id="recording-word-input" placeholder="Enter Word" />
						<small className="form-text text-muted">You can edit any Recording later</small>
					</div>
                    <div className="form-group">
						<label>Syllable division</label>
						<input type="text" className="form-control" id="recording-syllable-input" placeholder="Enter syllables e.g Re-cor-ding" />
						<small className="form-text text-muted">Syllables can also be edited</small>
					</div>
					<div className="form-group">
						<label>Tag</label>
						<input type="text" className="form-control" id="recording-tag-input" placeholder="Enter Tag" />
						<small className="form-text text-muted">Tag is used to search</small>
					</div>
					<div className="form-group">
						<label>Recording Audio</label>
						<input type="file" onChange={this.handleFileUpload} className="form-control-file" id="meme-image-input" />
					</div>

					<button type="button" className="btn" onClick={this.uploadRecording}>Upload</button>
				</form>
			    </Modal>
            </div>
        );
    }

    private addToDatabase = () => {
        this.setState({open:true});
    }

    private onAddClose = () => {
        this.setState({open:false});
    }

    private search() {
        const text = document.getElementById("search-textbox") as HTMLInputElement
        if (text === null) {
            return;
        }
        const searchInput = text.value 
        this.props.search(searchInput)  
    }

    private createTable() {
        const table:any[] = []
        const databaseRecordings = this.props.databaseList
        if (databaseRecordings == null) {
            return table
        }
        
        for (let i = 0; i < databaseRecordings.length; i++) {
            const children = []
            const recording = databaseRecordings[i]
            children.push(<td key={"word" + i}>{recording.word}</td>)
            children.push(<td key={"tag" + i}>{recording.tag}</td>)
            table.push(<tr key={i+""} id={i+""} onClick= {this.selectRow.bind(this, i)}>{children}</tr>)
        }
        return table
    }

    private selectRow(index: any) {
        const selectedMeme = this.props.databaseList[index]
        if (selectedMeme != null) {
            this.props.selectNewRecording(selectedMeme)
        }
    }

    private handleKeyPress(e: any) {
        if (e.key === 'Enter') {
            this.search()
        }
    }

    // Sets file list
	private handleFileUpload(file: any) {
		this.setState({
			uploadFile: file.target.files
		})
	}

	// POST meme
	private uploadRecording() {
        const wordInput = document.getElementById("recording-word-input") as HTMLInputElement
        const syllablesInput = document.getElementById("recording-syllable-input") as HTMLInputElement
		const tagInput = document.getElementById("recording-tag-input") as HTMLInputElement
		const recordingFile = this.state.uploadFile[0]

		if (wordInput === null || tagInput === null || recordingFile === null) {
			return;
		}

        const word = wordInput.value
        const syllables = syllablesInput.value
        const tag = tagInput.value
		const url = "https://gmce822msaphase2projectapi.azurewebsites.net/api/Recordings/upload"

		const formData = new FormData()
        formData.append("Word", word)
        formData.append("Syllables", syllables)
        formData.append("Tag", tag)
        formData.append("Rating", "true")
		formData.append("Image", recordingFile)

		fetch(url, {
			body: formData,
			headers: {'cache-control': 'no-cache'},
			method: 'POST'
		})
        .then((response : any) => {
			if (!response.ok) {
				// Error State
				alert(response.statusText)
			} else {
                this.props.search("")
                this.setState({
                    open: false
                })
			}
		  })
    }
    
    private searchByVoice() {
        const mediaConstraints = {
            audio: true
        }
        const onMediaSuccess = (stream: any) => {
            const mediaRecorder = new MediaStreamRecorder(stream);
            mediaRecorder.mimeType = 'audio/wav'; // check this line for audio/wav
            mediaRecorder.ondataavailable = (blob: any) => {
                this.postAudio(blob);
                mediaRecorder.stop()
            }
            mediaRecorder.start(3000);
        }
    
        navigator.mediaDevices.getUserMedia(mediaConstraints).then(onMediaSuccess).catch(onMediaError)
    
        function onMediaError(e: any) {
            console.error('media error', e);
        }
    }

    private postAudio(blob: any) {
        let accessToken: any;
        fetch('https://westus.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1', {
            headers: {
                'Content-Length': '0',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Ocp-Apim-Subscription-Key': '[YOUR SUBSCRIPTION KEY]'
            },
            method: 'POST'
        }).then((response) => {
            // console.log(response.text())
            return response.text()
        }).then((response) => {
            console.log(response)
            accessToken = response
        }).catch((error) => {
            console.log("Error", error)
        });

        // posting audio
        fetch('https://westus.api.cognitive.microsoft.com/sts/v1.0', {
            body: blob, // this is a .wav audio file    
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer' + accessToken,
                'Content-Type': 'audio/wav;codec=audio/pcm; samplerate=16000',
                'Ocp-Apim-Subscription-Key': '5a3716cc677546d7ac9a33eb3da02ceb'
            },    
            method: 'POST'
        }).then((res) => {
            return res.json()
        }).then((res: any) => {
            console.log(res)
            const textBox = document.getElementById("search-textbox") as HTMLInputElement
            textBox.value = (res.DisplayText as string).slice(0, -1)
        }).catch((error) => {
            console.log("Error", error)
        });
    }
}