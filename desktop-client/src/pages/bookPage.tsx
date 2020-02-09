import * as React from "react";
import { TextField, Grid, Button } from "@material-ui/core";
import 'react-toastify/dist/ReactToastify.css';

import SaveIcon from '@material-ui/icons/Save';
import SearchIcon from '@material-ui/icons/Search';

import { GetBooksData, SendBooksData, GetBookDataFromGoogle, GetBookDataFromOpenLibraryApi } from "../queries/BookQuery";
import { Book, parseFromGoogleJson, Identifier, parseFromOpenLibraryJson, GetGoogleThumbnail, IsOpenLibraryThumbnail, GetOpenLibraryThumbnail } from "../data/book";
import { toast } from "react-toastify";

export enum BookPageModes {
  EMPTY,
  EDITING,
  FIX
}

const ButtonProps = {
  style : {
    marginBottom:"20px",
    marginTop:"15px",
  },
  fullWidth: true,
  variant: "contained" as "contained"
}

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

export class BookPage extends React.Component<any, any> {
  TextFieldProps : any;
  OriginalBook: Book = new Book();

  constructor(props: any) {
    super(props);

    var book = new Book();
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

    this._handleTextFieldChange = this._handleTextFieldChange.bind(this);
    this._handleSwitchThumbnail = this._handleSwitchThumbnail.bind(this);
    this._saveBook = this._saveBook.bind(this);
    this._searchForBook = this._searchForBook.bind(this);
    this._deleteBook = this._deleteBook.bind(this);

    this.TextFieldProps = {
      style : {marginBottom:"20px", marginTop:"5px"},
      fullWidth: true,
      onChange: this._handleTextFieldChange,
      variant: "outlined" as "outlined"
    };
  }

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

  _handleTextFieldChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({[e.target.id]: e.target.value});
  }

  _handleSwitchThumbnail(e: any) {
    if (IsOpenLibraryThumbnail(this.state.thumbnail))
      this.setState({thumbnail: GetGoogleThumbnail(this.state.identifier)})
    else
      this.setState({thumbnail: GetOpenLibraryThumbnail(this.state.identifier)})
  }

  _deleteBook() {
    GetBooksData().then( (Data:Array<Book>) => {
      var items = Data.filter( (value) => {
        return value.id !== this.OriginalBook.id;
      });
      SendBooksData(items, "Book deleted");
    });
    setTimeout(() => { this.props.history.push('/catalog'); }, 500);
  }

  _saveBook(){
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
      this.OriginalBook = book;
    });
  }

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
      }));
  }

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
          console.log(bookFound);
          return Promise.reject();
        }
        else {
          this._partialSetStateWithBook((bookFound as unknown) as Book);
          return Promise.resolve();
        }
      })
    );
  }

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

  _searchForBook(){
    const ISBNsearch = this.state.ISBNsearch;
    if (!ISBNsearch || !ISBNsearch.trim())
      alert("The search for the ISBN cannot be empty, please specify a value")

    this._bookInCollection(ISBNsearch)
    .then( () => {
      this._bookGoogleBook(ISBNsearch) // Search with GoogleBook Api
      .then( () => {} )
      .catch( (booksFound: Array<Book>) => {
        console.log(booksFound);
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

  render() {
    const IsDisabled = this.props.Mode === BookPageModes.FIX;

    return(
    <div>
      {this._createTopBar(this.props.Mode)}
      <Grid container spacing={0}>
        <Grid item style={{paddingRight:"30px"}}>
          <img className="Big-thumbnail" style={{marginBottom:"20px"}} src={this.state.thumbnail || ''} alt={this.state.title || ''}/>
          <TextField multiline={true}  {...this.TextFieldProps} id="thumbnail" label="Thumbnail" value={this.state.thumbnail || ''}/>
          <Button 
            style={{color:"white", backgroundColor:"rgb(33, 35, 37)"}} 
            fullWidth={true} 
            variant={"contained"} 
            onClick={this._handleSwitchThumbnail}
          >
            Switch to OpenLibrary Covers
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