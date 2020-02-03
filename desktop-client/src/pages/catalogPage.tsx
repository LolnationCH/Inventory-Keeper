import { GetBooksData, SendBooksData } from "../queries/BookQuery";

import * as React from "react";
import { GridList, GridListTile, Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import SearchBar from 'material-ui-search-bar'

import { Book } from "../data/book";

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
    this.GetBooksGridList().then((element: JSX.Element) => {
      this.setState({
        bookGrid: element
      })
    }).catch( (err) => {
      this.setState({
        bookGrid: this._errorServer()
      })
    });
  }

  _errorServer() {
    return (
      <div>
        Couldn't find the server
      </div>
    )
  }

  quickFix(data: Array<Book>){
    var Books = new Array<Book>();
    for (let dat of data){
      var book = new Book();
      book.SetBase(
        dat.title as any,
        dat.volumeNumber as any,
        dat.authors as any,
        dat.publisher as any,
        dat.publishedDate as any,
        dat.description as any,
        dat.identifier as any,
        dat.pageCount as any,
        dat.thumbnail as any,
        dat.language as any,
        dat.type as any,
      );
      Books.push(book);
    }
    SendBooksData(Books);
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

  GetBooksGridList() {
    return this.GetBooksToShow().then((Data: Array<Book>) => {
      return (
        <GridList cellHeight={182} spacing={10} cols={10}>
          {Data.map( function(item: Book){
            return (
              <GridListTile key={item.id}>
                <Button component={Link} to={"/books/" + item.identifier.identifier}>
                  <img src={item.thumbnail} alt={item.title}/>
                </Button>
              </GridListTile>
            )
          })}
        </GridList>
      )
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