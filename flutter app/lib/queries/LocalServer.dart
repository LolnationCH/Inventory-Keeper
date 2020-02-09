import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:localstorage/localstorage.dart';

String getServerUrl() {
  final String queryAPI = 'http://192.168.1.100:6969';
  final LocalStorage storage = new LocalStorage('settings');
  var url = storage.getItem('serverUrl');
  if (url == null || url == ''){
    storage.setItem('serverUrl', queryAPI);
    return queryAPI + '/api/books';
  }
  return url + '/api/books';
}

Future<dynamic> getBookData() async {
  try {
    var response = await http.get(
    Uri.encodeFull(getServerUrl()),
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
      Uri.encodeFull(getServerUrl()),
      headers: {HttpHeaders.contentTypeHeader : "application/json"},
      body: json.encode(books)
    );
    res = response;
  } on SocketException {
    return null;
  }
  return res;
}