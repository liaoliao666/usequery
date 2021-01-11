import { isRef, reactive, readonly, inject, defineComponent, provide, onMounted, onUnmounted, ref, watchEffect } from 'vue';

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

// UTILS
var isServer = typeof window === 'undefined';
function noop() {
  return undefined;
}
function functionalUpdate(updater, input) {
  return typeof updater === 'function' ? updater(input) : updater;
}
function isValidTimeout(value) {
  return typeof value === 'number' && value >= 0 && value !== Infinity;
}
function ensureArray(value) {
  return Array.isArray(value) ? value : [value];
}
function difference(array1, array2) {
  return array1.filter(function (x) {
    return array2.indexOf(x) === -1;
  });
}
function timeUntilStale(updatedAt, staleTime) {
  return Math.max(updatedAt + (staleTime || 0) - Date.now(), 0);
}
function parseQueryArgs(arg1, arg2, arg3) {
  if (!isQueryKey(arg1)) {
    return arg1;
  }

  if (typeof arg2 === 'function') {
    return _extends({}, arg3, {
      queryKey: arg1,
      queryFn: arg2
    });
  }

  return unwrapRefs(_extends({}, arg2, {
    queryKey: arg1
  }));
}
function parseMutationArgs(arg1, arg2, arg3) {
  if (isQueryKey(arg1)) {
    if (typeof arg2 === 'function') {
      return unwrapRefs(_extends({}, arg3, {
        mutationKey: arg1,
        mutationFn: arg2
      }));
    }

    return unwrapRefs(_extends({}, arg2, {
      mutationKey: arg1
    }));
  }

  if (typeof arg1 === 'function') {
    return unwrapRefs(_extends({}, arg2, {
      mutationFn: arg1
    }));
  }

  return unwrapRefs(_extends({}, arg1));
}
function parseFilterArgs(arg1, arg2, arg3) {
  return isQueryKey(arg1) ? [_extends({}, arg2, {
    queryKey: unwrapRefs(arg1)
  }), arg3] : [arg1 || {}, arg2];
}
function matchQuery(filters, query) {
  var active = filters.active,
      exact = filters.exact,
      fetching = filters.fetching,
      inactive = filters.inactive,
      predicate = filters.predicate,
      queryKey = filters.queryKey,
      stale = filters.stale;

  if (isQueryKey(queryKey)) {
    if (exact) {
      var hashFn = getQueryKeyHashFn(query.options);

      if (query.queryHash !== hashFn(queryKey)) {
        return false;
      }
    } else if (!partialMatchKey(query.queryKey, queryKey)) {
      return false;
    }
  }

  var isActive;

  if (inactive === false || active && !inactive) {
    isActive = true;
  } else if (active === false || inactive && !active) {
    isActive = false;
  }

  if (typeof isActive === 'boolean' && query.isActive() !== isActive) {
    return false;
  }

  if (typeof stale === 'boolean' && query.isStale() !== stale) {
    return false;
  }

  if (typeof fetching === 'boolean' && query.isFetching() !== fetching) {
    return false;
  }

  if (predicate && !predicate(query)) {
    return false;
  }

  return true;
}
function getQueryKeyHashFn(options) {
  return (options == null ? void 0 : options.queryKeyHashFn) || hashQueryKey;
}
/**
 * Default query keys hash function.
 */

function hashQueryKey(queryKey) {
  return stableValueHash(queryKey);
}
/**
 * Hashes the value into a stable hash.
 */

function stableValueHash(value) {
  return JSON.stringify(value, function (_, val) {
    return isPlainObject(val) ? Object.keys(val).sort().reduce(function (result, key) {
      result[key] = val[key];
      return result;
    }, {}) : val;
  });
}
/**
 * Checks if key `b` partially matches with key `a`.
 */

function partialMatchKey(a, b) {
  return partialDeepEqual(ensureArray(a), ensureArray(b));
}
/**
 * Checks if `b` partially matches with `a`.
 */

function partialDeepEqual(a, b) {
  if (a === b) {
    return true;
  }

  if (typeof a !== typeof b) {
    return false;
  }

  if (a && b && typeof a === 'object' && typeof b === 'object') {
    return !Object.keys(b).some(function (key) {
      return !partialDeepEqual(a[key], b[key]);
    });
  }

  return false;
}
/**
 * it will replace any deeply equal children of `b` with those of `a`.
 * This can be used for structural sharing between JSON values for example.
 */

function replaceEqualDeep(a, b) {
  if (a === b) return a;
  var array = Array.isArray(a) && Array.isArray(b);
  var isSameObject = array || isPlainObject(a) && isPlainObject(b);

  if (isSameObject) {
    if (array) {
      var bSize = b.length; // omit array keys

      if (a.length > bSize) {
        a.splice(bSize);
      } // pick array keys


      for (var i = 0; i < bSize; i++) {
        a[i] = replaceEqualDeep(a[i], b[i]);
      }
    } else {
      var aKeys = Object.keys(a);
      var bKeys = Object.keys(b);
      var hash = new Set(bKeys);

      for (var _i = 0, len = aKeys.length; _i < len; _i++) {
        var key = aKeys[_i];

        if (!hash.has(key)) {
          // omit object keys
          delete a[key];
        }
      }

      for (var _i2 = 0, _len = bKeys.length; _i2 < _len; _i2++) {
        var _key = bKeys[_i2]; // pick object keys

        a[_key] = replaceEqualDeep(a[_key], b[_key]);
      }
    }
  }

  return isSameObject ? a : b;
}
/**
 * it will replace any equal shallow children of `b` with those of `a`.
 * This can be used for structural sharing between JSON values for example.
 */

function replaceShallowEqualDeep(a, b) {
  if (a === b) return a;
  var array = Array.isArray(a) && Array.isArray(b);
  var isSameObject = array || isPlainObject(a) && isPlainObject(b);

  if (isSameObject) {
    if (array) {
      var bSize = b.length; // omit array keys

      if (a.length > bSize) {
        a.splice(bSize);
      } // pick array keys


      for (var i = 0; i < bSize; i++) {
        a[i] = b[i];
      }
    } else {
      var aKeys = Object.keys(a);
      var bKeys = Object.keys(b);
      var hash = new Set(bKeys);

      for (var _i3 = 0, len = aKeys.length; _i3 < len; _i3++) {
        var key = aKeys[_i3];

        if (!hash.has(key)) {
          // omit object keys
          delete a[key];
        }
      }

      for (var _i4 = 0, _len2 = bKeys.length; _i4 < _len2; _i4++) {
        var _key2 = bKeys[_i4]; // pick object keys

        a[_key2] = b[_key2];
      }
    }
  }

  return isSameObject ? a : b;
} // Copied from: https://github.com/jonschlinkert/is-plain-object

function isPlainObject(o) {
  if (!hasObjectPrototype(o)) {
    return false;
  } // If has modified constructor


  var ctor = o.constructor;

  if (typeof ctor === 'undefined') {
    return true;
  } // If has modified prototype


  var prot = ctor.prototype;

  if (!hasObjectPrototype(prot)) {
    return false;
  } // If constructor does not have an Object-specific method


  if (!prot.hasOwnProperty('isPrototypeOf')) {
    return false;
  } // Most likely a plain Object


  return true;
}

function hasObjectPrototype(o) {
  return Object.prototype.toString.call(o) === '[object Object]';
}

function isQueryKey(value) {
  return typeof value === 'string' || Array.isArray(value);
}
function isError(value) {
  return value instanceof Error;
}
function sleep(timeout) {
  return new Promise(function (resolve) {
    setTimeout(resolve, timeout);
  });
}
function getStatusProps(status) {
  return {
    status: status,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
    isIdle: status === 'idle'
  };
}
/**
 * it will deeply unwrap the value of ref from ref
 */

function unwrapRefs(refs) {
  if (isRef(refs)) {
    return refs.value;
  }

  if (typeof refs === 'function') return refs;
  var array = Array.isArray(refs);

  if (array || isPlainObject(refs)) {
    var items = array ? refs : Object.keys(refs);
    var size = items.length;
    var copy = array ? [] : {};

    for (var i = 0; i < size; i++) {
      var key = array ? i : items[i];
      copy[key] = isRef(refs[key]) ? refs[key].value : unwrapRefs(refs[key]);
    }

    return copy;
  }

  return refs;
}

// FUNCTIONS
var logger = console || {
  error: noop,
  warn: noop,
  log: noop
};
function getLogger() {
  return logger;
}
function setLogger(newLogger) {
  logger = newLogger;
}

var Subscribable = /*#__PURE__*/function () {
  function Subscribable() {
    this.listeners = [];
  }

  var _proto = Subscribable.prototype;

  _proto.subscribe = function subscribe(listener) {
    var _this = this;

    var callback = listener || function () {
      return undefined;
    };

    this.listeners.push(callback);
    this.onSubscribe();
    return function () {
      _this.listeners = _this.listeners.filter(function (x) {
        return x !== callback;
      });

      _this.onUnsubscribe();
    };
  };

  _proto.hasListeners = function hasListeners() {
    return this.listeners.length > 0;
  };

  _proto.onSubscribe = function onSubscribe() {// Do nothing
  };

  _proto.onUnsubscribe = function onUnsubscribe() {// Do nothing
  };

  return Subscribable;
}();

