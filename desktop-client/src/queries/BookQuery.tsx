import Data from "../data/data.json";

var rp = require('request-promise');

const queryAPI = 'https://www.googleapis.com/books/v1/volumes?q=isbn';

export function GetBooksData(): any{ 
  return Data;
}

export function GetBookDataFromGoogle(isbn: string): Promise<any>{
  const options = {
    uri: queryAPI + isbn,
    json: true
  }
  return rp(options);
}