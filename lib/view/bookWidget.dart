import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';

import '../objects/Books.dart';

import 'bookWidgetEditor.dart';

class BookWidget extends StatelessWidget
{
  BookWidget({@required this.bookInfo});
  final Book bookInfo;

  List<Widget> getGenericInfo() => [
    Align(
      alignment: Alignment.centerLeft,
      child: Text('Author(s) : ' + bookInfo.authors.toString(), style: TextStyle(fontSize: 25),)
    ),
    Align(
      alignment: Alignment.centerLeft,
      child: Text('Volume : ' + (bookInfo.volumeNumber == null ? 'None' : bookInfo.volumeNumber.toString()), style: TextStyle(fontSize: 25))
    ),
    Align(
      alignment: Alignment.centerLeft,
      child: Text('Publisher : ' + bookInfo.publisher, style: TextStyle(fontSize: 25))
    ),
    Align(
      alignment: Alignment.centerLeft,
      child: Text('Published Date : ' + bookInfo.publishedDate, style: TextStyle(fontSize: 25))
    ),
    Align(
      alignment: Alignment.centerLeft,
      child: Text('Page Count : ' + bookInfo.pageCount.toString(), style: TextStyle(fontSize: 25))
    ),
    Align(
      alignment: Alignment.centerLeft,
      child: Text('Language : ' + bookInfo.language, style: TextStyle(fontSize: 25))
    ),
  ];

  List<Widget> getImportantInfo() => [
    Text(bookInfo.title, style: TextStyle(fontSize: 30, fontWeight: FontWeight.bold)),
    Text(''),
    Text(bookInfo.description, style: TextStyle(fontSize: 20))
  ];

  CachedNetworkImage getBookImage() => CachedNetworkImage(
    imageUrl: bookInfo.thumbnail,
    placeholder: (context, url) => CircularProgressIndicator(),
    errorWidget: (context, url, error) => Icon(Icons.error),
  );

  AppBar getAppBar(BuildContext context) => AppBar(
    title: Text(bookInfo.title),
    actions: <Widget>[
      IconButton(
        icon: Icon(Icons.edit),
        tooltip: 'Edit fields',
        onPressed: () {
          // Launch a new scaffold allowing to modify the book
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => BookWidgetEditor(bookInfo: bookInfo)),
          );
        }
      ),
    ],
  );
  
  Scaffold getLandscapeScaffold(BuildContext context){
    return Scaffold(
      appBar: getAppBar(context),
      body: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: <Widget>[
          getBookImage(),
          Flexible(
            child: ListView(
              children: <Widget>[
                Column(children: getImportantInfo())
              ] + getGenericInfo()
          ))
        ],
      )
    );
  }
  
  Scaffold getPotraitScaffold(BuildContext context){
    return Scaffold(
      appBar: getAppBar(context),
      body: SingleChildScrollView(
        child: Container(
          margin: EdgeInsets.all(6),
          child: Column(
            children:<Widget>[
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children:<Widget>[
                  getBookImage(),
                  Expanded(
                    child:Container(
                      margin: EdgeInsets.only(left: 6),
                      child:Column( children: getImportantInfo())
                    )
                  )
                ]
              ),
              Column(
                children: getGenericInfo()
              )
            ]
          )
        )
      )
    );
  }

  @override
  Widget build(BuildContext context) {
    return OrientationBuilder(
      builder: (context, orientation) {
          if (orientation == Orientation.landscape)
            return getLandscapeScaffold(context);
          else
            return getPotraitScaffold(context);
      }
    );
  }
}