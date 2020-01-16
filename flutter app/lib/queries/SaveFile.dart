import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:path_provider/path_provider.dart';

import '../objects/Books.dart';

class JsonStorage {
  Future<String> get _externalPath async {
    final directory = await getExternalStorageDirectory();
    return directory.path;
  }

  Future<File> get _extDataFile async {
    final path = await _externalPath;
    return File('$path/data.json');
  }

  Future<String> get _localPath async {
    final directory = await getApplicationDocumentsDirectory();

    return directory.path;
  }

  Future<File> get _dataFile async {
    final path = await _localPath;
    return File('$path/data.json');
  }

  Future<dynamic> readBooks() async {
    try {
      final file = await _dataFile;

      // Read the file
      String contents = await file.readAsString();
      return json.decode(contents);
    }
    catch(e){
      return null;
    }
  }

  Future<File> writeBooks(List<Book> books) async {
    if (books == null) return null;
    final file = await _dataFile;

    // Write the file
    List<Map<String, dynamic>> temp = books.map((Book book) => book.toJson()).toList();
    return file.writeAsString(json.encode(temp));
  }

  Future<File> exportBooks() async {
    try {
      final file = await _dataFile;
      final extFile = await _extDataFile;

      // Read the file
      String contents = await file.readAsString();
      return extFile.writeAsString(contents);
    }
    catch(e){
      return null;
    }
  }

  Future<File> importBooks() async {
    try {
      final file = await _dataFile;
      final extFile = await _extDataFile;

      // Read the file
      String contents = await extFile.readAsString();
      return file.writeAsString(contents);
    }
    catch(e){
      return null;
    }
  }

  Future<FileSystemEntity> deleteBooks() async {
    final file = await _dataFile;
    return file.delete();
  }

  Future<String> getExtPath() async {
    File file = await _extDataFile;
    return file.path;
  }
}