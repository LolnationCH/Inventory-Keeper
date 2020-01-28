import * as React from "react";
import { TextField, Grid, Button } from "@material-ui/core";

import SaveIcon from '@material-ui/icons/Save';
import SearchIcon from '@material-ui/icons/Search';

import { GetBookData } from "../queries/BookQuery";
import { Book } from "../data/book";


export class BookPage extends React.Component<any,any> {
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
    this._saveBook = this._saveBook.bind(this);
    this._searchForBook = this._searchForBook.bind(this);
  }

  componentDidMount() {
    // Get all the books
    const books = GetBookData() as Array<Book>;
    var id = this.props.match.params.id;

    // Find the book required with the ISBN
    var book = books.find(function(item: Book) {
      return item.identifier.identifier === id;
    });

    if (book === undefined)
      book = new Book();

    // Set the state
    this.setState({ 
      title: book.title,
      volumeNumber: book.volumeNumber,
      authors: book.authors,
      publisher: book.publisher,
      publishedDate: book.publishedDate,
      description: book.description,
      identifier: book.identifier.identifier,
      pageCount: book.pageCount,
      thumbnail: book.thumbnail,
      language: book.language,
      type: book.type,
    });
    this.forceUpdate();
  }

  _createTopBar() {
    const ButtonSaveProps = {
      style : {
        marginBottom:"20px", 
        marginTop:"15px"
      },
      fullWidth: true,
      variant: "contained" as "contained"
    }
    const TextFieldProps = {
      style : { marginBottom:"20px", marginTop:"5px"},
      fullWidth: true,
      onChange: this._handleTextFieldChange,
      variant: "outlined" as "outlined"
    }

    return (
      <Grid container spacing={3}>
        <Grid item xs>
          <TextField {...TextFieldProps} id="ISBNsearch" label="Search by ISBN" value={this.state.ISBNsearch || ''}/>
        </Grid>
        <Grid item xs={2}>
          <Button {...ButtonSaveProps} color="primary" onClick={this._searchForBook}>
            <SearchIcon />
            &nbsp;Search
          </Button>
        </Grid>
        <Grid item xs={2}>
          <Button {...ButtonSaveProps} color="secondary" onClick={this._saveBook}>
            <SaveIcon />
            &nbsp;Save
          </Button>
        </Grid>
      </Grid>
    )
  }

  _handleTextFieldChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({[e.target.id]: e.target.value});
  }

  _saveBook(){

  }

  _searchForBook(){
    if (!this.state.ISBNsearch || !this.state.ISBNsearch.trim())
      alert("The search for the ISBN cannot be empty, please specify a value")
    
  }

  render() {
    const TextFieldProps = {
      style : {marginBottom:"20px"},
      fullWidth: true,
      onChange: this._handleTextFieldChange,
      variant: "outlined" as "outlined"
    }

    return(
    <div>
      {this._createTopBar()}
      <Grid container spacing={0}>
        <Grid item style={{paddingRight:"30px"}}>
          <img className="Big-thumbnail" style={{marginBottom:"20px"}} src={this.state.thumbnail || ''} alt={this.state.title || ''}/>
          <TextField multiline={true}  {...TextFieldProps} id="thumbnail" label="Thumbnail" value={this.state.thumbnail || ''}/>
        </Grid>
        <Grid item xs>
          <TextField {...TextFieldProps} id="title"         label="Title"                     value={this.state.title || ''}/>
          <TextField {...TextFieldProps} id="authors"       label="Authors"                   value={this.state.authors || ''}/>
          <TextField {...TextFieldProps} id="volumeNumber"  label="Volume"      type="number" value={this.state.volumeNumber || ''}/>
          <TextField {...TextFieldProps} id="publisher"     label="Publisher"                 value={this.state.publisher || ''}/>
          <TextField {...TextFieldProps} id="publishedDate" label="Publisher Date"            value={this.state.publishedDate || ''}/>
          <TextField {...TextFieldProps} id="pageCount"     label="Page Count"  type="number" value={this.state.pageCount || ''}/>
          <TextField {...TextFieldProps} id="language"      label="Language"                  value={this.state.language || ''}/>
          <TextField {...TextFieldProps} id="identifier"    label="ISBN"                      value={this.state.identifier || ''}/>
          <TextField {...TextFieldProps} id="type"          label="Type"                      value={this.state.type || ''}/>
        </Grid>
      </Grid>
      <TextField {...TextFieldProps} multiline={true} id="description" label="Description" value={this.state.description || ''}/>
    </div>
    )
  }
}