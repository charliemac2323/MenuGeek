export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const { query, ll, radius } = req.query;
  const FSQ_KEY = 'FEMUUOWK1ZMF4UT1RWYXNOHBDZYPQNNWSL0RKAAZPSSRMANG';

  try {
    const response = await fetch(
      `https://api.foursquare.com/v3/places/search?query=${encodeURIComponent(query)}&ll=${ll}&radius=${radius || 5000}&categories=13000&limit=15&fields=name,location,distance,rating,price`,
      { headers: { 'Authorization': FSQ_KEY, 'Accept': 'application/json' } }
    );
    const data = await response.json();
    res.status(200).json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
