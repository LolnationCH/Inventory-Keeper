export class Identifier {
  identifier: String;

  constructor(){
    this.identifier = "";
  }
}

export class Book {
  title:         String | undefined;
  volumeNumber:  Number | undefined;
  authors:       Array<String> | undefined;
  publisher:     String | undefined;
  publishedDate: String | undefined;
  description:   String | undefined;
  identifier:    Identifier = new Identifier();
  pageCount:     Number | undefined;
  thumbnail:     String | undefined;
  language:      String | undefined;
  type:          String | undefined;

  constructor(){}

  SetBase(title: String, volumeNumber: Number, authors: Array<String>, publisher: String, publishedDate: String,
              description: String, identifier: Identifier, pageCount: Number, thumbnail: String, language: String, type: String) {
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

  setIdentifier(identifier: String) { this.identifier.identifier = identifier; }
  getIdentifier() : String { return this.identifier.identifier; }
}
