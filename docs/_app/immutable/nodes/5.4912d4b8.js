import{r as M,v as P,l as b}from"../chunks/pages.53a9f360.js";import{e as S}from"../chunks/index.b1f5b21f.js";import{S as T,i as w,s as B,a as p,y as d,a9 as N,h as m,c,z as _,b as g,A as $,g as h,d as v,B as y}from"../chunks/index.39b8345f.js";import{F as O,Q as j}from"../chunks/FieldDetails.3590471d.js";import{P as z}from"../chunks/PreviousNextPage.52bf8503.js";const A=M(),F=({params:n,url:a})=>{const o=P(n.mutation),t=b(a.pathname);if(!o||!t)throw S(404,`Mutation ${n.mutation} not found.`);return{field:o,page:t}},I=Object.freeze(Object.defineProperty({__proto__:null,load:F,prerender:A},Symbol.toStringTag,{value:"Module"}));function Q(n){let a,o,t,r,i,f;return document.title=a="Mutation - "+n[0].field.name,t=new O({props:{field:n[0].field,type:j.MUTATION}}),i=new z({props:{page:n[0].page}}),{c(){o=p(),d(t.$$.fragment),r=p(),d(i.$$.fragment)},l(e){N("svelte-1ha51ns",document.head).forEach(m),o=c(e),_(t.$$.fragment,e),r=c(e),_(i.$$.fragment,e)},m(e,s){g(e,o,s),$(t,e,s),g(e,r,s),$(i,e,s),f=!0},p(e,[s]){(!f||s&1)&&a!==(a="Mutation - "+e[0].field.name)&&(document.title=a);const l={};s&1&&(l.field=e[0].field),t.$set(l);const u={};s&1&&(u.page=e[0].page),i.$set(u)},i(e){f||(h(t.$$.fragment,e),h(i.$$.fragment,e),f=!0)},o(e){v(t.$$.fragment,e),v(i.$$.fragment,e),f=!1},d(e){e&&m(o),y(t,e),e&&m(r),y(i,e)}}}function q(n,a,o){let{data:t}=a;return n.$$set=r=>{"data"in r&&o(0,t=r.data)},[t]}class U extends T{constructor(a){super(),w(this,a,q,Q,B,{data:0})}}export{U as component,I as universal};
