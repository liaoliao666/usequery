import{l as e,f as n,G as s}from"./framework.dc3bd9a4.js";const t='{"title":"TypeScript","description":"","frontmatter":{"id":"typescript","title":"TypeScript"},"headers":[{"level":2,"title":"Defining Custom Hooks","slug":"defining-custom-hooks"}],"relativePath":"typescript.md","lastUpdated":1610472514947}',a={},o=s('<p>Vue Query is now written in <strong>TypeScript</strong> to make sure the library and your projects are type-safe!</p><p>Things to keep in mind:</p><ul><li>Types currently require using TypeScript v3.8 or greater</li><li>Changes to types in this repository are considered <strong>non-breaking</strong> and are usually released as <strong>patch</strong> semver changes (otherwise every type enhancement would be a major version!).</li><li>It is <strong>highly recommended that you lock your v-use-query package version to a specific patch release and upgrade with the expectation that types may be fixed or upgraded between any release</strong></li><li>The non-type-related public API of Vue Query still follows semver very strictly.</li></ul><h2 id="defining-custom-hooks"><a class="header-anchor" href="#defining-custom-hooks" aria-hidden="true">#</a> Defining Custom Hooks</h2><p>When defining a custom hook you need to specify the result and error types, for example:</p><div class="language-js"><pre><code><span class="token keyword">function</span> <span class="token function">useGroups</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">return</span> useQuery<span class="token operator">&lt;</span>Group<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> Error<span class="token operator">&gt;</span><span class="token punctuation">(</span><span class="token string">&#39;groups&#39;</span><span class="token punctuation">,</span> fetchGroups<span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n</code></pre></div>',6);a.render=function(s,t,a,r,p,i){return e(),n("div",null,[o])};export default a;export{t as __pageData};
