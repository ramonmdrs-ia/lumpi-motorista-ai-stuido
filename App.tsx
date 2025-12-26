
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './screens/Dashboard';
import Login from './screens/Login';
import Register from './screens/Register';
import Trips from './screens/Trips';
import NewTrip from './screens/NewTrip';
import Expenses from './screens/Expenses';
import NewExpense from './screens/NewExpense';
import Maintenance from './screens/Maintenance';
import Goals from './screens/Goals';
import Ranking from './screens/Ranking';
import Menu from './screens/Menu';
import Subscription from './screens/Subscription';
import Success from './screens/Success';
import Analytics from './screens/Analytics';
import Layout from './components/Layout';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes Wrapper */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/trips/new" element={<NewTrip />} />
          <Route path="/trips/edit/:id" element={<NewTrip />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/expenses/new" element={<NewExpense />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/success" element={<Success />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
