Router.post("/word", async (req, res) => {
  try {
    const newWord = await WordModel.create(req.body);
    res.status(201).json({ msg: "Word added" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

Router.get("/word/:id", async (req, res) => {
  try {
    const word = await WordModel.findOne({ _id: req.params.id });
    res.status(200).json({ word });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

Router.put("/word/:id", async (req, res) => {
  try {
    await WordModel.updateOne({ _id: req.params.id }, req.body);
    res.status(200).json({ msg: "Word updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

Router.delete("/word/:id", async (req, res) => {
  try {
    await WordModel.deleteOne({ _id: req.params.id });
    res.status(200).json({ msg: "Word deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

Router.post("/verif", isLogged, async (req, res) => {
  try {
    const game = await GameModel.findOne({ _id: req.body.gameId }).populate("word");
    if (!game) return res.status(404).json({ msg: "Game not found" });
    const result = generateScore(game.word.word, req.body.word);
    game.tries.push({ word: req.body.word, result });
    await game.save();
    res.status(200).json({ word: req.body.word, response: result, game });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function generateScore(target, attempt) {
  let score = "";
  for (let i = 0; i < target.length; i++)
    score += target[i] === attempt[i] ? "1" : target.includes(attempt[i]) ? "0" : "x";
  return score;
}
