import { useCallback, useState } from "react";
import { AlertCircle, ArrowRight } from "lucide-react";
import { Modal, Quantity, VegMark } from "./UI";
import { customization, imageUrl } from "../data/restaurants";
import { useStore } from "../context/Store";
import { itemKey, money } from "../lib/commerce";

export default function Customize({ item, restaurant, onClose }) {
  const options = customization(item);
  const [size, setSize] = useState(options.sizes[0]);
  const [extras, setExtras] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [replace, setReplace] = useState(false);
  const { cart, dispatch, notify } = useStore();
  const price =
    item.price + size.price + extras.reduce((sum, e) => sum + e.price, 0);
  const different = cart.length > 0 && cart[0].restaurantId !== restaurant.id;
  const stableClose = useCallback(onClose, [onClose]);
  function add() {
    if (different && !replace) {
      setReplace(true);
      return;
    }
    dispatch({
      type: "ADD",
      replace: different,
      item: {
        key: itemKey(item, size, extras, note),
        id: item.id,
        name: item.name,
        image: item.image,
        veg: item.veg,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        unitPrice: price,
        quantity,
        size: size.name,
        extras: extras.map((e) => e.name),
        note: note.trim(),
      },
    });
    notify(`${quantity} × ${item.name} added to your cart`);
    onClose();
  }
  return (
    <Modal
      open
      onClose={stableClose}
      title="Make it your kind of good"
      className="customize-layer"
    >
      <img
        className="customize-image"
        src={imageUrl(item.image)}
        alt={item.name}
      />
      <div className="dish-modal-title">
        <VegMark veg={item.veg} />
        <h3>{item.name}</h3>
        <strong>{money(item.price)}</strong>
      </div>
      <p className="muted small">{item.description}</p>
      <div className="customization-group">
        <div>
          <h4>A little or a lot?</h4>
          <span className="small muted">Choose one</span>
        </div>
        {options.sizes.map((option) => (
          <label
            className={`option-row ${size.name === option.name ? "selected" : ""}`}
            key={option.name}
          >
            <input
              type="radio"
              name="size"
              checked={size.name === option.name}
              onChange={() => setSize(option)}
            />
            <span>{option.name}</span>
            <strong>
              {option.price ? `+${money(option.price)}` : "Included"}
            </strong>
          </label>
        ))}
      </div>
      <div className="customization-group">
        <div>
          <h4>A little something extra</h4>
          <span className="small muted">Optional</span>
        </div>
        {options.extras.map((option) => (
          <label className="option-row" key={option.name}>
            <input
              type="checkbox"
              checked={extras.some((e) => e.name === option.name)}
              onChange={() =>
                setExtras(
                  extras.some((e) => e.name === option.name)
                    ? extras.filter((e) => e.name !== option.name)
                    : [...extras, option],
                )
              }
            />
            <span>{option.name}</span>
            <strong>+{money(option.price)}</strong>
          </label>
        ))}
      </div>
      <label className="field-label" htmlFor="food-note">
        A note for the kitchen <span className="muted">(optional)</span>
      </label>
      <textarea
        id="food-note"
        rows="2"
        maxLength="160"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Less spice, extra love…"
      />
      <p className="small muted">
        Please contact the restaurant directly for food allergy requirements.
      </p>
      {replace && (
        <div className="inline-warning" role="alert">
          <AlertCircle size={20} />
          <span>
            Your cart has food from {cart[0].restaurantName}. Adding this will
            replace your current cart.
          </span>
        </div>
      )}
      <div className="customize-bottom">
        <Quantity
          quantity={quantity}
          onChange={(q) => setQuantity(Math.max(1, q))}
          name={item.name}
        />
        <button className="button primary" onClick={add}>
          {replace ? "Replace cart" : "Add to my cart"} ·{" "}
          {money(price * quantity)}
          <ArrowRight size={17} />
        </button>
      </div>
    </Modal>
  );
}
