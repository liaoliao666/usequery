import{l as n,f as s,G as a}from"./framework.dc3bd9a4.js";const t='{"title":"setLogger","description":"","frontmatter":{"id":"setLogger","title":"setLogger"},"headers":[{"level":2,"title":"setLogger","slug":"setlogger"}],"relativePath":"reference/setLogger.md","lastUpdated":1610343717634}',o={},e=a('<h2 id="setlogger"><a class="header-anchor" href="#setlogger" aria-hidden="true">#</a> <code>setLogger</code></h2><p><code>setLogger</code> is an optional function that allows you to replace the default <code>logger</code> used by Vue Query to log errors. By default, the <code>window.console</code> object is used. If no global <code>console</code> object is found in the environment, nothing will be logged.</p><p>Examples:</p><div class="language-js"><pre><code><span class="token keyword">import</span> <span class="token punctuation">{</span> setLogger <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue-query&#39;</span>\n<span class="token keyword">import</span> <span class="token punctuation">{</span> printLog<span class="token punctuation">,</span> printWarn<span class="token punctuation">,</span> printError <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;custom-logger&#39;</span>\n\n<span class="token comment">// Custom logger</span>\n<span class="token function">setLogger</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n  log<span class="token operator">:</span> printLog<span class="token punctuation">,</span>\n  warn<span class="token operator">:</span> printWarn<span class="token punctuation">,</span>\n  error<span class="token operator">:</span> printError<span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n<span class="token comment">// Sentry logger</span>\n<span class="token function">setLogger</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n  <span class="token function-variable function">log</span><span class="token operator">:</span> <span class="token parameter">message</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n    Sentry<span class="token punctuation">.</span><span class="token function">captureMessage</span><span class="token punctuation">(</span>message<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token function-variable function">warn</span><span class="token operator">:</span> <span class="token parameter">message</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n    Sentry<span class="token punctuation">.</span><span class="token function">captureMessage</span><span class="token punctuation">(</span>message<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token function-variable function">error</span><span class="token operator">:</span> <span class="token parameter">error</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n    Sentry<span class="token punctuation">.</span><span class="token function">captureException</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n<span class="token comment">// Winston logger</span>\n<span class="token function">setLogger</span><span class="token punctuation">(</span>winston<span class="token punctuation">.</span><span class="token function">createLogger</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n</code></pre></div><p><strong>Options</strong></p><ul><li><code>logger: Logger</code><ul><li>Must implement the <code>log</code>, <code>warn</code>, and <code>error</code> methods.</li></ul></li></ul>',6);o.render=function(a,t,o,p,c,r){return n(),s("div",null,[e])};export default o;export{t as __pageData};
