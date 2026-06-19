
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { query, ll, radius } = req.query;

  if (!query || !ll) {
    return res.status(400).json({ error: 'Missing query or location' });
  }

  const FSQ_KEY = 'FEMUUOWK1ZMF4UT1RWYXNOHBDZYPQNNWSL0RKAAZPSSRMANG';

  try {
    const url = `https://api.foursquare.com/v3/places/search?query=${encodeURIComponent(query)}&ll=${ll}&radius=${radius || 5000}&categories=13000&limit=15&fields=name,location,distance,rating,price`;

    const response = await fetch(url, {
      headers: {
        'Authorization': FSQ_KEY,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Foursquare error: ${response.status}`);
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
