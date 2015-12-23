/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	// Browser distribution of the A-Frame component.
	(function (AFRAME) {
	  if (!AFRAME) {
	    console.error('Component attempted to register before AFRAME was available.');
	    return;
	  }

	  // Register all components here.
	  var components = {
	    'obj-loader': __webpack_require__(1).component
	  };

	  Object.keys(components).forEach(function (name) {
	    if (AFRAME.aframeCore) {
	      AFRAME.aframeCore.registerComponent(name, components[name]);
	    } else {
	      AFRAME.registerComponent(name, components[name]);
	    }
	  });
	})(window.AFRAME);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * OBJ + MTL Loader for A-Frame.
	 */
	__webpack_require__(2);
	__webpack_require__(3);
	__webpack_require__(4);

	module.exports.component = {
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
	    var loader = new THREE.OBJMTLLoader();
	    loader.load(objUrl, mtlUrl, function (object) {
	      this.model = object;
	      this.el.object3D.add(object);
	    }.bind(this));
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


/***/ },
/* 2 */
/***/ function(module, exports) {

	/**
	 * @author mrdoob / http://mrdoob.com/
	 */

	THREE.OBJLoader = function ( manager ) {

		this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

	};

	THREE.OBJLoader.prototype = {

		constructor: THREE.OBJLoader,

		load: function ( url, onLoad, onProgress, onError ) {

			var scope = this;

			var loader = new THREE.XHRLoader( scope.manager );
			loader.setCrossOrigin( this.crossOrigin );
			loader.load( url, function ( text ) {

				onLoad( scope.parse( text ) );

			}, onProgress, onError );

		},

		setCrossOrigin: function ( value ) {

			this.crossOrigin = value;

		},

		parse: function ( text ) {

			console.time( 'OBJLoader' );

			var object, objects = [];
			var geometry, material;

			function parseVertexIndex( value ) {

				var index = parseInt( value );

				return ( index >= 0 ? index - 1 : index + vertices.length / 3 ) * 3;

			}

			function parseNormalIndex( value ) {

				var index = parseInt( value );

				return ( index >= 0 ? index - 1 : index + normals.length / 3 ) * 3;

			}

			function parseUVIndex( value ) {

				var index = parseInt( value );

				return ( index >= 0 ? index - 1 : index + uvs.length / 2 ) * 2;

			}

			function addVertex( a, b, c ) {

				geometry.vertices.push(
					vertices[ a ], vertices[ a + 1 ], vertices[ a + 2 ],
					vertices[ b ], vertices[ b + 1 ], vertices[ b + 2 ],
					vertices[ c ], vertices[ c + 1 ], vertices[ c + 2 ]
				);

			}

			function addNormal( a, b, c ) {

				geometry.normals.push(
					normals[ a ], normals[ a + 1 ], normals[ a + 2 ],
					normals[ b ], normals[ b + 1 ], normals[ b + 2 ],
					normals[ c ], normals[ c + 1 ], normals[ c + 2 ]
				);

			}

			function addUV( a, b, c ) {

				geometry.uvs.push(
					uvs[ a ], uvs[ a + 1 ],
					uvs[ b ], uvs[ b + 1 ],
					uvs[ c ], uvs[ c + 1 ]
				);

			}

			function addFace( a, b, c, d,  ua, ub, uc, ud, na, nb, nc, nd ) {

				var ia = parseVertexIndex( a );
				var ib = parseVertexIndex( b );
				var ic = parseVertexIndex( c );
				var id;

				if ( d === undefined ) {

					addVertex( ia, ib, ic );

				} else {

					id = parseVertexIndex( d );

					addVertex( ia, ib, id );
					addVertex( ib, ic, id );

				}

				if ( ua !== undefined ) {

					ia = parseUVIndex( ua );
					ib = parseUVIndex( ub );
					ic = parseUVIndex( uc );

					if ( d === undefined ) {

						addUV( ia, ib, ic );

					} else {

						id = parseUVIndex( ud );

						addUV( ia, ib, id );
						addUV( ib, ic, id );

					}

				}

				if ( na !== undefined ) {

					ia = parseNormalIndex( na );
					ib = parseNormalIndex( nb );
					ic = parseNormalIndex( nc );

					if ( d === undefined ) {

						addNormal( ia, ib, ic );

					} else {

						id = parseNormalIndex( nd );

						addNormal( ia, ib, id );
						addNormal( ib, ic, id );

					}

				}

			}

			// create mesh if no objects in text

			if ( /^o /gm.test( text ) === false ) {

				geometry = {
					vertices: [],
					normals: [],
					uvs: []
				};

				material = {
					name: ''
				};

				object = {
					name: '',
					geometry: geometry,
					material: material
				};

				objects.push( object );

			}

			var vertices = [];
			var normals = [];
			var uvs = [];

			// v float float float

			var vertex_pattern = /v( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/;

			// vn float float float

			var normal_pattern = /vn( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/;

			// vt float float

			var uv_pattern = /vt( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/;

			// f vertex vertex vertex ...

			var face_pattern1 = /f( +-?\d+)( +-?\d+)( +-?\d+)( +-?\d+)?/;

			// f vertex/uv vertex/uv vertex/uv ...

			var face_pattern2 = /f( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))?/;

			// f vertex/uv/normal vertex/uv/normal vertex/uv/normal ...

			var face_pattern3 = /f( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))?/;

			// f vertex//normal vertex//normal vertex//normal ...

			var face_pattern4 = /f( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))?/;

			//

			var lines = text.split( '\n' );

			for ( var i = 0; i < lines.length; i ++ ) {

				var line = lines[ i ];
				line = line.trim();

				var result;

				if ( line.length === 0 || line.charAt( 0 ) === '#' ) {

					continue;

				} else if ( ( result = vertex_pattern.exec( line ) ) !== null ) {

					// ["v 1.0 2.0 3.0", "1.0", "2.0", "3.0"]

					vertices.push(
						parseFloat( result[ 1 ] ),
						parseFloat( result[ 2 ] ),
						parseFloat( result[ 3 ] )
					);

				} else if ( ( result = normal_pattern.exec( line ) ) !== null ) {

					// ["vn 1.0 2.0 3.0", "1.0", "2.0", "3.0"]

					normals.push(
						parseFloat( result[ 1 ] ),
						parseFloat( result[ 2 ] ),
						parseFloat( result[ 3 ] )
					);

				} else if ( ( result = uv_pattern.exec( line ) ) !== null ) {

					// ["vt 0.1 0.2", "0.1", "0.2"]

					uvs.push(
						parseFloat( result[ 1 ] ),
						parseFloat( result[ 2 ] )
					);

				} else if ( ( result = face_pattern1.exec( line ) ) !== null ) {

					// ["f 1 2 3", "1", "2", "3", undefined]

					addFace(
						result[ 1 ], result[ 2 ], result[ 3 ], result[ 4 ]
					);

				} else if ( ( result = face_pattern2.exec( line ) ) !== null ) {

					// ["f 1/1 2/2 3/3", " 1/1", "1", "1", " 2/2", "2", "2", " 3/3", "3", "3", undefined, undefined, undefined]

					addFace(
						result[ 2 ], result[ 5 ], result[ 8 ], result[ 11 ],
						result[ 3 ], result[ 6 ], result[ 9 ], result[ 12 ]
					);

				} else if ( ( result = face_pattern3.exec( line ) ) !== null ) {

					// ["f 1/1/1 2/2/2 3/3/3", " 1/1/1", "1", "1", "1", " 2/2/2", "2", "2", "2", " 3/3/3", "3", "3", "3", undefined, undefined, undefined, undefined]

					addFace(
						result[ 2 ], result[ 6 ], result[ 10 ], result[ 14 ],
						result[ 3 ], result[ 7 ], result[ 11 ], result[ 15 ],
						result[ 4 ], result[ 8 ], result[ 12 ], result[ 16 ]
					);

				} else if ( ( result = face_pattern4.exec( line ) ) !== null ) {

					// ["f 1//1 2//2 3//3", " 1//1", "1", "1", " 2//2", "2", "2", " 3//3", "3", "3", undefined, undefined, undefined]

					addFace(
						result[ 2 ], result[ 5 ], result[ 8 ], result[ 11 ],
						undefined, undefined, undefined, undefined,
						result[ 3 ], result[ 6 ], result[ 9 ], result[ 12 ]
					);

				} else if ( /^o /.test( line ) ) {

					geometry = {
						vertices: [],
						normals: [],
						uvs: []
					};

					material = {
						name: ''
					};

					object = {
						name: line.substring( 2 ).trim(),
						geometry: geometry,
						material: material
					};

					objects.push( object )

				} else if ( /^g /.test( line ) ) {

					// group

				} else if ( /^usemtl /.test( line ) ) {

					// material

					material.name = line.substring( 7 ).trim();

				} else if ( /^mtllib /.test( line ) ) {

					// mtl file

				} else if ( /^s /.test( line ) ) {

					// smooth shading

				} else {

					// console.log( "THREE.OBJLoader: Unhandled line " + line );

				}

			}

			var container = new THREE.Object3D();

			for ( var i = 0, l = objects.length; i < l; i ++ ) {

				object = objects[ i ];
				geometry = object.geometry;

				var buffergeometry = new THREE.BufferGeometry();

				buffergeometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array( geometry.vertices ), 3 ) );

				if ( geometry.normals.length > 0 ) {

					buffergeometry.addAttribute( 'normal', new THREE.BufferAttribute( new Float32Array( geometry.normals ), 3 ) );

				}

				if ( geometry.uvs.length > 0 ) {

					buffergeometry.addAttribute( 'uv', new THREE.BufferAttribute( new Float32Array( geometry.uvs ), 2 ) );

				}

				material = new THREE.MeshLambertMaterial();
				material.name = object.material.name;

				var mesh = new THREE.Mesh( buffergeometry, material );
				mesh.name = object.name;

				container.add( mesh );

			}

			console.timeEnd( 'OBJLoader' );

			return container;

		}

	};


