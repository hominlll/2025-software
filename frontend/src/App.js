import React from 'react';
import Header from './components/Header';
import CategoryMenu from './components/CategoryMenu';
import MentorSection from './components/MentorSection';
import Banner from './components/Banner';
import Home from './pages/Home';

function App() {
  return (
    <div>
      <Header />
      <CategoryMenu />
      <Home />
      <Banner />
      <MentorSection />
    </div>
  );
}

export default App;
