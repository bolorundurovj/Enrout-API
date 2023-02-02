import{_ as n,M as t,p as r,q as o,R as e,t as s,N as l,a1 as i}from"./framework-96b046e1.js";const d={},c=i(`<h1 id="linting-formatting" tabindex="-1"><a class="header-anchor" href="#linting-formatting" aria-hidden="true">#</a> Linting &amp; formatting</h1><ul><li><a href="#languages">Languages</a></li><li><a href="#scripts">Scripts</a><ul><li><a href="#terminal">Terminal</a></li><li><a href="#pre-commit">Pre-commit</a></li><li><a href="#editor">Editor</a></li></ul></li><li><a href="#configuration">Configuration</a></li><li><a href="#faq">FAQ</a></li></ul><p>This project uses Typescript Eslint, and Prettier to catch errors and avoid bike-shedding by enforcing a common code style.</p><h2 id="languages" tabindex="-1"><a class="header-anchor" href="#languages" aria-hidden="true">#</a> Languages</h2><ul><li><strong>JavaScript</strong> is linted by Typescript Eslint and formatted by Prettier</li><li><strong>JSON</strong> is formatted by Prettier</li></ul><h2 id="scripts" tabindex="-1"><a class="header-anchor" href="#scripts" aria-hidden="true">#</a> Scripts</h2><p>There are a few different contexts in which the linters run.</p><h3 id="terminal" tabindex="-1"><a class="header-anchor" href="#terminal" aria-hidden="true">#</a> Terminal</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># Lint all files without auto-fixing</span>
<span class="token function">yarn</span> lint
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># Lint all files, fixing many violations automatically</span>
<span class="token function">yarn</span> lint:fix
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>See <code>package.json</code> to update.</p><h3 id="pre-commit" tabindex="-1"><a class="header-anchor" href="#pre-commit" aria-hidden="true">#</a> Pre-commit</h3><p>Staged files are automatically linted and tested before each commit. See <code>lint-staged.config.js</code> to update.</p><h3 id="editor" tabindex="-1"><a class="header-anchor" href="#editor" aria-hidden="true">#</a> Editor</h3><p>In supported editors, all files will be linted and show under the linter errors section.</p><h2 id="configuration" tabindex="-1"><a class="header-anchor" href="#configuration" aria-hidden="true">#</a> Configuration</h2><p>This boilerplate ships with opinionated defaults, but you can edit each tools configuration in the following config files:</p>`,17),h={href:"https://eslint.org/docs/user-guide/configuring",target:"_blank",rel:"noopener noreferrer"},u=e("ul",null,[e("li",null,[e("code",null,".eslintrc.js")]),e("li",null,[e("code",null,".eslintignore")])],-1),f=i('<h2 id="faq" tabindex="-1"><a class="header-anchor" href="#faq" aria-hidden="true">#</a> FAQ</h2><p><strong>So many configuration files! Why not move more of this to <code>package.json</code>?</strong></p><ul><li>Moving all possible configs to <code>package.json</code> can make it <em>really</em> packed, so that quickly navigating to a specific config becomes difficult.</li><li>When split out into their own file, many tools provide the option of exporting a config from JS. I do this wherever possible, because dynamic configurations are simply more powerful, able to respond to environment variables and much more.</li></ul>',3);function p(g,m){const a=t("ExternalLinkIcon");return r(),o("div",null,[c,e("ul",null,[e("li",null,[e("a",h,[s("ESLint"),l(a)]),u])]),f])}const v=n(d,[["render",p],["__file","linting.html.vue"]]);export{v as default};