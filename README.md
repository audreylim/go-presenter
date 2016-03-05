# Go Presenter

Go presenter builds of top of the [go present tool](https://github.com/golang/tools) to support presenter notes on a second screen.

## Features

- Dual screen
- Syncs both ways
- Previous and next slide preview from presenter window (a little)

## How to Use

### Syntax

Notes are identified by prefixing the paragraph with `& `. Eg.

```
* Section title

- Some bullet points

& This is a presenter note that does not appear on the main window.

& This is a second paragraph.
```

### Presenter Mode

Run `present` in presenter mode by appending the `-p` flag. This will open the presenter window when you press `P` from your main browser window.

You can close the presenter screen from the main window by pressing `P` again. Toggling works.

If you close the main window, the presenter window automatically closes.

### Flexible command windows

Control your slides from either the presenter window or the main browser window. The same commands (eg. clicks, arrows, enter keys) that apply to the main browser window apply to the presenter window. It syncs both ways.
