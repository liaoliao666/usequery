import{l as e,f as t,g as o,s as r}from"./framework.dc3bd9a4.js";const a='{"title":"Scroll Restoration","description":"","frontmatter":{"id":"scroll-restoration","title":"Scroll Restoration"},"relativePath":"guides/scroll-restoration.md","lastUpdated":1610593423769}',i={},n=o("p",null,[r("Traditionally, when you navigate to a previously visited page on a web browser, you would find that the page would be scrolled to the exact position where you were before you navigated away from that page. This is called "),o("strong",null,"scroll restoration"),r(" and has been in a bit of a regression since web applications have started moving towards client side data fetching. With Vu Query however, that's no longer the case.")],-1),s=o("p",null,'Out of the box, "scroll restoration" for all queries (including paginated and infinite queries) Just Works™️ in Vu Query. The reason for this is that query results are cached and able to be retrieved synchronously when a query is rendered. As long as your queries are being cached long enough (the default time is 5 minutes) and have not been garbage collected, scroll restoration will work out of the box all the time.',-1);i.render=function(o,r,a,i,l,d){return e(),t("div",null,[n,s])};export default i;export{a as __pageData};
