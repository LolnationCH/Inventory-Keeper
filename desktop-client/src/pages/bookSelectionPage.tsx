import * as React from "react";
import { GridList, GridListTile, Button, TextField, Grid } from "@material-ui/core";

/* DATA STRUCTURE */
import { Book, Identifier } from "../data/book";

/* QUERIES */
import { GetBooksData, SendBooksData } from "../queries/BookQuery";

// Style
const TextFieldProps = {
  style : {marginBottom:"20px", marginTop:"5px"},
  fullWidth: true,
  disabled: true,
  variant: "outlined" as "outlined"
};

// Function for the save button for a book
// This will add the book to the library
function handleSave(item: any){
  var book = new Book();
  book.SetBase(
    item.title,
    item.volumeNumber,
    item.authors,
    item.publisher,
    item.publishedDate,
    item.description,
    new Identifier(),
    item.pageCount,
    item.thumbnail,
    item.language,
    item.bookType,
  );
  book.setIdentifier(item.identifier.identifier);

  // Save book to the database
  GetBooksData()
  .then( (Data:Array<Book>) => {
    Data.push(book);
    SendBooksData(Data, "Book added to the library");
  })
  .catch(() => {
    alert("Connexion to the server failed. Make sure that the server is runnning and that your are connected to the internet.");
  });
}

// This function makes a custom gridlist for show casing books found that are similair to the ones queryed
function GetSelectionBooksGridList(Books: Array<Book>) {
  return (
    <GridList cellHeight={182} spacing={10} cols={1}>
      {Books.map( function(item: Book){
        return (
          <GridListTile key={item.id}>
            <div>
              <Grid container spacing={0}>
                <img className="BookCover" src={item.thumbnail} alt={item.title}/>
                <Grid item xs>
                  <Button variant={"contained"} color={"secondary"} onClick={() => { handleSave(item)}}>Save</Button>
                  <TextField {...TextFieldProps} id={`title-${item.title}`} label="Title" value={item.title}/>
                  <TextField {...TextFieldProps} id={`isbn-${item.identifier.identifier}`} label="ISBN" value={item.identifier.identifier}/>
                </Grid>
              </Grid>
            </div>
          </GridListTile>
        )
      })}
    </GridList>
  )
}

// If no book found (error or other)
function DivNoBooks() {
  return (
    <div>
      No books found. Press back to return and try again.
    </div>
  )
}

export class BookSelectionPage extends React.Component{
  render(){
    var books = localStorage.getItem('bookSelection');
    if (!books)
      return DivNoBooks();
    else
      return (
        <div>
          <p/>
          {GetSelectionBooksGridList(JSON.parse(books))}
        </div>
      )
  }
}