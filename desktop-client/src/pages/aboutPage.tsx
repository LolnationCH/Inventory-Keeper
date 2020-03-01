import { Component } from 'react';
import * as React from "react";

/* ICONS */
import logo from '../icon.svg';

export class AboutPage extends Component{
  render(){
    return (
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Inventory Keeper</p>
        <p>Made by LolnationCH</p>
        <p>Check out the mobile application!</p>
        <a style={{color:"#c6c6c6"}} href="https://github.com/LolnationCH/Inventory-Keeper">Link to the github repo</a>
      </header>
    )
  }
}