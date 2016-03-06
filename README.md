# Go Presenter

Go Presenter builds on top of the [go present tool](https://github.com/golang/tools) to support presenter notes on a second screen.

## Demo

Video: http://virtivia.com:27080/1vs4fiwjm924q.mov

Screenshot: <img width="1207" alt="screen shot 2016-03-04 at 9 42 11 pm" src="https://cloud.githubusercontent.com/assets/4488777/13545940/0d5780cc-e252-11e5-88d4-4bb9c70fc9a4.png">

## Install

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

## Supported Browsers

- Chrome

## How to Use

### Syntax

Notes are identified by prefixing the paragraph with `& `. Eg.

```
* Section title

- Some bullet points

& This is a Presenter note that does not appear on the main window.

& This is a second paragraph.
```

### Presenter Mode

Run `present` in presenter mode by appending the `-p` flag. This will enable all the Presenter features. 

For example, to open Presenter, press `P` from your main browser window.

You can close Presenter from the main window by pressing `P` again. Toggling works.

If you close the main window, Presenter automatically closes.

### Flexible control windows

Control your slides from either Presenter or the main browser window. The same commands (eg. clicks, arrows, enter keys) that apply to the main browser window apply to Presenter. It syncs both ways.
