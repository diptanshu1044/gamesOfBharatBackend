//Higher order functions
const asyncHandler = (requestHandler) => async(req, res, next) => {
  try {
    return await requestHandler(req, res, next)
  } catch(err) {
    res.status(err.status).json({
      success: false,
      message: err.message,
    })
  }
}

// const asyncHandler = (requestHandler) => {
//   const newFn = async (req, res, next) => {
//     try {
//       await requestHandler(req, res, next)
//     } catch (err) {
//       res.status(err.status).json({
//         success: false,
//         message: err.message,
//       })
//     }
//   }

//   return newFn
// }

export { asyncHandler };