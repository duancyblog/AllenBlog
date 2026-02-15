window.commentOnPost=function(o){const e=o.dataset.content;console.log("commentOnPost called with content:",e);const t=document.getElementById("comments-section");t?(console.log("Found comments section, scrolling..."),t.scrollIntoView({behavior:"smooth"})):(console.log("Comments section not found, scrolling to bottom..."),window.scrollTo({top:document.body.scrollHeight,behavior:"smooth"})),setTimeout(()=>{console.log("Trying to find textarea...");const n=document.querySelector(".el-textarea__inner")||document.querySelector("#twikoo textarea")||document.querySelector("textarea");n&&e?(console.log("Found textarea:",n),n.value=`> ${e}

`,n.focus(),n.dispatchEvent(new Event("input",{bubbles:!0})),console.log("Content filled into textarea")):(console.log("Textarea not found, trying again..."),setTimeout(()=>{const s=document.querySelector(".el-textarea__inner")||document.querySelector("textarea");s&&e?(console.log("Found textarea on retry:",s),s.value=`> ${e}

`,s.focus(),s.dispatchEvent(new Event("input",{bubbles:!0})),console.log("Content filled into textarea on retry")):console.log("Textarea still not found")},500))},800)};async function h(){const o=document.getElementById("essays-container");if(!(!o||o.dataset.needsFetch!=="true"))try{console.log("Client-side fetching Ech0 posts...");const e=await fetch("https://say.allen2030.com/rss");if(!e.ok)throw new Error(`Failed to fetch: ${e.status}`);const t=await e.text();console.log("Client-side RSS response length:",t.length);const n=f(t);console.log("Client-side parsed entries:",n.length),n.length>0&&w(n)}catch(e){console.error("Client-side fetch error:",e)}}function f(o){const e=/<entry>([\s\S]*?)<\/entry>/g,t=[];let n=null,s=0;for(;n=e.exec(o),n!==null;){const r=n[1];s++;const i=r.match(/<updated>([\s\S]*?)<\/updated>/),d=i?i[1]:"",g=r.match(/<summary[^>]*>([\s\S]*?)<\/summary>/i);let m=(g?g[1]:"").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#34;/g,'"').replace(/&#39;/g,"'").replace(/&#xA;/g,`
`);const v=m.replace(/<[^>]*>/g,"").trim()||"[图片]",c=[],p=/<img[^>]*src=["']([^"']+)["']/gi;let a=null;for(;a=p.exec(m),a!==null;){let l=a[1];l.startsWith("http://")&&(l=l.replace("http://","https://")),c.push(l)}const x=d?new Date(d).toISOString().split("T")[0]:new Date().toISOString().split("T")[0];t.push({id:s,content:v,time:x,tags:["生活"],images:c.length>0?c:void 0})}return t.sort((r,i)=>i.id-r.id)}function w(o){const e=document.getElementById("essays-container");e&&(e.innerHTML=o.map(t=>`
            <div class="essay-item bg-[var(--card-bg)] rounded-lg p-6 shadow-sm border border-[var(--line-divider)] transition-all hover:shadow-md">
                <div class="essay-content text-90 text-lg leading-relaxed mb-4">${u(t.content)}</div>
                
                ${t.images&&t.images.length>0?`
                    <div class="essay-images mb-4">
                        <div class="custom-md grid gap-3 ${t.images.length===1?"grid-cols-1":t.images.length===2?"grid-cols-2":t.images.length===3?"grid-cols-3":"grid-cols-2 md:grid-cols-3"}">
                            ${t.images.map((n,s)=>`
                                <div class="rounded-lg overflow-hidden bg-[var(--btn-card-bg-hover)]">
                                    <img 
                                        src="${n}" 
                                        alt="瞬间图片 ${s+1}"
                                        class="w-full h-48 object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                                        loading="lazy"
                                    />
                                </div>
                            `).join("")}
                        </div>
                    </div>
                `:""}
                
                <div class="essay-meta flex items-center justify-between text-sm text-75">
                    <div class="flex items-center gap-4">
                        <div class="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/></svg>
                            <span>${t.time}</span>
                        </div>
                        
                        <div class="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20 10V8h-4V4h-2v4h-4V4H8v4H4v2h4v4H4v2h4v4h2v-4h4v4h2v-4h4v-2h-4v-4h4zm-6 4h-4v-4h4v4z"/></svg>
                            <div class="flex gap-2">
                                ${t.tags.map(n=>`
                                    <span class="px-2 py-1 bg-[var(--btn-card-bg-hover)] rounded-full text-xs">${n}</span>
                                `).join("")}
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <button 
                            class="flex items-center gap-1 text-sm hover:text-primary transition-colors"
                            data-content="${u(t.content)}"
                            onclick="window.commentOnPost(this)"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>
                            <span>评论</span>
                        </button>
                    </div>
                </div>
            </div>
        `).join(""))}function u(o){const e=document.createElement("div");return e.textContent=o,e.innerHTML}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",h):h();
