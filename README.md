# Presenter

Presenter builds on top of the [go present tool](https://github.com/golang/tools) to support presenter notes on a second screen.

## Demo

Video: http://virtivia.com:27080/1vs4fiwjm924q.mov

Screenshot: <img width="1207" alt="screen shot 2016-03-04 at 9 42 11 pm" src="https://cloud.githubusercontent.com/assets/4488777/13545940/0d5780cc-e252-11e5-88d4-4bb9c70fc9a4.png">

## Install

There is currently a [proposal](https://github.com/golang/go/issues/14654) to merge this upstream. Meanwhile, you can install Presenter by running the following commands:

```
$ cd $GOPATH/src/golang.org/x/tools
$ git remote add audreylim https://github.com/audreylim/go-presenter
$ git fetch audreylim
$ git checkout audreylim/master
$ go install golang.org/x/tools/cmd/present
```

## Features

- Dual screen
- Syncs both ways
- Sneak preview of previous and next slide on Presenter
- Enabling of Presenter mode keeps Presenter features and actions separate from the original `present` app, ie. it will not interfere with the `present` if not enabled

## Supported Browsers

- Chrome

## How to Use

### Syntax

Notes are identified by prefixing the paragraph with `& `. Eg.

```
// example.slide

* Section title

- Some bullet points

& This is a Presenter note that does not appear on the main window.

& This is a second paragraph.
```

### Presenter Mode

Run `present` in presenter mode by appending the `-p` flag. 

```
$ present -p
```

This will enable all the Presenter features. For example, to open Presenter, press `P` from your main browser window.

You can close Presenter from the main window by pressing `P` again, as long as you toggle from the main browser. If you close the main window, Presenter automatically closes.

### Flexible Control Windows

Control your slides from either Presenter or the main browser window. The same commands (eg. clicks, arrows, enter keys) that apply to the main browser window apply to Presenter. It syncs both ways.

## What Presenter Does Not Do

Presenter currently does not sync `.play` actions like `Run`. There's a bit more complexity in enabling that, but this might be added in future.

Eg. Clicking `Run` from the main browser or Presenter will not sync with the other window.

<img width="671" alt="screen shot 2016-03-06 at 8 23 53 pm" src="https://cloud.githubusercontent.com/assets/4488777/13560852/7e3ed6ae-e3d9-11e5-946c-8202bf3a0593.png">

## TODO

- Implement timer
