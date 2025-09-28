import React, { useState } from 'react'
import { parse, makePlan, Plan, Command } from '@/services/ai/agent'
import PlanPreview from './PlanPreview'
import { AiOutlineRobot, AiOutlineSend, AiOutlineLoading3Quarters } from 'react-icons/ai'

interface CommandBoxProps {
  onCommandParsed?: (command: Command) => void
  onPlanGenerated?: (plan: Plan) => void
}

export default function CommandBox({ onCommandParsed, onPlanGenerated }: CommandBoxProps) {
  const [text, setText] = useState("ALGO'larımı faize bağla, riski %5'i aşma")
  const [plan, setPlan] = useState<Plan | null>(null)
  const [command, setCommand] = useState<Command | null>(null)
  const [loading, setLoading] = useState(false)

  const run = async () => {
    setLoading(true)
    try {
      const cmd = await parse(text)
      const p = await makePlan(cmd)
      setCommand(cmd)
      setPlan(p)

      // Callback'leri çağır
      onCommandParsed?.(cmd)
      onPlanGenerated?.(p)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 rounded-full" style={{ backgroundColor: '#08c2b4' }}>
          <AiOutlineRobot className="text-2xl text-white" />
        </div>
        <h3 className="text-2xl font-bold" style={{ color: '#08c2b4' }}>
          Alvion AI Asistan
        </h3>
      </div>

      <div className="space-y-4">
        <textarea
          className="w-full rounded-xl p-4 text-white resize-none transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{
            backgroundColor: '#404040',
            border: '2px solid #555555',
            focusRingColor: '#08c2b4',
          }}
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Türkçe olarak ne yapmak istediğinizi yazın..."
        />

        <button
          onClick={run}
          className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          style={{
            backgroundColor: '#f95001',
            color: 'white',
          }}
          disabled={loading || !text.trim()}
        >
          {loading ? <AiOutlineLoading3Quarters className="animate-spin text-xl" /> : <AiOutlineSend className="text-xl" />}
          <span>{loading ? 'İşleniyor...' : 'Komutu Çöz & Planla'}</span>
        </button>
      </div>

      {plan && <PlanPreview plan={plan} command={command} />}
    </div>
  )
}
