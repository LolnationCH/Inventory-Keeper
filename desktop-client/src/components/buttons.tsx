import * as React from "react";

import { Link } from "react-router-dom";

/* ICONS */
import HomeIcon from '@material-ui/icons/Home';
import AddIcon from '@material-ui/icons/Add';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
// import SyncIcon from '@material-ui/icons/Sync';
import ImportExportIcon from '@material-ui/icons/ImportExport';

import SettingsIcon from '@material-ui/icons/Settings';
import InfoIcon from '@material-ui/icons/Info';
import { Button } from "@material-ui/core";

// Declare drawer items info
export const ItemsBooks = [
  {text: "Home", icon: <HomeIcon/>,       page: ""},
  {text: "Add Book", icon: <AddIcon/>,         page: "/books"},
  {text: "Catalog", icon: <LibraryBooksIcon/>, page: "/catalog"}
]

const ItemsOthers = [
  {text: "Import/Export", icon: <ImportExportIcon />,  page: "/local"},
  {text: "Settings", icon: <SettingsIcon/>,   page: "/settings"},
  {text: "About"   , icon: <InfoIcon/>,       page: "/about"}
]

function GetIconButton(text: String, icon: JSX.Element, page: string) {
  return (
    <Button
      fullWidth={true}
      variant="contained"
      startIcon={icon}
      component={Link}
      to={page}>
      {text}
    </Button>
  )
}

function GetIconButtonSmall(icon: JSX.Element, page: string) {
  return (
    <Button
      variant="contained"
      startIcon={icon}
      component={Link}
      to={page}>
      <div/>
    </Button>
  )
}

export function GetButtonBooks() {
  return (
    <div>
    {ItemsBooks.map(function(item){
      return (
        <div key={item.text}>
          {GetIconButton(item.text, item.icon, item.page)}
          <p/>
        </div>
      );
    })}
    </div>
  )
}

export function GetButtonOthers() {
  return (
    <div>
    {ItemsOthers.map(function(item){
      return (
        <div key={item.text}>
          {GetIconButton(item.text, item.icon, item.page)}
          <p/>
        </div>
      );
    })}
    </div>
  )
}

export function GetButtonBooksSmall() {
  return (
    <div>
    {ItemsBooks.map(function(item){
      return (
        <div key={item.text}>
          {GetIconButtonSmall(item.icon, item.page)}
          <p/>
        </div>
      );
    })}
    </div>
  )
}

export function GetButtonOthersSmall() {
  return (
    <div>
    {ItemsOthers.map(function(item){
      return (
        <div key={item.text}>
          {GetIconButtonSmall(item.icon, item.page)}
          <p/>
        </div>
      );
    })}
    </div>
  )
}