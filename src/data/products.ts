import { Product } from '../types';

const rawProducts: Product[] = [
  {
    "id": "site-cnt-01",
    "name": "Korean Chain",
    "price": 299,
    "originalPrice": 449,
    "category": "necklaces",
    "isTennisJewellery": false,
    "isBestseller": true,
    "isNew": true,
    "rating": 4.6,
    "reviewsCount": 106,
    "images": [
      "korean chain 299 - chain -6.jpg"
    ],
    "description": "Minimalist high-quality Korean link sleek herringbone pattern with ultra-fine luxury polish. Sits beautifully as a daily driver without losing any premium glow.",
    "material": "High-Quality Anti-Tarnish PVD Coated Brass",
    "inStock": true,
    "stockCount": 57,
    "badge": "Waterproof & Anti-Tarnish"
  },
  {
    "id": "site-cnt-02",
    "name": "Pink Heart Chain",
    "price": 225,
    "originalPrice": 338,
    "category": "necklaces",
    "isTennisJewellery": false,
    "isBestseller": true,
    "isNew": false,
    "rating": 4.9,
    "reviewsCount": 100,
    "images": [
      "pink heart 225 chain 9.jpg"
    ],
    "description": "A delicate, romantic pink high-refractive glass sweetheart locket pendant suspended elegantly on a thin, premium golden link chain.",
    "material": "Gold Plated Anti-Tarnish Brass with Blush Quartz Glass",
    "inStock": true,
    "stockCount": 76,
    "badge": "Anti-Tarnish Only"
  },
  {
    "id": "site-cnt-03",
    "name": "Pink Square Diamond Chain",
    "price": 280,
    "originalPrice": 420,
    "category": "necklaces",
    "isTennisJewellery": false,
    "isBestseller": true,
    "isNew": false,
    "rating": 4.8,
    "reviewsCount": 63,
    "images": [
      "pink square diamond 280 chain -3.jpg"
    ],
    "description": "A charming baguette cut pink tourmaline simulated zirconia, enclosed beautifully in durable golden claw prongs on an ultra-chic chain.",
    "material": "Waterproof Gold Plating, Pink Cushion Cut Cubic Zirconia",
    "inStock": true,
    "stockCount": 72,
    "badge": "Feminine Sparkle"
  },
  {
    "id": "site-cnt-04",
    "name": "Pretty Small Heart Chain",
    "price": 249,
    "originalPrice": 374,
    "category": "necklaces",
    "isTennisJewellery": false,
    "isBestseller": true,
    "isNew": false,
    "rating": 4.9,
    "reviewsCount": 141,
    "images": [
      "pretty small heart 249 chain-2.jpg"
    ],
    "description": "Sweet hollow golden outline heart design representing minimalist luxury. Lightweight necklace choice perfect for daily style layering.",
    "material": "Premium Anti-Tarnish Gold Plated Brass",
    "inStock": true,
    "stockCount": 78,
    "badge": "Dainty Accent"
  },
  {
    "id": "site-cnt-05",
    "name": "Single Diamond Chain",
    "price": 219,
    "originalPrice": 329,
    "category": "necklaces",
    "isTennisJewellery": false,
    "isBestseller": true,
    "isNew": true,
    "rating": 4.7,
    "reviewsCount": 132,
    "images": [
      "single diamond -219 -chain 7.jpg"
    ],
    "description": "A timeless classic single solitare round-cut AAA+ cubic zirconia jewel, shimmering with perfect diamond facets on a delicate golden link chain.",
    "material": "Prong Set AAA+ CZ, Gold Plated Brass Base",
    "inStock": true,
    "stockCount": 52,
    "badge": "Daily Glam"
  },
  {
    "id": "site-cnt-06",
    "name": "White Flower Chain",
    "price": 379,
    "originalPrice": 569,
    "category": "necklaces",
    "isTennisJewellery": false,
    "isBestseller": true,
    "isNew": false,
    "rating": 4.8,
    "reviewsCount": 78,
    "images": [
      "white flower 379 chain 5.jpg"
    ],
    "description": "A gorgeous white mother-of-pearl layered floral bloom pendant, bound safely in vintage royal golden rope linings. Extremely premium.",
    "material": "Natural Mother of Pearl, Premium Anti-Tarnish Gold Detailing",
    "inStock": true,
    "stockCount": 45,
    "badge": "Bestseller Premium"
  },
  {
    "id": "site-cnt-07",
    "name": "Golden Circle with Diamond Chain",
    "price": 249,
    "originalPrice": 374,
    "category": "necklaces",
    "isTennisJewellery": false,
    "isBestseller": false,
    "isNew": false,
    "rating": 4.5,
    "reviewsCount": 90,
    "images": [
      "golden circle with diamond 249 - chain 8.jpg"
    ],
    "description": "Geometric chic concept featuring an open golden halo enclosing a single dangling diamond crystal center. Modern architectural accessory.",
    "material": "Waterproof Gold PVD Alloy, Round Cut CZ",
    "inStock": true,
    "stockCount": 45,
    "badge": "Modernist Halo"
  },
  {
    "id": "site-cnt-08",
    "name": "Green Diamond Chain",
    "price": 280,
    "originalPrice": 420,
    "category": "necklaces",
    "isTennisJewellery": false,
    "isBestseller": false,
    "isNew": false,
    "rating": 4.7,
    "reviewsCount": 92,
    "images": [
      "green chain diamond 280 chain -4.jpg"
    ],
    "description": "Deep mesmerizing emerald green emerald-cut central crystal, creating a royal heritage feel that matches casual wear and evening attire impeccably.",
    "material": "Simulated Royal Emerald, Gold Finish Brass",
    "inStock": true,
    "stockCount": 82,
    "badge": "Retro Royal"
  },
  {
    "id": "site-cnt-09",
    "name": "Heart Necklace Chain",
    "price": 219,
    "originalPrice": 329,
    "category": "necklaces",
    "isTennisJewellery": false,
    "isBestseller": false,
    "isNew": true,
    "rating": 4.6,
    "reviewsCount": 45,
    "images": [
      "heart necklace 219 chain -1.jpg"
    ],
    "description": "Traditional gold sweetheart locket design representing sweet devotion. An outstanding accessory or deep-meaning gift for her.",
    "material": "Golden Electroplated Anti-Tarnish Clasp Chain",
    "inStock": true,
    "stockCount": 73,
    "badge": "Love Token"
  },
  {
    "id": "site-cnt-10",
    "name": "V Ring Golden",
    "price": 180,
    "originalPrice": 270,
    "category": "rings",
    "isTennisJewellery": false,
    "isBestseller": false,
    "isNew": false,
    "rating": 4.9,
    "reviewsCount": 130,
    "images": [
      "v ring golden - 1 price 180.jpg"
    ],
    "description": "A striking golden chevron V band ring designed with a micro-polished mirror gloss. Excellent for creating stackable combinations.",
    "material": "Anti-Tarnish Gold Plated Brass, Hypoallergenic Base",
    "inStock": true,
    "stockCount": 64,
    "badge": "Stackable Chic"
  },
  {
    "id": "site-cnt-11",
    "name": "V Ring Silver",
    "price": 180,
    "originalPrice": 270,
    "category": "rings",
    "isTennisJewellery": false,
    "isBestseller": false,
    "isNew": false,
    "rating": 4.5,
    "reviewsCount": 95,
    "images": [
      "v ring silver 2 at 180 rupee.jpg"
    ],
    "description": "Chic silver chevron V contour ring, beautifully polished and crafted to sit comfortably around the knuckle.",
    "material": "Rhodium Plated Sterling Finish Stainless Base",
    "inStock": true,
    "stockCount": 43,
    "badge": "High Shine Finish"
  },
  {
    "id": "site-cnt-12",
    "name": "Plain Heart Earrings",
    "price": 99,
    "originalPrice": 149,
    "category": "earrings",
    "isTennisJewellery": false,
    "isBestseller": false,
    "isNew": false,
    "rating": 4.8,
    "reviewsCount": 105,
    "images": [
      "plain heart earrings 3 - 99 ruppes.jpg"
    ],
    "description": "Light, comfy hollow-heart studs with hypoallergenic alloy posts that don't weigh down the earlobes.",
    "material": "Nickel-Free Allergy Safe Alloy Base",
    "inStock": true,
    "stockCount": 52,
    "badge": "Under ₹99 Store"
  },
  {
    "id": "site-cnt-13",
    "name": "Pretty Circle Earrings",
    "price": 99,
    "originalPrice": 149,
    "category": "earrings",
    "isTennisJewellery": false,
    "isBestseller": false,
    "isNew": true,
    "rating": 4.6,
    "reviewsCount": 85,
    "images": [
      "pretty circle earrings - 4 at 99 ruppes.jpg"
    ],
    "description": "Standard circular daily wear micro hoops. Versatile accessory suitable for workplace and college styling.",
    "material": "Anti-Tarnish Golden Finished Alloy",
    "inStock": true,
    "stockCount": 51,
    "badge": "Daily Essential"
  },
  {
    "id": "site-cnt-14",
    "name": "Pretty Heart Earrings",
    "price": 99,
    "originalPrice": 149,
    "category": "earrings",
    "isTennisJewellery": false,
    "isBestseller": false,
    "isNew": false,
    "rating": 5,
    "reviewsCount": 116,
    "images": [
      "pretty heart earrings - 2 - 99 rupees.jpg"
    ],
    "description": "Sweet, dainty romantic hearts with comfortable pushbacks to keep them safely in place throughout dynamic days.",
    "material": "Fine Yellow Gold Plated Alloy",
    "inStock": true,
    "stockCount": 56,
    "badge": "Sweet Romantic"
  },
  {
    "id": "site-cnt-15",
    "name": "Pretty Long Circle Hoops",
    "price": 99,
    "originalPrice": 149,
    "category": "earrings",
    "isTennisJewellery": false,
    "isBestseller": false,
    "isNew": false,
    "rating": 4.5,
    "reviewsCount": 52,
    "images": [
      "pretty long circle hoops earrings -7 at 99.jpg"
    ],
    "description": "Feminine drop-circle dangle hoops that elongate gracefully to frame the face and provide an understated sparkle.",
    "material": "Highly Polished Gold Finish Hoop Alloy",
    "inStock": true,
    "stockCount": 75,
    "badge": "Face Framing Drop"
  },
  {
    "id": "site-cnt-16",
    "name": "Square Earrings",
    "price": 99,
    "originalPrice": 149,
    "category": "earrings",
    "isTennisJewellery": false,
    "isBestseller": false,
    "isNew": false,
    "rating": 4.9,
    "reviewsCount": 120,
    "images": [
      "square earrings - 1 for 99 rupees.jpg"
    ],
    "description": "Bold geometric design with solid square outline faces. Unique minimalist aesthetic for modern tastes.",
    "material": "Matte Polished Anti-corrosive Alloy",
    "inStock": true,
    "stockCount": 74,
    "badge": "Geometric Bold"
  },
  {
    "id": "site-cnt-17",
    "name": "Star Earrings",
    "price": 99,
    "originalPrice": 149,
    "category": "earrings",
    "isTennisJewellery": false,
    "isBestseller": false,
    "isNew": true,
    "rating": 4.6,
    "reviewsCount": 32,
    "images": [
      "star earrings - 8 at 99.jpg"
    ],
    "description": "Dainty starry sky studs representing dreaming spirits. Micro studs that sit beautifully on main or secondary piercings.",
    "material": "Anti-Tarnish Gold Plated Brass Post",
    "inStock": true,
    "stockCount": 54,
    "badge": "Celestial Sparkle"
  },
  {
    "id": "site-cnt-18",
    "name": "Big Circle Hoops",
    "price": 99,
    "originalPrice": 149,
    "category": "earrings",
    "isTennisJewellery": false,
    "isBestseller": false,
    "isNew": false,
    "rating": 4.8,
    "reviewsCount": 34,
    "images": [
      "big size circle hoops earrings -6 at 99.jpg"
    ],
    "description": "Oversized classic circle statement hoops designed with ultra-light wireframes to prevent ear-lobe stretching.",
    "material": "Thin Flexible High-Tensile Steel Wire",
    "inStock": true,
    "stockCount": 63,
    "badge": "Statement Hoop"
  },
  {
    "id": "site-cnt-19",
    "name": "Premium Earrcup Earrings",
    "price": 225,
    "originalPrice": 338,
    "category": "earrings",
    "isTennisJewellery": false,
    "isBestseller": false,
    "isNew": false,
    "rating": 5,
    "reviewsCount": 134,
    "images": [
      "earrcup earrings 225 - 8.jpg"
    ],
    "description": "Creative cartilage wrap-around cuff earrings featuring beautiful simulated diamonds of cascading lengths. Needs zero piercings.",
    "material": "Flexible Brass Ear Cuff, AAA+ Zirconia Trims",
    "inStock": true,
    "stockCount": 35,
    "badge": "No-Piercing Needed"
  },
  {
    "id": "site-cnt-20",
    "name": "Heart Earrings (Style 5)",
    "price": 99,
    "originalPrice": 149,
    "category": "earrings",
    "isTennisJewellery": false,
    "isBestseller": false,
    "isNew": false,
    "rating": 4.5,
    "reviewsCount": 37,
    "images": [
      "heart earrings 5 at 99 rupee.jpg"
    ],
    "description": "Whimsical romantic heart studs accented with modern polished details. Extremely lightweight and durable.",
    "material": "Highly Durable Polished Alloy Composite",
    "inStock": true,
    "stockCount": 73,
    "badge": "Style 5 Edition"
  },
  {
    "id": "site-cnt-21",
    "name": "Plain Adjustable Kada",
    "price": 249,
    "originalPrice": 374,
    "category": "bracelets",
    "isTennisJewellery": false,
    "isBestseller": false,
    "isNew": true,
    "rating": 4.6,
    "reviewsCount": 80,
    "images": [
      "plain adjustable kada 249 braclet -3.jpg"
    ],
    "description": "A sleek, gender-neutral open open-ended bangle block Kada bracelet. Easily expanded or reshaped by hand to wrap beautifully.",
    "material": "Non-Rusting Tough Titanium Finish Steel",
    "inStock": true,
    "stockCount": 67,
    "badge": "Gender-Neutral"
  },
  {
    "id": "site-cnt-22",
    "name": "White Heart Bracelet",
    "price": 300,
    "originalPrice": 450,
    "category": "bracelets",
    "isTennisJewellery": false,
    "isBestseller": false,
    "isNew": false,
    "rating": 4.6,
    "reviewsCount": 61,
    "images": [
      "white heart braaclet 300 - braclet 4.jpg"
    ],
    "description": "Stunning white enamel hard casing hearts links, structured into an anti-tarnish golden bracelet with adjustable lobster lock.",
    "material": "White Cloisonné Resins, Premium Brass Links",
    "inStock": true,
    "stockCount": 48,
    "badge": "White Enamel Series"
  },
  {
    "id": "site-cnt-23",
    "name": "Adjustable Flower Bracelet",
    "price": 349,
    "originalPrice": 524,
    "category": "bracelets",
    "isTennisJewellery": false,
    "isBestseller": false,
    "isNew": false,
    "rating": 4.5,
    "reviewsCount": 149,
    "images": [
      "flower braclet 349.jpg"
    ],
    "description": "Playful, charming daisy chain floral elements linking together with shiny gold accents. Instantly lightens up any casual wear outfit.",
    "material": "Hand-molded Enamel Flower Buds, Anti-Tarnish Nickel-Free Brass",
    "inStock": true,
    "stockCount": 77,
    "badge": "Spring Garden Edition"
  },
  {
    "id": "site-cnt-24",
    "name": "Butterfly Golden Bracelet",
    "price": 300,
    "originalPrice": 450,
    "category": "bracelets",
    "isTennisJewellery": false,
    "isBestseller": false,
    "isNew": false,
    "rating": 4.6,
    "reviewsCount": 34,
    "images": [
      "butterfly golden braclet 300 braclet -2.jpg"
    ],
    "description": "Highly intricate gold butterflies appearing to hover on a beautiful double layered fine link wrist chain.",
    "material": "Premium Anti-Tarnish Double Wire Brass",
    "inStock": true,
    "stockCount": 46,
    "badge": "Whimsical Butterflies"
  },
  {
    "id": "site-cnt-25",
    "name": "Tulip Charm Bracelet",
    "price": 349,
    "originalPrice": 524,
    "category": "bracelets",
    "isTennisJewellery": false,
    "isBestseller": false,
    "isNew": true,
    "rating": 4.8,
    "reviewsCount": 95,
    "images": [
      "tulip braclet.jpg"
    ],
    "description": "A very sweet specialty tulip bud charm suspended on a beautiful dainty gold-electroplated link chain. Truly unique fashion designer detail.",
    "material": "Cloisonné Enamel Tulip Bloom, Waterproof Gold Plated Chain",
    "inStock": true,
    "stockCount": 41,
    "badge": "Tulip Garden"
  },
  {
    "id": "site-cnt-26",
    "name": "Aesthetic Phone Charm",
    "price": 200,
    "originalPrice": 300,
    "category": "charms",
    "isTennisJewellery": false,
    "isBestseller": false,
    "isNew": false,
    "rating": 4.7,
    "reviewsCount": 133,
    "images": [
      "phone charms 200.jpg"
    ],
    "description": "A super cute pastel-beaded aesthetic phone lanyard. Upgrades your mirror selfie style instantly with happy patterns.",
    "material": "Pastel Ceramics, Glass Beads, High-Strength Cord Thread",
    "inStock": true,
    "stockCount": 57,
    "badge": "Handmade Pastel Charm"
  },
  {
    "id": "site-cnt-27",
    "name": "Silver Bell Chain",
    "price": 99,
    "originalPrice": 149,
    "category": "charms",
    "isTennisJewellery": false,
    "isBestseller": false,
    "isNew": false,
    "rating": 4.9,
    "reviewsCount": 42,
    "images": [
      "silver bell chain at 99 only.jpg"
    ],
    "description": "Cute silver tone chain featuring a tiny pleasant sounding musical bell bead. Excellent as phone, handbag, or wallet adornment.",
    "material": "Non-corrosive Zinc-Alloy Chain and Bell Core",
    "inStock": true,
    "stockCount": 43,
    "badge": "Pleasant Chimes"
  },
  {
    "id": "site-cnt-28",
    "name": "Bronze Bell Keychain",
    "price": 99,
    "originalPrice": 149,
    "category": "charms",
    "isTennisJewellery": false,
    "isBestseller": false,
    "isNew": false,
    "rating": 4.7,
    "reviewsCount": 42,
    "images": [
      "bronz bell keychain at 99.jpg"
    ],
    "description": "Rustic, aesthetically pleasing bronze-finish metal keychain, featuring a pleasant low-frequence antique bell.",
    "material": "Antique Finish Heavy Duty Bronze Alloy",
    "inStock": true,
    "stockCount": 57,
    "badge": "Vintage Essential"
  },
  {
    "id": "site-cnt-29",
    "name": "Premium Cherry Keychain",
    "price": 200,
    "originalPrice": 300,
    "category": "charms",
    "isTennisJewellery": false,
    "isBestseller": false,
    "isNew": true,
    "rating": 4.9,
    "reviewsCount": 115,
    "images": [
      "cherry keychain-1 at 200.jpg"
    ],
    "description": "Delicious glossy red cherries dangling from high-quality gold metal keys hoop rings. An absolute cute crowd favorite.",
    "material": "Super Sleek High Shine Acrylics, Gold-Finish Ring Holders",
    "inStock": true,
    "stockCount": 77,
    "badge": "Cherry Dream"
  },
  {
    "id": "site-cnt-30",
    "name": "Evil Eye Protection Keychain",
    "price": 149,
    "originalPrice": 224,
    "category": "charms",
    "isTennisJewellery": false,
    "isBestseller": false,
    "isNew": false,
    "rating": 5,
    "reviewsCount": 127,
    "images": [
      "devil eye keychain 2 at 149.jpg"
    ],
    "description": "Authentic glass blue-white evil eye protection bead linked beautifully with golden hardware to keep negative energy away.",
    "material": "Traditional Murano Glass Core, Polished Golden Ring",
    "inStock": true,
    "stockCount": 40,
    "badge": "Warding Protection"
  },
  {
    "id": "site-cnt-31",
    "name": "Tulip Red Bracelet & Green Chain Combo",
    "price": 600,
    "originalPrice": 900,
    "category": "sets",
    "isTennisJewellery": false,
    "isBestseller": false,
    "isNew": false,
    "rating": 4.7,
    "reviewsCount": 77,
    "images": [
      "tulip braclet in red and green chain at 600.jpg"
    ],
    "description": "A vibrant premium value compilation combining our sweet red tulip enamel bracelet with our best selling Green Emerald necklace.",
    "material": "Enamel Red Tulip Bud, Green CZ Diamond Necklace Chain",
    "inStock": true,
    "stockCount": 75,
    "badge": "Double Value Set"
  },
  {
    "id": "site-cnt-32",
    "name": "Tulip Sky Blue Bracelet & Chain Combo",
    "price": 550,
    "originalPrice": 825,
    "category": "sets",
    "isTennisJewellery": false,
    "isBestseller": false,
    "isNew": false,
    "rating": 4.7,
    "reviewsCount": 71,
    "images": [
      "combo sky and chain 550.jpg"
    ],
    "description": "Dreamy skies value set pairing our pastel blue tulip adjustable chain bracelet with the coordinating floral sky bloom lock necklace.",
    "material": "Sky Blue Ceramic Enamelled Tulip, Gold Plated Base Links",
    "inStock": true,
    "stockCount": 60,
    "badge": "Blue Dream Combo"
  }
];

