const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf-8').split('\n').reduce((acc, line) => {
  const [k, ...v] = line.split('=');
  if(k && v.length) acc[k.trim()] = v.join('=').trim();
  return acc;
}, {});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function seed() {
  console.log('Fetching users...');
  // Service role can query auth.users
  const { data: users, error: userError } = await supabase.auth.admin.listUsers();
  if (userError || !users || users.users.length === 0) {
    console.error('No users found!', userError);
    return;
  }
  
  const userId = users.users[0].id;
  console.log('Using user ID:', userId);

  console.log('Fetching products...');
  const { data: products, error: prodError } = await supabase.from('products').select('id, name');
  if (prodError || !products) {
    console.error('Failed to fetch products', prodError);
    return;
  }
  
  console.log(`Found ${products.length} products. Inserting reviews...`);
  
  const reviews = [];
  
  for (const product of products) {
    reviews.push({
      product_id: product.id,
      user_id: userId,
      rating: 5,
      title: 'Amazing quality!',
      review_text: `I absolutely loved this ${product.name}! The quality exceeded my expectations and it looked perfect for the event. Highly recommended!`,
      is_approved: true
    });
    
    reviews.push({
      product_id: product.id,
      user_id: userId,
      rating: 4,
      title: 'Very good',
      review_text: `Good product, fast delivery. ${product.name} matched the description perfectly.`,
      is_approved: true
    });
  }
  
  // Insert in batches of 100
  for (let i = 0; i < reviews.length; i += 100) {
    const batch = reviews.slice(i, i + 100);
    const { error } = await supabase.from('product_reviews').insert(batch);
    if (error) {
      console.error('Error inserting batch:', error);
    } else {
      console.log(`Inserted batch ${i/100 + 1}`);
    }
  }
  
  console.log('Done seeding reviews!');
}

seed();
