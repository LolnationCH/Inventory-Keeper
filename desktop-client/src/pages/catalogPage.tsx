import { GetBooksData } from "../queries/BookQuery";

import * as React from "react";
import SearchBar from 'material-ui-search-bar'

import { Book } from "../data/book";
import { GridList, GridListTile, Button, Tooltip } from "@material-ui/core";
import { Link } from "react-router-dom";
import { SortBooksByFilters } from "./catalogFunctions";


type CatalogPageSate = {
  searchValue: string;
  bookGrid: JSX.Element;
  width: number;
  height: number;
  cols: number;
  NeedRefresh: boolean;
}

// If we change the height and weight of the bookCover class, need to change the const values
const imageWidth = 128;
const imageHeight = 182;

export class CatalogPage extends React.Component<any, CatalogPageSate>{
  grid:any;

  bookCache: Array<Book> = new Array<Book>();

  constructor(props: any) {
    super(props);
    this.state = {
      searchValue: "",
      bookGrid: <div/>,
      width: 0,
      height: 0,
      cols:10,
      NeedRefresh: false,
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
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
      return SortBooksByFilters(books);
    });
  }

  GetBooksGrid() {
    if (this.bookCache.length === 0)
      return this.GetBooksToShow().then((Data: Array<Book>) => {
        this.bookCache = Data;
        return this.GetBooksGridList(Data);
      })
    else
      return new Promise<JSX.Element>( (resolve:any, reject:any) => {
        resolve(this.GetBooksGridList(this.bookCache));
        reject(undefined);
      });
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
  
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  
  updateWindowDimensions() {
    this.setState({ 
      width: window.innerWidth, 
      height: window.innerHeight, 
      cols: Math.ceil(((2*window.innerWidth)/3)/imageWidth),
      NeedRefresh: true,
    });
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    this._refresh();
  }

  componentDidUpdate() {
    if (this.state.NeedRefresh) {
      this._refresh();
      this.setState({NeedRefresh : false});
    }
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
      <GridList cellHeight={imageHeight} spacing={10} cols={this.state.cols}>
        {Books.map( function(item: Book){
          return (
            <GridListTile key={item.id}>
              <Tooltip title={item.title} arrow>
                <Button component={Link} to={"/books/" + item.identifier.identifier}>
                  <img className="BookCover" src={item.thumbnail} alt={item.title}/>
                </Button>
              </Tooltip>
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