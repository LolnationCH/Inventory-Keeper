
// ISBN identifiers
const ISBN_type = {
  10 : "ISBN_10",
  13 : "ISBN_13"
};

// Class for the handling the identifier
export class Identifier {
  identifier: string;

  constructor(){
    this.identifier = "";
  }
}


// Thumbnail (cover) utilities
const defaultThumbnail = "https://i.imgur.com/QWa1CA7.png";

export function GetGoogleThumbnail(isbn: string){
  return `https://books.google.com/books/content?vid=ISBN${isbn}&printsec=frontcover&img=1&zoom=1`
}
export function GetOpenLibraryThumbnail(isbn: string){
  return `http://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`
}

export function IsGoogleThumbnail(url: string) {
  return url.includes("google");
}
export function IsOpenLibraryThumbnail(url: string) {
  return url.includes("openlibrary");
}

// Uuidv4 for unique id for the book.
// This is used to find a specific boook in the list.
// We cannot use the ISBN since the user could want to change the IBSN of a book.
const uuidv4 = require('uuid/v4');

// Book class, for handling everything related to the books
export class Book {
  id:            string = uuidv4();
  title:         string | undefined;
  volumeNumber:  Number | undefined;
  authors:       Array<string> | undefined;
  publisher:     string | undefined;
  publishedDate: string | undefined;
  description:   string | undefined;
  identifier:    Identifier = new Identifier();
  pageCount:     Number | undefined;
  thumbnail:     string | undefined;
  language:      string | undefined;
  type:          string | undefined;

  constructor() {
    this.title         = "";
    this.volumeNumber  = 0;
    this.authors       = [""];
    this.publisher     = "";
    this.publishedDate = "";
    this.description   = "";
    this.identifier    = new Identifier();
    this.pageCount     = 0;
    this.thumbnail     = defaultThumbnail;
    this.language      = "";
    this.type          = "";
  }

  // Shorthand for setting the identifier
  setIdentifier(identifier: string) { this.identifier.identifier = identifier; }
  getIdentifier() : string { return this.identifier.identifier; }

  // Constructor with parameters
  SetBase(title: string, volumeNumber: Number, authors: Array<string>, publisher: string, publishedDate: string,
              description: string, identifier: Identifier, pageCount: Number, thumbnail: string, language: string, type: string) {
    this.title         = title;
    this.volumeNumber  = volumeNumber;
    this.authors       = authors;
    this.publisher     = publisher;
    this.publishedDate = publishedDate;
    this.description   = description;
    this.identifier    = identifier;
    this.pageCount     = pageCount;
    this.thumbnail     = thumbnail;
    this.language      = language;
    this.type          = type;
  }

  isEqual(book: Book): boolean{
    return this.title === book.title &&
           this.volumeNumber === book.volumeNumber &&
           this.authors === book.authors &&
           this.publisher === book.publisher &&
           this.publishedDate === book.publishedDate &&
           this.description === book.description &&
           this.identifier === book.identifier &&
           this.pageCount === book.pageCount &&
           this.thumbnail === book.thumbnail &&
           this.language === book.language &&
           this.type === book.type;
  }
}

// Parse response from Google Books Api
export function parseFromGoogleJson(googleBookObj: any): Book {
  var book = new Book();
  const volumeInfo = googleBookObj["volumeInfo"];
  // Get the book info
  book.title           = volumeInfo["title"];
  if (volumeInfo["volumeNumber"] != null)
    book.volumeNumber  = volumeInfo['volumeNumber'];
  if (volumeInfo["authors"] != null)
    book.authors       = volumeInfo["authors"];
  if (volumeInfo["publisher"] != null)
    book.publisher     = volumeInfo["publisher"];
  if (volumeInfo["publishedDate"] != null)
    book.publishedDate = volumeInfo["publishedDate"];
  if (volumeInfo["description"] != null)
    book.description   = volumeInfo["description"];
  if (volumeInfo["pageCount"] != null)
    book.pageCount     = volumeInfo["pageCount"];
  if (volumeInfo["language"] != null)
    book.language      = volumeInfo["language"];

  const industryIdentifiers = volumeInfo["industryIdentifiers"];
  for (let industryIdentifier of industryIdentifiers)
  {
    if (industryIdentifier["type"] === ISBN_type[13])
      book.setIdentifier(industryIdentifier["identifier"]);
  }

  // Why not used the one provided in the json? Because sometimes it is not...
  // This api reliability sometime suck, but I don't think it's Google fault.
  // Some books can not even be found, but the cover can!
  book.thumbnail = GetGoogleThumbnail(book.getIdentifier());
  return book;
}

// Parse response from OpenLibrary Api
// Returns null if no book were found.
export function parseFromOpenLibraryJson(openLibraryObj: any): Book | null {
  if (openLibraryObj["details"] == null)
    return null;
  
  // Initialize stuff
  var book = new Book();
  const details = openLibraryObj["details"];

  // Set the book info
  if (details["title"] != null)
    book.title = details["title"];
  if (details["isbn_13"] != null)
    book.setIdentifier(details['isbn_13'][0]);
  if (details["authors"] != null)
    book.authors       = details["authors"].map( (item: any) => { return item.name });
  if (details["publishers"] != null)
    book.publisher     = details["publishers"][0];
  if (details["publish_date"] != null)
    book.publishedDate = details["publish_date"];
  if (details["description"] != null)
    book.description   = details["description"]["value"];
  if (details["number_of_pages"] != null)
    book.pageCount     = details["number_of_pages"];
  if (details["languages"] != null)
    book.language      = details["languages"].map( (item:any) => { return item.key });

  book.thumbnail = GetOpenLibraryThumbnail(book.getIdentifier());
  
  return book;
}