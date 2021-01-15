import{l as a,f as e,G as t}from"./framework.dc3bd9a4.js";const n='{"title":"Installation","description":"","frontmatter":{"id":"installation","title":"Installation"},"headers":[{"level":3,"title":"NPM","slug":"npm"},{"level":3,"title":"CDN","slug":"cdn"}],"relativePath":"installation.md","lastUpdated":1610694116660}',s={},o=t('<p>You can install Vu Query with <a href="https://npmjs.com" target="_blank" rel="noopener noreferrer">NPM</a>, <a href="https://yarnpkg.com" target="_blank" rel="noopener noreferrer">Yarn</a>, or a good ol&#39; <code>&lt;script&gt;</code> via <a href="https://unpkg.com" target="_blank" rel="noopener noreferrer">unpkg.com</a>.</p><h3 id="npm"><a class="header-anchor" href="#npm" aria-hidden="true">#</a> NPM</h3><div class="language-bash"><pre><code>$ <span class="token function">npm</span> i vu-query\n<span class="token comment"># or</span>\n$ <span class="token function">yarn</span> <span class="token function">add</span> vu-query\n</code></pre></div><p>Vu Query is compatible with React v16.8+ and works with ReactDOM and React Native.</p><blockquote><p>Wanna give it a spin before you download? Try out the <a href="/docs/examples/simple.html">simple</a> or <a href="/docs/examples/custom-composable.html">custom-composable</a> examples!</p></blockquote><h3 id="cdn"><a class="header-anchor" href="#cdn" aria-hidden="true">#</a> CDN</h3><p>If you&#39;re not using a module bundler or package manager we also have a global (&quot;UMD&quot;) build hosted on the <a href="https://unpkg.com" target="_blank" rel="noopener noreferrer">unpkg.com</a> CDN. Simply add the following <code>&lt;script&gt;</code> tag to the bottom of your HTML file:</p><div class="language-html"><pre><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>https://unpkg.com/vu-query/dist/vu-query.production.min.js<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token script"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>\n</code></pre></div><p>Once you&#39;ve added this you will have access to the <code>window.ReactQuery</code> object and its exports.</p><blockquote><p>This installation/usage requires the <a href="https://reactjs.org/docs/cdn-links.html" target="_blank" rel="noopener noreferrer">React CDN script bundles</a> to be on the page as well.</p></blockquote>',10);s.render=function(t,n,s,r,p,l){return a(),e("div",null,[o])};export default s;export{n as __pageData};
