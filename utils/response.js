function response (req, res, next) {
  const data = res.data || {}
  res.json(data)
}

module.exports = response