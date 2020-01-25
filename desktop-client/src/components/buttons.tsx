import * as React from "react";

import { Link } from "react-router-dom";

/* ICONS */
import HomeIcon from '@material-ui/icons/Home';
import AddIcon from '@material-ui/icons/Add';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import GetAppIcon from '@material-ui/icons/GetApp';
import PublishIcon from '@material-ui/icons/Publish';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import InfoIcon from '@material-ui/icons/Info';
import { Button } from "@material-ui/core";

// Declare drawer items info
export const ItemsBooks = [
  {text: "Home", icon: <HomeIcon/>,       page: ""},
  {text: "Add", icon: <AddIcon/>,       page: "/books"},
  {text: "Catalog", icon: <LibraryBooksIcon/>, page: "/catalog"}
]

const ItemsData = [
  {text: "Server download", icon: <CloudDownloadIcon/>, page: "/server"},
  {text: "Server upload", icon: <CloudUploadIcon />,    page: "/server"},
  {text: "Export to file", icon: <PublishIcon />,       page: "/local"},
  {text: "Import from file", icon: <GetAppIcon/>,       page: "/local"},
  {text: "Delete", icon: <DeleteForeverIcon />,         page: "/deleteEverything"}
]

const ItemsAbout = [
  {text: "About", icon: <InfoIcon/>,       page: "/about"}
]

function GetLinkComponent(page: String, ref:any, props: any ){
  return (
    <Link to={page} {...props} />
  );
}

export function GetIconButton(text: String, icon: JSX.Element, page: String) {
  return (
    <Button
      fullWidth={true}
      variant="contained"
      startIcon={icon}
      component={props => GetLinkComponent(page, null, props)}>
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