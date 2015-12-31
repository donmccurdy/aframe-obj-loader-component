# A-Frame `obj-loader` Component

A-Frame VR loader component for .OBJ models and .MTL materials.

## Usage (global)

```html
<html>
	<head>
		<!-- ... -->
			<!-- A-Frame VR Library -->
			<script src="https://aframe.io/releases/latest/aframe.js"></script>

			<!-- Component -->
			<script src="dist/aframe-obj-loader-component.js"></script>
		<!-- ... -->
	</head>
	<body>
		<!-- ... -->
			<a-entity obj-loader="src: url(./tree.obj);
			                      mtl: url(./tree.mtl);">
			</a-entity>
		<!-- ... -->
	</body>
</html>
```

## Usage (npm)

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

## Properties

Property | Required | Description
---------|----------|------------
src      | Yes      | URL for 3D .OBJ model asset.
mtl      | No       | URL for .MTL material library asset.
