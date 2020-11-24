class NewsController {
  index(req, res) {
    res.render('/');
  }

  show(req, res) {
    res.send('news/...');
  }
}

module.exports = new NewsController();
