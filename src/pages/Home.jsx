import { useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Bike, Check, Clock, Heart, Leaf, Search, SlidersHorizontal, Sparkles, Star, Tag, X } from "lucide-react";
import { motion } from "framer-motion";
import { categories, imageUrl, restaurants } from "../data/restaurants";
import { useStore } from "../context/Store";
import RestaurantCard from "../components/RestaurantCard";
import { EmptyState, StepHeading } from "../components/UI";

export default function Home({ favoritesOnly = false }) {
  const [params, setParams] = useSearchParams();
  const query = params.get("search") || "";
  const category = params.get("category") || "all";
  const [sort, setSort] = useState("recommended");
  const [veg, setVeg] = useState(false);
  const [top, setTop] = useState(false);
  const [fast, setFast] = useState(false);
  const { favorites, location } = useStore();
  const resultsRef = useRef(null);
  function updateParam(key, value) {
    const next = new URLSearchParams(params);
    if (value && value !== "all") next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true, preventScrollReset: true });
  }
  const filtered = useMemo(() => {
    const list = restaurants.filter(
      (r) =>
        (!favoritesOnly || favorites.includes(r.id)) &&
        (category === "all" || r.category === category) &&
        `${r.name} ${r.cuisine} ${r.category}`
          .toLowerCase()
          .includes(query.toLowerCase().trim()) &&
        (!veg || r.veg) &&
        (!top || r.rating >= 4.8) &&
        (!fast || r.time <= 25),
    );
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    if (sort === "time") list.sort((a, b) => a.time - b.time);
    if (sort === "price") list.sort((a, b) => a.price - b.price);
    return list;
  }, [category, query, sort, veg, top, fast, favorites, favoritesOnly]);
  return (
    <div
      className={`container home-page ${favoritesOnly ? "favorites-page" : ""}`}
    >
      {!favoritesOnly ? (
        <>
          <section className="hero" aria-labelledby="hero-title">
            <motion.div
              className="hero-copy"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="hero-eyebrow">
                <span className="status-dot" />
                YOUR NEXT HAPPY MOMENT
              </span>
              <h1 id="hero-title">
                Good food.
                <br />
                Even better{" "}
                <span>
                  mood
                  <svg viewBox="0 0 265 20" aria-hidden="true">
                    <path
                      d="M4 13Q114-3 258 10M24 18Q140 6 237 15"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <em>.</em>
              </h1>
              <p>
                Big cravings. Little comforts. Discover food you’ll
                <br className="desktop-break" /> love, from places around the
                corner.
              </p>
              <form
                className="hero-search glass"
                onSubmit={(e) => {
                  e.preventDefault();
                  resultsRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
              >
                <Search size={21} />
                <input
                  aria-label="Search restaurants or cuisines"
                  placeholder="What are you craving today?"
                  value={query}
                  onChange={(e) => updateParam("search", e.target.value)}
                />
                {query && (
                  <button
                    type="button"
                    className="clear-search"
                    onClick={() => updateParam("search", "")}
                    aria-label="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
                <button
                  className="search-submit"
                  type="submit"
                  aria-label="Find food"
                >
                  <ArrowRight size={23} />
                </button>
              </form>
              <div className="hero-suggestions">
                <span>A little inspiration:</span>
                {["Pizza", "Burgers", "Healthy"].map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      updateParam("category", c);
                      resultsRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }}
                  >
                    {c}
                    <ArrowUpRight size={12} />
                  </button>
                ))}
              </div>
              <div className="hero-footnote">
                <div className="tiny-foods">
                  <span>🥑</span>
                  <span>🍕</span>
                  <span>🥐</span>
                </div>
                <div>
                  <strong>A whole neighborhood of flavor.</strong>
                  <span>Freshly made. Happily delivered.</span>
                </div>
              </div>
            </motion.div>
            <motion.div
              className="hero-visual"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.65, delay: 0.1 }}
            >
              <div className="hero-orbit orbit-one" />
              <div className="hero-orbit orbit-two" />
              <div className="hero-main-photo">
                <img
                  src={imageUrl("pizza")}
                  alt="Fresh wood-fired pizza topped with basil, tomatoes and melted mozzarella"
                  fetchPriority="high"
                />
                <div className="photo-caption">
                  <span>Fresh from the oven</span>
                  <strong>A slice of the good life.</strong>
                </div>
              </div>
              <span className="floating-spark sparkle-one">✳</span>
              <span className="floating-spark sparkle-two">✳</span>
              <div className="floating-rating glass">
                <span className="rating-icon">
                  <Star fill="currentColor" size={22} />
                </span>
                <div>
                  <strong>Made with love</strong>
                  <span>
                    <Star fill="currentColor" size={11} />
                    4.8 <i>·</i> Little Naples
                  </span>
                </div>
              </div>
              <Link
                to="/restaurant/green-theory"
                className="floating-bowl glass"
              >
                <img src={imageUrl("salad")} alt="Fresh colorful salad" />
                <div>
                  <span>Something fresh?</span>
                  <strong>We’ve got you.</strong>
                </div>
                <ArrowUpRight size={18} />
              </Link>
              <div className="floating-delivery glass">
                <span>
                  <Bike size={28} />
                </span>
                <div>
                  <strong>Good things, on their way.</strong>
                  <small>Fresh to your door in 20–45 min</small>
                </div>
              </div>
              <div className="hero-sticker">
                a little joy,
                <br />
                <span>delivered.</span>
                <Heart size={17} />
              </div>
            </motion.div>
          </section>
          <section
            className="category-section"
            aria-labelledby="category-title"
          >
            <div className="section-heading">
              <div>
                <span className="eyebrow">FOLLOW YOUR CRAVINGS</span>
                <h2 id="category-title">What sounds good?</h2>
              </div>
              <span className="section-aside">
                There’s a mood for every food.
                <Sparkles size={16} />
              </span>
            </div>
            <div className="categories">
              {categories.map((c) => (
                <button
                  key={c.id}
                  className={`category-card ${category === c.id ? "active" : ""}`}
                  aria-pressed={category === c.id}
                  onClick={() => {
                    updateParam("category", c.id);
                    if (c.id !== "all")
                      resultsRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                  }}
                >
                  <span
                    className="category-emoji"
                    style={{ "--category-color": c.color }}
                  >
                    {c.emoji}
                  </span>
                  <span>{c.name}</span>
                  <span className="category-active-dot" />
                </button>
              ))}
            </div>
          </section>
          <section className="offer-strip" aria-label="Featured offers">
            <Link className="offer-banner peach" to="/offers">
              <div>
                <span className="offer-eyebrow">
                  <Tag size={14} />A WARM LITTLE WELCOME
                </span>
                <h3>
                  Your cravings.
                  <br />
                  Our treat.
                </h3>
                <p>
                  Get 20% off with <strong>MELLOW20</strong>
                </p>
                <span className="offer-link">
                  A little more delicious
                  <ArrowUpRight size={16} />
                </span>
              </div>
              <span className="offer-illustration pizza-illustration">🍕</span>
              <span className="offer-amount">
                20
                <span>
                  %<br />
                  <small>OFF</small>
                </span>
              </span>
            </Link>
            <Link className="offer-banner mint" to="/offers">
              <div>
                <span className="offer-eyebrow">
                  <Bike size={16} />
                  HAPPINESS HAS NO DELIVERY FEE
                </span>
                <h3>
                  From their kitchen.
                  <br />
                  To your happy place.
                </h3>
                <p>Free delivery on orders over ₹399.</p>
                <span className="offer-link">
                  Let’s make it a date
                  <ArrowUpRight size={16} />
                </span>
              </div>
              <span className="delivery-illustration">
                <ShoppingBagIcon />
              </span>
            </Link>
          </section>
        </>
      ) : (
        <StepHeading
          eyebrow="THE ONES YOU LOVE"
          title="Your happy little list."
          description="All your saved favorites, in one delicious place."
        />
      )}
      <section
        className="restaurant-section"
        id="restaurants"
        ref={resultsRef}
        aria-labelledby="restaurants-title"
      >
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              {favoritesOnly
                ? "SAVED FOR ANOTHER CRAVING"
                : `GOOD FOOD AROUND ${location.split(",")[0].toUpperCase()}`}
            </span>
            <h2 id="restaurants-title">
              {favoritesOnly
                ? "Your favorites"
                : "Local favorites. Big feelings."}
              <span className="result-count">
                {filtered.length} {filtered.length === 1 ? "place" : "places"}
              </span>
            </h2>
          </div>
          <label className="sort-select">
            <SlidersHorizontal size={15} />
            <select
              aria-label="Sort restaurants"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="recommended">Recommended</option>
              <option value="rating">Top rated</option>
              <option value="time">Fastest delivery</option>
              <option value="price">Price: low to high</option>
            </select>
          </label>
        </div>
        <div className="filters">
          <button
            aria-pressed={veg}
            className={veg ? "active" : ""}
            onClick={() => setVeg(!veg)}
          >
            <Leaf size={14} />
            Pure veg{veg && <Check size={13} />}
          </button>
          <button
            aria-pressed={top}
            className={top ? "active" : ""}
            onClick={() => setTop(!top)}
          >
            <Star size={14} />
            Rated 4.8+{top && <Check size={13} />}
          </button>
          <button
            aria-pressed={fast}
            className={fast ? "active" : ""}
            onClick={() => setFast(!fast)}
          >
            <Clock size={14} />
            35 min or less{fast && <Check size={13} />}
          </button>
          {category !== "all" && (
            <button
              className="active"
              onClick={() => updateParam("category", "all")}
            >
              {category}
              <X size={13} />
            </button>
          )}
          {(query || favoritesOnly) && (
            <input
              className="results-search"
              aria-label="Filter restaurant results"
              value={query}
              onChange={(e) => updateParam("search", e.target.value)}
              placeholder={
                favoritesOnly ? "Search your favorites…" : "Search restaurants…"
              }
            />
          )}
          {(query || category !== "all" || veg || top || fast) && (
            <button
              className="reset-filters"
              onClick={() => {
                setParams({}, { preventScrollReset: true });
                setVeg(false);
                setTop(false);
                setFast(false);
              }}
            >
              Clear filters
            </button>
          )}
        </div>
        {filtered.length ? (
          <div className="restaurant-grid">
            {filtered.map((r, i) => (
              <RestaurantCard key={r.id} restaurant={r} index={i} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={favoritesOnly ? Heart : Search}
            title={
              favoritesOnly && !favorites.length
                ? "Save a little happiness for later."
                : "A craving less ordinary."
            }
            description={
              favoritesOnly && !favorites.length
                ? "Tap the heart on a restaurant to save it here."
                : "No restaurants match just yet. Try another search or clear your filters."
            }
          />
        )}
      </section>
      {!favoritesOnly && (
        <section className="feel-good-note">
          <span className="note-icon">✳</span>
          <div>
            <h3>A little local love goes a long way.</h3>
            <p>
              Good food from neighborhood kitchens. Because the best things are
              often close to home.
            </p>
          </div>
          <Link
            to="/offers"
            className="round-arrow"
            aria-label="Explore neighborhood offers"
          >
            <ArrowUpRight size={22} />
          </Link>
        </section>
      )}
    </div>
  );
}

function ShoppingBagIcon() {
  return (
    <svg viewBox="0 0 150 150" aria-hidden="true">
      <defs>
        <linearGradient id="bag" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#faf8e9" />
          <stop offset="1" stopColor="#dddab9" />
        </linearGradient>
      </defs>
      <ellipse cx="80" cy="132" rx="47" ry="9" fill="#648c73" opacity=".2" />
      <path
        d="M35 45 116 39l10 85-82 8Z"
        fill="url(#bag)"
        stroke="#fffdf0"
        strokeWidth="3"
      />
      <path
        d="M59 47c-8-43 39-44 33-3"
        fill="none"
        stroke="#e6e0bc"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path
        d="M64 81c1 21 28 23 34-3"
        fill="none"
        stroke="#f3794d"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx="66" cy="69" r="3" fill="#f3794d" />
      <circle cx="96" cy="67" r="3" fill="#f3794d" />
      <path
        d="m25 72-15-6m20 25L8 97m116-29 13-8"
        stroke="#6a967e"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
