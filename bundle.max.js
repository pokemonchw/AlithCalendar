(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var commentBlockControl_1 = require("./commentBlockControl");
var Menu_1 = require("./Menu");
var messages_1 = require("./messages");
var BlockMenu = /** @class */ (function (_super) {
    __extends(BlockMenu, _super);
    function BlockMenu(parent) {
        var _this = _super.call(this, '屏蔽用户评论管理', parent) || this;
        _this.update();
        commentBlockControl_1.blockedUserUpdateEvent.on(_this.update.bind(_this));
        return _this;
    }
    BlockMenu.prototype.update = function () {
        var _this = this;
        this.clearItems();
        var blockedUsers = commentBlockControl_1.getBlockedUsers();
        if (blockedUsers.length === 0) {
            this.addItem(messages_1.NO_BLOCKED_USERS, { small: true });
        }
        else {
            this.addItem(messages_1.CLICK_TO_UNBLOCK, { small: true });
        }
        blockedUsers.forEach(function (userName) {
            _this.addItem(userName, { small: true, button: true })
                .onClick(function () {
                commentBlockControl_1.unblockUser(userName);
            });
        });
    };
    return BlockMenu;
}(Menu_1.Menu));
exports.BlockMenu = BlockMenu;

},{"./Menu":8,"./commentBlockControl":16,"./messages":26}],2:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chapterControl_1 = require("./chapterControl");
var data_1 = require("./data");
var history_1 = require("./history");
var Menu_1 = require("./Menu");
var shortNumber_1 = require("./shortNumber");
var chapterSelectionButtonsMap = new Map();
var currentLastReadLabelAt = null;
function attachLastReadLabelTo(button, htmlRelativePath) {
    currentLastReadLabelAt = button.append('[上次阅读]');
}
chapterControl_1.loadChapterEvent.on(function (newChapterHtmlRelativePath) {
    if (currentLastReadLabelAt !== null) {
        currentLastReadLabelAt.remove();
    }
    attachLastReadLabelTo(chapterSelectionButtonsMap.get(newChapterHtmlRelativePath), newChapterHtmlRelativePath);
});
var ChaptersMenu = /** @class */ (function (_super) {
    __extends(ChaptersMenu, _super);
    function ChaptersMenu(parent, folder) {
        var e_1, _a, e_2, _b;
        var _this = this;
        if (folder === undefined) {
            folder = data_1.data.chapterTree;
        }
        _this = _super.call(this, folder.isRoot ? '章节选择' : folder.displayName, parent) || this;
        try {
            for (var _c = __values(folder.subFolders), _d = _c.next(); !_d.done; _d = _c.next()) {
                var subfolder = _d.value;
                var handle = _this.addLink(new ChaptersMenu(_this, subfolder), true);
                handle.addClass('folder');
                handle.append("[" + shortNumber_1.shortNumber(subfolder.folderCharCount) + "]", 'char-count');
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var _loop_1 = function (chapter) {
            var handle = this_1.addItem(chapter.displayName, { small: true, button: true })
                .onClick(function () {
                chapterControl_1.loadChapter(chapter.htmlRelativePath);
                history_1.updateHistory(true);
            });
            if (chapter.isEarlyAccess) {
                handle.prepend('[编写中]');
                handle.addClass('early-access');
            }
            handle.append("[" + shortNumber_1.shortNumber(chapter.chapterCharCount) + "]", 'char-count');
            var lastRead = window.localStorage.getItem('lastRead');
            if (lastRead === chapter.htmlRelativePath) {
                attachLastReadLabelTo(handle, chapter.htmlRelativePath);
            }
            chapterSelectionButtonsMap.set(chapter.htmlRelativePath, handle);
        };
        var this_1 = this;
        try {
            for (var _e = __values(folder.chapters), _f = _e.next(); !_f.done; _f = _e.next()) {
                var chapter = _f.value;
                _loop_1(chapter);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return _this;
    }
    return ChaptersMenu;
}(Menu_1.Menu));
exports.ChaptersMenu = ChaptersMenu;

},{"./Menu":8,"./chapterControl":15,"./data":18,"./history":22,"./shortNumber":28}],3:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Menu_1 = require("./Menu");
var ContactMenu = /** @class */ (function (_super) {
    __extends(ContactMenu, _super);
    function ContactMenu(parent) {
        var _this = _super.call(this, '订阅/讨论组', parent) || this;
        _this.addItem('GitHub Repo', {
            small: true,
            button: true,
            link: 'https://github.com/pokemonchw/AlithCalendar',
        });
        _this.addItem('作者Mastodon', {
            small: true,
            button: true,
            link: 'https://pawoo.net/@nekoharuya',
        });
        return _this;
    }
    return ContactMenu;
}(Menu_1.Menu));
exports.ContactMenu = ContactMenu;

},{"./Menu":8}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DebugLogger_1 = require("./DebugLogger");
function id(id) {
    return document.getElementById(id);
}
exports.id = id;
function getTextNodes(parent, initArray) {
    var textNodes = initArray || [];
    var pointer = parent.firstChild;
    while (pointer !== null) {
        if (pointer instanceof HTMLElement) {
            getTextNodes(pointer, textNodes);
        }
        if (pointer instanceof Text) {
            textNodes.push(pointer);
        }
        pointer = pointer.nextSibling;
    }
    return textNodes;
}
exports.getTextNodes = getTextNodes;
var selectNodeDebugLogger = new DebugLogger_1.DebugLogger('selectNode');
function selectNode(node) {
    try {
        var selection = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(node);
        selection.removeAllRanges();
        selection.addRange(range);
    }
    catch (error) {
        selectNodeDebugLogger.log('Failed to select node: ', node, '; Error: ', error);
    }
}
exports.selectNode = selectNode;

},{"./DebugLogger":5}],5:[function(require,module,exports){
"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var settings_1 = require("./settings");
function simpleToString(value) {
    switch (typeof value) {
        case 'string':
            return "\"" + value + "\"";
        default:
            return String(value);
    }
}
var DebugLogger = /** @class */ (function () {
    function DebugLogger(name, parameters) {
        if (parameters === void 0) { parameters = {}; }
        this.prefix = name + '('
            + Object.keys(parameters).map(function (key) { return key + "=" + simpleToString(parameters[key]); }).join(',')
            + ')';
    }
    DebugLogger.prototype.log = function () {
        var stuff = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            stuff[_i] = arguments[_i];
        }
        if (!settings_1.debugLogging.getValue()) {
            return;
        }
        console.info.apply(console, __spread([this.prefix], stuff));
    };
    return DebugLogger;
}());
exports.DebugLogger = DebugLogger;

},{"./settings":27}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Event = /** @class */ (function () {
    function Event() {
        this.listeners = null;
        this.onceListeners = null;
        this.isEmitting = false;
        this.queue = [];
    }
    Event.prototype.on = function (listener) {
        var _this = this;
        if (this.isEmitting) {
            this.queue.push(function () {
                _this.on(listener);
            });
            return listener;
        }
        if (this.listeners === null) {
            this.listeners = new Set();
        }
        this.listeners.add(listener);
        return listener;
    };
    Event.prototype.off = function (listener) {
        var _this = this;
        if (this.isEmitting) {
            this.queue.push(function () {
                _this.off(listener);
            });
            return;
        }
        if (this.listeners === null) {
            return;
        }
        this.listeners.delete(listener);
    };
    Event.prototype.once = function (onceListener) {
        var _this = this;
        if (this.isEmitting) {
            this.queue.push(function () {
                _this.once(onceListener);
            });
            return onceListener;
        }
        if (this.onceListeners === null) {
            this.onceListeners = [];
        }
        this.onceListeners.push(onceListener);
        return onceListener;
    };
    Event.prototype.expect = function (filter) {
        var _this = this;
        if (this.isEmitting) {
            return new Promise(function (resolve) {
                _this.queue.push(function () {
                    _this.expect(filter).then(resolve);
                });
            });
        }
        if (filter === undefined) {
            return new Promise(function (resolve) { return _this.once(resolve); });
        }
        return new Promise(function (resolve) {
            var listener = _this.on(function (arg) {
                if (!filter(arg)) {
                    return;
                }
                _this.off(listener);
                resolve(arg);
            });
        });
    };
    Event.prototype.emit = function (arg) {
        var _this = this;
        if (this.isEmitting) {
            this.queue.push(function () {
                _this.emit(arg);
            });
            return;
        }
        this.isEmitting = true;
        if (this.listeners !== null) {
            this.listeners.forEach(function (listener) { return listener(arg); });
        }
        if (this.onceListeners !== null) {
            this.onceListeners.forEach(function (onceListener) { return onceListener(arg); });
            this.onceListeners.length = 0;
        }
        this.isEmitting = false;
        while (this.queue.length >= 1) {
            this.queue.shift()();
        }
    };
    return Event;
}());
exports.Event = Event;

},{}],7:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ChaptersMenu_1 = require("./ChaptersMenu");
var ContactMenu_1 = require("./ContactMenu");
var Menu_1 = require("./Menu");
var SettingsMenu_1 = require("./SettingsMenu");
var StatsMenu_1 = require("./StatsMenu");
var StyleMenu_1 = require("./StyleMenu");
var ThanksMenu_1 = require("./ThanksMenu");
var MainMenu = /** @class */ (function (_super) {
    __extends(MainMenu, _super);
    function MainMenu() {
        var _this = _super.call(this, '', null) || this;
        _this.addLink(new ChaptersMenu_1.ChaptersMenu(_this));
        _this.addLink(new ThanksMenu_1.ThanksMenu(_this));
        _this.addLink(new StyleMenu_1.StyleMenu(_this));
        _this.addLink(new ContactMenu_1.ContactMenu(_this));
        _this.addItem('源代码', { button: true, link: 'https://github.com/pokemonchw/AlithCalendar' });
        _this.addLink(new SettingsMenu_1.SettingsMenu(_this));
        _this.addLink(new StatsMenu_1.StatsMenu(_this));
        return _this;
    }
    return MainMenu;
}(Menu_1.Menu));
exports.MainMenu = MainMenu;

},{"./ChaptersMenu":2,"./ContactMenu":3,"./Menu":8,"./SettingsMenu":10,"./StatsMenu":12,"./StyleMenu":13,"./ThanksMenu":14}],8:[function(require,module,exports){
"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var DebugLogger_1 = require("./DebugLogger");
var Event_1 = require("./Event");
var RectMode_1 = require("./RectMode");
var ItemDecoration;
(function (ItemDecoration) {
    ItemDecoration[ItemDecoration["SELECTABLE"] = 0] = "SELECTABLE";
    ItemDecoration[ItemDecoration["BACK"] = 1] = "BACK";
})(ItemDecoration = exports.ItemDecoration || (exports.ItemDecoration = {}));
function createSpan(text) {
    var _a;
    var classNames = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        classNames[_i - 1] = arguments[_i];
    }
    var $span = document.createElement('span');
    $span.innerText = text;
    (_a = $span.classList).add.apply(_a, __spread(classNames));
    return $span;
}
var ItemHandle = /** @class */ (function () {
    function ItemHandle(menu, element) {
        this.menu = menu;
        this.element = element;
        this.$prependSpan = null;
        this.$appendSpan = null;
    }
    ItemHandle.prototype.setSelected = function (selected) {
        this.element.classList.toggle('selected', selected);
        return this;
    };
    ItemHandle.prototype.onClick = function (handler) {
        var _this = this;
        this.element.addEventListener('click', function () {
            handler(_this.element);
        });
        return this;
    };
    ItemHandle.prototype.linkTo = function (targetMenu) {
        var _this = this;
        this.onClick(function () {
            _this.menu.navigateTo(targetMenu);
        });
        return this;
    };
    ItemHandle.prototype.setInnerText = function (innerText) {
        this.element.innerText = innerText;
        return this;
    };
    ItemHandle.prototype.addClass = function (className) {
        this.element.classList.add(className);
        return this;
    };
    ItemHandle.prototype.removeClass = function (className) {
        this.element.classList.remove(className);
        return this;
    };
    ItemHandle.prototype.prepend = function (text, className) {
        if (this.$prependSpan === null) {
            this.$prependSpan = createSpan('', 'prepend');
            this.element.prepend(this.$prependSpan);
        }
        var $span = createSpan(text, 'item-side');
        if (className !== undefined) {
            $span.classList.add(className);
        }
        this.$prependSpan.prepend($span);
        return $span;
    };
    ItemHandle.prototype.append = function (text, className) {
        if (this.$appendSpan === null) {
            this.$appendSpan = createSpan('', 'append');
            this.element.appendChild(this.$appendSpan);
        }
        var $span = createSpan(text, 'item-side');
        if (className !== undefined) {
            $span.classList.add(className);
        }
        this.$appendSpan.appendChild($span);
        return $span;
    };
    return ItemHandle;
}());
exports.ItemHandle = ItemHandle;
var Menu = /** @class */ (function () {
    function Menu(name, parent, rectMode) {
        var _this = this;
        if (rectMode === void 0) { rectMode = RectMode_1.RectMode.OFF; }
        this.name = name;
        this.parent = parent;
        this.rectMode = rectMode;
        this.clearableElements = [];
        this.activateEvent = new Event_1.Event();
        this.debugLogger = new DebugLogger_1.DebugLogger('Menu', { name: name });
        this.fullPath = parent === null ? [] : parent.fullPath.slice();
        if (name !== '') {
            this.fullPath.push(name);
        }
        this.container = document.createElement('div');
        this.container.classList.add('menu', 'hidden');
        if (this.fullPath.length >= 1) {
            var path = document.createElement('div');
            path.classList.add('path');
            path.innerText = this.fullPath.join(' > ');
            this.container.appendChild(path);
        }
        if (parent !== null) {
            this.addItem('返回', { button: true, decoration: ItemDecoration.BACK, unclearable: true })
                .linkTo(parent);
        }
        document.body.appendChild(this.container);
        // 当显示模式变化时
        RectMode_1.rectModeChangeEvent.on(function (_a) {
            var newRectMode = _a.newRectMode;
            // 如果自己是当前激活的菜单并且显示模式正在变化为全屏阅读器
            if (_this.active && newRectMode === RectMode_1.RectMode.MAIN) {
                // 设置自己为非激活模式
                _this.setActive(false);
                // 等待显示模式再次变化时
                RectMode_1.rectModeChangeEvent.expect().then(function () {
                    // 设置自己为激活模式
                    _this.setActive(true);
                });
            }
        });
    }
    Menu.prototype.navigateTo = function (targetMenu) {
        this.setActive(false);
        targetMenu.setActive(true);
        RectMode_1.setRectMode(targetMenu.rectMode);
    };
    Menu.prototype.exit = function () {
        if (this.parent === null) {
            throw new Error('Cannot exit the root menu.');
        }
        this.navigateTo(this.parent);
    };
    Menu.prototype.setActive = function (active) {
        this.debugLogger.log("setActive(" + active + ")");
        if (!this.active && active) {
            this.activateEvent.emit();
        }
        this.active = active;
        this.container.classList.toggle('hidden', !active);
    };
    Menu.prototype.isActive = function () {
        return this.active;
    };
    Menu.prototype.addItem = function (title, options) {
        var $element;
        if (options.button && options.link !== undefined) {
            $element = document.createElement('a');
            $element.href = options.link;
            $element.target = '_blank';
        }
        else {
            $element = document.createElement('div');
        }
        $element.innerText = title;
        if (options.small) {
            $element.classList.add('small');
        }
        if (options.button) {
            $element.classList.add('button');
            if (options.decoration === ItemDecoration.BACK) {
                $element.classList.add('back');
            }
            else if (options.decoration === ItemDecoration.SELECTABLE) {
                $element.classList.add('selectable');
            }
        }
        this.container.appendChild($element);
        if (!options.unclearable) {
            this.clearableElements.push($element);
        }
        return new ItemHandle(this, $element);
    };
    Menu.prototype.clearItems = function () {
        this.clearableElements.forEach(function ($element) { return $element.remove(); });
        this.clearableElements = [];
    };
    Menu.prototype.addLink = function (menu, smallButton) {
        return this.addItem(menu.name, { small: smallButton, button: true })
            .linkTo(menu);
    };
    return Menu;
}());
exports.Menu = Menu;

},{"./DebugLogger":5,"./Event":6,"./RectMode":9}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DebugLogger_1 = require("./DebugLogger");
var DOM_1 = require("./DOM");
var Event_1 = require("./Event");
var RectMode;
(function (RectMode) {
    RectMode[RectMode["SIDE"] = 0] = "SIDE";
    RectMode[RectMode["MAIN"] = 1] = "MAIN";
    RectMode[RectMode["OFF"] = 2] = "OFF";
})(RectMode = exports.RectMode || (exports.RectMode = {}));
var $rect = DOM_1.id('rect');
var debugLogger = new DebugLogger_1.DebugLogger('RectMode');
exports.rectModeChangeEvent = new Event_1.Event();
var rectMode = RectMode.OFF;
function setRectMode(newRectMode) {
    debugLogger.log(RectMode[rectMode] + " -> " + RectMode[newRectMode]);
    if (rectMode === newRectMode) {
        return;
    }
    if (newRectMode === RectMode.OFF) {
        $rect.classList.remove('reading');
    }
    else {
        if (rectMode === RectMode.MAIN) {
            $rect.classList.remove('main');
        }
        else if (rectMode === RectMode.SIDE) {
            $rect.classList.remove('side');
        }
        else {
            $rect.classList.remove('main', 'side');
            $rect.classList.add('reading');
        }
        if (newRectMode === RectMode.MAIN) {
            $rect.classList.add('main');
        }
        else {
            $rect.classList.add('side');
        }
    }
    exports.rectModeChangeEvent.emit({
        previousRectMode: rectMode,
        newRectMode: newRectMode,
    });
    rectMode = newRectMode;
}
exports.setRectMode = setRectMode;

},{"./DOM":4,"./DebugLogger":5,"./Event":6}],10:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var BlockMenu_1 = require("./BlockMenu");
var commentsControl_1 = require("./commentsControl");
var DOM_1 = require("./DOM");
var Menu_1 = require("./Menu");
var RectMode_1 = require("./RectMode");
var settings_1 = require("./settings");
var stylePreviewArticle_1 = require("./stylePreviewArticle");
var EnumSettingMenu = /** @class */ (function (_super) {
    __extends(EnumSettingMenu, _super);
    function EnumSettingMenu(parent, label, setting, usePreview) {
        var _this = _super.call(this, label + "\u8BBE\u7F6E", parent, usePreview ? RectMode_1.RectMode.SIDE : RectMode_1.RectMode.MAIN) || this;
        var currentHandle;
        if (usePreview) {
            _this.activateEvent.on(function () {
                commentsControl_1.hideComments();
                DOM_1.id('content').innerHTML = stylePreviewArticle_1.stylePreviewArticle;
            });
        }
        setting.options.forEach(function (valueName, value) {
            var handle = _this.addItem(valueName, { small: true, button: true, decoration: Menu_1.ItemDecoration.SELECTABLE })
                .onClick(function () {
                currentHandle.setSelected(false);
                handle.setSelected(true);
                setting.setValue(value);
                currentHandle = handle;
            });
            if (value === setting.getValue()) {
                currentHandle = handle;
                handle.setSelected(true);
            }
        });
        return _this;
    }
    return EnumSettingMenu;
}(Menu_1.Menu));
exports.EnumSettingMenu = EnumSettingMenu;
var SettingsMenu = /** @class */ (function (_super) {
    __extends(SettingsMenu, _super);
    function SettingsMenu(parent) {
        var _this = _super.call(this, '设置', parent) || this;
        _this.addBooleanSetting('使用动画', settings_1.animation);
        _this.addBooleanSetting('显示编写中章节', settings_1.earlyAccess);
        _this.addBooleanSetting('显示评论', settings_1.useComments);
        _this.addBooleanSetting('手势切换章节（仅限手机）', settings_1.gestureSwitchChapter);
        _this.addEnumSetting('字体', settings_1.fontFamily, true);
        _this.addBooleanSetting('显示每个章节的字数', settings_1.charCount);
        _this.addBooleanSetting('开发人员模式', settings_1.debugLogging);
        _this.addLink(new BlockMenu_1.BlockMenu(_this), true);
        return _this;
    }
    SettingsMenu.prototype.addBooleanSetting = function (label, setting) {
        var getText = function () { return label + "\uFF1A" + (setting.getValue() ? '开' : '关'); };
        var handle = this.addItem(getText(), { small: true, button: true })
            .onClick(function () {
            setting.toggle();
            handle.setInnerText(getText());
        });
    };
    SettingsMenu.prototype.addEnumSetting = function (label, setting, usePreview) {
        var _this = this;
        var getText = function () { return label + "\uFF1A" + setting.getValueName(); };
        var handle = this.addItem(getText(), { small: true, button: true });
        var enumSettingMenu = new EnumSettingMenu(this, label, setting, usePreview === true);
        handle.linkTo(enumSettingMenu).onClick(function () {
            _this.activateEvent.once(function () {
                handle.setInnerText(getText());
            });
        });
    };
    return SettingsMenu;
}(Menu_1.Menu));
exports.SettingsMenu = SettingsMenu;

},{"./BlockMenu":1,"./DOM":4,"./Menu":8,"./RectMode":9,"./commentsControl":17,"./settings":27,"./stylePreviewArticle":30}],11:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("./data");
var Menu_1 = require("./Menu");
var StatsKeywordsCountMenu = /** @class */ (function (_super) {
    __extends(StatsKeywordsCountMenu, _super);
    function StatsKeywordsCountMenu(parent) {
        var _this = _super.call(this, '关键词统计', parent) || this;
        _this.addItem('添加其他关键词', {
            small: true,
            button: true,
            link: 'https://github.com/pokemonchw/AlithCalendar/edit/master/src/builder/keywords.ts',
        });
        data_1.data.keywordsCount.forEach(function (_a) {
            var _b = __read(_a, 2), keyword = _b[0], count = _b[1];
            _this.addItem(keyword + "\uFF1A" + count, { small: true });
        });
        return _this;
    }
    return StatsKeywordsCountMenu;
}(Menu_1.Menu));
exports.StatsKeywordsCountMenu = StatsKeywordsCountMenu;

},{"./Menu":8,"./data":18}],12:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("./data");
var Menu_1 = require("./Menu");
var StatsKeywordsCountMenu_1 = require("./StatsKeywordsCountMenu");
var StatsMenu = /** @class */ (function (_super) {
    __extends(StatsMenu, _super);
    function StatsMenu(parent) {
        var _this = _super.call(this, '统计', parent) || this;
        _this.addItem('统计数据由构建脚本自动生成', { small: true });
        _this.addLink(new StatsKeywordsCountMenu_1.StatsKeywordsCountMenu(_this), true);
        _this.addItem("\u603B\u5B57\u6570\uFF1A" + data_1.data.charsCount, { small: true });
        _this.addItem("\u603B\u6BB5\u843D\u6570\uFF1A" + data_1.data.paragraphsCount, { small: true });
        return _this;
    }
    return StatsMenu;
}(Menu_1.Menu));
exports.StatsMenu = StatsMenu;

},{"./Menu":8,"./StatsKeywordsCountMenu":11,"./data":18}],13:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
var commentsControl_1 = require("./commentsControl");
var DebugLogger_1 = require("./DebugLogger");
var DOM_1 = require("./DOM");
var Menu_1 = require("./Menu");
var RectMode_1 = require("./RectMode");
var stylePreviewArticle_1 = require("./stylePreviewArticle");
var Style = /** @class */ (function () {
    function Style(name, def) {
        this.name = name;
        this.def = def;
        this.styleSheet = null;
        this.debugLogger = new DebugLogger_1.DebugLogger('Style', { name: name });
    }
    Style.prototype.injectStyleSheet = function () {
        var _this = this;
        var $style = document.createElement('style');
        document.head.appendChild($style);
        var sheet = $style.sheet;
        sheet.disabled = true;
        var attemptInsertRule = function (rule) {
            try {
                sheet.insertRule(rule);
            }
            catch (error) {
                _this.debugLogger.log("Failed to inject rule \"" + rule + "\".", error);
            }
        };
        attemptInsertRule(".rect.reading { background-color: " + this.def.rectBgColor + "; }");
        attemptInsertRule(".rect.reading>div { background-color: " + this.def.paperBgColor + "; }");
        attemptInsertRule(".rect.reading>div { color: " + this.def.textColor + "; }");
        attemptInsertRule(".rect.reading>.content a { color: " + this.def.linkColor + "; }");
        attemptInsertRule(".rect.reading>.content a:hover { color: " + this.def.linkHoverColor + "; }");
        attemptInsertRule(".rect.reading>.content a:active { color: " + this.def.linkActiveColor + "; }");
        attemptInsertRule(".rect.reading>.content>.earlyAccess.block { background-color: " + this.def.contentBlockEarlyAccessColor + "; }");
        attemptInsertRule(".rect>.comments>div { background-color: " + this.def.commentColor + "; }");
        attemptInsertRule("@media (min-width: 901px) { ::-webkit-scrollbar-thumb { background-color: " + this.def.paperBgColor + "; } }");
        attemptInsertRule("@media (min-width: 901px) { ::-webkit-scrollbar-thumb:hover { background-color: " + this.def.linkColor + "; } }");
        attemptInsertRule("@media (min-width: 901px) { ::-webkit-scrollbar-thumb:active { background-color: " + this.def.linkActiveColor + "; } }");
        var key = this.def.keyIsDark ? 'black' : 'white';
        var keyComponent = this.def.keyIsDark ? 0 : 255;
        attemptInsertRule(".rect>.comments>.create-comment::before { background-color: " + key + "; }");
        attemptInsertRule(":root { --key-opacity-01: rgba(" + keyComponent + "," + keyComponent + "," + keyComponent + ",0.1); } ");
        attemptInsertRule(":root { --key-opacity-05: rgba(" + keyComponent + "," + keyComponent + "," + keyComponent + ",0.5); } ");
        this.styleSheet = sheet;
    };
    Style.prototype.active = function () {
        if (Style.currentlyEnabled !== null) {
            var currentlyEnabled = Style.currentlyEnabled;
            if (currentlyEnabled.styleSheet !== null) {
                currentlyEnabled.styleSheet.disabled = true;
            }
            currentlyEnabled.itemHandle.setSelected(false);
        }
        if (this.styleSheet === null) {
            this.injectStyleSheet();
        }
        this.styleSheet.disabled = false;
        this.itemHandle.setSelected(true);
        window.localStorage.setItem('style', this.name);
        Style.currentlyEnabled = this;
    };
    Style.currentlyEnabled = null;
    return Style;
}());
var styles = [
    new Style('默认(可穿戴科技)', {
        rectBgColor: '#444',
        paperBgColor: '#333',
        textColor: '#DDD',
        linkColor: '#66F',
        linkHoverColor: '#66F',
        linkActiveColor: '#44D',
        contentBlockEarlyAccessColor: '#E65100',
        commentColor: '#444',
        keyIsDark: false,
    }),
    new Style('白纸', {
        rectBgColor: '#EFEFED',
        paperBgColor: '#FFF',
        textColor: '#000',
        linkColor: '#00E',
        linkHoverColor: '#F00',
        linkActiveColor: '#00C',
        contentBlockEarlyAccessColor: '#FFE082',
        commentColor: '#F5F5F5',
        keyIsDark: true,
    }),
    new Style('夜间', {
        rectBgColor: '#272B36',
        paperBgColor: '#38404D',
        textColor: '#DDD',
        linkColor: '#55E',
        linkHoverColor: '#55E',
        linkActiveColor: '#33C',
        contentBlockEarlyAccessColor: '#E65100',
        commentColor: '#272B36',
        keyIsDark: false,
    }),
    new Style('羊皮纸', {
        rectBgColor: '#D8D4C9',
        paperBgColor: '#F8F4E9',
        textColor: '#552830',
        linkColor: '#00E',
        linkHoverColor: '#F00',
        linkActiveColor: '#00C',
        contentBlockEarlyAccessColor: '#FFE082',
        commentColor: '#F9EFD7',
        keyIsDark: true,
    }),
    new Style('巧克力', {
        rectBgColor: '#2C1C11',
        paperBgColor: '#3E2519',
        textColor: '#CD9F89',
        linkColor: '#66F',
        linkHoverColor: '#66F',
        linkActiveColor: '#44D',
        contentBlockEarlyAccessColor: '#E65100',
        commentColor: '#2C1C11',
        keyIsDark: false,
    }),
];
var StyleMenu = /** @class */ (function (_super) {
    __extends(StyleMenu, _super);
    function StyleMenu(parent) {
        var e_1, _a, e_2, _b;
        var _this = _super.call(this, '阅读器样式', parent, RectMode_1.RectMode.SIDE) || this;
        var _loop_1 = function (style) {
            style.itemHandle = this_1.addItem(style.name, { small: true, button: true, decoration: Menu_1.ItemDecoration.SELECTABLE })
                .onClick(function () {
                style.active();
            });
        };
        var this_1 = this;
        try {
            for (var styles_1 = __values(styles), styles_1_1 = styles_1.next(); !styles_1_1.done; styles_1_1 = styles_1.next()) {
                var style = styles_1_1.value;
                _loop_1(style);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (styles_1_1 && !styles_1_1.done && (_a = styles_1.return)) _a.call(styles_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var usedStyle = window.localStorage.getItem('style');
        var flag = false;
        try {
            for (var styles_2 = __values(styles), styles_2_1 = styles_2.next(); !styles_2_1.done; styles_2_1 = styles_2.next()) {
                var style = styles_2_1.value;
                if (usedStyle === style.name) {
                    style.active();
                    flag = true;
                    break;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (styles_2_1 && !styles_2_1.done && (_b = styles_2.return)) _b.call(styles_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
        if (!flag) {
            styles[0].active();
        }
        _this.activateEvent.on(function () {
            commentsControl_1.hideComments();
            DOM_1.id('content').innerHTML = stylePreviewArticle_1.stylePreviewArticle;
        });
        return _this;
    }
    return StyleMenu;
}(Menu_1.Menu));
exports.StyleMenu = StyleMenu;

},{"./DOM":4,"./DebugLogger":5,"./Menu":8,"./RectMode":9,"./commentsControl":17,"./stylePreviewArticle":30}],14:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Menu_1 = require("./Menu");
var thanks_1 = require("./thanks");
var ThanksMenu = /** @class */ (function (_super) {
    __extends(ThanksMenu, _super);
    function ThanksMenu(parent) {
        var e_1, _a;
        var _this = _super.call(this, '鸣谢列表', parent) || this;
        try {
            for (var thanks_2 = __values(thanks_1.thanks), thanks_2_1 = thanks_2.next(); !thanks_2_1.done; thanks_2_1 = thanks_2.next()) {
                var person = thanks_2_1.value;
                _this.addItem(person.name, person.link === undefined
                    ? { small: true }
                    : { small: true, button: true, link: person.link });
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (thanks_2_1 && !thanks_2_1.done && (_a = thanks_2.return)) _a.call(thanks_2);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return _this;
    }
    return ThanksMenu;
}(Menu_1.Menu));
exports.ThanksMenu = ThanksMenu;

},{"./Menu":8,"./thanks":31}],15:[function(require,module,exports){
"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var commentsControl_1 = require("./commentsControl");
var data_1 = require("./data");
var DebugLogger_1 = require("./DebugLogger");
var DOM_1 = require("./DOM");
var Event_1 = require("./Event");
var gestures_1 = require("./gestures");
var history_1 = require("./history");
var keyboard_1 = require("./keyboard");
var loadingText_1 = require("./loadingText");
var RectMode_1 = require("./RectMode");
var settings_1 = require("./settings");
var state_1 = require("./state");
var debugLogger = new DebugLogger_1.DebugLogger('chapterControl');
var $content = DOM_1.id('content');
var chaptersCache = new Map();
exports.loadChapterEvent = new Event_1.Event();
function closeChapter() {
    RectMode_1.setRectMode(RectMode_1.RectMode.OFF);
    state_1.state.currentChapter = null;
    state_1.state.chapterSelection = null;
    state_1.state.chapterTextNodes = null;
}
exports.closeChapter = closeChapter;
var select = function (_a) {
    var _b = __read(_a, 4), anchorNodeIndex = _b[0], anchorOffset = _b[1], focusNodeIndex = _b[2], focusOffset = _b[3];
    if (state_1.state.chapterTextNodes === null) {
        return;
    }
    var anchorNode = state_1.state.chapterTextNodes[anchorNodeIndex];
    var focusNode = state_1.state.chapterTextNodes[focusNodeIndex];
    if (anchorNode === undefined || focusNode === undefined) {
        return;
    }
    document.getSelection().setBaseAndExtent(anchorNode, anchorOffset, focusNode, focusOffset);
    var element = anchorNode.parentElement;
    if (element !== null && (typeof element.scrollIntoView) === 'function') {
        element.scrollIntoView();
    }
};
var getFlexOneSpan = function () {
    var $span = document.createElement('span');
    $span.style.flex = '1';
    return $span;
};
var canChapterShown = function (chapter) {
    return settings_1.earlyAccess.getValue() || !chapter.isEarlyAccess;
};
var createContentBlock = function (type, title, text) {
    var $block = document.createElement('div');
    $block.classList.add('block', type);
    var $title = document.createElement('h1');
    $title.innerText = title;
    $block.appendChild($title);
    var $text = document.createElement('p');
    $text.innerText = text;
    $block.appendChild($text);
    return $block;
};
function loadPrevChapter() {
    var chapterCtx = state_1.state.currentChapter;
    if (chapterCtx === null) {
        return;
    }
    var chapterIndex = chapterCtx.inFolderIndex;
    if (chapterIndex >= 1 && canChapterShown(chapterCtx.folder.chapters[chapterIndex - 1])) {
        var prevChapter = chapterCtx.folder.chapters[chapterIndex - 1].htmlRelativePath;
        loadChapter(prevChapter);
        history_1.updateHistory(true);
    }
}
exports.loadPrevChapter = loadPrevChapter;
function loadNextChapter() {
    var chapterCtx = state_1.state.currentChapter;
    if (chapterCtx === null) {
        return;
    }
    var chapterIndex = chapterCtx.inFolderIndex;
    if (chapterIndex < chapterCtx.folder.chapters.length - 1 && canChapterShown(chapterCtx.folder.chapters[chapterIndex + 1])) {
        var nextChapter = chapterCtx.folder.chapters[chapterIndex + 1].htmlRelativePath;
        loadChapter(nextChapter);
        history_1.updateHistory(true);
    }
}
exports.loadNextChapter = loadNextChapter;
var finalizeChapterLoading = function (selection) {
    state_1.state.chapterTextNodes = DOM_1.getTextNodes($content);
    if (selection !== undefined) {
        if (DOM_1.id('warning') === null) {
            select(selection);
        }
        else {
            DOM_1.id('warning').addEventListener('click', function () {
                select(selection);
            });
        }
    }
    Array.from($content.getElementsByTagName('a')).forEach(function ($anchor) { return $anchor.target = '_blank'; });
    Array.from($content.getElementsByTagName('code')).forEach(function ($code) { return $code.addEventListener('dblclick', function () {
        DOM_1.selectNode($code);
    }); });
    var chapterCtx = state_1.state.currentChapter;
    var chapterIndex = chapterCtx.inFolderIndex;
    if (chapterCtx.chapter.isEarlyAccess) {
        var $block = createContentBlock('earlyAccess', '编写中章节', '请注意，本文正在编写中，因此可能会含有未完成的句子或是尚未更新的信息。');
        $content.prepend($block);
    }
    var $div = document.createElement('div');
    $div.style.display = 'flex';
    if (chapterIndex >= 1 && canChapterShown(chapterCtx.folder.chapters[chapterIndex - 1])) {
        var prevChapter = chapterCtx.folder.chapters[chapterIndex - 1].htmlRelativePath;
        var $prevLink = document.createElement('a');
        $prevLink.innerText = '上一章';
        $prevLink.href = window.location.pathname + "#" + prevChapter;
        $prevLink.style.textAlign = 'left';
        $prevLink.style.flex = '1';
        $prevLink.addEventListener('click', function (event) {
            event.preventDefault();
            loadPrevChapter();
        });
        $div.appendChild($prevLink);
    }
    else {
        $div.appendChild(getFlexOneSpan());
    }
    var $menuLink = document.createElement('a');
    $menuLink.innerText = '返回菜单';
    $menuLink.href = window.location.pathname;
    $menuLink.style.textAlign = 'center';
    $menuLink.style.flex = '1';
    $menuLink.addEventListener('click', function (event) {
        event.preventDefault();
        closeChapter();
        history_1.updateHistory(true);
    });
    $div.appendChild($menuLink);
    if (chapterIndex < chapterCtx.folder.chapters.length - 1 && canChapterShown(chapterCtx.folder.chapters[chapterIndex + 1])) {
        var nextChapter = chapterCtx.folder.chapters[chapterIndex + 1].htmlRelativePath;
        var $nextLink = document.createElement('a');
        $nextLink.innerText = '下一章';
        $nextLink.href = window.location.pathname + "#" + nextChapter;
        $nextLink.style.textAlign = 'right';
        $nextLink.style.flex = '1';
        $nextLink.addEventListener('click', function (event) {
            event.preventDefault();
            loadNextChapter();
        });
        $div.appendChild($nextLink);
    }
    else {
        $div.appendChild(getFlexOneSpan());
    }
    $content.appendChild($div);
    commentsControl_1.loadComments(chapterCtx.chapter.commentsUrl);
    // fix for stupid scrolling issues under iOS
    DOM_1.id('rect').style.overflow = 'hidden';
    setTimeout(function () {
        DOM_1.id('rect').style.overflow = null;
        if (selection === undefined) {
            DOM_1.id('rect').scrollTo(0, 0);
        }
    }, 1);
    // Re-focus the rect so it is arrow-scrollable
    setTimeout(function () {
        DOM_1.id('rect').focus();
    }, 1);
};
gestures_1.swipeEvent.on(function (direction) {
    if (!settings_1.gestureSwitchChapter.getValue()) {
        return;
    }
    if (direction === gestures_1.SwipeDirection.TO_RIGHT) {
        // 上一章
        loadPrevChapter();
    }
    else if (direction === gestures_1.SwipeDirection.TO_LEFT) {
        // 下一章
        loadNextChapter();
    }
});
keyboard_1.arrowKeyPressEvent.on(function (arrowKey) {
    if (arrowKey === keyboard_1.ArrowKey.LEFT) {
        loadPrevChapter();
    }
    else if (arrowKey === keyboard_1.ArrowKey.RIGHT) {
        loadNextChapter();
    }
});
function loadChapter(chapterHtmlRelativePath, selection) {
    debugLogger.log('Load chapter', chapterHtmlRelativePath, 'selection', selection);
    commentsControl_1.hideComments();
    exports.loadChapterEvent.emit(chapterHtmlRelativePath);
    window.localStorage.setItem('lastRead', chapterHtmlRelativePath);
    RectMode_1.setRectMode(RectMode_1.RectMode.MAIN);
    var chapterCtx = data_1.relativePathLookUpMap.get(chapterHtmlRelativePath);
    state_1.state.currentChapter = chapterCtx;
    if (chaptersCache.has(chapterHtmlRelativePath)) {
        if (chaptersCache.get(chapterHtmlRelativePath) === null) {
            $content.innerText = loadingText_1.loadingText;
        }
        else {
            $content.innerHTML = chaptersCache.get(chapterHtmlRelativePath);
            finalizeChapterLoading(selection);
        }
    }
    else {
        $content.innerText = loadingText_1.loadingText;
        fetch("./chapters/" + chapterHtmlRelativePath)
            .then(function (response) { return response.text(); })
            .then(function (text) {
            chaptersCache.set(chapterHtmlRelativePath, text);
            if (chapterCtx === state_1.state.currentChapter) {
                $content.innerHTML = text;
                finalizeChapterLoading(selection);
            }
        });
    }
    return true;
}
exports.loadChapter = loadChapter;

},{"./DOM":4,"./DebugLogger":5,"./Event":6,"./RectMode":9,"./commentsControl":17,"./data":18,"./gestures":21,"./history":22,"./keyboard":24,"./loadingText":25,"./settings":27,"./state":29}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Event_1 = require("./Event");
var blockedUsers = new Set(JSON.parse(window.localStorage.getItem('blockedUsers') || '[]'));
exports.blockedUserUpdateEvent = new Event_1.Event();
function saveBlockedUsers() {
    window.localStorage.setItem('blockedUsers', JSON.stringify(Array.from(blockedUsers)));
    exports.blockedUserUpdateEvent.emit();
}
function blockUser(userName) {
    blockedUsers.add(userName);
    saveBlockedUsers();
}
exports.blockUser = blockUser;
function unblockUser(userName) {
    blockedUsers.delete(userName);
    saveBlockedUsers();
}
exports.unblockUser = unblockUser;
function isUserBlocked(userName) {
    return blockedUsers.has(userName);
}
exports.isUserBlocked = isUserBlocked;
function getBlockedUsers() {
    return Array.from(blockedUsers);
}
exports.getBlockedUsers = getBlockedUsers;

},{"./Event":6}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commentBlockControl_1 = require("./commentBlockControl");
var DOM_1 = require("./DOM");
var formatTime_1 = require("./formatTime");
var messages_1 = require("./messages");
var settings_1 = require("./settings");
var $comments = DOM_1.id('comments');
var $commentsStatus = DOM_1.id('comments-status');
var $createComment = DOM_1.id('create-comment');
var getApiUrlRegExp = /^https:\/\/github\.com\/([a-zA-Z0-9-_]+)\/([a-zA-Z0-9-_]+)\/issues\/([1-9][0-9]*)$/;
function getApiUrl(issueUrl) {
    // Input sample: https://github.com/SCLeoX/Wearable-Technology/issues/1
    // Output sample: https://api.github.com/repos/SCLeoX/Wearable-Technology/issues/1/comments
    var result = getApiUrlRegExp.exec(issueUrl);
    if (result === null) {
        throw new Error("Bad issue url: " + issueUrl + ".");
    }
    return "https://api.github.com/repos/" + result[1] + "/" + result[2] + "/issues/" + result[3] + "/comments";
}
var nextRequestId = 1;
var currentRequestId = 0;
var currentCreateCommentLinkUrl = '';
$createComment.addEventListener('click', function () {
    window.open(currentCreateCommentLinkUrl, '_blank');
});
function createCommentElement(userAvatarUrl, userName, userUrl, createTime, updateTime, content) {
    var $comment = document.createElement('div');
    $comment.classList.add('comment');
    var $avatar = document.createElement('img');
    $avatar.classList.add('avatar');
    $avatar.src = userAvatarUrl;
    $comment.appendChild($avatar);
    var $author = document.createElement('a');
    $author.classList.add('author');
    $author.innerText = userName;
    $author.target = '_blank';
    $author.href = userUrl;
    $comment.appendChild($author);
    var $time = document.createElement('div');
    $time.classList.add('time');
    $time.innerText = createTime === updateTime
        ? formatTime_1.formatTime(new Date(createTime))
        : formatTime_1.formatTime(new Date(createTime)) + "\uFF08\u6700\u540E\u4FEE\u6539\u4E8E " + formatTime_1.formatTime(new Date(updateTime)) + "\uFF09";
    $comment.appendChild($time);
    var $blockUser = document.createElement('a');
    $blockUser.classList.add('block-user');
    $blockUser.innerText = '屏蔽此人';
    $blockUser.onclick = function () {
        commentBlockControl_1.blockUser(userName);
        $comment.remove();
    };
    $comment.appendChild($blockUser);
    content.split('\n\n').forEach(function (paragraph) {
        var $p = document.createElement('p');
        $p.innerText = paragraph;
        $comment.appendChild($p);
    });
    return $comment;
}
// 为了确保 comments 在离场动画中存在，hideComments 和 showComments 应该只在入场动画前使用。
function hideComments() {
    $comments.classList.toggle('display-none', true);
    currentRequestId = 0;
}
exports.hideComments = hideComments;
function loadComments(issueUrl) {
    if (settings_1.useComments.getValue() === false) {
        return;
    }
    Array.from($comments.getElementsByClassName('comment')).forEach(function ($element) { return $element.remove(); });
    $comments.classList.toggle('display-none', false);
    $createComment.classList.toggle('display-none', true);
    if (issueUrl === null) {
        $commentsStatus.innerText = messages_1.COMMENTS_UNAVAILABLE;
        return;
    }
    currentCreateCommentLinkUrl = issueUrl;
    var requestId = currentRequestId = nextRequestId++;
    var apiUrl = getApiUrl(issueUrl);
    $commentsStatus.innerText = messages_1.COMMENTS_LOADING;
    fetch(apiUrl)
        .then(function (response) { return response.json(); })
        .then(function (data) {
        if (requestId !== currentRequestId) {
            return;
        }
        $commentsStatus.innerText = messages_1.COMMENTS_LOADED;
        data.forEach(function (comment) {
            if (commentBlockControl_1.isUserBlocked(comment.user.login)) {
                return;
            }
            $comments.appendChild(createCommentElement(comment.user.avatar_url, comment.user.login, comment.user.html_url, comment.created_at, comment.updated_at, comment.body));
        });
        $createComment.classList.toggle('display-none', false);
    });
}
exports.loadComments = loadComments;

},{"./DOM":4,"./commentBlockControl":16,"./formatTime":20,"./messages":26,"./settings":27}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = window.DATA;
exports.relativePathLookUpMap = new Map();
function iterateFolder(folder) {
    folder.subFolders.forEach(function (subFolder) {
        iterateFolder(subFolder);
    });
    folder.chapters.forEach(function (chapter, index) {
        exports.relativePathLookUpMap.set(chapter.htmlRelativePath, {
            folder: folder,
            chapter: chapter,
            inFolderIndex: index,
        });
    });
}
iterateFolder(exports.data.chapterTree);

},{}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chapterControl_1 = require("./chapterControl");
var data_1 = require("./data");
var history_1 = require("./history");
var state_1 = require("./state");
function followQuery() {
    var chapterHtmlRelativePath = decodeURIComponent(window.location.hash.substr(1)); // Ignore the # in the result
    var chapterCtx = data_1.relativePathLookUpMap.get(chapterHtmlRelativePath);
    if (chapterCtx === undefined) {
        if (state_1.state.currentChapter !== null) {
            chapterControl_1.closeChapter();
            document.title = history_1.getTitle();
        }
        return;
    }
    if (state_1.state.currentChapter !== chapterCtx) {
        if (typeof URLSearchParams !== 'function') {
            chapterControl_1.loadChapter(chapterHtmlRelativePath);
        }
        else {
            var query = new URLSearchParams(window.location.search);
            var selectionQuery = query.get('selection');
            var selection = selectionQuery !== null
                ? selectionQuery.split(',').map(function (str) { return +str; })
                : [];
            if (selection.length !== 4 || !selection.every(function (num) { return (num >= 0) && (num % 1 === 0) && (!Number.isNaN(num)) && (Number.isFinite(num)); })) {
                chapterControl_1.loadChapter(chapterHtmlRelativePath);
            }
            else {
                chapterControl_1.loadChapter(chapterHtmlRelativePath, selection);
            }
            document.title = history_1.getTitle();
        }
    }
}
exports.followQuery = followQuery;

},{"./chapterControl":15,"./data":18,"./history":22,"./state":29}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SECOND = 1000;
var MINUTE = 60 * SECOND;
var HOUR = 60 * MINUTE;
var DAY = 24 * HOUR;
var MAX_RELATIVE_TIME = 7 * DAY;
function formatTime(time) {
    var relativeTime = Date.now() - time.getTime();
    if (relativeTime > MAX_RELATIVE_TIME) {
        return time.getFullYear() + "/" + (time.getMonth() + 1) + "/" + time.getDate();
    }
    if (relativeTime > DAY) {
        return Math.floor(relativeTime / DAY) + " \u5929\u524D";
    }
    if (relativeTime > HOUR) {
        return Math.floor(relativeTime / HOUR) + " \u5C0F\u65F6\u524D";
    }
    if (relativeTime > MINUTE) {
        return Math.floor(relativeTime / MINUTE) + " \u5206\u949F\u524D";
    }
    return Math.floor(relativeTime / SECOND) + " \u79D2\u524D";
}
exports.formatTime = formatTime;

},{}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DebugLogger_1 = require("./DebugLogger");
var Event_1 = require("./Event");
var SwipeDirection;
(function (SwipeDirection) {
    SwipeDirection[SwipeDirection["TO_TOP"] = 0] = "TO_TOP";
    SwipeDirection[SwipeDirection["TO_RIGHT"] = 1] = "TO_RIGHT";
    SwipeDirection[SwipeDirection["TO_BOTTOM"] = 2] = "TO_BOTTOM";
    SwipeDirection[SwipeDirection["TO_LEFT"] = 3] = "TO_LEFT";
})(SwipeDirection = exports.SwipeDirection || (exports.SwipeDirection = {}));
var gestureMinWidth = 900;
exports.swipeEvent = new Event_1.Event();
var horizontalMinXProportion = 0.17;
var horizontalMaxYProportion = 0.1;
var verticalMinYProportion = 0.1;
var verticalMaxPropotyion = 0.1;
var swipeTimeThreshold = 500;
var startX = 0;
var startY = 0;
var startTime = 0;
window.addEventListener('touchstart', function (event) {
    // Only listen for first touch starts
    if (event.touches.length !== 1) {
        return;
    }
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
    startTime = Date.now();
});
window.addEventListener('touchend', function (event) {
    // Only listen for last touch ends
    if (event.touches.length !== 0) {
        return;
    }
    // Ignore touches that lasted too long
    if (Date.now() - startTime > swipeTimeThreshold) {
        return;
    }
    if (window.innerWidth > gestureMinWidth) {
        return;
    }
    var deltaX = event.changedTouches[0].clientX - startX;
    var deltaY = event.changedTouches[0].clientY - startY;
    var xProportion = Math.abs(deltaX / window.innerWidth);
    var yProportion = Math.abs(deltaY / window.innerHeight);
    if (xProportion > horizontalMinXProportion && yProportion < horizontalMaxYProportion) {
        // Horizontal swipe detected
        if (deltaX > 0) {
            exports.swipeEvent.emit(SwipeDirection.TO_RIGHT);
        }
        else {
            exports.swipeEvent.emit(SwipeDirection.TO_LEFT);
        }
    }
    else if (yProportion > verticalMinYProportion && xProportion < verticalMaxPropotyion) {
        // Vertical swipe detected
        if (deltaY > 0) {
            exports.swipeEvent.emit(SwipeDirection.TO_BOTTOM);
        }
        else {
            exports.swipeEvent.emit(SwipeDirection.TO_TOP);
        }
    }
});
var swipeEventDebugLogger = new DebugLogger_1.DebugLogger('swipeEvent');
exports.swipeEvent.on(function (direction) {
    swipeEventDebugLogger.log(SwipeDirection[direction]);
});

},{"./DebugLogger":5,"./Event":6}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var state_1 = require("./state");
function getTitle() {
    var title = '阿里夫编年史';
    if (state_1.state.currentChapter !== null) {
        title += ' - ' + state_1.state.currentChapter.chapter.displayName;
    }
    return title;
}
exports.getTitle = getTitle;
function updateHistory(push) {
    var method = push ? window.history.pushState : window.history.replaceState;
    var query = window.location.pathname;
    if (state_1.state.currentChapter !== null) {
        if (state_1.state.chapterSelection !== null) {
            query += "?selection=" + state_1.state.chapterSelection.join(',');
        }
        query += '#' + state_1.state.currentChapter.chapter.htmlRelativePath;
    }
    var title = getTitle();
    document.title = title;
    method.call(window.history, null, title, query);
}
exports.updateHistory = updateHistory;

},{"./state":29}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("./data");
var DOM_1 = require("./DOM");
var followQuery_1 = require("./followQuery");
var MainMenu_1 = require("./MainMenu");
var updateSelection_1 = require("./updateSelection");
var $warning = DOM_1.id('warning');
var $buildNumber = DOM_1.id('build-number');
$buildNumber.innerText = "Build " + data_1.data.buildNumber;
new MainMenu_1.MainMenu().setActive(true);
document.addEventListener('selectionchange', function () {
    updateSelection_1.updateSelection();
});
window.addEventListener('popstate', function () {
    followQuery_1.followQuery();
});
followQuery_1.followQuery();

},{"./DOM":4,"./MainMenu":7,"./data":18,"./followQuery":19,"./updateSelection":32}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DebugLogger_1 = require("./DebugLogger");
var Event_1 = require("./Event");
var ArrowKey;
(function (ArrowKey) {
    ArrowKey[ArrowKey["LEFT"] = 0] = "LEFT";
    ArrowKey[ArrowKey["UP"] = 1] = "UP";
    ArrowKey[ArrowKey["RIGHT"] = 2] = "RIGHT";
    ArrowKey[ArrowKey["DOWN"] = 3] = "DOWN";
})(ArrowKey = exports.ArrowKey || (exports.ArrowKey = {}));
exports.arrowKeyPressEvent = new Event_1.Event();
document.addEventListener('keyup', function (event) {
    switch (event.keyCode) {
        case 37:
            exports.arrowKeyPressEvent.emit(ArrowKey.LEFT);
            break;
        case 38:
            exports.arrowKeyPressEvent.emit(ArrowKey.UP);
            break;
        case 39:
            exports.arrowKeyPressEvent.emit(ArrowKey.RIGHT);
            break;
        case 40:
            exports.arrowKeyPressEvent.emit(ArrowKey.DOWN);
            break;
    }
});
var arrowEventDebugLogger = new DebugLogger_1.DebugLogger('arrowKeyEvent');
exports.arrowKeyPressEvent.on(function (arrowKey) {
    arrowEventDebugLogger.log(ArrowKey[arrowKey]);
});

},{"./DebugLogger":5,"./Event":6}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadingText = '萝莉死亡ing...';

},{}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMMENTS_UNAVAILABLE = '本文评论不可用。';
exports.COMMENTS_LOADING = '评论加载中...';
exports.COMMENTS_LOADED = '以下为本章节的评论区。（您可以在设置中禁用评论）';
exports.NO_BLOCKED_USERS = '没有用户的评论被屏蔽';
exports.CLICK_TO_UNBLOCK = '(点击用户名以解除屏蔽)';

},{}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var noop = function () { };
var BooleanSetting = /** @class */ (function () {
    function BooleanSetting(key, defaultValue, onUpdate) {
        if (onUpdate === void 0) { onUpdate = noop; }
        this.key = key;
        this.onUpdate = onUpdate;
        if (defaultValue) {
            this.value = window.localStorage.getItem(key) !== 'false';
        }
        else {
            this.value = window.localStorage.getItem(key) === 'true';
        }
        this.updateLocalStorage();
        this.onUpdate(this.value);
    }
    BooleanSetting.prototype.updateLocalStorage = function () {
        window.localStorage.setItem(this.key, String(this.value));
    };
    BooleanSetting.prototype.getValue = function () {
        return this.value;
    };
    BooleanSetting.prototype.setValue = function (newValue) {
        if (newValue !== this.value) {
            this.onUpdate(newValue);
        }
        this.value = newValue;
        this.updateLocalStorage();
    };
    BooleanSetting.prototype.toggle = function () {
        this.setValue(!this.value);
    };
    return BooleanSetting;
}());
exports.BooleanSetting = BooleanSetting;
var EnumSetting = /** @class */ (function () {
    function EnumSetting(key, options, defaultValue, onUpdate) {
        if (onUpdate === void 0) { onUpdate = noop; }
        this.key = key;
        this.options = options;
        this.defaultValue = defaultValue;
        this.onUpdate = onUpdate;
        if (!this.isCorrectValue(defaultValue)) {
            throw new Error("Default value " + defaultValue + " is not correct.");
        }
        this.value = +(window.localStorage.getItem(key) || defaultValue);
        this.correctValue();
        this.onUpdate(this.value, this.options[this.value]);
    }
    EnumSetting.prototype.isCorrectValue = function (value) {
        return !(Number.isNaN(value) || value % 1 !== 0 || value < 0 || value >= this.options.length);
    };
    EnumSetting.prototype.correctValue = function () {
        if (!this.isCorrectValue(this.value)) {
            this.value = this.defaultValue;
        }
    };
    EnumSetting.prototype.updateLocalStorage = function () {
        window.localStorage.setItem(this.key, String(this.value));
    };
    EnumSetting.prototype.getValue = function () {
        return this.value;
    };
    EnumSetting.prototype.getValueName = function () {
        return this.options[this.value];
    };
    EnumSetting.prototype.setValue = function (newValue) {
        if (newValue !== this.value) {
            this.onUpdate(newValue, this.options[newValue]);
        }
        this.value = newValue;
        this.updateLocalStorage();
    };
    return EnumSetting;
}());
exports.EnumSetting = EnumSetting;
exports.animation = new BooleanSetting('animation', true, function (value) {
    document.body.classList.toggle('animation-enabled', value);
});
exports.warning = new BooleanSetting('warning', false);
exports.earlyAccess = new BooleanSetting('earlyAccess', false, function (value) {
    document.body.classList.toggle('early-access-disabled', !value);
});
exports.useComments = new BooleanSetting('useComments', true);
exports.gestureSwitchChapter = new BooleanSetting('gestureSwitchChapter', true);
// https://github.com/zenozeng/fonts.css
var fontFamilyCssValues = [
    '-apple-system, "Noto Sans", "Helvetica Neue", Helvetica, "Nimbus Sans L", Arial, "Liberation Sans", "PingFang SC", "Hiragino Sans GB", "Noto Sans CJK SC", "Source Han Sans SC", "Source Han Sans CN", "Microsoft YaHei", "Wenquanyi Micro Hei", "WenQuanYi Zen Hei", "ST Heiti", SimHei, "WenQuanYi Zen Hei Sharp", sans-serif',
    'Baskerville, Georgia, "Liberation Serif", "Kaiti SC", STKaiti, "AR PL UKai CN", "AR PL UKai HK", "AR PL UKai TW", "AR PL UKai TW MBE", "AR PL KaitiM GB", KaiTi, KaiTi_GB2312, DFKai-SB, "TW\-Kai", serif',
    'Georgia, "Nimbus Roman No9 L", "Songti SC", "Noto Serif CJK SC", "Source Han Serif SC", "Source Han Serif CN", STSong, "AR PL New Sung", "AR PL SungtiL GB", NSimSun, SimSun, "TW\-Sung", "WenQuanYi Bitmap Song", "AR PL UMing CN", "AR PL UMing HK", "AR PL UMing TW", "AR PL UMing TW MBE", PMingLiU, MingLiU, serif',
    'Baskerville, "Times New Roman", "Liberation Serif", STFangsong, FangSong, FangSong_GB2312, "CWTEX\-F", serif',
];
exports.fontFamily = new EnumSetting('fontFamily', ['黑体', '楷体', '宋体', '仿宋'], 0, function (fontFamilyIndex) {
    document.documentElement.style.setProperty('--font-family', fontFamilyCssValues[fontFamilyIndex]);
});
exports.debugLogging = new BooleanSetting('debugLogging', false);
exports.charCount = new BooleanSetting('charCount', true, function (value) {
    document.body.classList.toggle('char-count-disabled', !value);
});

},{}],28:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function shortNumber(input) {
    if (input < 1000) {
        return String(input);
    }
    if (input < 1000000) {
        return (input / 1000).toFixed(1) + 'k';
    }
    return (input / 1000000).toFixed(1) + 'M';
}
exports.shortNumber = shortNumber;

},{}],29:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.state = {
    currentChapter: null,
    chapterSelection: null,
    chapterTextNodes: null,
};

},{}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stylePreviewArticle = "<h1>\u5348\u996D</h1>\n<p><em>\u4F5C\u8005\uFF1A\u53CB\u4EBA\u266AB</em></p>\n<p>\u201C\u5348\u996D\uFF0C\u5348\u996D\u266A\u201D</p>\n<p>\u9633\u4F1E\u4E0B\u7684\u7433\uFF0C\u5F88\u662F\u671F\u5F85\u4ECA\u5929\u7684\u5348\u996D\u3002</p>\n<p>\u6216\u8BB8\u662F\u4F53\u8D28\u548C\u522B\u7684\u8840\u65CF\u4E0D\u592A\u4E00\u6837\uFF0C\u7433\u80FD\u591F\u611F\u77E5\u5230\u98DF\u7269\u7684\u5473\u9053\uFF0C\u4F3C\u4E4E\u4E5F\u4FDD\u6709\u7740\u751F\u7269\u5BF9\u98DF\u7269\u7684\u559C\u7231\u3002</p>\n<p>\u867D\u7136\u5979\u5E76\u4E0D\u80FD\u4ECE\u8FD9\u4E9B\u98DF\u7269\u4E2D\u83B7\u53D6\u80FD\u91CF\u5C31\u662F\u3002</p>\n<p>\u5B66\u6821\u98DF\u5802\u7684\u590F\u5B63\u9650\u5B9A\u751C\u70B9\u4ECA\u5929\u4E5F\u5F88\u662F\u62A2\u624B\uFF0C\u8FD9\u70B9\u4ECE\u961F\u4F0D\u7684\u957F\u5EA6\u5C31\u80FD\u770B\u51FA\u6765\u2014\u2014\u961F\u4F0D\u9669\u4E9B\u5C31\u8981\u8D85\u51FA\u98DF\u5802\u7684\u8303\u56F4\u4E86\u3002</p>\n<p>\u201C\u4F60\u8BF4\u6211\u8981\u6709\u94B1\u591A\u597D\u2014\u2014\u201D</p>\n<p>\u5DF2\u7ECF\u4ECE\u9694\u58C1\u7A97\u53E3\u4E70\u4E0B\u4E86\u666E\u901A\uFF0C\u4F46\u662F\u5F88\u4FBF\u5B9C\u7684\u8425\u517B\u9910\u7684\u79CB\u955C\u60AC\uFF0C\u770B\u7740\u961F\u4F0D\u4E2D\u5174\u81F4\u52C3\u52C3\u7684\u7433\u3002</p>\n<p>\u5176\u5B9E\u5979\u5E76\u4E0D\u662F\u7F3A\u94B1\uFF0C\u5927\u7EA6\u662F\u541D\u556C\u3002</p>\n<p>\u8FD9\u5F97\u602A\u5979\u5A18\uFF0C\u7A77\u517B\u79CB\u955C\u60AC\u517B\u4E60\u60EF\u4E86\uFF0C\u73B0\u5728\u5979\u5149\u81EA\u5DF1\u9664\u7075\u9000\u9B54\u6323\u6765\u7684\u5916\u5FEB\u90FD\u591F\u5979\u5962\u4F88\u4E0A\u4E00\u628A\u4E86\uFF0C\u53EF\u5374\u8FD8\u4FDD\u7559\u7740\u80FD\u4E0D\u82B1\u94B1\u7EDD\u5BF9\u4E0D\u82B1\uFF0C\u5FC5\u987B\u82B1\u94B1\u8D8A\u5C11\u8D8A\u597D\u7684\u541D\u556C\u4E60\u60EF\u3002</p>\n<p>\u5C11\u9877\uFF0C\u7433\u5DF2\u7ECF\u5E26\u7740\u5979\u7684\u751C\u54C1\u5EFA\u7B51\u2014\u2014\u6BCF\u5757\u7816\u5934\u90FD\u662F\u4E00\u5757\u86CB\u7CD5\uFF0C\u5806\u6210\u4E00\u4E2A\u8BE1\u5F02\u7684\u706B\u67F4\u76D2\u2014\u2014\u6765\u5230\u4E86\u684C\u524D\u3002</p>\n<p>\u201C\uFF08\u5403\u4E0D\u80D6\u771F\u597D\uFF0C\u6709\u94B1\u771F\u597D\u2026\u2026\u201D</p>\n<p>\u8840\u65CF\u7684\u542C\u89C9\u81EA\u7136\u662F\u6355\u6349\u5230\u4E86\u79CB\u955C\u60AC\u7684\u5600\u5495\uFF0C\u7433\u653E\u4E0B\u76D8\u5B50\uFF0C\u6084\u54AA\u54AA\u5730\u5C06\u7259\u8D34\u4E0A\u4E86\u79CB\u955C\u60AC\u7684\u8116\u9888\u3002</p>\n<p>\u201C\u563B\u563B\u266A\u201D</p>\n<p>\u201C\u545C\u2014\u2014\u201D</p>\n<p>\u76EF\u2014\u2014</p>\n<p>\u79CB\u955C\u60AC\u770B\u4E86\u770B\u76D8\u4E2D\u5269\u4E0B\u7684\u4E00\u5757\u6BDB\u8840\u65FA\uFF0C\u4F3C\u662F\u8054\u7CFB\u5230\u4E86\u4EC0\u4E48\uFF0C\u5C06\u76EE\u5149\u8F6C\u5411\u4E86\u7433\u7684\u7259\u3002</p>\n<p>\u6B63\u5728\u4EAB\u7528\u86CB\u7CD5\u76DB\u5BB4\u7684\u7433\u4EE5\u4F59\u5149\u77A5\u89C1\u4E86\u5979\u7684\u89C6\u7EBF\uFF0C</p>\n<p>\u201C\u76EF\u7740\u672C\u5C0F\u59D0\u662F\u8981\u505A\u4EC0\u4E48\u5462\uFF1F\u201D</p>\n<p>\u201C\u554A\uFF0C\u6CA1\uFF0C\u6CA1\u4EC0\u4E48\u2026\u2026\u201D</p>\n<p>\u79CB\u955C\u60AC\u652F\u652F\u543E\u543E\u7684\u8BF4\u7740\uFF0C</p>\n<p>\u201C\u5C31\u662F\u597D\u5947\u4E00\u4E2A\u95EE\u9898\uFF0C\u8840\u65CF\u4E3A\u4EC0\u4E48\u4E0D\u5403\u6BDB\u8840\u65FA\u2026\u2026\u201D</p>\n<p>\u201C\u5662\u2606\u6BDB\u8840\u65FA\u5C31\u662F\u90A3\u4E2A\u716E\u719F\u7684\u8840\u5757\u662F\u5427\uFF1F\u592A\u6CA1\u6709\u7F8E\u611F\u4E86\u8FD9\u79CD\u8840\uFF01\u800C\u4E14\u5403\u4E86\u4E5F\u6CA1\u6CD5\u513F\u6062\u590D\u80FD\u91CF\uFF0C\u7B80\u76F4\u5C31\u662F\u8840\u6DB2\u7684\u7EDD\u4F73\u6D6A\u8D39\u2606\uFF01\u201D</p>\n<p>\u7433\u53D1\u51FA\u4E86\u5BF9\u8FD9\u6837\u7F8E\u98DF\u7684\u9119\u89C6\uFF0C\u4E0D\u8FC7\u8FD9\u79CD\u9119\u89C6\u5927\u7EA6\u53EA\u6709\u8840\u65CF\u548C\u868A\u5B50\u4F1A\u51FA\u73B0\u5427\u2026\u2026</p>\n<p>\u201C\u8840\u65CF\u9700\u8981\u6444\u5165\u8840\uFF0C\u662F\u56E0\u4E3A\u8840\u6240\u5177\u6709\u7684\u751F\u547D\u80FD\u91CF\uFF0C\u5982\u679C\u716E\u719F\u4E86\u7684\u8BDD\uFF0C\u8D85\u8FC7\u4E5D\u6210\u7684\u80FD\u91CF\u90FD\u88AB\u8F6C\u5316\u6210\u5176\u4ED6\u7684\u4E1C\u897F\u4E86\uFF0C\u5BF9\u6211\u4EEC\u6765\u8BF4\u5B9E\u5728\u662F\u6CA1\u4EC0\u4E48\u7528\u5904\uFF0C\u8FD8\u767D\u767D\u6D6A\u8D39\u4E86\u4F5C\u4E3A\u539F\u6599\u7684\u8840\uFF0C\u8FD9\u79CD\u4E1C\u897F\u672C\u5C0F\u59D0\u624D\u4E0D\u5403\u54A7\u2718\uFF01\u997F\u6B7B\uFF0C\u6B7B\u5916\u8FB9\uFF0C\u4ECE\u8FD9\u8FB9\u8DF3\u4E0B\u53BB\u4E5F\u4E0D\u5403\u2718\uFF01\u201D</p>\n<p>\u201C\u6B38\uFF0C\u522B\u8FD9\u4E48\u8BF4\u561B\uFF0C\u4F60\u80FD\u5C1D\u5F97\u5230\u5473\u9053\u7684\u5427\uFF0C\u5403\u4E00\u5757\u8BD5\u8BD5\u5457\uFF1F\u201D</p>\n<p>\u201C\u771F\u2026\u2026\u771F\u9999\u266A\u201D</p>\n<p>\u5F53\u665A\uFF0C\u56E0\u4E3A\u89E6\u53D1\u4E86\u771F\u9999\u5B9A\u5F8B\u800C\u611F\u5230\u5F88\u706B\u5927\u7684\u7433\uFF0C\u628A\u79CB\u955C\u60AC\u4E22\u8FDB\u4E86\u81EA\u5DF1\u7684\u9AD8\u7EF4\u7A7A\u95F4\u91CC\u5934\u653E\u7F6E\u4E86\u4E00\u665A\u4E0A\uFF08\u9AD8\u7EF4\u65F6\u95F4\u4E09\u5929\uFF09\u6CC4\u6124\u3002</p>";

},{}],31:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.thanks = [
    { name: 'scleox', link: 'https://github.com/SCLeoX' },
].sort(function () { return Math.random() - 0.5; });

},{}],32:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var history_1 = require("./history");
var state_1 = require("./state");
function updateSelection() {
    if (state_1.state.chapterTextNodes === null) {
        return;
    }
    var before = String(state_1.state.chapterSelection);
    var selection = document.getSelection();
    if (selection === null) {
        state_1.state.chapterSelection = null;
    }
    else {
        var anchor = ((selection.anchorNode instanceof HTMLElement)
            ? selection.anchorNode.firstChild
            : selection.anchorNode);
        var anchorNodeIndex = state_1.state.chapterTextNodes.indexOf(anchor);
        var focus_1 = ((selection.focusNode instanceof HTMLElement)
            ? selection.focusNode.firstChild
            : selection.focusNode);
        var focusNodeIndex = state_1.state.chapterTextNodes.indexOf(focus_1);
        if ((anchorNodeIndex === -1) || (focusNodeIndex === -1) ||
            (anchorNodeIndex === focusNodeIndex && selection.anchorOffset === selection.focusOffset)) {
            state_1.state.chapterSelection = null;
        }
        else {
            if ((anchorNodeIndex < focusNodeIndex) ||
                (anchorNodeIndex === focusNodeIndex && selection.anchorOffset < selection.focusOffset)) {
                state_1.state.chapterSelection = [
                    anchorNodeIndex,
                    selection.anchorOffset,
                    focusNodeIndex,
                    selection.focusOffset,
                ];
            }
            else {
                state_1.state.chapterSelection = [
                    focusNodeIndex,
                    selection.focusOffset,
                    anchorNodeIndex,
                    selection.anchorOffset,
                ];
            }
        }
    }
    if (before !== String(state_1.state.chapterSelection)) {
        history_1.updateHistory(false);
    }
}
exports.updateSelection = updateSelection;

},{"./history":22,"./state":29}]},{},[23]);
