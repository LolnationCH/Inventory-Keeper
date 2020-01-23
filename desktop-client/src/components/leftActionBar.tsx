import * as React from "react";

import { GetButtonBooks, GetButtonData, GetButtonAbout } from "./buttons";

export class LeftActionBar extends React.Component {
  render() {
    return (
      <div>
        {GetButtonBooks()}
        {GetButtonData()}
        {GetButtonAbout()}
      </div>
    );
  }
}