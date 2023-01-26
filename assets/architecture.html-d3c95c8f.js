import{_ as d,M as t,p as n,q as c,R as e,t as a,N as o,V as l,a1 as s}from"./framework-96b046e1.js";const h={},p=s('<h1 id="architecture" tabindex="-1"><a class="header-anchor" href="#architecture" aria-hidden="true">#</a> Architecture</h1><ul><li><a href="#architecture">Architecture</a><ul><li><a href="#githubworkflows"><code>.github/workflows</code></a><ul><li><a href="#lintyml"><code>lint.yml</code></a></li></ul></li><li><a href="#husky"><code>.husky</code></a></li><li><a href="#vscode"><code>.vscode</code></a></li><li><a href="#docs"><code>docs</code></a></li><li><a href="#vuepress"><code>.vuepress</code></a></li><li><a href="#src"><code>src</code></a><ul><li><a href="#common"><code>common</code></a></li><li><a href="#database"><code>database</code></a><ul><li><a href="#migrations"><code>migrations</code></a></li><li><a href="#factories"><code>factories</code></a></li><li><a href="#seeds"><code>seeds</code></a></li></ul></li><li><a href="#decorators"><code>decorators</code></a></li><li><a href="#filters"><code>filters</code></a></li><li><a href="#guards"><code>guards</code></a></li><li><a href="#i18n"><code>i18n</code></a></li><li><a href="#interceptors"><code>interceptors</code></a></li><li><a href="#interfaces"><code>interfaces</code></a></li><li><a href="#providers"><code>providers</code></a></li><li><a href="#shared"><code>shared</code></a></li><li><a href="#modules"><code>modules</code></a></li><li><a href="#appmodulets"><code>app.module.ts</code></a></li><li><a href="#boilerplatepolyfillts"><code>boilerplate.polyfill.ts</code></a></li><li><a href="#snake-namingstrategyts"><code>snake-naming.strategy.ts</code></a></li></ul></li><li><a href="#tests"><code>tests</code></a></li><li><a href="#dockerignore"><code>.dockerignore</code></a></li><li><a href="#env"><code>.env</code></a></li><li><a href="#eslintrcjs"><code>.eslintrc.js</code></a></li><li><a href="#docker-composeyml"><code>docker-compose.yml</code></a></li><li><a href="#dockerfile"><code>Dockerfile</code></a></li><li><a href="#ormconfigts"><code>ormconfig.ts</code></a></li></ul></li></ul><h2 id="github-workflows" tabindex="-1"><a class="header-anchor" href="#github-workflows" aria-hidden="true">#</a> <code>.github/workflows</code></h2><p>Here you can create and store yml files for each github action.</p><h3 id="lint-yml" tabindex="-1"><a class="header-anchor" href="#lint-yml" aria-hidden="true">#</a> <code>lint.yml</code></h3><p>Github action to run and show linter errors on each Pull request, by default it scans every pull request and push to main, develop or master branches.</p><h2 id="husky" tabindex="-1"><a class="header-anchor" href="#husky" aria-hidden="true">#</a> <code>.husky</code></h2><p>Folder which stores github hooks, by default it contains pre-commit hook which prevents push without fixing linter errors.</p><h2 id="vscode" tabindex="-1"><a class="header-anchor" href="#vscode" aria-hidden="true">#</a> <code>.vscode</code></h2>',9),u=e("h2",{id:"docs",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#docs","aria-hidden":"true"},"#"),a(),e("code",null,"docs")],-1),f=e("p",null,"You found me! 😉",-1),m=e("h2",{id:"vuepress",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#vuepress","aria-hidden":"true"},"#"),a(),e("code",null,".vuepress")],-1),b={href:"https://vuepress.vuejs.org",target:"_blank",rel:"noopener noreferrer"},g=s('<h2 id="src" tabindex="-1"><a class="header-anchor" href="#src" aria-hidden="true">#</a> <code>src</code></h2><p>Where we keep all our source files.</p><h3 id="common" tabindex="-1"><a class="header-anchor" href="#common" aria-hidden="true">#</a> <code>common</code></h3><p>Where we keep common typescript files, e.g. constants and DTOs.</p><h3 id="database" tabindex="-1"><a class="header-anchor" href="#database" aria-hidden="true">#</a> <code>database</code></h3><p>Folder to store files which are connected only to database.</p><h4 id="migrations" tabindex="-1"><a class="header-anchor" href="#migrations" aria-hidden="true">#</a> <code>migrations</code></h4><p>Folder to store application migrations which will be generated by typeorm.</p><h4 id="factories" tabindex="-1"><a class="header-anchor" href="#factories" aria-hidden="true">#</a> <code>factories</code></h4><p>Factories are used to create entities which will be used in seeds.</p><h4 id="seeds" tabindex="-1"><a class="header-anchor" href="#seeds" aria-hidden="true">#</a> <code>seeds</code></h4><p>Folder to store application seeds, it adds necessary data for the development.</p><h3 id="decorators" tabindex="-1"><a class="header-anchor" href="#decorators" aria-hidden="true">#</a> <code>decorators</code></h3>',13),k={href:"https://www.typescriptlang.org/docs/handbook/decorators.html",target:"_blank",rel:"noopener noreferrer"},_=e("h3",{id:"filters",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#filters","aria-hidden":"true"},"#"),a(),e("code",null,"filters")],-1),y={href:"https://docs.nestjs.com/exception-filters",target:"_blank",rel:"noopener noreferrer"},v=s('<h3 id="guards" tabindex="-1"><a class="header-anchor" href="#guards" aria-hidden="true">#</a> <code>guards</code></h3><p>You can store all guards here.</p><h3 id="i18n" tabindex="-1"><a class="header-anchor" href="#i18n" aria-hidden="true">#</a> <code>i18n</code></h3><p>Internalization JSON files are storied here.</p><h3 id="interceptors" tabindex="-1"><a class="header-anchor" href="#interceptors" aria-hidden="true">#</a> <code>interceptors</code></h3>',5),w={href:"https://docs.nestjs.com/interceptors",target:"_blank",rel:"noopener noreferrer"},x=e("h3",{id:"interfaces",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#interfaces","aria-hidden":"true"},"#"),a(),e("code",null,"interfaces")],-1),S={href:"https://www.typescriptlang.org/docs/handbook/interfaces.html",target:"_blank",rel:"noopener noreferrer"},j=s('<h3 id="providers" tabindex="-1"><a class="header-anchor" href="#providers" aria-hidden="true">#</a> <code>providers</code></h3><p>These are utility functions you may want to share between many files in your application. They will always be pure and never have side effects, meaning if you provide a function the same arguments, it will always return the same result.</p><h3 id="shared" tabindex="-1"><a class="header-anchor" href="#shared" aria-hidden="true">#</a> <code>shared</code></h3><p>Shared module with global singleton services.</p><h3 id="modules" tabindex="-1"><a class="header-anchor" href="#modules" aria-hidden="true">#</a> <code>modules</code></h3>',5),D={href:"https://docs.nestjs.com/modules",target:"_blank",rel:"noopener noreferrer"},N=s(`<h3 id="app-module-ts" tabindex="-1"><a class="header-anchor" href="#app-module-ts" aria-hidden="true">#</a> <code>app.module.ts</code></h3><p>The root application module.</p><h3 id="boilerplate-polyfill-ts" tabindex="-1"><a class="header-anchor" href="#boilerplate-polyfill-ts" aria-hidden="true">#</a> <code>boilerplate.polyfill.ts</code></h3><p>We extend built in classes so you can use helper function anywhere.</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">const</span> users<span class="token operator">:</span> UserEntity<span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token operator">...</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> userDtos <span class="token operator">=</span> users<span class="token punctuation">.</span><span class="token function">toDtos</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="snake-naming-strategy-ts" tabindex="-1"><a class="header-anchor" href="#snake-naming-strategy-ts" aria-hidden="true">#</a> <code>snake-naming.strategy.ts</code></h3><p>We are using snake naming strategy for typeorm, so when you will generate migration it automatically will set snake_case column name from entity fields.</p><h2 id="tests" tabindex="-1"><a class="header-anchor" href="#tests" aria-hidden="true">#</a> <code>tests</code></h2><p>Folder where we keep all our e2e test files.</p><h2 id="dockerignore" tabindex="-1"><a class="header-anchor" href="#dockerignore" aria-hidden="true">#</a> <code>.dockerignore</code></h2><p>List a files which will be ignored during the docker build.</p><h2 id="env" tabindex="-1"><a class="header-anchor" href="#env" aria-hidden="true">#</a> <code>.env</code></h2><p>Environment variables which will load before app start and will be stored in <code>p<wbr>rocess.env</code>, (*) is a env name (development, test, staging, production)</p><h2 id="eslintrc-js" tabindex="-1"><a class="header-anchor" href="#eslintrc-js" aria-hidden="true">#</a> <code>.eslintrc.js</code></h2>`,14),T={href:"https://eslint.org/",target:"_blank",rel:"noopener noreferrer"},V=e("h2",{id:"docker-compose-yml",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#docker-compose-yml","aria-hidden":"true"},"#"),a(),e("code",null,"docker-compose.yml")],-1),E={href:"https://docs.docker.com/compose/compose-file/",target:"_blank",rel:"noopener noreferrer"},F=e("h2",{id:"dockerfile",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#dockerfile","aria-hidden":"true"},"#"),a(),e("code",null,"Dockerfile")],-1),W={href:"https://docs.docker.com/engine/reference/builder/",target:"_blank",rel:"noopener noreferrer"},L=e("h2",{id:"ormconfig-ts",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#ormconfig-ts","aria-hidden":"true"},"#"),a(),e("code",null,"ormconfig.ts")],-1),I=e("p",null,"Typeorm configuration file which is used for migrations and seeds.",-1);function q(B,C){const i=t("RouterLink"),r=t("ExternalLinkIcon");return n(),c("div",null,[p,e("p",null,[a("Settings and extensions specific to this project, for Visual Studio Code. See "),o(i,{to:"/docs/editors.html#visual-studio-code"},{default:l(()=>[a("the editors doc")]),_:1}),a(" for more.")]),u,f,m,e("p",null,[a("Documentation config and destination folder See "),e("a",b,[a("VuePress doc"),o(r)]),a(" for more")]),g,e("p",null,[a("This folder contains all global "),e("a",k,[a("decorators"),o(r)]),a(".")]),_,e("p",null,[a("In this folder you can find app level "),e("a",y,[a("filters"),o(r)]),a(".")]),v,e("p",null,[a("Where we are keep "),e("a",w,[a("interceptors"),o(r)]),a(".")]),x,e("p",null,[a("This folder contains typescript "),e("a",S,[a("interfaces"),o(r)])]),j,e("p",null,[a("Where all our NestJS modules lives. See "),e("a",D,[a("NestJS modules documentation"),o(r)]),a(" for more.")]),N,e("p",null,[a("Eslint configuration file, See "),e("a",T,[a("the eslint doc"),o(r)]),a(" for more.")]),V,e("p",null,[a("Docker compose configuration file, See "),e("a",E,[a("the docker docs"),o(r)]),a(" for more.")]),F,e("p",null,[a("basic Dockerfile configuration to build the app, See "),e("a",W,[a("the docker docs"),o(r)]),a(" for more.")]),L,I])}const R=d(h,[["render",q],["__file","architecture.html.vue"]]);export{R as default};