import 'dart:convert';
import 'package:uuid/uuid.dart';

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

class Book implements Comparable<Book>{
  String id;
  String title;
  int volumeNumber;
  List<String> authors;
  String publisher;
  String publishedDate;
  String description;
  ISBN identifier = new ISBN('');
  int pageCount;
  String thumbnail = 'https://i.imgur.com/QWa1CA7.png'; // Default to a no Image
  String language;
  String bookType = '';

  String getIdentifier() { return this.identifier.identifier; }
  String getAuthors() { return this.authors.toString().replaceAll('[', '').replaceAll(']', ''); }
  String getVolumeNumber() { return this.volumeNumber == null ? '' : this.volumeNumber.toString(); }
  String getPageCount() { return this.pageCount == null ? '' : this.pageCount.toString(); }
  String getBookType() { return this.bookType == null || this.bookType == 'Not Defined' ? '' : this.bookType; }

  void setIdentifier(String identifier) { this.identifier.identifier = identifier; }
  void setAuthors(String authors) { this.authors = authors.split(','); }
  void setVolumeNumber(String volumeNumber) { this.volumeNumber = int.tryParse(volumeNumber); }
  void setPageCount(String pageCount) { this.pageCount = int.tryParse(pageCount); }

  Book() {
    id = Uuid().v4();
    title = '';
    volumeNumber = 0;
    authors = [''];
    publisher = '';
    publishedDate = '';
    description = '';
    identifier = new ISBN('');
    pageCount = 0;
    thumbnail = 'https://i.imgur.com/QWa1CA7.png'; // Default to a no Image
    language = 'EN';
    bookType = '';
  }

  Book.fromGoogleBookJson(Map<String, dynamic> jsonItem) {
    dynamic volumeInfo = jsonItem["volumeInfo"];

    dynamic industryIdentifiers = volumeInfo["industryIdentifiers"];
    for (int j = 0; j < industryIdentifiers.length; j++)
    {
      if (industryIdentifiers[j]["type"] == ISBN_type[13])
        identifier = new ISBN(industryIdentifiers[j]["identifier"]);
    }

    id = Uuid().v4();
    title           = volumeInfo["title"];
    if (volumeInfo["volumeNumber"] != null)
      volumeNumber  = volumeInfo['volumeNumber'];
    if (volumeInfo["authors"] != null)
      authors       = new List<String>.from(volumeInfo["authors"]);
    if (volumeInfo["publisher"] != null)
      publisher     = volumeInfo["publisher"];
    if (volumeInfo["publishedDate"] != null)
      publishedDate = volumeInfo["publishedDate"];
    if (volumeInfo["description"] != null)
      description   = volumeInfo["description"];
    if (volumeInfo["pageCount"] != null)
      pageCount     = volumeInfo["pageCount"];
    if (volumeInfo["imageLinks"] != null)
      thumbnail     = volumeInfo["imageLinks"]["thumbnail"].replaceAll("&edge=curl", "");
    if (volumeInfo["language"] != null)
      language      = volumeInfo["language"];
  }

  Book.fromJson(Map<String, dynamic> json) : 
    id = json['id'],
    title = json['title'],
    volumeNumber = json['volumeNumber'],
    authors = new List<String>.from(json['authors']),
    publisher = json['publisher'],
    publishedDate = json['publishedDate'],
    description = json['description'],
    identifier = ISBN.fromJson(json['identifier']),
    pageCount = json['pageCount'],
    thumbnail = json['thumbnail'],
    language = json['language'],
    bookType = json['bookType'];

  Map<String, dynamic> toJson() => {
    'id':            id,
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
    'bookType':      bookType,
  };

  @override
  int compareTo(Book other) {
    var sortNumber = 0;
    if (title != null && other.title != null)
      sortNumber = title.compareTo(other.title);
    if (sortNumber == 0 && bookType != null && other.bookType != null)
      sortNumber = bookType.compareTo(other.bookType);
    if (sortNumber == 0 && volumeNumber != null && other.volumeNumber != null)
      sortNumber = volumeNumber.compareTo(other.volumeNumber);
       
    return sortNumber;
  }
}

List<Book> getFromGoogleBookJson(Map<String, dynamic> jsonResponse) {
  List<Book> books = new List<Book>();
  dynamic items = jsonResponse['items'];
  for (int i =0; i < items.length; i++)
  {
    books.add(Book.fromGoogleBookJson(items[i]));
  }
  return books;
}

List<Book> getFromJson(List<dynamic> jsonRes) {
  List<Book> books = new List<Book>();
  for (int i =0; i < jsonRes.length; i++)
  {
    books.add(Book.fromJson(jsonRes[i]));
  }
  return books;
}

String getToJson(List<Book> books) {
  return jsonEncode(books);
}