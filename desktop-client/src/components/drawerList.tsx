import * as React from "react";

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { Link } from "react-router-dom";

/* ICONS */
import AddIcon from '@material-ui/icons/Add';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import GetAppIcon from '@material-ui/icons/GetApp';
import PublishIcon from '@material-ui/icons/Publish';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import InfoIcon from '@material-ui/icons/Info';

// Declare drawer items info
const ItemsBooks = [
  {text: "Manual Add", icon: <AddIcon/>,       page: "manualAdd"},
  {text: "Catalog", icon: <LibraryBooksIcon/>, page: "catalog"}
]

const ItemsData = [
  {text: "Server download", icon: <CloudDownloadIcon/>, page: "server"},
  {text: "Server upload", icon: <CloudUploadIcon />,    page: "server"},
  {text: "Export to file", icon: <PublishIcon />,       page: "local"},
  {text: "Import from file", icon: <GetAppIcon/>,       page: "local"},
  {text: "Delete", icon: <DeleteForeverIcon />,         page: "deleteEverything"}
]

const ItemsAbout = [
  {text: "About", icon: <InfoIcon/>,       page: "about"}
]

function GetLinkComponent(page: String, props: any ){
  return (
    <Link to={page} {...props} />
  );
}

function GetListItem(text: string, icon : JSX.Element, page: String) {
  return (
    <ListItem button key={text} component={props => GetLinkComponent(page, props)}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={text} />
    </ListItem>
  );
}

export function GetListItemBooks() {
  return (
    <List>
    {ItemsBooks.map(function(item){
      return GetListItem(item.text, item.icon, item.page);
    })}
    </List>
  )
}

export function GetListItemData() {
  return (
    <List>
      {ItemsData.map(function(item){
        return GetListItem(item.text, item.icon, item.page);
      })}
    </List>
  )
}

export function GetListItemAbout() {
  return (
    <List>
      {ItemsAbout.map(function(item){
        return GetListItem(item.text, item.icon, item.page);
      })}
    </List>
  )
}