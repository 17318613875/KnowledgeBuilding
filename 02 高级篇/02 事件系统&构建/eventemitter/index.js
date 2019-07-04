'use strict'

class Events {
    constructor(...args) {
        this._events = Object.create(null);
        this._eventsCount = 0;
        this._maxListeners = undefined;
    }

    /**
     * 为给定事件添加监听
     *
     * @param {EventEmitter}      emitter 对EventEmitter实例的发射器引用
     * @param {(String|Symbol)}   event 给定事件名称
     * @param {Function}          fn 给定事件处理函数
     * @param {*}                 context 调用时上下文
     * @param {Boolean}           once 是否为一次性监听器
     * @returns {EventEmitter}
     */
    addListener(emitter, event, fn, context, once) {
        if (typeof fn != 'function') {
            throw new TypeError(`给定事件处理必须是 function, 接受的类型却是 ${typeof fn}`);
        }
        let listener = new Listener(fn, context || emitter, once);
        if (!emitter._events[event]) {
            // 添加新事件并更新计数
            emitter._events[event] = listener;
            emitter._eventsCount++;
        } else if (!emitter._events[event].fn) {
            emitter._events[event].push(listener)
        } else {
            emitter._events[event] = [emitter._events[event], listener]
        }
        return emitter
    }

    /**
     * 删除监听
     * 
     * @param {(String|Symbol)}   event
     * @param {Function}          fn
     * @param {*}                 context
     * @param {Boolean}           once
     * @returns {EventEmitter} `this`
     */
    removeListener(event, fn, context, once) {
        if (!this._events[event]) return this;
        if (!fn) {
            this.clearEvent(this, event);
            return this;
        }

        var listeners = this._events[event];

        if (listeners.fn) {
            if (
                listeners.fn === fn &&
                (!once || listeners.once) &&
                (!context || listeners.context === context)
            ) {
                this.clearEvent(this, event);
            }
        } else {
            for (var i = 0, events = [], length = listeners.length; i < length; i++) {
                if (
                    listeners[i].fn !== fn ||
                    (once && !listeners[i].once) ||
                    (context && listeners[i].context !== context)
                ) {
                    events.push(listeners[i]);
                }
            }
            if (events.length) this._events[event] = events.length === 1 ? events[0] : events;
            else this.clearEvent(this, event);
        }
        return this;
    }

    removeAllListeners(event) {
        this._events = Object.create(null);
        this._eventsCount = 0;
    }

    /**
     * 清除事件
     * 
     * @param {EventEmitter}      emitter
     * @param {(String|Symbol)}   event
     */
    clearEvent(emitter, event) {
        if (--emitter._eventsCount === 0) emitter._events = Object.create(null)
        else delete emitter._events[event];
    }

    eventNames() {
    }

    setMaxListeners(n) {
        if (typeof n != 'number' || n < 0 || Number.isNaN(n)) throw new RangeError(`setMaxListeners 的值必须是非负整数，而接受的是 ${n}`)
        this._maxListeners = n;
    }
}

class Listener {
    constructor(fn, context, once) {
        this.fn = fn;
        this.context = context;
        this.once = once || false;
    }
}

class EventEmitter extends Events {

    constructor(...args) {
        super(...args);
    }

    on(event, fn, context) {
        return this.addListener(this, event, fn, context, false);
    }

    once(event, fn, context) {
        return this.addListener(this, event, fn, context, true);
    }

    emit(event, ...args) {
        let listeners = this._events[event];
        if (!listeners) return false;

        if (listeners.fn) {
            if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);
            listeners.fn.apply(listeners.context, args);
        } else {
            listeners.forEach(listener => {
                if (listener.once) this.removeListener(event, listener.fn, undefined, true);
                listener.fn.apply(listener.context, args);
            });
        }
        return true;
    }
}

if (typeof module !== 'undefined') {
    module.exports = EventEmitter;
}