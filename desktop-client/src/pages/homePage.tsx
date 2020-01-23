import { Component } from 'react';
import * as React from "react";
import CssBaseline from "@material-ui/core/CssBaseline/CssBaseline";

import Button from '@material-ui/core/Button';

import { Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';

const buttonStyle = {width: '100%', height: '100px', color: 'white'};

const ManuelAddButtonStyle  = {...buttonStyle, ...{ backgroundColor: '#FF9800' }}
const CatalogButtonStyle    = {...buttonStyle, ...{ backgroundColor: '#2196F3' }}
const IsbnAddButtonStyle    = {...buttonStyle, ...{ backgroundColor: '#4CAF50' }}
const ServerSyncButtonStyle = {...buttonStyle, ...{ backgroundColor: '#00BCD4' }}

export class HomePage extends Component<any, any>{
  constructor (props: any) {
    super(props);
    this.state = {
      drawerOpen : false,
    }
  }

  handleDrawerOpen = () => {
    this.setState({drawerOpen : true});
  }
  handleDrawerClose = () => {
    this.setState({drawerOpen : false});
  }

  render(){
    return (
      <div>
        <CssBaseline/>
        <div style = {{flexGrow: 1, margin: '1%'}}>
          <Grid container spacing={3}>
            <Grid item xs>
              <Button style={IsbnAddButtonStyle} variant="contained" component={Link} to={"/manualAdd"}>Add with isbn</Button>
            </Grid>
            <Grid item xs>
              <Button style={CatalogButtonStyle} variant="contained" component={Link} to={"/catalog"}>Catalog</Button>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs>
              <Button style={ManuelAddButtonStyle} variant="contained" component={Link} to={"/manualAdd"}>Add a book</Button>
            </Grid>
            <Grid item xs>
              <Button style={ServerSyncButtonStyle} variant="contained" component={Link} to={"/server"}>Sync with server</Button>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}