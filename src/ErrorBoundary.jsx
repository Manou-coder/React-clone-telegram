// import { ErrorBoundary } from 'react-error-boundary'

import React from 'react'

// function ErrorFallback({ error, resetErrorBoundary }) {
//   return (
//     <div role="alert">
//       <p>Something went wrong:</p>
//       <pre>{error.message}</pre>
//       <button onClick={resetErrorBoundary}>Try again</button>
//     </div>
//   )
// }

// const ui = (
//   <ErrorBoundary
//     FallbackComponent={ErrorFallback}
//     onReset={() => {
//       // reset the state of your app so the error doesn't happen again
//     }}
//   >
//     {/* <ComponentThatMayError /> */}
//   </ErrorBoundary>
// )

export class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo)
    // alert(
    //   'An error has occurred! \nPlease press OK to refresh the page. \nError code: \n\n' +
    //     JSON.stringify(errorInfo)
    // )
    // window.location.reload()
  }

  render() {
    return this.props.children
  }
}
