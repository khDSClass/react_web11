import { useMemo, useRef } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageResize from "quill-image-resize-module-react";
import axios from "axios";
Quill.register("modules/ImageResize", ImageResize);

const TextEditor = (props) => {
  const data = props.data;
  const setData = props.setData;
  const url = props.url;

  const imageHandler = () => {
    //input 태그 생성
    const input = document.createElement("input");
    input.setAttribute("type", "file"); //파일업로드용이므로 파일타입설정
    input.setAttribute("accept", "image/*"); //이미지파일만 올리수있도록 파일 제한
    input.click(); //생성한 input을 클릭
    //생성한 input에 change이벤트 적용
    input.onchange = async () => {
      const files = input.files;
      if (files !== null) {
        const form = new FormData();
        form.append("image", files[0]);
        axios
          .post(url, form, {
            headers: {
              contentType: "multipart/form-data",
              processData: false,
            },
          })
          .then((res) => {
            const editor = quillRef.current.getEditor(); //텍스트에디터 dom을 선택
            const range = editor.getSelection(); //에디터 내부 이미지 관리용
            const backServer = process.env.REACT_APP_BACK_SERVER;
            editor.insertEmbed(
              range.index,
              "image",
              backServer + res.data.data
            );
            editor.setSelection(range.index + 1);
          })
          .catch((res) => {
            console.log(res);
          });
      }
    };
  };
  //컴포넌트 내부에서 특정 DOM객체를 선택할때 사용하는 Hooks
  const quillRef = useRef();
  //quill에디터 옵션 형식을 지정(배열)
  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockqoute",
    "list",
    "bullet",
    "align",
    "image",
    "color",
  ];
  //quill에서 사용할 모듈 설정
  //useMemo : 동일한 값을 반환하는 경우 함수를 반복적으로 호출하는 것이 아니라 메모리에 저장해두고 바로 가져오는 hooks
  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ size: ["small", false, "large", "huge"] }, { color: [] }],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
            { align: [] },
          ],
          ["image", "video"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      ImageResize: {
        parchment: Quill.import("parchment"),
        modules: ["Resize", "DisplaySize", "Toolbar"],
      },
    };
  }, []);
  return (
    <ReactQuill
      ref={quillRef}
      formats={formats}
      theme="snow"
      value={data}
      onChange={setData}
      modules={modules}
    />
  );
};

export default TextEditor;
