import "./formFrm.css";

const Input = (props) => {
  const data = props.data; //input태그와 연결할 state
  const setData = props.setData; //state값 변경 함수
  const type = props.type;
  const content = props.content;
  const blurEvent = props.blurEvent;
  const changeData = (e) => {
    setData(e.target.value);
  };
  return (
    <input
      className="input-form"
      id={content}
      type={type}
      value={data || ""}
      onChange={changeData}
      onBlur={blurEvent}
    />
  );
};

const Button1 = (props) => {
  const text = props.text;
  const clickEvent = props.clickEvent;
  return (
    <button className="btn st1" type="button" onClick={clickEvent}>
      {text}
    </button>
  );
};

const Button2 = (props) => {
  const text = props.text;
  const clickEvent = props.clickEvent;
  return (
    <button className="btn st2" type="button" onClick={clickEvent}>
      {text}
    </button>
  );
};

const Button3 = (props) => {
  const text = props.text;
  const clickEvent = props.clickEvent;
  return (
    <button className="btn st3" type="button" onClick={clickEvent}>
      {text}
    </button>
  );
};

export { Input, Button1, Button2, Button3 };
