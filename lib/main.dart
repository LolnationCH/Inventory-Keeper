import 'package:flushbar/flushbar.dart';
import 'package:flutter/material.dart';
import 'package:inventory_keeper/view/bookWidgetEditor.dart';

import 'dialogs.dart';
import 'objects/Books.dart';
import 'view/barcodeScanner.dart';
import 'view/catalog.dart';
import 'queries/SaveFile.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Inventory Keeper',
      theme: ThemeData(),
      darkTheme: ThemeData.dark(),
      themeMode: ThemeMode.dark,
      home: MyHomePage(title: 'Inventory Keeper Home Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  MyHomePage({Key key, this.title}) : super(key: key);

  final String title;

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  
  JsonStorage storage = new JsonStorage();

  void _deleteConfirmationDialog() {
    showChoiceDialog(context, "Delete book catalog", "Are you sure you want to delete all of your books? This action is irreversible!",
    () {
      this.storage.deleteBooks();
      Navigator.of(context).pop();
    },
    () {
      Navigator.of(context).pop();
    });
  }

  void _manuelAddBook(Book enteredBook){
    if (enteredBook == null || enteredBook.title.isEmpty || enteredBook.getIdentifier().isEmpty)
      return;

    JsonStorage storage = new JsonStorage();
    List<Book> _books = new List<Book>();
    
    storage.readBooks().then((books) {
      if (books != null && books.length != 0)
      {
        _books = new List<Book>();
        for (int i = 0; i< books.length; i++)
          _books.add(Book.fromJson(books[i]));

        int index = _books.indexWhere((book) => book.getIdentifier() == enteredBook.getIdentifier());
        if (index == -1)
        {
          _books.add(enteredBook);
          storage.writeBooks(_books);
        }
      }
    });
  }

  void _showStatusMessage(String title, String description){
    this.storage.getExtPath().then((path) {
      Flushbar(
        title: title,
        message: description + path,
        duration:  Duration(seconds: 5),              
        icon: Icon(
          Icons.info_outline,
          size: 28.0,
          color: Colors.blue[300],
        ),
        leftBarIndicatorColor: Colors.blue[300],
      )..show(context);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            new FlatButton(
              child: Text("Manual add"),
              textColor: Colors.white,
              color: Colors.green,
              padding: EdgeInsets.all(8.0),
              onPressed: (){
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => BookWidgetEditor(bookInfo: Book())),
                ).then((result) {
                  _manuelAddBook(result);
                });
              },
            ),
            new FlatButton(
              child: Text("Catalog"),
              color: Colors.blue,
              textColor: Colors.white,
              padding: EdgeInsets.all(8.0),
              onPressed: (){
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => CatalogWidget(storage: this.storage)),
                );
              },
            ),
            new FlatButton(
              child: Text("Export"),
              color: Colors.yellow,
              textColor: Colors.black,
              padding: EdgeInsets.all(8.0),
              onPressed: (){
                this.storage.exportBooks();
                _showStatusMessage("Catalog exported!", "The catalog was exported to the file : ");
              },
            ),
            new FlatButton(
              child: Text("Import"),
              color: Colors.purple,
              textColor: Colors.white,
              padding: EdgeInsets.all(8.0),
              onPressed: (){
                this.storage.importBooks();
                _showStatusMessage("Catalog imported!", "The catalog was imported from the file : ");
              },
            ),
            new FlatButton(
              child: Text("Delete"),
              color: Colors.red,
              textColor: Colors.white,
              padding: EdgeInsets.all(8.0),
              onPressed: (){
                _deleteConfirmationDialog();
              },
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => BardcodeScanner(storage: this.storage)),
          );
        },
        child: Icon(Icons.add),
        backgroundColor: Colors.green,
        foregroundColor: Colors.white,
      ),
    );
  }
}
