import{b as h,e as j,j as e,C as m,F as u,q as p,V as g,T,l as d}from"./index-YGpXjSOi.js";import{H as b,T as y,a as f,b as l,c as a,d as w,e as r}from"./heading-biKtf4Ne.js";const _=()=>{const{sales:c}=h(),o=j("white","gray.800");return e.jsxs(m,{maxW:"container.xl",py:8,children:[e.jsx(u,{justify:"space-between",align:"center",mb:8,children:e.jsx(b,{size:"lg",children:"Vendas"})}),e.jsx(p,{bg:o,borderRadius:"lg",shadow:"sm",overflow:"hidden",children:e.jsxs(y,{variant:"simple",children:[e.jsx(f,{children:e.jsxs(l,{children:[e.jsx(a,{children:"Data"}),e.jsx(a,{children:"Produtos"}),e.jsx(a,{children:"Pagamento"}),e.jsx(a,{children:"Entrega"}),e.jsx(a,{isNumeric:!0,children:"Total"})]})}),e.jsx(w,{children:c.map(s=>{var i;return e.jsxs(l,{children:[e.jsx(r,{children:new Date(s.date).toLocaleDateString("pt-BR")}),e.jsx(r,{children:e.jsx(g,{align:"start",spacing:1,children:(i=s.sale_items)==null?void 0:i.map((n,x)=>{var t;return e.jsxs(T,{fontSize:"sm",children:[(t=n.product)==null?void 0:t.name," - ",n.quantity,"x ",d(n.price_at_time)]},x)})})}),e.jsx(r,{children:s.payment_method}),e.jsx(r,{children:s.delivery?"Sim":"Não"}),e.jsx(r,{isNumeric:!0,children:d(s.total_amount)})]},s.id)})})]})})]})};export{_ as default};