import * as React from "react";
import { TextField, Button } from "@material-ui/core";
import { getUrlServer } from "../queries/BookQuery";
import SaveIcon from '@material-ui/icons/Save';
import { toast } from "react-toastify";

const SettingPageStyle = {
  style: {
    marginLeft: "10px"
  }
}

export class SettingsPage extends React.Component<any, any> {
  constructor(props: any) {
    super(props)

    this.state = {
      serverUrl: getUrlServer()
    }
    this._handleTextFieldChange = this._handleTextFieldChange.bind(this);
    this._saveSettings = this._saveSettings.bind(this);
  }

  _handleTextFieldChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({[e.target.id]: e.target.value});
  }

  _saveSettings() {
    localStorage.setItem('serverUrl', this.state.serverUrl);
    toast("Settings saved!");
  }

  render() {
    return (
      <div {...SettingPageStyle}>
        <h1>Settings</h1>
        <TextField 
          onChange={this._handleTextFieldChange}
          fullWidth={true}
          id="serverUrl"
          label="Server Url"
          value={this.state.serverUrl}
        />
        <hr/>
        <Button 
          variant={"contained"}
          fullWidth={true} 
          color="secondary"
          onClick={this._saveSettings}
        >
          <SaveIcon />
          &nbsp;Save
        </Button>
      </div>
    )
  }
}