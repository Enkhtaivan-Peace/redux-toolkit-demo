import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router , Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { fetchUsers } from './features/users/usersSlice';
import { store } from './app/store';
import App from './App';
import './index.css';
import { fetchPosts } from './features/posts/postsSlice';

store.dispatch(fetchUsers())
store.dispatch(fetchPosts())

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path='/*' element={<App />} />
          
        </Routes>
      </Router>
    </Provider>
);

