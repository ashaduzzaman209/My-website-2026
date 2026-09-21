const PRODUCTS = [
  {
    id: 1,
    name: "স্মার্টফোন Samsung Galaxy A15",
    price: 18500,
    oldPrice: 21000,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
    description: "৬.৫ ইঞ্চি AMOLED ডিসপ্লে, ৫০MP ক্যামেরা, ৫০০০mAh ব্যাটারি, ৬GB RAM + ১২৮GB স্টোরেজ। অফিসিয়াল ওয়ারেন্টিসহ।",
    stock: 15,
    rating: 4.5
  },
  {
    id: 2,
    name: "Wireless Bluetooth Headphone",
    price: 2450,
    oldPrice: 3200,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    description: "নয়েজ ক্যান্সেলিং, ৩০ ঘণ্টা ব্যাকআপ, Bluetooth 5.3। মিউজিক ও গেমিং এর জন্য পারফেক্ট।",
    stock: 30,
    rating: 4.3
  },
  {
    id: 3,
    name: "পুরুষদের স্লিম ফিট শার্ট",
    price: 850,
    oldPrice: 1200,
    category: "fashion",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400",
    description: "১০০% কটন ফ্যাব্রিক, আরামদায়ক ও টেকসই। অফিস ও ক্যাজুয়াল দুটোই মানায়।",
    stock: 50,
    rating: 4.7
  },
  {
    id: 4,
    name: "মেয়েদের হ্যান্ডব্যাগ",
    price: 1500,
    oldPrice: 2200,
    category: "fashion",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400",
    description: "প্রিমিয়াম লেদার, একাধিক কম্পার্টমেন্ট, ফ্যাশনেবল ডিজাইন।",
    stock: 22,
    rating: 4.4
  },
  {
    id: 5,
    name: "মিনিকেট চাল (৫ কেজি)",
    price: 420,
    oldPrice: 480,
    category: "grocery",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
    description: "১০০% খাঁটি ও অর্গানিক মিনিকেট চাল। প্রিমিয়াম কোয়ালিটি।",
    stock: 100,
    rating: 4.8
  },
  {
    id: 6,
    name: "অর্গানিক মধু (৫০০ গ্রাম)",
    price: 550,
    oldPrice: 700,
    category: "grocery",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400",
    description: "সুন্দরবনের প্রাকৃতিক মধু, ল্যাব টেস্টেড। কোনো প্রিজারভেটিভ নেই।",
    stock: 40,
    rating: 4.9
  },
  {
    id: 7,
    name: "প্রোগ্রামিং শেখার বাংলা বই",
    price: 380,
    oldPrice: 500,
    category: "books",
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400",
    description: "JavaScript, HTML, CSS শেখার সম্পূর্ণ বাংলা গাইড। বিগিনার থেকে অ্যাডভান্সড।",
    stock: 60,
    rating: 4.6
  },
  {
    id: 8,
    name: "Non-Stick Frying Pan",
    price: 950,
    oldPrice: 1350,
    category: "home",
    image: "https://images.unsplash.com/photo-1584990347449-a1c1b2b0e5e4?w=400",
    description: "প্রিমিয়াম কোয়ালিটি নন-স্টিক প্যান, তেল ছাড়াই রান্না করা যায়।",
    stock: 35,
    rating: 4.2
  },
  {
    id: 9,
    name: "LED Desk Lamp",
    price: 780,
    oldPrice: 1100,
    category: "home",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400",
    description: "টাচ কন্ট্রোল, ৩ লেভেল ব্রাইটনেস, USB চার্জিং পোর্ট। পড়াশোনার জন্য আদর্শ।",
    stock: 25,
    rating: 4.5
  },
  {
    id: 10,
    name: "Smart Watch",
    price: 3200,
    oldPrice: 4500,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
    description: "হার্ট রেট মনিটর, স্টেপ কাউন্ট, নোটিফিকেশন সাপোর্ট, ৭ দিন ব্যাকআপ।",
    stock: 18,
    rating: 4.4
  },
  {
    id: 11,
    name: "বাচ্চাদের খেলনা গাড়ি",
    price: 450,
    oldPrice: 650,
    category: "home",
    image: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400",
    description: "নিরাপদ প্লাস্টিক, ব্যাটারি চালিত, রিমোট কন্ট্রোল সহ।",
    stock: 45,
    rating: 4.3
  },
  {
    id: 12,
    name: "স্পোর্টস স্নিকার",
    price: 1850,
    oldPrice: 2500,
    category: "fashion",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    description: "লাইটওয়েট, আরামদায়ক, রানিং ও জিমের জন্য পারফেক্ট। সব সাইজ আছে।",
    stock: 28,
    rating: 4.6
  }
];
