import 'package:flutter/material.dart';
import 'package:inventory_keeper/view/bookContainer.dart';

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

  void sortBookByPropsAsc(String props){
    _books.sort((a, b) => a.toJson()[props].compareTo(b.toJson()[props]));
    setupBooksContainer();
  }

  void sortBookByPropsDsc(String props){
    _books.sort((b, a) => a.toJson()[props].compareTo(b.toJson()[props]));
    setupBooksContainer();
  }

  void hitSortByTitle(){
    if (sortTitleAsc){
      sortTitleAsc = false;
      sortBookByPropsDsc("title");
    }
    else{
      sortTitleAsc = true;
      sortBookByPropsAsc("title");
    }
  }

  void hitSortByLang(){
    if (sortLangAsc){
      sortLangAsc = false;
      sortBookByPropsDsc("language");
    }
    else{
      sortLangAsc = true;
      sortBookByPropsAsc("language");
    }
  }

  void setupBooksContainer(){
    _booksContainer = new List<BookContainer>();
    if (_books == null) return;
    for (int i = 0; i < _books.length; i++)
      _booksContainer.add(new BookContainer(info : _books[i]));

    setState(() {
      _booksContainer  =_booksContainer;
    });
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
      }),
    );
  }

  AppBar createAppBar(){
    return AppBar(
      title: Text(title + " (${_booksContainer.length})"),
      actions: <Widget>[
        IconButton(
          icon: Icon(Icons.sort),
          tooltip: 'Sort by title',
          onPressed: () {
            hitSortByTitle();
          }
        ),
        IconButton(
          icon: Icon(Icons.sort_by_alpha),
          tooltip: 'Sort by language',
          onPressed: () {
            hitSortByLang();
          }
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