import  { vgrender, setPallete } from './mv.js'

const HEIGHT = 600
const WIDTH = 800

const MODES = {
    'NONE': 0,
    'DRAW': 1,
    'RESIZE': 2,
    'MOVE': 3
}

class Game {

    constructor() {

        this.currentColour = 'black';
        this.currentColourIndex = 0;

        this.colours = [
            '#000',
            '#ccc',
            '#fff',
            '#ffd5d5', // pink skin,
            '#faa', // dark pink skin
            '#c83737', // hair - alts for these: 
            '#ff9191', // nose,
            '#ff8080', // hands,
            '#080',    // eyes / plants - alt: 8c83ff
            '#a6cda6', // body
            '#85ba85', // stains
            '#e6f1e6', // shoulders,
            '#fd5', // ring
            '#ffe381', // button / beer
            '#fff6d5', // button highlight / beer
            '#d5f6ff', // empty glass
            '#aef', // window blue
            '#ff2a2a', // red
            '#830', // brown door/ground
            '#a40', // brown highlight
            '#520', // brown shadow
            '#666',    // dark gray
            '#59eb59', // ground grass
            '#a2f4a2', // ground grass highlight
            '#d38d5f', // tree trunk
            '#abc837', // tree highlight
            '#677821', // tree green
            '#3c3cff', // tractor/van
            '#f60'   , // orange
            '#4d4d4d', // dark dark gray
            '#009a9a', // bg trees 1
            '#00cbcb', // bg trees 2
        ];

        this.bgimg = null;
        this.bgX = 0;
        this.bgY = 0;

        this.mouseMode = MODES.NONE;
        this.IMAGEMOVE = false;
        this.oldx = null;
        this.oldy = null;

        this.currentShape = null;

        setPallete(this.colours);

        let canvas = document.getElementById('c')
        this.ctx = canvas.getContext('2d')
        this.initMouse(canvas)
        this.loadPallette();
        this.initButtons()

        this.tick = this.tick.bind(this)
        this.tick()
    }

    /**
    * Main game loop
    */
    tick() {
        this.update()
        this.cls()
        this.render()
        requestAnimationFrame(this.tick)
    }

    update() {
        
    }

    export() {
        let com = '';
        $('#d').children('li').each( (index, item) => {
            //console.log(item);
            let c = $(item).data('c');

            /*if(com !== '') {
                com += ','
            }*/
            com += c;
        })

        let current = $('#command').val();
        if(current && current !== '') {
            /*if(com !== '') {
                com += ','
            }*/
            com += current;
        }

        return com;
    }

    render() {
        
        // render background image
        if(this.bgimg) {
            this.ctx.drawImage(this.bgimg, this.bgX, this.bgY);
        }

        let com = this.export();
        /*$('#d').children('li').each( (index, item) => {
            //console.log(item);
            let c = $(item).data('c');

            if(com !== '') {
                com += ','
            }
            com += c
        })

        let current = $('#command').val();
        if(current && current !== '') {
            if(com !== '') {
                com += ','
            }
            com += current;
        }*/

        if(com !== '') {
            try {
                vgrender(this.ctx, com);
            } catch (e) {
                console.log('Render errrored: ', e);
            }
        }

        if(this.currentShape && com !== '') {
            this.renderShapeControls()
        }
    }

    drawRedRect(c) {
        this.ctx.fillStyle = c.colour;
        this.ctx.fillRect(c.x, c.y, c.w, c.h);
    }

    addSPoint(x, y) {
        return {
            'x': x - 5,
            'y': y - 5,
            'w': 10,
            'h': 10,
            'colour': 'red'
        }
    }

    updateShapeControls(c) {
        if(!c.squares) {
            c.squares = [];
            switch(this.currentShape.command) {
                case 'b': // rrects
                case 'n': //rects
                    c.squares.push(this.addSPoint(c.x, c.y))
                    c.squares.push(this.addSPoint(c.x + c.width, c.y))
                    c.squares.push(this.addSPoint(c.x + c.width, c.y + c.height))
                    c.squares.push(this.addSPoint(c.x, c.y + c.height))
                break;
                case 'd': // line
                    c.squares.push(this.addSPoint(c.x, c.y))
                    c.squares.push(this.addSPoint(c.x2, c.y2))
                break;
                case 'a':
                case 'i': // circle & arc
                    c.squares.push(this.addSPoint(c.x - c.rad, c.y - c.rad))
                    c.squares.push(this.addSPoint(c.x + c.rad, c.y + c.rad))
                break;
                case 'f': // polygon
                    c.squares.push(this.addSPoint(c.x, c.y))
                    for(let i = 0; i < c.pts.length; i += 2) {
                        c.squares.push(this.addSPoint(c.pts[i], c.pts[i + 1]))
                    }
                break;
            }
        }
    }

