import { ArrowRight, Check, Copy, Sparkles, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { COUPONS, money } from '../lib/commerce';
import { useStore } from '../context/Store';
import { StepHeading } from '../components/UI';

export default function Offers() {
  const { notify, orders } = useStore();
  async function copy(code) {
    try { await navigator.clipboard.writeText(code); notify(`${code} copied. Apply it in your cart.`); }
    catch { notify(`Use ${code} in your cart to claim this offer.`); }
  }
  return <div className="container page-space offers-page"><StepHeading eyebrow="GOOD FOOD. EVEN BETTER DEALS." title="A little extra happiness." description="Because the only thing better than your favorite meal is a little treat to go with it."/><div className="offers-grid">{COUPONS.map((offer, i) => <article className={`offer-ticket ${offer.color} clay`} key={offer.code}><div className="ticket-top"><span className="ticket-icon">{['🍕','🛵','👋'][i]}</span><span className="eyebrow">{['A DELICIOUS LITTLE DISCOUNT','ON THE HOUSE','HELLO, NEW FRIEND'][i]}</span><h2>{offer.title}</h2><p>{offer.description}</p></div><div className="ticket-bottom"><span className="coupon-code">{offer.code}</span><button className="icon-button" onClick={() => copy(offer.code)} aria-label={`Copy ${offer.code}`}><Copy size={19}/></button><p>{offer.detail}</p></div><ul className="offer-terms"><li>One coupon per order.</li><li>{offer.kind === 'percent' ? `Discount capped at ${money(offer.max)}; food subtotal only.` : offer.kind === 'delivery' ? 'Waives the ₹35 delivery fee; other fees apply.' : 'Available when you have no previous demo orders.'}</li><li>Taxes and platform fee apply.</li></ul>{offer.first && orders.length > 0 && <span className="used-offer">You’ve already enjoyed your first order.</span>}</article>)}</div><div className="offers-note"><Sparkles size={24}/><div><h3>Found your little silver lining?</h3><p>Pick something delicious, then add your code in the cart.</p></div><Link to="/" className="button primary">Find my happy meal<ArrowRight size={18}/></Link></div></div>;
}
