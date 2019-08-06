var canvas = document.querySelector("canvas"),
    ctx = canvas.getContext("2d");
var ww, wh;

function onResize() {
    ww = canvas.width = window.innerWidth;
    wh = canvas.height = window.innerHeight;
}

ctx.strokeStyle = "red";
ctx.shadowBlur = 25;
ctx.shadowColor = "hsla(0, 100%, 60%, 0.8)";

var precision = 100;
var hearts = [];
var mouseMoved = false;
function onMove(e) {
    mouseMoved = true;
    if (e.type === "touchmove") {
        hearts.push(new Heart(e.touches[0].clientX, e.touches[0].clientY));
        hearts.push(new Heart(e.touches[0].clientX, e.touches[0].clientY));
    } else {
        hearts.push(new Heart(e.clientX, e.clientY));
        hearts.push(new Heart(e.clientX, e.clientY));
    }
}

var Heart = function (x, y) {
    this.x = x || Math.random() * ww;
    this.y = y || Math.random() * wh;
    this.size = Math.random() * 2 + 1;
    this.shadowBlur = Math.random() * 10;
    this.speedX = (Math.random() + 0.2 - 0.6) * 10;
    this.speedY = (Math.random() + 0.2 - 0.6) * 10;
    this.speedSize = Math.random() * 0.05 + 0.01;
    this.opacity = 1;
    this.vertices = [];
    for (var i = 0; i < precision; i++) {
        var step = (i / precision - 0.5) * (Math.PI * 2);
        var vector = {
            x: (15 * Math.pow(Math.sin(step), 3)),
            y: -(13 * Math.cos(step) - 5 * Math.cos(2 * step) - 2 * Math.cos(3 * step) - Math.cos(4 * step))
        }
        this.vertices.push(vector);
    }
}

Heart.prototype.draw = function () {
    this.size -= this.speedSize;
    this.x += this.speedX;
    this.y += this.speedY;
    ctx.save();
    ctx.translate(-1000, this.y);
    ctx.scale(this.size, this.size);
    ctx.beginPath();
    for (var i = 0; i < precision; i++) {
        var vector = this.vertices[i];
        ctx.lineTo(vector.x, vector.y);
    }
    ctx.globalAlpha = this.size;
    ctx.shadowBlur = Math.round((3 - this.size) * 10);
    ctx.shadowColor = "hsla(0, 100%, 60%, 0.8)";
    ctx.shadowOffsetX = this.x + 1000;
    ctx.globalCompositeOperation = "screen";
    ctx.closePath();
    ctx.fill();
    ctx.restore();
};


function render(a) {
    requestAnimationFrame(render);

    hearts.push(new Heart())
    ctx.clearRect(0, 0, ww, wh);
    for (var i = 0; i < hearts.length; i++) {
        hearts[i].draw();
        if (hearts[i].size <= 0) {
            hearts.splice(i, 1);
            i--;
        }
    }
}

onResize();
window.addEventListener("mousemove", onMove);
window.addEventListener("touchmove", onMove);
window.addEventListener("resize", onResize);
requestAnimationFrame(render);


// set 3d transforms
TweenMax.set("#clock", { perspective: 1500 })
TweenMax.set(".upper", { rotationX: 0.01, transformOrigin: "50% 100%" })
TweenMax.set(".lower", { rotationX: 0.01, transformOrigin: "50% 0%" })

// set clock
var dd, hh, mm, ss;
setTimeVars();

//时间计数器
function setTimeVars() {
    var futimg = '2018,12,9';
    var nowtime = new Date().getTime(); // 现在时间转换为时间戳
    var futruetime = new Date(futimg).getTime(); // 未来时间转换为时间戳
    var msec = nowtime - futruetime; // 毫秒 未来时间-现在时间
    var time = (msec / 1000);  // 毫秒/1000
    var day = parseInt(time / 86400); // 天  24*60*60*1000
    var hour = parseInt(time / 3600) - 24 * day;    // 小时 60*60 总小时数-过去的小时数=现在的小时数
    var minute = parseInt(time % 3600 / 60); // 分 -(day*24) 以60秒为一整份 取余 剩下秒数 秒数/60 就是分钟数
    var second = parseInt(time % 60);  // 以60秒为一整份 取余 剩下秒数

    var obj = document.getElementById('day').innerHTML = day;

    ss = String(second);
    mm = String(minute);
    hh = String(hour);
    dd = String(day);

    if (ss.length == 1) ss = "0" + ss;
    if (mm.length == 1) mm = "0" + mm;
    if (hh.length == 1) hh = "0" + hh;
    if (dd.length == 1) dd = "000" + dd;
    if (dd.length == 2) dd = "00" + dd;
    if (dd.length === 3) dd = "0" + dd;

    // dd = "1039";
    // hh = "23";
    // mm = "59";
    // ss = "59";
}