    renderShapeControls() {
        let c = this.currentShape;
        if(c.squares) {
            c.squares.forEach(s => {
                this.drawRedRect(s);
            })
        }
    }

    cls() {
        this.ctx.clearRect(0, 0, WIDTH, HEIGHT)
    }

    initMouse(c) {
        let self = this;
        c.addEventListener('mousedown', e => {
            var r = c.getBoundingClientRect();
            var x = e.clientX - r.left;
            var y = e.clientY - r.top;
            self.processDown(x, y);
        }, false);

        c.addEventListener('mouseup', e => {
            var r = c.getBoundingClientRect();
            var x = e.clientX - r.left;
            var y = e.clientY - r.top;
            self.processUp(x, y);
        }, false);

        c.addEventListener('mousemove', e => {
            var r = c.getBoundingClientRect();
            var x = e.clientX - r.left;
            var y = e.clientY - r.top;
            self.processMove(x, y);
        }, false)
    }

    setCurrentColour(index, cssColour) {
        this.currentColour = cssColour;
        this.currentColourIndex = index;
    }

    loadPallette() {
        let parent = $('#p');
        let count = 0;

        this.colours.forEach(c => {
            parent.append(`<li style="background-color: ${c}" data-colour="${c}" data-index="${count}">${count}</li>`);
            count++;
            if(count == 15) {
                parent = $('#p2');
            }
            if(count == 30) {
                parent = $('#p3');
            }
        })

        $('#p li').on('click', (e) => {
            let l = $(e.target)
            $('#p').children().removeClass('selected');
            $('#p2').children().removeClass('selected');
            $('#p3').children().removeClass('selected');
            l.addClass('selected');
            this.setCurrentColour(l.data('index'), l.data('colour'));
            this.addColour(l.data('index'));
        })

        $('#p2 li').on('click', (e) => {
            let l = $(e.target)
            $('#p').children().removeClass('selected');
            $('#p2').children().removeClass('selected');
            $('#p3').children().removeClass('selected');
            l.addClass('selected');
            this.setCurrentColour(l.data('index'), l.data('colour'));
            this.addColour(l.data('index'));
        })

        $('#p3 li').on('click', (e) => {
            let l = $(e.target)
            $('#p').children().removeClass('selected');
            $('#p2').children().removeClass('selected');
            $('#p3').children().removeClass('selected');
            l.addClass('selected');
            this.setCurrentColour(l.data('index'), l.data('colour'));
            this.addColour(l.data('index'));
        })
    }

    addColour(c) {
        //let v = $('#command').val();
        let v = 'k,' + c;
        //$('#command').val(v);
        this.addToList(v, 'colour');
    }

    refreshCommandsList() {
        $("#di li").unbind("click");
        $('#d li').on('click', e => {
            let l = $(e.target)
            $('#d').children().removeClass('selected');
            l.addClass('selected');
        })
    }