var FocusManager = /*#__PURE__*/function (_Subscribable) {
  _inheritsLoose(FocusManager, _Subscribable);

  function FocusManager() {
    return _Subscribable.apply(this, arguments) || this;
  }

  var _proto = FocusManager.prototype;

  _proto.onSubscribe = function onSubscribe() {
    if (!this.removeEventListener) {
      this.setDefaultEventListener();
    }
  };

  _proto.setEventListener = function setEventListener(setup) {
    var _this = this;

    if (this.removeEventListener) {
      this.removeEventListener();
    }

    this.removeEventListener = setup(function (focused) {
      if (typeof focused === 'boolean') {
        _this.setFocused(focused);
      } else {
        _this.onFocus();
      }
    });
  };

  _proto.setFocused = function setFocused(focused) {
    this.focused = focused;

    if (focused) {
      this.onFocus();
    }
  };

  _proto.onFocus = function onFocus() {
    this.listeners.forEach(function (listener) {
      listener();
    });
  };

  _proto.isFocused = function isFocused() {
    if (typeof this.focused === 'boolean') {
      return this.focused;
    } // document global can be unavailable in react native


    if (typeof document === 'undefined') {
      return true;
    }

    return [undefined, 'visible', 'prerender'].includes(document.visibilityState);
  };

  _proto.setDefaultEventListener = function setDefaultEventListener() {
    var _window;

    if (!isServer && ((_window = window) == null ? void 0 : _window.addEventListener)) {
      this.setEventListener(function (onFocus) {
        // Listen to visibillitychange and focus
        window.addEventListener('visibilitychange', onFocus, false);
        window.addEventListener('focus', onFocus, false);
        return function () {
          // Be sure to unsubscribe if a new handler is set
          window.removeEventListener('visibilitychange', onFocus);
          window.removeEventListener('focus', onFocus);
        };
      });
    }
  };

  return FocusManager;
}(Subscribable);

var focusManager = new FocusManager();

var OnlineManager = /*#__PURE__*/function (_Subscribable) {
  _inheritsLoose(OnlineManager, _Subscribable);

  function OnlineManager() {
    return _Subscribable.apply(this, arguments) || this;
  }

  var _proto = OnlineManager.prototype;

  _proto.onSubscribe = function onSubscribe() {
    if (!this.removeEventListener) {
      this.setDefaultEventListener();
    }
  };

  _proto.setEventListener = function setEventListener(setup) {
    var _this = this;

    if (this.removeEventListener) {
      this.removeEventListener();
    }

    this.removeEventListener = setup(function (online) {
      if (typeof online === 'boolean') {
        _this.setOnline(online);
      } else {
        _this.onOnline();
      }
    });
  };

  _proto.setOnline = function setOnline(online) {
    this.online = online;

    if (online) {
      this.onOnline();
    }
  };

  _proto.onOnline = function onOnline() {
    this.listeners.forEach(function (listener) {
      listener();
    });
  };

  _proto.isOnline = function isOnline() {
    if (typeof this.online === 'boolean') {
      return this.online;
    }

    return navigator.onLine === undefined || navigator.onLine;
  };

  _proto.setDefaultEventListener = function setDefaultEventListener() {
    var _window;

    if (!isServer && ((_window = window) == null ? void 0 : _window.addEventListener)) {
      this.setEventListener(function (onOnline) {
        // Listen to online
        window.addEventListener('online', onOnline, false);
        return function () {
          // Be sure to unsubscribe if a new handler is set
          window.removeEventListener('online', onOnline);
        };
      });
    }
  };

  return OnlineManager;
}(Subscribable);

var onlineManager = new OnlineManager();

function defaultRetryDelay(failureCount) {
  return Math.min(1000 * Math.pow(2, failureCount), 30000);
}

function isCancelable(value) {
  return typeof (value == null ? void 0 : value.cancel) === 'function';
}
var CancelledError = function CancelledError(options) {
  this.revert = options == null ? void 0 : options.revert;
  this.silent = options == null ? void 0 : options.silent;
};
function isCancelledError(value) {
  return value instanceof CancelledError;
} // CLASS

var Retryer = function Retryer(config) {
  var _this = this;

  var cancelRetry = false;
  var cancelFn;
  var continueFn;
  var promiseResolve;
  var promiseReject;

  this.cancel = function (cancelOptions) {
    return cancelFn == null ? void 0 : cancelFn(cancelOptions);
  };

  this.cancelRetry = function () {
    cancelRetry = true;
  };

  this["continue"] = function () {
    return continueFn == null ? void 0 : continueFn();
  };

  this.failureCount = 0;
  this.isPaused = false;
  this.isResolved = false;
  this.isTransportCancelable = false;
  this.promise = new Promise(function (outerResolve, outerReject) {
    promiseResolve = outerResolve;
    promiseReject = outerReject;
  });

  var resolve = function resolve(value) {
    _this.isResolved = true;
    continueFn == null ? void 0 : continueFn();
    promiseResolve(value);
  };

  var reject = function reject(value) {
    _this.isResolved = true;
    continueFn == null ? void 0 : continueFn();
    promiseReject(value);
  };

  var pause = function pause() {
    return new Promise(function (continueResolve) {
      continueFn = continueResolve;
      _this.isPaused = true;
      config.onPause == null ? void 0 : config.onPause();
    }).then(function () {
      continueFn = undefined;
      _this.isPaused = false;
      config.onContinue == null ? void 0 : config.onContinue();
    });
  }; // Create loop function


  var run = function run() {
    // Do nothing if already resolved
    if (_this.isResolved) {
      return;
    }

    var promiseOrValue; // Execute query

    try {
      promiseOrValue = config.fn();
    } catch (error) {
      promiseOrValue = Promise.reject(error);
    } // Create callback to cancel this fetch


    cancelFn = function cancelFn(cancelOptions) {
      reject(new CancelledError(cancelOptions)); // Cancel transport if supported

      if (isCancelable(promiseOrValue)) {
        try {
          promiseOrValue.cancel();
        } catch (_unused) {}
      }
    }; // Check if the transport layer support cancellation


    _this.isTransportCancelable = isCancelable(promiseOrValue);
    Promise.resolve(promiseOrValue).then(resolve)["catch"](function (error) {
      var _config$retry, _config$retryDelay;

      // Stop if the fetch is already resolved
      if (_this.isResolved) {
        return;
      } // Do we need to retry the request?


      var retry = (_config$retry = config.retry) != null ? _config$retry : 3;
      var retryDelay = (_config$retryDelay = config.retryDelay) != null ? _config$retryDelay : defaultRetryDelay;
      var delay = functionalUpdate(retryDelay, _this.failureCount) || 0;
      var shouldRetry = retry === true || typeof retry === 'number' && _this.failureCount < retry || typeof retry === 'function' && retry(_this.failureCount, error);

      if (cancelRetry || !shouldRetry) {
        // We are done if the query does not need to be retried
        reject(error);
        return;
      }

      _this.failureCount++; // Notify on fail

      config.onFail == null ? void 0 : config.onFail(_this.failureCount, error); // Delay

      sleep(delay) // Pause if the document is not visible or when the device is offline
      .then(function () {
        if (!focusManager.isFocused() || !onlineManager.isOnline()) {
          return pause();
        }
      }).then(function () {
        if (cancelRetry) {
          reject(error);
        } else {
          run();
        }
      });
    });
  }; // Start loop


  run();
};

