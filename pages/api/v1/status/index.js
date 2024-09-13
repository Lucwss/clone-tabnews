function status(request, response) {
  return response.status(200).json({
    message: "Testing tab news status não"
  })
}

export default status