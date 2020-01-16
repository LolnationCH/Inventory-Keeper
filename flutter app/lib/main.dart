import 'package:flutter/material.dart';
import 'package:inventory_keeper/view/bookWidgetEditor.dart';

import 'dialogs.dart';
import 'objects/Books.dart';
import 'view/barcodeScanner.dart';
import 'view/catalog.dart';
import 'queries/SaveFile.dart';
import 'queries/LocalServer.dart';

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

  Widget _makeHomePage() => Column(
    children: <Widget>[
      Expanded(
        flex: 1,
        child:Text(''),
      ),
      Expanded(
        flex: 4,
        child:_makeHomePageGrid()
      ),
      Expanded(
        flex: 1,
        child:Text(''),
      ),
    ],
  );

  GridView _makeHomePageGrid() => GridView.count(
    crossAxisCount: 2,
    crossAxisSpacing: 7.5,
    mainAxisSpacing: 7.5,
    children: <Widget>[
      FlatButton(
        child: Text("Scan the book"),
        textColor: Colors.white,
        color: Colors.green,
        padding: EdgeInsets.all(8.0),
        onPressed: (){
          _scanAdd(context);
        },
      ),
      FlatButton(
        child: Text("Browse the catalog"),
        color: Colors.blue,
        textColor: Colors.white,
        padding: EdgeInsets.all(8.0),
        onPressed: (){
          _browseCatalog(context);
        },
      ),
      FlatButton(
        child: Text("Manually Add"),
        textColor: Colors.white,
        color: Colors.orange,
        padding: EdgeInsets.all(8.0),
        onPressed: (){
          _manualAdd(context);
        },
      ),
      FlatButton(
        child: Text("Force-Download with server"),
        color: Colors.cyan,
        textColor: Colors.white,
        padding: EdgeInsets.all(8.0),
        onPressed: (){
          showChoiceDialog(context, "Sync with server", "Upload or download from server?",
          () {
            _uploadWithServer(context);
          },
          (){
            _downloadWithServer(context);
          },
          yesButtonLabel: "Upload",
          noButtonLabel:  "Download");
        },
      ),
    ],
  );

  ListView _makeDrawerListView() => ListView(
    padding: EdgeInsets.zero,
    children: <Widget>[
      DrawerHeader(
        child: Align(
          alignment: Alignment.center,
          child: Text('Inventory Keeper'),
        ),
        decoration: BoxDecoration(
          color: Colors.purple[400],
        ),
      ),
      ListTile(
        leading: Icon(Icons.add),
        title: Text('Scan add'),
        onTap: () {
          Navigator.pop(context);
          _scanAdd(context);
        },
      ),
      ListTile(
        leading: Icon(Icons.add_box),
        title: Text('Manual add'),
        onTap: () {
          Navigator.pop(context);
          _manualAdd(context);
        },
      ),
      ListTile(
        leading: Icon(Icons.archive),
        title: Text('Catalog'),
        onTap: () {
          Navigator.pop(context);
          _browseCatalog(context);
        },
      ),
      Divider(),
      Text(
        " Data management",
        style: TextStyle(color: Colors.grey),
      ),
      ListTile(
        leading: Icon(Icons.cloud_download),
        title: Text('Server download'),
        onTap: () {
          Navigator.pop(context);
          _downloadWithServer(context);
        },
      ),
      ListTile(
        leading: Icon(Icons.cloud_upload),
        title: Text('Server upload'),
        onTap: () {
          Navigator.pop(context);
          _uploadWithServer(context);
        },
      ),
      ListTile(
        leading: Icon(Icons.file_upload),
        title: Text('Export to file'),
        onTap: () {
          this.storage.exportBooks();
          _showStatusMessageXXport("Catalog exported!", "The catalog was exported to the file : ");
          Navigator.pop(context);
        },
      ),
      ListTile(
        leading: Icon(Icons.file_download),
        title: Text('Import from file'),
        onTap: () {
          this.storage.importBooks();
          _showStatusMessageXXport("Catalog imported!", "The catalog was imported from the file : ");
          Navigator.pop(context);
        },
      ),
      ListTile(
        leading: Icon(Icons.delete_forever),
        title: Text('Delete'),
        onTap: () {
          Navigator.pop(context);
          _deleteConfirmationDialog();
        },
      ),
    ]
  );

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

        int index = _books.indexWhere((book) => book.id == enteredBook.id);
        if (index == -1)
        {
          _books.add(enteredBook);
          storage.writeBooks(_books);
        }
      }
    });
  }

  void _showStatusMessageXXport(String title, String description){
    this.storage.getExtPath().then((path) {
      showStatusMessage(context, title, description + path);
    });
  }

  void _scanAdd(BuildContext context){
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => BardcodeScanner(storage: this.storage)),
    );
  }

  void _manualAdd(BuildContext context){
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => BookWidgetEditor(bookInfo: Book())),
    ).then((result) {
      _manuelAddBook(result);
    });
  }

  void _browseCatalog(BuildContext context){
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => CatalogWidget(storage: this.storage)),
    );
  }

  void _downloadWithServer(BuildContext context){
    getBookData().then((res) {
      if (res != null)
      {
        List<Book> bookFetched = getFromJson(res);
        this.storage.writeBooks(bookFetched);
        showStatusMessage(context, "Download from server", "Successfully downloaded data from server");
      }
      else
        showErrorMessage(context, "Download from server", "Could not connect to server");
    });
  }

  void _uploadWithServer(BuildContext context){
    this.storage.readBooks().then((books) {
      sendBookData(books).then((response) {
        if (response != null)
          showStatusMessage(context, "Upload from server", "Successfully uploaded to the server");
        else 
          showErrorMessage(context, "Upload from server", "Could not connect to server");
      }).catchError((onError){
        showErrorMessage(context, "Upload from server", "Error $onError");
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      drawer: Drawer(
        child: _makeDrawerListView(),
      ),
      body: _makeHomePage()
    );
  }
}
