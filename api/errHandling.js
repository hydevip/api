


function handleError(res, err) {
    console.log(err);
    res.status(500).json({ error: err });
  }

  module.exports = { handleError} ;