/***/ },
/* 3 */
/***/ function(module, exports) {

	/**
	 * Loads a Wavefront .mtl file specifying materials
	 *
	 * @author angelxuanchang
	 */

	THREE.MTLLoader = function( manager ) {

		this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

	};

	THREE.MTLLoader.prototype = {

		constructor: THREE.MTLLoader,

		load: function ( url, onLoad, onProgress, onError ) {

			var scope = this;

			var loader = new THREE.XHRLoader( this.manager );
			loader.setCrossOrigin( this.crossOrigin );
			loader.load( url, function ( text ) {

				onLoad( scope.parse( text ) );

			}, onProgress, onError );

		},

		setBaseUrl: function( value ) {

			this.baseUrl = value;

		},

		setCrossOrigin: function ( value ) {

			this.crossOrigin = value;

		},

		setMaterialOptions: function ( value ) {

			this.materialOptions = value;

		},

		/**
		 * Parses loaded MTL file
		 * @param text - Content of MTL file
		 * @return {THREE.MTLLoader.MaterialCreator}
		 */
		parse: function ( text ) {

			var lines = text.split( "\n" );
			var info = {};
			var delimiter_pattern = /\s+/;
			var materialsInfo = {};

			for ( var i = 0; i < lines.length; i ++ ) {

				var line = lines[ i ];
				line = line.trim();

				if ( line.length === 0 || line.charAt( 0 ) === '#' ) {

					// Blank line or comment ignore
					continue;

				}

				var pos = line.indexOf( ' ' );

				var key = ( pos >= 0 ) ? line.substring( 0, pos ) : line;
				key = key.toLowerCase();

				var value = ( pos >= 0 ) ? line.substring( pos + 1 ) : "";
				value = value.trim();

				if ( key === "newmtl" ) {

					// New material

					info = { name: value };
					materialsInfo[ value ] = info;

				} else if ( info ) {

					if ( key === "ka" || key === "kd" || key === "ks" ) {

						var ss = value.split( delimiter_pattern, 3 );
						info[ key ] = [ parseFloat( ss[ 0 ] ), parseFloat( ss[ 1 ] ), parseFloat( ss[ 2 ] ) ];

					} else {

						info[ key ] = value;

					}

				}

			}

			var materialCreator = new THREE.MTLLoader.MaterialCreator( this.baseUrl, this.materialOptions );
			materialCreator.setCrossOrigin( this.crossOrigin );
			materialCreator.setManager( this.manager );
			materialCreator.setMaterials( materialsInfo );
			return materialCreator;

		}

	};

	/**
	 * Create a new THREE-MTLLoader.MaterialCreator
	 * @param baseUrl - Url relative to which textures are loaded
	 * @param options - Set of options on how to construct the materials
	 *                  side: Which side to apply the material
	 *                        THREE.FrontSide (default), THREE.BackSide, THREE.DoubleSide
	 *                  wrap: What type of wrapping to apply for textures
	 *                        THREE.RepeatWrapping (default), THREE.ClampToEdgeWrapping, THREE.MirroredRepeatWrapping
	 *                  normalizeRGB: RGBs need to be normalized to 0-1 from 0-255
	 *                                Default: false, assumed to be already normalized
	 *                  ignoreZeroRGBs: Ignore values of RGBs (Ka,Kd,Ks) that are all 0's
	 *                                  Default: false
	 *                  invertTransparency: If transparency need to be inverted (inversion is needed if d = 0 is fully opaque)
	 *                                      Default: false (d = 1 is fully opaque)
	 * @constructor
	 */

	THREE.MTLLoader.MaterialCreator = function( baseUrl, options ) {

		this.baseUrl = baseUrl;
		this.options = options;
		this.materialsInfo = {};
		this.materials = {};
		this.materialsArray = [];
		this.nameLookup = {};

		this.side = ( this.options && this.options.side ) ? this.options.side : THREE.FrontSide;
		this.wrap = ( this.options && this.options.wrap ) ? this.options.wrap : THREE.RepeatWrapping;

	};

	THREE.MTLLoader.MaterialCreator.prototype = {

		constructor: THREE.MTLLoader.MaterialCreator,

		setCrossOrigin: function ( value ) {

			this.crossOrigin = value;

		},

		setManager: function ( value ) {

			this.manager = value;

		},

		setMaterials: function( materialsInfo ) {

			this.materialsInfo = this.convert( materialsInfo );
			this.materials = {};
			this.materialsArray = [];
			this.nameLookup = {};

		},

		convert: function( materialsInfo ) {

			if ( ! this.options ) return materialsInfo;

			var converted = {};

			for ( var mn in materialsInfo ) {

				// Convert materials info into normalized form based on options

				var mat = materialsInfo[ mn ];

				var covmat = {};

				converted[ mn ] = covmat;

				for ( var prop in mat ) {

					var save = true;
					var value = mat[ prop ];
					var lprop = prop.toLowerCase();

					switch ( lprop ) {

						case 'kd':
						case 'ka':
						case 'ks':

							// Diffuse color (color under white light) using RGB values

							if ( this.options && this.options.normalizeRGB ) {

								value = [ value[ 0 ] / 255, value[ 1 ] / 255, value[ 2 ] / 255 ];

							}

							if ( this.options && this.options.ignoreZeroRGBs ) {

								if ( value[ 0 ] === 0 && value[ 1 ] === 0 && value[ 1 ] === 0 ) {

									// ignore

									save = false;

								}

							}

							break;

						case 'd':

							// According to MTL format (http://paulbourke.net/dataformats/mtl/):
							//   d is dissolve for current material
							//   factor of 1.0 is fully opaque, a factor of 0 is fully dissolved (completely transparent)

							if ( this.options && this.options.invertTransparency ) {

								value = 1 - value;

							}

							break;

						default:

							break;
					}

					if ( save ) {

						covmat[ lprop ] = value;

					}

				}

			}

			return converted;

		},

		preload: function () {

			for ( var mn in this.materialsInfo ) {

				this.create( mn );

			}

		},

		getIndex: function( materialName ) {

			return this.nameLookup[ materialName ];

		},

		getAsArray: function() {

			var index = 0;

			for ( var mn in this.materialsInfo ) {

				this.materialsArray[ index ] = this.create( mn );
				this.nameLookup[ mn ] = index;
				index ++;

			}

			return this.materialsArray;

		},

		create: function ( materialName ) {

			if ( this.materials[ materialName ] === undefined ) {

				this.createMaterial_( materialName );

			}

			return this.materials[ materialName ];

		},

		createMaterial_: function ( materialName ) {

			// Create material

			var mat = this.materialsInfo[ materialName ];
			var params = {

				name: materialName,
				side: this.side

			};

			for ( var prop in mat ) {

				var value = mat[ prop ];

				switch ( prop.toLowerCase() ) {

					// Ns is material specular exponent

					case 'kd':

						// Diffuse color (color under white light) using RGB values

						params[ 'color' ] = new THREE.Color().fromArray( value );

						break;

					case 'ka':

						// Ambient color (color under shadow) using RGB values

						break;

					case 'ks':

						// Specular color (color when light is reflected from shiny surface) using RGB values
						params[ 'specular' ] = new THREE.Color().fromArray( value );

						break;

					case 'map_kd':

						// Diffuse texture map

						params[ 'map' ] = this.loadTexture( this.baseUrl + value );
						params[ 'map' ].wrapS = this.wrap;
						params[ 'map' ].wrapT = this.wrap;

						break;

					case 'ns':

						// The specular exponent (defines the focus of the specular highlight)
						// A high exponent results in a tight, concentrated highlight. Ns values normally range from 0 to 1000.

						params[ 'shininess' ] = parseFloat( value );

						break;

					case 'd':

						// According to MTL format (http://paulbourke.net/dataformats/mtl/):
						//   d is dissolve for current material
						//   factor of 1.0 is fully opaque, a factor of 0 is fully dissolved (completely transparent)

						if ( value < 1 ) {

							params[ 'transparent' ] = true;
							params[ 'opacity' ] = value;

						}

						break;

					case 'map_bump':
					case 'bump':

						// Bump texture map

						if ( params[ 'bumpMap' ] ) break; // Avoid loading twice.

						params[ 'bumpMap' ] = this.loadTexture( this.baseUrl + value );
						params[ 'bumpMap' ].wrapS = this.wrap;
						params[ 'bumpMap' ].wrapT = this.wrap;

						break;

					default:
						break;

				}

			}

			this.materials[ materialName ] = new THREE.MeshPhongMaterial( params );
			return this.materials[ materialName ];

		},


		loadTexture: function ( url, mapping, onLoad, onProgress, onError ) {

			var texture;
			var loader = THREE.Loader.Handlers.get( url );
			var manager = ( this.manager !== undefined ) ? this.manager : THREE.DefaultLoadingManager;

			if ( loader !== null ) {

				texture = loader.load( url, onLoad );

			} else {

				texture = new THREE.Texture();

				loader = new THREE.ImageLoader( manager );
				loader.setCrossOrigin( this.crossOrigin );
				loader.load( url, function ( image ) {

					texture.image = THREE.MTLLoader.ensurePowerOfTwo_( image );
					texture.needsUpdate = true;

					if ( onLoad ) onLoad( texture );

				}, onProgress, onError );

			}

			if ( mapping !== undefined ) texture.mapping = mapping;

			return texture;

		}

	};

	THREE.MTLLoader.ensurePowerOfTwo_ = function ( image ) {

		if ( ! THREE.Math.isPowerOfTwo( image.width ) || ! THREE.Math.isPowerOfTwo( image.height ) ) {

			var canvas = document.createElement( "canvas" );
			canvas.width = THREE.MTLLoader.nextHighestPowerOfTwo_( image.width );
			canvas.height = THREE.MTLLoader.nextHighestPowerOfTwo_( image.height );

			var ctx = canvas.getContext( "2d" );
			ctx.drawImage( image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height );
			return canvas;

		}

		return image;

	};

	THREE.MTLLoader.nextHighestPowerOfTwo_ = function( x ) {

		-- x;

		for ( var i = 1; i < 32; i <<= 1 ) {

			x = x | x >> i;

		}

		return x + 1;

	};

	THREE.EventDispatcher.prototype.apply( THREE.MTLLoader.prototype );


/***/ },
/* 4 */
/***/ function(module, exports) {

	/**
	 * Loads a Wavefront .obj file with materials
	 *
	 * @author mrdoob / http://mrdoob.com/
	 * @author angelxuanchang
	 */

	THREE.OBJMTLLoader = function ( manager ) {

		this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

	};

	THREE.OBJMTLLoader.prototype = {

		constructor: THREE.OBJMTLLoader,

		load: function ( url, mtlurl, onLoad, onProgress, onError ) {

			var scope = this;

			var mtlLoader = new THREE.MTLLoader( this.manager );
			mtlLoader.setBaseUrl( url.substr( 0, url.lastIndexOf( "/" ) + 1 ) );
			mtlLoader.setCrossOrigin( this.crossOrigin );
			mtlLoader.load( mtlurl, function ( materials ) {

				var materialsCreator = materials;
				materialsCreator.preload();

				var loader = new THREE.XHRLoader( scope.manager );
				loader.setCrossOrigin( scope.crossOrigin );
				loader.load( url, function ( text ) {

					var object = scope.parse( text );

					object.traverse( function ( object ) {

						if ( object instanceof THREE.Mesh ) {

							if ( object.material.name ) {

								var material = materialsCreator.create( object.material.name );

								if ( material ) object.material = material;

							}

						}

					} );

					onLoad( object );

				}, onProgress, onError );

			}, onProgress, onError );

		},

		setCrossOrigin: function ( value ) {

			this.crossOrigin = value;

		},

		/**
		 * Parses loaded .obj file
		 * @param data - content of .obj file
		 * @param mtllibCallback - callback to handle mtllib declaration (optional)
		 * @return {THREE.Object3D} - Object3D (with default material)
		 */

		parse: function ( data, mtllibCallback ) {

			function vector( x, y, z ) {

				return new THREE.Vector3( x, y, z );

			}

			function uv( u, v ) {

				return new THREE.Vector2( u, v );

			}

			function face3( a, b, c, normals ) {

				return new THREE.Face3( a, b, c, normals );

			}

			var face_offset = 0;

			function meshN( meshName, materialName ) {

				if ( vertices.length > 0 ) {

					geometry.vertices = vertices;

					geometry.mergeVertices();
					geometry.computeFaceNormals();
					geometry.computeBoundingSphere();

					object.add( mesh );

					geometry = new THREE.Geometry();
					mesh = new THREE.Mesh( geometry, material );

				}

				if ( meshName !== undefined ) mesh.name = meshName;

				if ( materialName !== undefined ) {

					material = new THREE.MeshLambertMaterial();
					material.name = materialName;

					mesh.material = material;

				}

			}

			var group = new THREE.Group();
			var object = group;

			var geometry = new THREE.Geometry();
			var material = new THREE.MeshLambertMaterial();
			var mesh = new THREE.Mesh( geometry, material );

			var vertices = [];
			var normals = [];
			var uvs = [];

			function add_face( a, b, c, normals_inds ) {

				if ( normals_inds === undefined ) {

					geometry.faces.push( face3(
						parseInt( a ) - ( face_offset + 1 ),
						parseInt( b ) - ( face_offset + 1 ),
						parseInt( c ) - ( face_offset + 1 )
					) );

				} else {

					geometry.faces.push( face3(
						parseInt( a ) - ( face_offset + 1 ),
						parseInt( b ) - ( face_offset + 1 ),
						parseInt( c ) - ( face_offset + 1 ),
						[
							normals[ parseInt( normals_inds[ 0 ] ) - 1 ].clone(),
							normals[ parseInt( normals_inds[ 1 ] ) - 1 ].clone(),
							normals[ parseInt( normals_inds[ 2 ] ) - 1 ].clone()
						]
					) );

				}

			}

			function add_uvs( a, b, c ) {

				geometry.faceVertexUvs[ 0 ].push( [
					uvs[ parseInt( a ) - 1 ].clone(),
					uvs[ parseInt( b ) - 1 ].clone(),
					uvs[ parseInt( c ) - 1 ].clone()
				] );

			}

			function handle_face_line( faces, uvs, normals_inds ) {

				if ( faces[ 3 ] === undefined ) {

					add_face( faces[ 0 ], faces[ 1 ], faces[ 2 ], normals_inds );

					if ( ! ( uvs === undefined ) && uvs.length > 0 ) {

						add_uvs( uvs[ 0 ], uvs[ 1 ], uvs[ 2 ] );

					}

				} else {

					if ( ! ( normals_inds === undefined ) && normals_inds.length > 0 ) {

						add_face( faces[ 0 ], faces[ 1 ], faces[ 3 ], [ normals_inds[ 0 ], normals_inds[ 1 ], normals_inds[ 3 ] ] );
						add_face( faces[ 1 ], faces[ 2 ], faces[ 3 ], [ normals_inds[ 1 ], normals_inds[ 2 ], normals_inds[ 3 ] ] );

					} else {

						add_face( faces[ 0 ], faces[ 1 ], faces[ 3 ] );
						add_face( faces[ 1 ], faces[ 2 ], faces[ 3 ] );

					}

					if ( ! ( uvs === undefined ) && uvs.length > 0 ) {

						add_uvs( uvs[ 0 ], uvs[ 1 ], uvs[ 3 ] );
						add_uvs( uvs[ 1 ], uvs[ 2 ], uvs[ 3 ] );

					}

				}

			}


			// v float float float

			var vertex_pattern = /v( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)/;

			// vn float float float

			var normal_pattern = /vn( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)/;

			// vt float float

			var uv_pattern = /vt( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)/;

			// f vertex vertex vertex ...

			var face_pattern1 = /f( +\d+)( +\d+)( +\d+)( +\d+)?/;

			// f vertex/uv vertex/uv vertex/uv ...

			var face_pattern2 = /f( +(\d+)\/(\d+))( +(\d+)\/(\d+))( +(\d+)\/(\d+))( +(\d+)\/(\d+))?/;

			// f vertex/uv/normal vertex/uv/normal vertex/uv/normal ...

			var face_pattern3 = /f( +(\d+)\/(\d+)\/(\d+))( +(\d+)\/(\d+)\/(\d+))( +(\d+)\/(\d+)\/(\d+))( +(\d+)\/(\d+)\/(\d+))?/;

			// f vertex//normal vertex//normal vertex//normal ...

			var face_pattern4 = /f( +(\d+)\/\/(\d+))( +(\d+)\/\/(\d+))( +(\d+)\/\/(\d+))( +(\d+)\/\/(\d+))?/;

			//

			var lines = data.split( "\n" );

			for ( var i = 0; i < lines.length; i ++ ) {

				var line = lines[ i ];
				line = line.trim();

				var result;

				if ( line.length === 0 || line.charAt( 0 ) === '#' ) {

					continue;

				} else if ( ( result = vertex_pattern.exec( line ) ) !== null ) {

					// ["v 1.0 2.0 3.0", "1.0", "2.0", "3.0"]

					vertices.push( vector(
						parseFloat( result[ 1 ] ),
						parseFloat( result[ 2 ] ),
						parseFloat( result[ 3 ] )
					) );

				} else if ( ( result = normal_pattern.exec( line ) ) !== null ) {

					// ["vn 1.0 2.0 3.0", "1.0", "2.0", "3.0"]

					normals.push( vector(
						parseFloat( result[ 1 ] ),
						parseFloat( result[ 2 ] ),
						parseFloat( result[ 3 ] )
					) );

				} else if ( ( result = uv_pattern.exec( line ) ) !== null ) {

					// ["vt 0.1 0.2", "0.1", "0.2"]

					uvs.push( uv(
						parseFloat( result[ 1 ] ),
						parseFloat( result[ 2 ] )
					) );

				} else if ( ( result = face_pattern1.exec( line ) ) !== null ) {

					// ["f 1 2 3", "1", "2", "3", undefined]

					handle_face_line( [ result[ 1 ], result[ 2 ], result[ 3 ], result[ 4 ] ] );

				} else if ( ( result = face_pattern2.exec( line ) ) !== null ) {

					// ["f 1/1 2/2 3/3", " 1/1", "1", "1", " 2/2", "2", "2", " 3/3", "3", "3", undefined, undefined, undefined]

					handle_face_line(
						[ result[ 2 ], result[ 5 ], result[ 8 ], result[ 11 ] ], //faces
						[ result[ 3 ], result[ 6 ], result[ 9 ], result[ 12 ] ] //uv
					);

				} else if ( ( result = face_pattern3.exec( line ) ) !== null ) {

					// ["f 1/1/1 2/2/2 3/3/3", " 1/1/1", "1", "1", "1", " 2/2/2", "2", "2", "2", " 3/3/3", "3", "3", "3", undefined, undefined, undefined, undefined]

					handle_face_line(
						[ result[ 2 ], result[ 6 ], result[ 10 ], result[ 14 ] ], //faces
						[ result[ 3 ], result[ 7 ], result[ 11 ], result[ 15 ] ], //uv
						[ result[ 4 ], result[ 8 ], result[ 12 ], result[ 16 ] ] //normal
					);

				} else if ( ( result = face_pattern4.exec( line ) ) !== null ) {

					// ["f 1//1 2//2 3//3", " 1//1", "1", "1", " 2//2", "2", "2", " 3//3", "3", "3", undefined, undefined, undefined]

					handle_face_line(
						[ result[ 2 ], result[ 5 ], result[ 8 ], result[ 11 ] ], //faces
						[ ], //uv
						[ result[ 3 ], result[ 6 ], result[ 9 ], result[ 12 ] ] //normal
					);

				} else if ( /^o /.test( line ) ) {

					// object

					meshN();
					face_offset = face_offset + vertices.length;
					vertices = [];
					object = new THREE.Object3D();
					object.name = line.substring( 2 ).trim();
					group.add( object );

				} else if ( /^g /.test( line ) ) {

					// group

					meshN( line.substring( 2 ).trim(), undefined );

				} else if ( /^usemtl /.test( line ) ) {

					// material

					meshN( undefined, line.substring( 7 ).trim() );

				} else if ( /^mtllib /.test( line ) ) {

					// mtl file

					if ( mtllibCallback ) {

						var mtlfile = line.substring( 7 );
						mtlfile = mtlfile.trim();
						mtllibCallback( mtlfile );

					}

				} else if ( /^s /.test( line ) ) {

					// Smooth shading

				} else {

					console.log( "THREE.OBJMTLLoader: Unhandled line " + line );

				}

			}

			//Add last object
			meshN( undefined, undefined );

			return group;

		}

	};

	THREE.EventDispatcher.prototype.apply( THREE.OBJMTLLoader.prototype );


/***/ }
/******/ ]);