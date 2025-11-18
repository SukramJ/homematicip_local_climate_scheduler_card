function e(e,t,i,s){var o,r=arguments.length,n=r<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(n=(r<3?o(n):r>3?o(t,i,n):o(t,i))||n);return r>3&&n&&Object.defineProperty(t,i,n),n}"function"==typeof SuppressedError&&SuppressedError;const t=globalThis,i=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),o=new WeakMap;let r=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(i&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=o.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&o.set(t,e))}return e}toString(){return this.cssText}};const n=(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,i,s)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[s+1],e[0]);return new r(i,e,s)},a=i?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new r("string"==typeof e?e:e+"",void 0,s))(t)})(e):e,{is:d,defineProperty:l,getOwnPropertyDescriptor:c,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,g=globalThis,m=g.trustedTypes,_=m?m.emptyScript:"",f=g.reactiveElementPolyfillSupport,v=(e,t)=>e,b={toAttribute(e,t){switch(t){case Boolean:e=e?_:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},y=(e,t)=>!d(e,t),x={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:y};Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;let k=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=x){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(e,i,t);void 0!==s&&l(this.prototype,e,s)}}static getPropertyDescriptor(e,t,i){const{get:s,set:o}=c(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:s,set(t){const r=s?.call(this);o?.call(this,t),this.requestUpdate(e,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??x}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const e=u(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const e=this.properties,t=[...h(e),...p(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(a(e))}else void 0!==e&&t.push(a(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,s)=>{if(i)e.adoptedStyleSheets=s.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const i of s){const s=document.createElement("style"),o=t.litNonce;void 0!==o&&s.setAttribute("nonce",o),s.textContent=i.cssText,e.appendChild(s)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,i);if(void 0!==s&&!0===i.reflect){const o=(void 0!==i.converter?.toAttribute?i.converter:b).toAttribute(t,i.type);this._$Em=e,null==o?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(e,t){const i=this.constructor,s=i._$Eh.get(e);if(void 0!==s&&this._$Em!==s){const e=i.getPropertyOptions(s),o="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:b;this._$Em=s;const r=o.fromAttribute(t,e.type);this[s]=r??this._$Ej?.get(s)??r,this._$Em=null}}requestUpdate(e,t,i){if(void 0!==e){const s=this.constructor,o=this[e];if(i??=s.getPropertyOptions(e),!((i.hasChanged??y)(o,t)||i.useDefault&&i.reflect&&o===this._$Ej?.get(e)&&!this.hasAttribute(s._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:s,wrapped:o},r){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,r??t??this[e]),!0!==o||void 0!==r)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===s&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,s=this[t];!0!==e||this._$AL.has(t)||void 0===s||this.C(t,void 0,i,s)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};k.elementStyles=[],k.shadowRootOptions={mode:"open"},k[v("elementProperties")]=new Map,k[v("finalized")]=new Map,f?.({ReactiveElement:k}),(g.reactiveElementVersions??=[]).push("2.1.1");const $=globalThis,S=$.trustedTypes,w=S?S.createPolicy("lit-html",{createHTML:e=>e}):void 0,T="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,A="?"+E,D=`<${A}>`,M=document,C=()=>M.createComment(""),I=e=>null===e||"object"!=typeof e&&"function"!=typeof e,P=Array.isArray,B="[ \t\n\f\r]",U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,z=/-->/g,O=/>/g,R=RegExp(`>|${B}(?:([^\\s"'>=/]+)(${B}*=${B}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),N=/'/g,L=/"/g,W=/^(?:script|style|textarea|title)$/i,H=(e,...t)=>({_$litType$:1,strings:e,values:t}),j=Symbol.for("lit-noChange"),V=Symbol.for("lit-nothing"),Y=new WeakMap,F=M.createTreeWalker(M,129);function Z(e,t){if(!P(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==w?w.createHTML(t):t}const J=(e,t)=>{const i=e.length-1,s=[];let o,r=2===t?"<svg>":3===t?"<math>":"",n=U;for(let t=0;t<i;t++){const i=e[t];let a,d,l=-1,c=0;for(;c<i.length&&(n.lastIndex=c,d=n.exec(i),null!==d);)c=n.lastIndex,n===U?"!--"===d[1]?n=z:void 0!==d[1]?n=O:void 0!==d[2]?(W.test(d[2])&&(o=RegExp("</"+d[2],"g")),n=R):void 0!==d[3]&&(n=R):n===R?">"===d[0]?(n=o??U,l=-1):void 0===d[1]?l=-2:(l=n.lastIndex-d[2].length,a=d[1],n=void 0===d[3]?R:'"'===d[3]?L:N):n===L||n===N?n=R:n===z||n===O?n=U:(n=R,o=void 0);const h=n===R&&e[t+1].startsWith("/>")?" ":"";r+=n===U?i+D:l>=0?(s.push(a),i.slice(0,l)+T+i.slice(l)+E+h):i+E+(-2===l?t:h)}return[Z(e,r+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),s]};class q{constructor({strings:e,_$litType$:t},i){let s;this.parts=[];let o=0,r=0;const n=e.length-1,a=this.parts,[d,l]=J(e,t);if(this.el=q.createElement(d,i),F.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(s=F.nextNode())&&a.length<n;){if(1===s.nodeType){if(s.hasAttributes())for(const e of s.getAttributeNames())if(e.endsWith(T)){const t=l[r++],i=s.getAttribute(e).split(E),n=/([.?@])?(.*)/.exec(t);a.push({type:1,index:o,name:n[2],strings:i,ctor:"."===n[1]?ee:"?"===n[1]?te:"@"===n[1]?ie:X}),s.removeAttribute(e)}else e.startsWith(E)&&(a.push({type:6,index:o}),s.removeAttribute(e));if(W.test(s.tagName)){const e=s.textContent.split(E),t=e.length-1;if(t>0){s.textContent=S?S.emptyScript:"";for(let i=0;i<t;i++)s.append(e[i],C()),F.nextNode(),a.push({type:2,index:++o});s.append(e[t],C())}}}else if(8===s.nodeType)if(s.data===A)a.push({type:2,index:o});else{let e=-1;for(;-1!==(e=s.data.indexOf(E,e+1));)a.push({type:7,index:o}),e+=E.length-1}o++}}static createElement(e,t){const i=M.createElement("template");return i.innerHTML=e,i}}function K(e,t,i=e,s){if(t===j)return t;let o=void 0!==s?i._$Co?.[s]:i._$Cl;const r=I(t)?void 0:t._$litDirective$;return o?.constructor!==r&&(o?._$AO?.(!1),void 0===r?o=void 0:(o=new r(e),o._$AT(e,i,s)),void 0!==s?(i._$Co??=[])[s]=o:i._$Cl=o),void 0!==o&&(t=K(e,o._$AS(e,t.values),o,s)),t}let Q=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,s=(e?.creationScope??M).importNode(t,!0);F.currentNode=s;let o=F.nextNode(),r=0,n=0,a=i[0];for(;void 0!==a;){if(r===a.index){let t;2===a.type?t=new G(o,o.nextSibling,this,e):1===a.type?t=new a.ctor(o,a.name,a.strings,this,e):6===a.type&&(t=new se(o,this,e)),this._$AV.push(t),a=i[++n]}r!==a?.index&&(o=F.nextNode(),r++)}return F.currentNode=M,s}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}};class G{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,s){this.type=2,this._$AH=V,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=K(this,e,t),I(e)?e===V||null==e||""===e?(this._$AH!==V&&this._$AR(),this._$AH=V):e!==this._$AH&&e!==j&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>P(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==V&&I(this._$AH)?this._$AA.nextSibling.data=e:this.T(M.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,s="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=q.createElement(Z(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(t);else{const e=new Q(s,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=Y.get(e.strings);return void 0===t&&Y.set(e.strings,t=new q(e)),t}k(e){P(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,s=0;for(const o of e)s===t.length?t.push(i=new G(this.O(C()),this.O(C()),this,this.options)):i=t[s],i._$AI(o),s++;s<t.length&&(this._$AR(i&&i._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=e.nextSibling;e.remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class X{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,s,o){this.type=1,this._$AH=V,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=V}_$AI(e,t=this,i,s){const o=this.strings;let r=!1;if(void 0===o)e=K(this,e,t,0),r=!I(e)||e!==this._$AH&&e!==j,r&&(this._$AH=e);else{const s=e;let n,a;for(e=o[0],n=0;n<o.length-1;n++)a=K(this,s[i+n],t,n),a===j&&(a=this._$AH[n]),r||=!I(a)||a!==this._$AH[n],a===V?e=V:e!==V&&(e+=(a??"")+o[n+1]),this._$AH[n]=a}r&&!s&&this.j(e)}j(e){e===V?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class ee extends X{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===V?void 0:e}}class te extends X{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==V)}}class ie extends X{constructor(e,t,i,s,o){super(e,t,i,s,o),this.type=5}_$AI(e,t=this){if((e=K(this,e,t,0)??V)===j)return;const i=this._$AH,s=e===V&&i!==V||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,o=e!==V&&(i===V||s);s&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class se{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){K(this,e)}}const oe={I:G},re=$.litHtmlPolyfillSupport;re?.(q,G),($.litHtmlVersions??=[]).push("3.3.1");const ne=globalThis;let ae=class extends k{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const s=i?.renderBefore??t;let o=s._$litPart$;if(void 0===o){const e=i?.renderBefore??null;s._$litPart$=o=new G(t.insertBefore(C(),e),e,void 0,i??{})}return o._$AI(e),o})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return j}};ae._$litElement$=!0,ae.finalized=!0,ne.litElementHydrateSupport?.({LitElement:ae});const de=ne.litElementPolyfillSupport;de?.({LitElement:ae}),(ne.litElementVersions??=[]).push("4.2.1");class le{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}}const{I:ce}=oe,he=()=>document.createComment(""),pe=(e,t,i)=>{const s=e._$AA.parentNode,o=void 0===t?e._$AB:t._$AA;if(void 0===i){const t=s.insertBefore(he(),o),r=s.insertBefore(he(),o);i=new ce(t,r,e,e.options)}else{const t=i._$AB.nextSibling,r=i._$AM,n=r!==e;if(n){let t;i._$AQ?.(e),i._$AM=e,void 0!==i._$AP&&(t=e._$AU)!==r._$AU&&i._$AP(t)}if(t!==o||n){let e=i._$AA;for(;e!==t;){const t=e.nextSibling;s.insertBefore(e,o),e=t}}}return i},ue=(e,t,i=e)=>(e._$AI(t,i),e),ge={},me=e=>{e._$AR(),e._$AA.remove()},_e=(e,t,i)=>{const s=new Map;for(let o=t;o<=i;o++)s.set(e[o],o);return s},fe=(ye=class extends le{constructor(e){if(super(e),2!==e.type)throw Error("repeat() can only be used in text expressions")}dt(e,t,i){let s;void 0===i?i=t:void 0!==t&&(s=t);const o=[],r=[];let n=0;for(const t of e)o[n]=s?s(t,n):n,r[n]=i(t,n),n++;return{values:r,keys:o}}render(e,t,i){return this.dt(e,t,i).values}update(e,[t,i,s]){const o=(e=>e._$AH)(e),{values:r,keys:n}=this.dt(t,i,s);if(!Array.isArray(o))return this.ut=n,r;const a=this.ut??=[],d=[];let l,c,h=0,p=o.length-1,u=0,g=r.length-1;for(;h<=p&&u<=g;)if(null===o[h])h++;else if(null===o[p])p--;else if(a[h]===n[u])d[u]=ue(o[h],r[u]),h++,u++;else if(a[p]===n[g])d[g]=ue(o[p],r[g]),p--,g--;else if(a[h]===n[g])d[g]=ue(o[h],r[g]),pe(e,d[g+1],o[h]),h++,g--;else if(a[p]===n[u])d[u]=ue(o[p],r[u]),pe(e,o[h],o[p]),p--,u++;else if(void 0===l&&(l=_e(n,u,g),c=_e(a,h,p)),l.has(a[h]))if(l.has(a[p])){const t=c.get(n[u]),i=void 0!==t?o[t]:null;if(null===i){const t=pe(e,o[h]);ue(t,r[u]),d[u]=t}else d[u]=ue(i,r[u]),pe(e,o[h],i),o[t]=null;u++}else me(o[p]),p--;else me(o[h]),h++;for(;u<=g;){const t=pe(e,d[g+1]);ue(t,r[u]),d[u++]=t}for(;h<=p;){const e=o[h++];null!==e&&me(e)}return this.ut=n,((e,t=ge)=>{e._$AH=t})(e,d),j}},(...e)=>({_$litDirective$:ye,values:e})),ve={attribute:!0,type:String,converter:b,reflect:!1,hasChanged:y},be=(e=ve,t,i)=>{const{kind:s,metadata:o}=i;let r=globalThis.litPropertyMetadata.get(o);if(void 0===r&&globalThis.litPropertyMetadata.set(o,r=new Map),"setter"===s&&((e=Object.create(e)).wrapped=!0),r.set(i.name,e),"accessor"===s){const{name:s}=i;return{set(i){const o=t.get.call(this);t.set.call(this,i),this.requestUpdate(s,o,e)},init(t){return void 0!==t&&this.C(s,void 0,e,t),t}}}if("setter"===s){const{name:s}=i;return function(i){const o=this[s];t.call(this,i),this.requestUpdate(s,o,e)}}throw Error("Unsupported decorator location: "+s)};var ye;function xe(e){return(t,i)=>"object"==typeof i?be(e,t,i):((e,t,i)=>{const s=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),s?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}function ke(e){return xe({...e,state:!0,attribute:!1})}const $e=["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"];function Se(e){const[t,i]=e.split(":").map(Number);return 60*t+i}function we(e){const t=e%60;return`${Math.floor(e/60).toString().padStart(2,"0")}:${t.toString().padStart(2,"0")}`}function Te(e){const t={},i=[...e].sort((e,t)=>e.endMinutes-t.endMinutes),s=i.map((e,t)=>({...e,slot:t+1}));if(s.length>0){const e=s.length-1,t=s[e];1440!==t.endMinutes&&(s[e]={...t,endTime:"24:00",endMinutes:1440})}for(let e=0;e<s.length;e++){const i=s[e];t[(e+1).toString()]={ENDTIME:i.endTime,TEMPERATURE:i.temperature}}return t}function Ee(e){const t={},i=Object.keys(e).map(e=>parseInt(e)).filter(e=>!isNaN(e)&&e>=1&&e<=13).sort((e,t)=>e-t);for(const s of i){const i=e[s.toString()];i&&(t[s]={ENDTIME:i.ENDTIME,TEMPERATURE:i.TEMPERATURE})}return t}function Ae(e){const t=Object.keys(e).map(e=>parseInt(e)).filter(e=>!isNaN(e)&&e>=1&&e<=13).sort((e,t)=>e-t);let i=0;for(const s of t){const t=e[s.toString()];if(!t)continue;if(!t.ENDTIME||void 0===t.TEMPERATURE)return{key:"slotMissingValues",params:{slot:`${s}`}};const o=Se(t.ENDTIME);if(o<i)return{key:"slotTimeBackwards",params:{slot:`${s}`,time:t.ENDTIME}};if(o>1440)return{key:"slotTimeExceedsDay",params:{slot:`${s}`,time:t.ENDTIME}};i=o}if(t.length>0){const i=e[t[t.length-1].toString()];if(i&&"24:00"!==i.ENDTIME)return{key:"lastSlotMustEnd"}}return null}function De(e){return e<12?"#3498db":e<16?"#5dade2":e<18?"#58d68d":e<20?"#f39c12":e<22?"#e67e22":"#e74c3c"}function Me(e){const[t,i]=e,s=[],o=[...i].sort((e,t)=>Se(e.STARTTIME)-Se(t.STARTTIME));for(let e=0;e<o.length;e++){const t=o[e];s.push({startTime:t.STARTTIME,startMinutes:Se(t.STARTTIME),endTime:t.ENDTIME,endMinutes:Se(t.ENDTIME),temperature:t.TEMPERATURE,slot:e+1})}return{blocks:s,baseTemperature:t}}function Ce(e,t){const i=[],s=[...e].sort((e,t)=>e.startMinutes-t.startMinutes);for(const e of s)i.push({STARTTIME:e.startTime,ENDTIME:e.endTime,TEMPERATURE:e.temperature});return[t,i]}function Ie(e){if(0===e.length)return 20;const t=new Map;for(const i of e){const e=i.endMinutes-i.startMinutes,s=t.get(i.temperature)||0;t.set(i.temperature,s+e)}let i=0,s=20;for(const[e,o]of t.entries())o>i&&(i=o,s=e);return s}function Pe(e,t=5,i=30.5){const[s,o]=e;if(s<t||s>i)return{key:"temperatureOutOfRange",params:{block:"base",min:`${t}`,max:`${i}`}};let r=0;for(let e=0;e<o.length;e++){const s=o[e];if(!s.STARTTIME||!s.ENDTIME||void 0===s.TEMPERATURE)return{key:"slotMissingValues",params:{slot:`${e+1}`}};const n=Se(s.STARTTIME),a=Se(s.ENDTIME);if(a<=n)return{key:"blockEndBeforeStart",params:{block:`${e+1}`}};if(n<r)return{key:"slotTimeBackwards",params:{slot:`${e+1}`,time:s.STARTTIME}};if(s.TEMPERATURE<t||s.TEMPERATURE>i)return{key:"temperatureOutOfRange",params:{block:`${e+1}`,min:`${t}`,max:`${i}`}};r=a}return null}const Be={en:{weekdays:{short:{monday:"Mo",tuesday:"Tu",wednesday:"We",thursday:"Th",friday:"Fr",saturday:"Sa",sunday:"Su"},long:{monday:"Monday",tuesday:"Tuesday",wednesday:"Wednesday",thursday:"Thursday",friday:"Friday",saturday:"Saturday",sunday:"Sunday"}},ui:{schedule:"Schedule",loading:"Loading schedule data...",entityNotFound:"Entity {entity} not found",clickToEdit:"Click on a day to edit its schedule",edit:"Edit {weekday}",cancel:"Cancel",save:"Save",addTimeBlock:"+ Add Time Block",copySchedule:"Copy schedule",pasteSchedule:"Paste schedule",undo:"Undo",redo:"Redo",undoShortcut:"Undo (Ctrl+Z)",redoShortcut:"Redo (Ctrl+Y)",toggleCompactView:"Compact view",toggleFullView:"Full view",exportSchedule:"Export",importSchedule:"Import",exportTooltip:"Export schedule to JSON file",importTooltip:"Import schedule from JSON file",exportSuccess:"Schedule exported successfully",importSuccess:"Schedule imported successfully",unsavedChanges:"Unsaved changes",saveAll:"Save all",discard:"Discard",enableDragDrop:"Enable drag & drop mode",disableDragDrop:"Disable drag & drop mode",confirmDiscardChanges:"You have unsaved changes. Do you want to discard them?"},errors:{failedToChangeProfile:"Failed to change profile: {error}",failedToSaveSchedule:"Failed to save schedule: {error}",failedToPasteSchedule:"Failed to paste schedule: {error}",invalidSchedule:"Invalid schedule: {error}",failedToExport:"Failed to export schedule: {error}",failedToImport:"Failed to import schedule: {error}",invalidImportFile:"Invalid file format. Please select a JSON file.",invalidImportFormat:"Invalid JSON format in file.",invalidImportData:"Invalid schedule data: {error}"},warnings:{title:"Validation Warnings",noWarnings:"No issues detected"},validationMessages:{blockEndBeforeStart:"Block {block}: End time is before start time",blockZeroDuration:"Block {block}: Block has zero duration",invalidStartTime:"Block {block}: Invalid start time",invalidEndTime:"Block {block}: Invalid end time",temperatureOutOfRange:"Block {block}: Temperature out of range ({min}-{max}°C)",invalidSlotCount:"Invalid number of slots: {count} (expected 13)",invalidSlotKey:"Invalid slot key: {key} (must be integer 1-13)",missingSlot:"Missing slot {slot}",slotMissingValues:"Slot {slot} missing ENDTIME or TEMPERATURE",slotTimeBackwards:"Slot {slot} time goes backwards: {time}",slotTimeExceedsDay:"Slot {slot} time exceeds 24:00: {time}",lastSlotMustEnd:"Last slot must end at 24:00",scheduleMustBeObject:"Schedule data must be an object",missingWeekday:"Missing weekday: {weekday}",invalidWeekdayData:"Invalid data for {weekday}",weekdayValidationError:"{weekday}: {details}"}},de:{weekdays:{short:{monday:"Mo",tuesday:"Di",wednesday:"Mi",thursday:"Do",friday:"Fr",saturday:"Sa",sunday:"So"},long:{monday:"Montag",tuesday:"Dienstag",wednesday:"Mittwoch",thursday:"Donnerstag",friday:"Freitag",saturday:"Samstag",sunday:"Sonntag"}},ui:{schedule:"Zeitplan",loading:"Zeitplandaten werden geladen...",entityNotFound:"Entität {entity} nicht gefunden",clickToEdit:"Klicken Sie auf einen Tag, um den Zeitplan zu bearbeiten",edit:"{weekday} bearbeiten",cancel:"Abbrechen",save:"Speichern",addTimeBlock:"+ Zeitblock hinzufügen",copySchedule:"Zeitplan kopieren",pasteSchedule:"Zeitplan einfügen",undo:"Rückgängig",redo:"Wiederholen",undoShortcut:"Rückgängig (Strg+Z)",redoShortcut:"Wiederholen (Strg+Y)",toggleCompactView:"Kompaktansicht",toggleFullView:"Vollansicht",exportSchedule:"Exportieren",importSchedule:"Importieren",exportTooltip:"Zeitplan als JSON-Datei exportieren",importTooltip:"Zeitplan aus JSON-Datei importieren",exportSuccess:"Zeitplan erfolgreich exportiert",importSuccess:"Zeitplan erfolgreich importiert",unsavedChanges:"Ungespeicherte Änderungen",saveAll:"Alle speichern",discard:"Verwerfen",enableDragDrop:"Drag & Drop Modus aktivieren",disableDragDrop:"Drag & Drop Modus deaktivieren",confirmDiscardChanges:"Sie haben ungespeicherte Änderungen. Möchten Sie diese verwerfen?"},errors:{failedToChangeProfile:"Fehler beim Wechseln des Profils: {error}",failedToSaveSchedule:"Fehler beim Speichern des Zeitplans: {error}",failedToPasteSchedule:"Fehler beim Einfügen des Zeitplans: {error}",invalidSchedule:"Ungültiger Zeitplan: {error}",failedToExport:"Fehler beim Exportieren des Zeitplans: {error}",failedToImport:"Fehler beim Importieren des Zeitplans: {error}",invalidImportFile:"Ungültiges Dateiformat. Bitte wählen Sie eine JSON-Datei.",invalidImportFormat:"Ungültiges JSON-Format in der Datei.",invalidImportData:"Ungültige Zeitplandaten: {error}"},warnings:{title:"Validierungswarnungen",noWarnings:"Keine Probleme erkannt"},validationMessages:{blockEndBeforeStart:"Block {block}: Die Endzeit liegt vor der Startzeit",blockZeroDuration:"Block {block}: Der Block hat keine Dauer",invalidStartTime:"Block {block}: Ungültige Startzeit",invalidEndTime:"Block {block}: Ungültige Endzeit",temperatureOutOfRange:"Block {block}: Temperatur außerhalb des Bereichs ({min}-{max}°C)",invalidSlotCount:"Ungültige Anzahl an Slots: {count} (erwartet 13)",invalidSlotKey:"Ungültiger Slot-Schlüssel: {key} (muss eine Ganzzahl 1-13 sein)",missingSlot:"Slot {slot} fehlt",slotMissingValues:"Slot {slot} fehlt ENDTIME oder TEMPERATURE",slotTimeBackwards:"Slot {slot}: Zeit läuft rückwärts: {time}",slotTimeExceedsDay:"Slot {slot}: Zeit überschreitet 24:00: {time}",lastSlotMustEnd:"Der letzte Slot muss um 24:00 enden",scheduleMustBeObject:"Zeitplandaten müssen ein Objekt sein",missingWeekday:"Fehlender Wochentag: {weekday}",invalidWeekdayData:"Ungültige Daten für {weekday}",weekdayValidationError:"{weekday}: {details}"}}};function Ue(e){const t=e.toLowerCase().split("-")[0];return Be[t]||Be.en}function ze(e,t){let i=e;for(const[e,s]of Object.entries(t))i=i.replace(`{${e}}`,s);return i}const Oe=(()=>{const e=[];for(let t=0;t<=24;t+=3)e.push({hour:t,label:`${t.toString().padStart(2,"0")}:00`,position:t/24*100});return e})();let Re=class extends ae{constructor(){super(),this._availableProfiles=[],this._isLoading=!1,this._currentTimePercent=0,this._currentTimeMinutes=0,this._historyStack=[],this._historyIndex=-1,this._translations=Ue("en"),this._isCompactView=!1,this._validationWarnings=[],this._parsedScheduleCache=new WeakMap,this._pendingChanges=new Map,this._isDragging=!1,this._isDragDropMode=!1,this._minTemp=5,this._maxTemp=30.5,this._tempStep=.5,this._keyDownHandler=this._handleKeyDown.bind(this)}setConfig(e){const t=[],i=e=>{if(!e)return;const i=e.trim();i&&(t.includes(i)||t.push(i))};if(i(e.entity),Array.isArray(e.entities)&&e.entities.forEach(e=>i(e)),0===t.length)throw new Error("You need to define at least one entity");t.sort((e,t)=>e.localeCompare(t));const s=this._activeEntityId,o=t[0],r=s&&t.includes(s)?s:o;this._config={show_profile_selector:!0,editable:!0,show_temperature:!0,temperature_unit:"°C",hour_format:"24",time_step_minutes:15,...e,entity:o,entities:[...t]},this._activeEntityId=r,this._pendingChanges.clear(),this._copiedSchedule=void 0,this._editingWeekday=void 0,this._editingBlocks=void 0,this._parsedScheduleCache=new WeakMap,this._updateLanguage()}_getPreferredLanguage(e){return e?.language||e?.locale?.language}_updateLanguage(){let e="en";if(this._config?.language)e=this._config.language;else{const t=this._getPreferredLanguage(this.hass);t&&(e=t)}this._translations=Ue(e),this._weekdayShortLabelMap=this._createWeekdayLabelMap("short"),this._weekdayLongLabelMap=this._createWeekdayLabelMap("long")}_createWeekdayLabelMap(e){const t="short"===e?this._translations.weekdays.short:this._translations.weekdays.long;return{MONDAY:t.monday,TUESDAY:t.tuesday,WEDNESDAY:t.wednesday,THURSDAY:t.thursday,FRIDAY:t.friday,SATURDAY:t.saturday,SUNDAY:t.sunday}}_getWeekdayLabel(e,t="short"){return"long"===t?(this._weekdayLongLabelMap||(this._weekdayLongLabelMap=this._createWeekdayLabelMap("long")),this._weekdayLongLabelMap[e]):(this._weekdayShortLabelMap||(this._weekdayShortLabelMap=this._createWeekdayLabelMap("short")),this._weekdayShortLabelMap[e])}_getEntityOptions(){return this._config?this._config.entities?.length?[...this._config.entities].sort((e,t)=>e.localeCompare(t)):this._config.entity?[this._config.entity]:[]:[]}_getActiveEntityId(){const e=this._getEntityOptions();if(0!==e.length)return this._activeEntityId&&e.includes(this._activeEntityId)?this._activeEntityId:e[0]}_formatValidationParams(e){if(!e)return{};const t={};for(const[i,s]of Object.entries(e))"weekday"===i&&$e.includes(s)?t.weekday=this._getWeekdayLabel(s,"long"):t[i]=s;return t}_translateValidationMessage(e){const t=this._translations.validationMessages[e.key]||e.key,i=this._formatValidationParams(e.params);return e.nested&&(i.details=this._translateValidationMessage(e.nested)),ze(t,i)}getCardSize(){return 12}connectedCallback(){super.connectedCallback(),this._updateCurrentTime(),this._timeUpdateInterval=window.setInterval(()=>{this._updateCurrentTime()},6e4),window.addEventListener("keydown",this._keyDownHandler)}disconnectedCallback(){super.disconnectedCallback(),void 0!==this._timeUpdateInterval&&(clearInterval(this._timeUpdateInterval),this._timeUpdateInterval=void 0),void 0!==this._loadingTimeoutId&&(clearTimeout(this._loadingTimeoutId),this._loadingTimeoutId=void 0),window.removeEventListener("keydown",this._keyDownHandler)}_updateCurrentTime(){const e=new Date,t=60*e.getHours()+e.getMinutes();this._currentTimePercent=t/1440*100,this._currentTimeMinutes=t;const i=e.getDay();this._currentWeekday=["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"][i]}_isBlockActive(e,t){return!(!this._currentWeekday||this._currentWeekday!==e)&&this._currentTimeMinutes>=t.startMinutes&&this._currentTimeMinutes<t.endMinutes}_handleKeyDown(e){if(!this._editingWeekday||!this._editingBlocks)return;const t=e.ctrlKey||e.metaKey;t&&"z"===e.key&&!e.shiftKey?(e.preventDefault(),this._undo()):t&&("y"===e.key||"z"===e.key&&e.shiftKey)&&(e.preventDefault(),this._redo())}_saveHistoryState(){if(!this._editingBlocks)return;const e=JSON.parse(JSON.stringify(this._editingBlocks));this._historyStack=this._historyStack.slice(0,this._historyIndex+1),this._historyStack.push(e),this._historyIndex++,this._historyStack.length>50&&(this._historyStack.shift(),this._historyIndex--)}_undo(){this._historyIndex<=0||(this._historyIndex--,this._editingBlocks=JSON.parse(JSON.stringify(this._historyStack[this._historyIndex])),this._updateValidationWarnings())}_redo(){this._historyIndex>=this._historyStack.length-1||(this._historyIndex++,this._editingBlocks=JSON.parse(JSON.stringify(this._historyStack[this._historyIndex])),this._updateValidationWarnings())}_canUndo(){return this._historyIndex>0}_canRedo(){return this._historyIndex<this._historyStack.length-1}_toggleViewMode(){this._isCompactView=!this._isCompactView}_toggleDragDropMode(){this._isDragDropMode&&this._pendingChanges.size>0?confirm(this._translations.ui.confirmDiscardChanges)&&(this._discardPendingChanges(),this._isDragDropMode=!1):this._isDragDropMode=!this._isDragDropMode}shouldUpdate(e){if(e.has("_config"))return!0;if(e.has("hass")){const t=e.get("hass"),i=this.hass;if(!this._config)return!1;if(!t||!i)return!0;const s=this._getActiveEntityId();if(!s)return!0;const o=t.states?.[s],r=i.states?.[s];return o!==r||(i?.language||i?.locale?.language)!==(t?.language||t?.locale?.language)}return!0}updated(e){if(super.updated(e),e.has("hass")&&this._config){this._updateFromEntity();const t=e.get("hass");this._getPreferredLanguage(this.hass)!==this._getPreferredLanguage(t)&&this._updateLanguage()}}_updateFromEntity(){if(!this.hass||!this._config)return;const e=this._getActiveEntityId();if(!e)return this._currentProfile=void 0,this._scheduleData=void 0,this._simpleScheduleData=void 0,this._availableProfiles=[],void this._pendingChanges.clear();const t=this.hass.states?.[e];if(!t)return this._currentProfile=void 0,this._scheduleData=void 0,this._simpleScheduleData=void 0,this._availableProfiles=[],void this._pendingChanges.clear();const i=t.attributes;this._currentProfile=this._config.profile||i.active_profile,this._simpleScheduleData=i.simple_schedule_data,this._scheduleData=i.schedule_data,this._availableProfiles=(i.available_profiles||[]).slice().sort((e,t)=>e.localeCompare(t)),this._minTemp=i.min_temp??5,this._maxTemp=i.max_temp??30.5,this._tempStep=i.target_temp_step??.5,this._parsedScheduleCache=new WeakMap}_getBaseTemperature(e){if(this._simpleScheduleData){const t=this._simpleScheduleData[e];if(t){const{baseTemperature:e}=Me(t);return e}}return 20}_getParsedBlocks(e){if(this._pendingChanges.has(e))return this._pendingChanges.get(e);if(this._simpleScheduleData){const t=this._simpleScheduleData[e];if(!t)return[];const i=this._parsedScheduleCache.get(t);if(i)return i;const{blocks:s}=Me(t);return this._parsedScheduleCache.set(t,s),s}if(this._scheduleData){const t=this._scheduleData[e];if(!t)return[];const i=this._parsedScheduleCache.get(t);if(i)return i;const s=function(e){const t=[];let i="00:00",s=0;const o=Object.entries(e).map(([e,t])=>({slot:parseInt(e),data:t})).sort((e,t)=>e.slot-t.slot);for(const{slot:e,data:r}of o){if(!r||"string"!=typeof r.ENDTIME||void 0===r.TEMPERATURE)continue;const o=r.ENDTIME,n=Se(o);if(n>s&&n<=1440&&(t.push({startTime:i,startMinutes:s,endTime:o,endMinutes:n,temperature:r.TEMPERATURE,slot:e}),i=o,s=n),n>=1440)break}return t}(t);return this._parsedScheduleCache.set(t,s),s}return[]}async _handleProfileChange(e){const t=e.target.value,i=this._getActiveEntityId();if(this._config&&this.hass&&i)try{await this.hass.callService("homematicip_local","set_schedule_active_profile",{entity_id:i,profile:t}),this._currentProfile=t}catch(e){alert(ze(this._translations.errors.failedToChangeProfile,{error:String(e)}))}}_updateValidationWarnings(){this._validationWarnings=this._editingBlocks?function(e,t=5,i=30.5){const s=[];if(0===e.length)return s;for(let t=0;t<e.length-1;t++){const i=e[t];i.endMinutes<i.startMinutes&&s.push({key:"blockEndBeforeStart",params:{block:`${t+1}`}}),i.endMinutes===i.startMinutes&&s.push({key:"blockZeroDuration",params:{block:`${t+1}`}})}const o=e[e.length-1];return o.endMinutes<o.startMinutes&&s.push({key:"blockEndBeforeStart",params:{block:`${e.length}`}}),e.forEach((e,o)=>{(e.startMinutes<0||e.startMinutes>1440)&&s.push({key:"invalidStartTime",params:{block:`${o+1}`}}),(e.endMinutes<0||e.endMinutes>1440)&&s.push({key:"invalidEndTime",params:{block:`${o+1}`}}),(e.temperature<t||e.temperature>i)&&s.push({key:"temperatureOutOfRange",params:{block:`${o+1}`,min:`${t}`,max:`${i}`}})}),s}(this._editingBlocks,this._minTemp,this._maxTemp):[]}_handleWeekdayClick(e){if(this._config?.editable&&(this._simpleScheduleData||this._scheduleData)&&!this._isDragDropMode){if(this._editingWeekday=e,this._editingBlocks=this._getParsedBlocks(e),this._simpleScheduleData){const t=this._simpleScheduleData[e];if(t){const{baseTemperature:e}=Me(t);this._editingBaseTemperature=e}else this._editingBaseTemperature=20}else this._editingBaseTemperature=Ie(this._editingBlocks);this._historyStack=[JSON.parse(JSON.stringify(this._editingBlocks))],this._historyIndex=0,this._updateValidationWarnings()}}_closeEditor(){this._editingWeekday=void 0,this._editingBlocks=void 0,this._editingBaseTemperature=void 0,this._historyStack=[],this._historyIndex=-1}_snapToQuarterHour(e){return 15*Math.round(e/15)}_startDrag(e,t,i,s){if(!this._config?.editable)return;e.preventDefault(),e.stopPropagation();const o=e instanceof MouseEvent?e.clientY:e.touches[0].clientY,r=this._pendingChanges.get(t)||this._getParsedBlocks(t);this._dragState={weekday:t,blockIndex:i,boundary:s,initialY:o,initialMinutes:"start"===s?r[i].startMinutes:"end"===s?r[i].endMinutes:0,initialTemperature:"temperature"===s?r[i].temperature:void 0,originalBlocks:JSON.parse(JSON.stringify(r))},this._isDragging=!0;const n=e=>{(e instanceof MouseEvent||e instanceof TouchEvent)&&this._onDragMove(e)},a=()=>this._endDrag(n,a);document.addEventListener("mousemove",n),document.addEventListener("touchmove",n,{passive:!1}),document.addEventListener("mouseup",a),document.addEventListener("touchend",a)}_onDragMove(e){if(!this._dragState)return;e.preventDefault();const t=(e instanceof MouseEvent?e.clientY:e.touches[0].clientY)-this._dragState.initialY,{blockIndex:i,boundary:s,weekday:o}=this._dragState,r=[...this._dragState.originalBlocks];if("temperature"===s){const e=Math.round(-t/50/this._tempStep)*this._tempStep,s=Math.max(this._minTemp,Math.min(this._maxTemp,(this._dragState.initialTemperature||20)+e));return r[i]={...r[i],temperature:s},this._pendingChanges.set(o,r),void this.requestUpdate()}const n=this.shadowRoot?.querySelector(".schedule-grid");if(!n)return;const a=this._snapToQuarterHour(this._dragState.initialMinutes+t*(1440/n.clientHeight));if("start"===s){const e=Math.max(i>0?r[i-1].endMinutes:0,Math.min(r[i].endMinutes-15,a));i>0&&(r[i-1]={...r[i-1],endMinutes:e,endTime:we(e)}),r[i]={...r[i],startMinutes:e,startTime:we(e)}}else if("end"===s){const e=Math.max(r[i].startMinutes+15,Math.min(i<r.length-1?r[i+1].endMinutes:1440,a));r[i]={...r[i],endMinutes:e,endTime:we(e)},i<r.length-1&&(r[i+1]={...r[i+1],startMinutes:e,startTime:we(e)})}this._pendingChanges.set(o,r),this.requestUpdate()}_endDrag(e,t){this._isDragging=!1,this._dragState=void 0,document.removeEventListener("mousemove",e),document.removeEventListener("touchmove",e),document.removeEventListener("mouseup",t),document.removeEventListener("touchend",t),this.requestUpdate()}async _savePendingChanges(){const e=this._getActiveEntityId();if(this._config&&this.hass&&this._currentProfile&&0!==this._pendingChanges.size&&e){this._isLoading=!0,this._loadingTimeoutId=window.setTimeout(()=>{this._isLoading=!1,this._loadingTimeoutId=void 0},1e4);try{for(const[t,i]of this._pendingChanges){const s=Te(i),o=Ae(s);if(o){const e=this._translateValidationMessage(o),i=this._getWeekdayLabel(t,"long");throw new Error(`${i}: ${e}`)}const r=Ee(s);await this.hass.callService("homematicip_local","set_schedule_profile_weekday",{entity_id:e,profile:this._currentProfile,weekday:t,weekday_data:r}),this._scheduleData&&(this._scheduleData={...this._scheduleData,[t]:s})}this._pendingChanges.clear(),this._updateFromEntity(),this.requestUpdate()}catch(e){alert(ze(this._translations.errors.failedToSaveSchedule,{error:String(e)}))}finally{void 0!==this._loadingTimeoutId&&(clearTimeout(this._loadingTimeoutId),this._loadingTimeoutId=void 0),this._isLoading=!1}}}_discardPendingChanges(){this._pendingChanges.clear(),this.requestUpdate()}async _saveSchedule(){if(!(this._config&&this.hass&&this._editingWeekday&&this._editingBlocks&&this._currentProfile&&void 0!==this._editingBaseTemperature))return;const e=this._getActiveEntityId();if(!e)return;const t=Ce(this._editingBlocks,this._editingBaseTemperature),i=Pe(t,this._minTemp,this._maxTemp);if(i){const e=this._translateValidationMessage(i);return void alert(ze(this._translations.errors.invalidSchedule,{error:e}))}this._isLoading=!0,this._loadingTimeoutId=window.setTimeout(()=>{this._isLoading=!1,this._loadingTimeoutId=void 0},1e4);try{await this.hass.callService("homematicip_local","set_schedule_simple_weekday",{entity_id:e,profile:this._currentProfile,weekday:this._editingWeekday,simple_weekday_data:t}),this._simpleScheduleData&&(this._simpleScheduleData={...this._simpleScheduleData,[this._editingWeekday]:t}),this._updateFromEntity(),this.requestUpdate(),this._closeEditor()}catch(e){alert(ze(this._translations.errors.failedToSaveSchedule,{error:String(e)}))}finally{void 0!==this._loadingTimeoutId&&(clearTimeout(this._loadingTimeoutId),this._loadingTimeoutId=void 0),this._isLoading=!1}}_copySchedule(e){if(!this._simpleScheduleData&&!this._scheduleData)return;const t=this._getParsedBlocks(e);let i;if(this._simpleScheduleData){const t=this._simpleScheduleData[e];t&&(i=Me(t).baseTemperature)}else i=Ie(t);this._copiedSchedule={weekday:e,blocks:JSON.parse(JSON.stringify(t)),baseTemperature:i}}async _pasteSchedule(e){if(!(this._config&&this.hass&&this._currentProfile&&this._copiedSchedule))return;const t=this._getActiveEntityId();if(!t)return;const i=this._copiedSchedule.baseTemperature??Ie(this._copiedSchedule.blocks),s=Ce(this._copiedSchedule.blocks,i),o=Pe(s,this._minTemp,this._maxTemp);if(o){const e=this._translateValidationMessage(o);return void alert(ze(this._translations.errors.invalidSchedule,{error:e}))}this._isLoading=!0,this._loadingTimeoutId=window.setTimeout(()=>{this._isLoading=!1,this._loadingTimeoutId=void 0},1e4);try{await this.hass.callService("homematicip_local","set_schedule_simple_weekday",{entity_id:t,profile:this._currentProfile,weekday:e,simple_weekday_data:s}),this._simpleScheduleData&&(this._simpleScheduleData={...this._simpleScheduleData,[e]:s}),this._updateFromEntity(),this.requestUpdate()}catch(e){alert(ze(this._translations.errors.failedToPasteSchedule,{error:String(e)}))}finally{void 0!==this._loadingTimeoutId&&(clearTimeout(this._loadingTimeoutId),this._loadingTimeoutId=void 0),this._isLoading=!1}}_exportSchedule(){if(!this._currentProfile)return;const e=this._simpleScheduleData||this._scheduleData;if(e)try{const t={version:this._simpleScheduleData?"2.0":"1.0",profile:this._currentProfile,exported:(new Date).toISOString(),scheduleData:e,format:this._simpleScheduleData?"simple":"legacy"},i=JSON.stringify(t,null,2),s=new Blob([i],{type:"application/json"}),o=URL.createObjectURL(s),r=document.createElement("a");r.href=o,r.download=`schedule-${this._currentProfile}-${(new Date).toISOString().split("T")[0]}.json`,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(o)}catch(e){alert(ze(this._translations.errors.failedToExport,{error:String(e)}))}}_importSchedule(){const e=document.createElement("input");e.type="file",e.accept=".json,application/json",e.onchange=async e=>{const t=e.target.files?.[0];if(t)if(t.name.endsWith(".json")||"application/json"===t.type)try{const e=await t.text();let i;try{i=JSON.parse(e)}catch{return void alert(this._translations.errors.invalidImportFormat)}if(!i||"object"!=typeof i)return void alert(this._translations.errors.invalidImportFormat);let s,o,r=!1;if("scheduleData"in i?(s=i.scheduleData,r="simple"===("format"in i?i.format:void 0)||"2.0"===("version"in i?i.version:void 0)):(s=i,r=Array.isArray(s&&"object"==typeof s&&"MONDAY"in s?s.MONDAY:null)),o=r?function(e){if(!e||"object"!=typeof e)return{key:"scheduleMustBeObject"};const t=e,i=["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"];for(const e of i){if(!(e in t))return{key:"missingWeekday",params:{weekday:e}};const i=t[e];if(!Array.isArray(i)||2!==i.length)return{key:"invalidWeekdayData",params:{weekday:e}};const s=Pe(i);if(s)return{key:"weekdayValidationError",params:{weekday:e},nested:s}}return null}(s):function(e){if(!e||"object"!=typeof e)return{key:"scheduleMustBeObject"};const t=e,i=["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"];for(const e of i){if(!(e in t))return{key:"missingWeekday",params:{weekday:e}};const i=t[e];if(!i||"object"!=typeof i)return{key:"invalidWeekdayData",params:{weekday:e}};const s=Ae(i);if(s)return{key:"weekdayValidationError",params:{weekday:e},nested:s}}return null}(s),o){const e=this._translateValidationMessage(o);return void alert(ze(this._translations.errors.invalidImportData,{error:e}))}const n=this._getActiveEntityId();if(!(this._config&&this.hass&&this._currentProfile&&n))return;this._isLoading=!0,this._loadingTimeoutId=window.setTimeout(()=>{this._isLoading=!1,this._loadingTimeoutId=void 0},1e4);try{if(r){const e=s;for(const t of $e){const i=e[t];i&&await this.hass.callService("homematicip_local","set_schedule_simple_weekday",{entity_id:n,profile:this._currentProfile,weekday:t,simple_weekday_data:i})}this._simpleScheduleData=e}else{const e=s;for(const t of $e){const i=e[t];if(i){const e=Ee(i);await this.hass.callService("homematicip_local","set_schedule_profile_weekday",{entity_id:n,profile:this._currentProfile,weekday:t,weekday_data:e})}}this._scheduleData=e}this._updateFromEntity(),this.requestUpdate(),alert(this._translations.ui.importSuccess)}catch(e){alert(ze(this._translations.errors.failedToImport,{error:String(e)}))}finally{void 0!==this._loadingTimeoutId&&(clearTimeout(this._loadingTimeoutId),this._loadingTimeoutId=void 0),this._isLoading=!1}}catch(e){alert(ze(this._translations.errors.failedToImport,{error:String(e)}))}else alert(this._translations.errors.invalidImportFile)},e.click()}_addTimeBlock(){if(!this._editingBlocks)return;const e=this._editingBlocks[this._editingBlocks.length-1],t=e?e.endMinutes:0,i=Math.min(t+60,1440);i>t&&this._editingBlocks.length<12&&(this._saveHistoryState(),this._editingBlocks=[...this._editingBlocks,{startTime:we(t),startMinutes:t,endTime:we(i),endMinutes:i,temperature:20,slot:this._editingBlocks.length+1}],this._updateValidationWarnings())}_removeTimeBlock(e){!this._editingBlocks||this._editingBlocks.length<=1||(this._saveHistoryState(),this._editingBlocks=this._editingBlocks.filter((t,i)=>i!==e),this._editingBlocks=this._editingBlocks.map((e,t)=>({...e,slot:t+1})),this._updateValidationWarnings())}_updateTimeBlock(e,t){if(this._editingBlocks){this._saveHistoryState(),this._editingBlocks=this._editingBlocks.map((i,s)=>{if(s!==e)return i;const o={...i,...t};return t.endTime&&(o.endMinutes=Se(t.endTime)),o});for(let t=e+1;t<this._editingBlocks.length;t++){const e=this._editingBlocks[t-1];this._editingBlocks[t]={...this._editingBlocks[t],startTime:e.endTime,startMinutes:e.endMinutes}}this._editingBlocks=[...this._editingBlocks],this._updateValidationWarnings()}}render(){if(!this._config||!this.hass)return H``;const e=this._getEntityOptions(),t=e.length>1,i=this._getActiveEntityId(),s=i?this.hass.states?.[i]:void 0,o=t?this._renderEntitySelector(e,i):this._config.name||s?.attributes.friendly_name||this._translations.ui.schedule;return s?H`
      <ha-card>
        <div class="card-header">
          <div class="name">${o}</div>
        </div>
        <div class="header-controls">
          ${this._config.show_profile_selector&&this._availableProfiles.length>0?H`
                <select
                  class="profile-selector"
                  @change=${this._handleProfileChange}
                  .value=${this._currentProfile||""}
                >
                  ${this._availableProfiles.map(e=>H`
                      <option value=${e} ?selected=${e===this._currentProfile}>
                        ${e}
                      </option>
                    `)}
                </select>
              `:""}
          ${this._config?.editable?H`
                <button
                  class="dragdrop-toggle-btn ${this._isDragDropMode?"active":""}"
                  @click=${this._toggleDragDropMode}
                  title="${this._isDragDropMode?this._translations.ui.disableDragDrop:this._translations.ui.enableDragDrop}"
                >
                  ${this._isDragDropMode?"🔒":"✋"}
                </button>
              `:""}
          <button
            class="view-toggle-btn"
            @click=${this._toggleViewMode}
            title="${this._isCompactView?this._translations.ui.toggleFullView:this._translations.ui.toggleCompactView}"
          >
            ${this._isCompactView?"⬜":"▭"}
          </button>
          <button
            class="export-btn"
            @click=${this._exportSchedule}
            title="${this._translations.ui.exportTooltip}"
            ?disabled=${!this._scheduleData}
          >
            ⬇️
          </button>
          <button
            class="import-btn"
            @click=${this._importSchedule}
            title="${this._translations.ui.importTooltip}"
          >
            ⬆️
          </button>
        </div>

        <div class="card-content">
          ${this._editingWeekday?this._renderEditor():this._scheduleData?this._renderScheduleView():H`<div class="loading">${this._translations.ui.loading}</div>`}
        </div>

        ${this._isLoading?H`
              <div class="loading-overlay">
                <div class="loading-spinner"></div>
              </div>
            `:""}
      </ha-card>
    `:H`
        <ha-card>
          <div class="card-header">
            <div class="name">${o}</div>
          </div>
          <div class="card-content">
            <div class="error">
              ${ze(this._translations.ui.entityNotFound,{entity:i||this._translations.ui.schedule})}
            </div>
          </div>
        </ha-card>
      `}_renderScheduleView(){return this._simpleScheduleData||this._scheduleData?H`
      <div
        class="schedule-container ${this._isCompactView?"compact":""} ${this._isDragDropMode?"drag-drop-mode":""}"
      >
        <!-- Time axis on the left -->
        <div class="time-axis">
          <div class="time-axis-header"></div>
          <div class="time-axis-labels">
            ${fe(Oe,e=>e.hour,e=>H`
                <div class="time-label" style="top: ${e.position}%">${e.label}</div>
              `)}
          </div>
        </div>

        <!-- Schedule grid -->
        <div class="schedule-grid ${this._isCompactView?"compact":""}">
          ${fe($e,e=>e,e=>{let t=this._getParsedBlocks(e);if(!t||0===t.length){const i=this._getBaseTemperature(e);t=[{startTime:"00:00",startMinutes:0,endTime:"24:00",endMinutes:1440,temperature:i,slot:0}]}const i=this._copiedSchedule?.weekday===e;return H`
                <div class="weekday-column ${this._config?.editable?"editable":""}">
                  <div class="weekday-header">
                    <div class="weekday-label">${this._getWeekdayLabel(e,"short")}</div>
                    ${this._config?.editable?H`
                          <div class="weekday-actions">
                            <button
                              class="copy-btn ${i?"active":""}"
                              @click=${t=>{t.stopPropagation(),this._copySchedule(e)}}
                              title="${this._translations.ui.copySchedule}"
                            >
                              📋
                            </button>
                            <button
                              class="paste-btn"
                              @click=${t=>{t.stopPropagation(),this._pasteSchedule(e)}}
                              title="${this._translations.ui.pasteSchedule}"
                              ?disabled=${!this._copiedSchedule}
                            >
                              📄
                            </button>
                          </div>
                        `:""}
                  </div>
                  <div
                    class="time-blocks"
                    @click=${()=>this._config?.editable&&this._handleWeekdayClick(e)}
                  >
                    ${fe(t,e=>e.slot,(i,s)=>{const o=this._isBlockActive(e,i);let r;if(this._config?.show_gradient){r=`background: ${function(e,t,i){const s=De(e);return null===t&&null===i?s:null!==t&&null===i?`linear-gradient(to bottom, ${De(t)}, ${s})`:null===t&&null!==i?`linear-gradient(to bottom, ${s}, ${De(i)})`:`linear-gradient(to bottom, ${De(t)}, ${s} 50%, ${De(i)})`}(i.temperature,s>0?t[s-1].temperature:null,s<t.length-1?t[s+1].temperature:null)};`}else r=`background-color: ${De(i.temperature)};`;return H`
                          <div
                            class="time-block ${o?"active":""} ${this._pendingChanges.has(e)?"pending":""}"
                            style="
                              height: ${(i.endMinutes-i.startMinutes)/1440*100}%;
                              ${r}
                            "
                          >
                            ${this._config?.editable&&this._isDragDropMode&&s>0?H`
                                  <div
                                    class="drag-handle drag-handle-top"
                                    @mousedown=${t=>{t.stopPropagation(),this._startDrag(t,e,s,"start")}}
                                    @touchstart=${t=>{t.stopPropagation(),this._startDrag(t,e,s,"start")}}
                                  ></div>
                                `:""}
                            ${this._config?.editable&&this._isDragDropMode?H`
                                  <div
                                    class="temperature-drag-area"
                                    @mousedown=${t=>{t.stopPropagation(),this._startDrag(t,e,s,"temperature")}}
                                    @touchstart=${t=>{t.stopPropagation(),this._startDrag(t,e,s,"temperature")}}
                                  >
                                    ${this._config?.show_temperature?H`<span class="temperature"
                                          >${i.temperature.toFixed(1)}°</span
                                        >`:""}
                                  </div>
                                `:this._config?.show_temperature?H`<span class="temperature"
                                    >${i.temperature.toFixed(1)}°</span
                                  >`:""}
                            <div class="time-block-tooltip">
                              <div class="tooltip-time">${i.startTime} - ${i.endTime}</div>
                              <div class="tooltip-temp">
                                ${function(e,t="°C"){return`${e.toFixed(1)}${t}`}(i.temperature,this._config?.temperature_unit)}
                              </div>
                            </div>
                            ${this._config?.editable&&this._isDragDropMode&&s<t.length-1?H`
                                  <div
                                    class="drag-handle drag-handle-bottom"
                                    @mousedown=${t=>{t.stopPropagation(),this._startDrag(t,e,s,"end")}}
                                    @touchstart=${t=>{t.stopPropagation(),this._startDrag(t,e,s,"end")}}
                                  ></div>
                                `:""}
                          </div>
                        `})}
                  </div>
                </div>
              `})}

          <!-- Current time indicator line -->
          <div class="current-time-indicator" style="top: ${this._currentTimePercent}%"></div>
        </div>
      </div>

      ${this._pendingChanges.size>0?H`
            <div class="pending-changes-banner">
              <div class="pending-changes-info">
                <span class="pending-icon">⚠️</span>
                <span class="pending-text">${this._translations.ui.unsavedChanges}</span>
              </div>
              <div class="pending-changes-actions">
                <button class="discard-btn" @click=${this._discardPendingChanges}>
                  ${this._translations.ui.discard}
                </button>
                <button class="save-all-btn" @click=${this._savePendingChanges}>
                  ${this._translations.ui.saveAll}
                </button>
              </div>
            </div>
          `:""}
      ${this._config?.editable&&0===this._pendingChanges.size?H`<div class="hint">${this._translations.ui.clickToEdit}</div>`:""}
    `:H``}_renderEntitySelector(e,t){const i=t&&e.includes(t)?t:e[0];return H`
      <select
        class="profile-selector entity-selector"
        @change=${this._handleEntitySelection}
        .value=${i}
      >
        ${[...e].sort((e,t)=>e.localeCompare(t)).map(e=>H`<option value=${e}>${this.hass?.states?.[e]?.attributes.friendly_name||e}</option>`)}
      </select>
    `}_handleEntitySelection(e){const t=e.target.value;t&&t!==this._getActiveEntityId()&&(this._activeEntityId=t,this._pendingChanges.clear(),this._editingWeekday=void 0,this._editingBlocks=void 0,this._copiedSchedule=void 0,this._validationWarnings=[],this._isDragDropMode=!1,this._isDragging=!1,this._dragState=void 0,this._parsedScheduleCache=new WeakMap,this._updateFromEntity())}_renderEditor(){return this._editingWeekday&&this._editingBlocks?H`
      <div class="editor">
        <div class="editor-header">
          <h3>
            ${ze(this._translations.ui.edit,{weekday:this._getWeekdayLabel(this._editingWeekday,"long")})}
          </h3>
          <div class="editor-actions">
            <button
              class="undo-btn"
              @click=${this._undo}
              ?disabled=${!this._canUndo()}
              title="${this._translations.ui.undoShortcut}"
            >
              ↶
            </button>
            <button
              class="redo-btn"
              @click=${this._redo}
              ?disabled=${!this._canRedo()}
              title="${this._translations.ui.redoShortcut}"
            >
              ↷
            </button>
            <button class="close-btn" @click=${this._closeEditor}>✕</button>
          </div>
        </div>

        ${this._validationWarnings.length>0?H`
              <div class="validation-warnings">
                <div class="warnings-header">
                  <span class="warning-icon">⚠️</span>
                  <span class="warnings-title">${this._translations.warnings.title}</span>
                </div>
                <ul class="warnings-list">
                  ${this._validationWarnings.map(e=>H`<li class="warning-item">
                        ${this._translateValidationMessage(e)}
                      </li>`)}
                </ul>
              </div>
            `:""}

        <!-- Base Temperature Section -->
        <div class="base-temperature-section">
          <div class="base-temperature-header">
            <span class="base-temp-label">Base Temperature</span>
            <span class="base-temp-description">Temperature for unscheduled periods</span>
          </div>
          <div class="base-temperature-input">
            <input
              type="number"
              class="temp-input base-temp-input"
              .value=${this._editingBaseTemperature?.toString()||"20.0"}
              step=${this._tempStep}
              min=${this._minTemp}
              max=${this._maxTemp}
              @change=${e=>{this._editingBaseTemperature=parseFloat(e.target.value),this.requestUpdate()}}
            />
            <span class="temp-unit">${this._config?.temperature_unit||"°C"}</span>
            <div
              class="color-indicator"
              style="background-color: ${De(this._editingBaseTemperature||20)}"
            ></div>
          </div>
        </div>

        <div class="editor-content-label">Temperature Periods</div>
        <div class="editor-content">
          ${this._editingBlocks.map((e,t)=>{const i=t>0?this._editingBlocks[t-1]:null,s=t<this._editingBlocks.length-1?this._editingBlocks[t+1]:null;return H`
              <div class="time-block-editor">
                <div class="block-number">${t+1}</div>
                <input
                  type="time"
                  class="time-input"
                  .value=${e.endTime}
                  min=${i?i.endTime:"00:00"}
                  max=${s?s.endTime:"24:00"}
                  step="${60*(this._config?.time_step_minutes||15)}"
                  @change=${e=>this._updateTimeBlock(t,{endTime:e.target.value})}
                />
                <input
                  type="number"
                  class="temp-input"
                  .value=${e.temperature.toString()}
                  step=${this._tempStep}
                  min=${this._minTemp}
                  max=${this._maxTemp}
                  @change=${e=>this._updateTimeBlock(t,{temperature:parseFloat(e.target.value)})}
                />
                <span class="temp-unit">${this._config?.temperature_unit||"°C"}</span>
                ${this._editingBlocks.length>1?H`
                      <button class="remove-btn" @click=${()=>this._removeTimeBlock(t)}>
                        🗑️
                      </button>
                    `:""}
                <div
                  class="color-indicator"
                  style="background-color: ${De(e.temperature)}"
                ></div>
              </div>
            `})}
          ${this._editingBlocks.length<12?H`
                <button class="add-btn" @click=${this._addTimeBlock}>
                  ${this._translations.ui.addTimeBlock}
                </button>
              `:""}
        </div>

        <div class="editor-footer">
          <button class="cancel-btn" @click=${this._closeEditor}>
            ${this._translations.ui.cancel}
          </button>
          <button class="save-btn" @click=${this._saveSchedule}>
            ${this._translations.ui.save}
          </button>
        </div>
      </div>
    `:H``}static get styles(){return n`
      :host {
        display: block;
      }

      ha-card {
        padding: 16px;
      }

      .card-header {
        display: block;
        margin-bottom: 8px;
      }

      .name {
        font-size: 24px;
        font-weight: 400;
        color: var(--primary-text-color);
        margin-bottom: 8px;
      }

      .header-controls {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin-bottom: 24px;
      }

      .profile-selector {
        padding: 8px 12px;
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        background-color: var(--card-background-color);
        color: var(--primary-text-color);
        font-size: 14px;
        cursor: pointer;
      }

      .entity-selector {
        width: 100%;
        font-size: 16px;
      }

      .view-toggle-btn {
        padding: 8px 12px;
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        background-color: var(--card-background-color);
        color: var(--primary-text-color);
        font-size: 18px;
        cursor: pointer;
        transition: background-color 0.2s;
        line-height: 1;
      }

      .view-toggle-btn:hover {
        background-color: var(--divider-color);
      }

      .export-btn,
      .import-btn {
        padding: 8px 12px;
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        background-color: var(--card-background-color);
        color: var(--primary-text-color);
        font-size: 18px;
        cursor: pointer;
        transition: background-color 0.2s;
        line-height: 1;
      }

      .export-btn:hover,
      .import-btn:hover {
        background-color: var(--divider-color);
      }

      .export-btn:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }

      .export-btn:disabled:hover {
        background-color: var(--card-background-color);
      }

      .card-content {
        position: relative;
      }

      .schedule-container {
        display: flex;
        gap: 8px;
        min-height: 400px;
        overflow-x: auto;
        overflow-y: visible;
        width: 100%;
        box-sizing: border-box;
      }

      /* Time axis on the left */
      .time-axis {
        display: flex;
        flex-direction: column;
        min-width: 50px;
        flex-shrink: 0;
      }

      .time-axis-header {
        height: 36px;
        flex-shrink: 0;
      }

      .time-axis-labels {
        position: relative;
        flex: 1;
        border-right: 2px solid var(--divider-color);
      }

      .time-label {
        position: absolute;
        right: 8px;
        transform: translateY(-50%);
        font-size: 11px;
        color: var(--secondary-text-color);
        white-space: nowrap;
      }

      .schedule-grid {
        display: grid;
        grid-template-columns: repeat(7, minmax(0, 1fr));
        gap: 8px;
        flex: 1;
        min-width: 0;
        overflow: visible;
        position: relative;
      }

      /* Compact view styles */
      .schedule-container.compact {
        gap: 4px;
      }

      .schedule-grid.compact {
        gap: 4px;
      }

      .schedule-grid.compact .weekday-column {
        min-width: 50px;
      }

      .schedule-grid.compact .weekday-header {
        padding: 2px 4px;
        font-size: 11px;
      }

      .schedule-grid.compact .weekday-label {
        font-size: 11px;
      }

      .schedule-grid.compact .weekday-actions {
        display: none;
      }

      .schedule-grid.compact .temperature {
        font-size: 10px;
      }

      .current-time-indicator {
        position: absolute;
        left: 0;
        right: 0;
        height: 2px;
        background-color: var(--error-color, #ff0000);
        border-top: 2px dashed var(--error-color, #ff0000);
        pointer-events: none;
        z-index: 100;
        transform: translateY(-50%);
        box-shadow: 0 0 4px rgba(255, 0, 0, 0.5);
        will-change: top;
      }

      .current-time-indicator::before {
        content: "";
        position: absolute;
        left: -6px;
        top: 50%;
        transform: translateY(-50%);
        width: 8px;
        height: 8px;
        background-color: var(--error-color, #ff0000);
        border-radius: 50%;
        box-shadow: 0 0 4px rgba(255, 0, 0, 0.7);
      }

      .weekday-column {
        display: flex;
        flex-direction: column;
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        overflow: visible;
      }

      .weekday-column.editable .time-blocks {
        cursor: pointer;
      }

      .weekday-column.editable {
        will-change: transform, box-shadow;
      }

      .weekday-column.editable:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }

      /* Disable hover effects when in drag & drop mode */
      .schedule-container.drag-drop-mode .weekday-column.editable:hover {
        transform: none;
        box-shadow: none;
      }

      .weekday-header {
        padding: 4px 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        background-color: var(--primary-color);
        color: var(--text-primary-color);
      }

      .weekday-label {
        font-weight: 500;
        font-size: 14px;
      }

      .weekday-actions {
        display: flex;
        gap: 4px;
      }

      .copy-btn,
      .paste-btn {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 14px;
        padding: 2px 4px;
        border-radius: 3px;
        transition: background-color 0.2s;
        opacity: 0.7;
      }

      .copy-btn:hover,
      .paste-btn:not(:disabled):hover {
        opacity: 1;
        background-color: rgba(255, 255, 255, 0.2);
      }

      .copy-btn.active {
        opacity: 1;
        background-color: rgba(255, 255, 255, 0.3);
        animation: pulse 1s ease-in-out;
        will-change: transform;
      }

      @keyframes pulse {
        0%,
        100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.1);
        }
      }

      .paste-btn:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }

      .time-blocks {
        flex: 1;
        display: flex;
        flex-direction: column;
        position: relative;
        overflow: visible;
      }

      .time-block {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 12px;
        font-weight: 500;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        transition: opacity 0.2s;
        cursor: pointer;
      }

      .time-block:hover {
        opacity: 0.9;
      }

      .time-block:hover .time-block-tooltip {
        opacity: 1;
        visibility: visible;
      }

      /* Disable hover effects when in drag & drop mode */
      .schedule-container.drag-drop-mode .time-block:hover {
        opacity: 1;
      }

      .schedule-container.drag-drop-mode .time-block:hover .time-block-tooltip {
        opacity: 0;
        visibility: hidden;
      }

      .temperature {
        user-select: none;
        position: relative;
        z-index: 1;
      }

      /* Active block highlighting */
      .time-block.active {
        box-shadow:
          inset 0 0 0 3px rgba(255, 255, 255, 0.9),
          0 0 20px rgba(255, 255, 255, 0.6),
          0 0 30px rgba(255, 255, 255, 0.4);
        animation: pulse-glow 2s ease-in-out infinite;
        z-index: 10;
        will-change: box-shadow;
      }

      @keyframes pulse-glow {
        0%,
        100% {
          box-shadow:
            inset 0 0 0 3px rgba(255, 255, 255, 0.9),
            0 0 15px rgba(255, 255, 255, 0.5),
            0 0 25px rgba(255, 255, 255, 0.3);
        }
        50% {
          box-shadow:
            inset 0 0 0 3px rgba(255, 255, 255, 1),
            0 0 25px rgba(255, 255, 255, 0.8),
            0 0 40px rgba(255, 255, 255, 0.6);
        }
      }

      /* Tooltip styling */
      .time-block-tooltip {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: rgba(0, 0, 0, 0.95);
        color: white;
        padding: 6px 10px;
        border-radius: 4px;
        font-size: 10px;
        white-space: nowrap;
        opacity: 0;
        visibility: hidden;
        transition:
          opacity 0.2s,
          visibility 0.2s;
        z-index: 1000;
        pointer-events: none;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
        min-width: 80px;
      }

      .tooltip-time {
        font-weight: 500;
        margin-bottom: 2px;
        text-align: center;
        font-size: 10px;
        line-height: 1.2;
      }

      .tooltip-temp {
        text-align: center;
        font-size: 11px;
        font-weight: 600;
        line-height: 1.2;
      }

      /* Drag and Drop Styles */
      .time-block.pending {
        outline: 2px dashed var(--warning-color, #ff9800);
        outline-offset: -2px;
      }

      .drag-handle {
        position: absolute;
        left: 0;
        right: 0;
        height: 8px;
        cursor: ns-resize;
        z-index: 20;
        background: rgba(255, 255, 255, 0);
        transition: background 0.2s;
      }

      .drag-handle:hover {
        background: rgba(255, 255, 255, 0.3);
      }

      .drag-handle-top {
        top: 0;
        border-top: 2px solid rgba(255, 255, 255, 0);
      }

      .drag-handle-top:hover {
        border-top: 2px solid rgba(255, 255, 255, 0.8);
      }

      .drag-handle-bottom {
        bottom: 0;
        border-bottom: 2px solid rgba(255, 255, 255, 0);
      }

      .drag-handle-bottom:hover {
        border-bottom: 2px solid rgba(255, 255, 255, 0.8);
      }

      /* Temperature Drag Area */
      .temperature-drag-area {
        position: absolute;
        top: 8px;
        bottom: 8px;
        left: 0;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: ns-resize;
        z-index: 10;
        user-select: none;
      }

      .temperature-drag-area:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      .temperature-drag-area .temperature {
        pointer-events: none;
      }

      /* Pending Changes Banner */
      .pending-changes-banner {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 16px;
        padding: 12px 16px;
        background-color: var(--warning-color, #ff9800);
        color: white;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }

      .pending-changes-info {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .pending-icon {
        font-size: 18px;
      }

      .pending-text {
        font-weight: 500;
        font-size: 14px;
      }

      .pending-changes-actions {
        display: flex;
        gap: 8px;
      }

      .discard-btn,
      .save-all-btn {
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
      }

      .discard-btn {
        background-color: rgba(255, 255, 255, 0.2);
        color: white;
      }

      .discard-btn:hover {
        background-color: rgba(255, 255, 255, 0.3);
      }

      .save-all-btn {
        background-color: var(--primary-color);
        color: var(--text-primary-color);
      }

      .save-all-btn:hover {
        background-color: var(--primary-color);
        filter: brightness(1.1);
      }

      .hint {
        margin-top: 12px;
        text-align: center;
        font-size: 12px;
        color: var(--secondary-text-color);
      }

      .loading,
      .error {
        padding: 20px;
        text-align: center;
        color: var(--secondary-text-color);
      }

      .error {
        color: var(--error-color);
      }

      /* Editor Styles */
      .editor {
        background-color: var(--card-background-color);
      }

      .editor-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 1px solid var(--divider-color);
      }

      .editor-header h3 {
        margin: 0;
        font-size: 20px;
        font-weight: 500;
      }

      .editor-actions {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .undo-btn,
      .redo-btn,
      .close-btn {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: var(--secondary-text-color);
        padding: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition:
          background-color 0.2s,
          opacity 0.2s;
      }

      .undo-btn:hover:not(:disabled),
      .redo-btn:hover:not(:disabled),
      .close-btn:hover {
        background-color: var(--divider-color);
      }

      .undo-btn:disabled,
      .redo-btn:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }

      .validation-warnings {
        background-color: rgba(255, 152, 0, 0.1);
        border: 1px solid rgba(255, 152, 0, 0.3);
        border-radius: 4px;
        padding: 12px;
        margin: 12px 0;
      }

      .warnings-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
        font-weight: 500;
        color: var(--primary-text-color);
      }

      .warning-icon {
        font-size: 18px;
      }

      .warnings-title {
        font-size: 14px;
      }

      .warnings-list {
        margin: 0;
        padding-left: 28px;
        list-style-type: disc;
      }

      .warning-item {
        color: var(--secondary-text-color);
        font-size: 13px;
        line-height: 1.6;
        margin: 4px 0;
      }

      /* Base Temperature Section */
      .base-temperature-section {
        background-color: rgba(var(--rgb-primary-color, 3, 169, 244), 0.1);
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        padding: 12px;
        margin: 12px 0;
      }

      .base-temperature-header {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-bottom: 8px;
      }

      .base-temp-label {
        font-weight: 500;
        font-size: 14px;
        color: var(--primary-text-color);
      }

      .base-temp-description {
        font-size: 12px;
        color: var(--secondary-text-color);
      }

      .base-temperature-input {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .base-temp-input {
        width: 80px;
        font-weight: 500;
      }

      .editor-content-label {
        font-weight: 500;
        font-size: 14px;
        color: var(--primary-text-color);
        margin: 16px 0 8px 0;
        padding-left: 8px;
      }

      .editor-content {
        max-height: 500px;
        overflow-y: auto;
      }

      .time-block-editor {
        display: grid;
        grid-template-columns: 40px 100px 80px 40px 40px 20px;
        gap: 8px;
        align-items: center;
        padding: 8px;
        border-bottom: 1px solid var(--divider-color);
      }

      .block-number {
        font-weight: 500;
        color: var(--secondary-text-color);
      }

      .time-input,
      .temp-input {
        padding: 6px 8px;
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        background-color: var(--card-background-color);
        color: var(--primary-text-color);
        font-size: 14px;
      }

      .temp-unit {
        color: var(--secondary-text-color);
        font-size: 14px;
      }

      .remove-btn {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 18px;
        padding: 4px;
      }

      .remove-btn:hover {
        opacity: 0.7;
      }

      .color-indicator {
        width: 20px;
        height: 20px;
        border-radius: 4px;
        border: 1px solid var(--divider-color);
      }

      .add-btn {
        margin: 12px 0;
        padding: 10px 16px;
        background-color: var(--primary-color);
        color: var(--text-primary-color);
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        width: 100%;
      }

      .add-btn:hover {
        opacity: 0.9;
      }

      .editor-footer {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid var(--divider-color);
      }

      .cancel-btn,
      .save-btn {
        padding: 10px 24px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
      }

      .cancel-btn {
        background-color: var(--divider-color);
        color: var(--primary-text-color);
      }

      .save-btn {
        background-color: var(--primary-color);
        color: var(--text-primary-color);
      }

      .cancel-btn:hover,
      .save-btn:hover {
        opacity: 0.9;
      }

      /* Loading overlay */
      .loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        border-radius: 4px;
      }

      .loading-spinner {
        width: 50px;
        height: 50px;
        border: 5px solid rgba(255, 255, 255, 0.3);
        border-top-color: var(--primary-color);
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      /* Mobile Optimization */
      @media (max-width: 768px) {
        ha-card {
          padding: 12px;
        }

        .card-header {
          flex-direction: column;
          align-items: stretch;
          gap: 12px;
          margin-bottom: 12px;
        }

        .name {
          font-size: 20px;
          text-align: center;
        }

        .header-controls {
          justify-content: center;
          flex-wrap: wrap;
        }

        .profile-selector,
        .view-toggle-btn,
        .export-btn,
        .import-btn {
          min-height: 44px;
          padding: 10px 16px;
          font-size: 16px;
        }

        .schedule-container {
          gap: 4px;
          min-height: 350px;
        }

        .time-axis {
          min-width: 40px;
        }

        .time-label {
          font-size: 10px;
          right: 4px;
        }

        .schedule-grid {
          gap: 4px;
        }

        .weekday-header {
          padding: 6px 4px;
        }

        .weekday-label {
          font-size: 12px;
        }

        .weekday-actions {
          gap: 6px;
        }

        .copy-btn,
        .paste-btn {
          font-size: 16px;
          padding: 6px 8px;
          min-width: 44px;
          min-height: 44px;
        }

        .temperature {
          font-size: 11px;
        }

        .time-block-tooltip {
          font-size: 11px;
          padding: 8px 12px;
        }

        .hint {
          font-size: 14px;
        }

        /* Editor mobile styles */
        .editor-header h3 {
          font-size: 18px;
        }

        .undo-btn,
        .redo-btn,
        .close-btn {
          width: 44px;
          height: 44px;
          font-size: 28px;
        }

        .editor-content {
          max-height: 400px;
        }

        .time-block-editor {
          grid-template-columns: 30px 1fr 70px 40px 44px 20px;
          gap: 6px;
          padding: 10px 6px;
        }

        .block-number {
          font-size: 13px;
        }

        .time-input,
        .temp-input {
          padding: 10px 8px;
          font-size: 16px;
          min-height: 44px;
        }

        .temp-unit {
          font-size: 13px;
        }

        .remove-btn {
          font-size: 22px;
          padding: 8px;
          min-width: 44px;
          min-height: 44px;
        }

        .add-btn {
          padding: 14px 16px;
          font-size: 16px;
          min-height: 48px;
        }

        .editor-footer {
          flex-direction: column-reverse;
          gap: 8px;
        }

        .cancel-btn,
        .save-btn {
          width: 100%;
          padding: 14px 24px;
          font-size: 16px;
          min-height: 48px;
        }

        .validation-warnings {
          padding: 10px;
          margin: 10px 0;
        }

        .warnings-title {
          font-size: 13px;
        }

        .warning-item {
          font-size: 12px;
        }
      }

      /* Small mobile devices (portrait phones) */
      @media (max-width: 480px) {
        ha-card {
          padding: 8px;
        }

        .name {
          font-size: 18px;
        }

        .schedule-container {
          gap: 2px;
          min-height: 300px;
        }

        .time-axis {
          min-width: 35px;
        }

        .time-label {
          font-size: 9px;
          right: 2px;
        }

        .schedule-grid {
          gap: 2px;
        }

        .weekday-label {
          font-size: 11px;
        }

        .temperature {
          font-size: 10px;
        }

        .time-block-editor {
          grid-template-columns: 25px 1fr 60px 35px 44px 16px;
          gap: 4px;
          padding: 8px 4px;
        }

        .block-number {
          font-size: 12px;
        }

        .editor-header h3 {
          font-size: 16px;
        }
      }

      /* Landscape mobile optimization */
      @media (max-width: 768px) and (orientation: landscape) {
        .schedule-container {
          min-height: 250px;
        }

        .editor-content {
          max-height: 200px;
        }
      }

      /* Touch-specific optimizations */
      @media (hover: none) and (pointer: coarse) {
        .weekday-column.editable:hover {
          transform: none;
          box-shadow: none;
        }

        .weekday-column.editable:active {
          transform: scale(0.98);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .time-block:hover {
          opacity: 1;
        }

        .time-block:active {
          opacity: 0.85;
        }

        /* Show tooltip on tap instead of hover */
        .time-block:active .time-block-tooltip {
          opacity: 1;
          visibility: visible;
        }

        /* Disable hover effects, use active states */
        .copy-btn:hover,
        .paste-btn:not(:disabled):hover,
        .undo-btn:hover:not(:disabled),
        .redo-btn:hover:not(:disabled),
        .close-btn:hover,
        .add-btn:hover,
        .cancel-btn:hover,
        .save-btn:hover,
        .view-toggle-btn:hover,
        .export-btn:hover,
        .import-btn:hover,
        .remove-btn:hover {
          opacity: 1;
          background-color: transparent;
        }

        .copy-btn:active,
        .paste-btn:not(:disabled):active {
          background-color: rgba(255, 255, 255, 0.3);
        }

        .undo-btn:active:not(:disabled),
        .redo-btn:active:not(:disabled),
        .close-btn:active {
          background-color: var(--divider-color);
        }

        .view-toggle-btn:active,
        .export-btn:active:not(:disabled),
        .import-btn:active {
          background-color: var(--divider-color);
        }

        .add-btn:active,
        .save-btn:active {
          opacity: 0.85;
        }

        .cancel-btn:active {
          opacity: 0.85;
        }

        .remove-btn:active {
          opacity: 0.5;
        }
      }
    `}};e([xe({attribute:!1})],Re.prototype,"hass",void 0),e([ke()],Re.prototype,"_config",void 0),e([ke()],Re.prototype,"_currentProfile",void 0),e([ke()],Re.prototype,"_scheduleData",void 0),e([ke()],Re.prototype,"_simpleScheduleData",void 0),e([ke()],Re.prototype,"_availableProfiles",void 0),e([ke()],Re.prototype,"_activeEntityId",void 0),e([ke()],Re.prototype,"_editingWeekday",void 0),e([ke()],Re.prototype,"_editingBlocks",void 0),e([ke()],Re.prototype,"_editingBaseTemperature",void 0),e([ke()],Re.prototype,"_copiedSchedule",void 0),e([ke()],Re.prototype,"_isLoading",void 0),e([ke()],Re.prototype,"_currentTimePercent",void 0),e([ke()],Re.prototype,"_currentTimeMinutes",void 0),e([ke()],Re.prototype,"_currentWeekday",void 0),e([ke()],Re.prototype,"_translations",void 0),e([ke()],Re.prototype,"_isCompactView",void 0),e([ke()],Re.prototype,"_validationWarnings",void 0),e([ke()],Re.prototype,"_pendingChanges",void 0),e([ke()],Re.prototype,"_isDragging",void 0),e([ke()],Re.prototype,"_isDragDropMode",void 0),e([ke()],Re.prototype,"_minTemp",void 0),e([ke()],Re.prototype,"_maxTemp",void 0),e([ke()],Re.prototype,"_tempStep",void 0),Re=e([(e=>(t,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)})("homematicip-local-climate-schedule-card")],Re),window.customCards=window.customCards||[],window.customCards.push({type:"homematicip-local-climate-schedule-card",name:"Homematic(IP) Local Climate Schedule Card",description:"Display and edit Homematic thermostat schedules",preview:!0});export{Re as HomematicScheduleCard};
