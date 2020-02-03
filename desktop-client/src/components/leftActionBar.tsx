import * as React from "react";

import { GetButtonBooks, GetButtonAbout } from "./buttons";

export class LeftActionBar extends React.Component {
  render() {
    return (
      <div>
        {GetButtonBooks()}
        {GetButtonAbout()}
      </div>
    );
  }
}