const fetch = require('node-fetch');
const { parseString } = require('xml2js');

// Wannan zai rika gudana kowane awa 4
export default async function handler(req, res) {
  console.log("BOT YA TASHI: " + new Date());

  const SEARCH_WORDS = ["Hausa Novel", "Labarin Soyayya", "Audio Book Hausa"];
  let sabbinVideos = [];

  for(let word of SEARCH_WORDS){
    let rssUrl = `https://www.youtube.com/feeds/videos.xml?search_query=${encodeURIComponent(word)}`;
    let response = await fetch(rssUrl);
    let xml = await response.text();

    parseString(xml, (err, result) => {
      if(!err && result.feed.entry){
        result.feed.entry.forEach(video => {
          sabbinVideos.push({
            title: video.title[0],
            link: video.link[0].$.href,
            thumbnail: video['media:group'][0]['media:thumbnail'][0].$.url,
            published: video.published[0]
          });
        });
      }
    });
  }

  console.log(`Na samu ${sabbinVideos.length} sabbin video`);

  // Anan zamu tura sabbinVideos zuwa AppCreator24 ko Database
  // misali: await saveToDatabase(sabbinVideos);

  res.status(200).json({ success: true, count: sabbinVideos.length, data: sabbinVideos });
}
