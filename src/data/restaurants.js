export const categories = [
  { id: 'all', name: 'All cravings', emoji: '🍽️', color: '#f7e9db' },
  { id: 'Pizza', name: 'Pizza', emoji: '🍕', color: '#ffe7cb' },
  { id: 'Burgers', name: 'Burgers', emoji: '🍔', color: '#eedfc7' },
  { id: 'Biryani', name: 'Biryani', emoji: '🍛', color: '#f6d9bd' },
  { id: 'Healthy', name: 'Healthy', emoji: '🥗', color: '#e2ebcf' },
  { id: 'Desserts', name: 'Desserts', emoji: '🧁', color: '#f4dfe2' },
  { id: 'Bowls', name: 'Bowls', emoji: '🍜', color: '#e4e6f2' },
];

export const restaurants = [
  { id: 'little-naples', name: 'Little Naples', cuisine: 'Wood-fired pizza · Italian · Comfort food', category: 'Pizza', image: 'pizza', rating: 4.8, reviews: 2400, time: 25, distance: '1.2', price: 300, veg: true, offer: '20% OFF up to ₹150', tag: 'Neighborhood favorite', description: 'A little corner of Italy, a whole lot of heart. Slow-fermented dough, San Marzano tomatoes, and a perfectly blistered crust. Made fresh, always.', color: '#f8e5d5' },
  { id: 'bun-and-done', name: 'Bun & Done', cuisine: 'Smash burgers · American · Fries', category: 'Burgers', image: 'burger', rating: 4.7, reviews: 1800, time: 20, distance: '0.8', price: 250, veg: false, offer: 'Free delivery over ₹399', tag: 'Big on flavor', description: 'Golden buns. Crispy edges. The kind of burger you think about tomorrow. Freshly smashed and stacked just for you.', color: '#f4ddc9' },
  { id: 'green-theory', name: 'Green Theory', cuisine: 'Salads · Healthy · Plant-based', category: 'Healthy', image: 'salad', rating: 4.9, reviews: 960, time: 30, distance: '2.1', price: 280, veg: true, offer: '20% OFF up to ₹150', tag: 'Feel-good food', description: 'Colorful, seasonal ingredients with a generous helping of good energy. Thoughtful salads and wholesome plates, made to brighten your day.', color: '#e4edda' },
  { id: 'dum-story', name: 'The Dum Story', cuisine: 'Biryani · North Indian · Kebabs', category: 'Biryani', image: 'biryani', rating: 4.6, reviews: 3100, time: 35, distance: '2.5', price: 320, veg: false, offer: '₹100 OFF your first order', tag: 'Slow cooked, worth it', description: 'Fragrant basmati, warm spices, and generations of good taste. Sealed and slow cooked for a biryani that feels like a celebration.', color: '#f5e0c3' },
  { id: 'sugar-cloud', name: 'Sugar Cloud', cuisine: 'Desserts · Cakes · Sweet little things', category: 'Desserts', image: 'dessert', rating: 4.8, reviews: 1200, time: 25, distance: '1.6', price: 200, veg: true, offer: '20% OFF up to ₹150', tag: 'Your happy ending', description: 'For the sweet tooth in all of us. Small-batch cakes, fudgy brownies, and indulgent little treats baked with love every morning.', color: '#f2dfe3' },
  { id: 'bowl-buddy', name: 'Bowl Buddy', cuisine: 'Asian bowls · Noodles · Fusion', category: 'Bowls', image: 'bowl', rating: 4.7, reviews: 840, time: 20, distance: '1.1', price: 260, veg: false, offer: 'Free delivery over ₹399', tag: 'A bowl lot of love', description: 'Comfort in a bowl. Bright vegetables, punchy sauces, and perfectly cooked rice and noodles, all tossed together for your next favorite meal.', color: '#e2e8dc' },
];

