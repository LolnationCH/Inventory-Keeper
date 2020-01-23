import { Component } from 'react';
import * as React from "react";
import logo from '../icon.svg';

export class AboutPage extends Component{
  render(){
    return (
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Inventory Keeper
        </p>
        <p>
          Made by LolnationCH
        </p>

        <p>
          Check out the mobile application!
        </p>
      </header>
    )
  }
}