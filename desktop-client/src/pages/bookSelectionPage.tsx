import * as React from "react";
import { GetSelectionBooksGridList, DivErrorServer } from "./catalogFunctions";

export class BookSelectionPage extends React.Component{
  
  render(){
    var books = localStorage.getItem('bookSelection');
    if (!books)
      return DivErrorServer();
    else
      return (
        <div>
          <p/>
          {GetSelectionBooksGridList(JSON.parse(books))}
        </div>
      )
  }
}