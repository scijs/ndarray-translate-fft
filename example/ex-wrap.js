var baboon = require("luminance")(require('baboon-image'))
var translate = require("../translate.js")

translate.wrap(baboon, [100, 180])

require("save-pixels")(baboon, "png").pipe(process.stdout)