    initButtons() {

        $('#add').on('click', () => {
            let ti = $('#command');

            if(ti.val() !== '') {
                this.addToList(ti.val());

                ti.val('');
            }
        })

        $('#command').bind("enterKey",function(e){
            // todo - allow for direct editing
        });
        $('#command').keyup(function(e){
            if(e.keyCode == 13){
                $(this).trigger("enterKey");
            }
        });

        $('#clear').on('click', () => {
            $('#command').val('');
        })

        $('#last').on('click', () => {
            this.deleteLast();
        })

        $('#up').on('click', () => {
            this.moveSelectedUp();
        })

        $('#down').on('click', () => {
            this.moveSelectedDown();
        })

        $('#del').on('click', () => {
            this.deleteSelected();
        });

        $('#edit').on('click', () => {
            this.editSelected();
        });

        $('#replace').on('click', () => {
            this.replaceSelected();
        });

        $('#cleartext').on('click', () => {
            this.deleteList();
        })

        $('#export').on('click', () => {
            console.log(this.export());
        })

        $('#import').on('click', () => {
            let v = $('#command').val()

            let transX = parseInt($('#timportx').val())
            let transY = parseInt($('#timporty').val())

            if(v !== '') {
                // break into pieces
                let commands = v.split(/([a-z]\,[\d+\,*]+)/).filter(s => s !== '')
                if(commands) {
                    commands.forEach(c => {
                        // transpose imports by the specified deltas
                        if(transX !== 0 || transY !== 0) {
                            let split = c.split(',')
                            switch(split[0]) {
                                case 'n':
                                case 'b':
                                case 'i':
                                case 'a':
                                    split[1] = parseInt(split[1]) + transX
                                    split[2] = parseInt(split[2]) + transY
                                break;
                                case 'd':
                                    split[1] = parseInt(split[1]) + transX
                                    split[2] = parseInt(split[2]) + transY
                                    split[3] = parseInt(split[3]) + transX
                                    split[4] = parseInt(split[4]) + transY
                                break;
                                case 'f':
                                    for(let i = 1; i < split.length; i += 2) {
                                        split[i] = parseInt(split[i]) + transX
                                        split[i + 1] = parseInt(split[i + 1]) + transY
                                    }
                                break;
                            }
                            c = split.join(",")
                        }
                        // add each to list
                        this.addToList(c);
                    })
                }
            }
            // clear the command field
            $('#command').val('');
        })

        $('#loadimage').on('click', () => {
            
            let name = $('#imagename').val()

            this.bgimg = null;

            var img1 = new Image();

            img1.onload = () => {
                this.bgimg = img1;
            };

            img1.src = name;
        })

        $('#hideimage').on('click', () => {
            this.bgimg = null;
        })

        $("#setimage").on('click', () => {
            this.bgX = parseInt($('#imagex').val());
            this.bgY = parseInt($('#imagey').val());
        })

        $('#moveimage').on('click', () => {
            if(this.bgimg) {
                this.IMAGEMOVE = true;
            }
        })

        $('#resettrans').on('click', () => {
            $('#timportx').val(0)
            $('#timporty').val(0)
        })

        /* SHAPE BUTTONS */
        $("#none").on('click', () => {
            this.currentShape = null;
            this.dragging = false;
            this.mouseMode = MODES.NONE;
            this.resetCursor();
        })

        $("#rectangle").on('click', () => {
            this.currentShape = {
                command: 'b',
                width: 100,
                height: 100,
                x: 100,
                y: 100,
                placed: false
            };
            this.dragging = false;
            this.mouseMode = MODES.DRAW;
            this.setDrawCursor();
        })
        $("#circle").on('click', () => {
            this.currentShape = {
                command: 'i',
                rad: 50,
                x: 100,
                y: 100,
                placed: false
            };
            this.dragging = false;
            this.mouseMode = MODES.DRAW;
            this.setDrawCursor();
        })
        $("#arc").on('click', () => {
            this.currentShape = {
                command: 'a',
                rad: 50,
                x: 100,
                y: 100,
                b: 0,
                e: 180,
                placed: false
            };
            this.dragging = false;
            this.mouseMode = MODES.DRAW;
            this.setDrawCursor();
        })
        $("#line").on('click', () => {
            this.currentShape = {
                command: 'd',
                x: 100,
                y: 100,
                x2: 200,
                y2: 100,
                placed: false
            };
            this.dragging = false;
            this.mouseMode = MODES.DRAW;
            this.setDrawCursor();
        })
        $("#rrectangle").on('click', () => {
            this.currentShape = {
                command: 'n',
                width: 100,
                height: 100,
                x: 100,
                y: 100,
                r: 20,
                placed: false
            };
            this.dragging = false;
            this.mouseMode = MODES.DRAW;
            this.setDrawCursor();
        })
        $("#fpolygon").on('click', () => {
            this.currentShape = {
                command: 'f',
                x: 100,
                y: 100,
                pts: [ 100, 200, 200, 200],
                placed: false
            };
            this.dragging = false;
            this.mouseMode = MODES.DRAW;
            this.setDrawCursor();
        })

        $("#bstart").on('click', () => {
            let v = 'x,2';
            this.addToList(v, 'bo start');
        })
        $("#bend").on('click', () => {
            let v = 'x,0';
            this.addToList(v, 'bo end');
        })
        $("#linewidth").on('click', () => {
            let v = 'o,2';
            $('#command').val(v);
        })
    }

    resetCursor() {
        $('#c').css('cursor', 'default');
    }

    setDrawCursor() {
        $('#c').css('cursor', 'crosshair');
    }

    setMoveCursor() {
        $('#c').css('cursor', 'pointer');
    }

    setDragCursor() {
        $('#c').css('cursor', 'move');
    }

