const User = require('./User');
const Picture = require('./Picture');

User.hasMany(Picture, { foreignKey: 'userId' });
Picture.belongsTo(User, { foreignKey: 'userId' });
