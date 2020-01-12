import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;

String queryAPI = 'http://192.168.1.100:6969/books';

Future<dynamic> getBookData() async {
  try {
    var response = await http.get(
    Uri.encodeFull(queryAPI),
    headers: {"Accept": "application/json"}); 
    return json.decode(response.body);
  } on SocketException {
    return null;
  }
}

Future<dynamic> sendBookData(dynamic books) async {
  var res;
  try {
    final response = await http.post(
      Uri.encodeFull(queryAPI),
      headers: {HttpHeaders.contentTypeHeader : "application/json"},
      body: json.encode(books)
    );
  } on SocketException {
    return null;
  }
  return res;
}