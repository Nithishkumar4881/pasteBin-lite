const express = require('express');
const Paste = require('../models/model');
const router = express.Router();
const app = express();
app.use(express.json());
router.post('/pastes', async (req, res) => {
  try {
    const { content, expiresAt, maxViews } = req.body;
    const paste = new Paste({ content,
        expiresAt: expiresAt ? Date.now() + expiresAt * 1000 : null,
        maxViews });
    await paste.save();
    res.status(201).json({content: paste.content, url: `https://paste-bin-lite-iota.vercel.app/api/pastes/${paste._id}`});
  } catch (err) {
    res.status(500).json({ error: 'Failed to create paste', details: err.message });
  } 
});
router.get('/pastes/:id', async (req, res) => {
  const { id } = req.params;
    try {
    const paste = await Paste.findById(id);
    if (!paste) {
      return res.status(404).json({ error: 'Paste not found' });
    }
    // res.status(200).json({ content: paste.content });
    // Check for expiration
    const currentTime = Date.now();
    if (paste.expiresAt && (currentTime > paste.expiresAt)) {
      return res.status(404).json({ error: 'Paste has expired' });
    }
    // Check for max views
    if (paste.maxViews !== null) {
      if (paste.viewCount >= paste.maxViews) {
        return res.status(404).json({ error: 'Paste has reached maximum views' });
      }
    }
    // Increment view count
    paste.viewCount += 1;
    await paste.save();
    res.status(200).json({ content:paste.content, viewsLeft: paste.maxViews !== null ? paste.maxViews - paste.viewCount : 'unlimited', expiresAt: paste.expiresAt?new Date(paste.expiresAt):"never expired" });
}
     catch (err) {
    res.status(500).json({ d:err });
  }     

});

router.get('/health',(req, res)=>{
    res.status(200).send({ok:true});
})

module.exports = router;