var _ = require('lodash');


module.exports = {
  attributes: {
    id: {
      type: Sequelize.INTEGER.UNSIGNED,
      primaryKey: true
    },
    musicName: Sequelize.STRING(50),
    musicUrl: Sequelize.STRING(300),
    visible: {
      type: Sequelize.INTEGER.UNSIGNED,
      defaultValue: 1
    }
  },
  options: {
    tableName: 'music',
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
    updatedAt: 'lastUpdateTime',
    createdAt: 'createTime',
    classMethods: {
    }
  }
};
