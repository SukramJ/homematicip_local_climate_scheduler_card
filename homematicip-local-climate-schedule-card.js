function t(t,e,i,s){var o,r=arguments.length,n=r<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(n=(r<3?o(n):r>3?o(e,i,n):o(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),o=new WeakMap;let r=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=o.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&o.set(e,t))}return t}toString(){return this.cssText}};const n=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new r(i,t,s)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:d,defineProperty:l,getOwnPropertyDescriptor:c,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,g=globalThis,m=g.trustedTypes,_=m?m.emptyScript:"",f=g.reactiveElementPolyfillSupport,v=(t,e)=>t,b={toAttribute(t,e){switch(e){case Boolean:t=t?_:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},y=(t,e)=>!d(t,e),x={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:y};Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;let k=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=x){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&l(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:o}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const r=s?.call(this);o?.call(this,e),this.requestUpdate(t,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??x}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const t=this.properties,e=[...h(t),...p(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),o=e.litNonce;void 0!==o&&s.setAttribute("nonce",o),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const o=(void 0!==i.converter?.toAttribute?i.converter:b).toAttribute(e,i.type);this._$Em=t,null==o?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:b;this._$Em=s;const r=o.fromAttribute(e,t.type);this[s]=r??this._$Ej?.get(s)??r,this._$Em=null}}requestUpdate(t,e,i){if(void 0!==t){const s=this.constructor,o=this[t];if(i??=s.getPropertyOptions(t),!((i.hasChanged??y)(o,e)||i.useDefault&&i.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:o},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==o||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};k.elementStyles=[],k.shadowRootOptions={mode:"open"},k[v("elementProperties")]=new Map,k[v("finalized")]=new Map,f?.({ReactiveElement:k}),(g.reactiveElementVersions??=[]).push("2.1.1");const S=globalThis,$=S.trustedTypes,w=$?$.createPolicy("lit-html",{createHTML:t=>t}):void 0,T="$lit$",M=`lit$${Math.random().toFixed(9).slice(2)}$`,E="?"+M,D=`<${E}>`,A=document,I=()=>A.createComment(""),B=t=>null===t||"object"!=typeof t&&"function"!=typeof t,C=Array.isArray,P="[ \t\n\f\r]",U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,z=/-->/g,O=/>/g,N=RegExp(`>|${P}(?:([^\\s"'>=/]+)(${P}*=${P}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),R=/'/g,L=/"/g,W=/^(?:script|style|textarea|title)$/i,H=(t,...e)=>({_$litType$:1,strings:t,values:e}),V=Symbol.for("lit-noChange"),j=Symbol.for("lit-nothing"),F=new WeakMap,Y=A.createTreeWalker(A,129);function Z(t,e){if(!C(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==w?w.createHTML(e):e}const J=(t,e)=>{const i=t.length-1,s=[];let o,r=2===e?"<svg>":3===e?"<math>":"",n=U;for(let e=0;e<i;e++){const i=t[e];let a,d,l=-1,c=0;for(;c<i.length&&(n.lastIndex=c,d=n.exec(i),null!==d);)c=n.lastIndex,n===U?"!--"===d[1]?n=z:void 0!==d[1]?n=O:void 0!==d[2]?(W.test(d[2])&&(o=RegExp("</"+d[2],"g")),n=N):void 0!==d[3]&&(n=N):n===N?">"===d[0]?(n=o??U,l=-1):void 0===d[1]?l=-2:(l=n.lastIndex-d[2].length,a=d[1],n=void 0===d[3]?N:'"'===d[3]?L:R):n===L||n===R?n=N:n===z||n===O?n=U:(n=N,o=void 0);const h=n===N&&t[e+1].startsWith("/>")?" ":"";r+=n===U?i+D:l>=0?(s.push(a),i.slice(0,l)+T+i.slice(l)+M+h):i+M+(-2===l?e:h)}return[Z(t,r+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class q{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let o=0,r=0;const n=t.length-1,a=this.parts,[d,l]=J(t,e);if(this.el=q.createElement(d,i),Y.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=Y.nextNode())&&a.length<n;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(T)){const e=l[r++],i=s.getAttribute(t).split(M),n=/([.?@])?(.*)/.exec(e);a.push({type:1,index:o,name:n[2],strings:i,ctor:"."===n[1]?tt:"?"===n[1]?et:"@"===n[1]?it:X}),s.removeAttribute(t)}else t.startsWith(M)&&(a.push({type:6,index:o}),s.removeAttribute(t));if(W.test(s.tagName)){const t=s.textContent.split(M),e=t.length-1;if(e>0){s.textContent=$?$.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],I()),Y.nextNode(),a.push({type:2,index:++o});s.append(t[e],I())}}}else if(8===s.nodeType)if(s.data===E)a.push({type:2,index:o});else{let t=-1;for(;-1!==(t=s.data.indexOf(M,t+1));)a.push({type:7,index:o}),t+=M.length-1}o++}}static createElement(t,e){const i=A.createElement("template");return i.innerHTML=t,i}}function K(t,e,i=t,s){if(e===V)return e;let o=void 0!==s?i._$Co?.[s]:i._$Cl;const r=B(e)?void 0:e._$litDirective$;return o?.constructor!==r&&(o?._$AO?.(!1),void 0===r?o=void 0:(o=new r(t),o._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=o:i._$Cl=o),void 0!==o&&(e=K(t,o._$AS(t,e.values),o,s)),e}let Q=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??A).importNode(e,!0);Y.currentNode=s;let o=Y.nextNode(),r=0,n=0,a=i[0];for(;void 0!==a;){if(r===a.index){let e;2===a.type?e=new G(o,o.nextSibling,this,t):1===a.type?e=new a.ctor(o,a.name,a.strings,this,t):6===a.type&&(e=new st(o,this,t)),this._$AV.push(e),a=i[++n]}r!==a?.index&&(o=Y.nextNode(),r++)}return Y.currentNode=A,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}};class G{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=j,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=K(this,t,e),B(t)?t===j||null==t||""===t?(this._$AH!==j&&this._$AR(),this._$AH=j):t!==this._$AH&&t!==V&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>C(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==j&&B(this._$AH)?this._$AA.nextSibling.data=t:this.T(A.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=q.createElement(Z(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new Q(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=F.get(t.strings);return void 0===e&&F.set(t.strings,e=new q(t)),e}k(t){C(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const o of t)s===e.length?e.push(i=new G(this.O(I()),this.O(I()),this,this.options)):i=e[s],i._$AI(o),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class X{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,o){this.type=1,this._$AH=j,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=j}_$AI(t,e=this,i,s){const o=this.strings;let r=!1;if(void 0===o)t=K(this,t,e,0),r=!B(t)||t!==this._$AH&&t!==V,r&&(this._$AH=t);else{const s=t;let n,a;for(t=o[0],n=0;n<o.length-1;n++)a=K(this,s[i+n],e,n),a===V&&(a=this._$AH[n]),r||=!B(a)||a!==this._$AH[n],a===j?t=j:t!==j&&(t+=(a??"")+o[n+1]),this._$AH[n]=a}r&&!s&&this.j(t)}j(t){t===j?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends X{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===j?void 0:t}}class et extends X{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==j)}}class it extends X{constructor(t,e,i,s,o){super(t,e,i,s,o),this.type=5}_$AI(t,e=this){if((t=K(this,t,e,0)??j)===V)return;const i=this._$AH,s=t===j&&i!==j||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,o=t!==j&&(i===j||s);s&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class st{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){K(this,t)}}const ot={I:G},rt=S.litHtmlPolyfillSupport;rt?.(q,G),(S.litHtmlVersions??=[]).push("3.3.1");const nt=globalThis;let at=class extends k{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let o=s._$litPart$;if(void 0===o){const t=i?.renderBefore??null;s._$litPart$=o=new G(e.insertBefore(I(),t),t,void 0,i??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return V}};at._$litElement$=!0,at.finalized=!0,nt.litElementHydrateSupport?.({LitElement:at});const dt=nt.litElementPolyfillSupport;dt?.({LitElement:at}),(nt.litElementVersions??=[]).push("4.2.1");class lt{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}const{I:ct}=ot,ht=()=>document.createComment(""),pt=(t,e,i)=>{const s=t._$AA.parentNode,o=void 0===e?t._$AB:e._$AA;if(void 0===i){const e=s.insertBefore(ht(),o),r=s.insertBefore(ht(),o);i=new ct(e,r,t,t.options)}else{const e=i._$AB.nextSibling,r=i._$AM,n=r!==t;if(n){let e;i._$AQ?.(t),i._$AM=t,void 0!==i._$AP&&(e=t._$AU)!==r._$AU&&i._$AP(e)}if(e!==o||n){let t=i._$AA;for(;t!==e;){const e=t.nextSibling;s.insertBefore(t,o),t=e}}}return i},ut=(t,e,i=t)=>(t._$AI(e,i),t),gt={},mt=t=>{t._$AR(),t._$AA.remove()},_t=(t,e,i)=>{const s=new Map;for(let o=e;o<=i;o++)s.set(t[o],o);return s},ft=(yt=class extends lt{constructor(t){if(super(t),2!==t.type)throw Error("repeat() can only be used in text expressions")}dt(t,e,i){let s;void 0===i?i=e:void 0!==e&&(s=e);const o=[],r=[];let n=0;for(const e of t)o[n]=s?s(e,n):n,r[n]=i(e,n),n++;return{values:r,keys:o}}render(t,e,i){return this.dt(t,e,i).values}update(t,[e,i,s]){const o=(t=>t._$AH)(t),{values:r,keys:n}=this.dt(e,i,s);if(!Array.isArray(o))return this.ut=n,r;const a=this.ut??=[],d=[];let l,c,h=0,p=o.length-1,u=0,g=r.length-1;for(;h<=p&&u<=g;)if(null===o[h])h++;else if(null===o[p])p--;else if(a[h]===n[u])d[u]=ut(o[h],r[u]),h++,u++;else if(a[p]===n[g])d[g]=ut(o[p],r[g]),p--,g--;else if(a[h]===n[g])d[g]=ut(o[h],r[g]),pt(t,d[g+1],o[h]),h++,g--;else if(a[p]===n[u])d[u]=ut(o[p],r[u]),pt(t,o[h],o[p]),p--,u++;else if(void 0===l&&(l=_t(n,u,g),c=_t(a,h,p)),l.has(a[h]))if(l.has(a[p])){const e=c.get(n[u]),i=void 0!==e?o[e]:null;if(null===i){const e=pt(t,o[h]);ut(e,r[u]),d[u]=e}else d[u]=ut(i,r[u]),pt(t,o[h],i),o[e]=null;u++}else mt(o[p]),p--;else mt(o[h]),h++;for(;u<=g;){const e=pt(t,d[g+1]);ut(e,r[u]),d[u++]=e}for(;h<=p;){const t=o[h++];null!==t&&mt(t)}return this.ut=n,((t,e=gt)=>{t._$AH=e})(t,d),V}},(...t)=>({_$litDirective$:yt,values:t})),vt={attribute:!0,type:String,converter:b,reflect:!1,hasChanged:y},bt=(t=vt,e,i)=>{const{kind:s,metadata:o}=i;let r=globalThis.litPropertyMetadata.get(o);if(void 0===r&&globalThis.litPropertyMetadata.set(o,r=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),r.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const o=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,o,t)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const o=this[s];e.call(this,i),this.requestUpdate(s,o,t)}}throw Error("Unsupported decorator location: "+s)};var yt;function xt(t){return(e,i)=>"object"==typeof i?bt(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function kt(t){return xt({...t,state:!0,attribute:!1})}const St=["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"];function $t(t){const[e,i]=t.split(":").map(Number);return 60*e+i}function wt(t){const e=t%60;return`${Math.floor(t/60).toString().padStart(2,"0")}:${e.toString().padStart(2,"0")}`}function Tt(t){const e={},i=Object.keys(t).map(t=>parseInt(t)).filter(t=>!isNaN(t)&&t>=1&&t<=13).sort((t,e)=>t-e);for(const s of i){const i=t[s.toString()];i&&(e[s]={ENDTIME:i.ENDTIME,TEMPERATURE:i.TEMPERATURE})}return e}function Mt(t){const e=Object.keys(t).map(t=>parseInt(t)).filter(t=>!isNaN(t)&&t>=1&&t<=13).sort((t,e)=>t-e);let i=0;for(const s of e){const e=t[s.toString()];if(!e)continue;if(!e.ENDTIME||void 0===e.TEMPERATURE)return{key:"slotMissingValues",params:{slot:`${s}`}};const o=$t(e.ENDTIME);if(o<i)return{key:"slotTimeBackwards",params:{slot:`${s}`,time:e.ENDTIME}};if(o>1440)return{key:"slotTimeExceedsDay",params:{slot:`${s}`,time:e.ENDTIME}};i=o}if(e.length>0){const i=t[e[e.length-1].toString()];if(i&&"24:00"!==i.ENDTIME)return{key:"lastSlotMustEnd"}}return null}function Et(t){return t<12?"#3498db":t<16?"#5dade2":t<18?"#58d68d":t<20?"#f39c12":t<22?"#e67e22":"#e74c3c"}function Dt(t){const[e,i]=t,s=[],o=[...i].sort((t,e)=>$t(t.STARTTIME)-$t(e.STARTTIME));for(let t=0;t<o.length;t++){const e=o[t];s.push({startTime:e.STARTTIME,startMinutes:$t(e.STARTTIME),endTime:e.ENDTIME,endMinutes:$t(e.ENDTIME),temperature:e.TEMPERATURE,slot:t+1})}return{blocks:s,baseTemperature:e}}function At(t,e){const i=[],s=[...t].sort((t,e)=>t.startMinutes-e.startMinutes);for(const t of s)i.push({STARTTIME:t.startTime,ENDTIME:t.endTime,TEMPERATURE:t.temperature});return[e,i]}function It(t){if(0===t.length)return 20;const e=new Map;for(const i of t){const t=i.endMinutes-i.startMinutes,s=e.get(i.temperature)||0;e.set(i.temperature,s+t)}let i=0,s=20;for(const[t,o]of e.entries())o>i&&(i=o,s=t);return s}function Bt(t,e=5,i=30.5){const[s,o]=t;if(s<e||s>i)return{key:"temperatureOutOfRange",params:{block:"base",min:`${e}`,max:`${i}`}};let r=0;for(let t=0;t<o.length;t++){const s=o[t];if(!s.STARTTIME||!s.ENDTIME||void 0===s.TEMPERATURE)return{key:"slotMissingValues",params:{slot:`${t+1}`}};const n=$t(s.STARTTIME),a=$t(s.ENDTIME);if(a<=n)return{key:"blockEndBeforeStart",params:{block:`${t+1}`}};if(n<r)return{key:"slotTimeBackwards",params:{slot:`${t+1}`,time:s.STARTTIME}};if(s.TEMPERATURE<e||s.TEMPERATURE>i)return{key:"temperatureOutOfRange",params:{block:`${t+1}`,min:`${e}`,max:`${i}`}};r=a}return null}function Ct(t){if(0===t.length)return[];const e=[...t].sort((t,e)=>t.startMinutes-e.startMinutes),i=[];let s={...e[0]};for(let t=1;t<e.length;t++){const o=e[t];s.endMinutes===o.startMinutes&&s.temperature===o.temperature?s={...s,endTime:o.endTime,endMinutes:o.endMinutes}:(i.push(s),s={...o})}return i.push(s),i.map((t,e)=>({...t,slot:e+1}))}function Pt(t,e){if(0===t.length)return[{startTime:"00:00",startMinutes:0,endTime:"24:00",endMinutes:1440,temperature:e,slot:1}];const i=[...t].sort((t,e)=>t.startMinutes-e.startMinutes),s=[];let o=0;for(const t of i)t.startMinutes>o&&s.push({startTime:wt(o),startMinutes:o,endTime:t.startTime,endMinutes:t.startMinutes,temperature:e,slot:s.length+1}),s.push({...t,slot:s.length+1}),o=t.endMinutes;return o<1440&&s.push({startTime:wt(o),startMinutes:o,endTime:"24:00",endMinutes:1440,temperature:e,slot:s.length+1}),Ct(s)}function Ut(t){return[...t].sort((t,e)=>t.startMinutes-e.startMinutes).map((t,e)=>({...t,slot:e+1}))}const zt={en:{weekdays:{short:{monday:"Mo",tuesday:"Tu",wednesday:"We",thursday:"Th",friday:"Fr",saturday:"Sa",sunday:"Su"},long:{monday:"Monday",tuesday:"Tuesday",wednesday:"Wednesday",thursday:"Thursday",friday:"Friday",saturday:"Saturday",sunday:"Sunday"}},ui:{schedule:"Schedule",loading:"Loading schedule data...",entityNotFound:"Entity {entity} not found",clickToEdit:"Click on a day to edit its schedule",edit:"Edit {weekday}",cancel:"Cancel",save:"Save",addTimeBlock:"+ Add Time Block",copySchedule:"Copy schedule",pasteSchedule:"Paste schedule",undo:"Undo",redo:"Redo",undoShortcut:"Undo (Ctrl+Z)",redoShortcut:"Redo (Ctrl+Y)",toggleCompactView:"Compact view",toggleFullView:"Full view",exportSchedule:"Export",importSchedule:"Import",exportTooltip:"Export schedule to JSON file",importTooltip:"Import schedule from JSON file",exportSuccess:"Schedule exported successfully",importSuccess:"Schedule imported successfully",unsavedChanges:"Unsaved changes",saveAll:"Save all",discard:"Discard",enableDragDrop:"Enable drag & drop mode",disableDragDrop:"Disable drag & drop mode",confirmDiscardChanges:"You have unsaved changes. Do you want to discard them?",from:"From",to:"To",baseTemperature:"Base Temperature",baseTemperatureDescription:"Temperature for unscheduled periods",temperaturePeriods:"Temperature Periods",editSlot:"Edit",saveSlot:"Save",cancelSlotEdit:"Cancel"},errors:{failedToChangeProfile:"Failed to change profile: {error}",failedToSaveSchedule:"Failed to save schedule: {error}",failedToPasteSchedule:"Failed to paste schedule: {error}",invalidSchedule:"Invalid schedule: {error}",failedToExport:"Failed to export schedule: {error}",failedToImport:"Failed to import schedule: {error}",invalidImportFile:"Invalid file format. Please select a JSON file.",invalidImportFormat:"Invalid JSON format in file.",invalidImportData:"Invalid schedule data: {error}"},warnings:{title:"Validation Warnings",noWarnings:"No issues detected"},validationMessages:{blockEndBeforeStart:"Block {block}: End time is before start time",blockZeroDuration:"Block {block}: Block has zero duration",invalidStartTime:"Block {block}: Invalid start time",invalidEndTime:"Block {block}: Invalid end time",temperatureOutOfRange:"Block {block}: Temperature out of range ({min}-{max}°C)",invalidSlotCount:"Invalid number of slots: {count} (expected 13)",invalidSlotKey:"Invalid slot key: {key} (must be integer 1-13)",missingSlot:"Missing slot {slot}",slotMissingValues:"Slot {slot} missing ENDTIME or TEMPERATURE",slotTimeBackwards:"Slot {slot} time goes backwards: {time}",slotTimeExceedsDay:"Slot {slot} time exceeds 24:00: {time}",lastSlotMustEnd:"Last slot must end at 24:00",scheduleMustBeObject:"Schedule data must be an object",missingWeekday:"Missing weekday: {weekday}",invalidWeekdayData:"Invalid data for {weekday}",weekdayValidationError:"{weekday}: {details}"}},de:{weekdays:{short:{monday:"Mo",tuesday:"Di",wednesday:"Mi",thursday:"Do",friday:"Fr",saturday:"Sa",sunday:"So"},long:{monday:"Montag",tuesday:"Dienstag",wednesday:"Mittwoch",thursday:"Donnerstag",friday:"Freitag",saturday:"Samstag",sunday:"Sonntag"}},ui:{schedule:"Zeitplan",loading:"Zeitplandaten werden geladen...",entityNotFound:"Entität {entity} nicht gefunden",clickToEdit:"Klicken Sie auf einen Tag, um den Zeitplan zu bearbeiten",edit:"{weekday} bearbeiten",cancel:"Abbrechen",save:"Speichern",addTimeBlock:"+ Zeitblock hinzufügen",copySchedule:"Zeitplan kopieren",pasteSchedule:"Zeitplan einfügen",undo:"Rückgängig",redo:"Wiederholen",undoShortcut:"Rückgängig (Strg+Z)",redoShortcut:"Wiederholen (Strg+Y)",toggleCompactView:"Kompaktansicht",toggleFullView:"Vollansicht",exportSchedule:"Exportieren",importSchedule:"Importieren",exportTooltip:"Zeitplan als JSON-Datei exportieren",importTooltip:"Zeitplan aus JSON-Datei importieren",exportSuccess:"Zeitplan erfolgreich exportiert",importSuccess:"Zeitplan erfolgreich importiert",unsavedChanges:"Ungespeicherte Änderungen",saveAll:"Alle speichern",discard:"Verwerfen",enableDragDrop:"Drag & Drop Modus aktivieren",disableDragDrop:"Drag & Drop Modus deaktivieren",confirmDiscardChanges:"Sie haben ungespeicherte Änderungen. Möchten Sie diese verwerfen?",from:"Von",to:"Bis",baseTemperature:"Basistemperatur",baseTemperatureDescription:"Temperatur für nicht geplante Zeiträume",temperaturePeriods:"Temperaturperioden",editSlot:"Bearbeiten",saveSlot:"Speichern",cancelSlotEdit:"Abbrechen"},errors:{failedToChangeProfile:"Fehler beim Wechseln des Profils: {error}",failedToSaveSchedule:"Fehler beim Speichern des Zeitplans: {error}",failedToPasteSchedule:"Fehler beim Einfügen des Zeitplans: {error}",invalidSchedule:"Ungültiger Zeitplan: {error}",failedToExport:"Fehler beim Exportieren des Zeitplans: {error}",failedToImport:"Fehler beim Importieren des Zeitplans: {error}",invalidImportFile:"Ungültiges Dateiformat. Bitte wählen Sie eine JSON-Datei.",invalidImportFormat:"Ungültiges JSON-Format in der Datei.",invalidImportData:"Ungültige Zeitplandaten: {error}"},warnings:{title:"Validierungswarnungen",noWarnings:"Keine Probleme erkannt"},validationMessages:{blockEndBeforeStart:"Block {block}: Die Endzeit liegt vor der Startzeit",blockZeroDuration:"Block {block}: Der Block hat keine Dauer",invalidStartTime:"Block {block}: Ungültige Startzeit",invalidEndTime:"Block {block}: Ungültige Endzeit",temperatureOutOfRange:"Block {block}: Temperatur außerhalb des Bereichs ({min}-{max}°C)",invalidSlotCount:"Ungültige Anzahl an Slots: {count} (erwartet 13)",invalidSlotKey:"Ungültiger Slot-Schlüssel: {key} (muss eine Ganzzahl 1-13 sein)",missingSlot:"Slot {slot} fehlt",slotMissingValues:"Slot {slot} fehlt ENDTIME oder TEMPERATURE",slotTimeBackwards:"Slot {slot}: Zeit läuft rückwärts: {time}",slotTimeExceedsDay:"Slot {slot}: Zeit überschreitet 24:00: {time}",lastSlotMustEnd:"Der letzte Slot muss um 24:00 enden",scheduleMustBeObject:"Zeitplandaten müssen ein Objekt sein",missingWeekday:"Fehlender Wochentag: {weekday}",invalidWeekdayData:"Ungültige Daten für {weekday}",weekdayValidationError:"{weekday}: {details}"}}};function Ot(t){const e=t.toLowerCase().split("-")[0];return zt[e]||zt.en}function Nt(t,e){let i=t;for(const[t,s]of Object.entries(e))i=i.replace(`{${t}}`,s);return i}const Rt=(()=>{const t=[];for(let e=0;e<=24;e+=3)t.push({hour:e,label:`${e.toString().padStart(2,"0")}:00`,position:e/24*100});return t})();let Lt=class extends at{constructor(){super(),this._availableProfiles=[],this._isLoading=!1,this._currentTimePercent=0,this._currentTimeMinutes=0,this._historyStack=[],this._historyIndex=-1,this._translations=Ot("en"),this._isCompactView=!1,this._validationWarnings=[],this._parsedScheduleCache=new WeakMap,this._pendingChanges=new Map,this._isDragging=!1,this._isDragDropMode=!1,this._minTemp=5,this._maxTemp=30.5,this._tempStep=.5,this._keyDownHandler=this._handleKeyDown.bind(this)}setConfig(t){const e=[],i=t=>{if(!t)return;const i=t.trim();i&&(e.includes(i)||e.push(i))};if(i(t.entity),Array.isArray(t.entities)&&t.entities.forEach(t=>i(t)),0===e.length)throw new Error("You need to define at least one entity");e.sort((t,e)=>t.localeCompare(e));const s=this._activeEntityId,o=e[0],r=s&&e.includes(s)?s:o;this._config={show_profile_selector:!0,editable:!0,show_temperature:!0,temperature_unit:"°C",hour_format:"24",time_step_minutes:15,...t,entity:o,entities:[...e]},this._activeEntityId=r,this._pendingChanges.clear(),this._copiedSchedule=void 0,this._editingWeekday=void 0,this._editingBlocks=void 0,this._parsedScheduleCache=new WeakMap,this._updateLanguage()}_getPreferredLanguage(t){return t?.language||t?.locale?.language}_updateLanguage(){let t="en";if(this._config?.language)t=this._config.language;else{const e=this._getPreferredLanguage(this.hass);e&&(t=e)}this._translations=Ot(t),this._weekdayShortLabelMap=this._createWeekdayLabelMap("short"),this._weekdayLongLabelMap=this._createWeekdayLabelMap("long")}_createWeekdayLabelMap(t){const e="short"===t?this._translations.weekdays.short:this._translations.weekdays.long;return{MONDAY:e.monday,TUESDAY:e.tuesday,WEDNESDAY:e.wednesday,THURSDAY:e.thursday,FRIDAY:e.friday,SATURDAY:e.saturday,SUNDAY:e.sunday}}_getWeekdayLabel(t,e="short"){return"long"===e?(this._weekdayLongLabelMap||(this._weekdayLongLabelMap=this._createWeekdayLabelMap("long")),this._weekdayLongLabelMap[t]):(this._weekdayShortLabelMap||(this._weekdayShortLabelMap=this._createWeekdayLabelMap("short")),this._weekdayShortLabelMap[t])}_getEntityOptions(){return this._config?this._config.entities?.length?[...this._config.entities].sort((t,e)=>t.localeCompare(e)):this._config.entity?[this._config.entity]:[]:[]}_getActiveEntityId(){const t=this._getEntityOptions();if(0!==t.length)return this._activeEntityId&&t.includes(this._activeEntityId)?this._activeEntityId:t[0]}_formatValidationParams(t){if(!t)return{};const e={};for(const[i,s]of Object.entries(t))"weekday"===i&&St.includes(s)?e.weekday=this._getWeekdayLabel(s,"long"):e[i]=s;return e}_translateValidationMessage(t){const e=this._translations.validationMessages[t.key]||t.key,i=this._formatValidationParams(t.params);return t.nested&&(i.details=this._translateValidationMessage(t.nested)),Nt(e,i)}getCardSize(){return 12}connectedCallback(){super.connectedCallback(),this._updateCurrentTime(),this._timeUpdateInterval=window.setInterval(()=>{this._updateCurrentTime()},6e4),window.addEventListener("keydown",this._keyDownHandler)}disconnectedCallback(){super.disconnectedCallback(),void 0!==this._timeUpdateInterval&&(clearInterval(this._timeUpdateInterval),this._timeUpdateInterval=void 0),void 0!==this._loadingTimeoutId&&(clearTimeout(this._loadingTimeoutId),this._loadingTimeoutId=void 0),window.removeEventListener("keydown",this._keyDownHandler)}_updateCurrentTime(){const t=new Date,e=60*t.getHours()+t.getMinutes();this._currentTimePercent=e/1440*100,this._currentTimeMinutes=e;const i=t.getDay();this._currentWeekday=["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"][i]}_isBlockActive(t,e){return!(!this._currentWeekday||this._currentWeekday!==t)&&this._currentTimeMinutes>=e.startMinutes&&this._currentTimeMinutes<e.endMinutes}_handleKeyDown(t){if(!this._editingWeekday||!this._editingBlocks)return;const e=t.ctrlKey||t.metaKey;e&&"z"===t.key&&!t.shiftKey?(t.preventDefault(),this._undo()):e&&("y"===t.key||"z"===t.key&&t.shiftKey)&&(t.preventDefault(),this._redo())}_saveHistoryState(){if(!this._editingBlocks)return;const t=JSON.parse(JSON.stringify(this._editingBlocks));this._historyStack=this._historyStack.slice(0,this._historyIndex+1),this._historyStack.push(t),this._historyIndex++,this._historyStack.length>50&&(this._historyStack.shift(),this._historyIndex--)}_undo(){this._historyIndex<=0||(this._historyIndex--,this._editingBlocks=JSON.parse(JSON.stringify(this._historyStack[this._historyIndex])),this._updateValidationWarnings())}_redo(){this._historyIndex>=this._historyStack.length-1||(this._historyIndex++,this._editingBlocks=JSON.parse(JSON.stringify(this._historyStack[this._historyIndex])),this._updateValidationWarnings())}_canUndo(){return this._historyIndex>0}_canRedo(){return this._historyIndex<this._historyStack.length-1}_toggleViewMode(){this._isCompactView=!this._isCompactView}_toggleDragDropMode(){this._isDragDropMode&&this._pendingChanges.size>0?confirm(this._translations.ui.confirmDiscardChanges)&&(this._discardPendingChanges(),this._isDragDropMode=!1):this._isDragDropMode=!this._isDragDropMode}shouldUpdate(t){if(t.has("_config"))return!0;if(t.has("hass")){const e=t.get("hass"),i=this.hass;if(!this._config)return!1;if(!e||!i)return!0;const s=this._getActiveEntityId();if(!s)return!0;const o=e.states?.[s],r=i.states?.[s];return o!==r||(i?.language||i?.locale?.language)!==(e?.language||e?.locale?.language)}return!0}updated(t){if(super.updated(t),t.has("hass")&&this._config){this._updateFromEntity();const e=t.get("hass");this._getPreferredLanguage(this.hass)!==this._getPreferredLanguage(e)&&this._updateLanguage()}}_updateFromEntity(){if(!this.hass||!this._config)return;const t=this._getActiveEntityId();if(!t)return this._currentProfile=void 0,this._scheduleData=void 0,this._simpleScheduleData=void 0,this._availableProfiles=[],void this._pendingChanges.clear();const e=this.hass.states?.[t];if(!e)return this._currentProfile=void 0,this._scheduleData=void 0,this._simpleScheduleData=void 0,this._availableProfiles=[],void this._pendingChanges.clear();const i=e.attributes;this._currentProfile=this._config.profile||i.active_profile,this._simpleScheduleData=i.simple_schedule_data,this._scheduleData=i.schedule_data,this._availableProfiles=(i.available_profiles||[]).slice().sort((t,e)=>t.localeCompare(e)),this._minTemp=i.min_temp??5,this._maxTemp=i.max_temp??30.5,this._tempStep=i.target_temp_step??.5,this._parsedScheduleCache=new WeakMap}_getBaseTemperature(t){if(this._simpleScheduleData){const e=this._simpleScheduleData[t];if(e){const{baseTemperature:t}=Dt(e);return t}}return 20}_getParsedBlocks(t){if(this._pendingChanges.has(t))return this._pendingChanges.get(t);if(this._simpleScheduleData){const e=this._simpleScheduleData[t];if(!e)return[];const i=this._parsedScheduleCache.get(e);if(i)return i;const{blocks:s}=Dt(e);return this._parsedScheduleCache.set(e,s),s}if(this._scheduleData){const e=this._scheduleData[t];if(!e)return[];const i=this._parsedScheduleCache.get(e);if(i)return i;const s=function(t){const e=[];let i="00:00",s=0;const o=Object.entries(t).map(([t,e])=>({slot:parseInt(t),data:e})).sort((t,e)=>t.slot-e.slot);for(const{slot:t,data:r}of o){if(!r||"string"!=typeof r.ENDTIME||void 0===r.TEMPERATURE)continue;const o=r.ENDTIME,n=$t(o);if(n>s&&n<=1440&&(e.push({startTime:i,startMinutes:s,endTime:o,endMinutes:n,temperature:r.TEMPERATURE,slot:t}),i=o,s=n),n>=1440)break}return e}(e);return this._parsedScheduleCache.set(e,s),s}return[]}async _handleProfileChange(t){const e=t.target.value,i=this._getActiveEntityId();if(this._config&&this.hass&&i)try{await this.hass.callService("homematicip_local","set_schedule_active_profile",{entity_id:i,profile:e}),this._currentProfile=e}catch(t){alert(Nt(this._translations.errors.failedToChangeProfile,{error:String(t)}))}}_updateValidationWarnings(){this._validationWarnings=this._editingBlocks?function(t,e=5,i=30.5){const s=[];if(0===t.length)return s;for(let e=0;e<t.length-1;e++){const i=t[e];i.endMinutes<i.startMinutes&&s.push({key:"blockEndBeforeStart",params:{block:`${e+1}`}}),i.endMinutes===i.startMinutes&&s.push({key:"blockZeroDuration",params:{block:`${e+1}`}})}const o=t[t.length-1];return o.endMinutes<o.startMinutes&&s.push({key:"blockEndBeforeStart",params:{block:`${t.length}`}}),t.forEach((t,o)=>{(t.startMinutes<0||t.startMinutes>1440)&&s.push({key:"invalidStartTime",params:{block:`${o+1}`}}),(t.endMinutes<0||t.endMinutes>1440)&&s.push({key:"invalidEndTime",params:{block:`${o+1}`}}),(t.temperature<e||t.temperature>i)&&s.push({key:"temperatureOutOfRange",params:{block:`${o+1}`,min:`${e}`,max:`${i}`}})}),s}(this._editingBlocks,this._minTemp,this._maxTemp):[]}_handleWeekdayClick(t){if(this._config?.editable&&(this._simpleScheduleData||this._scheduleData)&&!this._isDragDropMode){if(this._editingWeekday=t,this._editingBlocks=this._getParsedBlocks(t),this._simpleScheduleData){const e=this._simpleScheduleData[t];if(e){const{baseTemperature:t}=Dt(e);this._editingBaseTemperature=t}else this._editingBaseTemperature=20}else this._editingBaseTemperature=It(this._editingBlocks);this._historyStack=[JSON.parse(JSON.stringify(this._editingBlocks))],this._historyIndex=0,this._updateValidationWarnings()}}_closeEditor(){this._editingWeekday=void 0,this._editingBlocks=void 0,this._editingBaseTemperature=void 0,this._editingSlotIndex=void 0,this._editingSlotData=void 0,this._historyStack=[],this._historyIndex=-1}_snapToQuarterHour(t){return 15*Math.round(t/15)}_startDrag(t,e,i,s){if(!this._config?.editable)return;t.preventDefault(),t.stopPropagation();const o=t instanceof MouseEvent?t.clientY:t.touches[0].clientY,r=this._pendingChanges.get(e)||this._getParsedBlocks(e);this._dragState={weekday:e,blockIndex:i,boundary:s,initialY:o,initialMinutes:"start"===s?r[i].startMinutes:"end"===s?r[i].endMinutes:0,initialTemperature:"temperature"===s?r[i].temperature:void 0,originalBlocks:JSON.parse(JSON.stringify(r))},this._isDragging=!0;const n=t=>{(t instanceof MouseEvent||t instanceof TouchEvent)&&this._onDragMove(t)},a=()=>this._endDrag(n,a);document.addEventListener("mousemove",n),document.addEventListener("touchmove",n,{passive:!1}),document.addEventListener("mouseup",a),document.addEventListener("touchend",a)}_onDragMove(t){if(!this._dragState)return;t.preventDefault();const e=(t instanceof MouseEvent?t.clientY:t.touches[0].clientY)-this._dragState.initialY,{blockIndex:i,boundary:s,weekday:o}=this._dragState,r=[...this._dragState.originalBlocks];if("temperature"===s){const t=Math.round(-e/50/this._tempStep)*this._tempStep,s=Math.max(this._minTemp,Math.min(this._maxTemp,(this._dragState.initialTemperature||20)+t));return r[i]={...r[i],temperature:s},this._pendingChanges.set(o,r),void this.requestUpdate()}const n=this.shadowRoot?.querySelector(".schedule-grid");if(!n)return;const a=this._snapToQuarterHour(this._dragState.initialMinutes+e*(1440/n.clientHeight));if("start"===s){const t=Math.max(i>0?r[i-1].endMinutes:0,Math.min(r[i].endMinutes-15,a));i>0&&this._dragState?.originalBlocks[i].startMinutes===this._dragState?.originalBlocks[i-1].endMinutes&&(r[i-1]={...r[i-1],endMinutes:t,endTime:wt(t)}),r[i]={...r[i],startMinutes:t,startTime:wt(t)}}else if("end"===s){const t=Math.max(r[i].startMinutes+15,Math.min(i<r.length-1?r[i+1].startMinutes:1440,a));r[i]={...r[i],endMinutes:t,endTime:wt(t)},i<r.length-1&&this._dragState?.originalBlocks[i].endMinutes===this._dragState?.originalBlocks[i+1].startMinutes&&(r[i+1]={...r[i+1],startMinutes:t,startTime:wt(t)})}this._pendingChanges.set(o,r),this.requestUpdate()}_endDrag(t,e){this._isDragging=!1,this._dragState=void 0,document.removeEventListener("mousemove",t),document.removeEventListener("touchmove",t),document.removeEventListener("mouseup",e),document.removeEventListener("touchend",e),this.requestUpdate()}async _savePendingChanges(){const t=this._getActiveEntityId();if(this._config&&this.hass&&this._currentProfile&&0!==this._pendingChanges.size&&t){this._isLoading=!0,this._loadingTimeoutId=window.setTimeout(()=>{this._isLoading=!1,this._loadingTimeoutId=void 0},1e4);try{for(const[e,i]of this._pendingChanges){const s=At(i,this._getBaseTemperature(e)),o=Bt(s);if(o){const t=this._translateValidationMessage(o),i=this._getWeekdayLabel(e,"long");throw new Error(`${i}: ${t}`)}const[r,n]=s;await this.hass.callService("homematicip_local","set_schedule_simple_weekday",{entity_id:t,profile:this._currentProfile,weekday:e,base_temperature:r,simple_weekday_list:n}),this._simpleScheduleData&&(this._simpleScheduleData={...this._simpleScheduleData,[e]:s})}this._pendingChanges.clear(),this._updateFromEntity(),this.requestUpdate()}catch(t){alert(Nt(this._translations.errors.failedToSaveSchedule,{error:String(t)}))}finally{void 0!==this._loadingTimeoutId&&(clearTimeout(this._loadingTimeoutId),this._loadingTimeoutId=void 0),this._isLoading=!1}}}_discardPendingChanges(){this._pendingChanges.clear(),this.requestUpdate()}async _saveSchedule(){if(!(this._config&&this.hass&&this._editingWeekday&&this._editingBlocks&&this._currentProfile&&void 0!==this._editingBaseTemperature))return;const t=this._getActiveEntityId();if(!t)return;const e=At(this._editingBlocks,this._editingBaseTemperature),i=Bt(e,this._minTemp,this._maxTemp);if(i){const t=this._translateValidationMessage(i);return void alert(Nt(this._translations.errors.invalidSchedule,{error:t}))}this._isLoading=!0,this._loadingTimeoutId=window.setTimeout(()=>{this._isLoading=!1,this._loadingTimeoutId=void 0},1e4);try{const[i,s]=e;await this.hass.callService("homematicip_local","set_schedule_simple_weekday",{entity_id:t,profile:this._currentProfile,weekday:this._editingWeekday,base_temperature:i,simple_weekday_list:s}),this._simpleScheduleData&&(this._simpleScheduleData={...this._simpleScheduleData,[this._editingWeekday]:e}),this._updateFromEntity(),this.requestUpdate(),this._closeEditor()}catch(t){alert(Nt(this._translations.errors.failedToSaveSchedule,{error:String(t)}))}finally{void 0!==this._loadingTimeoutId&&(clearTimeout(this._loadingTimeoutId),this._loadingTimeoutId=void 0),this._isLoading=!1}}_copySchedule(t){if(!this._simpleScheduleData&&!this._scheduleData)return;const e=this._getParsedBlocks(t);let i;if(this._simpleScheduleData){const e=this._simpleScheduleData[t];e&&(i=Dt(e).baseTemperature)}else i=It(e);this._copiedSchedule={weekday:t,blocks:JSON.parse(JSON.stringify(e)),baseTemperature:i}}async _pasteSchedule(t){if(!(this._config&&this.hass&&this._currentProfile&&this._copiedSchedule))return;const e=this._getActiveEntityId();if(!e)return;const i=this._copiedSchedule.baseTemperature??It(this._copiedSchedule.blocks),s=At(this._copiedSchedule.blocks,i),o=Bt(s,this._minTemp,this._maxTemp);if(o){const t=this._translateValidationMessage(o);return void alert(Nt(this._translations.errors.invalidSchedule,{error:t}))}this._isLoading=!0,this._loadingTimeoutId=window.setTimeout(()=>{this._isLoading=!1,this._loadingTimeoutId=void 0},1e4);try{const[i,o]=s;await this.hass.callService("homematicip_local","set_schedule_simple_weekday",{entity_id:e,profile:this._currentProfile,weekday:t,base_temperature:i,simple_weekday_list:o}),this._simpleScheduleData&&(this._simpleScheduleData={...this._simpleScheduleData,[t]:s}),this._updateFromEntity(),this.requestUpdate()}catch(t){alert(Nt(this._translations.errors.failedToPasteSchedule,{error:String(t)}))}finally{void 0!==this._loadingTimeoutId&&(clearTimeout(this._loadingTimeoutId),this._loadingTimeoutId=void 0),this._isLoading=!1}}_exportSchedule(){if(!this._currentProfile)return;const t=this._simpleScheduleData||this._scheduleData;if(t)try{const e={version:this._simpleScheduleData?"2.0":"1.0",profile:this._currentProfile,exported:(new Date).toISOString(),scheduleData:t,format:this._simpleScheduleData?"simple":"legacy"},i=JSON.stringify(e,null,2),s=new Blob([i],{type:"application/json"}),o=URL.createObjectURL(s),r=document.createElement("a");r.href=o,r.download=`schedule-${this._currentProfile}-${(new Date).toISOString().split("T")[0]}.json`,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(o)}catch(t){alert(Nt(this._translations.errors.failedToExport,{error:String(t)}))}}_importSchedule(){const t=document.createElement("input");t.type="file",t.accept=".json,application/json",t.onchange=async t=>{const e=t.target.files?.[0];if(e)if(e.name.endsWith(".json")||"application/json"===e.type)try{const t=await e.text();let i;try{i=JSON.parse(t)}catch{return void alert(this._translations.errors.invalidImportFormat)}if(!i||"object"!=typeof i)return void alert(this._translations.errors.invalidImportFormat);let s,o,r=!1;if("scheduleData"in i?(s=i.scheduleData,r="simple"===("format"in i?i.format:void 0)||"2.0"===("version"in i?i.version:void 0)):(s=i,r=Array.isArray(s&&"object"==typeof s&&"MONDAY"in s?s.MONDAY:null)),o=r?function(t){if(!t||"object"!=typeof t)return{key:"scheduleMustBeObject"};const e=t,i=["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"];for(const t of i){if(!(t in e))return{key:"missingWeekday",params:{weekday:t}};const i=e[t];if(!Array.isArray(i)||2!==i.length)return{key:"invalidWeekdayData",params:{weekday:t}};const s=Bt(i);if(s)return{key:"weekdayValidationError",params:{weekday:t},nested:s}}return null}(s):function(t){if(!t||"object"!=typeof t)return{key:"scheduleMustBeObject"};const e=t,i=["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"];for(const t of i){if(!(t in e))return{key:"missingWeekday",params:{weekday:t}};const i=e[t];if(!i||"object"!=typeof i)return{key:"invalidWeekdayData",params:{weekday:t}};const s=Mt(i);if(s)return{key:"weekdayValidationError",params:{weekday:t},nested:s}}return null}(s),o){const t=this._translateValidationMessage(o);return void alert(Nt(this._translations.errors.invalidImportData,{error:t}))}const n=this._getActiveEntityId();if(!(this._config&&this.hass&&this._currentProfile&&n))return;this._isLoading=!0,this._loadingTimeoutId=window.setTimeout(()=>{this._isLoading=!1,this._loadingTimeoutId=void 0},1e4);try{if(r){const t=s;for(const e of St){const i=t[e];if(i){const[t,s]=i;await this.hass.callService("homematicip_local","set_schedule_simple_weekday",{entity_id:n,profile:this._currentProfile,weekday:e,base_temperature:t,simple_weekday_list:s})}}this._simpleScheduleData=t}else{const t=s;for(const e of St){const i=t[e];if(i){const t=Tt(i);await this.hass.callService("homematicip_local","set_schedule_profile_weekday",{entity_id:n,profile:this._currentProfile,weekday:e,weekday_data:t})}}this._scheduleData=t}this._updateFromEntity(),this.requestUpdate(),alert(this._translations.ui.importSuccess)}catch(t){alert(Nt(this._translations.errors.failedToImport,{error:String(t)}))}finally{void 0!==this._loadingTimeoutId&&(clearTimeout(this._loadingTimeoutId),this._loadingTimeoutId=void 0),this._isLoading=!1}}catch(t){alert(Nt(this._translations.errors.failedToImport,{error:String(t)}))}else alert(this._translations.errors.invalidImportFile)},t.click()}_addTimeBlock(){if(!this._editingBlocks)return;const t=this._editingBlocks[this._editingBlocks.length-1],e=t?t.endMinutes:0,i=Math.min(e+60,1440);i>e&&this._editingBlocks.length<12&&(this._saveHistoryState(),this._editingBlocks=[...this._editingBlocks,{startTime:wt(e),startMinutes:e,endTime:wt(i),endMinutes:i,temperature:20,slot:this._editingBlocks.length+1}],this._updateValidationWarnings())}_removeTimeBlock(t){!this._editingBlocks||this._editingBlocks.length<=1||(this._saveHistoryState(),this._editingBlocks=this._editingBlocks.filter((e,i)=>i!==t),this._editingBlocks=this._editingBlocks.map((t,e)=>({...t,slot:e+1})),this._updateValidationWarnings())}_updateTimeBlock(t,e){if(this._editingBlocks){this._saveHistoryState(),this._editingBlocks=this._editingBlocks.map((i,s)=>{if(s!==t)return i;const o={...i,...e};return e.endTime&&(o.endMinutes=$t(e.endTime)),o});for(let e=t+1;e<this._editingBlocks.length;e++){const t=this._editingBlocks[e-1];this._editingBlocks[e]={...this._editingBlocks[e],startTime:t.endTime,startMinutes:t.endMinutes}}this._editingBlocks=[...this._editingBlocks],this._updateValidationWarnings()}}render(){if(!this._config||!this.hass)return H``;const t=this._getEntityOptions(),e=t.length>1,i=this._getActiveEntityId(),s=i?this.hass.states?.[i]:void 0,o=e?this._renderEntitySelector(t,i):this._config.name||s?.attributes.friendly_name||this._translations.ui.schedule;return s?H`
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
                  ${this._availableProfiles.map(t=>H`
                      <option value=${t} ?selected=${t===this._currentProfile}>
                        ${t}
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
              ${Nt(this._translations.ui.entityNotFound,{entity:i||this._translations.ui.schedule})}
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
            ${ft(Rt,t=>t.hour,t=>H`
                <div class="time-label" style="top: ${t.position}%">${t.label}</div>
              `)}
          </div>
        </div>

        <!-- Schedule grid -->
        <div class="schedule-grid ${this._isCompactView?"compact":""}">
          ${ft(St,t=>t,t=>{const e=this._getParsedBlocks(t),i=this._getBaseTemperature(t),s=Pt(e,i),o=this._copiedSchedule?.weekday===t;return H`
                <div class="weekday-column ${this._config?.editable?"editable":""}">
                  <div class="weekday-header">
                    <div class="weekday-label">${this._getWeekdayLabel(t,"short")}</div>
                    ${this._config?.editable?H`
                          <div class="weekday-actions">
                            <button
                              class="copy-btn ${o?"active":""}"
                              @click=${e=>{e.stopPropagation(),this._copySchedule(t)}}
                              title="${this._translations.ui.copySchedule}"
                            >
                              📋
                            </button>
                            <button
                              class="paste-btn"
                              @click=${e=>{e.stopPropagation(),this._pasteSchedule(t)}}
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
                    @click=${()=>this._config?.editable&&this._handleWeekdayClick(t)}
                  >
                    ${ft(s,t=>`${t.slot}-${t.startMinutes}`,(o,r)=>{const n=this._isBlockActive(t,o),a=o.temperature===i&&!e.some(t=>t.startMinutes===o.startMinutes&&t.endMinutes===o.endMinutes);let d;if(a)d="background-color: var(--secondary-background-color, #e0e0e0);";else if(this._config?.show_gradient){d=`background: ${function(t,e,i){const s=Et(t);return null===e&&null===i?s:null!==e&&null===i?`linear-gradient(to bottom, ${Et(e)}, ${s})`:null===e&&null!==i?`linear-gradient(to bottom, ${s}, ${Et(i)})`:`linear-gradient(to bottom, ${Et(e)}, ${s} 50%, ${Et(i)})`}(o.temperature,r>0?s[r-1].temperature:null,r<s.length-1?s[r+1].temperature:null)};`}else d=`background-color: ${Et(o.temperature)};`;return H`
                          <div
                            class="time-block ${n?"active":""} ${this._pendingChanges.has(t)?"pending":""} ${a?"base-temp-block":""}"
                            style="
                              height: ${(o.endMinutes-o.startMinutes)/1440*100}%;
                              ${d}
                            "
                          >
                            ${(()=>{const i=e.findIndex(t=>t.startMinutes===o.startMinutes&&t.endMinutes===o.endMinutes),s=i>=0&&o.startMinutes>0;return this._config?.editable&&this._isDragDropMode&&!a&&s?H`
                                    <div
                                      class="drag-handle drag-handle-top"
                                      @mousedown=${e=>{e.stopPropagation(),this._startDrag(e,t,i,"start")}}
                                      @touchstart=${e=>{e.stopPropagation(),this._startDrag(e,t,i,"start")}}
                                    ></div>
                                  `:""})()}
                            ${(()=>{const i=e.findIndex(t=>t.startMinutes===o.startMinutes&&t.endMinutes===o.endMinutes);return this._config?.editable&&this._isDragDropMode&&!a&&i>=0?H`
                                    <div
                                      class="temperature-drag-area"
                                      @mousedown=${e=>{e.stopPropagation(),this._startDrag(e,t,i,"temperature")}}
                                      @touchstart=${e=>{e.stopPropagation(),this._startDrag(e,t,i,"temperature")}}
                                    >
                                      ${this._config?.show_temperature?H`<span class="temperature"
                                            >${o.temperature.toFixed(1)}°</span
                                          >`:""}
                                    </div>
                                  `:this._config?.show_temperature?H`<span class="temperature"
                                      >${o.temperature.toFixed(1)}°</span
                                    >`:""})()}
                            <div class="time-block-tooltip">
                              <div class="tooltip-time">${o.startTime} - ${o.endTime}</div>
                              <div class="tooltip-temp">
                                ${function(t,e="°C"){return`${t.toFixed(1)}${e}`}(o.temperature,this._config?.temperature_unit)}
                              </div>
                            </div>
                            ${(()=>{const i=e.findIndex(t=>t.startMinutes===o.startMinutes&&t.endMinutes===o.endMinutes),s=i>=0&&o.endMinutes<1440;return this._config?.editable&&this._isDragDropMode&&!a&&s?H`
                                    <div
                                      class="drag-handle drag-handle-bottom"
                                      @mousedown=${e=>{e.stopPropagation(),this._startDrag(e,t,i,"end")}}
                                      @touchstart=${e=>{e.stopPropagation(),this._startDrag(e,t,i,"end")}}
                                    ></div>
                                  `:""})()}
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
    `:H``}_renderEntitySelector(t,e){const i=e&&t.includes(e)?e:t[0];return H`
      <select
        class="profile-selector entity-selector"
        @change=${this._handleEntitySelection}
        .value=${i}
      >
        ${[...t].sort((t,e)=>t.localeCompare(e)).map(t=>H`<option value=${t}>${this.hass?.states?.[t]?.attributes.friendly_name||t}</option>`)}
      </select>
    `}_handleEntitySelection(t){const e=t.target.value;e&&e!==this._getActiveEntityId()&&(this._activeEntityId=e,this._pendingChanges.clear(),this._editingWeekday=void 0,this._editingBlocks=void 0,this._copiedSchedule=void 0,this._validationWarnings=[],this._isDragDropMode=!1,this._isDragging=!1,this._dragState=void 0,this._parsedScheduleCache=new WeakMap,this._updateFromEntity())}_startSlotEdit(t){if(!this._editingBlocks||t<0||t>=this._editingBlocks.length)return;const e=this._editingBlocks[t];this._editingSlotIndex=t,this._editingSlotData={startTime:e.startTime,endTime:e.endTime,temperature:e.temperature}}_startSlotEditFromDisplay(t,e){if(!this._editingBlocks)return;const i=e[t],s=this._editingBlocks.findIndex(t=>t.startMinutes===i.startMinutes&&t.endMinutes===i.endMinutes&&t.temperature===i.temperature);-1!==s&&this._startSlotEdit(s)}_cancelSlotEdit(){this._editingSlotIndex=void 0,this._editingSlotData=void 0}_saveSlotEdit(){if(void 0===this._editingSlotIndex||!this._editingSlotData||!this._editingBlocks||void 0===this._editingBaseTemperature)return;const t=this._editingSlotIndex,{startTime:e,endTime:i,temperature:s}=this._editingSlotData,o={startTime:e,startMinutes:$t(e),endTime:i,endMinutes:$t(i),temperature:s,slot:t+1},r=this._editingBlocks.filter((e,i)=>i!==t),n=function(t,e){const i=[],s=e.startMinutes,o=e.endMinutes,r=[...t].sort((t,e)=>t.startMinutes-e.startMinutes);for(const t of r){const e=t.startMinutes,r=t.endMinutes;r<=s||e>=o?i.push(t):(e<s&&i.push({...t,endTime:wt(s),endMinutes:s,slot:i.length+1}),r>o&&i.push({...t,startTime:wt(o),startMinutes:o,slot:i.length+1}))}i.push({...e,slot:i.length+1});const n=i.sort((t,e)=>t.startMinutes-e.startMinutes);return Ct(n)}(r,o),a=Ct(Ut(n));this._saveHistoryState(),this._editingBlocks=a,this._editingSlotIndex=void 0,this._editingSlotData=void 0,this._updateValidationWarnings()}_addNewSlot(){if(!this._editingBlocks||void 0===this._editingBaseTemperature)return;if(this._editingBlocks.length>=12)return;let t=0,e=60;if(this._editingBlocks.length>0){const i=Ut(this._editingBlocks),s=i[i.length-1];if(s.endMinutes<1440)t=s.endMinutes,e=Math.min(t+60,1440);else{let s=!1;for(let o=0;o<i.length;o++){const r=0===o?0:i[o-1].endMinutes;if(i[o].startMinutes>r){t=r,e=i[o].startMinutes,s=!0;break}}if(!s)return}}const i=Math.min(this._editingBaseTemperature+2,this._maxTemp),s={startTime:wt(t),startMinutes:t,endTime:wt(e),endMinutes:e,temperature:i,slot:this._editingBlocks.length+1};this._saveHistoryState();const o=Ut([...this._editingBlocks,s]);this._editingBlocks=o;const r=o.findIndex(i=>i.startMinutes===t&&i.endMinutes===e);r>=0&&this._startSlotEdit(r),this._updateValidationWarnings()}_renderEditor(){if(!this._editingWeekday||!this._editingBlocks)return H``;const t=void 0!==this._editingBaseTemperature?Pt(this._editingBlocks,this._editingBaseTemperature):this._editingBlocks;return H`
      <div class="editor">
        <div class="editor-header">
          <h3>
            ${Nt(this._translations.ui.edit,{weekday:this._getWeekdayLabel(this._editingWeekday,"long")})}
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
                  ${this._validationWarnings.map(t=>H`<li class="warning-item">
                        ${this._translateValidationMessage(t)}
                      </li>`)}
                </ul>
              </div>
            `:""}

        <!-- Base Temperature Section -->
        <div class="base-temperature-section">
          <div class="base-temperature-header">
            <span class="base-temp-label">${this._translations.ui.baseTemperature}</span>
            <span class="base-temp-description"
              >${this._translations.ui.baseTemperatureDescription}</span
            >
          </div>
          <div class="base-temperature-input">
            <input
              type="number"
              class="temp-input base-temp-input"
              .value=${this._editingBaseTemperature?.toString()||"20.0"}
              step=${this._tempStep}
              min=${this._minTemp}
              max=${this._maxTemp}
              @change=${t=>{this._saveHistoryState(),this._editingBaseTemperature=parseFloat(t.target.value),this.requestUpdate()}}
            />
            <span class="temp-unit">${this._config?.temperature_unit||"°C"}</span>
            <div
              class="color-indicator"
              style="background-color: ${Et(this._editingBaseTemperature||20)}"
            ></div>
          </div>
        </div>

        <div class="editor-content-label">${this._translations.ui.temperaturePeriods}</div>
        <div class="editor-content">
          <div class="time-block-header">
            <span class="header-cell header-from">${this._translations.ui.from}</span>
            <span class="header-cell header-to">${this._translations.ui.to}</span>
            <span class="header-cell header-temp">Temp</span>
            <span class="header-cell header-actions"></span>
          </div>
          ${t.map((e,i)=>{const s=this._editingBlocks.findIndex(t=>t.startMinutes===e.startMinutes&&t.endMinutes===e.endMinutes&&t.temperature===e.temperature),o=!(-1!==s);return void 0!==this._editingSlotIndex&&this._editingSlotIndex===s&&void 0!==this._editingSlotData&&this._editingSlotData?H`
                <div class="time-block-editor editing">
                  <input
                    type="time"
                    class="time-input"
                    .value=${this._editingSlotData.startTime}
                    step="${60*(this._config?.time_step_minutes||15)}"
                    @change=${t=>{this._editingSlotData&&(this._editingSlotData={...this._editingSlotData,startTime:t.target.value},this.requestUpdate())}}
                  />
                  <input
                    type="time"
                    class="time-input"
                    .value=${"24:00"===this._editingSlotData.endTime?"23:59":this._editingSlotData.endTime}
                    step="${60*(this._config?.time_step_minutes||15)}"
                    @change=${t=>{if(this._editingSlotData){let e=t.target.value;"23:59"===e&&(e="24:00"),this._editingSlotData={...this._editingSlotData,endTime:e},this.requestUpdate()}}}
                  />
                  <div class="temp-input-group">
                    <input
                      type="number"
                      class="temp-input"
                      .value=${this._editingSlotData.temperature.toString()}
                      step=${this._tempStep}
                      min=${this._minTemp}
                      max=${this._maxTemp}
                      @change=${t=>{this._editingSlotData&&(this._editingSlotData={...this._editingSlotData,temperature:parseFloat(t.target.value)},this.requestUpdate())}}
                    />
                    <span class="temp-unit">${this._config?.temperature_unit||"°C"}</span>
                  </div>
                  <div class="slot-actions">
                    <button class="slot-save-btn" @click=${this._saveSlotEdit}>
                      ${this._translations.ui.saveSlot}
                    </button>
                    <button class="slot-cancel-btn" @click=${this._cancelSlotEdit}>
                      ${this._translations.ui.cancelSlotEdit}
                    </button>
                  </div>
                  <div
                    class="color-indicator"
                    style="background-color: ${Et(this._editingSlotData.temperature)}"
                  ></div>
                </div>
              `:H`
              <div class="time-block-editor ${o?"base-temp-slot":""}">
                <span class="time-display">${e.startTime}</span>
                <span class="time-display">${e.endTime}</span>
                <div class="temp-display-group">
                  <span class="temp-display">${e.temperature.toFixed(1)}</span>
                  <span class="temp-unit">${this._config?.temperature_unit||"°C"}</span>
                </div>
                <div class="slot-actions">
                  ${o?H``:H`
                        <button
                          class="slot-edit-btn"
                          @click=${()=>this._startSlotEditFromDisplay(i,t)}
                          ?disabled=${void 0!==this._editingSlotIndex}
                        >
                          ${this._translations.ui.editSlot}
                        </button>
                        <button
                          class="remove-btn"
                          @click=${()=>this._removeTimeBlockByIndex(i,t)}
                          ?disabled=${void 0!==this._editingSlotIndex}
                        >
                          🗑️
                        </button>
                      `}
                </div>
                <div
                  class="color-indicator"
                  style="background-color: ${Et(e.temperature)}"
                ></div>
              </div>
            `})}
          ${this._editingBlocks.length<12&&void 0===this._editingSlotIndex?H`
                <button class="add-btn" @click=${this._addNewSlot}>
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
    `}_removeTimeBlockByIndex(t,e){if(!this._editingBlocks||void 0===this._editingBaseTemperature)return;const i=e[t],s=this._editingBlocks.findIndex(t=>t.startMinutes===i.startMinutes&&t.endMinutes===i.endMinutes&&t.temperature===i.temperature);if(-1===s)return;this._saveHistoryState();const o=this._editingBlocks.filter((t,e)=>e!==s);this._editingBlocks=Ct(Ut(o)),this._updateValidationWarnings()}static get styles(){return n`
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

      .time-block.base-temp-block {
        color: var(--secondary-text-color, #666);
        text-shadow: none;
        border-top: 1px dashed var(--divider-color, #ccc);
      }

      .time-block.base-temp-block:first-child {
        border-top: none;
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

      .time-block-header {
        display: grid;
        grid-template-columns: 70px 70px 90px 1fr 24px;
        gap: 8px;
        align-items: center;
        padding: 8px;
        border-bottom: 2px solid var(--divider-color);
        font-weight: 500;
        font-size: 12px;
        color: var(--secondary-text-color);
        text-transform: uppercase;
      }

      .header-cell {
        text-align: left;
      }

      .time-block-editor {
        display: grid;
        grid-template-columns: 70px 70px 90px 1fr 24px;
        gap: 8px;
        align-items: center;
        padding: 8px;
        border-bottom: 1px solid var(--divider-color);
      }

      .time-block-editor.editing {
        background-color: var(--primary-color-light, rgba(3, 169, 244, 0.1));
        border: 1px solid var(--primary-color);
        border-radius: 4px;
        margin: 4px 0;
      }

      .time-block-editor.base-temp-slot {
        opacity: 0.6;
        background-color: var(--divider-color);
      }

      .time-display {
        font-size: 14px;
        color: var(--primary-text-color);
        font-family: monospace;
      }

      .temp-display-group,
      .temp-input-group {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .temp-display {
        font-size: 14px;
        color: var(--primary-text-color);
        font-weight: 500;
      }

      .slot-actions {
        display: flex;
        gap: 4px;
        justify-content: flex-end;
      }

      .slot-edit-btn,
      .slot-save-btn,
      .slot-cancel-btn {
        padding: 4px 8px;
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        background-color: var(--card-background-color);
        color: var(--primary-text-color);
        font-size: 12px;
        cursor: pointer;
        white-space: nowrap;
      }

      .slot-edit-btn:hover,
      .slot-save-btn:hover,
      .slot-cancel-btn:hover {
        background-color: var(--divider-color);
      }

      .slot-save-btn {
        background-color: var(--primary-color);
        color: var(--text-primary-color);
        border-color: var(--primary-color);
      }

      .slot-cancel-btn {
        background-color: var(--error-color, #e74c3c);
        color: white;
        border-color: var(--error-color, #e74c3c);
      }

      .slot-edit-btn:disabled,
      .remove-btn:disabled {
        opacity: 0.3;
        cursor: not-allowed;
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
        width: 100%;
        box-sizing: border-box;
      }

      .time-input {
        max-width: 70px;
      }

      .temp-input {
        max-width: 60px;
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
        flex-shrink: 0;
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
    `}};t([xt({attribute:!1})],Lt.prototype,"hass",void 0),t([kt()],Lt.prototype,"_config",void 0),t([kt()],Lt.prototype,"_currentProfile",void 0),t([kt()],Lt.prototype,"_scheduleData",void 0),t([kt()],Lt.prototype,"_simpleScheduleData",void 0),t([kt()],Lt.prototype,"_availableProfiles",void 0),t([kt()],Lt.prototype,"_activeEntityId",void 0),t([kt()],Lt.prototype,"_editingWeekday",void 0),t([kt()],Lt.prototype,"_editingBlocks",void 0),t([kt()],Lt.prototype,"_editingBaseTemperature",void 0),t([kt()],Lt.prototype,"_copiedSchedule",void 0),t([kt()],Lt.prototype,"_isLoading",void 0),t([kt()],Lt.prototype,"_currentTimePercent",void 0),t([kt()],Lt.prototype,"_currentTimeMinutes",void 0),t([kt()],Lt.prototype,"_currentWeekday",void 0),t([kt()],Lt.prototype,"_translations",void 0),t([kt()],Lt.prototype,"_isCompactView",void 0),t([kt()],Lt.prototype,"_validationWarnings",void 0),t([kt()],Lt.prototype,"_pendingChanges",void 0),t([kt()],Lt.prototype,"_isDragging",void 0),t([kt()],Lt.prototype,"_isDragDropMode",void 0),t([kt()],Lt.prototype,"_minTemp",void 0),t([kt()],Lt.prototype,"_maxTemp",void 0),t([kt()],Lt.prototype,"_tempStep",void 0),t([kt()],Lt.prototype,"_editingSlotIndex",void 0),t([kt()],Lt.prototype,"_editingSlotData",void 0),Lt=t([(t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)})("homematicip-local-climate-schedule-card")],Lt),window.customCards=window.customCards||[],window.customCards.push({type:"homematicip-local-climate-schedule-card",name:"Homematic(IP) Local Climate Schedule Card",description:"Display and edit Homematic thermostat schedules",preview:!0});export{Lt as HomematicScheduleCard};
