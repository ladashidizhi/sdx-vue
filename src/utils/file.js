
// SelectFile 立刻选取文件
// Example:
/*
        import { SelectFile } from "@/utils/file.js"
        SelectFile().then((files)=>{
            console.log(files)
            const formData = new FormData()
            ...
        }).catch(()=>{
            console.log("用户取消了操作")
        })
        // 或者
        let files = []
        try{
            files = await SelectFile()
        }catch(e){
             console.log("用户取消了操作")
        }
        if(files.length > 0){
            ...
        }
 */
export function SelectFile(accept = ["*.*"], multiple = true) {
    return new Promise((resolve, reject) => {
        const fileElement = window.document.createElement("input")
        fileElement.type = "file"
        fileElement.multiple = multiple
        fileElement.accept = accept.join(', ')
        fileElement.style.display = "none"
        fileElement.addEventListener('change', () => {
            const files = []
            fileElement.remove()
            resolve((Array.prototype.push.apply(files, fileElement.files), files))
        })
        fileElement.addEventListener("blur", () => {
            fileElement.remove()
            reject("User Cancel...")
        })
        window.document.body.appendChild(fileElement)
        fileElement.click()
    })
}

// DownloadFile 下载文件
/*
    SelectFile([".jpg", ".png", ".gif"]).then((files) => {
        DownloadFile(files[0], "1.png", "image/png") // 仅需一行调用即可完成下载
    })
 */
export function DownloadFile(buffer, filename, type) {
    const blob = new window.Blob([buffer], { type });
    const blobUrl = window.URL.createObjectURL(blob);
    const fileLink = window.document.createElement("a")

    fileLink.href = blobUrl
    fileLink.download = filename
    window.document.body.appendChild(fileLink)
    fileLink.click()
    fileLink.remove()

    window.URL.revokeObjectURL(url);
}