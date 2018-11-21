import * as React from "react";

interface IProps {
    databaseList: any[],
    recentlySearchedList: any[]
}

export default class DatabaseSearch extends React.Component<IProps, {}> {
    constructor(props: any) {
        super(props)
    }

    public render() {
        return(
            <div className="container search-wrapper">
                <div className="search-heading">
                    Search for the Word you want to practice
                </div>
                <div className="row search-btn-container">
                    <div className="btn app-btn" onClick={this.viewDatabase}> View Database </div>
                    <div className="btn app-btn" onClick={this.addToDatabase}> Add To Database </div>
                </div>
                <div className="search-container">
                    <input type="text" id="search-textbox" className="search-bar" placeholder="Search For a Word" />
                    <div className="search-container-divider">
                        <div className="btn search-button" onClick = {this.searchForWord}>Search</div>
                    </div>
                </div>
                <div className="search-table">
                    <table className="table searches">
                        <tbody>
                            {this.createTable()}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    private viewDatabase() {
        
    }

    private addToDatabase() {

    }

    private searchForWord() {

    }

    private createTable() {
        const table:any[] = []
        return table
    }
}