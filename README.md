# js13k-mini-svg-editor
Web based editor for creating mini-svg-like graphics for your js13k entry

# instructions

[Interface](screenshot.png)

- Click on one of the buttons on the far right to add the appropriate shape.
- Edit it in the main window by dragging the red nodes, then click 'Add' to store it in the list.
- Click on the palette to add colours.
- The buttons underneath the list allow you to edit, rearrange and replace the commands in the list.
- Once you're done, hit 'Export', the final data string is dumped in the console.

# issues
- It's all a bit slapdash and buggy
- Polygon editing is a pain. Add a polygon, move the three points around, manually type in some dud points in the entry field, then 'Add' the polygon. Then, select it, click 'Edit', and now you can move the extra points around. Hit 'Replace' to save the polygon in the list.
- When you edit a shape, the old one sticks around and gets in the way until you hit 'Add' or 'Replace'
- I have not tested the 'Import' command. In theory, if you chuck your exported data into the entryfield and click 'Import' it should recreate 'most' of the original commands.

### Usage
Run `npm install`

- `npm start`
  - builds files from `./src/index.js` as an entry point
  - places files into `./build`
  - serves `./build`
  - watches `./src` for specific file types

Editor should be available on http://localhost:8081 after that
(port 8081 so that I can run my js13k entry alongside on port 8080 ;)
