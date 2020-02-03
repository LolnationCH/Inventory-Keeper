import * as React from "react";
import './divider.css';

export function Divider(text:string): JSX.Element {
  return (
    <div>
      <p/>
      <div className="separator">{text}</div>
      <p/>
    </div>
  )
}