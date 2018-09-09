

module.exports = function(sequelize, DataTypes) {
  var Comment = sequelize.define("Comment", {
    fbUserId: DataTypes.STRING,
    fbUserDisplayName: DataTypes.STRING,
    fsVenueId: DataTypes.STRING,
    body: DataTypes.STRING,
  });


  return Comment;
};


