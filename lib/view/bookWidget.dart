import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:inventory_keeper/queries/SaveFile.dart';

import '../objects/Books.dart';

import 'bookWidgetEditor.dart';

class BookWidget extends StatefulWidget
{
  BookWidget({@required this.bookInfo});
  final Book bookInfo;

  @override
  _BookWidget createState() => _BookWidget();
}

class _BookWidget extends State<BookWidget>
{
  Book bookShown;

  @override
  void initState(){
    super.initState();
    bookShown = widget.bookInfo;
  }

  List<Widget> getGenericInfo() => [
    Align(
      alignment: Alignment.centerLeft,
      child: Text('Author(s) : ' + bookShown.getAuthors(), style: TextStyle(fontSize: 25)),
    ),
    Align(
      alignment: Alignment.centerLeft,
      child: Text('Volume : ' + bookShown.getVolumeNumber(), style: TextStyle(fontSize: 25)),
    ),
    Align(
      alignment: Alignment.centerLeft,
      child: Text('Publisher : ' + bookShown.publisher, style: TextStyle(fontSize: 25))
    ),
    Align(
      alignment: Alignment.centerLeft,
      child: Text('Published Date : ' + bookShown.publishedDate, style: TextStyle(fontSize: 25))
    ),
    Align(
      alignment: Alignment.centerLeft,
      child: Text('Page Count : ' + bookShown.getPageCount(), style: TextStyle(fontSize: 25))
    ),
    Align(
      alignment: Alignment.centerLeft,
      child: Text('Language : ' + bookShown.language, style: TextStyle(fontSize: 25))
    ),
    Align(
      alignment: Alignment.centerLeft,
      child: Text('ISBN : ' + bookShown.identifier.getIdentifierVisual(), style: TextStyle(fontSize: 25))
    ),
  ];

  List<Widget> getImportantInfo() => [
    Text(bookShown.title, style: TextStyle(fontSize: 30, fontWeight: FontWeight.bold)),
    Text(''),
    Text(bookShown.description, style: TextStyle(fontSize: 20))
  ];

  CachedNetworkImage getBookImage() => CachedNetworkImage(
    imageUrl: bookShown.thumbnail,
    placeholder: (context, url) => CircularProgressIndicator(),
    errorWidget: (context, url, error) => Icon(Icons.error),
  );

  AppBar getAppBar(BuildContext context) => AppBar(
    title: Text(bookShown.title),
    actions: <Widget>[
      IconButton(
        icon: Icon(Icons.edit),
        tooltip: 'Edit fields',
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => BookWidgetEditor(bookInfo: bookShown)),
          ).then((result) {
            JsonStorage storage = new JsonStorage();
            List<Book> _books = new List<Book>();
            Book editedBook = result;
            storage.readBooks().then((books) {
              if (books != null && books.length != 0)
              {
                _books = new List<Book>();
                for (int i = 0; i< books.length; i++)
                  _books.add(Book.fromJson(books[i]));

                int index = _books.indexWhere((book) => book.getIdentifier() == widget.bookInfo.getIdentifier());
                if (index != -1)
                  _books.removeAt(index);

                _books.add(editedBook);

                storage.writeBooks(_books);
              }
            });
            bookShown = editedBook;
          });
        }
      ),
    ],
  );
  
  Scaffold getLandscapeScaffold(BuildContext context){
    return Scaffold(
      appBar: getAppBar(context),
      body: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: <Widget>[
          getBookImage(),
          Flexible(
            child: ListView(
              children: <Widget>[
                Column(children: getImportantInfo())
              ] + getGenericInfo()
          ))
        ],
      )
    );
  }
  
  Scaffold getPotraitScaffold(BuildContext context){
    return Scaffold(
      appBar: getAppBar(context),
      body: SingleChildScrollView(
        child: Container(
          child: Column(
            children:<Widget>[
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children:<Widget>[
                  getBookImage(),
                  Expanded(
                    child:Container(
                      child:Column( children: getImportantInfo())
                    )
                  )
                ]
              ),
              Column(
                children: getGenericInfo()
              )
            ]
          )
        )
      )
    );
  }

  @override
  Widget build(BuildContext context) {
    return OrientationBuilder(
      builder: (context, orientation) {
          if (orientation == Orientation.landscape)
            return getLandscapeScaffold(context);
          else
            return getPotraitScaffold(context);
      }
    );
  }
}