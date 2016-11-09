module.exports = function preventDND(window) {
  window.addEventListener("dragover",function(e){
    e = e || event;
    e.preventDefault();
  },false);
  window.addEventListener("drop",function(e){
    e = e || event;
    e.preventDefault();
  },false);
};
