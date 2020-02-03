import * as React from "react";

import { GetButtonBooks, GetButtonOthers, GetButtonBooksSmall, GetButtonOthersSmall } from "./buttons";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { Button } from "@material-ui/core";

export class LeftActionBar extends React.Component<any,any> {
  constructor(props: any){
    super(props);
    this.state = {
      smallVersion: true
    }
    this._buttons = this._buttons.bind(this);
  }

  _buttons(){
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