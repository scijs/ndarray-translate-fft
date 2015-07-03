ndarray-translate-fft
=====================
Translates an array using [sinc interpolation](http://en.wikipedia.org/wiki/Whittaker%E2%80%93Shannon_interpolation_formula).  For some things this makes sense, but for other signals this may not be what you want.  (For example, you can get bigger values or negative stuff in your signal using this method).  If you want to use bilinear interpolation, check out [ndarray-warp](https://github.com/mikolalysenko/ndarray-warp), or if all your coordinates are integers try [ndarray-translate](https://github.com/mikolalysenko/ndarray-translate) instead.

[![build status](https://secure.travis-ci.org/scijs/ndarray-translate-fft.png)](http://travis-ci.org/scijs/ndarray-translate-fft)

# Example
## Zero padded
Here is a simple example showing how to warp with 0-padding boundary conditions:

```javascript
var baboon = require("luminance")(require('baboon-image'))
var translate = require("../translate.js")

translate(baboon, [100, 180])

require("save-pixels")(baboon, "png").pipe(process.stdout)
```
### Output

<img src="https://raw.github.com/mikolalysenko/ndarray-translate-fft/master/example/zero.png"></img>

## Wrapped
ndarray-fft can also handle periodic boundary conditions by replacing the `translate` line with the following:

```javascript
var baboon = require("luminance")(require('baboon-image'))
var translate = require("../translate.js")

translate.wrap(baboon, [100, 180])

require("save-pixels")(baboon, "png").pipe(process.stdout)
```
### Output

<img src="https://raw.github.com/mikolalysenko/ndarray-translate-fft/master/example/wrap.png"></img>

# Install
Install using [npm](https://www.npmjs.com/):

    npm install ndarray-translate-fft
    
# API

```javascript
var translate = require("ndarray-translate-fft")
```

#### `translate(array, shift)`
Translates `array` by `shift` amount in place using sinc interpolation with 0-boundary conditions.

* `array` is an ndarray to translate (get mutated)
* `shift` is an array of numbers indicated the amount to shift by (can be a fractional number), should have the same length as `array.shape`

**Returns** `array`

**Note** that due to not using an infinite amount of padding (and/or using additional corrections), the zero-padded result might not be completely accurate (but since in this case you are shifting out data anyway...).

#### `translate.wrap(array, shift)`
Translates an array by `shift` amount in place using periodic boundary conditions.  This is exactly recoverable.

* `array` is the array to translate
* `shift` is the amount to shift by

**Returns** `array`


## Reasons to use `ndarray-translate-fft`:

* You want to translate by fractional amounts
* You want your translations to be exactly invertible
* You want to handle periodic boundary conditions

## Reasons NOT to use `ndarray-translate-fft`

* You are shifting with zero padding and integer vectors
* You are concerned about speed.

# License
(c) 2013 Mikola Lysenko. MIT License