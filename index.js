/**
 * OBJ + MTL Loader for A-Frame.
 */
require('./lib/vendor/OBJLoader.js');
require('./lib/vendor/OBJMTLLoader.js');

module.exports.component = {
  schema: {
    src: { default: '' },
    mtl: { default: '' }
  },

  update: function () {
    var el = this.el;
    var data = this.data;
    var model = this.model;
    var url = this.parseUrl(data.src);
    var mtlUrl = this.parseUrl(data.mtl);
    if (model) { el.object3D.remove(model); }
    if (!url) {
      console.warn('Model URL not provided');
      return;
    }
    this.load(url, mtlUrl);
  },

  load: function (url, mtlUrl) {
    var self = this;
    var el = this.el;
    var loader;
    if (mtlUrl) {
      if (el.components.material) {
        console.warn('Material component is ignored when a .MTL is provided');
      }
      loader = new THREE.OBJMTLLoader();
      loader.load(url, mtlUrl, function (object) {
        self.model = object;
        el.object3D.add(object);
      });
    } else {
      loader = new THREE.OBJLoader();
      loader.load(url, function (object) {
        self.model = object;
        self.applyMaterial();
        el.object3D.add(object);
      });
    }
  },

  /**
   * Parses src from `url(src)`.
   * Based on parseUrl() from aframe-core's src-loader.js.
   * @param  {string} src - String to parse.
   * @return {string} The parsed src, if parseable.
   */
  parseUrl: function parseUrl (src) {
    var parsedSrc = src.match(/\url\((.+)\)/);
    if (!parsedSrc) { return; }
    return parsedSrc[1];
  }
};
