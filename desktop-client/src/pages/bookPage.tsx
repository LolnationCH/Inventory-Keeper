import * as React from "react";
import { TextField, Grid, Button, IconButton } from "@material-ui/core";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from "react-toastify";

/* ICONS */
import SaveIcon from '@material-ui/icons/Save';
import SearchIcon from '@material-ui/icons/Search';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';


/* QUERIES */
import {
  GetBooksData,
  SendBooksData,
  GetBookDataFromGoogle,
  GetBookDataFromOpenLibraryApi
} from "../queries/BookQuery";

/* DATA STRUCTURE */
import { 
  Book,
  Identifier,
  parseFromGoogleJson,
  parseFromOpenLibraryJson,
  GetGoogleThumbnail,
  GetOpenLibraryThumbnail,
  IsOpenLibraryThumbnail
} from "../data/book";

/* CATALOG FUNCTION */
import { GetBooks } from "./catalogFunctions";


// This pages modes.
//  - FIX : Cannot edit the textfields (they are disabled)
//  - EMPTY/EDITING : For future implementation
export enum BookPageModes {
  EMPTY,
  EDITING,
  FIX
}

// STYLES
const ButtonProps = {
  style : {
    marginBottom:"20px",
    marginTop:"15px",
  },
  fullWidth: true,
  variant: "contained" as "contained"
};
const ButtonSaveProps = {
  style : {
    marginBottom:"20px",
    marginTop:"15px",
    color:"white", 
    backgroundColor:"rgb(33, 35, 37)",
  },
  fullWidth: true,
  variant: "contained" as "contained"
}

// We probably could use a type for the state, but it breaks _handleTextFieldChange
export class BookPage extends React.Component<any, any> {
  TextFieldProps : any;

  // Used to keep a copy of what was the book originaly.
  // This allow to modify the book when hitting save
  OriginalBook: Book = new Book();

  constructor(props: any) {
    super(props);

    var book = new Book();

    // Set state
    this.state = {
      title: book.title,
      volumeNumber: book.volumeNumber,
      authors: book.authors,
      publisher: book.publisher,
      publishedDate: book.publishedDate,
      description: book.description,
      identifier: book.identifier.identifier || '',
      pageCount: book.pageCount,
      thumbnail: book.thumbnail,
      language: book.language,
      type: book.type,

      ISBNsearch: ''
    }

    this.TextFieldProps = {
      style : {marginBottom:"20px", marginTop:"5px"},
      fullWidth: true,
      onChange: this._handleTextFieldChange,
      variant: "outlined" as "outlined"
    };
  }

  // Completly sets the book page info with the book
  _setStateWithBook(book: Book) {
    this.setState({
      title:         book.title,
      volumeNumber:  book.volumeNumber,
      authors:       book.authors,
      publisher:     book.publisher,
      publishedDate: book.publishedDate,
      description:   book.description,
      identifier:    book.identifier.identifier,
      pageCount:     book.pageCount,
      thumbnail:     book.thumbnail,
      language:      book.language,
      type:          book.type,
    });
  }

  // Partially set the page info with the book.
  // This is used by the Queries to fill the info that is received.
  // Since not all the fields are filled by the APIs, we must not set the one with invalid values
  _partialSetStateWithBook(book: Book) {
    this.setState({
      title:         book.title,
      authors:       book.authors,
      publisher:     book.publisher,
      publishedDate: book.publishedDate,
      description:   book.description,
      identifier:    book.identifier.identifier,
      pageCount:     book.pageCount,
      thumbnail:     book.thumbnail,
      language:      book.language,
    });
  }

  componentDidMount() {
    // Get all the books
    GetBooksData().then( (books : Array<Book>) => {
      var id = this.props.match.params.id;

      // Find the book required with the ISBN
      var book = books.find(function(item: Book) {
        return item.identifier.identifier === id;
      });

      if (book === undefined)
        book = new Book();

      this.OriginalBook = book;
      this._setStateWithBook(book);
      this.forceUpdate();
    });
  }

