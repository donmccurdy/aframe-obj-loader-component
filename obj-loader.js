/**
 * OBJ + MTL Loader for A-Frame.
 */
require('./lib/vendor/OBJLoader.js');
require('./lib/vendor/MTLLoader.js');

module.exports = {
  dependencies: [ 'material' ],

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
   * Load a .OBJ and .MTL using THREE.OBJMTLLoader.
   * @param  {string} objUrl
   * @param  {string} mtlUrl
   */
  loadObjMtl: function (objUrl, mtlUrl) {
    var self = this;
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setBaseUrl(mtlUrl.substr(0, mtlUrl.lastIndexOf('/') + 1));
    mtlLoader.load(mtlUrl, function(materials) {
      materials.preload();
      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.load(objUrl, function (object) {
        self.model = object;
        self.el.object3D.add(object);
        self.el.emit('model-loaded', {format: 'obj', model: object});
      });
    });
  },

  /**
   * Load a .OBJ using THREE.OBJLoader.
   * @param  {string} objUrl
   */
  loadObj: function (objUrl) {
    var self = this;
    var loader = new THREE.OBJLoader();
    loader.load(objUrl, function (object) {
      self.model = object;
      self.applyMaterial();
      self.el.object3D.add(object);
      self.el.emit('model-loaded', {format: 'obj', model: object});
    });
  },

  /**
   * Apply aframe material component (not .MTL) to a loaded model.
   */
  applyMaterial: function () {
    var material = this.el.components.material.material;
    if (!this.model) { return; }
    this.model.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        child.material = material;
      }
    });
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
