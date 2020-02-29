import * as React from "react";
import { TextField, Button } from "@material-ui/core";
import { toast } from "react-toastify";

/* ICONS */
import SaveIcon from '@material-ui/icons/Save';

/* QUERIES */
import { getUrlServer } from "../queries/BookQuery";

const SettingPageStyle = {
  style: {
    marginLeft: "10px"
  }
}

// We probably could use a type for the state, but couln't find the right type
// for the serverUrl without break _saveSettings.
export class SettingsPage extends React.Component<any, any> {
  constructor(props: any) {
    super(props)

    // Set state
    this.state = {
      serverUrl: getUrlServer()
    }
  }

  _handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({[e.target.id]: e.target.value});
  }

  _saveSettings = () => {
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
        <p/>
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