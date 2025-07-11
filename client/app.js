import "./styles.scss";

import { Route, Routes } from "react-router-dom";

import Crons from "./pages/index.js";
// // import CronsSettings from "./pages/settings.js";

import CronsProvider from "./contexts/crons.js";

const App = () => {
  return (
    <CronsProvider>
      <Routes>
        <Route index element={<Crons />} />
        {/* <Route path="settings" element={<CronsSettings />} /> */}
      </Routes>
    </CronsProvider>
  );
};

export default App;
