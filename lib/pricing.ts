import { StoreOption } from "@/features/bom/data";

/**
 * Searches Makerlab Electronics (a Philippine Shopify store) for a component
 * using their public JSON suggestion endpoint.
 */
export async function searchMakerlab(keyword: string): Promise<StoreOption | null> {
  try {
    const encodedQuery = encodeURIComponent(keyword);
    // Shopify suggest API
    const res = await fetch(`https://www.makerlab-electronics.com/search/suggest.json?q=${encodedQuery}&resources[type]=product`);
    if (!res.ok) return null;

    const data = await res.json();
    const products = data.resources?.results?.products;
    
    if (!products || products.length === 0) return null;

    // Get the first matching product
    const bestMatch = products[0];
    
    // Price usually comes as a formatted string like "₱150.00" or just "150.0"
    // We strip non-numeric characters to get the float
    const rawPrice = bestMatch.price.toString().replace(/[^0-9.]/g, '');
    const price = parseFloat(rawPrice) || 0;

    return {
      id: `makerlab-${bestMatch.id}`,
      name: bestMatch.title,
      storeName: "Makerlab Electronics",
      price: price,
      link: `https://www.makerlab-electronics.com${bestMatch.url}`,
      inStock: bestMatch.available,
      isCheapest: false, // We'll compute this later when comparing multiple stores
    };
  } catch (error) {
    console.error(`Failed to search Makerlab for ${keyword}:`, error);
    return null;
  }
}

/**
 * Fallback / Mock store search for components not found online 
 * or to simulate multiple store comparisons.
 */
export async function searchMockStore(keyword: string, basePrice: number = 100): Promise<StoreOption> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Random price variation +/- 20%
  const variation = basePrice * 0.2;
  const randomizedPrice = basePrice + (Math.random() * variation * 2) - variation;

  return {
    id: `mock-${Date.now()}`,
    name: `${keyword} (Generic)`,
    storeName: "e-Gizmo (Mock)",
    price: parseFloat(randomizedPrice.toFixed(2)),
    link: `https://www.e-gizmo.net/?s=${encodeURIComponent(keyword)}`,
    inStock: true,
    isCheapest: false,
  };
}

/**
 * Resolves pricing for a given component by searching multiple Philippine stores.
 */
export async function resolveComponentPricing(componentName: string, partNumber: string): Promise<StoreOption[]> {
  const searchTerm = partNumber || componentName;
  
  // Fetch from multiple stores concurrently
  const results = await Promise.all([
    searchMakerlab(searchTerm),
    searchMockStore(searchTerm, 150) // Use mock as secondary store for comparison
  ]);

  // Filter out nulls (failed searches)
  const validStores = results.filter((s): s is StoreOption => s !== null);

  // If we found options, flag the cheapest one
  if (validStores.length > 0) {
    const cheapestIndex = validStores.reduce((lowestIdx, current, idx, arr) => 
      current.price < arr[lowestIdx].price ? idx : lowestIdx
    , 0);
    validStores[cheapestIndex].isCheapest = true;
  }

  return validStores;
}
