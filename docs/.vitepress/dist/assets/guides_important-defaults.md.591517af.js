import{l as e,f as t,G as o}from"./framework.dc3bd9a4.js";const a='{"title":"Important Defaults","description":"","frontmatter":{"id":"important-defaults","title":"Important Defaults"},"relativePath":"guides/important-defaults.md","lastUpdated":1610343717764}',n={},i=o("<p>Out of the box, Vue Query is configured with <strong>aggressive but sane</strong> defaults. <strong>Sometimes these defaults can catch new users off guard or make learning/debugging difficult if they are unknown by the user.</strong> Keep them in mind as you continue to learn and use Vue Query:</p><ul><li>Query instances via <code>useQuery</code> or <code>useInfiniteQuery</code> by default <strong>consider cached data as stale</strong>.</li></ul><blockquote><p>To change this behavior, you can configure your queries both globally and per-query using the <code>staleTime</code> option. Specifying a longer <code>staleTime</code> means queries will not refetch their data as often</p></blockquote><ul><li>Stale queries are refetched automatically in the background when: <ul><li>New instances of the query mount</li><li>The window is refocused</li><li>The network is reconnected.</li><li>The query is optionally configured with a refetch interval.</li></ul></li></ul><blockquote><p>To change this functionality, you can use options like <code>refetchOnMount</code>, <code>refetchOnWindowFocus</code>, <code>refetchOnReconnect</code> and <code>refetchInterval</code>.</p></blockquote><ul><li>Query results that have no more active instances of <code>useQuery</code>, <code>useInfiniteQuery</code> or query observers are labeled as &quot;inactive&quot; and remain in the cache in case they are used again at a later time.</li><li>By default, &quot;inactive&quot; queries are garbage collected after <strong>5 minutes</strong>.</li></ul><blockquote><p>To change this, you can alter the default <code>cacheTime</code> for queries to something other than <code>1000 * 60 * 5</code> milliseconds.</p></blockquote><ul><li>Queries that fail are <strong>silently retried 3 times, with exponential backoff delay</strong> before capturing and displaying an error to the UI.</li></ul><blockquote><p>To change this, you can alter the default <code>retry</code> and <code>retryDelay</code> options for queries to something other than <code>3</code> and the default exponential backoff function.</p></blockquote><ul><li>Query results by default are <strong>structurally shared to detect if data has actually changed</strong> and if not, <strong>the data reference remains unchanged</strong> to better help with value stabilization with regards to useMemo and useCallback. If this concept sounds foreign, then don&#39;t worry about it! 99.9% of the time you will not need to disable this and it makes your app more performant at zero cost to you.</li></ul><blockquote><p>Structural sharing only works with JSON-compatible values, any other value types will always be considered as changed. If you are seeing performance issues because of large responses for example, you can disable this feature with the <code>config.structuralSharing</code> flag. If you are dealing with non-JSON compatible values in your query responses and still want to detect if data has changed or not, you can define a data compare function with <code>config.isDataEqual</code>.</p></blockquote>",11);n.render=function(o,a,n,r,l,s){return e(),t("div",null,[i])};export default n;export{a as __pageData};
