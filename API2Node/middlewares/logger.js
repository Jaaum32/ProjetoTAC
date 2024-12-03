
const logger = (req, res, next) => {
    console.log("Nova requisição em: ", new Date(), req.url);
    next();
}

module.exports = logger;