# Go Presenter

Go Presenter builds of top of the [go present tool](https://github.com/golang/tools) to support presenter notes on a second screen.

## Demo

http://virtivia.com:27080/16sjso7a4pow9.mov

<img width="1207" alt="screen shot 2016-03-04 at 9 42 11 pm" src="https://cloud.githubusercontent.com/assets/4488777/13545940/0d5780cc-e252-11e5-88d4-4bb9c70fc9a4.png">

## Features

- Dual screen
- Syncs both ways
- Previous and next slide preview from Presenter

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

### Flexible command windows

Control your slides from either Presenter or the main browser window. The same commands (eg. clicks, arrows, enter keys) that apply to the main browser window apply to Presenter. It syncs both ways.
