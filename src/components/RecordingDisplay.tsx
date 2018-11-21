import * as React from "react";

interface IProps {
    databaseRecording: any,
    personalRecording: any
}

interface IState {
    open: boolean
    personalExists: boolean
}

export default class RecordingDisplay extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props)
        this.state = {
            open: false,
            personalExists: false
        }
    }

    public render() {
        const databaseRecording = this.props.databaseRecording
        return(
            <div className="container recording-wrapper">
                <div className="row recording-heading">
                    <b>{databaseRecording.Word}</b>&nbsp; {databaseRecording.Tag}
                </div>
                <div className="row recording-date">
                    {databaseRecording.Uploaded}
                </div>
                <div className="row recording-audio">
                    <div className="btn app-btn" onClick={this.playDatabaseRecording}>Play</div>
                </div>
                <div className="row record-button-row">
                    <div className="btn app-btn" onClick={this.recordAttempt}>Record</div>
                </div>
                <div className="row personal-recording-audio">
                    <div className="btn app-btn" onClick={this.playPersonalRecording}>Play Your Attempt</div>
                </div>

                <div className="btn-container">
                    <div className="btn app-btn" onClick={this.editRecording}>Edit</div>
                    <div className="btn app-btn" onClick={this.rateRecording}>Report</div>
                    <div className="btn app-btn" onClick={this.deleteRecording}>Delete</div>
                </div>
            </div>
        );
    }

    private playDatabaseRecording() {
        
    }

    private recordAttempt() {

    }

    private playPersonalRecording() {

    }

    private editRecording() {

    }

    private rateRecording() {

    }

    private deleteRecording() {

    }
}