// CLASS
var Query = /*#__PURE__*/function () {
  function Query(config) {
    this.defaultOptions = config.defaultOptions;
    this.setOptions(config.options);
    this.observers = [];
    this.cache = config.cache;
    this.queryKey = config.queryKey;
    this.queryHash = config.queryHash;
    this.initialState = config.state || this.getDefaultState(this.options);
    this.innerState = reactive(this.initialState);
    this.state = readonly(this.innerState);
    this.scheduleGc();
  }

  var _proto = Query.prototype;

  _proto.setOptions = function setOptions(options) {
    var _this$options$cacheTi;

    this.options = _extends({}, this.defaultOptions, options); // Default to 5 minutes if not cache time is set

    this.cacheTime = Math.max(this.cacheTime || 0, (_this$options$cacheTi = this.options.cacheTime) != null ? _this$options$cacheTi : 5 * 60 * 1000);
  };

  _proto.setDefaultOptions = function setDefaultOptions(options) {
    this.defaultOptions = options;
  };

  _proto.scheduleGc = function scheduleGc() {
    var _this = this;

    this.clearGcTimeout();

    if (isValidTimeout(this.cacheTime)) {
      this.gcTimeout = setTimeout(function () {
        _this.optionalRemove();
      }, this.cacheTime);
    }
  };

  _proto.clearGcTimeout = function clearGcTimeout() {
    clearTimeout(this.gcTimeout);
    this.gcTimeout = undefined;
  };

  _proto.optionalRemove = function optionalRemove() {
    if (!this.observers.length && !this.state.isFetching) {
      this.cache.remove(this);
    }
  };

  _proto.setData = function setData(updater, options) {
    var _this$options$isDataE, _this$options;

    var prevData = this.innerState.data; // Get the new data

    var data = functionalUpdate(updater, prevData); // Use prev data if an isDataEqual function is defined and returns `true`

    if ((_this$options$isDataE = (_this$options = this.options).isDataEqual) == null ? void 0 : _this$options$isDataE.call(_this$options, prevData, data)) {
      data = prevData;
    } else if (this.options.structuralSharing !== false) {
      // Structurally share data between prev and new data if needed
      data = replaceEqualDeep(prevData, data);
    } // Set data and mark it as cached


    this.dispatch({
      data: data,
      type: 'success',
      dataUpdatedAt: options == null ? void 0 : options.updatedAt
    });
    return data;
  };

  _proto.setState = function setState(state) {
    this.dispatch({
      type: 'setState',
      state: state
    });
  };

  _proto.cancel = function cancel(options) {
    var _this$retryer;

    var promise = this.promise;
    (_this$retryer = this.retryer) == null ? void 0 : _this$retryer.cancel(options);
    return promise ? promise.then(noop)["catch"](noop) : Promise.resolve();
  };

  _proto.destroy = function destroy() {
    this.clearGcTimeout();
    this.cancel();
  };

  _proto.reset = function reset() {
    this.destroy();
    this.setState(this.initialState);
  };

  _proto.isActive = function isActive() {
    return this.observers.some(function (observer) {
      return observer.options.enabled !== false;
    });
  };

  _proto.isFetching = function isFetching() {
    return this.state.isFetching;
  };

  _proto.isStale = function isStale() {
    return this.state.isInvalidated || !this.state.dataUpdatedAt || this.observers.some(function (observer) {
      return observer.getReadonlyResult().isStale;
    });
  };

  _proto.isStaleByTime = function isStaleByTime(staleTime) {
    if (staleTime === void 0) {
      staleTime = 0;
    }

    return this.state.isInvalidated || !this.state.dataUpdatedAt || !timeUntilStale(this.state.dataUpdatedAt, staleTime);
  };

  _proto.onFocus = function onFocus() {
    var _this$retryer2;

    var observer = this.observers.find(function (x) {
      return x.willFetchOnWindowFocus();
    });

    if (observer) {
      observer.refetch();
    } // Continue fetch if currently paused


    (_this$retryer2 = this.retryer) == null ? void 0 : _this$retryer2["continue"]();
  };

  _proto.onOnline = function onOnline() {
    var _this$retryer3;

    var observer = this.observers.find(function (x) {
      return x.willFetchOnReconnect();
    });

    if (observer) {
      observer.refetch();
    } // Continue fetch if currently paused


    (_this$retryer3 = this.retryer) == null ? void 0 : _this$retryer3["continue"]();
  };

  _proto.addObserver = function addObserver(observer) {
    if (this.observers.indexOf(observer) === -1) {
      this.observers.push(observer); // Stop the query from being garbage collected

      this.clearGcTimeout();
      this.cache.notify(this);
    }
  };

  _proto.removeObserver = function removeObserver(observer) {
    if (this.observers.indexOf(observer) !== -1) {
      this.observers = this.observers.filter(function (x) {
        return x !== observer;
      });

      if (!this.observers.length) {
        // If the transport layer does not support cancellation
        // we'll let the query continue so the result can be cached
        if (this.retryer) {
          if (this.retryer.isTransportCancelable) {
            this.retryer.cancel();
          } else {
            this.retryer.cancelRetry();
          }
        }

        if (this.cacheTime) {
          this.scheduleGc();
        } else {
          this.cache.remove(this);
        }
      }

      this.cache.notify(this);
    }
  };

  _proto.invalidate = function invalidate() {
    if (!this.state.isInvalidated) {
      this.dispatch({
        type: 'invalidate'
      });
    }
  };

  _proto.fetch = function fetch(options, fetchOptions) {
    var _this2 = this,
        _this$options$behavio,
        _context$fetchOptions;

    if (this.state.isFetching) if (this.state.dataUpdatedAt && (fetchOptions == null ? void 0 : fetchOptions.cancelRefetch)) {
      // Silently cancel current fetch if the user wants to cancel refetches
      this.cancel({
        silent: true
      });
    } else if (this.promise) {
      // Return current promise if we are already fetching
      return this.promise;
    } // Update config if passed, otherwise the config from the last execution is used

    if (options) {
      this.setOptions(options);
    } // Use the options from the first observer with a query function if no function is found.
    // This can happen when the query is hydrated or created with setQueryData.


    if (!this.options.queryFn) {
      var observer = this.observers.find(function (x) {
        return x.options.queryFn;
      });

      if (observer) {
        this.setOptions(observer.options);
      }
    } // Create query function context


    var queryKey = ensureArray(this.queryKey);
    var queryFnContext = {
      queryKey: queryKey,
      pageParam: undefined
    }; // Create fetch function

    var fetchFn = function fetchFn() {
      return _this2.options.queryFn ? _this2.options.queryFn(queryFnContext) : Promise.reject('Missing queryFn');
    }; // Trigger behavior hook


    var context = {
      fetchOptions: fetchOptions,
      options: this.options,
      queryKey: queryKey,
      state: this.state,
      fetchFn: fetchFn
    };

    if ((_this$options$behavio = this.options.behavior) == null ? void 0 : _this$options$behavio.onFetch) {
      var _this$options$behavio2;

      (_this$options$behavio2 = this.options.behavior) == null ? void 0 : _this$options$behavio2.onFetch(context);
    } // Set to fetching state if not already in it


    if (!this.state.isFetching || this.state.fetchMeta !== ((_context$fetchOptions = context.fetchOptions) == null ? void 0 : _context$fetchOptions.meta)) {
      var _context$fetchOptions2;

      this.dispatch({
        type: 'fetch',
        meta: (_context$fetchOptions2 = context.fetchOptions) == null ? void 0 : _context$fetchOptions2.meta
      });
    } // Try to fetch the data


    this.retryer = new Retryer({
      fn: context.fetchFn,
      onFail: function onFail() {
        _this2.dispatch({
          type: 'failed'
        });
      },
      onPause: function onPause() {
        _this2.dispatch({
          type: 'pause'
        });
      },
      onContinue: function onContinue() {
        _this2.dispatch({
          type: 'continue'
        });
      },
      retry: context.options.retry,
      retryDelay: context.options.retryDelay
    });
    this.promise = this.retryer.promise.then(function (data) {
      return _this2.setData(data);
    })["catch"](function (error) {
      // Set error state if needed
      if (!(isCancelledError(error) && error.silent)) {
        _this2.dispatch({
          type: 'error',
          error: error
        });
      } // Log error


      if (!isCancelledError(error)) {
        getLogger().error(error);
      } // Propagate error


      throw error;
    })["finally"](function () {
      // Remove query after fetching if cache time is 0
      if (_this2.cacheTime === 0) {
        _this2.optionalRemove();
      }
    });
    return this.promise;
  };

  _proto.dispatch = function dispatch(action) {
    Object.assign(this.innerState, this.reducer(this.state, action));
    this.observers.forEach(function (observer) {
      observer.onQueryUpdate(action);
    });
    this.cache.notify(this);
  };

  _proto.getDefaultState = function getDefaultState(options) {
    var data = typeof options.initialData === 'function' ? options.initialData() : options.initialData;
    var hasData = typeof data !== 'undefined';
    return {
      data: data,
      dataUpdateCount: 0,
      dataUpdatedAt: hasData ? Date.now() : 0,
      error: null,
      errorUpdateCount: 0,
      errorUpdatedAt: 0,
      fetchFailureCount: 0,
      fetchMeta: null,
      isFetching: false,
      isInvalidated: false,
      isPaused: false,
      status: hasData ? 'success' : 'idle'
    };
  };

  _proto.reducer = function reducer(state, action) {
    var _action$meta, _action$dataUpdatedAt;

    switch (action.type) {
      case 'failed':
        return _extends({}, state, {
          fetchFailureCount: state.fetchFailureCount + 1
        });

      case 'pause':
        return _extends({}, state, {
          isPaused: true
        });

      case 'continue':
        return _extends({}, state, {
          isPaused: false
        });

      case 'fetch':
        return _extends({}, state, {
          fetchFailureCount: 0,
          fetchMeta: (_action$meta = action.meta) != null ? _action$meta : null,
          isFetching: true,
          isPaused: false,
          status: state.status === 'idle' ? 'loading' : state.status
        });

      case 'success':
        return _extends({}, state, {
          data: action.data,
          dataUpdateCount: state.dataUpdateCount + 1,
          dataUpdatedAt: (_action$dataUpdatedAt = action.dataUpdatedAt) != null ? _action$dataUpdatedAt : Date.now(),
          error: null,
          fetchFailureCount: 0,
          isFetching: false,
          isInvalidated: false,
          isPaused: false,
          status: 'success'
        });

      case 'error':
        var error = action.error;

        if (isCancelledError(error) && error.revert) {
          return _extends({}, state, {
            fetchFailureCount: 0,
            isFetching: false,
            isPaused: false,
            status: state.status === 'loading' ? 'idle' : state.status
          });
        }

        return _extends({}, state, {
          error: error,
          errorUpdateCount: state.errorUpdateCount + 1,
          errorUpdatedAt: Date.now(),
          fetchFailureCount: state.fetchFailureCount + 1,
          isFetching: false,
          isPaused: false,
          status: 'error'
        });

      case 'invalidate':
        return _extends({}, state, {
          isInvalidated: true
        });

      case 'setState':
        return _extends({}, state, action.state);

      default:
        return state;
    }
  };

  return Query;
}();

// CLASS
var QueryCache = /*#__PURE__*/function (_Subscribable) {
  _inheritsLoose(QueryCache, _Subscribable);

  function QueryCache() {
    var _this;

    _this = _Subscribable.call(this) || this;
    _this.queries = [];
    _this.queriesMap = {};
    return _this;
  }

  var _proto = QueryCache.prototype;

  _proto.build = function build(client, options, state) {
    var _options$queryHash;

    var hashFn = getQueryKeyHashFn(options);
    var queryKey = options.queryKey;
    var queryHash = (_options$queryHash = options.queryHash) != null ? _options$queryHash : hashFn(queryKey);
    var query = this.get(queryHash);

    if (!query) {
      query = new Query({
        cache: this,
        queryKey: queryKey,
        queryHash: queryHash,
        options: client.defaultQueryOptions(options),
        state: state,
        defaultOptions: client.getQueryDefaults(queryKey)
      });
      this.add(query);
    }

    return query;
  };

  _proto.add = function add(query) {
    if (!this.queriesMap[query.queryHash]) {
      this.queriesMap[query.queryHash] = query;
      this.queries.push(query);
      this.notify(query);
    }
  };

  _proto.remove = function remove(query) {
    var queryInMap = this.queriesMap[query.queryHash];

    if (queryInMap) {
      query.destroy();
      this.queries = this.queries.filter(function (x) {
        return x !== query;
      });

      if (queryInMap === query) {
        delete this.queriesMap[query.queryHash];
      }

      this.notify(query);
    }
  };

  _proto.clear = function clear() {
    var _this2 = this;

    this.queries.forEach(function (query) {
      _this2.remove(query);
    });
  };

  _proto.get = function get(queryHash) {
    return this.queriesMap[queryHash];
  };

  _proto.getAll = function getAll() {
    return this.queries;
  };

  _proto.find = function find(arg1, arg2) {
    var _parseFilterArgs = parseFilterArgs(arg1, arg2),
        filters = _parseFilterArgs[0];

    return this.queries.find(function (query) {
      return matchQuery(filters, query);
    });
  };

  _proto.findAll = function findAll(arg1, arg2) {
    var _parseFilterArgs2 = parseFilterArgs(arg1, arg2),
        filters = _parseFilterArgs2[0];

    return filters ? this.queries.filter(function (query) {
      return matchQuery(filters, query);
    }) : this.queries;
  };

  _proto.notify = function notify(query) {
    this.listeners.forEach(function (listener) {
      listener(query);
    });
  };

  _proto.onFocus = function onFocus() {
    this.queries.forEach(function (query) {
      query.onFocus();
    });
  };

  _proto.onOnline = function onOnline() {
    this.queries.forEach(function (query) {
      query.onOnline();
    });
  };

  return QueryCache;
}(Subscribable);

