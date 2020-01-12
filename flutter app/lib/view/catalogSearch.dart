import 'package:flutter/material.dart';
import 'package:inventory_keeper/objects/Books.dart';
import 'package:inventory_keeper/view/bookWidget.dart';

class CatalogSearch extends SearchDelegate<String> {

  final List<Book> _books;
  dynamic field;

  CatalogSearch(this._books);

  @override
   ThemeData appBarTheme(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    return theme.copyWith(
      primaryColor: Colors.black,
      primaryIconTheme: theme.primaryIconTheme.copyWith(color: Colors.grey),
      primaryColorBrightness: Brightness.light,
      primaryTextTheme: theme.textTheme,
    );
   }

  @override
  List<Widget> buildActions(BuildContext context) {
    //Actions for app bar
    return [
      IconButton(
        icon: Icon(Icons.clear), 
        onPressed: () {
        query = '';
        }
      )
    ];
  }

  @override
  Widget buildLeading(BuildContext context) {
    return IconButton(
        icon: AnimatedIcon(
          icon: AnimatedIcons.menu_arrow,
          progress: transitionAnimation,
        ),
        onPressed: () {
          close(context, null);
        }
    );
  }

  @override
  Widget buildResults(BuildContext context) {
    // show some result based on the selection
    // Doesn't seem to be used...
    final suggestionList = _books;

    return ListView.builder(itemBuilder: (context, index) => ListTile(

      title: Text(_books[index].title),
      subtitle: Text(_books[index].getIdentifier()),
    ),
      itemCount: suggestionList.length,
    );
  }

  @override
  Widget buildSuggestions(BuildContext context) {
    // show when someone searches for something
    final suggestionList = query.isEmpty
        ? _books
        : _books.where((p) => p.title.contains(RegExp(query, caseSensitive: false))).toList();


    return ListView.builder(itemBuilder: (context, index) => ListTile(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => BookWidget(bookInfo: suggestionList[index])
          ),
        );
      },
      trailing: Icon(Icons.remove_red_eye),
      title: RichText(
        text: TextSpan(
            text: suggestionList[index].title.substring(0, query.length),
            style: TextStyle(
                color: Colors.orange, fontWeight: FontWeight.bold),
            children: [
              TextSpan(
                  text: suggestionList[index].title.substring(query.length),
                  style: TextStyle(color: Colors.grey)),
            ]),
      ),
    ),
      itemCount: suggestionList.length,
    );
  }
}