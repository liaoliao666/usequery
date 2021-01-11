import{l as n,f as s,G as a}from"./framework.dc3bd9a4.js";const t='{"title":"Mutations","description":"","frontmatter":{"id":"mutations","title":"Mutations"},"headers":[{"level":2,"title":"Resetting Mutation State","slug":"resetting-mutation-state"},{"level":2,"title":"Mutation Side Effects","slug":"mutation-side-effects"},{"level":2,"title":"Promises","slug":"promises"},{"level":2,"title":"Retry","slug":"retry"},{"level":2,"title":"Persist mutations","slug":"persist-mutations"}],"relativePath":"guides/mutations.md","lastUpdated":1610343717763}',o={},p=a('<p>Unlike queries, mutations are typically used to create/update/delete data or perform server side-effects. For this purpose, Vue Query exports a <code>useMutation</code> hook.</p><p>Here&#39;s an example of a mutation that adds a new todo the server:</p><div class="language-js"><pre><code><span class="token keyword">function</span> <span class="token function">App</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> mutation <span class="token operator">=</span> <span class="token function">useMutation</span><span class="token punctuation">(</span><span class="token parameter">newTodo</span> <span class="token operator">=&gt;</span> axios<span class="token punctuation">.</span><span class="token function">post</span><span class="token punctuation">(</span><span class="token string">&#39;/todos&#39;</span><span class="token punctuation">,</span> newTodo<span class="token punctuation">)</span><span class="token punctuation">)</span>\n\n  <span class="token keyword">return</span> <span class="token punctuation">(</span>\n    <span class="token operator">&lt;</span>div<span class="token operator">&gt;</span>\n      <span class="token punctuation">{</span>mutation<span class="token punctuation">.</span>isLoading <span class="token operator">?</span> <span class="token punctuation">(</span>\n        <span class="token string">&#39;Adding todo...&#39;</span>\n      <span class="token punctuation">)</span> <span class="token operator">:</span> <span class="token punctuation">(</span>\n        <span class="token operator">&lt;</span><span class="token operator">&gt;</span>\n          <span class="token punctuation">{</span>mutation<span class="token punctuation">.</span>isError <span class="token operator">?</span> <span class="token punctuation">(</span>\n            <span class="token operator">&lt;</span>div<span class="token operator">&gt;</span>An error occurred<span class="token operator">:</span> <span class="token punctuation">{</span>mutation<span class="token punctuation">.</span>error<span class="token punctuation">.</span>message<span class="token punctuation">}</span><span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>\n          <span class="token punctuation">)</span> <span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">}</span>\n\n          <span class="token punctuation">{</span>mutation<span class="token punctuation">.</span>isSuccess <span class="token operator">?</span> <span class="token operator">&lt;</span>div<span class="token operator">&gt;</span>Todo added<span class="token operator">!</span><span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span> <span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">}</span>\n\n          <span class="token operator">&lt;</span>button\n            onClick<span class="token operator">=</span><span class="token punctuation">{</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n              mutation<span class="token punctuation">.</span><span class="token function">mutate</span><span class="token punctuation">(</span><span class="token punctuation">{</span> id<span class="token operator">:</span> <span class="token keyword">new</span> <span class="token class-name">Date</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> title<span class="token operator">:</span> <span class="token string">&#39;Do Laundry&#39;</span> <span class="token punctuation">}</span><span class="token punctuation">)</span>\n            <span class="token punctuation">}</span><span class="token punctuation">}</span>\n          <span class="token operator">&gt;</span>\n            Create Todo\n          <span class="token operator">&lt;</span><span class="token operator">/</span>button<span class="token operator">&gt;</span>\n        <span class="token operator">&lt;</span><span class="token operator">/</span><span class="token operator">&gt;</span>\n      <span class="token punctuation">)</span><span class="token punctuation">}</span>\n    <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>\n  <span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n</code></pre></div><p>A mutation can only be in one of the following states at any given moment:</p><ul><li><code>isIdle</code> or <code>status === &#39;idle&#39;</code> - The mutation is currently idle or in a fresh/reset state</li><li><code>isLoading</code> or <code>status === &#39;loading&#39;</code> - The mutation is currently running</li><li><code>isError</code> or <code>status === &#39;error&#39;</code> - The mutation encountered an error</li><li><code>isSuccess</code> or <code>status === &#39;success&#39;</code> - The mutation was successful and mutation data is available</li></ul><p>Beyond those primary state, more information is available depending on the state the mutation:</p><ul><li><code>error</code> - If the mutation is in an <code>isError</code> state, the error is available via the <code>error</code> property.</li><li><code>data</code> - If the mutation is in a <code>success</code> state, the data is available via the <code>data</code> property.</li></ul><p>In the example above, you also saw that you can pass variables to your mutations function by calling the <code>mutate</code> function with a <strong>single variable or object</strong>.</p><p>Even with just variables, mutations aren&#39;t all that special, but when used with the <code>onSuccess</code> option, the <a href="./../reference/QueryClient.html#queryclientinvalidatequeries">Query Client&#39;s <code>invalidateQueries</code> method</a> and the <a href="./../reference/QueryClient.html#queryclientsetquerydata">Query Client&#39;s <code>setQueryData</code> method</a>, mutations become a very powerful tool.</p><blockquote><p>IMPORTANT: The <code>mutate</code> function is an asynchronous function, which means you cannot use it directly in an event callback. If you need to access the event in <code>onSubmit</code> you need to wrap <code>mutate</code> in another function. This is due to <a href="https://reactjs.org/docs/events.html#event-pooling" target="_blank" rel="noopener noreferrer">Vue event pooling</a>.</p></blockquote><div class="language-js"><pre><code><span class="token comment">// This will not work</span>\n<span class="token keyword">const</span> <span class="token function-variable function">CreateTodo</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> mutation <span class="token operator">=</span> <span class="token function">useMutation</span><span class="token punctuation">(</span><span class="token parameter">event</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n    event<span class="token punctuation">.</span><span class="token function">preventDefault</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token keyword">return</span> <span class="token function">fetch</span><span class="token punctuation">(</span><span class="token string">&#39;/api&#39;</span><span class="token punctuation">,</span> <span class="token keyword">new</span> <span class="token class-name">FormData</span><span class="token punctuation">(</span>event<span class="token punctuation">.</span>target<span class="token punctuation">)</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n  <span class="token keyword">return</span> <span class="token operator">&lt;</span>form onSubmit<span class="token operator">=</span><span class="token punctuation">{</span>mutation<span class="token punctuation">.</span>mutate<span class="token punctuation">}</span><span class="token operator">&gt;</span><span class="token operator">...</span><span class="token operator">&lt;</span><span class="token operator">/</span>form<span class="token operator">&gt;</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">// This will work</span>\n<span class="token keyword">const</span> <span class="token function-variable function">CreateTodo</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> mutation <span class="token operator">=</span> <span class="token function">useMutation</span><span class="token punctuation">(</span><span class="token parameter">formData</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n    <span class="token keyword">return</span> <span class="token function">fetch</span><span class="token punctuation">(</span><span class="token string">&#39;/api&#39;</span><span class="token punctuation">,</span> formData<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span>\n  <span class="token keyword">const</span> <span class="token function-variable function">onSubmit</span> <span class="token operator">=</span> <span class="token parameter">event</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n    event<span class="token punctuation">.</span><span class="token function">preventDefault</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    mutation<span class="token punctuation">.</span><span class="token function">mutate</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">FormData</span><span class="token punctuation">(</span>event<span class="token punctuation">.</span>target<span class="token punctuation">)</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword">return</span> <span class="token operator">&lt;</span>form onSubmit<span class="token operator">=</span><span class="token punctuation">{</span>onSubmit<span class="token punctuation">}</span><span class="token operator">&gt;</span><span class="token operator">...</span><span class="token operator">&lt;</span><span class="token operator">/</span>form<span class="token operator">&gt;</span>\n<span class="token punctuation">}</span>\n</code></pre></div><h2 id="resetting-mutation-state"><a class="header-anchor" href="#resetting-mutation-state" aria-hidden="true">#</a> Resetting Mutation State</h2><p>It&#39;s sometimes the case that you need to clear the <code>error</code> or <code>data</code> of a mutation request. To do this, you can use the <code>reset</code> function to handle this:</p><div class="language-js"><pre><code><span class="token keyword">const</span> <span class="token function-variable function">CreateTodo</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> <span class="token punctuation">[</span>title<span class="token punctuation">,</span> setTitle<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token function">useState</span><span class="token punctuation">(</span><span class="token string">&#39;&#39;</span><span class="token punctuation">)</span>\n  <span class="token keyword">const</span> mutation <span class="token operator">=</span> <span class="token function">useMutation</span><span class="token punctuation">(</span>createTodo<span class="token punctuation">)</span>\n\n  <span class="token keyword">const</span> <span class="token function-variable function">onCreateTodo</span> <span class="token operator">=</span> <span class="token parameter">e</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n    e<span class="token punctuation">.</span><span class="token function">preventDefault</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    mutation<span class="token punctuation">.</span><span class="token function">mutate</span><span class="token punctuation">(</span><span class="token punctuation">{</span> title <span class="token punctuation">}</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword">return</span> <span class="token punctuation">(</span>\n    <span class="token operator">&lt;</span>form onSubmit<span class="token operator">=</span><span class="token punctuation">{</span>onCreateTodo<span class="token punctuation">}</span><span class="token operator">&gt;</span>\n      <span class="token punctuation">{</span>mutation<span class="token punctuation">.</span>error <span class="token operator">&amp;&amp;</span> <span class="token punctuation">(</span>\n        <span class="token operator">&lt;</span>h5 onClick<span class="token operator">=</span><span class="token punctuation">{</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> mutation<span class="token punctuation">.</span><span class="token function">reset</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">}</span><span class="token operator">&gt;</span><span class="token punctuation">{</span>mutation<span class="token punctuation">.</span>error<span class="token punctuation">}</span><span class="token operator">&lt;</span><span class="token operator">/</span>h5<span class="token operator">&gt;</span>\n      <span class="token punctuation">)</span><span class="token punctuation">}</span>\n      <span class="token operator">&lt;</span>input\n        type<span class="token operator">=</span><span class="token string">&quot;text&quot;</span>\n        value<span class="token operator">=</span><span class="token punctuation">{</span>title<span class="token punctuation">}</span>\n        onChange<span class="token operator">=</span><span class="token punctuation">{</span><span class="token parameter">e</span> <span class="token operator">=&gt;</span> <span class="token function">setTitle</span><span class="token punctuation">(</span>e<span class="token punctuation">.</span>target<span class="token punctuation">.</span>value<span class="token punctuation">)</span><span class="token punctuation">}</span>\n      <span class="token operator">/</span><span class="token operator">&gt;</span>\n      <span class="token operator">&lt;</span>br <span class="token operator">/</span><span class="token operator">&gt;</span>\n      <span class="token operator">&lt;</span>button type<span class="token operator">=</span><span class="token string">&quot;submit&quot;</span><span class="token operator">&gt;</span>Create Todo<span class="token operator">&lt;</span><span class="token operator">/</span>button<span class="token operator">&gt;</span>\n    <span class="token operator">&lt;</span><span class="token operator">/</span>form<span class="token operator">&gt;</span>\n  <span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n</code></pre></div><h2 id="mutation-side-effects"><a class="header-anchor" href="#mutation-side-effects" aria-hidden="true">#</a> Mutation Side Effects</h2><p><code>useMutation</code> comes with some helper options that allow quick and easy side-effects at any stage during the mutation lifecycle. These come in handy for both <a href="./invalidations-from-mutations.html">invalidating and refetching queries after mutations</a> and even <a href="./optimistic-updates.html">optimistic updates</a></p><div class="language-js"><pre><code><span class="token function">useMutation</span><span class="token punctuation">(</span>addTodo<span class="token punctuation">,</span> <span class="token punctuation">{</span>\n  <span class="token function-variable function">onMutate</span><span class="token operator">:</span> <span class="token parameter">variables</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n    <span class="token comment">// A mutation is about to happen!</span>\n\n    <span class="token comment">// Optionally return a context containing data to use when for example rolling back</span>\n    <span class="token keyword">return</span> <span class="token punctuation">{</span> id<span class="token operator">:</span> <span class="token number">1</span> <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token function-variable function">onError</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token parameter">error<span class="token punctuation">,</span> variables<span class="token punctuation">,</span> context</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n    <span class="token comment">// An error happened!</span>\n    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">rolling back optimistic update with id </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>context<span class="token punctuation">.</span>id<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token function-variable function">onSuccess</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token parameter">data<span class="token punctuation">,</span> variables<span class="token punctuation">,</span> context</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n    <span class="token comment">// Boom baby!</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token function-variable function">onSettled</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token parameter">data<span class="token punctuation">,</span> error<span class="token punctuation">,</span> variables<span class="token punctuation">,</span> context</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n    <span class="token comment">// Error or success... doesn&#39;t matter!</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre></div><p>When returning a promise in any of the callback functions it will first be awaited before the next callback is called:</p><div class="language-js"><pre><code><span class="token function">useMutation</span><span class="token punctuation">(</span>addTodo<span class="token punctuation">,</span> <span class="token punctuation">{</span>\n  <span class="token function-variable function">onSuccess</span><span class="token operator">:</span> <span class="token keyword">async</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;I&#39;m first!&quot;</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token function-variable function">onSettled</span><span class="token operator">:</span> <span class="token keyword">async</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;I&#39;m second!&quot;</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre></div><p>You might find that you want to <strong>trigger additional callbacks</strong> then the ones defined on <code>useMutation</code> when calling <code>mutate</code>. This can be used to trigger component specific side effects. To do that, you can provide any of the same callback options to the <code>mutate</code> function after your mutation variable. Supported overrides include: <code>onSuccess</code>, <code>onError</code> and <code>onSettled</code>.</p><div class="language-js"><pre><code><span class="token function">useMutation</span><span class="token punctuation">(</span>addTodo<span class="token punctuation">,</span> <span class="token punctuation">{</span>\n  <span class="token function-variable function">onSuccess</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token parameter">data<span class="token punctuation">,</span> variables<span class="token punctuation">,</span> context</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n    <span class="token comment">// I will fire first</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token function-variable function">onError</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token parameter">error<span class="token punctuation">,</span> variables<span class="token punctuation">,</span> context</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n    <span class="token comment">// I will fire first</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token function-variable function">onSettled</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token parameter">data<span class="token punctuation">,</span> error<span class="token punctuation">,</span> variables<span class="token punctuation">,</span> context</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n    <span class="token comment">// I will fire first</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n<span class="token function">mutate</span><span class="token punctuation">(</span>todo<span class="token punctuation">,</span> <span class="token punctuation">{</span>\n  <span class="token function-variable function">onSuccess</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token parameter">data<span class="token punctuation">,</span> variables<span class="token punctuation">,</span> context</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n    <span class="token comment">// I will fire second!</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token function-variable function">onError</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token parameter">error<span class="token punctuation">,</span> variables<span class="token punctuation">,</span> context</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n    <span class="token comment">// I will fire second!</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token function-variable function">onSettled</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token parameter">data<span class="token punctuation">,</span> error<span class="token punctuation">,</span> variables<span class="token punctuation">,</span> context</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n    <span class="token comment">// I will fire second!</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre></div><h2 id="promises"><a class="header-anchor" href="#promises" aria-hidden="true">#</a> Promises</h2><p>Use <code>mutateAsync</code> instead of <code>mutate</code> to get a promise which will resolve on success or throw on an error. This can for example be used to compose side effects.</p><div class="language-js"><pre><code><span class="token keyword">const</span> mutation <span class="token operator">=</span> <span class="token function">useMutation</span><span class="token punctuation">(</span>addTodo<span class="token punctuation">)</span>\n\n<span class="token keyword">try</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> todo <span class="token operator">=</span> <span class="token keyword">await</span> mutation<span class="token punctuation">.</span><span class="token function">mutateAsync</span><span class="token punctuation">(</span>todo<span class="token punctuation">)</span>\n  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>todo<span class="token punctuation">)</span>\n<span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span>error<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  console<span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span>\n<span class="token punctuation">}</span> <span class="token keyword">finally</span> <span class="token punctuation">{</span>\n  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;done&#39;</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n</code></pre></div><h2 id="retry"><a class="header-anchor" href="#retry" aria-hidden="true">#</a> Retry</h2><p>By default Vue Query will not retry a mutation on error, but it is possible with the <code>retry</code> option:</p><div class="language-js"><pre><code><span class="token keyword">const</span> mutation <span class="token operator">=</span> <span class="token function">useMutation</span><span class="token punctuation">(</span>addTodo<span class="token punctuation">,</span> <span class="token punctuation">{</span>\n  retry<span class="token operator">:</span> <span class="token number">3</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre></div><p>If mutations fail because the device is offline, they will be retried in the same order when the device reconnects.</p><h2 id="persist-mutations"><a class="header-anchor" href="#persist-mutations" aria-hidden="true">#</a> Persist mutations</h2><p>Mutations can be persisted to storage if needed and resumed at a later point. This can be done with the hydration functions:</p><div class="language-js"><pre><code><span class="token keyword">const</span> queryClient <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">QueryClient</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n\n<span class="token comment">// Define the &quot;addTodo&quot; mutation</span>\nqueryClient<span class="token punctuation">.</span><span class="token function">setMutationDefaults</span><span class="token punctuation">(</span><span class="token string">&#39;addTodo&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>\n  mutationFn<span class="token operator">:</span> addTodo<span class="token punctuation">,</span>\n  <span class="token function-variable function">onMutate</span><span class="token operator">:</span> <span class="token parameter">variables</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n    <span class="token comment">// Cancel current queries for the todos list</span>\n    <span class="token keyword">await</span> queryClient<span class="token punctuation">.</span><span class="token function">cancelQueries</span><span class="token punctuation">(</span><span class="token string">&#39;todos&#39;</span><span class="token punctuation">)</span>\n\n    <span class="token comment">// Create optimistic todo</span>\n    <span class="token keyword">const</span> optimisticTodo <span class="token operator">=</span> <span class="token punctuation">{</span> id<span class="token operator">:</span> <span class="token function">uuid</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> title<span class="token operator">:</span> variables<span class="token punctuation">.</span>title <span class="token punctuation">}</span>\n\n    <span class="token comment">// Add optimistic todo to todos list</span>\n    queryClient<span class="token punctuation">.</span><span class="token function">setQueryData</span><span class="token punctuation">(</span><span class="token string">&#39;todos&#39;</span><span class="token punctuation">,</span> <span class="token parameter">old</span> <span class="token operator">=&gt;</span> <span class="token punctuation">[</span><span class="token operator">...</span>old<span class="token punctuation">,</span> optimisticTodo<span class="token punctuation">]</span><span class="token punctuation">)</span>\n\n    <span class="token comment">// Return context with the optimistic todo</span>\n    <span class="token keyword">return</span> <span class="token punctuation">{</span> optimisticTodo <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token function-variable function">onSuccess</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token parameter">result<span class="token punctuation">,</span> variables<span class="token punctuation">,</span> context</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n    <span class="token comment">// Replace optimistic todo in the todos list with the result</span>\n    queryClient<span class="token punctuation">.</span><span class="token function">setQueryData</span><span class="token punctuation">(</span><span class="token string">&#39;todos&#39;</span><span class="token punctuation">,</span> <span class="token parameter">old</span> <span class="token operator">=&gt;</span> old<span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token parameter">todo</span> <span class="token operator">=&gt;</span> todo<span class="token punctuation">.</span>id <span class="token operator">===</span> context<span class="token punctuation">.</span>optimisticTodo<span class="token punctuation">.</span>id <span class="token operator">?</span> result <span class="token operator">:</span> todo<span class="token punctuation">)</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token function-variable function">onError</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token parameter">error<span class="token punctuation">,</span> variables<span class="token punctuation">,</span> context</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n    <span class="token comment">// Remove optimistic todo from the todos list</span>\n    queryClient<span class="token punctuation">.</span><span class="token function">setQueryData</span><span class="token punctuation">(</span><span class="token string">&#39;todos&#39;</span><span class="token punctuation">,</span> <span class="token parameter">old</span> <span class="token operator">=&gt;</span> old<span class="token punctuation">.</span><span class="token function">filter</span><span class="token punctuation">(</span><span class="token parameter">todo</span> <span class="token operator">=&gt;</span> todo<span class="token punctuation">.</span>id <span class="token operator">!==</span> context<span class="token punctuation">.</span>optimisticTodo<span class="token punctuation">.</span>id<span class="token punctuation">)</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  retry<span class="token operator">:</span> <span class="token number">3</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n<span class="token comment">// Start mutation in some component:</span>\n<span class="token keyword">const</span> mutation <span class="token operator">=</span> <span class="token function">useMutation</span><span class="token punctuation">(</span><span class="token string">&#39;addTodo&#39;</span><span class="token punctuation">)</span>\nmutation<span class="token punctuation">.</span><span class="token function">mutate</span><span class="token punctuation">(</span><span class="token punctuation">{</span> title<span class="token operator">:</span> <span class="token string">&#39;title&#39;</span> <span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n<span class="token comment">// If the mutation has been paused because the device is for example offline,</span>\n<span class="token comment">// Then the paused mutation can be dehydrated when the application quits:</span>\n<span class="token keyword">const</span> state <span class="token operator">=</span> <span class="token function">dehydrate</span><span class="token punctuation">(</span>queryClient<span class="token punctuation">)</span>\n\n<span class="token comment">// The mutation can then be hydrated again when the application is started:</span>\n<span class="token function">hydrate</span><span class="token punctuation">(</span>queryClient<span class="token punctuation">,</span> state<span class="token punctuation">)</span>\n\n<span class="token comment">// Resume the paused mutations:</span>\nqueryClient<span class="token punctuation">.</span><span class="token function">resumePausedMutations</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n</code></pre></div>',31);o.render=function(a,t,o,e,c,u){return n(),s("div",null,[p])};export default o;export{t as __pageData};
