import{_ as t,M as r,p as o,q as l,R as e,t as n,N as s,a1 as i}from"./framework-96b046e1.js";const d={},c=i('<h1 id="setup-and-development" tabindex="-1"><a class="header-anchor" href="#setup-and-development" aria-hidden="true">#</a> Setup and development</h1><ul><li><a href="#setup-and-development">Setup and development</a><ul><li><a href="#first-time-setup">First-time setup</a></li><li><a href="#installation">Installation</a><ul><li><a href="#database">Database</a></li><li><a href="#configuration">Configuration</a></li><li><a href="#dev-server">Dev server</a></li></ul></li><li><a href="#generators">Generators</a></li><li><a href="#docker">Docker</a><ul><li><a href="#docker-installation">Docker installation</a></li><li><a href="#docker-compose-installation">Docker-compose installation</a></li><li><a href="#run">Run</a></li></ul></li></ul></li></ul><h2 id="first-time-setup" tabindex="-1"><a class="header-anchor" href="#first-time-setup" aria-hidden="true">#</a> First-time setup</h2><p>Make sure you have the following installed:</p>',4),u={href:"https://nodejs.org/en/",target:"_blank",rel:"noopener noreferrer"},h={href:"https://yarnpkg.com/lang/en/docs/install/",target:"_blank",rel:"noopener noreferrer"},p=i(`<h2 id="installation" tabindex="-1"><a class="header-anchor" href="#installation" aria-hidden="true">#</a> Installation</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># Install dependencies from package.json</span>
<span class="token function">yarn</span> <span class="token function">install</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div>`,2),m={href:"https://classic.yarnpkg.com/en/docs/yarn-lock/",target:"_blank",rel:"noopener noreferrer"},v=e("h3",{id:"database",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#database","aria-hidden":"true"},"#"),n(" Database")],-1),b={href:"https://github.com/typeorm/typeorm",target:"_blank",rel:"noopener noreferrer"},f=i(`<h3 id="configuration" tabindex="-1"><a class="header-anchor" href="#configuration" aria-hidden="true">#</a> Configuration</h3><p>Before start install PostgreSQL and fill correct configurations in <code>.env</code> file</p><div class="language-env line-numbers-mode" data-ext="env"><pre class="language-env"><code>DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=nest_boilerplate
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Some helper script to work with database</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># To create new migration file</span>
<span class="token function">yarn</span> migration:create migration_name

<span class="token comment"># Truncate full database (note: it isn&#39;t deleting the database)</span>
<span class="token function">yarn</span> schema:drop

<span class="token comment"># Generate migration from update of entities</span>
<span class="token function">yarn</span> migration:generate migration_name
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="mysql" tabindex="-1"><a class="header-anchor" href="#mysql" aria-hidden="true">#</a> MySQL</h4><p>If you need to use MySQL / MariaDB instead of PostgreSQL, follow the steps below:</p><blockquote><p>(assuming you have installed mysql in your system and it is running on port 3306)</p></blockquote><ol><li>Make the following entries in the #DB section in <code>.env</code> file</li></ol><div class="language-env line-numbers-mode" data-ext="env"><pre class="language-env"><code>#== DB
DB_TYPE=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USERNAME=mysql
DB_PASSWORD=mysql
DB_DATABASE=nest_boilerplate
DB_ROOT_PASSWORD=mysql
DB_ALLOW_EMPTY_PASSWORD=yes
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2"><li>Change the DB in TypeORM to MySQL. You can do that by heading over to the file <code>ormconfig.ts</code>.</li></ol><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>...
export const dataSource = new DataSource({
  type: &#39;mysql&#39;, // &lt;-- Just write mysql here
  host: p<wbr>rocess.env.DB_HOST,
  port: Number(p<wbr>rocess.env.DB_PORT),
  username: p<wbr>rocess.env.DB_USERNAME,
  password: p<wbr>rocess.env.DB_PASSWORD,
  database: p<wbr>rocess.env.DB_DATABASE,
  namingStrategy: new SnakeNamingStrategy(),
  subscribers: [UserSubscriber],
  entities: [
    &#39;src/modules/**/*.entity{.ts,.js}&#39;,
    &#39;src/modules/**/*.view-entity{.ts,.js}&#39;,
  ],
  migrations: [&#39;src/database/migrations/*{.ts,.js}&#39;],
});
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="3"><li>Delete all the files in migrations folder (<code>src/database/migrations</code>)</li><li>Run the following commands in the root folder of the project, to regenerate the migrations:</li></ol><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>yarn typeorm migration:generate ./src/database/migrations/MySQLMigrations
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,14),g={href:"https://typeorm.io/#features",target:"_blank",rel:"noopener noreferrer"},_=i('<h5 id="docker-compose" tabindex="-1"><a class="header-anchor" href="#docker-compose" aria-hidden="true">#</a> Docker Compose</h5><p>After completing the steps above, you can use <a href="../docker-compose_mysql.yml">this docker-compose file</a> for awesome-nest-boilerplate with MySQL (instead of PostgreSQL).</p><h3 id="dev-server" tabindex="-1"><a class="header-anchor" href="#dev-server" aria-hidden="true">#</a> Dev server</h3>',3),k=e("code",null,"ENOSPC",-1),y={href:"https://stackoverflow.com/questions/22475849/node-js-error-enospc#answer-32600959",target:"_blank",rel:"noopener noreferrer"},w=i(`<div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># Launch the dev server</span>
<span class="token function">yarn</span> start:dev

<span class="token comment"># Launch the dev server with file watcher</span>
<span class="token function">yarn</span> watch:dev

<span class="token comment"># Launch the dev server and enable remote debugger with file watcher</span>
<span class="token function">yarn</span> debug:dev
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="generators" tabindex="-1"><a class="header-anchor" href="#generators" aria-hidden="true">#</a> Generators</h2><p>This project includes generators to speed up common development tasks. Commands include:</p><blockquote><p>Note: Make sure you already have the nest-cli globally installed</p></blockquote><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># Install nest-cli globally</span>
<span class="token function">yarn</span> global <span class="token function">add</span> @nestjs/cli

<span class="token comment"># Generate a new service</span>
nest generate <span class="token function">service</span> <span class="token function">users</span>

<span class="token comment"># Generate a new class</span>
nest g class <span class="token function">users</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,5),D={href:"https://docs.nestjs.com/cli/usages#generate-alias-g",target:"_blank",rel:"noopener noreferrer"},x=e("h2",{id:"docker",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#docker","aria-hidden":"true"},"#"),n(" Docker")],-1),S={href:"https://www.docker.com/",target:"_blank",rel:"noopener noreferrer"},B={href:"https://docs.docker.com/compose",target:"_blank",rel:"noopener noreferrer"},O=e("h3",{id:"docker-installation",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#docker-installation","aria-hidden":"true"},"#"),n(" Docker installation")],-1),T=e("p",null,"Download docker from Official website",-1),q={href:"https://docs.docker.com/docker-for-mac/install/",target:"_blank",rel:"noopener noreferrer"},N={href:"https://docs.docker.com/docker-for-windows/install/",target:"_blank",rel:"noopener noreferrer"},A={href:"https://docs.docker.com/install/linux/docker-ce/ubuntu/",target:"_blank",rel:"noopener noreferrer"},M=e("h3",{id:"docker-compose-installation",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#docker-compose-installation","aria-hidden":"true"},"#"),n(" Docker-compose installation")],-1),R={href:"https://docs.docker.com/compose/install",target:"_blank",rel:"noopener noreferrer"},L=i(`<h3 id="run" tabindex="-1"><a class="header-anchor" href="#run" aria-hidden="true">#</a> Run</h3><p>Open terminal and navigate to project directory and run the following command.</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token assign-left variable">PORT</span><span class="token operator">=</span><span class="token number">3000</span> <span class="token function">docker-compose</span> up
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,3),E={href:"http://localhost:3000",target:"_blank",rel:"noopener noreferrer"},P={href:"http://localhost:8080",target:"_blank",rel:"noopener noreferrer"},j=i(`<div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>host: postgres
user: postgres
pass: postgres
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>create database <code>nest_boilerplate</code> and your application fully is ready to use.</p>`,2);function I(Q,C){const a=r("ExternalLinkIcon");return o(),l("div",null,[c,e("ul",null,[e("li",null,[e("a",u,[n("Node"),s(a)]),n(" (at least the latest LTS)")]),e("li",null,[e("a",h,[n("Yarn"),s(a)]),n(" (at least 1.0)")])]),p,e("blockquote",null,[e("p",null,[n("Note: don't delete yarn.lock before installation, See more "),e("a",m,[n("in yarn docs"),s(a)])])]),v,e("blockquote",null,[e("p",null,[n("Note: Awesome NestJS Boilerplate uses "),e("a",b,[n("TypeORM"),s(a)]),n(" with Data Mapper pattern.")])]),f,e("p",null,[n("These steps may work for "),e("a",g,[n("other databases"),s(a)]),n(" supported by TypeORM. If they work, let us know and we'll add it to the docs!")]),_,e("blockquote",null,[e("p",null,[n("Note: If you're on Linux and see an "),k,n(" error when running the commands below, you must "),e("a",y,[n("increase the number of available file watchers"),s(a)]),n(".")])]),w,e("blockquote",null,[e("p",null,[n("Note: if you love generators then you can find full list of command in official "),e("a",D,[n("Nest-cli Docs"),s(a)]),n(".")])]),x,e("p",null,[n("if you are familiar with "),e("a",S,[n("docker"),s(a)]),n(" and "),e("a",B,[n("docker-compose"),s(a)]),n(" then you can run built in docker-compose file, which will install and configure application and database for you.")]),O,T,e("ul",null,[e("li",null,[n("Mac "),e("a",q,[n("https://docs.docker.com/docker-for-mac/install/"),s(a)])]),e("li",null,[n("Windows "),e("a",N,[n("https://docs.docker.com/docker-for-windows/install/"),s(a)])]),e("li",null,[n("Ubuntu "),e("a",A,[n("https://docs.docker.com/install/linux/docker-ce/ubuntu/"),s(a)])])]),M,e("p",null,[n("Download docker from "),e("a",R,[n("Official website"),s(a)])]),L,e("blockquote",null,[e("p",null,[n("Note: application will run on port 3000 ("),e("a",E,[n("http://localhost:3000"),s(a)]),n(")")])]),e("p",null,[n("Navigate to "),e("a",P,[n("http://localhost:8080"),s(a)]),n(" and connect to you database with the following configurations")]),j])}const G=t(d,[["render",I],["__file","development.html.vue"]]);export{G as default};