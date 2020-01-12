
import 'package:flushbar/flushbar.dart';
import 'package:flutter/material.dart';

dynamic showBasicDialog(BuildContext context, String title, String description) {
  return showDialog(
    context: context,
    builder: (BuildContext context) {
      return AlertDialog(
        title: new Text(title),
        content: new Text(description),
        actions: <Widget>[
          new FlatButton(
            color: Colors.green,
            textColor: Colors.white,
            disabledColor: Colors.grey,
            disabledTextColor: Colors.black,
            padding: EdgeInsets.all(8.0),
            child: new Text("Ok"),
            onPressed: () {
              Navigator.of(context).pop();
            },
          ),
        ],
      );
    },
  );
}

dynamic showChoiceDialog(BuildContext context, String title, String description, Function onYesPressed, Function onNoPressed) {
  return showDialog(
    context: context,
    builder: (BuildContext context) {
      return AlertDialog(
        title: new Text(title),
        content: new Text(description),
        actions: <Widget>[
          new FlatButton(
            color: Colors.green,
            textColor: Colors.white,
            disabledColor: Colors.grey,
            disabledTextColor: Colors.black,
            padding: EdgeInsets.all(8.0),
            child: new Text("Yes"),
            onPressed: () {
              onYesPressed();
            },
          ),
          new FlatButton(
            color: Colors.red,
            textColor: Colors.white,
            disabledColor: Colors.grey,
            disabledTextColor: Colors.black,
            padding: EdgeInsets.all(8.0),
            child: new Text("No"),
            onPressed: () {
              onNoPressed();
            },
          ),
        ],
      );
    },
  );
}

void showStatusMessage(BuildContext context, String title, String description){
  Flushbar(
    title: title,
    message: description,
    duration:  Duration(seconds: 5),              
    icon: Icon(
      Icons.info_outline,
      size: 28.0,
      color: Colors.blue[300],
    ),
    leftBarIndicatorColor: Colors.blue[300],
  )..show(context);
}