import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';

import '../objects/Books.dart';
import 'bookWidget.dart';

class BookContainer extends StatelessWidget{
  BookContainer({@required this.info, @required this.refreshFunc} );
  final Book info;
  final Function refreshFunc;

  @override
  Widget build(BuildContext context) {
    return FlatButton(
      padding: EdgeInsets.all(4),
      child:
        CachedNetworkImage(
          imageUrl: info.thumbnail,
          placeholder: (context, url) => CircularProgressIndicator(),
          errorWidget: (context, url, error) => Icon(Icons.error),
        ),
        onPressed: () =>
          Navigator.push(context, MaterialPageRoute(builder: (context) => BookWidget(bookInfo: info))).then( (res) {
            refreshFunc();
          })
    );
  }

}