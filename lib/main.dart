import 'package:flutter/material.dart';
import 'package:inventory_keeper/view/bookWidgetEditor.dart';

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
      themeMode: ThemeMode.system,
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
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: new Text("Delete book catalog"),
          content: new Text("Are you sure you want to delete all of your books? This action is irreversible!"),
          actions: <Widget>[
            new FlatButton(
              color: Colors.red,
              textColor: Colors.white,
              padding: EdgeInsets.all(8.0),
              child: new Text("Yes"),
              onPressed: () {
                this.storage.deleteBooks();
                Navigator.of(context).pop();
              },
            ),
            new FlatButton(
              color: Colors.green,
              textColor: Colors.white,
              padding: EdgeInsets.all(8.0),
              child: new Text("No"),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
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
                  if (result != null && result.title.isNotEmpty && result.getIdentifier().isNotEmpty)
                  {
                    JsonStorage storage = new JsonStorage();
                    List<Book> _books = new List<Book>();
                    
                    storage.readBooks().then((books) {
                      if (books != null && books.length != 0)
                      {
                        _books = new List<Book>();
                        for (int i = 0; i< books.length; i++)
                          _books.add(Book.fromJson(books[i]));

                        int index = _books.indexWhere((book) => book.getIdentifier() == result.getIdentifier());
                        if (index == -1)
                        {
                          _books.add(result);
                          storage.writeBooks(_books);
                        }
                      }
                    });
                  }
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
