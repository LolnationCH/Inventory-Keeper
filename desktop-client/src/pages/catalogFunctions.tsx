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

export function SortBooksByFilters(booksArr: Array<Book>){
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

export function GetBooks(){
  return GetBooksData().then( (Data:any) => {
    return SortBooksByFilters(Data);
  });
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