/**
 * OBJ + MTL Loader for A-Frame.
 */
require('./lib/vendor/OBJLoader.js');
require('./lib/vendor/MTLLoader.js');
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
    var objUrl = this.parseUrl(data.src);
    var mtlUrl = this.parseUrl(data.mtl);
    if (model) { el.object3D.remove(model); }
    if (objUrl && mtlUrl) {
      if (el.components.material) {
        console.warn('Material component is ignored when a .MTL is provided');
      }
      this.loadObjMtl(objUrl, mtlUrl);
    } else if (objUrl) {
      this.loadObj(objUrl);
    } else {
      console.warn('Model URL not provided');
    }
  },

  /**
   * Load a .OBJ using THREE.OBJLoader.
   * @param  {string} objUrl
   */
  loadObj: function (objUrl) {
    var loader = new THREE.OBJLoader();
    loader.load(objUrl, function (object) {
      this.model = object;
      this.applyMaterial();
      this.el.object3D.add(object);
    }.bind(this));
  },

  /**
   * Load a .OBJ and .MTL using THREE.OBJMTLLoader.
   * @param  {string} objUrl
   * @param  {string} mtlUrl
   */
  loadObjMtl: function (objUrl, mtlUrl) {
    var loader = new THREE.OBJMTLLoader();
    loader.load(objUrl, mtlUrl, function (object) {
      this.model = object;
      this.el.object3D.add(object);
    }.bind(this));
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
