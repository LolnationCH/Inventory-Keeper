import * as React from "react";
import { GridList, GridListTile, Button } from "@material-ui/core";
import { Link } from "react-router-dom";

import { Book } from "../data/book";
import { GetBooksData } from "../queries/BookQuery";


// Get the books in a grid list
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

// Sort function for the books
// The order is by :
//    - Title
//    - Type
//    - VolumeNumber
export function SortBooksByFilters(booksArr: Array<Book>){
  var books = booksArr;

  books.sort( (a:Book,b:Book) => {
    var sortNumber = 0;

    if (a.title !== undefined && b.title !== undefined)
      sortNumber = a.title < b.title ? -1: a.title > b.title ? 1 : 0;

    if (sortNumber === 0 && a.bookType !== undefined && b.bookType !== undefined)
      sortNumber = a.bookType < b.bookType ? -1 : a.bookType > b.bookType ? 1 : 0;

    if (sortNumber === 0 && a.volumeNumber !== undefined && b.volumeNumber !== undefined)
      sortNumber = a.volumeNumber < b.volumeNumber ? -1 : a.volumeNumber > b.volumeNumber ? 1 : 0;

    return sortNumber;
  });

  return books
}

// Get Books filtered by SortBooksByFilters
export function GetBooks(){
  return GetBooksData()
  .then( (Data:any) => {
    return SortBooksByFilters(Data);
  })
  .catch(() => {
    alert("Connexion to the server failed. Make sure that the server is runnning and that your are connected to the internet.");
  });
}

/*
// Quick fix in case books miss the id's
// This simply takes the books and re-apply the class construction
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
}*/