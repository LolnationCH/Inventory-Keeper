import * as React from "react";
import "./homePage.css"

import { Button, Grid, Tooltip } from "@material-ui/core";
import { Link } from "react-router-dom";

/* QUERIES */
import { TestConnection, getUrlServer, GetBooksData } from "../queries/BookQuery";

/* DATA STRUCTURE */
import { Book } from '../data/book';

// @ts-ignore
// We need ts-ignore for the react-detect-offline lib
import { Offline, Online } from "react-detect-offline";


// Styles
const homePageInfoStyleGreen = {
  style: {
    marginLeft:'30px',
    border: '1px solid green',
    color: 'black',
    padding: '10px'
  }
};
const homePageInfoStyleRed = {
  style: {
    marginLeft:'30px',
    border: '1px solid red',
    color: 'black',
    padding: '10px'
  }
}

type HomePageState = {
  ServerConnectionStatus: JSX.Element;
  Books: Array<Book>;
}

export class HomePage extends React.Component<any, HomePageState>{

  constructor(props:any) {
    super(props);

    // Set state
    this.state = {
      ServerConnectionStatus: this._getNoConnectionStatusDiv("Server Connection"),
      Books: []
    }
  }

  // Internet Connection Status Div
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

  _internetConnectionStatus = () => {
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
  _serverConnectionStatus = () => {
    TestConnection(getUrlServer() + "/api").then( () => {
      this.setState({
        ServerConnectionStatus: this._getOkConnectionStatusDiv("Server Connection")
      })
    })
    .catch( () => {
      this.setState({
        ServerConnectionStatus: this._getNoConnectionStatusDiv("Server Connection")
      })
    });
  }

  componentDidMount() {
    this._serverConnectionStatus();

    GetBooksData()
    .then( (Data:any) => {
      this.setState({
        Books: Data.reverse()
      })
    })
    .catch(() => {});
  }

  GridLatestModifiedBooks = () => {
    return (
      <div>
        <Grid container>
          <Grid item xs>
            <h2>Lastest Modified or Added books : </h2>
          </Grid>
        </Grid>
        <Grid container>
          {this.state.Books.splice(0, 8).map( function(item: Book){
              return (
                <Grid key={item.id}>
                  <Tooltip title={item.title} arrow>
                    <Button component={Link} to={"/books/" + item.identifier.identifier}>
                      <img className="BookCover" src={item.thumbnail} alt={item.title}/>
                    </Button>
                  </Tooltip>
                </Grid>
              )
          })}
          <Grid>
            <Tooltip title="See more books" arrow>
              <Button component={Link} to={"/catalog"}>
                <img className="BookCover" src="https://i.imgur.com/MEHX8c8.png" alt="More items"/>
              </Button>
            </Tooltip>
          </Grid>
        </Grid>
      </div>
    )
  }

  render(){
    return (
      <div className="homePageDiv">
        <h1>Inventory Keeper</h1>
        <div>
          {this._internetConnectionStatus()}
          <p/>
          {this.state.ServerConnectionStatus}
          <p/>
        </div>
        <hr/>
        {this.GridLatestModifiedBooks()}
      </div>
    );
  }
}