    updateCommand() {
        let shape = this.currentShape;
        if(shape) {
            let c = $('#command');

            let com = shape.command + ",";
            switch(shape.command) {
                case 'b':
                    com += `${shape.x},${shape.y},${shape.width},${shape.height}`;
                break;
                case 'i':
                    com += `${shape.x},${shape.y},${shape.rad}`;
                break;
                case 'a':
                    com += `${shape.x},${shape.y},${shape.rad},${shape.b},${shape.e}`;
                break;
                case 'd':
                    com += `${shape.x},${shape.y},${shape.x2},${shape.y2}`;
                break;
                case 'n':
                    com += `${shape.x},${shape.y},${shape.width},${shape.height},${shape.r}`;
                break;
                case 'f':
                    com += `${shape.x},${shape.y}`;
                    shape.pts.forEach(p => {
                        com += `,${p}`;
                    })
                break;
            }

            c.val(com);
            delete shape.squares;
            this.updateShapeControls(shape);
        }
    }

    setCommand(shape, mx, my) {
        let c = $('#command');
        let v = c.val();

        let com = shape.command + ",";
        switch(shape.command) {
            case 'b':
                com += `${mx},${my},${shape.width},${shape.height}`;
            break;
            case 'i':
                com += `${mx},${my},${shape.rad}`;
            break;
            case 'a':
                com += `${mx},${my},${shape.rad},${shape.b},${shape.e}`;
            break;
            case 'd':
                com += `${mx},${my},${shape.x2},${shape.y2}`;
            break;
            case 'n':
                com += `${mx},${my},${shape.width},${shape.height},${shape.r}`;
            break;
            case 'f':
                com += `${mx},${my}`;
                shape.pts.forEach(p => {
                    com += `,${p}`;
                })
            break;
        }
        

        if(v.length > 0 && v[0] === 'k') {
            v += com;
        } else {
            v = com;
        }

        c.val(v);
        shape.placed = true;
        shape.x = mx;
        shape.y = my;
        delete shape.squares;
        this.updateShapeControls(shape);
    }

    /**
     * 
     *  MOUSE
     * 
     */

    processDown(mx, my) {
        mx = Math.floor(mx);
        my = Math.floor(my);

        console.log(mx, my);

        if(this.IMAGEMOVE) {
            if(!this.oldx && !this.oldy) {
                //console.log('set origin to ', mx, my);
                this.oldx = this.bgX - mx;
                this.oldy = this.bgY - my;
            }
            this.mouseMode = MODES.NONE;
            this.currentShape = null;
        } else {
            if(this.currentShape) {
                switch(this.mouseMode) {
                    case MODES.DRAW: 
                        this.setCommand(this.currentShape, mx, my);
                        this.mouseMode = MODES.MOVE;
                        this.setMoveCursor();
                    break;
                    case MODES.MOVE:
                        if(this.currentShape && this.currentShape.selected !== null) {
                            this.setDragCursor()
                            this.dragging = true;
                        } else {
                            this.setMoveCursor();
                            this.dragging = false;
                        }
                    break;
                }
            }
        }
    }

    processUp(mx, my) {
        mx = Math.floor(mx);
        my = Math.floor(my);
        if(this.IMAGEMOVE) {
            this.IMAGEMOVE = false;
            this.oldx = null;
            this.oldy = null;
        } else {    
            this.setMoveCursor();
            this.dragging = false;
        }
    }

    contains(xa, ya, xb, yb, w, h) {
        return xa >= xb && xa <= xb + w &&
               ya >= yb && ya <= yb + h;
    }

    pythagoras(a, b) {
        return Math.sqrt((a * a) + (b * b));
    }

