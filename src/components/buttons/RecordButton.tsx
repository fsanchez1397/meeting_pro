import { useState } from 'react'


const RecordButton = () => {
  const [count, setCount] = useState(0)

  return (
    <div onClick={() => setCount((count) => count + 1)}>{count}</div>
  )
}

export default RecordButton