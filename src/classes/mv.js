let colours = [];

let ctx = null;

const rad = (d) => {
    return (Math.PI/180)*d;
}

const r = {
    // colour
    k: (l) => {
        ctx.fillStyle = colours[l[0]];
        ctx.strokeStyle = colours[l[0]];
    },
    // filled rectangle
    b: (l) => {
        ctx.fillRect(l[0], l[1], l[2], l[3]);
    },
    // line
    d: (l) => {
        ctx.beginPath();
        ctx.moveTo(l[0],l[1]);
        ctx.lineTo(l[2],l[3]);
        ctx.stroke();
    },
    // filled polygon
    f: (l) => {
        ctx.beginPath();
        ctx.moveTo(l[0],l[1]);
        for(let i = 2; i < l.length; i += 2) {
            ctx.lineTo(l[i], l[i + 1]);
        }
        ctx.fill();
    },
    // filled circle
    i: (l) => {
        ctx.beginPath();
        ctx.arc(l[0], l[1], l[2], 0, rad(360), 0);
        ctx.fill();
    },
    // filled rounded rect
    n: (l) => {
        roundRect(l[0], l[1], l[2], l[3], l[4], true);
    }, 
    // line width
    o: (l) => {
        ctx.lineWidth = l[0];
    },
    // filled arc
    a: (l) => {
        ctx.beginPath();
        ctx.arc(l[0], l[1], l[2], rad(l[3]), rad(l[4]), true);
        ctx.fill();
    },
    // NOT USING THESE
    /*
    z: (l) => {
        ctx.globalAlpha = l[0];
    },
    // stroke rectangle
    a: (l) => {
        ctx.strokeRect(l[0], l[1], l[2], l[3]);
    },
    // clear rectangle
    c: (l) => {
        ctx.clearRect(l[0], l[1], l[2], l[3]);
    },
    // stroke polygon
    e: (l) => {
        ctx.beginPath();
        ctx.moveTo(l[0],l[1]);
        for(let i = 2; i < l.length; i += 2) {
            ctx.lineTo(l[i], l[i + 1]);
        }
        ctx.closePath();
        ctx.stroke();
    },
    // text
    g: (l) => {
        ctx.font = l[0] + 'px ' + fonts[l[1]];
        ctx.fillText(texts(l[2]),l[3],l[4]);
    },
    // stroke circle
    h: (l) => {
        ctx.beginPath();
        ctx.arc(l[0], l[1], l[2], 0, rad(360), 0);
        ctx.stroke();
    },
    // filled arc
    
    // stroke rounded rect
    m: (l) => {
        roundRect(l[0], l[1], l[2], l[3], l[4], false);
    },
    */
};

// rounded rectangle
const roundRect = (x, y, w, h, r, f) => {
    let z = {tl: r, tr: r, br: r, bl: r};
    ctx.beginPath();
    ctx.moveTo(x + z.tl, y);
    ctx.lineTo(x + w - z.tr, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + z.tr);
    ctx.lineTo(x + w, y + h - z.br);
    ctx.quadraticCurveTo(x + w, y + h, x + w - z.br, y + h);
    ctx.lineTo(x + z.bl, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - z.bl);
    ctx.lineTo(x, y + z.tl);
    ctx.quadraticCurveTo(x, y, x + z.tl, y);
    ctx.closePath();
    if (f) {
        ctx.fill();
    } else {
        ctx.stroke();
    }
}

const setPallete = (c) => {
    colours = c;
}

const processCommands = (commands, flag, inc) => {
    for(let i = 0; i < commands.length; i++){
        let c = commands[i];
        let l = c.split(',');
        const f = l.shift();
        if(f === 'x') {
            if(parseInt(l[0]) > 0) {
                // sub process, outline in black
                processCommands([].concat(commands.slice(i + 1)), true, parseInt(l[0]));
            } else {
                // it's an x 0, bail out
                if(flag) {
                    return;
                }
            }
            // always skip the x commands
            continue;
        }
        // params
        let p = l.map(Number);
        // this generates the black outline
        if(flag && inc > 0) {
            switch(f) {
                case 'k':
                    p[0] = 0;
                break;
                case 'n':
                case 'b':
                    p[0] -= inc;
                    p[1] -= inc;
                    p[2] += inc * 2;
                    p[3] += inc * 2;
                break;
                case 'a':
                case 'i':
                    p[2] += inc;
                break;

            }
        }
        //console.log(f, l[0]);
        // there's a good chance you could replace a big chunk
        // of this file by using this:
        // let path = new Path2D('m100,100v50h50v-50')
        // ctx.stroke(path)
        //
        r[f](p);
    }
}

const vgrender = (newctx, data) => {
    //console.log('[' + data + ']');
    let commands = data.split(/([a-z]\,[\d+\,*]+)/).filter(s => s !== '')
    //console.log(commands);
    if(!commands) return;
    ctx = newctx;
    ctx.lineWidth = 1;
    processCommands(commands, false, 0);
};

export { vgrender, setPallete };
