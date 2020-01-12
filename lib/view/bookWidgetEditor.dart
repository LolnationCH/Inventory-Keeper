import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:inventory_keeper/queries/SaveFile.dart';

import '../objects/Books.dart';

class BookWidgetEditor extends StatefulWidget {
  final Book bookInfo;

  BookWidgetEditor({@required this.bookInfo});

  @override
  _BookWidgetEditor createState() => _BookWidgetEditor();
}

class _BookWidgetEditor extends State<BookWidgetEditor>
{
  TextEditingController titleController;
  TextEditingController descriptionController;
  TextEditingController authorController;
  TextEditingController volumeController;
  TextEditingController publisherController;
  TextEditingController publishedDateController;
  TextEditingController pageCountController;
  TextEditingController languageController;
  TextEditingController isbnController;

  @override
  void initState() {
    super.initState();
    titleController = TextEditingController(text: widget.bookInfo.title);
    descriptionController = TextEditingController(text: widget.bookInfo.description);
    authorController = TextEditingController(text: widget.bookInfo.getAuthors());
    volumeController = TextEditingController(text: widget.bookInfo.getVolumeNumber());
    publisherController = TextEditingController(text: widget.bookInfo.publisher);
    publishedDateController = TextEditingController(text: widget.bookInfo.publishedDate);
    pageCountController = TextEditingController(text: widget.bookInfo.getPageCount());
    languageController = TextEditingController(text: widget.bookInfo.language);
    isbnController = TextEditingController(text: widget.bookInfo.getIdentifier());
  }

  List<Widget> getGenericInfo() => [
    Align(
      alignment: Alignment.centerLeft,
      child: TextField(controller: titleController),
    ),
    Align(
      alignment: Alignment.centerLeft,
      child: TextField(controller: authorController)
    ),
    Align(
      alignment: Alignment.centerLeft,
      child: TextField(
        controller: volumeController,
        keyboardType: TextInputType.number,
        inputFormatters: <TextInputFormatter>[
          WhitelistingTextInputFormatter.digitsOnly
        ]
      )
    ),
    Align(
      alignment: Alignment.centerLeft,
      child: TextField(controller: publisherController)
    ),
    Align(
      alignment: Alignment.centerLeft,
      child: TextField(controller: publishedDateController)
    ),
    Align(
      alignment: Alignment.centerLeft,
      child: TextField(controller: pageCountController,
        keyboardType: TextInputType.number,
        inputFormatters: <TextInputFormatter>[
          WhitelistingTextInputFormatter.digitsOnly
        ]
      )
    ),
    Align(
      alignment: Alignment.centerLeft,
      child: TextField(controller: languageController)
    ),
    Align(
      alignment: Alignment.centerLeft,
      child: TextField(controller: isbnController,
        keyboardType: TextInputType.number,
        inputFormatters: <TextInputFormatter>[
          WhitelistingTextInputFormatter.digitsOnly
        ]
      )
    ),
  ];

  CachedNetworkImage getBookImage() => CachedNetworkImage(
    imageUrl: widget.bookInfo.thumbnail,
    placeholder: (context, url) => CircularProgressIndicator(),
    errorWidget: (context, url, error) => Icon(Icons.error),
    fit: BoxFit.contain
  );

  AppBar getAppBar() => AppBar(
    title: Text("Edit : " + widget.bookInfo.title)
  );

  Book getBookEdited() {
    Book bookEdited = Book.fromJson(widget.bookInfo.toJson());

    bookEdited.title = titleController.text;
    bookEdited.description = descriptionController.text;
    bookEdited.setAuthors(authorController.text);
    bookEdited.setVolumeNumber(volumeController.text);
    bookEdited.publisher = publisherController.text;
    bookEdited.publishedDate = publishedDateController.text;
    bookEdited.setPageCount(pageCountController.text);
    bookEdited.language = languageController.text;
    bookEdited.setIdentifier(isbnController.text);
    
    return bookEdited;
  }

  FlatButton getSaveButton(BuildContext context) => FlatButton(
    child: Text("Save"),
    color: Colors.green,
    textColor: Colors.white,
    onPressed: () {
      Book bookEdited = getBookEdited();
      if (bookEdited.title.isNotEmpty && bookEdited.getIdentifier().isNotEmpty)
        Navigator.of(context).pop(bookEdited);
      else
      {
        showDialog(
          context: context,
          builder: (BuildContext context) {
            return AlertDialog(
              title: new Text("Missing fields"),
              content: new Text("You must provide a value for the title and the ISBN"),
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
    },
  );
  
  Scaffold getLandscapeScaffold(BuildContext context){
    return Scaffold(
      appBar: getAppBar(),
      body: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: <Widget>[
          getBookImage(),
          Flexible(
            child: ListView(
              children: <Widget>[
                Column(children: getGenericInfo()),
                Row(
                  children: <Widget>[
                    Expanded(
                      child: TextField(
                        controller: descriptionController,
                        keyboardType: TextInputType.multiline,
                        maxLines: null,
                      )
                    ),
                  ],
                ),
              ]
          )),
          getSaveButton(context),
        ],
      )
    );
  }
  
  Scaffold getPotraitScaffold(BuildContext context){
    return Scaffold(
      appBar: getAppBar(),
      body: SingleChildScrollView(
        child: Container(
          margin: EdgeInsets.all(6),
          child: Column(
            children:<Widget>[
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children:<Widget>[
                  getBookImage()
                ],
              ),
              Column(
                children: getGenericInfo()
              ),
              Row(
                children: <Widget>[
                  Expanded(
                    child: TextField(
                      controller: descriptionController,
                      keyboardType: TextInputType.multiline,
                      maxLines: null,
                    )
                  ),
                ],
              ),
              getSaveButton(context),
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

  @override
  void dispose(){
    super.dispose();

    // Dispose of the controller
    titleController.dispose();
    descriptionController.dispose();
    authorController.dispose();
    volumeController.dispose();
    publisherController.dispose();
    publishedDateController.dispose();
    pageCountController.dispose();
    languageController.dispose();
    isbnController.dispose();
  }
}