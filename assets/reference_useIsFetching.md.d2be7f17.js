import{l as s,f as n,G as e}from"./framework.dc3bd9a4.js";const t='{"title":"useIsFetching","description":"","frontmatter":{"id":"useIsFetching","title":"useIsFetching"},"relativePath":"reference/useIsFetching.md","lastUpdated":1610593423773}',a={},o=e('<p><code>useIsFetching</code> is an optional hook that returns the <code>number</code> of the queries that your application is loading or fetching in the background (useful for app-wide loading indicators).</p><div class="language-js"><pre><code><span class="token keyword">import</span> <span class="token punctuation">{</span> useIsFetching <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vu-query&#39;</span>\n<span class="token comment">// How many queries are fetching?</span>\n<span class="token keyword">const</span> isFetching <span class="token operator">=</span> <span class="token function">useIsFetching</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n<span class="token comment">// How many queries matching the posts prefix are fetching?</span>\n<span class="token keyword">const</span> isFetchingPosts <span class="token operator">=</span> <span class="token function">useIsFetching</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token string">&#39;posts&#39;</span><span class="token punctuation">]</span><span class="token punctuation">)</span>\n</code></pre></div><p><strong>Options</strong></p><ul><li><code>queryKey?: QueryKey</code>: <a href="./../guides/query-keys.html">Query Keys</a></li><li><code>filters?: QueryFilters</code>: <a href="./../guides/query-filters.html">Query Filters</a></li></ul><p><strong>Returns</strong></p><ul><li><code>isFetching: number</code><ul><li>Will be the <code>number</code> of the queries that your application is currently loading or fetching in the background.</li></ul></li></ul>',6);a.render=function(e,t,a,i,c,p){return s(),n("div",null,[o])};export default a;export{t as __pageData};
