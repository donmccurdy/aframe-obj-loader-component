# aframe-obj-loader-component

A-Frame VR loader component for .OBJ models and .MTL materials.

## Usage

Install.

```bash
$ npm install aframe-obj-loader-component
```

Register.

```js
AFRAME = require('aframe-core');
AFRAME.registerComponent('obj-loader', require('aframe-obj-loader-component'));
```

Use.

```html
<a-entity obj-loader="src: url(./tree.obj);
                      mtl: url(./tree.mtl);">
</a-entity>
```
