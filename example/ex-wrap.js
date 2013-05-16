var lena = require("luminance")(require("lena"))
var translate = require("../translate.js")

translate.wrap(lena, [100, 180])

require("save-pixels")(lena, "png").pipe(process.stdout)