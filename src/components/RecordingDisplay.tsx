import * as React from "react";
import Modal from 'react-responsive-modal';
import MediaStreamRecorder from 'msr';

interface IProps {
    databaseRecording: any,
    verifiedUser: boolean,
    fetchRecordings: any
}

interface IState {
    deleteOpen: boolean
    editOpen: boolean
    reportOpen: boolean
    openWarning: boolean
    attemptUrl: any
}

export default class RecordingDisplay extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props)
        this.state = {
            deleteOpen: false,
            editOpen: false,
            reportOpen: false,
            openWarning: false,
            attemptUrl: null,
        }
        
        this.updateRecording = this.updateRecording.bind(this)
        this.updateReport = this.updateReport.bind(this)
        this.removeRecordingFromDatabase = this.removeRecordingFromDatabase.bind(this)
        this.recordAudio = this.recordAudio.bind(this)
    }

    public render() {
        const {deleteOpen} = this.state
        const {editOpen} = this.state
        const {reportOpen} = this.state
        const {openWarning} = this.state
        const databaseRecording = this.props.databaseRecording

        let reportLabel
        let warningLabel

        if (databaseRecording.rating === "true") {
            reportLabel =  <label>Do you want to report this recording for being of poor quality?</label>
            warningLabel = <label></label>
        } else {
            reportLabel =  <label>This recording has been reported to be of poor quality. Do you want to revert this report?</label>
            warningLabel = <label>Warning: This Recording is of poor quality</label>
        }

        return(
            <div className="container recording-wrapper">
                <div className="row recording-heading">
                    <b>{databaseRecording.word}</b>&nbsp; {databaseRecording.tag}
                </div>
                <div className="row recording-heading">
                    <b>{databaseRecording.syllables}</b>
                </div>
                <div className="row recording-heading">
                    {databaseRecording.uploaded}
                </div>
                <div className="recording-label">
                    <label>Play Demo Recording</label>
                </div>
                <div className="recording-play-container">
                    <audio ref="audioSource" controls={true} src={databaseRecording.url}/>
                </div>
                <div className="recording-label">
                    <label>Record/Play your own attempt (Recording is 5 seconds)</label>
                </div>
                <div className="recording-play-container">
                    <div className="btn" onClick={this.recordAudio}><i className="fa fa-microphone" /></div>
                    <audio ref="audioSource" controls={true} src={this.state.attemptUrl}/>
                </div>

                <div className="btn-container">
                    <div className="btn app-btn" onClick={this.editRecording}>Edit</div>
                    <div className="btn app-btn" onClick={this.reportRecording}>Report</div>
                    <div className="btn app-btn" onClick={this.deleteRecording}>Delete</div>
                </div>
                <div className="warning-label">
                    {warningLabel}
                </div>
                <Modal open={editOpen} onClose={this.onEditClose}>
				<form>
                    <div className="form-group">
						<label>Word</label>
						<input type="text" className="form-control" id="recording-word-input" placeholder="Enter Word" />
						<small className="form-text text-muted">This can be edited again later</small>
					</div>
                    <div className="form-group">
						<label>Syllable division</label>
						<input type="text" className="form-control" id="recording-syllable-input" placeholder="Enter syllables" />
						<small className="form-text text-muted">Syllables can be edited</small>
					</div>
					<div className="form-group">
						<label>Tag</label>
						<input type="text" className="form-control" id="recording-tag-input" placeholder="Enter Tag" />
						<small className="form-text text-muted">Tag is used to search</small>
					</div>
					<button type="button" className="btn" onClick={this.updateRecording}>Save Changes</button>
				</form>
			    </Modal>
                <Modal open={reportOpen} onClose={this.onReportClose}>
                    <div>
                        <label>Report Recording</label>
                    </div>
                    <div>
                        {reportLabel}
                    </div>
                    <div className="btn-toolbar btn-container">
                        <button type="button" className="btn btn1" onClick={this.onReportClose}>No</button>
                        <button type="button" className="btn btn2" onClick={this.updateReport}>Yes</button>
                    </div>
                </Modal>
                <Modal open={deleteOpen} onClose={this.onDeleteClose}>
                    <div>
                        <label>Delete Recording</label>
                    </div>
                        <div>
                            <label>Are you sure you want to delete this recording?</label>
                        </div>
                        <div>
                            <label>Once deleted it can't be recovered.</label>
                        </div>
                    <div className="btn-toolbar btn-container">
                        <button type="button" className="btn btn1" onClick={this.onDeleteClose}>No</button>
                        <button type="button" className="btn btn2" onClick={this.removeRecordingFromDatabase}>Yes</button>
                    </div>
                </Modal>
                <Modal open = {openWarning} onClose={this.onWarningClose}>
                    <div>
                        <label>Authentification Error</label>
                    </div>
                    <div>
                        <label>You must be Authorized to edit and delete Recordings</label>
                    </div>
                </Modal>
            </div>
        );
    }
    
    private updateRecording() {
        const wordInput = document.getElementById("recording-word-input") as HTMLInputElement
        const syllableInput = document.getElementById("recording-syllable-input") as HTMLInputElement
        const tagInput = document.getElementById("recording-tag-input") as HTMLInputElement

        if (wordInput === null || tagInput === null || syllableInput === null) {
			return;
		}

        const databaseRecording = this.props.databaseRecording
        const url = "https://gmce822msaphase2projectapi.azurewebsites.net/api/Recordings/" + databaseRecording.id
        var updatedWord = wordInput.value
        if (wordInput.value === "") {
            updatedWord = databaseRecording.word
        }
        var updatedTag = tagInput.value
        if (tagInput.value === "") {
            updatedTag = databaseRecording.tag
        }
        var updatedSyllables = syllableInput.value
        if (syllableInput.value === "") {
            updatedSyllables = databaseRecording.syllables
        }
		fetch(url, {
			body: JSON.stringify({
                "id": databaseRecording.id,
                "word": updatedWord,
                "tag": updatedTag,
                "syllables": updatedSyllables,
                "uploaded": databaseRecording.uploaded,
                "url": databaseRecording.url,
                "rating": databaseRecording.rating
            }),
			headers: {'cache-control': 'no-cache','Content-Type': 'application/json'},
			method: 'PUT'
		})
        .then((response : any) => {
			if (!response.ok) {
				// Error State
				alert(response.statusText + " " + url)
			} else {
                this.props.fetchRecordings("")
                this.setState({ editOpen: false })
			}
		})
    }

    private updateReport() {

        const databaseRecording = this.props.databaseRecording
        const url = "https://gmce822msaphase2projectapi.azurewebsites.net/api/Recordings/" + databaseRecording.id
        
        var updatedReport = true

        if (databaseRecording.rating === "true") {
            updatedReport = false
        }

		fetch(url, {
			body: JSON.stringify({
                "id": databaseRecording.id,
                "word": databaseRecording.word,
                "tag": databaseRecording.tag,
                "syllables": databaseRecording.syllables,
                "uploaded": databaseRecording.uploaded,
                "url": databaseRecording.url,
                "rating": updatedReport
            }),
			headers: {'cache-control': 'no-cache','Content-Type': 'application/json'},
			method: 'PUT'
		})
        .then((response : any) => {
			if (!response.ok) {
				// Error State
				alert(response.statusText + " " + url)
			} else {
				this.props.fetchRecordings("")
                this.setState({ reportOpen: false })
			}
		  })
    }

    private removeRecordingFromDatabase() {
        const databaseRecording = this.props.databaseRecording
        const url = "https://gmce822msaphase2projectapi.azurewebsites.net/api/Recordings/" + databaseRecording.id

		fetch(url, {
			method: 'DELETE'
		})
        .then((response : any) => {
			if (!response.ok) {
				// Error Response
				alert(response.statusText)
			}
			else {
                this.props.fetchRecordings("")
                this.setState({ deleteOpen: false })
			}
		})
    }

    private recordAudio() {
        const mediaConstraints = {
            audio: true
        }
        const onMediaSuccess = (stream: any) => {
            const mediaRecorder = new MediaStreamRecorder(stream);
            mediaRecorder.mimeType = 'audio/wav'; // check this line for audio/wav
            mediaRecorder.ondataavailable = (blob: any) => {
                this.updateAudio(blob);
                mediaRecorder.stop()
            }
            mediaRecorder.start(5000);
        }
    
        navigator.mediaDevices.getUserMedia(mediaConstraints).then(onMediaSuccess).catch(onMediaError)
    
        function onMediaError(e: any) {
            console.error('media error', e);
        }
    }

    private updateAudio(blob: any) {
        this.setState({ attemptUrl: URL.createObjectURL(blob) })
    }

    private editRecording = () => {
        if (this.props.verifiedUser) {
            this.setState({ editOpen: true });
        } else {
            this.setState({ openWarning: true });
        }
    };

    private onWarningClose = () => {
        this.setState({ openWarning: false });
    }

    private onEditClose = () => {
		this.setState({ editOpen: false });
    };

    private reportRecording = () => {
		this.setState({ reportOpen: true });
    };

    private onReportClose = () => {
		this.setState({ reportOpen: false });
    };

    private deleteRecording = () => {
        if (this.props.verifiedUser) {
            this.setState({ deleteOpen: true });
        } else {
            this.setState({ openWarning: true })
        }
    };

    private onDeleteClose = () => {
		this.setState({ deleteOpen: false });
    };
}