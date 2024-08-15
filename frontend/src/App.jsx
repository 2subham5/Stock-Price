import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import LiveStock from './Component/LiveStock';
import StockGraph from './Component/Stockgraph';
import  List  from './Component/List';

function App() {


  return (
   <div>
    <Router>
      <Routes>
      <Route path="/" element={<List/>} ></Route>
         <Route path="/check" element={<LiveStock/>} ></Route>
         <Route path='/graph' element={<StockGraph/>}></Route>
      </Routes>
    </Router>
   </div>
  )
}

export default App;
