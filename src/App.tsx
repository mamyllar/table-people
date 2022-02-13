import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Table from "./components/Table";

function App() {

//Code from Table.tsx could also be here, but this way it's easier to add other element later

  return (
    <div className="app-container">
      <Table />
    </div>
  );
}

export default App;
