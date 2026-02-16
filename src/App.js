import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home/Home";
import Lists from "./Pages/Lists/Lists";
import Login from "./Pages/Login/Login";
import New from "./Pages/New/New";
import Single from "./Pages/Single/Single";
import { productInputs, userInputs } from "./formSource";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/">
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="users">
            <Route index element={<Lists />} />
            <Route path=":userId" element={<Single />} />
            <Route path="new" element={<New inputs={userInputs} />} />
          </Route>
          <Route path="products">
            <Route index element={<Lists />} />
            <Route path=":productId" element={<Single />} />
            <Route path="new" element={<New inputs={productInputs} />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
