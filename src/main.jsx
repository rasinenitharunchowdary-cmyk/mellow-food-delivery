import React, { Component, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { Search } from 'lucide-react';
import { StoreProvider } from './context/Store';
import { Header, Footer, CartDrawer, Toast } from './components/Layout';
import { EmptyState } from './components/UI';
import Home from './pages/Home';
import Restaurant from './pages/Restaurant';
import Offers from './pages/Offers';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import { OrderHistory, OrderTracking } from './pages/Orders';
import './styles.css';

function ScrollAndTitle() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    const titles = { '/': 'Good food. Good mood.', '/offers': 'A little extra happiness', '/cart': 'Your little bag of joy', '/checkout': 'Almost at your happy place', '/orders': 'Your happy moments', '/favorites': 'Your happy little list' };
    document.title = `Mellow — ${titles[pathname] || (pathname.startsWith('/order/') ? 'Your order' : 'Fresh from the neighborhood')}`;
    if (hash) requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView());
    else window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash]);
  return null;
}
class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <div className="container page-space"><div className="empty-state clay"><h1>A little hiccup in the kitchen.</h1><p>Please reload to give us another try.</p><button className="button primary" onClick={() => window.location.reload()}>Try again</button></div></div> : this.props.children; }
}
function App() {
  return <ErrorBoundary><MotionConfig reducedMotion="user"><BrowserRouter><StoreProvider><ScrollAndTitle/><Header/><main id="main" tabIndex="-1"><Routes><Route path="/" element={<Home key="discover"/>}/><Route path="/favorites" element={<Home key="favorites" favoritesOnly/>}/><Route path="/restaurant/:id" element={<Restaurant/>}/><Route path="/offers" element={<Offers/>}/><Route path="/cart" element={<CartPage/>}/><Route path="/checkout" element={<Checkout/>}/><Route path="/orders" element={<OrderHistory/>}/><Route path="/order/:id" element={<OrderTracking/>}/><Route path="*" element={<div className="container page-space"><EmptyState icon={Search} title="A little off the menu." description="This page isn’t here, but something delicious is just around the corner."/></div>}/></Routes></main><Footer/><CartDrawer/><Toast/></StoreProvider></BrowserRouter></MotionConfig></ErrorBoundary>;
}
createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
