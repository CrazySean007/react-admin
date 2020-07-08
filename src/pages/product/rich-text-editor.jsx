import React, {Component} from 'react'
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import {message} from 'antd'

export default class RichTextEditor extends Component {
    state = {
        editorState: null
    }

    async componentDidMount () {

        const {initialInput} = this.props;
        console.log("initialInput: ")
        console.log(initialInput)
        // Assume here to get the editor content in html format from the server
       // const htmlContent = await fetchEditorContent()
        const htmlContent = BraftEditor.createEditorState(initialInput);
        // Use BraftEditor.createEditorState to convert html strings to editorState data needed by the editor
        this.setState({
            editorState: BraftEditor.createEditorState(htmlContent)
        })
    }

    getContent = () => {
        // Pressing ctrl + s when the editor has focus will execute this method
        // Before the editor content is submitted to the server, you can directly call editorState.toHTML () to get the HTML content
        const htmlContent = this.state.editorState.toHTML()
        //const result = await saveEditorContent(htmlContent)
        return htmlContent;
    }

    handleEditorChange = (editorState) => {
        this.setState({ editorState })
    }

    myUploadFn = (param) => {

        // console.log("param.file: ")
        // console.log(param.file)

        const serverURL = '/manage/img/upload'
        const xhr = new XMLHttpRequest()
        const fd = new FormData()

        const successFn = (response) => {
            // 假设服务端直接返回文件上传后的地址
            // 上传成功后调用param.success并传入上传后的文件地址
            // console.log("response: ")
            // console.log(xhr.responseText)
            const result = JSON.parse(xhr.responseText);
            param.success({
                url: result.data.url,
                meta: {
                    id: result.data.name,
                    title: result.data.name,
                    alt: 'image',
                }
            })
        }

        const progressFn = (event) => {
            // 上传进度发生变化时调用param.progress
            param.progress(event.loaded / event.total * 100)
        }

        const errorFn = (response) => {
            // 上传发生错误时调用param.error
            param.error({
                msg: 'unable to upload.'
            })
            message.error('unable to upload.')
        }

        xhr.upload.addEventListener("progress", progressFn, false)
        xhr.addEventListener("load", successFn, false)
        xhr.addEventListener("error", errorFn, false)
        xhr.addEventListener("abort", errorFn, false)

        fd.append('image', param.file)
        xhr.open('POST', serverURL, true)
        xhr.send(fd)

    }

    render () {

        const imageControls = [
            'float-left',
            'float-right',
            'size',
            'remove'
        ]

        const { editorState } = this.state
        return (
            <div className="my-component">
                <BraftEditor
                    value={editorState}
                    onChange={this.handleEditorChange}
                    contentStyle={{width: "100%", minHeight: 150}}
                    language= 'en'
                    media={{uploadFn: this.myUploadFn, accepts: {image: 'image/*'}}}
                    imageControls={imageControls}
                />
            </div>
        )
    }
}