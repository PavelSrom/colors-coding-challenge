const { getColor } = require("./apiMock")

const availableColors = ["red", "green", "blue", "black", "white"]

// 'colorsInput' can be a single color, 'all' or colors separated by spaces
const validateColors = (colorsInput) => {
  let colors
  let error = false

  // if 'all' is provided, there's no error and return all colors
  if (colorsInput.toLowerCase() === "all")
    return { error, colors: availableColors }

  // colors separated by spaces => create an array from input
  if (colorsInput.includes(" ")) {
    colors = colorsInput.trim().split(" ")
  } else {
    colors = colorsInput
  }

  // if array (multiple colors), loop through and check against the ones we use
  if (Array.isArray(colors)) {
    for (const color of colors) {
      if (!availableColors.includes(color)) error = true
    }
  } else {
    // only single color - check if 'availableColors' has it
    error = !availableColors.includes(colors)
  }

  // return error and formatted color(s) back
  return { error, colors }
}

// self-explanatory
const validateColorFormat = (format) => ["all", "HEX", "RGB"].includes(format)
const validateSortFormat = (sort) => ["none", "asc", "desc"].includes(sort)
const validateSyncAsync = (syncChoice) => ["sync", "async"].includes(syncChoice)

const sortColors = (colors, sort) => {
  // if no sort provided, return colors as is
  if (sort === "none") return colors

  // if 'asc', sort from A-Z, otherwise sort from Z-A
  return colors.sort((a, b) =>
    sort === "asc" ? a.localeCompare(b) : b.localeCompare(a)
  )
}

const fetchColorAndFormat = async (color, format) => {
  // fetch color from api mock
  const targetColor = await getColor(color)
  // if no format or 'all', return the color as is
  if (!format || format === "all") return targetColor

  // otherwise return the corresponding format for the color
  return targetColor[format]
}

// self-explanatory
const endReadline = (rl) => {
  console.log("Oops! You inputted the wrong information :(")
  rl.close()
}

module.exports = {
  validateColors,
  validateColorFormat,
  validateSortFormat,
  validateSyncAsync,
  sortColors,
  fetchColorAndFormat,
  endReadline,
}
