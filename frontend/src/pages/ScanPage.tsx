import { useState, useRef } from 'react'
import { scanApi, mealsApi } from '../api/services'
import { Camera, Upload, Loader2, CheckCircle2, XCircle, Plus, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ScanPage() {
  const [preview, setPreview] = useState<string | null>(null)
  const [base64, setBase64] = useState<string | null>(null)
  const [mimeType, setMimeType] = useState('image/jpeg')
  const [result, setResult] = useState<any>(null)
  const [scanning, setScanning] = useState(false)
  const [logging, setLogging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const camRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    setMimeType(file.type || 'image/jpeg')
    const reader = new FileReader()
    reader.onload = ev => {
      const dataUrl = ev.target?.result as string
      setPreview(dataUrl)
      // Strip the data:...;base64, prefix
      setBase64(dataUrl.split(',')[1])
      setResult(null)
    }
    reader.readAsDataURL(file)
  }

  const scan = async () => {
    if (!base64) return
    setScanning(true)
    try {
      const { data } = await scanApi.scan(base64, mimeType)
      setResult(data)
      if (data.matched) toast.success(`Matched: ${data.foodName}`)
      else toast('No match found — try a clearer food image')
    } catch {
      toast.error('Scan failed. Check your connection or API status.')
    } finally {
      setScanning(false)
    }
  }

  const logToMeal = async () => {
    if (!result?.foodId) return
    setLogging(true)
    try {
      await mealsApi.logMeal({
        mealType: 'SNACK',
        date: new Date().toISOString().split('T')[0],
        items: [{ foodId: result.foodId, quantityGrams: 100 }],
      })
      toast.success("Added 100g to today's meals!")
    } catch {
      toast.error('Failed to log meal')
    } finally {
      setLogging(false)
    }
  }

  const reset = () => {
    setPreview(null)
    setBase64(null)
    setResult(null)
  }

  return (
    <div className="max-w-xl mx-auto space-y-8 pb-10">
      {/* Header */}
      <div className="pb-5 border-b border-[#EDE8E3]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-[20px] bg-[#FFEBEA] border border-[#FFD7D4] flex items-center justify-center text-[#292524] shadow-sm">
            <Camera className="w-6 h-6 text-[#FF8577]" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[10px] tracking-widest text-[#292524] bg-[#FFEBEA] border border-[#FFD7D4] px-2.5 py-0.5 rounded-full uppercase font-bold">
                [ 05 // COMPUTER VISION ]
              </span>
              <span className="font-serif italic text-sm text-[#78716C]">
                instant recognition · optical telemetry
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-light text-[#292524] tracking-tight">
              Scan <em className="italic font-normal text-[#FF8577]">food plate</em>
            </h1>
            <p className="text-sm text-[#78716C] mt-1 font-sans">
              Photograph or upload an image to identify the dish and retrieve its nutritional values.
            </p>
          </div>
        </div>
      </div>

      {/* Upload area */}
      {!preview ? (
        <div className="card rounded-[24px] border-2 border-dashed border-[#EDE8E3] bg-white text-center py-14 px-6 hover:border-[#FFB7B2] transition-colors shadow-sm">
          <div className="w-16 h-16 rounded-[20px] bg-[#FFEBEA] border border-[#FFD7D4] flex items-center justify-center text-[#292524] mx-auto mb-4 shadow-sm">
            <Camera className="w-8 h-8 text-[#FF8577]" />
          </div>
          <h2 className="text-2xl font-serif font-light text-[#292524] tracking-tight">
            Capture or upload plate
          </h2>
          <p className="text-xs text-[#78716C] mt-1.5 mb-6 max-w-sm mx-auto leading-relaxed font-sans">
            Snap a clear picture of your meal plate or select an image to parse with Vision AI.
          </p>

          <div className="flex gap-3 justify-center flex-wrap">
            <button
              type="button"
              onClick={() => camRef.current?.click()}
              className="btn-primary group">
              <Camera className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Use Camera</span>
            </button>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="btn-secondary group">
              <Upload className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
              <span>Upload Image</span>
            </button>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <input
            ref={camRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
          />

          <p className="text-[11px] font-mono text-[#78716C] mt-6">
            [ POWERED BY CLOUD VISION API · OPTIMAL WITH WELL-LIT DISHES ]
          </p>
        </div>
      ) : (
        <div className="card rounded-[24px] space-y-4 p-6 shadow-sm bg-white border border-[#EDE8E3]">
          <div className="relative rounded-[20px] overflow-hidden border border-[#EDE8E3] max-h-72 bg-[#F7F6F2] shadow-sm">
            <img
              src={preview}
              alt="Food preview"
              className="w-full h-full max-h-72 object-cover"
              style={{ imageRendering: '-webkit-optimize-contrast' }}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={scan}
              disabled={scanning}
              className="btn-primary flex-1 py-3.5 group">
              {scanning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Identifying dish…</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  <span>Identify Food</span>
                </>
              )}
            </button>
            <button type="button" onClick={reset} className="btn-secondary">
              Change Image
            </button>
          </div>
        </div>
      )}

      {/* Result Card */}
      {result && (
        <div className={`card rounded-[24px] p-6 border-2 ${result.matched ? 'border-[#FFB7B2]' : 'border-[#EDE8E3]'} space-y-4 shadow-sm bg-white`}>
          <div className="flex items-start gap-3">
            {result.matched ? (
              <CheckCircle2 className="w-6 h-6 text-[#A3C4A2] flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <h3 className="font-serif text-2xl font-light text-[#292524] tracking-tight">
                {result.matched ? result.foodName : 'No match found'}
              </h3>
              <p className="text-xs text-[#78716C] mt-0.5 leading-relaxed font-sans">{result.message}</p>
            </div>
          </div>

          {/* Detected labels */}
          {result.detectedLabels?.length > 0 && (
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#78716C] mb-1.5 font-bold">
                Vision Labels Detected:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {result.detectedLabels.map((l: string) => (
                  <span key={l} className="bg-[#F7F6F2] border border-[#EDE8E3] text-[10px] font-mono text-[#292524] px-2.5 py-0.5 rounded-full font-medium">
                    {l.toLowerCase()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Nutrition Information */}
          {result.matched && result.nutrition && (
            <div className="space-y-4 pt-3 border-t border-[#EDE8E3]">
              <div className="p-4 bg-[#F7F6F2] border border-[#EDE8E3] rounded-2xl space-y-2.5">
                <p className="font-mono text-[10px] uppercase tracking-wider text-[#78716C] font-bold">
                  Nutritional Value (per 100g)
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Calories', val: result.nutrition.calories, unit: 'kcal', highlight: true },
                    { label: 'Protein', val: result.nutrition.protein, unit: 'g', highlight: false },
                    { label: 'Carbs', val: result.nutrition.carbs, unit: 'g', highlight: false },
                    { label: 'Fat', val: result.nutrition.fat, unit: 'g', highlight: false },
                    { label: 'Fibre', val: result.nutrition.fibre, unit: 'g', highlight: false },
                    { label: 'Sodium', val: result.nutrition.sodium, unit: 'mg', highlight: false },
                  ].map(({ label, val, unit, highlight }) => (
                    <div key={label} className="bg-white p-2.5 rounded-xl border border-[#EDE8E3] text-center shadow-sm">
                      <p className={`text-base font-mono font-bold ${highlight ? 'text-[#FF8577]' : 'text-[#292524]'}`}>
                        {val?.toFixed(1) ?? '—'}
                      </p>
                      <p className="font-mono text-[10px] text-[#78716C] uppercase mt-0.5">
                        {label} ({unit})
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decorator Tags */}
              {result.tags?.length > 0 && (
                <div className="flex gap-1.5 flex-wrap">
                  {result.tags.map((t: string) => (
                    <span key={t} className="bg-[#EFEDF4] border border-[#DFDAE8] text-[10px] font-mono text-[#292524] px-2.5 py-0.5 rounded-full font-medium">
                      {t.replace('_', ' ').toLowerCase()}
                    </span>
                  ))}
                </div>
              )}

              {/* PM POSHAN Badge */}
              {result.isPoshanMeal && (
                <div className="p-3 bg-[#FFEBEA] border border-[#FFD7D4] rounded-2xl text-xs text-[#292524] font-mono font-bold">
                  PM POSHAN Mid-Day Meal · {result.poshanState}
                </div>
              )}

              <button
                type="button"
                onClick={logToMeal}
                disabled={logging}
                className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 group">
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                <span>{logging ? 'adding to meals…' : "add 100g to today's meals"}</span>
              </button>
            </div>
          )}
        </div>
      )}

      <p className="font-mono text-[11px] text-[#78716C] text-center leading-relaxed">
        [ NUTRITION VALUES APPROXIMATE FROM ICMR GUIDELINES · NOT CLINICAL ADVICE ]
      </p>
    </div>
  )
}
