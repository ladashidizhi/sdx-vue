<template>
  <div id="code_box" ref="code_box"></div>
</template>

<script>
import * as monaco from "monaco-editor";
import { language as jsLanguage } from "monaco-editor/esm/vs/basic-languages/javascript/javascript";
import { language as cssLanguage } from "monaco-editor/esm/vs/basic-languages/css/css";
import { language as phpLanguage } from "monaco-editor/esm/vs/basic-languages/php/php";
import "monaco-editor-nginx";

import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === "json") {
      return new jsonWorker();
    }
    if (label === "css" || label === "scss" || label === "less") {
      return new cssWorker();
    }
    if (label === "html" || label === "handlebars" || label === "razor") {
      return new htmlWorker();
    }
    if (label === "typescript" || label === "javascript") {
      return new tsWorker();
    }
    return new editorWorker();
  },
};

export default {
  props: {
    fontSize: {
      type: Number,
      default: () => 22,
    },
    theme: {
      type: Number,
      default: () => 1,
    },
    language: {
      type: String,
      default: () => ``,
    },
    modelValue: String,
  },
  // emits: ["update:modelValue"],
  mounted() {
    this.init();
    this.registerHtmlLanguage();
    this.registerPHPLanguage();
  },
  methods: {
    // registerHtmlLanguage(){
    //     monaco.languages.registerCompletionItemProvider('html', {
    //         provideCompletionItems: function(model, position) {
    //             // get editor content before the pointer
    //             var textUntilPosition = model.getValueInRange({
    //                 startLineNumber: position.lineNumber,
    //                 startColumn: 1,
    //                 endLineNumber: position.lineNumber,
    //                 endColumn: position.column
    //             });
    //             var match = textUntilPosition.match(/(\S+)$/);
    //             if (!match) return [];
    //             match = match[0].toUpperCase();
    //             var suggestions = [];
    //             keywords.forEach(item => {
    //                 if (item.toUpperCase().indexOf(match) > -1) {
    //                     suggestions.push({
    //                         label: item,
    //                         kind: monaco.languages.CompletionItemKind.Keyword,
    //                         insertText: item
    //                     });
    //                 }
    //             });
    //             operators.forEach(item => {
    //                 if (item.toUpperCase().indexOf(match) > -1) {
    //                     suggestions.push({
    //                         label: item,
    //                         kind: monaco.languages.CompletionItemKind.Operator,
    //                         insertText: item
    //                     });
    //                 }
    //             });
    //             builtinFunctions.forEach(item => {
    //                 if (item.toUpperCase().indexOf(match) > -1) {
    //                     suggestions.push({
    //                         label: item,
    //                         kind: monaco.languages.CompletionItemKind.Function,
    //                         insertText: item
    //                     });
    //                 }
    //             });
    //             return {
    //                 suggestions
    //             };
    //         }
    //     });
    // },
    registerPHPLanguage() {
      const keywords = [...phpLanguage.phpKeywords, "<?php", "echo", "die"],
        builtinFunctions = [
          ...phpLanguage.phpPreDefinedVariables,
          ...phpLanguage.phpCompileTimeConstants,
          "phpinfo",
        ];
      monaco.languages.registerCompletionItemProvider("php", {
        provideCompletionItems: function (model, position) {
          // get editor content before the pointer
          var textUntilPosition = model.getValueInRange({
            startLineNumber: position.lineNumber,
            startColumn: 1,
            endLineNumber: position.lineNumber,
            endColumn: position.column,
          });
          var match = textUntilPosition.match(/(\S+)$/);
          if (!match) return [];
          match = match[0].toUpperCase();
          var suggestions = [];
          keywords.forEach((item) => {
            if (item.toUpperCase().indexOf(match) > -1) {
              suggestions.push({
                label: item,
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText: item,
              });
            }
          });
          builtinFunctions.forEach((item) => {
            if (item.toUpperCase().indexOf(match) > -1) {
              suggestions.push({
                label: item,
                kind: monaco.languages.CompletionItemKind.Function,
                insertText: `${item}()`,
              });
            }
          });
          return {
            suggestions,
          };
        },
      });
    },
    registerHtmlLanguage() {
      const keywords = [
        ...[
          { label: "html", value: "<html></html>" },
          { label: "head", value: "<head></head>" },
          { label: "meta", value: "<meta></meta>" },
          { label: "title", value: "<title></title>" },
          { label: "body", value: "<body></body>" },
          { label: "header", value: "<header></header>" },
          { label: "footer", value: "<footer></footer>" },
          { label: "nav", value: "<nav></nav>" },
          { label: "main", value: "<main></main>" },
          { label: "article", value: "<article></article>" },
          { label: "section", value: "<section></section>" },
          { label: "aside", value: "<aside></aside>" },
          { label: "h1", value: "<h1></h1>" },
          { label: "h2", value: "<h2></h2>" },
          { label: "h3", value: "<h3></h3>" },
          { label: "h4", value: "<h4></h4>" },
          { label: "h5", value: "<h5></h5>" },
          { label: "h6", value: "<h6></h6>" },
          { label: "p", value: "<p></p>" },
          { label: "ul", value: "<ul></ul>" },
          { label: "li", value: "<li></li>" },
          { label: "ol", value: "<ol></ol>" },
          { label: "dl", value: "<dl></dl>" },
          { label: "dt", value: "<dt></dt>" },
          { label: "dd", value: "<dd></dd>" },
          { label: "video", value: "<video></video>" },
          { label: "table", value: "<table></table>" },
          { label: "tr", value: "<tr></tr>" },
          { label: "td", value: "<td></td>" },
          { label: "th", value: "<th></th>" },
          { label: "thead", value: "<thead></thead>" },
          { label: "tbody", value: "<tbody></tbody>" },
          { label: "tfoot", value: "<tfoot></tfoot>" },
          { label: "form", value: "<form></form>" },
          { label: "textarea", value: "<textarea></textarea>" },
          { label: "option", value: "<option></option>" },
          { label: "select", value: "<select></select>" },
          { label: "button", value: "<button></button>" },
          { label: "label", value: "<label></label>" },
          { label: "div", value: "<div></div>" },
          { label: "span", value: "<span></span>" },
          { label: "strong", value: "<strong></strong>" },
          { label: "em", value: "<em></em>" },
        ],
        ...[
          { label: "img", value: "<img/>" },
          { label: "a", value: "<a/>" },
          { label: "audio", value: "<audio/>" },
          { label: "input", value: "<input/>" },
        ],
        ...[
          {
            label: "src",
            value: `src=""`,
            type: monaco.languages.CompletionItemKind.Property,
          },
          {
            label: "href",
            value: `href=""`,
            type: monaco.languages.CompletionItemKind.Property,
          },
          {
            label: "style",
            value: `style=""`,
            type: monaco.languages.CompletionItemKind.Property,
          },
          {
            label: "type",
            value: `type=""`,
            type: monaco.languages.CompletionItemKind.Property,
          },
          {
            label: "disabled",
            value: `disabled=""`,
            type: monaco.languages.CompletionItemKind.Property,
          },
          {
            label: "html:5",
            value: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    
</body>
</html>`,
          },
        ],
      ];
      monaco.languages.registerCompletionItemProvider("html", {
        provideCompletionItems: function (model, position) {
          // get editor content before the pointer
          var textUntilPosition = model.getValueInRange({
            startLineNumber: position.lineNumber,
            startColumn: 1,
            endLineNumber: position.lineNumber,
            endColumn: position.column,
          });
          var match = textUntilPosition.match(/(\S+)$/);
          if (!match) return [];
          match = match[0].toUpperCase();
          var suggestions = [];
          keywords.forEach((item) => {
            if (item.label.toUpperCase().indexOf(match) > -1) {
              suggestions.push({
                label: item.label,
                kind: item.type || monaco.languages.CompletionItemKind.Constant,
                insertText: item.value,
              });
            }
          });
          return {
            suggestions,
          };
        },
      });
    },
    keyBoardEvent() {
      let ctrl = false;
      this.monacoEditor.onKeyDown((e) => {
        switch (e.keyCode) {
          case 5:
            e.preventDefault();
            ctrl = true;
            break;
          case 49:
            if (ctrl) {
              e.preventDefault();
              this.$emit("save");
            }
            return;
        }
      });

      this.monacoEditor.onKeyUp((e) => {
        switch (e.keyCode) {
          case 5:
            ctrl = false;
        }
        this.$emit("update:modelValue", this.monacoEditor.getValue());
      });
    },
    actionToTrigger(id) {
      // this.monacoEditor.getActions().forEach((i)=>{
      //   console.log(this.monacoEditor.getAction(i.id))
      // })
      switch (id) {
        case "editor.action.gotoLine":
          this.monacoEditor.focus();
          break;
      }
      return this.monacoEditor.getAction(id).run();
    },
    init() {
      let theme =
        this.language.toUpperCase() === "NGINX"
          ? "nginx-theme"
          : this.theme < 2
          ? "vs"
          : "hc";
      // 'vs' (default), 'vs-dark', 'hc-black', 'hc-light.
      switch (this.theme) {
        case 1: // dark
          theme += "-dark";
          break;
        case 2: // black
          theme += "-black";
          break;
        case 3: // light
          theme += "-light";
          break;
      }
      //
      this.monacoEditor = monaco.editor.create(this.$refs.code_box, {
        value: this.modelValue, //                                                        代码
        readOnly: false, //                                                         只读
        language: this.language, //                                                       语法
        theme: theme, //                                                        主题            vs/vs-dark/hc-black （可使用defineTheme中的主题）
        folding: true, //                                                           代码折叠
        foldingHighlight: true, // 折叠等高线
        foldingStrategy: "indentation",
        emptySelectionClipboard: false,
        selectionClipboard: false,
        codeLens: false,
        scrollBeyondLastLine: false,
        colorDecorators: true,
        accessibilitySupport: "auto",
        lineNumbers: "on",
        enableSplitViewResizing: false,
        position: true,
        showFoldingControls: "always", //                                         折叠图标显示     mouseover/always
        quickSuggestions: true, //                                                  支持搜索         ctrl + F
        automaticLayout: true, //                                                   resize自动布局
        cursorStyle: "line", //                                                     光标样式         line/block/underline/line-thin/block-outline/underline-thin
        roundedSelection: true, //                                                  控制选区是否有圆角
        fontSize: this.fontSize,
        wordWrap: "on",
        minimap: {
          enabled: false, // 不要小地图
        },
      });
      this.keyBoardEvent();
      // console.log(this.getActionToTrigger("actions.find"))
    },
  },
  watch: {
    // language: {
    //   handler(v, o) {
    //     console.log(v, o);
    //     if (typeof o !== "undefined") {
    //       if (v != o) {
    //         this.init();
    //         this.registerHtmlLanguage();
    //         this.registerPHPLanguage();
    //       }
    //     }
    //   },
    //   immediate: true,
    //   deep: true,
    // },
    modelValue(val) {
      if (this.monacoEditor.getValue() !== val) {
        this.monacoEditor.setValue(val);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#code_box {
  width: 100%;
  height: 100%;
}
</style>