import 'dart:async';
import 'dart:convert';
import 'package:http/http.dart' as http;

Future<dynamic> getGoogleBookData(String isbn) async {
  const String queryAPI = 'https://www.googleapis.com/books/v1/volumes?q=isbn';
  var response = await http.get(
    Uri.encodeFull(queryAPI + isbn),
    headers: {"Accept": "application/json"}
  );

  return json.decode(response.body);
}

Future<dynamic> getOpenLibraryData(String isbn) async {
  const String queryAPI = 'https://openlibrary.org/api/books?bibkeys=ISBN:';
  const String endQueryAPI = '&jscmd=details&format=json';
  var response = await http.get(
    Uri.encodeFull(queryAPI + isbn + endQueryAPI),
    headers: {"Accept": "application/json"}
  );

  return json.decode(response.body);
}