/*! For license information please see 459.bundle.js.LICENSE.txt */
"use strict";(self.webpackChunkreactapp=self.webpackChunkreactapp||[]).push([[459],{459:(t,e,r)=>{r.r(e),r.d(e,{default:()=>v});var n=r(540),o=r(468),a=r(661),i=r(194),c=r(83);function u(t){return u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},u(t)}function l(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function s(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?l(Object(r),!0).forEach((function(e){f(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):l(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}function f(t,e,r){return(e=function(t){var e=function(t){if("object"!=u(t)||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var r=e.call(t,"string");if("object"!=u(r))return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(t)}(t);return"symbol"==u(e)?e:e+""}(e))in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function p(){p=function(){return e};var t,e={},r=Object.prototype,n=r.hasOwnProperty,o=Object.defineProperty||function(t,e,r){t[e]=r.value},a="function"==typeof Symbol?Symbol:{},i=a.iterator||"@@iterator",c=a.asyncIterator||"@@asyncIterator",l=a.toStringTag||"@@toStringTag";function s(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{s({},"")}catch(t){s=function(t,e,r){return t[e]=r}}function f(t,e,r,n){var a=e&&e.prototype instanceof b?e:b,i=Object.create(a.prototype),c=new D(n||[]);return o(i,"_invoke",{value:P(t,r,c)}),i}function h(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}e.wrap=f;var d="suspendedStart",y="suspendedYield",m="executing",v="completed",g={};function b(){}function w(){}function E(){}var x={};s(x,i,(function(){return this}));var O=Object.getPrototypeOf,k=O&&O(O(T([])));k&&k!==r&&n.call(k,i)&&(x=k);var j=E.prototype=b.prototype=Object.create(x);function L(t){["next","throw","return"].forEach((function(e){s(t,e,(function(t){return this._invoke(e,t)}))}))}function S(t,e){function r(o,a,i,c){var l=h(t[o],t,a);if("throw"!==l.type){var s=l.arg,f=s.value;return f&&"object"==u(f)&&n.call(f,"__await")?e.resolve(f.__await).then((function(t){r("next",t,i,c)}),(function(t){r("throw",t,i,c)})):e.resolve(f).then((function(t){s.value=t,i(s)}),(function(t){return r("throw",t,i,c)}))}c(l.arg)}var a;o(this,"_invoke",{value:function(t,n){function o(){return new e((function(e,o){r(t,n,e,o)}))}return a=a?a.then(o,o):o()}})}function P(e,r,n){var o=d;return function(a,i){if(o===m)throw Error("Generator is already running");if(o===v){if("throw"===a)throw i;return{value:t,done:!0}}for(n.method=a,n.arg=i;;){var c=n.delegate;if(c){var u=_(c,n);if(u){if(u===g)continue;return u}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===d)throw o=v,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=m;var l=h(e,r,n);if("normal"===l.type){if(o=n.done?v:y,l.arg===g)continue;return{value:l.arg,done:n.done}}"throw"===l.type&&(o=v,n.method="throw",n.arg=l.arg)}}}function _(e,r){var n=r.method,o=e.iterator[n];if(o===t)return r.delegate=null,"throw"===n&&e.iterator.return&&(r.method="return",r.arg=t,_(e,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),g;var a=h(o,e.iterator,r.arg);if("throw"===a.type)return r.method="throw",r.arg=a.arg,r.delegate=null,g;var i=a.arg;return i?i.done?(r[e.resultName]=i.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,g):i:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,g)}function C(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function F(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function D(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(C,this),this.reset(!0)}function T(e){if(e||""===e){var r=e[i];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,a=function r(){for(;++o<e.length;)if(n.call(e,o))return r.value=e[o],r.done=!1,r;return r.value=t,r.done=!0,r};return a.next=a}}throw new TypeError(u(e)+" is not iterable")}return w.prototype=E,o(j,"constructor",{value:E,configurable:!0}),o(E,"constructor",{value:w,configurable:!0}),w.displayName=s(E,l,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===w||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,E):(t.__proto__=E,s(t,l,"GeneratorFunction")),t.prototype=Object.create(j),t},e.awrap=function(t){return{__await:t}},L(S.prototype),s(S.prototype,c,(function(){return this})),e.AsyncIterator=S,e.async=function(t,r,n,o,a){void 0===a&&(a=Promise);var i=new S(f(t,r,n,o),a);return e.isGeneratorFunction(r)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},L(j),s(j,l,"Generator"),s(j,i,(function(){return this})),s(j,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},e.values=T,D.prototype={constructor:D,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(F),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function o(n,o){return c.type="throw",c.arg=e,r.next=n,o&&(r.method="next",r.arg=t),!!o}for(var a=this.tryEntries.length-1;a>=0;--a){var i=this.tryEntries[a],c=i.completion;if("root"===i.tryLoc)return o("end");if(i.tryLoc<=this.prev){var u=n.call(i,"catchLoc"),l=n.call(i,"finallyLoc");if(u&&l){if(this.prev<i.catchLoc)return o(i.catchLoc,!0);if(this.prev<i.finallyLoc)return o(i.finallyLoc)}else if(u){if(this.prev<i.catchLoc)return o(i.catchLoc,!0)}else{if(!l)throw Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return o(i.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var a=o;break}}a&&("break"===t||"continue"===t)&&a.tryLoc<=e&&e<=a.finallyLoc&&(a=null);var i=a?a.completion:{};return i.type=t,i.arg=e,a?(this.method="next",this.next=a.finallyLoc,g):this.complete(i)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),g},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),F(r),g}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;F(r)}return o}}throw Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:T(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),g}},e}function h(t,e,r,n,o,a,i){try{var c=t[a](i),u=c.value}catch(t){return void r(t)}c.done?e(u):Promise.resolve(u).then(n,o)}function d(t){return function(){var e=this,r=arguments;return new Promise((function(n,o){var a=t.apply(e,r);function i(t){h(a,n,o,i,c,"next",t)}function c(t){h(a,n,o,i,c,"throw",t)}i(void 0)}))}}function y(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var r=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=r){var n,o,a,i,c=[],u=!0,l=!1;try{if(a=(r=r.call(t)).next,0===e){if(Object(r)!==r)return;u=!1}else for(;!(u=(n=a.call(r)).done)&&(c.push(n.value),c.length!==e);u=!0);}catch(t){l=!0,o=t}finally{try{if(!u&&null!=r.return&&(i=r.return(),Object(i)!==i))return}finally{if(l)throw o}}return c}}(t,e)||function(t,e){if(t){if("string"==typeof t)return m(t,e);var r={}.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?m(t,e):void 0}}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function m(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=Array(e);r<e;r++)n[r]=t[r];return n}const v=n.memo((function(){var t=(0,o.wA)(),e=(0,o.d4)((function(t){return t.recentOrdersReducer.recentOrders}))||[],r=(0,o.d4)((function(t){return t.userReducer.user.userName})),u=(0,n.useMemo)((function(){return e.filter((function(t){return t.userId===r}))}),[e,r]),l=y((0,n.useState)([]),2),f=l[0],h=l[1],m=y((0,n.useState)(null),2),v=m[0],g=m[1],b=y((0,n.useState)(!1),2),w=b[0],E=b[1],x=y((0,n.useState)({rating:0,comment:""}),2),O=x[0],k=x[1],j=y((0,n.useState)([]),2),L=(j[0],j[1]);(0,n.useEffect)((function(){t((0,a.tW)())}),[t]),(0,n.useEffect)((function(){var n=e.filter((function(t){return t.userId===r})),o=[],c=n.map((function(e){var r=(new Date-new Date(e.dateTime))/864e5,n=35e-5-r;if("Cancelled"!==e.status&&n>0){var c=setTimeout(d(p().mark((function r(){return p().wrap((function(r){for(;;)switch(r.prev=r.next){case 0:return r.prev=0,r.next=3,A(e._id,{status:"Delivered"});case 3:return t((0,i.y4)({id:(new Date).getTime(),message:"Leave a review for purchased products!",static:!1})),r.next=6,D(e._id);case 6:return r.next=8,t((0,a.tW)());case 8:r.next=13;break;case 10:r.prev=10,r.t0=r.catch(0),console.error("Failed to update order ".concat(e._id," to Delivered:"),r.t0.message);case 13:case"end":return r.stop()}}),r,null,[[0,10]])}))),24*n*60*60*1e3);o.push(c)}return s(s({},e),{},{isExpired:"Cancelled"!==e.status&&r>=35e-5,canBeCancelled:"Pending"===e.status})}));return h(c),function(){o.forEach((function(t){return clearTimeout(t)}))}}),[e,r,t]);var S=(0,n.useCallback)((function(t){g((function(e){return e===t?null:t}))}),[]),P=(0,n.useCallback)((function(t){k((function(e){return s(s({},e),{},{productId:t})})),E(!0)}),[]),_=(0,n.useCallback)(d(p().mark((function t(){var e;return p().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(t.prev=0,e=O.productId){t.next=5;break}return alert("Error: No product selected for review."),t.abrupt("return");case 5:return t.next=7,c.A.post("http://localhost:9000/product/add-review/".concat(e),{userId:r,userName:r,rating:O.rating,comment:O.comment});case 7:E(!1),k({rating:0,comment:"",productId:null}),alert("Review submitted successfully!"),t.next=15;break;case 12:t.prev=12,t.t0=t.catch(0),alert("Failed to submit review. Please try again.");case 15:case"end":return t.stop()}}),t,null,[[0,12]])}))),[O,r]),C=(0,n.useCallback)(function(){var e=d(p().mark((function e(r){var n;return p().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,t((0,a.N4)(r));case 3:n=e.sent,h((function(t){return t.map((function(t){return t._id===n._id?s(s({},t),{},{status:"Cancelled"}):t}))})),alert("Order cancelled successfully!"),e.next=11;break;case 8:e.prev=8,e.t0=e.catch(0),alert("Failed to cancel the order. Please try again.");case 11:case"end":return e.stop()}}),e,null,[[0,8]])})));return function(t){return e.apply(this,arguments)}}(),[t]),F=(0,n.useCallback)(function(){var e=d(p().mark((function e(n){var o,i,u;return p().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(e.prev=0,!(o=f.find((function(t){return t._id===n})))){e.next=15;break}return i=o.order.map((function(t){return t.id})),e.next=6,T(r,i,!0);case 6:return e.next=8,A(n,{status:"Pending",dateTime:(new Date).toISOString()});case 8:return e.next=10,t((0,a.tW)());case 10:return e.next=12,c.A.get("http://localhost:9000/cart",{params:{userId:r}});case 12:u=e.sent,L(u.data.cart),alert("Order reordered successfully!");case 15:e.next=20;break;case 17:e.prev=17,e.t0=e.catch(0),alert("Failed to reorder the order. Please try again.");case 20:case"end":return e.stop()}}),e,null,[[0,17]])})));return function(t){return e.apply(this,arguments)}}(),[f,t,r]),D=(0,n.useCallback)(function(){var t=d(p().mark((function t(e){var n,o;return p().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(t.prev=0,!(n=f.find((function(t){return t._id===e})))){t.next=7;break}return o=n.order.map((function(t){return t.id})),t.next=6,c.A.put("http://localhost:9000/cart/remove-items",{userId:r,productIds:o});case 6:console.log("Successfully removed items for order ".concat(e));case 7:t.next=12;break;case 9:t.prev=9,t.t0=t.catch(0),console.error("Failed to remove items from cart for order ".concat(e,":"),t.t0.message);case 12:case"end":return t.stop()}}),t,null,[[0,9]])})));return function(e){return t.apply(this,arguments)}}(),[f,r]),T=(0,n.useCallback)(function(){var t=d(p().mark((function t(e,r,n){return p().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,c.A.put("http://localhost:9000/cart/update-checkout",{userId:e,productIds:r,checkout:n});case 3:t.next=8;break;case 5:t.prev=5,t.t0=t.catch(0),console.error("Error updating cart items:",t.t0.message);case 8:case"end":return t.stop()}}),t,null,[[0,5]])})));return function(e,r,n){return t.apply(this,arguments)}}(),[]),A=(0,n.useCallback)(function(){var t=d(p().mark((function t(e,r){return p().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,c.A.put("http://localhost:9000/recent-orders/".concat(e),r);case 3:t.next=8;break;case 5:t.prev=5,t.t0=t.catch(0),console.error("Failed to update order ".concat(e,":"),t.t0);case 8:case"end":return t.stop()}}),t,null,[[0,5]])})));return function(e,r){return t.apply(this,arguments)}}(),[]),I=(0,n.useMemo)((function(){return f.filter((function(t){return"Pending"===t.status}))}),[f]),N=(0,n.useMemo)((function(){return f.filter((function(t){return"Delivered"===t.status&&!I.some((function(e){return e._id===t._id}))}))}),[f,I]),G=(0,n.useMemo)((function(){return f.filter((function(t){return"Cancelled"===t.status}))}),[f]),R=function(t,e,r,o){return 0===e.length?null:n.createElement(n.Fragment,null,n.createElement("h3",null,t),n.createElement("table",{border:"1",style:{width:"100%",marginBottom:"20px"}},n.createElement("thead",null,n.createElement("tr",null,n.createElement("th",null,"Order ID"),n.createElement("th",null,"Date/Time Created"),n.createElement("th",null,"Product Name"),n.createElement("th",null,"Total"),(r||o)&&n.createElement("th",null,"Actions"))),n.createElement("tbody",null,e.map((function(t){return n.createElement(n.Fragment,{key:t._id},n.createElement("tr",null,n.createElement("td",null,t._id),n.createElement("td",null,new Date(t.dateTime).toLocaleString()),n.createElement("td",null,t.order.map((function(t){return t.name})).join(", ")),n.createElement("td",null,"$",t.total.toFixed(2)),(r||o)&&n.createElement("td",null,r&&n.createElement(n.Fragment,null,n.createElement("button",{onClick:function(){return S(t._id)}},v===t._id?"Hide Details":"View Details"),"Delivered"===t.status&&t.order.map((function(t){return n.createElement("button",{key:t.id,onClick:function(){P(t.id)}},"Rate & Review - ",t.name)})),t.canBeCancelled&&!t.isExpired&&n.createElement("button",{onClick:function(){return C(t._id)}},"Cancel")),o&&n.createElement(n.Fragment,null,n.createElement("button",{onClick:function(){return S(t._id)}},"View Details"),n.createElement("button",{onClick:function(){return F(t._id)}},"Reorder")))),v===t._id&&function(t){var e=t.order.reduce((function(t,e){return t+e.price*e.quantity}),0);return n.createElement("tr",null,n.createElement("td",{colSpan:"5"},n.createElement("div",{style:{padding:"10px",backgroundColor:"#f9f9f9"}},n.createElement("h4",null,"Order Details:"),t.order.map((function(r,o){return n.createElement("p",{key:o,style:{marginBottom:"10px"}},n.createElement("strong",null,"Product Name:")," ",r.name," ",n.createElement("br",null),n.createElement("strong",null,"Quantity:")," ",r.quantity," ",n.createElement("br",null),n.createElement("strong",null,"Price:")," $",r.price.toFixed(2)," ",n.createElement("br",null),n.createElement("strong",null,"Total (Before Discount):")," ",(r.price*r.quantity).toFixed(2)," ",n.createElement("br",null),n.createElement("strong",null,"Total (After Discount):")," ",(r.price*r.quantity-r.price*r.quantity/e*t.discount).toFixed(2)," ",n.createElement("br",null))})))))}(t))})))))};return n.createElement("div",{style:{padding:"20px"}},0===u.length?n.createElement("h2",null,"No recent orders available."):n.createElement(n.Fragment,null,R("Pending Orders",I,!0,!1),R("Delivered Orders",N,!0,!1),R("Cancelled Orders",G,!1,!0)),w&&n.createElement("div",{style:{position:"fixed",top:0,left:0,width:"100%",height:"100%",backgroundColor:"rgba(0, 0, 0, 0.5)",display:"flex",justifyContent:"center",alignItems:"center",zIndex:1e3}},n.createElement("div",{style:{backgroundColor:"#fff",padding:"20px",borderRadius:"8px",width:"400px",boxShadow:"0 2px 10px rgba(0, 0, 0, 0.2)"}},n.createElement("h3",null,"Submit Review"),n.createElement("div",null,n.createElement("label",null,"Rating:",n.createElement("input",{type:"number",min:"1",max:"5",value:O.rating||"",onChange:function(t){return k((function(e){return s(s({},e),{},{rating:parseFloat(t.target.value)||0})}))}}))),n.createElement("div",null,n.createElement("label",null,"Comment:",n.createElement("textarea",{value:O.comment,onChange:function(t){return k((function(e){return s(s({},e),{},{comment:t.target.value})}))},style:{width:"100%",height:"80px"}}))),n.createElement("div",{style:{marginTop:"20px",textAlign:"right"}},n.createElement("button",{onClick:_,style:{marginRight:"10px"}},"Submit"),n.createElement("button",{onClick:function(){return E(!1)}},"Cancel")))))}))},194:(t,e,r)=>{r.d(e,{$D:()=>f,Jj:()=>l,YT:()=>s,uy:()=>p,y4:()=>u});var n=r(857);function o(t){return o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},o(t)}function a(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function i(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?a(Object(r),!0).forEach((function(e){c(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}function c(t,e,r){return(e=function(t){var e=function(t){if("object"!=o(t)||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var r=e.call(t,"string");if("object"!=o(r))return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(t)}(t);return"symbol"==o(e)?e:e+""}(e))in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}var u=function(t){return{type:n.z8,payload:Array.isArray(t)?t:[t]}},l=function(t){return{type:n.Vj,payload:t}},s=function(){return function(t,e){var r=e().notificationReducer.notifications.map((function(t){return t.static&&!t.read?i(i({},t),{},{read:!1}):t}));t({type:n.Wv,payload:r})}},f=function(){return{type:n.Sd}},p=function(){return function(t,e){var r=e().notificationReducer.notifications,n=[{id:103,message:"Browse and add products to your cart!",static:!0,read:!1},{id:102,message:"Check product reviews before purchasing",static:!0,read:!1},{id:101,message:"Review your cart before checkout!",static:!0,read:!1}].filter((function(t){return!r.some((function(e){return e.id===t.id}))}));n.length>0&&t(u(n))}}},661:(t,e,r)=>{r.d(e,{EB:()=>s,N4:()=>p,tW:()=>f});var n=r(83),o=r(857),a=r(194);function i(t){return i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},i(t)}function c(){c=function(){return e};var t,e={},r=Object.prototype,n=r.hasOwnProperty,o=Object.defineProperty||function(t,e,r){t[e]=r.value},a="function"==typeof Symbol?Symbol:{},u=a.iterator||"@@iterator",l=a.asyncIterator||"@@asyncIterator",s=a.toStringTag||"@@toStringTag";function f(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{f({},"")}catch(t){f=function(t,e,r){return t[e]=r}}function p(t,e,r,n){var a=e&&e.prototype instanceof b?e:b,i=Object.create(a.prototype),c=new D(n||[]);return o(i,"_invoke",{value:P(t,r,c)}),i}function h(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}e.wrap=p;var d="suspendedStart",y="suspendedYield",m="executing",v="completed",g={};function b(){}function w(){}function E(){}var x={};f(x,u,(function(){return this}));var O=Object.getPrototypeOf,k=O&&O(O(T([])));k&&k!==r&&n.call(k,u)&&(x=k);var j=E.prototype=b.prototype=Object.create(x);function L(t){["next","throw","return"].forEach((function(e){f(t,e,(function(t){return this._invoke(e,t)}))}))}function S(t,e){function r(o,a,c,u){var l=h(t[o],t,a);if("throw"!==l.type){var s=l.arg,f=s.value;return f&&"object"==i(f)&&n.call(f,"__await")?e.resolve(f.__await).then((function(t){r("next",t,c,u)}),(function(t){r("throw",t,c,u)})):e.resolve(f).then((function(t){s.value=t,c(s)}),(function(t){return r("throw",t,c,u)}))}u(l.arg)}var a;o(this,"_invoke",{value:function(t,n){function o(){return new e((function(e,o){r(t,n,e,o)}))}return a=a?a.then(o,o):o()}})}function P(e,r,n){var o=d;return function(a,i){if(o===m)throw Error("Generator is already running");if(o===v){if("throw"===a)throw i;return{value:t,done:!0}}for(n.method=a,n.arg=i;;){var c=n.delegate;if(c){var u=_(c,n);if(u){if(u===g)continue;return u}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===d)throw o=v,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=m;var l=h(e,r,n);if("normal"===l.type){if(o=n.done?v:y,l.arg===g)continue;return{value:l.arg,done:n.done}}"throw"===l.type&&(o=v,n.method="throw",n.arg=l.arg)}}}function _(e,r){var n=r.method,o=e.iterator[n];if(o===t)return r.delegate=null,"throw"===n&&e.iterator.return&&(r.method="return",r.arg=t,_(e,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),g;var a=h(o,e.iterator,r.arg);if("throw"===a.type)return r.method="throw",r.arg=a.arg,r.delegate=null,g;var i=a.arg;return i?i.done?(r[e.resultName]=i.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,g):i:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,g)}function C(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function F(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function D(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(C,this),this.reset(!0)}function T(e){if(e||""===e){var r=e[u];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,a=function r(){for(;++o<e.length;)if(n.call(e,o))return r.value=e[o],r.done=!1,r;return r.value=t,r.done=!0,r};return a.next=a}}throw new TypeError(i(e)+" is not iterable")}return w.prototype=E,o(j,"constructor",{value:E,configurable:!0}),o(E,"constructor",{value:w,configurable:!0}),w.displayName=f(E,s,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===w||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,E):(t.__proto__=E,f(t,s,"GeneratorFunction")),t.prototype=Object.create(j),t},e.awrap=function(t){return{__await:t}},L(S.prototype),f(S.prototype,l,(function(){return this})),e.AsyncIterator=S,e.async=function(t,r,n,o,a){void 0===a&&(a=Promise);var i=new S(p(t,r,n,o),a);return e.isGeneratorFunction(r)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},L(j),f(j,s,"Generator"),f(j,u,(function(){return this})),f(j,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},e.values=T,D.prototype={constructor:D,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(F),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function o(n,o){return c.type="throw",c.arg=e,r.next=n,o&&(r.method="next",r.arg=t),!!o}for(var a=this.tryEntries.length-1;a>=0;--a){var i=this.tryEntries[a],c=i.completion;if("root"===i.tryLoc)return o("end");if(i.tryLoc<=this.prev){var u=n.call(i,"catchLoc"),l=n.call(i,"finallyLoc");if(u&&l){if(this.prev<i.catchLoc)return o(i.catchLoc,!0);if(this.prev<i.finallyLoc)return o(i.finallyLoc)}else if(u){if(this.prev<i.catchLoc)return o(i.catchLoc,!0)}else{if(!l)throw Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return o(i.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var a=o;break}}a&&("break"===t||"continue"===t)&&a.tryLoc<=e&&e<=a.finallyLoc&&(a=null);var i=a?a.completion:{};return i.type=t,i.arg=e,a?(this.method="next",this.next=a.finallyLoc,g):this.complete(i)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),g},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),F(r),g}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;F(r)}return o}}throw Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:T(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),g}},e}function u(t,e,r,n,o,a,i){try{var c=t[a](i),u=c.value}catch(t){return void r(t)}c.done?e(u):Promise.resolve(u).then(n,o)}function l(t){return function(){var e=this,r=arguments;return new Promise((function(n,o){var a=t.apply(e,r);function i(t){u(a,n,o,i,c,"next",t)}function c(t){u(a,n,o,i,c,"throw",t)}i(void 0)}))}}var s=function(t){return function(){var e=l(c().mark((function e(r){var a;return c().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,n.A.post("http://localhost:9000/recent-orders",t);case 3:return a=e.sent,r({type:o.Z9,payload:a.data}),e.abrupt("return",a.data);case 8:throw e.prev=8,e.t0=e.catch(0),console.error("Failed to save order:",e.t0.message),e.t0;case 12:case"end":return e.stop()}}),e,null,[[0,8]])})));return function(t){return e.apply(this,arguments)}}()},f=function(){return function(){var t=l(c().mark((function t(e){var r;return c().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,n.A.get("http://localhost:9000/recent-orders");case 3:r=t.sent,e({type:o.xc,payload:r.data}),t.next=10;break;case 7:t.prev=7,t.t0=t.catch(0),console.error("Failed to fetch orders:",t.t0.message);case 10:case"end":return t.stop()}}),t,null,[[0,7]])})));return function(e){return t.apply(this,arguments)}}()},p=function(t){return function(){var e=l(c().mark((function e(r){var i;return c().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,n.A.put("http://localhost:9000/recent-orders/".concat(t,"/cancel"));case 3:return i=e.sent,r({type:o.Cq,payload:i.data.order}),r((0,a.y4)({id:(new Date).getTime(),message:"Reorder items if needed",static:!1})),e.abrupt("return",i.data.order);case 9:throw e.prev=9,e.t0=e.catch(0),console.error("Failed to cancel order:",e.t0.message),e.t0;case 13:case"end":return e.stop()}}),e,null,[[0,9]])})));return function(t){return e.apply(this,arguments)}}()}}}]);