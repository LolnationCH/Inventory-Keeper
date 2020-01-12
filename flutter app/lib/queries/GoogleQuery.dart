import 'dart:async';
import 'dart:convert';
import 'package:http/http.dart' as http;

String queryAPI = 'https://www.googleapis.com/books/v1/volumes?q=isbn';

Future<dynamic> getBookData(String ISBN) async {
    var response = await http.get(
    Uri.encodeFull(queryAPI + ISBN),
    headers: {"Accept": "application/json"}); 
    return json.decode(response.body);
}