// CLASS
var Mutation = /*#__PURE__*/function () {
  function Mutation(config) {
    this.options = _extends({}, config.defaultOptions, config.options);
    this.mutationId = config.mutationId;
    this.mutationCache = config.mutationCache;
    this.observers = [];
    this.state = config.state || getDefaultState();
  }

  var _proto = Mutation.prototype;

  _proto.setState = function setState(state) {
    this.dispatch({
      type: 'setState',
      state: state
    });
  };

  _proto.addObserver = function addObserver(observer) {
    if (this.observers.indexOf(observer) === -1) {
      this.observers.push(observer);
    }
  };

  _proto.removeObserver = function removeObserver(observer) {
    this.observers = this.observers.filter(function (x) {
      return x !== observer;
    });
  };

  _proto.cancel = function cancel() {
    if (this.retryer) {
      this.retryer.cancel();
      return this.retryer.promise.then(noop)["catch"](noop);
    }

    return Promise.resolve();
  };

  _proto["continue"] = function _continue() {
    if (this.retryer) {
      this.retryer["continue"]();
      return this.retryer.promise;
    }

    return this.execute();
  };

  _proto.execute = function execute() {
    var _this = this;

    var data;
    var restored = this.state.status === 'loading';
    var promise = Promise.resolve();

    if (!restored) {
      this.dispatch({
        type: 'loading',
        variables: this.options.variables
      });
      promise = promise.then(function () {
        return _this.options.onMutate == null ? void 0 : _this.options.onMutate(_this.state.variables);
      }).then(function (context) {
        if (context !== _this.state.context) {
          _this.dispatch({
            type: 'loading',
            context: context,
            variables: _this.state.variables
          });
        }
      });
    }

    return promise.then(function () {
      return _this.executeMutation();
    }).then(function (result) {
      data = result;
    }).then(function () {
      return _this.options.onSuccess == null ? void 0 : _this.options.onSuccess(data, _this.state.variables, _this.state.context);
    }).then(function () {
      return _this.options.onSettled == null ? void 0 : _this.options.onSettled(data, null, _this.state.variables, _this.state.context);
    }).then(function () {
      _this.dispatch({
        type: 'success',
        data: data
      });

      return data;
    })["catch"](function (error) {
      getLogger().error(error);
      return Promise.resolve().then(function () {
        return _this.options.onError == null ? void 0 : _this.options.onError(error, _this.state.variables, _this.state.context);
      }).then(function () {
        return _this.options.onSettled == null ? void 0 : _this.options.onSettled(undefined, error, _this.state.variables, _this.state.context);
      }).then(function () {
        _this.dispatch({
          type: 'error',
          error: error
        });

        throw error;
      });
    });
  };

  _proto.executeMutation = function executeMutation() {
    var _this2 = this,
        _this$options$retry;

    this.retryer = new Retryer({
      fn: function fn() {
        if (!_this2.options.mutationFn) {
          return Promise.reject('No mutationFn found');
        }

        return _this2.options.mutationFn(_this2.state.variables);
      },
      onFail: function onFail() {
        _this2.dispatch({
          type: 'failed'
        });
      },
      onPause: function onPause() {
        _this2.dispatch({
          type: 'pause'
        });
      },
      onContinue: function onContinue() {
        _this2.dispatch({
          type: 'continue'
        });
      },
      retry: (_this$options$retry = this.options.retry) != null ? _this$options$retry : 0,
      retryDelay: this.options.retryDelay
    });
    return this.retryer.promise;
  };

  _proto.dispatch = function dispatch(action) {
    this.state = reducer(this.state, action);
    this.observers.forEach(function (observer) {
      observer.onMutationUpdate(action);
    });
    this.mutationCache.notify(this);
  };

  return Mutation;
}();
function getDefaultState() {
  return {
    context: undefined,
    data: undefined,
    error: null,
    failureCount: 0,
    isPaused: false,
    status: 'idle',
    variables: undefined
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'failed':
      return _extends({}, state, {
        failureCount: state.failureCount + 1
      });

    case 'pause':
      return _extends({}, state, {
        isPaused: true
      });

    case 'continue':
      return _extends({}, state, {
        isPaused: false
      });

    case 'loading':
      return _extends({}, state, {
        context: action.context,
        data: undefined,
        error: null,
        isPaused: false,
        status: 'loading',
        variables: action.variables
      });

    case 'success':
      return _extends({}, state, {
        data: action.data,
        error: null,
        status: 'success',
        isPaused: false
      });

    case 'error':
      return _extends({}, state, {
        data: undefined,
        error: action.error,
        failureCount: state.failureCount + 1,
        isPaused: false,
        status: 'error'
      });

    case 'setState':
      return _extends({}, state, action.state);

    default:
      return state;
  }
}

// CLASS
var MutationCache = /*#__PURE__*/function (_Subscribable) {
  _inheritsLoose(MutationCache, _Subscribable);

  function MutationCache() {
    var _this;

    _this = _Subscribable.call(this) || this;
    _this.mutations = [];
    _this.mutationId = 0;
    return _this;
  }

  var _proto = MutationCache.prototype;

  _proto.build = function build(client, options, state) {
    var mutation = new Mutation({
      mutationCache: this,
      mutationId: ++this.mutationId,
      options: client.defaultMutationOptions(options),
      state: state,
      defaultOptions: options.mutationKey ? client.getMutationDefaults(options.mutationKey) : undefined
    });
    this.add(mutation);
    return mutation;
  };

  _proto.add = function add(mutation) {
    this.mutations.push(mutation);
    this.notify(mutation);
  };

  _proto.remove = function remove(mutation) {
    this.mutations = this.mutations.filter(function (x) {
      return x !== mutation;
    });
    mutation.cancel();
    this.notify(mutation);
  };

  _proto.clear = function clear() {
    var _this2 = this;

    this.mutations.forEach(function (mutation) {
      _this2.remove(mutation);
    });
  };

  _proto.getAll = function getAll() {
    return this.mutations;
  };

  _proto.notify = function notify(mutation) {
    this.listeners.forEach(function (listener) {
      listener(mutation);
    });
  };

  _proto.onFocus = function onFocus() {
    this.resumePausedMutations();
  };

  _proto.onOnline = function onOnline() {
    this.resumePausedMutations();
  };

  _proto.resumePausedMutations = function resumePausedMutations() {
    var pausedMutations = this.mutations.filter(function (x) {
      return x.state.isPaused;
    });
    return pausedMutations.reduce(function (promise, mutation) {
      return promise.then(function () {
        return mutation["continue"]()["catch"](noop);
      });
    }, Promise.resolve());
  };

  return MutationCache;
}(Subscribable);

function infiniteQueryBehavior() {
  return {
    onFetch: function onFetch(context) {
      context.fetchFn = function () {
        var _context$fetchOptions, _context$fetchOptions2, _context$state$data, _context$state$data2;

        var fetchMore = (_context$fetchOptions = context.fetchOptions) == null ? void 0 : (_context$fetchOptions2 = _context$fetchOptions.meta) == null ? void 0 : _context$fetchOptions2.fetchMore;
        var pageParam = fetchMore == null ? void 0 : fetchMore.pageParam;
        var isFetchingNextPage = (fetchMore == null ? void 0 : fetchMore.direction) === 'forward';
        var isFetchingPreviousPage = (fetchMore == null ? void 0 : fetchMore.direction) === 'backward';
        var oldPages = ((_context$state$data = context.state.data) == null ? void 0 : _context$state$data.pages) || [];
        var oldPageParams = ((_context$state$data2 = context.state.data) == null ? void 0 : _context$state$data2.pageParams) || [];
        var newPageParams = oldPageParams; // Get query function

        var queryFn = context.options.queryFn || function () {
          return Promise.reject('Missing queryFn');
        }; // Create function to fetch a page


        var fetchPage = function fetchPage(pages, manual, param, previous) {
          if (typeof param === 'undefined' && !manual && pages.length) {
            return Promise.resolve(pages);
          }

          var queryFnContext = {
            queryKey: context.queryKey,
            pageParam: param
          };
          var cancelFn;
          var queryFnResult = queryFn(queryFnContext);

          if (queryFnResult.cancel) {
            cancelFn = queryFnResult.cancel;
          }

          var promise = Promise.resolve(queryFnResult).then(function (page) {
            newPageParams = previous ? [param].concat(newPageParams) : [].concat(newPageParams, [param]);
            return previous ? [page].concat(pages) : [].concat(pages, [page]);
          });

          if (cancelFn) {
            var promiseAsAny = promise;
            promiseAsAny.cancel = cancelFn;
          }

          return promise;
        };

        var promise; // Fetch first page?

        if (!oldPages.length) {
          promise = fetchPage([]);
        } // Fetch next page?
        else if (isFetchingNextPage) {
            var manual = typeof pageParam !== 'undefined';
            var param = manual ? pageParam : getNextPageParam(context.options, oldPages);
            promise = fetchPage(oldPages, manual, param);
          } // Fetch previous page?
          else if (isFetchingPreviousPage) {
              var _manual = typeof pageParam !== 'undefined';

              var _param = _manual ? pageParam : getPreviousPageParam(context.options, oldPages);

              promise = fetchPage(oldPages, _manual, _param, true);
            } // Refetch pages
            else {
                (function () {
                  newPageParams = [];
                  var manual = typeof context.options.getNextPageParam === 'undefined'; // Fetch first page

                  promise = fetchPage([], manual, oldPageParams[0]); // Fetch remaining pages

                  var _loop = function _loop(i) {
                    promise = promise.then(function (pages) {
                      var param = manual ? oldPageParams[i] : getNextPageParam(context.options, pages);
                      return fetchPage(pages, manual, param);
                    });
                  };

                  for (var i = 1; i < oldPages.length; i++) {
                    _loop(i);
                  }
                })();
              }

        var finalPromise = promise.then(function (pages) {
          return {
            pages: pages,
            pageParams: newPageParams
          };
        });

        if (isCancelable(promise)) {
          var finalPromiseAsAny = finalPromise;
          finalPromiseAsAny.cancel = promise.cancel;
        }

        return finalPromise;
      };
    }
  };
}
function getNextPageParam(options, pages) {
  return options.getNextPageParam == null ? void 0 : options.getNextPageParam(pages[pages.length - 1], pages);
}
function getPreviousPageParam(options, pages) {
  return options.getPreviousPageParam == null ? void 0 : options.getPreviousPageParam(pages[0], pages);
}
/**
 * Checks if there is a next page.
 * Returns `undefined` if it cannot be determined.
 */

