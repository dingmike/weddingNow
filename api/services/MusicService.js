
module.exports = {
  getVisibleMusic: function(ID) {
    ID = parseInt(ID);
    var opt = {
      attributes: ['id', 'musicName', 'musicUrl'],
      where: {
        id:ID
      }
    };
    return Music.find(opt);
  }
};
