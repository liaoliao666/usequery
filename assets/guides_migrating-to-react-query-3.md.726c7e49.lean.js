import{l as n,f as a,G as s}from"./framework.dc3bd9a4.js";const e='{"title":"Migrating to Vue Query 3","description":"","frontmatter":{"id":"migrating-to-v-use-query-3","title":"Migrating to Vue Query 3"},"headers":[{"level":2,"title":"Overview","slug":"overview"},{"level":2,"title":"Breaking Changes","slug":"breaking-changes"},{"level":3,"title":"The QueryCache has been split into a QueryClient and lower-level QueryCache and MutationCache instances.","slug":"the-querycache-has-been-split-into-a-queryclient-and-lower-level-querycache-and-mutationcache-instances"},{"level":3,"title":"ReactQueryConfigProvider and ReactQueryCacheProvider have both been replaced by QueryClientProvider","slug":"reactqueryconfigprovider-and-reactquerycacheprovider-have-both-been-replaced-by-queryclientprovider"},{"level":3,"title":"The default QueryCache is gone. For real this time!","slug":"the-default-querycache-is-gone-for-real-this-time"},{"level":3,"title":"The deprecated makeQueryCache utility has been removed.","slug":"the-deprecated-makequerycache-utility-has-been-removed"},{"level":3,"title":"QueryCache.prefetchQuery() has been moved to QueryClient.prefetchQuery()","slug":"querycache-prefetchquery-has-been-moved-to-queryclient-prefetchquery"},{"level":3,"title":"ReactQueryErrorResetBoundary and QueryCache.resetErrorBoundaries() have been replaced by QueryErrorResetBoundary and useQueryErrorResetBoundary().","slug":"reactqueryerrorresetboundary-and-querycache-reseterrorboundaries-have-been-replaced-by-queryerrorresetboundary-and-usequeryerrorresetboundary"},{"level":3,"title":"QueryCache.getQuery() has been replaced by QueryCache.find().","slug":"querycache-getquery-has-been-replaced-by-querycache-find"},{"level":3,"title":"QueryCache.getQueries() has been moved to QueryCache.findAll().","slug":"querycache-getqueries-has-been-moved-to-querycache-findall"},{"level":3,"title":"QueryCache.isFetching has been moved to QueryClient.isFetching().","slug":"querycache-isfetching-has-been-moved-to-queryclient-isfetching"},{"level":3,"title":"The useQueryCache hook has been replaced by the useQueryClient hook.","slug":"the-usequerycache-hook-has-been-replaced-by-the-usequeryclient-hook"},{"level":3,"title":"Query key parts/pieces are no longer automatically spread to the query function.","slug":"query-key-parts-pieces-are-no-longer-automatically-spread-to-the-query-function"},{"level":3,"title":"Infinite Query Page params are now passed via QueryFunctionContext.pageParam","slug":"infinite-query-page-params-are-now-passed-via-queryfunctioncontext-pageparam"},{"level":3,"title":"usePaginatedQuery() has been deprecated in favor of the keepPreviousData option","slug":"usepaginatedquery-has-been-deprecated-in-favor-of-the-keeppreviousdata-option"},{"level":3,"title":"useInfiniteQuery() is now bi-directional","slug":"useinfinitequery-is-now-bi-directional"},{"level":3,"title":"Infinite Query data now contains the array of pages and pageParams used to fetch those pages.","slug":"infinite-query-data-now-contains-the-array-of-pages-and-pageparams-used-to-fetch-those-pages"},{"level":3,"title":"useMutation now returns an object instead of an array","slug":"usemutation-now-returns-an-object-instead-of-an-array"},{"level":3,"title":"mutation.mutate no longer return a promise","slug":"mutation-mutate-no-longer-return-a-promise"},{"level":3,"title":"The object syntax for useQuery now uses a collapsed config:","slug":"the-object-syntax-for-usequery-now-uses-a-collapsed-config"},{"level":3,"title":"If set, the QueryOptions.enabled option must be a boolean (true/false)","slug":"if-set-the-queryoptions-enabled-option-must-be-a-boolean-true-false"},{"level":3,"title":"The QueryOptions.initialStale option has been removed","slug":"the-queryoptions-initialstale-option-has-been-removed"},{"level":3,"title":"The QueryOptions.forceFetchOnMount option has been replaced by refetchOnMount: \'always\'","slug":"the-queryoptions-forcefetchonmount-option-has-been-replaced-by-refetchonmount-always"},{"level":3,"title":"The QueryOptions.refetchOnMount options now only applies to its parent component instead of all query observers","slug":"the-queryoptions-refetchonmount-options-now-only-applies-to-its-parent-component-instead-of-all-query-observers"},{"level":3,"title":"The QueryOptions.queryFnParamsFilter has been removed in favor of the new QueryFunctionContext object.","slug":"the-queryoptions-queryfnparamsfilter-has-been-removed-in-favor-of-the-new-queryfunctioncontext-object"},{"level":3,"title":"The QueryOptions.notifyOnStatusChange option has been superceded by the new notifyonChangeProps and notifyOnChangePropsExclusions options.","slug":"the-queryoptions-notifyonstatuschange-option-has-been-superceded-by-the-new-notifyonchangeprops-and-notifyonchangepropsexclusions-options"},{"level":3,"title":"The QueryResult.clear() function has been renamed to QueryResult.remove()","slug":"the-queryresult-clear-function-has-been-renamed-to-queryresult-remove"},{"level":3,"title":"The QueryResult.updatedAt property has been split into QueryResult.dataUpdatedAt and QueryResult.errorUpdatedAt properties","slug":"the-queryresult-updatedat-property-has-been-split-into-queryresult-dataupdatedat-and-queryresult-errorupdatedat-properties"},{"level":3,"title":"setConsole() has been replaced by the new setLogger() function","slug":"setconsole-has-been-replaced-by-the-new-setlogger-function"},{"level":3,"title":"Vue Native no longer requires overriding the logger","slug":"vue-native-no-longer-requires-overriding-the-logger"},{"level":2,"title":"New features","slug":"new-features"},{"level":3,"title":"Devtools are now part of the main repo and npm package","slug":"devtools-are-now-part-of-the-main-repo-and-npm-package"}],"relativePath":"guides/migrating-to-react-query-3.md","lastUpdated":1610472514943}',t={},o=s('',133);t.render=function(s,e,t,p,c,u){return n(),a("div",null,[o])};export default t;export{e as __pageData};
