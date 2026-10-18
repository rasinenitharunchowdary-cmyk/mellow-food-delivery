import { useCallback, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowRight, ChevronDown, Heart, MapPin, Menu, ShoppingBag, Tag, X, Check, Leaf, Clock, Instagram, ArrowUpRight } from 'lucide-react';
import { Brand, Modal } from './UI';
import { useStore } from '../context/Store';
import { locations } from '../data/restaurants';
import { money } from '../lib/commerce';
import { CartItems, Bill } from './Cart';

export function Header() {
  const { count, location, dispatch, setCartOpen } = useStore();
  const [locationOpen, setLocationOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeLocation = useCallback(() => setLocationOpen(false), []);
  return <><a href="#main" className="skip-link">Skip to content</a><header className="site-header"><div className="container header-inner"><Brand/><button className="location-button" onClick={() => setLocationOpen(true)} aria-label={`Delivery location: ${location}. Change location`}><span className="location-pin"><MapPin size={19}/></span><span><small>Delivering to</small><strong>{location.split(',')[0]}<ChevronDown size={13}/></strong></span></button><nav className="desktop-nav" aria-label="Main navigation"><NavLink end to="/">Discover</NavLink><NavLink to="/offers"><Tag size={16}/>Offers<span className="nav-dot"/></NavLink><NavLink to="/orders">My orders</NavLink></nav><div className="header-actions"><NavLink className="favorite-link icon-button" to="/favorites" aria-label="Saved restaurants"><Heart size={20}/></NavLink><button className="cart-button" aria-label={`Open cart, ${count} items`} onClick={() => setCartOpen(true)}><ShoppingBag size={18}/><span>My cart</span><span className="cart-count">{count}</span></button><button className="mobile-menu icon-button" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle navigation" aria-expanded={mobileOpen}>{mobileOpen ? <X/> : <Menu/>}</button></div></div>{mobileOpen && <nav className="mobile-nav" aria-label="Mobile navigation">{[['/', 'Discover'], ['/offers','Offers'], ['/favorites','Saved restaurants'], ['/orders','My orders']].map(([path, name]) => <NavLink key={path} to={path} onClick={() => setMobileOpen(false)}>{name}<ArrowRight size={16}/></NavLink>)}</nav>}</header><Modal open={locationOpen} onClose={closeLocation} title="Where’s your happy place?"><p className="muted">Pick a Bengaluru neighborhood to explore the demo.</p><div className="location-options">{locations.map(place => <button key={place} className={place === location ? 'selected' : ''} onClick={() => { dispatch({ type: 'LOCATION', location: place }); setLocationOpen(false); }}><MapPin size={20}/><span>{place}</span>{place === location && <Check size={18}/>}</button>)}</div><p className="small muted">Restaurant data is a curated demo, available in all listed neighborhoods.</p></Modal></>;
}

export function Footer() {
  return <footer className="site-footer"><div className="container"><div className="footer-top"><div><Brand/><p>Made for cravings.<br/>Delivered with a little love.</p></div><div className="footer-links"><Link to="/">Discover restaurants</Link><Link to="/offers">A little extra happiness</Link><Link to="/orders">Your orders</Link></div><div className="footer-note"><span className="status-dot"/>A good mood is on the way.<div className="footer-perks"><span><Leaf size={15}/>Thoughtfully packed</span><span><Clock size={15}/>Fresh to your door</span></div></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Mellow. Good food, good people.</span><span>Crafted with care · Frontend demo</span></div></div></footer>;
}

export function CartDrawer() {
  const { cartOpen, setCartOpen, count, cart, totals } = useStore();
  const close = useCallback(() => setCartOpen(false), [setCartOpen]);
  return <Modal open={cartOpen} onClose={close} title={`Your little bag of joy (${count})`} className="drawer-layer"><>{cart.length ? <><div className="drawer-scroll"><p className="restaurant-label">Fresh from {cart[0].restaurantName}</p><CartItems compact/><Bill/></div><Link className="button primary full" to="/cart" onClick={close}>View cart · {money(totals.total)}<ArrowRight size={18}/></Link><p className="small muted centered">Good things are just a few taps away.</p></> : <div className="drawer-empty"><ShoppingBag size={48}/><h3>A little empty, a lot of possibility.</h3><p>Your next favorite meal is waiting.</p><Link className="button primary" to="/" onClick={close}>Find your happy meal<ArrowRight size={17}/></Link></div>}</></Modal>;
}

export function Toast() {
  const { toast, storageFailed } = useStore();
  return <><div role="status" className={`toast ${toast ? 'visible' : ''}`}><Check size={18}/>{toast}</div>{storageFailed && <div className="storage-warning" role="status">Browser storage is unavailable. Keep this tab open to retain your cart and orders.</div>}</>;
}