const TENNIS_IDS = ["site-cnt-03", "site-cnt-05", "site-cnt-07", "site-cnt-08", "site-cnt-10", "site-cnt-11", "site-cnt-19"];

const BASE_IMG_URL = "https://arakshe22extc-byte.github.io/acessriesbyakanksha1/";

export const products: Product[] = rawProducts.map(p => ({
  ...p,
  badge: 'Anti-Tarnish',
  isTennisJewellery: TENNIS_IDS.includes(p.id) ? true : p.isTennisJewellery,
  images: p.images.map(img => img.startsWith('http') ? img : `${BASE_IMG_URL}${encodeURIComponent(img)}`)
}));

export const reviews = [
  {
    id: 'rev-01',
    userName: 'Ananya S.',
    rating: 5,
    comment: 'Absolutely in love with the Korean Chain! It looks so premium and I wear it in the shower and gym, and it has not tarnished or turned black at all. The brilliance is spectacular.',
    date: '2026-05-18',
    verified: true,
  },
  {
    id: 'rev-02',
    userName: 'Kriti Sharma',
    rating: 5,
    comment: 'The White Flower Chain is incredibly detailed and feels like a luxury high-end shop item. Gifted it to my sister and she cried. Elegant packaging!',
    date: '2026-05-10',
    verified: true,
  },
  {
    id: 'rev-03',
    userName: 'Megha Patel',
    rating: 4,
    comment: 'Perfect size and beautiful V-ring. I stacked the Golden V-ring with Silver, it looks very modern and classy. Fast delivery to Mumbai too.',
    date: '2026-05-04',
    verified: true,
  },
  {
    id: 'rev-04',
    userName: 'Rhea M.',
    rating: 5,
    comment: 'The Tulip charms bracelets became my go-to wristwear. Incredible detail and gloss. Highly recommend custom Accessories by Akanksha jewelry.',
    date: '2026-04-29',
    verified: true,
  },
  {
    id: 'rev-05',
    userName: 'Priya Anand',
    rating: 5,
    comment: 'The phone charms are so cute! The beads are high quality and don\'t look cheap at all. Best purchase!',
    date: '2026-05-24',
    verified: true,
  }
];
