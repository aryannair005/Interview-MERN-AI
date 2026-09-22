import React, { useState } from 'react'
import  {FaArrowLeft, FaCheckCircle} from "react-icons/fa"
import {useNavigate} from "react-router-dom"
import {motion} from "motion/react"

const Pricing = () => {
  const navigate = useNavigate()
  const [selectedPlan,setSelectedPlan] = useState("free")

  const plans = [
    {
      id:"free",
      name:"Free",
      price:"₹0",
      credits:100,
      description:"Perfect for beginners starting interview preparation.",
      features:[
        "100 AI Interview Credits",
        "Basic Performance Report",
        "Voice Interview Access",
        "Limited History Tracking",
      ],
      default:true,
    },
    {
      id:"basic",
      name:"Starter Pack",
      price:"₹100",
      credits:150,
      description:"Great for focused practice and skill improvement.",
      features:[
        "150 AI Interview Credits",
        "Detailed Feedback",
        "Performance Analytics",
        "Full Interview History",
      ],
    },
    {
      id:"pro",
      name:"Pro Pack",
      price:"₹500",
      credits:650,
      description:"Best value for serious job preparation.",
      features:[
        "650 AI Interview Credits",
        "Advanced AI Feedback",
        "Skill Trend Analysis",
        "Priority AI Processing",
      ],
      badge:"Best Value",
    }
  ]
  return (
    <div className='min-h-screen bg-linear-to-br from-gray-50 to-emerald-50 py-16 px-6'>
      <div className='max-w-6xl mx-auto mb-14 flex items-start gap-4'>
        <button onClick={()=>navigate("/")} className='mt-2 p-3 rounded-full bg-white shadow hover:shadow-md transition'><FaArrowLeft className='text-gray-600'/></button>

        <div className='text-center w-full'>
          <h1 className='text-4xl font-bold text-gray-800'>Choose Your Plan</h1>
          <p className='text-gray-500 mt-3 text-lg'>Flexible pricing to match your interview preparation goals.</p>
        </div>
      </div>

      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto'>
        {plans.map((plan)=>{
          const isSelected = selectedPlan === plan.id
          return (
            <motion.div key={plan.id}
            whileHover={!plan.default && {scale:1.03}}
            onClick={()=>!plan.default && setSelectedPlan(plan.id)}
            className={`relative rounded-3xl p-8 transition-all duration-300 border 
              ${
                isSelected? "border-emerald-600 shadow-2xl bg-white":"border-gray-200 bg-white shadow-md"
              }
              ${plan.default ? "cursor-default":"cursor-pointer"}
              `}
            >
              {/* Badge */}
              {plan.badge && (
                <div className='absolute top-6 right-6 bg-emerald-600 text-white text-xs px-4 py-1 rounded-full shadow'>{plan.badge}</div>
              )}
              {/* Default Tag */}
              {plan.default && (
                <div className='absolute top-6 right-6  bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full'>Default</div>
              )}
              {/* Plan Name */}
              <h3 className='text-xl font-semibold text-gray-800'>{plan.name}</h3>
              {/* Price */}
              <div className='mt-4'>
                <span className='text-3xl font-bold text-emerald-600'>{plan.price}</span>
                <p className='text-gray-500 mt-1'>{plan.credits} Credits</p>
              </div>
              {/* Description */}
              <p className='text-gray-500 mt-4 text-sm leading-relaxed'>{plan.description}</p>

              {/* Features */}
              <div className='mt-6 space-y-3 text-left'>
                {plan.features.map((features,i)=>{
                  <div key={i} className='flex items-center gap-3'>
                    <FaCheckCircle className='text-emerald-500 text-sm' />
                    <span className='text-gray-700 text-sm'>
                      {features}
                    </span>
                  </div>
                })}
              </div>

            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default Pricing
