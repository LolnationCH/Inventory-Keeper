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

export function TestConnection(uri: string): Promise<any> {
  const options = {
    uri: uri,
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

export function GetBookDataFromGoogle(isbn: string): Promise<any>{
  const googleBookAPI = `https://www.googleapis.com/books/v1/volumes?q=isbn${isbn}`;
  const options = {
    uri: googleBookAPI,
    json: true
  }
  return rp(options);
}

export function GetBookDataFromOpenLibraryApi(isbn: string): Promise<any>{
  const openLibraryApi = `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=details&format=json`
  const options = {
    uri: openLibraryApi,
    json: true
  }
  return rp(options);
}