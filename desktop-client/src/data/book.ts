export class Identifier {
  identifier: string;

  constructor(){
    this.identifier = "";
  }
}

const defaultThumbnail = "https://i.imgur.com/QWa1CA7.png";

export class Book {
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

  setIdentifier(identifier: string) { this.identifier.identifier = identifier; }
  getIdentifier() : string { return this.identifier.identifier; }
}
