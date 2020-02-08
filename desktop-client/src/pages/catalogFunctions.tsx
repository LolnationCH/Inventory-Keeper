import * as React from "react";
import { GridList, GridListTile, Button, Grid, TextField } from "@material-ui/core";
import { Link } from "react-router-dom";

import { Book, Identifier } from "../data/book";
import { GetBooksData, SendBooksData } from "../queries/BookQuery";


export function GetBooksGridList(Books: Array<Book>) {
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

const TextFieldProps = {
  style : {marginBottom:"20px", marginTop:"5px"},
  fullWidth: true,
  disabled: true,
  variant: "outlined" as "outlined"
};

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
    item.type,
  );
  book.setIdentifier(item.identifier.identifier);

  // Save book to the database
  GetBooksData().then( (Data:Array<Book>) => {
    Data.push(book);
    SendBooksData(Data, "Book added to the library");
  });
}

export function GetSelectionBooksGridList(Books: Array<Book>) {
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

export function DivErrorServer() {
  return (
    <div>
      Couldn't find the server
    </div>
  )
}


// Quick fix in case book get corrupted
function quickFix(data: Array<Book>){
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
  //SendBooksData(Books);
}