d30.childNodes[3].innerHTML = d30.childNodes[7].innerHTML = "<span>" + Number(dd.substr(0, 1)) + "</span>";
d20.childNodes[3].innerHTML = d20.childNodes[7].innerHTML = "<span>" + Number(dd.substr(1, 1)) + "</span>";
d10.childNodes[3].innerHTML = d10.childNodes[7].innerHTML = "<span>" + Number(dd.substr(2, 1)) + "</span>";
d0.childNodes[3].innerHTML = d0.childNodes[7].innerHTML = "<span>" + Number(dd.substr(3, 1)) + "</span>";

h10.childNodes[3].innerHTML = h10.childNodes[7].innerHTML = "<span>" + Number(hh.substr(0, 1)) + "</span>";
h0.childNodes[3].innerHTML = h0.childNodes[7].innerHTML = "<span>" + Number(String(hh).substr(1, 1)) + "</span>";

m10.childNodes[3].innerHTML = m10.childNodes[7].innerHTML = "<span>" + Number(mm.substr(0, 1)) + "</span>";
m0.childNodes[3].innerHTML = m0.childNodes[7].innerHTML = "<span>" + Number(mm.substr(1, 1)) + "</span>";

s10.childNodes[3].innerHTML = s10.childNodes[7].innerHTML = "<span>" + Number(ss.substr(0, 1)) + "</span>";
s0.childNodes[3].innerHTML = s0.childNodes[7].innerHTML = "<span>" + Number(ss.substr(1, 1)) + "</span>";

// start ticking
var interval = setInterval(function () {
    setTimeVars();

    tick(s0, Number(ss.substr(1, 1)))

    if (ss.substr(1, 1) == "9") {
        tick(s10, Number(ss.substr(0, 1)))
        if (ss == "59") {
            tick(s10, 5, true)
            tick(m0, Number(mm.substr(1, 1)))
            if (mm.substr(1, 1) == "9") {
                tick(m10, Number(mm.substr(0, 1)))
                if (mm == "59") {
                    tick(m10, 5, true)
                    tick(h0, Number(hh.substr(1, 1)))
                    if (hh.substr(1, 1) == "3") {
                        tick(h10, Number(hh.substr(0, 1)))
                        if (hh == "23") {
                            tick(h10, 2, true)
                            tick(h0, Number(hh.substr(1, 1)), true)
                            tick(d0, Number(dd.substr(3, 1)))
                            if (dd.substr(3, 1) == "9") {
                                tick(d10, Number(dd.substr(2, 1)), false)
                                if (dd.substr(2, 1) == "9") {
                                    tick(d10, Number(dd.substr(2, 1)))
                                    tick(d20, Number(dd.substr(1, 1)))
                                    if (dd.substr(1, 1) == "9") {
                                        tick(d20, Number(dd.substr(1, 1)))
                                        tick(d30, Number(dd.substr(0, 1)))
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

}, 1000)

function tick(mc, i, toZero = false) {
    // set numbers
    mc.childNodes[3].innerHTML = "<span>" + i + "</span>"; //start upper
    mc.childNodes[5].innerHTML = "<span>" + i + "</span>"; //start lower

    if (i == 9 || toZero) i = -1;
    changeNum(mc, i);
}

function changeNum(mc, i) {
    mc.childNodes[1].innerHTML = "<span>" + (i + 1) + "</span>"; //end upper
    mc.childNodes[7].innerHTML = "<span>" + (i + 1) + "</span>"; //end lower
    // animate tick
    TweenMax.fromTo(mc.childNodes[1], .3, { alpha: 0 }, { alpha: 1, ease: Power4.easeIn })
    TweenMax.fromTo(mc.childNodes[3], .3, { rotationX: 0, background: "linear-gradient(0deg, rgba(200,200,200,1), rgba(255,255,255,1) 15%)" }, { rotationX: -90, ease: Power1.easeIn })
    TweenMax.fromTo(mc.childNodes[7], .5 + .2 * Math.random(), { rotationX: 90 }, { rotationX: 0, ease: Bounce.easeOut, delay: .3 })
    TweenMax.fromTo(mc.childNodes[5], .6, { alpha: 1 }, { alpha: 0, ease: Bounce.easeOut, delay: .3 })
}

document.getElementById('close').addEventListener('click',function(){
    document.getElementById('letter').style.display = 'none';
},false);