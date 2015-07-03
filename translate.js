"use strict"

var ndarray = require("ndarray")
var fft = require("ndarray-fft")
var ops = require("ndarray-ops")
var cwise = require("cwise")
var pool = require("typedarray-pool")
var nextPow2 = require("next-pow-2")

var do_translate = cwise({
  args: [ "array", "array", "scalar", "index", "shape"],
  pre: function(x, y, t, idx, shape) {
    this.d = shape.length
    this.cos = Math.cos
    this.sin = Math.sin
    this.weights = new Array(shape.length)
    for(var i=0; i<shape.length; ++i) {
      this.weights[i] = 2.0 * Math.PI * t[i] / shape[i]
    }
  },
  body: function(x, y, t, idx, shape) {
    var a = x, b = y, k1, k2, k3
    for(var i=0; i<this.d; ++i) {
      var p = this.weights[i] * (2*idx[i]<shape[i] ? idx[i] : idx[i]-shape[i])
      var c = this.cos(p)
      var s = 2*idx[i] == shape[i] ? 0 : this.sin(p)
      k1 = a * (c + s)
      k2 = c * (b - a)
      k3 = s * (a + b)
      a = k1 - k3
      b = k1 + k2
    }
    x = a
    y = b
  }
})

function translatePeriodicBC(arr, t) {
  var s = arr.size
  var y_t = pool.mallocDouble(s)
    , y = ndarray(y_t,
            arr.shape.slice(0)/*,
            ndarray.stride(arr.shape, arr.order),
            0*/)
  ops.assigns(y, 0.0)
  fft(1, arr, y)
  do_translate(arr, y, t)
  fft(-1, arr, y)
  pool.freeDouble(y_t)
  return arr
}

function translateZeroBC(arr, t) {
  var d = arr.shape.length
    , nshape = new Array(d)
    , i, sz = 1
  for(i=0; i<d; ++i) {
    nshape[i] = nextPow2(2 * arr.shape[i] - 1)
    if(Math.abs(t[i]) >= arr.shape[i]) {
      ops.assigns(arr, 0.0)
      return
    }
    sz *= nshape[i]
  }
  /*var nstride = ndarray.stride(nshape, arr.order)*/
  var x_t = pool.mallocDouble(sz)
    , x = ndarray(x_t, nshape/*, nstride, 0*/)
    , xh = x.hi.apply(x, arr.shape)
  ops.assigns(x, 0)
  ops.assign(xh, arr)
  var y_t = pool.mallocDouble(sz)
    , y = ndarray(y_t, nshape/*, nstride, 0*/)
  ops.assigns(y, 0)
  fft(1, x, y)
  do_translate(x, y, t)
  fft(-1, x, y)
  ops.assign(arr, xh)
  pool.freeDouble(x_t)
  pool.freeDouble(y_t)
  return arr
}

module.exports = translateZeroBC
module.exports.wrap = translatePeriodicBC