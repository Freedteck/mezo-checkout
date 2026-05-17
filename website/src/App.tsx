import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home/Home";
import Docs from "./pages/Docs/Docs";
import Playground from "./pages/Playground/Playground";
import Changelog from "./pages/Changelog/Changelog";

// Docs Pages
import Introduction from "./pages/Docs/pages/Introduction";
import Installation from "./pages/Docs/pages/Installation";
import Providers from "./pages/Docs/pages/Providers";
import ComponentDocs from "./pages/Docs/pages/ComponentDocs";
import HooksDocs from "./pages/Docs/pages/HooksDocs";
import EscrowFlow from "./pages/Docs/pages/EscrowFlow";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/docs" element={<Docs />}>
            <Route index element={<Introduction />} />
            <Route path="installation" element={<Installation />} />
            <Route path="providers" element={<Providers />} />
            <Route path="component" element={<ComponentDocs />} />
            <Route path="hooks" element={<HooksDocs />} />
            <Route path="escrow-flow" element={<EscrowFlow />} />
          </Route>
          <Route path="/playground" element={<Playground />} />
          <Route path="/changelog" element={<Changelog />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