    processMove(mx, my) {
        mx = Math.floor(mx);
        my = Math.floor(my);

        if(this.IMAGEMOVE) {
            if(this.oldx && this.oldy) {
                this.bgX = (mx + this.oldx);
                this.bgY = (my + this.oldy);
                $('#imagex').val(this.bgX);
                $('#imagey').val(this.bgY);
            }
        } else {
            if(this.dragging) {
                if(this.currentShape && this.currentShape.selected !== null) {
                    let i = this.currentShape.selected;
                    if(i == 0) {
                        this.currentShape.x = mx;
                        this.currentShape.y = my;
                        this.updateCommand();
                    }
                    if(i > 0) {
                        switch(this.currentShape.command) {
                            case 'n': //roundrect
                            case 'b': // rects
                                let w = Math.max(1,mx - this.currentShape.x);
                                let h = Math.max(1,my - this.currentShape.y);
                                switch(i) {
                                    case 1:
                                        this.currentShape.width = w;
                                    break;
                                    case 2:
                                        this.currentShape.height = h;
                                        this.currentShape.width = w;
                                    break;
                                    case 3:
                                        this.currentShape.height = h;
                                    break;
                                }
                            break;
                            case 'a': // arc
                            case 'i': // circle
                                let a = mx - this.currentShape.x;
                                let b = my - this.currentShape.y;
                                this.currentShape.rad = Math.floor(this.pythagoras(a, b) / 1.5);
                            break;
                            case 'd': // line
                                this.currentShape.x2 = mx;
                                this.currentShape.y2 = my;
                            break;
                            case 'f': // polygon
                                if(this.currentShape.pts) {
                                    let j = (i - 1) * 2;
                                    this.currentShape.pts[j] = mx;
                                    this.currentShape.pts[j + 1] = my;
                                }
                            break;
                        }
                        this.updateCommand();
                    }
                }
            } else {
                // check the squares
                if(this.currentShape && this.currentShape.squares) {
                    this.currentShape.selected = null;
                    this.currentShape.squares.forEach(square => {
                        square.colour = 'red';
                    })
                    let count = 0;
                    this.currentShape.squares.forEach(square => {
                        if(this.contains(mx, my, square.x, square.y, square.w, square.h)) {
                            square.colour = 'blue';
                            this.currentShape.selected = count;
                        }
                        count++;
                    })
                }
            }
        }
    }

    /**
     * 
     *    LIST
     * 
     */

    deleteList() {
        let list = $('#d');
        list.empty();
    }

    deleteLast() {
        let list = $('#d');
        list.children().last().remove();
    }

    addToList(t, word) {

        console.log('adding ', t, ' to the list');

        let list = $('#d');
        
        let w = word;

        const dict = {
            'a': 'arc',
            'b': 'rect',
            'i': 'circle',
            'n': 'r-rect',
            'o': 'linewidth',
            'k': 'colour',
            'f': 'polygon',
            'x': 'bo',
            'd': 'line'
        }

        if(!w) {
            w = dict[t[0]];
            //console.log(t, t[0], w);
        }
        list.append(`<li data-c="${t}">${t}<span class='left'>${w}</span></li>`);
        this.refreshCommandsList();
    }

    deleteSelected() {
        let item = $('#d li.selected');
        if(item) {
            item.remove();
        }
    }

    replaceSelected() {
        let ti = $('#command');
        let v = ti.val();
        if(v !== '') {
            let item = $('#d li.selected');
            if(item) {
                item.data('c', v);
                item.text(v);
                ti.val('');
            }
        }
    }

    convertDataToShape(data) {
        // split the command into pieces
        let commands = data.split(/([a-z]\,[\d+\,*]+)/).filter(s => s !== '');

        commands.forEach( c => {

            let l = c.split(',');

            let p = l.shift();

            l = l.map(Number);

            // generate the correct shape for each command
            this.currentShape = {
                command: p,
                x: l[0],
                y: l[1],
                placed: false,
                squares: []
            };

            switch(p) {
                case 'b': // rect
                    this.currentShape.width = l[2];
                    this.currentShape.height = l[3];
                break;
                case 'n': //round rect
                    this.currentShape.width = l[2];
                    this.currentShape.height = l[3];
                    this.currentShape.r = l[4];
                break;
                case 'd': // line
                    this.currentShape.x2 = l[2];
                    this.currentShape.y2 = l[3];
                break;
                case 'i': // circle
                    this.currentShape.rad = l[2];
                break;
                case 'a': // arc
                    this.currentShape.rad = l[2];
                    this.currentShape.b = l[3];
                    this.currentShape.e = l[4];
                break;
                case 'f': // polygon
                    this.currentShape.pts = [];
                    for(let i = 2; i < l.length; i++) {
                        this.currentShape.pts.push(l[i]);
                    }
                break;
            }
        })
        //console.log(this.currentShape);
    }

    editSelected() {
        let ti = $('#command');
        let v = ti.val();
        if(v === '') {
            let item = $('#d li.selected');
            if(item) {
                // generate shape from item data
                let data = item.data('c');

                this.convertDataToShape(data);
                // modify this to handle the colour command
                this.updateCommand();
            }
        }
    }

    moveSelectedUp() {
        let item = $('#d li.selected');
        if(item) {
            let before = item.prev();
            item.insertBefore(before);
        }
    }

    moveSelectedDown() {
        let item = $('#d li.selected');
        if(item) {
            let after = item.next();
            item.insertAfter(after);
        }
    }

    /* -------------------------------------------- */
}

export default Game