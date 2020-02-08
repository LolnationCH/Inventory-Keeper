import { GetBooksData } from "../queries/BookQuery";

import * as React from "react";
import SearchBar from 'material-ui-search-bar'

import { Book } from "../data/book";
import { GridList, GridListTile, Button } from "@material-ui/core";
import { Link } from "react-router-dom";


type CatalogPageSate = {
  searchValue: string;
  bookGrid: JSX.Element;
}

export class CatalogPage extends React.Component<any, CatalogPageSate>{

  constructor(props: any) {
    super(props);
    this.state = {
      searchValue: "",
      bookGrid: <div/>
    };
  }

  _refresh(){
    this.GetBooksGrid().then((element: JSX.Element) => {
      this.setState({
        bookGrid: element
      })
    }).catch( (err) => {
      this.setState({
        bookGrid: this.DivErrorServer()
      })
    });
  }

  SortBooksByFilters(booksArr: Array<Book>){
    var books = booksArr;

    books.sort( (a:Book,b:Book) => {
      var sortNumber = 0;

      if (a.title !== undefined && b.title !== undefined)
        sortNumber = a.title < b.title ? -1: a.title > b.title ? 1 : 0;

      if (sortNumber === 0 && a.type !== undefined && b.type !== undefined)
        sortNumber = a.type < b.type ? -1 : a.type > b.type ? 1 : 0;

      if (sortNumber === 0 && a.volumeNumber !== undefined && b.volumeNumber !== undefined)
        sortNumber = a.volumeNumber < b.volumeNumber ? -1 : a.volumeNumber > b.volumeNumber ? 1 : 0;
        

      return sortNumber;
    });

    return books
  }

  GetBooksToShow() : Promise<Array<Book>> {
    return GetBooksData().then( (Data:any) => {
      const searchQuery = this.state.searchValue.toLowerCase();
      var books = Data
      if (searchQuery !== ""){
        // Filter the books, replace with a fuzzy search?
        books = books.filter( (item: Book) => {
          return item.title?.toLowerCase().includes(searchQuery);
        });
      }
      return this.SortBooksByFilters(books);
    });
  }

  GetBooksGrid() {
    return this.GetBooksToShow().then((Data: Array<Book>) => {
      return this.GetBooksGridList(Data);
    })
  }

  GetTopBar() {
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

  DivErrorServer() {
    return (
      <div>
        Couldn't find the server
      </div>
    )
  }

  GetBooksGridList(Books: Array<Book>) {
    return (
      <GridList cellHeight={182} spacing={10} cols={10}>
        {Books.map( function(item: Book){
          return (
            <GridListTile key={item.id}>
              <Button component={Link} to={"/books/" + item.identifier.identifier}>
                <img className="BookCover" src={item.thumbnail} alt={item.title}/>
              </Button>
            </GridListTile>
          )
        })}
      </GridList>
    )
  }

  render(){
    return (
      <div>
        {this.GetTopBar()}
        <p/>
        {this.state.bookGrid}
      </div>
    )
  }
}