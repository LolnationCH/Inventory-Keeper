import * as React from "react";
import "./homePage.css"

// @ts-ignore
import { Offline, Online } from "react-detect-offline";
import { TestConnection, getUrlServer, GetBooksData } from "../queries/BookQuery";
import { Button, Grid, Tooltip } from "@material-ui/core";
import { Book } from "../data/book";
import { Link } from "react-router-dom";

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
      serverConnectionStatus: this._getNoConnectionStatusDiv("Server Connection"),
      Books: []
    }

    this._serverConnectionStatus = this._serverConnectionStatus.bind(this);
    this._internetConnectionStatus = this._internetConnectionStatus.bind(this);
    this.GridLatestModifiedBooks = this.GridLatestModifiedBooks.bind(this);
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
    TestConnection(getUrlServer() + "/api").then( () => {
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

    GetBooksData().then( (Data:any) => {
      this.setState({
        Books: Data.reverse()
      })
    });
  }

  GridLatestModifiedBooks() {
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
                    <Button component={Link} to={"/books/" + item.identifier.identifier}>
                      <img className="BookCover" src={item.thumbnail} alt={item.title}/>
                    </Button>
                  </Grid>
                )
            })}
            <Grid>
              <Tooltip title="See more items" arrow>
                <Button component={Link} to={"/catalog"}>
                  <img className="BookCover" src="https://i.imgur.com/QWa1CA7.png" alt="More items"/>
                </Button>
              </Tooltip>
            </Grid>
        </Grid>
      </div>
    )
  }

  render(){
    return (
      //<div className="homePageDiv">
      <div>
        <h1>Inventory Keeper</h1>
        <div>
          {this._internetConnectionStatus()}
          <p/>
          {this.state.serverConnectionStatus}
          <p/>
        </div>
        <hr/>
        {this.GridLatestModifiedBooks()}
      </div>
    );
  }
}