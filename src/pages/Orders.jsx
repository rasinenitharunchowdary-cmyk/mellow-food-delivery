import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Bike, Check, CheckCheck, ChefHat, Clock, Heart, MapPin, PackageCheck, RotateCcw, ShoppingBag, Sparkles } from 'lucide-react';
import { useStore } from '../context/Store';
import { Bill } from '../components/Cart';
import { EmptyState, Modal, StepHeading } from '../components/UI';
import { imageUrl } from '../data/restaurants';
import { money, orderStatus, STATUS_STEPS } from '../lib/commerce';

const date = value => new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(value));
const icons = [CheckCheck, ChefHat, Bike, PackageCheck];
function useClock() { const [now, setNow] = useState(Date.now()); useEffect(() => { const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, []); return now; }

export function OrderTracking() {
  const { id } = useParams();
  const { orders, dispatch } = useStore();
  const now = useClock();
  const order = orders.find(o => o.id === id);
  if (!order) return <div className="container page-space"><EmptyState icon={ShoppingBag} title="That order hasn’t found us." description="Demo orders are saved in the browser where they were placed. You can find yours in order history." action="See my orders" to="/orders"/></div>;
  const status = orderStatus(order, now);
  const Icon = icons[status];
  function advance() {
    const elapsed = Math.max(0, (Date.now() - order.placedAt) / 1000) + (order.demoOffset || 0);
    dispatch({ type: 'ADVANCE', id, seconds: Math.max(1, STATUS_STEPS[Math.min(3, status + 1)].seconds - elapsed + 1) });
  }
  return <div className="container page-space tracking-page"><Link to="/orders" className="back-link"><ArrowLeft size={16}/>All your happy moments</Link><div className="tracking-title"><span className="order-success-icon"><Icon size={36}/></span><span className="eyebrow">{status === 3 ? 'A LITTLE HAPPINESS, DELIVERED' : 'YOUR NEXT HAPPY MOMENT IS ON ITS WAY'}</span><h1>{['You’ve got delicious plans.','Good things take a little love.','A good mood is on the way.','Happiness has arrived.'][status]}</h1><p>{STATUS_STEPS[status].description}</p><span className="order-id">{order.id} <span>·</span> {date(order.placedAt)}</span></div><div className="tracking-layout"><section className="tracking-card clay"><div className="tracking-card-heading"><h2>The journey to your door</h2><span className="demo-badge">Simulated tracking</span></div><div className="delivery-scene"><div className="scene-cloud cloud-one"/><div className="scene-cloud cloud-two"/><span className="scene-sun"/><span className="scene-building building-one"/><span className="scene-building building-two"/><span className="scene-building building-three"/><div className="scene-road"/><div className={`scene-bike status-${status}`}><Bike size={65} strokeWidth={1.5}/><span>mellow.</span></div><span className="scene-destination"><MapPin size={33} fill="#f16a3d" color="#fff8ee"/></span></div><ol className="status-timeline">{STATUS_STEPS.map((step, index) => { const StepIcon = icons[index]; return <li className={index <= status ? 'completed' : ''} key={step.title} aria-current={index === status ? 'step' : undefined}><span className="timeline-icon">{index < status ? <Check size={19}/> : <StepIcon size={20}/>}</span><div><h3>{step.title}</h3><p>{step.description}</p></div>{index === status && <span className="current-status">{status === 3 ? 'Done' : 'Now'}</span>}</li>; })}</ol><div className="demo-tracking-controls"><p>Demo: automatically progresses over 4 minutes.</p>{status < 3 && <button className="text-link" onClick={advance}>Preview next status<ArrowRight size={15}/></button>}</div></section><aside><section className="order-details clay"><h2>A little recap</h2><Link className="restaurant-label text-link" to={`/restaurant/${order.restaurantId}`}>{order.restaurantName}<ArrowRight size={15}/></Link><div className="ordered-items">{order.items.map(item => <div key={item.key}><span>{item.quantity} × {item.name}<small>{item.size}{item.extras?.length ? ` · ${item.extras.join(', ')}` : ''}</small></span><strong>{money(item.quantity * item.unitPrice)}</strong></div>)}</div><Bill orderTotals={order.totals}/><div className="order-address"><MapPin size={20}/><div><strong>{order.address.name}</strong><p>{order.address.address}<br/>{order.address.neighborhood}, Bengaluru {order.address.pincode}</p><small>{order.address.instructions === 'door' ? 'Meet at the door' : 'Leave with reception'} · {order.payment}</small></div></div></section><div className="thanks-note"><Heart size={18}/><span>Thanks for making Mellow part of your day.</span></div></aside></div></div>;
}

export function OrderHistory() {
  const { orders, cart, dispatch, notify } = useStore();
  const now = useClock();
  const navigate = useNavigate();
  const [reorder, setReorder] = useState(null);
  const close = useCallback(() => setReorder(null), []);
  function placeInCart(order) { dispatch({ type: 'REORDER', items: order.items }); notify('Your favorites are back in the bag.'); setReorder(null); navigate('/cart'); }
  return <div className="container page-space history-page"><StepHeading eyebrow="GOOD FOOD. GOOD MEMORIES." title="Your happy moments." description="A little history of delicious decisions."/>{orders.length ? <div className="order-history-list">{orders.map(order => { const status = orderStatus(order, now); return <article className="history-card clay" key={order.id}><img src={imageUrl(order.items[0]?.image || 'pizza')} alt={`Your meal from ${order.restaurantName}`}/><div className="history-main"><div className="history-meta"><span>{order.id}</span><span className={`history-status ${status === 3 ? 'delivered' : ''}`}><span className="status-dot"/>{status === 3 ? 'Delivered' : ['Confirmed','Preparing','On the way'][status]}</span></div><h2>{order.restaurantName}</h2><p>{order.items.map(item => `${item.quantity} × ${item.name}`).join(', ')}</p><span className="small muted">{date(order.placedAt)}</span></div><div className="history-actions"><strong>{money(order.totals.total)}</strong><Link className="button primary small-button" to={`/order/${order.id}`}>View order<ArrowRight size={16}/></Link><button className="text-link" onClick={() => cart.length ? setReorder(order) : placeInCart(order)}><RotateCcw size={14}/>Order again</button></div></article>; })}</div> : <EmptyState icon={ShoppingBag} title="Your first happy moment awaits." description="The meals you love will live here after you place a demo order." action="Find something delicious"/>}<Modal open={!!reorder} onClose={close} title="Make room for an old favorite?"><p className="muted">Reordering will replace the items currently in your cart. Your previous order stays in your history.</p><div className="modal-actions"><button className="button secondary" onClick={close}>Keep my cart</button><button className="button primary" onClick={() => placeInCart(reorder)}>Replace & reorder<ArrowRight size={17}/></button></div></Modal></div>;
}
