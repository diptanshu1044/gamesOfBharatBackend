//Higher order functions
const asyncHandler = (requestHandler) => async (req, res, next) => {
  try {
    return await requestHandler(req, res, next);
  } catch (err) {
    const statusCode = err.statusCode || 500; 
    res.status(statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || [], // Include errors array if available
    });
  }
};


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