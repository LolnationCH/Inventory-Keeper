import * as React from "react";
import FileDrop from 'react-file-drop';
import { Button } from '@material-ui/core';

/* ICONS */
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

/* QUERIES */
import { GetBooksData, SendBooksData } from '../queries/BookQuery';

/* DATA STRUCTURE */
import { Book } from '../data/book';

/* COMPONENTS */
import { Divider } from "../components/divider";

// Import first...
var fileDownload = require('js-file-download');

// Button style
const DownloadButtonStyle = {
  style : {
    paddingBottom:"20px",
    paddingTop:"15px",
    color:"white",
    backgroundColor:"rgb(33, 35, 37)",
  },
  fullWidth: true,
};
const UploadButtonStyle = {
  style : {
    marginTop:"10px",
    paddingBottom:"20px",
    paddingTop:"15px",
    color:"white",
    backgroundColor:"rgb(33, 35, 37)",
  },
  fullWidth: true,
};

// Drop Zone Style
const DropZoneDivStyle = {
  style : {
    marginTop:"10px",
    border: '1px solid white',
    color: 'white'
  }
};
const DropZoneStyle = {
  style : {
    fontSize: "20px",
    padding: "50px"
  }
};


type LocalPageState = {
  fileUpload:string;
  fileContent:string | ArrayBuffer | null;
}

export class LocalPage extends React.Component<any,LocalPageState> {

  constructor(props: any) {
    super(props);

    // Set state
    this.state = {
      fileUpload: "",
      fileContent: ""
    };
  }

  // Set the Drop Zone info
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

  // Sets the fileUpload and fileContent state.
  // This reads the file at upload.
  _readFileContent = (file: File) => {
    var reader = new FileReader();
    reader.onload = () => {
      this.setState({
        fileContent: reader.result
      })
    };
    
    this.setState({
      fileUpload: file.name
    })

    reader.readAsText(file);
  }

  // Handle the file drop.
  _handleDrop = (files: FileList | null, event:any) => {
    if (!files || files.length === 0)
      return;

    // Read all the files drop.
    // Take the first file that is json
    var file = null;
    for (let i =0; i< files.length; i++){
      if(files[i].type === "application/json"){
        file = files[i];
        break;
      }
    }
    
    // If no json file was found, simply alert the user that it can only read json file
    if (file === null) {
      alert("Cannot import data from file other than json");
      return;
    }
    
    this._readFileContent(file);
  }

  // Action to download the file
  _downloadFile() {
    GetBooksData()
    .then( (Data:Array<Book>) => {
      fileDownload(JSON.stringify(Data), 'InventoryKeeper_Data.json');
    })
    .catch(()=>{
      alert("Connexion to the server failed. Make sure that the server is runnning and that your are connected to the internet.");
    });
  }

  // Action to upload the file
  _uploadFile = () => {
    if (this.state.fileContent !== "") {
      if (this.state.fileContent !== null)
        SendBooksData(JSON.parse(this.state.fileContent as string), "Data imported!");
    }
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