# aframe-obj-loader-component

A-Frame VR loader component for .OBJ models and .MTL materials.

## Usage

Install.

```bash
$ npm install aframe-obj-loader-component
```

Register.

```js
AFrame = require('aframe-core');
AFrame.registerComponent('obj-loader', require('aframe-obj-loader-component'));
```

Use.

```html
<a-entity position="0 0 -20"
          obj-mtl-loader="src: url(../../models/tree2.obj);
                          mtl: url(../../models/tree2.mtl);">
</a-entity>
```
