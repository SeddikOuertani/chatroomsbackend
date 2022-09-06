module.exports.idFieldToJson = (schema) => {
  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
};


module.exports.generateRandomMinMax = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}