function hasNextPage(options, pages) {
  if (options.getNextPageParam && Array.isArray(pages)) {
    var nextPageParam = getNextPageParam(options, pages);
    return typeof nextPageParam !== 'undefined' && nextPageParam !== null && nextPageParam !== false;
  }
}
/**
 * Checks if there is a previous page.
 * Returns `undefined` if it cannot be determined.
 */

function hasPreviousPage(options, pages) {
  if (options.getPreviousPageParam && Array.isArray(pages)) {
    var previousPageParam = getPreviousPageParam(options, pages);
    return typeof previousPageParam !== 'undefined' && previousPageParam !== null && previousPageParam !== false;
  }
}

// CLASS
var QueryClient = /*#__PURE__*/function () {
  function QueryClient(config) {
    if (config === void 0) {
      config = {};
    }

    this.queryCache = config.queryCache || new QueryCache();
    this.mutationCache = config.mutationCache || new MutationCache();
    this.defaultOptions = config.defaultOptions || {};
    this.queryDefaults = [];
    this.mutationDefaults = [];
  }

  var _proto = QueryClient.prototype;

  _proto.mount = function mount() {
    var _this = this;

    this.unsubscribeFocus = focusManager.subscribe(function () {
      if (focusManager.isFocused() && onlineManager.isOnline()) {
        _this.mutationCache.onFocus();

        _this.queryCache.onFocus();
      }
    });
    this.unsubscribeOnline = onlineManager.subscribe(function () {
      if (focusManager.isFocused() && onlineManager.isOnline()) {
        _this.mutationCache.onOnline();

        _this.queryCache.onOnline();
      }
    });
  };

  _proto.unmount = function unmount() {
    var _this$unsubscribeFocu, _this$unsubscribeOnli;

    (_this$unsubscribeFocu = this.unsubscribeFocus) == null ? void 0 : _this$unsubscribeFocu.call(this);
    (_this$unsubscribeOnli = this.unsubscribeOnline) == null ? void 0 : _this$unsubscribeOnli.call(this);
  };

  _proto.isFetching = function isFetching(arg1, arg2) {
    var _parseFilterArgs = parseFilterArgs(arg1, arg2),
        filters = _parseFilterArgs[0];

    filters.fetching = true;
    return this.queryCache.findAll(filters).length;
  };

  _proto.getQueryData = function getQueryData(queryKey, filters) {
    var _this$queryCache$find;

    return (_this$queryCache$find = this.queryCache.find(queryKey, filters)) == null ? void 0 : _this$queryCache$find.state.data;
  };

  _proto.setQueryData = function setQueryData(queryKey, updater, options) {
    var parsedOptions = parseQueryArgs(queryKey);
    var defaultedOptions = this.defaultQueryOptions(parsedOptions);
    return this.queryCache.build(this, defaultedOptions).setData(updater, options);
  };

  _proto.getQueryState = function getQueryState(queryKey, filters) {
    var _this$queryCache$find2;

    return (_this$queryCache$find2 = this.queryCache.find(queryKey, filters)) == null ? void 0 : _this$queryCache$find2.state;
  };

  _proto.removeQueries = function removeQueries(arg1, arg2) {
    var _parseFilterArgs2 = parseFilterArgs(arg1, arg2),
        filters = _parseFilterArgs2[0];

    var queryCache = this.queryCache;
    queryCache.findAll(filters).forEach(function (query) {
      queryCache.remove(query);
    });
  };

  _proto.resetQueries = function resetQueries(arg1, arg2, arg3) {
    var _parseFilterArgs3 = parseFilterArgs(arg1, arg2, arg3),
        filters = _parseFilterArgs3[0],
        options = _parseFilterArgs3[1];

    var queryCache = this.queryCache;

    var refetchFilters = _extends({}, filters, {
      active: true
    });

    queryCache.findAll(filters).forEach(function (query) {
      query.reset();
    });
    return this.refetchQueries(refetchFilters, options);
  };

  _proto.cancelQueries = function cancelQueries(arg1, arg2, arg3) {
    var _parseFilterArgs4 = parseFilterArgs(arg1, arg2, arg3),
        filters = _parseFilterArgs4[0],
        _parseFilterArgs4$ = _parseFilterArgs4[1],
        cancelOptions = _parseFilterArgs4$ === void 0 ? {} : _parseFilterArgs4$;

    if (typeof cancelOptions.revert === 'undefined') {
      cancelOptions.revert = true;
    }

    var promises = this.queryCache.findAll(filters).map(function (query) {
      return query.cancel(cancelOptions);
    });
    return Promise.all(promises).then(noop)["catch"](noop);
  };

  _proto.invalidateQueries = function invalidateQueries(arg1, arg2, arg3) {
    var _filters$refetchActiv, _filters$refetchInact;

    var _parseFilterArgs5 = parseFilterArgs(arg1, arg2, arg3),
        filters = _parseFilterArgs5[0],
        options = _parseFilterArgs5[1];

    var refetchFilters = _extends({}, filters, {
      active: (_filters$refetchActiv = filters.refetchActive) != null ? _filters$refetchActiv : true,
      inactive: (_filters$refetchInact = filters.refetchInactive) != null ? _filters$refetchInact : false
    });

    this.queryCache.findAll(filters).forEach(function (query) {
      query.invalidate();
    });
    return this.refetchQueries(refetchFilters, options);
  };

  _proto.refetchQueries = function refetchQueries(arg1, arg2, arg3) {
    var _parseFilterArgs6 = parseFilterArgs(arg1, arg2, arg3),
        filters = _parseFilterArgs6[0],
        options = _parseFilterArgs6[1];

    var promises = this.queryCache.findAll(filters).map(function (query) {
      return query.fetch();
    });
    var promise = Promise.all(promises).then(noop);

    if (!(options == null ? void 0 : options.throwOnError)) {
      promise = promise["catch"](noop);
    }

    return promise;
  };

  _proto.fetchQuery = function fetchQuery(arg1, arg2, arg3) {
    var parsedOptions = parseQueryArgs(arg1, arg2, arg3);
    var defaultedOptions = this.defaultQueryOptions(parsedOptions); // https://github.com/tannerlinsley/react-query/issues/652

    if (typeof defaultedOptions.retry === 'undefined') {
      defaultedOptions.retry = false;
    }

    var query = this.queryCache.build(this, defaultedOptions); // @ts-ignore

    return query.isStaleByTime(defaultedOptions.staleTime) ? query.fetch(defaultedOptions) : Promise.resolve(query.state.data);
  };

  _proto.prefetchQuery = function prefetchQuery(arg1, arg2, arg3) {
    return this.fetchQuery(arg1, arg2, arg3).then(noop)["catch"](noop);
  };

  _proto.fetchInfiniteQuery = function fetchInfiniteQuery(arg1, arg2, arg3) {
    var parsedOptions = parseQueryArgs(arg1, arg2, arg3);
    parsedOptions.behavior = infiniteQueryBehavior();
    return this.fetchQuery(parsedOptions);
  };

  _proto.prefetchInfiniteQuery = function prefetchInfiniteQuery(arg1, arg2, arg3) {
    return this.fetchInfiniteQuery(arg1, arg2, arg3).then(noop)["catch"](noop);
  };

  _proto.cancelMutations = function cancelMutations() {
    var promises = this.mutationCache.getAll().map(function (mutation) {
      return mutation.cancel();
    });
    return Promise.all(promises).then(noop)["catch"](noop);
  };

  _proto.resumePausedMutations = function resumePausedMutations() {
    return this.getMutationCache().resumePausedMutations();
  };

  _proto.executeMutation = function executeMutation(options) {
    return this.mutationCache.build(this, options).execute();
  };

  _proto.getQueryCache = function getQueryCache() {
    return this.queryCache;
  };

  _proto.getMutationCache = function getMutationCache() {
    return this.mutationCache;
  };

  _proto.getDefaultOptions = function getDefaultOptions() {
    return this.defaultOptions;
  };

  _proto.setDefaultOptions = function setDefaultOptions(options) {
    this.defaultOptions = options;
  };

  _proto.setQueryDefaults = function setQueryDefaults(queryKey, options) {
    var result = this.queryDefaults.find(function (x) {
      return hashQueryKey(queryKey) === hashQueryKey(x.queryKey);
    });

    if (result) {
      result.defaultOptions = options;
    } else {
      this.queryDefaults.push({
        queryKey: queryKey,
        defaultOptions: options
      });
    }
  };

  _proto.getQueryDefaults = function getQueryDefaults(queryKey) {
    var _this$queryDefaults$f;

    return queryKey ? (_this$queryDefaults$f = this.queryDefaults.find(function (x) {
      return partialMatchKey(queryKey, x.queryKey);
    })) == null ? void 0 : _this$queryDefaults$f.defaultOptions : undefined;
  };

  _proto.setMutationDefaults = function setMutationDefaults(mutationKey, options) {
    var result = this.mutationDefaults.find(function (x) {
      return hashQueryKey(mutationKey) === hashQueryKey(x.mutationKey);
    });

    if (result) {
      result.defaultOptions = options;
    } else {
      this.mutationDefaults.push({
        mutationKey: mutationKey,
        defaultOptions: options
      });
    }
  };

  _proto.getMutationDefaults = function getMutationDefaults(mutationKey) {
    var _this$mutationDefault;

    return mutationKey ? (_this$mutationDefault = this.mutationDefaults.find(function (x) {
      return partialMatchKey(mutationKey, x.mutationKey);
    })) == null ? void 0 : _this$mutationDefault.defaultOptions : undefined;
  };

  _proto.defaultQueryOptions = function defaultQueryOptions(options) {
    if (options == null ? void 0 : options._defaulted) {
      return options;
    }

    return _extends({}, this.defaultOptions.queries, this.getQueryDefaults(options == null ? void 0 : options.queryKey), options, {
      _defaulted: true
    });
  };

  _proto.defaultQueryObserverOptions = function defaultQueryObserverOptions(options) {
    return this.defaultQueryOptions(options);
  };

  _proto.defaultMutationOptions = function defaultMutationOptions(options) {
    if (options == null ? void 0 : options._defaulted) {
      return options;
    }

    return _extends({}, this.defaultOptions.mutations, this.getMutationDefaults(options == null ? void 0 : options.mutationKey), options, {
      _defaulted: true
    });
  };

  _proto.clear = function clear() {
    this.queryCache.clear();
    this.mutationCache.clear();
  };

  return QueryClient;
}();

