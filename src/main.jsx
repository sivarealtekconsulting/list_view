import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
// import './listview-reference.css';
import App from './App.jsx';
import { ConfigProvider } from 'antd';
import "antd/dist/reset.css";
import "../src/styles/mode-theme.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "Inter, sans-serif",
        },
      }}
    >
      <App />
    </ConfigProvider>
  </StrictMode>
);