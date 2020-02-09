import 'package:flutter/material.dart';
import 'package:qr_mobile_vision/qr_camera.dart';

import '../dialogs.dart';
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

  bool hasScanned = false;

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

  void _confirmAddition(String code, Map<String, dynamic> response) {
    dynamic items = response['items'];
    if (items == null || items.length == 0)
    {
      showBasicDialog(context, "No book found", "No book was found for the ISBN \"$code\"",
      onOkPressed: () {
        hasScanned = false;
        _isbnSet.remove(code);
        Navigator.of(context).pop();
      });
      return;
    }

    List<Book> books = getFromGoogleBookJson(response);
    try
    {
      Book book = books.singleWhere( (x) => x.getIdentifier() == code);
      showChoiceDialog(context, "Add book to catalog", "Are you sure you want to add ${book.title} to your catalog?",
        () {
          _books.add(book);
          widget.storage.writeBooks(_books);
          hasScanned = false;
          Navigator.of(context).pop();
        },
        () {
          _isbnSet.remove(code);
          hasScanned = false;
          Navigator.of(context).pop();
        }
        );
    }
    catch (e)
    {
      Navigator.push(
        context, 
        MaterialPageRoute(builder: (context) => BookSelector(books: books)),
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
        hasScanned = false;
        Navigator.of(context).pop();
      });
    }
  }

  void _scanAlert(String code) {
    int index = _books.indexWhere((book) => book.getIdentifier() == code);
    if (index == -1)
    {
      showBasicDialog(context, "No book found", "No book was found for the ISBN \"$code\"",
      onOkPressed: () {
        hasScanned = false;
        _isbnSet.remove(code);
        Navigator.of(context).pop();
      });
    }
    else
    {
      Book temp = _books[index];
      showBasicDialog(context, "Book is already in catalog", "The book \"${temp.title}\" is already in your catalog.",
        onOkPressed: () {
          hasScanned = false;
          Navigator.of(context).pop();
      });
    }
  }

  void _scanCode(code){
    if (hasScanned) return;
    hasScanned = true;
    
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