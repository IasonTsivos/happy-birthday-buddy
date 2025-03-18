
import { useState } from "react";
import { Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Balloons from "@/components/Balloons";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type GiftCategory = {
  id: string;
  name: string;
  icon: string;
};

type GiftItem = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
  imageUrl?: string;
};

// Gift categories
const giftCategories: GiftCategory[] = [
  { id: "music", name: "Music", icon: "🎵" },
  { id: "games", name: "Games", icon: "🎮" },
  { id: "books", name: "Books", icon: "📚" },
  { id: "gadgets", name: "Gadgets", icon: "📱" },
  { id: "fashion", name: "Fashion", icon: "👕" },
  { id: "sports", name: "Sports", icon: "⚽" },
  { id: "cooking", name: "Cooking", icon: "🍳" },
  { id: "art", name: "Art", icon: "🎨" },
];

// Sample gift items
const giftItems: GiftItem[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    category: "music",
    description: "High-quality noise-cancelling headphones for music lovers.",
    price: "$149.99",
    imageUrl: "https://placekitten.com/300/300" // Placeholder image
  },
  {
    id: "2",
    name: "Nintendo Switch",
    category: "games",
    description: "Popular gaming console with a wide selection of games.",
    price: "$299.99",
    imageUrl: "https://placekitten.com/301/300" // Placeholder image
  },
  {
    id: "3",
    name: "Best-selling Novel",
    category: "books",
    description: "The latest award-winning fiction book that everyone's talking about.",
    price: "$24.99",
    imageUrl: "https://placekitten.com/302/300" // Placeholder image
  },
  {
    id: "4",
    name: "Smart Watch",
    category: "gadgets",
    description: "Track fitness, receive notifications, and more with this smartwatch.",
    price: "$199.99",
    imageUrl: "https://placekitten.com/303/300" // Placeholder image
  },
  {
    id: "5",
    name: "Custom T-Shirt",
    category: "fashion",
    description: "Personalized t-shirt with custom design or message.",
    price: "$29.99",
    imageUrl: "https://placekitten.com/304/300" // Placeholder image
  },
  {
    id: "6",
    name: "Basketball",
    category: "sports",
    description: "Professional quality basketball for indoor or outdoor play.",
    price: "$39.99",
    imageUrl: "https://placekitten.com/305/300" // Placeholder image
  },
  {
    id: "7",
    name: "Cooking Class",
    category: "cooking",
    description: "Gift certificate for a local cooking class to learn new recipes.",
    price: "$75.00",
    imageUrl: "https://placekitten.com/306/300" // Placeholder image
  },
  {
    id: "8",
    name: "Paint Set",
    category: "art",
    description: "Complete acrylic paint set with brushes and canvas.",
    price: "$49.99",
    imageUrl: "https://placekitten.com/307/300" // Placeholder image
  },
];

export default function GiftRecommendations() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const filteredGifts = selectedCategory 
    ? giftItems.filter(item => item.category === selectedCategory)
    : giftItems;
  
  return (
    <div className="min-h-screen bg-background pb-24 page-transition">
      <Header />
      <Balloons />
      
      <main className="container max-w-4xl mx-auto px-3 sm:px-4 py-4">
        <div className="space-y-4">
          <h1 className="text-xl font-bold text-primary flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            Gift Recommendations
          </h1>
          
          <div className="categories-scroll pb-2 overflow-x-auto">
            <div className="flex space-x-2 w-max">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                className="rounded-full text-xs py-1 px-3 h-8"
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Button>
              {giftCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  className="rounded-full flex items-center gap-1 text-xs py-1 px-3 h-8"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </Button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {filteredGifts.map((gift) => (
              <Card key={gift.id} className={cn(
                "overflow-hidden transition-transform hover:scale-102",
                "border border-primary/10 bg-white/80 backdrop-blur-sm text-sm"
              )}>
                {gift.imageUrl && (
                  <div className="aspect-video w-full overflow-hidden bg-muted">
                    <img 
                      src={gift.imageUrl} 
                      alt={gift.name} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="p-3">
                  <h3 className="text-sm font-semibold truncate">{gift.name}</h3>
                  <div className="mt-1 text-xs text-gray-600 line-clamp-2">{gift.description}</div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-medium text-primary text-xs">{gift.price}</span>
                    <Button variant="outline" size="sm" className="rounded-full h-7 px-2 text-xs">
                      Add
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