const dish = (id, name, description, price, image, veg = true, popular = false, category = 'Signature dishes') => ({ id, name, description, price, image, veg, popular, category });
const menus = {
  'little-naples': [
    dish('margherita', 'The Classic Margherita', 'San Marzano tomatoes, fresh mozzarella, basil & a drizzle of extra virgin olive oil.', 299, 'pizza', true, true),
    dish('garden-pizza', 'Garden Party', 'Roasted peppers, sweet corn, olives, mushrooms & our signature tomato sauce.', 349, 'pizza', true, false),
    dish('truffle-pizza', 'Truffle Shuffle', 'Creamy mushroom sauce, mozzarella & an earthy finish of truffle oil.', 429, 'pizza', true, true),
    dish('garlic-bread', 'Cheesy Garlic Bread', 'Oven-baked sourdough with roasted garlic butter & melted mozzarella.', 159, 'pizza', true, false, 'Sides'),
    dish('house-salad', 'Little House Salad', 'Crisp greens, cherry tomatoes & a bright lemon vinaigrette.', 189, 'salad', true, false, 'Sides'),
    dish('chocolate-cake', 'Chocolate Daydream', 'A rich, fudgy slice with dark chocolate ganache. Always a good idea.', 179, 'dessert', true, true, 'Something sweet'),
  ],
  'bun-and-done': [
    dish('classic-smash', 'The Double Smash', 'Two seared chicken patties, melted cheddar, pickles & house sauce.', 279, 'burger', false, true),
    dish('veggie-burger', 'Garden Stack', 'Crispy chickpea patty, avocado, crunchy lettuce & herby mayo.', 249, 'burger', true, true),
    dish('spicy-burger', 'Hot Honey Crunch', 'Crispy chicken, hot honey glaze, slaw & jalapeños.', 329, 'burger', false),
    dish('loaded-fries', 'Loaded Potato Wedges', 'Golden potato wedges with cheese sauce & smoky paprika.', 149, 'burger', true, false, 'Sides'),
    dish('fresh-salad', 'Crunchy Side Salad', 'Seasonal greens, cucumbers & our tangy house dressing.', 129, 'salad', true, false, 'Sides'),
    dish('brownie', 'Fudge Brownie', 'A soft, intensely chocolatey brownie with a crackly top.', 149, 'dessert', true, false, 'Something sweet'),
  ],
  'green-theory': [
    dish('rainbow-salad', 'The Rainbow Bowl', 'Seasonal greens, chickpeas, quinoa & lemon-tahini dressing.', 289, 'salad', true, true),
    dish('avocado-salad', 'Avocado Crush', 'Creamy avocado, cherry tomatoes, seeds & fresh mixed leaves.', 329, 'salad', true, true),
    dish('power-bowl', 'Green Power Bowl', 'Brown rice, roasted broccoli, tofu & a herby green dressing.', 299, 'bowl'),
    dish('garden-side', 'Little Garden', 'A fresh, crisp side of seasonal salad & lemon dressing.', 139, 'salad', true, false, 'Sides'),
    dish('grain-side', 'Warm Grain Salad', 'A wholesome mix of quinoa, brown rice & roasted vegetables.', 169, 'bowl', true, false, 'Sides'),
    dish('raw-cake', 'Cocoa Cloud Cake', 'Dark chocolate & almond cake, naturally sweetened.', 199, 'dessert', true, false, 'Something sweet'),
  ],
  'dum-story': [
    dish('chicken-biryani', 'Signature Chicken Dum', 'Tender chicken, aged basmati, saffron & aromatic whole spices.', 329, 'biryani', false, true),
    dish('veg-biryani', 'Garden Dum Biryani', 'Slow-cooked seasonal vegetables, fragrant basmati & fried onions.', 279, 'biryani', true, true),
    dish('paneer-biryani', 'Royal Paneer Biryani', 'Soft paneer, rich masala & long-grain rice, sealed with love.', 309, 'biryani'),
    dish('raita', 'Cucumber Raita', 'Cool yogurt, fresh cucumber & gently toasted cumin.', 79, 'salad', true, false, 'Sides'),
    dish('kebab-bowl', 'Chicken Kebab Bowl', 'Chargrilled chicken with fragrant rice & cooling herb yogurt.', 239, 'bowl', false, false, 'Sides'),
    dish('celebration-cake', 'Celebration Cake', 'A little slice of chocolate indulgence to finish your feast.', 159, 'dessert', true, false, 'Something sweet'),
  ],
  'sugar-cloud': [
    dish('chocolate-cloud', 'Chocolate Cloud Cake', 'Layers of soft chocolate sponge with silky dark ganache.', 219, 'dessert', true, true),
    dish('berry-cake', 'Berry Happy Cake', 'Vanilla sponge, berry compote & fluffy whipped cream.', 249, 'dessert', true, true),
    dish('fudge-slice', 'The Fudgy One', 'Our richest dark chocolate cake with a pinch of sea salt.', 229, 'dessert'),
    dish('mini-treat', 'Mini Chocolate Treat', 'A small-batch chocolate cake bite for little cravings.', 99, 'dessert', true, false, 'Little treats'),
    dish('cake-duo', 'Cake for Two', 'Two generous slices of our signature chocolate cloud cake.', 399, 'dessert', true, false, 'To share'),
  ],
  'bowl-buddy': [
    dish('teriyaki-bowl', 'Teriyaki Comfort Bowl', 'Glazed chicken, steamed rice, sesame & fresh crunchy greens.', 289, 'bowl', false, true),
    dish('tofu-bowl', 'Sesame Tofu Bowl', 'Golden tofu, stir-fried vegetables & sesame-soy rice.', 259, 'bowl', true, true),
    dish('noodle-bowl', 'Chilli Garlic Bowl', 'Noodles tossed with fresh vegetables, garlic & a little heat.', 249, 'bowl'),
    dish('side-salad', 'Sesame Crunch Salad', 'Crunchy greens, carrots & toasted sesame dressing.', 129, 'salad', true, false, 'Sides'),
    dish('rice-side', 'Little Rice Bowl', 'Steamed rice with toasted sesame & spring onions.', 99, 'bowl', true, false, 'Sides'),
    dish('sweet-bite', 'Chocolate Sweet Bite', 'A soft chocolate slice to round out your bowl.', 139, 'dessert', true, false, 'Something sweet'),
  ],
};

export const getMenu = id => menus[id] || [];
export const getRestaurant = id => restaurants.find(r => r.id === id);
export const imageUrl = name => `/images/${name}.jpg`;
export const locations = ['Indiranagar, Bengaluru', 'Koramangala, Bengaluru', 'HSR Layout, Bengaluru', 'Whitefield, Bengaluru'];
export const customization = item => ({
  sizes: [{ name: 'Regular', price: 0 }, { name: 'Large', price: Math.round(item.price * 0.35) }],
  extras: item.image === 'dessert'
    ? [{ name: 'Chocolate drizzle', price: 29 }, { name: 'Extra berries', price: 39 }]
    : [{ name: 'Extra cheese', price: 39 }, { name: 'Roasted vegetables', price: 49 }],
});
