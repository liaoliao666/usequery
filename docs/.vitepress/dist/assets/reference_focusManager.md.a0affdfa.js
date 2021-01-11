import{l as n,f as s,G as a}from"./framework.dc3bd9a4.js";const e='{"title":"FocusManager","description":"","frontmatter":{"id":"FocusManager","title":"FocusManager"},"headers":[{"level":2,"title":"focusManager.setEventListener","slug":"focusmanager-seteventlistener"},{"level":2,"title":"focusManager.setFocused","slug":"focusmanager-setfocused"},{"level":2,"title":"focusManager.isFocused","slug":"focusmanager-isfocused"}],"relativePath":"reference/focusManager.md","lastUpdated":1610343717763}',t={},o=a('<p>The <code>FocusManager</code> manages the focus state within Vue Query.</p><p>It can be used to change the default event listeners or to manually change the focus state.</p><p>Its available methods are:</p><ul><li><a href="#focusmanagerseteventlistener"><code>setEventListener</code></a></li><li><a href="#focusmanagersetfocused"><code>setFocused</code></a></li><li><a href="#focusmanagerisfocused"><code>isFocused</code></a></li></ul><h2 id="focusmanager-seteventlistener"><a class="header-anchor" href="#focusmanager-seteventlistener" aria-hidden="true">#</a> <code>focusManager.setEventListener</code></h2><p><code>setEventListener</code> can be used to set a custom event listener:</p><div class="language-js"><pre><code><span class="token keyword">import</span> <span class="token punctuation">{</span> focusManager <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue-query&#39;</span>\n\nfocusManager<span class="token punctuation">.</span><span class="token function">setEventListener</span><span class="token punctuation">(</span><span class="token parameter">handleFocus</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n  <span class="token comment">// Listen to visibillitychange and focus</span>\n  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> window <span class="token operator">!==</span> <span class="token string">&#39;undefined&#39;</span> <span class="token operator">&amp;&amp;</span> window<span class="token punctuation">.</span>addEventListener<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    window<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span><span class="token string">&#39;visibilitychange&#39;</span><span class="token punctuation">,</span> handleFocus<span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span>\n    window<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span><span class="token string">&#39;focus&#39;</span><span class="token punctuation">,</span> handleFocus<span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword">return</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n    <span class="token comment">// Be sure to unsubscribe if a new handler is set</span>\n    window<span class="token punctuation">.</span><span class="token function">removeEventListener</span><span class="token punctuation">(</span><span class="token string">&#39;visibilitychange&#39;</span><span class="token punctuation">,</span> handleFocus<span class="token punctuation">)</span>\n    window<span class="token punctuation">.</span><span class="token function">removeEventListener</span><span class="token punctuation">(</span><span class="token string">&#39;focus&#39;</span><span class="token punctuation">,</span> handleFocus<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre></div><h2 id="focusmanager-setfocused"><a class="header-anchor" href="#focusmanager-setfocused" aria-hidden="true">#</a> <code>focusManager.setFocused</code></h2><p><code>setFocsued</code> can be used to manually set the focus state. Set <code>undefined</code> to fallback to the default focus check.</p><div class="language-js"><pre><code><span class="token keyword">import</span> <span class="token punctuation">{</span> focusManager <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue-query&#39;</span>\n\n<span class="token comment">// Set focused</span>\nfocusManager<span class="token punctuation">.</span><span class="token function">setFocused</span><span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span>\n\n<span class="token comment">// Set unfocused</span>\nfocusManager<span class="token punctuation">.</span><span class="token function">setFocused</span><span class="token punctuation">(</span><span class="token boolean">false</span><span class="token punctuation">)</span>\n\n<span class="token comment">// Fallback to the default focus check</span>\nfocusManager<span class="token punctuation">.</span><span class="token function">setFocused</span><span class="token punctuation">(</span><span class="token keyword">undefined</span><span class="token punctuation">)</span>\n</code></pre></div><p><strong>Options</strong></p><ul><li><code>focused: boolean | undefined</code></li></ul><h2 id="focusmanager-isfocused"><a class="header-anchor" href="#focusmanager-isfocused" aria-hidden="true">#</a> <code>focusManager.isFocused</code></h2><p><code>isFocused</code> can be used to get the current focus state.</p><div class="language-js"><pre><code><span class="token keyword">const</span> isFocused <span class="token operator">=</span> focusManager<span class="token punctuation">.</span><span class="token function">isFocused</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n</code></pre></div>',15);t.render=function(a,e,t,c,p,u){return n(),s("div",null,[o])};export default t;export{e as __pageData};
