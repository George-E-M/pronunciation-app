import * as React from "react";
import Modal from 'react-responsive-modal';

interface IProps {
    databaseList: any[],
    selectNewRecording: any
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
    }

    public render() {
        const {open} = this.state 
        return(
            <div className="container search-wrapper">
                <div className="search-heading">
                    Search for the Word you want to practice
                </div>
                <div className="search-container">
                    <input type="text" id="search-textbox" className="search-bar" placeholder=" Search For a Word" />
                    <div className="search-container-divider">
                        <div className="btn search-btn" onClick = {this.searchForWord}>Search</div>
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

    private searchForWord() {

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
				location.reload()
			}
		  })
	}
}