var QueryObserver = /*#__PURE__*/function (_Subscribable) {
  _inheritsLoose(QueryObserver, _Subscribable);

  function QueryObserver(client, options) {
    var _this;

    _this = _Subscribable.call(this) || this;
    _this.client = client;
    _this.options = options;
    _this.initialDataUpdateCount = 0;
    _this.initialErrorUpdateCount = 0;

    _this.bindMethods();

    _this.setOptions(options);

    return _this;
  }

  var _proto = QueryObserver.prototype;

  _proto.bindMethods = function bindMethods() {
    this.remove = this.remove.bind(this);
    this.refetch = this.refetch.bind(this);
  };

  _proto.onSubscribe = function onSubscribe() {
    if (this.listeners.length === 1) {
      this.updateQuery();
      this.currentQuery.addObserver(this);

      if (this.willFetchOnMount()) {
        this.executeFetch();
      }

      this.updateTimers();
    }
  };

  _proto.onUnsubscribe = function onUnsubscribe() {
    if (!this.listeners.length) {
      this.destroy();
    }
  };

  _proto.willLoadOnMount = function willLoadOnMount() {
    return this.options.enabled !== false && !this.currentQuery.state.dataUpdatedAt;
  };

  _proto.willRefetchOnMount = function willRefetchOnMount() {
    return this.options.enabled !== false && this.currentQuery.state.dataUpdatedAt > 0 && (this.options.refetchOnMount === 'always' || this.options.refetchOnMount !== false && this.isStale());
  };

  _proto.willFetchOnMount = function willFetchOnMount() {
    return this.willLoadOnMount() || this.willRefetchOnMount();
  };

  _proto.willFetchOnReconnect = function willFetchOnReconnect() {
    return this.options.enabled !== false && (this.options.refetchOnReconnect === 'always' || this.options.refetchOnReconnect !== false && this.isStale());
  };

  _proto.willFetchOnWindowFocus = function willFetchOnWindowFocus() {
    return this.options.enabled !== false && (this.options.refetchOnWindowFocus === 'always' || this.options.refetchOnWindowFocus !== false && this.isStale());
  };

  _proto.willFetchOptionally = function willFetchOptionally() {
    return this.options.enabled !== false && this.isStale();
  };

  _proto.isStale = function isStale() {
    return this.currentQuery.isStaleByTime(this.options.staleTime);
  };

  _proto.destroy = function destroy() {
    this.listeners = [];
    this.clearTimers();
    this.currentQuery.removeObserver(this);
  };

  _proto.setOptions = function setOptions(options) {
    var prevOptions = _extends({}, this.options);

    var prevQuery = this.currentQuery;
    this.options = this.client.defaultQueryObserverOptions(options);

    if (typeof this.options.enabled !== 'undefined' && typeof this.options.enabled !== 'boolean') {
      throw new Error('Expected enabled to be a boolean');
    } // Keep previous query key if the user does not supply one


    if (!this.options.queryKey) {
      this.options.queryKey = prevOptions.queryKey;
    }

    this.updateQuery(); // Take no further actions if there are no subscribers

    if (!this.listeners.length) {
      return;
    } // If we subscribed to a new query, optionally fetch and update refetch


    if (this.currentQuery !== prevQuery) {
      this.optionalFetch();
      this.updateTimers();
      return;
    } // Optionally fetch if the query became enabled


    if (this.options.enabled !== false && prevOptions.enabled === false) {
      this.optionalFetch();
    } // Update stale interval if needed


    if (this.options.enabled !== prevOptions.enabled || this.options.staleTime !== prevOptions.staleTime) {
      this.updateStaleTimeout();
    } // Update refetch interval if needed


    if (this.options.enabled !== prevOptions.enabled || this.options.refetchInterval !== prevOptions.refetchInterval) {
      this.updateRefetchInterval();
    }
  };

  _proto.getCurrentResult = function getCurrentResult() {
    return this.currentResult;
  };

  _proto.getReadonlyResult = function getReadonlyResult() {
    return this.readonlyResult || (this.readonlyResult = readonly(this.currentResult));
  };

  _proto.getNextResult = function getNextResult(options) {
    var _this2 = this;

    return new Promise(function (resolve, reject) {
      var unsubscribe = _this2.subscribe(function (result) {
        if (!result.isFetching) {
          unsubscribe();

          if (result.isError && (options == null ? void 0 : options.throwOnError)) {
            reject(result.error);
          } else {
            resolve(result);
          }
        }
      });
    });
  };

  _proto.getCurrentQuery = function getCurrentQuery() {
    return this.currentQuery;
  };

  _proto.remove = function remove() {
    this.client.getQueryCache().remove(this.currentQuery);
  };

  _proto.refetch = function refetch(options) {
    return this.fetch(options);
  };

  _proto.fetch = function fetch(fetchOptions) {
    var _this3 = this;

    return this.executeFetch(fetchOptions).then(function () {
      _this3.updateResult();

      return _this3.currentResult;
    });
  };

  _proto.optionalFetch = function optionalFetch() {
    if (this.willFetchOptionally()) {
      this.executeFetch();
    }
  };

  _proto.executeFetch = function executeFetch(fetchOptions) {
    // Make sure we reference the latest query as the current one might have been removed
    this.updateQuery(); // Fetch

    var promise = this.currentQuery.fetch(this.options, fetchOptions);

    if (!(fetchOptions == null ? void 0 : fetchOptions.throwOnError)) {
      promise = promise["catch"](noop);
    }

    return promise;
  };

  _proto.updateStaleTimeout = function updateStaleTimeout() {
    var _this4 = this;

    this.clearStaleTimeout();

    if (isServer || this.currentResult.isStale || !isValidTimeout(this.options.staleTime)) {
      return;
    }

    var time = timeUntilStale(this.currentResult.dataUpdatedAt, this.options.staleTime); // The timeout is sometimes triggered 1 ms before the stale time expiration.
    // To mitigate this issue we always add 1 ms to the timeout.

    var timeout = time + 1;
    this.staleTimeoutId = setTimeout(function () {
      if (!_this4.currentResult.isStale) {
        _this4.updateResult();

        _this4.notify({
          cache: true
        });
      }
    }, timeout);
  };

  _proto.updateRefetchInterval = function updateRefetchInterval() {
    var _this5 = this;

    this.clearRefetchInterval();

    if (isServer || this.options.enabled === false || !isValidTimeout(this.options.refetchInterval)) {
      return;
    }

    this.refetchIntervalId = setInterval(function () {
      if (_this5.options.refetchIntervalInBackground || focusManager.isFocused()) {
        _this5.executeFetch();
      }
    }, this.options.refetchInterval);
  };

  _proto.updateTimers = function updateTimers() {
    this.updateStaleTimeout();
    this.updateRefetchInterval();
  };

  _proto.clearTimers = function clearTimers() {
    this.clearStaleTimeout();
    this.clearRefetchInterval();
  };

  _proto.clearStaleTimeout = function clearStaleTimeout() {
    clearTimeout(this.staleTimeoutId);
    this.staleTimeoutId = undefined;
  };

  _proto.clearRefetchInterval = function clearRefetchInterval() {
    clearInterval(this.refetchIntervalId);
    this.refetchIntervalId = undefined;
  };

  _proto.updateResult = function updateResult(willFetch) {
    var _this$previousQueryRe;

    var state = this.currentQuery.state;
    var isFetching = state.isFetching,
        status = state.status;
    var isPreviousData = false;
    var isPlaceholderData = false;
    var data;
    var dataUpdatedAt = state.dataUpdatedAt; // Optimistically set status to loading if we will start fetching

    if (willFetch) {
      isFetching = true;

      if (status === 'idle') {
        status = 'loading';
      }
    } // Keep previous data if needed


    if (this.options.keepPreviousData && !state.dataUpdateCount && ((_this$previousQueryRe = this.previousQueryResult) == null ? void 0 : _this$previousQueryRe.isSuccess)) {
      data = this.previousQueryResult.data;
      dataUpdatedAt = this.previousQueryResult.dataUpdatedAt;
      status = this.previousQueryResult.status;
      isPreviousData = true;
    } // Select data if needed
    else if (this.options.select && typeof state.data !== 'undefined') {
        var _this$currentResultSt;

        // Use the previous select result if the query data did not change
        if (this.currentResult && state.data === ((_this$currentResultSt = this.currentResultState) == null ? void 0 : _this$currentResultSt.data)) {
          data = this.currentResult.data;
        } else {
          data = this.options.select(state.data);

          if (this.options.structuralSharing !== false) {
            var _this$currentResult;

            data = replaceEqualDeep((_this$currentResult = this.currentResult) == null ? void 0 : _this$currentResult.data, data);
          }
        }
      } // Use query data
      else {
          data = state.data;
        } // Show placeholder data if needed


    if (typeof this.options.placeholderData !== 'undefined' && typeof data === 'undefined' && status === 'loading') {
      var placeholderData = typeof this.options.placeholderData === 'function' ? this.options.placeholderData() : this.options.placeholderData;

      if (typeof placeholderData !== 'undefined') {
        status = 'success';
        data = placeholderData;
        isPlaceholderData = true;
      }
    }

    var result = _extends({}, getStatusProps(status), {
      data: data,
      dataUpdatedAt: dataUpdatedAt,
      error: state.error,
      errorUpdatedAt: state.errorUpdateCount,
      failureCount: state.fetchFailureCount,
      isFetched: state.dataUpdateCount > 0 || state.errorUpdateCount > 0,
      isFetchedAfterMount: state.dataUpdateCount > this.initialDataUpdateCount || state.errorUpdateCount > this.initialErrorUpdateCount,
      isFetching: isFetching,
      isLoadingError: status === 'error' && state.dataUpdatedAt === 0,
      isPlaceholderData: isPlaceholderData,
      isPreviousData: isPreviousData,
      isRefetchError: status === 'error' && state.dataUpdatedAt !== 0,
      isStale: this.isStale(),
      refetch: this.refetch,
      remove: this.remove
    });

    if (this.currentResult) {
      Object.assign(this.currentResult, result);
    } else {
      this.currentResult = reactive(result);
    }
  };

  _proto.updateQuery = function updateQuery() {
    var prevQuery = this.currentQuery;
    var query = this.client.getQueryCache().build(this.client, this.options);

    if (query === prevQuery) {
      return;
    }

    this.previousQueryResult = _extends({}, this.currentResult);
    this.currentQuery = query;
    this.initialDataUpdateCount = query.state.dataUpdateCount;
    this.initialErrorUpdateCount = query.state.errorUpdateCount;
    var willFetch = prevQuery ? this.willFetchOptionally() : this.willFetchOnMount();
    this.updateResult(willFetch);

    if (!this.hasListeners()) {
      return;
    }

    prevQuery == null ? void 0 : prevQuery.removeObserver(this);
    this.currentQuery.addObserver(this);
    this.notify({});
  };

  _proto.onQueryUpdate = function onQueryUpdate(action) {
    this.updateResult(); // Update timers

    this.updateTimers(); // Determine which callbacks to trigger

    var notifyOptions = {};

    if (action.type === 'success') {
      notifyOptions.onSuccess = true;
    } else if (action.type === 'error') {
      notifyOptions.onError = true;
    }

    this.notify(notifyOptions);
  };

  _proto.notify = function notify(notifyOptions) {
    var _this6 = this;

    // First trigger the configuration callbacks
    if (notifyOptions.onSuccess) {
      var _this$options$onSucce, _this$options, _this$options$onSettl, _this$options2;

      (_this$options$onSucce = (_this$options = this.options).onSuccess) == null ? void 0 : _this$options$onSucce.call(_this$options, this.readonlyResult.data);
      (_this$options$onSettl = (_this$options2 = this.options).onSettled) == null ? void 0 : _this$options$onSettl.call(_this$options2, this.readonlyResult.data, null);
    } else if (notifyOptions.onError) {
      var _this$options$onError, _this$options3, _this$options$onSettl2, _this$options4;

      (_this$options$onError = (_this$options3 = this.options).onError) == null ? void 0 : _this$options$onError.call(_this$options3, this.readonlyResult.error);
      (_this$options$onSettl2 = (_this$options4 = this.options).onSettled) == null ? void 0 : _this$options$onSettl2.call(_this$options4, undefined, this.readonlyResult.error);
    } // Then trigger the listeners


    this.listeners.forEach(function (listener) {
      listener(_this6.readonlyResult);
    }); // Then the cache listeners

    if (notifyOptions.cache) {
      this.client.getQueryCache().notify(this.currentQuery);
    }
  };

  return QueryObserver;
}(Subscribable);

