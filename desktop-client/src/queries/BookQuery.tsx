import { Book } from "../data/book.js";
import { toast } from "react-toastify";

var rp = require('request-promise');

// Local fetches/post
const defaultServerUrl = 'http://localhost:6969'

export function getUrlServer():string {
  var urlStored = localStorage.getItem('serverUrl');
  if (!urlStored || urlStored === "")
    return defaultServerUrl;
  else
    return urlStored;
}

export function TestServerOnline(): any{
  const options = {
    uri: getUrlServer(),
    json: true
  }
  return rp(options);
}

export function GetBooksData(): any{ 
  const options = {
    uri: getUrlServer() + "/api/books",
    json: true
  }
  return rp(options);
}

export function SendBooksData(books: Array<Book>, sucessToastMessage: string = "") {
  const options = {
    method: 'POST',
    uri: getUrlServer() + "/api/books",
    body: books,
    json: true
  };
  rp(options)
  .then( (parsedBody: any) => {
    if (sucessToastMessage !== "")
      toast(sucessToastMessage);
  })
  .catch( (err: any) => {
    console.log(err);
  });
}

// External fetches
const queryAPI = 'https://www.googleapis.com/books/v1/volumes?q=isbn';
export function GetBookDataFromGoogle(isbn: string): Promise<any>{
  const options = {
    uri: queryAPI + isbn,
    json: true
  }
  return rp(options);
}