import 'package:flutter/material.dart';
import 'package:qr_mobile_vision/qr_camera.dart';

import '../objects/Books.dart';
import '../queries/GoogleQuery.dart';
import '../queries/SaveFile.dart';

import 'selectBook.dart';


class BardcodeScanner extends StatefulWidget {
  final JsonStorage storage;

  BardcodeScanner({Key key, @required this.storage}) : super(key: key);

  final String title = "Barcode Scanner";
  @override
  _BardcodeScanner createState() => _BardcodeScanner();
}

class _BardcodeScanner extends State<BardcodeScanner>{
  String _isbnScanned = "0";
  Set<String> _isbnSet = new Set<String>();
  List<Book> _books;

  void init() async {
    dynamic books = await widget.storage.readBooks();
    if (books == null || books.length == 0)
      _books = new List<Book>();
    else{
      _books = new List<Book>();
      for (int i = 0; i< books.length; i++)
        _books.add(Book.fromJson(books[i]));
    }
    _isbnSet.addAll(_books.map((book) => book.getIdentifier() ));
  }

  String getISBNRepresentation(String code){
    if (code.length == 13)
      return code.substring(0,3) + "-" + code.substring(3,4) + "-" + code.substring(4,10) + "-" + code.substring(10,12) + "-" + code.substring(12,13);
    else if (code.length == 10)
      return code.substring(0,1) + "-" + code.substring(1,6) + "-" + code.substring(6,10) + "-" + code.substring(10,11);
    return "Erreur, ISBN can only be either 13 or 10 number long";
  }

  void _noBookFound(String code){
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: new Text("No book found"),
          content: new Text("No book was found for the ISBN \"${code}\""),
          actions: <Widget>[
            new FlatButton(
              color: Colors.green,
              textColor: Colors.white,
              disabledColor: Colors.grey,
              disabledTextColor: Colors.black,
              padding: EdgeInsets.all(8.0),
              child: new Text("Ok"),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }

  void _confirmAddition(String code, Map<String, dynamic> response) {
    dynamic items = response['items'];
    if (items.length == 0)
    {
      _noBookFound(code);
      return;
    }

    Book temp = Book.fromRawJsonWeb(code, response);
    
    if (temp.title == null)
    {
      Navigator.push(
        context, 
        MaterialPageRoute(builder: (context) => BookSelector(books: getFromRawJsonWeb(response))),
      ).then((result) {
        if (result != null)
        {
          if (_books.indexWhere((book) => book.getIdentifier() == result.getIdentifier()) == -1)
          {
            result.setIdentifier(code);
            _books.add(result);
            widget.storage.writeBooks(_books);
          }
        }
        Navigator.of(context).pop();
      });
    }
    else {
      showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            title: new Text("Add book to catalog"),
            content: new Text("Are you sure you want to add ${temp.title} to your catalog?"),
            actions: <Widget>[
              new FlatButton(
                color: Colors.green,
                textColor: Colors.white,
                disabledColor: Colors.grey,
                disabledTextColor: Colors.black,
                padding: EdgeInsets.all(8.0),
                child: new Text("Yes"),
                onPressed: () {
                  _books.add(temp);
                  widget.storage.writeBooks(_books);
                  Navigator.of(context).pop();
                },
              ),
              new FlatButton(
                color: Colors.red,
                textColor: Colors.white,
                disabledColor: Colors.grey,
                disabledTextColor: Colors.black,
                padding: EdgeInsets.all(8.0),
                child: new Text("No"),
                onPressed: () {
                  _isbnSet.remove(code);
                  Navigator.of(context).pop();
                },
              ),
            ],
          );
        },
      );
    }
  }

  void _scanAlert(String code) {
    Book temp = _books[_books.indexWhere((book) => book.getIdentifier() == code)];
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: new Text("Book is already in catalog"),
          content: new Text("The book \"${temp.title}\" is already in your catalog."),
          actions: <Widget>[
            new FlatButton(
              color: Colors.blue,
              textColor: Colors.white,
              disabledColor: Colors.grey,
              disabledTextColor: Colors.black,
              padding: EdgeInsets.all(8.0),
              child: new Text("Ok"),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }

  void _scanCode(code){
    setState(() {
      _isbnScanned = getISBNRepresentation(code);
    });

    if (!_isbnSet.contains(code))
    {
      _isbnSet.add(code);
      getBookData(code).then( (response) {
        _confirmAddition(code, response);
      });
    }
    else {
      _scanAlert(code);
    }
  }
  
  @override
  void initState() {
    super.initState();
    init();
  }

  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Center(
        child :SingleChildScrollView(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              Text(
                '$_isbnScanned',
                style: Theme.of(context).textTheme.display1,
              ),
              new SizedBox(
                width: 300.0,
                height: 300.0,
                child: new QrCamera(
                  qrCodeCallback: (code) {
                    _scanCode(code);
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}