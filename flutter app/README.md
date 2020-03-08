# inventory_keeper

For icons:

```bash
flutter pub get
flutter pub run flutter_launcher_icons:main
```

For release :

[Android](https://flutter.dev/docs/deployment/android)

```bash
flutter build apk --split-per-abi
```

To install to phone from pc :

```bash
flutter clean
flutter build apk --release
flutter install
```