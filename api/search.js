export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { query, ll, radius } = req.query;

  if (!query || !ll) {
    return res.status(400).json({ error: 'Missing query or location' });
  }

  const FSQ_KEY = 'FEMUUOWK1ZMF4UT1RWYXNOHBDZYPQNNWSL0RKAAZPSSRMANG';

  const attemptFetch = async () => {
    const response = await fetch(
      `https://api.foursquare.com/v3/places/search?query=${encodeURIComponent(query)}&ll=${ll}&radius=${radius || 10000}&limit=20&fields=name,location,distance,rating,price,categories`,
      {
        headers: {
          'Authorization': FSQ_KEY,
          'Accept': 'application/json'
        }
      }
    );
    if (!response.ok) throw new Error(`FSQ error: ${response.status}`);
    return response.json();
  };

  // Try up to 3 times
  for (let i = 0; i < 3; i++) {
    try {
      const data = await attemptFetch();
      return res.status(200).json(data);
    } catch(e) {
      if (i === 2) return res.status(500).json({ error: e.message });
      await new Promise(r => setTimeout(r, 500));
    }
  }
}
