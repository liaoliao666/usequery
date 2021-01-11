import _inheritsLoose from "@babel/runtime/helpers/esm/inheritsLoose";
import { Mutation } from './mutation';
import { noop } from './utils';
import { Subscribable } from './subscribable'; // TYPES

// CLASS
export var MutationCache = /*#__PURE__*/function (_Subscribable) {
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