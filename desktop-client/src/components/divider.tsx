import * as React from "react";
import './divider.css';

// Custom made "hr" because the default one isn't that good

export function Divider(text:string): JSX.Element {
  return (
    <div>
      <p/>
      <div className="separator">{text}</div>
      <p/>
    </div>
  )
}