import logo from './logo.svg';
import {BrowserRouter as Router,Route,Routes} from "react-router-dom"
import './App.css';
import HomePage from './component/HomePage';

function App() {
  return (

    <Router>
      <Routes>
        <Route path='/' element={<HomePage></HomePage>}/>
      </Routes>
    </Router>

  );
}

export default App;
