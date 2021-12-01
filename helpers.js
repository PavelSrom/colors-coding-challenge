const { getColor } = require("./apiMock")

const availableColors = ["red", "green", "blue", "black", "white"]

const validateColors = (colorsInput) => {
  let colors
  let error = false

  if (colorsInput.toLowerCase() === "all")
    return { error, colors: availableColors }

  if (colorsInput.includes(" ")) {
    colors = colorsInput.trim().split(" ")
  } else {
    colors = colorsInput
  }

  if (Array.isArray(colors)) {
    for (const color of colors) {
      if (!availableColors.includes(color)) error = true
    }
  } else {
    error = !availableColors.includes(colors)
  }

  return { error, colors }
}

const validateColorFormat = (format) => ["all", "HEX", "RGB"].includes(format)
const validateSortFormat = (sort) => ["none", "asc", "desc"].includes(sort)
const validateSyncAsync = (syncChoice) => ["sync", "async"].includes(syncChoice)

const sortColors = (colors, sort) => {
  if (sort === "none") return colors

  return colors.sort((a, b) =>
    sort === "asc" ? a.localeCompare(b) : b.localeCompare(a)
  )
}

const fetchColorAndFormat = async (color, format) => {
  const targetColor = await getColor(color)
  if (!format || format === "all") return targetColor

  return targetColor[format]
}

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
