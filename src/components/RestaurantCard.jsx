import { Link } from "react-router-dom";
import { Clock, Heart, Star, Tag } from "lucide-react";
import { motion } from "framer-motion";
import { imageUrl } from "../data/restaurants";
import { useStore } from "../context/Store";

export default function RestaurantCard({ restaurant: r, index = 0 }) {
  const { favorites, dispatch, notify } = useStore();
  const saved = favorites.includes(r.id);
  return (
    <motion.article
      className="restaurant-card clay"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.35, delay: (index % 3) * 0.06 }}
    >
      <div className="restaurant-image">
        <Link to={`/restaurant/${r.id}`} aria-label={`Explore ${r.name}`}>
          <img
            src={imageUrl(r.image)}
            alt={`${r.category} from ${r.name}`}
            loading="lazy"
          />
        </Link>
        <span className="image-label glass">{r.tag}</span>
        <button
          className={`save-button glass ${saved ? "saved" : ""}`}
          onClick={() => {
            dispatch({ type: "FAVORITE", id: r.id });
            notify(
              saved
                ? `${r.name} removed from favorites`
                : `${r.name} saved to your favorites`,
            );
          }}
          aria-label={`${saved ? "Unsave" : "Save"} ${r.name}`}
          aria-pressed={saved}
        >
          <Heart size={18} fill={saved ? "currentColor" : "none"} />
        </button>
        <div className="image-offer">
          <Tag size={14} />
          {r.offer}
        </div>
      </div>
      <Link to={`/restaurant/${r.id}`} className="restaurant-info">
        <div className="restaurant-title">
          <h3>{r.name}</h3>
          <span className="rating">
            <Star size={12} fill="currentColor" />
            {r.rating}
          </span>
        </div>
        <p>{r.cuisine}</p>
        <div className="restaurant-meta">
          <span>
            <Clock size={14} />
            {r.time}–{r.time + 10} min<span className="dot-separator">·</span>
            {r.distance} km
          </span>
          <span>₹{r.price} for one</span>
        </div>
      </Link>
    </motion.article>
  );
}
