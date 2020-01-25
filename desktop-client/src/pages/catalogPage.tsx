import { GetBookData } from "../queries/BookQuery";

import * as React from "react";
import { GridList, GridListTile, Button } from "@material-ui/core";
import { Link } from "react-router-dom";

export class CatalogPage extends React.Component{
  render(){
    const Data = GetBookData();
    return (
      <GridList cellHeight={182} spacing={10} cols={10}>
        {Data.map( function(item: any){
          return (
            <GridListTile key={item.identifier.identifier}>
              <Button component={Link} to={"/books/" + item.identifier.identifier}>
                <img src={item.thumbnail} alt={item.title}/>
              </Button>
            </GridListTile>
          )
        })}
      </GridList>
    )
  }
}