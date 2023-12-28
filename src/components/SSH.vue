<template>
    <div id="terminal" ref="terminal"></div>
</template>

<script>
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css'
// import { ImageAddon, IImageAddonOptions } from '@xterm/addon-image';
// import { WebglAddon } from '@xterm/addon-webgl';
// import { CanvasAddon } from '@xterm/addon-canvas';
// import { FitAddon } from '@xterm/addon-fit';
// import { WebLinksAddon } from '@xterm/addon-web-links';
// import { SearchAddon } from '@xterm/addon-search';
// import { SerializeAddon } from "@xterm/addon-serialize";
// import { AttachAddon } from '@xterm/addon-attach';


export default {
    props:{
        wegGL:{
            type: Boolean,
            default: true
        }
    },
    data(){
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
            // fitAddon: new FitAddon(),
            // searchAddon: new SearchAddon(),
            // serializeAddon: new SerializeAddon()
        }
    },
    methods:{
        async createTerminal(){
            this.terminal = new Terminal({
				// lineHeight: 1.2,
				fontSize: 14,
				fontFamily: "Monaco, Menlo, Consolas, 'Courier New', monospace",
				theme: {
					background: '#181d28',
				},
				// 光标闪烁
				cursorBlink: true,
				cursorStyle: 'underline',
				// scrollback: 100,
				// tabStopWidth: 4,
			})

            // this.terminal.loadAddon(this.fitAddon) // 自适应组件
            // this.terminal.loadAddon(this.searchAddon)
            // this.terminal.loadAddon(this.serializeAddon)
            // this.terminal.loadAddon(new WebLinksAddon());
            // this.terminal.loadAddon(new ImageAddon(this.imageOptions))
            // this.terminal.loadAddon(new CanvasAddon())
            // this.wegGL ? this.terminal.loadAddon(new WebglAddon()) : this.terminal.loadAddon(new CanvasAddon()) // 使用WebGL/Canvas

            // this.terminal.unicode.activeVersion = '11';
            this.terminal.open(this.$refs.terminal, true)
            
            // this.terminal.clear()

            // this.fitAddon.fit()

            // this.terminal.focus()

            this.terminal.onData((data) => {
            });

            // this.terminal.onTitleChange((title) => {
            //     document.title = title;
            // });

        },
        termKeyCode() {
			const TERMINAL_INPUT_KEY = {
				BACK: 8, // 退格删除键
				ENTER: 13, // 回车键
				UP: 38, // 方向盘上键
				DOWN: 40, // 方向盘键
				LEFT: 37, // 方向盘左键
				RIGHT: 39, // 方向盘右键
			};
			const { eqpCode, server } = {"":"","":""};
			let inputText = "";
			let currentIndex = 0;
			let inputTextList = [];
            this.prefix = "[root@serverip ~]#"
			this.terminal.onKey((e) => {
				const { key, domEvent } = e;
				const { keyCode, altKey, altGraphKey, ctrlKey, metaKey } = domEvent;

				const printAble = !(altKey || altGraphKey || ctrlKey || metaKey); // 禁止相关按键
				const totalOffsetLength = inputText.length + this.prefix.length; // 总偏移量
				const currentOffsetLength = this.terminal._core.buffer.x; // 当前x偏移量

				switch (keyCode) {
					//删除
					case TERMINAL_INPUT_KEY.BACK:
						if (currentOffsetLength > this.prefix.length) {
							const cursorOffSetLength = this.getCursorOffsetLength(totalOffsetLength - currentOffsetLength, "\x1b[D"); // 保留原来光标位置

							this.terminal._core.buffer.x = currentOffsetLength - 1;
							this.terminal.write("\x1b[?K" + inputText.slice(currentOffsetLength - this.prefix.length));
							this.terminal.write(cursorOffSetLength);
							inputText = `${inputText.slice(0, currentOffsetLength - this.prefix.length - 1)}${inputText.slice(
								currentOffsetLength - this.prefix.length
							)}`;
						}
						break;
					//回车
					case TERMINAL_INPUT_KEY.ENTER: {
						this.terminal.write("\r\n");
						console.log("inputText", inputText);
						//ws 通信参数
						let wsParams = { EqpCode: eqpCode, Action: "terminal", Data: inputText };
						this.$emit("websocketSend", wsParams, server);

						if (!inputText.trim()) {
							this.terminal.prompt();
							return;
						}

						if (inputTextList.indexOf(inputText) === -1) {
							inputTextList.push(inputText);
							currentIndex = inputTextList.length;
						}

						this.terminal.prompt();
						inputText = "";
						break;
					}

					case TERMINAL_INPUT_KEY.UP: {
						if (!inputTextList[currentIndex - 1]) break;

						const offsetLength = this.getCursorOffsetLength(inputText.length, "\x1b[D");

						inputText = inputTextList[currentIndex - 1];
						this.terminal.write(offsetLength + "\x1b[?K");
						this.terminal.write(inputTextList[currentIndex - 1]);
						this.terminal._core.buffer.x = totalOffsetLength;
						currentIndex--;

						break;
					}
					case TERMINAL_INPUT_KEY.LEFT:
						if (currentOffsetLength > this.prefix.length) {
							this.terminal.write(key); // '\x1b[D'
						}
						break;

					case TERMINAL_INPUT_KEY.RIGHT:
						if (currentOffsetLength < totalOffsetLength) {
							this.terminal.write(key); // '\x1b[C'
						}
						break;
					default: {
						// 在当前的坐标写上 key 和坐标后面的字符
						// 移动停留在当前位置的光标
						if (!printAble) break;
						if (totalOffsetLength >= this.terminal.cols) break;
						if (currentOffsetLength >= totalOffsetLength) {
							this.terminal.write(key);
							inputText += key;
							break;
						}
						let cursorOffSetLength = this.getCursorOffsetLength(totalOffsetLength - currentOffsetLength, "\x1b[D");
						this.terminal.write("\x1b[?K" + `${key}${inputText.slice(currentOffsetLength - this.prefix.length)}`);
						this.terminal.write(cursorOffSetLength);
						inputText = inputText.slice(0, currentOffsetLength) + key + inputText.slice(totalOffsetLength - currentOffsetLength);
						break;
					}
				}
			});
		},
    },
    mounted(){
        setTimeout(()=>{
			this.createTerminal()
		},3000)
    }
}
</script>

<style lang="scss" scoped>
#terminal{
    width: 100%;
    height: 100%;
}
</style>