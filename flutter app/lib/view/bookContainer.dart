import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';

import '../objects/Books.dart';
import 'bookWidget.dart';

class BookContainer extends StatelessWidget{
  BookContainer({@required this.info, @required this.refreshFunc} );
  final Book info;
  final Function refreshFunc;

  formatTitle(String title) {
    if (title.length < 30)
      return title;
    
    var curIndex = 27;
    var lastLetter = title[curIndex];
    while (lastLetter != ' ')
    {
      curIndex--;
      if (curIndex == -1)
        return title;
      
      lastLetter = title[curIndex];
    }
    return title.substring(0, curIndex) + '...';
  }

  @override
  Widget build(BuildContext context) {
    return FlatButton(
      padding: EdgeInsets.all(4),
      child:
        Stack(
          alignment: Alignment.bottomCenter,
          children: <Widget>[
            CachedNetworkImage(
              imageUrl: info.thumbnail,
              placeholder: (context, url) => CircularProgressIndicator(),
              errorWidget: (context, url, error) => Icon(Icons.error),
            ),
            Container(
              padding: EdgeInsets.all(5.0),
              alignment: Alignment.bottomCenter,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: <Color>[
                    Colors.black.withAlpha(0),
                    Colors.black26,
                    Colors.black
                  ],
                ),
              ),
              child: Text(
                formatTitle(info.title),
                style: TextStyle(color: Colors.white, fontSize: 12.0),
              ),
            ),
          ],
        ),
      onPressed: () =>
        Navigator.push(context, MaterialPageRoute(builder: (context) => BookWidget(bookInfo: info))).then( (res) {
          refreshFunc();
        })
    );
  }

}