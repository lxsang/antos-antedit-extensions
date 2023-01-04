(function(){var t,e;t=this.OS.application.Antedit,e=class extends t.EditorBaseExtension{constructor(t){super("TerminalWrapper",t.app),this.parent=t,this.newTerminal()}newTerminal(){var t;return this.description?this.description.domel.selected=!0:(t=$.parseHTML("<div></div>")[0],this.description={text:__("Terminal"),iconclass:"fa fa-terminal",container:t},this.app.showBottomBar(!0),this.app.bottombar.addTab(this.description,!0),this.term=new Terminal({cursorBlink:!0,fontSize:12}),this.term.loadAddon(this.fitAddon),this.term.setOption("fontSize","12"),this.term.open(t),this.sub=void 0,this.term.onKey(t=>{if(this.sub)return this.sub.send(Antunnel.Msg.DATA,new TextEncoder("utf-8").encode(t.key))}),t.contextmenuHandle=(t,e)=>(e.items=[{text:"__(Copy)",id:"copy"},{text:"__(Paste)",id:"paste"}],e.onmenuselect=t=>{if(t)return this.mctxHandle(t.data.item.data)},e.show(t)),this.resizeContent(),this.resizefn=t=>this.resizeContent(),this.app.on("resize",this.resizefn),$(t).on("focus",t=>this.term.focus()),this.openSession())}resizeContent(t){var e,n,s;if(!$(this.description.container).is(":hidden")&&(this.fitAddon.fit(),n=this.term.cols,s=this.term.rows,this.sub))try{return(e=new Uint8Array(8)).set(Antunnel.Msg.bytes_of(n,4),0),e.set(Antunnel.Msg.bytes_of(s,4),4),this.sub.send(Antunnel.Msg.CTRL,e)}catch(t){}}mctxHandle(t){var e,n;switch(t.id){case"paste":return e=t=>{if(t&&""!==t)return t=t.replace(/\r/g,"").replace(/\n/g,"\r"),this.sub&&this.sub.send(Antunnel.Msg.DATA,new TextEncoder("utf-8").encode(t)),this.term.focus()},this.app._api.getClipboard().then(t=>e(t)).catch(t=>(this.error(__("Unable to paste"),t),this.app.openDialog("TextDialog",{title:"Paste text"}).then(t=>e(t)).catch(t=>this.error(t.toString(),t))));case"copy":if(!(n=this.term.getSelection())||""===n)return;return this.app._api.setClipboard(n)}}openSession(){return this.term.clear(),this.term.focus(),this.sub=new Antunnel.Subscriber("vterm"),this.sub.onopen=()=>(this.resizeContent(),this.term.focus()),this.sub.onerror=t=>(this.error(__("Unable to connect to: vterm"),t),this.cleanup()),this.sub.onmessage=t=>{if(this.term&&t.data)return this.term.write(new TextDecoder("utf-8").decode(t.data))},this.sub.onclose=()=>(this.sub=void 0,this.notify(__("Terminal connection closed")),this.cleanup()),Antunnel.tunnel.subscribe(this.sub)}cleanup(){if(this.resizefn&&this.app.observable&&this.app.off("resize",this.resizefn),this.app.bottombar.selectedIndex=0,this.sub&&this.sub.close(),this.sub=void 0,this.description)return this.app.bottombar.removeTab(this.description.domel),this.description=void 0,this.parent.remove(this)}},t.extensions.AnteditTerminal=class extends t.EditorBaseExtension{constructor(t){super("AnteditTerminal",t),this.terminals=[]}open(){return window.Antunnel?Terminal?Antunnel.tunnel?this.terminals.push(new e(this)):this.app._gui.pushService("Antunnel/AntunnelService").then(t=>{if(this.app.systemsetting.system.tunnel_uri)return Antunnel.init(this.app.systemsetting.system.tunnel_uri).then(t=>(this.notify(__("Tunnel now connected to the server at: {0}",this.app.systemsetting.system.tunnel_uri)),this.terminals.push(new e(this)))).catch(t=>(Antunnel.tunnel&&Antunnel.tunnel.close(),this.error(__("Unable to connect to the tunnel: {0}",t.toString()),t)))}).catch(t=>(this.error(__("Unable to run Antunnel service: {0}",t.toString()),t),this.quit())):this.notify(__("xTerm library is not available")):this.notify(__("Antunnel service is not available"))}remove(t){var e;if((e=this.terminals.indexOf(t))>-1)return this.terminals.splice(e,1)}cleanup(){var t,e,n,s,i;for(s=[],t=0,e=(n=this.terminals).length;t<e;t++)i=n[t],s.push(i.cleanup());return s}},t.extensions.AnteditTerminal.dependencies=["pkg://xTerm/main.js","pkg://xTerm/main.css","pkg://Antunnel/main.js"]}).call(this);