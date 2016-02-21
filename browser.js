// Browser distribution of the A-Frame component.
(function (AFRAME) {
  if (!AFRAME) {
    console.error('Component attempted to register before AFRAME was available.');
    return;
  }
  (AFRAME.aframeCore || AFRAME).registerComponent('obj-loader', require('./obj-loader'));
})(window.AFRAME);
