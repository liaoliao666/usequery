import{l as n,f as s,G as a}from"./framework.dc3bd9a4.js";const t='{"title":"Queries","description":"","frontmatter":{"id":"queries","title":"Queries"},"headers":[{"level":2,"title":"Query Basics","slug":"query-basics"}],"relativePath":"guides/queries.md","lastUpdated":1610593423769}',o={},e=a('<h2 id="query-basics"><a class="header-anchor" href="#query-basics" aria-hidden="true">#</a> Query Basics</h2><p>A query is a declarative dependency on an asynchronous source of data that is tied to a <strong>unique key</strong>. A query can be used with any Promise based method (including GET and POST methods) to fetch data from a server. If your method modifies data on the server, we recommend using <a href="https://vu-query.tanstack.com/docs/guides/mutations" target="_blank" rel="noopener noreferrer">Mutations</a> instead.</p><p>To subscribe to a query in your components or custom hooks, call the <code>useQuery</code> hook with at least:</p><ul><li>A <strong>unique key for the query</strong></li><li>An function that returns a promise that: <ul><li>Resolves the data, or</li><li>Throws an error</li></ul></li></ul><div class="language-js"><pre><code><span class="token keyword">import</span> <span class="token punctuation">{</span> useQuery <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vu-query&#39;</span>\n\n<span class="token keyword">function</span> <span class="token function">App</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> info <span class="token operator">=</span> <span class="token function">useQuery</span><span class="token punctuation">(</span><span class="token string">&#39;todos&#39;</span><span class="token punctuation">,</span> fetchTodoList<span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n</code></pre></div><p>The <strong>unique key</strong> you provide is used internally for refetching, caching, and sharing your queries throughout your application.</p><p>The query results returned by <code>useQuery</code> contains all of the information about the query that you&#39;ll need for templating and any other usage of the data:</p><div class="language-js"><pre><code><span class="token keyword">const</span> result <span class="token operator">=</span> <span class="token function">useQuery</span><span class="token punctuation">(</span><span class="token string">&#39;todos&#39;</span><span class="token punctuation">,</span> fetchTodoList<span class="token punctuation">)</span>\n</code></pre></div><p>The <code>result</code> object contains a few very important states you&#39;ll need to be aware of to be productive. A query can only be in one of the following states at any given moment:</p><ul><li><code>isLoading</code> or <code>status === &#39;loading&#39;</code> - The query has no data and is currently fetching</li><li><code>isError</code> or <code>status === &#39;error&#39;</code> - The query encountered an error</li><li><code>isSuccess</code> or <code>status === &#39;success&#39;</code> - The query was successful and data is available</li><li><code>isIdle</code> or <code>status === &#39;idle&#39;</code> - The query is currently disabled (you&#39;ll learn more about this in a bit)</li></ul><p>Beyond those primary state, more information is available depending on the state the query:</p><ul><li><code>error</code> - If the query is in an <code>isError</code> state, the error is available via the <code>error</code> property.</li><li><code>data</code> - If the query is in a <code>success</code> state, the data is available via the <code>data</code> property.</li><li><code>isFetching</code> - In any state, if the query is fetching at any time (including background refetching) <code>isFetching</code> will be <code>true</code>.</li></ul><p>For <strong>most</strong> queries, it&#39;s usually sufficient to check for the <code>isLoading</code> state, then the <code>isError</code> state, then finally, assume that the data is available and render the successful state:</p><div class="language-js"><pre><code><span class="token keyword">function</span> <span class="token function">Todos</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> <span class="token punctuation">{</span> isLoading<span class="token punctuation">,</span> isError<span class="token punctuation">,</span> data<span class="token punctuation">,</span> error <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">useQuery</span><span class="token punctuation">(</span><span class="token string">&#39;todos&#39;</span><span class="token punctuation">,</span> fetchTodoList<span class="token punctuation">)</span>\n\n  <span class="token keyword">if</span> <span class="token punctuation">(</span>isLoading<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">return</span> <span class="token operator">&lt;</span>span<span class="token operator">&gt;</span>Loading<span class="token operator">...</span><span class="token operator">&lt;</span><span class="token operator">/</span>span<span class="token operator">&gt;</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword">if</span> <span class="token punctuation">(</span>isError<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">return</span> <span class="token operator">&lt;</span>span<span class="token operator">&gt;</span>Error<span class="token operator">:</span> <span class="token punctuation">{</span>error<span class="token punctuation">.</span>message<span class="token punctuation">}</span><span class="token operator">&lt;</span><span class="token operator">/</span>span<span class="token operator">&gt;</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token comment">// We can assume by this point that `isSuccess === true`</span>\n  <span class="token keyword">return</span> <span class="token punctuation">(</span>\n    <span class="token operator">&lt;</span>ul<span class="token operator">&gt;</span>\n      <span class="token punctuation">{</span>data<span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token parameter">todo</span> <span class="token operator">=&gt;</span> <span class="token punctuation">(</span>\n        <span class="token operator">&lt;</span>li key<span class="token operator">=</span><span class="token punctuation">{</span>todo<span class="token punctuation">.</span>id<span class="token punctuation">}</span><span class="token operator">&gt;</span><span class="token punctuation">{</span>todo<span class="token punctuation">.</span>title<span class="token punctuation">}</span><span class="token operator">&lt;</span><span class="token operator">/</span>li<span class="token operator">&gt;</span>\n      <span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">}</span>\n    <span class="token operator">&lt;</span><span class="token operator">/</span>ul<span class="token operator">&gt;</span>\n  <span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n</code></pre></div><p>If booleans aren&#39;t your thing, you can always use the <code>status</code> state as well:</p><div class="language-js"><pre><code><span class="token keyword">function</span> <span class="token function">Todos</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> <span class="token punctuation">{</span> status<span class="token punctuation">,</span> data<span class="token punctuation">,</span> error <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">useQuery</span><span class="token punctuation">(</span><span class="token string">&#39;todos&#39;</span><span class="token punctuation">,</span> fetchTodoList<span class="token punctuation">)</span>\n\n  <span class="token keyword">if</span> <span class="token punctuation">(</span>status <span class="token operator">===</span> <span class="token string">&#39;loading&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">return</span> <span class="token operator">&lt;</span>span<span class="token operator">&gt;</span>Loading<span class="token operator">...</span><span class="token operator">&lt;</span><span class="token operator">/</span>span<span class="token operator">&gt;</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword">if</span> <span class="token punctuation">(</span>status <span class="token operator">===</span> <span class="token string">&#39;error&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">return</span> <span class="token operator">&lt;</span>span<span class="token operator">&gt;</span>Error<span class="token operator">:</span> <span class="token punctuation">{</span>error<span class="token punctuation">.</span>message<span class="token punctuation">}</span><span class="token operator">&lt;</span><span class="token operator">/</span>span<span class="token operator">&gt;</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token comment">// also status === &#39;success&#39;, but &quot;else&quot; logic works, too</span>\n  <span class="token keyword">return</span> <span class="token punctuation">(</span>\n    <span class="token operator">&lt;</span>ul<span class="token operator">&gt;</span>\n      <span class="token punctuation">{</span>data<span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token parameter">todo</span> <span class="token operator">=&gt;</span> <span class="token punctuation">(</span>\n        <span class="token operator">&lt;</span>li key<span class="token operator">=</span><span class="token punctuation">{</span>todo<span class="token punctuation">.</span>id<span class="token punctuation">}</span><span class="token operator">&gt;</span><span class="token punctuation">{</span>todo<span class="token punctuation">.</span>title<span class="token punctuation">}</span><span class="token operator">&lt;</span><span class="token operator">/</span>li<span class="token operator">&gt;</span>\n      <span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">}</span>\n    <span class="token operator">&lt;</span><span class="token operator">/</span>ul<span class="token operator">&gt;</span>\n  <span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n</code></pre></div>',16);o.render=function(a,t,o,p,c,r){return n(),s("div",null,[e])};export default o;export{t as __pageData};
