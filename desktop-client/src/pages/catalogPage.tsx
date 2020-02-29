import * as React from "react";
import { GridList, GridListTile, Button, Tooltip } from "@material-ui/core";
import { Link } from "react-router-dom";
import SearchBar from 'material-ui-search-bar'

/* DATA STRUCTURES*/
import { Book } from "../data/book";

/* CATALOG FUNCTIONS */
import { SortBooksByFilters } from "./catalogFunctions";

/* QUERIES */
import { GetBooksData } from "../queries/BookQuery";


type CatalogPageSate = {
  searchValue: string;   // The search value for the books, used to filter the bookGrid
  bookGrid: JSX.Element; // The grid containing the books
  width: number;         // Width of the window
  height: number;        // Heigth of the window
  cols: number;          // Number of columns for the grid
  NeedRefresh: boolean;  // Specified if we need to recalculate the grid
}

// If we change the height and weight of the bookCover class (in the .css), need to change the const values
const imageWidth = 128;
const imageHeight = 182;

export class CatalogPage extends React.Component<any, CatalogPageSate>{
  // Book cache, to not bother the api every time the user resize the view
  bookCache: Array<Book> = new Array<Book>();

  constructor(props: any) {
    super(props);

    // Set state
    this.state = {
      searchValue: "",
      bookGrid: <div/>,
      width:  0,
      height: 0,
      cols:   10,
      NeedRefresh: false,
    };
  }

  // Refresh the view. 
  // This is used by the search bar and the resize
  _refresh(){
    this.GetBooksGrid().then((element: JSX.Element) => {
      this.setState({
        bookGrid: element
      })
    }).catch( (err: any) => {
      this.setState({
        bookGrid: this.DivErrorServer()
      })
    });
  }

  // Return the book list
  GetBooksToShow(Data:any) : Array<Book> {
    const searchQuery = this.state.searchValue.toLowerCase();
    var books = Data;

    // If we have specified a search term, filter the books not matching it.
    if (searchQuery !== ""){
      // Filter the books, replace with a fuzzy search?
      books = books.filter( (item: Book) => {
        return item.title?.toLowerCase().includes(searchQuery);
      });
    }
    return SortBooksByFilters(books);
  }

  // Get the book grids
  // If the book were already fetch from the API, simply use the cache
  GetBooksGrid() : Promise<JSX.Element> {
    if (this.bookCache.length === 0) {
      return GetBooksData().then( (Data:any) => {
          var Books = this.GetBooksToShow(Data);
          this.bookCache = Books;
          return this.GetBooksGridList(Books);
      });
    }
    else
      return new Promise<JSX.Element>( (resolve:any, reject:any) => {
        resolve(this.GetBooksGridList(this.GetBooksToShow(this.bookCache)));
        reject(undefined);
      });
  }

  // Return the search bar
  GetTopBar() : JSX.Element {
    return (
      <SearchBar
        value={this.state.searchValue}
        onChange={(value) => { this.setState({searchValue: value, NeedRefresh:true});}}
        onCancelSearch={() => { this.setState({searchValue: "", NeedRefresh:true});}}
      />
    )
  }
  
  // Remove the resize listener
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  
  // Get the dimension of the window, and recalculat the number of cols for the grid
  updateWindowDimensions = () => {
    this.setState({ 
      width: window.innerWidth, 
      height: window.innerHeight, 
      cols: Math.ceil(((2*window.innerWidth)/3)/imageWidth),
      NeedRefresh: true,
    });
  }

  // Add the listener on resize
  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    this._refresh();
  }

  // Check if we need to refresh the view
  componentDidUpdate() {
    if (this.state.NeedRefresh) {
      this._refresh();
      this.setState({NeedRefresh : false});
    }
  }

  // If the server couldn't be found, this function is used
  DivErrorServer() : JSX.Element {
    return (
      <div>
        Couldn't find the server
      </div>
    )
  }

  // Use the books passed in arguments to construct a GridList to showcase the books
  GetBooksGridList(Books: Array<Book>): JSX.Element {
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