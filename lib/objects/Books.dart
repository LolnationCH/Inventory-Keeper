const Map<int, String> ISBN_type = {
  10 : "ISBN_10",
  13 : "ISBN_13"
};

class ISBN{
  ISBN(String isbn)
  {
    this.identifier = isbn;
  }
  String identifier;
  
  String getISBNType()
  {
    return ISBN_type[identifier.length];
  }

  String getIdentifierVisual() {
    if (identifier.length == 13)
      return identifier.substring(0,3) + "-" + identifier.substring(3,4) + "-" + identifier.substring(4,10) + "-" + identifier.substring(10,12) + "-" + identifier.substring(12,13);
    else if (identifier.length == 10)
      return identifier.substring(0,1) + "-" + identifier.substring(1,6) + "-" + identifier.substring(6,10) + "-" + identifier.substring(10,11);
    return identifier;
  }

  ISBN.fromJson(Map<String, dynamic> json) : 
    identifier = json['identifier'];

  Map<String, dynamic> toJson() => {
    'identifier' : identifier,
  };
}

class Book{
  String title;
  int volumeNumber;
  List<String> authors;
  String publisher;
  String publishedDate;
  String description;
  ISBN identifier = new ISBN('0');
  int pageCount;
  String thumbnail = 'https://i.imgur.com/2ilT3Q5.png'; // Default to a no Image
  String language;

  String getIdentifier() { return this.identifier.identifier; }
  String getAuthors() { return this.authors.toString().replaceAll('[', '').replaceAll(']', ''); }
  String getVolumeNumber() { return this.volumeNumber.toString(); }
  String getPageCount() { return this.pageCount.toString(); }

  void setIdentifier(String identifier) { this.identifier.identifier = identifier; }
  void setAuthors(String authors) { this.authors = authors.split(','); }
  void setVolumeNumber(String volumeNumber) { this.volumeNumber = int.tryParse(volumeNumber); }
  void setPageCount(String pageCount) { this.pageCount = int.tryParse(pageCount); }

  Book();

  Book.fromJsonWeb(Map<String, dynamic> jsonItem) {
    dynamic volumeInfo = jsonItem["volumeInfo"];

    dynamic industryIdentifiers = volumeInfo["industryIdentifiers"];
    for (int j = 0; j < industryIdentifiers.length; j++)
    {
      if (industryIdentifiers[j]["type"] == ISBN_type[13])
        identifier = new ISBN(industryIdentifiers[j]["identifier"]);
    }

    title         = volumeInfo["title"];
    volumeNumber  = volumeInfo['volumeNumber'];
    authors       = new List<String>.from(volumeInfo["authors"]);
    publisher     = volumeInfo["publisher"];
    publishedDate = volumeInfo["publishedDate"];
    description   = volumeInfo["description"];
    pageCount     = volumeInfo["pageCount"];
    thumbnail     = volumeInfo["imageLinks"]["thumbnail"];
    language      = volumeInfo["language"];
  }

  Book.fromRawJsonWeb(String isbn, Map<String, dynamic> jsonResponse) {
    identifier = new ISBN(isbn);

    dynamic items = jsonResponse['items'];
    dynamic book;
    for (int i =0; i < items.length; i++)
    {
      dynamic volumeInfo = items[i]["volumeInfo"];
      dynamic industryIdentifiers = volumeInfo["industryIdentifiers"];
      for (int j = 0; j < industryIdentifiers.length; j++)
      {
        if (industryIdentifiers[j]["type"] == identifier.getISBNType() &&
            industryIdentifiers[j]["identifier"] == identifier.identifier)
          book = items[i];
      }
    }
    if (book != null)
    {
      dynamic volumeInfo = book["volumeInfo"];
      title         = volumeInfo["title"];
      volumeNumber  = volumeInfo['volumeNumber'];
      authors       = new List<String>.from(volumeInfo["authors"]);
      publisher     = volumeInfo["publisher"];
      publishedDate = volumeInfo["publishedDate"];
      description   = volumeInfo["description"];
      pageCount     = volumeInfo["pageCount"];
      thumbnail     = volumeInfo["imageLinks"]["thumbnail"];
      language      = volumeInfo["language"];
    }
  }

  Book.fromJson(Map<String, dynamic> json) : 
    title = json['title'],
    volumeNumber = json['volumeNumber'],
    authors = new List<String>.from(json['authors']),
    publisher = json['publisher'],
    publishedDate = json['publishedDate'],
    description = json['description'],
    identifier = ISBN.fromJson(json['identifier']),
    pageCount = json['pageCount'],
    thumbnail = json['thumbnail'],
    language = json['language'];

  Map<String, dynamic> toJson() => {
    'title':         title,
    'volumeNumber':  volumeNumber,
    'authors':       authors,
    'publisher':     publisher,
    'publishedDate': publishedDate,
    'description':   description,
    'identifier':    identifier.toJson(),
    'pageCount':     pageCount,
    'thumbnail':     thumbnail,
    'language':      language,
  };
}

List<Book> getFromRawJsonWeb(Map<String, dynamic> jsonResponse) {
  List<Book> books = new List<Book>();
  dynamic items = jsonResponse['items'];
  for (int i =0; i < items.length; i++)
  {
    books.add(Book.fromJsonWeb(items[i]));
  }
  return books;
}