import * as React from "react";
import "./homePage.css"

// @ts-ignore
import { Offline, Online } from "react-detect-offline";
import { TestConnection, getUrlServer } from "../queries/BookQuery";

const homePageInfoStyleGreen = {
  style: {
    marginLeft:'30px',
    border: '1px solid green',
    color: 'black',
    padding: '10px'
  }
}

const homePageInfoStyleRed = {
  style: {
    marginLeft:'30px',
    border: '1px solid red',
    color: 'black',
    padding: '10px'
  }
}

export class HomePage extends React.Component<any, any>{

  constructor(props:any) {
    super(props);
    this.state = {
      serverConnectionStatus: this._getNoConnectionStatusDiv("Server Connection")
    }

    this._serverConnectionStatus = this._serverConnectionStatus.bind(this);
    this._internetConnectionStatus = this._internetConnectionStatus.bind(this);
  }

  _getNoConnectionStatusDiv(text: string) {
    return (
      <div className="homePageInfoDiv" {...homePageInfoStyleRed}>
            {text} :&nbsp;
            <span role="img" aria-label="cross-mark">❌</span>
      </div>
    )
  }
  _getOkConnectionStatusDiv(text: string) {
    return (
      <div className="homePageInfoDiv" {...homePageInfoStyleGreen}>
            {text} :&nbsp;
            <span role="img" aria-label="check-mark">✔️</span>
      </div>
    )
  }

  _internetConnectionStatus() {
    return (
      <div>
        <Offline>
          {this._getNoConnectionStatusDiv("Internet connection")}
        </Offline>
        <Online>
          {this._getOkConnectionStatusDiv("Internet connection")}
        </Online>
      </div>
    )
  }
  _serverConnectionStatus(): any{
    TestConnection(getUrlServer()).then( () => {
      this.setState({
        serverConnectionStatus: this._getOkConnectionStatusDiv("Server Connection")
      })
    })
    .catch( () => {
      this.setState({
        serverConnectionStatus: this._getNoConnectionStatusDiv("Server Connection")
      })
    });
  }

  componentDidMount() {
    this._serverConnectionStatus();
  }

  render(){
    return (
      <div className="homePageDiv">
        <h1>Inventory Keeper</h1>
        {this._internetConnectionStatus()}
        <p/>
        {this.state.serverConnectionStatus}
      </div>
    );
  }
}