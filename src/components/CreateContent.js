import React from 'react';
import NavBar from './NavBar';

export default function CreateContent() {
  return (
    <>
      <NavBar></NavBar>
      <div id="main-content" className="h-full bg-gray-50 relative overflow-y-auto lg:ml-64">
        <main>
          <h1 className='mt-80 text-3xl mb-60 font-bold text-center justify-center'>COMING SOON!</h1>
        </main>
        </div>
      </>
  );
}