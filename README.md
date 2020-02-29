# Inventory-Keeper

A simple way to keep track of your books.

This project has been started, dropped, restarted about 5 times now.

It's finally mostly done!

## Ok, but what is it?

There are 3 parts : Android App, Webpage and Server.

The Android App can be used in standalone, no need for further stuff, but the Webpage cannot exist without the Server.

## Main Features

- Scan ISBN barcode on books to fetch info. For the webpage, you must input manually a ISBN.
- Modification of the book info in catalog.
- Searching for a specific book in your catalog.
   - App version : Upon scanning a book you already own, the app warns you so.
- Local and network data. No cloud service, you OWN YOUR DATA. (well, Google still know you ask for the information...).
- Allow sync to a computer/phone without connecting your phone to your computer.

## ScreenShot

I do not own the copyrights to the book shown in the screenshots, they are simply examples : [TODO Link]()

## Why you made this/Alternative

I don't know any alternative for my needs right know, feel free to let me know :).

I made this because so far I bought a book I already own, twice (not the same book the second time). I don't really want to repeat this. So with this, I cannot make this mistake again. As soon I buy a book, I add it to the catalog on my phone.

## How to use

The way I recommend using it :

Android App:
- Day to day usage. You scan book and do minimal modification to them.
- Sync with server once home.

Webpage:
- Check new books. Modify info on it, better thumbnail and classification.
- Archive in your backup a copy of the catalog.

## The Android App

The app is made using Flutter (so dart). It's better than JAVA for sure, but still makes me puke when I tried developping for Android.... sigh.

There's still some bugs laying in the app (see the glo board or whatever is called for github to see them). For now they are in the freezer, since they are not major bugs, simple life inconvenience.

The app will not be available through the App Store.

To install, look in the release section for the apk for your phone (if you don't know which one to pick, download all of them and tried to install them one by one, the one that doesn't fail is the one to use :) ).

## Webpage + Server

The webpage is simply a desktop version of the Android App, with a little more features.

The server is a simple backend receiving data and sending data. No security is done to make sure that the data send is correct (it only checks for valid json).

I recommend running it on a Raspberry Pi that is always on, so you can use your main computer to access it.
