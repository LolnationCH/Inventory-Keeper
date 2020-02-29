import * as React from "react";
import { Button } from "@material-ui/core";

/* ICONS */
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

import { GetButtonBooks, GetButtonOthers, GetButtonBooksSmall, GetButtonOthersSmall } from "./buttons";

type LeftActionBarState = {
  smallVersion: boolean; // Use to alternate between small/large version of drawer
}

export class LeftActionBar extends React.Component<any,LeftActionBarState> {
  constructor(props: any){
    super(props);

    // Setting state
    this.state = {
      smallVersion: true
    }
  }

  // Function to provide the buttons for the drawer
  _buttons = () => {
    if (this.state.smallVersion)
      return (
        <div>
          {GetButtonBooks()}
          {GetButtonOthers()}
        </div>
      );
    else
      return (
        <div>
          {GetButtonBooksSmall()}
          {GetButtonOthersSmall()}
        </div>
      );
  }

  render() {
    return (
      <div>
        <Button 
          style={{color:"white", backgroundColor:"rgb(33, 35, 37)"}}
          fullWidth={true}
          variant="contained"
          onClick={() => {this.setState({smallVersion:!this.state.smallVersion})}}>
            {this.state.smallVersion? <ArrowBackIosIcon/> : <ArrowForwardIosIcon/>}
        </Button>
        <p/>
        {this._buttons()}
      </div>
    );
  }
}