import { GetBooksData } from "../queries/BookQuery";

import * as React from "react";
import { GridList, GridListTile, Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import SearchBar from 'material-ui-search-bar'

import { Book } from "../data/book";

type CatalogPageSate = {searchValue: string}

export class CatalogPage extends React.Component<any, CatalogPageSate>{

  constructor(props: any) {
    super(props);
    this.state = {
      searchValue: ""
    };
  }

  GetBooksToShow() : Array<Book> {
    const Data:Array<Book> = GetBooksData();
    const searchQuery = this.state.searchValue.toLowerCase();
    if (searchQuery === "")
      return Data;
    
    return Data.filter(function (item){
      return item.title?.toLowerCase().includes(searchQuery);
    });
  }

  GetBooksGridList() {
    const Data = this.GetBooksToShow();
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

  GetSearchBar() {
    return (
      <SearchBar
          value={this.state.searchValue}
          onChange={(value) => this.setState({searchValue: value})}
          onCancelSearch={() => this.setState({searchValue: ""})}
      />
    )
  }

  render(){
    return (
      <div>
        {this.GetSearchBar()}
        <p/>
        {this.GetBooksGridList()}
      </div>
    )
  }
}