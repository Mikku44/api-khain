import { GoCheck } from "react-icons/go"
import { motion } from "framer-motion"

interface PricingCardProps {
  plan: {
    id: string
    name: string
    price: string
    limit: string
    features: string[]
    buttonText: string
    disabled?: boolean
  }
  onButtonClick: () => void
  isHighlighted?: boolean
}

export default function PricingCard({ plan, onButtonClick, isHighlighted = false }: PricingCardProps) {
  return (
    <motion.div
      layout
      whileHover={!plan.disabled ? { scale: 1.03 } : {}}
      whileTap={!plan.disabled ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`relative flex flex-col h-full rounded-xl border transition-all duration-300 ${
        isHighlighted
          ? "border-cyan-500 bg-gradient-to-b from-cyan-50/50 to-white shadow-lg shadow-cyan-500/10"
          : "border-gray-200 bg-white shadow-sm hover:shadow-md"
      } ${plan.disabled ? "opacity-60" : ""} overflow-hidden`}
    >
      {isHighlighted && (
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute top-0 right-0 bg-cyan-500 text-white px-3 py-1 text-xs font-semibold rounded-bl-lg"
        >
          Recommended
        </motion.div>
      )}

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{plan.name}</h3>

        <div className="mb-4 pt-2">
          <div className="flex items-baseline gap-1">
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-4xl font-bold text-gray-900"
            >
              {plan.price}
            </motion.span>
            <span className="text-sm text-gray-500">/month</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-6 leading-relaxed">{plan.limit}</p>

        <ul className="space-y-3 mb-6 flex-grow">
          {plan.features.map((feature, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="flex items-start gap-3"
            >
              <GoCheck size={18} className="text-cyan-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-700">{feature}</span>
            </motion.li>
          ))}
        </ul>

        <motion.button
          whileHover={!plan.disabled ? { scale: 1.03 } : {}}
          whileTap={!plan.disabled ? { scale: 0.97 } : {}}
          onClick={onButtonClick}
          disabled={plan.disabled}
          className={`w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
            plan.disabled
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : isHighlighted
                ? "bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg shadow-cyan-500/20"
                : "border border-gray-300 text-gray-900 hover:bg-gray-50 hover:border-gray-400"
          }`}
        >
          {plan.disabled ? "Current Plan" : plan.buttonText}
        </motion.button>
      </div>
    </motion.div>
  )
}
