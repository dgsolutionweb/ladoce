import{f as ns,u as os,j as s,c as rs,a as ls,b as is,r as i,d as cs,e as ds,C as hs,F as P,B as u,g as xs,S as y,h as b,i as T,I as c,k as I,l as o,m as us,n as ms,V as A,H as B,o as js,p as ps,q as gs,T as q,P as fs,s as Ss,M as ys,t as bs,v as Ts,w as Ds,G as ws,x as D}from"./index-YGpXjSOi.js";import{S as G,E as Cs}from"./ExpenseModal-BDL2cwSb.js";import{H as v,T as Es,a as Ms,b as V,c as k,d as Ps,e as R}from"./heading-biKtf4Ne.js";import{C as d,a as h}from"./card-body-CKVc--tL.js";import{A as qs,a as vs}from"./alert-dialog-DgUrEwo2.js";const m=ns(function(r,p){const x=os();return s.jsx(rs.dd,{ref:p,...r,className:ls("chakra-stat__help-text",r.className),__css:x.helpText})});m.displayName="StatHelpText";const Os=()=>{const{sales:j,products:r,expenses:p,monthlyGoal:x,fetchSales:L,fetchProducts:W,fetchExpenses:Q}=is(),[t,U]=i.useState({todaySales:0,todayTransactions:0,monthSales:0,monthTransactions:0,monthExpenses:0,netProfit:0,goalProgress:0,lowStockCount:0,mostSoldProducts:[]}),[Y,_]=i.useState(!1),[J,z]=i.useState(!1),[K,g]=i.useState(!1),F=i.useRef(null),O=cs(),l=ds("white","gray.800"),X=async()=>{try{await D.from("sale_items").delete().neq("id",0),await D.from("sales").delete().neq("id",0),await D.from("expenses").delete().neq("id",0),await D.from("products").delete().neq("id",0),await Promise.all([L(),W(),Q()]),O({title:"Dados resetados",description:"Todos os dados foram apagados com sucesso",status:"success",duration:3e3,isClosable:!0})}catch{O({title:"Erro",description:"Ocorreu um erro ao resetar os dados",status:"error",duration:3e3,isClosable:!0})}finally{g(!1)}};return i.useEffect(()=>{const n=new Date;n.setHours(0,0,0,0);const f=new Date(n.getFullYear(),n.getMonth(),1),H=j.filter(e=>new Date(e.date)>=n),w=j.filter(e=>new Date(e.date)>=f),Z=p.filter(e=>new Date(e.date)>=f),C=new Map;w.forEach(e=>{e.sale_items&&e.sale_items.forEach(a=>{const M=r.find(S=>S.id===a.product_id);if(M){const S=C.get(M.name)||{quantity:0,revenue:0};C.set(M.name,{quantity:S.quantity+a.quantity,revenue:S.revenue+a.price_at_time*a.quantity})}})});const $=Array.from(C.entries()).map(([e,a])=>({name:e,quantity:a.quantity,revenue:a.revenue})).sort((e,a)=>a.quantity-e.quantity).slice(0,5),ss=r.filter(e=>e.stock_quantity<10).length,es=H.reduce((e,a)=>e+a.total_amount,0),E=w.reduce((e,a)=>e+a.total_amount,0),N=Z.reduce((e,a)=>e+a.amount,0),as=E-N,ts=E/x*100;U({todaySales:es,todayTransactions:H.length,monthSales:E,monthTransactions:w.length,monthExpenses:N,netProfit:as,goalProgress:ts,lowStockCount:ss,mostSoldProducts:$})},[j,r,p,x]),s.jsxs(hs,{maxW:"container.xl",py:8,children:[s.jsxs(P,{justify:"space-between",align:"center",mb:8,children:[s.jsx(v,{size:"lg",children:"Dashboard"}),s.jsx(u,{leftIcon:s.jsx(xs,{}),colorScheme:"red",variant:"ghost",onClick:()=>g(!0),children:"Resetar Dados"})]}),s.jsxs(G,{columns:{base:1,md:2,lg:4},spacing:6,mb:8,children:[s.jsx(d,{bg:l,shadow:"sm",children:s.jsx(h,{children:s.jsxs(y,{children:[s.jsx(b,{children:"Vendas Hoje"}),s.jsxs(T,{color:"green.500",children:[s.jsx(c,{as:I,mr:2}),o(t.todaySales)]}),s.jsxs(m,{children:[t.todayTransactions," transações"]})]})})}),s.jsx(d,{bg:l,shadow:"sm",children:s.jsx(h,{children:s.jsxs(y,{children:[s.jsx(b,{children:"Vendas do Mês"}),s.jsxs(T,{color:"green.500",children:[s.jsx(c,{as:I,mr:2}),o(t.monthSales)]}),s.jsxs(m,{children:[t.monthTransactions," transações"]})]})})}),s.jsx(d,{bg:l,shadow:"sm",children:s.jsx(h,{children:s.jsxs(y,{children:[s.jsx(b,{children:"Despesas do Mês"}),s.jsxs(T,{color:"red.500",children:[s.jsx(c,{as:us,mr:2}),o(t.monthExpenses)]}),s.jsx(m,{children:s.jsx(u,{size:"xs",colorScheme:"purple",variant:"ghost",onClick:()=>_(!0),children:"Adicionar Despesa"})})]})})}),s.jsx(d,{bg:l,shadow:"sm",children:s.jsx(h,{children:s.jsxs(y,{children:[s.jsx(b,{children:"Lucro Líquido"}),s.jsxs(T,{color:t.netProfit>=0?"green.500":"red.500",children:[s.jsx(c,{as:ms,mr:2}),o(t.netProfit)]}),s.jsx(m,{children:"Este mês"})]})})})]}),s.jsxs(G,{columns:{base:1,lg:2},spacing:6,mb:8,children:[s.jsx(d,{bg:l,shadow:"sm",children:s.jsx(h,{children:s.jsxs(A,{align:"stretch",spacing:4,children:[s.jsxs(P,{justify:"space-between",align:"center",children:[s.jsxs(B,{children:[s.jsx(c,{as:js,color:"purple.500",boxSize:5}),s.jsx(v,{size:"md",children:"Meta Mensal"})]}),s.jsx(u,{size:"sm",leftIcon:s.jsx(ps,{}),variant:"ghost",onClick:()=>z(!0),children:"Editar"})]}),s.jsxs(gs,{children:[s.jsxs(P,{justify:"space-between",mb:2,children:[s.jsx(q,{children:o(t.monthSales)}),s.jsx(q,{children:o(x)})]}),s.jsx(fs,{value:t.goalProgress,colorScheme:t.goalProgress>=100?"green":"purple",borderRadius:"full",size:"sm",mb:2}),s.jsxs(q,{fontSize:"sm",color:"gray.500",children:[t.goalProgress.toFixed(1),"% da meta atingida"]})]})]})})}),s.jsx(d,{bg:l,shadow:"sm",children:s.jsx(h,{children:s.jsxs(A,{align:"stretch",spacing:4,children:[s.jsxs(B,{children:[s.jsx(c,{as:Ss,color:"purple.500",boxSize:5}),s.jsx(v,{size:"md",children:"Produtos Mais Vendidos"})]}),s.jsxs(Es,{variant:"simple",size:"sm",children:[s.jsx(Ms,{children:s.jsxs(V,{children:[s.jsx(k,{children:"Produto"}),s.jsx(k,{isNumeric:!0,children:"Qtd."}),s.jsx(k,{isNumeric:!0,children:"Receita"})]})}),s.jsx(Ps,{children:t.mostSoldProducts.map((n,f)=>s.jsxs(V,{children:[s.jsx(R,{children:n.name}),s.jsx(R,{isNumeric:!0,children:n.quantity}),s.jsx(R,{isNumeric:!0,children:o(n.revenue)})]},f))})]})]})})})]}),s.jsx(qs,{isOpen:K,leastDestructiveRef:F,onClose:()=>g(!1),children:s.jsx(ys,{children:s.jsxs(vs,{children:[s.jsx(bs,{fontSize:"lg",fontWeight:"bold",children:"Resetar Dados"}),s.jsx(Ts,{children:"Tem certeza? Esta ação irá apagar todos os dados cadastrados (produtos, vendas, despesas). Esta ação não pode ser desfeita."}),s.jsxs(Ds,{children:[s.jsx(u,{ref:F,onClick:()=>g(!1),children:"Cancelar"}),s.jsx(u,{colorScheme:"red",onClick:X,ml:3,children:"Resetar"})]})]})})}),s.jsx(Cs,{isOpen:Y,onClose:()=>_(!1)}),s.jsx(ws,{isOpen:J,onClose:()=>z(!1)})]})};export{Os as default};