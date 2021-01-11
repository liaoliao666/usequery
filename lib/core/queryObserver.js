"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.QueryObserver = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _vue = require("vue");

var _utils = require("./utils");

var _focusManager = require("./focusManager");

var _subscribable = require("./subscribable");

var QueryObserver = /*#__PURE__*/function (_Subscribable) {
  (0, _inheritsLoose2["default"])(QueryObserver, _Subscribable);

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
    var prevOptions = (0, _extends2["default"])({}, this.options);
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
    return this.readonlyResult || (this.readonlyResult = (0, _vue.readonly)(this.currentResult));
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
      promise = promise["catch"](_utils.noop);
    }

    return promise;
  };

  _proto.updateStaleTimeout = function updateStaleTimeout() {
    var _this4 = this;

    this.clearStaleTimeout();

    if (_utils.isServer || this.currentResult.isStale || !(0, _utils.isValidTimeout)(this.options.staleTime)) {
      return;
    }

    var time = (0, _utils.timeUntilStale)(this.currentResult.dataUpdatedAt, this.options.staleTime); // The timeout is sometimes triggered 1 ms before the stale time expiration.
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

    if (_utils.isServer || this.options.enabled === false || !(0, _utils.isValidTimeout)(this.options.refetchInterval)) {
      return;
    }

    this.refetchIntervalId = setInterval(function () {
      if (_this5.options.refetchIntervalInBackground || _focusManager.focusManager.isFocused()) {
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

            data = (0, _utils.replaceEqualDeep)((_this$currentResult = this.currentResult) == null ? void 0 : _this$currentResult.data, data);
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

    var result = (0, _extends2["default"])({}, (0, _utils.getStatusProps)(status), {
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
      this.currentResult = (0, _vue.reactive)(result);
    }
  };

  _proto.updateQuery = function updateQuery() {
    var prevQuery = this.currentQuery;
    var query = this.client.getQueryCache().build(this.client, this.options);

    if (query === prevQuery) {
      return;
    }

    this.previousQueryResult = (0, _extends2["default"])({}, this.currentResult);
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
}(_subscribable.Subscribable);

exports.QueryObserver = QueryObserver;