  // Functions for the topbar
  _createTopBar(Mode : BookPageModes)
  {
    switch ( Mode ) {
      case BookPageModes.EMPTY:
        return this._createTopBarEmpty();
      case BookPageModes.EDITING:
        return this._createTopBarEmpty();
      case BookPageModes.FIX:
      default:
        return null;
    }
  }
  _createTopBarEmpty() {
    return (
      <Grid container spacing={3}>
        <Grid item xs>
          <TextField 
            {...this.TextFieldProps}
            style={{marginTop:"5px"}}
            id="ISBNsearch"
            label="Search by ISBN"
            value={this.state.ISBNsearch || ''}
            onKeyPress={(ev:any) => {
              if (ev.key === 'Enter') {
                this._searchForBook();
                ev.preventDefault();
              }
            }}
          />
        </Grid>
        <Grid item xs={2}>
          <Button {...ButtonProps} color="primary" onClick={this._searchForBook}>
            <SearchIcon />
            &nbsp;Search
          </Button>
        </Grid>
        <Grid item xs={2}>
          <Button {...ButtonSaveProps} onClick={this._saveBook}>
            <SaveIcon />
            &nbsp;Save
          </Button>
        </Grid>
        <Grid item xs={2}>
          <Button {...ButtonProps} color="secondary" onClick={this._deleteBook}>
            <SaveIcon />
            &nbsp;Delete
          </Button>
        </Grid>
      </Grid>
    )
  }

