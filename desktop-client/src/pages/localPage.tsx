import * as React from "react";
import FileDrop from 'react-file-drop';
import { Button } from '@material-ui/core';
import { GetBooksData, SendBooksData } from '../queries/BookQuery';
import { Book } from '../data/book';

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

const DropZoneStyle = {
  style : {
    marginTop:"10px",
    border: '1px solid black',
    color: 'black',
    padding: 50
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
      return "Drop the exported data here";
    return "File uploaded : " + this.state.fileUpload;
  }

  _handleDrop(files: FileList | null, event:any) {
    if (!files || files.length === 0 || files.length > 1)
      return;
    console.log(files, event);
    
    var reader = new FileReader();
    reader.onload = (event) => {
      this.setState({
        fileContent: JSON.stringify(reader.result)
      })
    };

    var file = files[0];
    if (file.type !== "application/json") {
      alert("Cannot import data from file other than json");
      return;
    }
    
    this.setState({
      fileUpload: file.name
    })

    reader.readAsText(file);
  }

  _downloadFile() {
    GetBooksData().then( (Data:Array<Book>) => {
      fileDownload(JSON.stringify(Data), 'InventoryKeeper_Data.json');
    });
  }

  _uploadFile() {
    //SendBooksData(JSON.parse(this.state.fileContent));
  }

  render() {
    return (
      <div>
        <Button {...DownloadButtonStyle} variant="contained" onClick={this._downloadFile}>Export : Download to the pc</Button>
        <hr/>
        <div {...DropZoneStyle}>
          <FileDrop onDrop={this._handleDrop}>
            {this._dropZoneText()}
          </FileDrop>
        </div>
        <Button {...UploadButtonStyle} variant="contained" onClick={this._uploadFile}>Import : Upload from the pc</Button>
      </div>
    );
  }
}