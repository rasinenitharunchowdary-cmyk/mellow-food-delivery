import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Leaf, ShoppingBag } from "lucide-react";
import { useStore } from "../context/Store";
import { CartItems, CartSummary } from "../components/Cart";
import { EmptyState, StepHeading } from "../components/UI";

export default function CartPage() {
  const { cart, count } = useStore();
  return (
    <div className="container page-space cart-page">
      <StepHeading
        eyebrow="THE GOOD STUFF, ALL TOGETHER"
        title="Your little bag of joy."
        description={count ? "One step closer to a very good mood." : undefined}
      />
      {cart.length ? (
        <div className="checkout-layout">
          <div>
            <section className="cart-card clay">
              <div className="cart-restaurant">
                <div>
                  <span className="eyebrow">FRESH FROM</span>
                  <h2>{cart[0].restaurantName}</h2>
                </div>
                <Link
                  to={`/restaurant/${cart[0].restaurantId}`}
                  className="text-link"
                >
                  Add more
                  <ArrowRight size={15} />
                </Link>
              </div>
              <CartItems />
              <div className="cart-care">
                <Leaf size={20} />
                <p>
                  A little care for the planet. Your meal comes in thoughtful
                  packaging.
                </p>
              </div>
            </section>
            <Link
              className="back-link"
              to={`/restaurant/${cart[0].restaurantId}`}
            >
              <ArrowLeft size={16} />
              Back to the menu
            </Link>
          </div>
          <CartSummary />
        </div>
      ) : (
        <EmptyState
          icon={ShoppingBag}
          title="A little empty. A lot of possibility."
          description="Find a restaurant you love and fill this bag with something delicious."
          action="Let’s find something good"
        />
      )}
    </div>
  );
}
