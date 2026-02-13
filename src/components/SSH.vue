<template>
    <div id="terminal" ref="terminal"></div>
</template>

<script>
import { CreateNewWebSocket } from "@/utils/websocket";
import { Terminal } from 'xterm';
import { ImageAddon, IImageAddonOptions } from 'xterm-addon-image';
import { WebglAddon } from '@xterm/addon-webgl';
import { CanvasAddon } from '@xterm/addon-canvas';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { SearchAddon } from '@xterm/addon-search';
import { SerializeAddon } from "@xterm/addon-serialize";
import { Unicode11Addon } from '@xterm/addon-unicode11';
// import { AttachAddon } from '@xterm/addon-attach';
import 'xterm/css/xterm.css'

import Base64 from "crypto-js/enc-base64"
import Utf8 from "crypto-js/enc-utf8"

export default {
    props:{
        wsurl:{
            type:String,
            default:"",
        },
        webGL:{
            type: Boolean,
            default: true
        },
        workdir: {
            type: String,
            default:""
        }
    },
    setup(){
        const imageOptions = {
            enableSizeReports: true,    // whether to enable CSI t reports (see below)
            pixelLimit: 16777216,       // max. pixel size of a single image
            sixelSupport: true,         // enable sixel support
            sixelScrolling: true,       // whether to scroll on image output
            sixelPaletteLimit: 256,     // initial sixel palette size
            sixelSizeLimit: 25000000,   // size limit of a single sixel sequence
            storageLimit: 128,          // FIFO storage limit in MB
            showPlaceholder: true,      // whether to show a placeholder for evicted images
            iipSupport: true,           // enable iTerm IIP support
            iipSizeLimit: 20000000      // size limit of a single IIP sequence
        }

        return {
            terminal: null,
            imageOptions,
            fitAddon: new FitAddon(),
            searchAddon: new SearchAddon(),
            serializeAddon: new SerializeAddon(),
			cursorPosition:{
				col: 0,
				row: 0
			},
			ws:null,enc:null, closer:null
        }
    },
    methods:{
        write(text){
            this.terminal.write(text)
        },
        writeln(text){
            this.terminal.writeln(text)
        },
        wsOpen(ws){
		    ws.binaryType = 'arraybuffer'
            this.enc = new TextDecoder("utf-8");
            this.ws = ws
            this.resizeScreen()
            this.$message.success("SSH连接成功...")
            if(this.workdir.length > 0){
                this.ws.send('1' + Base64.stringify(Utf8.parse(`cd ${this.workdir} && clear\n`)),ArrayBuffer)
            }
        },
        wsReConnect(ws){
            ws.binaryType = 'arraybuffer'
            this.enc = new TextDecoder("utf-8");
            this.ws = ws
            this.resizeScreen()
            // this.terminal.writeln("\r\n")
            this.$message.success("SSH服务器重连成功...")
        },
        wsInputMessage(e){
            this.terminal.write(this.enc.decode(e.data));
        },
        wsClose(){
        },
        wsError(){
            this.$message.error(`连接异常，即将尝试重新连接...`)
        },
		resizeScreen(){
			this.fitAddon.fit();
			this.ws.send('2' +
                Base64.stringify(
                    Utf8.parse(
                        JSON.stringify({
                            columns: this.terminal?.cols,
                            rows: this.terminal?.rows
                        })
                    )
                ),ArrayBuffer
            )
		},
        async createTerminal(){
            this.terminal = new Terminal({
				lineHeight: 1.2,
				fontSize: 15,
				allowProposedApi: true,
				fontFamily: "Monaco, Menlo, Consolas, 'Courier New', monospace",
				theme: {
					background: '#181d28',
				},
				// 光标闪烁
				cursorBlink: true,
				scrollback: 100,
				tabStopWidth: 4,
			})

            this.terminal.loadAddon(this.fitAddon) // 自适应组件
            this.terminal.loadAddon(this.searchAddon)
            this.terminal.loadAddon(this.serializeAddon)
            this.terminal.loadAddon(new WebLinksAddon());
            this.terminal.loadAddon(new ImageAddon(this.imageOptions))
            this.terminal.loadAddon(new CanvasAddon())
            this.terminal.loadAddon(new Unicode11Addon());
            if(this.webGL)
            {
                console.warn("启用WebGL渲染SSH")
                const webGlAddon = new WebglAddon()
                webGlAddon.onContextLoss(e => {
                    webGlAddon.dispose();
                });
                this.terminal.loadAddon(webGlAddon)
            }else{
                this.terminal.loadAddon(new CanvasAddon())
            }

            this.terminal.unicode.activeVersion = '11'

            this.terminal.open(this.$refs.terminal, true)
            
            this.terminal.clear()
            this.fitAddon.fit()
            this.terminal.focus()
			

			window.addEventListener('resize', this.resizeScreen, false);
			
            // this.terminal.onKey((e) => {
			// 	switch(e.domEvent.keyCode){
			// 		// case 13: // 回车换行
			// 		// 	this.terminal.write('\r\n')
			// 		// 	break
			// 		// case 8: // 删除字符
			// 		// 	this.terminal.write('\b \b')
			// 		// 	break
			// 		case 116: // F5
			// 			window.document.reload()
			// 			break
			// 	}
			// });

			this.terminal.onData(data=>{
                if(!this.wsurl.length){
                    return;
                }
                if(!this.ws){
                    this.$message.error("连接还未建立，请耐心等待...")
                    return
                }
				try{
                    this.ws.send('1' + Base64.stringify(Utf8.parse(data)),ArrayBuffer)
                }catch(e){
                    this.$message.error("发送失败连接断开，正在进行重试请稍后...")
                }
			})

        },

    },
    async mounted(){
        await this.createTerminal()
        if(this.wsurl){
            this.closer = CreateNewWebSocket(this.wsurl, 'arraybuffer')(
            this.wsOpen, 
            this.wsReConnect, 
            this.wsClose, 
            this.wsInputMessage, 
            this.wsError)
        }
    },
	beforeUnmount(){
        this.ws?.close()
        if(this.closer){
            this.closer()
        }
        this.terminal.clear()
		window.removeEventListener('resize', this.resizeScreen);
	}
}
</script>

<style lang="scss" scoped>
#terminal{
    width: 100%;
    height: 100%;
}
</style>