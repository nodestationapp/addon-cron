import { html } from "@codemirror/lang-html";
import { EditorView } from "@codemirror/view";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { basicLight, basicDark } from "@uiw/codemirror-theme-basic";

import { useColorScheme } from "@mui/material/styles";

const CodeEditor = ({ value, onChange, language = "html" }) => {
  const { mode, systemMode } = useColorScheme();
  const currentMode = systemMode || mode;

  const lang = language === "js" ? javascript() : html();

  return (
    <CodeMirror
      value={value}
      minHeight="250px"
      style={{ flex: 1 }}
      extensions={[lang, EditorView.lineWrapping]}
      theme={currentMode === "dark" ? basicDark : basicLight}
      onChange={onChange}
    />
  );
};

export default CodeEditor;