var QueriesObserver = /*#__PURE__*/function (_Subscribable) {
  _inheritsLoose(QueriesObserver, _Subscribable);

  function QueriesObserver(client, queries) {
    var _this;

    _this = _Subscribable.call(this) || this;
    _this.client = client;
    _this.queries = queries || [];
    _this.observers = []; // Subscribe to queries

    _this.updateObservers();

    return _this;
  }

  var _proto = QueriesObserver.prototype;

  _proto.onSubscribe = function onSubscribe() {
    var _this2 = this;

    if (this.listeners.length === 1) {
      this.observers.forEach(function (observer) {
        observer.subscribe(function (result) {
          _this2.onUpdate(observer, result);
        });
      });
    }
  };

  _proto.onUnsubscribe = function onUnsubscribe() {
    if (!this.listeners.length) {
      this.destroy();
    }
  };

  _proto.destroy = function destroy() {
    this.listeners = [];
    this.observers.forEach(function (observer) {
      observer.destroy();
    });
  };

  _proto.setQueries = function setQueries(queries) {
    this.queries = queries;
    this.updateObservers();
  };

  _proto.getCurrentResult = function getCurrentResult() {
    return this.result;
  };

  _proto.updateObservers = function updateObservers() {
    var _this3 = this;

    var hasIndexChange = false;
    var prevObservers = this.observers;
    var newObservers = this.queries.map(function (options, i) {
      var observer = prevObservers[i];

      var defaultedOptions = _this3.client.defaultQueryObserverOptions(options);

      var hashFn = getQueryKeyHashFn(defaultedOptions);
      defaultedOptions.queryHash = hashFn(defaultedOptions.queryKey);

      if (!observer || observer.getCurrentQuery().queryHash !== defaultedOptions.queryHash) {
        hasIndexChange = true;
        observer = prevObservers.find(function (x) {
          return x.getCurrentQuery().queryHash === defaultedOptions.queryHash;
        });
      }

      if (observer) {
        observer.setOptions(defaultedOptions);
        return observer;
      }

      return new QueryObserver(_this3.client, defaultedOptions);
    });

    if (prevObservers.length === newObservers.length && !hasIndexChange) {
      return;
    }

    this.observers = newObservers;
    this.result = newObservers.map(function (observer) {
      return observer.getReadonlyResult();
    });

    if (!this.listeners.length) {
      return;
    }

    difference(prevObservers, newObservers).forEach(function (observer) {
      observer.destroy();
    });
    difference(newObservers, prevObservers).forEach(function (observer) {
      observer.subscribe(function (result) {
        _this3.onUpdate(observer, result);
      });
    });
    this.notify();
  };

  _proto.onUpdate = function onUpdate(observer, result) {
    var index = this.observers.indexOf(observer);

    if (index !== -1) {
      this.result[index] = result;
      this.notify();
    }
  };

  _proto.notify = function notify() {
    var _this4 = this;

    this.listeners.forEach(function (listener) {
      listener(_this4.result);
    });
  };

  return QueriesObserver;
}(Subscribable);

var InfiniteQueryObserver = /*#__PURE__*/function (_QueryObserver) {
  _inheritsLoose(InfiniteQueryObserver, _QueryObserver);

  // Type override
  // Type override
  // Type override
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  function InfiniteQueryObserver(client, options) {
    return _QueryObserver.call(this, client, options) || this;
  }

  var _proto = InfiniteQueryObserver.prototype;

  _proto.bindMethods = function bindMethods() {
    _QueryObserver.prototype.bindMethods.call(this);

    this.fetchNextPage = this.fetchNextPage.bind(this);
    this.fetchPreviousPage = this.fetchPreviousPage.bind(this);
  };

  _proto.setOptions = function setOptions(options) {
    _QueryObserver.prototype.setOptions.call(this, _extends({}, options, {
      behavior: infiniteQueryBehavior()
    }));
  };

  _proto.fetchNextPage = function fetchNextPage(options) {
    return this.fetch({
      cancelRefetch: true,
      throwOnError: options == null ? void 0 : options.throwOnError,
      meta: {
        fetchMore: {
          direction: 'forward',
          pageParam: options == null ? void 0 : options.pageParam
        }
      }
    });
  };

  _proto.fetchPreviousPage = function fetchPreviousPage(options) {
    return this.fetch({
      cancelRefetch: true,
      throwOnError: options == null ? void 0 : options.throwOnError,
      meta: {
        fetchMore: {
          direction: 'backward',
          pageParam: options == null ? void 0 : options.pageParam
        }
      }
    });
  };

  _proto.updateResult = function updateResult(willFetch) {
    var _state$data, _state$data2, _state$fetchMeta, _state$fetchMeta$fetc, _state$fetchMeta2, _state$fetchMeta2$fet;

    var _this$getCurrentQuery = this.getCurrentQuery(),
        state = _this$getCurrentQuery.state;

    _QueryObserver.prototype.updateResult.call(this, willFetch);

    Object.assign(_QueryObserver.prototype.getCurrentResult.call(this), {
      fetchNextPage: this.fetchNextPage,
      fetchPreviousPage: this.fetchPreviousPage,
      hasNextPage: hasNextPage(this.options, (_state$data = state.data) == null ? void 0 : _state$data.pages),
      hasPreviousPage: hasPreviousPage(this.options, (_state$data2 = state.data) == null ? void 0 : _state$data2.pages),
      isFetchingNextPage: state.isFetching && ((_state$fetchMeta = state.fetchMeta) == null ? void 0 : (_state$fetchMeta$fetc = _state$fetchMeta.fetchMore) == null ? void 0 : _state$fetchMeta$fetc.direction) === 'forward',
      isFetchingPreviousPage: state.isFetching && ((_state$fetchMeta2 = state.fetchMeta) == null ? void 0 : (_state$fetchMeta2$fet = _state$fetchMeta2.fetchMore) == null ? void 0 : _state$fetchMeta2$fet.direction) === 'backward'
    });
  };

  return InfiniteQueryObserver;
}(QueryObserver);

