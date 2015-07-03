"use strict"

var translate = require("../translate.js")
var ndarray = require("ndarray")
var fuzz = require("test-fuzzy-array")

require("tape")("ndarray-translate-fft", function(t) {
  var almostEqual = fuzz(t, 0.000001)
  var array
  //var arrayZeroShift = [0.4938717375836403,1.9074040569032518,2.458709679994916,4.010970502471751,4.241666334081412,6.585575582427418] // This would be the result if we just convolved the input (assuming zero boundary conditions) with a sinc kernel
  var arrayZeroShift = [0.5622617330441272,1.8516537181033514,2.5028944426581954,3.9775711912180514,4.264837381599642,6.572251895018352] // Due to the use of a limited amount of padding, the solution is not perfect.
  var arrayWrapShift = [2.3206249714800427,1.2130636462824271,2.8681926909106736,3.740056987043559,4.429504459170568,6.428557245112723]
  var arrayWrapShift2 = [3.0879811422994856,1.4699471535495907,3.2970380688347927,4.851336899176905,3.23330291042701,5.060393825712213] // 2D test

  array = ndarray([1,2,3,4,5,6])
  almostEqual(translate(array, [0.3]).data, arrayZeroShift, "Zero padded, 1D")

  array = ndarray([1,2,3,4,5,6])
  almostEqual(translate.wrap(array, [0.3]).data, arrayWrapShift, "Wrapped, 1D")
  
  array = ndarray([1,2,3,4,5,6],[2,3])
  almostEqual(translate.wrap(array, [0.3,0.7]).data, arrayWrapShift2, "Wrapped, 2D")
  
  t.end()
})

