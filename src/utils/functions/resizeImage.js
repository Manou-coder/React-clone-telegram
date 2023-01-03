import Resizer from 'react-image-file-resizer'

export const resizeFile = (file) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      10000,
      10000,
      'JPEG',
      80,
      0,
      (uri) => {
        console.log('uri', uri)
        resolve(uri)
      },
      'file'
    )
  })

// export const resizeFile = (file) =>
//   new Promise((resolve) =>
//     Resizer.imageFileResizer({
//       file: file,
//       quality: '0.1',
//       outputType: 'file',
//       responseUriFunc: (uri) => resolve(uri),
//     })
//   )
