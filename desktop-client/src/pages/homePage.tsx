import { Component } from 'react';
import * as React from "react";
import CssBaseline from "@material-ui/core/CssBaseline/CssBaseline";

import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';

import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';

import MenuIcon from '@material-ui/icons/Menu';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import {GetListItemBooks, GetListItemData, GetListItemAbout} from '../components/drawerList';
import { Grid } from '@material-ui/core';

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
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={this.handleDrawerOpen}
          edge="start"
          style={{ margin: '1px'}}
        >
          <MenuIcon />
        </IconButton>
        <Drawer 
          variant="persistent"
          anchor="left"
          open={this.state.drawerOpen}
          >
          <div>
            <IconButton onClick={this.handleDrawerClose}>
              <ChevronRightIcon/>
            </IconButton>
          </div>
          <Divider />
          <GetListItemBooks/>
          <Divider/>
          <Typography variant="subtitle1" noWrap>
            Data management
          </Typography>
          <GetListItemData/>
          <Divider/>
          <Typography variant="subtitle1" noWrap>
            App info
          </Typography>
          <GetListItemAbout/>
        </Drawer>
        <div style = {{flexGrow: 1, margin: '1%'}}>
          <Grid container spacing={3}>
            <Grid item xs>
              <Button style={IsbnAddButtonStyle} variant="contained">Add with isbn</Button>
            </Grid>
            <Grid item xs>
              <Button style={CatalogButtonStyle} variant="contained">Catalog</Button>
            </Grid>
            <Grid item xs>
              <Button style={ManuelAddButtonStyle} variant="contained">Add a book</Button>
            </Grid>
            <Grid item xs>
              <Button style={ServerSyncButtonStyle} variant="contained">Sync with server</Button>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}