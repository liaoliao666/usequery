"use strict";

exports.__esModule = true;
var _exportNames = {
  QueryClientProvider: true,
  useQueryClient: true,
  useIsFetching: true,
  useMutation: true,
  useQuery: true,
  useQueries: true,
  useInfiniteQuery: true
};
exports.useInfiniteQuery = exports.useQueries = exports.useQuery = exports.useMutation = exports.useIsFetching = exports.useQueryClient = exports.QueryClientProvider = void 0;

require("./setLogger");

var _QueryClientProvider = require("./QueryClientProvider");

exports.QueryClientProvider = _QueryClientProvider.QueryClientProvider;
exports.useQueryClient = _QueryClientProvider.useQueryClient;

var _useIsFetching = require("./useIsFetching");

exports.useIsFetching = _useIsFetching.useIsFetching;

var _useMutation = require("./useMutation");

exports.useMutation = _useMutation.useMutation;

var _useQuery = require("./useQuery");

exports.useQuery = _useQuery.useQuery;

var _useQueries = require("./useQueries");

exports.useQueries = _useQueries.useQueries;

var _useInfiniteQuery = require("./useInfiniteQuery");

exports.useInfiniteQuery = _useInfiniteQuery.useInfiniteQuery;

var _types = require("./types");

Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _types[key]) return;
  exports[key] = _types[key];
});