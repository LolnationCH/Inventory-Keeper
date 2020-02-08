import { GetBooksData } from "../queries/BookQuery";

import * as React from "react";
import SearchBar from 'material-ui-search-bar'

import { Book } from "../data/book";
import { GetBooksGridList, DivErrorServer } from "./catalogFunctions";

type CatalogPageSate = {
  searchValue: string;
  bookGrid: JSX.Element;
}

export class CatalogPage extends React.Component<any, CatalogPageSate>{

  constructor(props: any) {
    super(props);
    this.state = {
      searchValue: "",
      bookGrid: <div/>,
    };
  }

  _refresh(){
    this.GetBooksGrid().then((element: JSX.Element) => {
      this.setState({
        bookGrid: element
      })
    }).catch( (err) => {
      this.setState({
        bookGrid: DivErrorServer()
      })
    });
  }

  GetBooksToShow() : Promise<Array<Book>> {
    return GetBooksData().then( (Data:any) => {
      const searchQuery = this.state.searchValue.toLowerCase();
      if (searchQuery === "")
        return Data;
      
      // Filter the books, replace with a fuzzy search?
      return Data.filter( (item: Book) => {
        return item.title?.toLowerCase().includes(searchQuery);
      });
    });
  }

  GetBooksGrid() {
    return this.GetBooksToShow().then((Data: Array<Book>) => {
      return GetBooksGridList(Data);
    })
  }

  GetSearchBar() {
    return (
      <SearchBar
          value={this.state.searchValue}
          onChange={(value) => { this.setState({searchValue: value}); this._refresh(); }}
          onCancelSearch={() => { this.setState({searchValue: ""}); this._refresh();}}
      />
    )
  }

  componentDidMount() {
    this._refresh();
  }

  render(){
    return (
      <div>
        {this.GetSearchBar()}
        <p/>
        {this.state.bookGrid}
      </div>
    )
  }
}