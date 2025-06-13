import { useRef, useState, useEffect } from 'react'

const PaintWindow = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [brushSize, setBrushSize] = useState(2)
  const [brushColor, setBrushColor] = useState('#000000')
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 })

  // 컨텍스트 메뉴 방지
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Initialize canvas
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }, [])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setIsDrawing(true)
    setLastPosition({ x, y })
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.strokeStyle = brushColor
    ctx.lineWidth = brushSize
    ctx.beginPath()
    ctx.moveTo(lastPosition.x, lastPosition.y)
    ctx.lineTo(x, y)
    ctx.stroke()

    setLastPosition({ x, y })
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }} onContextMenu={handleContextMenu}>
      <div style={{ 
        padding: '10px', 
        borderBottom: '1px solid #ccc',
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <label>
          브러시 크기:
          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            style={{ marginLeft: '5px' }}
          />
          <span style={{ marginLeft: '5px' }}>{brushSize}px</span>
        </label>
        
        <label>
          색상:
          <input
            type="color"
            value={brushColor}
            onChange={(e) => setBrushColor(e.target.value)}
            style={{ marginLeft: '5px', width: '30px', height: '25px' }}
          />
        </label>
        
        <button onClick={clearCanvas} style={{ padding: '5px 10px' }}>
          지우기
        </button>
      </div>
      
      <div style={{ flex: 1, padding: '10px', overflow: 'hidden' }}>
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onContextMenu={handleContextMenu}
          style={{
            border: '1px solid #ccc',
            cursor: 'crosshair',
            maxWidth: '100%',
            maxHeight: '100%'
          }}
        />
      </div>
    </div>
  )
}

export default PaintWindow 