  // functions to handle the changes to the book
  _handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({[e.target.id]: e.target.value});
  }
  _handleSwitchThumbnail = (e: any) => {
    if (IsOpenLibraryThumbnail(this.state.thumbnail))
      this.setState({thumbnail: GetGoogleThumbnail(this.state.identifier)})
    else
      this.setState({thumbnail: GetOpenLibraryThumbnail(this.state.identifier)})
  }

  // Function to delete the book.
  // After the book is delete, push back to the catalog
  _deleteBook = () => {
    GetBooksData().then( (Data:Array<Book>) => {
      var items = Data.filter( (value) => {
        return value.id !== this.OriginalBook.id;
      });
      SendBooksData(items, "Book deleted");
    });
    setTimeout(() => { this.props.history.push('/catalog'); }, 500);
  }

  // Function to save the modification to the book
  // If the book is not already in the library, add the book to it.
  _saveBook = () => {
    if (!this.state.title || !this.state.title.trim() ||
        !this.state.identifier || !this.state.identifier.trim()) {
      alert("You have to specify a title and an ISBN");
      return;
    }

    var authors = Array.isArray(this.state.authors)? this.state.authors : [this.state.authors];

    var book = new Book();
    book.SetBase(
      this.state.title,
      +this.state.volumeNumber,
      authors,
      this.state.publisher,
      this.state.publishedDate,
      this.state.description,
      new Identifier(),
      +this.state.pageCount,
      this.state.thumbnail,
      this.state.language,
      this.state.type,
    );

    book.setIdentifier(this.state.identifier);

    if (book.isEqual(this.OriginalBook))
      return;
    
    // Save book to the database
    GetBooksData().then( (Data:Array<Book>) => {
      var items = Data.filter( (value) => {
        return value.id !== this.OriginalBook.id;
      });

      // No book found in the catalog, adding to the library
      if (items.length === Data.length) {
        Data.push(book);
        SendBooksData(Data, "Book added to the library");
      }
      else {
        items.push(book);
        SendBooksData(items,"Changes saved");
      }

      // Set the url to the book
      this.props.history.push(`/books/${book.identifier.identifier}`);
      this.OriginalBook = book;
    })
    .catch(() => {
      alert("Connexion to the server failed. Make sure that the server is runnning and that your are connected to the internet.\nNothing is saved");
    });
  }

  // Function to check if the book is already in the catalog.
  // If it is, simply reject and push the history to the book.
  _bookInCollection(ISBNsearch: string): Promise<any> {
    return (
      GetBooksData().then( (books : Array<Book>) => {
        for (let book of books){
          if (book.identifier.identifier === ISBNsearch) {
            this.props.history.push('/books/' + ISBNsearch);
            return Promise.reject(); // Reject cause we don't want to search for the book
          }
        }
        return Promise.resolve();
      })
      .catch(() => {
        alert("Connexion to the server failed. Make sure that the server is runnning and that your are connected to the internet.");
      }));
  }

  // Get the book from the OpenLibrary API
  _bookOpenLibrary(ISBNsearch: string): Promise<any> {
    return (
      GetBookDataFromOpenLibraryApi(ISBNsearch).then( (data:any) => {
        var keyList = new Array<string>();
        var bookFound;
        
        // Iterate through all the books received
        for (let key in data) {
          keyList.push(key);
          var book = parseFromOpenLibraryJson(data[key]);

          // If we have a perfect match, just ignore the others
          if (book && book.getIdentifier() === ISBNsearch){
            bookFound = book;
            break;
          }
        }

        // No book received
        if (keyList.length === 0)
          return Promise.reject();

        // Couldn't find the book
        if (!bookFound || bookFound === undefined) {
          return Promise.reject();
        }
        else {
          this._partialSetStateWithBook((bookFound as unknown) as Book);
          return Promise.resolve();
        }
      })
    );
  }

  // Get the book from the Google API
  _bookGoogleBook(ISBNsearch: string): Promise<any> {
    return (
      GetBookDataFromGoogle(ISBNsearch).then( (data:any) => {
        if (!data.items || data.items.length <= 0)
          return Promise.reject(null);
        
        // Iterate through all the books received
        var booksFound : Array<Book> = new Array<Book>();
        var bookFound;
        for (let entry of data.items){
          var bookParsed = parseFromGoogleJson(entry);
          if (bookParsed.getIdentifier() !== "")
            booksFound.push(bookParsed);

          // If we have a perfect match, just ignore the others
          if (bookParsed.getIdentifier() === ISBNsearch){
            bookFound = bookParsed;
            break;
          }
        }
  
        // If we couldn't find the book, just return all the books received
        if (bookFound === undefined) {
          return Promise.reject(booksFound);
        }
        else {
          this._partialSetStateWithBook(bookFound);
          return Promise.resolve();
        }
      })
    )
  }

  // Search for the book.
  // This is use all the API calls possible
  _searchForBook = () => {
    const ISBNsearch = this.state.ISBNsearch;
    if (!ISBNsearch || !ISBNsearch.trim())
      alert("The search for the ISBN cannot be empty, please specify a value")

    this._bookInCollection(ISBNsearch)
    .then( () => {
      this._bookGoogleBook(ISBNsearch) // Search with GoogleBook Api
      .then( () => {} )
      .catch( (booksFound: Array<Book>) => {
        this._bookOpenLibrary(ISBNsearch) // Search with OpenLibrary Api
        .then(()=>{})
        .catch(() => {
          // Couldn't find a exact match for the book, show what we've got in case a book has a mislabled isbn
          if (booksFound === null) {
            toast("No book found with corresponding ISBN");
            return null;
          }
          
          localStorage.setItem('bookSelection', JSON.stringify(booksFound));
          this.props.history.push('/bookSelection/');
        });
      });
      return null;
    })
    .catch( () => {});
  }

  // Navigate back in the catalog
  OnBackClick = () => {
    GetBooks().then( (books: Array<Book>) => {
      var index = books.findIndex((element:Book) => {
        return element.identifier.identifier === this.OriginalBook.identifier.identifier;
      });
      if (index > 0){
        var book = books[index-1];
        this.props.history.push(`/books/${book.identifier.identifier}`);
        this.OriginalBook = book;
        this._setStateWithBook(book);
      }
    });
  }

  // Navigate forward in the catalog
  OnForwardClick = () => {
    GetBooks().then( (books: Array<Book>) => {
      var index = books.findIndex((element:Book) => {
        return element.identifier.identifier === this.OriginalBook.identifier.identifier;
      });
      if (index < books.length - 1){
        var book = books[index+1];
        this.props.history.push(`/books/${book.identifier.identifier}`);
        this.OriginalBook = book;
        this._setStateWithBook(book);
      }
    });
  }

  // Returns the JSX.Element for the thumbnail
  getThumbnail() {
    return (
      <Grid container spacing={0} justify="center">
        <Grid item xs>
          <IconButton onClick={this.OnBackClick}><ArrowBackIosIcon/></IconButton>
          <img className="Big-thumbnail" style={{marginBottom:"20px"}} src={this.state.thumbnail || ''} alt={this.state.title || ''}/>
          <IconButton onClick={this.OnForwardClick}><ArrowForwardIosIcon/></IconButton>
        </Grid>
      </Grid>
    );
  }

  // Returns the JSX.Element for the button for a quick cover change
  getButtonCover() {
    if (IsOpenLibraryThumbnail(this.state.thumbnail))
      return (
          <Button 
            style={{color:"white", backgroundColor:"#4285F4"}} 
            fullWidth={true} 
            variant={"contained"} 
            onClick={this._handleSwitchThumbnail}
          >
            Switch to Google Books Covers
          </Button>
      );
    else
      return (
        <Button 
          style={{color:"black", backgroundColor:"#e1dcc5"}} 
          fullWidth={true} 
          variant={"contained"} 
          onClick={this._handleSwitchThumbnail}
        >
          Switch to OpenLibrary Covers
        </Button>
    );
  }

  render() {
    // Check if the page is in FIX mode. If so, we must disable the textfield
    const IsDisabled = this.props.Mode === BookPageModes.FIX;

    return(
    <div>
      {this._createTopBar(this.props.Mode)}
      <Grid container spacing={0}>
        <Grid item style={{paddingRight:"30px"}} xs={5}>
          {this.getThumbnail()}
          <TextField multiline={true} disabled={IsDisabled} {...this.TextFieldProps} id="thumbnail" label="Thumbnail" value={this.state.thumbnail || ''}/>
          {this.getButtonCover()}
          <p/>
          <Button 
            style={{color:"white", backgroundColor:"#E37151"}} 
            fullWidth={true} 
            variant={"contained"} 
            onClick={() => window.open(`https://duckduckgo.com/?q=${this.state.identifier}&t=h_&iax=images&ia=images`, '_blank')}
          >
            Search with DuckDuckGo
          </Button>
          <p/>
          <Button 
            style={{color:"white", backgroundColor:"#DB4437"}} 
            fullWidth={true} 
            variant={"contained"} 
            onClick={() => window.open(`https://www.google.com/search?tbm=isch&q=${this.state.identifier}`, '_blank')}
          >
            Search with Google
          </Button>
        </Grid>
        <Grid item xs>
          <TextField {...this.TextFieldProps} disabled={IsDisabled} id="title"         label="Title"                     value={this.state.title || ''}/>
          <TextField {...this.TextFieldProps} disabled={IsDisabled} id="authors"       label="Authors"                   value={this.state.authors || ''}/>
          <TextField {...this.TextFieldProps} disabled={IsDisabled} id="volumeNumber"  label="Volume"      type="number" value={this.state.volumeNumber || ''}/>
          <TextField {...this.TextFieldProps} disabled={IsDisabled} id="publisher"     label="Publisher"                 value={this.state.publisher || ''}/>
          <TextField {...this.TextFieldProps} disabled={IsDisabled} id="publishedDate" label="Publisher Date"            value={this.state.publishedDate || ''}/>
          <TextField {...this.TextFieldProps} disabled={IsDisabled} id="pageCount"     label="Page Count"  type="number" value={this.state.pageCount || ''}/>
          <TextField {...this.TextFieldProps} disabled={IsDisabled} id="language"      label="Language"                  value={this.state.language || ''}/>
          <TextField {...this.TextFieldProps} disabled={IsDisabled} id="identifier"    label="ISBN"                      value={this.state.identifier || ''}/>
          <TextField {...this.TextFieldProps} disabled={IsDisabled} id="type"          label="Type"                      value={this.state.type || ''}/>
        </Grid>
      </Grid>
      <TextField {...this.TextFieldProps} multiline={true} disabled={IsDisabled} id="description" label="Description" value={this.state.description || ''}/>
    </div>
    )
  }
}