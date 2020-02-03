import * as React from "react";
import FileDrop from 'react-file-drop';
import { Button } from '@material-ui/core';
import { GetBooksData, SendBooksData } from '../queries/BookQuery';
import { Book } from '../data/book';

import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { Divider } from "../components/divider";

var fileDownload = require('js-file-download');

const DownloadButtonStyle = {
  style : {
    paddingBottom:"20px",
    paddingTop:"15px"
  },
  fullWidth: true,
}

const UploadButtonStyle = {
  style : {
    marginTop:"10px",
    paddingBottom:"20px",
    paddingTop:"15px"
  },
  fullWidth: true,
}

const DropZoneDivStyle = {
  style : {
    marginTop:"10px",
    border: '1px solid black',
    color: 'black'
  }
};

const DropZoneStyle = {
  style : {
    fontSize: "20px",
    padding: "50px"
  }
};

export class LocalPage extends React.Component<any,any> {

  constructor(props: any) {
    super(props);
    this.state = {
      fileUpload: "",
      fileContent: ""
    }

    this._handleDrop = this._handleDrop.bind(this);
    this._uploadFile = this._uploadFile.bind(this);
  }

  _dropZoneText() {
    if (this.state.fileUpload === "")
      return (<div {...DropZoneStyle}>Drop the exported data here</div>);
    return (
      <div {...DropZoneStyle}>
        {"File uploaded : " + this.state.fileUpload}
        <Button onClick={() => this.setState({fileUpload: "", fileContent:""})}><HighlightOffIcon style={{color:"indianred"}}/></Button>
      </div>
    );
  }

  _readFileContent(file: File){
    var reader = new FileReader();
    reader.onload = (event) => {
      this.setState({
        fileContent: reader.result
      })
    };
    
    this.setState({
      fileUpload: file.name
    })

    reader.readAsText(file);
  }

  _handleDrop(files: FileList | null, event:any) {
    if (!files || files.length === 0)
      return;

    var file = null;
    for (let i =0; i< files.length; i++){
      if(files[i].type === "application/json")
        file = files[0]
    }
    
    if (file === null) {
      alert("Cannot import data from file other than json");
      return;
    }
    
    this._readFileContent(file);
  }

  _downloadFile() {
    GetBooksData().then( (Data:Array<Book>) => {
      fileDownload(JSON.stringify(Data), 'InventoryKeeper_Data.json');
    });
  }

  _uploadFile() {
    if (this.state.fileContent !== "")
      SendBooksData(JSON.parse(this.state.fileContent), "Data imported!");
    else
      alert("You have to specify a file to import first");
  }

  render() {
    return (
      <div>
        <Button {...DownloadButtonStyle} variant="contained" onClick={this._downloadFile}>Export : Download to the pc</Button>
        {Divider("OR")}
        <div {...DropZoneDivStyle}>
          <FileDrop  {...DropZoneStyle} onDrop={this._handleDrop}>
            {this._dropZoneText()}
          </FileDrop>
        </div>
        <Button {...UploadButtonStyle} variant="contained" onClick={this._uploadFile}>Import : Upload from the pc</Button>
      </div>
    );
  }
}