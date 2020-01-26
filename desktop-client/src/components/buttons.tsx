import * as React from "react";

import { Link } from "react-router-dom";

/* ICONS */
import HomeIcon from '@material-ui/icons/Home';
import AddIcon from '@material-ui/icons/Add';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import SyncIcon from '@material-ui/icons/Sync';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import InfoIcon from '@material-ui/icons/Info';
import { Button } from "@material-ui/core";

// Declare drawer items info
export const ItemsBooks = [
  {text: "Home", icon: <HomeIcon/>,       page: ""},
  {text: "Add Book", icon: <AddIcon/>,         page: "/books"},
  {text: "Catalog", icon: <LibraryBooksIcon/>, page: "/catalog"}
]

const ItemsData = [
  {text: "Server Sync", icon: <SyncIcon/>,     page: "/server"},
  {text: "Local Import/Export", icon: <ImportExportIcon />,  page: "/local"},
  {text: "Delete Catalog", icon: <DeleteForeverIcon />,         page: "/deleteEverything"}
]

const ItemsAbout = [
  {text: "About", icon: <InfoIcon/>,       page: "/about"}
]

export function GetIconButton(text: String, icon: JSX.Element, page: string) {
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

export function GetButtonData() {
  return (
    <div>
    {ItemsData.map(function(item){
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

export function GetButtonAbout() {
  return (
    <div>
    {ItemsAbout.map(function(item){
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