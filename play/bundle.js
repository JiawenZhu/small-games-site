(function() {
  const __modules = {};
  const __alias = {};
  const __cache = {};
  function __resolve(id) {
    let seen = 0;
    while (__alias[id] && seen++ < 8) id = __alias[id];
    return id;
  }
  function __require(id) {
    id = __resolve(id);
    if (__cache[id]) return __cache[id].exports;
    const fn = __modules[id];
    if (!fn) throw new Error("Module not found: " + id);
    const mod = { exports: {} };
    __cache[id] = mod;
    fn(mod, mod.exports, __require);
    return mod.exports;
  }

  // === MODULE: cc ===
  __modules["cc"] = function(module, exports, require) {
"use strict";
// =====================================================================================
//  Lightweight HTML5 Canvas2D Runtime ('cc' module) — TikTok Mini-Games Suite
// =====================================================================================
//  A tiny (zero-dependency) retained-mode scene graph that runs the same TypeScript
//  components found in assets/scripts/**. Designed for 60 FPS on low-end phones while
//  still supporting the visual primitives a modern game UI needs:
//
//    • Full node transforms   — position, scale, rotation, pivot, opacity
//    • Rich paints            — linear / radial gradients, not just flat rgba()
//    • Real shadows           — blurred drop shadows + glows
//    • Clipping               — rounded-rect masks, arbitrary path clips
//    • Blend modes            — additive glow passes for highlights & particles
//    • Typography             — weights, tracking, outlines, gradient fills, auto-fit
//
//  Coordinate space: origin (0,0) at the CENTRE of the 720x1280 stage, +Y points UP
//  (Cocos convention). The renderer applies a per-node ctx transform, so children
//  inherit scale/rotation/alpha from their parents.
// =====================================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.Textures = exports.setPlatform = exports.Platform = exports.director = exports.Director = exports.Node = exports.Label = exports.FONT_MONO = exports.FONT_UI = exports.FONT_DISPLAY = exports.measureText = exports.Graphics = exports.Widget = exports.Camera = exports.Canvas = exports.UIOpacity = exports.UITransform = exports.Component = exports.input = exports.Input = exports.EventKeyboard = exports.EventTouch = exports.KeyCode = exports.VerticalTextAlignment = exports.HorizontalTextAlignment = exports.Vec3 = exports.Vec2 = exports.Color = exports.stageHeightFor = exports.setStageSize = exports.onStageResize = exports.STAGE_H_MAX = exports.STAGE_H_MIN = exports.Stage = exports.DESIGN_HEIGHT = exports.DESIGN_WIDTH = exports._decorator = void 0;
exports._decorator = {
    ccclass: (_name) => (target) => target,
    property: (_type) => (_target, _key) => { },
};
exports.DESIGN_WIDTH = 720;
exports.DESIGN_HEIGHT = 1280;
// -------------------------------------------------------------------------------------
//  Stage — a fixed design WIDTH with a HEIGHT that follows the real device.
// -------------------------------------------------------------------------------------
//  Locking both axes is what forces letterboxing, and letterboxing on a 20:9 phone
//  throws away a fifth of the screen. We keep the width at 720 so every type size and
//  gutter in the theme still means what it says, and let the height be whatever the
//  device's aspect ratio asks for. Layout then reads T.H instead of a constant.
// -------------------------------------------------------------------------------------
exports.Stage = { w: exports.DESIGN_WIDTH, h: exports.DESIGN_HEIGHT, insetTop: 0, insetBottom: 0 };
/** Height bounds, in stage units, for a 720-wide stage. Roughly 4:3 … 21:9. */
exports.STAGE_H_MIN = 960;
exports.STAGE_H_MAX = 1800;
const _stageListeners = [];
/** Run `cb` now and again whenever the stage is resized. */
function onStageResize(cb) {
    _stageListeners.push(cb);
    cb(exports.Stage.w, exports.Stage.h);
}
exports.onStageResize = onStageResize;
/**
 * Resize the stage. `insetTop` / `insetBottom` are the device's safe-area insets
 * already converted to stage units, so the chrome can keep clear of a notch and a
 * home indicator without any of the layout code knowing about CSS.
 */
function setStageSize(w, h, insetTop = 0, insetBottom = 0) {
    const nh = Math.round(Math.max(exports.STAGE_H_MIN, Math.min(exports.STAGE_H_MAX, h)));
    const nw = Math.round(w);
    const it = Math.max(0, Math.round(insetTop));
    const ib = Math.max(0, Math.round(insetBottom));
    if (exports.Stage.w === nw && exports.Stage.h === nh && exports.Stage.insetTop === it && exports.Stage.insetBottom === ib)
        return;
    exports.Stage.w = nw;
    exports.Stage.h = nh;
    exports.Stage.insetTop = it;
    exports.Stage.insetBottom = ib;
    for (const cb of _stageListeners)
        cb(nw, nh);
}
exports.setStageSize = setStageSize;
/** Stage height for a viewport, as the runtime computes it on every resize. */
function stageHeightFor(viewW, viewH) {
    if (viewW <= 0 || viewH <= 0)
        return exports.DESIGN_HEIGHT;
    return Math.max(exports.STAGE_H_MIN, Math.min(exports.STAGE_H_MAX, Math.round((viewH / viewW) * exports.DESIGN_WIDTH)));
}
exports.stageHeightFor = stageHeightFor;
// -------------------------------------------------------------------------------------
//  Math / value types
// -------------------------------------------------------------------------------------
class Color {
    constructor(r = 255, g = 255, b = 255, a = 255) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    toCSS() {
        return `rgba(${this.r | 0}, ${this.g | 0}, ${this.b | 0}, ${(this.a / 255).toFixed(3)})`;
    }
    clone() {
        return new Color(this.r, this.g, this.b, this.a);
    }
    /** Returns a copy with a new alpha (0..255). */
    withAlpha(a) {
        return new Color(this.r, this.g, this.b, a);
    }
    /** Mix towards white (t>0) or black (t<0), t in -1..1. */
    shade(t) {
        const target = t >= 0 ? 255 : 0;
        const k = Math.abs(t);
        return new Color(this.r + (target - this.r) * k, this.g + (target - this.g) * k, this.b + (target - this.b) * k, this.a);
    }
    static lerp(a, b, t) {
        return new Color(a.r + (b.r - a.r) * t, a.g + (b.g - a.g) * t, a.b + (b.b - a.b) * t, a.a + (b.a - a.a) * t);
    }
}
exports.Color = Color;
class Vec2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}
exports.Vec2 = Vec2;
class Vec3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    set(x, y, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}
exports.Vec3 = Vec3;
var HorizontalTextAlignment;
(function (HorizontalTextAlignment) {
    HorizontalTextAlignment[HorizontalTextAlignment["LEFT"] = 0] = "LEFT";
    HorizontalTextAlignment[HorizontalTextAlignment["CENTER"] = 1] = "CENTER";
    HorizontalTextAlignment[HorizontalTextAlignment["RIGHT"] = 2] = "RIGHT";
})(HorizontalTextAlignment = exports.HorizontalTextAlignment || (exports.HorizontalTextAlignment = {}));
var VerticalTextAlignment;
(function (VerticalTextAlignment) {
    VerticalTextAlignment[VerticalTextAlignment["TOP"] = 0] = "TOP";
    VerticalTextAlignment[VerticalTextAlignment["CENTER"] = 1] = "CENTER";
    VerticalTextAlignment[VerticalTextAlignment["BOTTOM"] = 2] = "BOTTOM";
})(VerticalTextAlignment = exports.VerticalTextAlignment || (exports.VerticalTextAlignment = {}));
var KeyCode;
(function (KeyCode) {
    KeyCode[KeyCode["ARROW_LEFT"] = 37] = "ARROW_LEFT";
    KeyCode[KeyCode["ARROW_UP"] = 38] = "ARROW_UP";
    KeyCode[KeyCode["ARROW_RIGHT"] = 39] = "ARROW_RIGHT";
    KeyCode[KeyCode["ARROW_DOWN"] = 40] = "ARROW_DOWN";
    KeyCode[KeyCode["KEY_A"] = 65] = "KEY_A";
    KeyCode[KeyCode["KEY_D"] = 68] = "KEY_D";
    KeyCode[KeyCode["KEY_R"] = 82] = "KEY_R";
    KeyCode[KeyCode["KEY_S"] = 83] = "KEY_S";
    KeyCode[KeyCode["KEY_W"] = 87] = "KEY_W";
    KeyCode[KeyCode["KEY_Z"] = 90] = "KEY_Z";
    KeyCode[KeyCode["SPACE"] = 32] = "SPACE";
    KeyCode[KeyCode["ESCAPE"] = 27] = "ESCAPE";
})(KeyCode = exports.KeyCode || (exports.KeyCode = {}));
class EventTouch {
    constructor(uiX, uiY) {
        this._uiX = uiX;
        this._uiY = uiY;
    }
    getUILocation() {
        return new Vec2(this._uiX, this._uiY);
    }
    getLocation() {
        return new Vec2(this._uiX, this._uiY);
    }
}
exports.EventTouch = EventTouch;
class EventKeyboard {
    constructor(keyCode) {
        this.keyCode = keyCode;
    }
}
exports.EventKeyboard = EventKeyboard;
// -------------------------------------------------------------------------------------
//  Input
// -------------------------------------------------------------------------------------
class Input {
    constructor() {
        this._listeners = new Map();
    }
    on(type, fn, target) {
        const list = this._listeners.get(type) || [];
        list.push({ fn, target });
        this._listeners.set(type, list);
    }
    off(type, fn, target) {
        const list = this._listeners.get(type) || [];
        this._listeners.set(type, list.filter((item) => item.fn !== fn || item.target !== target));
    }
    emit(type, event) {
        const list = [...(this._listeners.get(type) || [])];
        for (const item of list) {
            item.fn.call(item.target, event);
        }
    }
}
exports.Input = Input;
Input.EventType = {
    KEY_DOWN: 'key-down',
    KEY_UP: 'key-up',
};
exports.input = new Input();
// -------------------------------------------------------------------------------------
//  Components
// -------------------------------------------------------------------------------------
class Component {
    constructor() {
        this.enabled = true;
    }
}
exports.Component = Component;
class UITransform extends Component {
    constructor() {
        super(...arguments);
        this.width = exports.Stage.w;
        this.height = exports.Stage.h;
        this.anchorX = 0.5;
        this.anchorY = 0.5;
    }
    setContentSize(w, h) {
        this.width = w;
        this.height = h;
    }
    convertToNodeSpaceAR(worldPt) {
        return new Vec3(worldPt.x - exports.Stage.w * 0.5, worldPt.y - exports.Stage.h * 0.5, 0);
    }
}
exports.UITransform = UITransform;
class UIOpacity extends Component {
    constructor() {
        super(...arguments);
        this.opacity = 255;
    }
}
exports.UIOpacity = UIOpacity;
class Canvas extends Component {
}
exports.Canvas = Canvas;
class Camera extends Component {
    constructor() {
        super(...arguments);
        this.projection = 0;
        this.orthoHeight = exports.Stage.h * 0.5;
    }
}
exports.Camera = Camera;
class Widget extends Component {
}
exports.Widget = Widget;
function buildPaint(ctx, p) {
    let grad;
    if (p.kind === 'linear') {
        grad = ctx.createLinearGradient(p.a, -p.b, p.c, -p.d);
    }
    else {
        grad = ctx.createRadialGradient(p.a, -p.b, p.r0 || 0, p.a, -p.b, Math.max(0.01, p.r1 || 1));
    }
    for (const [off, col] of p.stops)
        grad.addColorStop(Math.max(0, Math.min(1, off)), col);
    return grad;
}
/**
 * Immediate-mode vector painter. Commands are recorded on `clear()`→draw calls and
 * replayed every frame, so a game only rebuilds its display list when state changes.
 *
 * All coordinates are node-local with +Y up; the painter negates Y internally.
 */
class Graphics extends Component {
    constructor() {
        super(...arguments);
        this.lineWidth = 2;
        this.strokeColor = new Color(0, 0, 0, 255);
        this.fillColor = new Color(255, 255, 255, 255);
        this._cmds = [];
        this._pathOpen = false;
        this._fillPaint = null;
        this._strokePaint = null;
    }
    _ensureSubpath(ctx) {
        if (!this._pathOpen) {
            ctx.beginPath();
            this._pathOpen = true;
        }
    }
    clear() {
        this._cmds = [];
        this._pathOpen = false;
        this._fillPaint = null;
        this._strokePaint = null;
    }
    // --- state stack ---------------------------------------------------------------
    save() {
        this._cmds.push((ctx) => ctx.save());
    }
    restore() {
        this._cmds.push((ctx) => {
            ctx.restore();
            this._pathOpen = false;
        });
    }
    /** Clip all subsequent drawing to the current path. Pair with save()/restore(). */
    clip() {
        this._cmds.push((ctx) => {
            ctx.clip();
            this._pathOpen = false;
        });
    }
    /** Multiply subsequent drawing by `a` (0..1). Pair with save()/restore(). */
    setAlpha(a) {
        const v = Math.max(0, Math.min(1, a));
        this._cmds.push((ctx) => {
            ctx.globalAlpha *= v;
        });
    }
    /** 'lighter' gives additive glow; 'multiply' gives shading. */
    setBlend(mode) {
        this._cmds.push((ctx) => {
            ctx.globalCompositeOperation = mode;
        });
    }
    setLineDash(pattern) {
        const p = pattern.slice();
        this._cmds.push((ctx) => ctx.setLineDash(p));
    }
    // --- paints --------------------------------------------------------------------
    /** Linear gradient fill from (x0,y0) to (x1,y1) in node-local space. */
    setFillGradient(x0, y0, x1, y1, stops) {
        this._fillPaint = { kind: 'linear', a: x0, b: y0, c: x1, d: y1, stops };
    }
    /** Radial gradient fill centred at (cx,cy) from radius r0 to r1. */
    setFillRadial(cx, cy, r0, r1, stops) {
        this._fillPaint = { kind: 'radial', a: cx, b: cy, c: 0, d: 0, r0, r1, stops };
    }
    setStrokeGradient(x0, y0, x1, y1, stops) {
        this._strokePaint = { kind: 'linear', a: x0, b: y0, c: x1, d: y1, stops };
    }
    clearFillGradient() {
        this._fillPaint = null;
    }
    clearStrokeGradient() {
        this._strokePaint = null;
    }
    /** Blurred drop shadow / glow applied to subsequent fills and strokes. */
    setShadow(color, blur, offsetX = 0, offsetY = 0) {
        const css = color.toCSS();
        this._cmds.push((ctx) => {
            ctx.shadowColor = css;
            ctx.shadowBlur = blur;
            ctx.shadowOffsetX = offsetX;
            ctx.shadowOffsetY = -offsetY;
        });
    }
    clearShadow() {
        this._cmds.push((ctx) => {
            ctx.shadowColor = 'rgba(0,0,0,0)';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
        });
    }
    // --- path building --------------------------------------------------------------
    moveTo(x, y) {
        this._cmds.push((ctx) => {
            this._ensureSubpath(ctx);
            ctx.moveTo(x, -y);
        });
    }
    lineTo(x, y) {
        this._cmds.push((ctx) => {
            this._ensureSubpath(ctx);
            ctx.lineTo(x, -y);
        });
    }
    quadraticCurveTo(cx, cy, x, y) {
        this._cmds.push((ctx) => {
            this._ensureSubpath(ctx);
            ctx.quadraticCurveTo(cx, -cy, x, -y);
        });
    }
    bezierCurveTo(c1x, c1y, c2x, c2y, x, y) {
        this._cmds.push((ctx) => {
            this._ensureSubpath(ctx);
            ctx.bezierCurveTo(c1x, -c1y, c2x, -c2y, x, -y);
        });
    }
    close() {
        this._cmds.push((ctx) => ctx.closePath());
    }
    circle(cx, cy, r) {
        this._cmds.push((ctx) => {
            this._ensureSubpath(ctx);
            ctx.moveTo(cx + r, -cy);
            ctx.arc(cx, -cy, Math.max(0.1, r), 0, Math.PI * 2);
        });
    }
    ellipse(cx, cy, rx, ry, rotation = 0) {
        this._cmds.push((ctx) => {
            this._ensureSubpath(ctx);
            ctx.moveTo(cx + rx, -cy);
            ctx.ellipse(cx, -cy, Math.max(0.1, rx), Math.max(0.1, ry), -rotation, 0, Math.PI * 2);
        });
    }
    arc(cx, cy, r, startAngle, endAngle, counterclockwise = false) {
        this._cmds.push((ctx) => {
            this._ensureSubpath(ctx);
            ctx.arc(cx, -cy, Math.max(0.1, r), -startAngle, -endAngle, !counterclockwise);
        });
    }
    rect(x, y, w, h) {
        this._cmds.push((ctx) => {
            this._ensureSubpath(ctx);
            ctx.rect(x, -(y + h), w, h);
        });
    }
    roundRect(x, y, w, h, r) {
        this._cmds.push((ctx) => {
            this._ensureSubpath(ctx);
            const sx = x;
            const sy = -(y + h);
            const rad = Math.max(0, Math.min(r, Math.abs(w) * 0.5, Math.abs(h) * 0.5));
            ctx.moveTo(sx + rad, sy);
            ctx.arcTo(sx + w, sy, sx + w, sy + h, rad);
            ctx.arcTo(sx + w, sy + h, sx, sy + h, rad);
            ctx.arcTo(sx, sy + h, sx, sy, rad);
            ctx.arcTo(sx, sy, sx + w, sy, rad);
            ctx.closePath();
        });
    }
    /** Rounded rect with independent corner radii [tl, tr, br, bl] (screen orientation). */
    roundRectEx(x, y, w, h, radii) {
        const rr = [radii[0] || 0, radii[1] || 0, radii[2] || 0, radii[3] || 0];
        this._cmds.push((ctx) => {
            this._ensureSubpath(ctx);
            const sx = x;
            const sy = -(y + h);
            const m = Math.min(Math.abs(w), Math.abs(h)) * 0.5;
            const [tl, tr, br, bl] = rr.map((v) => Math.max(0, Math.min(v, m)));
            ctx.moveTo(sx + tl, sy);
            ctx.lineTo(sx + w - tr, sy);
            ctx.arcTo(sx + w, sy, sx + w, sy + tr, tr);
            ctx.lineTo(sx + w, sy + h - br);
            ctx.arcTo(sx + w, sy + h, sx + w - br, sy + h, br);
            ctx.lineTo(sx + bl, sy + h);
            ctx.arcTo(sx, sy + h, sx, sy + h - bl, bl);
            ctx.lineTo(sx, sy + tl);
            ctx.arcTo(sx, sy, sx + tl, sy, tl);
            ctx.closePath();
        });
    }
    fillRect(x, y, w, h) {
        const col = this.fillColor.toCSS();
        const paint = this._fillPaint;
        this._cmds.push((ctx) => {
            ctx.fillStyle = paint ? buildPaint(ctx, paint) : col;
            ctx.fillRect(x, -(y + h), w, h);
            this._pathOpen = false;
        });
    }
    fill() {
        const col = this.fillColor.toCSS();
        const paint = this._fillPaint;
        this._cmds.push((ctx) => {
            ctx.fillStyle = paint ? buildPaint(ctx, paint) : col;
            ctx.fill();
            this._pathOpen = false;
        });
    }
    stroke() {
        const col = this.strokeColor.toCSS();
        const paint = this._strokePaint;
        const lw = this.lineWidth;
        this._cmds.push((ctx) => {
            ctx.strokeStyle = paint ? buildPaint(ctx, paint) : col;
            ctx.lineWidth = lw;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();
            this._pathOpen = false;
        });
    }
    // --- bitmap art ------------------------------------------------------------------
    //  Generated key art and sprites. Drawing is a no-op until the texture has loaded,
    //  so every call site keeps its procedural fallback and nothing ever pops in broken.
    image(key, cx, cy, w, h, o = {}) {
        const alpha = o.alpha === undefined ? 1 : o.alpha;
        const rot = o.rotation || 0;
        const cover = !!o.cover;
        this._cmds.push((ctx) => {
            const img = Textures.get(key);
            if (!img)
                return;
            ctx.save();
            if (alpha < 1)
                ctx.globalAlpha *= alpha;
            ctx.translate(cx, -cy);
            if (rot)
                ctx.rotate(-rot);
            let dw = w;
            let dh = h;
            let sx = 0;
            let sy = 0;
            let sw = img.naturalWidth;
            let sh = img.naturalHeight;
            if (cover && sw && sh) {
                // Centre-crop the source so the art fills the box without distortion.
                const want = w / h;
                const have = sw / sh;
                if (have > want) {
                    const nw = sh * want;
                    sx = (sw - nw) * 0.5;
                    sw = nw;
                }
                else {
                    const nh = sw / want;
                    sy = (sh - nh) * 0.5;
                    sh = nh;
                }
            }
            ctx.drawImage(img, sx, sy, sw, sh, -dw * 0.5, -dh * 0.5, dw, dh);
            ctx.restore();
            this._pathOpen = false;
        });
    }
    // --- immediate-mode text --------------------------------------------------------
    //  Text in the same display list as the vectors means z-order "just works" and a
    //  HUD can be laid out with plain arithmetic instead of a tree of label nodes.
    text(str, x, y, style = {}) {
        if (str === null || str === undefined || str === '')
            return;
        const s = normaliseStyle(style);
        const body = s.uppercase ? String(str).toUpperCase() : String(str);
        this._cmds.push((ctx) => {
            drawStyledText(ctx, body, x, -y, s);
            this._pathOpen = false;
        });
    }
    _renderToCanvas(ctx) {
        this._pathOpen = false;
        for (let i = 0; i < this._cmds.length; i++)
            this._cmds[i](ctx);
    }
}
exports.Graphics = Graphics;
function normaliseStyle(s) {
    return {
        size: s.size === undefined ? 28 : s.size,
        weight: s.weight === undefined ? 800 : s.weight,
        family: s.family === undefined ? exports.FONT_UI : s.family,
        color: s.color === undefined ? new Color(255, 255, 255, 255) : s.color,
        align: s.align === undefined ? 'center' : s.align,
        baseline: s.baseline === undefined ? 'middle' : s.baseline,
        tracking: s.tracking === undefined ? 0 : s.tracking,
        outline: s.outline === undefined ? null : s.outline,
        outlineWidth: s.outlineWidth === undefined ? 0 : s.outlineWidth,
        shadow: s.shadow === undefined ? null : s.shadow,
        shadowBlur: s.shadowBlur === undefined ? 0 : s.shadowBlur,
        shadowOffsetY: s.shadowOffsetY === undefined ? 0 : s.shadowOffsetY,
        gradient: s.gradient === undefined ? null : s.gradient,
        maxWidth: s.maxWidth === undefined ? 0 : s.maxWidth,
        uppercase: s.uppercase === undefined ? false : s.uppercase,
        lineHeight: s.lineHeight === undefined ? 0 : s.lineHeight,
    };
}
let _measureCtx = null;
function measureCtx() {
    if (!_measureCtx) {
        const c = exports.Platform.createCanvas();
        c.width = 8;
        c.height = 8;
        _measureCtx = c.getContext('2d');
    }
    return _measureCtx;
}
function runWidth(ctx, text, tracking) {
    if (!tracking)
        return ctx.measureText(text).width;
    let w = 0;
    for (const ch of text)
        w += ctx.measureText(ch).width + tracking;
    return Math.max(0, w - tracking);
}
/** Width of `str` in px at the given style — for laying out pills around their label. */
function measureText(str, style = {}) {
    const s = normaliseStyle(style);
    const ctx = measureCtx();
    ctx.font = `${s.weight} ${s.size}px ${s.family}`;
    const body = s.uppercase ? String(str).toUpperCase() : String(str);
    let widest = 0;
    for (const ln of body.split('\n'))
        widest = Math.max(widest, runWidth(ctx, ln, s.tracking));
    if (s.maxWidth > 0 && widest > s.maxWidth)
        return s.maxWidth;
    return widest;
}
exports.measureText = measureText;
function emitRun(ctx, text, x, y, tracking, mode) {
    if (!tracking) {
        if (mode === 'fill')
            ctx.fillText(text, x, y);
        else
            ctx.strokeText(text, x, y);
        return;
    }
    const total = runWidth(ctx, text, tracking);
    let cx = x;
    if (ctx.textAlign === 'center')
        cx = x - total * 0.5;
    else if (ctx.textAlign === 'right')
        cx = x - total;
    const prev = ctx.textAlign;
    ctx.textAlign = 'left';
    for (const ch of text) {
        if (mode === 'fill')
            ctx.fillText(ch, cx, y);
        else
            ctx.strokeText(ch, cx, y);
        cx += ctx.measureText(ch).width + tracking;
    }
    ctx.textAlign = prev;
}
function drawStyledText(ctx, body, x, yScreen, s) {
    ctx.save();
    let size = s.size;
    let tracking = s.tracking;
    ctx.font = `${s.weight} ${size}px ${s.family}`;
    const lines = body.split('\n');
    if (s.maxWidth > 0) {
        let widest = 0;
        for (const ln of lines)
            widest = Math.max(widest, runWidth(ctx, ln, tracking));
        if (widest > s.maxWidth) {
            const k = s.maxWidth / widest;
            size = Math.max(7, size * k);
            tracking *= k;
            ctx.font = `${s.weight} ${size}px ${s.family}`;
        }
    }
    ctx.textAlign = s.align;
    ctx.textBaseline = s.baseline === 'middle' ? 'middle' : s.baseline === 'top' ? 'top' : 'bottom';
    const lh = s.lineHeight ? s.lineHeight * (size / s.size) : size * 1.2;
    const totalH = (lines.length - 1) * lh;
    const startY = s.baseline === 'middle' ? yScreen - totalH * 0.5 : yScreen;
    for (let i = 0; i < lines.length; i++) {
        const ly = startY + i * lh;
        if (s.shadow) {
            ctx.save();
            ctx.shadowColor = s.shadow.toCSS();
            ctx.shadowBlur = s.shadowBlur;
            ctx.shadowOffsetY = -s.shadowOffsetY;
            ctx.fillStyle = s.color.toCSS();
            emitRun(ctx, lines[i], x, ly, tracking, 'fill');
            ctx.restore();
        }
        if (s.outline && s.outlineWidth > 0) {
            ctx.strokeStyle = s.outline.toCSS();
            ctx.lineWidth = s.outlineWidth * 2;
            ctx.lineJoin = 'round';
            ctx.miterLimit = 2;
            emitRun(ctx, lines[i], x, ly, tracking, 'stroke');
        }
        if (s.gradient) {
            const grad = ctx.createLinearGradient(0, ly - size * 0.6, 0, ly + size * 0.58);
            for (const [o, c] of s.gradient)
                grad.addColorStop(Math.max(0, Math.min(1, o)), c);
            ctx.fillStyle = grad;
        }
        else {
            ctx.fillStyle = s.color.toCSS();
        }
        emitRun(ctx, lines[i], x, ly, tracking, 'fill');
    }
    ctx.restore();
}
// -------------------------------------------------------------------------------------
//  Typography
// -------------------------------------------------------------------------------------
/** Display stack: a rounded geometric face reads as "designed" rather than default. */
exports.FONT_DISPLAY = '"Nunito", "SF Pro Rounded", "Avenir Next", system-ui, sans-serif';
exports.FONT_UI = '"Nunito", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
exports.FONT_MONO = '"SF Mono", "Roboto Mono", ui-monospace, monospace';
class Label extends Component {
    constructor() {
        super(...arguments);
        this.string = '';
        this.fontSize = 28;
        this.lineHeight = 34;
        this.color = new Color(0, 0, 0, 255);
        this.isBold = true;
        /** 100..1000; overrides isBold when set. */
        this.fontWeight = 0;
        this.fontFamily = exports.FONT_UI;
        this.horizontalAlign = HorizontalTextAlignment.CENTER;
        this.verticalAlign = VerticalTextAlignment.CENTER;
        /** Extra px between glyphs — tightens display text or opens up small-caps labels. */
        this.letterSpacing = 0;
        /** Outline drawn behind the glyphs; essential for text over busy artwork. */
        this.outlineColor = null;
        this.outlineWidth = 0;
        /** Soft drop shadow behind the glyphs. */
        this.shadowColor = null;
        this.shadowBlur = 0;
        this.shadowOffsetY = 0;
        /** Vertical gradient across the text box, e.g. metallic score numbers. */
        this.gradientStops = null;
        /** Shrink the font until the longest line fits this width (0 = no limit). */
        this.maxWidth = 0;
        /** Uppercase + wide tracking, for eyebrow/section labels. */
        this.uppercase = false;
    }
    _renderToCanvas(ctx) {
        if (!this.string)
            return;
        drawStyledText(ctx, this.uppercase ? this.string.toUpperCase() : this.string, 0, 0, normaliseStyle({
            size: this.fontSize,
            weight: this.fontWeight || (this.isBold ? 700 : 500),
            family: this.fontFamily,
            color: this.color,
            align: this.horizontalAlign === HorizontalTextAlignment.LEFT
                ? 'left'
                : this.horizontalAlign === HorizontalTextAlignment.RIGHT
                    ? 'right'
                    : 'center',
            baseline: 'middle',
            tracking: this.letterSpacing,
            outline: this.outlineColor || undefined,
            outlineWidth: this.outlineWidth,
            shadow: this.shadowColor || undefined,
            shadowBlur: this.shadowBlur,
            shadowOffsetY: this.shadowOffsetY,
            gradient: this.gradientStops || undefined,
            maxWidth: this.maxWidth,
            lineHeight: this.lineHeight,
        }));
    }
}
exports.Label = Label;
// -------------------------------------------------------------------------------------
//  Scene graph
// -------------------------------------------------------------------------------------
class Node {
    constructor(name = 'Node') {
        this.active = true;
        this.isValid = true;
        this.layer = 33554432;
        this.parent = null;
        this.children = [];
        this.position = new Vec3(0, 0, 0);
        /** Uniform or non-uniform scale about the node origin. */
        this.scale = new Vec3(1, 1, 1);
        /** Rotation in degrees, counter-clockwise. */
        this.angle = 0;
        this._components = [];
        this._listeners = new Map();
        this.name = name;
    }
    addChild(child) {
        if (child.parent) {
            const idx = child.parent.children.indexOf(child);
            if (idx !== -1)
                child.parent.children.splice(idx, 1);
        }
        child.parent = this;
        this.children.push(child);
    }
    removeFromParent() {
        if (!this.parent)
            return;
        const idx = this.parent.children.indexOf(this);
        if (idx !== -1)
            this.parent.children.splice(idx, 1);
        this.parent = null;
    }
    setPosition(x, y, z = 0) {
        this.position.x = x;
        this.position.y = y;
        this.position.z = z;
    }
    setScale(sx, sy = sx) {
        this.scale.x = sx;
        this.scale.y = sy;
    }
    addComponent(Ctor) {
        const comp = new Ctor();
        comp.node = this;
        this._components.push(comp);
        if (comp.onLoad)
            comp.onLoad();
        if (comp.start)
            comp.start();
        return comp;
    }
    getComponent(Ctor) {
        for (const c of this._components) {
            if (c instanceof Ctor)
                return c;
        }
        return null;
    }
    getComponentInChildren(Ctor) {
        const selfComp = this.getComponent(Ctor);
        if (selfComp)
            return selfComp;
        for (const ch of this.children) {
            const found = ch.getComponentInChildren(Ctor);
            if (found)
                return found;
        }
        return null;
    }
    on(type, fn, target) {
        const list = this._listeners.get(type) || [];
        list.push({ fn, target });
        this._listeners.set(type, list);
    }
    off(type, fn, target) {
        const list = this._listeners.get(type) || [];
        this._listeners.set(type, list.filter((i) => i.fn !== fn || i.target !== target));
    }
    emit(type, event) {
        const list = [...(this._listeners.get(type) || [])];
        for (const item of list)
            item.fn.call(item.target, event);
    }
    destroy() {
        for (const comp of this._components) {
            if (comp.onDestroy)
                comp.onDestroy();
        }
        this._components = [];
        for (const ch of [...this.children])
            ch.destroy();
        this.children = [];
        this.removeFromParent();
        this.isValid = false;
        this.active = false;
    }
    destroyAllChildren() {
        for (const ch of [...this.children])
            ch.destroy();
        this.children = [];
    }
    _tick(dt) {
        if (!this.active || !this.isValid)
            return;
        for (const comp of this._components) {
            if (comp.enabled && comp.update)
                comp.update(dt);
        }
        for (const ch of [...this.children])
            ch._tick(dt);
    }
    _renderTree(ctx) {
        if (!this.active || !this.isValid)
            return;
        const needsTransform = this.position.x !== 0 ||
            this.position.y !== 0 ||
            this.scale.x !== 1 ||
            this.scale.y !== 1 ||
            this.angle !== 0;
        let opacity = 255;
        for (const comp of this._components) {
            if (comp instanceof UIOpacity) {
                opacity = comp.opacity;
                break;
            }
        }
        const needsAlpha = opacity < 255;
        if (needsTransform || needsAlpha)
            ctx.save();
        if (needsTransform) {
            ctx.translate(this.position.x, -this.position.y);
            if (this.angle !== 0)
                ctx.rotate((-this.angle * Math.PI) / 180);
            if (this.scale.x !== 1 || this.scale.y !== 1)
                ctx.scale(this.scale.x, this.scale.y);
        }
        if (needsAlpha)
            ctx.globalAlpha *= Math.max(0, opacity) / 255;
        if (opacity > 0) {
            for (const comp of this._components) {
                if (comp instanceof Graphics)
                    comp._renderToCanvas(ctx);
                else if (comp instanceof Label)
                    comp._renderToCanvas(ctx);
            }
            for (const ch of this.children)
                ch._renderTree(ctx);
        }
        if (needsTransform || needsAlpha)
            ctx.restore();
    }
}
exports.Node = Node;
Node.EventType = {
    TOUCH_START: 'touch-start',
    TOUCH_MOVE: 'touch-move',
    TOUCH_END: 'touch-end',
    TOUCH_CANCEL: 'touch-cancel',
};
// -------------------------------------------------------------------------------------
//  Director
// -------------------------------------------------------------------------------------
class Director {
    constructor() {
        this._scene = new Node('MainScene');
        this._listeners = new Map();
    }
    getScene() {
        return this._scene;
    }
    on(event, cb) {
        const list = this._listeners.get(event) || [];
        list.push(cb);
        this._listeners.set(event, list);
    }
    emit(event) {
        const list = [...(this._listeners.get(event) || [])];
        for (const cb of list)
            cb();
    }
}
exports.Director = Director;
Director.EVENT_AFTER_SCENE_LAUNCH = 'director-after-scene-launch';
exports.director = new Director();
exports.Platform = {
    createCanvas: () => document.createElement('canvas'),
    createImage: () => new Image(),
    getStore: (key) => {
        try {
            return typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
        }
        catch (e) {
            return null;
        }
    },
    setStore: (key, value) => {
        try {
            if (typeof localStorage !== 'undefined')
                localStorage.setItem(key, value);
        }
        catch (e) {
            /* storage blocked — the session still works, it just will not persist */
        }
    },
};
/** Called once by the native entry point before anything renders. */
function setPlatform(hooks) {
    Object.assign(exports.Platform, hooks);
}
exports.setPlatform = setPlatform;
// -------------------------------------------------------------------------------------
//  Textures — tiny image registry for the generated key art and sprites
// -------------------------------------------------------------------------------------
//  Art is optional by design: the games paint procedurally and only swap in a bitmap
//  once it is decoded, so a slow network or a blocked request costs nothing but polish.
class Textures {
    static load(manifest) {
        for (const key in manifest) {
            if (this._imgs[key])
                continue;
            this._total++;
            const img = exports.Platform.createImage();
            img.decoding = 'async';
            img.onload = () => {
                this._ready[key] = true;
                this._loaded++;
            };
            img.onerror = () => {
                this._loaded++;
            };
            img.src = manifest[key];
            this._imgs[key] = img;
        }
    }
    static get(key) {
        return this._ready[key] ? this._imgs[key] : null;
    }
    static has(key) {
        return !!this._ready[key];
    }
    /** 0..1 across everything handed to load(). */
    static get progress() {
        return this._total === 0 ? 1 : this._loaded / this._total;
    }
}
exports.Textures = Textures;
Textures._imgs = {};
Textures._ready = {};
Textures._total = 0;
Textures._loaded = 0;

  };

  // === MODULE: ./sdk/TikTokSDK ===
  __modules["./sdk/TikTokSDK"] = function(module, exports, require) {
"use strict";
// =====================================================================================
//  TikTokSDK — Pangle IAA wrapper for TikTok Mini Games (window.tt)
// =====================================================================================
//  Two rules drive this file:
//
//    1. An ad must never block play. If the network is down, the unit is unfilled, or
//       the SDK throws, the player still gets their reward and the game moves on. We
//       lose the impression, not the session.
//    2. Ads are preloaded. Creating and loading a unit at the moment the player taps
//       "Continue" means a visible stall at the worst possible time, so the units are
//       built once at boot and reloaded immediately after each close.
//
//  Frequency and placement policy does NOT live here — that is AdDirector's job. This
//  file only knows how to show an ad and whether one is ready.
// =====================================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.TikTokSDK = void 0;
// Tier-1 Pangle averages, used only for the in-dev revenue readout.
const ECPM_REWARDED = 20.0;
const ECPM_INTERSTITIAL = 8.0;
/**
 * The host SDK object, however this runtime spells it.
 *
 * TikTok says the `TTMinis.game`, `tt` and `wx` prefixes are interchangeable, and the
 * Native Runtime has no `window` at all — so we look on `globalThis` and accept any of
 * them. Returns undefined in the browser preview, which is what keeps the studio build
 * running with no TikTok around.
 */
function host() {
    const g = typeof globalThis !== 'undefined' ? globalThis : undefined;
    if (!g)
        return undefined;
    return g.tt || (g.TTMinis && g.TTMinis.game) || g.wx || undefined;
}
class TikTokSDK {
    static get stats() {
        return this._stats;
    }
    static isTikTokEnvironment() {
        return !!host();
    }
    /** True while an ad is on screen — the game must stay paused and swallow input. */
    static get isShowing() {
        return this._showing;
    }
    static setAdUnits(rewarded, interstitial) {
        this._rewardedAdUnitId = rewarded;
        this._interstitialAdUnitId = interstitial;
        this._rewardedAd = null;
        this._interstitialAd = null;
        this._rewardedLoaded = false;
        this.preload();
    }
    static registerAdOverlayHandler(handler) {
        this._onAdOverlayRequest = handler;
    }
    // =================================================================================
    //  Preload
    // =================================================================================
    /** Build and warm both units. Safe to call repeatedly; call once at boot. */
    static preload() {
        const tt = host();
        if (!tt)
            return;
        try {
            if (!this._rewardedAd && typeof tt.createRewardedVideoAd === 'function') {
                this._rewardedAd = tt.createRewardedVideoAd({ adUnitId: this._rewardedAdUnitId });
                if (this._rewardedAd.onLoad)
                    this._rewardedAd.onLoad(() => (this._rewardedLoaded = true));
                if (this._rewardedAd.onError) {
                    this._rewardedAd.onError(() => {
                        this._rewardedLoaded = false;
                    });
                }
                this._reloadRewarded();
            }
            if (!this._interstitialAd && typeof tt.createInterstitialAd === 'function') {
                this._interstitialAd = tt.createInterstitialAd({ adUnitId: this._interstitialAdUnitId });
                if (this._interstitialAd.load)
                    this._interstitialAd.load().catch(() => { });
            }
        }
        catch (_e) {
            /* preload is best-effort */
        }
    }
    /** Throw the spent instance away and build its replacement. */
    static _recreateRewarded() {
        this._rewardedLoaded = false;
        this._rewardedAd = null;
        this.preload();
    }
    static _reloadRewarded() {
        if (!this._rewardedAd || !this._rewardedAd.load)
            return;
        try {
            const p = this._rewardedAd.load();
            if (p && p.then) {
                p.then(() => (this._rewardedLoaded = true)).catch(() => (this._rewardedLoaded = false));
            }
            else {
                this._rewardedLoaded = true;
            }
        }
        catch (_e) {
            this._rewardedLoaded = false;
        }
    }
    /**
     * Whether a rewarded ad can be shown right now. Outside TikTok this is always true
     * so the simulated overlay can be exercised in the browser preview.
     */
    static isRewardedReady() {
        if (this._showing)
            return false;
        if (!this.isTikTokEnvironment())
            return true;
        return !!this._rewardedAd && this._rewardedLoaded;
    }
    // =================================================================================
    //  Rewarded video — always opt-in, always user-initiated
    // =================================================================================
    /**
     * `onResult` always fires exactly once.
     *   completed → the player watched it through; grant the reward
     *   skipped   → the player closed it early; grant nothing
     *   failed    → our side broke; GRANT THE REWARD ANYWAY
     *
     * That last case matters: punishing a player for our unfilled ad request is how a
     * game gets uninstalled.
     */
    static showRewardedVideoAd(reason, onRewardGranted, onCancelled, onResult) {
        if (this._showing) {
            if (onCancelled)
                onCancelled();
            if (onResult)
                onResult('skipped');
            return;
        }
        let settled = false;
        const finish = (outcome) => {
            if (settled)
                return;
            settled = true;
            this._showing = false;
            if (outcome === 'completed') {
                this._stats.rewardedImpressions++;
                this._stats.rewardedCompleted++;
                this._addRevenue(ECPM_REWARDED);
            }
            else if (outcome === 'failed') {
                this._stats.rewardedFailed++;
            }
            if (outcome === 'skipped') {
                if (onCancelled)
                    onCancelled();
            }
            else {
                // completed AND failed both grant.
                onRewardGranted();
            }
            if (onResult)
                onResult(outcome);
        };
        const ad = this._rewardedAd;
        if (ad && typeof ad.show === 'function') {
            this._showing = true;
            try {
                const closeHandler = (res) => {
                    if (ad.offClose)
                        ad.offClose(closeHandler);
                    // TikTok releases a rewarded instance once it has been shown, so the
                    // next ad needs a brand new one — reloading this one shows nothing.
                    this._recreateRewarded();
                    finish(res && res.isEnded ? 'completed' : 'skipped');
                };
                ad.onClose(closeHandler);
                const shown = ad.show();
                if (shown && shown.catch) {
                    shown.catch(() => {
                        // One retry through load(), then give up and grant.
                        try {
                            ad.load()
                                .then(() => ad.show())
                                .catch(() => {
                                if (ad.offClose)
                                    ad.offClose(closeHandler);
                                this._showing = false;
                                this._fallback(reason, 'rewarded', finish);
                            });
                        }
                        catch (_e) {
                            if (ad.offClose)
                                ad.offClose(closeHandler);
                            this._showing = false;
                            this._fallback(reason, 'rewarded', finish);
                        }
                    });
                }
                return;
            }
            catch (_e) {
                this._showing = false;
            }
        }
        this._fallback(reason, 'rewarded', finish);
    }
    // =================================================================================
    //  Interstitial — never user-initiated, so it must be rate-limited by AdDirector
    // =================================================================================
    /** `onDone` always fires exactly once, whether or not an ad actually played. */
    static showInterstitialAd(onDone, reason = 'Sponsored break') {
        let settled = false;
        const finish = (played) => {
            if (settled)
                return;
            settled = true;
            this._showing = false;
            if (played) {
                this._stats.interstitialImpressions++;
                this._addRevenue(ECPM_INTERSTITIAL);
            }
            if (onDone)
                onDone();
        };
        if (this._showing) {
            finish(false);
            return;
        }
        const ad = this._interstitialAd;
        if (ad && typeof ad.show === 'function') {
            this._showing = true;
            try {
                const closeHandler = () => {
                    if (ad.offClose)
                        ad.offClose(closeHandler);
                    if (ad.load)
                        ad.load().catch(() => { });
                    finish(true);
                };
                if (ad.onClose)
                    ad.onClose(closeHandler);
                const shown = ad.show();
                if (shown && shown.catch) {
                    // Unfilled interstitials are common and completely fine: skip it.
                    shown.catch(() => {
                        if (ad.offClose)
                            ad.offClose(closeHandler);
                        this._showing = false;
                        if (ad.load)
                            ad.load().catch(() => { });
                        finish(false);
                    });
                }
                if (!ad.onClose)
                    finish(true);
                return;
            }
            catch (_e) {
                this._showing = false;
            }
        }
        this._fallback(reason, 'interstitial', (outcome) => finish(outcome === 'completed'));
    }
    // =================================================================================
    //  Browser / editor fallback
    // =================================================================================
    static _fallback(reason, kind, finish) {
        if (!this._onAdOverlayRequest) {
            // No simulated overlay registered: treat as a failed fill and grant.
            finish('failed');
            return;
        }
        this._showing = true;
        this._onAdOverlayRequest(reason, kind, (rewarded) => {
            this._showing = false;
            finish(rewarded ? 'completed' : 'skipped');
        });
    }
    static _addRevenue(ecpm) {
        this._stats.estimatedRevenueUSD = +(this._stats.estimatedRevenueUSD + ecpm / 1000).toFixed(4);
    }
    /** The one-time authorization code from silent login, if we got one. */
    static get loginCode() {
        return this._loginCode;
    }
    static login(onCode) {
        if (this._loginTried) {
            if (this._loginCode && onCode)
                onCode(this._loginCode);
            return;
        }
        this._loginTried = true;
        const tt = host();
        if (!tt || typeof tt.login !== 'function')
            return;
        try {
            tt.login({
                success: (res) => {
                    this._loginCode = (res && res.code) || null;
                    if (this._loginCode && onCode)
                        onCode(this._loginCode);
                },
                fail: () => {
                    /* signed-out play is still play */
                },
            });
        }
        catch (_e) {
            /* never let login break the boot */
        }
    }
    // =================================================================================
    //  Misc TikTok surface
    // =================================================================================
    static toggleScreenRecorder() {
        const tt = host();
        if (tt && typeof tt.getGameRecorderManager === 'function') {
            if (!this._recorder)
                this._recorder = tt.getGameRecorderManager();
            if (!this._stats.isRecording) {
                this._recorder.start({ duration: 60 });
                this._stats.isRecording = true;
            }
            else {
                this._recorder.stop();
                this._stats.isRecording = false;
            }
            return this._stats.isRecording;
        }
        this._stats.isRecording = !this._stats.isRecording;
        return this._stats.isRecording;
    }
    static shareToTikTok(gameTitle, level, score) {
        const tt = host();
        const msg = `Can you beat Level ${level} in ${gameTitle}? My score: ${score}! #TikTokMiniGame #${gameTitle.replace(/\s+/g, '')}`;
        if (tt && typeof tt.shareAppMessage === 'function') {
            tt.shareAppMessage({ title: msg, desc: msg });
        }
        return msg;
    }
}
exports.TikTokSDK = TikTokSDK;
TikTokSDK._rewardedAdUnitId = 'tt_ad_rewarded_nyandoku_001';
TikTokSDK._interstitialAdUnitId = 'tt_ad_interstitial_001';
TikTokSDK._stats = {
    rewardedImpressions: 0,
    rewardedCompleted: 0,
    rewardedFailed: 0,
    interstitialImpressions: 0,
    estimatedRevenueUSD: 0,
    isRecording: false,
};
TikTokSDK._rewardedAd = null;
TikTokSDK._interstitialAd = null;
TikTokSDK._rewardedLoaded = false;
TikTokSDK._showing = false;
TikTokSDK._onAdOverlayRequest = null;
TikTokSDK._recorder = null;
// =================================================================================
//  Silent login
// =================================================================================
//  TikTok's review scans for the login integration, and monetization needs a known
//  user. `login` needs no user interaction, so it runs once at boot and the game
//  never waits on it — if it fails the player simply plays signed-out.
//
//  The authorization code is only useful to a backend (it exchanges it for an access
//  token at open.tiktokapis.com). We have no backend yet, so we keep the code and
//  hand it to `onCode` for whoever wants it later.
TikTokSDK._loginCode = null;
TikTokSDK._loginTried = false;

  };
  __alias["../sdk/TikTokSDK"] = "./sdk/TikTokSDK";

  // === MODULE: ./core/Theme ===
  __modules["./core/Theme"] = function(module, exports, require) {
"use strict";
// =====================================================================================
//  Theme — the single source of truth for the arcade's visual language.
// =====================================================================================
//  Every colour, radius, shadow and motion curve in the suite comes from here. Games
//  pick a Palette; all shared chrome (HUD, buttons, modals, level map) is drawn from
//  the same tokens so five very different games still feel like one product.
// =====================================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stage = exports.onRelayout = exports.damp = exports.lerp = exports.clamp01 = exports.clamp = exports.Ease = exports.PALETTES = exports.T = exports.rgba = exports.hex = void 0;
const cc_1 = require("cc");
Object.defineProperty(exports, "Stage", { enumerable: true, get: function () { return cc_1.Stage; } });
function hex(h, alpha = 255) {
    const c = h.replace('#', '');
    const r = parseInt(c.substring(0, 2), 16) || 0;
    const g = parseInt(c.substring(2, 4), 16) || 0;
    const b = parseInt(c.substring(4, 6), 16) || 0;
    const a = c.length === 8 ? parseInt(c.substring(6, 8), 16) : alpha;
    return new cc_1.Color(r, g, b, a);
}
exports.hex = hex;
/** CSS rgba string straight from a hex + 0..1 alpha — for gradient stops. */
function rgba(h, alpha = 1) {
    const c = h.replace('#', '');
    const r = parseInt(c.substring(0, 2), 16) || 0;
    const g = parseInt(c.substring(2, 4), 16) || 0;
    const b = parseInt(c.substring(4, 6), 16) || 0;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
exports.rgba = rgba;
// -------------------------------------------------------------------------------------
//  Core tokens
// -------------------------------------------------------------------------------------
exports.T = {
    /** Stage. Width is fixed; HEIGHT FOLLOWS THE DEVICE — read it, never assume 1280. */
    W: 720,
    H: 1280,
    /** Safe area: TikTok's in-app browser chrome eats the extremes of the frame. */
    safeTop: 96,
    safeBottom: 118,
    gutter: 40,
    /** Device notch / home-indicator insets, in stage units, set by the runtime. */
    insetTop: 0,
    insetBottom: 0,
    /** Neutral ramp — the chrome that wraps every game. */
    ink: '#07080F',
    ink2: '#0E1020',
    surface: '#171B30',
    surfaceHi: '#222741',
    surfaceMax: '#2E3454',
    textHi: '#FFFFFF',
    text: '#E8EBF7',
    textDim: '#98A0C2',
    textFaint: '#626A8C',
    /** Brand accents. */
    pink: '#FE2C55',
    cyan: '#25F4EE',
    gold: '#FFC53D',
    mint: '#3DDC97',
    violet: '#9A7BFF',
    coral: '#FF7A59',
    danger: '#FF4D6D',
    /** Radii. */
    rSm: 12,
    rMd: 20,
    rLg: 30,
    rXl: 44,
    /** Type scale (px on the 720-wide stage). */
    fDisplay: 76,
    fTitle: 48,
    fHeading: 36,
    fBody: 27,
    fSmall: 23,
    fTiny: 19,
    fEyebrow: 20,
};
exports.PALETTES = {
    hub: {
        id: 'hub',
        bgTop: '#120A20',
        bgBottom: '#05060E',
        aura1: '#FE2C55',
        aura2: '#25F4EE',
        accent: '#FE2C55',
        accentDeep: '#B31033',
        accent2: '#25F4EE',
        board: '#171B30',
        boardHi: '#222741',
        boardInk: '#E8EBF7',
    },
    // Nyandoku — warm cream parlour, dusk plum chrome.
    nyandoku: {
        id: 'nyandoku',
        bgTop: '#2A1B33',
        bgBottom: '#120B1A',
        aura1: '#F2A65A',
        aura2: '#B06AB3',
        accent: '#F79A3E',
        accentDeep: '#C2651A',
        accent2: '#7FD1C8',
        board: '#FBF3E4',
        boardHi: '#FFFDF7',
        boardInk: '#3A2A22',
    },
    // Save Doge — sunset canyon over molten lava.
    savedoge: {
        id: 'savedoge',
        bgTop: '#3A1726',
        bgBottom: '#140810',
        aura1: '#FF6B35',
        aura2: '#FFC53D',
        accent: '#FF8A3D',
        accentDeep: '#C4441A',
        accent2: '#FFD84D',
        board: '#FFF2DC',
        boardHi: '#FFF9EC',
        boardInk: '#4A2E19',
    },
    // Apple Worm — deep orchard night, electric lime.
    appleworm: {
        id: 'appleworm',
        bgTop: '#06241F',
        bgBottom: '#03110F',
        aura1: '#3DDC97',
        aura2: '#9BE564',
        accent: '#3DDC97',
        accentDeep: '#13825A',
        accent2: '#FF5252',
        board: '#0C2E28',
        boardHi: '#124038',
        boardInk: '#DFF7EE',
    },
    // Parabox — cold laboratory blue, recursive grid.
    parabox: {
        id: 'parabox',
        bgTop: '#0C1430',
        bgBottom: '#04060F',
        aura1: '#4D8BFF',
        aura2: '#9A7BFF',
        accent: '#4D8BFF',
        accentDeep: '#1E47B8',
        accent2: '#FFC53D',
        board: '#101936',
        boardHi: '#19234A',
        boardInk: '#D7E2FF',
    },
    // Isle of Glass — cathedral dusk, stained light.
    isleofglass: {
        id: 'isleofglass',
        bgTop: '#1C1038',
        bgBottom: '#07040F',
        aura1: '#B06AB3',
        aura2: '#4ECDC4',
        accent: '#C77DFF',
        accentDeep: '#7B2CBF',
        accent2: '#4ECDC4',
        board: '#140C28',
        boardHi: '#1F1440',
        boardInk: '#EADCFF',
    },
};
// -------------------------------------------------------------------------------------
//  Motion
// -------------------------------------------------------------------------------------
//  Game UI lives or dies on its easing. Linear motion is the clearest signal that
//  nobody tuned the feel; these are the four curves the whole suite animates on.
exports.Ease = {
    /** Settles fast, no overshoot — for anything that must feel responsive. */
    outCubic: (t) => 1 - Math.pow(1 - t, 3),
    outQuint: (t) => 1 - Math.pow(1 - t, 5),
    inOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    /** Overshoots then settles — for rewards, pops and entrances. */
    outBack: (t, s = 1.7) => {
        const c = s + 1;
        return 1 + c * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2);
    },
    /** Springy bounce — for coins, stars, confetti. */
    outElastic: (t) => {
        if (t === 0 || t === 1)
            return t;
        const p = 0.4;
        return Math.pow(2, -10 * t) * Math.sin(((t - p / 4) * (Math.PI * 2)) / p) + 1;
    },
    outBounce: (t) => {
        const n = 7.5625;
        const d = 2.75;
        if (t < 1 / d)
            return n * t * t;
        if (t < 2 / d)
            return n * (t -= 1.5 / d) * t + 0.75;
        if (t < 2.5 / d)
            return n * (t -= 2.25 / d) * t + 0.9375;
        return n * (t -= 2.625 / d) * t + 0.984375;
    },
};
function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
}
exports.clamp = clamp;
function clamp01(v) {
    return clamp(v, 0, 1);
}
exports.clamp01 = clamp01;
function lerp(a, b, t) {
    return a + (b - a) * t;
}
exports.lerp = lerp;
/** Smooth frame-rate independent approach, for cameras and cursors. */
function damp(current, target, lambda, dt) {
    return lerp(current, target, 1 - Math.exp(-lambda * dt));
}
exports.damp = damp;
const _relayout = [];
/** Run `fn` now and again on every stage resize. */
function onRelayout(fn) {
    _relayout.push(fn);
    fn();
}
exports.onRelayout = onRelayout;
(0, cc_1.onStageResize)((w, h) => {
    exports.T.W = w;
    exports.T.H = h;
    exports.T.insetTop = cc_1.Stage.insetTop;
    exports.T.insetBottom = cc_1.Stage.insetBottom;
    // A breathing margin plus whatever the device's notch and home indicator claim.
    exports.T.safeTop = 42 + exports.T.insetTop;
    exports.T.safeBottom = 36 + exports.T.insetBottom;
    for (const fn of _relayout)
        fn();
});

  };
  __alias["../core/Theme"] = "./core/Theme";
  __alias["./Theme"] = "./core/Theme";

  // === MODULE: ./core/UIKit ===
  __modules["./core/UIKit"] = function(module, exports, require) {
"use strict";
// =====================================================================================
//  UIKit — the shared component library every screen in the arcade is built from.
// =====================================================================================
//  Everything is immediate-mode: a screen clears its Graphics, calls these helpers in
//  z-order and is done. No node trees to keep in sync, which is what lets five games
//  share one look while each keeps its own palette.
//
//  The visual grammar, applied consistently:
//    • Depth comes from a real blurred shadow + a 1px top highlight, never a flat border
//    • Fills are vertical gradients, never a single rgba()
//    • Interactive things have a bottom "lip" that compresses on press
//    • Accent colour appears as an additive glow, not just a border
// =====================================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.contains = exports.hitTest = exports.levelRail = exports.hintRibbon = exports.topBar = exports.icon = exports.starRow = exports.progressBar = exports.chip = exports.iconButton = exports.button = exports.scrim = exports.glass = exports.panel = exports.motes = exports.backdrop = void 0;
const cc_1 = require("cc");
const Theme_1 = require("./Theme");
// =====================================================================================
//  Backdrop
// =====================================================================================
/**
 * Full-stage background: deep vertical gradient, two slowly drifting aurora blobs and
 * a vignette. Costs three gradient fills a frame and does more for perceived quality
 * than anything else in this file.
 */
function backdrop(g, pal, time) {
    const { W, H } = Theme_1.T;
    const hw = W * 0.5;
    const hh = H * 0.5;
    g.setFillGradient(0, hh, 0, -hh, [
        [0, pal.bgTop],
        [0.55, (0, Theme_1.rgba)(pal.bgBottom, 0.82)],
        [1, pal.bgBottom],
    ]);
    g.rect(-hw, -hh, W, H);
    g.fill();
    g.clearFillGradient();
    // Aurora blobs — additive so they read as light, not paint.
    g.save();
    g.setBlend('lighter');
    const d1x = Math.sin(time * 0.21) * 120;
    const d1y = Math.cos(time * 0.17) * 90;
    g.setFillRadial(-150 + d1x, 330 + d1y, 0, 440, [
        [0, (0, Theme_1.rgba)(pal.aura1, 0.4)],
        [0.5, (0, Theme_1.rgba)(pal.aura1, 0.12)],
        [1, (0, Theme_1.rgba)(pal.aura1, 0)],
    ]);
    g.circle(-150 + d1x, 330 + d1y, 440);
    g.fill();
    const d2x = Math.cos(time * 0.15) * 140;
    const d2y = Math.sin(time * 0.23) * 110;
    g.setFillRadial(190 + d2x, -300 + d2y, 0, 420, [
        [0, (0, Theme_1.rgba)(pal.aura2, 0.32)],
        [0.5, (0, Theme_1.rgba)(pal.aura2, 0.1)],
        [1, (0, Theme_1.rgba)(pal.aura2, 0)],
    ]);
    g.circle(190 + d2x, -300 + d2y, 420);
    g.fill();
    g.clearFillGradient();
    g.restore();
    // Vignette keeps the eye on the play area.
    g.setFillRadial(0, 0, H * 0.34, H * 0.78, [
        [0, 'rgba(0,0,0,0)'],
        [1, 'rgba(0,0,0,0.55)'],
    ]);
    g.rect(-hw, -hh, W, H);
    g.fill();
    g.clearFillGradient();
}
exports.backdrop = backdrop;
/** Faint drifting motes — cheap parallax that keeps a static screen alive. */
function motes(g, time, count, tint, seed = 1) {
    g.save();
    g.setBlend('lighter');
    for (let i = 0; i < count; i++) {
        const n = i * 127.1 + seed * 311.7;
        const bx = ((Math.sin(n) * 43758.5453) % 1) * Theme_1.T.W - Theme_1.T.W * 0.5;
        const speed = 14 + (Math.abs(Math.sin(n * 1.7)) % 1) * 26;
        const by = (((Math.cos(n) * 24634.6345) % 1) * Theme_1.T.H + time * speed) % Theme_1.T.H;
        const r = 1.6 + (Math.abs(Math.cos(n * 2.3)) % 1) * 3.4;
        const a = 0.12 + (Math.abs(Math.sin(n * 3.1)) % 1) * 0.3;
        g.fillColor = (0, Theme_1.hex)(tint, Math.round(a * 255));
        g.circle(bx, by - Theme_1.T.H * 0.5, r);
        g.fill();
    }
    g.restore();
}
exports.motes = motes;
function panel(g, cx, cy, w, h, o = {}) {
    const r = o.radius === undefined ? Theme_1.T.rLg : o.radius;
    const x = cx - w * 0.5;
    const y = cy - h * 0.5;
    const fill = o.fill || [Theme_1.T.surfaceHi, Theme_1.T.surface];
    if (o.alpha !== undefined) {
        g.save();
        g.setAlpha(o.alpha);
    }
    if (o.glow) {
        g.save();
        g.setBlend('lighter');
        g.setShadow((0, Theme_1.hex)(o.glow, Math.round(255 * (o.glowStrength === undefined ? 0.5 : o.glowStrength))), 34, 0, 0);
        g.fillColor = (0, Theme_1.hex)(o.glow, 40);
        g.roundRect(x, y, w, h, r);
        g.fill();
        g.clearShadow();
        g.restore();
    }
    if (o.shadow !== false) {
        g.setShadow((0, Theme_1.hex)(o.shadowColor || '#000000', 150), o.shadowBlur === undefined ? 28 : o.shadowBlur, 0, o.shadowY === undefined ? -12 : o.shadowY);
    }
    g.setFillGradient(0, y + h, 0, y, [
        [0, fill[0]],
        [1, fill[1]],
    ]);
    g.roundRect(x, y, w, h, r);
    g.fill();
    g.clearFillGradient();
    g.clearShadow();
    if (o.highlight !== false) {
        g.save();
        g.roundRect(x, y, w, h, r);
        g.clip();
        g.setFillGradient(0, y + h, 0, y + h - 3, [
            [0, 'rgba(255,255,255,0.30)'],
            [1, 'rgba(255,255,255,0)'],
        ]);
        g.rect(x, y + h - 3, w, 3);
        g.fill();
        g.clearFillGradient();
        g.restore();
    }
    if (o.border) {
        g.strokeColor = o.border;
        g.lineWidth = o.borderWidth === undefined ? 2 : o.borderWidth;
        g.roundRect(x, y, w, h, r);
        g.stroke();
    }
    if (o.alpha !== undefined)
        g.restore();
}
exports.panel = panel;
/** Frosted card for overlays on top of live gameplay. */
function glass(g, cx, cy, w, h, radius = Theme_1.T.rLg, tint = '#FFFFFF') {
    panel(g, cx, cy, w, h, {
        radius,
        fill: [(0, Theme_1.rgba)(tint, 0.14), (0, Theme_1.rgba)(tint, 0.06)],
        border: (0, Theme_1.hex)(tint, 38),
        borderWidth: 1.5,
        shadowBlur: 24,
        shadowY: -8,
    });
}
exports.glass = glass;
/** Full-stage dim for modals. */
function scrim(g, alpha) {
    g.fillColor = new cc_1.Color(4, 5, 12, Math.round((0, Theme_1.clamp01)(alpha) * 225));
    g.rect(-Theme_1.T.W * 0.5, -Theme_1.T.H * 0.5, Theme_1.T.W, Theme_1.T.H);
    g.fill();
}
exports.scrim = scrim;
function toneSpec(tone, pal) {
    switch (tone) {
        case 'accent':
            return {
                top: (0, Theme_1.hex)(pal.accent).shade(0.22).toCSS(),
                bottom: pal.accent,
                lip: pal.accentDeep,
                text: '#FFFFFF',
                glow: pal.accent,
            };
        case 'gold':
            return { top: '#FFE08A', bottom: Theme_1.T.gold, lip: '#C2871A', text: '#43320A', glow: Theme_1.T.gold };
        case 'success':
            return { top: '#78F0BD', bottom: Theme_1.T.mint, lip: '#158A5C', text: '#04301F', glow: Theme_1.T.mint };
        case 'danger':
            return { top: '#FF8097', bottom: Theme_1.T.danger, lip: '#B0203D', text: '#FFFFFF', glow: Theme_1.T.danger };
        case 'ghost':
            return {
                top: 'rgba(255,255,255,0.13)',
                bottom: 'rgba(255,255,255,0.07)',
                lip: 'rgba(0,0,0,0.26)',
                text: Theme_1.T.text,
                glow: null,
            };
        default:
            return { top: Theme_1.T.surfaceMax, bottom: Theme_1.T.surfaceHi, lip: '#0B0E1C', text: Theme_1.T.text, glow: null };
    }
}
/**
 * Chunky 3D pill. The "lip" underneath is the whole trick: it gives the control a
 * physical thickness that compresses on press, so taps feel mechanical.
 */
function button(g, b, pal, o = {}) {
    const tone = toneSpec(b.tone || 'neutral', pal);
    const disabled = !!b.disabled;
    const pressed = !!o.pressed && !disabled;
    const time = o.time || 0;
    const lipH = Math.max(5, b.h * 0.12);
    const sink = pressed ? lipH * 0.72 : 0;
    const r = b.h * 0.5;
    const cy = b.y - sink;
    const x = b.x - b.w * 0.5;
    if (disabled) {
        g.save();
        g.setAlpha(0.42);
    }
    // Pulsing attention ring on the primary CTA.
    if (b.pulse && !disabled && tone.glow) {
        const p = (Math.sin(time * 3.0) + 1) * 0.5;
        g.save();
        g.setBlend('lighter');
        g.setAlpha(0.22 + p * 0.3);
        g.setShadow((0, Theme_1.hex)(tone.glow, 220), 26 + p * 20, 0, 0);
        g.fillColor = (0, Theme_1.hex)(tone.glow, 70);
        g.roundRect(x - 3, cy - b.h * 0.5 - 3, b.w + 6, b.h + 6, r + 3);
        g.fill();
        g.clearShadow();
        g.restore();
    }
    // Lip — the solid side of the button.
    g.fillColor = typeof tone.lip === 'string' && tone.lip.startsWith('rgba') ? new cc_1.Color(0, 0, 0, 66) : (0, Theme_1.hex)(tone.lip);
    g.roundRect(x, cy - b.h * 0.5 - (lipH - sink), b.w, b.h + (lipH - sink), r);
    g.fill();
    // Contact shadow on the stage beneath.
    if (!pressed) {
        g.setShadow(new cc_1.Color(0, 0, 0, 120), 16, 0, -6);
    }
    g.setFillGradient(0, cy + b.h * 0.5, 0, cy - b.h * 0.5, [
        [0, tone.top],
        [1, tone.bottom],
    ]);
    g.roundRect(x, cy - b.h * 0.5, b.w, b.h, r);
    g.fill();
    g.clearFillGradient();
    g.clearShadow();
    // Gloss across the upper half.
    g.save();
    g.roundRect(x, cy - b.h * 0.5, b.w, b.h, r);
    g.clip();
    g.setFillGradient(0, cy + b.h * 0.5, 0, cy + b.h * 0.02, [
        [0, 'rgba(255,255,255,0.34)'],
        [1, 'rgba(255,255,255,0)'],
    ]);
    g.rect(x, cy + b.h * 0.02, b.w, b.h * 0.48);
    g.fill();
    g.clearFillGradient();
    // Specular sweep on pulsing CTAs.
    if (b.pulse && !disabled) {
        const sweep = ((time * 0.55) % 2.4) / 2.4;
        const sx = x - b.w * 0.5 + sweep * b.w * 2;
        g.setBlend('lighter');
        g.setFillGradient(sx - 50, 0, sx + 50, 0, [
            [0, 'rgba(255,255,255,0)'],
            [0.5, 'rgba(255,255,255,0.3)'],
            [1, 'rgba(255,255,255,0)'],
        ]);
        g.rect(sx - 50, cy - b.h * 0.5, 100, b.h);
        g.fill();
        g.clearFillGradient();
    }
    g.restore();
    // Content: icon + label, centred as a group.
    const labelCol = o.labelColor || (0, Theme_1.hex)(tone.text);
    const fs = o.fontSize || Math.round(b.h * 0.38);
    const style = {
        size: fs,
        weight: 900,
        family: cc_1.FONT_DISPLAY,
        color: labelCol,
        align: 'center',
        tracking: 0.2,
    };
    const hasIcon = !!b.icon;
    const iconSize = b.h * 0.42;
    const labelW = b.label ? (0, cc_1.measureText)(b.label, { ...style, maxWidth: b.w - (hasIcon ? iconSize + 46 : 34) }) : 0;
    const gap = hasIcon && b.label ? 13 : 0;
    const groupW = (hasIcon ? iconSize : 0) + gap + labelW;
    let cursor = b.x - groupW * 0.5;
    const textY = b.sub ? cy + b.h * 0.1 : cy;
    if (hasIcon) {
        icon(g, b.icon, cursor + iconSize * 0.5, textY, iconSize, labelCol);
        cursor += iconSize + gap;
    }
    if (b.label) {
        g.text(b.label, cursor + labelW * 0.5, textY, { ...style, maxWidth: b.w - (hasIcon ? iconSize + 46 : 34) });
    }
    if (b.sub) {
        g.text(b.sub, b.x, cy - b.h * 0.24, {
            size: Math.round(b.h * 0.2),
            weight: 800,
            family: cc_1.FONT_UI,
            color: labelCol.withAlpha(170),
            uppercase: true,
            tracking: 1.4,
            maxWidth: b.w - 24,
        });
    }
    if (disabled)
        g.restore();
}
exports.button = button;
/** Round icon button — back, sound, pause. */
function iconButton(g, cx, cy, r, name, o = {}) {
    const sink = o.pressed ? 3 : 0;
    const y = cy - sink;
    const tint = o.tint || '#FFFFFF';
    g.fillColor = new cc_1.Color(0, 0, 0, 92);
    g.circle(cx, y - 5 + sink, r);
    g.fill();
    g.setShadow(new cc_1.Color(0, 0, 0, 110), 14, 0, -4);
    g.setFillGradient(0, y + r, 0, y - r, [
        [0, (0, Theme_1.rgba)(tint, 0.2)],
        [1, (0, Theme_1.rgba)(tint, 0.08)],
    ]);
    g.circle(cx, y, r);
    g.fill();
    g.clearFillGradient();
    g.clearShadow();
    g.strokeColor = (0, Theme_1.hex)(tint, 46);
    g.lineWidth = 1.6;
    g.circle(cx, y, r);
    g.stroke();
    icon(g, name, cx, y, r * 1.05, o.iconColor || (0, Theme_1.hex)(Theme_1.T.textHi));
    if (o.badge) {
        g.fillColor = (0, Theme_1.hex)(Theme_1.T.pink);
        g.circle(cx + r * 0.66, y + r * 0.66, r * 0.24);
        g.fill();
    }
}
exports.iconButton = iconButton;
/** Small label tag that sizes itself to its text. */
function chip(g, cx, cy, text, o = {}) {
    const fs = o.fontSize || Theme_1.T.fTiny;
    const tint = o.tint || Theme_1.T.textDim;
    const style = { size: fs, weight: 900, family: cc_1.FONT_UI, uppercase: true, tracking: 1.1 };
    const tw = (0, cc_1.measureText)(text, style);
    const iconW = o.iconName ? fs * 1.15 + 7 : 0;
    const w = tw + iconW + fs * 1.9;
    const h = fs * 2.0;
    const x = o.align === 'left' ? cx : cx - w * 0.5;
    if (o.solid) {
        g.setFillGradient(0, cy + h * 0.5, 0, cy - h * 0.5, [
            [0, (0, Theme_1.rgba)(tint, 1)],
            [1, (0, Theme_1.rgba)(tint, 0.82)],
        ]);
    }
    else {
        g.setFillGradient(0, cy + h * 0.5, 0, cy - h * 0.5, [
            [0, (0, Theme_1.rgba)(tint, 0.22)],
            [1, (0, Theme_1.rgba)(tint, 0.1)],
        ]);
    }
    g.roundRect(x, cy - h * 0.5, w, h, h * 0.5);
    g.fill();
    g.clearFillGradient();
    if (!o.solid) {
        g.strokeColor = (0, Theme_1.hex)(tint, 110);
        g.lineWidth = 1.4;
        g.roundRect(x, cy - h * 0.5, w, h, h * 0.5);
        g.stroke();
    }
    const col = o.solid ? (0, Theme_1.hex)('#0A0C16') : (0, Theme_1.hex)(tint);
    let tx = x + fs * 0.95;
    if (o.iconName) {
        icon(g, o.iconName, tx + fs * 0.55, cy, fs * 1.15, col);
        tx += iconW;
    }
    g.text(text, tx + tw * 0.5, cy, { ...style, color: col });
    return w;
}
exports.chip = chip;
// =====================================================================================
//  Meters
// =====================================================================================
function progressBar(g, cx, cy, w, h, t, o = {}) {
    const x = cx - w * 0.5;
    const r = h * 0.5;
    const p = (0, Theme_1.clamp01)(t);
    g.fillColor = (0, Theme_1.hex)(o.track || '#000000', 110);
    g.roundRect(x, cy - h * 0.5, w, h, r);
    g.fill();
    g.strokeColor = new cc_1.Color(255, 255, 255, 26);
    g.lineWidth = 1.4;
    g.roundRect(x, cy - h * 0.5, w, h, r);
    g.stroke();
    if (p <= 0.001)
        return;
    const fw = Math.max(h, w * p);
    const from = o.warn ? Theme_1.T.danger : o.from || Theme_1.T.cyan;
    const to = o.warn ? '#FF9A4D' : o.to || Theme_1.T.mint;
    if (o.glow !== false)
        g.setShadow((0, Theme_1.hex)(to, 160), 14, 0, 0);
    g.setFillGradient(x, 0, x + fw, 0, [
        [0, from],
        [1, to],
    ]);
    g.roundRect(x, cy - h * 0.5, fw, h, r);
    g.fill();
    g.clearFillGradient();
    g.clearShadow();
    // Inner top gloss.
    g.save();
    g.roundRect(x, cy - h * 0.5, fw, h, r);
    g.clip();
    g.fillColor = new cc_1.Color(255, 255, 255, 70);
    g.roundRect(x + 2, cy + h * 0.04, fw - 4, h * 0.34, h * 0.17);
    g.fill();
    g.restore();
}
exports.progressBar = progressBar;
/** Rating stars with a pop-in animation driven by `reveal` (0..1 per star). */
function starRow(g, cx, cy, size, earned, total = 3, reveal = null) {
    const gap = size * 2.25;
    const startX = cx - ((total - 1) * gap) / 2;
    for (let i = 0; i < total; i++) {
        const sx = startX + i * gap;
        const on = i < earned;
        const k = reveal ? (0, Theme_1.clamp01)(reveal[i] || 0) : 1;
        const scale = on ? Theme_1.Ease.outBack(k, 2.6) : 1;
        if (on && k > 0.05) {
            g.save();
            g.setBlend('lighter');
            g.setFillRadial(sx, cy, 0, size * 2.1, [
                [0, (0, Theme_1.rgba)(Theme_1.T.gold, 0.5 * k)],
                [1, (0, Theme_1.rgba)(Theme_1.T.gold, 0)],
            ]);
            g.circle(sx, cy, size * 2.1);
            g.fill();
            g.clearFillGradient();
            g.restore();
        }
        star(g, sx, cy, size * scale, on ? null : (0, Theme_1.hex)('#000000', 95), on);
    }
}
exports.starRow = starRow;
function star(g, cx, cy, r, flat, lit) {
    const pts = [];
    for (let i = 0; i < 10; i++) {
        const a = (Math.PI / 5) * i - Math.PI / 2;
        const rad = i % 2 === 0 ? r : r * 0.45;
        pts.push([cx + Math.cos(a) * rad, cy - Math.sin(a) * rad]);
    }
    if (lit) {
        g.setFillGradient(0, cy + r, 0, cy - r, [
            [0, '#FFD96B'],
            [1, '#FF9D2E'],
        ]);
    }
    else {
        g.fillColor = flat || (0, Theme_1.hex)('#000000', 95);
    }
    g.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++)
        g.lineTo(pts[i][0], pts[i][1]);
    g.close();
    g.fill();
    g.clearFillGradient();
    g.strokeColor = lit ? (0, Theme_1.hex)('#8A4B00', 150) : new cc_1.Color(255, 255, 255, 34);
    g.lineWidth = lit ? 2.4 : 1.6;
    g.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++)
        g.lineTo(pts[i][0], pts[i][1]);
    g.close();
    g.stroke();
}
// =====================================================================================
//  Icons — crisp vector glyphs, drawn on a normalised box of `size`
// =====================================================================================
function icon(g, name, cx, cy, size, color) {
    const s = size * 0.5;
    const lw = Math.max(2, size * 0.14);
    g.strokeColor = color;
    g.fillColor = color;
    g.lineWidth = lw;
    switch (name) {
        case 'back':
            g.moveTo(cx + s * 0.45, cy);
            g.lineTo(cx - s * 0.5, cy);
            g.stroke();
            g.moveTo(cx - s * 0.05, cy + s * 0.48);
            g.lineTo(cx - s * 0.55, cy);
            g.lineTo(cx - s * 0.05, cy - s * 0.48);
            g.stroke();
            break;
        case 'chevron':
            g.moveTo(cx - s * 0.25, cy + s * 0.5);
            g.lineTo(cx + s * 0.3, cy);
            g.lineTo(cx - s * 0.25, cy - s * 0.5);
            g.stroke();
            break;
        case 'play':
            g.moveTo(cx - s * 0.42, cy + s * 0.62);
            g.lineTo(cx + s * 0.62, cy);
            g.lineTo(cx - s * 0.42, cy - s * 0.62);
            g.close();
            g.fill();
            break;
        case 'pause':
            g.roundRect(cx - s * 0.5, cy - s * 0.58, s * 0.34, s * 1.16, s * 0.14);
            g.roundRect(cx + s * 0.16, cy - s * 0.58, s * 0.34, s * 1.16, s * 0.14);
            g.fill();
            break;
        case 'restart':
            g.arc(cx, cy, s * 0.62, Math.PI * 0.42, -Math.PI * 1.35, true);
            g.stroke();
            g.moveTo(cx + s * 0.1, cy + s * 0.78);
            g.lineTo(cx + s * 0.66, cy + s * 0.56);
            g.lineTo(cx + s * 0.3, cy + s * 0.14);
            g.close();
            g.fill();
            break;
        case 'undo':
            g.arc(cx, cy, s * 0.62, Math.PI * 0.58, Math.PI * 2.35, false);
            g.stroke();
            g.moveTo(cx - s * 0.1, cy + s * 0.78);
            g.lineTo(cx - s * 0.66, cy + s * 0.56);
            g.lineTo(cx - s * 0.3, cy + s * 0.14);
            g.close();
            g.fill();
            break;
        case 'home':
            g.moveTo(cx - s * 0.66, cy - s * 0.04);
            g.lineTo(cx, cy + s * 0.62);
            g.lineTo(cx + s * 0.66, cy - s * 0.04);
            g.stroke();
            g.roundRect(cx - s * 0.44, cy - s * 0.66, s * 0.88, s * 0.72, s * 0.12);
            g.stroke();
            break;
        case 'bulb':
            g.circle(cx, cy + s * 0.18, s * 0.44);
            g.fill();
            g.roundRect(cx - s * 0.22, cy - s * 0.66, s * 0.44, s * 0.4, s * 0.1);
            g.fill();
            g.strokeColor = color;
            g.lineWidth = lw * 0.7;
            for (let i = 0; i < 5; i++) {
                const a = -Math.PI * 0.12 + (i / 4) * Math.PI * 1.24;
                g.moveTo(cx + Math.cos(a) * s * 0.62, cy + s * 0.18 + Math.sin(a) * s * 0.62);
                g.lineTo(cx + Math.cos(a) * s * 0.86, cy + s * 0.18 + Math.sin(a) * s * 0.86);
            }
            g.stroke();
            break;
        case 'video':
            g.roundRect(cx - s * 0.72, cy - s * 0.44, s * 1.1, s * 0.88, s * 0.18);
            g.fill();
            g.moveTo(cx + s * 0.46, cy);
            g.lineTo(cx + s * 0.84, cy + s * 0.4);
            g.lineTo(cx + s * 0.84, cy - s * 0.4);
            g.close();
            g.fill();
            break;
        case 'sound':
            g.moveTo(cx - s * 0.68, cy - s * 0.24);
            g.lineTo(cx - s * 0.34, cy - s * 0.24);
            g.lineTo(cx + s * 0.04, cy - s * 0.62);
            g.lineTo(cx + s * 0.04, cy + s * 0.62);
            g.lineTo(cx - s * 0.34, cy + s * 0.24);
            g.lineTo(cx - s * 0.68, cy + s * 0.24);
            g.close();
            g.fill();
            g.lineWidth = lw * 0.8;
            g.arc(cx + s * 0.1, cy, s * 0.4, -Math.PI * 0.32, Math.PI * 0.32, false);
            g.stroke();
            g.arc(cx + s * 0.1, cy, s * 0.68, -Math.PI * 0.32, Math.PI * 0.32, false);
            g.stroke();
            break;
        case 'mute':
            g.moveTo(cx - s * 0.68, cy - s * 0.24);
            g.lineTo(cx - s * 0.34, cy - s * 0.24);
            g.lineTo(cx + s * 0.04, cy - s * 0.62);
            g.lineTo(cx + s * 0.04, cy + s * 0.62);
            g.lineTo(cx - s * 0.34, cy + s * 0.24);
            g.lineTo(cx - s * 0.68, cy + s * 0.24);
            g.close();
            g.fill();
            g.lineWidth = lw * 0.85;
            g.moveTo(cx + s * 0.26, cy - s * 0.3);
            g.lineTo(cx + s * 0.78, cy + s * 0.3);
            g.moveTo(cx + s * 0.26, cy + s * 0.3);
            g.lineTo(cx + s * 0.78, cy - s * 0.3);
            g.stroke();
            break;
        case 'lock':
            g.roundRect(cx - s * 0.52, cy - s * 0.6, s * 1.04, s * 0.82, s * 0.16);
            g.fill();
            g.lineWidth = lw * 0.9;
            g.arc(cx, cy + s * 0.22, s * 0.32, 0, Math.PI, false);
            g.stroke();
            break;
        case 'check':
            g.moveTo(cx - s * 0.56, cy + s * 0.04);
            g.lineTo(cx - s * 0.14, cy - s * 0.42);
            g.lineTo(cx + s * 0.6, cy + s * 0.46);
            g.stroke();
            break;
        case 'close':
            g.moveTo(cx - s * 0.46, cy + s * 0.46);
            g.lineTo(cx + s * 0.46, cy - s * 0.46);
            g.moveTo(cx - s * 0.46, cy - s * 0.46);
            g.lineTo(cx + s * 0.46, cy + s * 0.46);
            g.stroke();
            break;
        case 'star':
            star(g, cx, cy, s * 0.82, color, false);
            break;
        case 'flame':
            g.moveTo(cx, cy + s * 0.82);
            g.bezierCurveTo(cx + s * 0.62, cy + s * 0.18, cx + s * 0.4, cy - s * 0.1, cx + s * 0.32, cy - s * 0.44);
            g.bezierCurveTo(cx + s * 0.1, cy - s * 0.2, cx - s * 0.02, cy - s * 0.1, cx - s * 0.12, cy + s * 0.1);
            g.bezierCurveTo(cx - s * 0.3, cy - s * 0.1, cx - s * 0.56, cy + s * 0.2, cx, cy + s * 0.82);
            g.close();
            g.fill();
            break;
        case 'bolt':
            g.moveTo(cx + s * 0.22, cy + s * 0.82);
            g.lineTo(cx - s * 0.46, cy - s * 0.04);
            g.lineTo(cx - s * 0.02, cy - s * 0.04);
            g.lineTo(cx - s * 0.22, cy - s * 0.82);
            g.lineTo(cx + s * 0.46, cy + s * 0.06);
            g.lineTo(cx + s * 0.02, cy + s * 0.06);
            g.close();
            g.fill();
            break;
        case 'trophy':
            g.roundRect(cx - s * 0.4, cy - s * 0.1, s * 0.8, s * 0.74, s * 0.1);
            g.fill();
            g.roundRect(cx - s * 0.26, cy - s * 0.52, s * 0.52, s * 0.2, s * 0.08);
            g.roundRect(cx - s * 0.1, cy - s * 0.34, s * 0.2, s * 0.3, s * 0.05);
            g.fill();
            g.lineWidth = lw * 0.75;
            g.arc(cx - s * 0.54, cy + s * 0.34, s * 0.2, Math.PI * 0.5, Math.PI * 1.5, false);
            g.arc(cx + s * 0.54, cy + s * 0.34, s * 0.2, Math.PI * 1.5, Math.PI * 0.5, false);
            g.stroke();
            break;
        case 'grid':
            for (let i = 0; i < 2; i++) {
                for (let j = 0; j < 2; j++) {
                    g.roundRect(cx - s * 0.6 + i * s * 0.66, cy - s * 0.6 + j * s * 0.66, s * 0.54, s * 0.54, s * 0.12);
                }
            }
            g.fill();
            break;
        case 'pencil':
            g.moveTo(cx - s * 0.6, cy - s * 0.6);
            g.lineTo(cx - s * 0.42, cy - s * 0.18);
            g.lineTo(cx + s * 0.48, cy + s * 0.72);
            g.lineTo(cx + s * 0.72, cy + s * 0.48);
            g.lineTo(cx - s * 0.18, cy - s * 0.42);
            g.close();
            g.fill();
            break;
        case 'finger':
            g.roundRect(cx - s * 0.18, cy - s * 0.1, s * 0.36, s * 0.9, s * 0.18);
            g.fill();
            g.roundRect(cx - s * 0.46, cy - s * 0.72, s * 0.92, s * 0.68, s * 0.26);
            g.fill();
            break;
        default:
            g.circle(cx, cy, s * 0.5);
            g.fill();
            break;
    }
}
exports.icon = icon;
// =====================================================================================
//  Layout helpers
// =====================================================================================
/**
 * The top bar every game screen shares: back button, centred title with an eyebrow,
 * and an optional right-hand slot. Returns the hit regions for the chrome buttons.
 */
function topBar(g, o) {
    const y = o.y === undefined ? Theme_1.T.H * 0.5 - Theme_1.T.safeTop : o.y;
    const r = 34;
    const regions = [];
    iconButton(g, -Theme_1.T.W * 0.5 + Theme_1.T.gutter + r, y, r, 'back', { pressed: o.pressedId === 'back' });
    regions.push({ id: 'back', x: -Theme_1.T.W * 0.5 + Theme_1.T.gutter + r, y, w: r * 2.4, h: r * 2.4 });
    if (o.eyebrow) {
        g.text(o.eyebrow, 0, y + 22, {
            size: Theme_1.T.fEyebrow,
            weight: 900,
            family: cc_1.FONT_UI,
            color: (0, Theme_1.hex)(o.pal.accent),
            uppercase: true,
            tracking: 3,
            maxWidth: 380,
        });
    }
    g.text(o.title, 0, o.eyebrow ? y - 16 : y, {
        size: Theme_1.T.fHeading,
        weight: 900,
        family: cc_1.FONT_DISPLAY,
        color: (0, Theme_1.hex)(Theme_1.T.textHi),
        tracking: -0.4,
        maxWidth: 380,
        shadow: new cc_1.Color(0, 0, 0, 150),
        shadowBlur: 12,
        shadowOffsetY: -2,
    });
    const right = o.right || [];
    for (let i = 0; i < right.length; i++) {
        const bx = Theme_1.T.W * 0.5 - Theme_1.T.gutter - r - i * (r * 2 + 16);
        iconButton(g, bx, y, r, right[i].name, { pressed: o.pressedId === right[i].id });
        regions.push({ id: right[i].id, x: bx, y, w: r * 2.4, h: r * 2.4 });
    }
    return regions;
}
exports.topBar = topBar;
/** Instruction ribbon under the HUD. Auto-sizes and fades with `alpha`. */
function hintRibbon(g, cy, text, pal, o = {}) {
    const a = o.alpha === undefined ? 1 : (0, Theme_1.clamp01)(o.alpha);
    if (a <= 0.01)
        return;
    const w = o.width || Theme_1.T.W - Theme_1.T.gutter * 2;
    const style = { size: Theme_1.T.fSmall, weight: 800, family: cc_1.FONT_UI, maxWidth: w - 96 };
    const lines = text.split('\n').length;
    const h = 30 + lines * (Theme_1.T.fSmall * 1.32);
    g.save();
    g.setAlpha(a);
    panel(g, 0, cy, w, h, {
        radius: h * 0.42,
        fill: [(0, Theme_1.rgba)(pal.accent, 0.2), (0, Theme_1.rgba)('#000000', 0.42)],
        border: (0, Theme_1.hex)(pal.accent, 90),
        borderWidth: 1.5,
        shadowBlur: 18,
        shadowY: -6,
        highlight: false,
    });
    const ic = o.iconName || 'finger';
    icon(g, ic, -w * 0.5 + 40, cy, 28, (0, Theme_1.hex)(pal.accent));
    g.text(text, 14, cy, {
        ...style,
        color: (0, Theme_1.hex)(Theme_1.T.text),
        align: 'center',
        lineHeight: Theme_1.T.fSmall * 1.32,
    });
    g.restore();
}
exports.hintRibbon = hintRibbon;
/** Horizontal level selector. Returns hit regions for each level chip. */
function levelRail(g, cy, count, current, unlocked, stars, pal) {
    const regions = [];
    const maxW = Theme_1.T.W - Theme_1.T.gutter * 2;
    const gap = 12;
    const size = Math.min(78, (maxW - gap * (count - 1)) / count);
    const total = count * size + (count - 1) * gap;
    const startX = -total * 0.5 + size * 0.5;
    for (let i = 0; i < count; i++) {
        const x = startX + i * (size + gap);
        const isCur = i === current;
        const isLocked = i > unlocked;
        const s = stars[i] || 0;
        if (isCur) {
            g.save();
            g.setBlend('lighter');
            g.setFillRadial(x, cy, 0, size * 0.95, [
                [0, (0, Theme_1.rgba)(pal.accent, 0.55)],
                [1, (0, Theme_1.rgba)(pal.accent, 0)],
            ]);
            g.circle(x, cy, size * 0.95);
            g.fill();
            g.clearFillGradient();
            g.restore();
        }
        g.fillColor = new cc_1.Color(0, 0, 0, 110);
        g.roundRect(x - size * 0.5, cy - size * 0.5 - 5, size, size, size * 0.3);
        g.fill();
        if (isLocked) {
            g.setFillGradient(0, cy + size * 0.5, 0, cy - size * 0.5, [
                [0, 'rgba(255,255,255,0.07)'],
                [1, 'rgba(255,255,255,0.03)'],
            ]);
        }
        else if (isCur) {
            g.setFillGradient(0, cy + size * 0.5, 0, cy - size * 0.5, [
                [0, (0, Theme_1.hex)(pal.accent).shade(0.25).toCSS()],
                [1, pal.accent],
            ]);
        }
        else {
            g.setFillGradient(0, cy + size * 0.5, 0, cy - size * 0.5, [
                [0, Theme_1.T.surfaceMax],
                [1, Theme_1.T.surface],
            ]);
        }
        g.roundRect(x - size * 0.5, cy - size * 0.5, size, size, size * 0.3);
        g.fill();
        g.clearFillGradient();
        g.strokeColor = isCur ? (0, Theme_1.hex)('#FFFFFF', 170) : new cc_1.Color(255, 255, 255, 34);
        g.lineWidth = isCur ? 2.4 : 1.4;
        g.roundRect(x - size * 0.5, cy - size * 0.5, size, size, size * 0.3);
        g.stroke();
        if (isLocked) {
            icon(g, 'lock', x, cy, size * 0.42, (0, Theme_1.hex)(Theme_1.T.textFaint));
        }
        else {
            g.text(String(i + 1), x, cy + (s > 0 ? size * 0.08 : 0), {
                size: size * 0.42,
                weight: 900,
                family: cc_1.FONT_DISPLAY,
                color: isCur ? (0, Theme_1.hex)('#FFFFFF') : (0, Theme_1.hex)(Theme_1.T.text),
            });
            if (s > 0) {
                for (let k = 0; k < 3; k++) {
                    const sx = x + (k - 1) * size * 0.2;
                    star(g, sx, cy - size * 0.27, size * 0.085, (0, Theme_1.hex)('#FFFFFF', 55), k < s);
                }
            }
        }
        regions.push({ id: 'lv' + i, x, y: cy, w: size + gap, h: size + 14, data: i, disabled: isLocked });
    }
    return regions;
}
exports.levelRail = levelRail;
// =====================================================================================
//  Hit testing
// =====================================================================================
function hitTest(regions, px, py) {
    // Walk backwards so the last-drawn (topmost) region wins.
    for (let i = regions.length - 1; i >= 0; i--) {
        const r = regions[i];
        if (r.disabled)
            continue;
        if (Math.abs(px - r.x) <= r.w * 0.5 && Math.abs(py - r.y) <= r.h * 0.5)
            return r;
    }
    return null;
}
exports.hitTest = hitTest;
function contains(r, px, py) {
    return Math.abs(px - r.x) <= r.w * 0.5 && Math.abs(py - r.y) <= r.h * 0.5;
}
exports.contains = contains;

  };
  __alias["../core/UIKit"] = "./core/UIKit";
  __alias["./UIKit"] = "./core/UIKit";

  // === MODULE: ./core/FX ===
  __modules["./core/FX"] = function(module, exports, require) {
"use strict";
// =====================================================================================
//  FX — the feedback layer. Particles, shake, flashes, floating text, confetti.
// =====================================================================================
//  A puzzle game with correct rules and no feedback feels broken; the same game with
//  a 200ms pop and a dozen sparks feels expensive. One pooled FX instance per game
//  handles every reaction, so nothing allocates during play.
// =====================================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.rgba = exports.Timeline = exports.Anim = exports.FX = void 0;
const cc_1 = require("cc");
const Theme_1 = require("./Theme");
Object.defineProperty(exports, "rgba", { enumerable: true, get: function () { return Theme_1.rgba; } });
const MAX_PARTICLES = 220;
const MAX_TEXTS = 14;
class FX {
    constructor() {
        this._p = [];
        this._t = [];
        /** Screen shake state — read via shakeX/shakeY and applied to the root node. */
        this._shakeAmp = 0;
        this._shakeDecay = 1;
        this._shakeTime = 0;
        this._flashColor = new cc_1.Color(255, 255, 255, 0);
        this._flash = 0;
        this._flashDecay = 1;
        this.time = 0;
        for (let i = 0; i < MAX_PARTICLES; i++) {
            this._p.push({
                alive: false,
                x: 0,
                y: 0,
                vx: 0,
                vy: 0,
                life: 0,
                maxLife: 1,
                size: 4,
                spin: 0,
                rot: 0,
                drag: 0.9,
                gravity: 0,
                color: new cc_1.Color(),
                kind: 0,
                additive: false,
            });
        }
        for (let i = 0; i < MAX_TEXTS; i++) {
            this._t.push({ alive: false, x: 0, y: 0, vy: 0, life: 0, maxLife: 1, text: '', size: 30, color: new cc_1.Color() });
        }
    }
    _spawn() {
        for (let i = 0; i < MAX_PARTICLES; i++) {
            if (!this._p[i].alive)
                return this._p[i];
        }
        return null;
    }
    // --- emitters -------------------------------------------------------------------
    /** Radial spark burst — the default "something good happened" reaction. */
    burst(x, y, count, colors, o = {}) {
        const speed = o.speed === undefined ? 260 : o.speed;
        const size = o.size === undefined ? 7 : o.size;
        const life = o.life === undefined ? 0.62 : o.life;
        const spread = o.spread === undefined ? Math.PI * 2 : o.spread;
        const base = o.angle === undefined ? 0 : o.angle;
        for (let i = 0; i < count; i++) {
            const p = this._spawn();
            if (!p)
                return;
            const a = base + (spread >= Math.PI * 2 ? Math.random() * Math.PI * 2 : base + (Math.random() - 0.5) * spread);
            const sp = speed * (0.45 + Math.random() * 0.75);
            p.alive = true;
            p.x = x;
            p.y = y;
            p.vx = Math.cos(a) * sp;
            p.vy = Math.sin(a) * sp;
            p.maxLife = p.life = life * (0.7 + Math.random() * 0.6);
            p.size = size * (0.6 + Math.random() * 0.8);
            p.drag = 0.86;
            p.gravity = o.gravity === undefined ? -260 : o.gravity;
            p.color = (0, Theme_1.hex)(colors[(Math.random() * colors.length) | 0]);
            p.kind = Math.random() < 0.35 ? 1 : 0;
            p.rot = Math.random() * Math.PI;
            p.spin = (Math.random() - 0.5) * 12;
            p.additive = true;
        }
    }
    /** Expanding ring — impact, unlock, level complete. */
    ring(x, y, color, size = 40, life = 0.5) {
        const p = this._spawn();
        if (!p)
            return;
        p.alive = true;
        p.x = x;
        p.y = y;
        p.vx = 0;
        p.vy = 0;
        p.maxLife = p.life = life;
        p.size = size;
        p.drag = 1;
        p.gravity = 0;
        p.color = (0, Theme_1.hex)(color);
        p.kind = 3;
        p.additive = true;
    }
    /** Falling paper confetti for a win screen. */
    confetti(count, colors) {
        for (let i = 0; i < count; i++) {
            const p = this._spawn();
            if (!p)
                return;
            p.alive = true;
            p.x = (Math.random() - 0.5) * Theme_1.T.W;
            p.y = Theme_1.T.H * 0.5 + Math.random() * 260;
            p.vx = (Math.random() - 0.5) * 140;
            p.vy = -120 - Math.random() * 180;
            p.maxLife = p.life = 2.0 + Math.random() * 1.6;
            p.size = 9 + Math.random() * 10;
            p.drag = 0.995;
            p.gravity = -420;
            p.color = (0, Theme_1.hex)(colors[(Math.random() * colors.length) | 0]);
            p.kind = 2;
            p.rot = Math.random() * Math.PI;
            p.spin = (Math.random() - 0.5) * 11;
            p.additive = false;
        }
    }
    /** Soft upward drift — smoke, steam, magic. */
    puff(x, y, count, color, size = 22) {
        for (let i = 0; i < count; i++) {
            const p = this._spawn();
            if (!p)
                return;
            p.alive = true;
            p.x = x + (Math.random() - 0.5) * 18;
            p.y = y + (Math.random() - 0.5) * 18;
            p.vx = (Math.random() - 0.5) * 50;
            p.vy = 40 + Math.random() * 70;
            p.maxLife = p.life = 0.75 + Math.random() * 0.5;
            p.size = size * (0.6 + Math.random() * 0.7);
            p.drag = 0.93;
            p.gravity = 0;
            p.color = (0, Theme_1.hex)(color);
            p.kind = 0;
            p.additive = false;
        }
    }
    /** "+120", "PERFECT!", "x3" — rising, fading, scaled-in text. */
    popText(x, y, text, color, size = 36) {
        for (let i = 0; i < MAX_TEXTS; i++) {
            const t = this._t[i];
            if (t.alive)
                continue;
            t.alive = true;
            t.x = x;
            t.y = y;
            t.vy = 112;
            t.maxLife = t.life = 0.95;
            t.text = text;
            t.size = size;
            t.color = (0, Theme_1.hex)(color);
            return;
        }
    }
    shake(amplitude, duration = 0.35) {
        this._shakeAmp = Math.max(this._shakeAmp, amplitude);
        this._shakeDecay = 1 / Math.max(0.05, duration);
        this._shakeTime = 0;
    }
    flash(color, strength = 0.5, duration = 0.3) {
        this._flashColor = (0, Theme_1.hex)(color);
        this._flash = Math.max(this._flash, (0, Theme_1.clamp01)(strength));
        this._flashDecay = 1 / Math.max(0.05, duration);
    }
    // --- simulation -----------------------------------------------------------------
    update(dt) {
        this.time += dt;
        this._shakeTime += dt;
        if (this._shakeAmp > 0) {
            this._shakeAmp = Math.max(0, this._shakeAmp - this._shakeAmp * this._shakeDecay * dt * 2.4 - 0.4);
        }
        if (this._flash > 0) {
            this._flash = Math.max(0, this._flash - this._flashDecay * dt);
        }
        for (let i = 0; i < MAX_PARTICLES; i++) {
            const p = this._p[i];
            if (!p.alive)
                continue;
            p.life -= dt;
            if (p.life <= 0) {
                p.alive = false;
                continue;
            }
            p.vy += p.gravity * dt;
            const d = Math.pow(p.drag, dt * 60);
            p.vx *= d;
            p.vy *= d;
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.rot += p.spin * dt;
        }
        for (let i = 0; i < MAX_TEXTS; i++) {
            const t = this._t[i];
            if (!t.alive)
                continue;
            t.life -= dt;
            if (t.life <= 0) {
                t.alive = false;
                continue;
            }
            t.y += t.vy * dt;
            t.vy *= Math.pow(0.93, dt * 60);
        }
    }
    get shakeX() {
        if (this._shakeAmp <= 0)
            return 0;
        return Math.sin(this._shakeTime * 64) * this._shakeAmp * (Math.random() * 0.5 + 0.5);
    }
    get shakeY() {
        if (this._shakeAmp <= 0)
            return 0;
        return Math.cos(this._shakeTime * 71) * this._shakeAmp * (Math.random() * 0.5 + 0.5);
    }
    // --- rendering ------------------------------------------------------------------
    /** Draw particles. Call after the play field, before the HUD. */
    draw(g) {
        // Additive pass first so glows sit under solid confetti.
        g.save();
        g.setBlend('lighter');
        for (let i = 0; i < MAX_PARTICLES; i++) {
            const p = this._p[i];
            if (!p.alive || !p.additive)
                continue;
            const k = (0, Theme_1.clamp01)(p.life / p.maxLife);
            if (p.kind === 3) {
                const grow = 1 - Math.pow(1 - (1 - k), 2);
                const r = p.size * (0.3 + grow * 1.9);
                g.strokeColor = p.color.withAlpha(Math.round(220 * k * k));
                g.lineWidth = Math.max(1.5, p.size * 0.16 * k);
                g.circle(p.x, p.y, r);
                g.stroke();
                continue;
            }
            const a = Math.round(255 * k);
            if (p.kind === 1) {
                const len = p.size * 2.3 * k;
                const a2 = Math.atan2(p.vy, p.vx);
                g.strokeColor = p.color.withAlpha(a);
                g.lineWidth = Math.max(1.2, p.size * 0.52 * k);
                g.moveTo(p.x, p.y);
                g.lineTo(p.x - Math.cos(a2) * len, p.y - Math.sin(a2) * len);
                g.stroke();
            }
            else {
                g.fillColor = p.color.withAlpha(a);
                g.circle(p.x, p.y, Math.max(0.4, p.size * k));
                g.fill();
            }
        }
        g.restore();
        // Solid pass — confetti ribbons and puffs.
        for (let i = 0; i < MAX_PARTICLES; i++) {
            const p = this._p[i];
            if (!p.alive || p.additive)
                continue;
            const k = (0, Theme_1.clamp01)(p.life / p.maxLife);
            if (p.kind === 2) {
                const w = p.size;
                const h = p.size * (0.38 + Math.abs(Math.cos(p.rot)) * 0.72);
                g.fillColor = p.color.withAlpha(Math.round(255 * Math.min(1, k * 2.6)));
                g.roundRect(p.x - w * 0.5, p.y - h * 0.5, w, h, 2.5);
                g.fill();
            }
            else {
                g.fillColor = p.color.withAlpha(Math.round(120 * k));
                g.circle(p.x, p.y, p.size * (1.4 - k * 0.5));
                g.fill();
            }
        }
    }
    /** Draw floating score text. Call above the HUD. */
    drawTexts(g) {
        for (let i = 0; i < MAX_TEXTS; i++) {
            const t = this._t[i];
            if (!t.alive)
                continue;
            const k = (0, Theme_1.clamp01)(t.life / t.maxLife);
            const pop = Theme_1.Ease.outBack((0, Theme_1.clamp01)((1 - k) * 5), 3);
            const size = t.size * (0.5 + pop * 0.5);
            g.text(t.text, t.x, t.y, {
                size,
                weight: 900,
                color: t.color.withAlpha(Math.round(255 * Math.min(1, k * 2.2))),
                outline: new cc_1.Color(8, 6, 18, Math.round(190 * Math.min(1, k * 2.2))),
                outlineWidth: size * 0.085,
                shadow: new cc_1.Color(0, 0, 0, 140),
                shadowBlur: 10,
            });
        }
    }
    /** Full-screen colour flash. Call last. */
    drawFlash(g) {
        if (this._flash <= 0.002)
            return;
        g.save();
        g.setBlend('lighter');
        g.fillColor = this._flashColor.withAlpha(Math.round(this._flash * 170));
        g.rect(-Theme_1.T.W * 0.5, -Theme_1.T.H * 0.5, Theme_1.T.W, Theme_1.T.H);
        g.fill();
        g.restore();
    }
    clear() {
        for (let i = 0; i < MAX_PARTICLES; i++)
            this._p[i].alive = false;
        for (let i = 0; i < MAX_TEXTS; i++)
            this._t[i].alive = false;
        this._shakeAmp = 0;
        this._flash = 0;
    }
}
exports.FX = FX;
/**
 * A bag of named 0..1 values that ease towards their targets. Screens use it for
 * entrance animations, hover states and panel reveals without any node animation.
 */
class Anim {
    constructor() {
        this._m = {};
    }
    set(key, target, speed = 10) {
        const t = this._m[key];
        if (t) {
            t.target = target;
            t.speed = speed;
        }
        else {
            this._m[key] = { v: target, target, speed };
        }
    }
    /** Reads (and lazily creates) a track, optionally retargeting it. */
    get(key, target, speed = 10) {
        let t = this._m[key];
        if (!t) {
            t = this._m[key] = { v: target === undefined ? 0 : 0, target: target === undefined ? 0 : target, speed };
        }
        if (target !== undefined) {
            t.target = target;
            t.speed = speed;
        }
        return t.v;
    }
    jump(key, value) {
        const t = this._m[key];
        if (t) {
            t.v = value;
            t.target = value;
        }
        else {
            this._m[key] = { v: value, target: value, speed: 10 };
        }
    }
    update(dt) {
        for (const k in this._m) {
            const t = this._m[k];
            t.v += (t.target - t.v) * (1 - Math.exp(-t.speed * dt));
        }
    }
    reset() {
        this._m = {};
    }
}
exports.Anim = Anim;
/** One-shot timeline cursor: counts up, exposes eased 0..1 segments. */
class Timeline {
    constructor() {
        this.t = 0;
    }
    update(dt) {
        this.t += dt;
    }
    reset() {
        this.t = 0;
    }
    /** Eased progress of the window [start, start+dur]. */
    seg(start, dur, ease = Theme_1.Ease.outCubic) {
        return ease((0, Theme_1.clamp01)((this.t - start) / Math.max(0.0001, dur)));
    }
}
exports.Timeline = Timeline;

  };
  __alias["../core/FX"] = "./core/FX";
  __alias["./FX"] = "./core/FX";

  // === MODULE: ./core/SoundManager ===
  __modules["./core/SoundManager"] = function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoundManager = exports.setAudioContextFactory = exports.audioContextFactory = void 0;
/**
 * Procedural WebAudio Synthesizer for Cocos Creator 3.8.8 Mini-Games
 * Generates crisp, responsive sound effects with zero external audio asset bloat,
 * keeping the TikTok Mini-Game package ultra-lightweight (< 1 MB).
 */
/**
 * How to get an audio context on this platform.
 *
 * The browser has `window.AudioContext`; the TikTok Native Runtime has no `window` but
 * does expose `tt.createWebAudioContext()`, whose `createOscillator` / `createGain` are
 * all this synthesizer uses. The native entry point swaps this in at boot. Returning
 * null simply means a silent game, never a broken one.
 */
let audioContextFactory = () => {
    if (typeof window === 'undefined')
        return null;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    return AudioCtx ? new AudioCtx() : null;
};
exports.audioContextFactory = audioContextFactory;
function setAudioContextFactory(fn) {
    exports.audioContextFactory = fn;
}
exports.setAudioContextFactory = setAudioContextFactory;
class SoundManager {
    static get muted() {
        return this._muted;
    }
    static toggleMute() {
        this._muted = !this._muted;
        return this._muted;
    }
    static _getContext() {
        if (this._muted)
            return null;
        if (!this._ctx && !this._ctxTried) {
            this._ctxTried = true;
            try {
                this._ctx = (0, exports.audioContextFactory)();
            }
            catch (e) {
                this._ctx = null;
            }
        }
        if (this._ctx && this._ctx.state === 'suspended') {
            this._ctx.resume().catch(() => { });
        }
        return this._ctx;
    }
    static playTap(pitchMultiplier = 1.0) {
        const ctx = this._getContext();
        if (!ctx)
            return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520 * pitchMultiplier, now);
        osc.frequency.exponentialRampToValueAtTime(240 * pitchMultiplier, now + 0.06);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.07);
    }
    static playMarkX() {
        const ctx = this._getContext();
        if (!ctx)
            return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(360, now);
        osc.frequency.exponentialRampToValueAtTime(620, now + 0.055);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.065);
    }
    static playPlaceCat() {
        const ctx = this._getContext();
        if (!ctx)
            return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        // Cute rising-then-purring "Meow~" contour
        osc.frequency.setValueAtTime(540, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.09);
        osc.frequency.exponentialRampToValueAtTime(660, now + 0.22);
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.18, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
    }
    static playError() {
        const ctx = this._getContext();
        if (!ctx)
            return;
        const now = ctx.currentTime;
        for (let i = 0; i < 2; i++) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            const start = now + i * 0.09;
            osc.frequency.setValueAtTime(175 - i * 25, start);
            gain.gain.setValueAtTime(0.11, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.08);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(start);
            osc.stop(start + 0.085);
        }
    }
    static playCrunch() {
        const ctx = this._getContext();
        if (!ctx)
            return;
        const now = ctx.currentTime;
        const notes = [440, 587.33, 783.99];
        notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            const t = now + idx * 0.045;
            osc.frequency.setValueAtTime(freq, t);
            gain.gain.setValueAtTime(0.14, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(t);
            osc.stop(t + 0.095);
        });
    }
    static playSlide(isZoom = false) {
        const ctx = this._getContext();
        if (!ctx)
            return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        if (isZoom) {
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.exponentialRampToValueAtTime(920, now + 0.16);
        }
        else {
            osc.frequency.setValueAtTime(240, now);
            osc.frequency.exponentialRampToValueAtTime(340, now + 0.06);
        }
        const dur = isZoom ? 0.17 : 0.07;
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + dur + 0.01);
    }
    static playGlassChime() {
        const ctx = this._getContext();
        if (!ctx)
            return;
        const now = ctx.currentTime;
        const freqs = [659.25, 987.77, 1318.5];
        freqs.forEach((f, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            const t = now + idx * 0.03;
            osc.frequency.setValueAtTime(f, t);
            gain.gain.setValueAtTime(0.1, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(t);
            osc.stop(t + 0.26);
        });
    }
    static playWin() {
        const ctx = this._getContext();
        if (!ctx)
            return;
        const now = ctx.currentTime;
        const arpeggio = [523.25, 659.25, 783.99, 1046.5];
        arpeggio.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            const t = now + idx * 0.085;
            osc.frequency.setValueAtTime(freq, t);
            gain.gain.setValueAtTime(0.18, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.32);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(t);
            osc.stop(t + 0.34);
        });
    }
    static playLose() {
        const ctx = this._getContext();
        if (!ctx)
            return;
        const now = ctx.currentTime;
        const notes = [392.0, 349.23, 311.13, 261.63];
        notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            const t = now + idx * 0.11;
            osc.frequency.setValueAtTime(freq, t);
            gain.gain.setValueAtTime(0.1, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(t);
            osc.stop(t + 0.19);
        });
    }
}
exports.SoundManager = SoundManager;
SoundManager._ctx = null;
SoundManager._ctxTried = false;
SoundManager._muted = false;

  };
  __alias["../core/SoundManager"] = "./core/SoundManager";
  __alias["./SoundManager"] = "./core/SoundManager";

  // === MODULE: ./core/Progress ===
  __modules["./core/Progress"] = function(module, exports, require) {
"use strict";
// =====================================================================================
//  Progress — per-player save state, via the engine's storage hook.
// =====================================================================================
//  Stars, unlocks and best times are what turn five one-off demos into something worth
//  reopening. Everything degrades silently when storage is unavailable (TikTok's
//  in-app webview can run with storage blocked), so the games never branch on it.
//  Platform.getStore / setStore is localStorage in a browser and tt.getStorageSync in
//  the TikTok Native Runtime; neither ever throws out of here.
// =====================================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.Progress = void 0;
const cc_1 = require("cc");
const KEY = 'ttarcade.v1';
function emptyGame() {
    return { stars: [], unlocked: 0, best: {} };
}
class Progress {
    static get data() {
        if (this._data)
            return this._data;
        let parsed = null;
        try {
            const raw = cc_1.Platform.getStore(KEY);
            if (raw)
                parsed = JSON.parse(raw);
        }
        catch (e) {
            parsed = null;
        }
        this._data = parsed && parsed.games ? parsed : { games: {}, muted: false, seenIntro: {}, plays: 0 };
        return this._data;
    }
    static save() {
        try {
            cc_1.Platform.setStore(KEY, JSON.stringify(this.data));
        }
        catch (e) {
            /* storage blocked — in-memory state still works for this session */
        }
    }
    static game(id) {
        const d = this.data;
        if (!d.games[id])
            d.games[id] = emptyGame();
        return d.games[id];
    }
    // --- levels ---------------------------------------------------------------------
    static stars(id) {
        return this.game(id).stars;
    }
    static starsAt(id, level) {
        return this.game(id).stars[level] || 0;
    }
    static totalStars(id) {
        return this.game(id).stars.reduce((a, b) => a + (b || 0), 0);
    }
    static unlocked(id) {
        return this.game(id).unlocked;
    }
    /** Records a win; keeps the best star count and opens the next level. */
    static complete(id, level, stars, levelCount) {
        const g = this.game(id);
        const prev = g.stars[level] || 0;
        const improved = stars > prev;
        if (improved)
            g.stars[level] = stars;
        if (level >= g.unlocked)
            g.unlocked = Math.min(levelCount - 1, level + 1);
        this.data.plays++;
        this.save();
        return improved;
    }
    static recordBest(id, level, value, higherIsBetter = true) {
        const g = this.game(id);
        const cur = g.best[level];
        const better = cur === undefined || (higherIsBetter ? value > cur : value < cur);
        if (better) {
            g.best[level] = value;
            this.save();
        }
        return better;
    }
    static best(id, level) {
        return this.game(id).best[level];
    }
    /** Stars across the whole arcade — the hub's headline number. */
    static grandTotal() {
        let n = 0;
        for (const k in this.data.games)
            n += this.totalStars(k);
        return n;
    }
    static plays() {
        return this.data.plays;
    }
    // --- preferences ----------------------------------------------------------------
    static get muted() {
        return !!this.data.muted;
    }
    static setMuted(v) {
        this.data.muted = v;
        this.save();
    }
    /** First-run coaching: show the how-to-play card once per game. */
    static needsIntro(id) {
        return !this.data.seenIntro[id];
    }
    static markIntroSeen(id) {
        this.data.seenIntro[id] = true;
        this.save();
    }
    static resetAll() {
        this._data = { games: {}, muted: this.data.muted, seenIntro: {}, plays: 0 };
        this.save();
    }
}
exports.Progress = Progress;
Progress._data = null;

  };
  __alias["../core/Progress"] = "./core/Progress";
  __alias["./Progress"] = "./core/Progress";

  // === MODULE: ./core/AdDirector ===
  __modules["./core/AdDirector"] = function(module, exports, require) {
"use strict";
// =====================================================================================
//  AdDirector — when an ad may be shown, and when it absolutely may not.
// =====================================================================================
//  Showing an ad is easy. Knowing when NOT to is what keeps retention, and retention is
//  what actually pays. All of that judgement lives here so no game has to reason about
//  it, and so the whole policy can be tuned from one block of constants.
//
//  Two kinds of ad, two completely different rules:
//
//  REWARDED (opt-in, ~$20 eCPM) — the player taps a button and chooses to watch.
//    Never forced, never capped by us. Offered at moments where the player already
//    wants something: continue after dying, a hint, skipping a wall they're stuck on.
//    This is the money maker, and it makes the game *better* rather than worse.
//
//  INTERSTITIAL (forced, ~$8 eCPM) — the player gets interrupted.
//    Heavily capped. Every rule below exists because breaking it measurably costs more
//    in churn than the impression is worth.
// =====================================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.AD_POLICY = exports.AdDirector = void 0;
const Progress_1 = require("./Progress");
const TikTokSDK_1 = require("../sdk/TikTokSDK");
// -------------------------------------------------------------------------------------
//  Policy
// -------------------------------------------------------------------------------------
const POLICY = {
    /** New players see no forced ads at all until they have finished this many levels. */
    graceLevelCompletions: 3,
    /** …and not within this many seconds of opening the game, ever. */
    graceSeconds: 120,
    /** Hard ceiling per session. */
    maxInterstitialsPerSession: 6,
    /** Wall-clock gap between two forced ads. */
    minSecondsBetweenInterstitials: 110,
    /** Level-ends (win or loss) that must pass between two forced ads. */
    minLevelEndsBetweenInterstitials: 3,
    /** After the player chose to watch a rewarded ad, leave them alone for a while. */
    cooldownAfterRewardedSeconds: 45,
    /** A rewarded "continue" may be offered this many times per level attempt. */
    revivesPerLevel: 1,
    /** "Skip this level" unlocks only once the player is genuinely stuck. */
    failuresBeforeSkipOffer: 3,
};
exports.AD_POLICY = POLICY;
class AdDirector {
    // =================================================================================
    //  Lifecycle notifications
    // =================================================================================
    static noteLevelStart(gameId, level) {
        const key = gameId + ':' + level;
        if (key !== this._levelKey) {
            this._levelKey = key;
            this._failuresThisLevel = 0;
            this._revivesThisLevel = 0;
            this._rewardedThisLevel = 0;
        }
    }
    /** Called on a loss. Retrying the same level keeps the failure count. */
    static noteFailure() {
        this._failuresThisLevel++;
        this._levelEndsSinceInterstitial++;
    }
    static noteCompletion() {
        this._levelEndsSinceInterstitial++;
        this._failuresThisLevel = 0;
        this._revivesThisLevel = 0;
    }
    static noteRewardedWatched() {
        this._lastRewardedAt = now();
        this._rewardedThisLevel++;
    }
    static noteRevive() {
        this._revivesThisLevel++;
    }
    static noteInterstitialShown() {
        this._lastInterstitialAt = now();
        this._interstitialsThisSession++;
        this._levelEndsSinceInterstitial = 0;
    }
    // =================================================================================
    //  Rewarded offers
    // =================================================================================
    /** Can we offer "Continue — watch an ad" on this death? */
    static canOfferRevive(gameSupportsRevive) {
        if (!gameSupportsRevive)
            return false;
        if (this._revivesThisLevel >= POLICY.revivesPerLevel)
            return false;
        return TikTokSDK_1.TikTokSDK.isRewardedReady();
    }
    /** Offer "Skip this level" only once the player has genuinely hit a wall. */
    static canOfferSkip() {
        if (this._failuresThisLevel < POLICY.failuresBeforeSkipOffer)
            return false;
        return TikTokSDK_1.TikTokSDK.isRewardedReady();
    }
    /** Hints are always the player's call — the only gate is ad availability. */
    static canOfferHint() {
        return TikTokSDK_1.TikTokSDK.isRewardedReady();
    }
    static get failuresThisLevel() {
        return this._failuresThisLevel;
    }
    // =================================================================================
    //  Interstitial decision
    // =================================================================================
    /**
     * The whole forced-ad policy in one function. Returns why it said no, which is what
     * makes the pacing debuggable instead of mysterious.
     */
    static evaluateInterstitial(moment, ctx = {}) {
        const t = now();
        if (TikTokSDK_1.TikTokSDK.isShowing)
            return no('an ad is already on screen');
        // --- new-player grace ---------------------------------------------------------
        if (Progress_1.Progress.plays() < POLICY.graceLevelCompletions) {
            return no('new player grace: ' + Progress_1.Progress.plays() + '/' + POLICY.graceLevelCompletions + ' levels done');
        }
        if (t - this._sessionStart < POLICY.graceSeconds) {
            return no('session is only ' + Math.round(t - this._sessionStart) + 's old');
        }
        // --- hard caps -----------------------------------------------------------------
        if (this._interstitialsThisSession >= POLICY.maxInterstitialsPerSession) {
            return no('session cap of ' + POLICY.maxInterstitialsPerSession + ' reached');
        }
        if (t - this._lastInterstitialAt < POLICY.minSecondsBetweenInterstitials) {
            return no('only ' + Math.round(t - this._lastInterstitialAt) + 's since the last one');
        }
        if (this._levelEndsSinceInterstitial < POLICY.minLevelEndsBetweenInterstitials) {
            return no('only ' + this._levelEndsSinceInterstitial + ' levels since the last one');
        }
        if (t - this._lastRewardedAt < POLICY.cooldownAfterRewardedSeconds) {
            return no('player just watched a rewarded ad');
        }
        // --- moment rules ---------------------------------------------------------------
        // Dying once is the moment a player is most likely to quit. Never pile an ad on
        // top of a first failure; let them retry instantly and stay in flow.
        if (moment === 'levelFailed' && this._failuresThisLevel <= 1) {
            return no('first failure on this level');
        }
        // Don't interrupt a clean first-try win — that is the feeling we want them to
        // leave the level with.
        if (moment === 'levelComplete' && ctx.firstTryWin) {
            return no('clean first-try win, let them enjoy it');
        }
        // The player already paid attention to an ad on this level.
        if (this._rewardedThisLevel > 0) {
            return no('already watched a rewarded ad on this level');
        }
        return { show: true, reason: 'eligible' };
    }
    /**
     * Evaluate, and show if allowed. `onDone` always runs — immediately when the policy
     * says no, after the ad closes when it says yes. Callers just navigate in `onDone`.
     */
    static maybeInterstitial(moment, onDone, ctx = {}) {
        const decision = this.evaluateInterstitial(moment, ctx);
        if (!decision.show) {
            onDone();
            return decision;
        }
        this.noteInterstitialShown();
        TikTokSDK_1.TikTokSDK.showInterstitialAd(onDone, 'Thanks for playing — back in a moment');
        return decision;
    }
    // =================================================================================
    //  Diagnostics
    // =================================================================================
    static debugState() {
        const t = now();
        return {
            sessionAge: Math.round(t - this._sessionStart) + 's',
            interstitialsThisSession: this._interstitialsThisSession,
            sinceLastInterstitial: this._lastInterstitialAt < 0 ? 'never' : Math.round(t - this._lastInterstitialAt) + 's',
            levelEndsSince: this._levelEndsSinceInterstitial,
            failuresThisLevel: this._failuresThisLevel,
            revivesThisLevel: this._revivesThisLevel,
            lifetimeCompletions: Progress_1.Progress.plays(),
            nextVerdict: this.evaluateInterstitial('levelFailed').reason,
        };
    }
    /**
     * Dev only — rewind the session clock so pacing can be tuned in seconds rather
     * than by sitting through the real cooldowns.
     */
    static debugAgeSession(seconds) {
        this._sessionStart -= seconds;
        if (this._lastInterstitialAt > -1e8)
            this._lastInterstitialAt -= seconds;
        if (this._lastRewardedAt > -1e8)
            this._lastRewardedAt -= seconds;
    }
    /** Dev only — lets the preview exercise pacing without grinding levels. */
    static resetSession() {
        this._sessionStart = now();
        this._lastInterstitialAt = -1e9;
        this._lastRewardedAt = -1e9;
        this._interstitialsThisSession = 0;
        this._levelEndsSinceInterstitial = 99;
        this._failuresThisLevel = 0;
        this._revivesThisLevel = 0;
        this._rewardedThisLevel = 0;
        this._levelKey = '';
    }
}
exports.AdDirector = AdDirector;
AdDirector._sessionStart = now();
AdDirector._lastInterstitialAt = -1e9;
AdDirector._lastRewardedAt = -1e9;
AdDirector._interstitialsThisSession = 0;
AdDirector._levelEndsSinceInterstitial = 99;
/** Per-level-attempt state, reset by noteLevelStart(). */
AdDirector._failuresThisLevel = 0;
AdDirector._revivesThisLevel = 0;
AdDirector._rewardedThisLevel = 0;
AdDirector._levelKey = '';
function now() {
    return (typeof performance !== 'undefined' ? performance.now() : Date.now()) / 1000;
}
function no(reason) {
    return { show: false, reason };
}

  };
  __alias["../core/AdDirector"] = "./core/AdDirector";
  __alias["./AdDirector"] = "./core/AdDirector";

  // === MODULE: ./core/CocosUIHelpers ===
  __modules["./core/CocosUIHelpers"] = function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CocosUIHelpers = void 0;
const cc_1 = require("cc");
class CocosUIHelpers {
    static hexColor(hex, alpha = 255) {
        const clean = hex.replace('#', '');
        const r = parseInt(clean.substring(0, 2), 16) || 0;
        const g = parseInt(clean.substring(2, 4), 16) || 0;
        const b = parseInt(clean.substring(4, 6), 16) || 0;
        const a = clean.length === 8 ? parseInt(clean.substring(6, 8), 16) : alpha;
        return new cc_1.Color(r, g, b, a);
    }
    static createGraphicsNode(name, parent, width = 720, height = 1280) {
        const node = new cc_1.Node(name);
        node.layer = parent.layer;
        parent.addChild(node);
        const ui = node.addComponent(cc_1.UITransform);
        ui.setContentSize(width, height);
        const g = node.addComponent(cc_1.Graphics);
        return { node, g, ui };
    }
    static createLabelNode(name, parent, text, fontSize = 28, color = new cc_1.Color(60, 42, 33, 255), bold = true, width = 600, height = 60) {
        const node = new cc_1.Node(name);
        node.layer = parent.layer;
        parent.addChild(node);
        const ui = node.addComponent(cc_1.UITransform);
        ui.setContentSize(width, height);
        const label = node.addComponent(cc_1.Label);
        label.string = text;
        label.fontSize = fontSize;
        label.lineHeight = Math.round(fontSize * 1.25);
        label.color = color;
        label.isBold = bold;
        label.horizontalAlign = cc_1.HorizontalTextAlignment.CENTER;
        label.verticalAlign = cc_1.VerticalTextAlignment.CENTER;
        return { node, label, ui };
    }
    static ensureOpacity(node) {
        let op = node.getComponent(cc_1.UIOpacity);
        if (!op)
            op = node.addComponent(cc_1.UIOpacity);
        return op;
    }
    /**
     * Draw a rounded rectangle centered at (cx, cy) with width w, height h, corner radius r.
     */
    static drawRoundedBox(g, cx, cy, w, h, r, fill, stroke, lineWidth = 2, shadowColor, shadowOffsetY = -4) {
        const rad = Math.min(r, w * 0.5, h * 0.5);
        if (shadowColor) {
            g.fillColor = shadowColor;
            g.roundRect(cx - w * 0.5, cy - h * 0.5 + shadowOffsetY, w, h, rad);
            g.fill();
        }
        if (fill) {
            g.fillColor = fill;
            g.roundRect(cx - w * 0.5, cy - h * 0.5, w, h, rad);
            g.fill();
        }
        if (stroke && lineWidth > 0) {
            g.strokeColor = stroke;
            g.lineWidth = lineWidth;
            g.roundRect(cx - w * 0.5, cy - h * 0.5, w, h, rad);
            g.stroke();
        }
    }
    /**
     * Draw a glossy pill button centered at (cx, cy).
     */
    static drawPillButton(g, cx, cy, w, h, baseColor, shadowColor, borderColor) {
        const r = h * 0.5;
        if (shadowColor) {
            g.fillColor = shadowColor;
            g.roundRect(cx - w * 0.5, cy - h * 0.5 - 5, w, h, r);
            g.fill();
        }
        g.fillColor = baseColor;
        g.roundRect(cx - w * 0.5, cy - h * 0.5, w, h, r);
        g.fill();
        // Subtle top gloss highlight
        g.fillColor = new cc_1.Color(255, 255, 255, 42);
        g.roundRect(cx - w * 0.46, cy + h * 0.05, w * 0.92, h * 0.36, h * 0.18);
        g.fill();
        if (borderColor) {
            g.strokeColor = borderColor;
            g.lineWidth = 2.5;
            g.roundRect(cx - w * 0.5, cy - h * 0.5, w, h, r);
            g.stroke();
        }
    }
    /**
     * Draw the thick rounded 'X' mark used in Nyandoku cells.
     */
    static drawRoundedX(g, cx, cy, size, color, thickness = 14) {
        const half = size * 0.27;
        g.strokeColor = color;
        g.lineWidth = thickness;
        g.moveTo(cx - half, cy - half);
        g.lineTo(cx + half, cy + half);
        g.moveTo(cx - half, cy + half);
        g.lineTo(cx + half, cy - half);
        g.stroke();
        // Rounded caps via filled circles at endpoints
        const capR = thickness * 0.5;
        g.fillColor = color;
        g.circle(cx - half, cy - half, capR);
        g.circle(cx + half, cy + half, capR);
        g.circle(cx - half, cy + half, capR);
        g.circle(cx + half, cy - half, capR);
        g.fill();
    }
    /**
     * Draw the adorable Tuxedo Cat from the Nyandoku screenshot!
     * Features:
     * - Dark charcoal ears with dusky pink inner triangles
     * - Plump rounded cheeks & white tuxedo muzzle
     * - Expressive big eyes (straight gaze or playful side-eye!)
     * - Cute pink nose & delicate whiskers
     */
    static drawTuxedoCat(g, cx, cy, cellSize, sideEye = false, happyBlink = false) {
        const s = cellSize * 0.40;
        const headY = cy - s * 0.06;
        // Soft drop shadow under cat head
        g.fillColor = new cc_1.Color(0, 0, 0, 38);
        g.ellipse(cx, headY - s * 0.82, s * 0.78, s * 0.22);
        g.fill();
        // Left & Right pointed ears (dark charcoal #1B1B1F)
        const earDark = new cc_1.Color(27, 27, 31, 255);
        const earPink = new cc_1.Color(186, 122, 142, 255);
        // Left ear outer
        g.fillColor = earDark;
        g.moveTo(cx - s * 0.82, headY + s * 0.18);
        g.lineTo(cx - s * 0.68, headY + s * 1.08);
        g.lineTo(cx - s * 0.16, headY + s * 0.66);
        g.close();
        g.fill();
        // Right ear outer
        g.moveTo(cx + s * 0.82, headY + s * 0.18);
        g.lineTo(cx + s * 0.68, headY + s * 1.08);
        g.lineTo(cx + s * 0.16, headY + s * 0.66);
        g.close();
        g.fill();
        // Left ear inner pink
        g.fillColor = earPink;
        g.moveTo(cx - s * 0.69, headY + s * 0.30);
        g.lineTo(cx - s * 0.61, headY + s * 0.90);
        g.lineTo(cx - s * 0.28, headY + s * 0.58);
        g.close();
        g.fill();
        // Right ear inner pink
        g.moveTo(cx + s * 0.69, headY + s * 0.30);
        g.lineTo(cx + s * 0.61, headY + s * 0.90);
        g.lineTo(cx + s * 0.28, headY + s * 0.58);
        g.close();
        g.fill();
        // Main head silhouette (plump ellipse)
        g.fillColor = new cc_1.Color(32, 32, 36, 255);
        g.ellipse(cx, headY, s * 0.92, s * 0.78);
        g.fill();
        // White tuxedo lower muzzle / cheeks
        const whiteMuzzle = new cc_1.Color(235, 234, 238, 255);
        g.fillColor = whiteMuzzle;
        g.ellipse(cx, headY - s * 0.28, s * 0.84, s * 0.48);
        g.fill();
        // White blaze / bridge between the eyes
        g.moveTo(cx - s * 0.26, headY - s * 0.25);
        g.lineTo(cx, headY + s * 0.22);
        g.lineTo(cx + s * 0.26, headY - s * 0.25);
        g.close();
        g.fill();
        // Re-carve dark cheek patches around eyes for authentic tuxedo pattern
        g.fillColor = new cc_1.Color(32, 32, 36, 255);
        g.circle(cx - s * 0.42, headY + s * 0.08, s * 0.38);
        g.circle(cx + s * 0.42, headY + s * 0.08, s * 0.38);
        g.fill();
        // Re-overlay clean lower white cheeks
        g.fillColor = whiteMuzzle;
        g.ellipse(cx, headY - s * 0.36, s * 0.78, s * 0.36);
        g.fill();
        // Eyes
        const eyeX = s * 0.36;
        const eyeY = headY + s * 0.04;
        const eyeR = s * 0.23;
        if (happyBlink) {
            g.strokeColor = new cc_1.Color(245, 245, 248, 255);
            g.lineWidth = 3.5;
            g.arc(cx - eyeX, eyeY - s * 0.04, eyeR * 0.8, 0.2, Math.PI - 0.2, false);
            g.stroke();
            g.arc(cx + eyeX, eyeY - s * 0.04, eyeR * 0.8, 0.2, Math.PI - 0.2, false);
            g.stroke();
        }
        else {
            // White outer eye ring
            g.fillColor = new cc_1.Color(244, 244, 247, 255);
            g.circle(cx - eyeX, eyeY, eyeR);
            g.circle(cx + eyeX, eyeY, eyeR);
            g.fill();
            // Dark iris/pupil (shifted right/up if sideEye is true, just like row 1 col 2!)
            const pupilShiftX = sideEye ? eyeR * 0.32 : 0;
            const pupilShiftY = sideEye ? eyeR * 0.14 : 0;
            const pupilR = eyeR * 0.72;
            g.fillColor = new cc_1.Color(20, 20, 24, 255);
            g.circle(cx - eyeX + pupilShiftX, eyeY + pupilShiftY, pupilR);
            g.circle(cx + eyeX + pupilShiftX, eyeY + pupilShiftY, pupilR);
            g.fill();
            // Eye shine catchlight
            g.fillColor = new cc_1.Color(255, 255, 255, 240);
            g.circle(cx - eyeX + pupilShiftX - pupilR * 0.28, eyeY + pupilShiftY + pupilR * 0.28, pupilR * 0.26);
            g.circle(cx + eyeX + pupilShiftX - pupilR * 0.28, eyeY + pupilShiftY + pupilR * 0.28, pupilR * 0.26);
            g.fill();
        }
        // Cute pink triangular nose
        g.fillColor = new cc_1.Color(230, 146, 164, 255);
        g.moveTo(cx - s * 0.11, headY - s * 0.16);
        g.lineTo(cx + s * 0.11, headY - s * 0.16);
        g.lineTo(cx, headY - s * 0.28);
        g.close();
        g.fill();
        // Little mouth curves
        g.strokeColor = new cc_1.Color(80, 75, 82, 220);
        g.lineWidth = 2.2;
        g.moveTo(cx, headY - s * 0.27);
        g.lineTo(cx - s * 0.10, headY - s * 0.36);
        g.moveTo(cx, headY - s * 0.27);
        g.lineTo(cx + s * 0.10, headY - s * 0.36);
        g.stroke();
    }
    /**
     * Draw small Cat Head icon for the top HUD progress counter in Nyandoku.
     */
    static drawCatProgressIcon(g, cx, cy, size, filled) {
        if (filled) {
            this.drawTuxedoCat(g, cx, cy, size * 2.1, false, false);
        }
        else {
            const s = size * 0.85;
            const silhouette = new cc_1.Color(224, 206, 178, 255);
            g.fillColor = silhouette;
            g.moveTo(cx - s * 0.78, cy + s * 0.1);
            g.lineTo(cx - s * 0.65, cy + s * 0.98);
            g.lineTo(cx - s * 0.15, cy + s * 0.58);
            g.close();
            g.fill();
            g.moveTo(cx + s * 0.78, cy + s * 0.1);
            g.lineTo(cx + s * 0.65, cy + s * 0.98);
            g.lineTo(cx + s * 0.15, cy + s * 0.58);
            g.close();
            g.fill();
            g.ellipse(cx, cy - s * 0.08, s * 0.85, s * 0.70);
            g.fill();
        }
    }
    /**
     * Draw Goldfish life/hint icon for the top HUD in Nyandoku.
     */
    static drawGoldfishIcon(g, cx, cy, size, active) {
        const s = size * 0.85;
        const bodyCol = active ? new cc_1.Color(246, 162, 38, 255) : new cc_1.Color(235, 224, 210, 255);
        const tailCol = active ? new cc_1.Color(230, 126, 24, 255) : new cc_1.Color(222, 210, 195, 255);
        // Swishy tail fin on bottom-left
        g.fillColor = tailCol;
        g.moveTo(cx - s * 0.35, cy - s * 0.15);
        g.lineTo(cx - s * 0.95, cy - s * 0.75);
        g.lineTo(cx - s * 0.45, cy - s * 0.85);
        g.close();
        g.fill();
        // Plump fish body tilted 35 deg
        g.fillColor = bodyCol;
        g.ellipse(cx + s * 0.1, cy + s * 0.1, s * 0.68, s * 0.48);
        g.fill();
        if (active) {
            // Cute eye & gill arc
            g.fillColor = new cc_1.Color(60, 38, 24, 255);
            g.circle(cx + s * 0.38, cy + s * 0.22, s * 0.11);
            g.fill();
            g.strokeColor = new cc_1.Color(210, 105, 15, 200);
            g.lineWidth = 2;
            g.arc(cx + s * 0.15, cy + s * 0.12, s * 0.25, -0.8, 0.8, false);
            g.stroke();
        }
    }
    /**
     * Draw the iconic Shiba Inu Doge head for Save Doge!
     */
    static drawDogeHead(g, cx, cy, radius, mood = 'smirk') {
        const r = radius;
        const furGold = new cc_1.Color(232, 169, 92, 255);
        const furCream = new cc_1.Color(250, 232, 205, 255);
        const outline = new cc_1.Color(68, 42, 24, 255);
        // Ears
        g.fillColor = furGold;
        g.strokeColor = outline;
        g.lineWidth = 3;
        // Left ear
        g.moveTo(cx - r * 0.78, cy + r * 0.32);
        g.lineTo(cx - r * 0.62, cy + r * 1.15);
        g.lineTo(cx - r * 0.18, cy + r * 0.78);
        g.close();
        g.fill();
        g.stroke();
        // Right ear
        g.moveTo(cx + r * 0.78, cy + r * 0.32);
        g.lineTo(cx + r * 0.62, cy + r * 1.15);
        g.lineTo(cx + r * 0.18, cy + r * 0.78);
        g.close();
        g.fill();
        g.stroke();
        // Main round Shiba head
        g.fillColor = furGold;
        g.ellipse(cx, cy, r * 0.96, r * 0.88);
        g.fill();
        g.stroke();
        // Cream Shiba cheeks & lower face
        g.fillColor = furCream;
        g.ellipse(cx, cy - r * 0.24, r * 0.82, r * 0.52);
        g.fill();
        // Cream eyebrow dots
        g.circle(cx - r * 0.34, cy + r * 0.42, r * 0.11);
        g.circle(cx + r * 0.34, cy + r * 0.42, r * 0.11);
        g.fill();
        // Eyes
        if (mood === 'scared') {
            g.fillColor = new cc_1.Color(255, 255, 255, 255);
            g.circle(cx - r * 0.34, cy + r * 0.14, r * 0.22);
            g.circle(cx + r * 0.34, cy + r * 0.14, r * 0.22);
            g.fill();
            g.stroke();
            g.fillColor = outline;
            g.circle(cx - r * 0.34, cy + r * 0.14, r * 0.08);
            g.circle(cx + r * 0.34, cy + r * 0.14, r * 0.08);
            g.fill();
            // Blue sweat drop
            g.fillColor = new cc_1.Color(72, 185, 255, 255);
            g.circle(cx + r * 0.78, cy + r * 0.28, r * 0.12);
            g.fill();
        }
        else if (mood === 'happy') {
            g.strokeColor = outline;
            g.lineWidth = 3.5;
            g.arc(cx - r * 0.34, cy + r * 0.10, r * 0.16, 0.15, Math.PI - 0.15, false);
            g.stroke();
            g.arc(cx + r * 0.34, cy + r * 0.10, r * 0.16, 0.15, Math.PI - 0.15, false);
            g.stroke();
        }
        else {
            // Classic meme side-eye smirk!
            g.fillColor = new cc_1.Color(255, 255, 255, 255);
            g.ellipse(cx - r * 0.34, cy + r * 0.14, r * 0.20, r * 0.14);
            g.ellipse(cx + r * 0.34, cy + r * 0.14, r * 0.20, r * 0.14);
            g.fill();
            g.stroke();
            g.fillColor = outline;
            g.circle(cx - r * 0.28, cy + r * 0.14, r * 0.09);
            g.circle(cx + r * 0.40, cy + r * 0.14, r * 0.09);
            g.fill();
        }
        // Nose
        g.fillColor = outline;
        g.ellipse(cx, cy - r * 0.10, r * 0.14, r * 0.10);
        g.fill();
        // Mouth
        g.strokeColor = outline;
        g.lineWidth = 2.8;
        if (mood === 'scared') {
            g.fillColor = new cc_1.Color(195, 58, 58, 255);
            g.ellipse(cx, cy - r * 0.36, r * 0.22, r * 0.16);
            g.fill();
            g.stroke();
        }
        else {
            g.moveTo(cx - r * 0.24, cy - r * 0.28);
            g.quadraticCurveTo(cx, cy - r * 0.40, cx + r * 0.28, cy - r * 0.22);
            g.stroke();
        }
    }
    /**
     * Draw an angry Killer Bee for Save Doge.
     */
    static drawKillerBee(g, cx, cy, r, wingPhase) {
        const wingOffset = Math.sin(wingPhase) * r * 0.25;
        // Translucent wings
        g.fillColor = new cc_1.Color(235, 248, 255, 195);
        g.ellipse(cx - r * 0.25, cy + r * 0.65 + wingOffset, r * 0.45, r * 0.28);
        g.ellipse(cx + r * 0.25, cy + r * 0.65 - wingOffset, r * 0.45, r * 0.28);
        g.fill();
        // Yellow body
        g.fillColor = new cc_1.Color(255, 208, 38, 255);
        g.strokeColor = new cc_1.Color(40, 28, 12, 255);
        g.lineWidth = 2.2;
        g.ellipse(cx, cy, r * 0.95, r * 0.72);
        g.fill();
        g.stroke();
        // Black stripes
        g.fillColor = new cc_1.Color(36, 28, 18, 255);
        g.fillRect(cx - r * 0.22, cy - r * 0.64, r * 0.22, r * 1.28);
        g.fillRect(cx + r * 0.18, cy - r * 0.56, r * 0.20, r * 1.12);
        // Angry red eye
        g.fillColor = new cc_1.Color(235, 45, 45, 255);
        g.circle(cx - r * 0.48, cy + r * 0.12, r * 0.18);
        g.fill();
    }
}
exports.CocosUIHelpers = CocosUIHelpers;

  };
  __alias["../core/CocosUIHelpers"] = "./core/CocosUIHelpers";
  __alias["./CocosUIHelpers"] = "./core/CocosUIHelpers";

  // === MODULE: ./core/Art ===
  __modules["./core/Art"] = function(module, exports, require) {
"use strict";
// =====================================================================================
//  Art — the generated bitmap manifest.
// =====================================================================================
//  Key art and sprites are produced by tools/gen-art.py (Codex image generation) and
//  squeezed to shipping weight by tools/pack-art.py. The whole set is well under a
//  megabyte, and every call site keeps a procedural fallback, so the game is playable
//  the instant the script parses and simply gets prettier as the art decodes.
// =====================================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.Textures = exports.hasArt = exports.loadArt = exports.restrictArt = exports.ART = void 0;
const cc_1 = require("cc");
Object.defineProperty(exports, "Textures", { enumerable: true, get: function () { return cc_1.Textures; } });
exports.ART = {
    key_nyandoku: 'art/key_nyandoku.webp',
    key_savedoge: 'art/key_savedoge.webp',
    key_appleworm: 'art/key_appleworm.webp',
    key_parabox: 'art/key_parabox.webp',
    key_isleofglass: 'art/key_isleofglass.webp',
    sp_cat: 'art/sp_cat.webp',
    sp_doge: 'art/sp_doge.webp',
    sp_bee: 'art/sp_bee.webp',
    sp_apple: 'art/sp_apple.webp',
    sp_portal: 'art/sp_portal.webp',
};
let _started = false;
/**
 * Narrow the manifest to what this package actually ships.
 *
 * The shipping TikTok packages carry one game each, so they include two or three of
 * these files and none of the others. Without this the loader would request art that
 * is not in the package — harmless to the player, but a package that 404s on its own
 * paths is exactly the kind of thing a reviewer notices.
 */
function restrictArt(keys) {
    for (const k of Object.keys(exports.ART)) {
        if (keys.indexOf(k) === -1)
            delete exports.ART[k];
    }
}
exports.restrictArt = restrictArt;
/** Kick off decoding. Safe to call more than once. */
function loadArt() {
    if (_started)
        return;
    _started = true;
    cc_1.Textures.load(exports.ART);
}
exports.loadArt = loadArt;
function hasArt(key) {
    return cc_1.Textures.has(key);
}
exports.hasArt = hasArt;

  };
  __alias["../core/Art"] = "./core/Art";
  __alias["./Art"] = "./core/Art";

  // === MODULE: ./core/GameArt ===
  __modules["./core/GameArt"] = function(module, exports, require) {
"use strict";
// =====================================================================================
//  GameArt — miniature animated scenes used as the hub's game thumbnails.
// =====================================================================================
//  A static icon grid looks like a settings screen. Each tile here paints a living
//  one-second loop of its game, so the hub sells the games instead of listing them.
// =====================================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameArt = void 0;
const cc_1 = require("cc");
const Theme_1 = require("./Theme");
const CocosUIHelpers_1 = require("./CocosUIHelpers");
/** Draws a game's thumbnail scene centred at (cx, cy) inside a box of `size`. */
function gameArt(g, id, cx, cy, size, time) {
    const s = size;
    switch (id) {
        case 'nyandoku':
            artNyandoku(g, cx, cy, s, time);
            break;
        case 'savedoge':
            artSaveDoge(g, cx, cy, s, time);
            break;
        case 'appleworm':
            artAppleWorm(g, cx, cy, s, time);
            break;
        case 'parabox':
            artParabox(g, cx, cy, s, time);
            break;
        case 'isleofglass':
            artIsleOfGlass(g, cx, cy, s, time);
            break;
    }
}
exports.gameArt = gameArt;
function artNyandoku(g, cx, cy, s, time) {
    const cell = s * 0.3;
    const cols = ['#C9A227', '#C2849A', '#3C7FA3', '#64955A'];
    const idx = [0, 1, 2, 2, 0, 2, 2, 3, 0, 0, 2, 3, 0, 2, 2, 2];
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            const x = cx + (c - 1.5) * cell;
            const y = cy + (1.5 - r) * cell;
            const col = (0, Theme_1.hex)(cols[idx[r * 4 + c]]);
            g.setFillGradient(0, y + cell * 0.5, 0, y - cell * 0.5, [
                [0, col.shade(-0.18).toCSS()],
                [1, col.shade(0.16).toCSS()],
            ]);
            g.roundRect(x - cell * 0.46, y - cell * 0.46, cell * 0.92, cell * 0.92, cell * 0.2);
            g.fill();
            g.clearFillGradient();
        }
    }
    // A cat settles into a cell on a loop.
    const beat = (time * 0.7) % 1;
    const pop = beat < 0.25 ? beat / 0.25 : 1;
    const cx2 = cx - cell * 0.5;
    const cy2 = cy + cell * 1.5;
    CocosUIHelpers_1.CocosUIHelpers.drawTuxedoCat(g, cx2, cy2, cell * 2.0 * (0.6 + pop * 0.4), false, false);
}
function artSaveDoge(g, cx, cy, s, time) {
    // Lava trough.
    g.setFillGradient(0, cy - s * 0.18, 0, cy - s * 0.5, [
        [0, '#FFB03A'],
        [1, '#C62828'],
    ]);
    g.roundRect(cx - s * 0.5, cy - s * 0.5, s, s * 0.32, 8);
    g.fill();
    g.clearFillGradient();
    for (let i = 0; i < 4; i++) {
        const bx = cx - s * 0.36 + i * s * 0.24;
        const by = cy - s * 0.34 + Math.sin(time * 2.4 + i) * s * 0.05;
        g.fillColor = (0, Theme_1.hex)('#FFE08A', 190);
        g.circle(bx, by, s * 0.035);
        g.fill();
    }
    // Barrier line the player drew.
    g.strokeColor = (0, Theme_1.hex)('#4ECDC4');
    g.lineWidth = s * 0.055;
    g.moveTo(cx - s * 0.42, cy + s * 0.02);
    g.quadraticCurveTo(cx, cy + s * 0.3, cx + s * 0.42, cy + s * 0.02);
    g.stroke();
    CocosUIHelpers_1.CocosUIHelpers.drawDogeHead(g, cx, cy - s * 0.12, s * 0.21, 'smirk');
    // Bees dive at the barrier.
    for (let i = 0; i < 2; i++) {
        const t = (time * 0.6 + i * 0.5) % 1;
        const bx = cx - s * 0.3 + t * s * 0.6;
        const by = cy + s * 0.42 - Math.sin(t * Math.PI) * s * 0.1;
        CocosUIHelpers_1.CocosUIHelpers.drawKillerBee(g, bx, by, s * 0.075, time * 18 + i);
    }
}
function artAppleWorm(g, cx, cy, s, time) {
    // Platform.
    g.setFillGradient(0, cy - s * 0.24, 0, cy - s * 0.42, [
        [0, '#2E7D5B'],
        [1, '#14402F'],
    ]);
    g.roundRect(cx - s * 0.46, cy - s * 0.42, s * 0.92, s * 0.18, 6);
    g.fill();
    g.clearFillGradient();
    // Worm body segments.
    const wig = Math.sin(time * 3) * s * 0.05;
    const segs = [
        [-0.26, -0.1],
        [-0.1, -0.1],
        [0.04, -0.06],
        [0.04, 0.1],
    ];
    for (let i = segs.length - 1; i >= 0; i--) {
        const x = cx + segs[i][0] * s;
        const y = cy + segs[i][1] * s + (i === 3 ? wig : 0);
        const c = (0, Theme_1.hex)(i === 3 ? '#8BE86B' : '#4CAF50');
        g.setFillGradient(0, y + s * 0.09, 0, y - s * 0.09, [
            [0, c.shade(-0.2).toCSS()],
            [1, c.shade(0.2).toCSS()],
        ]);
        g.circle(x, y, s * 0.085);
        g.fill();
        g.clearFillGradient();
    }
    // Eyes on the head segment.
    const hx = cx + 0.04 * s;
    const hy = cy + 0.1 * s + wig;
    g.fillColor = (0, Theme_1.hex)('#FFFFFF');
    g.circle(hx + s * 0.03, hy + s * 0.03, s * 0.026);
    g.circle(hx - s * 0.03, hy + s * 0.03, s * 0.026);
    g.fill();
    g.fillColor = (0, Theme_1.hex)('#13291A');
    g.circle(hx + s * 0.035, hy + s * 0.032, s * 0.013);
    g.circle(hx - s * 0.025, hy + s * 0.032, s * 0.013);
    g.fill();
    // Apple with a glint.
    const ax = cx + s * 0.32;
    const ay = cy + s * 0.04 + Math.sin(time * 2) * s * 0.02;
    g.setFillRadial(ax - s * 0.03, ay + s * 0.03, 0, s * 0.12, [
        [0, '#FF6B6B'],
        [1, '#C62828'],
    ]);
    g.circle(ax, ay, s * 0.095);
    g.fill();
    g.clearFillGradient();
    g.strokeColor = (0, Theme_1.hex)('#6D4C41');
    g.lineWidth = s * 0.018;
    g.moveTo(ax, ay + s * 0.09);
    g.lineTo(ax + s * 0.02, ay + s * 0.15);
    g.stroke();
    g.fillColor = (0, Theme_1.hex)('#7CB342');
    g.ellipse(ax + s * 0.07, ay + s * 0.15, s * 0.05, s * 0.025, 0.5);
    g.fill();
}
function artParabox(g, cx, cy, s, time) {
    const o = s * 0.44;
    // Outer room.
    g.setFillGradient(0, cy + o, 0, cy - o, [
        [0, '#1B2A5E'],
        [1, '#0C1430'],
    ]);
    g.roundRect(cx - o, cy - o, o * 2, o * 2, 10);
    g.fill();
    g.clearFillGradient();
    g.strokeColor = (0, Theme_1.hex)('#4D8BFF', 120);
    g.lineWidth = 2;
    g.roundRect(cx - o, cy - o, o * 2, o * 2, 10);
    g.stroke();
    // Grid lines.
    g.strokeColor = (0, Theme_1.hex)('#4D8BFF', 45);
    g.lineWidth = 1;
    for (let i = 1; i < 4; i++) {
        g.moveTo(cx - o + (i / 4) * o * 2, cy - o);
        g.lineTo(cx - o + (i / 4) * o * 2, cy + o);
        g.moveTo(cx - o, cy - o + (i / 4) * o * 2);
        g.lineTo(cx + o, cy - o + (i / 4) * o * 2);
    }
    g.stroke();
    // Recursive box — a box containing a smaller copy of itself.
    const k = 0.5 + Math.sin(time * 1.6) * 0.04;
    let bx = cx - o * 0.12;
    let by = cy + o * 0.1;
    let bs = o * 0.88;
    for (let d = 0; d < 3; d++) {
        g.setFillGradient(0, by + bs * 0.5, 0, by - bs * 0.5, [
            [0, (0, Theme_1.rgba)('#4D8BFF', 0.34 + d * 0.16)],
            [1, (0, Theme_1.rgba)('#9A7BFF', 0.22 + d * 0.16)],
        ]);
        g.roundRect(bx - bs * 0.5, by - bs * 0.5, bs, bs, bs * 0.16);
        g.fill();
        g.clearFillGradient();
        g.strokeColor = (0, Theme_1.hex)('#9ECBFF', 170 - d * 30);
        g.lineWidth = 1.6;
        g.roundRect(bx - bs * 0.5, by - bs * 0.5, bs, bs, bs * 0.16);
        g.stroke();
        bs *= k;
    }
    // Player token.
    g.fillColor = (0, Theme_1.hex)('#FF4D9D');
    g.roundRect(cx + o * 0.42, cy - o * 0.62, o * 0.34, o * 0.34, 5);
    g.fill();
}
function artIsleOfGlass(g, cx, cy, s, time) {
    const panes = [
        [-0.34, 0.22, 0.34, 0.3, '#C77DFF'],
        [0.16, 0.26, 0.42, 0.22, '#4ECDC4'],
        [-0.3, -0.16, 0.26, 0.38, '#FF9D7A'],
        [0.1, -0.22, 0.5, 0.26, '#FFD166'],
    ];
    for (let i = 0; i < panes.length; i++) {
        const [px, py, pw, ph, col] = panes[i];
        const glow = 0.55 + Math.sin(time * 1.4 + i * 1.2) * 0.25;
        const x = cx + px * s;
        const y = cy + py * s;
        const w = pw * s;
        const h = ph * s;
        g.setFillGradient(0, y + h * 0.5, 0, y - h * 0.5, [
            [0, (0, Theme_1.rgba)(col, 0.9 * glow)],
            [1, (0, Theme_1.rgba)(col, 0.42 * glow)],
        ]);
        g.roundRect(x - w * 0.5, y - h * 0.5, w, h, 5);
        g.fill();
        g.clearFillGradient();
        g.strokeColor = (0, Theme_1.hex)('#1B1033', 220);
        g.lineWidth = s * 0.028;
        g.roundRect(x - w * 0.5, y - h * 0.5, w, h, 5);
        g.stroke();
        // Area clue.
        g.text(String(Math.round(pw * ph * 36)), x, y, {
            size: s * 0.11,
            weight: 900,
            color: new cc_1.Color(26, 14, 44, 230),
        });
    }
}

  };
  __alias["../core/GameArt"] = "./core/GameArt";
  __alias["./GameArt"] = "./core/GameArt";

  // === MODULE: ./core/GameShell ===
  __modules["./core/GameShell"] = function(module, exports, require) {
"use strict";
// =====================================================================================
//  GameShell — the chrome every game in the arcade wears.
// =====================================================================================
//  A game subclass supplies its rules, its level data and one method that paints its
//  play field. The shell owns everything else: backdrop, header, stat readouts, hint
//  ribbon, action bar, level rail, how-to-play card, win/lose sheets, particles,
//  screen shake and input routing.
//
//  That split is why five games can look like one product: a designer changes the
//  button here and all five change.
// =====================================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.lerp = exports.Ease = exports.clamp01 = exports.rgba = exports.hex = exports.T = exports.UI = exports.haptic = exports.GameShell = exports.FIELD_H = exports.FIELD_W = exports.FIELD_CY = exports.FIELD_CX = exports.relayoutShell = exports.FIELD = exports.L = void 0;
const cc_1 = require("cc");
const Theme_1 = require("./Theme");
Object.defineProperty(exports, "T", { enumerable: true, get: function () { return Theme_1.T; } });
Object.defineProperty(exports, "hex", { enumerable: true, get: function () { return Theme_1.hex; } });
Object.defineProperty(exports, "rgba", { enumerable: true, get: function () { return Theme_1.rgba; } });
Object.defineProperty(exports, "clamp01", { enumerable: true, get: function () { return Theme_1.clamp01; } });
Object.defineProperty(exports, "Ease", { enumerable: true, get: function () { return Theme_1.Ease; } });
Object.defineProperty(exports, "lerp", { enumerable: true, get: function () { return Theme_1.lerp; } });
const UI = require("./UIKit");
exports.UI = UI;
const FX_1 = require("./FX");
const SoundManager_1 = require("./SoundManager");
const Progress_1 = require("./Progress");
const TikTokSDK_1 = require("../sdk/TikTokSDK");
const Art_1 = require("./Art");
const AdDirector_1 = require("./AdDirector");
// -------------------------------------------------------------------------------------
//  Layout
// -------------------------------------------------------------------------------------
//  These are live values, not constants: the stage height follows the device, so every
//  band is measured down from the top edge and up from the bottom edge, and the play
//  field simply gets whatever is left. On a tall phone that is a much bigger board
//  rather than two black bars.
//
//  The objects are mutated in place so `import { L } from './GameShell'` keeps working
//  and always reflects the current screen.
// -------------------------------------------------------------------------------------
/** Layout bands — every game lays its field out inside FIELD_*. */
exports.L = {
    barY: 548,
    statY: 466,
    fieldTop: 414,
    fieldBottom: -262,
    hintY: -318,
    actionY: -402,
    railY: -492,
};
/** Live field metrics, recomputed with L. */
exports.FIELD = { cx: 0, cy: 76, w: 640, h: 676 };
function relayoutShell() {
    const half = Theme_1.T.H * 0.5;
    // Top down: header bar, then the stat rail under it.
    exports.L.barY = half - Theme_1.T.safeTop - 44;
    exports.L.statY = exports.L.barY - 82;
    // Bottom up: level rail, action bar, coach line.
    exports.L.railY = -half + Theme_1.T.safeBottom + 34;
    exports.L.actionY = exports.L.railY + 90;
    exports.L.hintY = exports.L.actionY + 84;
    // Whatever is left belongs to the board.
    exports.L.fieldTop = exports.L.statY - 52;
    exports.L.fieldBottom = exports.L.hintY + 56;
    exports.FIELD.cx = 0;
    exports.FIELD.cy = (exports.L.fieldTop + exports.L.fieldBottom) * 0.5;
    exports.FIELD.w = Theme_1.T.W - Theme_1.T.gutter * 2;
    exports.FIELD.h = exports.L.fieldTop - exports.L.fieldBottom;
}
exports.relayoutShell = relayoutShell;
(0, Theme_1.onRelayout)(relayoutShell);
/**
 * Back-compat aliases. These were module constants; games that still read them get the
 * value from the last relayout, and anything laid out per frame should read FIELD.
 */
exports.FIELD_CX = 0;
exports.FIELD_CY = exports.FIELD.cy;
exports.FIELD_W = exports.FIELD.w;
exports.FIELD_H = exports.FIELD.h;
(0, Theme_1.onRelayout)(() => {
    exports.FIELD_CY = exports.FIELD.cy;
    exports.FIELD_W = exports.FIELD.w;
    exports.FIELD_H = exports.FIELD.h;
});
class GameShell {
    constructor(parent, backToHub, paletteId) {
        this.fx = new FX_1.FX();
        this.anim = new FX_1.Anim();
        this.tl = new FX_1.Timeline();
        this.time = 0;
        this.level = 0;
        this.phase = 'play';
        this.pressedId = null;
        this._hits = [];
        this._overHits = [];
        this._introShown = false;
        this._wonStars = 0;
        this._wonImproved = false;
        this._loseReason = '';
        this._hintAlpha = 1;
        this._firstTryWin = false;
        /** Swallows input briefly after an overlay closes — see lockInput(). */
        this._inputLock = 0;
        // =================================================================================
        //  Paged level rail
        // =================================================================================
        //  With fifty levels the rail cannot show them all, so it shows a window. The window
        //  normally follows the level you are on; the chevrons let you look further without
        //  leaving the level.
        /** -1 means "follow the current level"; otherwise the first index the rail shows. */
        this._railAnchor = -1;
        this._backToHub = backToHub;
        this.pal = Theme_1.PALETTES[paletteId] || Theme_1.PALETTES.hub;
        (0, Art_1.loadArt)();
        this.root = new cc_1.Node('Game_' + paletteId);
        this.root.layer = parent.layer;
        parent.addChild(this.root);
        this.root.addComponent(cc_1.UITransform).setContentSize(Theme_1.T.W, Theme_1.T.H);
        this.gBg = this._layer('Bg', this.root);
        this.shakeNode = new cc_1.Node('Shake');
        this.shakeNode.layer = parent.layer;
        this.root.addChild(this.shakeNode);
        this.gField = this._layer('Field', this.shakeNode);
        this.gFx = this._layer('Fx', this.shakeNode);
        this.gHud = this._layer('Hud', this.root);
        this.gOver = this._layer('Overlay', this.root);
    }
    _layer(name, parent) {
        const n = new cc_1.Node(name);
        n.layer = parent.layer;
        parent.addChild(n);
        n.addComponent(cc_1.UITransform).setContentSize(Theme_1.T.W, Theme_1.T.H);
        return n.addComponent(cc_1.Graphics);
    }
    /** Per-frame rules tick. */
    onTick(_dt) { }
    /** Field input, in stage coordinates. */
    onFieldDown(_x, _y) { }
    onFieldMove(_x, _y) { }
    onFieldUp(_x, _y) { }
    /** Extra controls in the action bar (hint, undo, toggles…). */
    actions() {
        return [];
    }
    onAction(_id, _spec) { }
    /** Override to change the coach line as the level progresses. */
    hintText() {
        return this.meta.hint;
    }
    /** Subtitle under the level title in the win sheet. */
    winBlurb() {
        return 'Level complete';
    }
    /** Short name for the current level, shown in the header eyebrow. */
    levelName() {
        return 'Level ' + (this.level + 1);
    }
    /**
     * Whether this game can resume from a death. Puzzle games with no fail state say
     * no; action games restore the player and carry on. Returning true is what puts a
     * rewarded "Continue" button on the lose sheet.
     */
    canRevive() {
        return false;
    }
    /** Put the player back in play after a death. Only called when canRevive() is true. */
    onRevive() { }
    /**
     * Show a rewarded ad and run `onReward` if the player earns it. Games call this
     * rather than the SDK directly so every watch is counted by the pacing policy.
     */
    watchAdFor(reason, onReward) {
        TikTokSDK_1.TikTokSDK.showRewardedVideoAd(reason, () => {
            AdDirector_1.AdDirector.noteRewardedWatched();
            onReward();
        });
    }
    // =================================================================================
    //  Flow
    // =================================================================================
    loadLevel(i) {
        this.level = Math.max(0, Math.min(this.meta.levelCount - 1, i));
        this._railAnchor = -1;
        this.phase = 'play';
        this.lockInput(0.3);
        this.fx.clear();
        this.tl.reset();
        this.anim.reset();
        this._hintAlpha = 1;
        AdDirector_1.AdDirector.noteLevelStart(this.meta.id, this.level);
        this.onLoadLevel(this.level);
        if (!this._introShown && Progress_1.Progress.needsIntro(this.meta.id)) {
            this.phase = 'intro';
            this._introShown = true;
        }
    }
    win(stars = 3) {
        if (this.phase !== 'play')
            return;
        this.phase = 'won';
        this.tl.reset();
        this._firstTryWin = AdDirector_1.AdDirector.failuresThisLevel === 0;
        AdDirector_1.AdDirector.noteCompletion();
        this._wonStars = Math.max(1, Math.min(3, stars));
        this._wonImproved = Progress_1.Progress.complete(this.meta.id, this.level, this._wonStars, this.meta.levelCount);
        SoundManager_1.SoundManager.playWin();
        this.fx.confetti(90, [this.pal.accent, this.pal.accent2, Theme_1.T.gold, '#FFFFFF', Theme_1.T.mint]);
        this.fx.ring(0, 120, this.pal.accent, 90, 0.8);
        this.fx.flash('#FFFFFF', 0.35, 0.4);
        haptic(28);
    }
    lose(reason) {
        if (this.phase !== 'play')
            return;
        this.phase = 'lost';
        this.tl.reset();
        this._loseReason = reason;
        AdDirector_1.AdDirector.noteFailure();
        SoundManager_1.SoundManager.playLose();
        this.fx.shake(16, 0.5);
        this.fx.flash(Theme_1.T.danger, 0.4, 0.45);
        haptic([18, 50, 30]);
    }
    restart() {
        this.loadLevel(this.level);
        SoundManager_1.SoundManager.playTap(0.8);
    }
    nextLevel() {
        if (this.level + 1 >= this.meta.levelCount) {
            this._backToHub();
            return;
        }
        this.loadLevel(this.level + 1);
    }
    destroy() {
        this.root.destroy();
    }
    // =================================================================================
    //  Frame
    // =================================================================================
    /**
     * Ignore taps for a moment. The finger that dismissed an ad or a modal is still
     * coming down on whatever is underneath it, and on an ad-supported game an
     * accidental tap is both a bad experience and an invalid click.
     */
    lockInput(seconds = 0.35) {
        this._inputLock = Math.max(this._inputLock, seconds);
    }
    update(dt) {
        this.time += dt;
        if (this._inputLock > 0)
            this._inputLock = Math.max(0, this._inputLock - dt);
        this.fx.update(dt);
        this.anim.update(dt);
        this.tl.update(dt);
        this.shakeNode.setPosition(this.fx.shakeX, this.fx.shakeY);
        if (this.phase === 'play') {
            this.onTick(dt);
            // The coach line steps aside once the player is clearly engaged.
            this._hintAlpha = (0, Theme_1.lerp)(this._hintAlpha, this.tl.t > 7 ? 0.0 : 1, 1 - Math.exp(-2.2 * dt));
        }
        this.render(dt);
    }
    render(dt = 0.016) {
        this._hits = [];
        this._overHits = [];
        this.gBg.clear();
        if (this.chromeStyle() === 'custom') {
            this.drawBackdrop(this.gBg);
            this.gField.clear();
            this.drawField(this.gField, dt);
            this.gFx.clear();
            this.fx.draw(this.gFx);
            this.gHud.clear();
            this.drawChrome(this.gHud);
            this.fx.drawTexts(this.gHud);
            this.gOver.clear();
            if (this.phase === 'intro')
                this.drawIntro(this.gOver);
            else if (this.phase === 'won')
                this.drawWin(this.gOver);
            else if (this.phase === 'lost')
                this.drawLose(this.gOver);
            this.fx.drawFlash(this.gOver);
            return;
        }
        UI.backdrop(this.gBg, this.pal, this.time);
        // The game's key art, pushed far back: it gives each level a sense of place
        // without competing with the board for attention.
        const plate = 'key_' + this.meta.id;
        if ((0, Art_1.hasArt)(plate)) {
            const drift = Math.sin(this.time * 0.22) * 14;
            this.gBg.save();
            this.gBg.setAlpha(0.2);
            this.gBg.image(plate, 0, 150 + drift, Theme_1.T.W * 1.15, Theme_1.T.W * 1.15, { cover: true });
            this.gBg.restore();
            this.gBg.setFillGradient(0, Theme_1.T.H * 0.5, 0, -Theme_1.T.H * 0.5, [
                [0, (0, Theme_1.rgba)(this.pal.bgTop, 0.55)],
                [0.42, (0, Theme_1.rgba)(this.pal.bgBottom, 0.82)],
                [1, (0, Theme_1.rgba)(this.pal.bgBottom, 0.97)],
            ]);
            this.gBg.rect(-Theme_1.T.W * 0.5, -Theme_1.T.H * 0.5, Theme_1.T.W, Theme_1.T.H);
            this.gBg.fill();
            this.gBg.clearFillGradient();
        }
        UI.motes(this.gBg, this.time, 16, this.pal.aura2, 3);
        this.gField.clear();
        this.drawField(this.gField, dt);
        this.gFx.clear();
        this.fx.draw(this.gFx);
        this.gHud.clear();
        this.drawChrome(this.gHud);
        this.fx.drawTexts(this.gHud);
        this.gOver.clear();
        if (this.phase === 'intro')
            this.drawIntro(this.gOver);
        else if (this.phase === 'won')
            this.drawWin(this.gOver);
        else if (this.phase === 'lost')
            this.drawLose(this.gOver);
        this.fx.drawFlash(this.gOver);
    }
    // =================================================================================
    //  Chrome
    // =================================================================================
    drawChrome(g) {
        const m = this.meta;
        this._hits.push(...UI.topBar(g, {
            title: m.title,
            eyebrow: this.levelName(),
            pal: this.pal,
            right: [
                { name: SoundManager_1.SoundManager.muted ? 'mute' : 'sound', id: 'sound' },
                { name: 'restart', id: 'restart' },
            ],
            pressedId: this.pressedId,
            y: exports.L.barY,
        }));
        // Stat readouts: a single rail of label/value pairs reads faster than
        // scattered counters and keeps the eye on one line.
        const st = this.stats();
        if (st.length) {
            const railW = Theme_1.T.W - Theme_1.T.gutter * 2;
            const h = 74;
            UI.panel(g, 0, exports.L.statY, railW, h, {
                radius: h * 0.42,
                fill: ['rgba(255,255,255,0.10)', 'rgba(255,255,255,0.04)'],
                border: new cc_1.Color(255, 255, 255, 30),
                borderWidth: 1.4,
                shadowBlur: 16,
                shadowY: -5,
            });
            const cellW = railW / st.length;
            for (let i = 0; i < st.length; i++) {
                const cx = -railW * 0.5 + cellW * (i + 0.5);
                if (i > 0) {
                    g.fillColor = new cc_1.Color(255, 255, 255, 26);
                    g.rect(-railW * 0.5 + cellW * i - 0.75, exports.L.statY - h * 0.26, 1.5, h * 0.52);
                    g.fill();
                }
                const tint = st[i].tint || Theme_1.T.textDim;
                const hasIcon = !!st[i].icon;
                g.text(st[i].label, cx + (hasIcon ? 11 : 0), exports.L.statY + 18, {
                    size: 17,
                    weight: 900,
                    family: cc_1.FONT_UI,
                    color: (0, Theme_1.hex)(tint, 190),
                    uppercase: true,
                    tracking: 2,
                    maxWidth: cellW - 24,
                });
                if (hasIcon)
                    UI.icon(g, st[i].icon, cx - measureW(st[i].value, 30) * 0.5 - 17, exports.L.statY - 11, 26, (0, Theme_1.hex)(tint));
                g.text(st[i].value, cx + (hasIcon ? 13 : 0), exports.L.statY - 12, {
                    size: 30,
                    weight: 900,
                    family: cc_1.FONT_DISPLAY,
                    color: (0, Theme_1.hex)(Theme_1.T.textHi),
                    maxWidth: cellW - 30,
                });
            }
        }
        if (this.phase === 'play') {
            UI.hintRibbon(g, exports.L.hintY, this.hintText(), this.pal, { alpha: this._hintAlpha });
        }
        // Action bar.
        const acts = this.actions();
        if (acts.length) {
            const gap = 16;
            const total = acts.reduce((a, b) => a + b.w, 0) + gap * (acts.length - 1);
            let x = -total * 0.5;
            for (const a of acts) {
                a.x = x + a.w * 0.5;
                a.y = exports.L.actionY;
                x += a.w + gap;
                UI.button(g, a, this.pal, { pressed: this.pressedId === a.id, time: this.time });
                this._hits.push({ id: a.id, x: a.x, y: a.y, w: a.w, h: a.h + 18, data: a, disabled: a.disabled });
            }
        }
        // Level rail.
        this._hits.push(...UI.levelRail(g, exports.L.railY, this.meta.levelCount, this.level, Progress_1.Progress.unlocked(this.meta.id), Progress_1.Progress.stars(this.meta.id), this.pal));
    }
    // =================================================================================
    //  Overlays
    // =================================================================================
    drawIntro(g) {
        const t = this.tl.seg(0, 0.4, Theme_1.Ease.outCubic);
        UI.scrim(g, 0.82 * t);
        const w = Theme_1.T.W - 96;
        const h = 540;
        const pop = Theme_1.Ease.outBack(this.tl.seg(0.08, 0.5), 1.5);
        const cy = (0, Theme_1.lerp)(-90, 30, pop);
        g.save();
        g.setAlpha(t);
        UI.panel(g, 0, cy, w, h, {
            radius: Theme_1.T.rXl,
            fill: [Theme_1.T.surfaceHi, Theme_1.T.ink2],
            border: (0, Theme_1.hex)(this.pal.accent, 70),
            borderWidth: 2,
            glow: this.pal.accent,
            glowStrength: 0.3,
            shadowBlur: 40,
            shadowY: -18,
        });
        g.text('HOW TO PLAY', 0, cy + h * 0.5 - 62, {
            size: 20,
            weight: 900,
            family: cc_1.FONT_UI,
            color: (0, Theme_1.hex)(this.pal.accent),
            uppercase: true,
            tracking: 4,
        });
        g.text(this.meta.title, 0, cy + h * 0.5 - 112, {
            size: 46,
            weight: 900,
            family: cc_1.FONT_DISPLAY,
            color: (0, Theme_1.hex)(Theme_1.T.textHi),
            tracking: -0.6,
            maxWidth: w - 70,
        });
        const rows = this.meta.howTo;
        const startY = cy + h * 0.5 - 196;
        for (let i = 0; i < rows.length; i++) {
            const ry = startY - i * 74;
            const rt = (0, Theme_1.clamp01)(this.tl.seg(0.22 + i * 0.09, 0.4));
            g.save();
            g.setAlpha(rt);
            UI.panel(g, 0, ry, w - 72, 60, {
                radius: 18,
                fill: ['rgba(255,255,255,0.09)', 'rgba(255,255,255,0.035)'],
                border: null,
                shadow: false,
                highlight: false,
            });
            g.setFillGradient(0, ry + 18, 0, ry - 18, [
                [0, (0, Theme_1.hex)(this.pal.accent).shade(0.25).toCSS()],
                [1, this.pal.accent],
            ]);
            g.circle(-(w - 72) * 0.5 + 36, ry, 17);
            g.fill();
            g.clearFillGradient();
            g.text(String(i + 1), -(w - 72) * 0.5 + 36, ry, {
                size: 21,
                weight: 900,
                family: cc_1.FONT_DISPLAY,
                color: (0, Theme_1.hex)('#FFFFFF'),
            });
            g.text(rows[i], -(w - 72) * 0.5 + 66 + (w - 72 - 96) * 0.5, ry, {
                size: 24,
                weight: 700,
                family: cc_1.FONT_UI,
                color: (0, Theme_1.hex)(Theme_1.T.text),
                align: 'center',
                maxWidth: w - 72 - 110,
                lineHeight: 29,
            });
            g.restore();
        }
        const btn = {
            id: 'intro_go',
            x: 0,
            y: cy - h * 0.5 + 64,
            w: w - 130,
            h: 86,
            label: 'Play',
            icon: 'play',
            tone: 'accent',
            pulse: true,
        };
        UI.button(g, btn, this.pal, { pressed: this.pressedId === 'intro_go', time: this.time });
        this._overHits.push({ id: 'intro_go', x: btn.x, y: btn.y, w: btn.w, h: btn.h + 20 });
        g.restore();
    }
    drawWin(g) {
        const t = this.tl.seg(0, 0.35);
        UI.scrim(g, 0.84 * t);
        const w = Theme_1.T.W - 110;
        const h = 560;
        const pop = Theme_1.Ease.outBack(this.tl.seg(0.1, 0.55), 1.6);
        const cy = (0, Theme_1.lerp)(-120, 20, pop);
        const last = this.level + 1 >= this.meta.levelCount;
        g.save();
        g.setAlpha(t);
        UI.panel(g, 0, cy, w, h, {
            radius: Theme_1.T.rXl,
            fill: [Theme_1.T.surfaceHi, Theme_1.T.ink2],
            border: (0, Theme_1.hex)(Theme_1.T.gold, 80),
            borderWidth: 2,
            glow: Theme_1.T.gold,
            glowStrength: 0.34,
            shadowBlur: 46,
            shadowY: -20,
        });
        // Rays behind the trophy.
        const rt = this.tl.seg(0.2, 0.6);
        g.save();
        g.setBlend('lighter');
        g.setAlpha(0.3 * rt);
        for (let i = 0; i < 12; i++) {
            const a = (i / 12) * Math.PI * 2 + this.time * 0.25;
            const ry = cy + h * 0.5 - 136;
            g.fillColor = (0, Theme_1.hex)(Theme_1.T.gold, 110);
            g.moveTo(0, ry);
            g.lineTo(Math.cos(a) * 190, ry + Math.sin(a) * 190);
            g.lineTo(Math.cos(a + 0.13) * 190, ry + Math.sin(a + 0.13) * 190);
            g.close();
            g.fill();
        }
        g.restore();
        g.text(this._wonImproved ? 'NEW BEST' : 'CLEARED', 0, cy + h * 0.5 - 56, {
            size: 20,
            weight: 900,
            family: cc_1.FONT_UI,
            color: (0, Theme_1.hex)(Theme_1.T.gold),
            uppercase: true,
            tracking: 5,
        });
        g.text(last ? 'All Levels Done!' : 'Nice One!', 0, cy + h * 0.5 - 116, {
            size: 58,
            weight: 900,
            family: cc_1.FONT_DISPLAY,
            gradient: [
                [0, '#FFFFFF'],
                [1, '#FFD98A'],
            ],
            color: (0, Theme_1.hex)('#FFFFFF'),
            tracking: -1,
            maxWidth: w - 70,
            shadow: new cc_1.Color(0, 0, 0, 160),
            shadowBlur: 16,
            shadowOffsetY: -3,
        });
        const reveal = [this.tl.seg(0.4, 0.4), this.tl.seg(0.58, 0.4), this.tl.seg(0.76, 0.4)];
        UI.starRow(g, 0, cy + h * 0.5 - 206, 34, this._wonStars, 3, reveal);
        g.text(this.winBlurb(), 0, cy + h * 0.5 - 286, {
            size: 25,
            weight: 700,
            family: cc_1.FONT_UI,
            color: (0, Theme_1.hex)(Theme_1.T.textDim),
            maxWidth: w - 90,
            lineHeight: 31,
        });
        const bw = w - 120;
        const nextBtn = {
            id: 'win_next',
            x: 0,
            y: cy - h * 0.5 + 142,
            w: bw,
            h: 88,
            label: last ? 'Back to Arcade' : 'Next Level',
            icon: last ? 'home' : 'chevron',
            tone: 'accent',
            pulse: true,
        };
        UI.button(g, nextBtn, this.pal, { pressed: this.pressedId === 'win_next', time: this.time });
        this._overHits.push({ id: 'win_next', x: nextBtn.x, y: nextBtn.y, w: nextBtn.w, h: nextBtn.h + 18 });
        const replay = {
            id: 'win_replay',
            x: -bw * 0.25 - 8,
            y: cy - h * 0.5 + 54,
            w: bw * 0.5 - 8,
            h: 68,
            label: 'Replay',
            icon: 'restart',
            tone: 'ghost',
        };
        const share = {
            id: 'win_share',
            x: bw * 0.25 + 8,
            y: cy - h * 0.5 + 54,
            w: bw * 0.5 - 8,
            h: 68,
            label: 'Share',
            icon: 'bolt',
            tone: 'ghost',
        };
        UI.button(g, replay, this.pal, { pressed: this.pressedId === 'win_replay', time: this.time });
        UI.button(g, share, this.pal, { pressed: this.pressedId === 'win_share', time: this.time });
        this._overHits.push({ id: 'win_replay', x: replay.x, y: replay.y, w: replay.w, h: replay.h + 14 });
        this._overHits.push({ id: 'win_share', x: share.x, y: share.y, w: share.w, h: share.h + 14 });
        g.restore();
    }
    drawLose(g) {
        const t = this.tl.seg(0, 0.3);
        UI.scrim(g, 0.86 * t);
        // The lose sheet is the game's main rewarded surface, so its height follows
        // whichever offers the pacing policy currently allows.
        const offerRevive = AdDirector_1.AdDirector.canOfferRevive(this.canRevive());
        const offerSkip = AdDirector_1.AdDirector.canOfferSkip() && this.level + 1 < this.meta.levelCount;
        const w = Theme_1.T.W - 110;
        const h = 372 + (offerRevive ? 112 : 0) + (offerSkip ? 88 : 0);
        const pop = Theme_1.Ease.outBack(this.tl.seg(0.06, 0.45), 1.3);
        const cy = (0, Theme_1.lerp)(-110, 14, pop);
        g.save();
        g.setAlpha(t);
        UI.panel(g, 0, cy, w, h, {
            radius: Theme_1.T.rXl,
            fill: [Theme_1.T.surfaceHi, Theme_1.T.ink2],
            border: (0, Theme_1.hex)(offerRevive ? this.pal.accent : Theme_1.T.danger, 80),
            borderWidth: 2,
            glow: offerRevive ? this.pal.accent : Theme_1.T.danger,
            glowStrength: 0.26,
            shadowBlur: 40,
            shadowY: -18,
        });
        g.text(offerRevive ? 'KEEP GOING?' : 'SO CLOSE', 0, cy + h * 0.5 - 52, {
            size: 20,
            weight: 900,
            family: cc_1.FONT_UI,
            color: (0, Theme_1.hex)(offerRevive ? this.pal.accent : Theme_1.T.danger),
            uppercase: true,
            tracking: 5,
        });
        g.text(this._loseReason, 0, cy + h * 0.5 - 112, {
            size: 40,
            weight: 900,
            family: cc_1.FONT_DISPLAY,
            color: (0, Theme_1.hex)(Theme_1.T.textHi),
            tracking: -0.6,
            maxWidth: w - 70,
            lineHeight: 48,
        });
        // Stack the actions from the bottom of the sheet upwards.
        const bw = w - 110;
        let y = cy - h * 0.5 + 46;
        const hub = {
            id: 'lose_hub',
            x: 0,
            y,
            w: bw,
            h: 58,
            label: 'Pick Another Game',
            tone: 'ghost',
        };
        UI.button(g, hub, this.pal, { pressed: this.pressedId === 'lose_hub', time: this.time });
        this._overHits.push({ id: 'lose_hub', x: 0, y, w: bw, h: 58 + 12 });
        y += 84;
        const retry = {
            id: 'lose_retry',
            x: 0,
            y,
            w: bw,
            h: 78,
            label: 'Try Again',
            icon: 'restart',
            // When a revive is on offer it becomes the hero, so retry steps back.
            tone: offerRevive ? 'neutral' : 'accent',
            pulse: !offerRevive,
        };
        UI.button(g, retry, this.pal, { pressed: this.pressedId === 'lose_retry', time: this.time });
        this._overHits.push({ id: 'lose_retry', x: 0, y, w: bw, h: 78 + 16 });
        y += 88;
        if (offerSkip) {
            const skip = {
                id: 'lose_skip',
                x: 0,
                y,
                w: bw,
                h: 70,
                label: 'Skip This Level',
                sub: 'Watch a short ad',
                icon: 'video',
                tone: 'gold',
            };
            UI.button(g, skip, this.pal, { pressed: this.pressedId === 'lose_skip', time: this.time });
            this._overHits.push({ id: 'lose_skip', x: 0, y, w: bw, h: 70 + 14 });
            y += 88;
        }
        if (offerRevive) {
            const revive = {
                id: 'lose_revive',
                x: 0,
                y: y + 10,
                w: bw,
                h: 92,
                label: 'Continue',
                sub: 'Watch a short ad',
                icon: 'video',
                tone: 'accent',
                pulse: true,
            };
            UI.button(g, revive, this.pal, { pressed: this.pressedId === 'lose_revive', time: this.time });
            this._overHits.push({ id: 'lose_revive', x: 0, y: y + 10, w: bw, h: 92 + 18 });
        }
        g.restore();
    }
    // =================================================================================
    //  Input
    // =================================================================================
    onTouchStart(x, y) {
        if (this._inputLock > 0)
            return;
        const over = UI.hitTest(this._overHits, x, y);
        if (over) {
            this.pressedId = over.id;
            SoundManager_1.SoundManager.playTap();
            haptic(10);
            return;
        }
        if (this.phase !== 'play')
            return;
        const hit = UI.hitTest(this._hits, x, y);
        if (hit) {
            this.pressedId = hit.id;
            SoundManager_1.SoundManager.playTap();
            haptic(8);
            return;
        }
        this.onFieldDown(x, y);
    }
    onTouchMove(x, y) {
        if (this.phase !== 'play' || this.pressedId)
            return;
        this.onFieldMove(x, y);
    }
    onTouchEnd(x = 0, y = 0) {
        const id = this.pressedId;
        this.pressedId = null;
        if (id) {
            const over = UI.hitTest(this._overHits, x, y);
            const hit = over || UI.hitTest(this._hits, x, y);
            // Only fire when the finger lifts on the control it pressed.
            if (hit && hit.id === id)
                this._activate(hit);
            return;
        }
        if (this.phase === 'play')
            this.onFieldUp(x, y);
    }
    _activate(hit) {
        switch (hit.id) {
            case 'back':
                this._backToHub();
                return;
            case 'sound':
                SoundManager_1.SoundManager.toggleMute();
                Progress_1.Progress.setMuted(SoundManager_1.SoundManager.muted);
                return;
            case 'restart':
                this.restart();
                return;
            case 'intro_go':
                this.phase = 'play';
                this.tl.reset();
                this.lockInput();
                Progress_1.Progress.markIntroSeen(this.meta.id);
                return;
            case 'win_next': {
                // A forced ad between levels, only if the pacing policy allows it.
                const lastLevel = this.level + 1 >= this.meta.levelCount;
                AdDirector_1.AdDirector.maybeInterstitial(lastLevel ? 'levelExit' : 'levelComplete', () => this.nextLevel(), { firstTryWin: this._firstTryWin, level: this.level });
                return;
            }
            case 'win_replay':
                this.restart();
                return;
            case 'win_share':
                TikTokSDK_1.TikTokSDK.shareToTikTok(this.meta.title, this.level + 1, this._wonStars);
                this.fx.popText(0, 120, 'Shared!', Theme_1.T.cyan, 40);
                return;
            case 'lose_retry':
                AdDirector_1.AdDirector.maybeInterstitial('levelFailed', () => this.restart(), { level: this.level });
                return;
            case 'lose_revive':
                this.watchAdFor('Watch a short ad to keep going', () => {
                    AdDirector_1.AdDirector.noteRevive();
                    this.phase = 'play';
                    this.tl.reset();
                    this.fx.clear();
                    this.lockInput(0.45);
                    this.onRevive();
                    this.fx.flash(this.pal.accent, 0.3, 0.4);
                    this.fx.popText(0, 90, 'Back in!', this.pal.accent2, 44);
                    haptic(20);
                });
                return;
            case 'lose_skip':
                this.watchAdFor('Watch a short ad to skip this level', () => {
                    // A skip is not a win: it unlocks the next level without stars.
                    Progress_1.Progress.complete(this.meta.id, this.level, 0, this.meta.levelCount);
                    this.nextLevel();
                });
                return;
            case 'lose_hub':
                this._backToHub();
                return;
        }
        if (hit.id === 'railBack' || hit.id === 'railFwd') {
            this.pageRail(hit.id === 'railFwd' ? 1 : -1);
            return;
        }
        if (hit.id.indexOf('lv') === 0 && typeof hit.data === 'number') {
            this._railAnchor = -1;
            this.loadLevel(hit.data);
            return;
        }
        this.onAction(hit.id, hit.data);
    }
    /** First level index the rail should display, given how many pips fit. */
    railFirst(win) {
        const n = this.meta.levelCount;
        const raw = this._railAnchor >= 0 ? this._railAnchor : this.level - (win >> 1);
        return Math.max(0, Math.min(Math.max(0, n - win), raw));
    }
    /** Slide the rail window by most of a page, clamped to the ends. */
    pageRail(dir) {
        const win = Math.min(this.meta.levelCount, 11);
        const first = this.railFirst(win);
        const next = first + dir * Math.max(1, win - 2);
        this._railAnchor = Math.max(0, Math.min(Math.max(0, this.meta.levelCount - win), next));
        haptic(8);
    }
    // =================================================================================
    //  Shared field helpers
    // =================================================================================
    /** Recessed play surface with an inner shadow — the "board sits in the page" look. */
    drawBoardSurface(g, cx, cy, w, h, radius = 34) {
        g.setShadow(new cc_1.Color(0, 0, 0, 170), 34, 0, -14);
        g.setFillGradient(0, cy + h * 0.5, 0, cy - h * 0.5, [
            [0, this.pal.boardHi],
            [1, this.pal.board],
        ]);
        g.roundRect(cx - w * 0.5, cy - h * 0.5, w, h, radius);
        g.fill();
        g.clearFillGradient();
        g.clearShadow();
        g.save();
        g.roundRect(cx - w * 0.5, cy - h * 0.5, w, h, radius);
        g.clip();
        g.setFillGradient(0, cy + h * 0.5, 0, cy + h * 0.5 - 26, [
            [0, 'rgba(0,0,0,0.22)'],
            [1, 'rgba(0,0,0,0)'],
        ]);
        g.rect(cx - w * 0.5, cy + h * 0.5 - 26, w, 26);
        g.fill();
        g.clearFillGradient();
        g.restore();
        g.strokeColor = new cc_1.Color(255, 255, 255, 30);
        g.lineWidth = 1.6;
        g.roundRect(cx - w * 0.5, cy - h * 0.5, w, h, radius);
        g.stroke();
    }
    get accent() {
        return (0, Theme_1.hex)(this.pal.accent);
    }
    // =================================================================================
    //  Hooks for a game that paints its own chrome
    // =================================================================================
    /**
     * A game that wants a look of its own returns 'custom' and overrides drawBackdrop
     * and drawChrome. Everything else — phases, input routing, ads, progress, FX —
     * stays shared, so a bespoke skin costs two methods rather than a second engine.
     */
    chromeStyle() {
        return 'shell';
    }
    /** Only called when chromeStyle() is 'custom'. */
    drawBackdrop(_g) { }
    /** Register a tappable region from a custom chrome. Cleared every frame. */
    addHit(h) {
        this._hits.push(h);
    }
    /** Same, but hit-tested even while a modal is up (and before field input). */
    addOverHit(h) {
        this._overHits.push(h);
    }
    /** Fires the shell's own handler for a built-in control id. */
    activateId(id, data) {
        this._activate({ id, x: 0, y: 0, w: 0, h: 0, data });
    }
}
exports.GameShell = GameShell;
/**
 * True when this build ships as a single-game TikTok package.
 *
 * There is no hub behind the game then, and TikTok documents no exit API, so the
 * back button is simply not drawn — leaving the mini game is the host's job.
 */
GameShell.soloPackage = false;
function measureW(s, size) {
    return s.length * size * 0.56;
}
/** Vibration where the device supports it — the cheapest "premium" cue on mobile. */
function haptic(pattern) {
    try {
        const nav = typeof navigator !== 'undefined' ? navigator : null;
        if (nav && typeof nav.vibrate === 'function')
            nav.vibrate(pattern);
    }
    catch (e) {
        /* unsupported */
    }
}
exports.haptic = haptic;

  };
  __alias["../core/GameShell"] = "./core/GameShell";
  __alias["./GameShell"] = "./core/GameShell";

  // === MODULE: ./core/LightShell ===
  __modules["./core/LightShell"] = function(module, exports, require) {
"use strict";
// =====================================================================================
//  LightShell — the arcade's cream-paper skin, shared by every game.
// =====================================================================================
//  The dark shell that shipped first looked like a tech demo. This one is built the way
//  the top-grossing casual puzzle games are built: warm paper, white cards, big flat
//  tiles, chunky circular controls, and a play field that takes every pixel the device
//  will give it.
//
//  Two ideas carry the whole file:
//
//  1. THE FIELD IS SIZED LAST. Every band of chrome — header, rules, strip, coach,
//     rail, dock — reserves its height first, and the field gets exactly what remains.
//     That is why nothing can ever overlap the board, on any screen shape. Bands that
//     are only decoration drop out, tallest-sacrifice-first, when a short screen would
//     otherwise squeeze the field.
//
//  2. THE STAGE HEIGHT IS NOT A CONSTANT. T.H follows the device, so every number here
//     is derived per frame rather than baked at import time.
//
//  A game supplies its palette, its three rules, its dock buttons and its field
//  painter. Everything else is inherited.
// =====================================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.haptic = exports.drawStarToken = exports.drawPaw = exports.LightShell = exports.SKINS = exports.LIGHT = exports.TRAY_PAD = void 0;
const cc_1 = require("cc");
const GameShell_1 = require("./GameShell");
Object.defineProperty(exports, "haptic", { enumerable: true, get: function () { return GameShell_1.haptic; } });
const Theme_1 = require("./Theme");
const UI = require("./UIKit");
const SoundManager_1 = require("./SoundManager");
const Progress_1 = require("./Progress");
const AdDirector_1 = require("./AdDirector");
const Art_1 = require("./Art");
// -------------------------------------------------------------------------------------
//  Tokens
// -------------------------------------------------------------------------------------
/** Padding between a field's white tray and the content inside it. */
exports.TRAY_PAD = 14;
exports.LIGHT = {
    bg: '#F7EFE9',
    bgTop: '#FDF8F4',
    bgBottom: '#F0E3DA',
    card: '#FFFFFF',
    cardEdge: '#EADCD2',
    ink: '#4A2F2A',
    inkSoft: '#A08178',
    shadow: '#8A5A49',
    orange: '#F2922F',
    orangeDeep: '#E07714',
    gold: '#FFC53D',
    mint: '#3DC98A',
    red: '#F0536B',
};
/** How many level pips the rail shows at once before it starts paging. */
const RAIL_WINDOW = 11;
exports.SKINS = {
    nyandoku: {
        accent: '#45C0AE',
        accentDeep: '#2E9A8B',
        paper: '#F7EFE9',
        paperTop: '#FDF8F4',
        paperBottom: '#F0E3DA',
        mote: '#C59C8B',
    },
    savedoge: {
        accent: '#F2922F',
        accentDeep: '#D4760F',
        paper: '#FBEFE2',
        paperTop: '#FFF8EF',
        paperBottom: '#F4E0CB',
        mote: '#D4A579',
    },
    appleworm: {
        accent: '#5FBF57',
        accentDeep: '#44993D',
        paper: '#F0F5E7',
        paperTop: '#F9FCF2',
        paperBottom: '#E3EDD5',
        mote: '#9FC08A',
    },
    parabox: {
        accent: '#6A8BF0',
        accentDeep: '#4A68CC',
        paper: '#EDF0FA',
        paperTop: '#F8FAFF',
        paperBottom: '#DFE5F4',
        mote: '#9AAAD8',
    },
    isleofglass: {
        accent: '#A878E6',
        accentDeep: '#8255C4',
        paper: '#F3EEFA',
        paperTop: '#FBF8FF',
        paperBottom: '#E7DEF4',
        mote: '#B9A2DC',
    },
};
const HEADER_H = 104;
const STARS_H = 58;
const RULES_H = 92;
const COACH_H = 62;
const RAIL_H = 46;
const DOCK_R = 58;
// =====================================================================================
//  LightShell
// =====================================================================================
class LightShell extends GameShell_1.GameShell {
    constructor() {
        super(...arguments);
        this.lay = {
            headerCY: 0,
            starsCY: 0,
            rulesCY: 0,
            stripCY: 0,
            coachCY: 0,
            padCY: 0,
            railCY: 0,
            dockCY: 0,
            dockR: DOCK_R,
            showStars: true,
            showRules: true,
            fieldCY: 0,
            fieldW: 640,
            fieldH: 640,
            board: 560,
            boardCY: 0,
        };
    }
    /** Three short rules for the strip under the header. Return [] to drop the band. */
    rules() {
        return [];
    }
    /** Up to three circular controls above the level rail. */
    dock() {
        return [];
    }
    /** A game-specific band between the rules and the field (a tracker, a key). */
    stripHeight() {
        return 0;
    }
    drawStrip(_g, _cy) { }
    /**
     * A control band reserved BELOW the field — a thumb pad, usually. Games paint it
     * themselves from `lay.padCY` so their existing hit-testing keeps working; the
     * shell only guarantees the space is there and that the field stays clear of it.
     */
    padBandHeight() {
        return 0;
    }
    /** 'square' crops the field to a square; 'fill' takes the whole band. */
    fieldAspect() {
        return 'square';
    }
    /** Draw a white tray behind the field. Physics games usually want their own. */
    wantsTray() {
        return true;
    }
    /** The headline figure beside the level number in the header. */
    headerStat() {
        return null;
    }
    /** Art key for the win sheet's hero. */
    heroArt() {
        return '';
    }
    /** Override to draw a rule's icon yourself. */
    drawRuleGlyph(g, cx, cy, s, rule) {
        UI.icon(g, rule.icon, cx, cy, s * 0.8, (0, Theme_1.hex)(this.skin().accentDeep));
    }
    // --- plumbing ---------------------------------------------------------------------
    chromeStyle() {
        return 'custom';
    }
    /**
     * Reserve every band, then give the field what is left. Bands that are decoration
     * are dropped — the star pill first, then the rules strip — rather than letting a
     * short screen shrink the one thing the player is actually looking at.
     */
    relayout() {
        const lay = this.lay;
        const topY = Theme_1.T.H * 0.5 - Theme_1.T.safeTop;
        const botY = -Theme_1.T.H * 0.5 + Theme_1.T.safeBottom;
        const stripH = this.stripHeight();
        const hasRules = this.rules().length > 0;
        const hasDock = this.dock().length > 0;
        const maxW = Theme_1.T.W - 40 - exports.TRAY_PAD * 2;
        lay.dockR = DOCK_R;
        lay.dockCY = botY + DOCK_R + 46;
        lay.railCY = hasDock ? lay.dockCY + DOCK_R + 16 + RAIL_H * 0.5 : botY + 30 + RAIL_H * 0.5;
        lay.coachCY = lay.railCY + RAIL_H * 0.5 + 14 + COACH_H * 0.5;
        const padBand = this.padBandHeight();
        lay.padCY = lay.coachCY + COACH_H * 0.5 + 12 + padBand * 0.5;
        const bandBot = padBand > 0 ? lay.padCY + padBand * 0.5 + 14 : lay.coachCY + COACH_H * 0.5 + 14;
        const place = (withStars, withRules) => {
            const headerCY = topY - HEADER_H * 0.5;
            const starsCY = headerCY - HEADER_H * 0.5 - 6 - STARS_H * 0.5;
            const afterStars = withStars ? starsCY - STARS_H * 0.5 : headerCY - HEADER_H * 0.5;
            const rulesCY = afterStars - 12 - RULES_H * 0.5;
            const afterRules = withRules ? rulesCY - RULES_H * 0.5 : afterStars;
            const stripCY = afterRules - 10 - stripH * 0.5;
            const afterStrip = stripH > 0 ? stripCY - stripH * 0.5 : afterRules;
            return { headerCY, starsCY, rulesCY, stripCY, bandTop: afterStrip - 16 };
        };
        let slot = place(true, hasRules);
        lay.showStars = true;
        lay.showRules = hasRules;
        // Square boards are the ones that suffer: they can only use as much height as
        // they have width, so buy them room by shedding decoration.
        const want = this.fieldAspect() === 'square' ? maxW * 0.88 : maxW * 0.7;
        if (slot.bandTop - bandBot < want) {
            lay.showStars = false;
            slot = place(false, hasRules);
            if (hasRules && slot.bandTop - bandBot < want * 0.76) {
                lay.showRules = false;
                slot = place(false, false);
            }
        }
        lay.headerCY = slot.headerCY;
        lay.starsCY = slot.starsCY;
        lay.rulesCY = slot.rulesCY;
        lay.stripCY = slot.stripCY;
        const band = Math.max(220, slot.bandTop - bandBot);
        const pad = this.wantsTray() ? exports.TRAY_PAD : 0;
        if (this.fieldAspect() === 'square') {
            lay.board = Math.min(maxW, band - pad * 2);
            const slack = band - lay.board - pad * 2;
            // Sit the board slightly high in its band: the lower third of a phone
            // screen is where the thumb rests, and a board that reaches into it is
            // covered by the player's own hand.
            lay.boardCY = slot.bandTop - pad - lay.board * 0.5 - slack * 0.4;
            lay.fieldW = lay.board;
            lay.fieldH = lay.board;
            lay.fieldCY = lay.boardCY;
        }
        else {
            lay.fieldW = maxW;
            lay.fieldH = band - pad * 2;
            lay.fieldCY = (slot.bandTop + bandBot) * 0.5;
            lay.board = Math.min(lay.fieldW, lay.fieldH);
            lay.boardCY = lay.fieldCY;
        }
    }
    // --- backdrop ---------------------------------------------------------------------
    drawBackdrop(g) {
        this.relayout();
        const sk = this.skin();
        g.setFillGradient(0, Theme_1.T.H * 0.5, 0, -Theme_1.T.H * 0.5, [
            [0, sk.paperTop],
            [0.42, sk.paper],
            [1, sk.paperBottom],
        ]);
        g.rect(-Theme_1.T.W * 0.5, -Theme_1.T.H * 0.5, Theme_1.T.W, Theme_1.T.H);
        g.fill();
        g.clearFillGradient();
        // Key art, full-bleed and almost invisible, veiled again by the paper so it
        // never shows an edge. It reads as texture rather than a photograph.
        const plate = 'key_' + this.meta.id;
        if ((0, Art_1.hasArt)(plate)) {
            const drift = Math.sin(this.time * 0.2) * 12;
            g.save();
            g.setAlpha(0.085);
            g.image(plate, 0, drift, Theme_1.T.W, Theme_1.T.H, { cover: true });
            g.restore();
            g.setFillGradient(0, Theme_1.T.H * 0.5, 0, -Theme_1.T.H * 0.5, [
                [0, (0, Theme_1.rgba)(sk.paperTop, 0.9)],
                [0.36, (0, Theme_1.rgba)(sk.paper, 0.62)],
                [0.72, (0, Theme_1.rgba)(sk.paper, 0.8)],
                [1, (0, Theme_1.rgba)(sk.paperBottom, 0.96)],
            ]);
            g.rect(-Theme_1.T.W * 0.5, -Theme_1.T.H * 0.5, Theme_1.T.W, Theme_1.T.H);
            g.fill();
            g.clearFillGradient();
        }
        for (let i = 0; i < 9; i++) {
            const n = i * 7.13;
            const bx = (((Math.sin(n) * 43758.5453) % 1) * Theme_1.T.W) - Theme_1.T.W * 0.5;
            const span = Theme_1.T.H + 220;
            const by = (((Math.cos(n) * 24634.6345) % 1) * span + this.time * (10 + (i % 3) * 5)) % span;
            drawPaw(g, bx, by - Theme_1.T.H * 0.5 - 110, 9 + (i % 4) * 3, (0, Theme_1.hex)(sk.mote, 26 + (i % 3) * 8), n);
        }
    }
    // --- chrome -----------------------------------------------------------------------
    drawChrome(g) {
        this.relayout();
        const lay = this.lay;
        this.drawHeader(g, lay.headerCY);
        if (lay.showStars)
            this.drawStarPill(g, lay.starsCY);
        if (lay.showRules)
            this.drawRuleStrip(g, lay.rulesCY);
        if (this.stripHeight() > 0)
            this.drawStrip(g, lay.stripCY);
        this.drawCoach(g, lay.coachCY);
        this.drawLevelRail(g, lay.railCY);
        if (this.dock().length)
            this.drawDock(g, lay.dockCY, lay.dockR);
    }
    /** A white circle with a soft shadow — every control in this skin is one of these. */
    softCircleButton(g, id, x, y, r, draw, o = {}) {
        const pressed = this.pressedId === id;
        const k = pressed ? 0.93 : 1;
        const rr = r * k;
        g.setShadow((0, Theme_1.hex)(exports.LIGHT.shadow, 60), 16, 0, -5);
        g.fillColor = (0, Theme_1.hex)(o.tint || exports.LIGHT.card, o.dim ? 150 : 255);
        g.circle(x, y, rr);
        g.fill();
        g.clearShadow();
        g.strokeColor = (0, Theme_1.hex)(exports.LIGHT.cardEdge, 170);
        g.lineWidth = 1.5;
        g.circle(x, y, rr);
        g.stroke();
        draw(x, y, k);
        if (o.badge) {
            const bx = x + rr * 0.72;
            const by = y + rr * 0.72;
            g.setShadow((0, Theme_1.hex)(exports.LIGHT.shadow, 70), 8, 0, -2);
            g.fillColor = (0, Theme_1.hex)(o.badgeColor || exports.LIGHT.red);
            g.circle(bx, by, 19);
            g.fill();
            g.clearShadow();
            g.strokeColor = (0, Theme_1.hex)('#FFFFFF', 235);
            g.lineWidth = 3;
            g.circle(bx, by, 19);
            g.stroke();
            g.text(o.badge, bx, by - 1, { size: 22, weight: 1000, family: cc_1.FONT_DISPLAY, color: (0, Theme_1.hex)('#FFFFFF') });
        }
        this.addHit({ id, x, y, w: r * 2.2, h: r * 2.2 });
    }
    drawHeader(g, cy) {
        const edge = Theme_1.T.W * 0.5 - 26;
        if (!GameShell_1.GameShell.soloPackage) {
            this.softCircleButton(g, 'back', -edge + 34, cy, 34, (x, y) => {
                UI.icon(g, 'back', x, y, 30, (0, Theme_1.hex)(exports.LIGHT.ink));
            });
        }
        this.softCircleButton(g, 'sound', edge - 32, cy, 32, (x, y) => {
            UI.icon(g, SoundManager_1.SoundManager.muted ? 'mute' : 'sound', x, y, 28, (0, Theme_1.hex)(exports.LIGHT.ink));
        });
        this.softCircleButton(g, 'restart', edge - 32 - 76, cy, 32, (x, y) => {
            UI.icon(g, 'restart', x, y, 28, (0, Theme_1.hex)(exports.LIGHT.ink));
        });
        const extra = this.headerStat();
        const cols = [['Level', String(this.level + 1)]];
        if (extra)
            cols.push([extra.label, extra.value]);
        for (let i = 0; i < cols.length; i++) {
            const cx = cols.length === 1 ? 0 : (i - 0.5) * 168;
            g.text(cols[i][0], cx, cy + 22, { size: 21, weight: 800, family: cc_1.FONT_UI, color: (0, Theme_1.hex)(exports.LIGHT.inkSoft) });
            g.text(cols[i][1], cx, cy - 16, {
                size: 40,
                weight: 1000,
                family: cc_1.FONT_DISPLAY,
                color: (0, Theme_1.hex)(exports.LIGHT.ink),
                tracking: -0.5,
                maxWidth: 158,
            });
        }
    }
    drawStarPill(g, cy) {
        const earned = Progress_1.Progress.stars(this.meta.id)[this.level] || 0;
        const w = 184;
        const h = 58;
        g.setShadow((0, Theme_1.hex)(exports.LIGHT.shadow, 34), 12, 0, -3);
        g.fillColor = (0, Theme_1.hex)(exports.LIGHT.card);
        g.roundRect(-w * 0.5, cy - h * 0.5, w, h, h * 0.5);
        g.fill();
        g.clearShadow();
        g.strokeColor = (0, Theme_1.hex)(exports.LIGHT.cardEdge, 220);
        g.lineWidth = 1.6;
        g.roundRect(-w * 0.5, cy - h * 0.5, w, h, h * 0.5);
        g.stroke();
        for (let i = 0; i < 3; i++) {
            const active = i < earned;
            const bob = active ? Math.sin(this.time * 2.4 + i * 0.7) * 2.4 : 0;
            drawStarToken(g, (i - 1) * 52, cy + bob, 40, active);
        }
    }
    drawRuleStrip(g, cy) {
        const rules = this.rules();
        if (!rules.length)
            return;
        const w = Theme_1.T.W - 40;
        const h = RULES_H;
        g.setShadow((0, Theme_1.hex)(exports.LIGHT.shadow, 38), 14, 0, -4);
        g.fillColor = (0, Theme_1.hex)(exports.LIGHT.card);
        g.roundRect(-w * 0.5, cy - h * 0.5, w, h, 24);
        g.fill();
        g.clearShadow();
        const colW = w / rules.length;
        for (let i = 0; i < rules.length; i++) {
            const cx = -w * 0.5 + colW * (i + 0.5);
            if (i > 0) {
                g.fillColor = (0, Theme_1.hex)(exports.LIGHT.cardEdge, 190);
                g.rect(-w * 0.5 + colW * i - 0.75, cy - h * 0.28, 1.5, h * 0.56);
                g.fill();
            }
            this.drawRuleGlyph(g, cx - colW * 0.5 + 34, cy, 36, rules[i]);
            g.text(rules[i].a, cx + 18, cy + 15, {
                size: 20,
                weight: 800,
                family: cc_1.FONT_UI,
                color: (0, Theme_1.hex)(exports.LIGHT.ink),
                maxWidth: colW - 72,
            });
            g.text(rules[i].b, cx + 18, cy - 14, {
                size: 20,
                weight: 800,
                family: cc_1.FONT_UI,
                color: (0, Theme_1.hex)(exports.LIGHT.ink),
                maxWidth: colW - 72,
            });
        }
    }
    /**
     * The one line of coaching, in the band reserved above the level rail. It reacts
     * to the board state, so it is advice rather than wallpaper.
     */
    coachUrgent() {
        return false;
    }
    drawCoach(g, cy) {
        const urgent = this.coachUrgent();
        const text = this.hintText();
        const w = Math.min(Theme_1.T.W - 60, 92 + text.length * 12.6);
        const h = COACH_H;
        g.setShadow((0, Theme_1.hex)(exports.LIGHT.shadow, urgent ? 60 : 30), 14, 0, -4);
        g.setFillGradient(0, cy + h * 0.5, 0, cy - h * 0.5, [
            [0, urgent ? '#FFF1F3' : exports.LIGHT.card],
            [1, urgent ? '#FFE2E7' : exports.LIGHT.card],
        ]);
        g.roundRect(-w * 0.5, cy - h * 0.5, w, h, h * 0.5);
        g.fill();
        g.clearFillGradient();
        g.clearShadow();
        g.strokeColor = (0, Theme_1.hex)(urgent ? exports.LIGHT.red : exports.LIGHT.cardEdge, urgent ? 150 : 210);
        g.lineWidth = 1.8;
        g.roundRect(-w * 0.5, cy - h * 0.5, w, h, h * 0.5);
        g.stroke();
        const pulse = urgent ? 0.72 + Math.sin(this.time * 5) * 0.28 : 1;
        UI.icon(g, urgent ? 'close' : 'finger', -w * 0.5 + 34, cy, 26, (0, Theme_1.hex)(urgent ? exports.LIGHT.red : this.skin().accentDeep, Math.round(255 * pulse)));
        g.text(text, 17, cy - 1, {
            size: 23,
            weight: 800,
            family: cc_1.FONT_UI,
            color: (0, Theme_1.hex)(urgent ? '#B03048' : exports.LIGHT.ink),
            maxWidth: w - 76,
        });
    }
    /**
     * The level strip. A fifty-level game cannot fit fifty pips across a phone, so the
     * rail shows a window around where the player is and pages with the two chevrons.
     */
    drawLevelRail(g, cy) {
        const sk = this.skin();
        const n = this.meta.levelCount;
        const unlocked = Progress_1.Progress.unlocked(this.meta.id);
        const stars = Progress_1.Progress.stars(this.meta.id);
        const win = Math.min(n, RAIL_WINDOW);
        const paged = n > win;
        const first = this.railFirst(win);
        const step = Math.min(56, (Theme_1.T.W - (paged ? 170 : 60)) / win);
        const total = win * step;
        for (let k = 0; k < win; k++) {
            const i = first + k;
            const x = -total * 0.5 + step * (k + 0.5);
            const here = i === this.level;
            const open = i <= unlocked || here;
            const r = here ? 23 : 19;
            if (here) {
                g.setShadow((0, Theme_1.hex)(sk.accent, 110), 14, 0, -3);
                g.fillColor = (0, Theme_1.hex)(sk.accent);
            }
            else {
                g.fillColor = (0, Theme_1.hex)(open ? exports.LIGHT.card : exports.LIGHT.cardEdge, open ? 255 : 200);
            }
            g.circle(x, cy, r);
            g.fill();
            g.clearShadow();
            if (!here) {
                g.strokeColor = (0, Theme_1.hex)(exports.LIGHT.cardEdge, 220);
                g.lineWidth = 1.4;
                g.circle(x, cy, r);
                g.stroke();
            }
            if (open) {
                g.text(String(i + 1), x, cy - 1, {
                    size: here ? 22 : step < 46 ? 17 : 20,
                    weight: 1000,
                    family: cc_1.FONT_DISPLAY,
                    color: (0, Theme_1.hex)(here ? '#FFFFFF' : exports.LIGHT.inkSoft),
                });
                if ((stars[i] || 0) > 0 && !here) {
                    g.fillColor = (0, Theme_1.hex)(exports.LIGHT.gold);
                    g.circle(x + 13, cy + 13, 5);
                    g.fill();
                }
                this.addHit({ id: 'lv' + i, x, y: cy, w: step, h: 54, data: i });
            }
            else {
                UI.icon(g, 'lock', x, cy, 18, (0, Theme_1.hex)(exports.LIGHT.inkSoft, 170));
            }
        }
        if (!paged)
            return;
        this.railChevron(g, -total * 0.5 - 40, cy, 'railBack', first > 0, '\u2039', first + 1);
        this.railChevron(g, total * 0.5 + 40, cy, 'railFwd', first + win < n, '\u203A', n - (first + win));
    }
    /** One end of the paged rail: a disc with a chevron, dimmed when there is no more rail. */
    railChevron(g, x, cy, id, live, glyph, remaining) {
        g.fillColor = (0, Theme_1.hex)(exports.LIGHT.card, live ? 255 : 120);
        g.circle(x, cy, 20);
        g.fill();
        g.strokeColor = (0, Theme_1.hex)(exports.LIGHT.cardEdge, live ? 220 : 120);
        g.lineWidth = 1.4;
        g.circle(x, cy, 20);
        g.stroke();
        g.text(glyph, x, cy + 1, {
            size: 28,
            weight: 900,
            family: cc_1.FONT_DISPLAY,
            color: (0, Theme_1.hex)(exports.LIGHT.ink, live ? 230 : 90),
        });
        if (live) {
            g.text(String(remaining), x, cy - 30, {
                size: 14,
                weight: 800,
                family: cc_1.FONT_UI,
                color: (0, Theme_1.hex)(exports.LIGHT.inkSoft, 180),
            });
            this.addHit({ id, x, y: cy, w: 48, h: 54 });
        }
    }
    drawDock(g, cy, r) {
        const sk = this.skin();
        const items = this.dock();
        const gap = items.length > 2 ? 150 : 170;
        const start = -((items.length - 1) * gap) * 0.5;
        for (let i = 0; i < items.length; i++) {
            const it = items[i];
            const x = start + i * gap;
            const accent = it.tone === 'accent';
            const gold = it.tone === 'gold';
            this.softCircleButton(g, it.id, x, cy, r, (bx, by, k) => {
                if (gold) {
                    const glow = 0.5 + Math.sin(this.time * 2.6) * 0.5;
                    g.save();
                    g.setBlend('lighter');
                    g.setFillRadial(bx, by, 0, r * 1.25, [
                        [0, (0, Theme_1.rgba)(exports.LIGHT.gold, 0.26 + glow * 0.2)],
                        [1, (0, Theme_1.rgba)(exports.LIGHT.gold, 0)],
                    ]);
                    g.circle(bx, by, r * 1.25);
                    g.fill();
                    g.clearFillGradient();
                    g.restore();
                }
                UI.icon(g, it.icon, bx, by, 46 * k, (0, Theme_1.hex)(gold ? exports.LIGHT.gold : accent ? '#FFFFFF' : exports.LIGHT.ink, it.dim ? 110 : 255));
            }, { badge: it.badge, badgeColor: it.badgeColor, dim: it.dim, tint: accent ? sk.accent : exports.LIGHT.card });
            g.text(it.label, x, cy - r - 20, {
                size: 16,
                weight: 900,
                family: cc_1.FONT_UI,
                color: (0, Theme_1.hex)(exports.LIGHT.inkSoft),
                tracking: 1.4,
                uppercase: true,
                maxWidth: gap - 14,
            });
        }
    }
    /** Recessed white tray behind a field. */
    drawTray(g, cx, cy, w, h, radius = 30) {
        g.setShadow((0, Theme_1.hex)(exports.LIGHT.shadow, 70), 30, 0, -12);
        g.fillColor = (0, Theme_1.hex)(exports.LIGHT.card);
        g.roundRect(cx - w * 0.5 - exports.TRAY_PAD, cy - h * 0.5 - exports.TRAY_PAD, w + exports.TRAY_PAD * 2, h + exports.TRAY_PAD * 2, radius);
        g.fill();
        g.clearShadow();
    }
    // --- overlays -----------------------------------------------------------------------
    pillButton(g, id, x, y, w, h, label, primary) {
        const pressed = this.pressedId === id;
        const lip = h * 0.14;
        const sink = pressed ? lip * 0.7 : 0;
        g.fillColor = (0, Theme_1.hex)(primary ? '#A9510A' : '#C6B3A8');
        g.roundRect(x - w * 0.5, y - h * 0.5 - lip + sink, w, h + lip, h * 0.5);
        g.fill();
        g.setFillGradient(0, y + h * 0.5 - sink, 0, y - h * 0.5 - sink, [
            [0, primary ? exports.LIGHT.orange : exports.LIGHT.card],
            [1, primary ? exports.LIGHT.orangeDeep : exports.LIGHT.cardEdge],
        ]);
        g.roundRect(x - w * 0.5, y - h * 0.5 - sink, w, h, h * 0.5);
        g.fill();
        g.clearFillGradient();
        g.text(label, x, y - sink - 2, {
            size: 34,
            weight: 1000,
            family: cc_1.FONT_DISPLAY,
            color: (0, Theme_1.hex)(primary ? '#FFFFFF' : exports.LIGHT.ink),
            maxWidth: w - 54,
        });
        this.addOverHit({ id, x, y, w, h: h + 22 });
    }
    smallGhost(g, id, x, y, label) {
        const w = 170;
        const h = 62;
        g.fillColor = (0, Theme_1.hex)('#FFFFFF', this.pressedId === id ? 48 : 28);
        g.roundRect(x - w * 0.5, y - h * 0.5, w, h, h * 0.5);
        g.fill();
        g.strokeColor = (0, Theme_1.hex)('#FFFFFF', 70);
        g.lineWidth = 1.6;
        g.roundRect(x - w * 0.5, y - h * 0.5, w, h, h * 0.5);
        g.stroke();
        g.text(label, x, y - 1, { size: 24, weight: 900, family: cc_1.FONT_UI, color: (0, Theme_1.hex)('#FFF3E6', 235) });
        this.addOverHit({ id, x, y, w, h: h + 16 });
    }
    drawIntro(g) {
        const t = this.tl.seg(0, 0.4, Theme_1.Ease.outCubic);
        g.fillColor = (0, Theme_1.hex)('#2A1C19', Math.round(205 * t));
        g.rect(-Theme_1.T.W * 0.5, -Theme_1.T.H * 0.5, Theme_1.T.W, Theme_1.T.H);
        g.fill();
        const w = Theme_1.T.W - 96;
        const h = 560;
        const pop = Theme_1.Ease.outBack(this.tl.seg(0.08, 0.5), 1.5);
        const cy = (0, Theme_1.lerp)(-90, 20, pop);
        g.save();
        g.setAlpha(t);
        g.setShadow((0, Theme_1.hex)('#000000', 140), 40, 0, -16);
        g.fillColor = (0, Theme_1.hex)(exports.LIGHT.card);
        g.roundRect(-w * 0.5, cy - h * 0.5, w, h, 38);
        g.fill();
        g.clearShadow();
        g.text('HOW TO PLAY', 0, cy + h * 0.5 - 56, {
            size: 20,
            weight: 900,
            family: cc_1.FONT_UI,
            color: (0, Theme_1.hex)(exports.LIGHT.orange),
            uppercase: true,
            tracking: 4,
        });
        g.text(this.meta.title, 0, cy + h * 0.5 - 108, {
            size: 50,
            weight: 1000,
            family: cc_1.FONT_DISPLAY,
            color: (0, Theme_1.hex)(exports.LIGHT.ink),
            tracking: -0.6,
            maxWidth: w - 70,
        });
        const rows = this.meta.howTo;
        for (let i = 0; i < rows.length; i++) {
            const ry = cy + h * 0.5 - 196 - i * 80;
            const rt = (0, Theme_1.clamp01)(this.tl.seg(0.22 + i * 0.09, 0.4));
            g.save();
            g.setAlpha(rt);
            g.fillColor = (0, Theme_1.hex)(this.skin().paper);
            g.roundRect(-(w - 70) * 0.5, ry - 32, w - 70, 64, 20);
            g.fill();
            g.fillColor = (0, Theme_1.hex)(exports.LIGHT.orange);
            g.circle(-(w - 70) * 0.5 + 38, ry, 18);
            g.fill();
            g.text(String(i + 1), -(w - 70) * 0.5 + 38, ry - 1, {
                size: 22,
                weight: 1000,
                family: cc_1.FONT_DISPLAY,
                color: (0, Theme_1.hex)('#FFFFFF'),
            });
            g.text(rows[i], 38, ry, {
                size: 23,
                weight: 800,
                family: cc_1.FONT_UI,
                color: (0, Theme_1.hex)(exports.LIGHT.ink),
                align: 'center',
                maxWidth: w - 190,
                lineHeight: 28,
            });
            g.restore();
        }
        this.pillButton(g, 'intro_go', 0, cy - h * 0.5 + 66, w - 150, 88, "Let's go", true);
        g.restore();
    }
    /** Words for the win headline, cycled by level so replaying does not feel canned. */
    winWords() {
        return ['Bravo!', 'Perfect!', 'Awesome!', 'Nailed it!', 'Too easy!', 'Legend!'];
    }
    drawWin(g) {
        const t = this.tl.seg(0, 0.35);
        g.fillColor = (0, Theme_1.hex)('#160F0C', Math.round(243 * t));
        g.rect(-Theme_1.T.W * 0.5, -Theme_1.T.H * 0.5, Theme_1.T.W, Theme_1.T.H);
        g.fill();
        const pop = Theme_1.Ease.outBack(this.tl.seg(0.1, 0.55), 1.5);
        const last = this.level + 1 >= this.meta.levelCount;
        // Laid out as fractions of the usable height, so the sheet fits a short phone
        // and a tall one without a scroll or a squeeze.
        const top = Theme_1.T.H * 0.5 - Theme_1.T.safeTop;
        const bot = -Theme_1.T.H * 0.5 + Theme_1.T.safeBottom;
        const band = top - bot;
        const titleY = top - band * 0.105;
        const heroY = top - band * 0.33;
        const heroS = band * 0.3;
        const blurbY = top - band * 0.57;
        const starsY = top - band * 0.68;
        const btnY = bot + band * 0.19;
        const ghostY = bot + band * 0.1;
        g.save();
        g.setAlpha(t);
        const rt = this.tl.seg(0.18, 0.7);
        g.save();
        g.setBlend('lighter');
        g.setAlpha(0.11 * rt);
        for (let i = 0; i < 24; i++) {
            const a = (i / 24) * Math.PI * 2 + this.time * 0.18;
            const breathe = 0.78 + Math.sin(this.time * 1.4 + i * 0.9) * 0.22;
            const len = Theme_1.T.H * 0.56 * (i % 2 ? 0.6 : 1) * breathe * rt;
            g.fillColor = (0, Theme_1.hex)(i % 2 ? '#FFE2A0' : '#FFB357', 255);
            g.moveTo(0, heroY);
            g.lineTo(Math.cos(a) * len, heroY + Math.sin(a) * len);
            g.lineTo(Math.cos(a + 0.034) * len, heroY + Math.sin(a + 0.034) * len);
            g.close();
            g.fill();
        }
        g.restore();
        g.save();
        g.setBlend('lighter');
        g.setFillRadial(0, heroY, 0, heroS * 1.3 * rt, [
            [0, (0, Theme_1.rgba)('#FFC53D', 0.5)],
            [0.5, (0, Theme_1.rgba)('#FF8A2C', 0.18)],
            [1, (0, Theme_1.rgba)('#FF8A2C', 0)],
        ]);
        g.circle(0, heroY, heroS * 1.3 * rt);
        g.fill();
        g.clearFillGradient();
        g.restore();
        const settle = 1 + Math.sin(this.time * 1.9) * 0.018;
        const hs = heroS * pop * settle;
        const hero = this.heroArt();
        g.fillColor = (0, Theme_1.hex)('#000000', 90);
        g.ellipse(0, heroY - hs * 0.5, hs * 0.34, hs * 0.05);
        g.fill();
        if (hero && (0, Art_1.hasArt)(hero)) {
            g.image(hero, 0, heroY, hs * (2 - settle), hs * settle, { rotation: Math.sin(this.time * 1.3) * 0.03 });
        }
        else {
            g.fillColor = (0, Theme_1.hex)(exports.LIGHT.gold, 220);
            g.circle(0, heroY, hs * 0.34);
            g.fill();
            UI.icon(g, 'trophy', 0, heroY, hs * 0.4, (0, Theme_1.hex)('#FFFFFF'));
        }
        const words = this.winWords();
        const titlePop = Theme_1.Ease.outBack(this.tl.seg(0.26, 0.45), 2.4);
        g.text(words[this.level % words.length], 0, titleY, {
            size: 82 * (0.82 + titlePop * 0.18),
            weight: 1000,
            family: cc_1.FONT_DISPLAY,
            gradient: [
                [0, '#FFF0BE'],
                [0.48, '#FFC53D'],
                [1, '#EF821A'],
            ],
            outline: (0, Theme_1.hex)('#4A2109'),
            outlineWidth: 9,
            tracking: -1,
            maxWidth: Theme_1.T.W - 120,
        });
        g.text(this.winBlurb(), 0, blurbY, {
            size: 28,
            weight: 800,
            family: cc_1.FONT_UI,
            color: (0, Theme_1.hex)('#FFE6CF', 230),
            maxWidth: Theme_1.T.W - 150,
        });
        const earned = Progress_1.Progress.stars(this.meta.id)[this.level] || 0;
        for (let i = 0; i < 3; i++) {
            const st = (0, Theme_1.clamp01)(this.tl.seg(0.45 + i * 0.15, 0.36));
            const sp = Theme_1.Ease.outBack(st, 2.8);
            const active = i < earned;
            const bob = active ? Math.sin(this.time * 3 + i) * 4 : 0;
            if (active && st > 0.98) {
                g.save();
                g.setBlend('lighter');
                g.setFillRadial((i - 1) * 104, starsY, 0, 62, [
                    [0, (0, Theme_1.rgba)('#FFC53D', 0.4)],
                    [1, (0, Theme_1.rgba)('#FFC53D', 0)],
                ]);
                g.circle((i - 1) * 104, starsY, 62);
                g.fill();
                g.clearFillGradient();
                g.restore();
            }
            drawStarToken(g, (i - 1) * 104, starsY + bob, 86 * sp, active);
        }
        this.pillButton(g, 'win_next', 0, btnY, Theme_1.T.W - 170, 96, last ? 'Back to arcade' : 'Level ' + (this.level + 2), true);
        this.smallGhost(g, 'win_replay', -98, ghostY, 'Replay');
        this.smallGhost(g, 'win_share', 98, ghostY, 'Share');
        g.restore();
    }
    drawLose(g) {
        const t = this.tl.seg(0, 0.35);
        g.fillColor = (0, Theme_1.hex)('#160F0C', Math.round(238 * t));
        g.rect(-Theme_1.T.W * 0.5, -Theme_1.T.H * 0.5, Theme_1.T.W, Theme_1.T.H);
        g.fill();
        const top = Theme_1.T.H * 0.5 - Theme_1.T.safeTop;
        const bot = -Theme_1.T.H * 0.5 + Theme_1.T.safeBottom;
        const band = top - bot;
        const pop = Theme_1.Ease.outBack(this.tl.seg(0.1, 0.5), 1.5);
        const offerRevive = AdDirector_1.AdDirector.canOfferRevive(this.canRevive());
        const offerSkip = AdDirector_1.AdDirector.canOfferSkip() && this.level + 1 < this.meta.levelCount;
        g.save();
        g.setAlpha(t);
        const titleY = top - band * 0.16;
        g.text('Oh no!', 0, titleY, {
            size: 76 * (0.85 + pop * 0.15),
            weight: 1000,
            family: cc_1.FONT_DISPLAY,
            gradient: [
                [0, '#FFD2DA'],
                [1, '#F0536B'],
            ],
            outline: (0, Theme_1.hex)('#4A1018'),
            outlineWidth: 8,
            maxWidth: Theme_1.T.W - 120,
        });
        g.text(this.loseReason, 0, titleY - 86, {
            size: 27,
            weight: 800,
            family: cc_1.FONT_UI,
            color: (0, Theme_1.hex)('#FFE0E5', 220),
            maxWidth: Theme_1.T.W - 140,
        });
        const hero = this.heroArt();
        const hs = band * 0.22 * pop;
        if (hero && (0, Art_1.hasArt)(hero)) {
            g.save();
            g.setAlpha(0.72);
            g.image(hero, 0, titleY - 260, hs, hs, { rotation: 0.16 + Math.sin(this.time * 1.4) * 0.03 });
            g.restore();
        }
        // Stack from the bottom so the offers never collide with the primary action.
        let y = bot + band * 0.12;
        this.smallGhost(g, 'lose_hub', 0, y, 'Arcade');
        y += 104;
        if (offerSkip) {
            this.pillButton(g, 'lose_skip', 0, y, Theme_1.T.W - 210, 80, 'Skip level · Ad', false);
            y += 104;
        }
        if (offerRevive) {
            this.pillButton(g, 'lose_revive', 0, y, Theme_1.T.W - 170, 96, 'Continue · Watch ad', true);
            y += 116;
            this.smallGhost(g, 'lose_retry', 0, y, 'Try again');
        }
        else {
            this.pillButton(g, 'lose_retry', 0, y, Theme_1.T.W - 170, 96, 'Try again', true);
        }
        g.restore();
    }
    /** Exposed so the lose sheet can print it. */
    get loseReason() {
        return this._loseReason || 'Give it another go';
    }
}
exports.LightShell = LightShell;
// -------------------------------------------------------------------------------------
//  Shared glyphs
// -------------------------------------------------------------------------------------
/** A drifting paw print in the paper backdrop. */
function drawPaw(g, cx, cy, s, col, seed) {
    g.fillColor = col;
    g.ellipse(cx, cy - s * 0.18, s * 0.5, s * 0.42);
    g.fill();
    for (let i = 0; i < 4; i++) {
        const a = -0.95 + i * 0.63 + Math.sin(seed) * 0.1;
        g.circle(cx + Math.sin(a) * s * 0.52, cy + s * 0.44 + Math.cos(a) * s * 0.1, s * 0.17);
        g.fill();
    }
}
exports.drawPaw = drawPaw;
/** The taiyaki fish that stands in for a star. Drawn nose-right, tail-left. */
function drawStarToken(g, cx, cy, s, active) {
    const body = active ? '#F4A52C' : '#ECE1D6';
    const lift = active ? '#FFD87E' : '#F7F1EA';
    const edge = active ? '#CE7410' : '#DCCDBF';
    g.fillColor = (0, Theme_1.hex)(edge);
    g.moveTo(cx - s * 0.1, cy);
    g.lineTo(cx - s * 0.5, cy + s * 0.3);
    g.lineTo(cx - s * 0.38, cy);
    g.lineTo(cx - s * 0.5, cy - s * 0.3);
    g.close();
    g.fill();
    g.fillColor = (0, Theme_1.hex)(edge);
    g.moveTo(cx - s * 0.05, cy + s * 0.17);
    g.lineTo(cx + s * 0.03, cy + s * 0.36);
    g.lineTo(cx + s * 0.16, cy + s * 0.16);
    g.close();
    g.fill();
    g.setFillGradient(0, cy + s * 0.26, 0, cy - s * 0.26, [
        [0, lift],
        [1, body],
    ]);
    g.moveTo(cx + s * 0.44, cy);
    g.quadraticCurveTo(cx + s * 0.18, cy + s * 0.27, cx - s * 0.14, cy + s * 0.16);
    g.quadraticCurveTo(cx - s * 0.26, cy, cx - s * 0.14, cy - s * 0.16);
    g.quadraticCurveTo(cx + s * 0.18, cy - s * 0.27, cx + s * 0.44, cy);
    g.close();
    g.fill();
    g.clearFillGradient();
    g.strokeColor = (0, Theme_1.hex)(edge, active ? 190 : 160);
    g.lineWidth = Math.max(1.2, s * 0.026);
    g.arc(cx + s * 0.02, cy, s * 0.15, -1.15, 1.15, false);
    g.stroke();
    if (active) {
        g.fillColor = (0, Theme_1.hex)('#4A2F2A');
        g.circle(cx + s * 0.24, cy + s * 0.05, s * 0.048);
        g.fill();
        g.fillColor = (0, Theme_1.hex)('#FFFFFF', 220);
        g.circle(cx + s * 0.255, cy + s * 0.07, s * 0.018);
        g.fill();
    }
}
exports.drawStarToken = drawStarToken;

  };
  __alias["../core/LightShell"] = "./core/LightShell";
  __alias["./LightShell"] = "./core/LightShell";

  // === MODULE: ./games/NyandokuGame ===
  __modules["./games/NyandokuGame"] = function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NyandokuGame = exports.NYANDOKU_LEVELS = exports.CellState = void 0;
const CocosUIHelpers_1 = require("../core/CocosUIHelpers");
const SoundManager_1 = require("../core/SoundManager");
const GameShell_1 = require("../core/GameShell");
const LightShell_1 = require("../core/LightShell");
const Theme_1 = require("../core/Theme");
const UI = require("../core/UIKit");
const Progress_1 = require("../core/Progress");
const Art_1 = require("../core/Art");
var CellState;
(function (CellState) {
    CellState[CellState["EMPTY"] = 0] = "EMPTY";
    CellState[CellState["MARK_X"] = 1] = "MARK_X";
    CellState[CellState["CAT"] = 2] = "CAT";
    CellState[CellState["ERROR_X"] = 3] = "ERROR_X";
})(CellState = exports.CellState || (exports.CellState = {}));
/**
 * The fifty-level ladder. Generated and proven by tools/puzzle/generate.py and checked by
 * tools/test_levels.py: every board's colour regions are connected and every board has
 * EXACTLY ONE legal solution. Edit it with the generator, not by hand.
 */
exports.NYANDOKU_LEVELS = [
    {
        id: 1,
        title: 'Windowsill Nap (4×4)',
        size: 4,
        difficulty: 'medium',
        regions: [
            [0, 0, 0, 1],
            [0, 0, 1, 1],
            [2, 2, 3, 1],
            [2, 2, 3, 3],
        ],
        solution: [
            [0, 1],
            [1, 3],
            [2, 0],
            [3, 2],
        ],
    },
    {
        id: 2,
        title: 'Yarn Basket (4×4)',
        size: 4,
        difficulty: 'medium',
        regions: [
            [0, 0, 1, 1],
            [0, 0, 1, 1],
            [2, 2, 2, 1],
            [2, 3, 3, 3],
        ],
        solution: [
            [0, 1],
            [1, 3],
            [2, 0],
            [3, 2],
        ],
    },
    {
        id: 3,
        title: 'Milk Saucer (4×4)',
        size: 4,
        difficulty: 'medium',
        regions: [
            [1, 1, 0, 0],
            [1, 1, 0, 0],
            [1, 3, 2, 2],
            [3, 3, 2, 2],
        ],
        solution: [
            [0, 2],
            [1, 0],
            [2, 3],
            [3, 1],
        ],
    },
    {
        id: 4,
        title: 'Paper Bag (4×4)',
        size: 4,
        difficulty: 'medium',
        regions: [
            [0, 0, 0, 0],
            [1, 1, 1, 0],
            [1, 3, 3, 2],
            [3, 3, 2, 2],
        ],
        solution: [
            [0, 2],
            [1, 0],
            [2, 3],
            [3, 1],
        ],
    },
    {
        id: 5,
        title: 'Sunbeam Patch (4×4)',
        size: 4,
        difficulty: 'medium',
        regions: [
            [0, 0, 0, 1],
            [2, 0, 1, 1],
            [2, 3, 1, 3],
            [2, 3, 3, 3],
        ],
        solution: [
            [0, 1],
            [1, 3],
            [2, 0],
            [3, 2],
        ],
    },
    {
        id: 6,
        title: 'Sunlit Patio (5×5)',
        size: 5,
        difficulty: 'medium',
        regions: [
            [0, 1, 1, 1, 1],
            [0, 0, 1, 1, 1],
            [2, 2, 1, 1, 3],
            [4, 4, 4, 3, 3],
            [4, 4, 4, 4, 4],
        ],
        solution: [
            [0, 0],
            [1, 3],
            [2, 1],
            [3, 4],
            [4, 2],
        ],
    },
    {
        id: 7,
        title: 'Sakura Courtyard (5×5)',
        size: 5,
        difficulty: 'medium',
        regions: [
            [0, 0, 0, 1, 1],
            [0, 1, 1, 1, 3],
            [0, 2, 1, 1, 3],
            [2, 2, 2, 3, 3],
            [2, 4, 4, 3, 3],
        ],
        solution: [
            [0, 0],
            [1, 3],
            [2, 1],
            [3, 4],
            [4, 2],
        ],
    },
    {
        id: 8,
        title: 'Teahouse Steps (5×5)',
        size: 5,
        difficulty: 'medium',
        regions: [
            [1, 0, 0, 0, 2],
            [1, 1, 0, 0, 2],
            [4, 0, 0, 3, 2],
            [4, 3, 3, 3, 2],
            [4, 4, 4, 2, 2],
        ],
        solution: [
            [0, 3],
            [1, 1],
            [2, 4],
            [3, 2],
            [4, 0],
        ],
    },
    {
        id: 9,
        title: 'Laundry Line (5×5)',
        size: 5,
        difficulty: 'medium',
        regions: [
            [0, 0, 1, 1, 1],
            [2, 0, 0, 1, 1],
            [2, 1, 1, 1, 1],
            [2, 3, 3, 3, 1],
            [3, 3, 3, 4, 4],
        ],
        solution: [
            [0, 1],
            [1, 3],
            [2, 0],
            [3, 2],
            [4, 4],
        ],
    },
    {
        id: 10,
        title: 'Bookshelf Perch (5×5)',
        size: 5,
        difficulty: 'medium',
        regions: [
            [1, 1, 0, 0, 0],
            [2, 1, 1, 0, 0],
            [2, 2, 1, 3, 3],
            [4, 2, 4, 3, 4],
            [4, 4, 4, 4, 4],
        ],
        solution: [
            [0, 4],
            [1, 2],
            [2, 0],
            [3, 3],
            [4, 1],
        ],
    },
    {
        id: 11,
        title: 'Rooftop Tiles (5×5)',
        size: 5,
        difficulty: 'medium',
        regions: [
            [1, 1, 0, 0, 0],
            [1, 1, 3, 0, 2],
            [1, 1, 3, 0, 2],
            [1, 1, 3, 2, 2],
            [4, 3, 3, 2, 2],
        ],
        solution: [
            [0, 3],
            [1, 1],
            [2, 4],
            [3, 2],
            [4, 0],
        ],
    },
    {
        id: 12,
        title: 'Fish Market (5×5)',
        size: 5,
        difficulty: 'hard',
        regions: [
            [0, 0, 1, 1, 1],
            [3, 0, 0, 0, 1],
            [3, 3, 2, 2, 1],
            [3, 3, 2, 2, 4],
            [3, 2, 2, 4, 4],
        ],
        solution: [
            [0, 1],
            [1, 4],
            [2, 2],
            [3, 0],
            [4, 3],
        ],
    },
    {
        id: 13,
        title: 'Lantern Alley (5×5)',
        size: 5,
        difficulty: 'hard',
        regions: [
            [0, 0, 0, 2, 2],
            [0, 0, 1, 1, 2],
            [0, 0, 0, 2, 2],
            [3, 3, 3, 4, 2],
            [3, 4, 4, 4, 2],
        ],
        solution: [
            [0, 0],
            [1, 2],
            [2, 4],
            [3, 1],
            [4, 3],
        ],
    },
    {
        id: 14,
        title: 'Bamboo Fence (6×6)',
        size: 6,
        difficulty: 'easy',
        regions: [
            [0, 0, 0, 0, 0, 0],
            [0, 1, 0, 0, 2, 2],
            [5, 3, 3, 0, 2, 4],
            [5, 3, 3, 4, 4, 4],
            [5, 5, 3, 3, 4, 4],
            [5, 5, 5, 5, 5, 5],
        ],
        solution: [
            [0, 3],
            [1, 1],
            [2, 4],
            [3, 2],
            [4, 5],
            [5, 0],
        ],
    },
    {
        id: 15,
        title: 'Koi Pond (6×6)',
        size: 6,
        difficulty: 'medium',
        regions: [
            [1, 1, 0, 0, 0, 0],
            [1, 0, 0, 2, 0, 0],
            [1, 2, 2, 2, 5, 5],
            [1, 4, 2, 2, 3, 5],
            [4, 4, 4, 4, 5, 5],
            [4, 4, 4, 4, 5, 5],
        ],
        solution: [
            [0, 3],
            [1, 0],
            [2, 2],
            [3, 4],
            [4, 1],
            [5, 5],
        ],
    },
    {
        id: 16,
        title: 'Night Market (6×6)',
        size: 6,
        difficulty: 'medium',
        regions: [
            [2, 2, 2, 2, 0, 0],
            [1, 1, 1, 2, 2, 0],
            [5, 1, 3, 2, 4, 4],
            [5, 3, 3, 2, 4, 4],
            [5, 4, 4, 4, 4, 5],
            [5, 5, 5, 5, 5, 5],
        ],
        solution: [
            [0, 5],
            [1, 0],
            [2, 3],
            [3, 1],
            [4, 4],
            [5, 2],
        ],
    },
    {
        id: 17,
        title: 'Clay Rooftops (6×6)',
        size: 6,
        difficulty: 'medium',
        regions: [
            [0, 0, 0, 0, 0, 0],
            [1, 1, 1, 0, 0, 0],
            [1, 3, 1, 0, 2, 2],
            [1, 3, 3, 3, 2, 2],
            [3, 3, 5, 3, 2, 4],
            [3, 3, 5, 4, 4, 4],
        ],
        solution: [
            [0, 3],
            [1, 0],
            [2, 4],
            [3, 1],
            [4, 5],
            [5, 2],
        ],
    },
    {
        id: 18,
        title: 'Noodle Cart (6×6)',
        size: 6,
        difficulty: 'medium',
        regions: [
            [1, 1, 1, 1, 1, 0],
            [1, 1, 1, 0, 0, 0],
            [1, 1, 1, 2, 2, 0],
            [1, 4, 3, 3, 2, 0],
            [4, 4, 5, 5, 2, 2],
            [4, 4, 4, 5, 5, 5],
        ],
        solution: [
            [0, 5],
            [1, 1],
            [2, 4],
            [3, 2],
            [4, 0],
            [5, 3],
        ],
    },
    {
        id: 19,
        title: 'Temple Garden (6×6)',
        size: 6,
        difficulty: 'medium',
        regions: [
            [2, 2, 2, 2, 0, 0],
            [1, 2, 2, 2, 0, 0],
            [1, 3, 2, 2, 2, 2],
            [3, 3, 2, 2, 2, 4],
            [3, 5, 5, 5, 2, 4],
            [3, 5, 5, 5, 5, 4],
        ],
        solution: [
            [0, 4],
            [1, 0],
            [2, 3],
            [3, 1],
            [4, 5],
            [5, 2],
        ],
    },
    {
        id: 20,
        title: 'Rainy Awning (6×6)',
        size: 6,
        difficulty: 'medium',
        regions: [
            [3, 0, 0, 0, 0, 0],
            [3, 0, 0, 0, 1, 1],
            [3, 3, 2, 2, 1, 1],
            [3, 3, 5, 4, 1, 1],
            [3, 5, 5, 4, 4, 1],
            [3, 3, 5, 5, 1, 1],
        ],
        solution: [
            [0, 1],
            [1, 5],
            [2, 3],
            [3, 0],
            [4, 4],
            [5, 2],
        ],
    },
    {
        id: 21,
        title: 'Cardboard Castle (6×6)',
        size: 6,
        difficulty: 'medium',
        regions: [
            [3, 3, 3, 0, 0, 0],
            [3, 1, 3, 0, 2, 0],
            [3, 3, 3, 0, 2, 2],
            [3, 3, 4, 4, 4, 2],
            [5, 3, 4, 5, 4, 2],
            [5, 5, 5, 5, 4, 4],
        ],
        solution: [
            [0, 3],
            [1, 1],
            [2, 5],
            [3, 0],
            [4, 4],
            [5, 2],
        ],
    },
    {
        id: 22,
        title: 'Greenhouse Shelf (6×6)',
        size: 6,
        difficulty: 'hard',
        regions: [
            [3, 0, 0, 1, 1, 1],
            [3, 1, 1, 1, 2, 2],
            [3, 3, 3, 3, 2, 2],
            [5, 3, 3, 4, 4, 2],
            [5, 3, 3, 3, 4, 2],
            [5, 5, 5, 5, 2, 2],
        ],
        solution: [
            [0, 1],
            [1, 3],
            [2, 5],
            [3, 2],
            [4, 4],
            [5, 0],
        ],
    },
    {
        id: 23,
        title: 'Attic Window (6×6)',
        size: 6,
        difficulty: 'hard',
        regions: [
            [1, 1, 1, 1, 0, 0],
            [1, 1, 0, 0, 0, 2],
            [1, 1, 0, 0, 0, 2],
            [1, 3, 3, 5, 5, 2],
            [4, 3, 3, 5, 2, 2],
            [4, 4, 4, 5, 2, 2],
        ],
        solution: [
            [0, 4],
            [1, 1],
            [2, 5],
            [3, 2],
            [4, 0],
            [5, 3],
        ],
    },
    {
        id: 24,
        title: 'Royal Cattery (7×7)',
        size: 7,
        difficulty: 'medium',
        regions: [
            [0, 0, 0, 1, 1, 1, 1],
            [0, 2, 0, 1, 1, 1, 1],
            [0, 2, 0, 1, 1, 1, 1],
            [0, 2, 3, 3, 1, 1, 3],
            [4, 2, 2, 3, 3, 3, 3],
            [4, 4, 5, 5, 5, 5, 3],
            [4, 4, 4, 4, 5, 5, 6],
        ],
        solution: [
            [0, 2],
            [1, 5],
            [2, 1],
            [3, 3],
            [4, 0],
            [5, 4],
            [6, 6],
        ],
    },
    {
        id: 25,
        title: 'Harbour Crates (7×7)',
        size: 7,
        difficulty: 'medium',
        regions: [
            [1, 1, 1, 1, 0, 0, 1],
            [2, 2, 2, 1, 0, 1, 1],
            [2, 1, 1, 1, 1, 1, 1],
            [2, 2, 3, 1, 4, 4, 4],
            [3, 3, 3, 1, 4, 6, 4],
            [3, 5, 3, 1, 4, 6, 4],
            [3, 1, 1, 1, 1, 6, 6],
        ],
        solution: [
            [0, 5],
            [1, 3],
            [2, 0],
            [3, 2],
            [4, 4],
            [5, 1],
            [6, 6],
        ],
    },
    {
        id: 26,
        title: 'Silk Workshop (7×7)',
        size: 7,
        difficulty: 'medium',
        regions: [
            [1, 1, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 0, 0, 2],
            [1, 3, 3, 0, 0, 0, 2],
            [1, 4, 3, 3, 0, 0, 2],
            [6, 4, 5, 5, 0, 0, 2],
            [6, 4, 5, 5, 5, 2, 2],
            [6, 6, 5, 5, 5, 5, 5],
        ],
        solution: [
            [0, 5],
            [1, 2],
            [2, 6],
            [3, 3],
            [4, 1],
            [5, 4],
            [6, 0],
        ],
    },
    {
        id: 27,
        title: 'Clocktower Loft (7×7)',
        size: 7,
        difficulty: 'medium',
        regions: [
            [0, 0, 0, 0, 0, 1, 1],
            [0, 0, 0, 0, 0, 0, 1],
            [0, 2, 0, 1, 1, 1, 1],
            [0, 2, 4, 3, 3, 3, 3],
            [2, 2, 4, 4, 3, 5, 3],
            [2, 6, 6, 3, 3, 5, 3],
            [2, 2, 6, 6, 5, 5, 3],
        ],
        solution: [
            [0, 0],
            [1, 6],
            [2, 1],
            [3, 4],
            [4, 2],
            [5, 5],
            [6, 3],
        ],
    },
    {
        id: 28,
        title: 'Stone Bridge (7×7)',
        size: 7,
        difficulty: 'medium',
        regions: [
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 2, 0, 0],
            [0, 1, 0, 1, 2, 2, 0],
            [3, 1, 1, 1, 1, 2, 2],
            [3, 3, 3, 4, 4, 4, 2],
            [3, 3, 5, 4, 6, 4, 6],
            [3, 3, 4, 4, 6, 6, 6],
        ],
        solution: [
            [0, 1],
            [1, 3],
            [2, 5],
            [3, 0],
            [4, 4],
            [5, 2],
            [6, 6],
        ],
    },
    {
        id: 29,
        title: 'Tangerine Grove (7×7)',
        size: 7,
        difficulty: 'medium',
        regions: [
            [1, 1, 1, 0, 0, 0, 0],
            [2, 1, 1, 1, 1, 0, 0],
            [2, 1, 4, 3, 1, 3, 0],
            [2, 1, 4, 3, 3, 3, 0],
            [6, 1, 4, 4, 3, 5, 0],
            [6, 4, 4, 4, 3, 5, 0],
            [6, 6, 4, 4, 5, 5, 5],
        ],
        solution: [
            [0, 6],
            [1, 3],
            [2, 0],
            [3, 4],
            [4, 2],
            [5, 5],
            [6, 1],
        ],
    },
    {
        id: 30,
        title: 'Bathhouse Steam (7×7)',
        size: 7,
        difficulty: 'medium',
        regions: [
            [1, 1, 1, 0, 0, 0, 0],
            [1, 1, 1, 1, 1, 0, 2],
            [1, 3, 1, 1, 1, 0, 2],
            [3, 3, 3, 1, 2, 2, 2],
            [3, 3, 4, 4, 5, 2, 2],
            [3, 3, 6, 4, 5, 2, 2],
            [3, 6, 6, 5, 5, 5, 5],
        ],
        solution: [
            [0, 5],
            [1, 3],
            [2, 6],
            [3, 0],
            [4, 2],
            [5, 4],
            [6, 1],
        ],
    },
    {
        id: 31,
        title: 'Ink Studio (7×7)',
        size: 7,
        difficulty: 'hard',
        regions: [
            [0, 0, 2, 2, 1, 1, 1],
            [0, 0, 2, 1, 1, 3, 3],
            [0, 2, 2, 0, 1, 1, 3],
            [0, 0, 0, 0, 0, 3, 3],
            [4, 0, 0, 3, 3, 3, 5],
            [4, 4, 4, 3, 3, 3, 5],
            [4, 6, 6, 6, 6, 6, 5],
        ],
        solution: [
            [0, 1],
            [1, 4],
            [2, 2],
            [3, 5],
            [4, 0],
            [5, 6],
            [6, 3],
        ],
    },
    {
        id: 32,
        title: 'Wisteria Gate (7×7)',
        size: 7,
        difficulty: 'hard',
        regions: [
            [0, 0, 0, 0, 0, 0, 1],
            [0, 0, 2, 0, 0, 0, 1],
            [0, 0, 2, 2, 0, 1, 1],
            [2, 2, 2, 2, 3, 1, 5],
            [2, 4, 4, 3, 3, 1, 5],
            [6, 4, 4, 3, 3, 5, 5],
            [6, 6, 6, 3, 5, 5, 5],
        ],
        solution: [
            [0, 3],
            [1, 6],
            [2, 2],
            [3, 4],
            [4, 1],
            [5, 5],
            [6, 0],
        ],
    },
    {
        id: 33,
        title: 'Midnight Purr (7×7)',
        size: 7,
        difficulty: 'hard',
        regions: [
            [1, 1, 1, 0, 0, 0, 0],
            [2, 2, 1, 1, 0, 1, 0],
            [2, 4, 4, 1, 1, 1, 0],
            [2, 2, 4, 3, 3, 0, 0],
            [2, 6, 4, 3, 0, 0, 0],
            [2, 6, 4, 3, 5, 5, 0],
            [6, 6, 3, 3, 5, 5, 5],
        ],
        solution: [
            [0, 6],
            [1, 3],
            [2, 0],
            [3, 4],
            [4, 2],
            [5, 5],
            [6, 1],
        ],
    },
    {
        id: 34,
        title: 'Train Platform (8×8)',
        size: 8,
        difficulty: 'medium',
        regions: [
            [4, 1, 1, 1, 1, 1, 0, 0],
            [4, 1, 1, 2, 2, 1, 1, 1],
            [4, 2, 2, 2, 3, 1, 6, 6],
            [4, 4, 4, 3, 3, 1, 6, 6],
            [4, 4, 4, 4, 3, 1, 1, 6],
            [4, 4, 4, 4, 5, 5, 6, 6],
            [4, 4, 4, 6, 6, 6, 6, 6],
            [7, 7, 7, 6, 6, 6, 6, 6],
        ],
        solution: [
            [0, 7],
            [1, 5],
            [2, 1],
            [3, 3],
            [4, 0],
            [5, 4],
            [6, 6],
            [7, 2],
        ],
    },
    {
        id: 35,
        title: 'Observatory Dome (8×8)',
        size: 8,
        difficulty: 'medium',
        regions: [
            [2, 1, 1, 1, 1, 0, 0, 0],
            [2, 2, 2, 2, 1, 1, 0, 0],
            [2, 4, 2, 2, 1, 1, 3, 0],
            [2, 4, 2, 1, 1, 3, 3, 0],
            [2, 4, 4, 4, 5, 3, 3, 3],
            [2, 2, 2, 5, 5, 3, 3, 3],
            [2, 6, 2, 7, 7, 7, 3, 3],
            [2, 6, 7, 7, 7, 3, 3, 3],
        ],
        solution: [
            [0, 7],
            [1, 5],
            [2, 0],
            [3, 6],
            [4, 2],
            [5, 4],
            [6, 1],
            [7, 3],
        ],
    },
    {
        id: 36,
        title: 'Paper Lantern Hall (8×8)',
        size: 8,
        difficulty: 'medium',
        regions: [
            [1, 2, 2, 2, 2, 0, 0, 0],
            [1, 1, 2, 2, 2, 0, 0, 0],
            [1, 1, 2, 2, 2, 0, 2, 0],
            [3, 1, 1, 2, 2, 2, 2, 0],
            [3, 1, 4, 2, 2, 0, 0, 0],
            [3, 3, 4, 2, 2, 0, 5, 5],
            [3, 3, 4, 6, 6, 6, 6, 5],
            [3, 7, 7, 7, 7, 6, 6, 6],
        ],
        solution: [
            [0, 6],
            [1, 1],
            [2, 4],
            [3, 0],
            [4, 2],
            [5, 7],
            [6, 5],
            [7, 3],
        ],
    },
    {
        id: 37,
        title: 'Shipping Yard (8×8)',
        size: 8,
        difficulty: 'medium',
        regions: [
            [2, 2, 2, 0, 0, 0, 0, 0],
            [4, 4, 2, 2, 1, 1, 1, 0],
            [4, 2, 2, 2, 1, 3, 3, 0],
            [4, 4, 2, 2, 1, 1, 3, 3],
            [4, 4, 4, 2, 2, 1, 3, 3],
            [4, 4, 4, 4, 6, 1, 1, 5],
            [4, 4, 4, 4, 6, 6, 6, 6],
            [4, 4, 7, 7, 7, 6, 6, 6],
        ],
        solution: [
            [0, 3],
            [1, 5],
            [2, 1],
            [3, 6],
            [4, 0],
            [5, 7],
            [6, 4],
            [7, 2],
        ],
    },
    {
        id: 38,
        title: 'Orchid Terrace (8×8)',
        size: 8,
        difficulty: 'medium',
        regions: [
            [2, 2, 2, 2, 2, 0, 0, 0],
            [1, 2, 1, 3, 2, 0, 0, 0],
            [1, 1, 1, 3, 2, 0, 0, 0],
            [1, 1, 3, 3, 2, 0, 3, 0],
            [4, 1, 1, 3, 3, 3, 3, 3],
            [4, 4, 4, 3, 3, 3, 5, 5],
            [7, 4, 4, 6, 3, 7, 7, 5],
            [7, 7, 7, 7, 7, 7, 5, 5],
        ],
        solution: [
            [0, 5],
            [1, 2],
            [2, 4],
            [3, 6],
            [4, 0],
            [5, 7],
            [6, 3],
            [7, 1],
        ],
    },
    {
        id: 39,
        title: 'Library Stacks (8×8)',
        size: 8,
        difficulty: 'medium',
        regions: [
            [4, 1, 1, 1, 1, 1, 0, 0],
            [4, 1, 3, 3, 1, 1, 2, 2],
            [4, 1, 3, 3, 3, 3, 5, 2],
            [4, 3, 3, 3, 5, 5, 5, 5],
            [4, 6, 6, 3, 5, 5, 5, 5],
            [6, 6, 6, 6, 5, 5, 5, 5],
            [7, 7, 6, 6, 6, 6, 5, 5],
            [7, 7, 7, 7, 6, 6, 5, 5],
        ],
        solution: [
            [0, 6],
            [1, 4],
            [2, 7],
            [3, 2],
            [4, 0],
            [5, 5],
            [6, 3],
            [7, 1],
        ],
    },
    {
        id: 40,
        title: 'Winter Veranda (8×8)',
        size: 8,
        difficulty: 'medium',
        regions: [
            [1, 2, 2, 2, 2, 2, 0, 3],
            [1, 1, 1, 2, 2, 3, 3, 3],
            [2, 2, 2, 2, 3, 3, 5, 5],
            [4, 4, 2, 3, 3, 3, 3, 5],
            [4, 4, 4, 4, 3, 3, 5, 5],
            [4, 4, 6, 4, 3, 3, 5, 5],
            [4, 6, 6, 6, 6, 5, 5, 5],
            [7, 6, 6, 5, 5, 5, 5, 5],
        ],
        solution: [
            [0, 6],
            [1, 1],
            [2, 3],
            [3, 5],
            [4, 2],
            [5, 7],
            [6, 4],
            [7, 0],
        ],
    },
    {
        id: 41,
        title: 'Festival Rooftops (8×8)',
        size: 8,
        difficulty: 'hard',
        regions: [
            [0, 0, 0, 0, 0, 0, 2, 2],
            [0, 0, 0, 1, 1, 0, 0, 2],
            [3, 1, 1, 1, 2, 2, 2, 2],
            [3, 3, 1, 4, 4, 2, 2, 2],
            [3, 1, 1, 1, 4, 2, 2, 2],
            [3, 1, 5, 5, 4, 6, 6, 6],
            [3, 3, 3, 5, 4, 4, 4, 6],
            [7, 3, 3, 5, 5, 4, 4, 6],
        ],
        solution: [
            [0, 5],
            [1, 3],
            [2, 6],
            [3, 1],
            [4, 4],
            [5, 2],
            [6, 7],
            [7, 0],
        ],
    },
    {
        id: 42,
        title: 'Quarry Steps (8×8)',
        size: 8,
        difficulty: 'hard',
        regions: [
            [2, 0, 0, 0, 1, 1, 1, 1],
            [2, 2, 0, 1, 1, 4, 4, 4],
            [3, 2, 2, 1, 5, 4, 4, 4],
            [3, 3, 3, 1, 5, 5, 5, 4],
            [3, 3, 3, 5, 5, 7, 4, 4],
            [3, 5, 3, 5, 7, 7, 4, 4],
            [3, 5, 5, 5, 7, 7, 4, 6],
            [5, 5, 5, 7, 7, 7, 7, 7],
        ],
        solution: [
            [0, 1],
            [1, 4],
            [2, 2],
            [3, 0],
            [4, 6],
            [5, 3],
            [6, 7],
            [7, 5],
        ],
    },
    {
        id: 43,
        title: 'Imperial Courtyard (9×9)',
        size: 9,
        difficulty: 'easy',
        regions: [
            [5, 0, 0, 0, 0, 2, 2, 2, 1],
            [5, 0, 2, 2, 0, 2, 1, 1, 1],
            [5, 5, 5, 2, 2, 2, 2, 1, 1],
            [5, 5, 2, 2, 2, 1, 1, 1, 3],
            [5, 5, 2, 2, 2, 4, 1, 1, 1],
            [5, 5, 5, 5, 2, 4, 1, 1, 1],
            [8, 8, 8, 5, 4, 4, 6, 1, 1],
            [8, 7, 8, 4, 4, 6, 6, 6, 6],
            [8, 8, 8, 8, 4, 6, 6, 6, 6],
        ],
        solution: [
            [0, 2],
            [1, 7],
            [2, 4],
            [3, 8],
            [4, 5],
            [5, 0],
            [6, 6],
            [7, 1],
            [8, 3],
        ],
    },
    {
        id: 44,
        title: 'Cloud Pavilion (9×9)',
        size: 9,
        difficulty: 'medium',
        regions: [
            [0, 0, 0, 0, 0, 0, 0, 3, 3],
            [0, 1, 0, 3, 3, 3, 3, 3, 3],
            [0, 1, 0, 3, 3, 0, 3, 3, 2],
            [0, 1, 0, 0, 0, 0, 3, 3, 3],
            [4, 1, 5, 0, 0, 3, 3, 3, 3],
            [4, 4, 5, 0, 5, 3, 5, 3, 6],
            [7, 4, 5, 5, 5, 5, 5, 6, 6],
            [7, 4, 7, 5, 5, 5, 5, 5, 6],
            [7, 7, 7, 7, 5, 8, 8, 8, 8],
        ],
        solution: [
            [0, 3],
            [1, 1],
            [2, 8],
            [3, 6],
            [4, 0],
            [5, 4],
            [6, 7],
            [7, 2],
            [8, 5],
        ],
    },
    {
        id: 45,
        title: 'Thunder Rooftops (9×9)',
        size: 9,
        difficulty: 'medium',
        regions: [
            [1, 1, 0, 0, 0, 0, 0, 2, 2],
            [1, 1, 1, 0, 0, 0, 2, 2, 2],
            [3, 1, 1, 4, 0, 2, 2, 2, 2],
            [3, 3, 1, 4, 0, 0, 0, 0, 2],
            [3, 1, 1, 4, 6, 0, 0, 5, 2],
            [3, 4, 4, 4, 6, 5, 5, 5, 2],
            [7, 4, 6, 6, 6, 5, 8, 2, 2],
            [7, 6, 6, 8, 8, 8, 8, 2, 2],
            [6, 6, 6, 8, 8, 8, 2, 2, 2],
        ],
        solution: [
            [0, 6],
            [1, 2],
            [2, 8],
            [3, 1],
            [4, 3],
            [5, 7],
            [6, 4],
            [7, 0],
            [8, 5],
        ],
    },
    {
        id: 46,
        title: 'Lacquer Gallery (9×9)',
        size: 9,
        difficulty: 'medium',
        regions: [
            [1, 1, 0, 0, 0, 0, 0, 3, 3],
            [1, 1, 1, 0, 0, 0, 3, 3, 3],
            [1, 1, 0, 0, 0, 3, 3, 3, 2],
            [1, 1, 1, 0, 3, 3, 3, 3, 3],
            [1, 1, 0, 0, 3, 5, 4, 4, 4],
            [1, 1, 0, 5, 3, 5, 4, 8, 8],
            [1, 6, 5, 5, 5, 5, 4, 4, 8],
            [1, 6, 6, 6, 5, 7, 7, 7, 8],
            [1, 1, 7, 7, 7, 7, 8, 8, 8],
        ],
        solution: [
            [0, 2],
            [1, 0],
            [2, 8],
            [3, 4],
            [4, 6],
            [5, 3],
            [6, 1],
            [7, 5],
            [8, 7],
        ],
    },
    {
        id: 47,
        title: 'Mountain Monastery (9×9)',
        size: 9,
        difficulty: 'medium',
        regions: [
            [4, 4, 1, 1, 1, 0, 0, 3, 3],
            [4, 4, 1, 1, 2, 0, 3, 3, 3],
            [4, 4, 4, 1, 2, 2, 3, 3, 3],
            [4, 4, 4, 1, 1, 2, 5, 3, 3],
            [4, 7, 7, 7, 6, 5, 5, 3, 3],
            [4, 7, 7, 7, 6, 5, 5, 5, 3],
            [4, 4, 7, 6, 6, 6, 5, 3, 3],
            [7, 7, 7, 7, 6, 3, 3, 3, 3],
            [7, 7, 7, 7, 6, 8, 3, 3, 3],
        ],
        solution: [
            [0, 6],
            [1, 2],
            [2, 4],
            [3, 8],
            [4, 0],
            [5, 7],
            [6, 3],
            [7, 1],
            [8, 5],
        ],
    },
    {
        id: 48,
        title: 'Moonlit Aqueduct (9×9)',
        size: 9,
        difficulty: 'hard',
        regions: [
            [0, 0, 0, 1, 1, 1, 1, 1, 1],
            [0, 3, 3, 2, 1, 1, 1, 1, 1],
            [0, 0, 3, 2, 2, 2, 2, 1, 1],
            [0, 0, 3, 3, 2, 2, 2, 4, 4],
            [0, 0, 3, 3, 2, 2, 4, 4, 4],
            [0, 0, 6, 3, 3, 4, 4, 4, 5],
            [6, 6, 6, 6, 6, 4, 4, 5, 5],
            [6, 6, 7, 8, 6, 6, 4, 4, 5],
            [7, 7, 7, 8, 8, 4, 4, 5, 5],
        ],
        solution: [
            [0, 1],
            [1, 7],
            [2, 5],
            [3, 3],
            [4, 6],
            [5, 8],
            [6, 0],
            [7, 2],
            [8, 4],
        ],
    },
    {
        id: 49,
        title: 'Grand Bazaar (9×9)',
        size: 9,
        difficulty: 'hard',
        regions: [
            [1, 1, 1, 1, 1, 0, 0, 0, 2],
            [1, 1, 1, 1, 1, 1, 0, 0, 2],
            [1, 1, 1, 1, 1, 1, 0, 2, 2],
            [3, 1, 1, 1, 1, 1, 2, 2, 2],
            [3, 3, 1, 4, 4, 1, 1, 5, 5],
            [3, 3, 3, 3, 4, 4, 7, 7, 5],
            [3, 6, 3, 3, 3, 7, 7, 5, 5],
            [3, 6, 3, 3, 7, 7, 7, 8, 5],
            [6, 6, 3, 3, 3, 3, 8, 8, 8],
        ],
        solution: [
            [0, 5],
            [1, 2],
            [2, 7],
            [3, 0],
            [4, 3],
            [5, 8],
            [6, 1],
            [7, 4],
            [8, 6],
        ],
    },
    {
        id: 50,
        title: 'Nine Tails (9×9)',
        size: 9,
        difficulty: 'hard',
        regions: [
            [0, 0, 1, 1, 1, 1, 3, 5, 5],
            [0, 0, 1, 2, 2, 1, 3, 5, 5],
            [2, 2, 2, 2, 3, 3, 3, 3, 5],
            [2, 2, 3, 3, 3, 3, 3, 5, 5],
            [2, 2, 3, 4, 3, 3, 5, 5, 5],
            [2, 2, 2, 4, 3, 3, 5, 5, 5],
            [6, 2, 2, 4, 4, 4, 7, 5, 5],
            [6, 8, 8, 8, 4, 4, 7, 5, 7],
            [6, 6, 8, 8, 8, 7, 7, 7, 7],
        ],
        solution: [
            [0, 1],
            [1, 5],
            [2, 2],
            [3, 6],
            [4, 3],
            [5, 7],
            [6, 0],
            [7, 8],
            [8, 4],
        ],
    },
];
// =====================================================================================
//  Nyandoku — a Queens-style logic puzzle, rebuilt on the shared GameShell.
// =====================================================================================
//  Rules are unchanged; the presentation is new. The board is a lit ceramic grid with
//  carved region borders, every mark animates in, conflicts pulse red, and the cats
//  land with a spring. Three stars for a clean solve, down to one if you lean on hints.
// =====================================================================================
class NyandokuGame extends LightShell_1.LightShell {
    get meta() {
        return {
            id: 'nyandoku',
            title: 'Nyandoku',
            eyebrow: '貓咪數獨',
            levelCount: exports.NYANDOKU_LEVELS.length,
            howTo: [
                'Tap once to mark X. Tap again to place a cat.',
                'Exactly one cat per row, column and colour region.',
                'No two cats may touch — not even diagonally.',
            ],
            hint: 'Tap for X · tap again for a cat · drag to sweep X',
        };
    }
    constructor(parent, onBackToHub, startInScreenshotMode = false) {
        super(parent, onBackToHub, 'nyandoku');
        this._levelIdx = 0;
        this._grid = [];
        this._autoXHistory = new Map();
        this._conflicts = new Set();
        this._autoXEnabled = true;
        this._mistakes = 0;
        this._hintsUsed = 0;
        this._dragPainting = false;
        this._lastPaintedKey = '';
        this._conflictPulse = 0;
        this._solveT = 0;
        this._screenshotMode = false;
        this._highlightedCell = null;
        /** Board-entry clock: cells deal themselves in along the diagonal. */
        this._enterT = 0;
        this._sweeps = [];
        this._undo = [];
        this._satisfied = new Set();
        this._screenshotMode = startInScreenshotMode;
        this.loadLevel(Math.min(Progress_1.Progress.unlocked('nyandoku'), exports.NYANDOKU_LEVELS.length - 1));
    }
    // =================================================================================
    //  Rules
    // =================================================================================
    onLoadLevel(i) {
        this._levelIdx = i;
        const lvl = exports.NYANDOKU_LEVELS[i];
        this._grid = Array.from({ length: lvl.size }, () => Array(lvl.size).fill(CellState.EMPTY));
        this._autoXHistory.clear();
        this._conflicts.clear();
        this._mistakes = 0;
        this._hintsUsed = 0;
        this._conflictPulse = 0;
        this._solveT = 0;
        this._enterT = 0;
        this._sweeps = [];
        this._undo = [];
        this._satisfied.clear();
        this._highlightedCell = null;
        this.relayout();
        if (this._screenshotMode && lvl.id === 1) {
            this._grid = [
                [CellState.MARK_X, CellState.CAT, CellState.MARK_X, CellState.MARK_X],
                [CellState.MARK_X, CellState.MARK_X, CellState.MARK_X, CellState.CAT],
                [CellState.MARK_X, CellState.ERROR_X, CellState.ERROR_X, CellState.MARK_X],
                [CellState.MARK_X, CellState.MARK_X, CellState.CAT, CellState.MARK_X],
            ];
            this._highlightedCell = [2, 0];
            this._screenshotMode = false;
        }
    }
    levelName() {
        return exports.NYANDOKU_LEVELS[this._levelIdx].title;
    }
    stats() {
        const lvl = exports.NYANDOKU_LEVELS[this._levelIdx];
        let placed = 0;
        for (let r = 0; r < lvl.size; r++) {
            for (let c = 0; c < lvl.size; c++)
                if (this._grid[r][c] === CellState.CAT)
                    placed++;
        }
        return [
            { label: 'Cats', value: placed + '/' + lvl.size, icon: 'check', tint: this.pal.accent2 },
            { label: 'Grid', value: lvl.size + '×' + lvl.size, tint: Theme_1.T.textDim },
            { label: 'Slips', value: String(this._mistakes), icon: 'close', tint: this._mistakes ? Theme_1.T.danger : Theme_1.T.textDim },
        ];
    }
    actions() {
        // The light skin draws its own dock; the shared action bar stays empty.
        return [];
    }
    onAction(id) {
        if (id === 'autox') {
            this._autoXEnabled = !this._autoXEnabled;
            (0, GameShell_1.haptic)(8);
            return;
        }
        if (id === 'undo') {
            this._doUndo();
            return;
        }
        if (id === 'hint') {
            this.watchAdFor('Watch a short ad to reveal one cat', () => this._useHint());
        }
    }
    // =================================================================================
    //  Undo
    // =================================================================================
    //  A puzzle with no undo punishes experimenting, which is the whole activity. One
    //  step records the cell, what was in it, and any auto-X the move spread, so a
    //  single tap puts the board back exactly as it was.
    _pushUndo(r, c, prev, autoX) {
        this._undo.push({ r, c, prev, autoX });
        if (this._undo.length > 64)
            this._undo.shift();
    }
    _doUndo() {
        const step = this._undo.pop();
        if (!step) {
            SoundManager_1.SoundManager.playError();
            return;
        }
        if (step.autoX) {
            for (const [rr, cc] of step.autoX) {
                if (this._grid[rr][cc] === CellState.MARK_X)
                    this._grid[rr][cc] = CellState.EMPTY;
            }
            this._autoXHistory.delete(step.r + ',' + step.c);
        }
        this._grid[step.r][step.c] = step.prev;
        this._highlightedCell = null;
        const p = this._cellCenter(step.r, step.c);
        this.fx.puff(p.x, p.y, 6, '#FFFFFF', 14);
        SoundManager_1.SoundManager.playTap(0.9);
        (0, GameShell_1.haptic)(6);
        this._validateBoard();
    }
    /** Mark-stamp animation for a cell. */
    _stamp(r, c) {
        this.anim.jump('m' + r + '_' + c, 0);
        this.anim.set('m' + r + '_' + c, 1, 20);
    }
    // =================================================================================
    //  Cat reactions
    // =================================================================================
    //  The cat is one still image, so every bit of character has to come from how it
    //  is transformed. Each reaction is a decaying impulse the renderer reads, which
    //  keeps the rules code free of animation state: place a cat and it cheers, break
    //  a rule and the cats involved shake their heads at you.
    /** "No." A quick head shake — fired on the cats involved in a clash. */
    _reactShake(r, c) {
        this.anim.jump('shk' + r + '_' + c, 1);
        this.anim.set('shk' + r + '_' + c, 0, 1.9);
    }
    /** "Yes!" A bounce — fired when a cat lands somewhere legal. */
    _reactCheer(r, c) {
        this.anim.jump('chr' + r + '_' + c, 1);
        this.anim.set('chr' + r + '_' + c, 0, 2.6);
    }
    /** "Oh!" A small startle — fired on cats near a move that just happened. */
    _reactStartle(r, c) {
        this.anim.jump('stl' + r + '_' + c, 1);
        this.anim.set('stl' + r + '_' + c, 0, 3.4);
    }
    /** Every cat on the board notices something. */
    _reactAll(kind) {
        const N = exports.NYANDOKU_LEVELS[this._levelIdx].size;
        for (let r = 0; r < N; r++) {
            for (let c = 0; c < N; c++) {
                if (this._grid[r][c] !== CellState.CAT)
                    continue;
                if (kind === 'cheer')
                    this._reactCheer(r, c);
                else
                    this._reactShake(r, c);
            }
        }
    }
    hintText() {
        if (this._conflicts.size)
            return 'Two cats clash — one per row, column and colour';
        if (this._highlightedCell)
            return 'That cell was marked wrong. Tap it to place the cat.';
        return this.meta.hint;
    }
    winBlurb() {
        const bits = [];
        bits.push(this._mistakes === 0 ? 'Flawless board' : this._mistakes + ' slip' + (this._mistakes === 1 ? '' : 's'));
        if (this._hintsUsed)
            bits.push(this._hintsUsed + ' hint' + (this._hintsUsed === 1 ? '' : 's'));
        return bits.join(' · ');
    }
    _validateBoard() {
        this._conflicts.clear();
        const lvl = exports.NYANDOKU_LEVELS[this._levelIdx];
        const N = lvl.size;
        const cats = [];
        for (let r = 0; r < N; r++) {
            for (let c = 0; c < N; c++)
                if (this._grid[r][c] === CellState.CAT)
                    cats.push([r, c]);
        }
        for (let i = 0; i < cats.length; i++) {
            const [r1, c1] = cats[i];
            for (let j = i + 1; j < cats.length; j++) {
                const [r2, c2] = cats[j];
                const clash = r1 === r2 ||
                    c1 === c2 ||
                    lvl.regions[r1][c1] === lvl.regions[r2][c2] ||
                    (Math.abs(r1 - r2) <= 1 && Math.abs(c1 - c2) <= 1);
                if (clash) {
                    this._conflicts.add(r1 + ',' + c1);
                    this._conflicts.add(r2 + ',' + c2);
                }
            }
        }
        // A row sealed with X marks and no cat can never be solved — point at the fix.
        for (let r = 0; r < N; r++) {
            let hasCat = false;
            let hasEmpty = false;
            for (let c = 0; c < N; c++) {
                if (this._grid[r][c] === CellState.CAT)
                    hasCat = true;
                if (this._grid[r][c] === CellState.EMPTY)
                    hasEmpty = true;
            }
            if (!hasCat && !hasEmpty && !this._highlightedCell) {
                const sol = lvl.solution.find(([sr]) => sr === r);
                if (sol) {
                    this._highlightedCell = [sol[0], sol[1]];
                    SoundManager_1.SoundManager.playError();
                }
            }
        }
        // A row or column that has just acquired its single cat gets a sweep of light.
        if (this._conflicts.size === 0) {
            for (let r = 0; r < N; r++) {
                let n = 0;
                for (let c = 0; c < N; c++)
                    if (this._grid[r][c] === CellState.CAT)
                        n++;
                const key = 'r' + r;
                if (n === 1 && !this._satisfied.has(key)) {
                    this._satisfied.add(key);
                    if (this._sweeps.length < 3)
                        this._sweeps.push({ kind: 'row', index: r, t: 0 });
                    for (let c = 0; c < N; c++)
                        if (this._grid[r][c] === CellState.CAT)
                            this._reactCheer(r, c);
                }
                else if (n !== 1) {
                    this._satisfied.delete(key);
                }
            }
            for (let c = 0; c < N; c++) {
                let n = 0;
                for (let r = 0; r < N; r++)
                    if (this._grid[r][c] === CellState.CAT)
                        n++;
                const key = 'c' + c;
                if (n === 1 && !this._satisfied.has(key)) {
                    this._satisfied.add(key);
                    if (this._sweeps.length < 3)
                        this._sweeps.push({ kind: 'col', index: c, t: 0 });
                }
                else if (n !== 1) {
                    this._satisfied.delete(key);
                }
            }
        }
        if (cats.length === N && this._conflicts.size === 0) {
            const regSet = new Set(cats.map(([r, c]) => lvl.regions[r][c]));
            if (regSet.size === N) {
                this._solveT = 0;
                this._reactAll('cheer');
                for (const [r, c] of cats) {
                    const p = this._cellCenter(r, c);
                    this.fx.burst(p.x, p.y, 10, [this.pal.accent, this.pal.accent2, '#FFFFFF'], {
                        speed: 180,
                        size: 5,
                    });
                }
                this.win(this._stars());
            }
        }
    }
    _stars() {
        if (this._mistakes === 0 && this._hintsUsed === 0)
            return 3;
        if (this._mistakes <= 2 && this._hintsUsed <= 1)
            return 2;
        return 1;
    }
    _applyAutoX(r, c) {
        if (!this._autoXEnabled)
            return [];
        const lvl = exports.NYANDOKU_LEVELS[this._levelIdx];
        const N = lvl.size;
        const reg = lvl.regions[r][c];
        const placed = [];
        for (let rr = 0; rr < N; rr++) {
            for (let cc = 0; cc < N; cc++) {
                if (rr === r && cc === c)
                    continue;
                const hit = rr === r ||
                    cc === c ||
                    lvl.regions[rr][cc] === reg ||
                    (Math.abs(rr - r) <= 1 && Math.abs(cc - c) <= 1);
                if (hit && this._grid[rr][cc] === CellState.EMPTY) {
                    this._grid[rr][cc] = CellState.MARK_X;
                    this.anim.jump('m' + rr + '_' + cc, 0);
                    this.anim.set('m' + rr + '_' + cc, 1, 16);
                    placed.push([rr, cc]);
                }
            }
        }
        this._autoXHistory.set(r + ',' + c, placed);
        return placed;
    }
    _revertAutoX(r, c) {
        const key = r + ',' + c;
        const list = this._autoXHistory.get(key);
        if (!list)
            return;
        for (const [rr, cc] of list) {
            if (this._grid[rr][cc] === CellState.MARK_X)
                this._grid[rr][cc] = CellState.EMPTY;
        }
        this._autoXHistory.delete(key);
    }
    _tapCell(r, c) {
        const p = this._cellCenter(r, c);
        if (this._highlightedCell && this._highlightedCell[0] === r && this._highlightedCell[1] === c) {
            this._highlightedCell = null;
            const lvl = exports.NYANDOKU_LEVELS[this._levelIdx];
            for (let rr = 0; rr < lvl.size; rr++) {
                for (let cc = 0; cc < lvl.size; cc++) {
                    if (this._grid[rr][cc] === CellState.ERROR_X)
                        this._grid[rr][cc] = CellState.MARK_X;
                }
            }
            this._placeCat(r, c, p);
            return;
        }
        const cur = this._grid[r][c];
        if (cur === CellState.EMPTY) {
            this._pushUndo(r, c, CellState.EMPTY, null);
            this._grid[r][c] = CellState.MARK_X;
            this._stamp(r, c);
            SoundManager_1.SoundManager.playMarkX();
            (0, GameShell_1.haptic)(6);
        }
        else if (cur === CellState.MARK_X || cur === CellState.ERROR_X) {
            this._placeCat(r, c, p);
            return;
        }
        else {
            this._pushUndo(r, c, CellState.CAT, null);
            this._grid[r][c] = CellState.EMPTY;
            this._revertAutoX(r, c);
            SoundManager_1.SoundManager.playTap(0.85);
            this.fx.puff(p.x, p.y, 5, '#FFFFFF', 12);
        }
        this._afterMove(r, c, p);
    }
    _placeCat(r, c, p) {
        const prev = this._grid[r][c];
        this._grid[r][c] = CellState.CAT;
        this.anim.jump('cat' + r + '_' + c, 0);
        this.anim.set('cat' + r + '_' + c, 1, 13);
        const spread = this._applyAutoX(r, c);
        this._pushUndo(r, c, prev, spread.length ? spread : null);
        const lvl = exports.NYANDOKU_LEVELS[this._levelIdx];
        this.anim.jump('trk' + lvl.regions[r][c], 0);
        this.anim.set('trk' + lvl.regions[r][c], 1, 12);
        this._reactCheer(r, c);
        // Neighbours look over at the new arrival.
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (!dr && !dc)
                    continue;
                const rr = r + dr;
                const cc = c + dc;
                if (rr < 0 || cc < 0 || rr >= lvl.size || cc >= lvl.size)
                    continue;
                if (this._grid[rr][cc] === CellState.CAT)
                    this._reactStartle(rr, cc);
            }
        }
        SoundManager_1.SoundManager.playPlaceCat();
        (0, GameShell_1.haptic)(12);
        this.fx.ring(p.x, p.y, REGION[lvl.regions[r][c] % REGION.length].deep, 30, 0.45);
        this.fx.burst(p.x, p.y, 8, ['#FFFFFF', LightShell_1.LIGHT.gold, REGION[lvl.regions[r][c] % REGION.length].lift], {
            speed: 150,
            size: 4,
        });
        this._afterMove(r, c, p);
    }
    _afterMove(r, c, p) {
        const before = this._conflicts.size;
        this._validateBoard();
        if (this._conflicts.size > 0 && this._conflicts.size !== before) {
            // Every cat caught in the clash shakes its head.
            for (const key of this._conflicts) {
                const parts = key.split(',');
                this._reactShake(parseInt(parts[0], 10), parseInt(parts[1], 10));
            }
            SoundManager_1.SoundManager.playError();
            this._mistakes++;
            this._conflictPulse = 1;
            this.fx.shake(7, 0.26);
            this.fx.popText(p.x, p.y + 34, 'Clash!', Theme_1.T.danger, 30);
            (0, GameShell_1.haptic)([10, 40, 10]);
        }
    }
    _useHint() {
        const lvl = exports.NYANDOKU_LEVELS[this._levelIdx];
        for (const [sr, sc] of lvl.solution) {
            if (this._grid[sr][sc] !== CellState.CAT) {
                for (let c = 0; c < lvl.size; c++) {
                    if (this._grid[sr][c] === CellState.CAT) {
                        this._revertAutoX(sr, c);
                        this._grid[sr][c] = CellState.MARK_X;
                    }
                }
                this._hintsUsed++;
                this._highlightedCell = null;
                const p = this._cellCenter(sr, sc);
                this.fx.popText(p.x, p.y + 40, 'Revealed', Theme_1.T.gold, 30);
                this._placeCat(sr, sc, p);
                return;
            }
        }
    }
    // =================================================================================
    //  Layout — measured off the live stage, so the board is as big as the phone allows
    // =================================================================================
    //  Everything is placed from the top edge down and the bottom edge up; the board
    //  takes whatever is left, capped to a square. On a 20:9 phone that is a board
    //  roughly half again the size of the old fixed-height layout.
    // =================================================================================
    // =================================================================================
    //  Light-skin hooks
    // =================================================================================
    skin() {
        return LightShell_1.SKINS.nyandoku;
    }
    heroArt() {
        return 'sp_cat';
    }
    headerStat() {
        const lvl = exports.NYANDOKU_LEVELS[this._levelIdx];
        let placed = 0;
        for (let r = 0; r < lvl.size; r++) {
            for (let c = 0; c < lvl.size; c++)
                if (this._grid[r][c] === CellState.CAT)
                    placed++;
        }
        return { label: 'Cats', value: placed + '/' + lvl.size };
    }
    rules() {
        return [
            { a: '1 cat per', b: 'colour', icon: 'grid' },
            { a: '1 per row', b: 'and column', icon: 'grid' },
            { a: 'Cats cannot', b: 'touch', icon: 'close' },
        ];
    }
    /** Nyandoku draws its rules as miniature boards rather than generic icons. */
    drawRuleGlyph(g, cx, cy, s, rule) {
        const kind = rule.b === 'colour' ? 'colour' : rule.b === 'touch' ? 'touch' : 'line';
        drawRuleGlyph(g, cx, cy, s, kind);
    }
    dock() {
        const canUndo = this._undo.length > 0;
        return [
            {
                id: 'undo',
                icon: 'undo',
                label: 'Undo',
                dim: !canUndo,
                badge: canUndo ? String(Math.min(99, this._undo.length)) : undefined,
            },
            { id: 'hint', icon: 'bulb', label: 'Hint', tone: 'gold', badge: 'AD', badgeColor: LightShell_1.LIGHT.orange },
            {
                id: 'autox',
                icon: 'grid',
                label: this._autoXEnabled ? 'Auto-X on' : 'Auto-X off',
                tone: this._autoXEnabled ? 'accent' : 'plain',
            },
        ];
    }
    coachUrgent() {
        return this._conflicts.size > 0 || !!this._highlightedCell;
    }
    /** The colour tracker: one chip per region, ticked when its cat is home. */
    stripHeight() {
        return 66;
    }
    drawStrip(g, cy) {
        const lvl = exports.NYANDOKU_LEVELS[this._levelIdx];
        const regions = [];
        for (let r = 0; r < lvl.size; r++) {
            for (let c = 0; c < lvl.size; c++) {
                const reg = lvl.regions[r][c];
                if (regions.indexOf(reg) < 0)
                    regions.push(reg);
            }
        }
        regions.sort((a, b) => a - b);
        const step = Math.min(58, (Theme_1.T.W - 90) / regions.length);
        const w = regions.length * step + 26;
        const h = 66;
        g.setShadow((0, Theme_1.hex)(LightShell_1.LIGHT.shadow, 38), 13, 0, -4);
        g.fillColor = (0, Theme_1.hex)(LightShell_1.LIGHT.card);
        g.roundRect(-w * 0.5, cy - h * 0.5, w, h, h * 0.5);
        g.fill();
        g.clearShadow();
        const done = new Set();
        for (let r = 0; r < lvl.size; r++) {
            for (let c = 0; c < lvl.size; c++) {
                if (this._grid[r][c] === CellState.CAT)
                    done.add(lvl.regions[r][c]);
            }
        }
        for (let i = 0; i < regions.length; i++) {
            const x = -w * 0.5 + 13 + step * (i + 0.5);
            const reg = regions[i];
            const col = REGION[reg % REGION.length];
            const placed = done.has(reg);
            const cs = Math.min(23, step * 0.4);
            g.setFillGradient(0, cy + cs, 0, cy - cs, [
                [0, col.lift],
                [1, col.fill],
            ]);
            g.roundRect(x - cs, cy - cs, cs * 2, cs * 2, cs * 0.6);
            g.fill();
            g.clearFillGradient();
            if (placed) {
                const pop = Theme_1.Ease.outBack((0, Theme_1.clamp01)(this.anim.get('trk' + reg, 1, 12)), 2);
                drawCatHead(g, x, cy, cs * 1.56 * pop, (0, Theme_1.hex)('#FFFFFF'), (0, Theme_1.hex)(col.deep));
                g.fillColor = (0, Theme_1.hex)(LightShell_1.LIGHT.mint);
                g.circle(x + cs * 0.74, cy + cs * 0.74, 10);
                g.fill();
                UI.icon(g, 'check', x + cs * 0.74, cy + cs * 0.74, 13, (0, Theme_1.hex)('#FFFFFF'));
            }
            else {
                drawCatHead(g, x, cy, cs * 1.43, (0, Theme_1.hex)('#FFFFFF', 205), (0, Theme_1.hex)(col.deep, 190));
            }
        }
    }
    get _pitch() {
        return this.lay.board / exports.NYANDOKU_LEVELS[this._levelIdx].size;
    }
    _cellCenter(r, c) {
        const p = this._pitch;
        const half = this.lay.board * 0.5;
        return {
            x: -half + (c + 0.5) * p,
            y: this.lay.boardCY + half - (r + 0.5) * p,
        };
    }
    // =================================================================================
    //  Input
    // =================================================================================
    onFieldDown(x, y) {
        this._dragPainting = false;
        this._lastPaintedKey = '';
        const hit = this._pick(x, y);
        if (!hit)
            return;
        if (this._grid[hit.r][hit.c] === CellState.EMPTY) {
            this._dragPainting = true;
            this._lastPaintedKey = hit.r + ',' + hit.c;
        }
        this._tapCell(hit.r, hit.c);
    }
    onFieldMove(x, y) {
        if (!this._dragPainting)
            return;
        const hit = this._pick(x, y);
        if (!hit)
            return;
        const key = hit.r + ',' + hit.c;
        if (key === this._lastPaintedKey || this._grid[hit.r][hit.c] !== CellState.EMPTY)
            return;
        this._lastPaintedKey = key;
        this._pushUndo(hit.r, hit.c, CellState.EMPTY, null);
        this._grid[hit.r][hit.c] = CellState.MARK_X;
        this._stamp(hit.r, hit.c);
        SoundManager_1.SoundManager.playMarkX();
        this._validateBoard();
    }
    onFieldUp() {
        this._dragPainting = false;
        this._lastPaintedKey = '';
    }
    _pick(x, y) {
        const N = exports.NYANDOKU_LEVELS[this._levelIdx].size;
        const p = this._pitch;
        const half = this.lay.board * 0.5;
        const c = Math.floor((x + half) / p);
        const r = Math.floor((this.lay.boardCY + half - y) / p);
        if (r < 0 || c < 0 || r >= N || c >= N)
            return null;
        return { r, c };
    }
    // =================================================================================
    //  Render — the arcade's one light-themed game
    // =================================================================================
    onTick(dt) {
        this._conflictPulse = Math.max(0, this._conflictPulse - dt * 1.6);
        this._solveT += dt;
        this._enterT += dt;
        for (let i = this._sweeps.length - 1; i >= 0; i--) {
            this._sweeps[i].t += dt;
            if (this._sweeps[i].t > 0.75)
                this._sweeps.splice(i, 1);
        }
    }
    // --- backdrop ---------------------------------------------------------------------
    drawField(g, _dt) {
        this.relayout();
        const lvl = exports.NYANDOKU_LEVELS[this._levelIdx];
        const N = lvl.size;
        const lay = this.lay;
        const pitch = this._pitch;
        const board = lay.board;
        const cy = lay.boardCY;
        const half = board * 0.5;
        const pad = BOARD_PAD;
        // Tray.
        this.drawTray(g, 0, cy, board, board, 30);
        const gap = Math.max(6, pitch * 0.085);
        const s = pitch - gap;
        const rad = Math.max(8, pitch * 0.14);
        for (let r = 0; r < N; r++) {
            for (let c = 0; c < N; c++) {
                const p = this._cellCenter(r, c);
                const col = REGION[lvl.regions[r][c] % REGION.length];
                const st = this._grid[r][c];
                // Staggered entry: the board deals itself in along the diagonal.
                const enter = Theme_1.Ease.outBack((0, Theme_1.clamp01)((this._enterT - (r + c) * 0.035) / 0.34), 1.6);
                if (enter <= 0.01)
                    continue;
                const conflicted = this._conflicts.has(r + ',' + c);
                const shakeX = conflicted ? Math.sin(this.time * 34 + r) * this._conflictPulse * 4 : 0;
                const cs = s * enter;
                const cxp = p.x + shakeX;
                // Tile.
                // Nearly flat — a painted tile, not a plastic gem. Just enough fall-off
                // to give the grid a light source.
                g.setFillGradient(0, p.y + cs * 0.5, 0, p.y - cs * 0.5, [
                    [0, col.lift],
                    [0.42, col.fill],
                    [1, col.mid],
                ]);
                g.roundRect(cxp - cs * 0.5, p.y - cs * 0.5, cs, cs, rad);
                g.fill();
                g.clearFillGradient();
                // A single light edge along the top: enough to read as a raised tile.
                g.strokeColor = (0, Theme_1.hex)('#FFFFFF', 70);
                g.lineWidth = 2;
                g.moveTo(cxp - cs * 0.5 + rad * 0.8, p.y + cs * 0.5 - 1.5);
                g.lineTo(cxp + cs * 0.5 - rad * 0.8, p.y + cs * 0.5 - 1.5);
                g.stroke();
                if (st === CellState.MARK_X || st === CellState.ERROR_X) {
                    const k = Theme_1.Ease.outBack((0, Theme_1.clamp01)(this.anim.get('m' + r + '_' + c, 1, 20)), 2.4);
                    const err = st === CellState.ERROR_X;
                    g.save();
                    g.setAlpha((0, Theme_1.clamp01)(k));
                    CocosUIHelpers_1.CocosUIHelpers.drawRoundedX(g, cxp, p.y, cs * 0.92 * (0.6 + k * 0.4), err ? (0, Theme_1.hex)(LightShell_1.LIGHT.red, 245) : (0, Theme_1.hex)('#FFFFFF', 240), Math.max(5, cs * 0.155));
                    g.restore();
                }
                else if (st === CellState.CAT) {
                    const k = (0, Theme_1.clamp01)(this.anim.get('cat' + r + '_' + c, 1, 13));
                    const pop = Theme_1.Ease.outBack(k, 2.6);
                    const seed = r * 7 + c * 13;
                    const phase = seed * 0.37;
                    // --- reactions, read as decaying impulses -------------------------
                    const shake = this.anim.get('shk' + r + '_' + c);
                    const cheer = this.anim.get('chr' + r + '_' + c);
                    const startle = this.anim.get('stl' + r + '_' + c);
                    // --- idle: each cat glances around on its own clock ----------------
                    // A still image reads as alive the moment it moves on a rhythm the
                    // player cannot predict, so every cat gets its own period and offset.
                    const period = 4.2 + (seed % 7) * 0.55;
                    const beat = (this.time + seed * 1.7) % period;
                    const glance = beat < 0.85 ? Math.sin((beat / 0.85) * Math.PI * 2) * 0.075 : 0;
                    const nodBeat = (this.time + seed * 2.3 + period * 0.5) % (period * 1.6);
                    const nod = nodBeat < 0.4 ? Math.sin((nodBeat / 0.4) * Math.PI) : 0;
                    // --- compose -------------------------------------------------------
                    // Head shake is a fast rotation; cheer is a hop with a stretch;
                    // startle is a short upward pop with a wide-eyed squash.
                    const rot = glance +
                        Math.sin(this.time * 26) * 0.3 * shake +
                        Math.sin(this.time * 7) * 0.05 * cheer;
                    const land = 1 - (0, Theme_1.clamp01)((k - 0.15) / 0.5);
                    const hopWin = this.phase === 'won'
                        ? Math.max(0, Math.sin(this._solveT * 5 - (r + c) * 0.45)) * cs * 0.14
                        : 0;
                    const hop = hopWin +
                        Math.abs(Math.sin(this.time * 9)) * cheer * cs * 0.09 +
                        startle * cs * 0.05;
                    // Squash > 1 means wide and short; < 1 means tall and thin.
                    const squash = 1 +
                        Math.sin(land * Math.PI) * 0.22 +
                        startle * 0.1 -
                        cheer * 0.08 -
                        nod * 0.07;
                    const breathe = 1 + Math.sin(this.time * 2.1 + phase) * 0.024;
                    const base = cs * 0.94 * pop * (1 + cheer * 0.06 + startle * 0.04);
                    const cw = base * squash * (2 - breathe);
                    const ch = (base / squash) * breathe;
                    const sway = Math.sin(this.time * 3 + phase) * cs * 0.012 + shake * Math.sin(this.time * 26) * cs * 0.03;
                    const bX = cxp + sway;
                    const bY = p.y + hop - cs * 0.02;
                    // Contact shadow — grounds the cat, and shrinks as it leaves the tile.
                    const lift = (0, Theme_1.clamp01)(hop / (cs * 0.12));
                    g.fillColor = (0, Theme_1.hex)(col.deep, Math.round(95 * pop * (1 - lift * 0.55)));
                    g.ellipse(bX, p.y - cs * 0.34, cw * 0.3 * (1 - lift * 0.18), cs * 0.055);
                    g.fill();
                    // A soft lift of light so a dark cat still reads on a dark tile.
                    g.save();
                    g.setBlend('lighter');
                    g.setFillRadial(bX, bY, 0, cs * 0.52, [
                        [0, (0, Theme_1.rgba)(cheer > 0.05 ? '#FFE9B0' : '#FFFFFF', (0.2 + cheer * 0.3) * pop)],
                        [1, (0, Theme_1.rgba)('#FFFFFF', 0)],
                    ]);
                    g.circle(bX, bY, cs * 0.52);
                    g.fill();
                    g.clearFillGradient();
                    g.restore();
                    if ((0, Art_1.hasArt)('sp_cat')) {
                        g.image('sp_cat', bX, bY, cw, ch, { rotation: rot });
                    }
                    else {
                        CocosUIHelpers_1.CocosUIHelpers.drawTuxedoCat(g, bX, bY, base * breathe, (r + c) % 3 === 0, shake < 0.1);
                    }
                    // Cheer sparkles.
                    if (cheer > 0.25) {
                        g.save();
                        g.setBlend('lighter');
                        for (let i = 0; i < 4; i++) {
                            const a = (i / 4) * Math.PI * 2 + this.time * 2.4;
                            const rad = cs * (0.4 + (1 - cheer) * 0.22);
                            g.fillColor = (0, Theme_1.hex)('#FFE9A8', Math.round(220 * (cheer - 0.25)));
                            g.circle(bX + Math.cos(a) * rad, bY + Math.sin(a) * rad * 0.8, cs * 0.035);
                            g.fill();
                        }
                        g.restore();
                    }
                    if (conflicted) {
                        const pulse = 0.55 + this._conflictPulse * 0.45 + Math.sin(this.time * 9) * 0.16;
                        g.strokeColor = (0, Theme_1.hex)(LightShell_1.LIGHT.red, Math.round(230 * (0, Theme_1.clamp01)(pulse)));
                        g.lineWidth = 5;
                        g.roundRect(cxp - cs * 0.5, p.y - cs * 0.5, cs, cs, rad);
                        g.stroke();
                        // A cross above the head while it shakes: unmistakable feedback.
                        if (shake > 0.15) {
                            g.save();
                            g.setAlpha((0, Theme_1.clamp01)(shake * 1.6));
                            g.fillColor = (0, Theme_1.hex)(LightShell_1.LIGHT.red);
                            g.circle(bX, p.y + cs * 0.44, cs * 0.12);
                            g.fill();
                            UI.icon(g, 'close', bX, p.y + cs * 0.44, cs * 0.14, (0, Theme_1.hex)('#FFFFFF'));
                            g.restore();
                        }
                    }
                }
                // Hint target.
                if (this._highlightedCell && this._highlightedCell[0] === r && this._highlightedCell[1] === c) {
                    const pulse = (Math.sin(this.time * 6) + 1) * 0.5;
                    g.strokeColor = (0, Theme_1.hex)(LightShell_1.LIGHT.gold, Math.round(190 + pulse * 65));
                    g.lineWidth = 5;
                    g.roundRect(cxp - cs * 0.5 - 3, p.y - cs * 0.5 - 3, cs + 6, cs + 6, rad + 3);
                    g.stroke();
                }
            }
        }
        // Line-complete sweeps: a band of light runs down the row or column the player
        // just finished. It is the cheapest way to say "that deduction was right".
        for (const sw of this._sweeps) {
            const k = (0, Theme_1.clamp01)(sw.t / 0.75);
            const a = Math.sin(k * Math.PI);
            g.save();
            g.roundRect(-half, cy - half, board, board, 4);
            g.clip();
            g.setBlend('lighter');
            if (sw.kind === 'row') {
                const y = cy + half - (sw.index + 0.5) * pitch;
                const x = -half + k * board;
                g.setFillGradient(x - pitch * 0.7, 0, x + pitch * 0.7, 0, [
                    [0, (0, Theme_1.rgba)('#FFFFFF', 0)],
                    [0.5, (0, Theme_1.rgba)('#FFFFFF', 0.34 * a)],
                    [1, (0, Theme_1.rgba)('#FFFFFF', 0)],
                ]);
                g.rect(x - pitch * 0.7, y - pitch * 0.5, pitch * 1.4, pitch);
            }
            else {
                const x = -half + (sw.index + 0.5) * pitch;
                const y = cy + half - k * board;
                g.setFillGradient(0, y + pitch * 0.7, 0, y - pitch * 0.7, [
                    [0, (0, Theme_1.rgba)('#FFFFFF', 0)],
                    [0.5, (0, Theme_1.rgba)('#FFFFFF', 0.34 * a)],
                    [1, (0, Theme_1.rgba)('#FFFFFF', 0)],
                ]);
                g.rect(x - pitch * 0.5, y - pitch * 0.7, pitch, pitch * 1.4);
            }
            g.fill();
            g.clearFillGradient();
            g.restore();
        }
    }
}
exports.NyandokuGame = NyandokuGame;
/** Padding between the board's white tray and the grid inside it. */
const BOARD_PAD = 14;
/** Region colours — nine, so even a 9x9 board never repeats a colour. */
const REGION = [
    { fill: '#F0A3C0', lift: '#F7BBD2', mid: '#E892B1', deep: '#CF6D95' },
    { fill: '#49C2B1', lift: '#6DD6C7', mid: '#3BB2A1', deep: '#28968A' },
    { fill: '#B07346', lift: '#C68A5C', mid: '#A1663B', deep: '#84502C' },
    { fill: '#E0B842', lift: '#EFCF66', mid: '#D2A930', deep: '#B38C1F' },
    { fill: '#ABDE88', lift: '#C2EBA5', mid: '#9BD176', deep: '#7CB75B' },
    { fill: '#9163F2', lift: '#AC89F7', mid: '#8352E6', deep: '#6A3CCC' },
    { fill: '#5FABEA', lift: '#86C3F2', mid: '#4E9BDD', deep: '#3A82C2' },
    { fill: '#EE8E4F', lift: '#F5A972', mid: '#DE7C3C', deep: '#BC6228' },
    { fill: '#8C9CC4', lift: '#A8B5D6', mid: '#7A8AB4', deep: '#616F96' }, // slate
];
function drawCatHead(g, cx, cy, s, fill, detail) {
    g.fillColor = fill;
    // Ears.
    g.moveTo(cx - s * 0.42, cy + s * 0.12);
    g.lineTo(cx - s * 0.34, cy + s * 0.56);
    g.lineTo(cx - s * 0.06, cy + s * 0.3);
    g.close();
    g.fill();
    g.moveTo(cx + s * 0.42, cy + s * 0.12);
    g.lineTo(cx + s * 0.34, cy + s * 0.56);
    g.lineTo(cx + s * 0.06, cy + s * 0.3);
    g.close();
    g.fill();
    // Head.
    g.ellipse(cx, cy - s * 0.04, s * 0.46, s * 0.4);
    g.fill();
    if (detail.a > 0) {
        g.fillColor = detail;
        g.circle(cx - s * 0.17, cy + s * 0.02, s * 0.065);
        g.fill();
        g.circle(cx + s * 0.17, cy + s * 0.02, s * 0.065);
        g.fill();
        g.ellipse(cx, cy - s * 0.13, s * 0.055, s * 0.04);
        g.fill();
        g.strokeColor = detail;
        g.lineWidth = Math.max(1.2, s * 0.028);
        for (const dir of [-1, 1]) {
            g.moveTo(cx + dir * s * 0.2, cy - s * 0.1);
            g.lineTo(cx + dir * s * 0.44, cy - s * 0.16);
            g.moveTo(cx + dir * s * 0.2, cy - s * 0.05);
            g.lineTo(cx + dir * s * 0.45, cy - s * 0.02);
        }
        g.stroke();
    }
}
/** The taiyaki fish that stands in for a star. Drawn nose-right, tail-left. */ function drawRuleGlyph(g, cx, cy, s, kind) {
    const cell = s / 3;
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            const x = cx - s * 0.5 + cell * (c + 0.5);
            const y = cy + s * 0.5 - cell * (r + 0.5);
            let tint = '#F2E6DD';
            if (kind === 'colour')
                tint = c === 1 ? '#F0A3C0' : '#F2E6DD';
            if (kind === 'line')
                tint = r === 1 || c === 1 ? '#BFDFF6' : '#F2E6DD';
            if (kind === 'touch')
                tint = (r === 0 && c === 0) || (r === 1 && c === 1) ? '#FAC9D4' : '#F2E6DD';
            g.fillColor = (0, Theme_1.hex)(tint);
            g.roundRect(x - cell * 0.44, y - cell * 0.44, cell * 0.88, cell * 0.88, 2.5);
            g.fill();
        }
    }
    // The cats the rule is about.
    const cats = {
        colour: [[1, 1]],
        line: [[1, 1]],
        touch: [
            [0, 0],
            [1, 1],
        ],
    };
    for (const [r, c] of cats[kind]) {
        const x = cx - s * 0.5 + cell * (c + 0.5);
        const y = cy + s * 0.5 - cell * (r + 0.5);
        drawCatHead(g, x, y, cell * 0.92, (0, Theme_1.hex)('#4A2F2A', 235), (0, Theme_1.hex)('#4A2F2A', 0));
    }
    if (kind === 'touch') {
        const x0 = cx - s * 0.5 + cell * 0.5;
        const y0 = cy + s * 0.5 - cell * 0.5;
        g.strokeColor = (0, Theme_1.hex)('#F0536B', 240);
        g.lineWidth = 2.8;
        g.moveTo(x0 - cell * 0.34, y0 + cell * 0.34);
        g.lineTo(x0 + cell * 1.34, y0 - cell * 1.34);
        g.stroke();
    }
}

  };

  // === MODULE: ./games/SaveDogeGame ===
  __modules["./games/SaveDogeGame"] = function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveDogeGame = exports.SAVE_DOGE_LEVELS = void 0;
const cc_1 = require("cc");
const CocosUIHelpers_1 = require("../core/CocosUIHelpers");
const SoundManager_1 = require("../core/SoundManager");
const GameShell_1 = require("../core/GameShell");
const LightShell_1 = require("../core/LightShell");
const Theme_1 = require("../core/Theme");
const UI = require("../core/UIKit");
const Progress_1 = require("../core/Progress");
const Art_1 = require("../core/Art");
exports.SAVE_DOGE_LEVELS = [
    {
        // Exact iconic level from the user's 75.4M-view TikTok screenshot!
        id: 1,
        title: 'Crocodile Lava Pit',
        maxInkLength: 750,
        hives: [{ x: 215, y: 245 }],
        beeCount: 10,
        doges: [{ x: 0, y: 28 }],
        platforms: [
            { x: -245, y: -230, w: 220, h: 160, hasCrocRight: true },
            { x: 245, y: -230, w: 220, h: 160, hasCrocLeft: true },
            { x: 0, y: -115, w: 190, h: 36 },
        ],
        lavaY: -255,
        presetLine: [
            { x: -120, y: -92 },
            { x: -86, y: -92 },
            { x: -82, y: 40 },
            { x: -64, y: 105 },
            { x: 0, y: 125 },
            { x: 64, y: 105 },
            { x: 82, y: 40 },
            { x: 86, y: -92 },
            { x: 120, y: -92 },
        ],
    },
    {
        id: 2,
        title: 'Twin Hives Ambush',
        maxInkLength: 820,
        hives: [
            { x: -220, y: 250 },
            { x: 220, y: 250 },
        ],
        beeCount: 12,
        doges: [{ x: 0, y: -10 }],
        platforms: [{ x: 0, y: -155, w: 340, h: 44 }],
        lavaY: -265,
        presetLine: [
            { x: -135, y: -130 },
            { x: -115, y: 65 },
            { x: 0, y: 115 },
            { x: 115, y: 65 },
            { x: 135, y: -130 },
        ],
    },
    {
        id: 3,
        title: 'High Pillar Balance',
        maxInkLength: 780,
        hives: [{ x: 0, y: 285 }],
        beeCount: 11,
        doges: [{ x: 0, y: 75 }],
        platforms: [{ x: 0, y: -95, w: 130, h: 210 }],
        lavaY: -265,
        presetLine: [
            { x: -72, y: -60 },
            { x: -95, y: 80 },
            { x: 0, y: 175 },
            { x: 95, y: 80 },
            { x: 72, y: -60 },
        ],
    },
    {
        id: 4,
        title: 'Double Doge Twins',
        maxInkLength: 960,
        hives: [{ x: 0, y: 275 }],
        beeCount: 13,
        doges: [
            { x: -115, y: -5 },
            { x: 115, y: -5 },
        ],
        platforms: [{ x: 0, y: -145, w: 460, h: 44 }],
        lavaY: -265,
        presetLine: [
            { x: -195, y: -120 },
            { x: -185, y: 85 },
            { x: 0, y: 115 },
            { x: 185, y: 85 },
            { x: 195, y: -120 },
        ],
    },
    {
        id: 5,
        title: 'Mega Swarm Bridge',
        maxInkLength: 900,
        hives: [
            { x: -190, y: 265 },
            { x: 190, y: 265 },
        ],
        beeCount: 15,
        doges: [{ x: 0, y: 15 }],
        platforms: [
            { x: -210, y: -140, w: 150, h: 40 },
            { x: 210, y: -140, w: 150, h: 40 },
            { x: 0, y: -120, w: 150, h: 34 },
        ],
        lavaY: -265,
        presetLine: [
            { x: -180, y: -118 },
            { x: -110, y: 105 },
            { x: 0, y: 135 },
            { x: 110, y: 105 },
            { x: 180, y: -118 },
        ],
    },
];
// =====================================================================================
//  Save Doge — one-line physics defence, rebuilt on the shared GameShell.
// =====================================================================================
//  The simulation is unchanged: a drawn barrier is a rigid body that falls, rests on
//  platforms and deflects bees for six seconds. What is new is the staging — a lit
//  canyon over a molten pit, an energy-barrier brush with a real ink budget, a
//  countdown ring, and reactions on every impact.
// =====================================================================================
// -------------------------------------------------------------------------------------
//  World→stage transform
// -------------------------------------------------------------------------------------
//  Level data was authored in its own space, roughly 680 x 664 around the origin. These
//  used to be constants, which is exactly why the canyon sat in the middle of the
//  screen with dead space above and below it. They are now recomputed from the live
//  layout every frame, so the canyon grows to whatever the device gives us.
// -------------------------------------------------------------------------------------
const WORLD_W = 680;
const WORLD_TOP = 392;
const WORLD_BOTTOM = -272;
function deadBarrier() {
    return { cx: 0, cy: 0, a: 0, vx: 0, vy: 0, w: 0, im: 0, ii: 0, live: false, calm: 0 };
}
/** Half-thickness of the painted stroke, used for every contact test. */
const INK_R = 9;
/** A bee weighs this much next to a line of average length. Tuned by eye, not by biology. */
const BEE_MASS = 0.042;
const GRAVITY = 320;
/** Baumgarte position correction: how hard a contact pushes penetration out, 0..1. */
const CONTACT_BETA = 0.22;
const CONTACT_SLOP = 0.6;
const RESTITUTION = 0.04;
const FRICTION = 0.72;
const SOLVER_PASSES = 5;
/** Doge's mass next to the line's. He is the heavy thing in the hoop, and it shows. */
const DOGE_MASS = 1.7;
/** How much of his drawn size actually collides — the sprite is wider than the pup. */
const DOGE_HULL = 0.66;
/** Grip between fur and ink. High, because a loop has to be able to carry him. */
const DOGE_GRIP = 0.95;
const X = { s: 0.95, oy: 35 };
const toStageX = (x) => x * X.s;
const toStageY = (y) => y * X.s + X.oy;
const toWorldX = (x) => x / X.s;
const toWorldY = (y) => (y - X.oy) / X.s;
/** Fit the authored world into the field box the shell reserved. */
function fitWorld(fieldW, fieldH, fieldCY) {
    const worldH = WORLD_TOP - WORLD_BOTTOM;
    X.s = Math.min(fieldW / WORLD_W, fieldH / worldH);
    X.oy = fieldCY - ((WORLD_TOP + WORLD_BOTTOM) * 0.5) * X.s;
}
class SaveDogeGame extends LightShell_1.LightShell {
    get meta() {
        return {
            id: 'savedoge',
            title: 'Save Doge',
            eyebrow: '畫線救狗',
            levelCount: exports.SAVE_DOGE_LEVELS.length,
            howTo: [
                'Drag one continuous line to build a barrier.',
                'Let go and the swarm pours out of the hive.',
                'Keep Doge unstung for six seconds to win.',
            ],
            hint: 'Drag one line to shield Doge · release to start the swarm',
        };
    }
    constructor(parent, onBackToHub) {
        super(parent, onBackToHub, 'savedoge');
        this._levelIdx = 0;
        this._sim = 'draw';
        this._linePts = [];
        /** Stroke points relative to the body's centre of mass, fixed once it goes live. */
        this._local = [];
        /** Those same points pushed back out into world space for the current pose. */
        this._world = [];
        this._bar = deadBarrier();
        this._inkUsed = 0;
        this._isDrawing = false;
        this._countdown = 6.0;
        this._doges = [];
        this._bees = [];
        this._impacts = [];
        this._shieldFlash = 0;
        /** Last position each Doge was safely supported at, used by a rewarded revive. */
        this._safeSpots = [];
        this._invuln = 0;
        this.loadLevel(Math.min(Progress_1.Progress.unlocked('savedoge'), exports.SAVE_DOGE_LEVELS.length - 1));
    }
    // =================================================================================
    //  Rules
    // =================================================================================
    onLoadLevel(i) {
        this._levelIdx = i;
        const lvl = exports.SAVE_DOGE_LEVELS[i];
        this._sim = 'draw';
        this._linePts = [];
        this._local = [];
        this._world = [];
        this._bar = deadBarrier();
        this._inkUsed = 0;
        this._isDrawing = false;
        this._countdown = 6.0;
        this._impacts = [];
        this._shieldFlash = 0;
        this._doges = lvl.doges.map((d) => ({ x: d.x, y: d.y, vx: 0, vy: 0, r: 44, stung: false }));
        this._safeSpots = lvl.doges.map((d) => ({ x: d.x, y: d.y }));
        this._invuln = 0;
        this._bees = [];
    }
    // --- rewarded revive ---------------------------------------------------------------
    canRevive() {
        // Only worth offering mid-run: there is nothing to resume from in the draw phase.
        return this._sim === 'running' && this._countdown > 0.4;
    }
    /**
     * Put Doge back on his last safe ledge, blow the swarm back to the hives and grant
     * a moment of invulnerability. The clock keeps its remaining time, so the ad buys a
     * genuine second chance rather than a restart.
     */
    onRevive() {
        const lvl = exports.SAVE_DOGE_LEVELS[this._levelIdx];
        for (let i = 0; i < this._doges.length; i++) {
            const d = this._doges[i];
            const safe = this._safeSpots[i] || { x: d.x, y: d.y };
            d.x = safe.x;
            d.y = safe.y;
            d.vx = 0;
            d.vy = 0;
            d.stung = false;
            this.fx.ring(toStageX(d.x), toStageY(d.y), this.pal.accent2, 60, 0.7);
        }
        for (const b of this._bees) {
            const hive = lvl.hives[0];
            b.x = hive.x + (Math.random() - 0.5) * 90;
            b.y = hive.y + (Math.random() - 0.5) * 60;
            b.vx = 0;
            b.vy = 0;
        }
        // Re-drop the stroke exactly as it was drawn, so the second chance is a real one
        // even if the swarm had already shoved the shield into the pit.
        this._buildBarrier();
        this._invuln = 1.6;
        this._countdown = Math.max(this._countdown, 1.2);
        this._sim = 'running';
    }
    levelName() {
        return exports.SAVE_DOGE_LEVELS[this._levelIdx].title;
    }
    stats() {
        const lvl = exports.SAVE_DOGE_LEVELS[this._levelIdx];
        const inkLeft = Math.max(0, 1 - this._inkUsed / lvl.maxInkLength);
        return [
            {
                label: 'Hold',
                value: this._countdown.toFixed(1) + 's',
                tint: this._countdown < 2 ? Theme_1.T.mint : this.pal.accent2,
            },
            {
                label: 'Ink',
                value: Math.round(inkLeft * 100) + '%',
                tint: inkLeft < 0.2 ? Theme_1.T.danger : Theme_1.T.cyan,
            },
            { label: 'Swarm', value: String(this._bees.length || lvl.beeCount), icon: 'bolt', tint: Theme_1.T.gold },
        ];
    }
    // =================================================================================
    //  Light-skin hooks
    // =================================================================================
    skin() {
        return LightShell_1.SKINS.savedoge;
    }
    heroArt() {
        return 'sp_doge';
    }
    /** The canyon paints its own backdrop, so no white tray and no square crop. */
    fieldAspect() {
        return 'fill';
    }
    wantsTray() {
        return false;
    }
    relayout() {
        super.relayout();
        fitWorld(this.lay.fieldW, this.lay.fieldH, this.lay.fieldCY);
    }
    headerStat() {
        return { label: 'Hold', value: this._countdown.toFixed(1) + 's' };
    }
    rules() {
        return [
            { a: 'Draw a line', b: 'with your finger', icon: 'pencil' },
            { a: 'It is a real', b: 'rigid body', icon: 'bolt' },
            { a: 'Keep Doge', b: 'safe for 6s', icon: 'check' },
        ];
    }
    dock() {
        return [
            { id: 'redraw', icon: 'restart', label: 'Clear', dim: this._linePts.length === 0 && this._sim === 'draw' },
            {
                id: 'autoshield',
                icon: 'bulb',
                label: 'Shield',
                tone: 'gold',
                badge: 'AD',
                badgeColor: LightShell_1.LIGHT.orange,
            },
        ];
    }
    coachUrgent() {
        return this._sim === 'running' && this._countdown < 2.5;
    }
    actions() {
        // The light skin draws its own dock; the shared action bar stays empty.
        return [];
    }
    _unusedActions() {
        if (this._sim === 'running') {
            return [{ id: 'redraw', x: 0, y: 0, w: 300, h: 74, label: 'Redraw Line', icon: 'restart', tone: 'ghost' }];
        }
        return [
            { id: 'redraw', x: 0, y: 0, w: 212, h: 74, label: 'Clear', icon: 'restart', tone: 'ghost' },
            { id: 'autoshield', x: 0, y: 0, w: 248, h: 74, label: 'Auto-Shield', icon: 'video', tone: 'gold' },
        ];
    }
    onAction(id) {
        if (id === 'redraw') {
            this.restart();
            return;
        }
        if (id === 'autoshield') {
            this.watchAdFor('Watch a short ad for a perfect shield', () => this._applyPresetShield());
        }
    }
    hintText() {
        if (this._sim === 'running')
            return 'Hold on — the barrier is a real rigid body, it can tip over';
        if (this._linePts.length)
            return 'Lift your finger to release the swarm';
        return this.meta.hint;
    }
    winBlurb() {
        const lvl = exports.SAVE_DOGE_LEVELS[this._levelIdx];
        return 'Shield held · ' + Math.round((this._inkUsed / lvl.maxInkLength) * 100) + '% of your ink used';
    }
    /** Rewarded-ad payoff: draws the designer's own solution and runs it. */
    applyPresetShieldAndRun() {
        this._applyPresetShield();
    }
    _applyPresetShield() {
        const lvl = exports.SAVE_DOGE_LEVELS[this._levelIdx];
        this.onLoadLevel(this._levelIdx);
        const dense = [];
        for (let i = 0; i < lvl.presetLine.length - 1; i++) {
            const a = lvl.presetLine[i];
            const b = lvl.presetLine[i + 1];
            for (let s = 0; s < 8; s++) {
                const t = s / 8;
                dense.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
            }
        }
        dense.push({ ...lvl.presetLine[lvl.presetLine.length - 1] });
        this._linePts = dense;
        this._inkUsed = 340;
        this._release();
    }
    _release() {
        if (this._sim !== 'draw')
            return;
        this._sim = 'running';
        this._buildBarrier();
        this._countdown = 6.0;
        const lvl = exports.SAVE_DOGE_LEVELS[this._levelIdx];
        this._bees = [];
        for (let i = 0; i < lvl.beeCount; i++) {
            const hive = lvl.hives[i % lvl.hives.length];
            const a = (i / lvl.beeCount) * Math.PI * 2;
            this._bees.push({
                x: hive.x + Math.cos(a) * 18,
                y: hive.y + Math.sin(a) * 18,
                vx: (Math.random() - 0.5) * 120,
                vy: -80 - Math.random() * 80,
                r: 16,
                phase: Math.random() * 6.28,
                targetDogeIdx: i % this._doges.length,
            });
            const h = this._hiveStage(hive);
            this.fx.burst(h.x, h.y, 3, [Theme_1.T.gold, '#FFE08A'], { speed: 120, size: 4, life: 0.4 });
        }
        SoundManager_1.SoundManager.playTap(1.2);
        this.fx.shake(5, 0.3);
        (0, GameShell_1.haptic)(16);
    }
    // =================================================================================
    //  Barrier physics
    // =================================================================================
    /**
     * Freeze the drawn stroke into a body. Mass comes from ink spent and inertia from how
     * far that ink sits from the centre, so the body behaves like the shape on screen.
     */
    _buildBarrier() {
        const pts = this._linePts;
        this._local = [];
        this._world = [];
        if (pts.length < 2) {
            this._bar = deadBarrier();
            return;
        }
        let sx = 0;
        let sy = 0;
        for (const p of pts) {
            sx += p.x;
            sy += p.y;
        }
        const cx = sx / pts.length;
        const cy = sy / pts.length;
        const mass = Math.max(0.8, this._inkUsed / 260);
        let r2 = 0;
        for (const p of pts) {
            const lx = p.x - cx;
            const ly = p.y - cy;
            this._local.push({ x: lx, y: ly });
            this._world.push({ x: p.x, y: p.y });
            r2 += lx * lx + ly * ly;
        }
        // Radius of gyration, floored so a dot-sized scribble cannot spin like a top.
        r2 = Math.max(900, r2 / pts.length);
        this._bar = {
            cx,
            cy,
            a: 0,
            vx: 0,
            vy: 0,
            w: 0,
            im: 1 / mass,
            ii: 1 / (mass * r2),
            live: true,
            calm: 0,
        };
    }
    /** Push the local points back out through the current pose. */
    _syncBarrier() {
        const b = this._bar;
        const ca = Math.cos(b.a);
        const sa = Math.sin(b.a);
        for (let i = 0; i < this._local.length; i++) {
            const l = this._local[i];
            const o = this._world[i];
            o.x = b.cx + l.x * ca - l.y * sa;
            o.y = b.cy + l.x * sa + l.y * ca;
        }
    }
    /** Velocity of the material point of the body that currently sits at (px, py). */
    _pointVel(px, py) {
        const b = this._bar;
        if (!b.live)
            return { x: 0, y: 0 };
        return { x: b.vx - b.w * (py - b.cy), y: b.vy + b.w * (px - b.cx) };
    }
    /** Apply impulse (jx, jy) at world point (px, py): linear *and* angular. */
    _hitBarrier(px, py, jx, jy) {
        const b = this._bar;
        if (!b.live)
            return;
        const rx = px - b.cx;
        const ry = py - b.cy;
        b.vx += jx * b.im;
        b.vy += jy * b.im;
        b.w += (rx * jy - ry * jx) * b.ii;
        b.calm = 0;
    }
    /** Integrate, then solve every contact the stroke makes with the level geometry. */
    _stepBarrier(lvl, sdt) {
        const b = this._bar;
        if (!b.live)
            return;
        b.vy -= GRAVITY * sdt;
        b.vx *= 0.995;
        b.vy *= 0.999;
        b.w *= 0.986;
        b.cx += b.vx * sdt;
        b.cy += b.vy * sdt;
        b.a += b.w * sdt;
        this._syncBarrier();
        // Dropped it in the pit: the shield is gone and Doge is on his own.
        if (b.cy < lvl.lavaY - 40) {
            b.live = false;
            this.fx.burst(toStageX(b.cx), toStageY(lvl.lavaY), 14, ['#FF8A3D', Theme_1.T.gold], {
                speed: 190,
                size: 6,
            });
            SoundManager_1.SoundManager.playTap(0.6);
            return;
        }
        this._settleBarrier(lvl, sdt);
    }
    /**
     * Solve the barrier against the level. Split out from the integration step because it
     * has to run a second time once Doge's weight is resting inside the loop — otherwise
     * the line sags through the ledge it is standing on for a frame every time he lands.
     */
    _settleBarrier(lvl, sdt) {
        const b = this._bar;
        if (!b.live)
            return;
        const contacts = this._barrierContacts(lvl);
        if (contacts.length === 0) {
            b.calm = 0;
            return;
        }
        const inv = 1 / Math.max(sdt, 1e-4);
        for (let pass = 0; pass < SOLVER_PASSES; pass++) {
            for (const c of contacts) {
                const rx = c.px - b.cx;
                const ry = c.py - b.cy;
                const rn = rx * c.ny - ry * c.nx;
                const denom = b.im + b.ii * rn * rn;
                if (denom <= 0)
                    continue;
                const vpx = b.vx - b.w * ry;
                const vpy = b.vy + b.w * rx;
                const vn = vpx * c.nx + vpy * c.ny;
                // Baumgarte bias: penetration is paid back through velocity, which keeps
                // a resting line from jittering the way a hard positional shove would.
                const bias = (CONTACT_BETA * Math.max(0, c.pen - CONTACT_SLOP)) * inv;
                const target = -vn * (vn < -40 ? 1 + RESTITUTION : 1) + bias;
                if (target <= 0)
                    continue;
                const j = target / denom;
                this._hitBarrier(c.px, c.py, c.nx * j, c.ny * j);
                // Friction along the surface — without it nothing ever comes to rest on a
                // slope, and a tipped line would skate forever.
                const tx = -c.ny;
                const ty = c.nx;
                const rt = rx * ty - ry * tx;
                const dt2 = b.im + b.ii * rt * rt;
                if (dt2 <= 0)
                    continue;
                const vpx2 = b.vx - b.w * ry;
                const vpy2 = b.vy + b.w * rx;
                const vt = vpx2 * tx + vpy2 * ty;
                let jt = -vt / dt2;
                const cap = FRICTION * j;
                if (jt > cap)
                    jt = cap;
                if (jt < -cap)
                    jt = -cap;
                this._hitBarrier(c.px, c.py, tx * jt, ty * jt);
            }
        }
        // Sleep: below this the body is visually still, and letting it drift costs us
        // nothing but a shimmering line.
        if (Math.abs(b.vx) < 2.5 && Math.abs(b.vy) < 2.5 && Math.abs(b.w) < 0.02) {
            b.calm += sdt;
            if (b.calm > 0.25) {
                b.vx = 0;
                b.vy = 0;
                b.w = 0;
            }
        }
        else {
            b.calm = 0;
        }
        this._syncBarrier();
    }
    /**
     * Doge against the ink. This is what makes a drawn circle a pen rather than a picture:
     * he cannot pass through the stroke, his weight presses on whatever part of it he is
     * standing on, and the grip between them means a loop that rolls takes him with it.
     */
    _resolveDogeBarrier(doge, sdt) {
        const b = this._bar;
        if (!b.live || this._world.length < 2)
            return false;
        const imD = 1 / DOGE_MASS;
        const minD = doge.r * DOGE_HULL + INK_R;
        let carried = false;
        for (let pass = 0; pass < 3; pass++) {
            let touched = false;
            for (let i = 0; i < this._world.length - 1; i++) {
                const a = this._world[i];
                const c = this._world[i + 1];
                const hit = distToSegment(doge.x, doge.y, a.x, a.y, c.x, c.y);
                if (hit.dist >= minD)
                    continue;
                touched = true;
                // He is the one that has to end up outside the stroke, so he takes the
                // whole positional correction; the line is paid in impulse instead.
                const pen = minD - hit.dist;
                doge.x += hit.nx * pen;
                doge.y += hit.ny * pen;
                const cpx = doge.x - hit.nx * minD;
                const cpy = doge.y - hit.ny * minD;
                const pv = this._pointVel(cpx, cpy);
                const rvx = doge.vx - pv.x;
                const rvy = doge.vy - pv.y;
                const vn = rvx * hit.nx + rvy * hit.ny;
                if (vn >= 0)
                    continue;
                const rx = cpx - b.cx;
                const ry = cpy - b.cy;
                const rn = rx * hit.ny - ry * hit.nx;
                const denom = imD + b.im + b.ii * rn * rn;
                if (denom <= 0)
                    continue;
                const j = -(1 + 0.02) * vn / denom;
                doge.vx += j * hit.nx * imD;
                doge.vy += j * hit.ny * imD;
                this._hitBarrier(cpx, cpy, -j * hit.nx, -j * hit.ny);
                // Tangential grip. Without this he slides along the inside of the loop
                // like a bead on a wire instead of riding it.
                const tx = -hit.ny;
                const ty = hit.nx;
                const rt = rx * ty - ry * tx;
                const dt2 = imD + b.im + b.ii * rt * rt;
                if (dt2 <= 0)
                    continue;
                const vt = rvx * tx + rvy * ty;
                let jt = -vt / dt2;
                const cap = DOGE_GRIP * j;
                if (jt > cap)
                    jt = cap;
                if (jt < -cap)
                    jt = -cap;
                doge.vx += jt * tx * imD;
                doge.vy += jt * ty * imD;
                this._hitBarrier(cpx, cpy, -jt * tx, -jt * ty);
                // Resting on the upper side of the stroke counts as solid ground.
                if (hit.ny > 0.35)
                    carried = true;
            }
            if (!touched)
                break;
        }
        return carried;
    }
    /** Every stroke point that is inside a platform or a canyon wall, with its normal. */
    _barrierContacts(lvl) {
        const out = [];
        const wall = WORLD_W * 0.5 - 14;
        for (const p of this._world) {
            for (const plat of lvl.platforms) {
                const hw = plat.w * 0.5 + INK_R;
                const hh = plat.h * 0.5 + INK_R;
                const dx = p.x - plat.x;
                const dy = p.y - plat.y;
                if (Math.abs(dx) >= hw || Math.abs(dy) >= hh)
                    continue;
                const ox = hw - Math.abs(dx);
                const oy = hh - Math.abs(dy);
                // Shallowest axis wins: that is the face it actually came in through.
                if (oy <= ox)
                    out.push({ px: p.x, py: p.y, nx: 0, ny: dy >= 0 ? 1 : -1, pen: oy });
                else
                    out.push({ px: p.x, py: p.y, nx: dx >= 0 ? 1 : -1, ny: 0, pen: ox });
            }
            if (p.x > wall)
                out.push({ px: p.x, py: p.y, nx: -1, ny: 0, pen: p.x - wall });
            else if (p.x < -wall)
                out.push({ px: p.x, py: p.y, nx: 1, ny: 0, pen: -wall - p.x });
        }
        return out;
    }
    _hiveStage(h) {
        return { x: toStageX(h.x), y: toStageY(h.y) };
    }
    _stars() {
        const lvl = exports.SAVE_DOGE_LEVELS[this._levelIdx];
        const frac = this._inkUsed / lvl.maxInkLength;
        if (frac <= 0.45)
            return 3;
        if (frac <= 0.75)
            return 2;
        return 1;
    }
    // =================================================================================
    //  Input
    // =================================================================================
    onFieldDown(x, y) {
        if (this._sim !== 'draw')
            return;
        if (y < -250 || y > 376 || Math.abs(x) > 318)
            return;
        this._isDrawing = true;
        this._linePts = [{ x: toWorldX(x), y: toWorldY(y) }];
        this._inkUsed = 0;
        SoundManager_1.SoundManager.playTap(1.1);
        (0, GameShell_1.haptic)(6);
    }
    onFieldMove(x, y) {
        if (!this._isDrawing || this._sim !== 'draw')
            return;
        const lvl = exports.SAVE_DOGE_LEVELS[this._levelIdx];
        if (this._inkUsed >= lvl.maxInkLength)
            return;
        const wx = Math.max(-315, Math.min(315, toWorldX(x)));
        const wy = Math.max(-265, Math.min(320, toWorldY(y)));
        const last = this._linePts[this._linePts.length - 1];
        const d = Math.hypot(wx - last.x, wy - last.y);
        if (d >= 9) {
            this._inkUsed += d;
            this._linePts.push({ x: wx, y: wy });
        }
    }
    onFieldUp() {
        if (this._isDrawing && this._sim === 'draw') {
            this._isDrawing = false;
            if (this._linePts.length >= 2)
                this._release();
        }
    }
    // =================================================================================
    //  Simulation (unchanged rules)
    // =================================================================================
    onTick(dt) {
        this._shieldFlash = Math.max(0, this._shieldFlash - dt * 3);
        this._invuln = Math.max(0, this._invuln - dt);
        for (let i = this._impacts.length - 1; i >= 0; i--) {
            this._impacts[i].t -= dt;
            if (this._impacts[i].t <= 0)
                this._impacts.splice(i, 1);
        }
        if (this._sim !== 'running')
            return;
        const sdt = Math.min(dt, 0.033);
        const lvl = exports.SAVE_DOGE_LEVELS[this._levelIdx];
        // 1. The barrier is a real rigid body: it falls, tips, spins and settles.
        this._stepBarrier(lvl, sdt);
        // 2. Doges fall, land, and die in the lava.
        for (const doge of this._doges) {
            doge.vy -= 480 * sdt;
            doge.x += doge.vx * sdt;
            doge.y += doge.vy * sdt;
            doge.vx *= 0.94;
            for (const plat of lvl.platforms) {
                const topY = plat.y + plat.h * 0.5;
                if (doge.x >= plat.x - plat.w * 0.5 - doge.r * 0.45 &&
                    doge.x <= plat.x + plat.w * 0.5 + doge.r * 0.45 &&
                    doge.y - doge.r <= topY &&
                    doge.y > plat.y) {
                    doge.y = topY + doge.r;
                    doge.vy = 0;
                    // Standing still on a ledge: remember it for a revive.
                    const idx = this._doges.indexOf(doge);
                    if (idx >= 0)
                        this._safeSpots[idx] = { x: doge.x, y: doge.y };
                }
            }
            // Inside the loop he is the line's problem, and the line is his floor.
            if (this._resolveDogeBarrier(doge, sdt)) {
                const idx = this._doges.indexOf(doge);
                if (idx >= 0)
                    this._safeSpots[idx] = { x: doge.x, y: doge.y };
            }
            if (doge.y - doge.r < lvl.lavaY + 25 && this._invuln <= 0) {
                doge.stung = true;
                this.fx.burst(toStageX(doge.x), toStageY(doge.y), 22, ['#FF8A3D', Theme_1.T.gold, '#FFFFFF'], {
                    speed: 300,
                    size: 9,
                });
                this.lose('Doge fell into the pit');
                return;
            }
        }
        // Doge's weight has just landed somewhere on the line; let the line's own
        // contacts take it before anything is drawn, or it visibly sinks for a frame.
        this._settleBarrier(lvl, sdt);
        // 3. Bees seek Doge and bounce off the barrier.
        for (const bee of this._bees) {
            bee.phase += sdt * 28;
            const target = this._doges[bee.targetDogeIdx % this._doges.length];
            const dx = target.x - bee.x;
            const dy = target.y - bee.y;
            const dist = Math.hypot(dx, dy) || 1;
            bee.vx += (dx / dist) * 520 * sdt + Math.sin(bee.phase * 0.7) * 40 * sdt;
            bee.vy += (dy / dist) * 520 * sdt + Math.cos(bee.phase * 0.9) * 40 * sdt;
            const sp = Math.hypot(bee.vx, bee.vy);
            if (sp > 260) {
                bee.vx = (bee.vx / sp) * 260;
                bee.vy = (bee.vy / sp) * 260;
            }
            bee.x += bee.vx * sdt;
            bee.y += bee.vy * sdt;
            const pts = this._world;
            for (let i = 0; this._bar.live && i < pts.length - 1; i++) {
                const ax = pts[i].x;
                const ay = pts[i].y;
                const bx = pts[i + 1].x;
                const by = pts[i + 1].y;
                const hit = distToSegment(bee.x, bee.y, ax, ay, bx, by);
                const minDist = bee.r + INK_R;
                if (hit.dist < minDist) {
                    const overlap = minDist - hit.dist;
                    bee.x += hit.nx * overlap * 1.1;
                    bee.y += hit.ny * overlap * 1.1;
                    // Closing speed measured against the barrier's own motion, so a bee
                    // chasing a retreating line barely registers.
                    const cpx = bee.x - hit.nx * bee.r;
                    const cpy = bee.y - hit.ny * bee.r;
                    const pv = this._pointVel(cpx, cpy);
                    const dot = (bee.vx - pv.x) * hit.nx + (bee.vy - pv.y) * hit.ny;
                    if (dot < 0) {
                        bee.vx -= 1.85 * dot * hit.nx;
                        bee.vy -= 1.85 * dot * hit.ny;
                        // Equal and opposite: the bee's momentum change, spent on the line
                        // at the point of contact. Off-centre hits spin it.
                        const j = 1.85 * dot * BEE_MASS;
                        this._hitBarrier(cpx, cpy, hit.nx * j, hit.ny * j);
                        // Visible, audible deflection: the player's line doing its job.
                        this._impacts.push({ x: toStageX(bee.x), y: toStageY(bee.y), t: 0.3 });
                        this._shieldFlash = 1;
                        if (Math.random() < 0.3) {
                            this.fx.burst(toStageX(bee.x), toStageY(bee.y), 3, [Theme_1.T.cyan, '#FFFFFF'], {
                                speed: 130,
                                size: 4,
                                life: 0.3,
                            });
                        }
                    }
                }
            }
            if (dist < bee.r + target.r - 8 && this._invuln <= 0) {
                target.stung = true;
                this.fx.burst(toStageX(target.x), toStageY(target.y), 18, [Theme_1.T.danger, Theme_1.T.gold], { speed: 240, size: 7 });
                this.lose('A bee got through');
                return;
            }
        }
        // 4. Survive the clock.
        this._countdown = Math.max(0, this._countdown - sdt);
        if (this._countdown <= 0) {
            for (const d of this._doges) {
                this.fx.burst(toStageX(d.x), toStageY(d.y), 16, [Theme_1.T.mint, Theme_1.T.gold, '#FFFFFF'], { speed: 220, size: 7 });
            }
            this.win(this._stars());
        }
    }
    // =================================================================================
    //  Render
    // =================================================================================
    drawField(g, _dt) {
        const lvl = exports.SAVE_DOGE_LEVELS[this._levelIdx];
        const lavaY = toStageY(lvl.lavaY);
        this._drawCanyon(g, lavaY);
        this._drawLava(g, lavaY);
        for (const p of lvl.platforms)
            this._drawPlatform(g, p);
        this._drawPitGlow(g, lavaY);
        for (const h of lvl.hives)
            this._drawHive(g, h);
        this._drawBarrier(g);
        for (const d of this._doges)
            this._drawDoge(g, d);
        for (const b of this._bees)
            this._drawBee(g, b);
        this._drawImpacts(g);
        if (this._sim === 'running')
            this._drawCountdownRing(g);
        if (this._sim === 'draw') {
            this._drawDropGuide(g);
            this._drawInkMeter(g);
        }
    }
    /** Layered canyon silhouettes give the scene depth behind the play area. */
    _drawCanyon(g, _lavaY) {
        const top = toStageY(WORLD_TOP);
        const bottom = toStageY(WORLD_BOTTOM);
        const halfW = toStageX(WORLD_W * 0.5) - 6;
        g.setShadow((0, Theme_1.hex)(LightShell_1.LIGHT.shadow, 70), 28, 0, -10);
        g.fillColor = (0, Theme_1.hex)('#2A1020');
        g.roundRect(-halfW, bottom, halfW * 2, top - bottom, 34);
        g.fill();
        g.clearShadow();
        g.save();
        g.roundRect(-halfW, bottom, halfW * 2, top - bottom, 34);
        g.clip();
        g.setFillGradient(0, top, 0, bottom, [
            [0, '#4A1E2A'],
            [0.45, '#2A1020'],
            [1, '#160813'],
        ]);
        g.rect(-324, bottom, 648, top - bottom);
        g.fill();
        g.clearFillGradient();
        // Three receding rock walls, each darker and lower than the last.
        const layers = [
            [250, '#3A1726', 1.0],
            [190, '#2A0F1C', 1.35],
            [130, '#1B0914', 1.8],
        ];
        for (const [base, col, freq] of layers) {
            g.fillColor = (0, Theme_1.hex)(col);
            g.moveTo(-324, bottom);
            g.lineTo(-324, base);
            for (let x = -324; x <= 324; x += 36) {
                const n = Math.sin(x * 0.009 * freq) * 34 + Math.sin(x * 0.021 * freq + 1.7) * 18;
                g.lineTo(x, base + n);
            }
            g.lineTo(324, bottom);
            g.close();
            g.fill();
        }
        g.restore();
        // Frame so the field reads as a window into the scene.
        g.strokeColor = new cc_1.Color(255, 255, 255, 26);
        g.lineWidth = 1.6;
        g.roundRect(-324, bottom, 648, top - bottom, 34);
        g.stroke();
    }
    _drawLava(g, lavaY) {
        const bottom = -272;
        const h = lavaY - bottom + 40;
        g.save();
        g.setBlend('lighter');
        g.setFillRadial(0, lavaY, 0, 340, [
            [0, (0, Theme_1.rgba)('#FF7A1A', 0.42)],
            [1, (0, Theme_1.rgba)('#FF7A1A', 0)],
        ]);
        g.ellipse(0, lavaY, 340, 160);
        g.fill();
        g.clearFillGradient();
        g.restore();
        g.setFillGradient(0, lavaY + 18, 0, bottom, [
            [0, '#FFD24D'],
            [0.28, '#FF7A1A'],
            [1, '#8A1A0C'],
        ]);
        g.roundRectEx(-324, bottom, 648, h, [14, 14, 30, 30]);
        g.fill();
        g.clearFillGradient();
        // Molten surface: two offset sine crests reading as flowing rock.
        g.fillColor = (0, Theme_1.hex)('#FFE28A', 170);
        g.moveTo(-324, lavaY + 14);
        for (let x = -324; x <= 324; x += 18) {
            g.lineTo(x, lavaY + 14 + Math.sin(x * 0.02 + this.time * 2.2) * 5 + Math.sin(x * 0.051 - this.time * 1.4) * 3);
        }
        g.lineTo(324, lavaY);
        g.lineTo(-324, lavaY);
        g.close();
        g.fill();
        for (let i = 0; i < 7; i++) {
            const t = (this.time * 0.5 + i * 0.31) % 1;
            const bx = -280 + ((i * 97) % 560);
            const by = lavaY - 30 + t * 44;
            g.fillColor = (0, Theme_1.hex)('#FFF0B8', Math.round(190 * (1 - t)));
            g.circle(bx, by, 3 + (1 - t) * 6);
            g.fill();
        }
    }
    _drawPlatform(g, p) {
        const x = toStageX(p.x);
        const y = toStageY(p.y);
        const w = p.w * X.s;
        const h = p.h * X.s;
        g.setShadow(new cc_1.Color(0, 0, 0, 160), 20, 0, -8);
        g.setFillGradient(0, y + h * 0.5, 0, y - h * 0.5, [
            [0, '#8A5A3C'],
            [0.3, '#5E3A26'],
            [1, '#33200F'],
        ]);
        g.roundRect(x - w * 0.5, y - h * 0.5, w, h, 10);
        g.fill();
        g.clearFillGradient();
        g.clearShadow();
        // Lit stone cap.
        g.setFillGradient(0, y + h * 0.5, 0, y + h * 0.5 - 16, [
            [0, '#B98A5E'],
            [1, '#7A4F33'],
        ]);
        g.roundRectEx(x - w * 0.5, y + h * 0.5 - 16, w, 16, [10, 10, 0, 0]);
        g.fill();
        g.clearFillGradient();
        g.strokeColor = new cc_1.Color(255, 220, 180, 50);
        g.lineWidth = 1.4;
        g.moveTo(x - w * 0.5 + 8, y + h * 0.5 - 1);
        g.lineTo(x + w * 0.5 - 8, y + h * 0.5 - 1);
        g.stroke();
        if (p.hasCrocLeft)
            this._drawCroc(g, x - w * 0.5 + 34 * X.s, y + h * 0.5 + 16, false);
        if (p.hasCrocRight)
            this._drawCroc(g, x + w * 0.5 - 34 * X.s, y + h * 0.5 + 16, true);
    }
    _drawCroc(g, cx, cy, flip) {
        const d = flip ? -1 : 1;
        const bob = Math.sin(this.time * 2 + cx * 0.01) * 2;
        const y = cy + bob;
        g.setFillGradient(0, y + 16, 0, y - 10, [
            [0, '#6FBF5A'],
            [1, '#2E6B29'],
        ]);
        g.ellipse(cx, y, 34, 15);
        g.fill();
        g.ellipse(cx + d * 34, y - 2, 24, 10);
        g.fill();
        g.clearFillGradient();
        // Teeth.
        g.fillColor = (0, Theme_1.hex)('#FFFFFF');
        for (let i = 0; i < 4; i++) {
            const tx = cx + d * (20 + i * 10);
            g.moveTo(tx, y - 6);
            g.lineTo(tx + d * 5, y - 6);
            g.lineTo(tx + d * 2.5, y - 12);
            g.close();
        }
        g.fill();
        g.fillColor = (0, Theme_1.hex)('#F7F3E8');
        g.circle(cx - d * 8, y + 13, 6);
        g.fill();
        g.fillColor = (0, Theme_1.hex)('#1A2A14');
        g.circle(cx - d * 7, y + 13, 3);
        g.fill();
    }
    _drawHive(g, h) {
        const x = toStageX(h.x);
        const sway = Math.sin(this.time * 1.4 + x * 0.01) * 4;
        const y = toStageY(h.y) + sway;
        g.strokeColor = (0, Theme_1.hex)('#6B4A22', 200);
        g.lineWidth = 3;
        g.moveTo(x, y + 26);
        g.lineTo(x - sway * 0.6, 392);
        g.stroke();
        g.save();
        g.setBlend('lighter');
        g.setFillRadial(x, y, 0, 70, [
            [0, (0, Theme_1.rgba)(Theme_1.T.gold, 0.3)],
            [1, (0, Theme_1.rgba)(Theme_1.T.gold, 0)],
        ]);
        g.circle(x, y, 70);
        g.fill();
        g.clearFillGradient();
        g.restore();
        g.setShadow(new cc_1.Color(0, 0, 0, 120), 14, 0, -5);
        g.setFillGradient(0, y + 38, 0, y - 38, [
            [0, '#FFCF5E'],
            [0.5, '#E8A42A'],
            [1, '#9A5F10'],
        ]);
        for (let i = 0; i < 4; i++) {
            g.ellipse(x, y + 22 - i * 15, 40 - i * 5, 13);
        }
        g.fill();
        g.clearFillGradient();
        g.clearShadow();
        // Entrance hole, with bees boiling out of it while the sim runs.
        g.fillColor = (0, Theme_1.hex)('#2E1A08');
        g.ellipse(x, y - 18, 11, 9);
        g.fill();
        if (this._sim === 'running') {
            const p = (Math.sin(this.time * 14) + 1) * 0.5;
            g.save();
            g.setBlend('lighter');
            g.fillColor = (0, Theme_1.hex)(Theme_1.T.gold, Math.round(90 + p * 90));
            g.ellipse(x, y - 18, 13, 11);
            g.fill();
            g.restore();
        }
    }
    /** The player's line: a glowing energy ribbon, not a grey stroke. */
    _drawBarrier(g) {
        const pts = this._bar.live ? this._world : this._linePts;
        if (pts.length < 2)
            return;
        const flash = this._shieldFlash;
        const path = (width) => {
            g.lineWidth = width;
            g.moveTo(toStageX(pts[0].x), toStageY(pts[0].y));
            for (let i = 1; i < pts.length; i++) {
                g.lineTo(toStageX(pts[i].x), toStageY(pts[i].y));
            }
        };
        g.save();
        g.setBlend('lighter');
        g.strokeColor = (0, Theme_1.hex)(Theme_1.T.cyan, Math.round(70 + flash * 120));
        path(26);
        g.stroke();
        g.restore();
        g.setStrokeGradient(-320, 0, 320, 0, [
            [0, '#25F4EE'],
            [0.5, '#8AF9FF'],
            [1, '#4D8BFF'],
        ]);
        path(13);
        g.stroke();
        g.clearStrokeGradient();
        g.strokeColor = new cc_1.Color(255, 255, 255, Math.round(190 + flash * 65));
        path(4.5);
        g.stroke();
    }
    _drawDoge(g, d) {
        const x = toStageX(d.x);
        const y = toStageY(d.y);
        const scared = this._sim === 'running' && this._beeNear(d);
        const mood = d.stung ? 'scared' : this.phase === 'won' ? 'happy' : scared ? 'scared' : 'smirk';
        g.fillColor = new cc_1.Color(0, 0, 0, 90);
        g.ellipse(x, y - d.r * X.s * 0.92, d.r * X.s * 0.8, 9);
        g.fill();
        if (this._invuln > 0) {
            const k = (0, Theme_1.clamp01)(this._invuln / 1.6);
            g.save();
            g.setBlend('lighter');
            g.strokeColor = (0, Theme_1.hex)(this.pal.accent2, Math.round(200 * k * (0.6 + Math.sin(this.time * 14) * 0.4)));
            g.lineWidth = 3;
            g.circle(x, y, d.r * X.s * 1.35);
            g.stroke();
            g.restore();
        }
        if ((0, Art_1.hasArt)('sp_doge')) {
            const bob = this.phase === 'won' ? Math.abs(Math.sin(this.time * 7)) * 8 : 0;
            g.image('sp_doge', x, y + bob, d.r * 2.3 * X.s, d.r * 2.3 * X.s);
        }
        else {
            CocosUIHelpers_1.CocosUIHelpers.drawDogeHead(g, x, y, d.r * X.s, mood);
        }
    }
    _beeNear(d) {
        for (const b of this._bees) {
            if (Math.hypot(b.x - d.x, b.y - d.y) < 150)
                return true;
        }
        return false;
    }
    _drawBee(g, b) {
        const x = toStageX(b.x);
        const y = toStageY(b.y);
        const sp = Math.hypot(b.vx, b.vy);
        // Motion streak sells the speed of the swarm.
        if (sp > 60) {
            g.save();
            g.setBlend('lighter');
            g.strokeColor = (0, Theme_1.hex)(Theme_1.T.gold, 70);
            g.lineWidth = 7;
            g.moveTo(x, y);
            g.lineTo(x - (b.vx / sp) * 22, y - (b.vy / sp) * 22);
            g.stroke();
            g.restore();
        }
        if ((0, Art_1.hasArt)('sp_bee')) {
            g.image('sp_bee', x, y, b.r * 3.1, b.r * 3.1, { rotation: Math.atan2(b.vy, b.vx) * 0.25 });
        }
        else {
            CocosUIHelpers_1.CocosUIHelpers.drawKillerBee(g, x, y, b.r * X.s, b.phase);
        }
    }
    _drawImpacts(g) {
        g.save();
        g.setBlend('lighter');
        for (const im of this._impacts) {
            const k = (0, Theme_1.clamp01)(im.t / 0.3);
            g.strokeColor = (0, Theme_1.hex)(Theme_1.T.cyan, Math.round(220 * k));
            g.lineWidth = 3 * k;
            g.circle(im.x, im.y, 14 + (1 - k) * 26);
            g.stroke();
        }
        g.restore();
    }
    /** Countdown as a ring: readable in peripheral vision while watching the swarm. */
    _drawCountdownRing(g) {
        const cx = 240;
        const cy = 318;
        const r = 38;
        const p = (0, Theme_1.clamp01)(this._countdown / 6);
        const urgent = this._countdown < 2;
        g.fillColor = new cc_1.Color(6, 8, 18, 190);
        g.circle(cx, cy, r + 6);
        g.fill();
        g.strokeColor = new cc_1.Color(255, 255, 255, 36);
        g.lineWidth = 7;
        g.circle(cx, cy, r);
        g.stroke();
        g.save();
        g.setBlend('lighter');
        g.strokeColor = (0, Theme_1.hex)(urgent ? Theme_1.T.mint : this.pal.accent2, 255);
        g.lineWidth = 7;
        g.arc(cx, cy, r, Math.PI * 0.5, Math.PI * 0.5 - (1 - p) * Math.PI * 2, true);
        g.stroke();
        g.restore();
        const pulse = urgent ? 1 + Math.sin(this.time * 11) * 0.07 : 1;
        g.text(this._countdown.toFixed(1), cx, cy, {
            size: 27 * pulse,
            weight: 900,
            family: cc_1.FONT_DISPLAY,
            color: (0, Theme_1.hex)(urgent ? Theme_1.T.mint : Theme_1.T.textHi),
        });
    }
    /** Ink budget shown where the finger is, not buried in the HUD. */
    _drawInkMeter(g) {
        const lvl = exports.SAVE_DOGE_LEVELS[this._levelIdx];
        const left = (0, Theme_1.clamp01)(1 - this._inkUsed / lvl.maxInkLength);
        const y = 356;
        const w = 286;
        const x = -92;
        g.fillColor = new cc_1.Color(6, 8, 18, 170);
        g.roundRect(x - w * 0.5 - 12, y - 22, w + 24, 44, 22);
        g.fill();
        UI.icon(g, 'pencil', x - w * 0.5 + 6, y, 24, (0, Theme_1.hex)(Theme_1.T.cyan));
        UI.progressBar(g, x + 20, y, w - 40, 12, left, {
            from: left < 0.25 ? Theme_1.T.danger : Theme_1.T.cyan,
            to: left < 0.25 ? '#FF9A4D' : '#8AF9FF',
            glow: false,
        });
    }
    /**
     * Heat rising out of the gap between the ledges. Without it the pit reads as a
     * brown wall with a yellow line at the bottom rather than somewhere lethal.
     */
    _drawPitGlow(g, lavaY) {
        const lvl = exports.SAVE_DOGE_LEVELS[this._levelIdx];
        let gapL = -324;
        let gapR = 324;
        for (const p of lvl.platforms) {
            const x = toStageX(p.x);
            const w = p.w * X.s;
            if (x < 0)
                gapL = Math.max(gapL, x + w * 0.5);
            else if (x > 0)
                gapR = Math.min(gapR, x - w * 0.5);
        }
        if (gapR <= gapL)
            return;
        const cx = (gapL + gapR) * 0.5;
        const half = (gapR - gapL) * 0.5;
        g.save();
        g.setBlend('lighter');
        g.setFillGradient(0, lavaY, 0, lavaY + 230, [
            [0, (0, Theme_1.rgba)('#FF8A1A', 0.42)],
            [0.5, (0, Theme_1.rgba)('#FF5A1A', 0.14)],
            [1, (0, Theme_1.rgba)('#FF5A1A', 0)],
        ]);
        g.moveTo(gapL, lavaY);
        g.lineTo(gapR, lavaY);
        g.lineTo(cx + half * 2.1, lavaY + 230);
        g.lineTo(cx - half * 2.1, lavaY + 230);
        g.close();
        g.fill();
        g.clearFillGradient();
        // Embers climbing the shaft.
        for (let i = 0; i < 10; i++) {
            const t = (this.time * 0.34 + i * 0.1) % 1;
            const ex = cx + Math.sin(i * 2.3 + this.time * 1.2) * half * 0.85;
            const ey = lavaY + t * 220;
            g.fillColor = (0, Theme_1.hex)(i % 3 ? '#FFB24D' : '#FFE08A', Math.round(180 * (1 - t) * (1 - t)));
            g.circle(ex, ey, 2 + (1 - t) * 3);
            g.fill();
        }
        g.restore();
    }
    /** During the draw phase Doge hangs in the air; show where gravity will take him. */
    _drawDropGuide(g) {
        for (const d of this._doges) {
            const x = toStageX(d.x);
            const y = toStageY(d.y) - d.r * X.s;
            g.strokeColor = (0, Theme_1.hex)(Theme_1.T.gold, 90);
            g.lineWidth = 2;
            g.setLineDash([7, 9]);
            g.moveTo(x, y - 8);
            g.lineTo(x, y - 74);
            g.stroke();
            g.setLineDash([]);
            g.fillColor = (0, Theme_1.hex)(Theme_1.T.gold, 110);
            g.moveTo(x - 8, y - 74);
            g.lineTo(x + 8, y - 74);
            g.lineTo(x, y - 88);
            g.close();
            g.fill();
        }
    }
}
exports.SaveDogeGame = SaveDogeGame;
function distToSegment(px, py, ax, ay, bx, by) {
    const dx = bx - ax;
    const dy = by - ay;
    const lenSq = dx * dx + dy * dy;
    let t = 0;
    if (lenSq > 0.0001)
        t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lenSq));
    const cx = ax + t * dx;
    const cy = ay + t * dy;
    const vx = px - cx;
    const vy = py - cy;
    const dist = Math.hypot(vx, vy);
    return { dist, nx: dist > 0.001 ? vx / dist : 0, ny: dist > 0.001 ? vy / dist : 1 };
}

  };

  // === MODULE: ./games/AppleWormGame ===
  __modules["./games/AppleWormGame"] = function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppleWormGame = exports.APPLE_WORM_LEVELS = void 0;
const cc_1 = require("cc");
const SoundManager_1 = require("../core/SoundManager");
const GameShell_1 = require("../core/GameShell");
const LightShell_1 = require("../core/LightShell");
const Theme_1 = require("../core/Theme");
const Progress_1 = require("../core/Progress");
const Art_1 = require("../core/Art");
exports.APPLE_WORM_LEVELS = [
    {
        // Inspired by Bottom-Left 17.6M-view screenshot: Brown hook overhang with row of apples
        id: 1,
        code: '关卡: 101',
        title: 'The Overhang Hook (17.6M Hit)',
        themeSky: '#154B9C',
        themeBlock: '#7A3E12',
        map: [
            '..........',
            '....P###..',
            '.......#..',
            '.......#..',
            '.....AA#..',
            '......##..',
            '..AAA.#...',
            '.######...',
            '..........',
            '..........',
        ],
        initialBody: [
            { r: 6, c: 1 },
            { r: 7, c: 0 },
        ],
        solutionDirs: ['R', 'R', 'R', 'R', 'U', 'U', 'L', 'U', 'U', 'U', 'L'],
    },
    {
        // Inspired by Bottom-2nd screenshot ("第 3 关" - Purple "1" pillar + apple stairs)
        id: 2,
        code: '第 3 关',
        title: 'Purple Pillar Bridge',
        themeSky: '#7C8CE8',
        themeBlock: '#4A1259',
        map: [
            '..........',
            '..........',
            '........P.',
            '.......###',
            '.....AA...',
            '..#..#....',
            '.##AA#....',
            '..#..#..SS',
            '..#..#....',
            '..........',
        ],
        initialBody: [
            { r: 5, c: 1 },
            { r: 5, c: 0 },
        ],
        solutionDirs: ['R', 'D', 'R', 'R', 'U', 'U', 'R', 'R', 'U', 'R', 'U', 'R'],
    },
    {
        // Inspired by Bottom-Center screenshot (378.9K views: Apple bridge over spike trench)
        id: 3,
        code: '关卡: 208',
        title: 'Spike Gear Trench',
        themeSky: '#7EC8F8',
        themeBlock: '#6B4423',
        map: [
            '..........',
            '........P.',
            '.......###',
            '......AA..',
            '.....##...',
            '..AAA#SSS.',
            '.#####....',
            '..........',
            '..........',
            '..........',
        ],
        initialBody: [
            { r: 5, c: 1 },
            { r: 6, c: 0 },
        ],
        solutionDirs: ['R', 'R', 'R', 'U', 'U', 'R', 'R', 'U', 'R', 'U', 'R'],
    },
    {
        // Inspired by Top-Right screenshot (637.9K views: Apple fortress box with spikes inside)
        id: 4,
        code: '关卡: 512',
        title: 'Apple Fortress',
        themeSky: '#8AD6F8',
        themeBlock: '#5C2C1D',
        map: [
            '..........',
            '....P.....',
            '...###....',
            '...AAA....',
            '..##S##...',
            '..#AAA#...',
            '..#####...',
            '..........',
            '..........',
            '..........',
        ],
        initialBody: [
            { r: 5, c: 2 },
            { r: 4, c: 1 },
        ],
        solutionDirs: ['R', 'R', 'R', 'U', 'U', 'L', 'L', 'U', 'U', 'R'],
    },
    {
        // Inspired by Center screenshot ("关卡编号: 4064" - Climbing the bright green monolith)
        id: 5,
        code: '关卡编号: 4064',
        title: 'Emerald Monolith 4064',
        themeSky: '#28559A',
        themeBlock: '#2ED12E',
        map: [
            '..........',
            '......P...',
            '.....###..',
            '.....A#...',
            '....AA#...',
            '...###....',
            '..AA#.....',
            '.####..SS.',
            '..........',
            '..........',
        ],
        initialBody: [
            { r: 6, c: 1 },
            { r: 7, c: 0 },
        ],
        solutionDirs: ['R', 'R', 'U', 'U', 'R', 'R', 'U', 'L', 'U', 'U', 'R'],
    },
];
// =====================================================================================
//  Greedy Apple Worm — gravity snake puzzle, rebuilt on the shared GameShell.
// =====================================================================================
//  Same rules: slither, eat to grow, bridge gaps with your own body, reach the portal.
//  New staging: a lit orchard-stone grid, a worm with real segments and eyes that look
//  where it is going, apples that pop, gears that spin, and a portal that pulls.
// =====================================================================================
const GRID = 10;
class AppleWormGame extends LightShell_1.LightShell {
    get meta() {
        return {
            id: 'appleworm',
            title: 'Apple Worm',
            eyebrow: '貪吃蘋果蟲',
            levelCount: exports.APPLE_WORM_LEVELS.length,
            howTo: [
                'Swipe or use the pad to slither one tile at a time.',
                'Eat every apple — each one makes you longer.',
                'A longer body bridges gaps. Reach the portal.',
            ],
            hint: 'Swipe to move · your own body is the bridge',
        };
    }
    constructor(parent, onBackToHub) {
        super(parent, onBackToHub, 'appleworm');
        this._levelIdx = 0;
        this._body = [];
        this._apples = new Set();
        this._history = [];
        this._solutionStepIdx = 0;
        this._moves = 0;
        this._touchStart = null;
        this._dpadPressed = null;
        this._fallFlash = 0;
        this._eatPop = [];
        this.loadLevel(Math.min(Progress_1.Progress.unlocked('appleworm'), exports.APPLE_WORM_LEVELS.length - 1));
    }
    // =================================================================================
    //  Rules
    // =================================================================================
    onLoadLevel(i) {
        this._levelIdx = i;
        const lvl = exports.APPLE_WORM_LEVELS[i];
        this._body = lvl.initialBody.map((p) => ({ r: p.r, c: p.c }));
        this._apples.clear();
        for (let r = 0; r < GRID; r++) {
            for (let c = 0; c < GRID; c++) {
                if (lvl.map[r][c] === 'A')
                    this._apples.add(r + ',' + c);
            }
        }
        this._history = [];
        this._solutionStepIdx = 0;
        this._moves = 0;
        this._fallFlash = 0;
        this._eatPop = [];
    }
    levelName() {
        return exports.APPLE_WORM_LEVELS[this._levelIdx].title.replace(/\s*\([^)]*\)\s*$/, '');
    }
    stats() {
        return [
            { label: 'Length', value: String(this._body.length), tint: this.pal.accent },
            { label: 'Apples', value: String(this._apples.size), icon: 'star', tint: Theme_1.T.danger },
            { label: 'Moves', value: String(this._moves), tint: Theme_1.T.textDim },
        ];
    }
    // =================================================================================
    //  Light-skin hooks
    // =================================================================================
    skin() {
        return LightShell_1.SKINS.appleworm;
    }
    heroArt() {
        return 'sp_apple';
    }
    padBandHeight() {
        return 178;
    }
    headerStat() {
        return { label: 'Apples', value: String(this._apples.size) };
    }
    rules() {
        return [
            { a: 'Eat every', b: 'apple', icon: 'star' },
            { a: 'Longer body', b: 'bridges gaps', icon: 'grid' },
            { a: 'Then reach', b: 'the portal', icon: 'bolt' },
        ];
    }
    dock() {
        const canUndo = this._history.length > 0;
        return [
            {
                id: 'undo',
                icon: 'undo',
                label: 'Undo',
                dim: !canUndo,
                badge: canUndo ? String(Math.min(99, this._history.length)) : undefined,
            },
            { id: 'solve', icon: 'bulb', label: 'Hint', tone: 'gold', badge: 'AD', badgeColor: LightShell_1.LIGHT.orange },
        ];
    }
    coachUrgent() {
        return this._fallFlash > 0.1;
    }
    actions() {
        // The light skin draws its own dock; the shared action bar stays empty.
        return [];
    }
    _unusedActions() {
        return [
            {
                id: 'undo',
                x: 0,
                y: 0,
                w: 196,
                h: 74,
                label: 'Undo',
                icon: 'undo',
                tone: 'ghost',
                disabled: this._history.length === 0,
            },
            { id: 'solve', x: 0, y: 0, w: 220, h: 74, label: 'Hint', icon: 'video', tone: 'gold' },
        ];
    }
    onAction(id) {
        if (id === 'undo') {
            this.undoMove();
            return;
        }
        if (id === 'solve') {
            this.watchAdFor('Watch a short ad for the next move', () => this.playSolutionStep());
        }
    }
    hintText() {
        if (this._apples.size === 0)
            return 'All eaten — now reach the swirling portal';
        return this.meta.hint;
    }
    // --- rewarded revive ---------------------------------------------------------------
    canRevive() {
        // There has to be a move to rewind to.
        return this._history.length > 0;
    }
    /** Rewind the fatal move and hand the board back exactly as it was. */
    onRevive() {
        const snap = this._history.pop();
        if (!snap)
            return;
        this._body = snap.body;
        this._apples = snap.apples;
        const p = this._cellPos(this._body[0].r, this._body[0].c);
        this.fx.ring(p.x, p.y, this.pal.accent, 44, 0.6);
    }
    winBlurb() {
        return this._moves + ' moves · length ' + this._body.length;
    }
    _cellChar(r, c) {
        const lvl = exports.APPLE_WORM_LEVELS[this._levelIdx];
        if (r < 0 || r >= GRID || c < 0 || c >= GRID)
            return '.';
        const ch = lvl.map[r][c];
        if (ch === 'A')
            return this._apples.has(r + ',' + c) ? 'A' : '.';
        return ch;
    }
    _isSolidSupport(r, c) {
        const ch = this._cellChar(r, c);
        return ch === '#' || ch === 'A' || ch === 'P';
    }
    _isWormSupported() {
        for (const seg of this._body) {
            if (this._cellChar(seg.r, seg.c) === 'P')
                return true;
            if (this._isSolidSupport(seg.r + 1, seg.c))
                return true;
        }
        return false;
    }
    moveWorm(dir) {
        if (this.phase !== 'play')
            return;
        const dr = dir === 'U' ? -1 : dir === 'D' ? 1 : 0;
        const dc = dir === 'L' ? -1 : dir === 'R' ? 1 : 0;
        const head = this._body[0];
        const nr = head.r + dr;
        const nc = head.c + dc;
        if (nr < 0 || nr >= GRID || nc < 0 || nc >= GRID || this._cellChar(nr, nc) === '#') {
            this._bump(dir);
            return;
        }
        const eating = this._cellChar(nr, nc) === 'A';
        const checkLen = eating ? this._body.length : this._body.length - 1;
        for (let i = 0; i < checkLen; i++) {
            if (this._body[i].r === nr && this._body[i].c === nc) {
                this._bump(dir);
                return;
            }
        }
        this._history.push({ body: this._body.map((p) => ({ r: p.r, c: p.c })), apples: new Set(this._apples) });
        this._moves++;
        const next = [{ r: nr, c: nc }, ...this._body.map((p) => ({ r: p.r, c: p.c }))];
        if (!eating) {
            next.pop();
            SoundManager_1.SoundManager.playTap(1.05);
            (0, GameShell_1.haptic)(5);
        }
        else {
            this._apples.delete(nr + ',' + nc);
            SoundManager_1.SoundManager.playCrunch();
            (0, GameShell_1.haptic)(14);
            const p = this._cellPos(nr, nc);
            this._eatPop.push({ r: nr, c: nc, t: 0.45 });
            this.fx.burst(p.x, p.y, 14, ['#FF5252', '#FF8A80', Theme_1.T.mint], { speed: 200, size: 6 });
            this.fx.popText(p.x, p.y + 28, '+1', Theme_1.T.mint, 30);
        }
        this._body = next;
        if (this._resolveHazards())
            return;
        // Gravity: the worm falls until something under it holds.
        let drops = 0;
        while (!this._isWormSupported() && drops < 12) {
            drops++;
            for (const seg of this._body)
                seg.r += 1;
            if (this._resolveHazards())
                return;
        }
        if (drops > 0) {
            this._fallFlash = 1;
            this.fx.shake(Math.min(9, 3 + drops), 0.22);
            SoundManager_1.SoundManager.playSlide(false);
        }
    }
    _bump(dir) {
        SoundManager_1.SoundManager.playError();
        this.anim.jump('bump', 1);
        this.anim.set('bump', 0, 9);
        this.anim.jump('bumpdx', dir === 'L' ? -1 : dir === 'R' ? 1 : 0);
        this.anim.jump('bumpdy', dir === 'U' ? 1 : dir === 'D' ? -1 : 0);
        (0, GameShell_1.haptic)(8);
    }
    _resolveHazards() {
        for (const seg of this._body) {
            if (seg.r >= GRID) {
                this.lose('The worm fell into the abyss');
                return true;
            }
            if (this._cellChar(seg.r, seg.c) === 'S') {
                const p = this._cellPos(seg.r, seg.c);
                this.fx.burst(p.x, p.y, 20, [Theme_1.T.danger, '#FFFFFF'], { speed: 260, size: 7 });
                this.lose('Shredded by a spike gear');
                return true;
            }
        }
        const head = this._body[0];
        if (this._cellChar(head.r, head.c) === 'P') {
            const p = this._cellPos(head.r, head.c);
            this.fx.ring(p.x, p.y, this.pal.accent, 50, 0.7);
            this.win(this._stars());
            return true;
        }
        return false;
    }
    _stars() {
        const par = exports.APPLE_WORM_LEVELS[this._levelIdx].solutionDirs.length;
        if (this._moves <= par)
            return 3;
        if (this._moves <= par + 4)
            return 2;
        return 1;
    }
    undoMove() {
        if (!this._history.length)
            return;
        const snap = this._history.pop();
        this._body = snap.body;
        this._apples = snap.apples;
        this.phase = 'play';
        this._moves = Math.max(0, this._moves - 1);
        SoundManager_1.SoundManager.playTap(0.85);
    }
    playSolutionStep() {
        const lvl = exports.APPLE_WORM_LEVELS[this._levelIdx];
        if (this.phase !== 'play' || this._history.length !== this._solutionStepIdx) {
            this.loadLevel(this._levelIdx);
        }
        if (this._solutionStepIdx < lvl.solutionDirs.length) {
            const dir = lvl.solutionDirs[this._solutionStepIdx];
            this._solutionStepIdx++;
            this.moveWorm(dir);
        }
    }
    // =================================================================================
    //  Geometry
    // =================================================================================
    get _boardSize() {
        return this.lay.board;
    }
    get _cell() {
        return this.lay.board / GRID;
    }
    get _boardCY() {
        return this.lay.boardCY;
    }
    _cellPos(r, c) {
        const cell = this._cell;
        const half = (GRID * cell) * 0.5;
        return { x: -half + (c + 0.5) * cell, y: this._boardCY + half - (r + 0.5) * cell };
    }
    // =================================================================================
    //  Input — swipe anywhere on the board, plus a thumb pad
    // =================================================================================
    onFieldDown(x, y) {
        const pad = this._padHit(x, y);
        if (pad) {
            this._dpadPressed = pad;
            this.moveWorm(pad);
            return;
        }
        this._touchStart = { x, y };
    }
    onFieldUp(x, y) {
        this._dpadPressed = null;
        if (!this._touchStart)
            return;
        const dx = x - this._touchStart.x;
        const dy = y - this._touchStart.y;
        this._touchStart = null;
        if (Math.hypot(dx, dy) < 34)
            return;
        if (Math.abs(dx) > Math.abs(dy))
            this.moveWorm(dx > 0 ? 'R' : 'L');
        else
            this.moveWorm(dy > 0 ? 'U' : 'D');
    }
    get _padCenter() {
        return { x: 0, y: this.lay.padCY, r: 36 };
    }
    _padHit(x, y) {
        const p = this._padCenter;
        const dirs = [
            ['U', 0, 1],
            ['D', 0, -1],
            ['L', -1, 0],
            ['R', 1, 0],
        ];
        for (const [id, dx, dy] of dirs) {
            const bx = p.x + dx * p.r * 1.42;
            const by = p.y + dy * p.r * 1.42;
            if (Math.abs(x - bx) <= p.r * 0.72 && Math.abs(y - by) <= p.r * 0.72)
                return id;
        }
        return null;
    }
    // =================================================================================
    //  Render
    // =================================================================================
    onTick(dt) {
        this._fallFlash = Math.max(0, this._fallFlash - dt * 2.4);
        for (let i = this._eatPop.length - 1; i >= 0; i--) {
            this._eatPop[i].t -= dt;
            if (this._eatPop[i].t <= 0)
                this._eatPop.splice(i, 1);
        }
    }
    drawField(g, _dt) {
        const lvl = exports.APPLE_WORM_LEVELS[this._levelIdx];
        const cell = this._cell;
        const board = this._boardSize;
        const cy = this._boardCY;
        const bump = this.anim.get('bump');
        const bx = this.anim.get('bumpdx') * bump * 7;
        const by = this.anim.get('bumpdy') * bump * 7;
        this.drawTray(g, 0, cy, board, board, 30);
        // Faint lattice so empty space still reads as a grid the worm moves on.
        g.strokeColor = (0, Theme_1.hex)(LightShell_1.LIGHT.cardEdge, 190);
        g.lineWidth = 1.4;
        const half = (GRID * cell) * 0.5;
        for (let i = 1; i < GRID; i++) {
            g.moveTo(-half + i * cell, cy - half);
            g.lineTo(-half + i * cell, cy + half);
            g.moveTo(-half, cy - half + i * cell);
            g.lineTo(half, cy - half + i * cell);
        }
        g.stroke();
        // --- terrain -----------------------------------------------------------------
        for (let r = 0; r < GRID; r++) {
            for (let c = 0; c < GRID; c++) {
                const ch = lvl.map[r][c];
                const p = this._cellPos(r, c);
                if (ch === '#')
                    this._drawBlock(g, r, c, p, cell, lvl.themeBlock);
                else if (ch === 'S')
                    this._drawGear(g, p, cell);
                else if (ch === 'P')
                    this._drawPortal(g, p, cell);
            }
        }
        // --- apples ------------------------------------------------------------------
        for (const key of this._apples) {
            const [r, c] = key.split(',').map(Number);
            this._drawApple(g, this._cellPos(r, c), cell);
        }
        for (const e of this._eatPop) {
            const p = this._cellPos(e.r, e.c);
            const k = (0, Theme_1.clamp01)(e.t / 0.45);
            g.save();
            g.setBlend('lighter');
            g.strokeColor = (0, Theme_1.hex)('#FF8A80', Math.round(220 * k));
            g.lineWidth = 3 * k;
            g.circle(p.x, p.y, cell * (0.3 + (1 - k) * 0.6));
            g.stroke();
            g.restore();
        }
        // --- worm --------------------------------------------------------------------
        this._drawWorm(g, cell, bx, by);
        // --- thumb pad ----------------------------------------------------------------
        this._drawPad(g);
    }
    _drawBlock(g, r, c, p, cell, theme) {
        const base = (0, Theme_1.hex)(theme);
        const s = cell;
        const openTop = this._cellChar(r - 1, c) !== '#';
        g.setFillGradient(0, p.y + s * 0.5, 0, p.y - s * 0.5, [
            [0, base.shade(0.1).toCSS()],
            [1, base.shade(-0.42).toCSS()],
        ]);
        g.rect(p.x - s * 0.5, p.y - s * 0.5, s, s);
        g.fill();
        g.clearFillGradient();
        // Grass cap wherever the block is exposed to the sky.
        if (openTop) {
            g.setFillGradient(0, p.y + s * 0.5, 0, p.y + s * 0.5 - s * 0.26, [
                [0, '#6FD36B'],
                [1, '#2F8A47'],
            ]);
            g.rect(p.x - s * 0.5, p.y + s * 0.5 - s * 0.26, s, s * 0.26);
            g.fill();
            g.clearFillGradient();
            g.fillColor = (0, Theme_1.hex)('#9BE564', 150);
            g.rect(p.x - s * 0.5, p.y + s * 0.5 - 3, s, 3);
            g.fill();
        }
        g.strokeColor = new cc_1.Color(0, 0, 0, 60);
        g.lineWidth = 1;
        g.rect(p.x - s * 0.5, p.y - s * 0.5, s, s);
        g.stroke();
    }
    _drawApple(g, p, cell) {
        const bob = Math.sin(this.time * 2.4 + p.x * 0.02) * cell * 0.04;
        const y = p.y + bob;
        const r = cell * 0.33;
        g.save();
        g.setBlend('lighter');
        g.setFillRadial(p.x, y, 0, r * 2.2, [
            [0, (0, Theme_1.rgba)('#FF5252', 0.3)],
            [1, (0, Theme_1.rgba)('#FF5252', 0)],
        ]);
        g.circle(p.x, y, r * 2.2);
        g.fill();
        g.clearFillGradient();
        g.restore();
        if ((0, Art_1.hasArt)('sp_apple')) {
            g.image('sp_apple', p.x, y, cell * 0.92, cell * 0.92);
            return;
        }
        g.setFillRadial(p.x - r * 0.3, y + r * 0.3, 0, r * 1.5, [
            [0, '#FF7B7B'],
            [1, '#C62828'],
        ]);
        g.circle(p.x, y, r);
        g.fill();
        g.clearFillGradient();
        g.strokeColor = (0, Theme_1.hex)('#6D4C41');
        g.lineWidth = Math.max(1.6, cell * 0.045);
        g.moveTo(p.x, y + r * 0.9);
        g.lineTo(p.x + r * 0.16, y + r * 1.5);
        g.stroke();
        g.fillColor = (0, Theme_1.hex)('#7CB342');
        g.ellipse(p.x + r * 0.62, y + r * 1.42, r * 0.44, r * 0.22, 0.5);
        g.fill();
    }
    _drawGear(g, p, cell) {
        const rot = this.time * 1.6;
        const r = cell * 0.4;
        g.save();
        g.setFillGradient(0, p.y + r, 0, p.y - r, [
            [0, '#4A4A52'],
            [1, '#17171C'],
        ]);
        for (let i = 0; i < 8; i++) {
            const a = rot + (i / 8) * Math.PI * 2;
            g.moveTo(p.x + Math.cos(a) * r * 0.75, p.y + Math.sin(a) * r * 0.75);
            g.lineTo(p.x + Math.cos(a + 0.26) * r * 1.3, p.y + Math.sin(a + 0.26) * r * 1.3);
            g.lineTo(p.x + Math.cos(a + 0.52) * r * 0.75, p.y + Math.sin(a + 0.52) * r * 0.75);
            g.close();
        }
        g.circle(p.x, p.y, r * 0.8);
        g.fill();
        g.clearFillGradient();
        g.restore();
        g.fillColor = (0, Theme_1.hex)('#0A0A0D');
        g.circle(p.x, p.y, r * 0.26);
        g.fill();
        g.strokeColor = (0, Theme_1.hex)(Theme_1.T.danger, 120);
        g.lineWidth = 2;
        g.circle(p.x, p.y, r * 0.52);
        g.stroke();
    }
    _drawPortal(g, p, cell) {
        const r = cell * 0.46;
        g.save();
        g.setBlend('lighter');
        g.setFillRadial(p.x, p.y, 0, r * 2.4, [
            [0, (0, Theme_1.rgba)(this.pal.accent, 0.5)],
            [1, (0, Theme_1.rgba)(this.pal.accent, 0)],
        ]);
        g.circle(p.x, p.y, r * 2.4);
        g.fill();
        g.clearFillGradient();
        g.restore();
        if ((0, Art_1.hasArt)('sp_portal')) {
            g.image('sp_portal', p.x, p.y, cell * 1.3, cell * 1.3, { rotation: this.time * 0.9 });
            return;
        }
        for (let i = 0; i < 3; i++) {
            const a = this.time * 2 + (i / 3) * Math.PI * 2;
            g.strokeColor = (0, Theme_1.hex)(i % 2 ? this.pal.accent2 : this.pal.accent, 220);
            g.lineWidth = Math.max(2, cell * 0.08);
            g.arc(p.x, p.y, r * (0.4 + i * 0.26), a, a + Math.PI * 1.1, false);
            g.stroke();
        }
        g.fillColor = (0, Theme_1.hex)('#FFFFFF', 230);
        g.circle(p.x, p.y, r * 0.2);
        g.fill();
    }
    _drawWorm(g, cell, bx, by) {
        const n = this._body.length;
        const rSeg = cell * 0.39;
        // Connective tube first, so segments read as one creature.
        g.setStrokeGradient(0, this._boardCY + 300, 0, this._boardCY - 300, [
            [0, '#2E8B4F'],
            [1, '#6FE08A'],
        ]);
        g.lineWidth = rSeg * 1.75;
        for (let i = 0; i < n; i++) {
            const p = this._cellPos(this._body[i].r, this._body[i].c);
            const x = p.x + (i === 0 ? bx : 0);
            const y = p.y + (i === 0 ? by : 0);
            if (i === 0)
                g.moveTo(x, y);
            else
                g.lineTo(x, y);
        }
        if (n > 1)
            g.stroke();
        g.clearStrokeGradient();
        for (let i = n - 1; i >= 0; i--) {
            const p = this._cellPos(this._body[i].r, this._body[i].c);
            const x = p.x + (i === 0 ? bx : 0);
            const y = p.y + (i === 0 ? by : 0);
            const isHead = i === 0;
            const wobble = Math.sin(this.time * 4 - i * 0.6) * cell * 0.015;
            const rr = (isHead ? rSeg * 1.14 : rSeg) + wobble;
            g.setFillGradient(0, y + rr, 0, y - rr, [
                [0, isHead ? '#A8F58C' : '#7ADB7E'],
                [1, isHead ? '#3FA85C' : '#2E8B4F'],
            ]);
            g.circle(x, y, rr);
            g.fill();
            g.clearFillGradient();
            g.strokeColor = new cc_1.Color(10, 40, 20, 90);
            g.lineWidth = 1.6;
            g.circle(x, y, rr);
            g.stroke();
            if (!isHead) {
                g.fillColor = new cc_1.Color(255, 255, 255, 46);
                g.ellipse(x - rr * 0.26, y + rr * 0.34, rr * 0.34, rr * 0.2, -0.5);
                g.fill();
            }
        }
        // Head: eyes aimed at the last direction of travel.
        const h = this._cellPos(this._body[0].r, this._body[0].c);
        const hx = h.x + bx;
        const hy = h.y + by;
        let dx = 0;
        let dy = 1;
        if (n > 1) {
            const nxt = this._body[1];
            dx = this._body[0].c - nxt.c;
            dy = -(this._body[0].r - nxt.r);
            const m = Math.hypot(dx, dy) || 1;
            dx /= m;
            dy /= m;
        }
        const ex = -dy;
        const ey = dx;
        const eo = rSeg * 0.42;
        const look = rSeg * 0.2;
        for (const sgn of [-1, 1]) {
            const px = hx + ex * eo * sgn + dx * rSeg * 0.3;
            const py = hy + ey * eo * sgn + dy * rSeg * 0.3;
            g.fillColor = (0, Theme_1.hex)('#FFFFFF');
            g.circle(px, py, rSeg * 0.3);
            g.fill();
            g.fillColor = (0, Theme_1.hex)('#10301C');
            g.circle(px + dx * look, py + dy * look, rSeg * 0.15);
            g.fill();
        }
    }
    /** A real thumb pad: the game is grid-based, so swipes alone are fiddly. */
    _drawPad(g) {
        const p = this._padCenter;
        const dirs = [
            ['U', 0, 1, 'chevron'],
            ['D', 0, -1, 'chevron'],
            ['L', -1, 0, 'chevron'],
            ['R', 1, 0, 'chevron'],
        ];
        const rot = { U: 90, D: -90, L: 180, R: 0 };
        g.setShadow((0, Theme_1.hex)(LightShell_1.LIGHT.shadow, 46), 18, 0, -6);
        g.fillColor = (0, Theme_1.hex)(LightShell_1.LIGHT.card);
        g.circle(p.x, p.y, p.r * 2.25);
        g.fill();
        g.clearShadow();
        g.strokeColor = (0, Theme_1.hex)(LightShell_1.LIGHT.cardEdge, 200);
        g.lineWidth = 1.6;
        g.circle(p.x, p.y, p.r * 2.25);
        g.stroke();
        for (const [id, dx, dy] of dirs) {
            const bx = p.x + dx * p.r * 1.42;
            const by = p.y + dy * p.r * 1.42;
            const down = this._dpadPressed === id;
            const sink = down ? 3 : 0;
            const sk = this.skin();
            g.fillColor = (0, Theme_1.hex)(LightShell_1.LIGHT.shadow, 60);
            g.circle(bx, by - 5 + sink, p.r * 0.62);
            g.fill();
            g.setFillGradient(0, by + p.r * 0.62, 0, by - p.r * 0.62, [
                [0, down ? sk.accent : '#FFFFFF'],
                [1, down ? sk.accentDeep : LightShell_1.LIGHT.cardEdge],
            ]);
            g.circle(bx, by - sink, p.r * 0.62);
            g.fill();
            g.clearFillGradient();
            g.strokeColor = (0, Theme_1.hex)(LightShell_1.LIGHT.cardEdge, down ? 90 : 220);
            g.lineWidth = 1.6;
            g.circle(bx, by - sink, p.r * 0.62);
            g.stroke();
            // Rotate the chevron by drawing it through a temporary angle.
            const a = (rot[id] * Math.PI) / 180;
            const s = p.r * 0.3;
            g.strokeColor = (0, Theme_1.hex)(down ? '#FFFFFF' : LightShell_1.LIGHT.ink);
            g.lineWidth = Math.max(3, s * 0.42);
            const pts = [
                [-0.25, 0.5],
                [0.3, 0],
                [-0.25, -0.5],
            ];
            for (let i = 0; i < pts.length; i++) {
                const vx = pts[i][0] * s * 2;
                const vy = pts[i][1] * s * 2;
                const rx = vx * Math.cos(a) - vy * Math.sin(a);
                const ry = vx * Math.sin(a) + vy * Math.cos(a);
                if (i === 0)
                    g.moveTo(bx + rx, by - sink + ry);
                else
                    g.lineTo(bx + rx, by - sink + ry);
            }
            g.stroke();
        }
    }
}
exports.AppleWormGame = AppleWormGame;

  };

  // === MODULE: ./games/ParaboxGame ===
  __modules["./games/ParaboxGame"] = function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParaboxGame = exports.PARABOX_LEVELS = void 0;
const cc_1 = require("cc");
const SoundManager_1 = require("../core/SoundManager");
const GameShell_1 = require("../core/GameShell");
const LightShell_1 = require("../core/LightShell");
const Theme_1 = require("../core/Theme");
const UI = require("../core/UIKit");
const Progress_1 = require("../core/Progress");
exports.PARABOX_LEVELS = [
    {
        id: 1,
        title: 'Enter The Paradox',
        subtitle: 'Push the blue Room-Box against the wall to enter INSIDE it!',
        outerWallColor: '#3B9AE1',
        innerWallColor: '#E07A38',
        outerMap: [
            '#######',
            '#..G..#',
            '#.....#',
            '#.....#',
            '#.....#',
            '#.....#',
            '#######',
        ],
        innerMap: [
            '#####',
            '#...#',
            '#.P.#',
            '#...#',
            '##.##', // Bottom center (4,2) is open entrance!
        ],
        playerStart: { room: 'outer', r: 5, c: 3 },
        roomBoxStart: { r: 3, c: 3 },
        cratesStart: [],
        solutionDirs: ['U', 'U', 'U'],
    },
    {
        id: 2,
        title: 'Pass Through The Box',
        subtitle: 'Dive into the bottom of the blue box & exit out its right side!',
        outerWallColor: '#4895EF',
        innerWallColor: '#D97736',
        outerMap: [
            '#######',
            '#.#.P.#',
            '#.#...#',
            '#G###.#',
            '#.....#',
            '#.....#',
            '#######',
        ],
        innerMap: [
            '#####',
            '#...#',
            '#....',
            '#...#',
            '##.##', // Bottom center (4,2) is open entrance!
        ],
        playerStart: { room: 'outer', r: 5, c: 2 },
        roomBoxStart: { r: 3, c: 1 },
        cratesStart: [],
        solutionDirs: ['L', 'U', 'U', 'U', 'R', 'R', 'R', 'U', 'U', 'L'],
    },
    {
        id: 3,
        title: 'Smuggle The Golden Crate',
        subtitle: 'Push the yellow crate INSIDE the blue box onto the inner goal!',
        outerWallColor: '#2B7AC9',
        innerWallColor: '#D96B27',
        outerMap: [
            '#######',
            '#..G..#',
            '#.....#',
            '#.....#',
            '#.....#',
            '#....P#',
            '#######',
        ],
        innerMap: [
            '#####',
            '#.G.#',
            '#...#',
            '#...#',
            '##.##',
        ],
        playerStart: { room: 'outer', r: 5, c: 3 },
        roomBoxStart: { r: 2, c: 3 },
        cratesStart: [{ room: 'outer', r: 4, c: 3 }],
        solutionDirs: ['U', 'U', 'U', 'U', 'U', 'D', 'D', 'D', 'R', 'R'],
    },
    {
        id: 4,
        title: 'Inner Extraction',
        subtitle: 'Enter the blue box, push the crate OUT of it, and cover both goals!',
        outerWallColor: '#569CE8',
        innerWallColor: '#E5853C',
        outerMap: [
            '#######',
            '#..G..#',
            '#.....#',
            '#....G#',
            '#.....#',
            '#..P..#',
            '#######',
        ],
        innerMap: [
            '#####',
            '#...#',
            '#....',
            '#...#',
            '##.##', // Bottom side open!
        ],
        playerStart: { room: 'outer', r: 4, c: 3 },
        roomBoxStart: { r: 1, c: 3 },
        cratesStart: [{ room: 'inner', r: 2, c: 2 }],
        solutionDirs: ['U', 'U', 'U', 'L', 'U', 'R', 'R', 'R', 'D', 'D', 'D', 'D', 'L', 'L'],
    },
    {
        id: 5,
        title: 'Patrick Jane Finale',
        subtitle: 'Use the recursive box as both a bridge and a goal weight!',
        outerWallColor: '#3A86FF',
        innerWallColor: '#FB5607',
        outerMap: [
            '#######',
            '#G....#',
            '###...#',
            '#..G..#',
            '#.....#',
            '#....P#',
            '#######',
        ],
        innerMap: [
            '##.##',
            '#...#',
            '....#',
            '#...#',
            '##.##', // Bottom open
        ],
        playerStart: { room: 'outer', r: 5, c: 2 },
        roomBoxStart: { r: 3, c: 2 },
        cratesStart: [{ room: 'outer', r: 1, c: 3 }],
        solutionDirs: ['R', 'U', 'U', 'U', 'U', 'R', 'U', 'L', 'L', 'L', 'D', 'R', 'D', 'D', 'D', 'R', 'R'],
    },
];
// =====================================================================================
//  Paradox Box — recursive Sokoban, rebuilt on the shared GameShell.
// =====================================================================================
//  The rules are untouched: push the crates onto the goals, and when the blue Room-Box
//  cannot slide, step *inside* it instead. The redesign makes that recursion legible —
//  the inner 5×5 is rendered live inside its own tile, and the detail panel beside the
//  board zooms it up so you can read the room you are standing in.
// =====================================================================================
const OUT_N = 7;
const IN_N = 5;
class ParaboxGame extends LightShell_1.LightShell {
    get meta() {
        return {
            id: 'parabox',
            title: 'Paradox Box',
            eyebrow: '無限套盒',
            levelCount: exports.PARABOX_LEVELS.length,
            howTo: [
                'Push every crate onto a glowing goal tile.',
                'The blue Room-Box is a room. Push it, or enter it.',
                'When it cannot slide, walking into it puts you inside.',
            ],
            hint: 'Swipe to push · a blocked Room-Box becomes a doorway',
        };
    }
    constructor(parent, onBackToHub) {
        super(parent, onBackToHub, 'parabox');
        this._levelIdx = 0;
        this._player = { room: 'outer', r: 5, c: 3 };
        this._roomBox = { r: 3, c: 3 };
        this._crates = [];
        this._history = [];
        this._solutionStepIdx = 0;
        this._moves = 0;
        this._touchStart = null;
        this._dpadPressed = null;
        this._zoomPulse = 0;
        this.loadLevel(Math.min(Progress_1.Progress.unlocked('parabox'), exports.PARABOX_LEVELS.length - 1));
    }
    // =================================================================================
    //  Rules (unchanged)
    // =================================================================================
    onLoadLevel(i) {
        this._levelIdx = i;
        const lvl = exports.PARABOX_LEVELS[i];
        this._player = { ...lvl.playerStart };
        this._roomBox = { ...lvl.roomBoxStart };
        this._crates = lvl.cratesStart.map((c) => ({ ...c }));
        this._history = [];
        this._solutionStepIdx = 0;
        this._moves = 0;
        this._zoomPulse = 0;
    }
    levelName() {
        return exports.PARABOX_LEVELS[this._levelIdx].title;
    }
    stats() {
        const lvl = exports.PARABOX_LEVELS[this._levelIdx];
        let goals = 0;
        let done = 0;
        for (let r = 0; r < OUT_N; r++) {
            for (let c = 0; c < OUT_N; c++) {
                if (lvl.outerMap[r][c] === 'G') {
                    goals++;
                    if ((this._roomBox.r === r && this._roomBox.c === c) || this._crateAt('outer', r, c) !== -1)
                        done++;
                }
            }
        }
        for (let r = 0; r < IN_N; r++) {
            for (let c = 0; c < IN_N; c++) {
                if (lvl.innerMap[r][c] === 'G') {
                    goals++;
                    if (this._crateAt('inner', r, c) !== -1)
                        done++;
                }
            }
        }
        return [
            { label: 'Goals', value: done + '/' + goals, icon: 'check', tint: done === goals ? Theme_1.T.mint : this.pal.accent },
            { label: 'Depth', value: this._player.room === 'inner' ? 'Inside' : 'Outer', tint: this.pal.accent2 },
            { label: 'Moves', value: String(this._moves), tint: Theme_1.T.textDim },
        ];
    }
    // =================================================================================
    //  Light-skin hooks
    // =================================================================================
    skin() {
        return LightShell_1.SKINS.parabox;
    }
    heroArt() {
        return 'sp_portal';
    }
    padBandHeight() {
        return 178;
    }
    headerStat() {
        // Same count the stat rail used, so the header never disagrees with the board.
        const st = this.stats();
        const goals = st.length ? st[0].value : '0/0';
        return { label: 'Goals', value: goals };
    }
    rules() {
        return [
            { a: 'Push boxes', b: 'onto goals', icon: 'grid' },
            { a: 'One box is', b: 'a whole room', icon: 'bolt' },
            { a: 'Step off to', b: 'pop back out', icon: 'chevron' },
        ];
    }
    dock() {
        const canUndo = this._history.length > 0;
        return [
            {
                id: 'undo',
                icon: 'undo',
                label: 'Undo',
                dim: !canUndo,
                badge: canUndo ? String(Math.min(99, this._history.length)) : undefined,
            },
            { id: 'solve', icon: 'bulb', label: 'Hint', tone: 'gold', badge: 'AD', badgeColor: LightShell_1.LIGHT.orange },
        ];
    }
    coachUrgent() {
        return this._player.room === 'inner';
    }
    actions() {
        // The light skin draws its own dock; the shared action bar stays empty.
        return [];
    }
    _unusedActions() {
        return [
            {
                id: 'undo',
                x: 0,
                y: 0,
                w: 196,
                h: 74,
                label: 'Undo',
                icon: 'undo',
                tone: 'ghost',
                disabled: this._history.length === 0,
            },
            { id: 'solve', x: 0, y: 0, w: 220, h: 74, label: 'Hint', icon: 'video', tone: 'gold' },
        ];
    }
    onAction(id) {
        if (id === 'undo') {
            this.undoMove();
            return;
        }
        if (id === 'solve') {
            this.watchAdFor('Watch a short ad for the next move', () => this.playSolutionStep());
        }
    }
    hintText() {
        if (this._player.room === 'inner')
            return "You're inside the box — step off any edge to pop back out";
        return exports.PARABOX_LEVELS[this._levelIdx].subtitle;
    }
    winBlurb() {
        return this._moves + ' moves';
    }
    _tile(room, r, c) {
        const lvl = exports.PARABOX_LEVELS[this._levelIdx];
        if (room === 'outer') {
            if (r < 0 || r >= OUT_N || c < 0 || c >= OUT_N)
                return '#';
            return lvl.outerMap[r][c];
        }
        if (r < 0 || r >= IN_N || c < 0 || c >= IN_N)
            return '.';
        return lvl.innerMap[r][c];
    }
    _innerEntrance(dr, dc) {
        if (dr === -1)
            return { r: 4, c: 2 };
        if (dr === 1)
            return { r: 0, c: 2 };
        if (dc === -1)
            return { r: 2, c: 4 };
        return { r: 2, c: 0 };
    }
    _crateAt(room, r, c) {
        return this._crates.findIndex((cr) => cr.room === room && cr.r === r && cr.c === c);
    }
    stepMove(dir) {
        if (this.phase !== 'play')
            return;
        const dr = dir === 'U' ? -1 : dir === 'D' ? 1 : 0;
        const dc = dir === 'L' ? -1 : dir === 'R' ? 1 : 0;
        this._history.push({
            player: { ...this._player },
            roomBox: { ...this._roomBox },
            crates: this._crates.map((c) => ({ ...c })),
        });
        if (!this._move('player', this._player, dr, dc)) {
            this._history.pop();
            SoundManager_1.SoundManager.playError();
            this.anim.jump('bump', 1);
            this.anim.set('bump', 0, 9);
            this.anim.jump('bdx', dc);
            this.anim.jump('bdy', -dr);
            (0, GameShell_1.haptic)(8);
            return;
        }
        this._moves++;
        (0, GameShell_1.haptic)(5);
        this._checkWin();
    }
    _move(kind, pos, dr, dc) {
        const nr = pos.r + dr;
        const nc = pos.c + dc;
        // Stepping off the inner room's boundary pops you back into the outer room.
        if (pos.room === 'inner' && (nr < 0 || nr >= IN_N || nc < 0 || nc >= IN_N)) {
            const outR = this._roomBox.r + dr;
            const outC = this._roomBox.c + dc;
            if (this._tile('outer', outR, outC) === '#')
                return false;
            const ci = this._crateAt('outer', outR, outC);
            if (ci !== -1 && !this._move('crate', this._crates[ci], dr, dc))
                return false;
            pos.room = 'outer';
            pos.r = outR;
            pos.c = outC;
            SoundManager_1.SoundManager.playSlide(true);
            if (kind === 'player')
                this._onDepthChange(false);
            return true;
        }
        if (this._tile(pos.room, nr, nc) === '#')
            return false;
        const ci = this._crateAt(pos.room, nr, nc);
        if (ci !== -1 && !this._move('crate', this._crates[ci], dr, dc))
            return false;
        // Walking into the Room-Box: slide it if it can move, otherwise go inside.
        if (pos.room === 'outer' && nr === this._roomBox.r && nc === this._roomBox.c) {
            const bR = this._roomBox.r + dr;
            const bC = this._roomBox.c + dc;
            let canSlide = this._tile('outer', bR, bC) !== '#';
            if (canSlide) {
                const blocking = this._crateAt('outer', bR, bC);
                if (blocking !== -1)
                    canSlide = this._move('crate', this._crates[blocking], dr, dc);
            }
            if (canSlide) {
                this._roomBox.r = bR;
                this._roomBox.c = bC;
                pos.r = nr;
                pos.c = nc;
                SoundManager_1.SoundManager.playSlide(false);
                return true;
            }
            const ent = this._innerEntrance(dr, dc);
            if (this._tile('inner', ent.r, ent.c) === '#')
                return false;
            const inner = this._crateAt('inner', ent.r, ent.c);
            if (inner !== -1 && !this._move('crate', this._crates[inner], dr, dc))
                return false;
            pos.room = 'inner';
            pos.r = ent.r;
            pos.c = ent.c;
            SoundManager_1.SoundManager.playSlide(true);
            if (kind === 'player')
                this._onDepthChange(true);
            return true;
        }
        pos.r = nr;
        pos.c = nc;
        SoundManager_1.SoundManager.playTap(kind === 'player' ? 1.0 : 0.8);
        return true;
    }
    _onDepthChange(entering) {
        this._zoomPulse = 1;
        this.fx.shake(6, 0.3);
        this.fx.flash(this.pal.accent, 0.22, 0.3);
        const p = this._outerCell(this._roomBox.r, this._roomBox.c);
        this.fx.ring(p.x, p.y, this.pal.accent, 44, 0.6);
        this.fx.popText(p.x, p.y + 50, entering ? 'INSIDE' : 'OUTSIDE', this.pal.accent2, 28);
        (0, GameShell_1.haptic)(18);
    }
    _checkWin() {
        const lvl = exports.PARABOX_LEVELS[this._levelIdx];
        for (let r = 0; r < OUT_N; r++) {
            for (let c = 0; c < OUT_N; c++) {
                if (lvl.outerMap[r][c] === 'G') {
                    const box = this._roomBox.r === r && this._roomBox.c === c;
                    if (!box && this._crateAt('outer', r, c) === -1)
                        return;
                }
            }
        }
        for (let r = 0; r < IN_N; r++) {
            for (let c = 0; c < IN_N; c++) {
                if (lvl.innerMap[r][c] === 'G' && this._crateAt('inner', r, c) === -1)
                    return;
            }
        }
        if (this._tile(this._player.room, this._player.r, this._player.c) === 'P') {
            this.win(this._stars());
        }
    }
    _stars() {
        const par = exports.PARABOX_LEVELS[this._levelIdx].solutionDirs.length;
        if (this._moves <= par)
            return 3;
        if (this._moves <= par + 5)
            return 2;
        return 1;
    }
    undoMove() {
        if (!this._history.length)
            return;
        const snap = this._history.pop();
        this._player = snap.player;
        this._roomBox = snap.roomBox;
        this._crates = snap.crates;
        this.phase = 'play';
        this._moves = Math.max(0, this._moves - 1);
        SoundManager_1.SoundManager.playTap(0.85);
    }
    playSolutionStep() {
        const lvl = exports.PARABOX_LEVELS[this._levelIdx];
        if (this.phase !== 'play' || this._history.length !== this._solutionStepIdx) {
            this.loadLevel(this._levelIdx);
        }
        if (this._solutionStepIdx < lvl.solutionDirs.length) {
            const dir = lvl.solutionDirs[this._solutionStepIdx];
            this._solutionStepIdx++;
            this.stepMove(dir);
        }
    }
    // =================================================================================
    //  Geometry
    // =================================================================================
    get _boardSize() {
        // The tray is drawn 22 wider than the grid, so the grid gives that back.
        return this.lay.board - 22;
    }
    get _cell() {
        return this._boardSize / OUT_N;
    }
    get _boardCY() {
        return this.lay.boardCY;
    }
    _outerCell(r, c) {
        const cell = this._cell;
        const half = (OUT_N * cell) * 0.5;
        return { x: -half + (c + 0.5) * cell, y: this._boardCY + half - (r + 0.5) * cell };
    }
    // =================================================================================
    //  Input
    // =================================================================================
    onFieldDown(x, y) {
        const pad = this._padHit(x, y);
        if (pad) {
            this._dpadPressed = pad;
            this.stepMove(pad);
            return;
        }
        this._touchStart = { x, y };
    }
    onFieldUp(x, y) {
        this._dpadPressed = null;
        if (!this._touchStart)
            return;
        const dx = x - this._touchStart.x;
        const dy = y - this._touchStart.y;
        this._touchStart = null;
        if (Math.hypot(dx, dy) < 34)
            return;
        if (Math.abs(dx) > Math.abs(dy))
            this.stepMove(dx > 0 ? 'R' : 'L');
        else
            this.stepMove(dy > 0 ? 'U' : 'D');
    }
    get _padCenter() {
        return { x: 0, y: this.lay.padCY, r: 36 };
    }
    _padHit(x, y) {
        const p = this._padCenter;
        const dirs = [
            ['U', 0, 1],
            ['D', 0, -1],
            ['L', -1, 0],
            ['R', 1, 0],
        ];
        for (const [id, dx, dy] of dirs) {
            const bx = p.x + dx * p.r * 1.42;
            const by = p.y + dy * p.r * 1.42;
            if (Math.abs(x - bx) <= p.r * 0.72 && Math.abs(y - by) <= p.r * 0.72)
                return id;
        }
        return null;
    }
    // =================================================================================
    //  Render
    // =================================================================================
    onTick(dt) {
        this._zoomPulse = Math.max(0, this._zoomPulse - dt * 1.8);
    }
    drawField(g, _dt) {
        const lvl = exports.PARABOX_LEVELS[this._levelIdx];
        const cell = this._cell;
        const board = this._boardSize;
        const cy = this._boardCY;
        const bump = this.anim.get('bump');
        const bx = this.anim.get('bdx') * bump * 7;
        const by = this.anim.get('bdy') * bump * 7;
        this.drawTray(g, 0, cy, board + 22, board + 22, 30);
        // --- outer room floor and walls -------------------------------------------
        for (let r = 0; r < OUT_N; r++) {
            for (let c = 0; c < OUT_N; c++) {
                const ch = lvl.outerMap[r][c];
                const p = this._outerCell(r, c);
                if (ch === '#')
                    this._drawWall(g, p, cell, lvl.outerWallColor);
                else
                    this._drawFloor(g, p, cell, ch);
            }
        }
        // --- the recursive Room-Box -------------------------------------------------
        this._drawRoomBox(g, cell);
        // --- crates ------------------------------------------------------------------
        for (const cr of this._crates) {
            if (cr.room !== 'outer')
                continue;
            const p = this._outerCell(cr.r, cr.c);
            const onGoal = lvl.outerMap[cr.r][cr.c] === 'G';
            this._drawCrate(g, p.x, p.y, cell * 0.78, onGoal);
        }
        // --- player ------------------------------------------------------------------
        if (this._player.room === 'outer') {
            const p = this._outerCell(this._player.r, this._player.c);
            this._drawPlayer(g, p.x + bx, p.y + by, cell * 0.62);
        }
        this._drawPad(g);
        this._drawDepthBadge(g);
    }
    _drawWall(g, p, s, col) {
        const base = (0, Theme_1.hex)(col);
        g.setFillGradient(0, p.y + s * 0.5, 0, p.y - s * 0.5, [
            [0, base.shade(-0.1).toCSS()],
            [1, base.shade(-0.6).toCSS()],
        ]);
        g.roundRect(p.x - s * 0.5 + 1, p.y - s * 0.5 + 1, s - 2, s - 2, 5);
        g.fill();
        g.clearFillGradient();
        g.strokeColor = base.shade(0.3).withAlpha(90);
        g.lineWidth = 1.2;
        g.moveTo(p.x - s * 0.4, p.y + s * 0.44);
        g.lineTo(p.x + s * 0.4, p.y + s * 0.44);
        g.stroke();
    }
    _drawFloor(g, p, s, ch) {
        g.fillColor = (0, Theme_1.hex)(LightShell_1.LIGHT.cardEdge, 150);
        g.roundRect(p.x - s * 0.5 + 2, p.y - s * 0.5 + 2, s - 4, s - 4, 4);
        g.fill();
        if (ch === 'G') {
            const pulse = (Math.sin(this.time * 2.6 + p.x * 0.02) + 1) * 0.5;
            g.save();
            g.setBlend('lighter');
            g.setFillRadial(p.x, p.y, 0, s * 0.6, [
                [0, (0, Theme_1.rgba)(Theme_1.T.gold, 0.26 + pulse * 0.2)],
                [1, (0, Theme_1.rgba)(Theme_1.T.gold, 0)],
            ]);
            g.circle(p.x, p.y, s * 0.6);
            g.fill();
            g.clearFillGradient();
            g.restore();
            g.strokeColor = (0, Theme_1.hex)(Theme_1.T.gold, 170);
            g.lineWidth = 2.4;
            g.setLineDash([6, 5]);
            g.roundRect(p.x - s * 0.3, p.y - s * 0.3, s * 0.6, s * 0.6, 5);
            g.stroke();
            g.setLineDash([]);
        }
        else if (ch === 'P') {
            g.strokeColor = (0, Theme_1.hex)(Theme_1.T.pink, 170);
            g.lineWidth = 2.4;
            g.circle(p.x, p.y, s * 0.26);
            g.stroke();
            g.fillColor = (0, Theme_1.hex)(Theme_1.T.pink, 60);
            g.circle(p.x, p.y, s * 0.26);
            g.fill();
        }
    }
    /** The whole idea of the game, rendered literally: a tile that contains a room. */
    _drawRoomBox(g, cell) {
        const lvl = exports.PARABOX_LEVELS[this._levelIdx];
        const p = this._outerCell(this._roomBox.r, this._roomBox.c);
        const s = cell * 0.94;
        const pulse = this._zoomPulse;
        g.save();
        g.setBlend('lighter');
        g.setFillRadial(p.x, p.y, 0, s * (1.1 + pulse * 0.8), [
            [0, (0, Theme_1.rgba)(this.pal.accent, 0.35 + pulse * 0.3)],
            [1, (0, Theme_1.rgba)(this.pal.accent, 0)],
        ]);
        g.circle(p.x, p.y, s * (1.1 + pulse * 0.8));
        g.fill();
        g.clearFillGradient();
        g.restore();
        g.setFillGradient(0, p.y + s * 0.5, 0, p.y - s * 0.5, [
            [0, '#2A4FA8'],
            [1, '#0E1B45'],
        ]);
        g.roundRect(p.x - s * 0.5, p.y - s * 0.5, s, s, 7);
        g.fill();
        g.clearFillGradient();
        // Live 5x5 interior drawn inside the tile.
        const ic = (s - 8) / IN_N;
        const io = -(IN_N * ic) * 0.5;
        g.save();
        g.roundRect(p.x - s * 0.5 + 4, p.y - s * 0.5 + 4, s - 8, s - 8, 5);
        g.clip();
        for (let r = 0; r < IN_N; r++) {
            for (let c = 0; c < IN_N; c++) {
                const ix = p.x + io + (c + 0.5) * ic;
                const iy = p.y - io - (r + 0.5) * ic;
                const ch = lvl.innerMap[r][c];
                if (ch === '#') {
                    g.fillColor = (0, Theme_1.hex)(lvl.innerWallColor).shade(-0.2);
                    g.rect(ix - ic * 0.5, iy - ic * 0.5, ic, ic);
                    g.fill();
                }
                else if (ch === 'G') {
                    g.fillColor = (0, Theme_1.hex)(Theme_1.T.gold, 130);
                    g.rect(ix - ic * 0.3, iy - ic * 0.3, ic * 0.6, ic * 0.6);
                    g.fill();
                }
                else if (ch === 'P') {
                    g.fillColor = (0, Theme_1.hex)(Theme_1.T.pink, 120);
                    g.circle(ix, iy, ic * 0.24);
                    g.fill();
                }
            }
        }
        for (const cr of this._crates) {
            if (cr.room !== 'inner')
                continue;
            const ix = p.x + io + (cr.c + 0.5) * ic;
            const iy = p.y - io - (cr.r + 0.5) * ic;
            g.fillColor = (0, Theme_1.hex)(lvl.innerMap[cr.r][cr.c] === 'G' ? Theme_1.T.mint : Theme_1.T.gold);
            g.roundRect(ix - ic * 0.34, iy - ic * 0.34, ic * 0.68, ic * 0.68, 2);
            g.fill();
        }
        if (this._player.room === 'inner') {
            const ix = p.x + io + (this._player.c + 0.5) * ic;
            const iy = p.y - io - (this._player.r + 0.5) * ic;
            g.fillColor = (0, Theme_1.hex)('#FF4D9D');
            g.roundRect(ix - ic * 0.3, iy - ic * 0.3, ic * 0.6, ic * 0.6, 2);
            g.fill();
        }
        g.restore();
        g.strokeColor = (0, Theme_1.hex)('#9ECBFF', 200);
        g.lineWidth = 2.2;
        g.roundRect(p.x - s * 0.5, p.y - s * 0.5, s, s, 7);
        g.stroke();
    }
    _drawCrate(g, x, y, s, onGoal) {
        const base = (0, Theme_1.hex)(onGoal ? Theme_1.T.mint : Theme_1.T.gold);
        g.fillColor = new cc_1.Color(0, 0, 0, 90);
        g.roundRect(x - s * 0.5, y - s * 0.5 - 4, s, s, 6);
        g.fill();
        g.setFillGradient(0, y + s * 0.5, 0, y - s * 0.5, [
            [0, base.shade(0.3).toCSS()],
            [1, base.shade(-0.3).toCSS()],
        ]);
        g.roundRect(x - s * 0.5, y - s * 0.5, s, s, 6);
        g.fill();
        g.clearFillGradient();
        g.strokeColor = base.shade(-0.5).withAlpha(200);
        g.lineWidth = 2;
        g.moveTo(x - s * 0.38, y - s * 0.38);
        g.lineTo(x + s * 0.38, y + s * 0.38);
        g.moveTo(x - s * 0.38, y + s * 0.38);
        g.lineTo(x + s * 0.38, y - s * 0.38);
        g.roundRect(x - s * 0.5, y - s * 0.5, s, s, 6);
        g.stroke();
        if (onGoal) {
            g.save();
            g.setBlend('lighter');
            g.setFillRadial(x, y, 0, s, [
                [0, (0, Theme_1.rgba)(Theme_1.T.mint, 0.4)],
                [1, (0, Theme_1.rgba)(Theme_1.T.mint, 0)],
            ]);
            g.circle(x, y, s);
            g.fill();
            g.clearFillGradient();
            g.restore();
        }
    }
    _drawPlayer(g, x, y, s) {
        const bob = Math.sin(this.time * 3.4) * s * 0.05;
        const yy = y + bob;
        g.save();
        g.setBlend('lighter');
        g.setFillRadial(x, yy, 0, s * 1.5, [
            [0, (0, Theme_1.rgba)('#FF4D9D', 0.42)],
            [1, (0, Theme_1.rgba)('#FF4D9D', 0)],
        ]);
        g.circle(x, yy, s * 1.5);
        g.fill();
        g.clearFillGradient();
        g.restore();
        g.setFillGradient(0, yy + s * 0.5, 0, yy - s * 0.5, [
            [0, '#FF8AC0'],
            [1, '#E0237A'],
        ]);
        g.roundRect(x - s * 0.5, yy - s * 0.5, s, s, s * 0.3);
        g.fill();
        g.clearFillGradient();
        g.fillColor = (0, Theme_1.hex)('#FFFFFF');
        g.circle(x - s * 0.17, yy + s * 0.08, s * 0.12);
        g.circle(x + s * 0.17, yy + s * 0.08, s * 0.12);
        g.fill();
        g.fillColor = (0, Theme_1.hex)('#3A0A20');
        g.circle(x - s * 0.17, yy + s * 0.08, s * 0.06);
        g.circle(x + s * 0.17, yy + s * 0.08, s * 0.06);
        g.fill();
    }
    /** Tells the player which room they are standing in without reading a legend. */
    _drawDepthBadge(g) {
        const inside = this._player.room === 'inner';
        const y = this._boardCY + this._boardSize * 0.5 + 34;
        UI.chip(g, 0, y, inside ? 'INSIDE THE BOX' : 'OUTER ROOM', {
            tint: inside ? this.pal.accent2 : Theme_1.T.textDim,
            fontSize: 16,
            solid: inside,
            iconName: inside ? 'grid' : 'home',
        });
    }
    _drawPad(g) {
        const p = this._padCenter;
        const dirs = [
            ['U', 0, 1],
            ['D', 0, -1],
            ['L', -1, 0],
            ['R', 1, 0],
        ];
        const rot = { U: 90, D: -90, L: 180, R: 0 };
        g.setShadow((0, Theme_1.hex)(LightShell_1.LIGHT.shadow, 46), 18, 0, -6);
        g.fillColor = (0, Theme_1.hex)(LightShell_1.LIGHT.card);
        g.circle(p.x, p.y, p.r * 2.25);
        g.fill();
        g.clearShadow();
        g.strokeColor = (0, Theme_1.hex)(LightShell_1.LIGHT.cardEdge, 200);
        g.lineWidth = 1.6;
        g.circle(p.x, p.y, p.r * 2.25);
        g.stroke();
        for (const [id, dx, dy] of dirs) {
            const bx = p.x + dx * p.r * 1.42;
            const by = p.y + dy * p.r * 1.42;
            const down = this._dpadPressed === id;
            const sink = down ? 3 : 0;
            g.fillColor = new cc_1.Color(0, 0, 0, 110);
            g.circle(bx, by - 5 + sink, p.r * 0.62);
            g.fill();
            g.setFillGradient(0, by + p.r * 0.62, 0, by - p.r * 0.62, [
                [0, down ? this.skin().accent : '#FFFFFF'],
                [1, down ? this.skin().accentDeep : LightShell_1.LIGHT.cardEdge],
            ]);
            g.circle(bx, by - sink, p.r * 0.62);
            g.fill();
            g.clearFillGradient();
            g.strokeColor = (0, Theme_1.hex)(LightShell_1.LIGHT.cardEdge, down ? 90 : 220);
            g.lineWidth = 1.6;
            g.circle(bx, by - sink, p.r * 0.62);
            g.stroke();
            const a = (rot[id] * Math.PI) / 180;
            const s = p.r * 0.3;
            g.strokeColor = (0, Theme_1.hex)(down ? '#FFFFFF' : LightShell_1.LIGHT.ink);
            g.lineWidth = Math.max(3, s * 0.42);
            const pts = [
                [-0.25, 0.5],
                [0.3, 0],
                [-0.25, -0.5],
            ];
            for (let i = 0; i < pts.length; i++) {
                const vx = pts[i][0] * s * 2;
                const vy = pts[i][1] * s * 2;
                const rx = vx * Math.cos(a) - vy * Math.sin(a);
                const ry = vx * Math.sin(a) + vy * Math.cos(a);
                if (i === 0)
                    g.moveTo(bx + rx, by - sink + ry);
                else
                    g.lineTo(bx + rx, by - sink + ry);
            }
            g.stroke();
        }
    }
}
exports.ParaboxGame = ParaboxGame;

  };

  // === MODULE: ./games/IsleOfGlassGame ===
  __modules["./games/IsleOfGlassGame"] = function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsleOfGlassGame = exports.VERIFIED_GLASS_LEVELS = exports.ISLE_OF_GLASS_LEVELS = void 0;
const cc_1 = require("cc");
const SoundManager_1 = require("../core/SoundManager");
const GameShell_1 = require("../core/GameShell");
const LightShell_1 = require("../core/LightShell");
const Theme_1 = require("../core/Theme");
const Progress_1 = require("../core/Progress");
// Each pane is a lit colour: a saturated core, a deep leaded edge and a pale highlight
// used for the hatch and the specular sweep.
const GLASS_PALETTE = [
    { fill: '#38A3D8', stroke: '#0E4A70', hatch: '#AFE6FF' },
    { fill: '#F6C445', stroke: '#8A5D06', hatch: '#FFF3BE' },
    { fill: '#48C78E', stroke: '#14583A', hatch: '#BCFFE0' },
    { fill: '#E86F88', stroke: '#7A1F34', hatch: '#FFD2DC' },
    { fill: '#9B72E8', stroke: '#402279', hatch: '#E4D3FF' },
    { fill: '#F28E4B', stroke: '#80380B', hatch: '#FFDEC2' }, // Sunburst
];
exports.ISLE_OF_GLASS_LEVELS = [
    {
        // Exact 5x5 stained-glass style inspired by the "Isle of glass" screenshot!
        id: 1,
        title: 'Sanctuary Window (5×5)',
        size: 5,
        clues: [
            { r: 0, c: 0, area: 6 },
            { r: 0, c: 3, area: 4 },
            { r: 2, c: 2, area: 3 },
            { r: 3, c: 0, area: 6 },
            { r: 4, c: 3, area: 6 },
        ],
        solutionRects: [
            { r1: 0, c1: 0, r2: 2, c2: 1, colorIdx: 1 },
            { r1: 0, c1: 2, r2: 1, c2: 3, colorIdx: 0 },
            { r1: 2, c1: 2, r2: 4, c2: 2, colorIdx: 2 },
            { r1: 3, c1: 0, r2: 4, c2: 1, colorIdx: 3 }, // 2x3? Wait: (3..4, 0..1) is 2x2=4! Let's make exact 25 sum!
        ],
    },
];
// Let's define 5 mathematically verified 100%-tiling levels!
exports.VERIFIED_GLASS_LEVELS = [
    {
        id: 1,
        title: 'Azure Abbey (5×5)',
        size: 5,
        clues: [
            { r: 0, c: 0, area: 6 },
            { r: 0, c: 3, area: 6 },
            { r: 2, c: 2, area: 3 },
            { r: 3, c: 1, area: 4 },
            { r: 4, c: 4, area: 6 },
        ],
        solutionRects: [
            { r1: 0, c1: 0, r2: 2, c2: 1, colorIdx: 1 },
            { r1: 0, c1: 2, r2: 1, c2: 4, colorIdx: 0 },
            { r1: 2, c1: 2, r2: 2, c2: 4, colorIdx: 2 },
            { r1: 3, c1: 0, r2: 4, c2: 1, colorIdx: 3 },
            { r1: 3, c1: 2, r2: 4, c2: 4, colorIdx: 4 }, // 2x3 = 6
        ],
    },
    {
        id: 2,
        title: 'Cathedral Rose (5×5)',
        size: 5,
        clues: [
            { r: 0, c: 1, area: 5 },
            { r: 1, c: 0, area: 4 },
            { r: 2, c: 2, area: 9 },
            { r: 2, c: 4, area: 4 },
            { r: 4, c: 1, area: 3 },
        ],
        solutionRects: [
            { r1: 0, c1: 0, r2: 0, c2: 4, colorIdx: 1 },
            { r1: 1, c1: 0, r2: 4, c2: 0, colorIdx: 0 },
            { r1: 1, c1: 1, r2: 3, c2: 3, colorIdx: 2 },
            { r1: 1, c1: 4, r2: 4, c2: 4, colorIdx: 3 },
            { r1: 4, c1: 1, r2: 4, c2: 3, colorIdx: 4 }, // 1x3 = 3
        ],
    },
    {
        id: 3,
        title: 'Prism Courtyard (6×6)',
        size: 6,
        clues: [
            { r: 0, c: 0, area: 6 },
            { r: 1, c: 4, area: 6 },
            { r: 2, c: 1, area: 8 },
            { r: 3, c: 5, area: 4 },
            { r: 4, c: 1, area: 6 },
            { r: 5, c: 4, area: 6 },
        ],
        solutionRects: [
            { r1: 0, c1: 0, r2: 1, c2: 2, colorIdx: 0 },
            { r1: 0, c1: 3, r2: 1, c2: 5, colorIdx: 1 },
            { r1: 2, c1: 0, r2: 3, c2: 3, colorIdx: 2 },
            { r1: 2, c1: 4, r2: 3, c2: 5, colorIdx: 3 },
            { r1: 4, c1: 0, r2: 5, c2: 2, colorIdx: 4 },
            { r1: 4, c1: 3, r2: 5, c2: 5, colorIdx: 5 }, // 2x3 = 6
        ],
    },
    {
        id: 4,
        title: 'Venetian Lagoon (6×6)',
        size: 6,
        clues: [
            { r: 0, c: 2, area: 6 },
            { r: 1, c: 0, area: 5 },
            { r: 2, c: 2, area: 9 },
            { r: 2, c: 5, area: 8 },
            { r: 5, c: 1, area: 4 },
            { r: 4, c: 3, area: 4 },
        ],
        solutionRects: [
            { r1: 0, c1: 0, r2: 0, c2: 5, colorIdx: 1 },
            { r1: 1, c1: 0, r2: 5, c2: 0, colorIdx: 0 },
            { r1: 1, c1: 1, r2: 3, c2: 3, colorIdx: 2 },
            { r1: 1, c1: 4, r2: 4, c2: 5, colorIdx: 3 },
            { r1: 4, c1: 1, r2: 5, c2: 2, colorIdx: 4 },
            { r1: 4, c1: 3, r2: 5, c2: 3, colorIdx: 5 }, // Wait: (4..5, 3..3)=2 plus (5,4..5)=2 -> let's make last two rectangles clean:
        ],
    },
    {
        id: 5,
        title: 'Grand Mosaic (6×6)',
        size: 6,
        clues: [
            { r: 0, c: 1, area: 4 },
            { r: 0, c: 4, area: 8 },
            { r: 2, c: 0, area: 6 },
            { r: 2, c: 3, area: 6 },
            { r: 4, c: 2, area: 8 },
            { r: 5, c: 5, area: 4 },
        ],
        solutionRects: [
            { r1: 0, c1: 0, r2: 1, c2: 1, colorIdx: 1 },
            { r1: 0, c1: 2, r2: 1, c2: 5, colorIdx: 0 },
            { r1: 2, c1: 0, r2: 4, c2: 1, colorIdx: 2 },
            { r1: 2, c1: 2, r2: 3, c2: 4, colorIdx: 3 },
            { r1: 4, c1: 2, r2: 5, c2: 4, colorIdx: 4 }, // Wait: let's make 100% exact tiling!
        ],
    },
];
// Clean, 100% verified partition definitions for Levels 4 and 5:
exports.VERIFIED_GLASS_LEVELS[3] = {
    id: 4,
    title: 'Venetian Lagoon (6×6)',
    size: 6,
    clues: [
        { r: 0, c: 2, area: 6 },
        { r: 2, c: 0, area: 4 },
        { r: 2, c: 2, area: 9 },
        { r: 2, c: 5, area: 6 },
        { r: 4, c: 1, area: 5 },
        { r: 5, c: 4, area: 6 },
    ],
    solutionRects: [
        { r1: 0, c1: 0, r2: 0, c2: 5, colorIdx: 1 },
        { r1: 1, c1: 0, r2: 4, c2: 0, colorIdx: 0 },
        { r1: 1, c1: 1, r2: 3, c2: 3, colorIdx: 2 },
        { r1: 1, c1: 4, r2: 3, c2: 5, colorIdx: 3 },
        { r1: 5, c1: 0, r2: 5, c2: 4, colorIdx: 4 }, // wait: (4, 1..5) and (5, 0..5) -> let's make simple rectangles:
    ],
};
exports.VERIFIED_GLASS_LEVELS[3] = {
    id: 4,
    title: 'Venetian Lagoon (6×6)',
    size: 6,
    clues: [
        { r: 0, c: 2, area: 6 },
        { r: 2, c: 0, area: 5 },
        { r: 2, c: 2, area: 9 },
        { r: 2, c: 5, area: 6 },
        { r: 4, c: 2, area: 6 },
        { r: 4, c: 4, area: 4 },
    ],
    solutionRects: [
        { r1: 0, c1: 0, r2: 0, c2: 5, colorIdx: 1 },
        { r1: 1, c1: 0, r2: 5, c2: 0, colorIdx: 0 },
        { r1: 1, c1: 1, r2: 3, c2: 3, colorIdx: 2 },
        { r1: 1, c1: 4, r2: 3, c2: 5, colorIdx: 3 },
        { r1: 4, c1: 1, r2: 5, c2: 3, colorIdx: 4 },
        { r1: 4, c1: 4, r2: 5, c2: 5, colorIdx: 5 }, // rows 4..5, cols 4..5 (2x2 = 4) -> 6+5+9+6+6+4 = 36!
    ],
};
exports.VERIFIED_GLASS_LEVELS[4] = {
    id: 5,
    title: 'Grand Mosaic (6×6)',
    size: 6,
    clues: [
        { r: 1, c: 0, area: 8 },
        { r: 0, c: 3, area: 4 },
        { r: 1, c: 5, area: 6 },
        { r: 3, c: 3, area: 6 },
        { r: 4, c: 1, area: 6 },
        { r: 5, c: 4, area: 6 },
    ],
    solutionRects: [
        { r1: 0, c1: 0, r2: 3, c2: 1, colorIdx: 0 },
        { r1: 0, c1: 2, r2: 1, c2: 3, colorIdx: 1 },
        { r1: 0, c1: 4, r2: 2, c2: 5, colorIdx: 2 },
        { r1: 2, c1: 2, r2: 4, c2: 3, colorIdx: 3 },
        { r1: 4, c1: 0, r2: 5, c2: 1, colorIdx: 4 }, // Wait: let's make rows 4..5 clean:
    ],
};
exports.VERIFIED_GLASS_LEVELS[4] = {
    id: 5,
    title: 'Grand Mosaic (6×6)',
    size: 6,
    clues: [
        { r: 1, c: 1, area: 8 },
        { r: 0, c: 3, area: 4 },
        { r: 1, c: 5, area: 8 },
        { r: 3, c: 2, area: 4 },
        { r: 4, c: 0, area: 6 },
        { r: 5, c: 4, area: 6 },
    ],
    solutionRects: [
        { r1: 0, c1: 0, r2: 3, c2: 1, colorIdx: 0 },
        { r1: 0, c1: 2, r2: 1, c2: 3, colorIdx: 1 },
        { r1: 0, c1: 4, r2: 3, c2: 5, colorIdx: 2 },
        { r1: 2, c1: 2, r2: 3, c2: 3, colorIdx: 3 },
        { r1: 4, c1: 0, r2: 5, c2: 2, colorIdx: 4 },
        { r1: 4, c1: 3, r2: 5, c2: 5, colorIdx: 5 }, // rows 4..5, cols 3..5 (2x3 = 6) -> 8+4+8+4+6+6 = 36!
    ],
};
// =====================================================================================
//  Isle of Glass — stained-glass area puzzle, rebuilt on the shared GameShell.
// =====================================================================================
//  Rules unchanged: carve the grid into rectangles, each holding exactly one clue whose
//  number equals its area. The redesign treats the board as an actual window — panes
//  are lit from behind, leaded with dark cames, and a slow specular sweep crosses the
//  glass. Valid panes chime and glow; invalid ones go cold and red.
// =====================================================================================
class IsleOfGlassGame extends LightShell_1.LightShell {
    get meta() {
        return {
            id: 'isleofglass',
            title: 'Isle of Glass',
            eyebrow: '琉璃之島',
            levelCount: exports.VERIFIED_GLASS_LEVELS.length,
            howTo: [
                'Drag across cells to cut a rectangular pane.',
                'Each pane must hold exactly one number…',
                '…and that number must equal the pane’s area.',
            ],
            hint: 'Drag to cut a pane · tap a pane to remove it',
        };
    }
    constructor(parent, onBackToHub) {
        super(parent, onBackToHub, 'isleofglass');
        this._levelIdx = 0;
        this._rects = [];
        this._dragging = false;
        this._dragStart = null;
        this._dragCur = null;
        this._nextColorIdx = 0;
        this._misses = 0;
        this._hintsUsed = 0;
        this._litT = 0;
        this.loadLevel(Math.min(Progress_1.Progress.unlocked('isleofglass'), exports.VERIFIED_GLASS_LEVELS.length - 1));
    }
    // =================================================================================
    //  Rules
    // =================================================================================
    onLoadLevel(i) {
        this._levelIdx = i;
        this._rects = [];
        this._dragging = false;
        this._dragStart = null;
        this._dragCur = null;
        this._misses = 0;
        this._hintsUsed = 0;
        this._litT = 0;
    }
    levelName() {
        return exports.VERIFIED_GLASS_LEVELS[this._levelIdx].title;
    }
    stats() {
        const lvl = exports.VERIFIED_GLASS_LEVELS[this._levelIdx];
        const N = lvl.size;
        let covered = 0;
        let valid = 0;
        for (const rc of this._rects) {
            covered += (rc.r2 - rc.r1 + 1) * (rc.c2 - rc.c1 + 1);
            if (this._isValid(rc))
                valid++;
        }
        return [
            { label: 'Panes', value: valid + '/' + lvl.clues.length, icon: 'check', tint: this.pal.accent2 },
            { label: 'Lit', value: Math.round((covered / (N * N)) * 100) + '%', tint: this.pal.accent },
            { label: 'Grid', value: N + '×' + N, tint: Theme_1.T.textDim },
        ];
    }
    // =================================================================================
    //  Light-skin hooks
    // =================================================================================
    skin() {
        return LightShell_1.SKINS.isleofglass;
    }
    heroArt() {
        return 'key_isleofglass';
    }
    headerStat() {
        const lvl = exports.VERIFIED_GLASS_LEVELS[this._levelIdx];
        let valid = 0;
        for (const rc of this._rects)
            if (this._isValid(rc))
                valid++;
        return { label: 'Panes', value: valid + '/' + lvl.clues.length };
    }
    rules() {
        return [
            { a: 'Drag out a', b: 'rectangle', icon: 'grid' },
            { a: 'It holds one', b: 'number', icon: 'star' },
            { a: 'Area must', b: 'match it', icon: 'check' },
        ];
    }
    dock() {
        const any = this._rects.length > 0;
        return [
            {
                id: 'clear',
                icon: 'close',
                label: 'Clear',
                dim: !any,
                badge: any ? String(Math.min(99, this._rects.length)) : undefined,
            },
            { id: 'hint', icon: 'bulb', label: 'Hint', tone: 'gold', badge: 'AD', badgeColor: LightShell_1.LIGHT.orange },
        ];
    }
    coachUrgent() {
        return this._dragging;
    }
    actions() {
        // The light skin draws its own dock; the shared action bar stays empty.
        return [];
    }
    _unusedActions() {
        return [
            {
                id: 'clear',
                x: 0,
                y: 0,
                w: 196,
                h: 74,
                label: 'Clear',
                icon: 'close',
                tone: 'ghost',
                disabled: this._rects.length === 0,
            },
            { id: 'hint', x: 0, y: 0, w: 220, h: 74, label: 'Hint', icon: 'video', tone: 'gold' },
        ];
    }
    onAction(id) {
        if (id === 'clear') {
            this._rects = [];
            SoundManager_1.SoundManager.playTap(0.8);
            return;
        }
        if (id === 'hint') {
            this.watchAdFor('Watch a short ad to reveal one pane', () => this.applyHintRect());
        }
    }
    hintText() {
        if (this._dragging && this._dragStart && this._dragCur) {
            const h = Math.abs(this._dragCur[0] - this._dragStart[0]) + 1;
            const w = Math.abs(this._dragCur[1] - this._dragStart[1]) + 1;
            return w + ' × ' + h + '  =  ' + w * h;
        }
        return this.meta.hint;
    }
    winBlurb() {
        const bits = [this._misses === 0 ? 'No wrong cuts' : this._misses + ' wrong cuts'];
        if (this._hintsUsed)
            bits.push(this._hintsUsed + ' revealed');
        return bits.join(' · ');
    }
    _isValid(rect) {
        const lvl = exports.VERIFIED_GLASS_LEVELS[this._levelIdx];
        const area = (rect.r2 - rect.r1 + 1) * (rect.c2 - rect.c1 + 1);
        const inside = lvl.clues.filter((cl) => cl.r >= rect.r1 && cl.r <= rect.r2 && cl.c >= rect.c1 && cl.c <= rect.c2);
        return inside.length === 1 && inside[0].area === area;
    }
    _overlap(a, b) {
        return !(a.r2 < b.r1 || a.r1 > b.r2 || a.c2 < b.c1 || a.c1 > b.c2);
    }
    _commit(rA, cA, rB, cB) {
        const r1 = Math.min(rA, rB);
        const r2 = Math.max(rA, rB);
        const c1 = Math.min(cA, cB);
        const c2 = Math.max(cA, cB);
        // A single tap inside an existing pane removes it.
        if (r1 === r2 && c1 === c2) {
            const idx = this._rects.findIndex((rc) => r1 >= rc.r1 && r1 <= rc.r2 && c1 >= rc.c1 && c1 <= rc.c2);
            if (idx !== -1) {
                const p = this._rectCenter(this._rects[idx]);
                this._rects.splice(idx, 1);
                SoundManager_1.SoundManager.playTap(0.8);
                this.fx.puff(p.x, p.y, 6, '#FFFFFF', 14);
                return;
            }
        }
        const rect = { r1, c1, r2, c2, colorIdx: this._nextColorIdx % GLASS_PALETTE.length };
        this._nextColorIdx++;
        this._rects = this._rects.filter((rc) => !this._overlap(rc, rect));
        this._rects.push(rect);
        const p = this._rectCenter(rect);
        if (this._isValid(rect)) {
            SoundManager_1.SoundManager.playGlassChime();
            (0, GameShell_1.haptic)(14);
            this.fx.ring(p.x, p.y, GLASS_PALETTE[rect.colorIdx].fill, 40, 0.55);
            this.fx.burst(p.x, p.y, 12, [GLASS_PALETTE[rect.colorIdx].hatch, '#FFFFFF'], { speed: 170, size: 5 });
            this._litT = 1;
        }
        else {
            SoundManager_1.SoundManager.playError();
            this._misses++;
            this.fx.shake(6, 0.22);
            (0, GameShell_1.haptic)([8, 40, 8]);
        }
        this._checkWin();
    }
    _checkWin() {
        const lvl = exports.VERIFIED_GLASS_LEVELS[this._levelIdx];
        const N = lvl.size;
        let covered = 0;
        for (const rc of this._rects) {
            if (!this._isValid(rc))
                return;
            covered += (rc.r2 - rc.r1 + 1) * (rc.c2 - rc.c1 + 1);
        }
        if (covered === N * N && this._rects.length === lvl.clues.length) {
            for (const rc of this._rects) {
                const p = this._rectCenter(rc);
                this.fx.ring(p.x, p.y, GLASS_PALETTE[rc.colorIdx].fill, 46, 0.8);
            }
            this.win(this._stars());
        }
    }
    _stars() {
        if (this._misses === 0 && this._hintsUsed === 0)
            return 3;
        if (this._misses <= 3 && this._hintsUsed <= 1)
            return 2;
        return 1;
    }
    applyHintRect() {
        if (this.phase !== 'play')
            return;
        const lvl = exports.VERIFIED_GLASS_LEVELS[this._levelIdx];
        for (const sol of lvl.solutionRects) {
            const already = this._rects.some((rc) => rc.r1 === sol.r1 && rc.c1 === sol.c1 && rc.r2 === sol.r2 && rc.c2 === sol.c2);
            if (already)
                continue;
            this._hintsUsed++;
            this._rects = this._rects.filter((rc) => !this._overlap(rc, sol));
            this._rects.push({ ...sol });
            const p = this._rectCenter(sol);
            this.fx.ring(p.x, p.y, Theme_1.T.gold, 44, 0.6);
            this.fx.popText(p.x, p.y + 34, 'Revealed', Theme_1.T.gold, 28);
            SoundManager_1.SoundManager.playGlassChime();
            this._checkWin();
            return;
        }
    }
    // =================================================================================
    //  Geometry
    // =================================================================================
    get _span() {
        return this.lay.board;
    }
    get _boardCY() {
        return this.lay.boardCY;
    }
    _cellSize() {
        return this._span / exports.VERIFIED_GLASS_LEVELS[this._levelIdx].size;
    }
    _cellPos(r, c) {
        const s = this._cellSize();
        const half = this._span * 0.5;
        return { x: -half + (c + 0.5) * s, y: this._boardCY + half - (r + 0.5) * s };
    }
    _rectCenter(rc) {
        const a = this._cellPos(rc.r1, rc.c1);
        const b = this._cellPos(rc.r2, rc.c2);
        return { x: (a.x + b.x) * 0.5, y: (a.y + b.y) * 0.5 };
    }
    _toCell(x, y) {
        const lvl = exports.VERIFIED_GLASS_LEVELS[this._levelIdx];
        const half = this._span * 0.5;
        const relX = x + half;
        const relY = this._boardCY + half - y;
        if (relX < 0 || relX >= this._span || relY < 0 || relY >= this._span)
            return null;
        const s = this._cellSize();
        return [
            Math.max(0, Math.min(lvl.size - 1, Math.floor(relY / s))),
            Math.max(0, Math.min(lvl.size - 1, Math.floor(relX / s))),
        ];
    }
    // =================================================================================
    //  Input
    // =================================================================================
    onFieldDown(x, y) {
        const cell = this._toCell(x, y);
        if (!cell)
            return;
        this._dragging = true;
        this._dragStart = cell;
        this._dragCur = cell;
        SoundManager_1.SoundManager.playTap(1.05);
        (0, GameShell_1.haptic)(5);
    }
    onFieldMove(x, y) {
        if (!this._dragging || !this._dragStart)
            return;
        const cell = this._toCell(x, y);
        if (!cell)
            return;
        if (!this._dragCur || cell[0] !== this._dragCur[0] || cell[1] !== this._dragCur[1]) {
            this._dragCur = cell;
            SoundManager_1.SoundManager.playTap(1.15);
        }
    }
    onFieldUp() {
        if (!this._dragging || !this._dragStart || !this._dragCur)
            return;
        const [r1, c1] = this._dragStart;
        const [r2, c2] = this._dragCur;
        this._dragging = false;
        this._dragStart = null;
        this._dragCur = null;
        this._commit(r1, c1, r2, c2);
    }
    // =================================================================================
    //  Render
    // =================================================================================
    onTick(dt) {
        this._litT = Math.max(0, this._litT - dt * 1.4);
    }
    drawField(g, _dt) {
        const lvl = exports.VERIFIED_GLASS_LEVELS[this._levelIdx];
        const N = lvl.size;
        const s = this._cellSize();
        const span = this._span;
        const cy = this._boardCY;
        const half = span * 0.5;
        this.drawTray(g, 0, cy, span, span, 30);
        // Light box behind the window.
        g.save();
        g.setBlend('lighter');
        g.setFillRadial(0, cy, 0, span * 0.9, [
            [0, (0, Theme_1.rgba)(this.pal.accent, 0.22 + this._litT * 0.16)],
            [1, (0, Theme_1.rgba)(this.pal.accent, 0)],
        ]);
        g.circle(0, cy, span * 0.9);
        g.fill();
        g.clearFillGradient();
        g.restore();
        // Lead frame.
        g.setShadow(new cc_1.Color(0, 0, 0, 180), 30, 0, -12);
        g.setFillGradient(0, cy + half + 22, 0, cy - half - 22, [
            [0, '#2A1C44'],
            [1, '#120A24'],
        ]);
        g.roundRect(-half - 22, cy - half - 22, span + 44, span + 44, 28);
        g.fill();
        g.clearFillGradient();
        g.clearShadow();
        g.strokeColor = (0, Theme_1.hex)(this.pal.accent, 70);
        g.lineWidth = 1.6;
        g.roundRect(-half - 22, cy - half - 22, span + 44, span + 44, 28);
        g.stroke();
        // Dark empty glass behind unfilled cells.
        g.setFillGradient(0, cy + half, 0, cy - half, [
            [0, '#17102E'],
            [1, '#0A0618'],
        ]);
        g.rect(-half, cy - half, span, span);
        g.fill();
        g.clearFillGradient();
        g.strokeColor = (0, Theme_1.hex)(LightShell_1.LIGHT.cardEdge, 190);
        g.lineWidth = 1;
        for (let i = 1; i < N; i++) {
            g.moveTo(-half + i * s, cy - half);
            g.lineTo(-half + i * s, cy + half);
            g.moveTo(-half, cy - half + i * s);
            g.lineTo(half, cy - half + i * s);
        }
        g.stroke();
        // --- committed panes ---------------------------------------------------------
        for (const rc of this._rects)
            this._drawPane(g, rc, this._isValid(rc));
        // --- live drag preview --------------------------------------------------------
        if (this._dragging && this._dragStart && this._dragCur) {
            const r1 = Math.min(this._dragStart[0], this._dragCur[0]);
            const r2 = Math.max(this._dragStart[0], this._dragCur[0]);
            const c1 = Math.min(this._dragStart[1], this._dragCur[1]);
            const c2 = Math.max(this._dragStart[1], this._dragCur[1]);
            const area = (r2 - r1 + 1) * (c2 - c1 + 1);
            const clues = lvl.clues.filter((cl) => cl.r >= r1 && cl.r <= r2 && cl.c >= c1 && cl.c <= c2);
            const ok = clues.length === 1 && clues[0].area === area;
            const a = this._cellPos(r1, c1);
            const b = this._cellPos(r2, c2);
            const x = a.x - s * 0.5;
            const y = b.y - s * 0.5;
            const w = b.x - a.x + s;
            const h = a.y - b.y + s;
            g.fillColor = (0, Theme_1.hex)(ok ? LightShell_1.LIGHT.mint : LightShell_1.LIGHT.ink, 40);
            g.roundRect(x + 3, y + 3, w - 6, h - 6, 8);
            g.fill();
            g.strokeColor = (0, Theme_1.hex)(ok ? LightShell_1.LIGHT.mint : LightShell_1.LIGHT.ink, 220);
            g.lineWidth = 3.4;
            g.setLineDash([9, 6]);
            g.roundRect(x + 3, y + 3, w - 6, h - 6, 8);
            g.stroke();
            g.setLineDash([]);
            // Live area readout on the selection itself.
            const cxm = (x + w * 0.5);
            const cym = (y + h * 0.5);
            g.fillColor = new cc_1.Color(8, 5, 20, 210);
            g.roundRect(cxm - 44, cym - 20, 88, 40, 20);
            g.fill();
            g.text((c2 - c1 + 1) + '×' + (r2 - r1 + 1) + '=' + area, cxm, cym, {
                size: 22,
                weight: 900,
                family: cc_1.FONT_DISPLAY,
                color: (0, Theme_1.hex)(ok ? LightShell_1.LIGHT.mint : LightShell_1.LIGHT.ink),
            });
        }
        // --- clues --------------------------------------------------------------------
        for (const cl of lvl.clues) {
            const p = this._cellPos(cl.r, cl.c);
            const solved = this._rects.some((rc) => this._isValid(rc) && cl.r >= rc.r1 && cl.r <= rc.r2 && cl.c >= rc.c1 && cl.c <= rc.c2);
            const r = s * 0.3;
            g.setShadow(new cc_1.Color(0, 0, 0, 170), 10, 0, -3);
            g.setFillGradient(0, p.y + r, 0, p.y - r, [
                [0, solved ? '#FFFFFF' : '#F3EDFF'],
                [1, solved ? '#CFE9FF' : '#B9ABD8'],
            ]);
            g.circle(p.x, p.y, r);
            g.fill();
            g.clearFillGradient();
            g.clearShadow();
            if (solved) {
                g.save();
                g.setBlend('lighter');
                g.setFillRadial(p.x, p.y, 0, r * 2, [
                    [0, (0, Theme_1.rgba)('#FFFFFF', 0.4)],
                    [1, (0, Theme_1.rgba)('#FFFFFF', 0)],
                ]);
                g.circle(p.x, p.y, r * 2);
                g.fill();
                g.clearFillGradient();
                g.restore();
            }
            g.text(String(cl.area), p.x, p.y, {
                size: s * 0.34,
                weight: 1000,
                family: cc_1.FONT_DISPLAY,
                color: (0, Theme_1.hex)('#1B1033'),
            });
        }
        // Specular sweep across the whole window.
        const sweep = ((this.time * 0.18) % 1.6) / 1.6;
        const sx = -half - 120 + sweep * (span + 240);
        g.save();
        g.roundRect(-half, cy - half, span, span, 6);
        g.clip();
        g.setBlend('lighter');
        g.setFillGradient(sx - 70, 0, sx + 70, 0, [
            [0, 'rgba(255,255,255,0)'],
            [0.5, 'rgba(255,255,255,0.09)'],
            [1, 'rgba(255,255,255,0)'],
        ]);
        g.rect(sx - 70, cy - half, 140, span);
        g.fill();
        g.clearFillGradient();
        g.restore();
    }
    _drawPane(g, rc, valid) {
        const s = this._cellSize();
        const a = this._cellPos(rc.r1, rc.c1);
        const b = this._cellPos(rc.r2, rc.c2);
        const x = a.x - s * 0.5;
        const y = b.y - s * 0.5;
        const w = b.x - a.x + s;
        const h = a.y - b.y + s;
        const pal = GLASS_PALETTE[rc.colorIdx % GLASS_PALETTE.length];
        const col = valid ? pal.fill : '#8A2638';
        const edge = valid ? pal.stroke : '#4A101E';
        const hatch = valid ? pal.hatch : '#FF9BAE';
        // Backlit glass.
        g.setFillGradient(0, y + h, 0, y, [
            [0, (0, Theme_1.rgba)(col, valid ? 0.92 : 0.8)],
            [0.55, (0, Theme_1.rgba)(col, valid ? 0.62 : 0.55)],
            [1, (0, Theme_1.rgba)(col, valid ? 0.86 : 0.75)],
        ]);
        g.roundRect(x + 2.5, y + 2.5, w - 5, h - 5, 7);
        g.fill();
        g.clearFillGradient();
        // Diagonal hatch — the texture that makes flat colour read as glass.
        g.save();
        g.roundRect(x + 2.5, y + 2.5, w - 5, h - 5, 7);
        g.clip();
        g.strokeColor = (0, Theme_1.hex)(hatch, 46);
        g.lineWidth = 1.6;
        for (let d = -h; d < w; d += 13) {
            g.moveTo(x + d, y);
            g.lineTo(x + d + h, y + h);
        }
        g.stroke();
        // Inner glow along the top edge.
        g.setFillGradient(0, y + h, 0, y + h - 18, [
            [0, (0, Theme_1.rgba)('#FFFFFF', 0.3)],
            [1, (0, Theme_1.rgba)('#FFFFFF', 0)],
        ]);
        g.rect(x, y + h - 18, w, 18);
        g.fill();
        g.clearFillGradient();
        g.restore();
        // Leaded came.
        g.strokeColor = (0, Theme_1.hex)(edge, 245);
        g.lineWidth = 5;
        g.roundRect(x + 2.5, y + 2.5, w - 5, h - 5, 7);
        g.stroke();
        g.strokeColor = (0, Theme_1.hex)(hatch, 110);
        g.lineWidth = 1.4;
        g.roundRect(x + 5.5, y + 5.5, w - 11, h - 11, 5);
        g.stroke();
        if (valid) {
            g.save();
            g.setBlend('lighter');
            g.setAlpha(0.3 + this._litT * 0.4);
            g.setShadow((0, Theme_1.hex)(col, 220), 22, 0, 0);
            g.fillColor = (0, Theme_1.hex)(col, 36);
            g.roundRect(x + 2.5, y + 2.5, w - 5, h - 5, 7);
            g.fill();
            g.clearShadow();
            g.restore();
        }
    }
}
exports.IsleOfGlassGame = IsleOfGlassGame;

  };

  // === MODULE: ./TikTokArcadeBootstrap ===
  __modules["./TikTokArcadeBootstrap"] = function(module, exports, require) {
"use strict";
// =====================================================================================
//  TikTokArcadeBootstrap — the app shell: boot animation, hub, routing, ad overlay.
// =====================================================================================
//  Everything the player sees before a game starts lives here. The hub is the shop
//  window for all five games, so it gets the same production value as the games
//  themselves: animated thumbnails, real progress, one obvious tap target.
// =====================================================================================
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TikTokArcadeBootstrap = exports.SOLO = void 0;
const cc_1 = require("cc");
const SoundManager_1 = require("./core/SoundManager");
const TikTokSDK_1 = require("./sdk/TikTokSDK");
const Theme_1 = require("./core/Theme");
const UI = require("./core/UIKit");
const FX_1 = require("./core/FX");
const Progress_1 = require("./core/Progress");
const GameArt_1 = require("./core/GameArt");
const Art_1 = require("./core/Art");
const GameShell_1 = require("./core/GameShell");
const AdDirector_1 = require("./core/AdDirector");
const LightShell_1 = require("./core/LightShell");
const NyandokuGame_1 = require("./games/NyandokuGame");
const SaveDogeGame_1 = require("./games/SaveDogeGame");
const AppleWormGame_1 = require("./games/AppleWormGame");
const ParaboxGame_1 = require("./games/ParaboxGame");
const IsleOfGlassGame_1 = require("./games/IsleOfGlassGame");
const { ccclass } = cc_1._decorator;
/**
 * Solo mode — one game per package.
 *
 * Each game ships to TikTok as its own mini game with its own app id and its own ad
 * units, so a shipped package boots straight into one game and the hub never appears.
 * The native entry point sets this before boot; the studio preview leaves it null and
 * gets the full arcade.
 */
exports.SOLO = { id: null };
const CATALOG = [
    {
        id: 'nyandoku',
        name: 'Nyandoku',
        cn: '貓咪數獨',
        tagline: 'One cat per row, column and colour. No touching.',
        levels: 50,
        accent: '#F79A3E',
        accent2: '#7FD1C8',
        badge: 'LOGIC',
    },
    {
        id: 'savedoge',
        name: 'Save Doge',
        cn: '畫線救狗',
        tagline: 'Draw one line. Hold off the swarm for six seconds.',
        levels: 5,
        accent: '#FF8A3D',
        accent2: '#FFD84D',
        badge: 'PHYSICS',
    },
    {
        id: 'appleworm',
        name: 'Apple Worm',
        cn: '貪吃蘋果蟲',
        tagline: 'Eat, grow, bridge the gap, reach the portal.',
        levels: 5,
        accent: '#3DDC97',
        accent2: '#9BE564',
        badge: 'PUZZLE',
    },
    {
        id: 'parabox',
        name: 'Paradox Box',
        cn: '無限套盒',
        tagline: 'Push the box. Or step inside the box.',
        levels: 5,
        accent: '#4D8BFF',
        accent2: '#9A7BFF',
        badge: 'MIND-BEND',
    },
    {
        id: 'isleofglass',
        name: 'Isle of Glass',
        cn: '琉璃之島',
        tagline: 'Cut panes of light that match their number.',
        levels: 5,
        accent: '#C77DFF',
        accent2: '#4ECDC4',
        badge: 'ZEN',
    },
];
let TikTokArcadeBootstrap = class TikTokArcadeBootstrap extends cc_1.Component {
    constructor() {
        super(...arguments);
        this._uiTransform = null;
        this._hubNode = null;
        this._gHub = null;
        this._hubHits = [];
        this._hubFx = new FX_1.FX();
        this._hubAnim = new FX_1.Anim();
        this._hubTl = new FX_1.Timeline();
        this._pressedId = null;
        this._heroIndex = 0;
        this._bootT = 0;
        this._booting = true;
        this._gameContainer = null;
        this._activeGameId = 'hub';
        this._activeGame = null;
        // Rewarded-ad overlay.
        this._adLayer = null;
        this._gAd = null;
        this._adHits = [];
        this._adActive = false;
        this._adReason = '';
        this._adKind = 'rewarded';
        this._adTimer = 0;
        this._adTotal = 5;
        this._adCallback = null;
        this._time = 0;
    }
    // =================================================================================
    //  Lifecycle
    // =================================================================================
    onLoad() {
        this._uiTransform = this.node.getComponent(cc_1.UITransform) || this.node.addComponent(cc_1.UITransform);
        this._uiTransform.setContentSize(Theme_1.T.W, Theme_1.T.H);
        (0, Art_1.loadArt)();
        if (Progress_1.Progress.muted !== SoundManager_1.SoundManager.muted)
            SoundManager_1.SoundManager.toggleMute();
        this._hubNode = this._layerNode('HubLayer');
        this._gHub = this._hubNode.addComponent(cc_1.Graphics);
        this._gameContainer = new cc_1.Node('GameContainer');
        this._gameContainer.layer = this.node.layer;
        this.node.addChild(this._gameContainer);
        this._adLayer = this._layerNode('AdOverlay');
        this._gAd = this._adLayer.addComponent(cc_1.Graphics);
        this._adLayer.active = false;
        TikTokSDK_1.TikTokSDK.preload();
        TikTokSDK_1.TikTokSDK.registerAdOverlayHandler((reason, kind, onComplete) => this._showAdModal(reason, kind, onComplete));
        this.node.on(cc_1.Node.EventType.TOUCH_START, this._onTouchStart, this);
        this.node.on(cc_1.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
        this.node.on(cc_1.Node.EventType.TOUCH_END, this._onTouchEnd, this);
        this.node.on(cc_1.Node.EventType.TOUCH_CANCEL, this._onTouchEnd, this);
        cc_1.input.on(cc_1.Input.EventType.KEY_DOWN, this._onKeyDown, this);
        if (typeof window !== 'undefined') {
            window.tiktokArcade = {
                launchGame: (id, demo = false) => this.launchGame(id, demo),
                getActiveGameId: () => this._activeGameId,
                getActiveGame: () => this._activeGame,
                skipBoot: () => {
                    this._booting = false;
                },
                resetProgress: () => Progress_1.Progress.resetAll(),
                adDebug: () => AdDirector_1.AdDirector.debugState(),
                adStats: () => TikTokSDK_1.TikTokSDK.stats,
                resetAdSession: () => AdDirector_1.AdDirector.resetSession(),
                adAgeSession: (sec) => AdDirector_1.AdDirector.debugAgeSession(sec),
                triggerRewardedAd: () => TikTokSDK_1.TikTokSDK.showRewardedVideoAd('Creator Test Ad Placement', () => this._renderHub(0)),
            };
        }
        this.launchGame(exports.SOLO.id || 'hub');
    }
    _layerNode(name) {
        const n = new cc_1.Node(name);
        n.layer = this.node.layer;
        this.node.addChild(n);
        n.addComponent(cc_1.UITransform).setContentSize(Theme_1.T.W, Theme_1.T.H);
        return n;
    }
    onDestroy() {
        cc_1.input.off(cc_1.Input.EventType.KEY_DOWN, this._onKeyDown, this);
    }
    // =================================================================================
    //  Routing
    // =================================================================================
    launchGame(id, screenshotDemo = false) {
        if (this._activeGame) {
            this._activeGame.destroy();
            this._activeGame = null;
        }
        this._activeGameId = id;
        if (id === 'hub') {
            if (this._hubNode)
                this._hubNode.active = true;
            this._hubTl.reset();
            this._renderHub(0);
            this._notifyHost(id);
            return;
        }
        if (this._hubNode)
            this._hubNode.active = false;
        if (!this._gameContainer)
            return;
        // A solo package has no hub, and LightShell hides the back button there, so this
        // callback should never fire — it stays harmless rather than clever.
        const back = exports.SOLO.id ? () => { } : () => this.launchGame('hub');
        switch (id) {
            case 'nyandoku':
                this._activeGame = new NyandokuGame_1.NyandokuGame(this._gameContainer, back, screenshotDemo);
                break;
            case 'savedoge':
                this._activeGame = new SaveDogeGame_1.SaveDogeGame(this._gameContainer, back);
                break;
            case 'appleworm':
                this._activeGame = new AppleWormGame_1.AppleWormGame(this._gameContainer, back);
                break;
            case 'parabox':
                this._activeGame = new ParaboxGame_1.ParaboxGame(this._gameContainer, back);
                break;
            case 'isleofglass':
                this._activeGame = new IsleOfGlassGame_1.IsleOfGlassGame(this._gameContainer, back);
                break;
        }
        this._notifyHost(id);
    }
    _notifyHost(id) {
        if (typeof window !== 'undefined' && typeof window.onTikTokGameChanged === 'function') {
            window.onTikTokGameChanged(id);
        }
    }
    // =================================================================================
    //  Frame
    // =================================================================================
    update(dt) {
        this._time += dt;
        if (this._adActive) {
            this._adTimer = Math.max(0, this._adTimer - dt);
            this._renderAdModal();
            return;
        }
        if (this._activeGameId === 'hub') {
            if (this._booting) {
                this._bootT += dt;
                if (this._bootT > 2.0)
                    this._booting = false;
            }
            this._hubFx.update(dt);
            this._hubAnim.update(dt);
            this._hubTl.update(dt);
            this._renderHub(dt);
            return;
        }
        if (this._activeGame)
            this._activeGame.update(dt);
    }
    // =================================================================================
    //  Hub
    // =================================================================================
    _renderHub(_dt) {
        const g = this._gHub;
        if (!g)
            return;
        g.clear();
        this._hubHits = [];
        const pal = Theme_1.PALETTES.hub;
        UI.backdrop(g, pal, this._time);
        UI.motes(g, this._time, 26, '#FFFFFF', 7);
        if (this._booting) {
            this._drawBoot(g);
            return;
        }
        const enter = (0, Theme_1.clamp01)((this._hubTl.t - 0.0) / 0.5);
        // --- masthead -----------------------------------------------------------
        const mastT = Theme_1.Ease.outCubic((0, Theme_1.clamp01)(enter * 1.6));
        g.save();
        g.setAlpha(mastT);
        g.text('5 GAMES · ONE TAP · NO DOWNLOAD', 0, (0, Theme_1.lerp)(576, 556, mastT), {
            size: 19,
            weight: 900,
            family: cc_1.FONT_UI,
            color: (0, Theme_1.hex)(Theme_1.T.cyan),
            uppercase: true,
            tracking: 3.4,
        });
        g.text('TikTok Arcade', 0, (0, Theme_1.lerp)(486, 500, mastT), {
            size: 66,
            weight: 900,
            family: cc_1.FONT_DISPLAY,
            gradient: [
                [0, '#FFFFFF'],
                [0.6, '#FFE3EA'],
                [1, '#FF9DB4'],
            ],
            color: (0, Theme_1.hex)('#FFFFFF'),
            tracking: -1.6,
            shadow: new cc_1.Color(254, 44, 85, 120),
            shadowBlur: 26,
            maxWidth: Theme_1.T.W - 90,
        });
        g.restore();
        // --- player strip ---------------------------------------------------------
        const stripT = Theme_1.Ease.outCubic((0, Theme_1.clamp01)((this._hubTl.t - 0.08) / 0.5));
        const stars = Progress_1.Progress.grandTotal();
        const maxStars = CATALOG.reduce((a, c) => a + c.levels * 3, 0);
        g.save();
        g.setAlpha(stripT);
        const sw = Theme_1.T.W - Theme_1.T.gutter * 2;
        const sy = (0, Theme_1.lerp)(428, 442, stripT);
        UI.panel(g, 0, sy, sw, 72, {
            radius: 36,
            fill: ['rgba(255,255,255,0.11)', 'rgba(255,255,255,0.04)'],
            border: new cc_1.Color(255, 255, 255, 32),
            borderWidth: 1.4,
            shadowBlur: 18,
            shadowY: -6,
        });
        UI.icon(g, 'star', -sw * 0.5 + 40, sy, 32, (0, Theme_1.hex)(Theme_1.T.gold));
        g.text(stars + ' / ' + maxStars, -sw * 0.5 + 64, sy, {
            size: 28,
            weight: 900,
            family: cc_1.FONT_DISPLAY,
            color: (0, Theme_1.hex)(Theme_1.T.textHi),
            align: 'left',
        });
        UI.progressBar(g, 46, sy, 388, 11, maxStars ? stars / maxStars : 0, {
            from: Theme_1.T.gold,
            to: '#FFE08A',
        });
        const muted = SoundManager_1.SoundManager.muted;
        UI.iconButton(g, sw * 0.5 - 36, sy, 25, muted ? 'mute' : 'sound', { pressed: this._pressedId === 'hub_sound' });
        this._hubHits.push({ id: 'hub_sound', x: sw * 0.5 - 36, y: sy, w: 70, h: 70 });
        g.restore();
        // --- hero -----------------------------------------------------------------
        this._drawHero(g);
        // --- grid -----------------------------------------------------------------
        const others = CATALOG.filter((_, i) => i !== this._heroIndex);
        const tileW = (Theme_1.T.W - Theme_1.T.gutter * 2 - 20) * 0.5;
        const tileH = 268;
        for (let i = 0; i < others.length; i++) {
            const col = i % 2;
            const row = (i / 2) | 0;
            const x = -(tileW + 20) * 0.5 + col * (tileW + 20);
            const y = -78 - row * (tileH + 20);
            this._drawTile(g, others[i], x, y, tileW, tileH, 0.2 + i * 0.07);
        }
        // --- footer ---------------------------------------------------------------
        const footT = Theme_1.Ease.outCubic((0, Theme_1.clamp01)((this._hubTl.t - 0.55) / 0.5));
        g.save();
        g.setAlpha(footT * 0.8);
        g.text('Built with Cocos Creator · TikTok Mini Game SDK', 0, -582, {
            size: 18,
            weight: 700,
            family: cc_1.FONT_UI,
            color: (0, Theme_1.hex)(Theme_1.T.textFaint),
            uppercase: true,
            tracking: 1.6,
        });
        g.restore();
        this._hubFx.draw(g);
        this._hubFx.drawTexts(g);
    }
    /** Animated splash — two seconds of brand before the hub resolves. */
    _drawBoot(g) {
        const t = this._bootT;
        const ring = (0, Theme_1.clamp01)(t / 1.1);
        const pop = Theme_1.Ease.outBack((0, Theme_1.clamp01)((t - 0.15) / 0.7), 1.8);
        const fade = 1 - (0, Theme_1.clamp01)((t - 1.6) / 0.4);
        g.save();
        g.setAlpha(fade);
        g.save();
        g.setBlend('lighter');
        g.setFillRadial(0, 60, 0, 360 * pop, [
            [0, (0, Theme_1.rgba)(Theme_1.T.pink, 0.4)],
            [0.5, (0, Theme_1.rgba)(Theme_1.T.pink, 0.1)],
            [1, (0, Theme_1.rgba)(Theme_1.T.pink, 0)],
        ]);
        g.circle(0, 60, 360 * pop);
        g.fill();
        g.clearFillGradient();
        g.restore();
        // Arcade mark: a rounded screen with a play glyph.
        const s = 150 * pop;
        g.setShadow((0, Theme_1.hex)(Theme_1.T.pink, 200), 40, 0, 0);
        g.setFillGradient(0, 60 + s, 0, 60 - s, [
            [0, '#FF5C7C'],
            [1, '#FE2C55'],
        ]);
        g.roundRect(-s * 0.5, 60 - s * 0.5, s, s, s * 0.3);
        g.fill();
        g.clearFillGradient();
        g.clearShadow();
        UI.icon(g, 'play', 0, 60, s * 0.52, (0, Theme_1.hex)('#FFFFFF'));
        g.text('TikTok Arcade', 0, -130, {
            size: 52,
            weight: 900,
            family: cc_1.FONT_DISPLAY,
            color: (0, Theme_1.hex)('#FFFFFF'),
            tracking: -1,
        });
        // Loading arc.
        g.strokeColor = new cc_1.Color(255, 255, 255, 40);
        g.lineWidth = 5;
        g.circle(0, -240, 26);
        g.stroke();
        g.strokeColor = (0, Theme_1.hex)(Theme_1.T.cyan);
        g.lineWidth = 5;
        g.arc(0, -240, 26, Math.PI * 0.5, Math.PI * 0.5 - ring * Math.PI * 2, true);
        g.stroke();
        g.restore();
    }
    _drawHero(g) {
        const e = CATALOG[this._heroIndex];
        const t = Theme_1.Ease.outBack((0, Theme_1.clamp01)((this._hubTl.t - 0.14) / 0.6), 1.1);
        const w = Theme_1.T.W - Theme_1.T.gutter * 2;
        const h = 296;
        const cy = (0, Theme_1.lerp)(196, 234, t);
        const pressed = this._pressedId === 'hero';
        const sink = pressed ? 5 : 0;
        const y = cy - sink;
        g.save();
        g.setAlpha((0, Theme_1.clamp01)(t * 1.4));
        UI.panel(g, 0, y, w, h, {
            radius: 38,
            fill: [(0, Theme_1.rgba)(e.accent, 0.3), 'rgba(12,14,28,0.93)'],
            border: (0, Theme_1.hex)(e.accent, 120),
            borderWidth: 2,
            glow: e.accent,
            glowStrength: 0.34,
            shadowBlur: 36,
            shadowY: -16,
        });
        // Header row: badge + "continue" marker.
        const padX = 26;
        UI.chip(g, -w * 0.5 + padX, y + h * 0.5 - 34, 'CONTINUE', {
            tint: e.accent,
            fontSize: 15,
            align: 'left',
            solid: true,
        });
        g.text(e.cn, w * 0.5 - padX, y + h * 0.5 - 34, {
            size: 20,
            weight: 800,
            family: cc_1.FONT_UI,
            color: (0, Theme_1.hex)(Theme_1.T.textDim),
            align: 'right',
        });
        // Art well.
        const artR = 72;
        const artX = -w * 0.5 + padX + artR;
        const artY = y - 18;
        g.save();
        g.roundRect(artX - artR, artY - artR, artR * 2, artR * 2, 28);
        g.clip();
        g.setFillGradient(0, artY + artR, 0, artY - artR, [
            [0, (0, Theme_1.rgba)(e.accent, 0.42)],
            [1, 'rgba(0,0,0,0.55)'],
        ]);
        g.rect(artX - artR, artY - artR, artR * 2, artR * 2);
        g.fill();
        g.clearFillGradient();
        if ((0, Art_1.hasArt)('key_' + e.id)) {
            const breathe = 1 + Math.sin(this._time * 0.8) * 0.015;
            g.image('key_' + e.id, artX, artY, artR * 2 * breathe, artR * 2 * breathe, { cover: true });
        }
        else {
            (0, GameArt_1.gameArt)(g, e.id, artX, artY, artR * 1.85, this._time);
        }
        g.restore();
        g.strokeColor = (0, Theme_1.hex)(e.accent, 120);
        g.lineWidth = 1.6;
        g.roundRect(artX - artR, artY - artR, artR * 2, artR * 2, 28);
        g.stroke();
        // Copy column.
        const tx = artX + artR + 22;
        const colW = w * 0.5 - padX - (artR * 2 + 22) + w * 0.5 - padX;
        g.text(e.name, tx, y + 50, {
            size: 40,
            weight: 900,
            family: cc_1.FONT_DISPLAY,
            color: (0, Theme_1.hex)(Theme_1.T.textHi),
            align: 'left',
            tracking: -0.8,
            maxWidth: colW,
        });
        g.text(e.tagline, tx, y + 8, {
            size: 20,
            weight: 700,
            family: cc_1.FONT_UI,
            color: (0, Theme_1.hex)(Theme_1.T.textDim),
            align: 'left',
            maxWidth: colW,
            lineHeight: 25,
        });
        const btn = {
            id: 'hero',
            x: tx + colW * 0.5,
            y: y - 62,
            w: colW,
            h: 70,
            label: 'Play Now',
            icon: 'play',
            tone: 'accent',
            pulse: true,
        };
        UI.button(g, btn, { ...Theme_1.PALETTES.hub, accent: e.accent, accentDeep: (0, Theme_1.hex)(e.accent).shade(-0.42).toCSS() }, { pressed, time: this._time });
        g.restore();
        this._hubHits.push({ id: 'hero', x: 0, y: cy, w, h, data: e.id });
    }
    _drawTile(g, e, cx, cy, w, h, delay) {
        const t = Theme_1.Ease.outBack((0, Theme_1.clamp01)((this._hubTl.t - delay) / 0.55), 1.1);
        if (t <= 0.01)
            return;
        const pressed = this._pressedId === 'tile_' + e.id;
        const sink = pressed ? 5 : 0;
        const y = (0, Theme_1.lerp)(cy - 34, cy, t) - sink;
        const stars = Progress_1.Progress.totalStars(e.id);
        const maxS = e.levels * 3;
        g.save();
        g.setAlpha((0, Theme_1.clamp01)(t * 1.5));
        UI.panel(g, cx, y, w, h, {
            radius: 30,
            fill: [(0, Theme_1.rgba)(e.accent, 0.2), 'rgba(13,15,30,0.95)'],
            border: (0, Theme_1.hex)(e.accent, 85),
            borderWidth: 1.6,
            shadowBlur: 24,
            shadowY: -11,
        });
        // Art window fills the top two thirds.
        const pad = 14;
        const artH = 158;
        const artCY = y + h * 0.5 - pad - artH * 0.5;
        g.save();
        g.roundRect(cx - w * 0.5 + pad, artCY - artH * 0.5, w - pad * 2, artH, 22);
        g.clip();
        g.setFillGradient(0, artCY + artH * 0.5, 0, artCY - artH * 0.5, [
            [0, (0, Theme_1.rgba)(e.accent, 0.36)],
            [1, 'rgba(0,0,0,0.6)'],
        ]);
        g.rect(cx - w * 0.5 + pad, artCY - artH * 0.5, w - pad * 2, artH);
        g.fill();
        g.clearFillGradient();
        if ((0, Art_1.hasArt)('key_' + e.id)) {
            // Slow Ken Burns drift keeps the grid alive without animating every pixel.
            const drift = Math.sin(this._time * 0.35 + delay * 6) * 5;
            g.image('key_' + e.id, cx, artCY + drift * 0.4, w - pad * 2 + 16, artH + 16, { cover: true });
            // Scrim so the badge chip stays legible over any artwork.
            g.setFillGradient(0, artCY - artH * 0.5, 0, artCY - artH * 0.5 + 54, [
                [0, 'rgba(6,8,18,0.78)'],
                [1, 'rgba(6,8,18,0)'],
            ]);
            g.rect(cx - w * 0.5 + pad, artCY - artH * 0.5, w - pad * 2, 54);
            g.fill();
            g.clearFillGradient();
        }
        else {
            (0, GameArt_1.gameArt)(g, e.id, cx, artCY + 6, 124, this._time + delay * 3);
        }
        g.restore();
        g.strokeColor = (0, Theme_1.hex)(e.accent, 70);
        g.lineWidth = 1.3;
        g.roundRect(cx - w * 0.5 + pad, artCY - artH * 0.5, w - pad * 2, artH, 22);
        g.stroke();
        UI.chip(g, cx - w * 0.5 + pad + 8, artCY - artH * 0.5 + 18, e.badge, {
            tint: e.accent,
            fontSize: 13,
            align: 'left',
            solid: true,
        });
        g.text(e.name, cx, y - h * 0.5 + 62, {
            size: 27,
            weight: 900,
            family: cc_1.FONT_DISPLAY,
            color: (0, Theme_1.hex)(Theme_1.T.textHi),
            tracking: -0.3,
            maxWidth: w - 26,
        });
        g.text(e.levels + ' levels', cx, y - h * 0.5 + 38, {
            size: 15,
            weight: 800,
            family: cc_1.FONT_UI,
            color: (0, Theme_1.hex)(Theme_1.T.textFaint),
            uppercase: true,
            tracking: 1.5,
        });
        UI.progressBar(g, cx, y - h * 0.5 + 18, w - 44, 8, maxS ? stars / maxS : 0, {
            from: e.accent,
            to: e.accent2,
            glow: false,
        });
        g.restore();
        this._hubHits.push({ id: 'tile_' + e.id, x: cx, y: cy, w, h, data: e.id });
    }
    // =================================================================================
    //  Rewarded-ad overlay
    // =================================================================================
    _showAdModal(reason, kind, onComplete) {
        this._adActive = true;
        this._adReason = reason;
        this._adKind = kind;
        // A forced break is short by design; a rewarded view has to be watched through.
        this._adTotal = kind === 'interstitial' ? 3 : 5;
        this._adTimer = this._adTotal;
        this._adCallback = onComplete;
        if (this._adLayer)
            this._adLayer.active = true;
        this._renderAdModal();
    }
    /**
     * The ad sheet, in the same paper the five games are printed on. It used to be a
     * neon panel left over from the dark build, which made every ad feel like it came
     * from a different app than the game it interrupts.
     */
    _renderAdModal() {
        const g = this._gAd;
        if (!g)
            return;
        g.clear();
        this._adHits = [];
        UI.scrim(g, 0.88);
        const rewarded = this._adKind === 'rewarded';
        const accent = rewarded ? LightShell_1.LIGHT.mint : LightShell_1.LIGHT.orange;
        const w = Theme_1.T.W - 110;
        const h = 520;
        const half = h * 0.5;
        // Card.
        g.setShadow((0, Theme_1.hex)(LightShell_1.LIGHT.shadow, 52), 46, 0, 18);
        g.fillColor = (0, Theme_1.hex)(LightShell_1.LIGHT.card);
        g.roundRect(-w * 0.5, -half, w, h, 30);
        g.fill();
        g.clearShadow();
        g.strokeColor = (0, Theme_1.hex)(LightShell_1.LIGHT.cardEdge);
        g.lineWidth = 1.5;
        g.roundRect(-w * 0.5, -half, w, h, 30);
        g.stroke();
        g.text(rewarded ? 'Pangle rewarded video' : 'Sponsored break', 0, half - 46, {
            size: 20,
            weight: 700,
            family: cc_1.FONT_UI,
            color: (0, Theme_1.hex)(LightShell_1.LIGHT.inkSoft),
        });
        // The ad itself. Dark, because it is a video — the only dark thing on the card.
        const vw = w - 64;
        const vh = 190;
        const vy = 85;
        g.fillColor = (0, Theme_1.hex)('#2A201E');
        g.roundRect(-vw * 0.5, vy - vh * 0.5, vw, vh, 18);
        g.fill();
        UI.icon(g, 'video', 0, vy + 16, 46, (0, Theme_1.hex)('#FFFFFF', 190));
        g.text('Ad playing', 0, vy - 40, {
            size: 18,
            weight: 600,
            family: cc_1.FONT_UI,
            color: (0, Theme_1.hex)('#FFFFFF', 110),
        });
        const spin = this._time * 2;
        g.strokeColor = (0, Theme_1.hex)('#FFFFFF', 130);
        g.lineWidth = 2.5;
        g.arc(vw * 0.5 - 30, vy + vh * 0.5 - 28, 9, spin, spin + Math.PI * 1.4, false);
        g.stroke();
        // Progress as a hairline rule that fills, not a glowing bar.
        const done = this._adTimer <= 0;
        const prog = 1 - this._adTimer / this._adTotal;
        const py = -42;
        g.fillColor = (0, Theme_1.hex)(LightShell_1.LIGHT.cardEdge);
        g.roundRect(-vw * 0.5, py - 2, vw, 4, 2);
        g.fill();
        if (prog > 0.002) {
            g.fillColor = (0, Theme_1.hex)(accent);
            g.roundRect(-vw * 0.5, py - 2, Math.max(4, vw * prog), 4, 2);
            g.fill();
        }
        g.text(this._adReason, 0, -82, {
            size: 19,
            weight: 600,
            family: cc_1.FONT_UI,
            color: (0, Theme_1.hex)(LightShell_1.LIGHT.inkSoft),
            maxWidth: vw,
        });
        // Action.
        const bw = vw;
        const bh = 78;
        const by = -170;
        const pressed = this._pressedId === 'ad_claim';
        const sink = pressed && done ? 3 : 0;
        if (done) {
            g.fillColor = (0, Theme_1.hex)(rewarded ? '#2FA772' : LightShell_1.LIGHT.orangeDeep);
            g.roundRect(-bw * 0.5, by - bh * 0.5 - 4, bw, bh, 20);
            g.fill();
        }
        g.fillColor = done ? (0, Theme_1.hex)(accent) : (0, Theme_1.hex)(LightShell_1.LIGHT.cardEdge);
        g.roundRect(-bw * 0.5, by - bh * 0.5 - sink, bw, bh, 20);
        g.fill();
        g.text(done
            ? rewarded
                ? 'Claim reward'
                : 'Continue'
            : (rewarded ? 'Reward in ' : 'Continue in ') + Math.ceil(this._adTimer) + 's', 0, by - 8 - sink, {
            size: 25,
            weight: 800,
            family: cc_1.FONT_UI,
            color: (0, Theme_1.hex)(done ? '#FFFFFF' : LightShell_1.LIGHT.inkSoft),
        });
        if (done)
            this._adHits.push({ id: 'ad_claim', x: 0, y: by, w: bw, h: bh + 18 });
        // A rewarded view can be abandoned at any time — that is what makes it opt-in.
        // A forced break only gets its close button once the countdown is done.
        if (rewarded || done) {
            const cx = w * 0.5 - 34;
            const cy = half - 34;
            g.fillColor = (0, Theme_1.hex)(LightShell_1.LIGHT.bgBottom, this._pressedId === 'ad_close' ? 255 : 180);
            g.circle(cx, cy, 19);
            g.fill();
            UI.icon(g, 'close', cx, cy, 15, (0, Theme_1.hex)(LightShell_1.LIGHT.inkSoft));
            this._adHits.push({ id: 'ad_close', x: cx, y: cy, w: 60, h: 60 });
        }
    }
    _closeAd(rewarded) {
        this._adActive = false;
        if (this._adLayer)
            this._adLayer.active = false;
        // The finger that closed the ad must not also press whatever is behind it.
        const g = this._activeGame;
        if (g && typeof g.lockInput === 'function')
            g.lockInput(0.4);
        const cb = this._adCallback;
        this._adCallback = null;
        if (cb)
            cb(rewarded);
    }
    // =================================================================================
    //  Input
    // =================================================================================
    _eventToLocal(event) {
        const ui = event.getUILocation();
        if (this._uiTransform) {
            const v = this._uiTransform.convertToNodeSpaceAR(new cc_1.Vec3(ui.x, ui.y, 0));
            return { x: v.x, y: v.y };
        }
        return { x: ui.x - Theme_1.T.W * 0.5, y: ui.y - Theme_1.T.H * 0.5 };
    }
    _onTouchStart(event) {
        const p = this._eventToLocal(event);
        if (this._adActive) {
            const hit = UI.hitTest(this._adHits, p.x, p.y);
            if (hit) {
                this._pressedId = hit.id;
                SoundManager_1.SoundManager.playTap();
            }
            return;
        }
        if (this._activeGameId === 'hub') {
            if (this._booting) {
                this._booting = false;
                return;
            }
            const hit = UI.hitTest(this._hubHits, p.x, p.y);
            if (hit) {
                this._pressedId = hit.id;
                SoundManager_1.SoundManager.playTap();
                (0, GameShell_1.haptic)(10);
            }
            return;
        }
        if (this._activeGame)
            this._activeGame.onTouchStart(p.x, p.y);
    }
    _onTouchMove(event) {
        if (this._adActive)
            return;
        const p = this._eventToLocal(event);
        if (this._activeGameId === 'hub')
            return;
        if (this._activeGame)
            this._activeGame.onTouchMove(p.x, p.y);
    }
    _onTouchEnd(event) {
        const p = this._eventToLocal(event);
        const id = this._pressedId;
        this._pressedId = null;
        if (this._adActive) {
            if (!id)
                return;
            const hit = UI.hitTest(this._adHits, p.x, p.y);
            if (!hit || hit.id !== id)
                return;
            if (id === 'ad_claim')
                this._closeAd(true);
            else if (id === 'ad_close')
                this._closeAd(this._adKind === 'interstitial');
            return;
        }
        if (this._activeGameId === 'hub') {
            if (!id)
                return;
            const hit = UI.hitTest(this._hubHits, p.x, p.y);
            if (!hit || hit.id !== id)
                return;
            if (id === 'hub_sound') {
                SoundManager_1.SoundManager.toggleMute();
                Progress_1.Progress.setMuted(SoundManager_1.SoundManager.muted);
                return;
            }
            const target = hit.data;
            if (target) {
                this._hubFx.burst(p.x, p.y, 16, [Theme_1.PALETTES.hub.accent, Theme_1.T.cyan, '#FFFFFF'], { speed: 230, size: 6 });
                this.launchGame(target);
            }
            return;
        }
        if (this._activeGame)
            this._activeGame.onTouchEnd(p.x, p.y);
    }
    _onKeyDown(event) {
        if (this._adActive)
            return;
        if (this._activeGameId === 'hub')
            return;
        let dir = null;
        if (event.keyCode === cc_1.KeyCode.ARROW_UP || event.keyCode === cc_1.KeyCode.KEY_W)
            dir = 'U';
        if (event.keyCode === cc_1.KeyCode.ARROW_DOWN || event.keyCode === cc_1.KeyCode.KEY_S)
            dir = 'D';
        if (event.keyCode === cc_1.KeyCode.ARROW_LEFT || event.keyCode === cc_1.KeyCode.KEY_A)
            dir = 'L';
        if (event.keyCode === cc_1.KeyCode.ARROW_RIGHT || event.keyCode === cc_1.KeyCode.KEY_D)
            dir = 'R';
        if (dir) {
            if (this._activeGame instanceof AppleWormGame_1.AppleWormGame)
                this._activeGame.moveWorm(dir);
            else if (this._activeGame instanceof ParaboxGame_1.ParaboxGame)
                this._activeGame.stepMove(dir);
        }
    }
};
TikTokArcadeBootstrap = __decorate([
    ccclass('TikTokArcadeBootstrap')
], TikTokArcadeBootstrap);
exports.TikTokArcadeBootstrap = TikTokArcadeBootstrap;
// -------------------------------------------------------------------------------------
//  Self-bootstrapping hook for Cocos Creator 3.8.8 scenes.
//  If a scene launches without the component mounted, attach it to the Canvas node so
//  the same build runs from the editor, the web preview and the TikTok package.
// -------------------------------------------------------------------------------------
cc_1.director.on(cc_1.Director.EVENT_AFTER_SCENE_LAUNCH, () => {
    const scene = cc_1.director.getScene();
    if (!scene)
        return;
    if (scene.getComponentInChildren(TikTokArcadeBootstrap))
        return;
    let canvasComp = scene.getComponentInChildren(cc_1.Canvas);
    let canvasNode;
    if (canvasComp) {
        canvasNode = canvasComp.node;
    }
    else {
        canvasNode = new cc_1.Node('Canvas');
        scene.addChild(canvasNode);
        canvasNode.addComponent(cc_1.UITransform).setContentSize(Theme_1.T.W, Theme_1.T.H);
        canvasComp = canvasNode.addComponent(cc_1.Canvas);
        const camNode = new cc_1.Node('Camera');
        canvasNode.addChild(camNode);
        camNode.setPosition(0, 0, 1000);
        const cam = camNode.addComponent(cc_1.Camera);
        cam.projection = 0; // ORTHO
        cam.orthoHeight = Theme_1.T.H * 0.5;
    }
    canvasNode.addComponent(TikTokArcadeBootstrap);
});

  };

  // Boot Cocos 3.8.8 Scene on HTML5 Canvas
  const cc = __require("cc");
  __require("./TikTokArcadeBootstrap");

  function bootCanvas() {
    const canvasEl = document.getElementById("GameCanvas");
    if (!canvasEl) return;
    const ctx = canvasEl.getContext("2d", { alpha: false });
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    // The stage is 720 wide and as tall as the device asks for, so the game fills the
    // screen instead of sitting in letterbox bars.
    function readInset(name) {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name);
      const n = parseFloat(v);
      return isFinite(n) ? n : 0;
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvasEl.getBoundingClientRect();
      const vw = Math.max(1, rect.width || window.innerWidth);
      const vh = Math.max(1, rect.height || window.innerHeight);
      const stageH = cc.stageHeightFor(vw, vh);
      const perStageUnit = vw / 720;
      cc.setStageSize(720, stageH, readInset("--sat") / perStageUnit, readInset("--sab") / perStageUnit);
      canvasEl.width = Math.round(cc.Stage.w * dpr);
      canvasEl.height = Math.round(cc.Stage.h * dpr);
    }
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("orientationchange", resize);
    if (window.ResizeObserver) new ResizeObserver(resize).observe(canvasEl);

    cc.director.emit(cc.Director.EVENT_AFTER_SCENE_LAUNCH);
    const scene = cc.director.getScene();
    const canvasNode = scene.children[0];

    function toGameCoords(clientX, clientY) {
      const rect = canvasEl.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * cc.Stage.w;
      const y = (1 - (clientY - rect.top) / rect.height) * cc.Stage.h;
      return new cc.EventTouch(x, y);
    }

    let pointerDown = false;
    canvasEl.addEventListener("pointerdown", (e) => {
      pointerDown = true;
      canvasEl.setPointerCapture(e.pointerId);
      canvasNode.emit(cc.Node.EventType.TOUCH_START, toGameCoords(e.clientX, e.clientY));
    });
    canvasEl.addEventListener("pointermove", (e) => {
      if (!pointerDown) return;
      canvasNode.emit(cc.Node.EventType.TOUCH_MOVE, toGameCoords(e.clientX, e.clientY));
    });
    const endPointer = (e) => {
      if (!pointerDown) return;
      pointerDown = false;
      canvasNode.emit(cc.Node.EventType.TOUCH_END, toGameCoords(e.clientX, e.clientY));
    };
    canvasEl.addEventListener("pointerup", endPointer);
    canvasEl.addEventListener("pointercancel", endPointer);

    window.addEventListener("keydown", (e) => {
      const map = {
        ArrowLeft: cc.KeyCode.ARROW_LEFT,
        ArrowUp: cc.KeyCode.ARROW_UP,
        ArrowRight: cc.KeyCode.ARROW_RIGHT,
        ArrowDown: cc.KeyCode.ARROW_DOWN,
        KeyA: cc.KeyCode.KEY_A,
        KeyW: cc.KeyCode.KEY_W,
        KeyD: cc.KeyCode.KEY_D,
        KeyS: cc.KeyCode.KEY_S,
        KeyR: cc.KeyCode.KEY_R,
        KeyZ: cc.KeyCode.KEY_Z,
        Space: cc.KeyCode.SPACE,
        Escape: cc.KeyCode.ESCAPE,
      };
      if (map[e.code]) {
        e.preventDefault();
        cc.input.emit(cc.Input.EventType.KEY_DOWN, new cc.EventKeyboard(map[e.code]));
      }
    });

    let lastTime = performance.now();
    function frame(now) {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      scene._tick(dt);
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.fillStyle = "#07080f";
      ctx.fillRect(0, 0, cc.Stage.w, cc.Stage.h);
      // Stage origin at the centre of the live design space, +Y up.
      ctx.translate(cc.Stage.w * 0.5, cc.Stage.h * 0.5);
      scene._renderTree(ctx);
      ctx.restore();
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootCanvas);
  } else {
    bootCanvas();
  }
})();
