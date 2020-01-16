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

  bool sortTitleAsc = true;
  bool sortLangAsc = true;
  bool sortTypeAsc = true;

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

  void hitSortByTitle() {
    _sortByProps(sortTitleAsc, "title");
    sortTitleAsc = !sortTitleAsc;
  }

  void hitSortByLang() {
    _sortByProps(sortTitleAsc, "language");
    sortLangAsc = !sortLangAsc;
  }

  void hitSortByType() {
    _sortByProps(sortTypeAsc, "bookType");
    sortTypeAsc = !sortTypeAsc;
  }

  void setupBooksContainer(){
    _booksContainer = new List<BookContainer>();
    if (_books == null) return;
    for (int i = 0; i < _books.length; i++)
      _booksContainer.add(new BookContainer(info : _books[i], refreshFunc: (){
        initBooks();
        _sortByProps(sortTitleAsc, "title");
        _sortByProps(sortLangAsc, "language");
        _sortByProps(sortTypeAsc, "bookType");
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
        IconButton(
          icon: Icon(Icons.refresh),
          tooltip: 'Refresh the book shown',
          onPressed: initBooks,
        ),
        IconButton(
          icon: Icon(Icons.sort),
          tooltip: 'Sort by title',
          onPressed: hitSortByTitle
        ),
        IconButton(
          icon: Icon(Icons.sort_by_alpha),
          tooltip: 'Sort by language',
          onPressed: hitSortByLang
        ),
        IconButton(
          icon: Icon(Icons.sort),
          tooltip: 'Sort by type',
          onPressed: hitSortByType
        )
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