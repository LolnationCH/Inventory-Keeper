import 'package:flutter/material.dart';

import 'bookContainer.dart';

import '../objects/Books.dart';

class BookSelector extends StatefulWidget {
  final List<Book> books;
  BookSelector({Key key, @required this.books}) : super(key: key);
@override
  _BookSelector createState() => _BookSelector();
}

class _BookSelector extends State<BookSelector> {
  List<Widget> bookWidgets = new List<Widget>();

  Widget createBookButton(BuildContext context, Book book)
  {
    Column row = new Column(
      children: <Widget>[
        BookContainer(info : book, refreshFunc: (){},),
        Text(book.title),
        FlatButton(
          color: Colors.blue,
          textColor: Colors.white,
          padding: EdgeInsets.all(8.0),
          child: Text("Select"),
          onPressed: () => Navigator.of(context).pop(book),
        ),
      ],
    );
    return row;
  }

  List<Widget> createBookButtons(BuildContext context)
  {
    List<Widget> buttons = new List<Widget>();
    for (int i=0; i< widget.books.length; i++)
      buttons.add(createBookButton(context, widget.books[i]));
    return buttons;
  }

  @override
  initState()
  {
    super.initState();
    setState(() {
      bookWidgets = createBookButtons(context);
    });
  }

  Widget build(BuildContext context) {
      return Scaffold(
        appBar: AppBar(
          title: Text("Select a book"),
        ),
        body: Center(
          child: SingleChildScrollView(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: bookWidgets
            ),
          ),
        ),
      );
  }
}