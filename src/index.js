import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';


import Home from './components/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import Insights from './components/Insights';
import Payouts from './components/Payouts';
import CreateMemberships from './components/CreateMemberships';
import CreateContent from './components/CreateContent';
import CreateNFT from './components/CreateNFT'
import CreateMarketplace from './components/CreateMarketplace'
import { ApolloProvider } from "@apollo/client";
import client from "./apollo-client";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
   <ApolloProvider client={client}>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="home" element={<Home />} />
      <Route path="insights" element={<Insights />} />
      <Route path="payouts" element={<Payouts />} />
      <Route path="createcontent" element={<CreateContent />} />
      <Route path="createmembership" element={<CreateMemberships />} />
      <Route path="create-nfts" element={<CreateNFT />} />
      <Route path="marketplace" element={<CreateMarketplace />} />
      <Route path="dashboard" element={<CreateMarketplace />} />

    </Routes>
    </BrowserRouter>
    </ApolloProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();