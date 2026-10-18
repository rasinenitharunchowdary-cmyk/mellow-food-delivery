import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Banknote, Check, MapPin, ShieldCheck, ShoppingBag } from "lucide-react";
import { useStore } from "../context/Store";
import { CartSummary } from "../components/Cart";
import { EmptyState, StepHeading } from "../components/UI";
import { calculateTotals, money, validateCheckout } from "../lib/commerce";

export default function Checkout() {
  const { cart, orders, location, coupon, dispatch } = useStore();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    name: "",
    phone: "",
    address: "",
    pincode: "",
    instructions: "door",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const formRef = useRef(null);
  const totals = calculateTotals(cart, coupon, orders.length);
  function change(event) {
    const { name, value } = event.target;
    setValues((old) => ({ ...old, [name]: value }));
    setErrors((old) => ({ ...old, [name]: "" }));
  }
  function submit(event) {
    event.preventDefault();
    if (submittingRef.current || !cart.length) return;
    const nextErrors = validateCheckout(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      requestAnimationFrame(() =>
        formRef.current?.querySelector('[aria-invalid="true"]')?.focus(),
      );
      return;
    }
    submittingRef.current = true;
    setSubmitting(true);
    const order = {
      id: `MLW-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      placedAt: Date.now(),
      items: structuredClone(cart),
      totals,
      restaurantId: cart[0].restaurantId,
      restaurantName: cart[0].restaurantName,
      address: {
        ...values,
        phone: values.phone.replace(/[\s-]/g, ""),
        city: "Bengaluru",
        neighborhood: location.split(",")[0],
      },
      demoOffset: 0,
      payment: "Cash on delivery (demo)",
    };
    dispatch({ type: "ORDER", order });
    navigate(`/order/${order.id}`, { replace: true });
  }
  function field(name, label, placeholder, autoComplete, type = "text") {
    return (
      <div className="field">
        <label htmlFor={`checkout-${name}`}>
          {label}
          <span aria-hidden="true">*</span>
        </label>
        <input
          id={`checkout-${name}`}
          name={name}
          type={type}
          autoComplete={autoComplete}
          value={values[name]}
          onChange={change}
          placeholder={placeholder}
          maxLength={name === "phone" ? 14 : name === "pincode" ? 6 : 100}
          inputMode={
            name === "phone" || name === "pincode" ? "numeric" : undefined
          }
          aria-required="true"
          aria-invalid={!!errors[name]}
          aria-describedby={errors[name] ? `${name}-error` : undefined}
        />
        {errors[name] && (
          <p className="field-error" id={`${name}-error`}>
            {errors[name]}
          </p>
        )}
      </div>
    );
  }
  return (
    <div className="container page-space checkout-page">
      <StepHeading
        eyebrow="LET’S BRING THE GOOD MOOD HOME"
        title="Almost at your happy place."
        description="A few little details, then we’ll take it from here."
      />
      {cart.length ? (
        <div className="checkout-layout">
          <form
            ref={formRef}
            className="checkout-form"
            onSubmit={submit}
            noValidate
          >
            <section className="form-card clay">
              <div className="form-section-heading">
                <span>
                  <MapPin size={22} />
                </span>
                <div>
                  <h2>Where should happiness arrive?</h2>
                  <p>Delivering in {location}</p>
                </div>
              </div>
              <div className="fields-row">
                {field("name", "Full name", "Your lovely name", "name")}
                {field("phone", "Mobile number", "98765 43210", "tel", "tel")}
              </div>
              {field(
                "address",
                "Flat, building & street",
                "Flat 12, Sunshine Apartments, 100 Feet Road",
                "street-address",
              )}
              <div className="fields-row">
                {field("pincode", "Pincode", "560038", "postal-code")}
                <div className="field">
                  <label htmlFor="checkout-city">City</label>
                  <input id="checkout-city" value="Bengaluru" disabled />
                </div>
              </div>
              <fieldset className="delivery-preference">
                <legend>A little delivery preference</legend>
                {[
                  ["door", "Meet me at the door"],
                  ["reception", "Leave with reception"],
                ].map(([value, label]) => (
                  <label
                    key={value}
                    className={values.instructions === value ? "selected" : ""}
                  >
                    <input
                      type="radio"
                      name="instructions"
                      value={value}
                      checked={values.instructions === value}
                      onChange={change}
                    />
                    {label}
                  </label>
                ))}
              </fieldset>
            </section>
            <section className="form-card clay">
              <div className="form-section-heading">
                <span>
                  <Banknote size={22} />
                </span>
                <div>
                  <h2>A simple way to pay</h2>
                  <p>Cash on delivery</p>
                </div>
                <Check className="payment-check" size={22} />
              </div>
              <div className="demo-note">
                <ShieldCheck size={22} />
                <div>
                  <strong>You’re trying a frontend demo.</strong>
                  <p>
                    No real payment is collected, and no order is sent to a
                    restaurant. Please use fictional contact details.
                  </p>
                </div>
              </div>
            </section>
            <button
              className="button primary full place-order"
              disabled={submitting}
              type="submit"
            >
              {submitting
                ? "Putting your good mood together…"
                : `Place demo order · ${money(totals.total)}`}
              <ArrowRight size={19} />
            </button>
            <p className="small muted centered">
              Your demo order and delivery details are saved only in this
              browser.
            </p>
            <Link to="/cart" className="back-link">
              <ArrowLeft size={16} />
              Back to your bag
            </Link>
          </form>
          <CartSummary checkout />
        </div>
      ) : (
        <EmptyState
          icon={ShoppingBag}
          title="First, a little something delicious."
          description="Add a meal to your cart before heading to checkout."
        />
      )}
    </div>
  );
}
