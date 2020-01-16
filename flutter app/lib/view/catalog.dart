import 'package:flutter/material.dart';
import 'package:inventory_keeper/view/bookContainer.dart';
import 'package:inventory_keeper/view/catalogSearch.dart';

import '../objects/Books.dart';
import '../queries/SaveFile.dart';

class CatalogWidget extends StatefulWidget
{
  final JsonStorage storage;
  CatalogWidget({Key key, @required this.storage}) : super(key: key);
  
  @override
  _CatalogWidget createState() => _CatalogWidget();
}
class _CatalogWidget extends State<CatalogWidget>
{
  final String title = "Books";
  List<Book> _books;
  List<BookContainer> _booksContainer;

  Map<String, bool> sortAscMap = {
    "title" : false,
    "language" : false,
    "bookType" : false
  };
  String lastHit = "title";

  bool allFalseSort() => sortAscMap.values.where((val) => val == true).length == 0;

  void sortBookByPropsAsc(String props){
    _books.sort((a, b) => a.toJson()[props].compareTo(b.toJson()[props]));
    setupBooksContainer();
  }

  void sortBookByPropsDsc(String props){
    _books.sort((b, a) => a.toJson()[props].compareTo(b.toJson()[props]));
    setupBooksContainer();
  }

  void _sortByProps(bool condition, String props) {
    if (condition)
      sortBookByPropsDsc(props);
    else
      sortBookByPropsAsc(props);
  }

  void setupBooksContainer(){
    _booksContainer = new List<BookContainer>();
    if (_books == null) return;
    for (int i = 0; i < _books.length; i++)
      _booksContainer.add(new BookContainer(info : _books[i], refreshFunc: (){
        initBooks();
        _sortByProps(sortAscMap['title']   , "title");
        _sortByProps(sortAscMap['language'], "language");
        _sortByProps(sortAscMap['bookType'], "bookType");
      }));

    setState(() {
      _booksContainer  =_booksContainer;
    });
  }

  void initBooks() async{
    dynamic books = await widget.storage.readBooks();
    if (books == null || books.length == 0)
      _books = new List<Book>();
    else{
      _books = new List<Book>();
      for (int i = 0; i< books.length; i++)
        _books.add(Book.fromJson(books[i]));
    }

    setupBooksContainer();
  }

  void init() async{
    dynamic books = await widget.storage.readBooks();
    if (books == null || books.length == 0)
      _books = new List<Book>();
    else{
      _books = new List<Book>();
      for (int i = 0; i< books.length; i++)
        _books.add(Book.fromJson(books[i]));
    }

    sortBookByPropsAsc("title");
  }

  @override
  void initState() {
    init();
    super.initState();
  }

  Scaffold createDefaultScaffold(){
    return Scaffold(
      appBar: AppBar(
        title: Text(title + " (0)"),
      ),
      body : Container()
    );
  }

  Scaffold createBookScaffold(){
    return Scaffold(
      appBar: createAppBar(),
      body: OrientationBuilder(
        builder: (context, orientation) {
          return GridView.count(
            crossAxisCount: orientation == Orientation.portrait ? 3 : 7,
            childAspectRatio: 0.80,
            mainAxisSpacing: 0,
            crossAxisSpacing: 0,
            children: _booksContainer
          );
        }
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          showSearch(context: context, delegate: CatalogSearch(_books));
        },
        child: Icon(Icons.search),
        backgroundColor: Colors.deepOrange,
        foregroundColor: Colors.white,
      ),
    );
  }

  AppBar createAppBar(){
    return AppBar(
      title: Text(title + " (${_booksContainer.length})"),
      actions: <Widget>[
        DropdownButton<String>(
          value: allFalseSort() ? "title" : lastHit,
          onChanged: (String selectedValue) {
            setState(() {
              sortAscMap[selectedValue] = !sortAscMap[selectedValue];
              lastHit = selectedValue;
              _sortByProps(sortAscMap[selectedValue], selectedValue);
            });
          },
          items: sortAscMap.keys.map<DropdownMenuItem<String>>((String value) {
            return DropdownMenuItem<String>(
              value: value,
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: <Widget>[
                  Icon(
                    Icons.check,
                    color: sortAscMap[value] ? null : Colors.transparent,
                  ),
                  SizedBox(width: 16),
                  Text(value),
                ],
              ),
            );
            })
            .toList(),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_booksContainer == null || _booksContainer.length == 0)
      return createDefaultScaffold();
    else
      return createBookScaffold();
  }
}