// CLASS
var MutationObserver = /*#__PURE__*/function (_Subscribable) {
  _inheritsLoose(MutationObserver, _Subscribable);

  function MutationObserver(client, options) {
    var _this;

    _this = _Subscribable.call(this) || this;
    _this.client = client;

    _this.setOptions(options);

    _this.bindMethods();

    _this.updateResult();

    return _this;
  }

  var _proto = MutationObserver.prototype;

  _proto.bindMethods = function bindMethods() {
    this.mutate = this.mutate.bind(this);
    this.reset = this.reset.bind(this);
  };

  _proto.setOptions = function setOptions(options) {
    this.options = this.client.defaultMutationOptions(options);
  };

  _proto.onUnsubscribe = function onUnsubscribe() {
    if (!this.listeners.length) {
      var _this$currentMutation;

      (_this$currentMutation = this.currentMutation) == null ? void 0 : _this$currentMutation.removeObserver(this);
    }
  };

  _proto.onMutationUpdate = function onMutationUpdate(action) {
    this.updateResult(); // Determine which callbacks to trigger

    var notifyOptions = {
      listeners: true
    };

    if (action.type === 'success') {
      notifyOptions.onSuccess = true;
    } else if (action.type === 'error') {
      notifyOptions.onError = true;
    }

    this.notify(notifyOptions);
  };

  _proto.getCurrentResult = function getCurrentResult() {
    return this.currentResult;
  };

  _proto.reset = function reset() {
    this.currentMutation = undefined;
    this.updateResult();
    this.notify({
      listeners: true
    });
  };

  _proto.mutate = function mutate(variables, options) {
    this.mutateOptions = options;

    if (this.currentMutation) {
      this.currentMutation.removeObserver(this);
    }

    this.currentMutation = this.client.getMutationCache().build(this.client, _extends({}, this.options, {
      variables: variables != null ? variables : this.options.variables
    }));
    this.currentMutation.addObserver(this);
    return this.currentMutation.execute();
  };

  _proto.updateResult = function updateResult() {
    var state = this.currentMutation ? this.currentMutation.state : getDefaultState();
    this.currentResult = _extends({}, state, getStatusProps(state.status), {
      mutate: this.mutate,
      reset: this.reset
    });
  };

  _proto.notify = function notify(options) {
    var _this2 = this;

    // First trigger the mutate callbacks
    if (this.mutateOptions) {
      if (options.onSuccess) {
        var _this$mutateOptions$o, _this$mutateOptions, _this$mutateOptions$o2, _this$mutateOptions2;

        (_this$mutateOptions$o = (_this$mutateOptions = this.mutateOptions).onSuccess) == null ? void 0 : _this$mutateOptions$o.call(_this$mutateOptions, this.currentResult.data, this.currentResult.variables, this.currentResult.context);
        (_this$mutateOptions$o2 = (_this$mutateOptions2 = this.mutateOptions).onSettled) == null ? void 0 : _this$mutateOptions$o2.call(_this$mutateOptions2, this.currentResult.data, null, this.currentResult.variables, this.currentResult.context);
      } else if (options.onError) {
        var _this$mutateOptions$o3, _this$mutateOptions3, _this$mutateOptions$o4, _this$mutateOptions4;

        (_this$mutateOptions$o3 = (_this$mutateOptions3 = this.mutateOptions).onError) == null ? void 0 : _this$mutateOptions$o3.call(_this$mutateOptions3, this.currentResult.error, this.currentResult.variables, this.currentResult.context);
        (_this$mutateOptions$o4 = (_this$mutateOptions4 = this.mutateOptions).onSettled) == null ? void 0 : _this$mutateOptions$o4.call(_this$mutateOptions4, undefined, this.currentResult.error, this.currentResult.variables, this.currentResult.context);
      }
    } // Then trigger the listeners


    if (options.listeners) {
      this.listeners.forEach(function (listener) {
        listener(_this2.currentResult);
      });
    }
  };

  return MutationObserver;
}(Subscribable);

var logger$1 = console;

if (logger$1) {
  setLogger(logger$1);
}

var symbol = Symbol('QueryClientProvider');
var useQueryClient = function useQueryClient() {
  var queryClient = inject(symbol, undefined);

  if (!queryClient) {
    throw new Error('No QueryClient set, use QueryClientProvider to set one');
  }

  return queryClient;
};
var QueryClientProvider = defineComponent({
  name: 'QueryClientProvider',
  setup: function setup(props, _ref) {
    var slots = _ref.slots;
    var client = props.client;
    provide(symbol, client);
    onMounted(function () {
      client.mount();
    });
    onUnmounted(function () {
      client.unmount();
    });
    return slots["default"] == null ? void 0 : slots["default"]();
  }
});

function useIsFetching(arg1, arg2) {
  var queryClient = useQueryClient();

  var _parseFilterArgs = parseFilterArgs(arg1, arg2),
      filters = _parseFilterArgs[0];

  var isFetching = ref(queryClient.isFetching(filters));
  var unsubscribe;
  onMounted(function () {
    unsubscribe = queryClient.getQueryCache().subscribe(function () {
      var newIsFetching = queryClient.isFetching(filters);
      isFetching.value = newIsFetching;
    });
  });
  onUnmounted(function () {
    unsubscribe == null ? void 0 : unsubscribe();
  });
  return isFetching;
}

function useMutation(arg1, arg2, arg3) {
  var queryClient = useQueryClient(); // Create mutation observer

  var observer; // Create mutation currentResult

  var currentResult;
  watchEffect(function () {
    var options = parseMutationArgs(arg1, arg2, arg3);
  });
  var unsubscribe;
  onMounted(function () {
    // Subscribe to the observer
    unsubscribe = observer.subscribe(function (result) {
      // Check if the component is still mounted
      if (observer.hasListeners()) {
        Object.assign(currentResult, result);
      }
    });
  });
  onUnmounted(function () {
    unsubscribe == null ? void 0 : unsubscribe();
  });
  return readonly(currentResult);
}

function useBaseQuery(optionsFn, Observer) {
  var queryClient = useQueryClient();
  var observer;
  watchEffect(function () {
    var defaultedOptions = queryClient.defaultQueryObserverOptions(optionsFn()); // Always set stale time when using suspense to prevent
    // fetching again when directly re-mounting after suspense

    if (defaultedOptions.suspense && typeof defaultedOptions.staleTime !== 'number') {
      defaultedOptions.staleTime = 1000;
    }

    if (observer) {
      // Update options
      if (observer.hasListeners()) {
        observer.setOptions(defaultedOptions);
      }
    } else {
      // Create query observer
      observer = new Observer(queryClient, defaultedOptions);
    }
  });
  var currentResult = observer.getReadonlyResult(); // Subscribe to the observer

  var unsubscribe;
  onMounted(function () {
    unsubscribe = observer.subscribe();
  });
  onUnmounted(function () {
    unsubscribe == null ? void 0 : unsubscribe();
  }); // Handle suspense

  if (observer.options.suspense && currentResult.isLoading) {
    var _unsubscribe = observer.subscribe();

    throw observer.refetch()["finally"](_unsubscribe);
  }

  return currentResult;
}

function useQuery(arg1, arg2, arg3) {
  return useBaseQuery(function () {
    return parseQueryArgs(arg1, arg2, arg3);
  }, QueryObserver);
}

function useQueries(queries) {
  var queryClient = useQueryClient(); // Create queries observer

  var observer;
  watchEffect(function () {
    if (observer) {
      // Update queries
      if (observer.hasListeners()) {
        observer.setQueries(queries);
      }
    } else {
      observer = new QueriesObserver(queryClient, queries);
    }
  });
  var currentResult = reactive(observer.getCurrentResult());
  var unsubscribe; // Subscribe to the observer

  onMounted(function () {
    unsubscribe = observer.subscribe(function (result) {
      replaceShallowEqualDeep(currentResult, result);
    });
  });
  onUnmounted(function () {
    unsubscribe == null ? void 0 : unsubscribe();
  });
  return readonly(currentResult);
}

function useInfiniteQuery(arg1, arg2, arg3) {
  return useBaseQuery(function () {
    return parseQueryArgs(arg1, arg2, arg3);
  }, InfiniteQueryObserver);
}

export { InfiniteQueryObserver, MutationCache, MutationObserver, QueriesObserver, QueryCache, QueryClient, QueryClientProvider, QueryObserver, focusManager, hashQueryKey, isCancelledError, isError, onlineManager, setLogger, useInfiniteQuery, useIsFetching, useMutation, useQueries, useQuery, useQueryClient };
//# sourceMappingURL=vue-query.mjs.map
