import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, ChevronRight, Tag, Trash2, X } from 'lucide-react';
import { useStore } from '../context/Store';
import { imageUrl } from '../data/restaurants';
import { couponError, money } from '../lib/commerce';
import { Quantity, VegMark } from './UI';

export function CartItems({ compact = false }) {
  const { cart, dispatch } = useStore();
  return <div className={`cart-items ${compact ? 'compact' : ''}`}>{cart.map(item => <div className="cart-item" key={item.key}><img src={imageUrl(item.image)} alt={item.name}/><div className="cart-item-details"><div className="cart-item-name"><VegMark veg={item.veg}/><h3>{item.name}</h3></div><p>{item.size}{item.extras.length > 0 ? ` · ${item.extras.join(', ')}` : ''}</p>{item.note && <p className="kitchen-note">“{item.note}”</p>}<strong>{money(item.unitPrice)}</strong></div><div className="cart-item-actions"><Quantity quantity={item.quantity} name={item.name} onChange={quantity => dispatch({ type: 'QUANTITY', key: item.key, quantity })}/><button className="remove-button" onClick={() => dispatch({ type: 'REMOVE', key: item.key })} aria-label={`Remove ${item.name}`}><Trash2 size={14}/>{!compact && 'Remove'}</button></div></div>)}</div>;
}

export function CouponInput() {
  const { coupon, cart, orders, totals, dispatch, notify } = useStore();
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const currentError = coupon ? couponError(coupon, totals.subtotal, orders.length) : '';
  function apply(event) {
    event.preventDefault();
    const code = input.trim().toUpperCase();
    const message = couponError(code, totals.subtotal, orders.length);
    setError(message);
    if (!message) { dispatch({ type: 'COUPON', code }); setInput(''); notify(`${code} applied. A little extra happiness!`); }
  }
  return <div className="coupon-box"><div className="coupon-heading"><Tag size={18}/><strong>A little extra happiness</strong></div>{coupon && !currentError ? <div className="coupon-applied"><Check size={16}/><span>{coupon} applied</span><button className="icon-button" aria-label="Remove coupon" onClick={() => dispatch({ type: 'COUPON', code: '' })}><X size={16}/></button></div> : <><form className="coupon-form" onSubmit={apply}><input value={input} onChange={e => { setInput(e.target.value); setError(''); }} aria-label="Coupon code" placeholder="Enter coupon code" maxLength={30}/><button type="submit">Apply</button></form>{(error || currentError) && <p className="field-error" role="alert">{error || currentError}</p>}<p className="small muted">Try <button className="text-button" onClick={() => setInput('MELLOW20')}>MELLOW20</button> for 20% off on ₹299+.</p></>}<Link className="small text-link" to="/offers">Explore all offers<ChevronRight size={13}/></Link></div>;
}

export function Bill({ orderTotals }) {
  const { totals: storeTotals } = useStore();
  const totals = orderTotals || storeTotals;
  return <div className="bill"><h3>The delicious details</h3><div><span>Item total</span><span>{money(totals.subtotal)}</span></div>{totals.discount > 0 && <div className="saving"><span>Coupon savings</span><span>−{money(totals.discount)}</span></div>}<div><span>Delivery fee</span><span>{totals.delivery ? money(totals.delivery) : <span className="saving">FREE</span>}</span></div><div><span>Platform fee</span><span>{money(totals.platform)}</span></div><div><span>Taxes (5% on food after discount)</span><span>{money(totals.tax)}</span></div><div className="bill-total"><strong>Total to pay</strong><strong>{money(totals.total)}</strong></div>{totals.discount > 0 && <p className="savings-note">A good mood, and {money(totals.discount)} saved. Nice.</p>}</div>;
}

export function CartSummary({ checkout = false }) {
  const { count, totals } = useStore();
  return <aside className="order-summary clay"><h2>Your happy meal <span>({count} items)</span></h2><CouponInput/><Bill/>{!checkout && <Link to="/checkout" className="button primary full">Let’s check out<ArrowRight size={18}/></Link>}<p className="small muted centered">Freshly made. Thoughtfully delivered.</p></aside>;
}
